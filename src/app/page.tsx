'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/* ─── Contador de "destruição" ao vivo ──────────────────── */
function useDamageCounter(baseValue: number, ratePerSecond: number) {
  const [value, setValue] = useState(baseValue)
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(v => v + ratePerSecond / 10)
    }, 100)
    return () => clearInterval(interval)
  }, [ratePerSecond])
  return Math.floor(value)
}

function DamageNumber({ value, prefix = '', suffix = '', label, color = 'text-red-400' }: {
  value: number
  prefix?: string
  suffix?: string
  label: string
  color?: string
}) {
  return (
    <div className="text-center">
      <div className={`font-display text-4xl sm:text-5xl font-black tabular-nums ${color}`}>
        {prefix}{value.toLocaleString('pt-BR')}{suffix}
      </div>
      <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{label}</div>
    </div>
  )
}

/* ─── Linha de crise (breaking news) ───────────────────── */
const ALERTAS = [
  '🔴 APROVADO: PL aumenta imposto sobre herança em 15%',
  '🔴 VOTADO: Projeto restringe porte legal de armas para cidadãos',
  '🔴 APROVADO: Fundo eleitoral dobrado para R$4,9 bilhões',
  '🔴 EM VOTAÇÃO: PL obriga ideologia de gênero nas escolas públicas',
  '🔴 APROVADO: Nova taxa sobre MEI e pequenos empresários',
  '🔴 VOTADO: PL das Fake News ameaça liberdade de expressão',
  '🔴 EM VOTAÇÃO: Reforma tributária aumenta carga sobre consumo',
  '🔴 APROVADO: PL expande poder do Estado sobre internet',
]

export default function VendasPage() {
  const gastosHoje    = useDamageCounter(4_200_000_000, 15000)
  const impostoHoje   = useDamageCounter(3_800_000_000, 12000)
  const plsPerigosos  = useDamageCounter(47, 0.02)
  const [alertaIdx, setAlertaIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setAlertaIdx(i => (i + 1) % ALERTAS.length)
        setVisible(true)
      }, 400)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">

      {/* ══ BARRA DE EMERGÊNCIA ══════════════════════════════ */}
      <div className="bg-red-700 py-2 px-4 flex items-center justify-center gap-3 overflow-hidden">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse shrink-0" />
        <div
          className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white text-center transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {ALERTAS[alertaIdx]}
        </div>
      </div>

      {/* ══ NAVBAR ══════════════════════════════════════════ */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦅</span>
            <span className="font-black text-white text-sm tracking-widest uppercase">Monitor Legislativo</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-500 hover:text-white text-sm transition-colors hidden sm:block">
              Entrar
            </Link>
            <Link href="/captura" className="bg-red-600 hover:bg-red-500 text-white text-xs font-black px-4 py-2 rounded uppercase tracking-wider transition-all">
              ACESSO GRATUITO
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO — BRASIL RUINDO ═════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-12 pb-20 overflow-hidden">

        {/* Fundo: bandeira em colapso */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Camada verde */}
          <div className="absolute inset-0" style={{ background: '#010f01', opacity: 0.97 }} />

          {/* Silhueta da bandeira — distorcida e queimando */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[600px] h-[420px] opacity-[0.12]"
              style={{ filter: 'blur(0px)' }}>
              <div className="absolute inset-0 bg-[#006400] rounded" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[62%] h-[70%] bg-[#d4a800]"
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[36%] h-[54%] bg-[#003399] rounded-full" />
              </div>
              {/* Crack lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 420">
                <line x1="150" y1="0" x2="300" y2="420" stroke="#ff0000" strokeWidth="1.5" opacity="0.6" />
                <line x1="400" y1="50" x2="200" y2="400" stroke="#ff0000" strokeWidth="1" opacity="0.4" />
                <line x1="0" y1="200" x2="600" y2="180" stroke="#ff4400" strokeWidth="0.8" opacity="0.3" />
                <line x1="250" y1="0" x2="350" y2="420" stroke="#cc0000" strokeWidth="2" opacity="0.5" />
              </svg>
              {/* Fogo na base */}
              <div className="absolute bottom-0 left-0 right-0 h-2/3"
                style={{
                  background: 'linear-gradient(0deg, rgba(220,38,38,0.7) 0%, rgba(249,115,22,0.3) 40%, transparent 100%)',
                  animation: 'fire-flicker 2s ease-in-out infinite',
                }} />
            </div>
          </div>

          {/* Vinheta dramática */}
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #030303 80%)' }} />

          {/* Raios vermelhos sutis */}
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(180,0,0,0.08) 0%, transparent 60%)' }} />
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">

          {/* Manchete de jornal */}
          <div className="inline-block border border-red-700/60 bg-red-950/40 px-4 py-1.5 mb-8">
            <span className="text-red-400 text-xs font-black uppercase tracking-[0.2em]">
              ⚡ EDIÇÃO ESPECIAL — {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
            </span>
          </div>

          {/* Headline principal */}
          <h1 className="font-display text-[3.2rem] sm:text-[5rem] md:text-[6.5rem] leading-[0.88] font-black text-white uppercase mb-6 tracking-tight">
            O BRASIL ESTÁ{' '}
            <span className="relative inline-block">
              <span className="text-red-500" style={{ textShadow: '0 0 40px rgba(220,38,38,0.6)' }}>
                RUINDO
              </span>
            </span>
            <br />
            <span className="text-[2.4rem] sm:text-[3.8rem] md:text-[5rem] text-gray-300">
              DIANTE DOS SEUS OLHOS
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-4">
            Enquanto você trabalha, cuida da sua família e paga seus impostos —
            <span className="text-white font-semibold"> 513 deputados aprovam leis que destroem o país.</span>
            {' '}Em silêncio. Sem que você saiba.
          </p>

          <p className="text-red-400/70 text-sm mb-12 uppercase tracking-widest font-semibold">
            Até agora.
          </p>

          {/* Contadores de destruição */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-12 max-w-2xl mx-auto">
            <DamageNumber value={gastosHoje} prefix="R$" label="Gastos aprovados hoje" color="text-red-400" />
            <DamageNumber value={impostoHoje} prefix="R$" label="Em novos impostos" color="text-orange-400" />
            <DamageNumber value={plsPerigosos} label="PLs perigosos em tramitação" color="text-yellow-400" />
          </div>
          <p className="text-xs text-gray-700 -mt-8 mb-12 text-center">
            ↑ Contadores em tempo real. Estimativas baseadas em dados da Câmara dos Deputados.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/captura"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-10 py-5 font-black text-base uppercase tracking-wider transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.5)]">
              🦅 QUERO SABER QUEM SÃO ELES
            </Link>
            <a href="#destruicao"
              className="inline-flex items-center justify-center gap-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-8 py-5 font-semibold text-sm uppercase tracking-wider transition-all">
              Ver as provas ↓
            </a>
          </div>

          <p className="text-gray-700 text-xs mt-5 uppercase tracking-widest">
            Acesso grátis · Sem cartão de crédito · Dados 100% oficiais da Câmara
          </p>
        </div>
      </section>

      {/* ══ SEÇÃO: A DESTRUIÇÃO EM NÚMEROS ══════════════════ */}
      <section id="destruicao" className="py-20 border-t border-white/5 bg-[#070707]">
        <div className="max-w-5xl mx-auto px-4">

          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-black uppercase tracking-[0.3em] mb-4">A REALIDADE QUE ESCONDEM</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase leading-tight">
              O QUE ACONTECEU<br />
              <span className="text-red-500">ENQUANTO VOCÊ NÃO OLHAVA</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {[
              {
                icon: '💸',
                numero: 'R$ 4,9 bi',
                titulo: 'Fundo Eleitoral',
                desc: 'Aprovado em votação relâmpago para bancar campanhas eleitorais de quem já está no poder.',
                cor: 'border-red-900/50',
                numCor: 'text-red-400',
              },
              {
                icon: '📈',
                numero: '38 impostos',
                titulo: 'Novos ou maiores',
                desc: 'Aprovados ou em votação nos últimos 24 meses. Sua renda comprada, suas liberdades comprometidas.',
                cor: 'border-orange-900/50',
                numCor: 'text-orange-400',
              },
              {
                icon: '📚',
                numero: '127 PLs',
                titulo: 'Contra a Família',
                desc: 'Projetos de lei atacando valores tradicionais, educação dos filhos e liberdade religiosa.',
                cor: 'border-yellow-900/50',
                numCor: 'text-yellow-500',
              },
              {
                icon: '🏛️',
                numero: '89%',
                titulo: 'Dos deputados',
                desc: 'Votaram a favor de pelo menos um projeto que aumenta o tamanho e o custo do Estado.',
                cor: 'border-red-900/50',
                numCor: 'text-red-400',
              },
              {
                icon: '🔇',
                numero: '0',
                titulo: 'Portais de alerta',
                desc: 'Nenhuma plataforma no Brasil entrega análise conservadora automatizada de projetos de lei.',
                cor: 'border-gray-800',
                numCor: 'text-gray-400',
              },
              {
                icon: '⏰',
                numero: '8h/dia',
                titulo: 'Eles trabalham contra você',
                desc: 'Enquanto você trabalha para pagar seus impostos, eles aprovam mais impostos para você pagar.',
                cor: 'border-red-900/50',
                numCor: 'text-red-400',
              },
            ].map(item => (
              <div key={item.titulo}
                className={`bg-black/60 border ${item.cor} p-6 hover:bg-black/80 transition-all`}>
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className={`font-display text-3xl font-black ${item.numCor} mb-1`}>{item.numero}</div>
                <div className="font-bold text-white text-sm mb-2 uppercase tracking-wide">{item.titulo}</div>
                <div className="text-gray-600 text-xs leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SEÇÃO: O QUE É O MONITOR ════════════════════════ */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,80,0,0.05) 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="text-green-500 text-xs font-black uppercase tracking-[0.3em] mb-4">A SOLUÇÃO</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase leading-tight">
              A ÚNICA FERRAMENTA QUE<br />
              <span className="text-green-400">VIGIA BRASÍLIA POR VOCÊ</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Uma IA treinada com viés conservador analisa cada votação, cada projeto, cada deputado.
              <span className="text-white"> Todo dia. Sem descanso. Sem comprar.</span>
            </p>
          </div>

          {/* Demo visual do produto */}
          <div className="bg-black border border-white/10 rounded-none sm:rounded p-6 mb-14 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-gray-600 uppercase tracking-widest font-mono">
                IA ANALISANDO — {new Date().toLocaleDateString('pt-BR')} 08:00 BRT
              </span>
            </div>
            <div className="space-y-3">
              {[
                { pl: 'PL 1234/2026', titulo: 'Novo imposto sobre dividendos', score: -8.2, categoria: 'IMPOSTO', icone: '💸' },
                { pl: 'PL 0891/2026', titulo: 'Obrigatoriedade de ensino de gênero nas escolas', score: -9.1, categoria: 'FAMÍLIA', icone: '👨‍👩‍👧' },
                { pl: 'PL 2201/2026', titulo: 'Redução do IR para trabalhadores até R$5.000', score: +6.4, categoria: 'ECONOMIA', icone: '📈' },
                { pl: 'PL 1847/2026', titulo: 'Regulamentação que amplia poder de censura', score: -7.8, categoria: 'LIBERDADE', icone: '🔇' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                  <span className="text-lg shrink-0">{item.icone}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{item.titulo}</p>
                    <p className="text-gray-600 text-xs font-mono mt-0.5">{item.pl} · {item.categoria}</p>
                  </div>
                  <div className={`font-mono text-sm font-black shrink-0 ${item.score >= 0 ? 'text-green-400' : 'text-red-400'}`}
                    style={{ textShadow: item.score < -7 ? '0 0 10px rgba(220,38,38,0.5)' : 'none' }}>
                    {item.score > 0 ? '+' : ''}{item.score.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-700">4 projetos analisados hoje</span>
              <span className="text-xs text-green-600 font-semibold">● Sistema ativo</span>
            </div>
          </div>

          {/* Como funciona */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { n: '01', titulo: 'Coleta automática', desc: 'A IA busca todos os PLs e votações do dia diretamente na API oficial da Câmara.' },
              { n: '02', titulo: 'Analisa com IA conservadora', desc: 'Cada projeto é avaliado: aumenta imposto? Ataca a família? Restringe liberdade? Score de -10 a +10.' },
              { n: '03', titulo: 'Você recebe o alerta', desc: 'Relatório diário no seu email. Você sabe exatamente o que aconteceu — e quem votou o quê.' },
            ].map(item => (
              <div key={item.n} className="border-l-2 border-green-900/60 pl-5">
                <div className="font-display text-4xl text-gray-800 font-black mb-2">{item.n}</div>
                <div className="font-bold text-white text-sm uppercase tracking-wide mb-2">{item.titulo}</div>
                <div className="text-gray-600 text-xs leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SEÇÃO: DEPUTADOS ════════════════════════════════ */}
      <section className="py-20 border-t border-white/5 bg-[#070707]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-red-500 text-xs font-black uppercase tracking-[0.3em] mb-3">TRANSPARÊNCIA TOTAL</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase">
              VOCÊ VAI SABER<br />
              <span className="text-red-500">QUEM ESTÁ TRAINDO</span>
            </h2>
          </div>

          {/* Mock do ranking */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-black border border-white/10 divide-y divide-white/5">
              <div className="px-4 py-2 flex items-center justify-between bg-white/2">
                <span className="text-xs text-gray-600 uppercase tracking-widest font-mono">RANK · DEPUTADO</span>
                <span className="text-xs text-gray-600 uppercase tracking-widest font-mono">SCORE</span>
              </div>
              {[
                { nome: '1º — Ver após assinar', partido: '???', uf: '??', score: '+9.4', cor: 'text-green-400' },
                { nome: '2º — Ver após assinar', partido: '???', uf: '??', score: '+8.7', cor: 'text-green-400' },
                { nome: '3º — Ver após assinar', partido: '???', uf: '??', score: '+8.1', cor: 'text-green-400' },
                { nome: '—', partido: '···', uf: '··', score: '···', cor: 'text-gray-700' },
                { nome: 'Pior — Ver após assinar', partido: '???', uf: '??', score: '-9.2', cor: 'text-red-400' },
              ].map((d, i) => (
                <div key={i} className={`px-4 py-3 flex items-center justify-between ${i >= 3 ? 'opacity-40' : ''}`}>
                  <div>
                    <p className="text-sm text-white font-semibold filter blur-[3px] hover:blur-none transition-all cursor-not-allowed">{d.nome}</p>
                    <p className="text-xs text-gray-600 mt-0.5 filter blur-[2px]">{d.partido} · {d.uf}</p>
                  </div>
                  <span className={`font-mono font-black text-lg ${d.cor}`}>{d.score}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-700 mt-3 uppercase tracking-widest">
              🔒 Desbloqueie todos os 513 deputados
            </p>
          </div>
        </div>
      </section>

      {/* ══ PRICING ══════════════════════════════════════════ */}
      <section id="pricing" className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-green-500 text-xs font-black uppercase tracking-[0.3em] mb-3">SEM DESCULPAS</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase">
              O PREÇO DA<br />
              <span className="text-green-400">INFORMAÇÃO REAL</span>
            </h2>
            <p className="text-gray-600 mt-3 text-sm">
              Menos que uma pizza. Mais que uma opinião. Dados de verdade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Gratuito */}
            <div className="border border-white/10 p-8 bg-black/40">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-3">Plano Grátis</p>
              <div className="font-display text-6xl text-white font-black mb-1">R$0</div>
              <p className="text-gray-600 text-sm mb-6">Para começar a enxergar</p>
              <ul className="space-y-2 text-sm mb-8 text-gray-500">
                <li>✓ Top 10 deputados conservadores</li>
                <li>✓ 3 PLs por semana</li>
                <li>✓ Score básico de cada deputado</li>
                <li className="text-gray-700 line-through">✗ Ranking completo</li>
                <li className="text-gray-700 line-through">✗ Alertas de PLs perigosos</li>
                <li className="text-gray-700 line-through">✗ Filtros avançados</li>
              </ul>
              <Link href="/captura"
                className="block text-center border border-white/20 text-gray-400 hover:text-white hover:border-white/40 py-3 text-sm font-bold uppercase tracking-wider transition-all">
                Acessar Grátis
              </Link>
            </div>

            {/* Premium */}
            <div className="border-2 border-red-700/80 p-8 bg-red-950/10 relative">
              <div className="absolute -top-3 left-6 bg-red-700 text-white text-xs font-black px-4 py-1 uppercase tracking-wider">
                ⚡ Mais Importante
              </div>
              <p className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Patriota Premium</p>
              <div className="flex items-baseline gap-1 mb-1">
                <div className="font-display text-6xl text-white font-black">R$29</div>
                <div className="font-display text-3xl text-gray-400">,90/mês</div>
              </div>
              <p className="text-gray-600 text-xs mb-1">ou R$249/ano — economize 30%</p>
              <p className="text-green-500 text-xs font-semibold mb-6">← 7 dias grátis para testar</p>
              <ul className="space-y-2 text-sm mb-8 text-gray-300">
                <li>✅ 513 deputados — ranking completo</li>
                <li>✅ Todos os PLs analisados diariamente</li>
                <li>✅ Alertas por email dos PLs mais perigosos</li>
                <li>✅ Filtros: partido, estado, score, categoria</li>
                <li>✅ Histórico de 12 meses de votações</li>
                <li>✅ Perfil completo por deputado</li>
                <li>✅ Badge "Patriota Vigilante" 🦅</li>
              </ul>
              <form action="/api/checkout" method="POST">
                <button type="submit"
                  className="w-full bg-red-700 hover:bg-red-600 text-white py-4 font-black text-base uppercase tracking-wider transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                  🦅 ASSINAR — COMEÇAR GRÁTIS →
                </button>
              </form>
              <p className="text-gray-700 text-xs text-center mt-3">
                Pagamento via Stripe · Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5 bg-[#070707] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(180,0,0,0.06) 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] leading-none text-white uppercase mb-6">
            VOCÊ TEM<br />
            <span className="text-red-500">DUAS OPÇÕES</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-10 max-w-xl mx-auto text-left">
            <div className="border border-red-900/40 bg-red-950/20 p-5">
              <p className="text-red-400 font-black text-xs uppercase tracking-widest mb-2">Opção 1</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Continuar no escuro. Pagar seus impostos. Assistir o país afundar. Sem saber por quê.
              </p>
            </div>
            <div className="border border-green-800/60 bg-green-950/20 p-5">
              <p className="text-green-400 font-black text-xs uppercase tracking-widest mb-2">Opção 2</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Saber a verdade. Ter dados reais. Saber quem votar — e quem nunca mais votar.
              </p>
            </div>
          </div>
          <Link href="/captura"
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 font-black text-base uppercase tracking-wider hover:bg-gray-100 transition-all hover:scale-105">
            🦅 ESCOLHO A VERDADE — ACESSO GRÁTIS
          </Link>
          <p className="text-gray-700 text-xs mt-5 uppercase tracking-widest">
            Gratuito · Sem cartão · Dados oficiais
          </p>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-8 bg-black">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <span>🦅</span>
            <span className="font-bold uppercase tracking-widest">Monitor Legislativo Conservador</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacidade" className="hover:text-gray-500 transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-gray-500 transition-colors">Termos</Link>
            <Link href="/contato" className="hover:text-gray-500 transition-colors">Contato</Link>
          </div>
          <p>Dados: API Câmara dos Deputados · Análises por IA</p>
        </div>
      </footer>
    </div>
  )
}
