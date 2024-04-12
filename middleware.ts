import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: auth.request });
  response.headers.set("x-url", request.url);
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}
