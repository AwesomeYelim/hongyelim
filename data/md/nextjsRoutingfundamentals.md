# nextjs router 헷갈리는 부분 속성 정리

## 01. Private Folders

- next 프로젝트에서 간혹 `_app.tsx` 와 같은 앞에 `_`(underscore) 를 붙인 파일을 볼수가 있는데 이것은 routing 에서 제외시킨 `Private Folders` 라고 할수 있다.

- 이는 폴더가 비공개 구현 세부 사항이고, 라우팅 시스템에서 고려해서는 안 되므로 폴더와 모든 하위 폴더를 라우팅에서 제외함을 나타낸다고 보면된다.

## 02. layout 과 templete

- layout :

  - 레이아웃은 여러 페이지에서 공유되는 UI
  - 탐색 시 레이아웃은 상태를 유지하고, 다시 렌더링되지 않음
  - 레이아웃은 중첩 될 수도 있음

- templete :

  - 템플릿은 각 하위 레이아웃이나 페이지를 래핑한다는 점에서 레이아웃과 유사함

### 무엇이 다를까

- templete 은 경로 전반에 걸쳐 지속되고 상태를 유지하는 레이아웃과 달리 템플릿은 탐색 시 각 하위 항목에 대해 새 인스턴스를 만듬

- 아래와 같은 경우에 레이아웃보다 더 적합함
  1. `useEffect` 및 `useState` 에 의존하는 기능
  2. 기본 프레임워크 동작을 변경
  3. CSS, 애니메이션 라이브러리를 사용해서 애니메이션을 시작하거나 종료할 때

## 03. Linking and Navigating

### useRouter() hook

```ts
// useRouter
import { useRouter } from "next/navigation";

const router = useRouter();

router.push("/dashboard", { scroll: false });
```

- router 로 보는 `router.push` 와 `router.replace`의 차이

1. router.push : / -> /dashboard -> /main (뒤로가기시 이전페이지로 감)

2. router.replace : / -> /main (뒤로가기시 이전의 이전페이지로 감) => /dashboard 에 redirect 가 걸려있는경우 사용

## 04. Route Groups

- 폴더를 `(foldername)` (경로그룹) 으로 표시할 경우 경로 URL 에 포함되지 않는다.

![b_nextjsRoutingFundamentals4](./img/b_nextjsRoutingFundamentals4.png)

## 05. Dynamic Routes

### Catch-all Segments

- 대괄호 안에 `...`를 추가하면 동적 세그먼트를 모든 후속 세그먼트 로 확장할 수 있다. `[...folderName]`

![b_nextjsRoutingFundamentals48](./img/b_nextjsRoutingFundamentals48.png)

### Optional Catch-all Segments

- 이중 대괄호 안에 매개변수를 포함하여 포괄 세그먼트를 선택사항으로 만들 수 있다. `[[...folderName]]`

#### Catch-all Segments 와 Optional Catch-all Segments 의 차이점

- `Optional Catch-all Segments`을 사용하면 매개변수가 없는 경로도 일치하게 된다.

![b_nextjsRoutingFundamentals13](./img/b_nextjsRoutingFundamentals13.png)

## 06. Parallel Routes

- 병렬 라우팅을 사용하면 동일한 레이아웃에서 하나 이상의 페이지를 동시에 또는 조건부로 렌더링할 수 있다.

![b_nextjsRoutingFundamentals27](./img/b_nextjsRoutingFundamentals27.png)

- 경로가 독립적으로 스트리밍될 때 각 경로에 대해 독립적인 오류 및 로드 상태를 정의할 수 있다.

![b_nextjsRoutingFundamentals23](./img/b_nextjsRoutingFundamentals23.png)

### Conditional Routes

- 다음과 같이 병렬 경로를 사용하여 조건부 라우팅을 구현할 수 있다. `@login` or `@dashboard`

```ts
import { getUser } from "@/lib/auth";

export default function Layout({ dashboard, login }: { dashboard: React.ReactNode; login: React.ReactNode }) {
  const isLoggedIn = getUser();
  return isLoggedIn ? dashboard : login;
}
```

## 07. Intercepting Routes

- 경로를 가로채면 현재 레이아웃 내 애플리케이션의 다른 부분에서 경로를 로드할 수 있다.

### convention

- 경로 차단은 규칙은 `(..)`을 사용하여 정의할 수 있다.

- (.) : 동일한 수준 의 세그먼트를 일치
- (..) : 한 수준 위의 세그먼트와 일치
- (..)(..) : 두 수준 위의 세그먼트와 일치
- (...) : 루트 app 디렉터리 의 세그먼트를 일치

![b_nextjsRoutingFundamentals3](./img/b_nextjsRoutingFundamentals3.png)

## 08. Route Handlers

### URL Query Parameters

- Route Handler에 전달된 요청 객체는 쿼리 매개변수를 더 쉽게 처리할 수 있도록 한다.

```ts
import { type NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  // query is "hello" for /api/search?query=hello
}
```
