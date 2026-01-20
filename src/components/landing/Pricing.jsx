"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Rocket, Zap } from "lucide-react";
const AnimatedPrice = ({ price }) => {
  return (
    <motion.span
      className="inline-block"
      key={price}
      initial={{
        opacity: 0,
        filter: "blur(8px)",
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      {price}
    </motion.span>
  );
};
const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const monthlyButtonRef = useRef(null);
  const yearlyButtonRef = useRef(null);
  const [activeButtonLeft, setActiveButtonLeft] = useState(0);
  const [activeButtonWidth, setActiveButtonWidth] = useState(0);
  useEffect(() => {
    const updateButtonMetrics = () => {
      if (monthlyButtonRef.current && yearlyButtonRef.current) {
        if (isMonthly) {
          setActiveButtonLeft(monthlyButtonRef.current.offsetLeft);
          setActiveButtonWidth(monthlyButtonRef.current.offsetWidth);
        } else {
          setActiveButtonLeft(yearlyButtonRef.current.offsetLeft);
          setActiveButtonWidth(yearlyButtonRef.current.offsetWidth);
        }
      }
    };
    updateButtonMetrics();
    window.addEventListener("resize", updateButtonMetrics);
    return () => {
      window.removeEventListener("resize", updateButtonMetrics);
    };
  }, [isMonthly]);
  const pricingTiers = [
    {
      name: "Starter",
      icon: <Rocket className="text-blue-500" size={24} />,
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      description: "Basic access for personal use and individuals.",
      features: [
        "Up to 5 Items Management",
        "Single Profile Access",
        "Basic Dashboard View",
        "Standard Email Support",
        "Public Portfolio Link",
      ],
      buttonText: "Join for Free",
      isPopular: false,
    },
    {
      name: "Professional",
      icon: <Zap className="text-rose-500" size={24} />,
      monthlyPrice: "$19",
      yearlyPrice: "$190",
      description: "Comprehensive tools for power users and freelancers.",
      features: [
        "Unlimited Items Management",
        "Priority Dashboard Features",
        "Custom Category Creation",
        "Download as PDF/CSV",
        "Premium Profile Themes",
        "Priority Support",
      ],
      buttonText: "Go Pro Now",
      isPopular: true,
    },
    {
      name: "Business",
      icon: <Crown className="text-amber-500" size={24} />,
      monthlyPrice: 49,
      yearlyPrice: 490,
      description: "Advanced features for teams and small businesses.",
      features: [
        "Everything in Pro",
        "Multi-user Access (3 seats)",
        "Advanced Analytics & Logs",
        "Custom Branding/White-label",
        "API Access (Upcoming)",
        "Dedicated Account Manager",
      ],
      buttonText: "Get Enterprise",
      isPopular: false,
    },
  ];
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const cardVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };
  return (
    <section id="pricing" className="w-full relative overflow-hidden">
      {}
      <div className="relative z-10 font-inter flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl lg:text-4xl font-bold text-base-content tracking-tight leading-tight">
              Plans for Every Stage
            </h1>
            <p className="mt-4 text-lg text-neutral max-w-2xl mx-auto">
              Simple, transparent pricing. No hidden fees. Choose the plan that
              best fits your needs.
            </p>
          </div>

          {}
          <div className="mt-10 flex justify-center">
            <div className="relative flex items-center p-1 rounded-full border border-primary">
              <button
                ref={monthlyButtonRef}
                onClick={() => setIsMonthly(true)}
                className={`relative z-10 py-2 px-6 rounded-full text-sm font-medium text-center transition-all duration-300 ${
                  isMonthly
                    ? "text-white"
                    : "text-base-content hover:text-primary"
                }`}
              >
                Monthly
              </button>
              <button
                ref={yearlyButtonRef}
                onClick={() => setIsMonthly(false)}
                className={`relative z-10 py-2 px-6 rounded-full text-sm font-medium text-center transition-all duration-300 flex items-center justify-center ${
                  !isMonthly
                    ? "text-white"
                    : "text-base-content hover:text-primary"
                }`}
              >
                Yearly
                <span className="ml-2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                  20% off
                </span>
              </button>
              {}
              {activeButtonWidth > 0 && (
                <motion.div
                  className="absolute inset-y-1 rounded-full shadow-md bg-primary"
                  initial={false}
                  animate={{
                    left: activeButtonLeft,
                    width: activeButtonWidth,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </div>
          </div>

          {}
          <motion.div
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {pricingTiers.map((tier) => (
              <motion.div
                key={tier.name}
                className={`relative flex flex-col p-8 rounded-xl border transition-all duration-300 ${
                  tier.isPopular
                    ? "border-primary/40 bg-base-100/50"
                    : "border-base-300 bg-base/80"
                }`}
                style={{
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: tier.isPopular
                    ? "0 10px 20px rgba(202, 44, 72, 0.15), 0 4px 8px rgba(0,0,0,0.1)"
                    : "0 5px 15px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)",
                }}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  boxShadow: tier.isPopular
                    ? "0 25px 50px -12px rgba(202, 44, 72, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.15)"
                    : "0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-semibold uppercase rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 ring-1 ring-slate-100">
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-base-content">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-neutral leading-relaxed font-medium">
                    {tier.description}
                  </p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-base-content">
                    <AnimatedPrice
                      price={isMonthly ? tier.monthlyPrice : tier.yearlyPrice}
                    />
                  </span>
                  <span className="ml-1 text-xl font-medium text-neutral">
                    /{isMonthly ? "month" : "year"}
                  </span>
                </div>
                <p className="mt-4 text-neutral text-sm">
                  {tier.name === "Basic" &&
                    "For individuals and small teams getting started."}
                  {tier.name === "Pro" &&
                    "Perfect for growing businesses and advanced users."}
                  {tier.name === "Enterprise" &&
                    "Tailored for large organizations with specific needs."}
                </p>

                <ul role="list" className="mt-8 space-y-3 grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="shrink-0 h-5 w-5 text-primary mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <p className="ml-3 text-base text-neutral">{feature}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <motion.button
                    className={`w-full py-2 px-4 rounded-md text-base font-medium shadow-sm transition-all duration-300 inline-flex items-center justify-center border ${
                      tier.isPopular
                        ? "bg-primary text-white border-primary hover:bg-primary/80"
                        : "bg-primary/10 text-primary border-primary/30 hover:text-white hover:bg-primary"
                    }`}
                    style={{
                      backdropFilter: "blur(5px)",
                      WebkitBackdropFilter: "blur(5px)",
                    }}
                    whileHover={{
                      scale: 1.005,
                      boxShadow: tier.isPopular
                        ? "0 4px 8px rgba(202, 44, 72, 0.3)"
                        : "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{
                      scale: 0.995,
                    }}
                  >
                    {tier.buttonText}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default Pricing;
