import Image from 'next/image'
import Link from 'next/link'
import { ScoreBar } from './ScoreBar'
import type { Politician } from '@/lib/supabase'

interface PoliticianCardProps {
  politician: Politician
  rank?: number
  locked?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

export function PoliticianCard({
  politician,
  rank,
  locked = false,
  variant = 'default',
}: PoliticianCardProps) {
  const score = politician.score_atual
  const isPositive = score >= 0

  const scoreColor =
    score >= 7  ? 'text-verde-glow'
    : score >= 3  ? 'text-verde-bright'
    : score >= -2 ? 'text-gray-400'
    : score >= -6 ? 'text-orange-400'
    : 'text-red-400'

  const borderColor =
    score >= 5  ? 'hover:border-verde-base/40'
    : score <= -5 ? 'hover:border-red-800/40'
    : 'hover:border-gray-600/30'

  const rankBadge = rank && rank <= 3
    ? rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'
    : null

  if (variant === 'compact') {
    return (
      <div className={`relative glass-card rounded-xl p-3 transition-all duration-300 ${borderColor} ${locked ? 'select-none' : ''}`}>
        {locked && (
          <div className="absolute inset-0 rounded-xl bg-bg-base/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <span className="text-gold-bright font-semibold text-sm">🔒 Premium</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          {rank && (
            <span className="text-gray-600 text-xs font-mono w-5 text-right shrink-0">
              {rankBadge || `${rank}º`}
            </span>
          )}
          <div className="relative w-8 h-8 shrink-0">
            <Image
              src={politician.foto_url || '/placeholder-deputado.png'}
              alt={politician.nome}
              fill
              className="rounded-full object-cover ring-1 ring-verde-muted"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-xs text-gray-100 truncate">{politician.nome}</p>
            <p className="text-xs text-gray-600">{politician.partido} · {politician.estado}</p>
          </div>
          <span className={`score-badge text-sm font-bold ${scoreColor} shrink-0`}>
            {score > 0 ? '+' : ''}{score.toFixed(1)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <Link href={`/deputados/${politician.id}`} className="block group">
      <div className={`relative glass-card rounded-xl p-4 transition-all duration-300 border border-transparent ${borderColor} group-hover:translate-y-[-2px] group-hover:shadow-card-lg ${locked ? 'select-none' : ''}`}>
        {locked && (
          <div className="absolute inset-0 rounded-xl bg-bg-base/85 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gold-bright font-bold">🔒 Premium</p>
              <p className="text-gray-500 text-xs mt-1">Assine para ver</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {rank && (
            <div className="shrink-0 w-7 text-right">
              {rankBadge
                ? <span className="text-xl">{rankBadge}</span>
                : <span className="text-gray-600 text-sm font-mono">{rank}º</span>
              }
            </div>
          )}

          <div className="relative w-11 h-11 shrink-0">
            <Image
              src={politician.foto_url || '/placeholder-deputado.png'}
              alt={politician.nome}
              fill
              className={`rounded-full object-cover ring-2 ${isPositive ? 'ring-verde-muted' : 'ring-red-900'}`}
              unoptimized
            />
            {/* Online indicator */}
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-surface ${isPositive ? 'bg-verde-base' : 'bg-red-600'}`} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-100 truncate group-hover:text-verde-glow transition-colors">
              {politician.nome}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {politician.partido} · {politician.estado}
              {politician.total_votos > 0 && (
                <span className="text-gray-700 ml-1">· {politician.total_votos} votos</span>
              )}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className={`score-badge text-xl font-bold ${scoreColor}`}>
              {score > 0 ? '+' : ''}{score.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <ScoreBar score={score} size="sm" showLabel={false} />
        </div>
      </div>
    </Link>
  )
}
