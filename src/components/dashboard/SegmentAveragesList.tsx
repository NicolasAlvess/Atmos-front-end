import { getClimateBarColor } from '../../lib/climateColor';
import type { SegmentAverage } from '../../lib/reportInsights';

export default function SegmentAveragesList({ segments }: { segments: SegmentAverage[] }) {
  if (segments.length === 0) {
    return <p className="text-sm text-slate-500 italic">Aguardando dados.</p>;
  }

  return (
    <div className="space-y-3">
      {segments.map((segment) => (
        <div key={segment.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 font-medium truncate pr-4" title={segment.label}>
              {segment.label}
            </span>
            <span className="font-bold text-slate-800">
              {segment.media.toFixed(1)}
              <span className="text-slate-400 font-normal"> ({segment.total})</span>
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 print:border print:border-slate-300">
            <div
              className="h-2 rounded-full"
              style={{ width: `${(segment.media / 5) * 100}%`, backgroundColor: getClimateBarColor(segment.media) }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
