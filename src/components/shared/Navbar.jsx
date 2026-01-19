"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, LogIn, LogOut } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
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
      if (isMenuOpen) return;
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY, isMenuOpen]);

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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  const { data: session } = useSession();
  const user = session?.user;

  const navLinks = [
    { href: "/", text: "Home", public: true },
    { href: "/products", text: "All Products", public: true },
    { href: "/dashboard/my-products", text: "My Products", public: false },
    { href: "/dashboard", text: "Dashboard", public: false },
  ];

  const visibleLinks = navLinks.filter((link) => link.public || !!user);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible || isMenuOpen ? 0 : -100 }}
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
            {visibleLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="text-sm lg:text-base font-medium text-neutral hover:text-primary transition-colors relative group"
              >
                {link.text}

                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
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

        {/* --- Responsive Mobile Menu --- */}
        <div
          className={`md:hidden z-50 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-base-300">
            <div className="flex flex-col space-y-1">
              {/* Dynamic Nav Links */}
              {visibleLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 px-2 text-base font-bold text-neutral rounded-sm hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  {link.text}
                </Link>
              ))}

              {user ? (
                /* Logged In User Mobile View */
                <div className="pt-4 mt-2 border-t border-base-100/50 flex flex-col space-y-2">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold btn btn-error btn-outline rounded-sm transition-all"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              ) : (
                /* Guest Mobile View */
                <div className="pt-4 mt-2 border-t border-base-300 flex flex-col space-y-2 px-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold border-2 border-base-100 rounded-xl bg-base-100 hover:bg-base-300 transition-all"
                  >
                    <span>Login</span>
                    <LogIn size={16} className="text-primary" />
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 text-sm font-bold btn btn-primary rounded-sm text-center shadow-lg shadow-primary/20 transition-all"
                  >
                    Register Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </motion.header>
    
  );
};

export default Navbar;
