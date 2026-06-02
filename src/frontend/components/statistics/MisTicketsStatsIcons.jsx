/** Line icons matching the MIS TICKETS statistics mockup. */

export function HorseHeadIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 18c1.5-4 4-7 8-8 1.5-.3 2.5-1.2 3-2.5.3-.8 1-1.5 2-1.5 1.2 0 2 .8 2 2 0 .5-.2 1-.5 1.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 14c2-1 4-1.5 6-1.5 3 0 5.5 1 7.5 3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="16.5" cy="9" r="0.75" fill="currentColor" />
      <path
        d="M5 19h3M16 19h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
