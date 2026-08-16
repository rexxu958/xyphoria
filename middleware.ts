import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "xyphoria_session";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  response.headers.set("X-DNS-Prefetch-Control", "on");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
