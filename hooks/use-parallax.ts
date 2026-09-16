"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Returns a px offset that drifts an element vertically based on how far its
 * center sits from the viewport center — a cheap scroll-linked parallax
 * without a scroll library. Disabled entirely under prefers-reduced-motion.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, speed = 0.15) {
  const [offset, setOffset] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      tickingRef.current = false;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elementCenterY = rect.top + rect.height / 2;
      const viewportCenterY = window.innerHeight / 2;
      setOffset((viewportCenterY - elementCenterY) * speed);
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, speed]);

  return offset;
}
