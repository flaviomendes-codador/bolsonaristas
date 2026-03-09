import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ScoreBar } from '@/components/ScoreBar'
import type { Politician, Bill } from '@/lib/supabase'

export const revalidate = 3600

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'
  )
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data } = await getSupabase()
    .from('politicians')
    .select('nome, partido, estado, score_atual')
    .eq('id', params.id)
    .single()

  if (!data) return { title: 'Deputado não encontrado' }

  const pol = data as { nome: string; partido: string; estado: string; score_atual: number }

  return {
    title: `${pol.nome} (${pol.partido}-${pol.estado}) | Score Conservador: ${pol.score_atual > 0 ? '+' : ''}${pol.score_atual}`,
    description: `Veja as votações e o Score Conservador do deputado ${pol.nome} do ${pol.partido}-${pol.estado}.`,
  }
}

type Vote = {
  voto_apresentado: string
  data_votacao: string
  bills: Bill
}

export default async function DeputadoPage({ params }: { params: { id: string } }) {
  const supabase = getSupabase()
  const [{ data: politician }, { data: votes }] = await Promise.all([
    supabase.from('politicians').select('*').eq('id', params.id).single(),
    supabase
      .from('votes')
      .select('voto_apresentado, data_votacao, bills(*)')
      .eq('politician_id', params.id)
      .order('data_votacao', { ascending: false })
      .limit(20),
  ])

  if (!politician) notFound()

  const pol = politician as Politician
  const votesList = (votes ?? []) as unknown as Vote[]

  const scoreColor =
    pol.score_atual >= 5
      ? 'text-verde-400'
      : pol.score_atual >= 0
        ? 'text-verde-600'
        : pol.score_atual >= -5
          ? 'text-orange-400'
          : 'text-red-500'

  return (
    <main className="min-h-screen">
      <nav className="border-b border-verde-900/30 glass-card">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-verde-400 transition-colors text-sm">
            ← Monitor Legislativo
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-400 text-sm">Deputados</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header do deputado */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <Image
                src={pol.foto_url || '/placeholder-deputado.png'}
                alt={pol.nome}
                fill
                className="rounded-full object-cover border-2 border-verde-700/40"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-white mb-1">{pol.nome}</h1>
              <p className="text-gray-400">
                {pol.partido} · {pol.estado}
              </p>

              <div className="mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-500">Score Conservador:</span>
                  <span className={`text-3xl font-black ${scoreColor}`}>
                    {pol.score_atual > 0 ? '+' : ''}{pol.score_atual.toFixed(1)}
                  </span>
                </div>
                <div className="max-w-xs">
                  <ScoreBar score={pol.score_atual} size="lg" showLabel={false} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-verde-900/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{pol.total_votos}</p>
              <p className="text-xs text-gray-500">Votações analisadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-verde-500">{pol.votos_favor}</p>
              <p className="text-xs text-gray-500">Votos conservadores</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{pol.votos_contra}</p>
              <p className="text-xs text-gray-500">Votos contrários</p>
            </div>
          </div>
        </div>

        {/* Histórico de votações */}
        <h2 className="text-xl font-bold text-white mb-4">📋 Histórico de Votações</h2>

        {votesList.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center text-gray-500">
            Nenhuma votação registrada ainda.
          </div>
        ) : (
          <div className="space-y-3">
            {votesList.map((vote, i) => {
              const bill = vote.bills
              const votoIcon =
                vote.voto_apresentado === 'Sim'
                  ? '✅'
                  : vote.voto_apresentado === 'Não'
                    ? '❌'
                    : '⚠️'

              const votoAlinhado =
                (vote.voto_apresentado === 'Sim' && bill?.score_ia > 0) ||
                (vote.voto_apresentado === 'Não' && bill?.score_ia < 0)

              return (
                <div key={i} className={`glass-card rounded-xl p-4 border ${votoAlinhado ? 'border-verde-700/30' : 'border-red-900/30'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-mono mb-1">{bill?.numero}</p>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {bill?.resumo_ia || bill?.ementa_oficial}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg">{votoIcon}</p>
                      <p className="text-xs text-gray-500">{vote.voto_apresentado}</p>
                      <p className={`text-sm font-bold ${bill?.score_ia > 0 ? 'text-verde-500' : 'text-red-500'}`}>
                        {bill?.score_ia > 0 ? '+' : ''}{bill?.score_ia?.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(vote.data_votacao).toLocaleDateString('pt-BR')}
                    {votoAlinhado ? (
                      <span className="text-verde-700 ml-2">· Voto conservador ✓</span>
                    ) : (
                      <span className="text-red-900 ml-2">· Voto contrário</span>
                    )}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
