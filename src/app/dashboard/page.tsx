'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Politician, Bill } from '@/lib/supabase'
import { ScoreBar } from '@/components/ScoreBar'

type Tab = 'ranking' | 'pls' | 'alertas'

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('ranking')
  const [user, setUser] = useState<{ email: string; is_premium: boolean } | null>(null)
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'top' | 'bottom'>('all')

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const [{ data: profile }, { data: pols }, { data: bls }] = await Promise.all([
        supabase.from('users').select('email, is_premium').eq('id', authUser.id).single(),
        supabase.from('politicians').select('*').order('score_atual', { ascending: false }).limit(50),
        supabase.from('bills').select('*').order('analisado_em', { ascending: false }).limit(20),
      ])

      setUser(profile ?? { email: authUser.email!, is_premium: false })
      setPoliticians(pols ?? [])
      setBills(bls ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = politicians.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase())
      || p.partido.toLowerCase().includes(search.toLowerCase())
      || p.estado.toLowerCase().includes(search.toLowerCase())
    if (filter === 'top') return matchSearch && p.score_atual >= 5
    if (filter === 'bottom') return matchSearch && p.score_atual <= -5
    return matchSearch
  })

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 px-4 py-3 sticky top-0 z-10 bg-[#080808]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest shrink-0">
            <span>🦅</span> Monitor
          </Link>
          <div className="flex items-center gap-2">
            {user?.is_premium ? (
              <span className="text-yellow-500 text-xs font-semibold bg-yellow-950/30 border border-yellow-900/40 px-2 py-0.5 rounded-full">
                ⭐ Premium
              </span>
            ) : (
              <Link href="/assinar" className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-900/50 px-3 py-1 rounded-full transition-colors">
                7 dias grátis →
              </Link>
            )}
            <span className="text-zinc-600 text-xs hidden sm:block">{user?.email}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/[0.03] rounded-lg p-1 border border-white/5 w-fit">
          {(['ranking', 'pls', 'alertas'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                tab === t ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'
              }`}>
              {t === 'ranking' ? '🦅 Ranking' : t === 'pls' ? '📜 PLs' : '🚨 Alertas'}
            </button>
          ))}
        </div>

        {tab === 'ranking' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar deputado, partido ou estado..."
                className="input flex-1"
              />
              <div className="flex gap-2">
                {(['all', 'top', 'bottom'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-2 text-xs font-bold uppercase rounded transition-all ${
                      filter === f
                        ? f === 'bottom' ? 'bg-red-900/50 text-red-300 border border-red-800' : 'bg-green-900/50 text-green-300 border border-green-800'
                        : 'bg-white/5 text-zinc-500 border border-white/10 hover:text-white'
                    }`}>
                    {f === 'all' ? 'Todos' : f === 'top' ? '✅ Conservadores' : '🚨 Traidores'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <StatCard label="Deputados rankeados" value={politicians.length.toString()} />
              <StatCard label="Score ≥ 5 (conservadores)" value={politicians.filter(p => p.score_atual >= 5).length.toString()} color="green" />
              <StatCard label="Score ≤ -5 (traidores)" value={politicians.filter(p => p.score_atual <= -5).length.toString()} color="red" />
            </div>

            {filtered.length === 0 ? (
              <EmptyState icon="🔍" msg="Nenhum deputado encontrado" />
            ) : (
              <div className="space-y-2">
                {filtered.map((p, i) => (
                  <PoliticianRow key={p.id} politician={p} rank={i + 1} isPremium={user?.is_premium ?? false} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'pls' && (
          <div className="space-y-3">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Últimos projetos analisados pela IA</p>
            {bills.length === 0 ? (
              <EmptyState icon="📜" msg="Nenhum PL analisado ainda. O feeder roda todos os dias às 8h." />
            ) : (
              bills.map(b => <BillRow key={b.id} bill={b} />)
            )}
          </div>
        )}

        {tab === 'alertas' && (
          <div>
            {user?.is_premium ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🚨</p>
                <p className="text-white font-semibold mb-2">Alertas em tempo real ativados</p>
                <p className="text-zinc-500 text-sm">Você receberá emails quando PLs críticos forem votados.</p>
              </div>
            ) : (
              <div className="card p-8 text-center max-w-md mx-auto">
                <p className="text-4xl mb-4">🔒</p>
                <h3 className="font-display text-3xl text-white mb-2">ALERTAS PREMIUM</h3>
                <p className="text-zinc-500 text-sm mb-6">
                  Receba notificações em minutos quando PLs perigosos forem votados.
                </p>
                <Link href="/assinar" className="btn btn-red w-full py-3 font-bold">
                  🦅 Desbloquear por R$29,90/mês →
                </Link>
                <p className="text-zinc-700 text-xs mt-3">7 dias grátis · cancele quando quiser</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">🦅</div>
        <p className="text-zinc-600 text-sm">Carregando dados...</p>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color?: 'green' | 'red' }) {
  return (
    <div className="card p-4 text-center">
      <p className={`text-2xl font-black tabular-nums ${color === 'green' ? 'text-green-400' : color === 'red' ? 'text-red-400' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-zinc-600 text-xs mt-1">{label}</p>
    </div>
  )
}

function PoliticianRow({ politician: p, rank, isPremium }: { politician: Politician; rank: number; isPremium: boolean }) {
  const isBlurred = !isPremium && rank > 10
  const score = p.score_atual ?? 0
  const scoreColor = score >= 5 ? 'text-green-400' : score >= 0 ? 'text-yellow-400' : 'text-red-400'

  return (
    <Link href={isPremium || rank <= 10 ? `/dashboard/deputado/${p.id}` : '/assinar'}
      className={`card card-hover flex items-center gap-4 px-4 py-3 transition-all ${isBlurred ? 'opacity-40 blur-[2px] pointer-events-none' : ''}`}>
      <span className="text-zinc-700 text-xs font-mono w-6 text-right shrink-0">#{rank}</span>
      {p.foto_url ? (
        <img src={p.foto_url} alt={p.nome} className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0">🦅</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{p.nome}</p>
        <p className="text-zinc-600 text-xs">{p.partido} · {p.estado}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-lg font-black tabular-nums ${scoreColor}`}>{score > 0 ? '+' : ''}{score.toFixed(1)}</p>
        <ScoreBar score={score} />
      </div>
    </Link>
  )
}

function BillRow({ bill: b }: { bill: Bill }) {
  const score = b.score_ia ?? 0
  const scoreColor = score >= 0 ? 'text-green-400' : 'text-red-400'
  const catColors: Record<string, string> = {
    imposto: 'bg-red-950/50 text-red-400 border-red-900/40',
    familia: 'bg-green-950/50 text-green-400 border-green-900/40',
    liberdade: 'bg-blue-950/50 text-blue-400 border-blue-900/40',
    outro: 'bg-zinc-900/50 text-zinc-500 border-zinc-800',
  }
  return (
    <div className="card px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-zinc-600 text-xs font-mono">{b.numero}</span>
            <span className={`text-xs border px-2 py-0.5 rounded-full ${catColors[b.categoria] ?? catColors.outro}`}>
              {b.categoria}
            </span>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            {b.resumo_ia || (b.ementa_oficial?.slice(0, 140) + '…')}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-xl font-black ${scoreColor}`}>
            {score > 0 ? '+' : ''}{score.toFixed(1)}
          </p>
          <p className="text-zinc-700 text-xs">score IA</p>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon, msg }: { icon: string; msg: string }) {
  return (
    <div className="text-center py-16 text-zinc-600">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-sm">{msg}</p>
    </div>
  )
}
