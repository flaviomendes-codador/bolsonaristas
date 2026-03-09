import Image from 'next/image'
import Link from 'next/link'
import { ScoreBar } from './ScoreBar'
import type { Politician } from '@/lib/supabase'

interface PoliticianCardProps {
  politician: Politician
  rank?: number
  locked?: boolean
}

export function PoliticianCard({ politician, rank, locked = false }: PoliticianCardProps) {
  const scoreColor =
    politician.score_atual >= 5
      ? 'text-verde-400'
      : politician.score_atual >= 0
        ? 'text-verde-600'
        : politician.score_atual >= -5
          ? 'text-orange-400'
          : 'text-red-500'

  return (
    <div className={`glass-card rounded-xl p-4 transition-all hover:border-verde-500/30 ${locked ? 'relative' : ''}`}>
      {locked && (
        <div className="absolute inset-0 rounded-xl bg-militar-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-dourado-400 font-semibold">🔒 Premium</p>
            <p className="text-gray-400 text-xs mt-1">Assine para ver</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {rank && (
          <span className="text-gray-500 text-sm font-mono w-6 text-right shrink-0">
            {rank}º
          </span>
        )}

        <div className="relative w-10 h-10 shrink-0">
          <Image
            src={politician.foto_url || '/placeholder-deputado.png'}
            alt={politician.nome}
            fill
            className="rounded-full object-cover"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          <Link
            href={`/deputados/${politician.id}`}
            className="font-semibold text-sm text-gray-100 hover:text-verde-400 transition-colors truncate block"
          >
            {politician.nome}
          </Link>
          <p className="text-xs text-gray-500">
            {politician.partido} · {politician.estado}
          </p>
        </div>

        <span className={`text-lg font-bold tabular-nums ${scoreColor} shrink-0`}>
          {politician.score_atual > 0 ? '+' : ''}{politician.score_atual.toFixed(1)}
        </span>
      </div>

      <div className="mt-3">
        <ScoreBar score={politician.score_atual} size="sm" showLabel={false} />
      </div>

      {politician.total_votos > 0 && (
        <p className="text-xs text-gray-600 mt-2">
          {politician.total_votos} votos analisados
        </p>
      )}
    </div>
  )
}
