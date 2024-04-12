import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  let response = NextResponse.next();
  response.headers.set("x-url", request.url);
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}
