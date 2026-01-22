"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Edit3, Trash2, Package, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const MyProducts = () => {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMyProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      const myData = data.filter(
        (item) => item.userEmail === session?.user?.email
      );
      setProducts(myData);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyProducts();
    }
    if (status === "authenticated" && session?.user?.role === "customer") {
      router.push("/");
    }
  }, [session, status, router]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ca2c48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
          if (res.ok) {
            setProducts(products.filter((p) => p._id !== id));
            Swal.fire("Deleted!", "Product has been removed.", "success");
          }
        } catch (error) {
          toast.error("Delete failed");
        }
      }
    });
  };

  if (session?.user?.role === "customer") return null;

  if (loading)
    return (
      <div className="p-10 text-center font-bold">Loading your products...</div>
    );

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">
            <Package className="text-primary" /> My Products
          </h1>
          <p className="text-neutral font-medium text-sm">
            Manage and track all your listed products here.
          </p>
        </div>
        <Link
          href="/dashboard/add-product"
          className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      {/* Product Table */}
      <div className="bg-base-100/50 rounded-4xl border border-base-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Table Head */}
            <thead className="bg-base-200 text-neutral">
              <tr>
                <th className="py-5 px-6">Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Created At</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="divide-y divide-neutral/50">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-base-100 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="mask mask-squircle w-14 h-14">
                            <img src={product.image} alt={product.title} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-base-content">
                            {product.title}
                          </div>
                          <div className="text-xs text-neutral truncate max-w-37.5">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost font-semibold text-[11px] uppercase tracking-wider p-3">
                        {product.category}
                      </span>
                    </td>
                    <td>
                      <span className="font-black text-base-content">
                        ${product.price}
                      </span>
                    </td>
                    <td className="text-neutral text-sm">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/edit-product/${product._id}`}
                          className="btn btn-square btn-ghost btn-sm text-blue-500 hover:bg-blue-50"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="btn btn-square btn-ghost btn-sm text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center text-neutral opacity-50">
                      <Package size={60} />
                      <p className="mt-4 font-bold">
                        No products found. Start adding some!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
