export function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-display font-extrabold tracking-tight ${className}`}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 26L20 6L26 12L14 26H8Z"
          fill="currentColor"
        />
        <circle cx="22" cy="10" r="2.2" fill="var(--color-sw-gold)" />
      </svg>
      <span>STRIKE WEDGE</span>
    </div>
  );
}
