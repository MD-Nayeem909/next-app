"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
      name: "Basic",
      monthlyPrice: "$19",
      yearlyPrice: "$199",
      features: [
        "5 Projects",
        "10 GB Storage",
        "Basic Analytics",
        "Community Support",
        "Custom Domains",
      ],
      buttonText: "Get Started",
      isPopular: false,
    },
    {
      name: "Pro",
      monthlyPrice: "$49",
      yearlyPrice: "$499",
      features: [
        "Unlimited Projects",
        "50 GB Storage",
        "Advanced Analytics",
        "Priority Email Support",
        "Custom Domains",
        "Team Collaboration",
      ],
      buttonText: "Start Free Trial",
      isPopular: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: "$99",
      yearlyPrice: "$999",
      features: [
        "All Pro Features",
        "Unlimited Storage",
        "Real-time Analytics",
        "24/7 Phone Support",
        "Dedicated Account Manager",
        "SAML/SSO Integration",
      ],
      buttonText: "Contact Sales",
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
    <div className="min-h-screen w-full relative overflow-hidden">
      {}
      
      {}
      <div className="relative z-10 font-inter py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-base-content tracking-tight leading-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-lg text-neutral max-w-2xl mx-auto">
              Choose the plan that&apos;s right for you. No hidden fees, no
              surprises.
            </p>
          </div>

          {}
          <div className="mt-10 flex justify-center">
            <div
              className="relative flex items-center p-1 rounded-full border border-base-300"
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "none",
              }}
            >
              <button
                ref={monthlyButtonRef}
                onClick={() => setIsMonthly(true)}
                className={`relative z-10 py-2 px-6 rounded-full text-sm font-medium text-center transition-all duration-300 ${
                  isMonthly
                    ? "text-base-content"
                    : "text-base-300/60 hover:text-base-100"
                }`}
              >
                Monthly
              </button>
              <button
                ref={yearlyButtonRef}
                onClick={() => setIsMonthly(false)}
                className={`relative z-10 py-2 px-6 rounded-full text-sm font-medium text-center transition-all duration-300 flex items-center justify-center ${
                  !isMonthly
                    ? "text-base-content"
                    : "text-base-300/60 hover:text-base-100"
                }`}
              >
                Yearly
                <span className="ml-2 px-2 py-0.5 bg-primary text-base-content text-xs font-bold rounded-full">
                  20% off
                </span>
              </button>
              {}
              {activeButtonWidth > 0 && (
                <motion.div
                  className="absolute inset-y-1 rounded-full shadow-md"
                  style={{
                    background: "rgba(202, 44, 72, 0.8)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
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
                    ? "border-primary bg-base-100/60 "
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
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-base-content text-xs font-semibold uppercase rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-base-content">
                  {tier.name}
                </h3>
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

                <ul role="list" className="mt-8 space-y-3 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <p className="ml-3 text-base text-neutral">
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <motion.button
                    className={`w-full py-2 px-4 rounded-md text-base font-medium shadow-sm transition-all duration-300 inline-flex items-center justify-center border ${
                      tier.isPopular
                        ? "bg-primary text-base-content border-primary hover:bg-primary/80"
                        : "bg-base-100 text-primary border-primary/30 hover:bg-primary/10"
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
    </div>
  );
};
export default Pricing;
