"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Package,
  User,
  MapPin,
  Phone,
  Weight,
  DollarSign,
  Send,
  AlertCircle,
} from "lucide-react";

const parcelSchema = z.object({
  receiverName: z.string().min(3, "Receiver name is too short"),
  receiverPhone: z.string().min(11, "Enter a valid phone number").max(14),
  deliveryAddress: z.string().min(10, "Please provide a detailed address"),
  parcelWeight: z.preprocess(
    (val) => parseFloat(val),
    z.number().min(0.1, "Weight must be at least 0.1kg")
  ),
  description: z
    .string()
    .min(5, "Please describe the parcel (e.g. Clothes, Gift items)"),
});

export default function CreateParcel() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("/api/auth/session");
      return res.json();
    },
  });
  const user = session?.user;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      parcelWeight: 0,
    },
  });

  const watchedWeight = watch("parcelWeight");
  const cost = (parseFloat(watchedWeight) || 0) * 50;

  const mutation = useMutation({
    mutationFn: async (newParcel) => {
      const res = await fetch("/api/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newParcel),
      });
      if (!res.ok) throw new Error("Failed to create parcel");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      toast.success("Parcel Created Successfully!");
      router.push("/dashboard/my-parcels");
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = (data) => {
    if (!user?.email) return toast.error("Please login first");

    const parcelData = {
      //Sender Information
      senderInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone || "N/A",
        address: user.address || "Sender Address Not Provided",
      },

      //Receiver Information
      receiverInfo: {
        name: data.receiverName,
        phone: data.receiverPhone,
        address: data.deliveryAddress,
      },
      description: data.description,
      parcelWeight: data.parcelWeight,
      cost: cost,
      status: "pending",
      bookingDate: new Date().toISOString(),
    };
    mutation.mutate(parcelData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-base-content">
            Create New Parcel
          </h1>
          <p className="text-neutral mt-2 font-medium">
            Send your package securely and fast.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-neutral uppercase">Sender</p>
          <p className="text-sm font-bold text-primary">{user?.name}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Side: Input Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-base-100/50 p-8 rounded-[2.5rem] border border-base-300 shadow-sm space-y-5">
            {/* Receiver Name */}
            <div className="form-control">
              <label className="label font-bold text-neutral mb-2">
                Receiver&apos;s Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-4 text-neutral"
                  size={20}
                />
                <input
                  {...register("receiverName")}
                  placeholder="Enter full name"
                  className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {errors.receiverName && (
                <p className="text-error text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.receiverName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Receiver Phone */}
              <div className="form-control">
                <label className="label font-bold text-neutral mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-4 text-neutral"
                    size={20}
                  />
                  <input
                    {...register("receiverPhone")}
                    placeholder="01XXXXXXXXX"
                    className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.receiverPhone && (
                  <p className="text-error text-xs mt-1">
                    {errors.receiverPhone.message}
                  </p>
                )}
              </div>

              {/* Parcel Weight */}
              <div className="form-control">
                <label className="label font-bold text-neutral mb-2">
                  Parcel Weight (kg)
                </label>
                <div className="relative">
                  <Weight
                    className="absolute left-4 top-4 text-neutral"
                    size={20}
                  />
                  <input
                    type="number"
                    step="0.1"
                    {...register("parcelWeight", { valueAsNumber: true })}
                    placeholder="e.g. 1.5"
                    className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.parcelWeight && (
                  <p className="text-error text-xs mt-1">
                    {errors.parcelWeight.message}
                  </p>
                )}
              </div>
            </div>

            {/* Parcel Description */}
            <div className="form-control">
              <label className="label font-bold text-sm">
                Parcel Description
              </label>
              <div className="relative">
                <Package
                  className="absolute left-4 top-4 text-neutral/40"
                  size={18}
                />
                <textarea
                  {...register("description")}
                  className={`textarea textarea-bordered w-full pl-12 pt-4 rounded-2xl bg-base-200/30 border-none focus:ring-2 focus:ring-primary min-h-20 ${
                    errors.description ? "ring-2 ring-error" : ""
                  }`}
                  placeholder="What's inside? (e.g. Laptop, Books, Glassware...)"
                ></textarea>
              </div>
              {errors.description && (
                <p className="text-error text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Delivery Address */}
            <div className="form-control">
              <label className="label font-bold text-neutral mb-2">
                Delivery Address
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-4 text-neutral"
                  size={20}
                />
                <textarea
                  {...register("deliveryAddress")}
                  className="textarea textarea-bordered w-full pl-12 pt-4 rounded-2xl bg-base-100 border-none focus:ring-2 focus:ring-primary min-h-30"
                  placeholder="Full street address, City, Area..."
                ></textarea>
              </div>
              {errors.deliveryAddress && (
                <p className="text-error text-xs mt-1">
                  {errors.deliveryAddress.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Package className="text-primary" /> Order Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-neutral font-medium">
                <span>Weight</span>
                <span className="text-white">{watchedWeight || 0} kg</span>
              </div>
              <div className="flex justify-between text-neutral font-medium">
                <span>Delivery Fee</span>
                <span className="text-white">50 TK / kg</span>
              </div>
              <div className="divider before:bg-slate-800 after:bg-slate-800"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Cost</span>
                <div className="flex items-center gap-1 text-2xl font-black text-primary">
                  <DollarSign size={24} />
                  {cost}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-primary w-full mt-8 rounded-2xl py-4 h-auto text-lg font-black gap-2 shadow-lg shadow-primary/30"
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <Send size={20} />
              )}
              Place Order
            </button>
          </div>

          <div className="bg-primary/10 border border-primary/10 p-6 rounded-4xl">
            <p className="text-xs font-medium text-neutral leading-relaxed italic text-center">
              * Delivery usually takes 2-3 business days. Please make sure the
              phone number is correct.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
