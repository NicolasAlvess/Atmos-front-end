import { LIKERT_OPTIONS } from '../../lib/likertOptions';

export default function LikertQuestion({
  name,
  text,
  index,
  prefix = '',
  value,
  onChange
}: {
  name: string;
  text: string;
  index: number;
  prefix?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <article className="p-5 sm:p-6 rounded-xl border border-slate-200 hover:border-blue-200 bg-[#fbfdff] transition-all">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
            {prefix}
            {index}
          </span>
          <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">{text}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
          {LIKERT_OPTIONS.map((opt) => (
            <div key={`${name}_${opt.value}`}>
              <input
                type="radio"
                id={`${name}_${opt.value}`}
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                className="peer sr-only"
                required
              />
              <label
                htmlFor={`${name}_${opt.value}`}
                className="flex sm:flex-col items-center justify-between sm:justify-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-center text-xs font-semibold text-slate-700 transition peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:ring-1 peer-checked:ring-blue-600"
              >
                <span className="text-slate-400 sm:mb-1 font-bold peer-checked:text-blue-700">
                  {opt.value}
                </span>
                <span className="text-[10px] sm:text-xs leading-tight">{opt.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
