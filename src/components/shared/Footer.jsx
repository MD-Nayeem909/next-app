"use client";

import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const footerLinks = {
    Quick_links: [
      {
        name: "Home",
        href: "#",
      },
      {
        name: "About",
        href: "/#about",
      },
      {
        name: "Pricing",
        href: "/#pricing",
      },
      {
        name: "Features",
        href: "/#features",
      },
      {
        name: "FAQs",
        href: "/#faq",
      },
    ],
    resources: [
      {
        name: "Quick Start",
        href: "#",
      },
      {
        name: "Documentation",
        href: "#",
      },
    ],
    Company: [
      {
        name: "About us",
        href: "#",
      },
      {
        name: "Contact",
        href: "contact",
      },
      {
        name: "Blog",
        href: "#",
      },
    ],
  };

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://x.com/md_nayeem98",
      icon: <FaXTwitter />,
    },
    {
      name: "GitHub",
      href: "https://github.com/MD-Nayeem909/fast-parcel",
      icon: <FaGithub />,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/md-nayeem98/",
      icon: <FaLinkedinIn />,
    },
  ];
  return (
    <section>
      <footer className=" md:p-10 bg-base-100 text-base-content">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-8 py-10 max-sm:max-w-sm max-sm:mx-auto gap-y-8">
            <div className="col-span-full items-center justify-center flex flex-col md:items-start mb-5 lg:col-span-1 lg:mb-0">
              <Logo />
              <p className="py-4 md:py-8 text-sm text-neutral lg:max-w-sm text-center lg:text-left">
                Trusted in more than 100 countries & 5 million customers. Have
                any query ?
              </p>
              <Link
                href="/contact"
                className="w-fit btn btn-sm btn-primary rounded-full shadow-sm transition-all duration-500"
              >
                Contact us
              </Link>
            </div>

            {}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="lg:mx-auto px-2 text-left">
                <h4 className="text-lg text-base-content font-medium mb-7 capitalize">
                  {title}
                </h4>
                <ul className="text-sm transition-all duration-500">
                  {links.map((link, index) => (
                    <li
                      key={index}
                      className={index === links.length - 1 ? "" : "mb-6"}
                    >
                      <Link
                        href={link.href}
                        className="text-neutral hover:text-primary transition-all duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {}
          <div className="py-7 border-t border-base-300">
            <div className="flex items-center flex-col lg:justify-between lg:flex-row">
              <p className="text-sm text-center text-neutral">
                ©{" "}
                <Link href="/" className="hover:text-primary">
                  FastParcel Ltd.
                </Link>{" "}
                {new Date().getFullYear()}, All rights reserved.
              </p>
              <div className="flex mt-4 space-x-4 sm:justify-center lg:mt-0">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="w-9 h-9 rounded-full bg-base-300 flex justify-center items-center hover:bg-primary text-base-content hover:text-white transition-colors duration-300"
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
