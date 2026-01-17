"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  DollarSign,
  Weight,
  Clock,
} from "lucide-react";

export default function ParcelDetailsPage() {
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
        <span className="loading loading-bars lg text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black tracking-tighter text-base-content">
              #{parcel?.trackingId?.toUpperCase()}
            </h1>
            <div className="badge badge-primary whitespace-nowrap badge-outline font-bold px-4 py-3 rounded-xl uppercase text-[10px]">
              {parcel?.status}
            </div>
          </div>
          <p className="text-neutral font-medium flex items-center gap-2">
            <Calendar size={16} /> Booked on:{" "}
            {new Date(parcel?.bookingDate).toLocaleDateString()}
          </p>
        </div>
        <button className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20 font-black">
          Download Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 bg-base-100/50 p-8 rounded-[3rem] border border-base-100 shadow-sm self-start">
          <h3 className="text-xl font-black text-base-content mb-8 flex items-center gap-2">
            <Clock className="text-primary" /> Delivery Journey
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
                        {history.note || "No details provided for this stage."}
                      </div>
                    </div>
                  </div>
                );
              })}
            {(!parcel?.statusHistory || parcel.statusHistory.length === 0) && (
              <p className="text-center text-neutral text-sm italic py-10">
                No tracking history found.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Parcel Info Cards */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sender & Receiver Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender */}
            <div className="bg-base-100/50 p-8 rounded-[2.5rem] border border-base-100">
              <p className="text-xs font-black text-neutral uppercase tracking-widest mb-4">
                Sender Details
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shadow-sm text-primary">
                    <User size={18} />
                  </div>
                  <p className="font-bold text-base-content/80">
                    {parcel?.senderInfo?.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-info/20 rounded-xl flex items-center justify-center shadow-sm text-info">
                    <MapPin size={18} />
                  </div>
                  <p className="text-sm text-neutral leading-relaxed">
                    {parcel?.senderInfo?.address || "Address not provided"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-info/20 rounded-xl flex items-center justify-center shadow-sm text-info">
                    <MapPin size={18} />
                  </div>
                  <p className="text-sm text-neutral leading-relaxed">
                    {parcel?.senderInfo?.phone || "Address not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-primary/20 p-8 rounded-[2.5rem] border border-primary/10">
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">
                Receiver Details
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                    <User size={18} />
                  </div>
                  <p className="font-bold text-base-content/80">
                    {parcel?.receiverInfo?.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                    <MapPin size={18} />
                  </div>
                  <p className="text-sm text-neutral leading-relaxed">
                    {parcel?.receiverInfo?.address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                    <Phone size={18} />
                  </div>
                  <p className="text-sm text-neutral leading-relaxed">
                    {parcel?.receiverInfo?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Parcel Specifications */}
          <div className="bg-base-100/50 p-8 rounded-[3rem] border border-base-100 shadow-sm relative overflow-hidden group transition-all">
            <h3 className="text-xl font-black text-base-content mb-6">
              Parcel Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-base-200 rounded-4xl text-center">
                <Weight className="mx-auto mb-2 text-primary" size={20} />
                <p className="text-xs font-bold text-neutral uppercase">
                  Weight
                </p>
                <p className="text-lg font-black text-base-content/80">
                  {parcel?.weight} kg
                </p>
              </div>
              <div className="p-5 bg-base-200 rounded-4xl text-center">
                <DollarSign className="mx-auto mb-2 text-primary" size={20} />
                <p className="text-xs font-bold text-neutral uppercase">
                  Total Cost
                </p>
                <p className="text-lg font-black text-base-content/80">
                  {parcel?.cost} $
                </p>
              </div>
              <div className="p-5 bg-base-200 rounded-4xl text-center col-span-2">
                <Package className="mx-auto mb-2 text-primary" size={20} />
                <p className="text-xs font-bold text-neutral uppercase">
                  Type / Description
                </p>
                <p className="text-sm font-bold text-base-content line-clamp-1">
                  {parcel?.description || "General Goods"}
                </p>
              </div>
            </div>
            {/* Background Decoration */}
            <Package
              className="absolute -right-10 -bottom-10 opacity-5 scale-[4] rotate-12 group-hover:scale-115 transition-transform duration-500"
              size={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
