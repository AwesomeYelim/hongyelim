# Don't be silly

## 바보같은 실수

1. 맥북에 mysql local db 를 연결하려고 하면 터미널에자꾸 아래와 같은 에러가 떴다.

- 아래 명령어 입력시

```sh
npx prisma migrate dev
```

- 이와 같은 에러가.....ㅎ

```sh
Error: P1001: Can't reach database server at `localhost`:`3306`

Please make sure your database server is running at `localhost`:`3306`.
```

2. 해결방법

- 정말 어처구니 없게도 터미널에서 mysql 서버를 안켜서임 ^^....
  (맥북은 따로 켜줘야되는지 몰랐..)

- 터미널을 키고 다음 명령어를 입력해 주자

```sh
brew install mysql // 혹시몰라 설치도 안되어있을거 같아서..

mysql.server start
```

참고
https://velog.io/@haleyjun/MySQL-Mac%EC%97%90-MySQL-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0-M1%EC%B9%A9

## 연동

```sh
 yarn prisma db pull
```
