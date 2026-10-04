"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type MotionSectionProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function MotionSection({
  children,
  delay = 0,
  className = "",
}: MotionSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
