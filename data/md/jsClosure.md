# 클로저

- 클로저 : 함수와 그 함수가 선언된 렉시컬 환경과의 조합(MDN)
- 함수가 선언된 렉시컬 환경

```js
const h = 1;

function 외부() {
    const h = 10;
    function 내부() {
        console.log(h) //10;
    }
    내부();
}
외부();

// 외부함수 스코프는 내부함수 스코프의 상위스코프

--------------------------------
// 내부함수가 외부함수 내부에 정의된 중첩함수가 아니면 외부함수 변수에 접근 x

const h = 1;

function 외부() {
    const h = 10;
    내부();
}

function 내부() {
    console.log(h); // 1
}

외부();

```

- 왜이런현상이..? 자스가 렉시컬 스코프를 따르는 프로그래밍 언어이기 때문

## 렉시컬 스코프

- 렉시컬 스코프(정적 스코프) : 자스 엔진은 함수를 어디서 호출했는지가 아닌, 함수를 어디에 정의했는지에 따라 상위 스코프를 결정

```js
const h = 1;

function ho() {
  const h = 10;
  ye();
}

function ye() {
  console.log(h);
}

ho(); //1
ye(); //1
```

- ho함수 ye함수 모두 전역에서 정의된 전역함수
- 스코프의 실체 -> 실행환경 컨텍스트의 렉시컬 환경(외부 렉시컬 환경에 대한 참조를 통해 상위렉시컬 환경과 연결 -> 스코프 체인)
- 렉시컬 스코프 : '외부 렉시컬 환경에 대한 참조'에 저장한 참조값 -> 상위스코프에 대한 참조는 함수정의가 평가되는 시점에 함수가 정의된 환경에 의해 결정됨

## 함수객체의 내부슬롯[[Environment]]

- 함수가 정의된 환경(위치) 과 호출되는 환경(위치)은 다를수 있다 !
- 렉시컬 스코프가 가능하려면 ? 호출되는 환경과 상관 없이, 자신이 정의된 환경, 상위스코프를 기억해야함
- 함수는 자신의 내부슬롯[[Environment]]에 자신이 정의된 환경 -> 상위스코프의 참조를 저장
- 함수정의가 객체 생성시점 = 함수가 정의된 환경 -> 상위함수가 평가 또는 실행되는 시점
- 이때 실행중인 실행컨텍스트 = 상위함수의 컨텍스트
- 즉..! 함수객체의 내부슬롯[[Environment]]에 저장된 현재 실행중인 실행컨텍스트의 렉시컬 환경의 참조 -> 상위스코프, 자신이 호출시 생성될 함수렉시컬 환경의 '외부 렉시컬 환경에 대한 참조'에 저장될 -> 참조값
- 그림 24-10 참조

```js
const h = 1;

function ho() {
  const h = 10;

  //상위 스코프는 함수 정의 환경에 따라 결정
  //함수 호출위치와 상위 스코프는 아무런 관계가 없음
  ye();
}

function ye() {
  console.log(h);
}

ho(); //1
ye(); //1
```

- ho 함수와 ye 함수는 모두 전역에서 함수 선언문으로 정의됨 -> 전역객체 window의 메서드가 됨
- 함수코드 평가 순서
  1. 함수 실행 컨텍스트 생성
  2. 함수 렉시컬 환경 생성
     2.1 함수 환경 레코드 생성
     2.2 this 바인딩
     2.3 외부 렉시컬 환경에 대한 참조 결정
- 외부 렉시컬 환경에 대한 참조에는 함수 객체의 내부슬롯[[Environment]]에 저장된 렉시컬 환경의 참조가 할당됨
- 다시말해 ! 함수객체의 내부슬롯에 저장된 렉시컬 환경의 참조는 -> 함수의 상위스코프 ^^\*

## 클로저와 렉시컬 환경

```js
const h = 1;

//(1)
function 외부() {
  const h = 10;
  const 내부 = function () {
    console.log(h);
  }; //(2)
  return 내부;
}

// 외부 함수를 호출하면 중첩함수 내부를 반환함
// 외부 함수의 실행 컨텍스트는 실행 컨텍스트 스택에서 팝되어 제거

const 내부펑션 = 외부(); //(3)
내부펑션(); //10
```

- 외부함수 호출시 (3) 외부함수는 내부함수 반환하고 생을마감함^^..
- 외부함수의 실행이 종료되면 외부 함수의 실행 컨텍스트는 -> 스택에서 제거
- 외부함수 지역변수 h 는 더는 유효하지 x

- BUT!? 내부펑션의 선언으로 다시 부활이라도 한듯 동작!
- 여기서 '클로저' 란? 외부함수 보다 중첩함수가 더 오래 유지되는 경우 -> 중첩함수('내부'함수)는 이미 생을마감한 외부 함수의 변수 참조 ㄱㄴ -> 이러한 중첩함수를 가르킴

- (그 함수가 실행된)렉시컬 환경(다시한번^^!) : 함수가 정의된 위치의 스코프, 상위스코프를 의미하는 실행 컨텍스트의 렉시컬 환경

- 외부함수 호출시

1. 외부 함수를 호출
2. 외부함수의 렉시컬 환경 생성
3. 외부 함수 객체의 [[Environment]] 내부슬롯에 저장된 전역 렉시컬 환경 -> 외부함수 렉시컬환경의 '외부 렉시컬 환경에 대한 참조' 할당
4. 중첩함수 내부 가 평가됨
5. 내부는 자신의 [[Environment]]내부 슬롯에 현재 실행중인 실행컨텍스트의 렉시컬 환경, 외부함수의 렉시컬 환경을 상위 스코프로 저장

- 외부 함수의 실행컨텍스트는 실행 컨텍스트 스택에서 제거 -> 외부함수의 렉시컬 환경을 소멸 x
- 외부 함수의 렉시컬환경은 -> 가비지컬렉션의 대상이 되지 x ^^( 누군가 참조를 하고 있긔 때문...!)
- 내부함수 호출시

1. 내부함수 호출
2. 내부함수 실행컨텍스트 생성, 스택에 푸쉬
3. 렉시컬 환경의 외부 렉시컬 환경에 대한 참조에는 내부 함수 객체의 [[Environment]]내부 슬롯에 저장되어있는 참조값이 할당됨

- 중첩함수 '내부'함수는 '외부'함수보다 더 오래 생존했다. ! !
- 내부 함수는 상위스코프를 참조 ㄱㄴ(식별자참조, 식별자 값변경 ㄱㄴ)
- 디버깅 모드로 시자쿠~

```html
<!DOCTYPE html>
<html>
  <body>
    <script>
      function ho() {
        const h = 1;
        const y = 2;

        //일반적으로 클로저라 안함
        function ye() {
          const l = 3;

          debugger;
          //상위 스코프의 식별자를 참조 x
          console.log(l);
        }

        return ye;
      }

      const ye = ho();
      ye();
    </script>
  </body>
</html>
```

- 상위 스코프의 어떤 식별자도 참조하지 않는 함수는 클로저가 아니다
- 위 예제의 중첩함수 ye는 외부함수 ho 보다 더 오래 유지되지만 상위 스코프의 어떤 식별자도 참조 x
- 이럴때는 모던 브라우저는 상위스코프 기억 x
- ye 함수는 클로저가 아님~~

```html
<!DOCTYPE html>
<html>
  <body>
    <script>
      function ho() {
        const h = 1;

        //ye 함수는 클로저였지만 바로 소멸
        // 이러한 함수는 일반적으로 클로저 x
        function ye() {
          debugger;
          //상위 스코프의 식별자를 참조
          console.log(l);
        }

        ye;
      }
      ho();
    </script>
  </body>
</html>
```

- 외부함수 ho 보다 중첩함수 ye의 생명주기가 짮음.
- 중첩함수 ye는 클로저 였지만 바로소멸

```html
<!DOCTYPE html>
<html>
  <body>
    <script>
      function ho() {
        const h = 1;
        const y = 2;

        // 클로저
        // 중첩 함수 ye는 외부 함수보다 더 오래 유지 & 상위 스코프의 식별자를 참조
        function ye() {
          debugger;
          console.log(h);
        }
        return ye;
      }

      const ye = ho();
      ye();
    </script>
  </body>
</html>
```

- 중첩함수 ye는 상위스코프의 식별자를 참조하고 있음 -> 클로저
- 외부함수의 외부로 반환되어 외부함수보다 더 오래살아남는다
- 클로저의 조건(일반적)
  1. 중첩함수가 상위 스코프의 식별자를 참조
  2. 중첩함수가 외부함수보다 더 오래 유지되는것
- 자유변수 : 클로저에 의해 참조되는 상위 스코프의 변수
- 클로저 -> 자유변수에 묶여있는 함수
- 클로저를 적극 활용하자 !!

## 클로저의 활용

- 클로저 사용이유 : 상태를 안전하게 변경하고 유지하기 위해
  - 상태를 안전하게 은닉
  - 특정 함수에게만 상태 변경을 허용 -> 상태를 안전하게 변경하고 유자하기 위해 사용

```js
// 카운트 상태 변경 함수
const 증가 = (function () {
  // 카운트 상태 변수
  let num = 0;

  // 클로저
  return function () {
    //카운트 상태를 1만큼 증가시킨다.
    return ++num;
  };
})();

console.log(증가()); //1
console.log(증가()); //2
console.log(증가()); //3
```

- 생성자 함수로 표현

```js
const Counter = (function () {
  //(1) 카운트 상태 변수
  let num = 0;

  function Counter() {
    //this.num = 0; //(2) 프로퍼티는 public하므로 은닉되지 않는다.
  }

  Counter.prototype.increase = function () {
    return ++num;
  };
  Counter.prototype.decrease = function () {
    return num > 0 ? --num : 0;
  };
  return Counter;
})();

const counter = new Counter();

console.log(counter.increase()); //1
console.log(counter.increase()); //2

console.log(counter.decrease()); //1
console.log(counter.decrease()); //0
```

## 캡슐화와 정보 은닉

- 캡슐화 : 프로퍼티(객체의 상태를 나타냄)와 메서드(프로퍼티를 참조하고 조작할 수 있는 동작)를 하나로 묶는것 -> 감출목적으로 사용함 -> 정보은닉
- 결합도를 낮추는 효과
