"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  PlusCircle,
  Package,
  Truck,
  UserCircle,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { useSession } from "next-auth/react";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["dashboard-stats", role],
    queryFn: async () => {
      const res = await fetch("/api/parcels");
      const result = await res.json();
      return result.data || [];
    },
    enabled: !!role,
  });

  const prepareData = (items) => {
    if (!items) return [];
    const chartMap = {};
    items.forEach((item) => {
      const date = new Date(item.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
      if (!chartMap[date]) chartMap[date] = { name: date, amount: 0, count: 0 };

      chartMap[date].amount += item.price || item.cost || 0;
      chartMap[date].count += 1;
    });
    return Object.values(chartMap).reverse();
  };

  const dashboardData = prepareData(rawData);

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 font-medium opacity-50">
          Preparing your dashboard...
        </p>
      </div>
    );

  if (!session?.user) return null;

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-primary" size={32} />
            Welcome back, {session.user.name.split(" ")[0]}!
          </h1>
          <p className="text-neutral mt-1">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>
        <div className="badge badge-primary badge-outline py-4 px-6 rounded-full font-bold gap-2">
          <ShieldCheck size={16} />
          Account Role: <span className="capitalize">{role}</span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Role Identity Card*/}
        <div className="relative overflow-hidden group rounded-4xl bg-linear-to-br from-primary to-blue-600 p-8 text-primary-content shadow-2xl transition-all hover:shadow-primary/20">
          <div className="relative z-10">
            <UserCircle size={40} className="mb-4 opacity-80" />
            <p className="text-sm font-medium opacity-70 uppercase tracking-widest">
              Active Identity
            </p>
            <h2 className="text-3xl font-black capitalize">{role}</h2>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500 text-white">
            <UserCircle size={150} />
          </div>
        </div>

        {/* --- Role Based Cards --- */}

        {/* 1. Customer Card */}
        {role === "customer" && (
          <div className="card bg-base-100 rounded-4xl shadow-sm border border-base-300 hover:border-primary/50 transition-colors overflow-hidden font-sans">
            <div className="card-body p-8">
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-2">
                <PlusCircle size={24} />
              </div>
              <h2 className="card-title text-2xl font-bold">New Shipment</h2>
              <p className="opacity-60 text-sm italic">
                Send a new parcel request instantly.
              </p>
              <div className="card-actions mt-4">
                <Link
                  href="/dashboard/customer/create-parcel"
                  className="btn btn-primary rounded-xl w-full group"
                >
                  Create Parcel{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. Agent Card */}
        {role === "agent" && (
          <div className="card bg-base-100 rounded-4xl shadow-sm border border-base-300 hover:border-primary/50 transition-colors overflow-hidden font-sans">
            <div className="card-body p-8">
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-2">
                <Truck size={24} />
              </div>
              <h2 className="card-title text-2xl font-bold">My Tasks</h2>
              <p className="opacity-60 text-sm italic">
                Manage assigned deliveries.
              </p>
              <div className="card-actions mt-4">
                <Link
                  href="/dashboard/agent"
                  className="btn btn-primary rounded-xl w-full group"
                >
                  View Tasks{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}

        {role === "admin" && (
          <div className="card bg-base-100 rounded-4xl shadow-sm border border-base-300 hover:border-primary/50 transition-colors overflow-hidden font-sans">
            <div className="card-body p-8">
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-2">
                <Settings size={24} />
              </div>
              <h2 className="card-title text-2xl font-bold">Management</h2>
              <p className="opacity-60 text-sm italic">
                Manage all parcels and agents.
              </p>
              <div className="card-actions mt-4">
                <Link
                  href="/dashboard/admin/all-parcels"
                  className="btn btn-primary rounded-xl w-full group"
                >
                  All Parcels{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* History Card */}
        <div className="card bg-base-100 rounded-4xl shadow-sm border border-base-300 font-sans">
          <div className="card-body p-8">
            <div className="bg-success/10 w-12 h-12 rounded-2xl flex items-center justify-center text-success mb-2">
              <Package size={24} />
            </div>
            <h2 className="card-title text-2xl font-bold">Activity</h2>
            <p className="opacity-60 text-sm italic">Check recent history.</p>
            <div className="card-actions mt-4">
              <Link
                href={
                  role === "admin"
                    ? "/dashboard/admin/all-parcels"
                    : "/dashboard/my-parcels"
                }
                className="btn btn-ghost btn-outline border-base-300 rounded-xl w-full mt-4"
              >
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        {role === "admin" ? (
          <AnalyticsChart
            data={dashboardData}
            title="Global Revenue Overview"
            color="#f87171"
          />
        ) : role === "agent" ? (
          <AnalyticsChart
            data={dashboardData}
            title="Your Delivery Performance"
            color="#10b981"
          />
        ) : (
          <AnalyticsChart
            data={dashboardData}
            title="Your Spending Analysis"
            color="#570df8"
          />
        )}
      </div>

      {/* Decorative Tips */}
      <div className="p-8 bg-base-200/50 rounded-[2.5rem] border border-dashed border-base-300">
        <h3 className="font-bold text-lg mb-2">Dashboard Tip:</h3>
        <p className="text-sm opacity-60 leading-relaxed">
          Hello {role}, you can manage your work from the sidebar or using these
          quick cards. If you have any issues, please contact support.
        </p>
      </div>
    </div>
  );
}
