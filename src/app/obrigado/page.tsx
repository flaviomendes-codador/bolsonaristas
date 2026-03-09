import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bem-vindo, Patriota | Monitor Legislativo',
  description: 'Você agora tem acesso ao Monitor Legislativo Conservador.',
  robots: 'noindex',
}

const PROXIMOS_PASSOS = [
  {
    n: '01',
    titulo: 'Confirme seu email',
    desc: 'Clique no link que enviamos. Isso ativa seus alertas diários.',
    cta: null,
    cor: 'border-green-900/60',
  },
  {
    n: '02',
    titulo: 'Conheça o ranking',
    desc: 'Veja os 10 deputados mais conservadores e os mais perigosos do Brasil.',
    cta: { label: 'Ver ranking →', href: '/dashboard' },
    cor: 'border-white/10',
  },
  {
    n: '03',
    titulo: 'Desbloqueie tudo',
    desc: 'Acesse os 513 deputados, alertas em tempo real e histórico completo.',
    cta: { label: '7 dias grátis →', href: '/assinar' },
    cor: 'border-red-900/60',
  },
]

export default function ObrigadoPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-white/5 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <span>🦅</span>
            <span className="font-black text-sm uppercase tracking-widest">Monitor Legislativo</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">

          {/* Ícone de confirmação */}
          <div className="w-20 h-20 border-2 border-green-700 bg-green-950/30 flex items-center justify-center text-4xl mx-auto mb-8">
            🦅
          </div>

          <p className="text-green-500 text-xs font-black uppercase tracking-[0.3em] mb-4">
            VOCÊ ESTÁ DENTRO
          </p>

          <h1 className="font-display text-5xl sm:text-6xl text-white uppercase leading-tight mb-4">
            BEM-VINDO,<br />
            <span className="text-green-400">PATRIOTA</span>
          </h1>

          <p className="text-gray-400 text-base max-w-lg mx-auto mb-12 leading-relaxed">
            Você acabou de dar o primeiro passo para parar de ser enganado.
            A partir de agora, <span className="text-white font-semibold">você vai saber o que
            acontece em Brasília antes de ler no jornal</span> — ou antes de nunca ler.
          </p>

          {/* Próximos passos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 text-left">
            {PROXIMOS_PASSOS.map(passo => (
              <div key={passo.n} className={`border ${passo.cor} bg-black/40 p-6`}>
                <div className="font-display text-4xl text-gray-800 font-black mb-3">{passo.n}</div>
                <p className="font-bold text-white text-sm uppercase tracking-wide mb-2">{passo.titulo}</p>
                <p className="text-gray-600 text-xs leading-relaxed mb-4">{passo.desc}</p>
                {passo.cta && (
                  <Link href={passo.cta.href}
                    className="text-xs font-bold text-green-500 hover:text-green-300 uppercase tracking-wider transition-colors">
                    {passo.cta.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Upsell suave */}
          <div className="border border-red-900/50 bg-red-950/10 p-8 mb-8">
            <p className="text-red-400 text-xs font-black uppercase tracking-widest mb-3">
              ENQUANTO VOCÊ LÊ ISSO
            </p>
            <p className="text-white font-bold text-lg mb-2">
              3 projetos de lei estão sendo votados agora
            </p>
            <p className="text-gray-500 text-sm mb-6">
              No plano gratuito você vai saber amanhã. No Premium, você recebe o alerta em minutos.
            </p>
            <Link href="/assinar"
              className="inline-block bg-red-700 hover:bg-red-600 text-white px-8 py-3 font-black uppercase tracking-wider text-sm transition-all">
              Quero Alertas em Tempo Real — 7 Dias Grátis →
            </Link>
          </div>

          {/* Compartilhar */}
          <div className="border border-white/5 bg-black/40 p-6">
            <p className="text-gray-500 text-sm mb-4">
              Conhece alguém que merece saber a verdade?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://twitter.com/intent/tweet?text=Acabei%20de%20me%20cadastrar%20no%20Monitor%20Legislativo%20Conservador%20-%20IA%20que%20monitora%20513%20deputados%2024h%20por%20dia.%20Voc%C3%AA%20sabe%20o%20que%20eles%20est%C3%A3o%20fazendo%3F%20%F0%9F%A6%85&url=https%3A%2F%2Fmonitorlegislativo.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all">
                Compartilhar no X/Twitter
              </a>
              <a
                href="https://wa.me/?text=Acabei%20de%20me%20cadastrar%20no%20Monitor%20Legislativo%20Conservador%20-%20IA%20que%20monitora%20513%20deputados%2024h%20por%20dia.%20Acesso%20gr%C3%A1tis%3A%20monitorlegislativo.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green-900/60 text-green-700 hover:text-green-400 hover:border-green-700/60 px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all">
                Compartilhar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-gray-700">
        <p>🦅 Monitor Legislativo Conservador · Dados oficiais da Câmara</p>
      </footer>
    </div>
  )
}
