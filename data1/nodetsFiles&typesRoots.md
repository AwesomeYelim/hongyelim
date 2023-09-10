# node + typescript 적용하기 (typescript 적용하기)

## files와 typesRoots 옵션

📍 타입 추론이 불가한 경우 ex ) toJSON

- user.ts file에서 이러한 에러를 발견하게 되는데..
  <img src='./img/toJSONerror.png' width='300px'/>

- user 정의를 따라가 보면 global User가 다음과 같은 빈 객체가 나오므로 (기존 만들어 놓은 User를 따라가지 않고) => typeerror 가 발생되는 것이다..
  <img src='./img/userType.png' width='300px'/>
  💨 declaration merging : namespace와 interface의 확장

🟢 해결방법

1. compile 할 file을 tsconfig.json 에서 지정해준다.(확장)

```json
"files": ["./index.ts", "./types/index.ts"]
```

🚩 files 는 컴파일할 파일을 지정하는 옵션이지 타이핑을 지정하는 옵션이 아님

- index.ts 에 import 되어있는 애들은 다 compile 시켜줌
- ./types/index.ts 다음 경로에 다음과 같이적어줌

```ts
import User from "../models/user"; // import 나 export가 있어야함

declare global {
  namespace Express {
    interface Request {
      user?: User; // 확장대상과 identifier(식별자) 모양을 맞춰줘야하기 때문에 'user: User | undefined;' 이 아닌 'user?:' 이런식으로 들어가야함
    }
  }
}
```

- 만약 import 를 사용하지 않은 다음과 같은경우는 이런식으로 임의적으로 export/import 문을 사용해준다

```ts
export {}; //fake..

declare global {
  namespace Express {
    interface Request {
      user: { name: "yelim" };
    }
  }
}
```

- ❓ why
  global 을 admintation 할때에는 external(외부의) / ambient(주변의) 모듈 선언에만 직접 중첩될수 있기 때문이다

- 하지만 되지 않았다..compilerOptions 안에 typeRoots를 지정해주었더니 여전히 에러는 뜨지만 타입으로 인식하기 시작함

```json
 "compilerOptions": {
    "typeRoots": ["./types"]
  }
```

  <img src='./img/typeRoots.png' width='300px'/>

- 그렇다면 기존 ./types/index.ts 파일을 index.d.ts 로 변경해주고 namespace module을 확장 하기보다는 ambient module로 만들어 주자

```ts
import User from "../models/user";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
```

🚩 패키지 마다 적합한 확장방법이 달라서 처음에는 맨위와 같이 global 로 확장을 시도해보고 안되면 ambient module 로 새롭게 파자...

- 추가 되는 모듈은 기본 만들어진 index.d.ts 에 추가 해주면됨
