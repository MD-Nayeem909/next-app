"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Copy,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const statusConfig = {
  pending: { color: "badge-warning", icon: <Clock size={14} /> },
  picked: { color: "badge-info", icon: <Package size={14} /> },
  "in-transit": { color: "badge-primary", icon: <Truck size={14} /> },
  delivered: { color: "badge-success", icon: <CheckCircle size={14} /> },
  cancelled: { color: "badge-error", icon: <XCircle size={14} /> },
};

export default function MyParcelsPage() {
  const { data: parcels, isLoading } = useQuery({
    queryKey: ["my-parcels"],
    queryFn: async () => {
      const res = await fetch("/api/parcels");
      const result = await res.json();
      return result.data || [];
    },
  });

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("Tracking ID copied!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-base-content">My Parcels</h1>
          <p className="text-sm opacity-60">
            Track and manage all your shipments
          </p>
        </div>
        <div className="stats shadow bg-base-100 border border-base-200 hidden md:flex">
          <div className="stat py-2 px-4">
            <div className="stat-title text-xs">Total Bookings</div>
            <div className="stat-value text-xl text-primary">
              {parcels?.length}
            </div>
          </div>
        </div>
      </div>

      {parcels?.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl border-2 border-dashed border-base-300">
          <Package size={48} className="mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-semibold">No Parcels Found</h2>
          <p className="opacity-60">You haven&apos;t booked any parcels yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-200">
          <table className="table w-full">
            {/* Table Head */}
            <thead className="bg-base-200/50">
              <tr>
                <th>Tracking ID</th>
                <th>Receiver Details</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr
                  key={parcel._id}
                  className="hover:bg-base-200/30 transition-colors"
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">
                        {parcel.trackingId}
                      </span>
                      <button
                        onClick={() => copyToClipboard(parcel.trackingId)}
                        className="btn btn-ghost btn-xs btn-square"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold">
                      {parcel.receiverInfo.name}
                    </div>
                    <div className="text-xs opacity-60 max-w-50 truncate">
                      {parcel.receiverInfo.address}
                    </div>
                  </td>
                  <td>
                    <div
                      className={`badge ${
                        statusConfig[parcel.status]?.color
                      } badge-sm gap-1 py-3 px-3 capitalize font-medium`}
                    >
                      {statusConfig[parcel.status]?.icon}
                      {parcel.status}
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold">${parcel.cost}</span>
                  </td>
                  <td className="text-sm">
                    {parcel.createdAt
                      ? format(new Date(parcel.createdAt), "MMM d, yyyy")
                      : "N/A"}
                  </td>
                  <td className="text-center">
                    <Link
                      href={`/dashboard/customer/my-parcels/${parcel._id}`}
                      className="btn btn-ghost btn-xs text-primary underline"
                    >
                      <button className="btn btn-ghost btn-xs text-primary underline">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
