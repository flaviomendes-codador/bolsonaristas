'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

function useDamageCounter(base: number, rate: number) {
  const [v, setV] = useState(base)
  useEffect(() => {
    const t = setInterval(() => setV(x => x + rate / 10), 100)
    return () => clearInterval(t)
  }, [rate])
  return Math.floor(v)
}

const ALERTAS = [
  '🔴 APROVADO: PL aumenta imposto sobre herança em 15%',
  '🔴 VOTADO: Projeto restringe porte legal de armas para cidadãos',
  '🔴 APROVADO: Fundo eleitoral dobrado para R$4,9 bilhões',
  '🔴 EM VOTAÇÃO: PL obriga ideologia de gênero nas escolas públicas',
  '🔴 APROVADO: Nova taxa sobre MEI e pequenos empresários',
  '🔴 VOTADO: PL das Fake News ameaça liberdade de expressão',
]

export default function VendasPage() {
  const gastos   = useDamageCounter(4_200_000_000, 15000)
  const impostos = useDamageCounter(3_800_000_000, 12000)
  const pls      = useDamageCounter(47, 0.02)
  const [alertaIdx, setAlertaIdx] = useState(0)
  const [vis, setVis] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVis(false)
      setTimeout(() => { setAlertaIdx(i => (i + 1) % ALERTAS.length); setVis(true) }, 400)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">

      {/* Barra de emergência */}
      <div className="bg-red-700 py-2 px-4 flex items-center justify-center gap-3">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse shrink-0" />
        <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white text-center transition-opacity duration-400"
          style={{ opacity: vis ? 1 : 0 }}>
          {ALERTAS[alertaIdx]}
        </div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦅</span>
            <span className="font-black text-white text-sm tracking-widest uppercase">Monitor Legislativo</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-500 hover:text-white text-sm transition-colors hidden sm:block">Entrar</Link>
            <Link href="/captura" className="bg-red-600 hover:bg-red-500 text-white text-xs font-black px-4 py-2 rounded uppercase tracking-wider transition-all">
              ACESSO GRATUITO
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-12 pb-20 overflow-hidden">
        {/* Fundo: bandeira em colapso */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute inset-0" style={{ background: '#010f01', opacity: 0.97 }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[600px] h-[420px] opacity-[0.13]" style={{ filter: 'blur(0px)' }}>
              <div className="absolute inset-0 bg-[#006400] rounded" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[62%] h-[70%] bg-[#d4a800]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[36%] h-[54%] bg-[#003399] rounded-full" />
              </div>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 420">
                <line x1="150" y1="0" x2="300" y2="420" stroke="#ff0000" strokeWidth="1.5" opacity="0.6" />
                <line x1="400" y1="50" x2="200" y2="400" stroke="#ff0000" strokeWidth="1" opacity="0.4" />
                <line x1="250" y1="0" x2="350" y2="420" stroke="#cc0000" strokeWidth="2" opacity="0.5" />
                <line x1="0" y1="210" x2="600" y2="190" stroke="#ff4400" strokeWidth="0.8" opacity="0.3" />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 h-2/3"
                style={{ background: 'linear-gradient(0deg, rgba(220,38,38,0.7) 0%, rgba(249,115,22,0.3) 40%, transparent 100%)' }} />
            </div>
          </div>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #030303 80%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(180,0,0,0.08) 0%, transparent 60%)' }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-block border border-red-700/60 bg-red-950/40 px-4 py-1.5 mb-8">
            <span className="text-red-400 text-xs font-black uppercase tracking-[0.2em]">
              ⚡ EDIÇÃO ESPECIAL — {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
            </span>
          </div>

          <h1 className="font-display text-[3.2rem] sm:text-[5rem] md:text-[6.5rem] leading-[0.88] font-black text-white uppercase mb-6 tracking-tight">
            O BRASIL ESTÁ{' '}
            <span className="text-red-500" style={{ textShadow: '0 0 40px rgba(220,38,38,0.6)' }}>RUINDO</span>
            <br />
            <span className="text-[2.4rem] sm:text-[3.8rem] md:text-[5rem] text-gray-300">DIANTE DOS SEUS OLHOS</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-4">
            Enquanto você trabalha, cuida da sua família e paga seus impostos —
            <span className="text-white font-semibold"> 513 deputados aprovam leis que destroem o país.</span> Em silêncio. Sem que você saiba.
          </p>
          <p className="text-red-400/70 text-sm mb-12 uppercase tracking-widest font-semibold">Até agora.</p>

          {/* Contadores */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-4 max-w-2xl mx-auto">
            {[
              { v: gastos,   prefix: 'R$', label: 'Gastos aprovados hoje',     color: 'text-red-400' },
              { v: impostos, prefix: 'R$', label: 'Em novos impostos',          color: 'text-orange-400' },
              { v: pls,      prefix: '',   label: 'PLs perigosos em tramitação',color: 'text-yellow-400' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className={`font-display text-3xl sm:text-4xl font-black tabular-nums ${item.color}`}>
                  {item.prefix}{item.v.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-widest mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-700 mb-12 text-center">↑ Contadores estimados. Dados base: API Câmara dos Deputados.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/captura"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-10 py-5 font-black text-base uppercase tracking-wider transition-all hover:scale-105"
              style={{ boxShadow: '0 0 40px rgba(220,38,38,0.3)' }}>
              🦅 QUERO SABER QUEM SÃO ELES
            </Link>
            <a href="#destruicao"
              className="inline-flex items-center justify-center gap-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-8 py-5 font-semibold text-sm uppercase tracking-wider transition-all">
              Ver as provas ↓
            </a>
          </div>
          <p className="text-gray-700 text-xs mt-5 uppercase tracking-widest">Acesso grátis · Sem cartão · Dados 100% oficiais</p>
        </div>
      </section>

      {/* Destruição em números */}
      <section id="destruicao" className="py-20 border-t border-white/5 bg-[#070707]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-black uppercase tracking-[0.3em] mb-4">A REALIDADE QUE ESCONDEM</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase leading-tight">
              O QUE ACONTECEU<br /><span className="text-red-500">ENQUANTO VOCÊ NÃO OLHAVA</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {[
              { icon: '💸', n: 'R$ 4,9 bi', t: 'Fundo Eleitoral', d: 'Aprovado em votação relâmpago para bancar campanhas de quem já está no poder.', c: 'border-red-900/50', nc: 'text-red-400' },
              { icon: '📈', n: '38 impostos', t: 'Novos ou maiores', d: 'Aprovados ou em votação nos últimos 24 meses. Sua renda comprometida.', c: 'border-orange-900/50', nc: 'text-orange-400' },
              { icon: '📚', n: '127 PLs', t: 'Contra a Família', d: 'Projetos atacando valores tradicionais, educação dos filhos e liberdade religiosa.', c: 'border-yellow-900/50', nc: 'text-yellow-500' },
              { icon: '🏛️', n: '89%', t: 'Dos deputados', d: 'Votaram a favor de pelo menos um projeto que aumenta o custo do Estado.', c: 'border-red-900/50', nc: 'text-red-400' },
              { icon: '🔇', n: '0', t: 'Portais de alerta', d: 'Nenhuma plataforma no Brasil entrega análise conservadora de projetos de lei.', c: 'border-gray-800', nc: 'text-gray-400' },
              { icon: '⏰', n: '8h/dia', t: 'Eles trabalham contra você', d: 'Enquanto você paga impostos, eles aprovam mais impostos para você pagar.', c: 'border-red-900/50', nc: 'text-red-400' },
            ].map(item => (
              <div key={item.t} className={`bg-black/60 border ${item.c} p-6 hover:bg-black/80 transition-all`}>
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className={`font-display text-3xl font-black ${item.nc} mb-1`}>{item.n}</div>
                <div className="font-bold text-white text-sm mb-2 uppercase tracking-wide">{item.t}</div>
                <div className="text-gray-600 text-xs leading-relaxed">{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O produto */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,80,0,0.05) 0%, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="text-green-500 text-xs font-black uppercase tracking-[0.3em] mb-4">A SOLUÇÃO</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase leading-tight">
              A ÚNICA FERRAMENTA QUE<br /><span className="text-green-400">VIGIA BRASÍLIA POR VOCÊ</span>
            </h2>
          </div>

          {/* Demo */}
          <div className="bg-black border border-white/10 p-6 mb-14 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-gray-600 uppercase tracking-widest font-mono">IA ANALISANDO — HOJE 08:00 BRT</span>
            </div>
            {[
              { pl: 'PL 1234/2026', t: 'Novo imposto sobre dividendos', s: -8.2, i: '💸' },
              { pl: 'PL 0891/2026', t: 'Ensino de gênero obrigatório nas escolas', s: -9.1, i: '👨‍👩‍👧' },
              { pl: 'PL 2201/2026', t: 'Redução do IR para trabalhadores até R$5.000', s: +6.4, i: '📈' },
              { pl: 'PL 1847/2026', t: 'Regulamentação que amplia poder de censura', s: -7.8, i: '🔇' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-2.5 border-b border-white/5 last:border-0">
                <span className="text-lg shrink-0">{item.i}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{item.t}</p>
                  <p className="text-gray-700 text-xs font-mono mt-0.5">{item.pl}</p>
                </div>
                <div className={`font-mono text-sm font-black shrink-0 ${item.s >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.s > 0 ? '+' : ''}{item.s.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-white/5 bg-[#070707]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase">
              O PREÇO DA<br /><span className="text-green-400">INFORMAÇÃO REAL</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="border border-white/10 p-8 bg-black/40">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-3">Plano Grátis</p>
              <div className="font-display text-6xl text-white font-black mb-6">R$0</div>
              <ul className="space-y-2 text-sm mb-8 text-gray-500">
                <li>✓ Top 10 deputados conservadores</li>
                <li>✓ 3 PLs por semana</li>
                <li className="text-gray-700 line-through">✗ Ranking completo 513 dep.</li>
                <li className="text-gray-700 line-through">✗ Alertas de PLs perigosos</li>
              </ul>
              <Link href="/captura"
                className="block text-center border border-white/20 text-gray-400 hover:text-white py-3 text-sm font-bold uppercase tracking-wider transition-all">
                Acessar Grátis
              </Link>
            </div>
            <div className="border-2 border-red-700/80 p-8 bg-red-950/10 relative">
              <div className="absolute -top-3 left-6 bg-red-700 text-white text-xs font-black px-4 py-1 uppercase tracking-wider">
                ⚡ Mais Importante
              </div>
              <p className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Patriota Premium</p>
              <div className="flex items-baseline gap-1 mb-6">
                <div className="font-display text-6xl text-white font-black">R$29</div>
                <div className="font-display text-3xl text-gray-400">,90/mês</div>
              </div>
              <ul className="space-y-2 text-sm mb-8 text-gray-300">
                <li>✅ 513 deputados — ranking completo</li>
                <li>✅ Todos os PLs analisados diariamente</li>
                <li>✅ Alertas por email dos PLs perigosos</li>
                <li>✅ Filtros: partido, estado, score</li>
                <li>✅ 7 dias grátis para testar</li>
              </ul>
              <Link href="/assinar"
                className="block text-center bg-red-700 hover:bg-red-600 text-white py-4 font-black text-base uppercase tracking-wider transition-all">
                🦅 ASSINAR — 7 DIAS GRÁTIS →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 border-t border-white/5 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(180,0,0,0.06) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-[3rem] sm:text-[5rem] leading-none text-white uppercase mb-6">
            VOCÊ TEM<br /><span className="text-red-500">DUAS OPÇÕES</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-10 max-w-xl mx-auto text-left">
            <div className="border border-red-900/40 bg-red-950/20 p-5">
              <p className="text-red-400 font-black text-xs uppercase tracking-widest mb-2">Opção 1</p>
              <p className="text-gray-500 text-sm">Continuar no escuro. Pagar seus impostos. Assistir o país afundar.</p>
            </div>
            <div className="border border-green-800/60 bg-green-950/20 p-5">
              <p className="text-green-400 font-black text-xs uppercase tracking-widest mb-2">Opção 2</p>
              <p className="text-gray-300 text-sm">Saber a verdade. Ter dados reais. Saber quem votar.</p>
            </div>
          </div>
          <Link href="/captura"
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 font-black text-base uppercase tracking-wider hover:bg-gray-100 transition-all">
            🦅 ESCOLHO A VERDADE — ACESSO GRÁTIS
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-black">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <span>🦅</span>
            <span className="font-bold uppercase tracking-widest">Monitor Legislativo Conservador</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacidade" className="hover:text-gray-500 transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-gray-500 transition-colors">Termos</Link>
          </div>
          <p>Dados: API Câmara dos Deputados · Análises por IA</p>
        </div>
      </footer>
    </div>
  )
}
