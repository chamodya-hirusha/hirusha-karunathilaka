import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import AdminOTP from "@/lib/models/AdminOTP";
import { signJWT } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // 1. Parse request body
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP code are required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.trim();

    // 2. Fetch the OTP record from the database
    const record = await AdminOTP.findOne({ email: trimmedEmail });
    if (!record) {
      return NextResponse.json(
        { error: "No active verification request found. Please request a new OTP." },
        { status: 400 }
      );
    }

    // 3. Verify OTP code match
    if (record.otp_code !== cleanOtp) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // 4. Verify OTP expiration window
    if (new Date() > record.expires_at) {
      await AdminOTP.deleteOne({ _id: record._id }); // Clean up expired record
      return NextResponse.json(
        { error: "Verification code has expired (5-minute limit). Please request a new OTP." },
        { status: 400 }
      );
    }

    // 5. Retrieve the Admin document
    const admin = await Admin.findOne({ username: trimmedEmail });
    if (!admin) {
      return NextResponse.json(
        { error: "Associated administrator account not found" },
        { status: 404 }
      );
    }

    // 6. OTP verified - Clean up database by removing the verified OTP record
    await AdminOTP.deleteOne({ _id: record._id });

    // 7. Sign the secure JWT authentication token (expires in 24 hours)
    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
    const token = await signJWT(
      {
        adminId: admin._id.toString(),
        username: admin.username,
      },
      jwtSecret
    );

    // 8. Save token in an HttpOnly secure cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    const isDefaultAdmin = trimmedEmail === "admin" || (trimmedEmail === "hiruniru99@gmail.com" && admin.password.includes("admin123"));

    return NextResponse.json({
      success: true,
      username: admin.username,
      isDefaultAdmin,
    });
  } catch (error: unknown) {
    console.error("VERIFY OTP ERROR DETAILS:", error);
    const errorMessage = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json(
      { error: "Internal verification error", details: errorMessage },
      { status: 500 }
    );
  }
}
