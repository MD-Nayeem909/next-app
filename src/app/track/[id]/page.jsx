"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Package, MapPin, Clock, ArrowLeft } from "lucide-react";
import TrackingNotFound from "@/components/errorPage/TrackingNotFound";

export default function TrackingPage() {
  const { id } = useParams();

  const {
    data: parcel,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tracking", id],
    queryFn: async () => {
      const res = await fetch(`/api/parcels/track/${id}`);
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error("Parcel not found");
      return result.data;
    },
    retry: false,
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="font-bold animate-pulse text-primary">
          Locating Shipment...
        </p>
      </div>
    );

  if (error) return <TrackingNotFound id={id} />;

  const steps = ["pending", "picked", "in-transit", "delivered"];
  const currentStatusIndex = steps.indexOf(parcel.status);

  return (
    <div className="min-h-screen bg-base-200/50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <Link
            href="/"
            className="btn btn-sm btn-ghost gap-2 rounded-full border border-base-300"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold opacity-50 uppercase tracking-tighter">
              Status:
            </span>
            <div
              className={`badge badge-lg font-black px-6 py-4 rounded-full ${
                parcel.status === "delivered"
                  ? "badge-success text-white"
                  : "badge-primary"
              }`}
            >
              {parcel.status}
            </div>
          </div>
        </div>

        {/* Main Tracking Card */}
        <div className="card bg-base-100 shadow-sm border border-base-300 rounded-[2.5rem] mb-8 overflow-hidden">
          <div className="bg-primary/5 p-8 border-b border-base-200">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h2 className="text-sm font-bold opacity-40 uppercase mb-1">
                  Tracking Number
                </h2>
                <p className="text-3xl font-black text-primary font-mono">
                  {parcel.trackingId}
                </p>
              </div>
              <div className="text-left md:text-right">
                <h2 className="text-sm font-bold opacity-40 uppercase mb-1">
                  Receiver
                </h2>
                <p className="text-xl font-bold">{parcel.receiverInfo?.name}</p>
                <p className="text-xs opacity-60 flex items-center md:justify-end gap-1 mt-1">
                  <MapPin size={12} /> {parcel.receiverInfo?.address}
                </p>
              </div>
            </div>
          </div>

          <div className="card-body p-8 md:p-12">
            {/* Timeline UI */}
            <div className="relative mb-12">
              <ul className="steps w-full">
                {steps.map((step, index) => (
                  <li
                    key={step}
                    className={`step capitalize font-bold text-xs md:text-sm ${
                      index <= currentStatusIndex
                        ? "step-primary"
                        : "after:bg-base-200!"
                    }`}
                  >
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mt-4">
              {/* Parcel Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-black flex items-center gap-2 border-b pb-2">
                  <Package className="text-primary" size={20} /> Shipment Info
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-base-200/50 p-4 rounded-2xl text-center">
                    <p className="text-[10px] uppercase font-bold opacity-40">
                      Cost
                    </p>
                    <p className="text-xl font-black">${parcel.cost}</p>
                  </div>
                  <div className="bg-base-200/50 p-4 rounded-2xl text-center">
                    <p className="text-[10px] uppercase font-bold opacity-40">
                      Weight
                    </p>
                    <p className="text-xl font-black">
                      {parcel.weight || "1"} KG
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">
                  <span className="font-bold opacity-50">Content:</span>{" "}
                  {parcel.description}
                </p>
              </div>

              {/* Live History */}
              <div className="space-y-6">
                <h3 className="text-lg font-black flex items-center gap-2 border-b pb-2">
                  <Clock className="text-primary" size={20} /> Live Updates
                </h3>
                <div className="space-y-6 h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {parcel.statusHistory
                    ?.slice()
                    .reverse()
                    .map((log, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              i === 0
                                ? "bg-primary animate-ping"
                                : "bg-base-300"
                            }`}
                          ></div>
                          <div className="w-0.5 h-full bg-base-200 absolute top-3"></div>
                        </div>
                        <div className="pb-4">
                          <p
                            className={`font-bold capitalize text-sm ${
                              i === 0 ? "text-primary" : "opacity-60"
                            }`}
                          >
                            {log.status}
                          </p>
                          <p className="text-xs opacity-50">{log.note}</p>
                          <p className="text-[10px] font-medium mt-1 opacity-40 italic">
                            {format(
                              new Date(log.timestamp),
                              "MMM d, yyyy • h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
