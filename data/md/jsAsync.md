# 비동기 프로그래밍

## 동기 처리와 비동기 처리

- ho 와 ye 함수는 호출된 순서대로 스택 자료구조인 실행 컨텍스트 스택에 푸시되어 실행된다.

```js
const ho = () => {};
const ye = () => {};

ho();
ye();
```

<img src="img/42-1.png">

- 자스엔진은 단 하나의 실행 컨텍스트 스택을 갖는다.
- 자스 엔진은 싱글 스레드(한번에 하나의 태스크만 실행할 수 있는 방식) 처리에 시간이 걸리는 태스크를 실행하는 경우 블로킹(작업중단)이 발생함

- setTimeout 함수와 유사하게 일정 시간이 경과한 이후에 콜백함수를 호출하는 잔다 함수

```js
function 잔다(func, delay) {
  const delayUntil = Date.now() + delay;
  while (Date.now() < delayUntil);
  func();
}

function ho() {
  console.log("ho");
}
function ye() {
  console.log("ye");
}

잔다(ho, 3 * 1000);

ye();
```

- 잔다함수의 (ho 함수실행시간 + 3초) delay 로 뒤에있는 ye 함수는 호출되지 못하고 블로킹(작업중단)됨
- 동기처리 : 현재 실행중인 태스크가 종료할 떄까지 다음에 실행될 태스크가 대기하는 방식(실행순서가 보장된다는 장점 + 앞선 태스크가 종료할때까지 이후 태스크들이 블로킹되는 단점)

- setTimeout사용으로 수정

```js
function ho() {
  console.log("ho");
}
function ye() {
  console.log("ye");
}

setTimeout(ho, 3 * 1000);
ye();
```

- 태스크를 블로킹하지 않고 곧바로 실행
- 비동기 처리 : 실행중인 태스크가 종료되지 않은 상태라 해도 다음 태스크를 곧바로 실행하는 방식(전통적으로 콜백패턴사용 -> 가독성이 나쁨, 에러의 예외처리가 곤란, 여러개의 비동기처리를 한번에 처리하는데 한계)
  <mark>타이머 함수인 setTimeout과 setInterval, HTTP 요청, 이벤트 핸들러는 비동기 처리 방식으로 진행된다</mark>

## 이벤트 루프와 태스크 큐

- 자스 -> 싱글스레드로 동작 -> 하나의 태스크만 처리 ㄱㄴ but ! 브라우저가 동작하는 것을 살펴보면 많은 태스크가 동시에 처리되는 것처럼 느껴짐
- 이벤트루프 : 자스의 동시성을 지원하는것
- 자스엔진의 두개의 영역

  - 콜 스택 : 소스코드 평가 과정에서 생성된 실행 컨텍스트가 추가 및 제거되는 스택자료구조인 실행컨텍스트 스택
  - 힙 : 객체가 저장되는 메모리 공간, 실행컨텍스트는 힙에 저장된 객체를 참조한다./ 구조화 되어있지 않다.
  - 비동기 방식으로 동작하는 setTimeout의 콜백함수의 평가와 실행은 자스 엔진이 담당하지만, 호출 스케줄링을 위한 타이머 설정과 콜백 함수의 등록은 브라우저 or Node.js 가 담당 -> 이를위해 브라우저 환경은 태스크 큐와 이벤트 루프 제공
    - 테스크 큐 : setTimeout 이나 setInterval과 같은 비동기 함수의 콜백 함수 또는 이벤트 핸들러가 일시적으로 보관되는 영역
    - 이벤트 루프 : 콜스텍에 현재 실행중인 실행 컨텍스트가 있는지? 태스크 큐에 대기중인 함수가 있는지 반복해서 확인. 만약 콜스택이 비어있고 태스크 큐에 대기중인 함수가 있다면 이벤트 루프는 순차적으로 대스크 큐에 대기중인 함수를 콜 스택으로 이동시킴

- 다음 함수중 먼저 실행될 함수는 ?

```js
function ho() {
  console.log("ho");
}
function ye() {
  console.log("ye");
}

setTimeout(ho, 0);
ye();
```

1. 전역코드가 평가됨 -> 전역실행 컨텍스트 생성 -> 콜스택 푸쉬
2. setTimeout 함수가 호출 -> setTimeout 함수의 실행컨텍스트가 생성-> 콜스텍 푸쉬 -> 현재 실행중인 실행 컨텍스트가 됨 -> 실행컨텍스트 생성
3. setTimeout 실행시 -> 호출스케줄링 -> 종료후 콜스택에 팝됨 -> 콜백함수를 테스크 큐에 푸쉬(브라우저의 역활)
4. 브라우저 병행 수행 두가지((1)4ms 후에 콜백함수 ho 가 태스크 큐에 푸쉬되어 대기/ (2)ye 함수는 아직 태스크 큐에서 대기중)
5. 전역코드 실행 종료 -> 전역 실행 컨텍스트 콜스택에서 팝됨 -> 콜스텍에 아무 실행 컨텍스트도 존재 x
6. 이벤트 루프에 의해 콜스텍이 비어있음 감지 -> 대기중인 ho 함수가 콜스텍에 푸쉬 -> 실행컨텍스트가 됨 -> 이후 종료 및 콜스텍에서 팝됨

<mark> 비동기 함수인 setTimeout의 콜백함수는 태스크 큐에 푸쉬되어 대기하다가 콜스택이 비게되면 푸쉬되어 실행 </mark>

- 자스는 싱글스레드 방식으로 동작
- 브라우저는 멀티스레드로 동작