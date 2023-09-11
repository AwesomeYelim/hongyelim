# 단순 스크립트 생성시

> github action 을 통해 다른 repo에 있는 md 파일과 동기화에 성공후 md파일을 기반한 firebase에 data 객체도 동기화 시킬수 없을까 하는생각으로 우선 테스트용 스크립트 파일을 만들었다.

```ts
import { db } from "@/app/firebase";
import { doc, setDoc } from "firebase/firestore";

async function test() {
  console.log("실행됩니까>?");

  const postData = doc(db, "posts", "test");

  await setDoc(postData, {
    id: 10,
    title: "test",
    content: "test",
    post_title: "test",
    heart: {},
    heart_count: 0,
    created_at: Math.floor(new Date().getTime() / 1000),
    comments: [],
  });
}

test();
```

- 하지만 다음과 같은 에러가 발목을 잡네..

```sh
"Error: Cannot find module '@/app/firebase'"
```

- 다음 오류 메시지는 @/app/firebase 모듈이 올바르게 확인되지 않음을 나타낸다.

- 표준 Node.js/CommonJS 모듈 가져오기 구문이 아닌 "@" 접두사가 있는 상대 경로를 사용하고 있는 것 같다.

- 이 문제를 해결하려면 "@" 접두사가 없는 상대 경로를 사용하거나 firebase 모듈에 대한 올바른 경로를 지정해야 한다.

- 그래서 이부분을 다음과 같이 상대경로로 수정해주었더니 성공,,,

```ts
// import { db } from "@/app/firebase";
import { db } from "./firebase";
```
