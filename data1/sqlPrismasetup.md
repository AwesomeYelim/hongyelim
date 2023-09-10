# basic Model setup

- 자 이제 아래의 파일에 스키마를 작성해주자.

> schema.prisma

```prisma
generator client {
  provider = "prisma-client-js" // 기본값
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id  Int  @id @default(autoincrement()) // 기본값으로 자동 증분값이 설정됨
  name String
}
```

- 그리고 나서 db에 migration 해줘야 함(migration 할때마다 prisma-client가 업데이트가 된다)

```sh
npx prisma migrate dev // 개발환경에서 마이그레이션을 추진할것이라는 것을 의미함

npx prisma migrate dev --name init // init 이라는 이름을 설정할 수도 있음
```

- client 라이브러리를 설치하여 client 생성

```sh
yarn add @prisma/client
```

- 만약 client 를 수동으로 재생성 해야하는 경우

```sh
npx prisma generate
```

- workbench 로도 확인 할 수 있지만 prisma 에서는 prisma studio 라는 더좋은 ui 환경을 제공 해 준다.

```sh
npx prisma studio
```

------------- 처음 시작일 경우에는 script.ts 파일을 하나 연동해보자

```ts
// script.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // 인스턴스를 하나만 사용하고 여러개 만들지 않는다..

async function main() {
  const user1 = await prisma.user.create({ data: { name: "yelim" } });
  console.log(user1); // 생성된 하나의 user 만 표기됨

  const everyuser = await prisma.user.findMany();
  console.log(everyuser); // 모든 users 표기
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- 터미널에 다음과 같이 입력

```sh
yarn nodemon script.ts
```

## 선수지식..

### 생성기 & data source 를 먼저 살펴보자

```prisma
// schema.prisma

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
} // 단일 데이터 소스만 가질 수 있음 ->  why ? prisma 가 데이터소스와 직접 연결하기 때문

// 따라서, 모든 데이터를 정의하는 데이터 베이스는 하나만 가질 수 있음

// 데이터 원본은 하나만 있고 사용중인 (원본 이름의)데이터 베이스의 공급자가 있어야함
```

### model

> model ?
> 데이터를 저장할 수 있는 데이터 베이스내의 다양한 테이블을 나타냄

```prisma
model User {
  id  Int  @id @default(autoincrement()) //  field example
  name String
}

```

- field는 네가지 부분으로 구성이됨

```
  1. id (required)
  2. Int (required)
  3. @id (optional)
  4. @default(autoincrement()) (optional)
```

- 2번에 들어갈수 있는 타입(모든 db가 공통적으로 지원하는건 아님)

  Int, String, Boolean, Float(소수점), Decimal, BigInt, DateTime, Json, Bytes, UnsupportedType

- 만약에 관계형을 만들고 싶다면

```prisma
model User {
  id  Int  @id @default(autoincrement())
  name String
}
model post {
  autor User // 이러고 저장시 관계형 데이터가 명시됨
}
```

↓

```prisma
model User {
  id  Int  @id @default(autoincrement())
  name String
}
model post {
  userId     Int
  autor User @relation(fields: [userId], references: [id])
} // fields는 post 테이블 내부의 필드를 참조함 => 외래키 관계와 같다
```

### 여러 관계형

#### 일대다, 다대다..

- 1 명의 user 가 하나의 참조로 여러 게시물을 가짐

```prisma
model User {
  id  Int  @id @default(autoincrement())
  name String
  post Post[]
}
model post {
  userId     Int
  autor User @relation(fields: [userId], references: [id])
}
```

- 1 명의 user 가 두개의 참조로 여러 게시물을 가짐

```prisma
model User {
  id  Int  @id @default(autoincrement())
  name String
  writtenPosts Post[]
  favoritePosts Post[]
}
model post {
  userId     Int
  autor User @relation(fields: [userId], references: [id])
}
```

- 나는 아래와 같은 구조로 구성하였다.

```prisma
generator client {
  provider = "prisma-client-js" // 기본값
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  age           Int
  createdAt     DateTime  @default(now())
  email         String    @unique
  name          String?
  role          user_role @default(USER)
  comment       Comment[]
  writtenPosts  Post[]    @relation("WrittenPosts")
  favoritePosts Post[]    @relation("FavoritePosts")

  @@unique([email, age]) // 고유성에 대한 블록 수준 속성(email과 age 에 대한 고유성 제약 조건이 있어야함)
  @@index([createdAt]) // 생성시간에 따른 index를 보유함 정렬같은것을 할때 참조 가능하다
}

model Post {
  id         String     @id @default(uuid())
  title      String
  content    String
  image      String?
  tags       String?
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  categories Category[]
  commented  Comment[]

  authorId String
  author   User   @relation("WrittenPosts", fields: [authorId], references: [id])

  favoriteById String?
  favoriteBy   User?   @relation("FavoritePosts", fields: [favoriteById], references: [id])
}

model Category {
  id    String @id @default(uuid())
  name  String @unique
  posts Post[]
}

model Comment {
  id        String   @id @default(uuid())
  img       String
  content   String
  createdAt DateTime @default(now())
  User      User?    @relation(fields: [userId], references: [id])
  userId    String?
  Post      Post?    @relation(fields: [postId], references: [id])
  postId    String?

  @@index([postId])
  @@index([userId])
}

enum user_role {
  USER
  ADMIN
}

```

- 그 다음 migration 해줌

```sh
npx prisma migrate dev
```
