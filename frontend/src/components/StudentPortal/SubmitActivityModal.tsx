import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

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
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setFileContent(null);
      setError(null);
      setIsDragActive(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isValidFile = (file: File) => {
    const name = file.name.toLowerCase();
    return name.endsWith(".txt") || file.type === "text/plain";
  };

  const handleFile = (selectedFile: File | null) => {
    setError(null);
    if (!selectedFile) return;

    if (!isValidFile(selectedFile)) {
      setError("TXT files only.");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e?.target?.result;
      if (typeof result === "string") {
        setFileContent(result);
      } else {
        setError("Failed to read file content.");
      }
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setFile(null);
      setFileContent(null);
    };
    reader.readAsText(selectedFile);
  };

  const handleClearFile = () => {
    setFile(null);
    setFileContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    onSubmit(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFile(selectedFile);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold">Submit Activity</h2>
        <p className="mt-1 text-black">{activityTitle}</p>

        <hr className="my-4" />

        {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
        {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          className={`mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer ${
            isDragActive ? "border-orange-500 bg-orange-50" : "bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8" />
          <p className="text-sm">Drop or click to upload TXT</p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>

        {file && (
          <div className="mt-3 flex justify-between bg-gray-100 p-2 text-sm">
            <span className="truncate">{file.name}</span>
            {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button onClick={handleClearFile}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {fileContent && (
          <div className="mt-3 p-3 border rounded-md bg-gray-50 max-h-48 overflow-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono">
              {fileContent}
            </pre>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!file || loading || !!error}
            className="bg-orange-600 text-white"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
