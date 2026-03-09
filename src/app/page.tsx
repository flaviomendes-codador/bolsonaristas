import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { PoliticianCard } from '@/components/PoliticianCard'
import { BillCard } from '@/components/BillCard'
import type { Politician, Bill } from '@/lib/supabase'

export const revalidate = 3600

async function getTopPoliticians(): Promise<Politician[]> {
  const { data } = await supabase
    .from('politicians').select('*')
    .order('score_atual', { ascending: false }).limit(5)
  return (data as Politician[]) ?? []
}

async function getWorstPoliticians(): Promise<Politician[]> {
  const { data } = await supabase
    .from('politicians').select('*')
    .order('score_atual', { ascending: true }).limit(5)
  return (data as Politician[]) ?? []
}

async function getRecentBills(): Promise<Bill[]> {
  const { data } = await supabase
    .from('bills').select('*')
    .order('analisado_em', { ascending: false }).limit(3)
  return (data as Bill[]) ?? []
}

export default async function LandingPage() {
  const [topPols, worstPols, recentBills] = await Promise.all([
    getTopPoliticians(),
    getWorstPoliticians(),
    getRecentBills(),
  ])

  return (
    <main className="min-h-screen bg-bg-base text-gray-100 overflow-hidden">

      {/* ── NAVBAR ───────────────────────────────────────── */}
      <nav className="glass-card border-b border-verde-muted/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:animate-shake">🦅</span>
            <div>
              <span className="font-bold text-verde-glow text-base tracking-wide">Monitor Legislativo</span>
              <span className="hidden sm:block text-xs text-gray-600 leading-none">IA Conservadora</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Badge ao vivo */}
            <div className="hidden sm:flex items-center gap-1.5 bg-red-950/60 border border-red-800/40 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">AO VIVO</span>
            </div>
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors px-3 py-1.5"
            >
              Entrar
            </Link>
            <Link
              href="/assinar"
              className="btn-gold text-sm px-4 py-2 rounded-lg transition-all"
            >
              Assinar — R$29,90/mês
            </Link>
          </div>
        </div>
      </nav>

      {/* ── TICKER DE ALERTA ─────────────────────────────── */}
      <div className="bg-red-950/40 border-b border-red-800/30 py-2 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-content text-xs text-red-300 font-semibold uppercase tracking-widest">
            {[
              '⚠️ 513 deputados votando hoje — você sabe o que eles decidiram?',
              '🚨 IA detectou 3 projetos de lei perigosos na semana',
              '🦅 Score conservador atualizado todo dia às 8h',
              '💸 Propostas de aumento de imposto identificadas',
              '👨‍👩‍👧‍👦 Projetos contra a família em tramitação',
              '⚠️ 513 deputados votando hoje — você sabe o que eles decidiram?',
              '🚨 IA detectou 3 projetos de lei perigosos na semana',
              '🦅 Score conservador atualizado todo dia às 8h',
              '💸 Propostas de aumento de imposto identificadas',
              '👨‍👩‍👧‍👦 Projetos contra a família em tramitação',
            ].map((item, i) => (
              <span key={i} className="inline-block">{item}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-20 hero-bg overflow-hidden">

        {/* Bandeira do Brasil queimando — fundo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.07]">
          <div className="relative w-[700px] h-[480px] animate-fire-flicker">
            {/* Verde */}
            <div className="absolute inset-0 bg-[#009c3b] rounded" />
            {/* Losango amarelo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-[65%] h-[72%] bg-[#ffdf00]"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              />
            </div>
            {/* Círculo azul */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[38%] h-[57%] bg-[#003580] rounded-full" />
            </div>
            {/* Fogo */}
            <div
              className="absolute inset-0 rounded"
              style={{
                background: 'linear-gradient(180deg, transparent 0%, transparent 20%, rgba(249,115,22,0.5) 55%, rgba(220,38,38,0.8) 75%, rgba(153,27,27,0.98) 100%)',
                mixBlendMode: 'multiply',
              }}
            />
          </div>
        </div>

        {/* Ember particles */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="ember" style={{ left: `${15 + i * 18}%`, animationDelay: `${i * 0.6}s` }} />
          ))}
        </div>

        {/* Gradiente escuro para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/60 via-transparent to-bg-base/80 pointer-events-none" />

        {/* Conteúdo */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">

          {/* Badge urgência */}
          <div className="inline-flex items-center gap-2 bg-red-950/70 border border-red-700/50 rounded-full px-5 py-2 mb-8 urgency-badge">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-300 text-sm font-bold uppercase tracking-widest">
              Eles estão votando agora. Você sabe o quê?
            </span>
          </div>

          {/* Headline principal */}
          <h1 className="display-font text-[5rem] sm:text-[7rem] md:text-[9rem] leading-none text-white mb-4 tracking-wide">
            ENQUANTO VOCÊ{' '}
            <span className="fire-text">DORME</span>
            <br />
            <span className="text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] text-gray-300">
              513 DEPUTADOS DECIDEM
            </span>
            <br />
            <span className="gold-text">O SEU FUTURO</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Nossa IA não dorme. Não se vende. Não tem medo.<br />
            <span className="text-verde-glow font-semibold">Cada voto deles é analisado. Cada traição é registrada.</span>
          </p>

          <p className="text-sm text-gray-600 mb-12 uppercase tracking-widest">
            Impostos · Família · Liberdades · Segurança · Soberania
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/assinar"
              className="btn-gold inline-flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-black uppercase tracking-wide transition-all"
            >
              🦅 Quero Saber a Verdade
              <span className="text-bg-base/70 text-base font-bold">R$29,90/mês</span>
            </Link>
            <a
              href="#ranking"
              className="glass-card inline-flex items-center gap-2 text-gray-300 hover:text-verde-glow px-8 py-5 rounded-xl font-semibold transition-all"
            >
              Ver Ranking Grátis ↓
            </a>
          </div>

          {/* Prova social */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            {[
              { n: '513', label: 'Deputados monitorados', color: 'text-verde-glow' },
              { n: '24/7', label: 'IA em operação', color: 'text-gold-bright' },
              { n: '100%', label: 'Dados oficiais da Câmara', color: 'text-blue-400' },
            ].map(item => (
              <div key={item.n} className="text-center">
                <div className={`display-font text-5xl ${item.color}`}>{item.n}</div>
                <div className="text-gray-600 text-sm mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-verde-muted/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-verde-base rounded-full" />
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="divider-fire mb-20" />
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="badge-verde text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              Tecnologia
            </span>
            <h2 className="display-font text-5xl sm:text-6xl text-white mt-4">
              COMO O <span className="gold-text">SCORE CONSERVADOR</span> FUNCIONA
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Sem viés humano. Sem patrocinadores políticos. Dados brutos + IA = verdade pura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Linha conectora */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-verde-muted via-gold-base to-verde-muted" />

            {[
              {
                step: '01',
                icon: '📡',
                title: 'Coleta Automática',
                desc: 'Todo dia às 8h, nossa IA acessa a API oficial da Câmara dos Deputados e baixa todos os projetos de lei e votações do dia.',
                color: 'border-verde-muted/30',
              },
              {
                step: '02',
                icon: '🧠',
                title: 'Análise Conservadora',
                desc: 'Claude AI analisa cada PL: aumenta imposto? Restringe liberdade? Vai contra a família? Score de -10 a +10 com justificativa.',
                color: 'border-gold-base/30',
              },
              {
                step: '03',
                icon: '🏆',
                title: 'Score do Deputado',
                desc: 'O voto de cada deputado em cada PL é registrado. Quem vota com o Brasil sobe. Quem trai afunda. Sem escapatória.',
                color: 'border-verde-muted/30',
              },
            ].map((item) => (
              <div key={item.step} className={`glass-card rounded-2xl p-8 border ${item.color} relative`}>
                <span className="display-font text-6xl text-gray-800 absolute top-4 right-6">{item.step}</span>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-black text-white text-xl mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RANKING TOP ──────────────────────────────────── */}
      <section id="ranking" className="py-20 bg-bg-surface/30">
        <div className="divider-verde mb-0" />
        <div className="max-w-6xl mx-auto px-4 pt-16">
          <div className="text-center mb-12">
            <span className="badge-verde text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              Ranking ao vivo
            </span>
            <h2 className="display-font text-5xl sm:text-6xl text-white mt-4">
              🏆 OS MAIS <span className="verde-glow-text">CONSERVADORES</span>
            </h2>
            <p className="text-gray-500 mt-2">Top 5 deputados com maior score conservador</p>
          </div>

          {topPols.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {topPols.map((p, i) => (
                <PoliticianCard key={p.id} politician={p} rank={i + 1} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center mb-8 border border-verde-muted/20">
              <div className="text-5xl mb-4">⏳</div>
              <p className="text-verde-glow font-bold text-lg">Carregando dados dos deputados...</p>
              <p className="text-gray-600 text-sm mt-2">Configure o Supabase para ver os dados reais</p>
            </div>
          )}

          <div className="text-center">
            <div className="glass-card inline-block rounded-2xl px-8 py-5 border border-gold-base/20">
              <p className="text-gray-500 text-sm mb-3">
                🔒 <span className="text-gold-bright font-semibold">508 deputados restantes</span> disponíveis no plano Premium
              </p>
              <Link
                href="/assinar"
                className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
              >
                Ver Ranking Completo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RANKING PIORES ────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="display-font text-5xl sm:text-6xl text-white mt-2">
              🚨 OS MAIS <span className="fire-text">PERIGOSOS</span>
            </h2>
            <p className="text-gray-500 mt-2">Deputados com histórico de votos contra o Brasil</p>
          </div>

          {worstPols.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {worstPols.map((p, i) => (
                <PoliticianCard key={p.id} politician={p} rank={i + 1} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center border border-red-900/20">
              <div className="text-5xl mb-4">⏳</div>
              <p className="text-red-400 font-bold text-lg">Aguardando dados...</p>
            </div>
          )}
        </div>
      </section>

      {/* ── PLs ANALISADOS ────────────────────────────────── */}
      <section className="py-20 bg-bg-surface/30">
        <div className="divider-fire mb-0" />
        <div className="max-w-6xl mx-auto px-4 pt-16">
          <div className="text-center mb-12">
            <span className="badge-gold text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              Inteligência Artificial
            </span>
            <h2 className="display-font text-5xl sm:text-6xl text-white mt-4">
              📜 PLs ANALISADOS <span className="gold-text">PELA IA</span>
            </h2>
            <p className="text-gray-500 mt-2">O que está em tramitação e o que isso significa para você</p>
          </div>

          {recentBills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {recentBills.slice(0, 1).map(b => <BillCard key={b.id} bill={b} />)}
              {recentBills.slice(1).map(b => <BillCard key={b.id} bill={b} locked />)}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center mb-10 border border-gold-base/20">
              <div className="text-5xl mb-4">🤖</div>
              <p className="text-gold-bright font-bold text-lg">IA aguardando análise dos PLs de hoje</p>
              <p className="text-gray-600 text-sm mt-2">Execute o feeder para ver os dados reais</p>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4">
              🔒 Assinantes premium recebem alertas por email dos PLs mais perigosos
            </p>
            <Link
              href="/assinar"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all"
            >
              Quero os Alertas em Tempo Real →
            </Link>
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(34,134,58,0.3) 40px, rgba(34,134,58,0.3) 41px)',
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card rounded-3xl p-12 border border-verde-muted/30">
            <p className="display-font text-6xl sm:text-7xl text-white mb-6 leading-none">
              NOSSA IA NÃO TEM
              <br />
              <span className="gold-text">PREÇO. NEM MEDO.</span>
            </p>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Enquanto a mídia tradicional esconde, minimiza e distorce — nossa inteligência artificial
              analisa friamente cada votação com base em <span className="text-verde-glow font-semibold">valores conservadores
              objetivos</span>: livre mercado, família, liberdade individual e soberania nacional.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { icon: '💰', title: 'Zero Patrocinadores', desc: 'Não vendemos espaço para políticos' },
                { icon: '🤖', title: 'IA Imparcial', desc: 'Algoritmo, não jornalista com partido' },
                { icon: '📊', title: 'Dados Públicos', desc: 'Direto da API oficial da Câmara' },
              ].map(item => (
                <div key={item.title} className="bg-bg-elevated/50 rounded-xl p-5">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="font-bold text-white text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-bg-surface/30">
        <div className="divider-verde mb-0" />
        <div className="max-w-6xl mx-auto px-4 pt-16">
          <div className="text-center mb-14">
            <h2 className="display-font text-5xl sm:text-6xl text-white">
              ESCOLHA SEU <span className="gold-text">NÍVEL</span>
            </h2>
            <p className="text-gray-500 mt-3">Menos que uma cerveja por semana para saber a verdade</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="glass-card rounded-2xl p-8 border border-gray-800/50">
              <div className="mb-6">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">Plano Gratuito</span>
                <div className="display-font text-6xl text-gray-300 mt-2">R$0</div>
                <p className="text-gray-600 text-sm mt-1">Para começar a se informar</p>
              </div>
              <ul className="space-y-3 text-sm mb-8">
                {[
                  ['✅', 'Top 10 deputados conservadores', true],
                  ['✅', '1 PL analisado por dia', true],
                  ['✅', 'Score de cada deputado', true],
                  ['❌', 'Ranking completo — 513 deputados', false],
                  ['❌', 'Filtros por partido e estado', false],
                  ['❌', 'Alertas por email', false],
                  ['❌', 'Histórico de votações (12 meses)', false],
                ].map(([icon, text, active]) => (
                  <li key={text as string} className={`flex items-center gap-2 ${active ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span>{icon}</span>{text}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block text-center glass-card text-gray-400 hover:text-verde-glow py-3 rounded-xl font-bold transition-all border border-gray-800/50"
              >
                Criar Conta Grátis
              </Link>
            </div>

            {/* Premium */}
            <div className="relative premium-card rounded-2xl p-8">
              {/* Popular badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="btn-gold text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-widest">
                  🦅 Mais Popular
                </span>
              </div>

              <div className="mb-6">
                <span className="text-verde-glow text-sm font-semibold uppercase tracking-widest">Patriota Premium</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <div className="display-font text-6xl text-white">R$29,90</div>
                  <span className="text-gray-500">/mês</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">ou R$249/ano — economize 30%</p>
              </div>

              <ul className="space-y-3 text-sm mb-8">
                {[
                  '✅ Ranking completo — 513 deputados',
                  '✅ Feed diário de PLs analisados',
                  '✅ Alertas por email (PLs perigosos)',
                  '✅ Filtros por partido e estado',
                  '✅ Histórico completo de 12 meses',
                  '✅ Perfil completo de cada deputado',
                  '✅ Badge "Patriota Vigilante" 🦅',
                  '✅ 7 dias grátis — cancele quando quiser',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-gray-200">{item}</li>
                ))}
              </ul>

              <Link
                href="/assinar"
                className="btn-gold block text-center py-4 rounded-xl font-black text-lg uppercase tracking-wide transition-all"
              >
                Assinar Agora — 7 Dias Grátis →
              </Link>
              <p className="text-center text-gray-600 text-xs mt-3">
                Pagamento seguro via Stripe · Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(34,134,58,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="display-font text-[4rem] sm:text-[5.5rem] md:text-[7rem] leading-none text-white mb-6">
            VOCÊ DECIDE:
            <br />
            <span className="text-verde-glow">VER A VERDADE</span>
            <br />
            <span className="fire-text">OU FICAR NO ESCURO</span>
          </div>
          <p className="text-gray-400 text-xl mb-12 max-w-xl mx-auto">
            Cada R$29,90 é um voto pela transparência. Cada assinatura é um olho aberto em Brasília.
          </p>
          <Link
            href="/assinar"
            className="btn-gold inline-flex items-center gap-3 px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-wide transition-all"
          >
            🦅 Começar com 7 Dias Grátis
          </Link>
          <p className="text-gray-700 text-sm mt-6">
            Sem risco. Sem compromisso. 100% dados oficiais.
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-verde-muted/20 py-10 bg-bg-surface/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🦅</span>
                <span className="font-bold text-verde-glow">Monitor Legislativo</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                IA conservadora monitorando 513 deputados 24h por dia. Dados oficiais da Câmara dos Deputados.
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wider">Produto</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {[['Como funciona', '/#ranking'], ['Preços', '/#pricing'], ['Assinar', '/assinar'], ['Entrar', '/login']].map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-verde-glow transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wider">Legal</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {[['Política de Privacidade', '/privacidade'], ['Termos de Uso', '/termos'], ['Contato', '/contato']].map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-verde-glow transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="divider-verde mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-700">
            <p>© 2026 Monitor Legislativo Conservador. Dados: API Câmara dos Deputados.</p>
            <p>Análises por IA · Não somos afiliados a partidos ou candidatos.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
