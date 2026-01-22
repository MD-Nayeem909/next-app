"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import {
  Search,
  User,
  Package,
  MapPin,
  Eye,
  Trash2,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function AdminParcelsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParcelId, setSelectedParcelId] = useState(null);

  const { data: parcelsData, isLoading: parcelsLoading } = useQuery({
    queryKey: ["parcels"],
    queryFn: async () => {
      const res = await fetch("/api/parcels");
      const result = await res.json();
      return result.data || [];
    },
  });

  const { data: agentsData } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      const result = await res.json();
      const users = result.data || [];
      return users.filter((user) => user.role === "agent");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/parcels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Changes saved successfully!");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/parcels/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete parcel");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      toast.success("Parcel deleted successfully");
      document.getElementById("delete_modal").close();
    },
    onError: (err) => toast.error(err.message),
  });

  const openDeleteModal = (id) => {
    setSelectedParcelId(id);
    document.getElementById("delete_modal").showModal();
  };

  const handleUpdate = (id, field, value) => {
    let payload = { [field]: value };

    if (field === "assignedAgentId" && value) {
      const selectedAgent = agentsData?.find((agent) => agent._id === value);

      if (selectedAgent) {
        payload = {
          ...payload,
          agentEmail: selectedAgent.email,
          agentName: selectedAgent.name,
          status: "in-transit",
        };
      }
    }
    updateMutation.mutate({ id, data: payload });
  };

  const filteredParcels = parcelsData?.filter(
    (p) =>
      p.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiverInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (parcelsLoading)
    return (
      <div className="flex justify-center items-center min-h-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="space-y-6 max-w-350 mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">Shipment Control</h1>
          <p className="text-neutral text-sm">
            Assign agents and manage parcel lifecycles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 z-100"
              size={18}
            />
            <input
              type="text"
              placeholder="Search ID or Customer..."
              className="input input-bordered pl-10 w-full md:w-64 bg-base-100 border-base-300 rounded-full shadow focus:ring-2 focus:ring-primary/50 outline-none border-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-base-100 rounded-sm border border-base-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full border-separate border-spacing-0">
            <thead className="bg-base-200/50">
              <tr className="text-xs uppercase tracking-widest opacity-60">
                <th className="py-5 pl-8">Parcel Details</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Assigned Agent</th>
                <th>Date</th>
                <th className="pr-8 text-right text-base-content font-bold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredParcels?.map((parcel) => (
                <tr
                  key={parcel._id}
                  className="hover:bg-base-200/30 transition-colors"
                >
                  <td className="pl-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black text-xs">
                        ID
                      </div>
                      <div>
                        <p className="font-mono font-bold text-primary">
                          {parcel.trackingId}
                        </p>
                        <p className="text-[10px] flex items-center gap-1 opacity-50 uppercase font-bold">
                          <User size={10} />{" "}
                          {parcel.customerId?.name || "Guest"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-start gap-2 max-w-50">
                      <MapPin size={14} className="text-error mt-1 shrink-0" />
                      <span className="text-xs font-medium leading-relaxed italic opacity-70">
                        {parcel.receiverInfo?.address || "No Address Provided"}
                      </span>
                    </div>
                  </td>

                  <td>
                    <select
                      className={`select select-xs font-bold rounded-sm border-none outline-none ${
                        parcel.status === "delivered"
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : parcel.status === "pending"
                          ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                          : parcel.status === "cancelled"
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                      }`}
                      value={parcel.status}
                      onChange={(e) =>
                        handleUpdate(parcel._id, "status", e.target.value)
                      }
                      disabled={updateMutation.isPending}
                    >
                      <option value="pending">Pending</option>
                      <option value="picked">Picked Up</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <select
                        className="select select-xs font-bold rounded-sm border-none outline-primary/50 focus:ring-2 focus:ring-primary"
                        value={
                          parcel.assignedAgentId?._id ||
                          parcel.assignedAgentId ||
                          ""
                        }
                        onChange={(e) =>
                          handleUpdate(
                            parcel._id,
                            "assignedAgentId",
                            e.target.value || null
                          )
                        }
                        disabled={updateMutation.isPending}
                      >
                        <option value="">Unassigned</option>
                        {agentsData?.map((agent) => (
                          <option key={agent._id} value={agent._id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  <td className="text-xs opacity-60 font-medium">
                    {parcel.createdAt
                      ? format(new Date(parcel.createdAt), "MMM d, yyyy")
                      : "N/A"}
                  </td>

                  <td className="pr-8 text-right">
                    <div className="dropdown dropdown-left dropdown-end">
                      <label
                        tabIndex={0}
                        className="btn btn-ghost btn-xs btn-circle bg-base-200"
                      >
                        <MoreVertical size={16} />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-1 menu p-2 shadow-xl bg-base-100 rounded-2xl w-44 border border-base-200"
                      >
                        <li>
                          <Link
                            href={`/track/${parcel.trackingId}`}
                            className="flex items-center gap-2 text-sm py-3"
                          >
                            <Eye size={16} className="text-primary" /> View
                            Details
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => openDeleteModal(parcel._id)}
                            className="flex items-center gap-2 text-sm py-3 text-error"
                          >
                            <Trash2 size={16} /> Delete Parcel
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dialog
          id="delete_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box rounded-4xl p-8 text-center">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="font-black text-xl">Are you sure?</h3>
            <p className="py-4 opacity-60 text-sm">
              This action cannot be undone. This will permanently delete the
              parcel from your database.
            </p>
            <div className="modal-action flex justify-center gap-3">
              <button
                className="btn rounded-xl px-8"
                onClick={() => document.getElementById("delete_modal").close()}
              >
                Cancel
              </button>
              <button
                className="btn btn-error text-white rounded-xl px-8"
                onClick={() => deleteMutation.mutate(selectedParcelId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </dialog>

        {filteredParcels?.length === 0 && (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-xl font-bold opacity-30">No Parcels Found</p>
          </div>
        )}
      </div>
    </div>
  );
}
