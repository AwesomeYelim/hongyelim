# Client Create Operations

## CRUD 이전 prisma 에 대해 이해해야할 몇가지들..

```ts
// script.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // 실제로 다양한 연결을 관리한다, db가 최대 5개의 동시연결을 지원하는 경우 PrismaClient 는 해당 5개의 연결을 모두처리함 ㄷ ㄷ

// 인스턴스를 하나만 사용하고 여러개 만들지 않는다.. => 여러개 생성시 너무 많은 연결로 정체될수 있음

async function main() {
  await prisma.user.deleteMany();
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 여러가지 메서드

- 일반적으로 get을 받을때 findMany 메서드를 사용한다.

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const comment = await prisma.comment.findMany();
    const post = await prisma.post.findMany();
    const user = await prisma.user.findMany();
    const category = await prisma.category.findMany();
    return NextResponse.json(post);
  } catch (err) {
    console.log(err);
  }
}
```

- 또한 findUnique 메서드를 사용하여 지정했던 model user의 unique값으로 user를 찾을수있다.

```prisma
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

  @@unique([email, age]) // 이것을 where의 email_age 키로 사용된다.
  @@index([createdAt])
}
```

```ts
export async function GET() {
  try {
    const comment = await prisma.comment.findMany();
    const post = await prisma.post.findMany();
    const user = await prisma.user.findUnique({
      where: {
        email_age: {
          email: "uiop01900@gmail.com",
          age: 27,
        },
      },
    });
    const category = await prisma.category.findMany();
    return NextResponse.json(post);
  } catch (err) {
    console.log(err);
  }
}

// 또한 findFirst 통해 다음과 같이 여러 name 중 첫번째를 찾을수도 있음
const user = await prisma.user.findFirst({
  where: {
    name: "혼녜림",
  },
});

// findMany 옵션을 통해서도 가능함
const user = await prisma.user.findMany({
  where: {
    name: "혼녜림",
  },
});
```

- 보통 다음과 같이 post를 받을때 create 메서드를 사용해 db에 추가해준다.

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log(data);

    const user = await prisma.user.create({
      data: {
        age: data.age,
        email: data.email,
      },
    });
    console.log(user);

    return NextResponse.json(user);
  } catch (err) {
    console.log(err);
  }
}
```

- 또한 다음과 같이 createMany 메서드 내의 data 배열로 보낼시, user 는 user의 수를 반환한다

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log(data);

    const user = await prisma.user.createMany({
      data: [
        {
          age: data.age,
          email: data.email,
        },
        {
          age: data.age + 1,
          email: data.email + "23",
        },
      ],
    });
    console.log(user); // { "count": 2 }

    return NextResponse.json(user);
  } catch (err) {
    console.log(err);
  }
}
```

- 또한 읽기와 수정을 함께하는 update 메서드도 제공해준다..

```ts
export async function POST() {
  try {
    const user = await prisma.user.update({
      where: { email: "uiop01900@gmail.com" },
      data: {
        email: "uiop01900@gmail.comm", // 다음과 같이 수정됨
      },
    });
    console.log(user);

    return NextResponse.json(user);
  } catch (err) {
    console.log(err);
  }
}

// 아 물론 email 로 찾은 data의 다른 key의 value를 변경하는것 도 가능하다

const user = await prisma.user.update({
  where: { email: "uiop01900@gmail.com" },
  data: {
    name: "흥!녜림",
  },
});

// 이렇게 내부 연산도 가능..

const user = await prisma.user.update({
  where: { email: "uiop01900@gmail.com" },
  data: {
    age: {
      increment: 1,
    },
  },
});
```

- updateMany를 사용하게 되면 unique 키로 지정이 되어있지 않아도 접근 가능함

```ts
const user = await prisma.user.updateMany({
  where: { name: "혼녜림" },
  data: {
    name: "홍녜림",
  },
});

// user 수 반환
// {
//   "count": 1
// }
```

- delete 는 update의 반대로 해주면됨
