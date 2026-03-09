'use client'

interface ScoreBarProps {
  score: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

export function ScoreBar({ score, size = 'md', showLabel = true, animated = true }: ScoreBarProps) {
  const clamped = Math.max(-10, Math.min(10, score))
  const isPositive = clamped >= 0
  const pct = Math.abs(clamped) * 10 // 0–100%

  const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3' }
  const textSizes = { xs: 'text-xs', sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  const getScoreColor = (s: number) => {
    if (s >= 7)  return 'text-verde-glow'
    if (s >= 3)  return 'text-verde-bright'
    if (s >= -2) return 'text-gray-400'
    if (s >= -6) return 'text-orange-400'
    return 'text-red-400'
  }

  const getBarColor = (positive: boolean) =>
    positive
      ? 'bg-gradient-to-r from-verde-mid to-verde-glow'
      : 'bg-gradient-to-r from-red-800 to-red-500'

  const getGlow = (s: number) => {
    if (s >= 5)  return 'shadow-verde-sm'
    if (s <= -5) return 'shadow-red-md'
    return ''
  }

  return (
    <div className="flex items-center gap-2 w-full">
      {showLabel && (
        <span className={`score-badge ${textSizes[size]} ${getScoreColor(clamped)} w-12 text-right shrink-0 ${getGlow(clamped)}`}>
          {clamped > 0 ? '+' : ''}{clamped.toFixed(1)}
        </span>
      )}

      {/* Barra dividida ao centro */}
      <div className={`flex-1 relative ${heights[size]} bg-bg-overlay rounded-full overflow-hidden`}>
        {/* Linha central */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-700 z-10" />

        {/* Preenchimento */}
        {isPositive ? (
          <div
            className={`absolute left-1/2 top-0 bottom-0 ${getBarColor(true)} rounded-r-full ${animated ? 'transition-all duration-700' : ''}`}
            style={{ width: `${pct / 2}%` }}
          />
        ) : (
          <div
            className={`absolute top-0 bottom-0 ${getBarColor(false)} rounded-l-full ${animated ? 'transition-all duration-700' : ''}`}
            style={{ right: '50%', width: `${pct / 2}%` }}
          />
        )}
      </div>
    </div>
  )
}
