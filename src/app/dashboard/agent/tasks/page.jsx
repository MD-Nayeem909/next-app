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
  Truck,
  ExternalLink,
} from "lucide-react";

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

  // ক্যালকুলেশন সামারি
  const pendingCount = parcels?.filter(
    (p) => p.status !== "delivered" && p.status !== "cancelled"
  ).length;
  const completedCount = parcels?.filter(
    (p) => p.status === "delivered"
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
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
              <p className="text-xs font-bold opacity-60 uppercase">Pending</p>
              <p className="text-xl font-black">{pendingCount}</p>
            </div>
          </div>
          <div className="bg-success/10 p-4 rounded-2xl border border-success/20 flex items-center gap-3">
            <div className="bg-success p-2 rounded-lg text-white">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold opacity-60 uppercase">
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
            className="group bg-base-100 rounded-[2rem] border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left Side: Route Info */}
              <div className="flex-1 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="badge badge-neutral font-mono font-bold px-4 py-3">
                    #{parcel.trackingId}
                  </span>
                  <span className="text-xs font-medium opacity-50 flex items-center gap-1">
                    <Calendar size={12} />{" "}
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
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">
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
                    <p className="text-[10px] font-black uppercase text-secondary tracking-widest">
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
              <div className="bg-base-200/50 lg:w-72 p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-base-300 flex flex-col justify-center gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-black uppercase text-[10px] opacity-50">
                      Update Progress
                    </span>
                  </label>
                  <select
                    className={`select select-bordered font-bold w-full ${
                      parcel.status === "delivered"
                        ? "select-success"
                        : "select-primary"
                    }`}
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
                </div>

                <button className="btn btn-outline btn-sm gap-2 border-base-300 hover:bg-base-300 hover:text-base-content">
                  <ExternalLink size={14} /> View Details
                </button>
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

const Calendar = ({ size }) => <Clock size={size} />;
