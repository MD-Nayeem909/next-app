import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Parcel from "@/models/Parcel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// --- POST: Create Parcel ---
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Generate tracking ID
    const uniqueTrackingId =
      "TRK-" +
      Date.now().toString().slice(-6) +
      Math.random().toString(36).substring(2, 5).toUpperCase();

    const parcelData = {
      trackingId: uniqueTrackingId,
      senderInfo: {
        name: body.senderInfo?.name || session.user.name,
        email: body.senderInfo?.email || session.user.email,
        address: body.senderInfo?.address || "Not Provided",
        phone: body.senderInfo?.phone || "N/A",
      },
      receiverInfo: {
        name: body.receiverInfo?.name,
        address: body.receiverInfo?.address,
        phone: body.receiverInfo?.phone || "N/A",
      },
      description: body.description || "No description provided",
      weight: Number(body.weight) || 0,
      cost: Number(body.cost) || 0,
      customerId: session.user.id,
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          note: "Parcel request created",
          timestamp: new Date(),
        },
      ],
    };

    const parcel = await Parcel.create(parcelData);

    return NextResponse.json({ success: true, data: parcel }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create parcel" },
      { status: 500 }
    );
  }
}

// --- GET: Fetch Parcels Based on Role ---
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    let query = {};
    if (session.user.role === "customer") {
      query = { customerId: session.user.id };
    } else if (session.user.role === "agent") {
      query = { assignedAgentId: session.user.id };
    }

    // Admin sees all

    const parcels = await Parcel.find(query)
      .sort({ createdAt: -1 })
      .populate("assignedAgentId", "name email")
      .populate("customerId", "name email");

    return NextResponse.json({
      success: true,
      count: parcels.length,
      data: parcels,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
