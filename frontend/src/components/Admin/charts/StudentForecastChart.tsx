import { useEffect, useRef, useState } from "react"
import type { PerformanceStudent } from "./dashboardData"
import { RISK_COLORS } from "./dashboardData"

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentForecastChartProps {
  student: PerformanceStudent | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 500
const H = 220
const PAD = { top: 20, right: 24, bottom: 36, left: 44 }
const CW = W - PAD.left - PAD.right
const CH = H - PAD.top - PAD.bottom
const Y_MAX = 100
const Y_TICKS = [0, 25, 50, 75, 100]

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Use index-based positioning — safe even when aiPercent values repeat
const toX = (i: number, len: number) => PAD.left + (i / (len - 1)) * CW
const toY = (v: number) => PAD.top + (1 - v / Y_MAX) * CH

function historicalPath(pts: PerformanceStudent["forecastData"]): string {
  return pts
    .filter((p) => !p.isForecast)
    .map((p, i, hist) => {
      const gi = pts.indexOf(p)
      return `${i === 0 ? "M" : "L"}${toX(gi, pts.length).toFixed(1)},${toY(p.aiPercent).toFixed(1)}`
    })
    .join(" ")
}

function forecastPath(pts: PerformanceStudent["forecastData"]): string {
  const splitIdx = pts.findIndex((p) => p.isForecast)
  if (splitIdx < 1) return ""
  // Start from last historical point for a seamless visual join
  return [pts[splitIdx - 1], ...pts.filter((p) => p.isForecast)]
    .map((p, i) => {
      const gi = pts.indexOf(p)
      return `${i === 0 ? "M" : "L"}${toX(gi, pts.length).toFixed(1)},${toY(p.aiPercent).toFixed(1)}`
    })
    .join(" ")
}

function areaPath(pts: PerformanceStudent["forecastData"]): string {
  const hist = pts.filter((p) => !p.isForecast)
  if (!hist.length) return ""
  const line = hist
    .map((p, i) =>
      `${i === 0 ? "M" : "L"}${toX(pts.indexOf(p), pts.length).toFixed(1)},${toY(p.aiPercent).toFixed(1)}`
    )
    .join(" ")
  const xN = toX(pts.indexOf(hist[hist.length - 1]), pts.length).toFixed(1)
  const x0 = toX(pts.indexOf(hist[0]), pts.length).toFixed(1)
  const yB = (PAD.top + CH).toFixed(1)
  return `${line} L${xN},${yB} L${x0},${yB}Z`
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center">
      <svg
        className="h-10 w-10 text-gray-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <p className="text-sm font-medium text-gray-400">Select a student</p>
      <p className="text-xs text-gray-300">
        Click any row in the table to view their predictive forecast
      </p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * StudentForecastChart
 * Dynamically re-renders whenever the `student` prop changes.
 * Solid line = historical data. Dashed line = predicted future values.
 * Line color is driven by the student's current risk level.
 * Renders an empty-state prompt when no student is selected.
 */
export function StudentForecastChart({ student }: StudentForecastChartProps) {
  const [visible, setVisible] = useState(true)
  const prevId = useRef<string | null>(null)

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

  const pts = student.forecastData
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
          <linearGradient id={`sfg-area-${student.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid + Y labels */}
        {Y_TICKS.map((t) => {
          const y = toY(t)
          return (
            <g key={t}>
              <line
                x1={PAD.left} y1={y}
                x2={PAD.left + CW} y2={y}
                stroke="#f3f4f6" strokeWidth="1"
              />
              <text
                x={PAD.left - 8} y={y}
                dominantBaseline="middle" textAnchor="end"
                fontSize="10" fill="#9ca3af"
              >
                {t}%
              </text>
            </g>
          )
        })}

        {/* X labels */}
        {pts.map((p, i) => (
          <text
            key={`${p.week}-${i}`}
            x={toX(i, pts.length)} y={PAD.top + CH + 18}
            textAnchor="middle" fontSize="10"
            fill={p.isForecast ? "#d1d5db" : "#9ca3af"}
          >
            {p.week}
          </text>
        ))}

        {/* Area under historical */}
        <path d={areaPath(pts)} fill={`url(#sfg-area-${student.id})`} />

        {/* Forecast divider */}
        {splitX && (
          <line
            x1={splitX} y1={PAD.top}
            x2={splitX} y2={PAD.top + CH}
            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3"
          />
        )}

        {/* Forecast label */}
        {splitX && (
          <text
            x={Number(splitX) + 6} y={PAD.top + 10}
            fontSize="9" fill="#9ca3af"
          >
            Forecast →
          </text>
        )}

        {/* Historical line (solid) */}
        <path
          d={historicalPath(pts)}
          fill="none" stroke={color} strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round"
        />

        {/* Forecast line (dashed) */}
        <path
          d={forecastPath(pts)}
          fill="none" stroke={color} strokeWidth="2"
          strokeDasharray="5 3" strokeLinejoin="round"
          strokeLinecap="round" strokeOpacity="0.6"
        />

        {/* Data points */}
        {pts.map((p, i) => (
          <circle
            key={`pt-${i}`}
            cx={toX(i, pts.length)} cy={toY(p.aiPercent)}
            r={p.isForecast ? 3 : 4}
            fill={p.isForecast ? color : "#fff"}
            stroke={color} strokeWidth="2"
            strokeOpacity={p.isForecast ? 0.5 : 1}
          >
            <title>{`${p.week}: ${p.aiPercent}%${p.isForecast ? " (forecast)" : ""}`}</title>
          </circle>
        ))}

        {/* Y-axis label */}
        <text
          x={12} y={PAD.top + CH / 2}
          textAnchor="middle" fontSize="10" fill="#6b7280"
          transform={`rotate(-90,12,${PAD.top + CH / 2})`}
        >
          AI %
        </text>
      </svg>
    </div>
  )
}

export default StudentForecastChart
