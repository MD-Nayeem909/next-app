"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import {
  UserCog,
  ShieldCheck,
  Truck,
  User,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";

export default function UsersPage() {
  const queryClient = useQueryClient();

  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const users = result?.data || [];

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated!");
    },
    onError: (err) => {
      toast.error(err.message || "Update failed");
    },
  });

  const handleBlockUser = async (id, currentStatus) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    console.log("Updated User:", data);
    if (res.ok) refetch();
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) refetch();
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-2 mb-2">
          <UserCog className="text-primary" /> User Management
        </h1>
        <p className="opacity-60 text-sm">Control user permissions and roles</p>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-sm shadow-sm border border-base-300">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200/50">
            <tr className="border-none uppercase text-[10px] tracking-widest opacity-50">
              <th className="py-5 pl-8">User Information</th>
              <th>Current Role</th>
              <th>Joined Date</th>
              <th className="pl-8">Actions</th>
              <th className="pr-8 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-base-200/30">
                <td className="pl-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-neutral-content rounded-xl w-10 flex justify-center items-center">
                        <span className="font-bold">{user.name[0]}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{user.name}</p>
                      <p className="text-[11px] opacity-50">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-bold uppercase p-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
                      user.role === "admin"
                        ? "bg-error/20 text-error border-none"
                        : user.role === "agent"
                        ? "bg-warning/20 text-warning border-none"
                        : "bg-success/20 text-success border-none"
                    }`}
                  >
                    {user.role === "admin" && <ShieldCheck size={12} />}
                    {user.role === "agent" && <Truck size={12} />}
                    {user.role === "customer" && <User size={12} />}
                    <span className="capitalize">{user.role}</span>
                  </span>
                </td>
                <td className="text-xs opacity-60">
                  {user.createdAt
                    ? format(new Date(user.createdAt), "MMM d, yyyy")
                    : "N/A"}
                </td>
                <td className="pr-8 text-right">
                  <select
                    className="select select-xs rounded-lg border border-neutral/50 focus:ring-2 ring-primary/50 outline-none"
                    value={user.role}
                    onChange={(e) =>
                      updateRoleMutation.mutate({
                        id: user._id,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="customer">Customer</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleBlockUser(user._id, user.status)}
                      className={`p-2 rounded-lg transition-all duration-200 flex-1 hover:scale-110 ${
                        user.status === "blocked"
                          ? "bg-success/20 text-success hover:bg-success/30"
                          : "bg-warning/20 text-warning hover:bg-warning/30"
                      }`}
                      title={
                        user.status === "blocked"
                          ? "Unblock User"
                          : "Block User"
                      }
                    >
                      {user.status === "blocked" ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
                          <CheckCircle size={16} /> Unblock
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
                          <Ban size={16} /> Block
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 bg-error/20 rounded-lg text-error hover:bg-error/30 transition-all duration-200 flex-1 hover:scale-110"
                      title="Delete User"
                    >
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
                        <Trash2 size={16} /> Delete
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
