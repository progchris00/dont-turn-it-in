import type { RiskBucket } from "./dashboardData"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RiskDistributionChartProps {
  data: RiskBucket[]
  /** Highlight a specific risk-level bar (matches a selected student) */
  highlightLabel?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 600
const H = 200
const PAD = { top: 20, right: 24, bottom: 44, left: 44 }
const CW = W - PAD.left - PAD.right
const CH = H - PAD.top - PAD.bottom
const BAR_RATIO = 0.52

// ─── Helpers ──────────────────────────────────────────────────────────────────

function yMax(data: RiskBucket[]): number {
  const max = Math.max(...data.map((d) => d.count))
  return Math.ceil(max / 2) * 2 + 2
}

function yTicks(max: number): number[] {
  const step = max <= 6 ? 1 : 2
  const ticks: number[] = []
  for (let i = 0; i <= max; i += step) ticks.push(i)
  return ticks
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * RiskDistributionChart
 * Grouped bar chart showing student count per risk level.
 * Middle section of the StudentPerformanceDashboard.
 *
 * @param highlightLabel - When provided, dims all bars except the matching one.
 *   Pass the selected student's riskLevel to visually tie table → chart.
 */
export function RiskDistributionChart({
  data,
  highlightLabel,
}: RiskDistributionChartProps) {
  const max = yMax(data)
  const ticks = yTicks(max)
  const slotW = CW / data.length
  const barW = slotW * BAR_RATIO
  const toY = (v: number) => PAD.top + (1 - v / max) * CH
  const isHighlighting = Boolean(highlightLabel)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-label="Student risk level distribution"
      role="img"
      className="w-full"
    >
      {/* Grid + Y labels */}
      {ticks.map((t) => {
        const y = toY(t)
        return (
          <g key={t}>
            <line
              x1={PAD.left}
              y1={y}
              x2={PAD.left + CW}
              y2={y}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={y}
              dominantBaseline="middle"
              textAnchor="end"
              fontSize="10"
              fill="#9ca3af"
            >
              {t}
            </text>
          </g>
        )
      })}

      {/* Y-axis label */}
      <text
        x={12}
        y={PAD.top + CH / 2}
        textAnchor="middle"
        fontSize="10"
        fill="#6b7280"
        transform={`rotate(-90,12,${PAD.top + CH / 2})`}
      >
        Students
      </text>

      {/* Bars */}
      {data.map((d, i) => {
        const cx = PAD.left + i * slotW + slotW / 2
        const bx = cx - barW / 2
        const bh = (d.count / max) * CH
        const by = PAD.top + CH - bh
        const dim = isHighlighting && d.label !== highlightLabel
        const opacity = dim ? 0.25 : 1

        return (
          <g key={d.label}>
            {/* Bar */}
            <rect
              x={bx.toFixed(1)}
              y={by.toFixed(1)}
              width={barW.toFixed(1)}
              height={Math.max(bh, 0).toFixed(1)}
              fill={d.color}
              rx="4"
              opacity={opacity}
              style={{ transition: "opacity 0.2s ease" }}
            />

            {/* Count above bar */}
            <text
              x={cx}
              y={(by - 6).toFixed(1)}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={d.color}
              opacity={opacity}
            >
              {d.count}
            </text>

            {/* X label (multi-word wraps onto two lines) */}
            {d.label.split(" ").map((word, wi) => (
              <text
                key={wi}
                x={cx}
                y={(PAD.top + CH + 14 + wi * 13).toFixed(1)}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
                opacity={opacity}
              >
                {word}
              </text>
            ))}
          </g>
        )
      })}

      {/* Baseline */}
      <line
        x1={PAD.left}
        y1={PAD.top + CH}
        x2={PAD.left + CW}
        y2={PAD.top + CH}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    </svg>
  )
}

export default RiskDistributionChart
