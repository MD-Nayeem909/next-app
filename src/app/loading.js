"use client";
import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100/50">
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-20 h-20 border-4 border-base-100 border-t-primary rounded-full"
        />
        {/* Inner Pulsing Logo or Icon */}
        <div className="absolute">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
          >
            <div className="w-4 h-4 bg-primary rounded-full" />
          </motion.div>
        </div>
      </div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-xl font-black text-base-content tracking-tighter italic uppercase"
      >
        SwiftParcel <span className="text-primary">Loading...</span>
      </motion.h2>
      <p className="text-neutral text-sm font-medium mt-2">
        Preparing your experience
      </p>
    </div>
  );
};

export default Loading;
