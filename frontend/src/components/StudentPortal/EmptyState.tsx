import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  buttonLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title,
  description,
  buttonLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
        {description}
      </p>
      {buttonLabel ? (
        <Button
          onClick={onAction}
          className="mt-6 bg-orange-600 text-white hover:bg-orange-700"
        >
          {buttonLabel}
        </Button>
      ) : null}
    </div>
  );
}
