import { LIKERT_OPTIONS, type LikertTone } from '../../lib/likertOptions';

// Cores do texto dos números calibradas para atingir pelo menos 4.5:1 de contraste
// contra o fundo branco (WCAG AA), tanto no estado padrão quanto no marcado.
const TONE_CLASSES: Record<LikertTone, { label: string; number: string }> = {
  red: {
    label:
      'border-red-200 peer-checked:border-red-300 peer-checked:bg-red-50 peer-checked:text-red-700 peer-checked:ring-1 peer-checked:ring-red-300',
    number: 'text-red-600'
  },
  orange: {
    label:
      'border-orange-200 peer-checked:border-orange-300 peer-checked:bg-orange-50 peer-checked:text-orange-700 peer-checked:ring-1 peer-checked:ring-orange-300',
    number: 'text-orange-700'
  },
  amber: {
    label:
      'border-amber-200 peer-checked:border-amber-300 peer-checked:bg-amber-50 peer-checked:text-amber-700 peer-checked:ring-1 peer-checked:ring-amber-300',
    number: 'text-amber-700'
  },
  lime: {
    label:
      'border-lime-200 peer-checked:border-lime-300 peer-checked:bg-lime-50 peer-checked:text-lime-700 peer-checked:ring-1 peer-checked:ring-lime-300',
    number: 'text-lime-700'
  },
  emerald: {
    label:
      'border-emerald-200 peer-checked:border-emerald-300 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-checked:ring-1 peer-checked:ring-emerald-300',
    number: 'text-emerald-700'
  }
};

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
    <article className="p-5 sm:p-6 rounded-xl border border-slate-200 hover:border-blue-200 bg-[#fbfdff] transition-all hover:shadow-sm sm:hover:scale-[1.01]">
      <fieldset className="flex flex-col gap-4 border-0 m-0 p-0">
        <legend className="flex items-start gap-3 w-full p-0">
          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
            {prefix}
            {index}
          </span>
          <span className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">{text}</span>
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
          {LIKERT_OPTIONS.map((opt) => {
            const tone = TONE_CLASSES[opt.tone];

            return (
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
                  className={`flex sm:flex-col items-center justify-between sm:justify-center px-3 py-3.5 sm:py-3 rounded-xl border bg-white hover:bg-slate-50 cursor-pointer text-center text-xs font-semibold text-slate-700 transition peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 ${tone.label}`}
                >
                  <span className={`sm:mb-1 font-bold ${tone.number}`}>{opt.value}</span>{' '}
                  <span className="text-[10px] sm:text-xs leading-tight">{opt.label}</span>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </article>
  );
}
