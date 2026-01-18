"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  Save,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  LockKeyhole,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  const { register, handleSubmit, reset, watch } = useForm();
  const currentImageUrl = watch("image");

  useEffect(() => {
    const loadLatestData = async () => {
      try {
        const res = await fetch("/api/users/me");
        const userData = await res.json();

        if (res.ok) {
          reset({
            name: userData.name,
            email: userData.email,
            phone: userData.phone || "",
            address: userData.address || "",
            image: userData.image || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load user data");
      } finally {
        setFetching(false);
      }
    };

    if (session) loadLatestData();
  }, [session, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await update({
          user: {
            ...session?.user,
            name: data.name,
            phone: data.phone,
            address: data.address,
            image: data.image,
          },
        });
        if (data.password && data.password.trim() !== "") {
          toast.success("Password changed! Please login again.");
          signOut({ callbackUrl: "/login" });
        } else {
          toast.success("Profile updated successfully!");
          router.push("/dashboard/profile");
          router.refresh();
        }
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Update failed");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return <div className="p-10 text-center">Loading Profile Data...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/profile"
          className="btn btn-ghost btn-sm rounded-xl"
        >
          <ArrowLeft size={18} /> Back
        </Link>
        <h1 className="text-2xl font-black">Edit Your Profile</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group w-32 h-32">
            <div className="w-full h-full rounded-[2.5rem] bg-base-100/50 overflow-hidden border-4 border-base-100 shadow-lg">
              <Image
                src={
                  currentImageUrl ||
                  "https://i.ibb.co/vz6mD2V/user-placeholder.png"
                }
                width={128}
                height={128}
                className="w-full h-full object-cover"
                alt="Preview"
                onError={(e) => {
                  e.target.src =
                    "https://i.ibb.co/vz6mD2V/user-placeholder.png";
                }}
              />
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="bg-base-100/50 p-8 rounded-[3rem] border border-base-100 shadow-sm space-y-5">
          {/* Image URL Input */}
          <div className="form-control">
            <label className="label text-xs font-bold text-neutral mb-2">
              PROFILE IMAGE URL
            </label>
            <div className="relative">
              <ImageIcon
                className="absolute z-10 left-4 top-3 text-neutral"
                size={18}
              />
              <input
                {...register("image")}
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none focus:ring-2 focus:ring-primary/60 font-bold outline-none"
              />
            </div>
          </div>
          {/* Name Field*/}
          <div className="form-control">
            <label className="label text-xs font-black uppercase text-neutral mb-2">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute z-10 left-4 top-3 text-neutral"
                size={18}
              />
              <input
                {...register("name")}
                className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none focus:ring-2 focus:ring-primary/60 font-bold outline-none"
              />
            </div>
          </div>
          {/* Phone Field */}
          <div className="form-control">
            <label className="label text-xs font-black uppercase text-neutral mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="absolute z-10 left-4 top-3 text-neutral"
                size={18}
              />
              <input
                {...register("phone")}
                className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none focus:ring-2 focus:ring-primary/60 font-bold outline-none"
              />
            </div>
          </div>
          {/* Password Field */}
          <div className="form-control">
            <label className="label text-xs font-black uppercase text-neutral mb-2">
              New Password (Leave blank to keep same)
            </label>
            <div className="relative">
              <LockKeyhole
                className="absolute z-10 left-4 top-3 text-neutral"
                size={18}
              />
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none focus:ring-2 focus:ring-primary/60 font-bold outline-none"
              />
            </div>
          </div>
          {/* Address Field */}
          <div className="form-control">
            <label className="label text-xs font-black uppercase text-neutral mb-2">
              Home Address
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-4 top-4 z-10 text-neutral"
                size={18}
              />
              <textarea
                {...register("address")}
                placeholder="Enter your home address"
                className="textarea textarea-bordered input input-bordered w-full pl-12 py-4 rounded-2xl bg-base-100 border-none focus:ring-2 focus:ring-primary/60 font-bold outline-none min-h-25"
              ></textarea>
            </div>
          </div>

          <button
            disabled={loading}
            className="btn btn-primary w-full rounded-2xl font-black gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
