export default function AtmosLogo({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M5 17c0-3.87 3.13-7 7-7s7 3.13 7 7" />
      <path d="M8.5 17c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
