'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Politician, Bill } from '@/lib/supabase'
import { ScoreBar } from '@/components/ScoreBar'

type Vote = {
  id: number
  voto_apresentado: string
  data_votacao: string
  bills: Pick<Bill, 'id' | 'numero' | 'resumo_ia' | 'score_ia' | 'categoria'>
}

export default function DeputadoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [politician, setPolitician] = useState<Politician | null>(null)
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: pol }, { data: vs }] = await Promise.all([
        supabase.from('politicians').select('*').eq('id', id).single(),
        supabase.from('votes')
          .select('id, voto_apresentado, data_votacao, bills(id, numero, resumo_ia, score_ia, categoria)')
          .eq('politician_id', id)
          .order('data_votacao', { ascending: false })
          .limit(30),
      ])

      setPolitician(pol)
      setVotes((vs as Vote[] | null) ?? [])
      setLoading(false)
    }
    load()
  }, [id, router])

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-4xl animate-pulse">🦅</div>
    </div>
  )

  if (!politician) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center text-zinc-600">
      Deputado não encontrado
    </div>
  )

  const score = politician.score_atual ?? 0
  const scoreColor = score >= 5 ? 'text-green-400' : score >= 0 ? 'text-yellow-400' : 'text-red-400'
  const alinhamento = Math.round((politician.votos_favor / Math.max(politician.total_votos, 1)) * 100)

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <nav className="border-b border-white/5 px-4 py-3 sticky top-0 z-10 bg-[#080808]/95 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="text-zinc-600 hover:text-white transition-colors text-sm">
            ← Ranking
          </Link>
          <span className="text-zinc-800">/</span>
          <span className="text-zinc-400 text-sm truncate">{politician.nome}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header do deputado */}
        <div className="card p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {politician.foto_url ? (
            <img src={politician.foto_url} alt={politician.nome}
              className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shrink-0">🦅</div>
          )}
          <div className="flex-1">
            <h1 className="font-display text-3xl text-white leading-tight mb-1">{politician.nome}</h1>
            <p className="text-zinc-500 text-sm">{politician.partido} · {politician.estado}</p>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <p className={`text-3xl font-black ${scoreColor}`}>{score > 0 ? '+' : ''}{score.toFixed(1)}</p>
                <p className="text-zinc-600 text-xs">score conservador</p>
              </div>
              <div className="w-32"><ScoreBar score={score} showLabel={false} size="sm" /></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Total de votos" value={politician.total_votos.toString()} />
          <StatCard label="Votos conservadores" value={politician.votos_favor.toString()} color="green" />
          <StatCard label="Alinhamento" value={`${alinhamento}%`} color={alinhamento >= 60 ? 'green' : 'red'} />
        </div>

        {/* Histórico de votações */}
        <div>
          <h2 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
            Últimas votações
          </h2>
          {votes.length === 0 ? (
            <div className="text-center py-12 text-zinc-700">
              <p className="text-3xl mb-2">📜</p>
              <p className="text-sm">Nenhuma votação registrada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {votes.map(v => (
                <VoteRow key={v.id} vote={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color?: 'green' | 'red' }) {
  return (
    <div className="card p-4 text-center">
      <p className={`text-xl font-black ${color === 'green' ? 'text-green-400' : color === 'red' ? 'text-red-400' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-zinc-600 text-xs mt-1">{label}</p>
    </div>
  )
}

function VoteRow({ vote: v }: { vote: Vote }) {
  const isConservador = v.voto_apresentado === 'Sim'
    ? (v.bills?.score_ia ?? 0) >= 0
    : (v.bills?.score_ia ?? 0) < 0

  const votoLabel: Record<string, string> = {
    'Sim': '✅ Sim',
    'Não': '❌ Não',
    'Abstenção': '⬜ Abstenção',
    'Obstrução': '⚠️ Obstrução',
  }

  return (
    <div className="card flex items-start gap-4 px-4 py-3">
      <div className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${isConservador ? 'bg-green-500' : 'bg-red-500'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-zinc-300 text-sm truncate">
          {v.bills?.resumo_ia || v.bills?.numero || '—'}
        </p>
        <p className="text-zinc-700 text-xs mt-0.5">
          {new Date(v.data_votacao).toLocaleDateString('pt-BR')}
        </p>
      </div>
      <span className={`text-xs font-semibold shrink-0 ${isConservador ? 'text-green-400' : 'text-red-400'}`}>
        {votoLabel[v.voto_apresentado] ?? v.voto_apresentado}
      </span>
    </div>
  )
}
