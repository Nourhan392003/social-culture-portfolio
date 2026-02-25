"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 1200;
      const increment = value / (duration / 16);

      const counter = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplay(value);
          clearInterval(counter);
        } else {
          setDisplay(Math.floor(start));
        }
      }, 16);
    }
  }, [isInView, value]);

  return (
    <motion.span ref={ref}>
      {display}
    </motion.span>
  );
}