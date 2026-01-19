"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

const Error = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100/50 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-base-100/50 p-10 rounded-[3rem] shadow-2xl shadow-base-100 text-center border border-base-100"
      >
        <div className="w-20 h-20 bg-rose-50 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>

        <h1 className="text-3xl font-black text-base-content mb-2 tracking-tight">
          Oops! Something went wrong
        </h1>
        <p className="text-neutral font-medium mb-8">
          We encountered an unexpected error. Please try refreshing the page or
          head back home.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="btn btn-primary btn-lg rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            <RotateCcw size={20} /> Try Again
          </button>

          <Link
            href="/"
            className="btn btn-ghost btn-lg rounded-2xl font-black text-neutral"
          >
            <Home size={20} /> Back to Home
          </Link>
        </div>
      </motion.div>

      <p className="mt-8 text-neutral text-sm font-mono uppercase tracking-widest">
        Error Code: {error.digest || "INTERNAL_SERVER_ERROR"}
      </p>
    </div>
  );
};

export default Error;
