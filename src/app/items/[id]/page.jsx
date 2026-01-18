"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Package, MapPin, Calendar, DollarSign } from "lucide-react";

export default function ParcelDetails({ params }) {
  const { id } = use(params);

  const { data: parcel, isLoading } = useQuery({
    queryKey: ["parcel", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/parcels/${id}`);
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (!parcel)
    return (
      <div className="text-center py-20 text-error font-bold">
        Parcel Not Found!
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="bg-base-100 shadow-2xl rounded-3xl overflow-hidden border border-base-300">
        <div className="bg-primary p-8 text-white">
          <p className="text-sm opacity-80 mb-1 uppercase tracking-widest">
            Tracking ID
          </p>
          <h1 className="text-3xl font-black">{parcel.trackingId}</h1>
        </div>

        <div className="p-8">
          {/* Status History / Timeline */}
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Package className="text-primary" /> Delivery Timeline
          </h2>

          <ul className="steps steps-vertical w-full">
            {parcel.statusHistory?.map((history, index) => (
              <li key={index} className="step step-primary">
                <div className="text-left ml-4 mb-8">
                  <p className="font-bold uppercase text-sm">
                    {history.status}
                  </p>
                  <p className="text-xs text-neutral">
                    {new Date(history.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm mt-1 opacity-70 italic">
                    {history.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="divider"></div>

          {/* Parcel Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" />
              <div>
                <p className="font-bold">Sender Details</p>
                <p className="text-sm opacity-70">{parcel.senderInfo.name}</p>
                <p className="text-sm opacity-70">
                  {parcel.senderInfo.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-secondary mt-1" />
              <div>
                <p className="font-bold">Receiver Details</p>
                <p className="text-sm opacity-70">{parcel.receiverInfo.name}</p>
                <p className="text-sm opacity-70">
                  {parcel.receiverInfo.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
