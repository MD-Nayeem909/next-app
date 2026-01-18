import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();
    const { name, phone, address, image, password } = body;

    const updateData = {
      name,
      phone,
      address,
      image,
    };

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = updatedUser._doc;

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully!",
        user: userWithoutPassword,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
