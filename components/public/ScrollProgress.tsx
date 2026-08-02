"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const element = document.getElementById("right-panel-scroll");
    if (element) setContainer(element);
  }, []);

  const { scrollYProgress } = useScroll({
    container: container ? { current: container } : undefined,
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!container) return null;

  return (
    <motion.div
      // Changed to 'absolute' and z-index ensures it sits above the navbar background
      className="absolute hidden md:flex top-0 left-0 right-0 w-full h-[1px] md:h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}