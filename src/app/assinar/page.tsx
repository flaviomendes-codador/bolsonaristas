import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assinar Premium | Monitor Legislativo Conservador',
  description: '7 dias grátis. Acesso completo a 513 deputados, alertas de PLs perigosos e score conservador atualizado diariamente pela IA.',
}

const benefits = [
  { icon: '🦅', title: 'Ranking Completo', desc: 'Todos os 513 deputados rankeados por score conservador' },
  { icon: '📜', title: 'Feed Diário de PLs', desc: 'Cada projeto de lei analisado e pontuado pela IA' },
  { icon: '🚨', title: 'Alertas por Email', desc: 'Notificação imediata dos PLs mais perigosos' },
  { icon: '🔍', title: 'Filtros Avançados', desc: 'Por partido, estado, score mínimo e categoria' },
  { icon: '📊', title: 'Histórico Completo', desc: '12 meses de votações registradas por deputado' },
  { icon: '👤', title: 'Perfil do Deputado', desc: 'Ficha completa com todas as votações e evolução do score' },
  { icon: '🏅', title: 'Badge Exclusivo', desc: 'Badge "Patriota Vigilante" 🦅 na sua conta' },
  { icon: '❌', title: 'Sem Fidelidade', desc: 'Cancele quando quiser, sem burocracia' },
]

export default function AssinarPage() {
  return (
    <main className="min-h-screen bg-bg-base flex flex-col">

      {/* Navbar mínima */}
      <nav className="glass-card border-b border-verde-muted/20 py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🦅</span>
            <span className="font-bold text-verde-glow">Monitor Legislativo</span>
          </Link>
          <Link href="/login" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            Já tenho conta →
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-5xl">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 badge-gold rounded-full px-4 py-2 mb-5 text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-gold-bright rounded-full animate-pulse" />
              7 Dias Completamente Grátis
            </div>
            <h1 className="display-font text-5xl sm:text-7xl text-white leading-none mb-4">
              PLANO <span className="gold-text">PATRIOTA PREMIUM</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Acesso completo à vigilância conservadora de 513 deputados.
              Nossa IA trabalha enquanto você vive.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* Benefícios — lado esquerdo */}
            <div className="lg:col-span-3 space-y-3">
              {benefits.map(b => (
                <div key={b.title} className="glass-card rounded-xl p-4 flex items-start gap-4 border border-verde-muted/15 hover:border-verde-muted/30 transition-all">
                  <span className="text-2xl shrink-0">{b.icon}</span>
                  <div>
                    <p className="font-bold text-gray-100 text-sm">{b.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Card de checkout — lado direito */}
            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <div className="premium-card rounded-2xl p-8 relative overflow-hidden">
                {/* Glow de fundo */}
                <div className="absolute inset-0 opacity-30"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.15) 0%, transparent 60%)',
                  }}
                />

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <p className="text-verde-glow text-sm font-semibold uppercase tracking-widest mb-2">
                      Acesso Total
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="display-font text-7xl text-white">R$29</span>
                      <span className="display-font text-4xl text-gray-400">,90</span>
                      <span className="text-gray-500 ml-1">/mês</span>
                    </div>
                    <p className="text-gold-bright text-sm mt-2 font-semibold">
                      ← 7 dias grátis para começar
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      ou R$249/ano (economize 30%)
                    </p>
                  </div>

                  {/* Botão checkout */}
                  <form action="/api/checkout" method="POST">
                    <button
                      type="submit"
                      className="btn-gold w-full py-5 rounded-xl font-black text-xl uppercase tracking-wide transition-all mb-4"
                    >
                      🦅 Começar Grátis →
                    </button>
                  </form>

                  {/* Garantias */}
                  <div className="space-y-2">
                    {[
                      '🔒 Pagamento 100% seguro via Stripe',
                      '✅ Cancele quando quiser',
                      '🎯 Sem compromisso nos 7 dias grátis',
                      '🇧🇷 Dados oficiais da Câmara',
                    ].map(g => (
                      <p key={g} className="text-gray-500 text-xs flex items-center gap-2">{g}</p>
                    ))}
                  </div>

                  {/* Divisor */}
                  <div className="divider-fire my-5" />

                  {/* Plano anual */}
                  <div className="glass-card rounded-xl p-4 border border-gold-base/20 text-center">
                    <p className="text-gold-bright text-sm font-bold">💰 Plano Anual — R$249/ano</p>
                    <p className="text-gray-500 text-xs mt-1">Equivale a R$20,75/mês — economize 30%</p>
                    <Link href="/contato" className="text-verde-glow text-xs hover:underline mt-2 block">
                      Falar sobre plano anual →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Social proof mínimo */}
              <div className="glass-card rounded-xl p-4 mt-4 text-center border border-verde-muted/15">
                <p className="text-gray-500 text-xs">
                  🇧🇷 Monitorando Brasília com <span className="text-verde-glow font-semibold">dados 100% oficiais</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
