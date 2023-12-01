# node + typescript 적용하기 (프로젝트 구조 갖추기)

## 1. 초기세팅(back)

```
yarn init
yarn add typescript
```

- tsconfig.json 만들어서 초기설정

```
yarn add @types/node
```

- express 설치

```
yarn add express @types/express
```

    📍 node module에 export default 가 없으면 ?
    => ex) import * as express from "express";
     - asterisk(*) 사용해줘야함

    node module에 export default 가 있으면 ?
    => ex) import express from "express";

    📍 but !!
    근데 분명히 import express from "express"; 이모양을 보았을껀데... tsconfig.json에

    "esModuleInterop": true

    가 추가되어있기 때문임(왠만하면 쓰지마셈)

🟢 남의 라이브러리 가지고 올때는 굳이 타입 지정해놓지 말고(추론이 가능하기 때문), 본인이 변수선언 했을경우 타입을 지정해준다.

### ts node파일을 compile 없이 바로 실행시키는 방법(ts-node 라이브러리에서 자체 transpile 시키기)

- 다음 설치(개발용에서만)

```
yarn add -D ts-node
npx ts-node index.ts
```

❓ npx를 사용하는 이유?

    global 설치를 막기 위해서

❓ index.ts 라고 명시하는 이유?

    package.json에 기록이 남지 않아서

- cmd 창에서 다음 설정

```
SET NODE_ENV=development
SET PORT=3056
```

💨 ts 모듈은 개발용아니면 쓰는거 오바임 -> 배포시에는 무조건 compile 해야되기 때문

- 모듈 타입을 찾아주는 resolution

  ```
  npx tsc --traceResolution
  ```

  -> 여기서 타입찾는 순서를 보면 어떻게 타입을 덮어 씌울지 알수 있음

  > 참고 https://www.typescriptlang.org/docs/handbook/module-resolution.html#handbook-content

- 타입 모듈 설치

  ```
  ex) @types/express
  ```

  앞에 @types/ 를 붙여주고 추가 해주면 됨
