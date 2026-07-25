"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative w-16 h-16"
      >
        {/* Top Left - Blue */}
        <motion.div
          animate={{
            borderRadius: ["25%", "50%", "25%"], // Morph between Square and Circle
            scale: [1, 0.8, 1],
            x: [0, -6, 0], // Move outwards and inwards
            y: [0, -6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-7 h-7 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        />

        {/* Top Right - Purple */}
        <motion.div
          animate={{
            borderRadius: ["25%", "50%", "25%"],
            scale: [1, 0.8, 1],
            x: [0, 6, 0],
            y: [0, -6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1, // Slight stagger for a mesmerizing wave effect
          }}
          className="absolute top-0 right-0 w-7 h-7 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
        />

        {/* Bottom Left - Emerald */}
        <motion.div
          animate={{
            borderRadius: ["25%", "50%", "25%"],
            scale: [1, 0.8, 1],
            x: [0, -6, 0],
            y: [0, 6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
          className="absolute bottom-0 left-0 w-7 h-7 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        />

        {/* Bottom Right - Amber / Orange */}
        <motion.div
          animate={{
            borderRadius: ["25%", "50%", "25%"],
            scale: [1, 0.8, 1],
            x: [0, 6, 0],
            y: [0, 6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="absolute bottom-0 right-0 w-7 h-7 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
        />
      </motion.div>
    </div>
  );
}