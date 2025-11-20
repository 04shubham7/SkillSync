"use client";
import { motion, MotionProps } from "framer-motion";
import React from "react";

interface SlideInProps extends React.HTMLAttributes<HTMLDivElement> {
  from?: "left" | "right" | "up" | "down";
  offset?: number;
  delay?: number;
  duration?: number;
  as?: React.ElementType;
  motionProps?: MotionProps;
}

export function SlideIn({
  children,
  from = "up",
  offset = 40,
  delay = 0,
  duration = 0.55,
  as: Component = "div",
  motionProps,
  ...rest
}: SlideInProps) {
  const variants: Record<string, { x?: number; y?: number }> = {
    left: { x: -offset },
    right: { x: offset },
    up: { y: -offset },
    down: { y: offset },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...variants[from] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration, ease: [0.23, 1, 0.32, 1] }}
      {...motionProps}
    >
      <Component {...rest}>{children}</Component>
    </motion.div>
  );
}

export default SlideIn;
