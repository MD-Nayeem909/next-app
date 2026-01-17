"use client";

import FadeIn from "../motion/FadeIn";

const Hero = () => {
  return (
    <div
      className="hero min-h-150"
      style={{
        backgroundImage:
          "url(https://images.pexels.com/photos/4391478/pexels-photo-4391478.jpeg)",
      }}
    >
      <div className="hero-overlay bg-black backdrop-blur-lg opacity-40"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-2xl">
          <h1 className="mb-5 text-5xl font-bold text-white">
            Reliable Delivery, <span className="text-primary">Every Time</span>
          </h1>
          <FadeIn>
            <p className="mb-8 text-lg text-gray-200">
              Experience the fastest and most secure parcel delivery service.
              Track your shipments in real-time and manage your logistics with
              ease.
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default Hero;
