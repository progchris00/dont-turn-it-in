import type { ClassTrendPoint } from "./dashboardData"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassAITrendChartProps {
  data: ClassTrendPoint[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 600
const H = 220
const PAD = { top: 20, right: 24, bottom: 36, left: 44 }
const CW = W - PAD.left - PAD.right
const CH = H - PAD.top - PAD.bottom
const Y_MAX = 100
const Y_TICKS = [0, 25, 50, 75, 100]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toX = (i: number, len: number) => PAD.left + (i / (len - 1)) * CW

const toY = (v: number) => PAD.top + (1 - v / Y_MAX) * CH

function linePath(pts: ClassTrendPoint[]): string {
  return pts
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${toX(i, pts.length).toFixed(1)},${toY(p.avgAiPercent).toFixed(1)}`,
    )
    .join(" ")
}

function areaPath(pts: ClassTrendPoint[]): string {
  const line = linePath(pts)
  const x0 = toX(0, pts.length).toFixed(1)
  const xN = toX(pts.length - 1, pts.length).toFixed(1)
  const yB = (PAD.top + CH).toFixed(1)
  return `${line} L${xN},${yB} L${x0},${yB}Z`
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ClassAITrendChart
 * Full-width line chart showing the class-wide average AI % over time.
 * Top section of the StudentPerformanceDashboard.
 */
export function ClassAITrendChart({ data }: ClassAITrendChartProps) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-label="Class average AI usage over time"
      role="img"
      className="w-full"
    >
      <defs>
        <linearGradient id="class-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Grid lines + Y labels */}
      {Y_TICKS.map((t) => {
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
              {t}%
            </text>
          </g>
        )
      })}

      {/* X axis labels */}
      {data.map((p, i) => (
        <text
          key={p.week}
          x={toX(i, data.length)}
          y={PAD.top + CH + 18}
          textAnchor="middle"
          fontSize="10"
          fill="#9ca3af"
        >
          {p.week}
        </text>
      ))}

      {/* Area */}
      <path d={areaPath(data)} fill="url(#class-area)" />

      {/* Line */}
      <path
        d={linePath(data)}
        fill="none"
        stroke="#ea580c"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Points */}
      {data.map((p, i) => (
        <circle
          key={p.week}
          cx={toX(i, data.length)}
          cy={toY(p.avgAiPercent)}
          r="4"
          fill="#fff"
          stroke="#ea580c"
          strokeWidth="2"
        >
          <title>{`${p.week}: ${p.avgAiPercent}%`}</title>
        </circle>
      ))}

      {/* Y-axis label */}
      <text
        x={12}
        y={PAD.top + CH / 2}
        textAnchor="middle"
        fontSize="10"
        fill="#6b7280"
        transform={`rotate(-90,12,${PAD.top + CH / 2})`}
      >
        Avg AI %
      </text>
    </svg>
  )
}

export default ClassAITrendChart
