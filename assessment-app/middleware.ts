import { auth } from "@/auth";

export default auth((req) => {
  if (
    !req.auth &&
    req.nextUrl.pathname !== "/login" &&
    !req.nextUrl.pathname.startsWith("/_next") &&
    !req.nextUrl.pathname.startsWith("/favicon") &&
    !req.nextUrl.pathname.startsWith("/api")
  ) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  } else if (req.auth && req.nextUrl.pathname === "/login") {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
