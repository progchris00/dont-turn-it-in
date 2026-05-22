// components/Buttons/SubmitActivity.tsx
import React from "react";
import { Send } from "lucide-react";

interface SubmitActivityProps {
  onClick: () => void;
  disabled?: boolean;
}

const SubmitActivity: React.FC<SubmitActivityProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="button-primary text-sm text-white px-4 py-2 rounded-md font-normal hover-button-secondary-color transition cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Send size={16} />
      {disabled ? "Submitting..." : "Submit Application"}
    </button>
  );
};

export default SubmitActivity;
