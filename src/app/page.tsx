'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── Counter (Opal-style odometer) ──────────────────── */
function LiveCounter({ base, rate, prefix = '', label }: {
  base: number; rate: number; prefix?: string; label: string
}) {
  const [val, setVal] = useState(base)
  useEffect(() => {
    const start = Date.now()
    const t = setInterval(() => {
      setVal(base + ((Date.now() - start) / 1000) * rate)
    }, 100)
    return () => clearInterval(t)
  }, [base, rate])
  return (
    <div>
      <div className="text-gradient font-black tabular-nums"
        style={{ fontSize: 'var(--text-h1)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
        {prefix}{Math.floor(val).toLocaleString('pt-BR')}
      </div>
      <p className="mt-2 text-sm uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </p>
    </div>
  )
}

/* ─── Scroll word reveal (Opal pattern) ─────────────── */
function RevealText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = 1 - (rect.top - vh * 0.1) / (vh * 0.8)
      setProgress(Math.min(1, Math.max(0, p)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const words = text.split(' ')
  return (
    <p ref={ref} className="flex flex-wrap gap-x-3 gap-y-1" style={{ fontSize: 'var(--text-h2)', lineHeight: 1.3, fontWeight: 700, letterSpacing: '-0.02em' }}>
      {words.map((word, i) => {
        const threshold = i / words.length
        const lit = progress > threshold + 0.05
        const half = progress > threshold
        return (
          <span key={i} className={`word transition-colors duration-300 ${lit ? 'lit' : half ? 'half' : ''}`}>
            {word}
          </span>
        )
      })}
    </p>
  )
}

/* ─── Flag fire background ───────────────────────────── */
function HeroBG() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900"
        className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="fr" x="-20%" y="-40%" width="140%" height="180%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.055" numOctaves="6" seed="5" result="n"/>
            <feColorMatrix type="matrix"
              values="4 0 0 0 -1.2  0 0 0 0 0  0 0 0 0 0  0 4 3 0 -1.8"
              in="n" result="f"/>
            <feGaussianBlur stdDeviation="4" in="f" result="sf"/>
            <feBlend in="sf" in2="SourceGraphic" mode="screen"/>
            <feGaussianBlur stdDeviation="1"/>
          </filter>
          <radialGradient id="vg" cx="50%" cy="55%" r="70%">
            <stop offset="0%"  stopColor="transparent"/>
            <stop offset="75%" stopColor="#090909" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#090909" stopOpacity="0.95"/>
          </radialGradient>
          <linearGradient id="topg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#090909" stopOpacity="0.8"/>
            <stop offset="25%" stopColor="transparent"/>
            <stop offset="70%" stopColor="transparent"/>
            <stop offset="100%" stopColor="#090909" stopOpacity="0.98"/>
          </linearGradient>
          <linearGradient id="fg1" x1="0.5" y1="1" x2="0.4" y2="0">
            <stop offset="0%"  stopColor="#7f0000" stopOpacity="1"/>
            <stop offset="20%" stopColor="#c42000" stopOpacity="0.88"/>
            <stop offset="42%" stopColor="#e85000" stopOpacity="0.65"/>
            <stop offset="65%" stopColor="#ff8c00" stopOpacity="0.35"/>
            <stop offset="88%" stopColor="#ffcc00" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="fg2" x1="0.5" y1="1" x2="0.6" y2="0">
            <stop offset="0%"  stopColor="#600000" stopOpacity="0.95"/>
            <stop offset="30%" stopColor="#aa2800" stopOpacity="0.7"/>
            <stop offset="60%" stopColor="#dd6000" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>

        {/* Fundo */}
        <rect width="1440" height="900" fill="#090909"/>

        {/* Bandeira — sutil, atmosférica */}
        <g opacity="0.14">
          <rect x="180" y="90" width="1080" height="720" fill="#005c28"/>
          <polygon points="720,135 1170,450 720,765 270,450" fill="#f0c000"/>
          <ellipse cx="720" cy="450" rx="198" ry="198" fill="#002776"/>
        </g>

        {/* Fogo — fotorrealista com SVG filter */}
        <g filter="url(#fr)">
          <rect x="0" y="420" width="1440" height="480" fill="url(#fg1)" opacity="0.9"/>
          <rect x="-80" y="480" width="1600" height="420" fill="url(#fg2)" opacity="0.7"/>
          <ellipse cx="720" cy="900" rx="800" ry="320" fill="#8b0000" opacity="0.6"/>
          <ellipse cx="720" cy="900" rx="500" ry="200" fill="#c42000" opacity="0.5"/>
        </g>

        {/* Glow vermelho no centro-baixo */}
        <radialGradient id="glow" cx="50%" cy="95%" rx="50%" ry="30%">
          <stop offset="0%"  stopColor="#ff3500" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <rect width="1440" height="900" fill="url(#glow)"/>

        {/* Vinheta + topo */}
        <rect width="1440" height="900" fill="url(#vg)"/>
        <rect width="1440" height="900" fill="url(#topg)"/>
      </svg>
    </div>
  )
}

/* ─── Ticker de alertas ──────────────────────────────── */
const TICKERS = [
  'PL 1234 · Novo imposto aprovado em 1ª votação',
  'PL 0891 · Ideologia de gênero obrigatória nas escolas',
  'Fundo Eleitoral · R$ 4,9 bi aprovados para campanhas',
  'PL 2630 · Lei das Fake News ameaça liberdade de expressão',
  'PL 0412 · Nova taxa sobre MEI aprovada',
  'PL 3301 · Regulamentação de censura avança na Câmara',
]

/* ─── Demo do produto ────────────────────────────────── */
const PLS = [
  { n: 'PL 1234/2026', t: 'Novo imposto sobre dividendos e investimentos',      s: -8.2 },
  { n: 'PL 0891/2026', t: 'Ideologia de gênero obrigatória em escolas',          s: -9.4 },
  { n: 'PL 2201/2026', t: 'Redução do IR para renda até R$5.000',               s: +6.7 },
  { n: 'PL 1847/2026', t: 'Censura de redes sociais por "desinformação"',        s: -7.1 },
  { n: 'PL 3302/2026', t: 'Desburocratização para micro e pequenas empresas',   s: +8.3 },
]

/* ═══════════════════════════════════════════════════════ */

export default function Page() {
  return (
    <div className="min-h-screen noise" style={{ background: '#090909', color: '#fff' }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={{ background: 'rgba(9,9,9,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🦅</span>
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>Monitor Legislativo</span>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ background: 'rgba(255,30,30,0.1)', border: '1px solid rgba(255,30,30,0.2)' }}>
              <span className="dot-pulse w-1.5 h-1.5 rounded-full" style={{ background: '#ff3535' }} />
              <span style={{ color: '#ff6060', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Ao vivo
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: 500 }}
              className="hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/captura" className="btn btn-primary px-5 py-2.5 text-sm">
              Acesso gratuito
            </Link>
          </div>
        </div>
      </nav>

      {/* ── TICKER ──────────────────────────────────────── */}
      <div className="ticker-wrap py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(180,20,0,0.06)' }}>
        <div className="ticker-inner" style={{ fontSize: 12, color: 'rgba(255,120,80,0.7)', fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          {[...TICKERS, ...TICKERS].map((t, i) => (
            <span key={i} className="flex items-center gap-3">
              <span style={{ color: '#ff3535', fontSize: 8 }}>●</span>
              {t}
              <span style={{ color: 'rgba(255,255,255,0.1)', marginLeft: '1rem' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ HERO ════════════════════════════════════════ */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 pb-20 pt-16 hero-bg overflow-hidden">
        <HeroBG />

        <div className="relative z-10 text-center max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '-0.01em' }}>
            <span style={{ color: '#ff5533' }}>■</span>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'var(--text-hero)', lineHeight: 0.92, fontWeight: 900, letterSpacing: '-0.04em' }}
            className="mb-6">
            <span className="block text-white">O Brasil está</span>
            <span className="block text-gradient-anim">sendo destruído.</span>
            <span className="block" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 'clamp(1.8rem,4vw,3.5rem)', fontWeight: 800, marginTop: '0.2em', letterSpacing: '-0.03em' }}>
              Você não sabe por quem. Ainda.
            </span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
            Enquanto você trabalha e paga seus impostos, 513 deputados aprovam leis que destroem sua liberdade — em silêncio.{' '}
            <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Nossa IA muda isso.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <Link href="/captura" className="btn btn-primary px-8 py-4 text-base font-bold">
              Quero saber a verdade — grátis
            </Link>
            <a href="#produto" className="btn btn-glass px-8 py-4 text-sm">
              Como funciona
            </a>
          </div>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Sem cartão de crédito · Dados 100% oficiais da Câmara
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), transparent)' }} />
        </div>
      </section>

      {/* ══ DANO AO VIVO ════════════════════════════════ */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,60,30,0.7)', marginBottom: 16 }}>
            Contadores em tempo real
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="py-10 sm:py-0 sm:pr-12">
              <LiveCounter base={4_200_000_000} rate={15000} prefix="R$ " label="Em gastos aprovados hoje" />
            </div>
            <div className="py-10 sm:py-0 sm:px-12">
              <LiveCounter base={3_800_000_000} rate={11000} prefix="R$ " label="Em novos impostos" />
            </div>
            <div className="py-10 sm:py-0 sm:pl-12">
              <LiveCounter base={47} rate={0.003} label="PLs perigosos em tramitação" />
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', marginTop: 20, letterSpacing: '0.03em' }}>
            Estimativas baseadas em dados históricos da Câmara dos Deputados do Brasil
          </p>
        </div>
      </section>

      {/* ══ PROBLEMA — SCROLL REVEAL ════════════════════ */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,60,30,0.7)', marginBottom: 32 }}>
            A realidade que escondem
          </p>
          <RevealText text="Enquanto você trabalha, cuida dos seus filhos, paga suas contas — 513 deputados votam projetos que aumentam seus impostos, restringem suas liberdades e enfraquecem sua família. Todo dia. Sem que você saiba." />
        </div>
      </section>

      {/* ══ NÚMEROS ═════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,60,30,0.7)', marginBottom: 48 }}>
            O que aconteceu enquanto você não olhava
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { n: 'R$ 4,9 bi', t: 'Fundo Eleitoral',    d: 'Aprovado para bancar campanhas de quem já está no poder.' },
              { n: '38',        t: 'Novos impostos',      d: 'Aprovados ou ampliados nos últimos 24 meses. Sua renda comprometida.' },
              { n: '127 PLs',   t: 'Contra a família',   d: 'Atacando valores tradicionais, educação dos filhos e liberdade religiosa.' },
              { n: '89%',       t: 'Expandiram o Estado', d: 'Dos deputados votaram projetos que aumentam custo e poder do governo.' },
              { n: '0',         t: 'Portais conservadores',d: 'Nenhuma plataforma entregava análise conservadora automatizada. Até agora.' },
              { n: 'R$ 8.400',  t: 'Por mês, por deputado', d: 'Cota de gabinete média — além do salário de R$33.763.' },
            ].map((item, i) => (
              <div key={i} className="card-gradient-border p-7" style={{ minHeight: 140 }}>
                <div className="text-gradient font-black" style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 8 }}>
                  {item.n}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
                  {item.t}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, lineHeight: 1.5 }}>
                  {item.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUTO ═════════════════════════════════════ */}
      <section id="produto" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,60,30,0.7)', marginBottom: 16 }}>
                A solução
              </p>
              <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
                Uma IA que<br />
                <span className="text-gradient">não dorme.</span><br />
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Nem se vende.</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, lineHeight: 1.7, maxWidth: 400, marginBottom: 32 }}>
                Todo dia às 8h a IA busca todos os PLs e votações da Câmara, analisa com critério conservador e gera o relatório. Você sabe exatamente o que aconteceu — e quem votou o quê.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { n: '01', t: 'Coleta automática', d: 'API oficial da Câmara dos Deputados' },
                  { n: '02', t: 'Análise conservadora', d: 'Score de −10 a +10 por PL e por votação' },
                  { n: '03', t: 'Você recebe o alerta', d: 'Relatório diário no seu email' },
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-4">
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,80,30,0.6)', fontFamily: 'monospace', marginTop: 2, minWidth: 24 }}>
                      {s.n}
                    </span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{s.t}</p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal demo */}
            <div className="card-gradient-border overflow-hidden" style={{ borderRadius: 18 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="flex gap-1.5">
                  {['#ff5f57','#febc2e','#28c840'].map(c => (
                    <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.7 }} />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
                  <span className="dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                    monitor-legislativo · {new Date().toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div style={{ padding: '4px 0' }}>
                {PLS.map((pl, i) => (
                  <div key={i} style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 14 }}
                    className="hover:bg-white/[0.02] transition-colors">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: pl.s > 0 ? '#22c55e' : '#ef4444', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pl.t}
                      </p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', marginTop: 2 }}>{pl.n}</p>
                    </div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 15, flexShrink: 0, color: pl.s > 0 ? '#4ade80' : '#f87171', letterSpacing: '-0.02em' }}>
                      {pl.s > 0 ? '+' : ''}{pl.s.toFixed(1)}
                    </span>
                  </div>
                ))}
                <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>5 projetos · atualizado às 08:00</span>
                  <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 500 }}>● Sistema ativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ RANKING PREVIEW ══════════════════════════════ */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Ranking mockado */}
            <div className="card-gradient-border overflow-hidden" style={{ borderRadius: 18 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Score conservador</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>513 deputados</span>
              </div>
              {[
                { pos: 1, blur: false, s: '+9.4', col: '#4ade80' },
                { pos: 2, blur: false, s: '+8.7', col: '#4ade80' },
                { pos: 3, blur: false, s: '+8.1', col: '#4ade80' },
                { pos: 4, blur: true,  s: '+7.6', col: '#4ade80' },
                { pos: 5, blur: true,  s: '+7.1', col: '#4ade80' },
                { pos: 513, blur: true, s: '−9.2', col: '#f87171' },
              ].map((row, i) => (
                <div key={i} style={{ padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', width: 28, flexShrink: 0 }}>{row.pos}º</span>
                  <div style={{ flex: 1 }}>
                    <div className={row.blur ? 'blur-paywall' : ''}
                      style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.8)', background: row.blur ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: row.blur ? 4 : 0, height: 18, width: row.blur ? 160 : 'auto' }}>
                      {!row.blur && ['João Silva (PL-SP)', 'Carlos Souza (PP-MG)', 'Ana Costa (NOVO-RS)'][i]}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 3 }}
                      className={row.blur ? 'blur-paywall' : ''}>
                      {!row.blur ? ['PL · São Paulo', 'PP · Minas Gerais', 'NOVO · Rio Grande do Sul'][i] : '███ · ██████'}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, color: row.col }}>{row.s}</span>
                </div>
              ))}
              <div style={{ padding: '16px 20px', textAlign: 'center' }}>
                <Link href="/captura" style={{ fontSize: 13, color: 'rgba(255,80,30,0.7)', fontWeight: 500 }}
                  className="hover:text-red-400 transition-colors">
                  Ver ranking completo →
                </Link>
              </div>
            </div>

            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,60,30,0.7)', marginBottom: 16 }}>
                Transparência total
              </p>
              <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
                Você vai saber<br />
                <span className="text-gradient">quem está traindo.</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                Cada deputado tem um score baseado em como votou em projetos analisados pela IA. Quanto mais vota contra o Brasil, menor o score. Sem opiniões — só dados.
              </p>
              <Link href="/captura" className="btn btn-primary px-7 py-3.5 text-sm font-bold">
                Acessar ranking agora →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRICING ══════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-24 px-6" id="precos">
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,60,30,0.7)', marginBottom: 16 }}>
            Simples e direto
          </p>
          <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 48 }}>
            Escolha seu plano
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            {/* Grátis */}
            <div className="card-gradient-border p-8">
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Gratuito</p>
              <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, marginBottom: 4 }}>R$0</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 28 }}>Para começar a enxergar</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Top 10 deputados', '3 PLs por semana', 'Score básico'].map(i => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
                    <span style={{ color: '#22c55e', fontSize: 12 }}>✓</span>{i}
                  </li>
                ))}
                {['Ranking completo', 'Alertas por email', 'Filtros avançados'].map(i => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.2)', textDecoration: 'line-through' }}>
                    <span style={{ fontSize: 12 }}>✗</span>{i}
                  </li>
                ))}
              </ul>
              <Link href="/captura" className="btn btn-glass w-full py-3.5 text-sm font-semibold">
                Acessar grátis
              </Link>
            </div>

            {/* Premium */}
            <div className="card-gradient-border card-red-border p-8 relative" style={{ background: 'rgba(180,20,0,0.06)' }}>
              <div style={{ position: 'absolute', top: -12, left: 24, background: 'linear-gradient(90deg,#ff3535,#ff6030)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Mais popular
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,100,60,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Patriota Premium</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>R$29,90</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>/mês</span>
              </div>
              <p style={{ fontSize: 13, color: '#4ade80', marginBottom: 28, fontWeight: 500 }}>← 7 dias grátis para testar</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['513 deputados — ranking completo', 'Todos os PLs analisados diariamente', 'Alertas por email dos mais perigosos', 'Filtros por partido, estado, score', 'Histórico de 12 meses', 'Badge "Patriota Vigilante" 🦅'].map(i => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ color: '#22c55e', fontSize: 12 }}>✓</span>{i}
                  </li>
                ))}
              </ul>
              <Link href="/assinar" className="btn btn-primary w-full py-4 text-sm font-bold">
                Assinar — 7 dias grátis →
              </Link>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 12 }}>
                Cancele quando quiser · Stripe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(180,20,0,0.08) 0%, transparent 70%)' }}
        className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontSize: 'var(--text-h1)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 24 }}>
            <span style={{ color: '#fff' }}>Você tem</span><br />
            <span className="text-gradient-anim">duas opções.</span>
          </h2>
          <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.35)', maxWidth: 420, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Continuar no escuro — ou saber exatamente o que acontece com o seu dinheiro em Brasília.
          </p>
          <Link href="/captura" className="btn btn-white px-10 py-5 text-base font-bold">
            🦅 Escolho a verdade — acesso grátis
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', marginTop: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Sem cartão · Sem risco · Dados oficiais
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
          <div className="flex items-center gap-2">
            <span>🦅</span>
            <span style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>Monitor Legislativo Conservador</span>
          </div>
          <div className="flex gap-6">
            {[['Privacidade', '/privacidade'], ['Cadastro', '/captura'], ['Premium', '/assinar'], ['Entrar', '/login']].map(([l, h]) => (
              <Link key={l} href={h} className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <p>API Câmara · Análises por IA</p>
        </div>
      </footer>
    </div>
  )
}
