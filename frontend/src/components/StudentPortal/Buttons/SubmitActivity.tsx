import { Send } from "lucide-react";

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
      <Send className="size-4" />
      {disabled ? "Submitting..." : "Submit Activity"}
    </Button>
  );
}

export default SubmitActivity;
