"use client";
import React from "react";
import {
  AlertCircle,
  ClosedCaption,
  Mail,
  MapPin,
  MessagesSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const ContactPage = () => {
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
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    if (!user?.email) return toast.error("Please login first");
    toast.success("Thank you! Your message has been sent.");
    reset();
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4">
          Get In <span className="text-primary">Touch</span>
        </h1>
        <p className="text-neutral max-w-lg mx-auto">
          Have questions or need help? Reach out to us and we&apos;ll get back
          to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-base-100/50 p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-base-100">
        {/* Contact Information */}
        <div className="space-y-8 bg-primary/80 p-10 rounded-[3rem] text-primary-content">
          <h2 className="text-3xl font-bold">Contact Information</h2>
          <p className="opacity-80">
            Fill out the form and our team will get back to you within 24 hours.
          </p>

          <div className="space-y-6 mt-10">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Mail size={24} />
              </div>
              <span>support@fast-parcel.com</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Phone size={24} />
              </div>
              <span>+880 1234 567 890</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <MapPin size={24} />
              </div>
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label font-bold text-neutral mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 z-10 top-3 text-neutral"
                  size={20}
                />
                <input
                  {...register("name")}
                  placeholder="Enter full name"
                  className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {errors.name && (
                <p className="text-error text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label font-bold text-neutral mb-2">Email</label>
              <div className="relative">
                <Mail
                  className="absolute left-4 z-10 top-3 text-neutral"
                  size={20}
                />
                <input
                  {...register("email")}
                  placeholder="Enter your email"
                  className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {errors.email && (
                <p className="text-error text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label font-bold text-neutral mb-2">Subject</label>
            <div className="relative">
              <ClosedCaption
                className="absolute left-4 z-10 top-3 text-neutral"
                size={20}
              />
              <input
                {...register("subject")}
                placeholder="Inquiry about product"
                className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {errors.subject && (
              <p className="text-error text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.subject.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label font-bold text-neutral mb-2">Message</label>
            <div className="relative">
              <MessagesSquare
                className="absolute left-4 z-10 top-4 text-neutral"
                size={20}
              />
              <textarea
                {...register("message")}
                className="textarea textarea-bordered w-full pl-12 pt-4 rounded-2xl bg-base-100 border-none focus:ring-2 focus:ring-primary min-h-30 outline-none"
                placeholder="Your message here..."
              ></textarea>
            </div>
            {errors.message && (
              <p className="text-error text-xs mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full rounded-2xl gap-2 shadow-lg shadow-primary/30"
          >
            <Send size={18} /> Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
