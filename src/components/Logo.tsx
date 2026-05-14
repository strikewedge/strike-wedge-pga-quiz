export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/strike-wedge-wordmark.png"
      alt="Strike Wedge"
      width={6639}
      height={1564}
      className={`block h-7 sm:h-8 w-auto select-none ${className}`}
      draggable={false}
    />
  );
}
