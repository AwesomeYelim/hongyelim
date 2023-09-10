# node + typescript 적용하기 (프로젝트 구조 갖추기)

## 3. sequelize

📍 MySql 설치 되어있어야함

```
yarn add sequelize mysql2
yarn add sequelize-cli
npx sequelize init
(초기화 진행해야 config, migration 등의 폴더들이 먼저 구축됨)
```

- config.json => config.js 으로 변경시켜줌
- 다음과 같이 db를 생성해준다

```
npx sequelize db:create
```

- config.js -> config.ts 로 변경

### model/ 에서 순환 참조 방지하기

📍 순환참조(Circular reference)란 ?

※ 참조하는 대상이 서로 물려 있어 참조할 수 없게 되는 현상을 말한다(양방향성).

📍 순환참조를 하게 되면 무슨 문제 ?

- runtime시 -> 순환 참조일때 두 모듈중 하나가 빈객체 ({})로 처리되어 문제가 발생함

📍 순환참조 방지하는 법

- models 폴더에 있는 index.js 를 index.ts 로 변경후 안에있는 내용 삭제 후 sequelize.ts 생성 index.ts에 import(import 함과 동시에 export) 시킴

- index, sequelize, user 의 순환참조(typescript에서는 에러가 잡히지 않아도 runtime시에는 오류발생)를 방지하기 위해 sequelize.ts 를 만들어 파일을 관리함
- sequelize.ts 를 따로 뺴서 일방향 참조를 하게되면 순환참조를 방지할수 있다.

### `key[value]` error type assertion 사용하지 않고 잡는법

- sequelize.ts에 다음과 같은 에러가 발생
  <img src='./img/key[value] error.png' width='300px'/>

- 각기 다른 key에 value 가 할당 되다보니 ts 모듈에서 인식을 못한거임
  => config.ts 파일에서 타입 지정 및 을 해주면 됨

- 기존 파일

```ts
import * as dotenv from "dotenv";

dotenv.config();

export default {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "react-nodebird",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "react-nodebird",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "react-nodebird",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
```

- 타입 명시된 파일

```ts
import * as dotenv from "dotenv";

dotenv.config();

type Config = {
  username: string;
  password: string;
  database: string;
  host: string;
  [key: string]: string;
};

interface IConfigGroup {
  development: Config;
  test: Config;
  production: Config;
}
const config: IConfigGroup = {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD!,
    database: "react-nodebird",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD!,
    database: "react-nodebird",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD!,
    database: "react-nodebird",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

export default config;
```
