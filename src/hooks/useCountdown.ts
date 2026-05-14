import { useEffect, useRef, useState } from "react";

export function useCountdown(totalSeconds: number, active: boolean, onExpire: () => void) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const startRef = useRef<number | null>(null);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!active) return;
    expiredRef.current = false;
    startRef.current = performance.now();

    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - (startRef.current ?? 0)) / 1000;
      const next = Math.max(0, totalSeconds - elapsed);
      setRemaining(next);
      if (next <= 0) {
        if (!expiredRef.current) {
          expiredRef.current = true;
          onExpireRef.current();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, totalSeconds]);

  return remaining;
}

export function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
