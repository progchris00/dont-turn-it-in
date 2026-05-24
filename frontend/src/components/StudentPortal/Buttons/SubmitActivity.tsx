import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitActivityProps {
  onClick: () => void;
  disabled?: boolean;
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
      {state === "submitting" ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Send className="size-4" />
          Submit Activity
        </>
      )}
    </Button>
  );
}

export default SubmitActivity;
