export default function Tag({ label }) {
  return (
    <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground border border-border">
      #{label}
    </span>
  );
}
