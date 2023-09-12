# mySql + prisma 🐬🐬🐬

### 참고

> https://www.youtube.com/watch?v=RebA5J-rlwg&t=1711s

### 사용 이유

> 더 이상은 미룰수 없다...
> 더 이상은 next 서버에서 자체 데이터를 저장하는게 좋지 않다고 판단... 또한 배포된 사이트에 data 업데이트를 시키려면 .... db 못 잃허...

우선 mySql orm 이라는 prisma 라는 친구부터 친해져야 될것같다 ...^^

------------- 처음 시작일 경우

- 초기화 및 종속성 설치

```sh

npm init -y
npm i --save-dev prisma typescript ts-node @types/node nodemon

```

------------- 나의 경우(blog 에 추가 세팅)

```sh
yarn add prisma

```

- prisma 에서 권장하는 tsconfig.json 을 설정해 준다

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "lib": ["esnext"],
    "esModuleInterop": true
  }
}
```

- prisma 초기화 & 사용중인 db 알려주기

```sh
npx prisma init --datasource-provider mysql

```

- prisma extention 설치(구문강조 및 prettier 설정됨) or 아래와 같이 입력하면 자동 정렬 적용됨

```sh
npx prisma format
```

**_여기서 잠깐🎈 이 파일에 대해 말해보자면..._**

> schema.prisma

- 여기가 바로 스키마 파일이다..sql도 nosql도 아닌 prisma 만의 포맷임, sql 형식과는 완전히 별개임

- 처음에는 prisma 만의 형식이 너무 헷갈리긴 하지만 .. 어쩔수 없지...^^

- 그리고 생성된 **.env 파일에서**(아래이미지 참고)

<img src='./img/b_connectionUrl.png' />

```
DATABASE_URL="mysql://root:[password]@localhost:3306/test"
```
