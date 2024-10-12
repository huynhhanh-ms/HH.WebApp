import "./progress-bar.css";

import type { ReactNode } from "react";

import { motion, useScroll, useSpring } from "framer-motion";

// ----------------------------------------------------------------------


export function ProgressBar({ children }: { children: ReactNode }) {

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX }}/>
      {children}
    </>
  );
}