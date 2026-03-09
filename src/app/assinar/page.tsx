import Link from 'next/link'

export default function AssinarPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <Link href="/" className="text-4xl block mb-4">🦅</Link>
        <h1 className="text-3xl font-black text-white mb-2">
          Plano <span className="gold-text">Patriota Premium</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Acesso completo a 513 deputados, alertas e análises diárias da IA
        </p>

        <div className="glass-card rounded-2xl p-8 mb-6">
          <div className="flex items-baseline justify-center gap-2 mb-6">
            <span className="text-5xl font-black text-white">R$29,90</span>
            <span className="text-gray-400">/mês</span>
          </div>

          <ul className="text-left space-y-3 text-sm text-gray-300 mb-8">
            {[
              '🦅 Ranking completo — todos os 513 deputados',
              '📜 Feed diário de PLs analisados pela IA',
              '🚨 Alertas por email dos PLs mais perigosos',
              '🔍 Filtros por partido, estado e score',
              '📊 Histórico de votações de 12 meses',
              '👤 Página completa de cada deputado',
              '🏅 Badge "Patriota Vigilante" exclusivo',
              '❌ Cancele quando quiser — sem fidelidade',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Botão de checkout — aponta para API Route que cria sessão Stripe */}
          <form action="/api/checkout" method="POST">
            <button
              type="submit"
              className="w-full bg-verde-600 hover:bg-verde-500 text-white py-4 rounded-xl font-black text-lg transition-all shadow-lg shadow-verde-900/50"
            >
              Assinar Agora — R$29,90/mês →
            </button>
          </form>

          <p className="text-xs text-gray-600 mt-4">
            Pagamento seguro via Stripe · LGPD compliant
          </p>
        </div>

        <p className="text-gray-600 text-sm">
          Prefere anual? R$249/ano (economize 30%).{' '}
          <Link href="/contato" className="text-verde-500 hover:text-verde-400">
            Fale conosco
          </Link>
        </p>
      </div>
    </main>
  )
}
