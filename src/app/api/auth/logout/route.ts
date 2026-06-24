import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear the admin_token cookie by setting maxAge to 0
    cookieStore.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Immediately expires the cookie
    });

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Logout failed";
    return NextResponse.json(
      { error: "Internal logout error", details: errorMessage },
      { status: 500 }
    );
  }
}
