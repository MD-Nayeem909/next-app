"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Truck, User, Mail, Lock, Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import ImageUpload from "@/components/shared/ImageUpload";
import PasswordInput from "@/components/shared/PasswordInput";
import { Select } from "@radix-ui/react-select";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "agent"]),
});

export default function Register() {
  const router = useRouter();
  const [photo, setPhoto] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "customer" },
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Registration failed");

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card w-full max-w-md bg-base-100 shadow-lg"
      >
        <div className="card-body p-8">
          <h2 className="text-2xl font-black text-center mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="form-control">
              <p className="font-semibold mb-2 text-md">Full Name</p>
              <div className="relative">
                <span className="absolute left-3 inset-y-0 flex items-center text-neutral/60">
                  <User size={18} />
                </span>

                <input
                  {...register("name")}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-100 text-base-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all duration-200"
                />
              </div>
              {errors.name && (
                <p className="text-error text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            {/* Email */}
            <div className="form-control">
              <p className="font-semibold mb-2 text-md">Email</p>
              <div className="relative">
                <span className="absolute left-3 inset-y-0 flex items-center text-neutral/60">
                  <Mail size={18} />
                </span>

                <input
                  {...register("email")}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-100 text-base-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all duration-200"
                />
              </div>
              {errors.email && (
                <p className="text-error text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Image url */}
            <div className="form-control mb-4">
              <p className="font-semibold mb-2 text-md">Profile Picture</p>
              <ImageUpload onUploadSuccess={(url) => setPhoto(url)} />
              <input type="hidden" {...register("image")} value={photo} />
            </div>
            {/* Password */}
            <PasswordInput register={register} />

            {/* Role Select */}
            <div className="form-control w-full">
              <p className="font-semibold mb-2 text-md">I want to join as</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Option */}
                <label
                  className={`relative flex flex-col items-center p-4 border-2 rounded-2xl cursor-pointer transition-all hover:bg-base-200 ${
                    watch("role") === "customer"
                      ? "border-primary bg-primary/5"
                      : "border-base-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="customer"
                    {...register("role")}
                    className="hidden"
                  />
                  <div
                    className={`p-3 rounded-full mb-2 ${
                      watch("role") === "customer"
                        ? "bg-primary text-white"
                        : "bg-base-200"
                    }`}
                  >
                    <User size={24} />
                  </div>
                  <span className="font-bold">Customer</span>
                  <span className="text-xs opacity-60 text-center">
                    Send & track your parcels easily
                  </span>

                  {/* Selection Checkmark */}
                  {watch("role") === "customer" && (
                    <div className="absolute top-2 right-2 badge badge-primary badge-xs"></div>
                  )}
                </label>

                {/* Delivery Agent Option */}
                <label
                  className={`relative flex flex-col items-center p-4 border-2 rounded-2xl cursor-pointer transition-all hover:bg-base-200 ${
                    watch("role") === "agent"
                      ? "border-primary bg-primary/5"
                      : "border-base-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="agent"
                    {...register("role")}
                    className="hidden"
                  />
                  <div
                    className={`p-3 rounded-full mb-2 ${
                      watch("role") === "agent"
                        ? "bg-primary text-white"
                        : "bg-base-200"
                    }`}
                  >
                    <Truck size={24} />
                  </div>
                  <span className="font-bold">Delivery Agent</span>
                  <span className="text-xs opacity-60 text-center">
                    Earn by delivering parcels
                  </span>

                  {/* Selection Checkmark */}
                  {watch("role") === "agent" && (
                    <div className="absolute top-2 right-2 badge badge-primary badge-xs"></div>
                  )}
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block mt-4"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
