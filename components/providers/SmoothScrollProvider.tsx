"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useLowEnd } from "@/utils/lowEnd";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lowEnd = useLowEnd();

  useEffect(() => {
    // Low-end devices keep native scroll: lighter, no per-frame rAF overhead
    if (lowEnd) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // @ts-ignore
    window.lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      // @ts-ignore
      delete window.lenis;
      lenis.destroy();
    };
  }, [lowEnd]);

  return <>{children}</>;
}
