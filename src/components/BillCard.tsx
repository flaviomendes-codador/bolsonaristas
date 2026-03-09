import { ScoreBar } from './ScoreBar'
import type { Bill } from '@/lib/supabase'

const CATEGORIA_ICONS: Record<string, string> = {
  imposto: '💸',
  familia: '👨‍👩‍👧‍👦',
  liberdade: '🦅',
  outro: '📄',
}

const CATEGORIA_LABELS: Record<string, string> = {
  imposto: 'Tributação',
  familia: 'Família & Valores',
  liberdade: 'Liberdade Individual',
  outro: 'Geral',
}

interface BillCardProps {
  bill: Bill
  locked?: boolean
}

export function BillCard({ bill, locked = false }: BillCardProps) {
  const isPositive = bill.score_ia >= 0
  const scoreLabel = bill.score_ia >= 7
    ? '✅ Excelente'
    : bill.score_ia >= 3
      ? '👍 Positivo'
      : bill.score_ia >= -2
        ? '⚠️ Neutro'
        : bill.score_ia >= -6
          ? '👎 Preocupante'
          : '🚨 Péssimo'

  const data = new Date(bill.analisado_em).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short'
  })

  return (
    <div className={`glass-card rounded-xl p-5 transition-all hover:border-verde-500/20 ${locked ? 'relative overflow-hidden' : ''}`}>
      {locked && (
        <div className="absolute inset-0 rounded-xl bg-militar-900/85 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-dourado-400 font-semibold text-lg">🔒 Conteúdo Premium</p>
            <p className="text-gray-400 text-sm mt-1">Assine para ver todos os PLs analisados</p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{CATEGORIA_ICONS[bill.categoria] || '📄'}</span>
            <span className="text-xs text-gray-500 font-mono">{bill.numero}</span>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-600">{data}</span>
          </div>
          <span className="inline-block text-xs bg-militar-700 text-gray-400 px-2 py-0.5 rounded-full">
            {CATEGORIA_LABELS[bill.categoria]}
          </span>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-500">{scoreLabel}</p>
          <p className={`text-2xl font-bold tabular-nums ${isPositive ? 'text-verde-400' : 'text-red-500'}`}>
            {bill.score_ia > 0 ? '+' : ''}{bill.score_ia?.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <ScoreBar score={bill.score_ia} size="md" showLabel={false} />
      </div>

      <p className="text-sm text-gray-300 leading-relaxed">
        <span className="text-dourado-500 font-semibold">🤖 IA: </span>
        {bill.resumo_ia}
      </p>

      <p className="text-xs text-gray-600 mt-3 line-clamp-2 italic">
        {bill.ementa_oficial}
      </p>
    </div>
  )
}
