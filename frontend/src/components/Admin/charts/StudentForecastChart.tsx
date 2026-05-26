import { useEffect, useId, useRef, useState } from "react"
import type { PerformanceStudent } from "./dashboardData"
import { RISK_COLORS } from "./dashboardData"

// ─── Types ────────────────────────────────────────────────────────────────

interface StudentForecastChartProps {
  student: PerformanceStudent | null
}

type ForecastPoint = {
  aiPercent: number
  isForecast: boolean
}

// ─── Constants ─────────────────────────────────────────────────────────────

const W = 500
const H = 220
const PAD = { top: 20, right: 24, bottom: 36, left: 44 }
const CW = W - PAD.left - PAD.right
const CH = H - PAD.top - PAD.bottom
const Y_MAX = 100
const Y_TICKS = [0, 25, 50, 75, 100]

// ─── Helpers ───────────────────────────────────────────────────────────────

const toX = (i: number, len: number) =>
  PAD.left + (i / (len - 1)) * CW

const toY = (v: number) =>
  PAD.top + (1 - v / Y_MAX) * CH

function historicalPath(pts: ForecastPoint[]): string {
  const hist = pts.filter((p) => !p.isForecast)

  return hist
    .map((p, i) => {
      const globalIndex = pts.indexOf(p)
      return `${i === 0 ? "M" : "L"}${toX(globalIndex, pts.length).toFixed(1)},${toY(p.aiPercent).toFixed(1)}`
    })
    .join(" ")
}

function forecastPath(pts: ForecastPoint[]): string {
  const splitIdx = pts.findIndex((p) => p.isForecast)
  if (splitIdx < 1) return ""

  const forecast = pts.slice(splitIdx)

  return [pts[splitIdx - 1], ...forecast]
    .map((p, i) => {
      const globalIndex = pts.indexOf(p)
      return `${i === 0 ? "M" : "L"}${toX(globalIndex, pts.length).toFixed(1)},${toY(p.aiPercent).toFixed(1)}`
    })
    .join(" ")
}

function areaPath(pts: ForecastPoint[]): string {
  const hist = pts.filter((p) => !p.isForecast)
  if (!hist.length) return ""

  const line = hist
    .map((p, i) => {
      const globalIndex = pts.indexOf(p)
      return `${i === 0 ? "M" : "L"}${toX(globalIndex, pts.length).toFixed(1)},${toY(p.aiPercent).toFixed(1)}`
    })
    .join(" ")

  const last = hist[hist.length - 1]
  const first = hist[0]

  const xN = toX(pts.indexOf(last), pts.length).toFixed(1)
  const x0 = toX(pts.indexOf(first), pts.length).toFixed(1)
  const yB = (PAD.top + CH).toFixed(1)

  return `${line} L${xN},${yB} L${x0},${yB}Z`
}

// ─── Empty State ───────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center">
      <p className="text-sm font-medium text-gray-400">Select a student</p>
      <p className="text-xs text-gray-300">
        Click any row in the table to view their predictive forecast
      </p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────

export function StudentForecastChart({
  student,
}: StudentForecastChartProps) {
  const [visible, setVisible] = useState(true)
  const prevId = useRef<string | null>(null)
  const areaGradientId = useId()

  useEffect(() => {
    if (student?.id !== prevId.current) {
      setVisible(false)

      const t = setTimeout(() => {
        prevId.current = student?.id ?? null
        setVisible(true)
      }, 120)

      return () => clearTimeout(t)
    }
  }, [student?.id])

  if (!student) return <EmptyState />

  const pts: ForecastPoint[] =
    (student as any).forecastData ?? (student as any).points ?? []

  const color = RISK_COLORS[student.riskLevel]

  const splitIdx = pts.findIndex((p) => p.isForecast)
  const splitX = splitIdx > 0 ? toX(splitIdx, pts.length).toFixed(1) : null

  return (
    <div
      className="transition-opacity duration-150"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-label={`Predictive forecast for ${student.name}`}
        role="img"
        className="w-full"
      >
        <defs>
          <linearGradient
            id={areaGradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Y axis grid */}
        {Y_TICKS.map((t: number) => {
          const y = toY(t)
          return (
            <g key={t}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + CW}
                y2={y}
                stroke="#f3f4f6"
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

        {/* X labels */}
        {pts.map((p: ForecastPoint, i: number) => (
          <text
            key={i}
            x={toX(i, pts.length)}
            y={PAD.top + CH + 18}
            textAnchor="middle"
            fontSize="10"
            fill={p.isForecast ? "#d1d5db" : "#9ca3af"}
          >
            {p.isForecast ? "Next" : i + 1}
          </text>
        ))}

        {/* Area */}
        <path d={areaPath(pts)} fill={`url(#${areaGradientId})`} />

        {/* Divider */}
        {splitX && (
          <line
            x1={splitX}
            y1={PAD.top}
            x2={splitX}
            y2={PAD.top + CH}
            stroke="#e5e7eb"
            strokeDasharray="4 3"
          />
        )}

        {/* Forecast label */}
        {splitX && (
          <text
            x={Number(splitX) + 6}
            y={PAD.top + 10}
            fontSize="9"
            fill="#9ca3af"
          >
            Forecast →
          </text>
        )}

        {/* Historical line */}
        <path
          d={historicalPath(pts)}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Forecast line */}
        <path
          d={forecastPath(pts)}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="5 3"
          strokeOpacity="0.6"
        />

        {/* Points */}
        {pts.map((p: ForecastPoint, i: number) => (
          <circle
            key={i}
            cx={toX(i, pts.length)}
            cy={toY(p.aiPercent)}
            r={p.isForecast ? 3 : 4}
            fill={p.isForecast ? color : "#fff"}
            stroke={color}
            strokeWidth="2"
            strokeOpacity={p.isForecast ? 0.5 : 1}
          >
            <title>
              {`${p.isForecast ? "Next" : i + 1}: ${p.aiPercent}%${
                p.isForecast ? " (forecast)" : ""
              }`}
            </title>
          </circle>
        ))}
      </svg>
    </div>
  )
}

export default StudentForecastChart