"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { LayoutDashboard, User, Settings, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

// --- Sub-Components ---

const DropdownMenu = ({ children, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-3 w-72 rounded-xl shadow-2xl bg-base-100 border border-base-300 z-50 p-2 animate-in fade-in zoom-in-95">
          <div onClick={() => setIsOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
};

const DropdownMenuItem = ({ children, url, onClick }) => {
  const content = (
    <div className="group flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-base-200 transition-colors duration-150 cursor-pointer text-base-content">
      {children}
    </div>
  );

  if (url) {
    return <Link href={url}>{content}</Link>;
  }
  return <div onClick={onClick}>{content}</div>;
};

const DropdownMenuSeparator = () => <div className="my-2 h-px bg-base-300" />;

// --- Main Component ---

export default function ProfileDropdown() {
  const { data: session, status } = useSession();
  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["user-profile", session?.user?.email],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const displayImage =
    dbUser?.image ||
    session?.user?.image ||
    "https://ui-avatars.com/api/?name=User";
  const displayName = dbUser?.name || session?.user?.name || "User";

  if (status === "loading")
    return (
      <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse"></div>
    );

  if (!session) return null;

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu
        trigger={
          <button className="flex items-center space-x-3 p-1 rounded-full hover:bg-base-200 transition-all focus:outline-none">
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full ring ring-offset-2">
                <img
                  src={
                    displayImage ||
                    `https://ui-avatars.com/api/?name=${displayName}`
                  }
                  alt="profile"
                />
              </div>
            </div>
          </button>
        }
      >
        {/* User Info Section */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-base-300 mb-1">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                src={
                  displayImage ||
                  `https://ui-avatars.com/api/?name=${displayName}`
                }
                alt="profile"
              />
            </div>
          </div>
          <div className="max-w-45">
            <p className="text-sm font-bold text-base-content truncate uppercase">
              {dbUser?.name || "Guest User"}
            </p>
            <p className="text-xs text-base-content/60 truncate">
              {dbUser?.email}
            </p>
            {dbUser?.role && (
              <span className="inline-block mt-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                {dbUser.role}
              </span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-0.5">
          <DropdownMenuItem url="/dashboard/profile">
            <User className="mr-3 h-4 w-4 opacity-70" />
            My Profile
          </DropdownMenuItem>

          <DropdownMenuItem url="/dashboard">
            <LayoutDashboard className="mr-3 h-4 w-4 opacity-70" />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => toast.success("Settings opening...")}
          >
            <Settings className="mr-3 h-4 w-4 opacity-70" />
            Settings
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="mr-3 h-4 w-4 text-error" />
          <span className="text-error font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
}
