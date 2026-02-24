type StatusCardProps = {
  label: string;
  value: string;
  hint?: string;
  valueClassName?: string;
};

export function StatusCard({ label, value, hint, valueClassName }: StatusCardProps) {
  return (
    <article className="panel p-4">
      <p className="text-xs uppercase tracking-wider text-mute">{label}</p>
      <p className={`mt-2 text-2xl font-semibold text-text ${valueClassName ?? ''}`}>{value}</p>
      {hint ? <p className="mt-2 text-xs text-mute">{hint}</p> : null}
    </article>
  );
}
