'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── Live Counter ──────────────────────────────────── */
function LiveCounter({ base, rate, prefix = '', label }: {
  base: number; rate: number; prefix?: string; label: string
}) {
  const [val, setVal] = useState(base)
  useEffect(() => {
    const start = Date.now()
    const t = setInterval(() => setVal(base + ((Date.now() - start) / 1000) * rate), 120)
    return () => clearInterval(t)
  }, [base, rate])
  return (
    <div className="counter-num">
      <div className="text-gradient font-black tabular-nums"
        style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
        {prefix}{Math.floor(val).toLocaleString('pt-BR')}
      </div>
      <p className="mt-2 uppercase tracking-widest"
        style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
        {label}
      </p>
    </div>
  )
}

/* ─── Scroll word reveal ────────────────────────────── */
function RevealText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const fn = () => {
      const rect = el.getBoundingClientRect()
      setProgress(Math.min(1, Math.max(0, 1 - (rect.top - window.innerHeight * 0.15) / (window.innerHeight * 0.7))))
    }
    window.addEventListener('scroll', fn, { passive: true }); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <p ref={ref} className="flex flex-wrap gap-x-[0.4em] gap-y-1"
      style={{ fontSize: 'clamp(1.4rem,3.5vw,2.6rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.35 }}>
      {text.split(' ').map((word, i, arr) => {
        const t = i / arr.length
        const lit = progress > t + 0.06
        return (
          <span key={i} className="word transition-colors duration-300" style={{ color: lit ? 'rgba(255,255,255,0.92)' : progress > t ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }}>
            {word}
          </span>
        )
      })}
    </p>
  )
}

/* ─── Background neutro sofisticado ────────────────── */
function HeroBG() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Glow sutil no topo — como Linear/Vercel */}
      <div style={{
        position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)',
        width: '80vw', height: '60vh',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)',
      }} />
      {/* Glow vermelho muito sutil no rodapé */}
      <div style={{
        position: 'absolute', bottom: -100, left: '50%', transform: 'translateX(-50%)',
        width: '60vw', height: '40vh',
        background: 'radial-gradient(ellipse, rgba(220,30,0,0.07) 0%, transparent 70%)',
      }} />
    </div>
  )
}

/* ─── Ticker ────────────────────────────────────────── */
const TICKERS = [
  'PL 1234 · Novo imposto aprovado em 1ª votação',
  'PL 0891 · Ideologia de gênero obrigatória nas escolas',
  'Fundo Eleitoral · R$ 4,9 bi aprovados para campanhas',
  'PL 2630 · Lei das Fake News ameaça liberdade de expressão',
  'PL 0412 · Nova taxa sobre MEI aprovada',
  'PL 3301 · Censura de redes sociais avança na Câmara',
]

/* ─── Demo PLs ──────────────────────────────────────── */
const PLS = [
  { n: 'PL 1234/2026', t: 'Novo imposto sobre dividendos',              s: -8.2 },
  { n: 'PL 0891/2026', t: 'Ideologia de gênero obrigatória em escolas', s: -9.4 },
  { n: 'PL 2201/2026', t: 'Redução do IR para renda até R$5.000',       s: +6.7 },
  { n: 'PL 1847/2026', t: 'Censura de redes sociais',                   s: -7.1 },
  { n: 'PL 3302/2026', t: 'Desburocratização para pequenas empresas',   s: +8.3 },
]

/* ─── Label de seção ────────────────────────────────── */
const SectionLabel = ({ children }: { children: string }) => (
  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,80,40,0.65)', marginBottom: 16 }}>
    {children}
  </p>
)

/* ─── Divisor de seção ──────────────────────────────── */
const S = 'border-t border-white/[0.06]'

/* ══════════════════════════════════════════════════════ */

export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: '#090909', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── NAV ──────────────────────────────────────── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(9,9,9,0.9)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between" style={{ padding: '0 24px', height: 56 }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 18 }}>🦅</span>
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>Monitor Legislativo</span>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full"
              style={{ background: 'rgba(255,40,40,0.08)', border: '1px solid rgba(255,40,40,0.15)', padding: '3px 10px' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff3535', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,80,60,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ao vivo</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login"
              style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 500, padding: '8px 12px' }}
              className="hidden sm:block hover:text-white transition-colors rounded-lg hover:bg-white/5">
              Entrar
            </Link>
            <Link href="/captura" className="btn btn-primary"
              style={{ padding: '9px 18px', fontSize: 14, borderRadius: 10 }}>
              Acesso gratuito
            </Link>
          </div>
        </div>
      </header>

      {/* ── TICKER ───────────────────────────────────── */}
      <div className="ticker-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,40,0,0.04)', padding: '9px 0' }}>
        <div className="ticker-inner" style={{ fontSize: 11, color: 'rgba(255,100,60,0.6)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {[...TICKERS, ...TICKERS].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#ff3535', fontSize: 7 }}>●</span>{t}
              <span style={{ color: 'rgba(255,255,255,0.08)', marginLeft: 12 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ HERO ═════════════════════════════════════ */}
      <section className="relative hero-bg overflow-hidden"
        style={{ minHeight: '92svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(48px,8vw,96px) 24px clamp(64px,10vw,120px)' }}>
        <HeroBG />

        <div className="relative w-full max-w-4xl mx-auto text-center" style={{ zIndex: 1 }}>

          {/* Badge data */}
          <div className="inline-flex items-center gap-2 rounded-full mb-8"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', padding: '5px 14px', fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '-0.01em' }}>
            <span style={{ color: '#ff4433', fontSize: 8 }}>■</span>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>

          {/* Headline */}
          <h1 className="hero-headline"
            style={{ fontSize: 'clamp(3rem,9vw,7.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.92, marginBottom: '0.55em' }}>
            <span style={{ display: 'block', color: '#fff' }}>O Brasil está</span>
            <span className="text-gradient-anim" style={{ display: 'block' }}>sendo destruído.</span>
            <span className="hero-sub" style={{ display: 'block', fontSize: 'clamp(1.6rem,4.5vw,3.2rem)', color: 'rgba(255,255,255,0.3)', fontWeight: 800, marginTop: '0.18em', letterSpacing: '-0.03em' }}>
              Você não sabe por quem. Ainda.
            </span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: 'clamp(15px,2vw,17px)', color: 'rgba(255,255,255,0.42)', maxWidth: 460, margin: '0 auto 2.5rem', lineHeight: 1.65, letterSpacing: '-0.01em' }}>
            Enquanto você trabalha, 513 deputados aprovam leis que destroem sua liberdade.{' '}
            <span style={{ color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>Nossa IA muda isso.</span>
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }} className="sm:flex-row sm:justify-center">
            <button
              onClick={() => document.getElementById('cta-final')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-primary w-full sm:w-auto"
              style={{ padding: 'clamp(13px,2vw,17px) clamp(24px,4vw,36px)', fontSize: 'clamp(14px,1.6vw,16px)', fontWeight: 700, borderRadius: 12 }}>
              Quero saber a verdade — grátis
            </button>
            <a href="#produto" className="btn btn-glass w-full sm:w-auto"
              style={{ padding: 'clamp(13px,2vw,17px) clamp(20px,3vw,28px)', fontSize: 14, borderRadius: 12 }}>
              Como funciona
            </a>
          </div>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Sem cartão · Dados 100% oficiais da Câmara
          </p>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.2 }}>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.8), transparent)' }} />
        </div>
      </section>

      {/* ══ CONTADORES ═══════════════════════════════ */}
      <section className={S} style={{ padding: 'clamp(48px,7vw,80px) 24px' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Contadores em tempo real</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0 }}>
            {[
              { base: 4_200_000_000, rate: 15000, prefix: 'R$ ', label: 'Em gastos aprovados hoje' },
              { base: 3_800_000_000, rate: 11000, prefix: 'R$ ', label: 'Em novos impostos' },
              { base: 47,            rate: 0.003, prefix: '',   label: 'PLs perigosos em tramitação' },
            ].map((c, i, arr) => (
              <div key={i} style={{ padding: 'clamp(20px,3vw,32px) 0', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingRight: i < arr.length - 1 ? 'clamp(20px,3vw,40px)' : 0, paddingLeft: i > 0 ? 'clamp(20px,3vw,40px)' : 0 }}>
                <LiveCounter {...c} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.14)', marginTop: 20, letterSpacing: '0.03em' }}>
            Estimativas baseadas em dados históricos da Câmara dos Deputados
          </p>
        </div>
      </section>

      {/* ══ SCROLL REVEAL ════════════════════════════ */}
      <section className={S} style={{ padding: 'clamp(64px,10vw,120px) 24px' }}>
        <div className="max-w-4xl mx-auto">
          <SectionLabel>A realidade que escondem</SectionLabel>
          <RevealText text="Enquanto você trabalha, cuida dos seus filhos e paga suas contas — 513 deputados votam projetos que aumentam seus impostos, restringem suas liberdades e enfraquecem sua família. Todo dia. Sem que você saiba." />
        </div>
      </section>

      {/* ══ NÚMEROS ══════════════════════════════════ */}
      <section className={S} style={{ padding: 'clamp(48px,7vw,80px) 24px' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>O que aconteceu enquanto você não olhava</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 10 }}>
            {[
              { n: 'R$ 4,9 bi', t: 'Fundo Eleitoral',      d: 'Aprovado para bancar campanhas de quem já está no poder.' },
              { n: '38',        t: 'Novos impostos',        d: 'Aprovados nos últimos 24 meses. Sua renda comprometida.' },
              { n: '127 PLs',   t: 'Contra a família',     d: 'Atacando valores tradicionais e liberdade religiosa.' },
              { n: '89%',       t: 'Expandiram o Estado',   d: 'Dos deputados apoiaram pelo menos um projeto de mais governo.' },
              { n: '0',         t: 'Portais conservadores', d: 'Nenhuma plataforma entregava análise conservadora. Até agora.' },
              { n: 'R$ 8.400',  t: 'Por deputado/mês',     d: 'Cota de gabinete — além do salário de R$33.763.' },
            ].map((item, i) => (
              <div key={i} className="card-gradient-border"
                style={{ padding: 'clamp(20px,3vw,28px)', borderRadius: 14 }}>
                <div className="text-gradient font-black"
                  style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 8 }}>
                  {item.n}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{item.t}</div>
                <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13, lineHeight: 1.55 }}>{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUTO ══════════════════════════════════ */}
      <section id="produto" className={S} style={{ padding: 'clamp(48px,7vw,80px) 24px' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(32px,5vw,64px)', alignItems: 'center' }}>

            {/* Copy */}
            <div>
              <SectionLabel>A solução</SectionLabel>
              <h2 style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05, marginBottom: 20 }}>
                Uma IA que<br />
                <span className="text-gradient">não dorme.</span><br />
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>Nem se vende.</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 15, lineHeight: 1.7, maxWidth: 380, marginBottom: 32 }}>
                Todo dia às 8h a IA analisa todos os PLs e votações da Câmara com critério conservador. Você sabe exatamente o que aconteceu — e quem votou o quê.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { n: '01', t: 'Coleta automática',     d: 'API oficial da Câmara dos Deputados' },
                  { n: '02', t: 'Análise conservadora',  d: 'Score de −10 a +10 por PL e votação' },
                  { n: '03', t: 'Você recebe o alerta',  d: 'Relatório diário direto no seu email' },
                ].map(s => (
                  <div key={s.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,70,30,0.55)', fontFamily: 'monospace', minWidth: 22, marginTop: 2 }}>{s.n}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.82)' }}>{s.t}</p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal */}
            <div className="card-gradient-border" style={{ borderRadius: 18, overflow: 'hidden' }}>
              {/* Barra do terminal */}
              <div style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.65 }} />)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
                    monitor · {new Date().toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              {/* Linhas */}
              {PLS.map((pl, i) => (
                <div key={i} style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.15s' }}
                  className="hover:bg-white/[0.02]">
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: pl.s > 0 ? '#22c55e' : '#ef4444', flexShrink: 0, opacity: 0.85 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.78)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.t}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', fontFamily: 'monospace', marginTop: 2 }}>{pl.n}</p>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 15, flexShrink: 0, color: pl.s > 0 ? '#4ade80' : '#f87171', letterSpacing: '-0.02em' }}>
                    {pl.s > 0 ? '+' : ''}{pl.s.toFixed(1)}
                  </span>
                </div>
              ))}
              <div style={{ padding: '10px 18px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>5 projetos · 08:00</span>
                <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 500 }}>● Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ RANKING PREVIEW ══════════════════════════ */}
      <section className={S} style={{ padding: 'clamp(48px,7vw,80px) 24px' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(32px,5vw,64px)', alignItems: 'center' }}>

            {/* Copy */}
            <div style={{ order: 2 }} className="lg:order-first">
              <SectionLabel>Transparência total</SectionLabel>
              <h2 style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05, marginBottom: 20 }}>
                Você vai saber<br />
                <span className="text-gradient">quem está traindo.</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                Score baseado em cada votação. Quanto mais vota contra o Brasil, menor o número. Sem opiniões — só dados oficiais.
              </p>
              <Link href="/captura" className="btn btn-primary"
                style={{ padding: '13px 24px', fontSize: 14, fontWeight: 700, borderRadius: 12 }}>
                Acessar ranking →
              </Link>
            </div>

            {/* Ranking mock */}
            <div className="card-gradient-border" style={{ borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Score conservador</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>513 deputados</span>
              </div>
              {[
                { pos: 1,   show: true,  s: '+9.4', c: '#4ade80', nome: 'João Silva',    info: 'PL · SP' },
                { pos: 2,   show: true,  s: '+8.7', c: '#4ade80', nome: 'Carlos Souza',  info: 'PP · MG' },
                { pos: 3,   show: true,  s: '+8.1', c: '#4ade80', nome: 'Ana Costa',     info: 'NOVO · RS' },
                { pos: 4,   show: false, s: '+7.6', c: '#4ade80', nome: '',              info: '' },
                { pos: 5,   show: false, s: '+7.1', c: '#4ade80', nome: '',              info: '' },
                { pos: 513, show: false, s: '−9.2', c: '#f87171', nome: '',              info: '' },
              ].map((row, i) => (
                <div key={i} style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', minWidth: 26 }}>{row.pos}º</span>
                  <div style={{ flex: 1 }}>
                    {row.show
                      ? <><p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.78)' }}>{row.nome}</p><p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 2 }}>{row.info}</p></>
                      : <><div className="blur-paywall" style={{ height: 14, width: 120, background: 'rgba(255,255,255,0.12)', borderRadius: 4 }} /><div className="blur-paywall" style={{ height: 10, width: 70, background: 'rgba(255,255,255,0.07)', borderRadius: 3, marginTop: 4 }} /></>
                    }
                  </div>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 15, color: row.c }}>{row.s}</span>
                </div>
              ))}
              <div style={{ padding: '14px 18px', textAlign: 'center' }}>
                <Link href="/captura" style={{ fontSize: 13, color: 'rgba(255,70,30,0.65)', fontWeight: 500 }}
                  className="hover:text-red-400 transition-colors">
                  Ver ranking completo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRICING ══════════════════════════════════ */}
      <section id="precos" className={S} style={{ padding: 'clamp(48px,7vw,80px) 24px' }}>
        <div className="max-w-4xl mx-auto" style={{ textAlign: 'center' }}>
          <SectionLabel>Simples e direto</SectionLabel>
          <h2 style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: 'clamp(32px,5vw,48px)' }}>
            Escolha seu plano
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 12, textAlign: 'left', maxWidth: 640, margin: '0 auto' }}>

            {/* Grátis */}
            <div className="card-gradient-border" style={{ padding: 'clamp(24px,4vw,36px)', borderRadius: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>Gratuito</p>
              <div style={{ fontSize: 'clamp(2.8rem,6vw,3.8rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, marginBottom: 6 }}>R$0</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', marginBottom: 24 }}>Para começar a enxergar</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {['Top 10 deputados', '3 PLs por semana', 'Score básico'].map(i => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, color: 'rgba(255,255,255,0.52)' }}>
                    <span style={{ color: '#22c55e', fontSize: 11, flexShrink: 0 }}>✓</span>{i}
                  </li>
                ))}
                {['Ranking completo', 'Alertas por email', 'Filtros avançados'].map(i => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, color: 'rgba(255,255,255,0.18)', textDecoration: 'line-through' }}>
                    <span style={{ fontSize: 11, flexShrink: 0 }}>✗</span>{i}
                  </li>
                ))}
              </ul>
              <Link href="/captura" className="btn btn-glass w-full" style={{ padding: '13px 20px', fontSize: 14, fontWeight: 600, borderRadius: 10, justifyContent: 'center' }}>
                Acessar grátis
              </Link>
            </div>

            {/* Premium */}
            <div className="card-gradient-border card-red-border relative" style={{ padding: 'clamp(24px,4vw,36px)', borderRadius: 16, background: 'rgba(180,20,0,0.05)' }}>
              <div style={{ position: 'absolute', top: -12, left: 20, background: 'linear-gradient(90deg,#ff3535,#ff5020)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Mais popular
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,90,50,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>Premium</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
                <span style={{ fontSize: 'clamp(2.8rem,6vw,3.8rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>R$29,90</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>/mês</span>
              </div>
              <p style={{ fontSize: 13, color: '#4ade80', fontWeight: 500, marginBottom: 24 }}>7 dias grátis para testar</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {['513 deputados — ranking completo', 'Todos os PLs analisados diariamente', 'Alertas por email dos mais perigosos', 'Filtros por partido, estado, score', 'Histórico de 12 meses'].map(i => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, color: 'rgba(255,255,255,0.68)' }}>
                    <span style={{ color: '#22c55e', fontSize: 11, flexShrink: 0 }}>✓</span>{i}
                  </li>
                ))}
              </ul>
              <Link href="/assinar" className="btn btn-primary w-full" style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, borderRadius: 10, justifyContent: 'center' }}>
                Assinar — 7 dias grátis →
              </Link>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: 10 }}>
                Cancele quando quiser · Stripe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════ */}
      <section id="cta-final" className={S} style={{ padding: 'clamp(80px,12vw,140px) 24px', textAlign: 'center', background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(200,20,0,0.06) 0%, transparent 70%)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontSize: 'clamp(2.4rem,7vw,5.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.93, marginBottom: 24 }}>
            <span style={{ color: '#fff' }}>Você tem</span><br />
            <span className="text-gradient-anim">duas opções.</span>
          </h2>
          <p style={{ fontSize: 'clamp(14px,1.8vw,17px)', color: 'rgba(255,255,255,0.33)', maxWidth: 400, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Continuar no escuro — ou saber o que acontece com o seu dinheiro em Brasília.
          </p>
          <Link href="/captura" className="btn btn-white"
            style={{ padding: 'clamp(14px,2vw,18px) clamp(28px,5vw,44px)', fontSize: 'clamp(14px,1.6vw,16px)', fontWeight: 700, borderRadius: 12, display: 'inline-flex' }}>
            🦅 Escolho a verdade — acesso grátis
          </Link>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.14)', marginTop: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Sem cartão · Sem risco · Dados oficiais
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className={S} style={{ padding: 'clamp(24px,4vw,36px) 24px' }}>
        <div className="max-w-6xl mx-auto"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🦅</span>
            <span style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>Monitor Legislativo Conservador</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {[['Privacidade','/privacidade'],['Cadastro','/captura'],['Premium','/assinar'],['Entrar','/login']].map(([l,h]) => (
              <Link key={l} href={h} className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.15)' }}>API Câmara · Análises por IA</p>
        </div>
      </footer>
    </div>
  )
}
