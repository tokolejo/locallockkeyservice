"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";
import { useAnimation } from "@/context/AnimationContext";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  duration?: number;
  scale?: boolean;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  duration,
  scale = false,
}: ScrollRevealProps) {
  const { mode } = useAnimation();

  // If minimal mode, use quick light transitions
  if (mode === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: direction === "up" ? 12 : direction === "down" ? -12 : 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.25, delay: delay * 0.5, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Direction offsets
  const getOffset = () => {
    switch (direction) {
      case "up":
        return { y: mode === "dynamic" ? 45 : 28, x: 0 };
      case "down":
        return { y: mode === "dynamic" ? -45 : -28, x: 0 };
      case "left":
        return { x: mode === "dynamic" ? 45 : 28, y: 0 };
      case "right":
        return { x: mode === "dynamic" ? -45 : -28, y: 0 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();
  const initialScale = scale ? (mode === "dynamic" ? 0.92 : 0.96) : 1;

  if (mode === "dynamic") {
    return (
      <motion.div
        initial={{
          opacity: 0,
          x: offset.x,
          y: offset.y,
          scale: initialScale,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          type: "spring",
          stiffness: 110,
          damping: 14,
          mass: 0.8,
          delay,
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Clean / High-End Pro mode (Default)
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: initialScale,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: duration || 0.65,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
