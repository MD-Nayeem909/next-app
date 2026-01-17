"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, LogIn } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTheme } from "@/provider/ThemeProvider";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: session } = useSession();
  const user = session?.user;

  const navLinks = [
    { href: "/", text: "Home" },
    { href: "#about", text: "About" },
    { href: "#services", text: "Services" },
    { href: "/dashboard", text: "Dashboard" },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`w-full transition-all duration-300 sticky top-0 z-100 ${
        isScrolled ? "bg-base-200/80 backdrop-blur-lg shadow-lg" : "bg-base-100"
      } border-b border-base-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-7xl">
        <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between">
          {}
          <Logo />
          {}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="text-sm lg:text-base font-medium text-neutral hover:text-primary transition-colors relative group"
              >
                {link.text}

                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          {}

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle btn-sm text-base-content"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <ProfileDropdown />
            ) : (
              <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
                <Link
                  href="login"
                  className="flex items-center space-x-1.5 btn btn-ghost btn-md lg:space-x-2 text-xs lg:text-sm font-medium text-base-content hover:bg-primary/10 transition-all hover:shadow-md"
                >
                  <span>Login</span>

                  <LogIn className="h-3 w-3 lg:h-4 lg:w-4" />
                </Link>

                <Link
                  href="register"
                  className="text-xs lg:text-sm font-medium btn btn-primary btn-md transition-all shadow-sm hover:shadow-lg transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </div>

        {}

        {/* --- Responsive Mobile Menu --- */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-base-300">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2.5 text-sm sm:text-base font-medium text-neutral rounded-md hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  {link.text}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-base-300 flex flex-col space-y-2">
                <Link
                  href="login"
                  className="flex items-center justify-center space-x-2 px-3 py-2.5 text-sm font-medium border-2 border-base-300 rounded-md bg-base-200 hover:bg-base-100 transition-colors"
                >
                  <span>Login</span>

                  <LogIn className="h-4 w-4" />
                </Link>

                <Link
                  href="register"
                  className="px-3 py-2.5 text-sm font-medium btn btn-primary rounded-md text-center transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
