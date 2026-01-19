"use client";

import { motion } from "framer-motion";

export default function AISpeakingBars() {
  const bars = Array.from({ length: 10 });

  return (
    <div className="flex items-end gap-1 p-4 h-10 overflow-hidden">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-sm bg-primary origin-bottom"
          style={{ height: 24 }} // fixed base height (layout stable)
          initial={{ scaleY: 0.3 }}
          animate={{ scaleY: [0.3, 0.6, 0.4, 0.9, 0.5, 1, 0.35] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
          aria-hidden
        />
      ))}
      <span className="sr-only">AI is speaking</span>
    </div>
  );
}
