'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

/* ─── Contador animado ──────────────────────────────── */
function Counter({ value, prefix = '', decimals = 0 }: { value: number; prefix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(display)

  useEffect(() => {
    const diff = value - ref.current
    if (Math.abs(diff) < 0.1) return
    const step = diff / 12
    const t = setInterval(() => {
      ref.current += step
      if (Math.abs(value - ref.current) < Math.abs(step)) {
        ref.current = value
        clearInterval(t)
      }
      setDisplay(ref.current)
    }, 30)
    return () => clearInterval(t)
  }, [value])

  const formatted = decimals > 0
    ? display.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.floor(display).toLocaleString('pt-BR')

  return <span className="font-mono tabular-nums">{prefix}{formatted}</span>
}

/* ─── Bloco de dano em tempo real ──────────────────── */
function DamageBlock() {
  const START = Date.now()
  const RATE_GASTO   = 15000   // R$ por segundo
  const RATE_IMPOSTO = 11000
  const RATE_PLS     = 0.003   // PLs por segundo

  const [, tick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => tick(n => n + 1), 250)
    return () => clearInterval(t)
  }, [])

  const secs = (Date.now() - START) / 1000
  const gastos   = 4_200_000_000 + secs * RATE_GASTO
  const impostos = 3_800_000_000 + secs * RATE_IMPOSTO
  const pls      = 47 + secs * RATE_PLS

  const items = [
    { label: 'Em gastos aprovados hoje', value: gastos,   prefix: 'R$ ', color: 'text-red-400' },
    { label: 'Em novos impostos',        value: impostos, prefix: 'R$ ', color: 'text-orange-400' },
    { label: 'PLs perigosos tramitando', value: pls,      prefix: '',    color: 'text-yellow-400' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/8">
      {items.map((item, i) => (
        <div key={i} className="bg-[#0e0e0e] p-6 sm:p-8 flex flex-col gap-2">
          <div className={`text-3xl sm:text-4xl font-bold ${item.color}`}>
            <Counter value={item.value} prefix={item.prefix} decimals={0} />
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-widest">{item.label}</div>
          <div className="w-8 h-px bg-white/10 mt-1" />
        </div>
      ))}
    </div>
  )
}

/* ─── Alerta ticker ─────────────────────────────────── */
const ALERTS = [
  'PL 1234 · Novo imposto sobre herança aprovado em 1ª votação',
  'PL 0891 · Ideologia de gênero obrigatória nas escolas públicas',
  'PL 2630 · Lei das Fake News ameaça liberdade de expressão',
  'Fundo Eleitoral · R$ 4,9 bilhões aprovados para campanhas políticas',
  'PL 0412 · Nova taxa sobre MEI e pequenos empresários',
  'PL 1847 · Estatuto expande conceito de família tradicional',
]

function AlertTicker() {
  const doubled = [...ALERTS, ...ALERTS]
  return (
    <div className="ticker-wrap border-y border-white/5 py-3 bg-red-950/20">
      <div className="ticker-inner text-xs text-red-400 font-medium uppercase tracking-widest">
        {doubled.map((a, i) => (
          <span key={i} className="inline-block px-6">
            <span className="text-red-600 mr-2">●</span>{a}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Linha do produto (demo) ───────────────────────── */
const DEMO_PLS = [
  { n: 'PL 1234/2026', t: 'Novo imposto sobre dividendos',                   s: -8.2, ok: false },
  { n: 'PL 0891/2026', t: 'Ensino obrigatório de ideologia de gênero',        s: -9.4, ok: false },
  { n: 'PL 2201/2026', t: 'Redução do IR para renda até R$5.000',             s: +6.7, ok: true  },
  { n: 'PL 1847/2026', t: 'Regulamentação de censura de redes sociais',       s: -7.1, ok: false },
  { n: 'PL 3302/2026', t: 'Desburocratização para micro e pequenas empresas', s: +8.3, ok: true  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── NAV ──────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🦅</span>
            <span className="font-semibold text-sm tracking-tight text-white">Monitor Legislativo</span>
            <span className="hidden sm:flex items-center gap-1.5 ml-2 bg-red-950/60 border border-red-900/40 rounded-full px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-[10px] font-semibold uppercase tracking-widest">Ao vivo</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-zinc-400 hover:text-white text-sm transition-colors">Entrar</Link>
            <Link href="/captura" className="btn btn-red text-sm px-4 py-2">Acesso gratuito</Link>
          </div>
        </div>
      </nav>

      {/* ── TICKER ───────────────────────────────────── */}
      <AlertTicker />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">

        {/* Glow de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse, #dc2626 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 border border-red-900/40 bg-red-950/30 rounded-full px-4 py-1.5 mb-8">
            <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">
              {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[4.5rem] sm:text-[7rem] md:text-[9rem] leading-[0.85] tracking-tight mb-6">
            <span className="text-white">O BRASIL</span>
            <br />
            <span className="text-gradient-red">ESTÁ RUINDO</span>
            <br />
            <span className="text-white/40 text-[3rem] sm:text-[4.5rem] md:text-[6rem]">DIANTE DOS SEUS OLHOS</span>
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-3">
            Enquanto você trabalha e paga seus impostos,{' '}
            <span className="text-white font-medium">513 deputados aprovam leis que destroem sua liberdade.</span>
            {' '}Em silêncio. Sem que você saiba.
          </p>
          <p className="text-red-500/80 text-sm font-semibold uppercase tracking-widest mb-12">
            Nossa IA muda isso.
          </p>

          {/* Damage counter */}
          <div className="mb-10 max-w-3xl mx-auto">
            <DamageBlock />
            <p className="text-zinc-700 text-xs mt-3 text-center uppercase tracking-widest">
              Contadores estimados com base em dados históricos da Câmara dos Deputados
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/captura" className="btn btn-red text-base px-8 py-4">
              🦅 Quero saber quem são eles — grátis
            </Link>
            <a href="#produto" className="btn btn-outline text-sm px-8 py-4">
              Como funciona ↓
            </a>
          </div>
          <p className="text-zinc-700 text-xs mt-4">Sem cartão de crédito · Dados 100% oficiais da Câmara</p>
        </div>
      </section>

      {/* ── DESTRUIÇÃO ───────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-red-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">A Realidade</p>
            <h2 className="font-display text-5xl sm:text-6xl text-white mb-4">
              O QUE ACONTECEU<br />
              <span className="text-zinc-600">ENQUANTO VOCÊ NÃO OLHAVA</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { n: 'R$ 4,9 bi',   t: 'Fundo Eleitoral',          d: 'Aprovado para bancar campanhas de quem já está no poder.',           c: 'text-red-400' },
              { n: '38',          t: 'Novos impostos',            d: 'Aprovados nos últimos 24 meses. Sua renda comprometida.',             c: 'text-orange-400' },
              { n: '127 PLs',     t: 'Contra a família',          d: 'Projetos atacando valores tradicionais e liberdade religiosa.',        c: 'text-yellow-500' },
              { n: '89%',         t: 'Votaram mais Estado',       d: 'Dos deputados apoiaram ao menos um projeto que expande o governo.',   c: 'text-red-400' },
              { n: '0',           t: 'Portais conservadores',     d: 'Nenhuma plataforma entrega análise conservadora automatizada.',       c: 'text-zinc-400' },
              { n: '8h/dia',      t: 'Trabalham contra você',     d: 'Enquanto você paga impostos, eles aprovam mais impostos.',            c: 'text-red-400' },
            ].map(item => (
              <div key={item.t} className="card card-hover p-6">
                <div className={`font-display text-4xl mb-2 ${item.c}`}>{item.n}</div>
                <div className="text-white text-sm font-semibold mb-1.5">{item.t}</div>
                <div className="text-zinc-600 text-xs leading-relaxed">{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUTO ──────────────────────────────────── */}
      <section id="produto" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-green-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">A Solução</p>
            <h2 className="font-display text-5xl sm:text-6xl text-white mb-4">
              UMA IA QUE NÃO<br />
              <span className="text-gradient-white">DORME. NEM SE VENDE.</span>
            </h2>
            <p className="text-zinc-400 max-w-xl">
              Todo dia às 8h — votações, projetos, scores. Análise conservadora automática de cada PL.
            </p>
          </div>

          {/* Demo terminal */}
          <div className="rounded-2xl overflow-hidden border border-white/8 mb-12">
            {/* Barra superior */}
            <div className="bg-[#111] px-4 py-3 flex items-center gap-2 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex items-center gap-2 ml-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-zinc-500 text-xs font-mono">IA Analisando · {new Date().toLocaleDateString('pt-BR')} · 08:00 BRT</span>
              </div>
            </div>
            {/* Conteúdo */}
            <div className="bg-[#0a0a0a] divide-y divide-white/4">
              {DEMO_PLS.map((pl, i) => (
                <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${pl.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{pl.t}</p>
                    <p className="text-zinc-600 text-xs font-mono mt-0.5">{pl.n}</p>
                  </div>
                  <div className={`font-mono text-base font-bold shrink-0 ${pl.s > 0 ? 'score-pos' : 'score-neg'}`}>
                    {pl.s > 0 ? '+' : ''}{pl.s.toFixed(1)}
                  </div>
                </div>
              ))}
              <div className="px-5 py-3 flex items-center justify-between bg-white/1">
                <span className="text-zinc-600 text-xs">5 projetos analisados hoje</span>
                <span className="text-green-600 text-xs font-medium">● Sistema ativo</span>
              </div>
            </div>
          </div>

          {/* 3 passos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { n: '01', t: 'Coleta automática', d: 'A IA acessa a API oficial da Câmara todo dia às 8h e baixa todos os PLs e votações.' },
              { n: '02', t: 'Análise conservadora', d: 'Cada projeto é avaliado: aumenta imposto? Ataca a família? Restringe liberdade? Score de −10 a +10.' },
              { n: '03', t: 'Você recebe o alerta', d: 'Relatório no seu email. Você sabe exatamente o que aconteceu — e quem votou o quê.' },
            ].map(s => (
              <div key={s.n}>
                <div className="font-display text-5xl text-white/10 mb-3">{s.n}</div>
                <div className="text-white font-semibold text-sm mb-2">{s.t}</div>
                <div className="text-zinc-500 text-sm leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RANKING PREVIEW ──────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-red-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Transparência Total</p>
            <h2 className="font-display text-5xl sm:text-6xl text-white">
              VOCÊ VAI SABER<br />
              <span className="text-red-500">QUEM ESTÁ TRAINDO</span>
            </h2>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/8">
            <div className="bg-[#111] px-4 py-3 flex items-center justify-between border-b border-white/5">
              <span className="text-zinc-500 text-xs uppercase tracking-widest font-medium">Ranking · Score Conservador</span>
              <span className="text-zinc-600 text-xs">513 deputados</span>
            </div>
            {[
              { pos: '01', n: '████████████████', p: '???', uf: '??', s: '+9.4', c: 'score-pos' },
              { pos: '02', n: '██████████████',   p: '???', uf: '??', s: '+8.7', c: 'score-pos' },
              { pos: '03', n: '█████████████████',p: '???', uf: '??', s: '+8.1', c: 'score-pos' },
              { pos: '···', n: '···',             p: '·',   uf: '·',  s: '···',  c: 'text-zinc-700' },
              { pos: '513', n: '████████████████',p: '???', uf: '??', s: '-9.2', c: 'score-neg' },
            ].map((d, i) => (
              <div key={i} className={`px-4 py-3.5 flex items-center gap-4 border-b border-white/4 last:border-0 ${i < 3 ? 'bg-[#0a0a0a]' : 'bg-[#080808]'}`}>
                <span className="text-zinc-600 text-xs font-mono w-6 shrink-0">{d.pos}</span>
                <div className="flex-1">
                  <p className={`text-sm ${i < 3 ? 'blur-paywall text-white' : 'text-zinc-700'}`}>{d.n}</p>
                  <p className="text-zinc-700 text-xs mt-0.5">{d.p} · {d.uf}</p>
                </div>
                <span className={`font-mono text-sm font-bold ${d.c}`}>{d.s}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-zinc-700 text-xs mt-4">
            🔒 Nomes desbloqueados no plano gratuito e premium
          </p>
          <div className="text-center mt-5">
            <Link href="/captura" className="btn btn-red px-6 py-3 text-sm">
              Ver ranking completo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────── */}
      <section id="precos" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="font-display text-5xl sm:text-6xl text-white mb-3">ESCOLHA SEU PLANO</h2>
            <p className="text-zinc-500 text-sm">Menos que uma pizza. Mais que uma opinião.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">

            {/* Grátis */}
            <div className="card p-8 flex flex-col">
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium mb-4">Gratuito</p>
              <div className="font-display text-6xl text-white mb-1">R$0</div>
              <p className="text-zinc-600 text-sm mb-6">Para começar a enxergar</p>
              <ul className="space-y-2.5 text-sm mb-8 flex-1">
                {['Top 10 deputados', '3 PLs por semana', 'Score de cada deputado'].map(i => (
                  <li key={i} className="flex items-center gap-2 text-zinc-400">
                    <span className="text-green-500 text-xs">✓</span>{i}
                  </li>
                ))}
                {['Ranking completo', 'Alertas por email', 'Filtros avançados'].map(i => (
                  <li key={i} className="flex items-center gap-2 text-zinc-700 line-through">
                    <span className="text-zinc-700 text-xs">✗</span>{i}
                  </li>
                ))}
              </ul>
              <Link href="/captura" className="btn btn-outline py-3 text-sm w-full">Acessar grátis</Link>
            </div>

            {/* Premium */}
            <div className="relative bg-white/[0.04] border-2 border-red-800/60 rounded-xl p-8 flex flex-col">
              <div className="absolute -top-3 left-6 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Mais popular
              </div>
              <p className="text-red-400 text-xs uppercase tracking-widest font-medium mb-4">Patriota Premium</p>
              <div className="flex items-baseline gap-1 mb-1">
                <div className="font-display text-6xl text-white">R$29,90</div>
                <span className="text-zinc-500 text-sm">/mês</span>
              </div>
              <p className="text-green-500 text-xs font-medium mb-6">← 7 dias grátis para testar</p>
              <ul className="space-y-2.5 text-sm mb-8 flex-1">
                {[
                  '513 deputados — ranking completo',
                  'Todos os PLs analisados diariamente',
                  'Alertas por email dos mais perigosos',
                  'Filtros por partido, estado, score',
                  'Histórico de 12 meses',
                  'Badge "Patriota Vigilante" 🦅',
                ].map(i => (
                  <li key={i} className="flex items-center gap-2 text-zinc-200">
                    <span className="text-green-500 text-xs">✓</span>{i}
                  </li>
                ))}
              </ul>
              <Link href="/assinar" className="btn btn-red py-4 text-sm font-bold w-full">
                Assinar — 7 dias grátis →
              </Link>
              <p className="text-zinc-700 text-xs text-center mt-3">Cancele quando quiser · Stripe</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-[3.5rem] sm:text-[5.5rem] leading-none text-white mb-6">
            VOCÊ TEM<br />
            <span className="text-red-500">DUAS OPÇÕES</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto mb-10">
            <div className="card-red p-5 text-left">
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-2">Opção 1</p>
              <p className="text-zinc-400 text-sm leading-relaxed">Continuar no escuro. Pagar impostos. Ver o Brasil afundar.</p>
            </div>
            <div className="bg-green-950/20 border border-green-900/30 rounded-xl p-5 text-left">
              <p className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-2">Opção 2</p>
              <p className="text-zinc-300 text-sm leading-relaxed">Saber a verdade. Ter dados reais. Saber quem votar.</p>
            </div>
          </div>
          <Link href="/captura" className="btn btn-white px-10 py-4 text-base font-bold">
            🦅 Escolho a verdade — acesso grátis
          </Link>
          <p className="text-zinc-700 text-xs mt-4">Sem cartão. Sem risco. 100% dados oficiais.</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-700">
          <div className="flex items-center gap-2">
            <span>🦅</span>
            <span className="font-semibold uppercase tracking-wider">Monitor Legislativo Conservador</span>
          </div>
          <div className="flex gap-5">
            <Link href="/privacidade" className="hover:text-zinc-500 transition-colors">Privacidade</Link>
            <Link href="/captura"     className="hover:text-zinc-500 transition-colors">Cadastro</Link>
            <Link href="/assinar"     className="hover:text-zinc-500 transition-colors">Premium</Link>
          </div>
          <p>Dados: API Câmara · Análises por IA</p>
        </div>
      </footer>
    </div>
  )
}
