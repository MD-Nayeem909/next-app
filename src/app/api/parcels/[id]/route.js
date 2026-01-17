import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Parcel from "@/models/Parcel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = await params;

    // Try to find by ID first, then by tracking ID
    let parcel = null;

    if (id.length === 24) {
      parcel = await Parcel.findById(id)
        .populate("assignedAgentId", "name email")
        .populate("customerId", "name email");
    }

    if (!parcel) {
      parcel = await Parcel.findOne({ trackingId: id })
        .populate("assignedAgentId", "name email")
        .populate("customerId", "name email");
    }

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: parcel });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = session.user;
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    // Agent can update status
    if (user.role === "agent") {
      if (parcel.assignedAgentId?.toString() !== user.id) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }
      if (body.status) {
        parcel.status = body.status;
        parcel.statusHistory.push({
          status: body.status,
          note: body.note || `Status updated to ${body.status}`,
          timestamp: new Date(),
        });
      }
    }

    // Admin can assign agent and update status
    else if (user.role === "admin") {
      if (body.assignedAgentId !== undefined) {
        parcel.assignedAgentId = body.assignedAgentId || null;
        parcel.statusHistory.push({
          status: parcel.status,
          note: body.assignedAgentId ? "New agent assigned" : "Agent removed",
          timestamp: new Date(),
        });
      }
      if (body.status) {
        parcel.status = body.status;
        parcel.statusHistory.push({
          status: body.status,
          note: body.note || `Status updated by admin`,
          timestamp: new Date(),
        });
      }
    } else {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await parcel.save();
    return NextResponse.json({ success: true, data: parcel });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = session.user;
    await dbConnect();
    const { id } = await params;
    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }
    if (user.role === "admin") {
      await parcel.deleteOne();
      return NextResponse.json({ success: true, message: "Parcel deleted" });
    } else {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
