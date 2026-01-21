"use client";

import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Truck,
  CheckCircle,
  Plus,
  ArrowRight,
  Search,
  Clock,
  MapPin,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CustomerOverview() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data: orders, isLoading: isOrdersLoading } = useSWR(
    session?.user?.id ? `/api/orders/user/${session.user.id}` : null,
    fetcher
  );

  const { data: parcels, isLoading: isParcelsLoading } = useQuery({
    queryKey: ["customer-parcels"],
    queryFn: async () => {
      const res = await fetch("/api/parcels");
      const result = await res.json();
      return result.data || [];
    },
  });

  const prepareChartData = (items) => {
    if (!items) return [];
    const chartMap = {};

    items.forEach((item) => {
      const date = new Date(item.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });

      if (!chartMap[date]) {
        chartMap[date] = { name: date, amount: 0, count: 0 };
      }

      chartMap[date].amount += item.price;
      chartMap[date].count += 1;
    });

    return Object.values(chartMap).sort(
      (a, b) => new Date(a.name) - new Date(b.name)
    );
  };

  const stats = {
    total: parcels?.length || 0,
    inTransit:
      parcels?.filter((p) => ["in-transit", "picked"].includes(p.status))
        .length || 0,
    delivered: parcels?.filter((p) => p.status === "delivered").length || 0,
  };

  if (isOrdersLoading || isParcelsLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-base-content italic">
            Hi, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-neutral mt-2 font-medium">
            Track your shipments and manage your deliveries here.
          </p>
        </div>
        <Link
          href="/dashboard/customer/create-parcel"
          className="btn btn-primary btn-lg rounded-3xl px-8 shadow-xl shadow-primary/20 gap-3 group"
        >
          <Plus size={24} />
          Create New Parcel
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Parcels */}
        <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="bg-info/20 p-4 rounded-2xl text-info">
              <Package size={28} />
            </div>
            <span className="text-xs font-black text-neutral">TOTAL</span>
          </div>
          <h2 className="text-4xl font-black mt-6">{stats.total}</h2>
          <p className="text-sm font-medium text-neutral mt-1">Parcels Sent</p>
        </div>
        {/* Active/In-Transit */}
        <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="bg-primary/20 p-4 rounded-2xl text-primary">
              <Truck size={28} />
            </div>
            <span className="text-xs font-black text-neutral">ACTIVE</span>
          </div>
          <h2 className="text-4xl font-black mt-6">{stats.inTransit}</h2>
          <p className="text-sm font-medium text-neutral mt-1">On the way</p>
        </div>
        {/* Delivered */}
        <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="bg-success/20 p-4 rounded-2xl text-success">
              <CheckCircle size={28} />
            </div>
            <span className="text-xs font-black text-neutral">COMPLETED</span>
          </div>
          <h2 className="text-4xl font-black mt-6">{stats.delivered}</h2>
          <p className="text-sm font-medium text-neutral mt-1">
            Safely Delivered
          </p>
        </div>
      </div>

      {/* --- Dynamic Analytics Chart --- */}
      {orders?.length > 0 && (
        <div className="w-full">
          <AnalyticsChart
            data={prepareChartData(orders)}
            title="Personal Spending Analysis"
            color="#570df8"
          />
        </div>
      )}

      {/* --- Shipments & Sidebar --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-base-200/50 rounded-[3rem] p-8 border border-base-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-base-content">
              Recent Shipments
            </h3>
            <Link
              href="/dashboard/my-parcels"
              className="btn btn-ghost btn-sm text-primary font-bold"
            >
              See All
            </Link>
          </div>

          <div className="space-y-4">
            {parcels?.slice(0, 4).map((parcel) => (
              <div
                key={parcel._id}
                className="group flex items-center justify-between p-5 bg-base-100 rounded-4xl hover:shadow-lg transition-all border border-transparent hover:border-base-300"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base-content">
                      #{parcel.trackingId}
                    </h4>
                    <p className="text-xs text-neutral flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {parcel.receiverInfo?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`badge badge-sm font-bold uppercase p-2 rounded-lg ${
                      parcel.status === "delivered"
                        ? "bg-success/20 text-success border-none"
                        : "bg-info/20 text-info border-none"
                    }`}
                  >
                    {parcel.status}
                  </div>
                  <p className="text-xs font-black text-base-content mt-2 italic">
                    {parcel.cost} TK
                  </p>
                </div>
              </div>
            ))}

            {(!parcels || parcels.length === 0) && (
              <div className="text-center py-10 opacity-40">
                <Search size={40} className="mx-auto mb-2" />
                <p>No shipments found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Support Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-3">Need Help?</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Our support team is available 24/7 to help you with your parcel
                issues.
              </p>
              <Link
                href="/contact"
                className="btn btn-primary w-full rounded-2xl font-black shadow-lg shadow-primary/30"
              >
                Contact Support
              </Link>
            </div>
            <Clock
              size={110}
              className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="p-8 bg-primary/10 rounded-[3rem] border border-primary/20">
            <h4 className="font-black text-primary uppercase text-xs tracking-widest mb-4">
              Quick Tip
            </h4>
            <p className="text-sm text-neutral leading-relaxed">
              You can track your parcel in real-time using your Tracking ID on
              the home page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
