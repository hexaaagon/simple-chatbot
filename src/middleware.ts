import { NextRequest } from "next/server";
import { createClient } from "./lib/supabase/middleware";

export function middleware(req: NextRequest) {
  return createClient(req);
}

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|static|favicon.ico|robots.txt).*)",
};
