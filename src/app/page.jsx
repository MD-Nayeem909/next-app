"use client";

import Services from "@/components/landing/Services";
import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Services/>
      <Features />
      <CTA />
    </div>
  );
}
