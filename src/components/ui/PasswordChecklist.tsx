import { PASSWORD_RULES } from '../../lib/passwordRules';

export default function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="mt-2 space-y-1">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        const untouched = password.length === 0;

        return (
          <li
            key={rule.id}
            className={`flex items-center gap-1.5 text-xs ${
              untouched ? 'text-slate-400' : met ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {untouched ? (
              <span className="w-3.5 h-3.5 shrink-0 rounded-full border-2 border-slate-300" />
            ) : met ? (
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
