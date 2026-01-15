"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function DashboardPage() {
  const { data: authData } = useQuery({ queryKey: ["auth"] });
  const user = authData?.user;

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">Role</h2>
            <p className="capitalize text-2xl">{user.role}</p>
          </div>
        </div>

        {user.role === "customer" && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Action</h2>
              <p>Ready to send a package?</p>
              <div className="card-actions justify-end">
                <Link
                  href="/dashboard/customer/create"
                  className="btn btn-primary"
                >
                  Create Parcel
                </Link>
              </div>
            </div>
          </div>
        )}

        {user.role === "agent" && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Status</h2>
              <p>Check your assigned deliveries.</p>
              <div className="card-actions justify-end">
                <Link href="/dashboard/agent" className="btn btn-primary">
                  View Tasks
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
