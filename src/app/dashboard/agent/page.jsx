"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Truck,
  CheckCircle2,
  Clock,
  Package,
  TrendingUp,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function AgentOverview() {
  const { data: authData } = useQuery({ queryKey: ["auth"] });
  const user = authData?.user;

  const { data: parcels, isLoading } = useQuery({
    queryKey: ["agent-stats"],
    queryFn: async () => {
      const res = await fetch("/api/parcels");
      const result = await res.json();
      return result.data || [];
    },
  });

  const stats = {
    pending:
      parcels?.filter(
        (p) => p.status === "pending" || p.status === "in-transit"
      ).length || 0,
    completed: parcels?.filter((p) => p.status === "delivered").length || 0,
    total: parcels?.length || 0,
  };

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* --- Welcome Header --- */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-base-content">
          Agent Dashboard
        </h1>
        <p className="text-neutral mt-1 font-medium">
          Hello {user?.name}, you have{" "}
          <span className="text-primary font-bold">
            {stats.pending} active tasks
          </span>{" "}
          for today.
        </p>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-100/50 hover:bg-base-100 p-6 rounded-4xl border border-base-300 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-primary/20 p-4 rounded-2xl text-primary">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral uppercase">Pending</p>
            <h2 className="text-3xl font-black text-base-content">
              {stats.pending}
            </h2>
          </div>
        </div>

        <div className="bg-base-100/50 hover:bg-base-100 p-6 rounded-4xl border border-base-300 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-success/20 p-4 rounded-2xl text-success">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral uppercase">
              Delivered
            </p>
            <h2 className="text-3xl font-black text-base-content">
              {stats.completed}
            </h2>
          </div>
        </div>

        <div className="bg-primary p-6 rounded-4xl shadow-lg shadow-primary/20 flex items-center gap-5 text-white">
          <div className="bg-white/20 p-4 rounded-2xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-wide">
              Efficiency
            </p>
            <h2 className="text-3xl font-black">94%</h2>
          </div>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Active Deliveries */}
        <div className="bg-base-100/50 rounded-[2.5rem] p-8 border border-base-300 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Truck size={22} className="text-primary" /> Active Deliveries
            </h3>
            <Link
              href="/dashboard/agent/my-deliveries"
              className="text-sm font-bold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {parcels
              ?.filter((p) => p.status !== "delivered")
              .slice(0, 3)
              .map((parcel) => (
                <div
                  key={parcel._id}
                  className="flex items-center justify-between p-4 bg-base-200 rounded-2xl group hover:bg-base-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shadow-sm font-semibold text-xs text-primary">
                      #{parcel.trackingId.slice(-3)}
                    </div>
                    <div>
                      <p className="font-bold text-base-content text-sm">
                        {parcel.receiverInfo?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-neutral flex items-center gap-1">
                        <MapPin size={12} /> {parcel.receiverInfo?.address.slice(0, 25)}
                        ...
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/agent/my-deliveries"
                    className="p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <ArrowRight size={16} className="text-primary" />
                  </Link>
                </div>
              ))}
            {stats.pending === 0 && (
              <p className="text-center py-6 text-neutral italic">
                No active tasks today!
              </p>
            )}
          </div>
        </div>

        {/* Quick Tips & Announcement */}
        <div className="space-y-6">
          <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <ShieldCheck size={20} /> Safety First!
              </h3>
              <p className="text-neutral text-sm leading-relaxed mb-6">
                Always verify recipient identity before handing over the parcel.
                Use the &quot;Call&quot; feature to coordinate delivery time.
              </p>
              <Link
                href="/dashboard/agent/my-deliveries"
                className="bg-white  text-slate-900 px-6 py-3 rounded-xl font-bold text-sm inline-block"
              >
                Go to Work
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500 text-white">
              <Package size={140} />
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8">
            <h4 className="font-bold text-primary mb-4">Daily Goal</h4>
            <div className="w-full bg-primary/10 h-3 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
            <p className="text-xs font-bold text-neutral mt-3 flex justify-between">
              <span>Progress</span>
              <span>65% Completed</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
