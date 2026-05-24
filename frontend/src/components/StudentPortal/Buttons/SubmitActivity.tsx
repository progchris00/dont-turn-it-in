import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitActivityProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SubmitActivity({
  onClick,
  disabled = false,
}: SubmitActivityProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="bg-orange-600 text-white hover:bg-orange-700"
    >
      {disabled ? (
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
