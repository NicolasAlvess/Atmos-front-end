import type { ReactNode } from 'react';

type Tone = 'emerald' | 'blue' | 'violet' | 'amber' | 'red' | 'slate';

const TONE_CLASSES: Record<Tone, { badge: string; dot: string }> = {
  emerald: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  blue: { badge: 'bg-blue-50 text-blue-700 border-blue-200/60', dot: 'bg-blue-500' },
  violet: { badge: 'bg-violet-50 text-violet-700 border-violet-200/60', dot: 'bg-violet-500' },
  amber: { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  red: { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  slate: { badge: 'bg-slate-50 text-slate-500 border-slate-200', dot: 'bg-slate-400' }
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
  const classes = TONE_CLASSES[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border whitespace-nowrap ${classes.badge}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${classes.dot}`} />}
      {children}
    </span>
  );
}
