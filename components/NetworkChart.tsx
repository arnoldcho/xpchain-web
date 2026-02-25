import { formatSeconds } from '@/lib/format';

type NetworkChartProps = {
  points: number[];
};

export function NetworkChart({ points }: NetworkChartProps) {
  const max = Math.max(...points, 1);

  return (
    <div className="panel p-4">
      <p className="mb-3 text-sm text-mute">최근 60개 블록 간격 (왼쪽 과거 · 오른쪽 최신)</p>
      <div className="flex h-36 items-end gap-1">
        {points.map((point, index) => {
          const ratio = point / max;
          return (
            <div key={`${point}-${index}`} className="group relative h-full flex-1">
              <div
                className="w-full rounded-sm bg-accent/80 transition hover:bg-accent"
                style={{ height: `${Math.max(ratio * 100, 3)}%` }}
                title={formatSeconds(point)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
