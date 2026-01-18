"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  MapPin,
  Phone,
  Package,
  CheckCircle2,
  Navigation,
  Search,
  ClipboardCheck,
  X,
} from "lucide-react";
import Link from "next/link";

export default function MyDeliveries() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("active");
  const [selectedParcel, setSelectedParcel] = useState(null);

  const { data: parcels, isLoading } = useQuery({
    queryKey: ["parcels", filter],
    queryFn: async () => {
      const res = await fetch("/api/parcels");
      const result = await res.json();
      const allParcels = result.data || [];

      if (filter === "active") {
        return allParcels.filter(
          (p) => p.status !== "delivered" && p.status !== "cancelled"
        );
      }
      return allParcels.filter(
        (p) => p.status === "delivered" || p.status === "cancelled"
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, note }) => {
      const res = await fetch(`/api/parcels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      if (!res.ok) throw new Error("Update failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      toast.success("Delivery Confirmed Successfully!");
      setSelectedParcel(null);
    },
  });

  const handleConfirmDelivery = (e) => {
    e.preventDefault();
    const note = e.target.deliveryNote.value;
    updateStatusMutation.mutate({
      id: selectedParcel._id,
      status: "delivered",
      note: note || "Successfully delivered to recipient",
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="container mx-auto max-w-5xl animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Navigation className="text-primary" /> My Deliveries
        </h1>

        {/* Filter Tabs */}
        <div className="tabs tabs-boxed rounded-2xl font-medium p-1">
          <button
            onClick={() => setFilter("active")}
            className={`tab ${
              filter === "active"
                ? "tab-active bg-primary text-white font-semibold rounded-sm"
                : ""
            }`}
          >
            Active Tasks
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`tab ${
              filter === "completed"
                ? "tab-active bg-primary text-white font-semibold rounded-sm"
                : ""
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Delivery Cards */}
      <div className="space-y-4">
        {parcels?.map((parcel) => (
          <div
            key={parcel._id}
            className="collapse collapse-arrow bg-base-100/50 border border-base-300 rounded-sm shadow-sm"
          >
            <input type="checkbox" />

            {/* Header / Summary */}
            <div className="collapse-title flex items-center justify-between pr-12">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    parcel.status === "delivered"
                      ? "bg-success/10 text-success"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base-content text-sm md:text-base">
                    #{parcel.trackingId}
                  </h3>
                  <p className="text-xs text-neutral">
                    {parcel.receiverInfo?.name ||
                      parcel.receiverName ||
                      "Unknown Receiver"}
                  </p>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <span
                  className={`badge badge-sm font-bold ${
                    parcel.status === "delivered"
                      ? "bg-success/20 text-success border-success"
                      : "bg-primary/20 border-primary text-primary"
                  }`}
                >
                  {parcel.status}
                </span>
              </div>
            </div>

            {/* Content / Details */}
            <div className="collapse-content border-t border-base-200 pt-4">
              <div className="grid md:grid-cols-2 gap-6 py-2">
                {/* Info Section */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-neutral mb-2">
                      Delivery Address
                    </p>
                    <div className="flex gap-2">
                      <MapPin size={18} className="text-error shrink-0" />
                      <p className="text-sm font-medium">
                        {parcel.receiverInfo?.address ||
                          parcel.receiverAddress ||
                          "No address found"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`tel:${parcel.receiverInfo?.phone}`}
                      className="btn btn-sm btn-outline btn-primary gap-2 rounded-sm"
                    >
                      <Phone size={14} /> Call Customer
                    </Link>
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="bg-base-200/50 p-4 rounded-xl">
                  <p className="text-[10px] font-bold uppercase text-neutral mb-3">
                    Quick Action
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {parcel.status !== "delivered" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: parcel._id,
                              status: "in-transit",
                            })
                          }
                          className={`btn btn-xs ${
                            parcel.status === "in-transit"
                              ? "btn-primary"
                              : "btn-ghost border-base-300"
                          }`}
                        >
                          Mark Transit
                        </button>
                        <button
                          onClick={() => setSelectedParcel(parcel)}
                          className="btn btn-xs btn-success text-white"
                        >
                          Confirm Delivery
                        </button>
                      </>
                    )}
                    {parcel.status === "delivered" && (
                      <div className="flex items-center gap-2 text-success font-bold text-sm">
                        <CheckCircle2 size={16} /> Order Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* --- Delivery Confirmation Modal --- */}
        {selectedParcel && (
          <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box p-0 overflow-hidden rounded-3xl">
              <div className="bg-success/20 p-6 text-success flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ClipboardCheck size={28} />
                  <h3 className="text-xl font-bold">Complete Delivery</h3>
                </div>
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="btn btn-circle btn-sm btn-ghost"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleConfirmDelivery} className="p-6 space-y-4">
                <div className="bg-base-200/80 p-4 rounded-2xl">
                  <p className="text-xs text-neutral uppercase font-bold">
                    Receiver Name
                  </p>
                  <p className="font-bold text-lg">
                    {selectedParcel.receiverInfo?.name ||
                      selectedParcel.receiverName}
                  </p>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold mb-2">
                      Delivery Note / Feedback
                    </span>
                  </label>
                  <textarea
                    name="deliveryNote"
                    className="w-full h-24 px-4 py-3 border border-base-300 rounded-lg bg-base-100 text-base-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-success/60 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. Delivered to brother, Handed over to security..."
                  ></textarea>
                </div>

                <div className="bg-info/20 text-info px-4 text-xs py-2 rounded-xl">
                  <span>
                    By confirming, you verify that the parcel has been handed
                    over.
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedParcel(null)}
                    className="btn flex-1 rounded-2xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateStatusMutation.isPending}
                    className="btn btn-success flex-1 text-white rounded-2xl"
                  >
                    {updateStatusMutation.isPending
                      ? "Confirming..."
                      : "Finish Delivery"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {parcels?.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <Search size={48} className="mx-auto mb-2" />
            <p className="font-bold">No parcels found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
