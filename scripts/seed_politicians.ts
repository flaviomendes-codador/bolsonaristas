/**
 * Tarefa 1: Popular o banco com os 513 deputados
 *
 * Este script busca os deputados da API pública da Câmara
 * e insere no Supabase. Não precisa de chave de IA.
 *
 * Execute APÓS configurar o Supabase real no .env.local:
 *   bun run scripts/seed_politicians.ts
 *
 * Ou com Node:
 *   npx tsx scripts/seed_politicians.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const CAMARA_API = 'https://dadosabertos.camara.leg.br/api/v2'

// Valida configuração antes de rodar
if (!SUPABASE_URL || SUPABASE_URL.includes('placeholder')) {
  console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL no .env.local com a URL real do Supabase')
  console.error('   Crie seu projeto em: https://supabase.com')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface DeputadoAPI {
  id: number
  nome: string
  siglaPartido: string
  siglaUf: string
  urlFoto: string
  email: string
}

async function fetchDeputados(pagina: number): Promise<DeputadoAPI[]> {
  const url = `${CAMARA_API}/deputados?itens=100&pagina=${pagina}&ordem=ASC&ordenarPor=nome`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) return []
  const data = await res.json()
  return data.dados ?? []
}

async function main() {
  console.log('\n🌱 SEED: Importando deputados da API da Câmara...')
  console.log('📡 Fonte: dadosabertos.camara.leg.br')
  console.log('─'.repeat(50))

  // Verifica se já tem dados
  const { count } = await supabase
    .from('politicians')
    .select('*', { count: 'exact', head: true })

  if ((count ?? 0) > 400) {
    console.log(`✅ Banco já tem ${count} deputados. Seed desnecessário.`)
    console.log('   Use --force para reimportar.')
    if (!process.argv.includes('--force')) process.exit(0)
  }

  let pagina = 1
  let totalInseridos = 0
  const stats: Record<string, number> = {}

  while (true) {
    process.stdout.write(`📄 Buscando página ${pagina}... `)
    const deputados = await fetchDeputados(pagina)

    if (deputados.length === 0) break

    const rows = deputados.map(d => ({
      id: d.id,
      nome: d.nome,
      partido: d.siglaPartido ?? 'SEM PARTIDO',
      estado: d.siglaUf ?? 'BR',
      foto_url: d.urlFoto ?? '',
      score_atual: 0,
      total_votos: 0,
      votos_favor: 0,
      votos_contra: 0,
    }))

    const { error, count: inserted } = await supabase
      .from('politicians')
      .upsert(rows, { onConflict: 'id' })
      .select('id', { count: 'exact' })

    if (error) {
      console.error(`\n❌ Erro na página ${pagina}:`, error.message)
      break
    }

    // Contagem por partido
    deputados.forEach(d => {
      const partido = d.siglaPartido ?? 'SEM PARTIDO'
      stats[partido] = (stats[partido] ?? 0) + 1
    })

    totalInseridos += deputados.length
    console.log(`✅ ${deputados.length} inseridos`)

    if (deputados.length < 100) break
    pagina++

    // Pausa entre páginas
    await new Promise(r => setTimeout(r, 300))
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ SEED COMPLETO: ${totalInseridos} deputados importados`)
  console.log('\n📊 Por partido (top 10):')

  Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([partido, qtd]) => {
      console.log(`   ${partido.padEnd(12)} ${qtd} deputados`)
    })

  console.log('\n🚀 Próximo passo: rode o feeder IA para popular os scores')
  console.log('   bun run scripts/ai_feeder.ts')
}

main().catch(err => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
