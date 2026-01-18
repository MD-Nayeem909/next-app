"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import {
  MapPin,
  Phone,
  Package,
  CheckCircle,
  Clock,
  ExternalLink,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

export default function AgentDashboard() {
  const queryClient = useQueryClient();

  const { data: parcels, isLoading } = useQuery({
    queryKey: ["parcels"],
    queryFn: async () => {
      const res = await fetch("/api/parcels");
      const result = await res.json();
      return result.data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`/api/parcels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      toast.success("Status updated successfully");
    },
    onError: () => toast.error("Update failed"),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  const pendingCount = parcels?.filter(
    (p) => p.status !== "delivered" && p.status !== "cancelled"
  ).length;
  const completedCount = parcels?.filter(
    (p) => p.status === "delivered"
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-in fade-in duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-base-content">
            Agent Dashboard
          </h1>
          <p className="text-base-content/60">
            Manage your assigned deliveries and updates
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral uppercase">
                Pending
              </p>
              <p className="text-xl font-black">{pendingCount}</p>
            </div>
          </div>
          <div className="bg-success/10 p-4 rounded-2xl border border-success/20 flex items-center gap-3">
            <div className="bg-success p-2 rounded-lg text-white">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral uppercase">
                Completed
              </p>
              <p className="text-xl font-black">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="divider">Assigned Shipments</div>

      {/* Parcel Cards */}
      <div className="grid gap-6">
        {parcels?.map((parcel) => (
          <div
            key={parcel._id}
            className="group bg-base-100/50 rounded-4xl border border-base-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left Side: Route Info */}
              <div className="flex-1 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-primary font-bold">
                    #{parcel.trackingId}
                  </span>
                  <span className="text-xs font-medium text-neutral flex items-center gap-1">
                    <CalendarDays size={12} />{" "}
                    {parcel.createdAt
                      ? format(new Date(parcel.createdAt), "MMM d, yyyy")
                      : "N/A"}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative">
                  {/* Decorative dashed line for route */}
                  <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 border-t-2 border-dashed border-base-300"></div>

                  {/* Pickup */}
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase text-primary tracking-widest">
                      Pickup From
                    </p>
                    <h3 className="font-bold text-lg">
                      {parcel.senderInfo?.name}
                    </h3>
                    <p className="text-sm opacity-70 flex items-start gap-2">
                      <MapPin size={16} className="shrink-0 text-primary" />{" "}
                      {parcel.senderInfo?.address}
                    </p>
                    <a
                      href={`tel:${parcel.senderInfo?.phone}`}
                      className="btn btn-xs btn-ghost gap-2 text-primary lowercase mt-2"
                    >
                      <Phone size={12} /> {parcel.senderInfo?.phone}
                    </a>
                  </div>

                  {/* Delivery */}
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase text-secondary tracking-widest">
                      Deliver To
                    </p>
                    <h3 className="font-bold text-lg">
                      {parcel.receiverInfo?.name}
                    </h3>
                    <p className="text-sm opacity-70 flex items-start gap-2">
                      <MapPin size={16} className="shrink-0 text-secondary" />{" "}
                      {parcel.receiverInfo?.address}
                    </p>
                    <a
                      href={`tel:${parcel.receiverInfo?.phone}`}
                      className="btn btn-xs btn-ghost gap-2 text-secondary lowercase mt-2"
                    >
                      <Phone size={12} /> {parcel.receiverInfo?.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side: Actions & Status */}
              <div className="bg-base-200/30 lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-base-300 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral opacity-60">
                      Update Progress
                    </span>
                    {/* স্ট্যাটাস অনুযায়ী ছোট একটি ব্যাজ */}
                    <div
                      className={`badge badge-xs ${
                        parcel.status === "delivered"
                          ? "badge-success"
                          : parcel.status === "cancelled"
                          ? "badge-error"
                          : "badge-primary"
                      } animate-pulse`}
                    ></div>
                  </div>

                  <div className="relative group">
                    <select
                      className={`select select-bordered select-md w-full font-bold rounded-2xl transition-all duration-300 ${
                        parcel.status === "delivered"
                          ? "bg-success/10 border-success text-success focus:ring-success"
                          : "bg-base-100 border-base-300 focus:ring-primary"
                      } disabled:bg-base-200 disabled:cursor-not-allowed`}
                      value={parcel.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({
                          id: parcel._id,
                          status: e.target.value,
                        })
                      }
                      disabled={
                        updateStatusMutation.isPending ||
                        parcel.status === "delivered" ||
                        parcel.status === "cancelled"
                      }
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="picked">📦 Picked Up</option>
                      <option value="in-transit">🚚 In Transit</option>
                      <option value="delivered">✅ Delivered</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>

                    {updateStatusMutation.isPending && (
                      <span className="loading loading-spinner loading-xs absolute right-10 top-4 text-primary"></span>
                    )}
                  </div>

                  {parcel.status === "delivered" ? (
                    <p className="text-[10px] text-success font-bold text-center italic">
                      🎉 Shipment completed successfully
                    </p>
                  ) : (
                    <p className="text-[10px] text-neutral/50 font-medium text-center">
                      Select the current stage of this parcel
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/dashboard/agent/parcels/${parcel._id}`}
                    className="btn btn-primary btn-sm rounded-xl gap-2 font-bold shadow-sm"
                  >
                    <ExternalLink size={14} /> View Details
                  </Link>
                  <button className="btn btn-ghost btn-xs text-neutral/40 hover:text-primary">
                    Print Label
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {parcels?.length === 0 && (
          <div className="text-center py-20 bg-base-100 rounded-3xl border-2 border-dashed border-base-300">
            <Package size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-xl font-bold opacity-40">
              No assigned deliveries yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
