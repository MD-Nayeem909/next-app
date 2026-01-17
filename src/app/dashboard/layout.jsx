"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/dashboard/Sidebar";
import DashNav from "@/components/dashboard/DashNav";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Auth Data
  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("/api/auth/session");
      return res.json();
    },
  });

  const user = authData?.user;

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>

        <p className="mt-4 font-medium opacity-50">
          Preparing your dashboard...
        </p>
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-base-100/50 flex font-sans">
      {/* Sidebar Component */}
      <Sidebar user={user} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Component */}
        <DashNav
          user={user}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Dynamic Content Area */}
        <main className="p-6 md:p-10">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
