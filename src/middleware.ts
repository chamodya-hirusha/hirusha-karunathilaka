import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;

  // 1. Detect if the request is for an admin page
  const isDashboardRoute = pathname.startsWith("/admin/dashboard");

  // 2. Detect if the request is for a protected modifying API route or upload route
  // GET (projects list) and PATCH (view increment) are public
  const isProjectApiRoute = pathname.startsWith("/api/projects");
  const isProfileApiRoute = pathname.startsWith("/api/profile");
  const isUploadRoute = pathname.startsWith("/api/upload");
  const isModifyingApiMethod = ["POST", "PUT", "DELETE"].includes(method);
  const isProtectedApiRoute = 
    (isProjectApiRoute && isModifyingApiMethod) || 
    (isProfileApiRoute && isModifyingApiMethod) || 
    isUploadRoute;

  // If route protection is required
  if (isDashboardRoute || isProtectedApiRoute) {
    const token = request.cookies.get("admin_token")?.value;

    // A. Handle missing token
    if (!token) {
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: "Unauthorized: Access token is missing" },
          { status: 401 }
        );
      }
      // Redirect dashboard requests to login
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // B. Verify token validity
    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
    const payload = await verifyJWT(token, jwtSecret);

    // C. Handle invalid/expired token
    if (!payload) {
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or expired session token" },
          { status: 401 }
        );
      }
      // Redirect dashboard requests to login and clear the invalid cookie
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

// Intercept dashboard page routes, project API paths, and upload path
export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/projects/:path*", "/api/upload", "/api/profile"],
};
