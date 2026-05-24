import { UserCircle2 } from "lucide-react"
import { useCallback, useState } from "react"

import Navbar from "@/components/Common/Navbar"
import { AnalyticsSection } from "./AnalyticsSection"
import {
  MOCK_AI_DISTRIBUTION,
  MOCK_FORECAST,
  MOCK_GRADE_VS_AI,
  MOCK_OVERVIEW,
  MOCK_STUDENTS,
  MOCK_WEEKLY_TREND,
} from "./data"
import { OverviewPanel } from "./OverviewPanel"
import { SimulatePanel } from "./SimulatePanel"
import { StudentTable } from "./StudentTable/StudentTable"
import type { GradeVsAIPoint, OverviewStats, RiskLevel, SimulationResult, StudentRow, WeeklyTrendPoint } from "./types"

// ─── RoleBar sub-component ────────────────────────────────────────────────────

interface RoleBarProps {
  userName: string
  role: string
  onSwitchRole: () => void
}

function RoleBar({ userName, role, onSwitchRole }: RoleBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-2">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <UserCircle2 className="h-7 w-7 text-gray-400" aria-hidden="true" />
        <span className="font-medium">{userName}</span>
      </div>
      <button
        type="button"
        onClick={onSwitchRole}
        className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
      >
        Switch Role: {role}
      </button>
    </div>
  )
}

// ─── Hook: simulation state ───────────────────────────────────────────────────

function useSimulation(
  initialOverview: OverviewStats,
  initialStudents: StudentRow[],
  initialTrend: WeeklyTrendPoint[],
  initialGradeVsAI: GradeVsAIPoint[],
) {
  const [overview, setOverview] = useState(initialOverview)
  const [students, setStudents] = useState(initialStudents)
  const [weeklyTrend, setWeeklyTrend] = useState(initialTrend)
  const [gradeVsAI, setGradeVsAI] = useState(initialGradeVsAI)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = useCallback((result: SimulationResult) => {
    setIsSimulating(true)

    // Brief delay to give a "real-time" feel before updating charts
    setTimeout(() => {
      const isHighRisk: boolean =
        result.riskLevel === "High" || result.riskLevel === "Very High"

      // Update overview stats
      setOverview((prev) => ({
        ...prev,
        submissions: prev.submissions + 1,
        avgAiPercent: Math.round((prev.avgAiPercent + result.aiPercent) / 2),
        highRiskCount: isHighRisk ? prev.highRiskCount + 1 : prev.highRiskCount,
      }))

      // Add simulated student row
      const newRisk: RiskLevel = result.riskLevel
      const simStudent: StudentRow = {
        id: `sim-${Date.now()}`,
        name: result.studentName,
        riskScore: result.aiPercent,
        submissions: 1,
        avgAiPercent: result.aiPercent,
        gradePercent: Math.max(0, 100 - result.aiPercent),
        gradeTrend: result.aiPercent > 70 ? "down" : "stable",
        predictiveFlag: newRisk,
        actionableRemark:
          isHighRisk ? "Immediate review required" : "Continue monitoring",
      }
      setStudents((prev) => [simStudent, ...prev])

      // Append new weekly trend point
      setWeeklyTrend((prev) => [
        ...prev,
        { week: prev.length, aiPercent: result.aiPercent },
      ])

      // Add scatter point
      setGradeVsAI((prev) => [
        ...prev,
        {
          aiPercent: result.aiPercent,
          gradePercent: Math.max(0, 100 - result.aiPercent),
        },
      ])

      setIsSimulating(false)
    }, 400)
  }, [])

  return {
    overview,
    students,
    weeklyTrend,
    gradeVsAI,
    isSimulating,
    handleSimulate,
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AdminDashboard
 * Full-page administrator view showing classroom AI analytics.
 * Replace MOCK_* constants with real API calls when the backend is ready.
 */
export function AdminDashboard() {
  const {
    overview,
    students,
    weeklyTrend,
    gradeVsAI,
    isSimulating,
    handleSimulate,
  } = useSimulation(
    MOCK_OVERVIEW,
    MOCK_STUDENTS,
    MOCK_WEEKLY_TREND,
    MOCK_GRADE_VS_AI,
  )

  function handleSwitchRole() {
    // Navigate to portal selection — update with router.navigate when wired
    window.location.href = "/portal-select"
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf4f0]">
      <Navbar />

      <RoleBar
        userName="User Admin"
        role="Admin"
        onSwitchRole={handleSwitchRole}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        {/* Top row: Overview + Simulate */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
          <OverviewPanel stats={overview} />
          <div className="lg:w-80">
            <SimulatePanel onSimulate={handleSimulate} isSimulating={isSimulating} />
          </div>
        </div>

        {/* Analytics charts */}
        <AnalyticsSection
          weeklyTrend={weeklyTrend}
          forecast={MOCK_FORECAST}
          aiDistribution={MOCK_AI_DISTRIBUTION}
          gradeVsAI={gradeVsAI}
        />

        {/* Student table */}
        <StudentTable data={students} />
      </main>
    </div>
  )
}

export default AdminDashboard
