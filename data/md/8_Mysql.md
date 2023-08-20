# mySql 🐬🐬🐬

### 사용 이유

> 더 이상은 미룰수 없다...
> 더 이상은 next 서버에서 자체 데이터를 저장하는게 좋지 않다고 판단... 또한 배포된 사이트에 data 업데이트를 시키려면 .... db 못 잃허...

우선 mySql orm 이라는 prisma 라는 친구부터 친해져야 될것같다 ...^^

```sh
yarn add prisma

```

그리고 생성된 **.env 파일에서**(아래이미지 참고)

<img src='connectionUrl.png' />

```
DATABASE_URL="mysql://root:[password]@localhost:3306/test"
```

```sh
npx prisma migrate dev
npx prisma studio

```

## mySqL 🐬 workbench 단축키....

> ▶ 1개의 SQL문 실행
> 커서가 있는 1개의 SQL문을 실행 시키려면 [Ctrl+Enter]키를 누르면 된다.

> ▶ 여러개(다중) SQL문 실행
> 실행하고자 하는 SQL문들의 영역을 드래그한 후 [Ctrl+Shift+Enter]키를 누르면 된다.

## 참고

> https://www.youtube.com/watch?v=N5u3r6OiV2g

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
