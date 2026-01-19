"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowRight, Mail, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";
import PasswordInput from "@/components/shared/PasswordInput";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleQuickAccess = (email, password) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
    toast.success("Demo credentials loaded!");
  };

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Login Successful!");
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100/50 px-4 py-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card w-full max-w-md bg-base-100/50 shadow-2xl rounded-[2.5rem] border border-base-200"
      >
        <div className="card-body p-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">
              Fast<span className="text-primary">Parcel</span>
            </h2>
            <p className="text-neutral font-medium mt-2">
              Login to manage your shipments
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base-content mb-2">
                  Email Address
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-4 inset-y-0 flex items-center text-neutral z-10">
                  <Mail size={18} />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-100 text-base-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all duration-200"
                />
              </div>
              {errors.email && (
                <p className="text-error text-xs mt-1 font-semibold ml-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <PasswordInput register={register} watch={watch} errors={errors} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block rounded-2xl font-black text-lg h-14 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-md"></span>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Login</span>
                  <ArrowRight size={20} />{" "}
                </div>
              )}
            </button>
          </form>

          {/* Quick Access Section for Portfolio */}
          <div className="mt-10 pt-8 border-t border-neutral/50">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-neutral mb-5">
              Testing Credentials
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  handleQuickAccess("admin@fastparcel.com", "Admin@123")
                }
                className="flex items-center justify-center gap-2 py-3 bg-base-300 hover:bg-base-100 rounded-xl text-xs font-bold text-base-content transition-all border border-base-200"
              >
                <ShieldCheck size={14} className="text-primary" /> Admin
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickAccess("nayeem@gmail.com", "Test@123")
                }
                className="flex items-center justify-center gap-2 py-3 bg-base-300 hover:bg-base-100 rounded-xl text-xs font-bold text-base-content transition-all border border-base-200"
              >
                <Truck size={14} className="text-primary" /> Agent
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
