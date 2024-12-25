import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token") || localStorage.getItem("token");

  // Jika tidak ada token, redirect ke login
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Simulasi validasi role dari token (ganti dengan implementasi decode JWT Anda)
  const userRole = "CUSTOMER"; // Ganti dengan hasil decode token JWT

  // Proteksi berdasarkan role
  if (req.nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/customer") && userRole !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"], // Middleware berlaku untuk halaman admin dan customer
};
