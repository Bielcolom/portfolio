import { useEffect, useState } from "react";

/** Tracks window.innerWidth, safe to use on SSR (initializes to 0). */
const useViewportWidth = (): number => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const sync = () => setWidth(window.innerWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return width;
};

/** Tracks window.innerHeight, safe to use on SSR (initializes to 0). */
export const useViewportHeight = (): number => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const sync = () => setHeight(window.innerHeight);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return height;
};

export default useViewportWidth;
