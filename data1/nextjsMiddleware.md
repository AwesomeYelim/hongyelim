### middleware 만들기

- 최상위 경로에 위치 -> 해당되는 페이지를 보여줄수 있음
- src 최상위 폴더에 만들어야함
- request 를 파라미터로 받아 특정 경로에 한해서 redirect 시킬수도 있음

  - redirect

  ```js
  export function middleware(request: NextRequest) {
    console.log("middleware 가 실행되고 있음! 체크중");
    if (request.nextUrl.pathname.startsWith("/products/1004")) {
      console.log("middleware 경로를 redirect 함");
      return NextResponse.redirect(new URL("products", request.url));
    }
  }
  ```

  - matcher

  ```js
  // 제품 경로에 한에서만 middleware 실행함
  export const config = {
    matcher: ["/products/:path"],
  };
  ```
