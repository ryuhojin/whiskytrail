import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로그인 상태에서 접근하면 안되는 페이지 경로
  const protectedPaths = ["/login", "/signup"];
  // 쿠키에서 refreshToken 값을 읽음
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // 사용자가 로그인 상태면 protectedPaths에 해당하는 경우 대시보드로 리디렉션
  if (refreshToken && protectedPaths.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 (예시로 모든 요청에 대해 실행)
export const config = {
  matcher: ["/login", "/signup"],
};
