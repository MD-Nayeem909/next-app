import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, price } = await req.json();

    const newOrder = await Order.create({
      userId: session.user.id,
      productId,
      price,
    });

    return NextResponse.json({
      message: "Order placed!",
      orderId: newOrder._id,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
