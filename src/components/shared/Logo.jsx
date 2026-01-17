import { Package } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <section className="flex items-center">
      <Link href="/" className="flex items-center space-x-2 group">
        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
          <span className="text-white font-bold text-base sm:text-lg lg:text-xl">
            <Package />
          </span>
        </div>
        <span className="text-xl font-black tracking-tighter">
          FAST<span className="text-primary">PARCEL</span>
        </span>
      </Link>
    </section>
  );
};

export default Logo;
