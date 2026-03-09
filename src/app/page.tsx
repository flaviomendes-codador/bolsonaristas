import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { PoliticianCard } from '@/components/PoliticianCard'
import { BillCard } from '@/components/BillCard'
import type { Politician, Bill } from '@/lib/supabase'

// Revalida a cada 1h (ISR)
export const revalidate = 3600

async function getTopPoliticians(): Promise<Politician[]> {
  const { data } = await supabase
    .from('politicians')
    .select('*')
    .order('score_atual', { ascending: false })
    .limit(5)
  return (data as Politician[]) ?? []
}

async function getWorstPoliticians(): Promise<Politician[]> {
  const { data } = await supabase
    .from('politicians')
    .select('*')
    .order('score_atual', { ascending: true })
    .limit(5)
  return (data as Politician[]) ?? []
}

async function getRecentBills(): Promise<Bill[]> {
  const { data } = await supabase
    .from('bills')
    .select('*')
    .order('analisado_em', { ascending: false })
    .limit(3)
  return (data as Bill[]) ?? []
}

export default async function LandingPage() {
  const [topPols, worstPols, recentBills] = await Promise.all([
    getTopPoliticians(),
    getWorstPoliticians(),
    getRecentBills(),
  ])

  return (
    <main className="min-h-screen">
      {/* ── NAVBAR ── */}
      <nav className="border-b border-verde-900/30 sticky top-0 z-50 glass-card">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦅</span>
            <span className="font-bold text-verde-400 text-lg">Monitor Legislativo</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/assinar"
              className="text-sm bg-verde-600 hover:bg-verde-500 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Assinar — R$29,90/mês
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-verde-900/30 border border-verde-700/40 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-verde-500 rounded-full animate-pulse" />
          <span className="text-verde-400 text-sm font-medium">IA monitorando Brasília agora</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Você sabe o que{' '}
          <span className="gold-text">eles fazem</span>
          <br />em Brasília?
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4">
          Nossa IA analisa cada votação e projeto de lei com olhos conservadores.
          Veja quem está defendendo o Brasil — e quem está traindo o eleitor.
        </p>

        <p className="text-sm text-gray-600 mb-10">
          Impostos · Família · Liberdades · Segurança · Livre Mercado
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/assinar"
            className="inline-flex items-center justify-center gap-2 bg-verde-600 hover:bg-verde-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-verde-900/50"
          >
            🦅 Quero Saber a Verdade
            <span className="text-verde-200 text-sm font-normal">R$29,90/mês</span>
          </Link>
          <a
            href="#ranking"
            className="inline-flex items-center justify-center gap-2 glass-card text-gray-300 hover:text-verde-400 px-8 py-4 rounded-xl font-semibold transition-all"
          >
            Ver Ranking Grátis ↓
          </a>
        </div>

        {/* Prova Social */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-verde-500 text-xl font-bold">513</span>
            <span>deputados monitorados</span>
          </div>
          <div className="w-px h-4 bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-verde-500 text-xl font-bold">24/7</span>
            <span>atualizado pela IA</span>
          </div>
          <div className="w-px h-4 bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-verde-500 text-xl font-bold">100%</span>
            <span>dados oficiais da Câmara</span>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="bg-militar-800/50 py-16 border-y border-verde-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-white mb-10">
            Como o <span className="gold-text">Score Conservador</span> é calculado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📡',
                title: 'Coleta Automática',
                desc: 'Todo dia às 8h, nossa IA busca todos os PLs e votações da API oficial da Câmara dos Deputados.',
              },
              {
                icon: '🤖',
                title: 'Análise com IA',
                desc: 'Cada projeto recebe uma nota de -10 a +10. A IA analisa impacto em impostos, família e liberdades.',
              },
              {
                icon: '🏆',
                title: 'Score do Deputado',
                desc: 'O score é calculado com base em como cada deputado vota em pauta positiva e negativa para o conservadorismo.',
              },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RANKING TOP 10 ── */}
      <section id="ranking" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">
            🏆 Os Mais Conservadores
          </h2>
          <p className="text-gray-500">Top 5 deputados — Score Conservador hoje</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {topPols.map((p, i) => (
            <PoliticianCard key={p.id} politician={p} rank={i + 1} />
          ))}
        </div>

        <div className="text-center mb-16">
          <p className="text-gray-600 text-sm mb-4">
            🔒 Veja os 513 deputados completos com filtros por partido e estado
          </p>
          <Link
            href="/assinar"
            className="inline-flex items-center gap-2 bg-verde-700/30 hover:bg-verde-700/50 border border-verde-700/40 text-verde-400 px-6 py-3 rounded-lg font-semibold transition-all text-sm"
          >
            Desbloquear Ranking Completo →
          </Link>
        </div>

        {/* Os Piores */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">
            🚨 Os Mais Preocupantes
          </h2>
          <p className="text-gray-500">Deputados com mais votos contra o Brasil</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {worstPols.map((p, i) => (
            <PoliticianCard key={p.id} politician={p} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* ── PLs RECENTES ── */}
      <section className="bg-militar-800/30 py-16 border-y border-verde-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">
              📜 PLs Analisados pela IA
            </h2>
            <p className="text-gray-500">Últimos projetos com análise conservadora</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {recentBills.slice(0, 1).map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
            {recentBills.slice(1).map((bill) => (
              <BillCard key={bill.id} bill={bill} locked />
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4">
              🔒 Assinantes recebem alertas por email dos PLs mais perigosos
            </p>
            <Link
              href="/assinar"
              className="inline-flex items-center gap-2 bg-verde-600 hover:bg-verde-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Quero os Alertas →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-2">
            Escolha seu Plano
          </h2>
          <p className="text-gray-500">Menos que um café por semana para saber a verdade</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-300 mb-1">Gratuito</h3>
            <p className="text-4xl font-black text-white mb-6">R$0</p>
            <ul className="space-y-3 text-sm text-gray-400 mb-8">
              {[
                '✅ Top 10 deputados conservadores',
                '✅ 1 PL analisado por dia',
                '✅ Score geral de cada deputado',
                '❌ Ranking completo (513 dep.)',
                '❌ Filtros por partido/estado',
                '❌ Alertas por email',
                '❌ Histórico de votações',
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              href="/login"
              className="block text-center glass-card text-gray-300 py-3 rounded-xl font-semibold hover:text-verde-400 transition-all"
            >
              Criar Conta Grátis
            </Link>
          </div>

          {/* Premium */}
          <div className="relative rounded-2xl p-8 bg-gradient-to-br from-verde-900/40 to-militar-700 border-2 border-verde-600/50">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-dourado-500 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wide">
                🦅 Mais Popular
              </span>
            </div>
            <h3 className="text-xl font-bold text-verde-400 mb-1">Patriota Premium</h3>
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-4xl font-black text-white">R$29,90</p>
              <span className="text-gray-400">/mês</span>
            </div>
            <p className="text-xs text-gray-500 mb-6">ou R$249/ano (economize 30%)</p>
            <ul className="space-y-3 text-sm text-gray-300 mb-8">
              {[
                '✅ Ranking completo — 513 deputados',
                '✅ Feed diário de PLs analisados',
                '✅ Alertas por email (PLs perigosos)',
                '✅ Filtros por partido e estado',
                '✅ Histórico de 12 meses',
                '✅ Página completa de cada deputado',
                '✅ Badge "Patriota Vigilante" 🦅',
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              href="/assinar"
              className="block text-center bg-verde-600 hover:bg-verde-500 text-white py-4 rounded-xl font-black text-lg transition-all shadow-lg shadow-verde-900/50"
            >
              Assinar Agora →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-verde-900/20 py-8 text-center text-gray-600 text-sm">
        <p className="mb-2">🦅 Monitor Legislativo Conservador</p>
        <p>Dados oficiais: API da Câmara dos Deputados · Análises por IA</p>
        <p className="mt-2 text-xs">
          <Link href="/privacidade" className="hover:text-gray-400">Privacidade</Link>
          {' · '}
          <Link href="/termos" className="hover:text-gray-400">Termos de Uso</Link>
          {' · '}
          <Link href="/contato" className="hover:text-gray-400">Contato</Link>
        </p>
      </footer>
    </main>
  )
}
