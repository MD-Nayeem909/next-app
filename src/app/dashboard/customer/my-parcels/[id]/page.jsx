"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  Package,
  MapPin,
  User,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react";

export default function ParcelDetails() {
  const { id } = useParams();

  const { data: parcel, isLoading } = useQuery({
    queryKey: ["parcel", id],
    queryFn: async () => {
      const res = await fetch(`/api/parcels/${id}`);
      const result = await res.json();
      return result.data;
    },
  });

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (!parcel)
    return <div className="p-10 text-center text-error">Parcel not found!</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
        <div>
          <h1 className="text-sm font-bold opacity-50 uppercase tracking-wider">
            Tracking ID
          </h1>
          <p className="text-2xl font-mono font-black text-primary">
            {parcel.trackingId}
          </p>
        </div>
        <div
          className={`badge badge-lg p-4 font-bold capitalize ${
            parcel.status === "delivered" ? "badge-success" : "badge-warning"
          }`}
        >
          {parcel.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-secondary border-b pb-2 mb-4">
                <MapPin size={20} /> Delivery Route
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-bold opacity-50 uppercase">
                    Sender (Pickup)
                  </p>
                  <p className="font-semibold">{parcel.senderInfo.name}</p>
                  <p className="text-sm opacity-70">
                    {parcel.senderInfo.address}
                  </p>
                  <p className="text-sm opacity-70">
                    {parcel.senderInfo.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold opacity-50 uppercase">
                    Receiver (Destination)
                  </p>
                  <p className="font-semibold">{parcel.receiverInfo.name}</p>
                  <p className="text-sm opacity-70">
                    {parcel.receiverInfo.address}
                  </p>
                  <p className="text-sm opacity-70">
                    {parcel.receiverInfo.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-secondary border-b pb-2 mb-4">
                <Package size={20} /> Parcel Details
              </h2>
              <div className="flex justify-between items-center">
                <p>
                  <span className="font-bold">Description:</span>{" "}
                  {parcel.description || "No description provided"}
                </p>
                <div className="text-right">
                  <p className="text-xs font-bold opacity-50 uppercase">Cost</p>
                  <p className="text-xl font-bold text-success">
                    ${parcel.cost}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-secondary border-b pb-2 mb-4">
              <Clock size={20} /> History
            </h2>
            <ul className="timeline timeline-vertical timeline-compact">
              {parcel.statusHistory?.map((history, index) => (
                <li key={index}>
                  <hr className={index !== 0 ? "bg-primary" : ""} />
                  <div className="timeline-middle text-primary">
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  </div>
                  <div className="timeline-end mb-6">
                    <time className="font-mono italic text-xs opacity-50">
                      {format(new Date(history.timestamp), "MMM d, hh:mm a")}
                    </time>
                    <div className="text-sm font-black capitalize">
                      {history.status}
                    </div>
                    <p className="text-xs opacity-70">{history.note}</p>
                  </div>
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
