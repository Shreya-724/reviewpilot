export function Spinner({ size = "md" }: { size?: "sm" | "md" }) {
  const dimensions = size === "sm" ? "h-4 w-4" : "h-8 w-8";
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${dimensions}`}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center text-indigo-600">
      <Spinner />
    </div>
  );
}