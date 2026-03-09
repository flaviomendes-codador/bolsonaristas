'use client'

interface ScoreBarProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function ScoreBar({ score, size = 'md', showLabel = true }: ScoreBarProps) {
  const isPositive = score >= 0
  const percentage = Math.abs(score) * 10 // 0–100%
  const clampedScore = Math.max(-10, Math.min(10, score))

  const heightMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }
  const textMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  const scoreColor =
    clampedScore >= 7
      ? 'text-verde-400 font-bold'
      : clampedScore >= 3
        ? 'text-verde-500'
        : clampedScore >= -2
          ? 'text-gray-400'
          : clampedScore >= -6
            ? 'text-orange-400'
            : 'text-red-500 font-bold'

  const barColor = isPositive
    ? 'bg-gradient-to-r from-verde-700 to-verde-500'
    : 'bg-gradient-to-r from-red-800 to-red-500'

  return (
    <div className="flex items-center gap-2 w-full">
      {showLabel && (
        <span className={`${textMap[size]} ${scoreColor} w-10 text-right tabular-nums`}>
          {clampedScore > 0 ? '+' : ''}{clampedScore.toFixed(1)}
        </span>
      )}
      <div className="flex-1 bg-militar-700 rounded-full overflow-hidden">
        <div className="relative w-full flex">
          {/* Centro da barra */}
          <div className="w-1/2 flex justify-end">
            {!isPositive && (
              <div
                className={`${heightMap[size]} ${barColor} rounded-l-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            )}
          </div>
          <div className="w-px bg-gray-600 z-10" />
          <div className="w-1/2">
            {isPositive && (
              <div
                className={`${heightMap[size]} ${barColor} rounded-r-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
