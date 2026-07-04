/** "or" divider between OAuth and email auth. */
export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3 text-caption text-ink-muted">
      <span className="h-px flex-1 bg-line" />
      or
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
