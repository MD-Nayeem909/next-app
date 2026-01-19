"use client";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Camera,
  Edit3,
  Package,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      return res.json();
    },
  });
  if (isLoading) return <div>Loading Profile...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
      {/* 1. Header & Avatar Section */}
      <div className="relative mb-35">
        <div className="h-48 w-full bg-linear-to-r from-primary/20 to-primary/5 rounded-[3rem] border border-primary/10"></div>
        <div className="absolute -bottom-30 left-10 flex items-end gap-6">
          <div>
            <div className="">
              <div className="w-32 h-32 rounded-[2.5rem] bg-base-100 p-2 shadow-xl relative group">
                <div className="w-full h-full rounded-4xl bg-base-200 overflow-hidden flex items-center justify-center">
                  {user?.image ? (
                    <img
                      src={
                        user?.image ||
                        "https://i.ibb.co/vz6mD2V/user-placeholder.png"
                      }
                      className="w-full h-full object-cover"
                      alt="Profile"
                      onError={(e) => {
                        e.target.src =
                          "https://i.ibb.co/vz6mD2V/user-placeholder.png";
                      }}
                    />
                  ) : (
                    <User size={50} className="text-neutral" />
                  )}
                </div>
                <button className="absolute right-0 bottom-0 p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                  <Camera size={16} />
                </button>
              </div>
            </div>
            <div className="mb-2">
              <h1 className="text-3xl sm:text-5xl lg:text-4xl font-bold text-base-content tracking-tight leading-tight">
                {user?.name}
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-white font-bold uppercase tracking-widest text-[10px] bg-info backdrop-blur px-3 py-1 rounded-full inline-block border border-info">
                  Account Type: {user?.role || "Customer"}
                </p>
                <ShieldCheck className="text-primary" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
        {/* 2. Personal Information Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-base-100/50 p-8 rounded-[3rem] border border-base-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-base-content">
                Personal Information
              </h3>
              <Link href="/dashboard/profile/edit">
                <button className="btn btn-ghost btn-sm rounded-xl gap-2 font-bold text-primary">
                  <Edit3 size={16} /> Edit Profile
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-neutral uppercase">
                    Email Address
                  </p>
                  <p className="font-bold text-base-content">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-success/20 rounded-2xl text-success">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-neutral uppercase">
                    Phone Number
                  </p>
                  <p className="font-bold text-base-content">
                    {user?.phone || "Not Updated"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 md:col-span-2 border-t border-neutral/20 pt-6">
                <div className="p-3 bg-info/20 rounded-2xl text-info">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-neutral uppercase">
                    Primary Address
                  </p>
                  <p className="font-bold text-base-content">
                    {user?.address ||
                      "Please add your primary delivery address"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Account Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 p-6 rounded-4xl border border-primary/10 text-center">
              <Package size={24} className="mx-auto text-primary mb-2" />
              <p className="text-2xl font-black text-base-content">12</p>
              <p className="text-xs font-bold text-neutral uppercase">
                Total Parcels
              </p>
            </div>
            <div className="bg-neutral/10 p-6 rounded-4xl border border-base-100 text-center">
              <Calendar size={24} className="mx-auto text-neutral mb-2" />
              <p className="text-2xl font-black text-base-content">2024</p>
              <p className="text-[10px] font-bold text-neutral uppercase">
                Member Since
              </p>
            </div>
          </div>
        </div>

        {/* 3. Security & Account Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6">Account Status</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-2xl">
                <span className="text-sm">Verified Profile</span>
                <div className="badge badge-success badge-sm font-bold uppercase py-2">
                  Active
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-2xl">
                <span className="text-sm">Two-Factor Auth</span>
                <span className="text-xs text-neutral">Disabled</span>
              </div>
            </div>
            <ShieldCheck
              size={120}
              className="absolute -right-10 -bottom-10 text-neutral/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
