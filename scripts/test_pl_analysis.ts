/**
 * Tarefa 2: Teste do prompt conservador com 5 PLs conhecidos
 * Execute: bun run scripts/test_pl_analysis.ts
 *
 * Valida se a IA classifica corretamente PLs conservadores e progressistas
 */

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// 5 PLs conhecidos para validação do prompt conservador
const PLS_TESTE = [
  {
    id: 1,
    numero: 'PL 2630/2020',
    ementa: 'Institui a Lei Brasileira de Liberdade, Responsabilidade e Transparência na Internet (PL das Fake News). Cria obrigações para plataformas digitais, exige rastreabilidade de mensagens em massa e pode implicar censura de conteúdo.',
    expectativa: 'NEGATIVO (-5 a -10)',
    motivo: 'Restrição de liberdade de expressão, potencial censura',
  },
  {
    id: 2,
    numero: 'PLP 68/2024',
    ementa: 'Regulamenta a Reforma Tributária. Cria o Imposto sobre Bens e Serviços (IBS) e a Contribuição Social sobre Bens e Serviços (CBS), substituindo PIS, COFINS, IPI, ICMS e ISS. Prevê aumento da carga tributária sobre determinados setores.',
    expectativa: 'NEUTRO A NEGATIVO (-2 a -6)',
    motivo: 'Reforma tributária — visão conservadora é cética sobre aumentos de imposto',
  },
  {
    id: 3,
    numero: 'PL 1904/2024',
    ementa: 'Equipara o aborto após 22 semanas de gestação, mesmo em casos de estupro, ao crime de homicídio simples. Fortalece a proteção legal à vida do nascituro.',
    expectativa: 'POSITIVO (+7 a +10)',
    motivo: 'Proteção da vida, valores cristãos conservadores',
  },
  {
    id: 4,
    numero: 'PL 1847/2015',
    ementa: 'Institui o Estatuto das Famílias do Século XXI. Reconhece formalmente uniões homoafetivas e outras configurações familiares, ampliando o conceito de família para além do modelo tradicional.',
    expectativa: 'NEGATIVO (-7 a -10)',
    motivo: 'Contra valores tradicionais de família',
  },
  {
    id: 5,
    numero: 'PL 6125/2023',
    ementa: 'Reduz a alíquota do Imposto de Renda para pessoas físicas que ganham até R$5.000 por mês, isentando trabalhadores de menor renda. Compensação prevista com aumento de IR para rendas acima de R$50.000.',
    expectativa: 'MISTO (+2 a -3)',
    motivo: 'Redução de imposto é positiva mas há aumento para outro grupo',
  },
]

async function analisarPL(pl: (typeof PLS_TESTE)[0]): Promise<{
  score: number
  resumo: string
  categoria: string
}> {
  const prompt = `Você é um analista político conservador brasileiro. Analise este Projeto de Lei:

Número: ${pl.numero}
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
- Score 0: neutro ou ambíguo`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  })

  const texto = message.content[0].type === 'text' ? message.content[0].text : '{}'
  return JSON.parse(texto)
}

async function main() {
  console.log('\n🦅 TESTE DO PROMPT CONSERVADOR — 5 PLs Conhecidos')
  console.log('='.repeat(60))

  let acertos = 0
  const resultados = []

  for (const pl of PLS_TESTE) {
    process.stdout.write(`\n📜 ${pl.numero}... `)

    const analise = await analisarPL(pl)
    const scoreStr = analise.score > 0 ? `+${analise.score}` : `${analise.score}`

    // Verifica se a IA acertou a direção esperada
    const acertouDirecao =
      (pl.expectativa.includes('POSITIVO') && analise.score > 0) ||
      (pl.expectativa.includes('NEGATIVO') && analise.score < 0) ||
      (pl.expectativa.includes('MISTO') && Math.abs(analise.score) <= 4)

    if (acertouDirecao) acertos++

    const icone = acertouDirecao ? '✅' : '❌'

    console.log(`${icone} Score: ${scoreStr} [${analise.categoria}]`)
    console.log(`   Esperado: ${pl.expectativa}`)
    console.log(`   Motivo: ${pl.motivo}`)
    console.log(`   IA diz: "${analise.resumo}"`)

    resultados.push({ pl: pl.numero, score: analise.score, acertou: acertouDirecao, analise })

    // Rate limit
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n' + '='.repeat(60))
  console.log(`📊 RESULTADO: ${acertos}/${PLS_TESTE.length} classificações corretas`)

  if (acertos >= 4) {
    console.log('✅ APROVADO — Prompt conservador está bem calibrado!')
  } else if (acertos >= 3) {
    console.log('⚠️  ATENÇÃO — Calibração aceitável mas pode melhorar')
  } else {
    console.log('❌ REPROVADO — Prompt precisa de ajuste')
  }

  console.log('\nResultados JSON:')
  console.log(JSON.stringify(resultados, null, 2))
}

main().catch(console.error)
