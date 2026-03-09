/**
 * Monitor Legislativo Conservador — Agente IA Feeder
 * Roda via GitHub Actions CRON todo dia às 8h BRT
 *
 * Fluxo:
 * 1. Busca PLs do dia na API da Câmara
 * 2. Busca votações do dia na API da Câmara
 * 3. Analisa cada PL com Claude Haiku (score -10/+10 + resumo)
 * 4. Salva no Supabase
 * 5. Trigger automático recalcula scores dos deputados
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

// ─── Config ──────────────────────────────────────────────────
const CAMARA_API = 'https://dadosabertos.camara.leg.br/api/v2'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY })

// ─── Tipos ───────────────────────────────────────────────────
interface CamaraProposicao {
  id: number
  siglaTipo: string
  numero: string
  ano: number
  ementa: string
  statusProposicao?: { descricaoSituacao: string }
}

interface CamaraVotacao {
  id: string
  proposicao_: { id: number; siglaTipo: string; numero: string; ano: number }
  dataHoraInicio: string
}

interface VotoDeputado {
  deputado_: { id: number; nome: string; siglaPartido: string; siglaUf: string }
  tipoVoto: string
}

interface AnaliseIA {
  score: number
  resumo: string
  categoria: 'imposto' | 'familia' | 'liberdade' | 'outro'
}

// ─── Helpers ─────────────────────────────────────────────────
function getDataBrasil(): string {
  const hoje = new Date()
  // Subtrai 1 dia para garantir que votações do dia anterior estejam disponíveis
  hoje.setDate(hoje.getDate() - 1)
  return hoje.toISOString().split('T')[0]
}

async function fetchCamara<T>(endpoint: string): Promise<T[]> {
  const url = `${CAMARA_API}${endpoint}`
  console.log(`📡 GET ${url}`)

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    console.warn(`⚠️  API Câmara retornou ${response.status} para ${endpoint}`)
    return []
  }

  const data = await response.json()
  return data.dados ?? []
}

// ─── Análise com Claude Haiku ─────────────────────────────────
async function analisarPLcomIA(pl: CamaraProposicao): Promise<AnaliseIA> {
  const prompt = `Você é um analista político conservador brasileiro. Analise este Projeto de Lei:

Número: ${pl.siglaTipo} ${pl.numero}/${pl.ano}
Ementa: ${pl.ementa}

Responda APENAS com JSON válido, sem markdown, no formato:
{
  "score": <número de -10 a 10>,
  "resumo": "<2 linhas máximo, foco no impacto para o cidadão>",
  "categoria": "<'imposto' | 'familia' | 'liberdade' | 'outro'>"
}

Critérios de pontuação:
- Score POSITIVO (+1 a +10): reduz impostos, protege família, amplia liberdades individuais, defesa nacional, segurança pública, livre mercado
- Score NEGATIVO (-1 a -10): aumenta impostos, restringe liberdades, ideologia de gênero, estatismo, socialismo, aborto, drogas
- Score 0: neutro ou ambíguo

Seja direto e objetivo. O resumo deve ser no máximo 2 frases curtas.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    })

    const texto = message.content[0].type === 'text' ? message.content[0].text : ''
    const analise = JSON.parse(texto) as AnaliseIA

    // Garante que score está no range
    analise.score = Math.max(-10, Math.min(10, analise.score))
    return analise
  } catch (err) {
    console.error(`❌ Erro ao analisar PL ${pl.numero}:`, err)
    return { score: 0, resumo: 'Análise indisponível no momento.', categoria: 'outro' }
  }
}

// ─── Sincronizar deputados (seed inicial se necessário) ───────
async function sincronizarDeputados(): Promise<void> {
  const { count } = await supabase
    .from('politicians')
    .select('*', { count: 'exact', head: true })

  if ((count ?? 0) > 0) {
    console.log(`✅ ${count} deputados já no banco. Pulando seed.`)
    return
  }

  console.log('🌱 Fazendo seed inicial dos 513 deputados...')
  let pagina = 1
  let total = 0

  while (true) {
    const deputados = await fetchCamara<{
      id: number; nome: string; siglaPartido: string; siglaUf: string; urlFoto: string
    }>(`/deputados?itens=100&pagina=${pagina}&ordem=ASC&ordenarPor=nome`)

    if (deputados.length === 0) break

    const rows = deputados.map(d => ({
      id: d.id,
      nome: d.nome,
      partido: d.siglaPartido,
      estado: d.siglaUf,
      foto_url: d.urlFoto,
      score_atual: 0,
    }))

    const { error } = await supabase.from('politicians').upsert(rows, { onConflict: 'id' })
    if (error) console.error('Erro upsert deputados:', error)

    total += deputados.length
    pagina++

    if (deputados.length < 100) break
  }

  console.log(`✅ ${total} deputados inseridos.`)
}

// ─── Processar PLs do dia ─────────────────────────────────────
async function processarPLsDoDia(data: string): Promise<Map<number, boolean>> {
  const analisados = new Map<number, boolean>()

  const proposicoes = await fetchCamara<CamaraProposicao>(
    `/proposicoes?dataApresentacaoInicio=${data}&dataApresentacaoFim=${data}&itens=50&ordem=DESC&ordenarPor=id`
  )

  if (proposicoes.length === 0) {
    console.log('📭 Nenhuma proposição nova hoje.')
    return analisados
  }

  console.log(`📜 Analisando ${proposicoes.length} PLs com IA...`)

  for (const pl of proposicoes) {
    // Verifica se já foi analisado
    const { data: existente } = await supabase
      .from('bills')
      .select('id')
      .eq('id', pl.id)
      .single()

    if (existente) {
      analisados.set(pl.id, true)
      continue
    }

    const analise = await analisarPLcomIA(pl)

    const { error } = await supabase.from('bills').upsert({
      id: pl.id,
      numero: `${pl.siglaTipo} ${pl.numero}/${pl.ano}`,
      ano: pl.ano,
      ementa_oficial: pl.ementa,
      resumo_ia: analise.resumo,
      score_ia: analise.score,
      categoria: analise.categoria,
    }, { onConflict: 'id' })

    if (error) {
      console.error(`❌ Erro salvando PL ${pl.id}:`, error)
    } else {
      console.log(`  ✅ PL ${pl.numero}/${pl.ano} → score ${analise.score} [${analise.categoria}]`)
      analisados.set(pl.id, true)
    }

    // Rate limit gentil
    await new Promise(r => setTimeout(r, 300))
  }

  return analisados
}

// ─── Processar Votações do dia ────────────────────────────────
async function processarVotacoesDoDia(data: string): Promise<void> {
  const votacoes = await fetchCamara<CamaraVotacao>(
    `/votacoes?dataInicio=${data}&dataFim=${data}&itens=50`
  )

  if (votacoes.length === 0) {
    console.log('🗳️  Nenhuma votação hoje.')
    return
  }

  console.log(`🗳️  Processando ${votacoes.length} votações...`)

  for (const votacao of votacoes) {
    const plId = votacao.proposicao_?.id
    if (!plId) continue

    // Verifica se o PL está no banco
    const { data: bill } = await supabase
      .from('bills')
      .select('id')
      .eq('id', plId)
      .single()

    if (!bill) continue // PL sem análise, pula

    // Busca como cada deputado votou
    const votos = await fetchCamara<VotoDeputado>(`/votacoes/${votacao.id}/votos`)

    const rows = votos
      .filter(v => v.deputado_?.id && v.tipoVoto)
      .map(v => ({
        politician_id: v.deputado_.id,
        bill_id: plId,
        voto_apresentado: v.tipoVoto,
        data_votacao: data,
      }))

    if (rows.length === 0) continue

    const { error } = await supabase
      .from('votes')
      .upsert(rows, { onConflict: 'politician_id,bill_id', ignoreDuplicates: true })

    if (error) {
      console.error(`❌ Erro salvando votos da votação ${votacao.id}:`, error)
    } else {
      console.log(`  ✅ ${rows.length} votos registrados para votação ${votacao.id}`)
    }

    await new Promise(r => setTimeout(r, 200))
  }
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  const data = getDataBrasil()
  console.log(`\n🦅 Monitor Legislativo Conservador — Feeder IA`)
  console.log(`📅 Processando data: ${data}`)
  console.log('─'.repeat(50))

  try {
    // 1. Garante que os deputados estão no banco
    await sincronizarDeputados()

    // 2. Analisa PLs do dia
    await processarPLsDoDia(data)

    // 3. Processa votações (trigger SQL recalcula scores automaticamente)
    await processarVotacoesDoDia(data)

    console.log('\n✅ Feeder concluído com sucesso!')
    console.log('🔄 Scores recalculados pelo trigger do banco de dados.')
  } catch (err) {
    console.error('\n❌ Erro crítico no feeder:', err)
    process.exit(1)
  }
}

main()
