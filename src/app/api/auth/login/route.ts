import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import { verifyPassword, hashPassword } from "@/lib/auth-helper";
import { signJWT } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // 1. Auto-seed default admin if database is empty
    const adminCount = await Admin.countDocuments({});
    if (adminCount === 0) {
      const defaultHashedPassword = hashPassword("admin123");
      await Admin.create({
        username: "admin",
        password: defaultHashedPassword,
      });
      console.log("Database seeded with default admin credentials (username: admin, password: admin123)");
    }

    // 2. Parse request body
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // 3. Find administrator document
    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Verify password
    const isPasswordValid = verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 5. Generate JWT token (expires in 24 hours)
    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
    const token = await signJWT(
      {
        adminId: admin._id.toString(),
        username: admin.username,
      },
      jwtSecret
    );

    // 6. Save in httpOnly secure cookie (using async Next.js 15 cookies API)
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours in seconds
    });

    const isDefaultAdmin = username.toLowerCase() === "admin" && password === "admin123";

    return NextResponse.json({
      success: true,
      username: admin.username,
      isDefaultAdmin, // Flag to remind user to change default credentials
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json(
      { error: "Internal authentication error", details: errorMessage },
      { status: 500 }
    );
  }
}
