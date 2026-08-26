import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

/* -------------------------------------------------------------------------- *
 * Domain ↔ route group mapping
 * -------------------------------------------------------------------------- */

type DomainGroup = "sso" | "calendar";

const AUTH_PATHS = [
  "/login",
  "/register",
  "/callback",
  "/verify-email",
  "/mfa-validate",
  "/mfa-setup",
  "/mfa-recovery",
  "/cli-auth",
];
const PLATFORM_PATHS = ["/calendar"];

function detectGroup(host: string): DomainGroup {
  const hostname = host.split(":")[0];
  if (hostname.startsWith("sso.")) return "sso";
  return "calendar";
}

function getDomainForGroup(group: DomainGroup, currentUrl: URL): string {
  const extension = IS_DEVELOPMENT ? "localhost" : "com";
  const subdomain = group === "sso" ? "sso" : "calendar";
  return `${currentUrl.protocol}//${subdomain}.skygenesisenterprise.${extension}`;
}

function getTargetGroup(pathname: string): DomainGroup | null {
  if (AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return "sso";
  if (PLATFORM_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return "calendar";
  return null;
}

/* -------------------------------------------------------------------------- *
 * Auth helpers
 * -------------------------------------------------------------------------- */

const REFRESH_COOKIE = "aether_calendar_refresh";
const ACCESS_TOKEN_COOKIE = "aether_calendar_access_token";

function isAuthCookiePresent(request: NextRequest): boolean {
  const refresh = request.cookies.get(REFRESH_COOKIE);
  const access = request.cookies.get(ACCESS_TOKEN_COOKIE);
  return Boolean(
    (refresh?.value && refresh.value.length > 0) || (access?.value && access.value.length > 0)
  );
}

/* -------------------------------------------------------------------------- *
 * Middleware entry
 * -------------------------------------------------------------------------- */

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || request.nextUrl.hostname;
  const currentGroup = detectGroup(host);
  const isAuthenticated = isAuthCookiePresent(request);

  /* ---- Root path: authenticated → calendar, otherwise → login ---- */
  if (pathname === "/" || pathname === "") {
    const target = isAuthenticated ? "/calendar" : "/login";
    const targetGroup: DomainGroup = isAuthenticated ? "calendar" : "sso";
    return NextResponse.redirect(new URL(target, getDomainForGroup(targetGroup, request.nextUrl)));
  }

  /* ---- Cross-domain routing: auth routes on sso.*, platform on calendar.* ---- */
  const targetGroup = getTargetGroup(pathname);
  if (targetGroup && targetGroup !== currentGroup) {
    return NextResponse.redirect(
      new URL(pathname, getDomainForGroup(targetGroup, request.nextUrl))
    );
  }

  /* ---- SSO domain: auth routes only ---- */
  if (currentGroup === "sso") {
    // Authenticated users don't belong on the login page.
    if (isAuthenticated && pathname === "/login") {
      return NextResponse.redirect(
        new URL("/calendar", getDomainForGroup("calendar", request.nextUrl))
      );
    }
    return NextResponse.next();
  }

  /* ---- Calendar domain: platform routes require authentication ---- */
  if (PLATFORM_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (isAuthenticated) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", getDomainForGroup("sso", request.nextUrl)));
  }

  /* ---- Anything else on the calendar domain → the calendar ---- */
  return NextResponse.redirect(
    new URL("/calendar", getDomainForGroup("calendar", request.nextUrl))
  );
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|health).*)"],
};
