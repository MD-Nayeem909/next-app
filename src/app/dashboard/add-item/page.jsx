"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { parcelSchema } from "@/schemas/parcelSchema";

export default function AddParcelPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(parcelSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    let fields = [];
    if (step === 1) fields = ["senderName", "senderAddress", "senderPhone"];
    if (step === 2)
      fields = ["receiverName", "receiverAddress", "receiverPhone"];

    const isValid = await trigger(fields);
    if (isValid) setStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/parcels", data);
      if (res.data.success) {
        toast.success("Parcel booked successfully!");
        router.push("/dashboard/customer/parcels");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Something went wrong!";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        Create New Parcel
      </h1>

      {/* Step Indicator */}
      <ul className="steps w-full mb-10">
        <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Sender</li>
        <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Receiver</li>
        <li className={`step ${step === 3 ? "step-primary" : ""}`}>Confirm</li>
      </ul>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-100 p-8 rounded-box shadow-xl border border-base-300"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              key="step1"
            >
              <h2 className="text-xl font-semibold mb-4 text-secondary">
                Sender Information
              </h2>
              <div className="form-control mb-4">
                <label className="label">Sender Name</label>
                <input
                  {...register("senderName")}
                  className={`input input-bordered ${
                    errors.senderName ? "input-error" : "focus:input-primary"
                  }`}
                  placeholder="Full Name"
                />
                {errors.senderName && (
                  <span className="text-error text-sm mt-1">
                    {errors.senderName.message}
                  </span>
                )}
              </div>
              <div className="form-control mb-6">
                <label className="label">Address</label>
                <textarea
                  {...register("senderAddress")}
                  className={`textarea textarea-bordered ${
                    errors.senderAddress
                      ? "textarea-error"
                      : "focus:textarea-primary"
                  }`}
                  placeholder="Pickup Address"
                />
                {errors.senderAddress && (
                  <span className="text-error text-sm mt-1">
                    {errors.senderAddress.message}
                  </span>
                )}
              </div>
              <div className="form-control mb-4">
                <label className="label">Sender Phone</label>
                <input
                  {...register("senderPhone")}
                  className={`input input-bordered ${
                    errors.senderPhone ? "input-error" : ""
                  }`}
                  placeholder="017XXXXXXXX"
                />
                {errors.senderPhone && (
                  <span className="text-error text-sm">
                    {errors.senderPhone.message}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary w-full"
              >
                Next: Receiver Info
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              key="step2"
            >
              <h2 className="text-xl font-semibold mb-4 text-secondary">
                Receiver Information
              </h2>
              <div className="form-control mb-4">
                <label className="label">Receiver Name</label>
                <input
                  {...register("receiverName")}
                  className={`input input-bordered ${
                    errors.receiverName ? "input-error" : ""
                  }`}
                />
                {errors.receiverName && (
                  <span className="text-error text-sm mt-1">
                    {errors.receiverName.message}
                  </span>
                )}
              </div>
              <div className="form-control mb-6">
                <label className="label">Delivery Address</label>
                <textarea
                  {...register("receiverAddress")}
                  className={`textarea textarea-bordered ${
                    errors.receiverAddress ? "textarea-error" : ""
                  }`}
                />
                {errors.receiverAddress && (
                  <span className="text-error text-sm mt-1">
                    {errors.receiverAddress.message}
                  </span>
                )}
              </div>
              <div className="form-control mb-4">
                <label className="label">Receiver Phone</label>
                <input
                  {...register("receiverPhone")}
                  className={`input input-bordered ${
                    errors.receiverPhone ? "input-error" : ""
                  }`}
                  placeholder="018XXXXXXXX"
                />
                {errors.receiverPhone && (
                  <span className="text-error text-sm">
                    {errors.receiverPhone.message}
                  </span>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-ghost flex-1"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary flex-1"
                >
                  Next: Details
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key="step3"
            >
              <h2 className="text-xl font-semibold mb-4 text-secondary">
                Final Details
              </h2>
              <div className="form-control mb-4">
                <label className="label">Parcel Description</label>
                <input
                  {...register("description")}
                  className="input input-bordered"
                  placeholder="Fragile items, books, etc."
                />
                {errors.description && (
                  <span className="text-error text-sm mt-1">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div className="form-control mb-6">
                <label className="label">Estimated Cost ($)</label>
                <input
                  type="number"
                  {...register("cost", { valueAsNumber: true })}
                  className="input input-bordered"
                />
                {errors.cost && (
                  <span className="text-error text-sm mt-1">
                    {errors.cost.message}
                  </span>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-ghost flex-1"
                >
                  Back
                </button>
                <button type="submit" className="btn btn-success flex-1">
                  Confirm & Post
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
