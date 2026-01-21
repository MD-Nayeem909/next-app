import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const allOrders = await Order.find({ status: "Paid" }).populate("productId");
  return NextResponse.json(allOrders);
}