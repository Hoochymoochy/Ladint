import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

function isAdminLoginPath(pathname: string) {
  return pathname === "/admin/login" || pathname === "/en/admin/login";
}

function isAdminPagePath(pathname: string) {
  return (
    (pathname === "/admin" || pathname.startsWith("/admin/")) ||
    (pathname === "/en/admin" || pathname.startsWith("/en/admin/"))
  );
}

/** Public write endpoints that must stay open without admin auth. */
function isPublicApi(pathname: string, method: string) {
  if (pathname === "/api/auth/login" && method === "POST") return true;
  if (pathname === "/api/auth/logout" && method === "POST") return true;
  if (pathname === "/api/apply" && method === "POST") return true;
  if (pathname === "/api/newsletter/subscribe" && method === "POST") return true;
  return false;
}

/** Sensitive reads / all mutations under /api require admin auth. */
function requiresAdminApiAuth(pathname: string, method: string) {
  if (!pathname.startsWith("/api/")) return false;
  if (isPublicApi(pathname, method)) return false;

  if (method !== "GET" && method !== "HEAD") return true;

  // Sensitive GETs used only by the admin panel
  if (pathname.startsWith("/api/apply")) return true;
  if (pathname.startsWith("/api/newsletter/subscribers")) return true;
  if (pathname.startsWith("/api/upload")) return true;

  return false;
}

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  if (isAdminLoginPath(pathname)) {
    if (await isAuthenticated(request)) {
      const dest = pathname.startsWith("/en/") ? "/en/admin" : "/admin";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  if (isAdminPagePath(pathname)) {
    if (!(await isAuthenticated(request))) {
      const loginPath = pathname.startsWith("/en/") ? "/en/admin/login" : "/admin/login";
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (requiresAdminApiAuth(pathname, method)) {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json(
        { success: false, error: "Não autorizado." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/en/admin/:path*", "/api/:path*"],
};
