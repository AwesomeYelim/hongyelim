import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // console.log("실행됩니까>?");
  let cookie = request.cookies.get("theme");
  // document.body.setAttribute("data-theme", cookie?.value as string);
  // console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
  // const allCookies = request.cookies.getAll();
  // console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  // request.cookies.has("nextjs"); // => true
  // request.cookies.delete("nextjs");
  // request.cookies.has("nextjs"); // => false

  // // Setting cookies on the response using the `ResponseCookies` API
  // const response = NextResponse.next();
  // response.cookies.set("vercel", "fast");
  // response.cookies.set({
  //   name: "vercel",
  //   value: "fast",
  //   path: "/",
  // });
  // cookie = response.cookies.get("vercel");
  // console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
  // // The outgoing response will have a `Set-Cookie:vercel=fast;path=/test` header.
  // const orgin = request.headers.get("orgin");
  // console.log(origin);

  return NextResponse.next();
}

// export const config = {
//   matcher: "/about/:path*",
// };