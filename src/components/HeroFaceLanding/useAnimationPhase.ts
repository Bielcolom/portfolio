import { useEffect, useState } from "react";

/**
 * Returns the current animation phase:
 *   -1 = before start, 1 = animating, 2 = complete (interactive)
 */
const useAnimationPhase = (replayKey: number, duration: number): number => {
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    let complete = 0;
    const start = window.requestAnimationFrame(() => {
      setPhase(1);
      complete = window.setTimeout(() => setPhase(2), duration + 100);
    });
    return () => {
      window.cancelAnimationFrame(start);
      window.clearTimeout(complete);
    };
  }, [replayKey, duration]);

  return phase;
};

export default useAnimationPhase;
