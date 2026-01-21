"use client";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  DollarSign,
  Weight,
  Clock,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Navigation,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function AgentParcelDetails() {
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
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Top Navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/agent/tasks"
          className="btn btn-ghost btn-sm rounded-xl"
        >
          <ArrowLeft size={18} /> Back to List
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Core Info (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status Header Card */}
          <div className="bg-base-100/50 p-8 rounded-[2.5rem] border border-base-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                <Package size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-base-content uppercase">
                  #{parcel?.trackingId}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge badge-primary badge-sm font-bold py-3 uppercase text-[10px]">
                    {parcel?.status}
                  </span>
                  <span className="text-xs text-neutral font-bold flex items-center gap-1">
                    <Calendar size={12} />{" "}
                    {new Date(parcel?.bookingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Link
                href={`tel:${parcel?.receiverInfo?.phone}`}
                className="btn btn-primary flex-1 md:flex-none rounded-2xl gap-2 font-bold"
              >
                <Phone size={18} /> Call Receiver
              </Link>
            </div>
          </div>

          {/* Delivery Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender Info */}
            <div className="bg-base-100/50 p-6 rounded-4xl border border-base-100">
              <h4 className="text-[10px] font-black text-neutral uppercase tracking-widest mb-4">
                Pickup From (Sender)
              </h4>
              <div className="space-y-3">
                <p className="font-bold text-base-content flex items-center gap-2">
                  <User size={16} className="text-primary" />{" "}
                  {parcel?.senderInfo?.name}
                </p>
                <p className="text-sm text-base-content flex items-start gap-2">
                  <MapPin size={16} className="mt-1 text-primary" />{" "}
                  {parcel?.senderInfo?.address || "Address not provided"}
                </p>
              </div>
            </div>

            {/* Receiver Info */}
            <div className="bg-primary/10 p-6 rounded-4xl border border-primary/10">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">
                Deliver To (Receiver)
              </h4>
              <div className="space-y-3">
                <p className="font-bold text-base-content flex items-center gap-2">
                  <User size={16} className="text-primary" />{" "}
                  {parcel?.receiverInfo?.name}
                </p>
                <p className="text-sm text-base-content flex items-start gap-2">
                  <MapPin size={16} className="mt-1 text-primary" />{" "}
                  {parcel?.receiverInfo?.address}
                </p>
                <p className="font-bold text-primary text-sm flex items-center gap-2">
                  <Phone size={16} /> {parcel?.receiverInfo?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Grid */}
          <div className="bg-base-100/50 p-8 rounded-[2.5rem] border border-base-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <Weight size={20} className="mx-auto text-primary mb-1" />
              <p className="text-xs font-bold text-neutral uppercase">Weight</p>
              <p className="font-black text-base-content">
                {parcel?.weight || parcel?.parcelWeight} kg
              </p>
            </div>
            <div className="text-center p-4 border-l border-base-300">
              <DollarSign size={20} className="mx-auto text-primary mb-1" />
              <p className="text-xs font-bold text-neutral uppercase">
                Cash Collection
              </p>
              <p className="font-black text-base-content">{parcel?.cost} $</p>
            </div>
            <div className="col-span-2 p-4 bg-base-100 rounded-2xl flex flex-col justify-center px-6">
              <p className="text-xs font-bold text-neutral uppercase mb-1">
                Parcel Content
              </p>
              <p className="text-sm font-bold text-neutral italic">
                &quot;{parcel?.description || "No description provided"}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline & Actions (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-base-100/50 p-6 rounded-[2.5rem] border border-base-100 shadow-sm h-full">
            <h3 className="text-lg font-black text-base-content mb-6 flex items-center gap-2">
              <Clock size={20} className="text-primary" /> Tracking Log
            </h3>

            <div className="relative">
              {parcel?.statusHistory &&
                [...parcel.statusHistory].reverse().map((history, index) => {
                  const isCurrent = index === 0;
                  return (
                    <div
                      key={index}
                      className="relative flex gap-4 pb-12 group last:pb-0"
                    >
                      {/* Vertical Line */}
                      {index !== parcel.statusHistory.length - 1 && (
                        <div className="absolute left-2.75 top-5 w-0.5 h-full bg-neutral/20 group-hover:bg-primary/30 transition-colors"></div>
                      )}

                      {/* Circle Icon */}
                      <div className="relative z-10">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center bg-base-100 border-2 transition-all duration-500 ${
                            isCurrent
                              ? "border-primary scale-125 shadow-lg shadow-primary/20"
                              : "border-neutral"
                          }`}
                        >
                          {isCurrent ? (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div>
                          ) : (
                            <div className="w-2 h-2 bg-neutral rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`flex-1 transition-all ${
                          isCurrent ? "scale-105" : "opacity-60"
                        }`}
                      >
                        <h4
                          className={`font-black text-sm uppercase tracking-tight ${
                            isCurrent ? "text-primary" : "text-neutral"
                          }`}
                        >
                          {history.status}
                        </h4>
                        <p className="text-xs text-neutral font-bold mb-2">
                          {new Date(history.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          - {new Date(history.timestamp).toLocaleDateString()}
                        </p>
                        <div
                          className={`${
                            isCurrent ? "bg-primary/20 text-primary" : ""
                          } bg-base-100 p-3 rounded-2xl border border-base-100 text-[13px] leading-snug`}
                        >
                          {history.note ||
                            "No details provided for this stage."}
                        </div>
                      </div>
                    </div>
                  );
                })}
              {(!parcel?.statusHistory ||
                parcel.statusHistory.length === 0) && (
                <p className="text-center text-neutral text-sm italic py-10">
                  No tracking history found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
