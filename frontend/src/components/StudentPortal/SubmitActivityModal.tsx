import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SubmitActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityTitle: string;
  onSubmit: (file: File | null) => void;
  loading?: boolean;
}

export function SubmitActivityModal({
  isOpen,
  onClose,
  activityTitle,
  onSubmit,
  loading = false,
}: SubmitActivityModalProps) {
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <h2 className="text-lg font-semibold">Submit Activity</h2>
        <p className="mt-1 text-sm text-gray-500">{activityTitle}</p>

        {/* File Upload */}
        <div className="mt-4">
          <label className="text-sm font-medium">Upload .txt file</label>

          <input
            type="file"
            accept=".txt"
            className="mt-2 w-full rounded-md border p-2 text-sm"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
