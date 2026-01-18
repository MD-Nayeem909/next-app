"use client";
import FadeIn from "@/components/motion/FadeIn";
import { useParcels } from "@/hooks/useParcels";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  ChevronRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

const statusConfig = {
  pending: {
    color: "bg-warning/10 text-warning border-warning/20",
    icon: Clock,
  },
  picked: { color: "bg-info/10 text-info border-info/20", icon: Package },
  "in-transit": {
    color: "bg-primary/10 text-primary border-primary/20",
    icon: Truck,
  },
  delivered: {
    color: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
};

export default function MyShipmentsPage() {
  const { data: parcels, isLoading } = useParcels();

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Parcels</h1>
          <p className="text-neutral text-sm">
            Track and manage all your sent parcels
          </p>
        </div>
        <Link
          href="/dashboard/customer/create-parcel"
          className="btn btn-primary rounded-2xl gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> New Parcel
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {parcels?.map((parcel) => {
          const config = statusConfig[parcel.status] || {
            color: "bg-base-200",
            icon: Package,
          };
          const StatusIcon = config.icon;

          return (
            <FadeIn key={parcel._id}>
              <div className="card bg-base-100/50 h-full flex flex-col rounded-4xl border border-base-300 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group overflow-hidden">
                <div className="card-body p-7">
                  {/* Status & ID */}
                  <div className="flex justify-between items-center mb-6">
                    <div
                      className={`badge border ${config.color} gap-2 px-3 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider`}
                    >
                      <StatusIcon size={12} />
                      {parcel.status}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-neutral">
                      #{parcel.trackingId?.toUpperCase() || "N/A"}
                    </span>
                  </div>

                  {/* Receiver Info */}
                  <div className="mb-6 grow">
                    <h3 className="text-lg font-black text-base-content line-clamp-1">
                      {parcel.receiverInfo?.name || "No Name"}
                    </h3>
                    <p className="text-xs text-neutral flex items-start gap-1 mt-1">
                      To: {parcel.receiverInfo?.address || "No Address"}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-dashed border-neutral/30 my-2">
                    {/* Footer Info */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-neutral uppercase tracking-widest">
                          Cost
                        </p>
                        <p className="text-xl font-black text-primary">
                          ${parcel.cost || 0}
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/customer/my-parcels/${parcel._id}`}
                        className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner"
                      >
                        <ChevronRight size={22} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Empty State */}
      {(!parcels || parcels.length === 0) && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Package className="opacity-20" size={40} />
          </div>
          <p className="text-xl font-bold text-slate-400">No parcels found</p>
          <Link
            href="/dashboard/customer/create"
            className="btn btn-ghost btn-sm mt-2 text-primary"
          >
            Create your first parcel
          </Link>
        </div>
      )}
    </div>
  );
}
