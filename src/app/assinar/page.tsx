import Link from 'next/link'

const BENEFITS = [
  { icon: '🦅', t: 'Ranking completo',       d: '513 deputados rankeados por score conservador' },
  { icon: '📜', t: 'Feed diário de PLs',      d: 'Cada projeto analisado e pontuado pela IA' },
  { icon: '🚨', t: 'Alertas por email',       d: 'Notificação imediata dos PLs mais perigosos' },
  { icon: '🔍', t: 'Filtros avançados',       d: 'Por partido, estado, score e categoria' },
  { icon: '📊', t: 'Histórico completo',      d: '12 meses de votações por deputado' },
  { icon: '👤', t: 'Perfil do deputado',      d: 'Ficha completa com votações e evolução' },
  { icon: '🏅', t: 'Badge exclusivo',         d: '"Patriota Vigilante" 🦅 na sua conta' },
  { icon: '❌', t: 'Sem fidelidade',          d: 'Cancele quando quiser, sem burocracia' },
]

export default function AssinarPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <span>🦅</span> Monitor Legislativo
          </Link>
          <Link href="/login" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">Já tenho conta →</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-950/40 border border-green-900/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">7 dias completamente grátis</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-white leading-none mb-4">
            PATRIOTA<br /><span className="text-gradient-red">PREMIUM</span>
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm">
            Acesso completo à vigilância conservadora de 513 deputados. Nossa IA trabalha enquanto você vive.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Benefícios */}
          <div className="lg:col-span-3 space-y-2">
            {BENEFITS.map(b => (
              <div key={b.t} className="card card-hover flex items-start gap-4 px-5 py-4">
                <span className="text-xl shrink-0">{b.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{b.t}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{b.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Card de preço */}
          <div className="lg:col-span-2 lg:sticky lg:top-8">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8">
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium mb-4">Acesso total</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-6xl text-white">R$29,90</span>
                <span className="text-zinc-500">/mês</span>
              </div>
              <p className="text-green-500 text-xs font-medium mb-1">← 7 dias grátis para começar</p>
              <p className="text-zinc-600 text-xs mb-8">ou R$249/ano — economize 30%</p>

              <form action="/api/checkout" method="POST">
                <button type="submit"
                  className="btn btn-red w-full py-4 text-base font-bold mb-4">
                  🦅 Começar grátis →
                </button>
              </form>

              <div className="space-y-2 mb-6">
                {['🔒 Pagamento seguro via Stripe', '✅ Cancele quando quiser', '🇧🇷 Dados 100% oficiais'].map(g => (
                  <p key={g} className="text-zinc-600 text-xs">{g}</p>
                ))}
              </div>

              <div className="divider-red my-6" />

              <div className="card p-4 text-center">
                <p className="text-yellow-500 text-sm font-semibold mb-1">💰 Plano Anual — R$249/ano</p>
                <p className="text-zinc-600 text-xs">R$20,75/mês · economize 30%</p>
                <Link href="/contato" className="text-green-500 text-xs hover:text-green-400 underline mt-2 block transition-colors">
                  Falar sobre plano anual →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
