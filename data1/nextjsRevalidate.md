- page.js - 기본 변동되는 페이지
- layout.js - header, nav 같은 변동되지않는 사항들 -> layout 을 사용하게되면 그아래 자식 component들이 재활용됨

* head.js -> 13.2버전 이후로는 없어짐 -> metadata 를 사용할것임(seo때문에 사용)

* metadata 객체를 원하는 페이지별로 만들어줄수 있음 -> 하위페이지 내에는 generateMetadata 로만들어준다(최적화하기 왕짱굿)

# v12 / v13 차이점

<img src="../img/differ.png" />

    - 12 - 페이지 단위로 렌더링 방식을 규정 하였다.(getStaticProps(), getServerSideProps())
    - 13- 컴포넌트 단위로 렌더링 방식을 규정

- console.log()찍어도 입력이 나오지 않는 이유 ->
  서버컴포넌트는 서버에서 실행이 된다.
  브라우저에서 사용되는 api는 사용할수 없고, 노드환경에서 제공되는 api만 사용할수 있음

      서버에서 실행이되기 때문에 브라우저 단에서 사용되는 useState 같은 react hook 같은것들을 사용할 수 없음 -> 순수이벤트가 구현되는 곳만 client 컴포넌트로 만들어 놓아야하는 부분임

- 이벤트 기능을 담당하는 client component 위에 "use client"; 를 선언하여 사용한다

- 랜더링시 받는 html 파일을 보면 client component 에 코드도 표기 되어있는 것을 볼수 가있는데 ... client component 는 무조건 client side rendering이 되는것이 아니라 그 이후에 react component로 hydration 이 일어나야지 정적인 html 파일이 작동할수 있게되는것임

- 이전 12버전에서는 페이지 단위로 정적생성 및 client side rendering을 처리했다면 13버전에서는 component 단위로 처리한다는것이 큰 차이 !

### 그러면 기존에 12버전에서 왜 개선이 되었을까 ?

- 프로젝트 단위가 커지면 커질수록 받아오는 javascript bundling 사이즈에 영향을 주었음 그래서 react18버전과 next13버전에서 server와 client component를 만들었음

* 왜 server-component?
  서버상에 infrastructure 를 잘활용하는데 있어서 유용하다. javascript코드를 client 에 보내줄 필요가 없으므로 최종적으로 bundling되는 js 코드를 작게 만들어줄수 있음-> 왜냐면 sever component의 코드는 server 상에 온전히 남아 있을수 있기 때문에

* server-component 언제쓰면 좋음?
  백앤드 resource 사용하고,
  보안상 민감한프로그래밍,
  서버에 의존하고 있는 무거운 프로그램
  -> 공문 참고

- 정적경로 생성시 / (재사용가능한모듈) 공통함수 ts 파일로 만들어서 관리하기

- json 파일에 변경사항이 바로바로 반영되지않음 -> ssg 구성이라 build 할때 구축됨
- 그럼 어떻게 isr 로 바꿀수 있나?
  revalidate를 사용한다
  ```js
  export const revalidate = false;
  // false | 'force-cache' | 0 | number
  ```
  - revalidate 시간단위로 ssg를 업데이트 시켜줄것인지에 대해 설정할수 있음
  - fetch 데이터를 ssg에서 바로 반영하고 싶을때
    다음과 같이 두번째 인자 값으로 revalidate 옵션을 넣어준다
  ```js
  const res = await fetch("http://meowfacts.herokuapp.com", {
    next: { revalidate: 3 },
  });
  // revalidate 을 0으로 두거나 아래와 같을때에는 ssr(요청시 바로반영)로 반영됨
  const res = await fetch("http://meowfacts.herokuapp.com", {
    cache: "no-store",
  });
  ```
