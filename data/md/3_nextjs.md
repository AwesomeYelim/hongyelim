# next.js 강의 목표

- next는 무엇이고 어떤 철학을 가지고 있는지
- web app 에서 쓸수 있는 4가지 렌더링 방식
  어떻게 상호보완할수 있는지?
- next.js의 구현 특징
- 언제 어떻게 사용

- next는 프레임 워크임
  라이브러리는 툴을 제공해주는것
  프레임워크는 큰단위에 솔루션 제공, 골격이 정해져있음 -> 제공해줌

<img src="../img/intro.png" />

- client side redering -> 랜더링하는 주체자가 클라이언트 (브라우저)
  장점 - 한번 로딩되면, 빠른 ux 제공(부분적으로 업데이트), 서버 부하가 적음
  단점 - 로딩시간이 오래걸림(ttv/ time to view 가 길다), 자바스크립트 활성화 필수, seo 최적화가 힘듬, 보안에 취약함, cdn(content delivery network)에 캐시가 안됨
  -> 이런문제점을 해결하기 위해 나온것 ssg, ssr

- static side generation -> 언제 랜더링되냐? 처음 배포해서 빌드할때 실행됩니다.
  장점 - 페이지 로딩시간이 빠름, 자바스크립트가 필요 없음, seo 최적화, 보안이 뛰어남. cdn 에 캐시가 됨
  단점 - 데이터가 정적임(데이터가 가변적인 사이트에는 좋지x), 사용자별 정보 제공이 어려움
  -> 이런문제점을 해결하기 위해서 나온게 isr, ssr

- incremental(증가하는) static regeneration(회생)-> 주기적으로 렌더링함
  장점 - ssg의 장점 + 데이터가 주기적으로 업데이트됨
  단점 - 실시간 데이터가 아님, 사용자별 정보제공의 어려움
  -> 이런 문제점을 해결하기 위해 나온게 ssr

- server side redering -> 랜더링 하는 주체가 서버, 요청시 랜더링이 된다.
  장점 - isr 장점 + 실시간 데이터를 사용, 사용자별 필요한 데이터를 사용
  단점 - 비교적 느릴수 있음, 서버의 과부화가 걸릴 수 있음(overhead가 높아짐), cdn에 캐시가 안됨

-> 결론 : 하나의 완벽한 랜더링 솔루션은 없다

- next.js hybrid(혼합) web app - 특정 목적(성능좋은 강력한 web app)을 달성하기 위해 두개이상(이중성)의 기능이나 요소를 결합

<img src="../img/hybrid.png" />

- hydration(수화/혼합작용) - stay hydration : 물(리액트)로 가득채우다  
  정적인 html 페이지를 먼저 prerendering 시킨다. (아직 자바스크립트가 포함되어있지않음) -> interaction 을 위해 react & js 파일을 보낸다 -> 컴포넌트 랜더링을 시킴
  -> 깜박이는이유 정적인 html 파일을 react 파일로 대체하는 과정이라 그렇다고 함

- web 개발시 중요포인트 -> TTV (Time To View) & TTI (Time To Interact)

* next.js decision tree
  <img src="../img/decision.png" />
