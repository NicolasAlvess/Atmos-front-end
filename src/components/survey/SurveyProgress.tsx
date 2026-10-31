export default function SurveyProgress({
  answered,
  total
}: {
  answered: number;
  total: number;
}) {
  const percent = total > 0 ? Math.min(100, Math.round((answered / total) * 100)) : 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-[#dce7f2] px-4 sm:px-6 lg:px-8 py-2">
      <div className="max-w-5xl mx-auto flex items-center gap-3">
        <div className="flex-grow h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 shrink-0 tabular-nums">
          {percent}%
        </span>
      </div>
    </div>
  );
}
