"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { UserCog, ShieldCheck, Truck, User } from "lucide-react";

export default function UsersPage() {
  const queryClient = useQueryClient();

  const { data: result, isLoading } = useQuery({
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
              <th className="pr-8 text-right">Actions</th>
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
                    className={`badge badge-sm font-bold gap-1 py-3 px-4 rounded-lg ${
                      user.role === "admin"
                        ? "bg-error/10 text-error border-none"
                        : user.role === "agent"
                        ? "bg-primary/10 text-primary border-none"
                        : "bg-base-200 border-none"
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
