import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
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
  // Verifica sessão server-side
  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: { session } } = await supabaseServer.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Verifica premium
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: userProfile } = await supabaseAdmin
    .from('users')
    .select('is_premium')
    .eq('id', session.user.id)
    .single()

  const isPremium = userProfile?.is_premium ?? false

  // Busca deputados com filtros
  let politiciansQuery = supabaseAdmin
    .from('politicians')
    .select('*')
    .order('score_atual', { ascending: false })

  if (searchParams.partido) {
    politiciansQuery = politiciansQuery.eq('partido', searchParams.partido)
  }
  if (searchParams.estado) {
    politiciansQuery = politiciansQuery.eq('estado', searchParams.estado)
  }

  const limit = isPremium ? 100 : 10
  politiciansQuery = politiciansQuery.limit(limit)

  const { data: politicians } = await politiciansQuery
  const { data: bills } = await supabaseAdmin
    .from('bills')
    .select('*')
    .order('analisado_em', { ascending: false })
    .limit(isPremium ? 20 : 3)

  // Listas únicas de partidos e estados para filtros
  const { data: allPols } = await supabaseAdmin
    .from('politicians')
    .select('partido, estado')

  const partidos = Array.from(new Set((allPols ?? []).map(p => p.partido).filter(Boolean))).sort()
  const estados = Array.from(new Set((allPols ?? []).map(p => p.estado).filter(Boolean))).sort()

  return (
    <main className="min-h-screen">
      {/* Header */}
      <nav className="border-b border-verde-900/30 glass-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🦅</span>
            <span className="font-bold text-verde-400">Monitor Legislativo</span>
          </Link>
          <div className="flex items-center gap-3">
            {isPremium && (
              <span className="text-xs bg-dourado-500/20 text-dourado-400 border border-dourado-500/30 px-3 py-1 rounded-full">
                🏅 Patriota Vigilante
              </span>
            )}
            <span className="text-sm text-gray-500">{session.user.email}</span>
            <form action="/api/auth/logout" method="POST">
              <button className="text-sm text-gray-600 hover:text-red-400 transition-colors">
                Sair
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Banner de sucesso */}
        {searchParams.sucesso && (
          <div className="bg-verde-900/30 border border-verde-600/40 rounded-xl p-4 mb-8 text-center">
            <p className="text-verde-400 font-bold">🎉 Assinatura ativada com sucesso!</p>
            <p className="text-gray-400 text-sm mt-1">
              Bem-vindo ao Monitor Legislativo Premium, Patriota!
            </p>
          </div>
        )}

        {/* Banner não-premium */}
        {!isPremium && (
          <div className="bg-dourado-500/10 border border-dourado-500/30 rounded-xl p-4 mb-8 flex items-center justify-between gap-4">
            <p className="text-gray-300 text-sm">
              🔒 Você está no plano gratuito. Veja apenas os 10 primeiros deputados e 3 PLs.
            </p>
            <Link
              href="/assinar"
              className="shrink-0 bg-verde-600 hover:bg-verde-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
              Fazer Upgrade →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ranking */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                🏆 Ranking de Deputados
                {!isPremium && <span className="text-sm text-gray-500 ml-2">(Top 10)</span>}
              </h2>
            </div>

            {/* Filtros (apenas premium) */}
            {isPremium && (
              <form className="flex gap-3 mb-4">
                <select
                  name="partido"
                  defaultValue={searchParams.partido ?? ''}
                  className="bg-militar-800 border border-verde-900/40 text-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
                >
                  <option value="">Todos os partidos</option>
                  {partidos.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select
                  name="estado"
                  defaultValue={searchParams.estado ?? ''}
                  className="bg-militar-800 border border-verde-900/40 text-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
                >
                  <option value="">Todos os estados</option>
                  {estados.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-verde-700 hover:bg-verde-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  Filtrar
                </button>
              </form>
            )}

            <div className="space-y-2">
              {(politicians as Politician[] ?? []).map((p, i) => (
                <PoliticianCard key={p.id} politician={p} rank={i + 1} />
              ))}
            </div>

            {!isPremium && (
              <div className="mt-4 text-center glass-card rounded-xl p-6">
                <p className="text-gray-400 text-sm mb-3">
                  🔒 + {513 - 10} deputados bloqueados
                </p>
                <Link
                  href="/assinar"
                  className="text-verde-400 hover:text-verde-300 text-sm font-semibold"
                >
                  Ver ranking completo →
                </Link>
              </div>
            )}
          </div>

          {/* Feed de PLs */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              📜 PLs Analisados pela IA
            </h2>
            <div className="space-y-4">
              {(bills as Bill[] ?? []).map((bill) => (
                <BillCard key={bill.id} bill={bill} />
              ))}
            </div>
            {!isPremium && (
              <div className="mt-4 text-center glass-card rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-2">Feed completo disponível no Premium</p>
                <Link href="/assinar" className="text-verde-500 text-sm font-semibold hover:text-verde-400">
                  Assinar agora →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
