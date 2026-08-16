import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "xyphoria_session";
const PRODUCTION_URL = "https://xyphoria.vercel.app";

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;

  // When running locally, immediately send the browser to the deployed site.
  // This keeps localhost/3000/3001/etc. out of the address bar for local runs.
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
    const productionUrl = new URL(PRODUCTION_URL);
    productionUrl.pathname = request.nextUrl.pathname;
    productionUrl.search = request.nextUrl.search;
    return NextResponse.redirect(productionUrl);
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-DNS-Prefetch-Control", "on");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};
