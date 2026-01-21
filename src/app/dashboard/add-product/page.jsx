"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  PackagePlus,
  Image as ImageIcon,
  Tag,
  DollarSign,
  AlignLeft,
} from "lucide-react";

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        reset();
        router.push("/dashboard/my-products");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100/50 rounded-3xl shadow-sm border border-base-100">
      <div className="flex items-center gap-3 mb-8 border-b border-neutral/50 pb-4">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <PackagePlus size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Add New Product
          </h1>
          <p className="text-sm text-neutral font-medium">
            Create a new listing for your professional showcase.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Product Title */}
        <div className="col-span-2 md:col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold mb-2">
            <Tag size={16} /> Product Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            className="input w-full rounded-xl shadow focus:ring-2 focus:ring-primary/50 outline-none border-2 border-base-300"
            placeholder="e.g. Modern UI Kit"
          />
          {errors.title && (
            <span className="text-red-500 text-xs mt-1">
              {errors.title.message}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="col-span-2 md:col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold mb-2">
            <PackagePlus size={16} /> Category
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="select w-full rounded-xl shadow focus:ring-2 focus:ring-primary/50 outline-none border-2 border-base-300"
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Software">Software</option>
            <option value="Service">Service</option>
          </select>
        </div>

        {/* Price */}
        <div className="col-span-2 md:col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold mb-2">
            <DollarSign size={16} /> Price (USD)
          </label>
          <input
            type="number"
            min={0}
            {...register("price", { required: "Price is required" })}
            className="input w-full rounded-xl pr-6 shadow focus:ring-2 focus:ring-primary/50 outline-none border-2 border-base-300"
            placeholder="0.00"
          />
        </div>

        {/* Image URL */}
        <div className="col-span-2 md:col-span-1">
          <label className="flex items-center gap-2 text-sm font-bold mb-2">
            <ImageIcon size={16} /> Image URL
          </label>
          <input
            {...register("image", { required: "Image URL is required" })}
            className="input w-full rounded-xl shadow focus:ring-2 focus:ring-primary/50 outline-none border-2 border-base-300"
            placeholder="https://i.ibb.co/..."
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="flex items-center gap-2 text-sm font-bold mb-2">
            <AlignLeft size={16} /> Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="textarea w-full rounded-xl shadow focus:ring-2 focus:ring-primary/50 outline-none border-2 border-base-300 h-32"
            placeholder="Describe your product details..."
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-2 flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-ghost rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary px-8 rounded-xl ${
              loading ? "loading" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
