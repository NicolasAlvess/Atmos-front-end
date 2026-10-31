import type { ReactNode } from 'react';

const VARIANTS = {
  app: {
    bg: 'bg-[#f4f8fc]',
    gradient:
      'radial-gradient(at 0% 0%, rgba(219, 234, 254, 0.4) 0px, transparent 50%),' +
      'radial-gradient(at 100% 0%, rgba(224, 242, 254, 0.3) 0px, transparent 50%)'
  },
  auth: {
    bg: 'bg-[#f1f6fb]',
    gradient:
      'radial-gradient(at 0% 0%, rgba(219, 234, 254, 0.6) 0px, transparent 50%),' +
      'radial-gradient(at 100% 0%, rgba(224, 242, 254, 0.5) 0px, transparent 50%),' +
      'radial-gradient(at 50% 100%, rgba(219, 234, 254, 0.4) 0px, transparent 50%)'
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
  const { bg, gradient } = VARIANTS[variant];

  return (
    <div
      className={`min-h-screen ${bg} flex flex-col font-sans text-slate-800 antialiased animate-[fadeIn_0.4s_ease-out] ${className}`}
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none print:hidden"
        style={{ backgroundImage: gradient }}
      />
      {children}
    </div>
  );
}
