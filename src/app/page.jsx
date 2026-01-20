"use client";

import Services from "@/components/landing/Services";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import Tracking from "@/components/landing/Tracking";
import NewsletterSection from "@/components/landing/Newsletter";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import FAQ from "@/components/landing/FAQ";
import AboutUs from "@/components/landing/AboutUs";

export default function Home() {
  return (
    <div className="bg-base-100/40 space-y-30">
      <Hero />
      <div className="space-y-30 px-4 pb-30">
        <Tracking />
        <AboutUs />
        <Services />
        <FeaturedProducts />
        <Features />
        <NewsletterSection />
        <Pricing />
        <Testimonials />
        <FAQ />
      </div>
    </div>
  );
}
