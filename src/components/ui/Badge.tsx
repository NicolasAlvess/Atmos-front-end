import type { ReactNode } from 'react';

type Tone = 'emerald' | 'blue' | 'amber' | 'red' | 'slate';

const TONE_CLASSES: Record<Tone, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  slate: 'bg-slate-50 text-slate-500 border-slate-200'
};

export default function Badge({
  tone = 'slate',
  dot = false,
  children
}: {
  tone?: Tone;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border whitespace-nowrap ${TONE_CLASSES[tone]}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            tone === 'emerald'
              ? 'bg-emerald-500'
              : tone === 'blue'
                ? 'bg-blue-500'
                : tone === 'amber'
                  ? 'bg-amber-500'
                  : tone === 'red'
                    ? 'bg-red-500'
                    : 'bg-slate-400'
          }`}
        />
      )}
      {children}
    </span>
  );
}
