# node + typescript 적용하기 (프로젝트 구조 갖추기)

## 2.express 미들웨어 필요패키지 설치

```
yarn add morgan cors cookie-parser express-session dotenv passport hpp helmet

```

- 자체적으로 type 모듈이 제공되지 않기때문에 따로 설치해줌

```
yarn add @types/morgan @types/cors @types/cookie-parser @types/express-session @types/dotenv @types/passport @types/hpp @types/helmet

yarn add passport-local bcrypt @types/passport-local @types/bcrypt
```

📍 pakage.json 에서 메이저 버전이 왠만하면 맞아야함 -> 추후에 문제 발생 가능성..

📍 scripts 에서 start는 배포 환경
@types 도 개발용뿐만아니라 배포용에서 필요하기때문에 -D(devDependencies) 가 아닌 dependencies에 넣는다.

- "string | undefined 형식은 string | string[] 형식에 할당할 수 없습니다." 와 같은 error일 경우
  -> 다음과 같이 string 으로 들어갈것이라는 확신의 느낌표 secret: process.env.COOKIE_SECRET!
