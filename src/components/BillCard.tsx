import { ScoreBar } from './ScoreBar'
import type { Bill } from '@/lib/supabase'

const CATEGORIA_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  imposto:   { icon: '💸', label: 'Tributação',        color: 'text-orange-400' },
  familia:   { icon: '👨‍👩‍👧‍👦', label: 'Família & Valores', color: 'text-blue-400'   },
  liberdade: { icon: '🦅', label: 'Liberdade',          color: 'text-verde-glow'  },
  outro:     { icon: '📜', label: 'Legislação Geral',   color: 'text-gray-400'    },
}

const SCORE_CONFIG = [
  { min: 7,  label: 'EXCELENTE',   color: 'text-verde-glow',  bg: 'bg-verde-dim',  border: 'border-verde-base/30' },
  { min: 3,  label: 'POSITIVO',    color: 'text-verde-bright', bg: 'bg-verde-dim', border: 'border-verde-muted/30' },
  { min: -2, label: 'NEUTRO',      color: 'text-gray-400',     bg: 'bg-bg-overlay', border: 'border-gray-700/30' },
  { min: -6, label: 'PREOCUPANTE', color: 'text-orange-400',  bg: 'bg-red-950/30', border: 'border-orange-900/30' },
  { min: -11,label: 'PÉSSIMO',     color: 'text-red-400',     bg: 'bg-red-950/50', border: 'border-red-900/40' },
]

function getScoreConfig(score: number) {
  return SCORE_CONFIG.find(c => score >= c.min) ?? SCORE_CONFIG[SCORE_CONFIG.length - 1]
}

interface BillCardProps {
  bill: Bill
  locked?: boolean
  compact?: boolean
}

export function BillCard({ bill, locked = false, compact = false }: BillCardProps) {
  const cfg = getScoreConfig(bill.score_ia ?? 0)
  const cat = CATEGORIA_CONFIG[bill.categoria] ?? CATEGORIA_CONFIG.outro
  const data = new Date(bill.analisado_em).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short'
  })

  return (
    <div className={`relative glass-card rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px] ${cfg.border} border`}>
      {/* Borda superior colorida */}
      <div className={`h-0.5 w-full ${bill.score_ia >= 0 ? 'bg-gradient-to-r from-transparent via-verde-base to-transparent' : 'bg-gradient-to-r from-transparent via-red-600 to-transparent'}`} />

      {locked && (
        <div className="absolute inset-0 rounded-xl bg-bg-base/90 backdrop-blur-md z-10 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-gold-bright font-bold text-lg mb-1">🔒 Conteúdo Premium</p>
            <p className="text-gray-500 text-sm">Assine para acessar todos os PLs</p>
          </div>
        </div>
      )}

      <div className={`p-${compact ? '4' : '5'}`}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl shrink-0">{cat.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs text-gray-600">{bill.numero}</span>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-600">{data}</span>
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${cat.color}`}>
              {cat.label}
            </span>
          </div>
          <div className="text-right shrink-0">
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
              {cfg.label}
            </div>
            <p className={`score-badge text-2xl font-bold mt-1 ${cfg.color}`}>
              {(bill.score_ia ?? 0) > 0 ? '+' : ''}{bill.score_ia?.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mb-3">
          <ScoreBar score={bill.score_ia ?? 0} size="xs" showLabel={false} />
        </div>

        {/* Análise da IA */}
        <div className="bg-bg-surface/50 rounded-lg p-3 border border-verde-muted/20">
          <p className="text-xs text-gold-bright font-semibold mb-1 flex items-center gap-1">
            <span>🤖</span> Análise IA
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">{bill.resumo_ia}</p>
        </div>

        {!compact && (
          <p className="text-xs text-gray-700 mt-3 line-clamp-2 italic leading-relaxed">
            {bill.ementa_oficial}
          </p>
        )}
      </div>
    </div>
  )
}
