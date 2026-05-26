import { Loader2, Zap } from "lucide-react"

export function SimulatePanel({
  onSimulate,
  isSimulating,
}: {
  // kept loose for now because the current mock AdminDashboard passes
  // a SimulationResult object from its own mocks.
  onSimulate: (result: any) => void
  isSimulating: boolean
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
          Simulate
        </h2>
        <Zap className="h-4 w-4 text-gray-300" />
      </header>
      <div className="p-5">
        <button
          type="button"
          disabled={isSimulating}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          onClick={() => {
            // No backend simulate endpoint yet.
            onSimulate({})
          }}
        >
          {isSimulating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {isSimulating ? "Simulating…" : "Simulate New Submission"}
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          Real-Time impact in all charts
        </p>
      </div>
    </section>
  )
}
