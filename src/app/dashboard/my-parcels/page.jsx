"use client";
import FadeIn from "@/components/motion/FadeIn";
import { useParcels } from "@/hooks/useParcels";
import { Package, Truck, Clock, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

const statusConfig = {
  pending: { color: "badge-warning", icon: Clock },
  picked: { color: "badge-info", icon: Package },
  "in-transit": { color: "badge-primary", icon: Truck },
  delivered: { color: "badge-success", icon: CheckCircle },
};

export default function MyParcelsPage() {
  const { data: parcels, isLoading, error } = useParcels();

  if (isLoading)
    return (
      <div className="text-center py-20">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">My Shipments</h1>
        <Link
          href="/dashboard/add-item"
          className="btn btn-primary btn-sm md:btn-md"
        >
          + New Parcel
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parcels?.map((parcel) => {
          const StatusIcon = statusConfig[parcel.status]?.icon || Package;

          return (
            <FadeIn key={parcel._id}>
              <div className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary transition-all group">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`badge ${
                        statusConfig[parcel.status]?.color
                      } gap-2 p-3 uppercase text-[10px] font-bold`}
                    >
                      <StatusIcon size={14} />
                      {parcel.status}
                    </div>
                    <span className="text-xs text-neutral">
                      #{parcel.trackingId}
                    </span>
                  </div>

                  <h3 className="card-title text-lg mb-1">
                    {parcel.receiverInfo.name}
                  </h3>
                  <p className="text-sm text-neutral line-clamp-1 mb-4">
                    To: {parcel.receiverInfo.address}
                  </p>

                  <div className="divider my-0"></div>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-xs text-neutral">Estimate Cost</p>
                      <p className="font-bold text-primary">${parcel.cost}</p>
                    </div>
                    <Link
                      href={`/items/${parcel._id}`}
                      className="btn btn-circle btn-ghost group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {parcels?.length === 0 && (
        <div className="text-center py-20 bg-base-200 rounded-box">
          <Package className="mx-auto mb-4 opacity-20" size={64} />
          <p className="text-xl font-semibold opacity-50">No parcels found</p>
        </div>
      )}
    </div>
  );
}
