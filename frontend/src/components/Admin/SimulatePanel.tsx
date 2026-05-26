import { Loader2, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Simulate</CardTitle>
            <CardDescription>
              Trigger a mock submission to refresh the dashboard.
            </CardDescription>
          </div>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <Button
          type="button"
          disabled={isSimulating}
          className="w-full"
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
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Real-Time impact in all charts
        </p>
      </CardContent>
    </Card>
  )
}
