import { type NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { languages as appLanguages } from "@/languages";

const headers = { "accept-language": "en-US" };
const languages = new Negotiator({ headers }).languages();

const DEFAULT_LOCALE = "en-US";

match(languages, appLanguages, DEFAULT_LOCALE);

export async function proxy(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set("x-current-path", req.nextUrl.pathname);

  const cookieLanguage = req.cookies.get("language")?.value;

  const browserLanguage =
    req.headers.get("accept-language")?.split(",")[0] ?? "en";

  const language =
    appLanguages.find((lang) => lang.startsWith(cookieLanguage ?? "")) ??
    appLanguages.find((lang) => lang.startsWith(browserLanguage)) ??
    DEFAULT_LOCALE;

  const { pathname } = req.nextUrl;
  const pathnameHasLocale = appLanguages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    req.nextUrl.pathname = `/${language}${pathname}`;
    return NextResponse.redirect(req.nextUrl);
  }

  const res = NextResponse.next({ headers });
  res.cookies.set("language", language, { path: "/" });

  return res;
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
