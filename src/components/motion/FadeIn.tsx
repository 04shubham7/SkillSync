"use client";
import { motion, MotionProps } from "framer-motion";
import React from "react";

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  y?: number;
  as?: React.ElementType;
  motionProps?: MotionProps;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  y = 16,
  as: Component = "div",
  motionProps,
  ...rest
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay, 
        duration, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      {...motionProps}
    >
      <Component {...rest}>{children}</Component>
    </motion.div>
  );
}

export default FadeIn;
