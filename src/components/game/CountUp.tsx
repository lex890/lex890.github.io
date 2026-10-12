import { useEffect, useState } from 'react';

type Props = {
  /** Final number to show. */
  value: number;
  /** Zero-pad to this many digits ("2" → "02"). */
  pad?: number;
  /** Animation length in ms (spec: ≤ 800). */
  duration?: number;
};

const format = (n: number, pad: number) => String(n).padStart(pad, '0');

/**
 * Counts from 0 to `value` once, when it first scrolls into view.
 * Use with `client:visible` — hydration itself is the "scrolled into view"
 * trigger. Server HTML already shows the final number (no-JS and
 * reduced-motion users just see that). Screen readers get the final value
 * only, never the ticking digits.
 */
export default function CountUp({ value, pad = 0, duration = 800 }: Props) {
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCurrent(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    setCurrent(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <>
      <span aria-hidden="true">{format(current, pad)}</span>
      <span className="sr-only">{format(value, pad)}</span>
    </>
  );
}
