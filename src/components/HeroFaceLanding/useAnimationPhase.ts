import { useEffect, useState } from "react";

/**
 * Returns the current animation phase:
 *   -1 = before start, 1 = animating, 2 = complete (interactive)
 *
 * Also resets when the page is restored from bfcache (iOS pull-to-refresh),
 * because in that case React state is frozen and effects don't re-run.
 */
const useAnimationPhase = (replayKey: number, duration: number): number => {
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    let rafId = 0;
    let complete = 0;

    const run = () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(complete);
      setPhase(-1);
      rafId = window.requestAnimationFrame(() => {
        setPhase(1);
        complete = window.setTimeout(() => setPhase(2), duration + 100);
      });
    };

    run();

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) run();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(complete);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [replayKey, duration]);

  return phase;
};

export default useAnimationPhase;
