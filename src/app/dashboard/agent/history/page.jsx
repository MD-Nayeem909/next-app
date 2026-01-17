"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Package,
  ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";

export default function DeliveryHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: parcels, isLoading } = useQuery({
    queryKey: ["parcels-history"],
    queryFn: async () => {
      const res = await fetch("/api/parcels");
      const result = await res.json();

      return (result.data || []).filter(
        (p) => p.status === "delivered" || p.status === "cancelled"
      );
    },
  });

  const filteredParcels = parcels?.filter(
    (p) =>
      p.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiverInfo?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="container mx-auto max-w-5xl space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Delivery History</h1>
          <p className="text-sm opacity-60">
            Review your past completed shipments
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Tracking ID..."
            className="w-full pl-10 pr-3 py-2 border border-base-300 rounded-lg bg-base-100/50 text-base-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* History Table/List */}
      <div className="bg-base-100 rounded-sm border border-base-300 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            {/* head */}
            <thead className="bg-base-200/50">
              <tr className="border-none text-base-content/50 uppercase text-[10px] tracking-widest">
                <th className="py-5">Parcel Details</th>
                <th>Recipient</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredParcels?.map((parcel) => (
                <tr
                  key={parcel._id}
                  className="hover:bg-base-200/30 transition-colors cursor-pointer"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          parcel.status === "delivered"
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        <Package size={20} />
                      </div>
                      <div>
                        <div className="font-bold font-mono text-sm">
                          {parcel.trackingId}
                        </div>
                        <div className="text-[10px] opacity-50">
                          Type: Standard Delivery
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm font-semibold">
                      {parcel.receiverInfo?.name}
                    </div>
                    <div className="text-[11px] opacity-50 truncate max-w-37.5">
                      {parcel.receiverInfo?.address}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar size={12} className="opacity-40" />
                      {parcel.updatedAt
                        ? format(new Date(parcel.updatedAt), "dd MMM, yyyy")
                        : "N/A"}
                    </div>
                  </td>
                  <td>
                    {parcel.status === "delivered" ? (
                      <div className="badge badge-success badge-sm gap-1 text-[10px] font-bold text-white">
                        <CheckCircle2 size={10} /> DELIVERED
                      </div>
                    ) : (
                      <div className="badge badge-error badge-sm gap-1 text-[10px] font-bold text-white">
                        <XCircle size={10} /> CANCELLED
                      </div>
                    )}
                  </td>
                  <td className="text-right">
                    <button className="btn btn-ghost btn-xs btn-circle">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredParcels?.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="opacity-20" />
            </div>
            <p className="font-bold opacity-40">No history found</p>
          </div>
        )}
      </div>

      {/* Pagination (Optional UI) */}
      <div className="flex justify-center pt-4">
        <div className="join bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
          <button className="join-item btn btn-sm btn-ghost">Previous</button>
          <button className="join-item btn btn-sm btn-active btn-primary">
            1
          </button>
          <button className="join-item btn btn-sm btn-ghost">Next</button>
        </div>
      </div>
    </div>
  );
}
