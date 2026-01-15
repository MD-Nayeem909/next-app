"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackagePlus,
  Package,
  Users,
  LogOut,
  Truck,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const { user } = session;
  const isActive = (path) =>
    pathname === path ? "active bg-primary text-white" : "";

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-200 min-h-screen">
        {/* Navbar for mobile */}
        <div className="w-full navbar bg-base-100 lg:hidden shadow-sm">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold text-xl">FastParcel</div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      <div className="drawer-side z-20">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content flex flex-col justify-between shadow-xl">
          <div>
            <div className="mb-8 px-4 flex items-center gap-2 text-primary">
              <Truck size={32} strokeWidth={2.5} />
              <span className="text-2xl font-black tracking-tight">
                FastParcel
              </span>
            </div>

            <li className="mb-2">
              <Link href="/dashboard" className={isActive("/dashboard")}>
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            </li>

            {user.role === "customer" && (
              <>
                <li className="mb-2">
                  <Link
                    href="/dashboard/customer/create"
                    className={isActive("/dashboard/customer/create")}
                  >
                    <PackagePlus size={20} /> New Shipment
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="/dashboard/customer/my-parcels"
                    className={isActive("/dashboard/customer/my-parcels")}
                  >
                    <Package size={20} /> My Parcels
                  </Link>
                </li>
              </>
            )}

            {user.role === "agent" && (
              <>
                <li className="mb-2">
                  <Link
                    href="/dashboard/agent"
                    className={isActive("/dashboard/agent")}
                  >
                    <Package size={20} /> Assigned Deliveries
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="/dashboard/agent/my-deliveries"
                    className={isActive("/dashboard/agent/my-deliveries")}
                  >
                    <Package size={20} /> My Deliveries
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="/dashboard/agent/profile"
                    className={isActive("/dashboard/agent/profile")}
                  >
                    <Package size={20} /> Profile
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="/dashboard/agent/history"
                    className={isActive("/dashboard/agent/history")}
                  >
                    <Package size={20} /> History
                  </Link>
                </li>
              </>
            )}

            {user.role === "admin" && (
              <>
                <li className="mb-2">
                  <Link
                    href="/dashboard/admin/parcels"
                    className={isActive("/dashboard/admin/parcels")}
                  >
                    <Package size={20} /> All Parcels
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="/dashboard/admin/users"
                    className={isActive("/dashboard/admin/users")}
                  >
                    <Users size={20} /> Users & Agents
                  </Link>
                </li>
              </>
            )}
          </div>

          <div className="border-t border-base-300 pt-6">
            <div className="px-4 mb-6">
              <div className="font-bold text-lg">{user.name}</div>
              <div className="text-xs badge badge-primary badge-outline capitalize">
                {user.role}
              </div>
            </div>
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="btn btn-error btn-outline btn-sm w-full flex justify-start gap-3"
              >
                <LogOut size={18} /> Logout
              </button>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}
