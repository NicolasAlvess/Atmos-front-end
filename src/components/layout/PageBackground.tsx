import type { ReactNode } from 'react';

const VARIANTS = {
  app: {
    bg: 'bg-[#f4f8fc]'
  },
  auth: {
    bg: 'bg-[#f1f6fb]'
  }
} as const;

export default function PageBackground({
  variant = 'app',
  className = '',
  children
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: ReactNode;
}) {
  const { bg } = VARIANTS[variant];

  return (
    <div
      className={`min-h-screen ${bg} flex flex-col font-sans text-slate-800 antialiased animate-[fadeIn_0.4s_ease-out] ${className}`}
    >
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none print:hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute -top-16 right-[-6rem] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full bg-cyan-200/25 blur-3xl" />
      </div>
      {children}
    </div>
  );
}
