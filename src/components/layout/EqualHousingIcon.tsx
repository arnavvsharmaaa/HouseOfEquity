/** Simple Equal Housing Opportunity mark: a house with an equals sign. */
export function EqualHousingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className} fill="none" stroke="currentColor">
      <path d="M3 14 16 4l13 10" strokeWidth="2.25" strokeLinejoin="round" />
      <path d="M7 12v16h18V12" strokeWidth="2.25" strokeLinejoin="round" />
      <path d="M11 17h10M11 22h10" strokeWidth="2.5" />
    </svg>
  );
}
