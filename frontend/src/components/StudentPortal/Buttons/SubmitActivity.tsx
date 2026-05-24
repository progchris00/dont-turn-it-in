import { Check, Send } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SubmitActivityProps {
  onClick: () => void
  disabled?: boolean
  state?: "idle" | "submitting" | "submitted"
}

export function SubmitActivity({
  onClick,
  disabled = false,
  state = "idle",
}: SubmitActivityProps) {
  const isSubmitted = state === "submitted"

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        isSubmitted
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "bg-orange-600 text-white hover:bg-orange-700"
      }
    >
      {isSubmitted ? <Check className="size-4" /> : <Send className="size-4" />}
      {isSubmitted ? "Submitted" : state === "submitting" ? "Submitting..." : "Submit Activity"}
    </Button>
  )
}

export default SubmitActivity
