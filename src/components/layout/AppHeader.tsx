import type { ReactNode } from 'react';
import AtmosLogo from '../icons/AtmosLogo';

export default function AppHeader({
  onLogoClick,
  title = 'Atmos',
  badge,
  right,
  sticky = false
}: {
  onLogoClick?: () => void;
  title?: string;
  badge?: ReactNode;
  right?: ReactNode;
  sticky?: boolean;
}) {
  return (
    <header
      className={`${sticky ? 'sticky top-0' : 'relative'} z-40 bg-white/95 backdrop-blur-md border-b border-[#dce7f2] shadow-sm print:hidden`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div
          className={`flex items-center space-x-3 min-w-0 ${onLogoClick ? 'cursor-pointer' : ''}`}
          onClick={onLogoClick}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-sm shrink-0">
            <AtmosLogo />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-bold tracking-tight text-slate-800 leading-tight truncate">
              {title}
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
              Diagnóstico &amp; BI
            </span>
          </div>
          {badge}
        </div>

        {right && <div className="flex items-center gap-3 shrink-0">{right}</div>}
      </div>
    </header>
  );
}
