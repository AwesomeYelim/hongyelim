# node 타입 분석

- 먼저 다음을 설치한다.

```sh
yarn add fs http path
yarn add -D @types/node
```

#### 다음과 같이 타이핑 해준다.

```ts
import fs = require("fs");
import http = require("http");
import path = require("path");

http
  .createServer((req, res) => {
    const id = setTimeout(() => {
      console.log("hello");
    }, 1000);

    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200);
      res.end(data);
    });
  })
  .listen(8080, () => {
    console.log("서버 시작쓰~");
  });
```

### 다음 setTimeout 을 비교하여 보자

```ts
const id = setTimeout(() => {
  console.log("hello");
}, 1000); // 1. node에서 setTimeout 의 return 값은 id

window.setTimeout(() => {}, 1000); // 2. 일반 setTimeout 의 return 값은 number
```

- type을 쫒아가 보면 2번은 dom 접근은 목적으로 하는 type을 가지는것을 알 수 있다.

```ts
// 1. timers.d.ts
function setTimeout<TArgs extends any[]>(
  callback: (...args: TArgs) => void,
  ms?: number,
  ...args: TArgs
): NodeJS.Timeout;

namespace NodeJS {
  interface Timer extends RefCounted {
    hasRef(): boolean;
    refresh(): this;
    [Symbol.toPrimitive](): number;
  }
  class Timeout implements Timer {
    ref(): this;
    unref(): this;
    hasRef(): boolean;
    refresh(): this;
    [Symbol.toPrimitive](): number;
  }
}

// 2. lib.dom.d.ts
interface WindowOrWorkerGlobalScope {
  setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
}
```

### fs type 분석을 해보자

- fs 타입을 따라서 가보면 다음과 같은 모양을 발견할 수 있다.

  ```ts
  declare module "fs" {}
  ```

  이와 같이 타입 선언만 있고 구현이 없는 것을 `ambient` 라고 한다

- ❓ `declare..` 나 `declare namespace..` 는 많이 보았는데 `declare module..` 은 무엇일까 ?

  `앰비언트(ambient) 모듈` 이라고 하는 `declare module..`은 특정 모듈에 대한 타이핑을 해준다.

- 그러면 이전에 jquery 나 react 같은 라이브러리의 type 은?

  하나의 pakage 가 하나의 library를 담당했기 때문에 `declare..` 나 `declare namespace..` 로 선언이 되어있었던 것임

  types/node 에는 fs, http, path 등등 여러가지 pakage들이 짬뽕되어있기에 .. `declare module..` 사용해주어야 서로 상호가능한 경계가 형성 가능함

- 📍 다음과 같은 모양은 `fs` 전체를 불러와서 그대로 다 export 해라라는 의미임

  ```ts
  declare module "node:fs" {
    export * from "fs";
  }
  ```

  사실 node에서도 node의 명시성을 나타내기 위해 다음과 같은 import 방식을 권장한다

  ```ts
  import fs = require("node:fs");
  import http = require("node:http");
  import path = require("node:path");
  ```

## methods 하나하나 분석

- [다음](#다음과-같이-타이핑-해준다)타이핑을 살펴보자

- 먼저 `createServer` 의 type을 봐보면.. 다음과 같이 overloading 되어있는것을 알 수 있다.

```ts
function createServer<
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse
>(requestListener?: RequestListener<Request, Response>): Server<Request, Response>; // 1

function createServer<
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse
>(
  options: ServerOptions<Request, Response>,
  requestListener?: RequestListener<Request, Response>
): Server<Request, Response>; // 2
```

- 우리가 [사용한것](#다음과-같이-타이핑-해준다)은 options을 사용하지 않음으로 1 type 에 걸려 있는걸 알수 있다.

## exports 분석

- exports를 보면 다음과 같이 여러 타입설정이 되어있다.

```ts
declare var exports: any;

interface Module {
  exports: any;
}
```

- 그래서 다음과 같이 여러 형태로 exports 가능

```ts
import fs from "fs";
import http from "http";
import path from "path";

const server = http
  .createServer((req, res) => {
    const id = setTimeout(() => {
      console.log("hello");
    }, 1000); // node에서 setTimeout 의 return 값은 id

    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200);
      res.end(data);
    });
  })
  .listen(8080, () => {
    console.log("서버 시작쓰~");
  });

exports = server;
module.exports = server;
```

# express 타입 분석

- npm 홈페이지 가보면 express는 dt 로 되어있음

<img src="./img/express.png" width="400px" />

```sh
yarn add express -D @types/express
```

- express 의 index.d.ts 를 가보면 다음을 보고 commonjs 임을 유추할수 있음(default exports / named exports(이름 못바꿈) 함께구분)

```ts
export = e;
```

- 핵심 부분은 여기임

```ts
import * as serveStatic from "serve-static";
import * as core from "express-serve-static-core";
```

- ❓ 왜 핵심부분을 나눠놨을까

  `express-serve-static-core` 여기에 들어가 보면 다음과 같은 메세지를 볼수 있는데..

```ts
// This extracts the core definitions from express to prevent a circular dependency between express and serve-static
```

- express 와 serve-static 간에 순환참조(circular dependency)가 일어나서 나누었다는것을 알 수 있다.

- 또한 이렇게 declare - namespace 꼴로 되어있는 빈객체를 볼수 있는데...이런것들은 어느정도 커스텀할수 있도록 열어놨다고 보면된다.

```ts
declare global {
  namespace Express {
    interface Request {}
    interface Response {}
    interface Locals {}
    interface Application {}
  }
}
```

- 대신 확장해서 쓸때는 같은 구조로 써줘야지 error 가 나질 않는다

```ts
declare global {
  namespace Express {
    export interface Request {
      name: "yelim";
    }
    export interface Response {
      name: "zzang";
    }
  }
}

// 자동 추론됨
const middle: RequestHandler = (req, res, next) => {
  req.name;
};
```

- middleware

```ts
/** 미들웨어는 RequestHandler 타입이다. - 문맥적 추론 o */
app.get("/", (req, res) => {});

/** 이런식으로 바깥으로 뺀다면 문맥적 추론 x */
const middle = (req, res) => {};
app.get("/", middle);

app.use((err, req, res, next) => {
  console.log(err);
});
```

- 다음을 설치한다(설치할때마다 req. ~~ 으로 추가됨)

```ts
const middle: RequestHandler = (req, res, next) => {
  req.name;
  req.cookies;
  req.user;
  req.session;
};
```

```sh
yarn add cookie-parser express-session passport passport-local

yarn add @types/cookie-parser @types/express-session @types/passport @types/passport-local
```
