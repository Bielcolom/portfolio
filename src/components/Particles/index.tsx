"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* three.js, the shapes and the shaders arrive as one chunk. Inside it every
   import is static, so a hot reload of any of them restarts the engine */
const Field = dynamic(() => import("./Field"), { ssr: false });

/** Mounts the particle field once the hero has played its entrance and the browser is idle */
const Particles = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0;
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      } else {
        setReady(true);
      }
    }, 1400);
    return () => {
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  return ready ? <Field /> : null;
};

export default Particles;
