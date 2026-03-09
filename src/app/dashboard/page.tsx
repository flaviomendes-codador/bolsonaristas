import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PoliticianCard } from '@/components/PoliticianCard'
import { BillCard } from '@/components/BillCard'
import type { Politician, Bill } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { sucesso?: string; partido?: string; estado?: string }
}) {
  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { session } } = await supabaseServer.auth.getSession()
  if (!session) redirect('/login')

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: userProfile } = await supabaseAdmin
    .from('users').select('is_premium').eq('id', session.user.id).single()
  const isPremium = userProfile?.is_premium ?? false

  let politiciansQuery = supabaseAdmin
    .from('politicians').select('*').order('score_atual', { ascending: false })
  if (searchParams.partido) politiciansQuery = politiciansQuery.eq('partido', searchParams.partido)
  if (searchParams.estado)  politiciansQuery = politiciansQuery.eq('estado', searchParams.estado)
  politiciansQuery = politiciansQuery.limit(isPremium ? 100 : 10)

  const { data: politicians } = await politiciansQuery
  const { data: bills } = await supabaseAdmin
    .from('bills').select('*').order('analisado_em', { ascending: false }).limit(isPremium ? 20 : 3)
  const { data: allPols } = await supabaseAdmin.from('politicians').select('partido, estado')
  const partidos = Array.from(new Set((allPols ?? []).map(p => p.partido).filter(Boolean))).sort()
  const estados  = Array.from(new Set((allPols ?? []).map(p => p.estado).filter(Boolean))).sort()

  return (
    <div className="min-h-screen bg-[#030303] text-white">

      {/* ── NAVBAR PRODUTO ──────────────────────────────── */}
      <nav className="border-b border-white/5 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span>🦅</span>
              <span className="font-black text-xs uppercase tracking-widest text-white hidden sm:block">Monitor Legislativo</span>
            </Link>
            {/* Status ao vivo */}
            <div className="flex items-center gap-1.5 bg-green-950/60 border border-green-900/40 rounded px-2 py-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500 text-xs font-mono uppercase tracking-wider">SISTEMA ATIVO</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPremium && (
              <span className="hidden sm:block text-xs bg-red-950/60 border border-red-800/40 text-red-400 px-3 py-1 rounded font-bold uppercase tracking-wider">
                🦅 Patriota Premium
              </span>
            )}
            <span className="text-gray-600 text-xs hidden sm:block truncate max-w-[160px]">
              {session.user.email}
            </span>
            <form action="/api/auth/logout" method="POST">
              <button className="text-gray-700 hover:text-red-400 text-xs uppercase tracking-wider transition-colors">
                Sair
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* ── BANNER DE SUCESSO ────────────────────────────── */}
      {searchParams.sucesso && (
        <div className="border-b border-green-800/40 bg-green-950/30 py-3 px-4">
          <p className="text-center text-green-400 text-sm font-bold">
            🦅 Assinatura ativada! Bem-vindo ao Monitor Legislativo Premium.
          </p>
        </div>
      )}

      {/* ── BANNER FREE ──────────────────────────────────── */}
      {!isPremium && (
        <div className="border-b border-red-900/40 bg-red-950/20 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="text-gray-400 text-xs sm:text-sm">
              🔒 Você está no plano grátis — vendo apenas {10} dos 513 deputados e 3 PLs.
            </p>
            <Link href="/assinar"
              className="shrink-0 bg-red-700 hover:bg-red-600 text-white px-4 py-2 text-xs font-black uppercase tracking-wider transition-all">
              DESBLOQUEAR TUDO →
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── COLUNA PRINCIPAL — RANKING ────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header da seção */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl text-white uppercase tracking-wide">
                  Ranking de Deputados
                </h1>
                <p className="text-gray-600 text-xs mt-1 uppercase tracking-widest">
                  {isPremium ? 'Acesso completo — 513 deputados' : `Top ${(politicians as Politician[] ?? []).length} — plano grátis`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-700 uppercase tracking-widest">Atualizado</p>
                <p className="text-xs text-green-600 font-mono">
                  {new Date().toLocaleDateString('pt-BR')} 08:00
                </p>
              </div>
            </div>

            {/* Filtros premium */}
            {isPremium && (
              <form className="flex gap-2">
                <select name="partido" defaultValue={searchParams.partido ?? ''}
                  className="bg-white/5 border border-white/10 text-gray-400 text-xs px-3 py-2 flex-1 outline-none focus:border-green-800 transition-colors">
                  <option value="">Todos os partidos</option>
                  {partidos.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select name="estado" defaultValue={searchParams.estado ?? ''}
                  className="bg-white/5 border border-white/10 text-gray-400 text-xs px-3 py-2 flex-1 outline-none focus:border-green-800 transition-colors">
                  <option value="">Todos os estados</option>
                  {estados.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <button type="submit"
                  className="bg-white/5 border border-white/10 hover:border-green-800 text-gray-400 hover:text-green-400 px-4 py-2 text-xs uppercase tracking-wider transition-all">
                  Filtrar
                </button>
              </form>
            )}

            {/* Lista de deputados */}
            <div className="space-y-2">
              {(politicians as Politician[] ?? []).map((p, i) => (
                <PoliticianCard key={p.id} politician={p} rank={i + 1} variant="compact" />
              ))}
            </div>

            {!isPremium && (
              <div className="border border-red-900/40 bg-red-950/10 p-6 text-center">
                <p className="text-gray-500 text-sm mb-1">
                  🔒 <span className="text-red-400 font-semibold">{513 - 10} deputados</span> bloqueados no plano grátis
                </p>
                <p className="text-gray-700 text-xs mb-4">
                  Sabia que seu deputado pode estar entre os piores?
                </p>
                <Link href="/assinar"
                  className="inline-block bg-red-700 hover:bg-red-600 text-white px-6 py-2 text-xs font-black uppercase tracking-wider transition-all">
                  Ver Ranking Completo — 7 Dias Grátis
                </Link>
              </div>
            )}
          </div>

          {/* ── COLUNA LATERAL — PLs ──────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-white uppercase">PLs Analisados</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-500 text-xs font-mono uppercase">HOJE</span>
              </div>
            </div>

            <div className="space-y-3">
              {(bills as Bill[] ?? []).map(bill => (
                <BillCard key={bill.id} bill={bill} compact />
              ))}
            </div>

            {!isPremium && (
              <div className="border border-white/5 bg-black/40 p-5 text-center">
                <p className="text-gray-600 text-xs mb-3 uppercase tracking-widest">
                  Feed completo disponível no Premium
                </p>
                <Link href="/assinar"
                  className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors">
                  Assinar Agora →
                </Link>
              </div>
            )}

            {/* Painel de status da IA */}
            <div className="border border-white/5 bg-black/40 p-4 mt-4">
              <p className="text-xs text-gray-700 uppercase tracking-widest font-bold mb-3">STATUS DO SISTEMA</p>
              <div className="space-y-2">
                {[
                  { label: 'Última análise', value: `Hoje, 08:00`, ok: true },
                  { label: 'Deputados monitorados', value: '513', ok: true },
                  { label: 'PLs em tramitação', value: '2.847', ok: true },
                  { label: 'Alertas enviados hoje', value: isPremium ? 'Ativos' : 'Bloqueados', ok: isPremium },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-gray-700 text-xs">{item.label}</span>
                    <span className={`text-xs font-mono ${item.ok ? 'text-green-600' : 'text-red-700'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
