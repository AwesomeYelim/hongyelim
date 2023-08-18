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
