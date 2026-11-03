import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// SSR-safe: renders `false` on the server and on first paint, then syncs to
// the media query (and tracks live changes to it).
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduce;
}
