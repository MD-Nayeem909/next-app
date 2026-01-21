"use client";

import Loading from "@/app/loading";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Truck,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function AdminOverview() {
  const { data: parcels, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/parcels");
      const result = await res.json();
      return result.data || [];
    },
  });

  const chartData = (data) => {
    if (!data) return [];
    const chartMap = {};

    data.forEach((parcel) => {
      const date = new Date(parcel.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
      chartMap[date] = (chartMap[date] || 0) + (parcel.cost || 0);
    });

    return Object.keys(chartMap)
      .map((date) => ({
        name: date,
        amount: chartMap[date],
      }))
      .slice(-7);
  };

  const totalParcels = parcels?.length || 0;
  const pendingParcels =
    parcels?.filter((p) => p.status === "pending").length || 0;
  const deliveredParcels =
    parcels?.filter((p) => p.status === "delivered").length || 0;
  const totalRevenue =
    parcels?.reduce((acc, curr) => acc + (curr.cost || 0), 0) || 0;

  if (isLoading)
    return (
      <div className="">
        <Loading />
      </div>
    );

  const stats = [
    {
      id: 1,
      name: "Total Revenue",
      value: `$${totalRevenue}`,
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      id: 2,
      name: "Total Orders",
      value: totalParcels,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      id: 3,
      name: "On the Way",
      value: totalParcels - deliveredParcels - pendingParcels,
      icon: Truck,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      id: 4,
      name: "Pending",
      value: pendingParcels,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Admin Insights</h1>
        <p className="opacity-60">System-wide performance at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-base-100 p-6 rounded-[2.5rem] border border-base-300 shadow-sm"
          >
            <div
              className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}
            >
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-bold uppercase opacity-50 tracking-wider">
              {stat.name}
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-black mt-1">{stat.value}</h2>
              <span className="text-[10px] text-success font-bold flex items-center">
                <ArrowUpRight size={10} /> +12%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full">
        <AnalyticsChart
          data={chartData(parcels)}
          title="Platform Revenue Flow"
          color="#f87171"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity / Simple List */}
        <div className="lg:col-span-2 bg-base-100 rounded-[2.5rem] border border-base-300 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">Recent Shipments</h3>
            <Link href="/dashboard/admin/all-parcels">
              <button className="btn btn-ghost btn-sm text-primary">
                View All
              </button>
            </Link>
          </div>
          <div className="space-y-4">
            {parcels?.slice(0, 4).map((parcel) => (
              <div
                key={parcel._id}
                className="flex items-center justify-between p-4 bg-base-200/50 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-neutral-content rounded-full w-10 flex justify-center items-center">
                      <span className="text-xs font-bold">
                        {parcel.trackingId.slice(-2)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm">#{parcel.trackingId}</p>
                    <p className="text-[10px] opacity-50">
                      {parcel.receiverInfo?.name}
                    </p>
                  </div>
                </div>
                <div
                  className={`badge badge-sm font-bold ${
                    parcel.status === "delivered"
                      ? "badge-success"
                      : "badge-primary"
                  }`}
                >
                  {parcel.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-primary text-primary-content rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <TrendingUp size={48} className="mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Grow Your Business</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Check which delivery agents are performing best this month.
            </p>
          </div>
          <button className="btn btn-white w-full rounded-2xl mt-6">
            Review Agents
          </button>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
