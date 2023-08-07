# 22장 this

- 오늘 이것만 알면 성공하신겁니다
- 어디에 있는 this 가 누구를 가르키는지

## 22.1 this 키워드

- 객체 : 프로퍼티(상태) + 메서드(동작)-> 하나의 논리적인 단위로 묶은 복합적인 자료구조
- 메서드 : 객체 지향 프로그래밍에서 객체와 관련된 서브 루틴 (또는 함수)
  - 자신이 속한 객체의 식별자 참조 ㄱㄴ
  - 프로퍼티 참조 및 변경 ㄱㄴ

```js
// 객체 리터럴방식
const imhong = {
  age: 20, //프로퍼티
  내년나이() {
    //메서드 -> 자신이 속한 imhong을 먼저 참조할수 있어야함
    return 1 + imhong.age;
  },
};

console.log(imhong.내년나이()); //21
```

- 내년나이 메서드는 자신이 속한 객체 식별자 imhong 참조 함
  - 참조 표현식이 평가되는 시점 = 내년나이 메서드가 호출되어 함수 몸체가 실행되는 시점
- 객체리터럴은 imhong 변수에 할당되기 직전에 평가됨
- 자기 자신이 속한 객체를 재귀적으로 참조하는 방식 -> 일반적 x 바람직 x

  \*\* 인스턴스란?
  같은 클래스에 속하는 개개의 객체로, 하나의 클래스에서 생성된 객체 -> 즉, 클래스가 구체화되어, 클래스에서 정의된 속성과 성질을 가진 실제적인 객체로 표현된 것

```js
//생성자 함수 방식 -> 인스턴스 생성
function imhong(age) {
    ????.age = age; //이 시점에선 자신이 생성할 인스턴스를 가리키는 식별자 알수 x
}

imhong.prototype.내년나이 = function() {
    //이 시점에선 자신이 생성할 인스턴스를 가리키는 식별자 알수 x
    return 1 + ????.age;
};

// 생성자 함수로 인스턴스 생성시 -> 먼저 생성자 함수를 정의 해야함 !
const imhong = new imhong(20);
```

- 생성자 함수에 의한 객체 생성방식 : 먼저 생성자 함수 정의 -> new 연산자와 함께 생성자 함수를 호출하는 단계
- 즉, 생성자 함수로 인스턴스 생성시, 먼저 행성자 함수가 존재 ! 해야함
- 생성자 함수 정의 시점에서(인스턴스 생성전) -> 생성자 함수가 생성할 인스턴스를 가리키는 식별자 -> 'this' 사용
- this : 자기 참조 변수(자신이 속한 객체 or 자신이 생성할 인스턴스를 가리킴) -> 자신이 속한 객체 or 인스턴스의 프로퍼티나 메서드 참조 가능
- 함수내부 this도 지역변수처럼 사용가능
- this가 가리키는 값, this 바인딩 -> 함수 호출 방식에 의해 동적으로 결정
  \*\* this 바인딩 : this 와 this 가 가리킬 객체를 바인딩 하는 것(바인딩이란? 식별자와 값을 연결하는 과정)

```js
 // 메서드를 호출한 객체 가리키의 this
const imhong = {
    age : 20,
    내년나이(){

        return 1 + this.age;
    }
};

console.log(imhong.내년나이()); //21

----------------------------------
// 생성자 함수가 생성할 인스턴스를 가리키의 this
function imhong(age){
    this.age = age;
}

imhong.prototype.내년나이 = function(){
    return 1 + this.age;
};

//인스턴스 생성
const imhong = new imhong(20);
console.log(imhong.내년나이()); //21
```

- this는 상황에 따라 가리키는 대상이 다르다.
- 자스의 this는 함수가 호출되는 방식에 따라 this에 바인딩(될값)이 동적으로 결정됨

```js
//this는 어디서든 참조 ㄱㄴ

//전역에선 전역객체 window를 가리킴
console.log(this); //window

function hong(숫자) {
  //(1) 일반함수 내부에서의 this는 전역객체 window를 가리킴
  console.log(this); //whindow
  return 숫자 * 숫자;
}
hong(2); //

const 닝겐 = {
  name: "imhong",
  혹시이름이() {
    // (2) 메서드 내부에서 this는 메서드를 호출한 객체를 가리킴
    console.log(this);
    return this.name;
  },
};

console.log(닝겐.혹시이름이()); //imhong

function 신종닝겐(name) {
  this.name = name;
  // (3) 생성자 함수 내부에서 this는 생성자 함수가 생성할 인스턴스를 가리킴
  console.log(this); // 신종닝겐{name : 'imhong'}
}

const me = new 신종닝겐("imhong");
```

- this는 자기참조변수 이므로 -> 객체의 메서드 내부 또는 생성자 함수 내부에서만 의미가 있음
- strict mode 가 적용된 일반함수 내부의 this에는 undefined가 바인딩됨 -> 일반함수 내부에서의 this 사용할 필요 x

## 22.2 함수 호출 방식과 this 바인딩

- this 바인딩(될값)은 함수 호출방식에 따라 동적으로 결정
  \*\* 렉시걸 스코프(함수정의가 평가및 생성시점애 상위스코프 결정)와 this 바인딩(함수호출 시점에 결정)은 결정시기가 다름

- 함수 호출방식
  1. 일반 함수 호출
  2. 메서드 호출
  3. 생성자 함수 호출
  4. Function.prototype.apply/call/bind 메서드에 의한 간접호출

```js
//this 바인딩은 함수 호출 방식에 따라 동적으로 결정

const ye = function () {
  console.dir(this);
};
//호출방법
//1. 일반 함수 호출(this -> 전역객체 window)
ye(); //window

//2. 메서드 호출(this -> obj(메서드 호출))
const ho = { ye };
ho.ye(); // Object

//3. 생성자 함수 호출(this -> 생성자함수가 생성한 인스턴스)
new ye(); // ye {}

//4. Function.prototype.apply/call/bind 메서드에 의한 간접호출(this는 인수에 의해 결정)
const hong = { name: "hong" };

ye.call(hong); //Object -> hong이 나와야함
ye.apply(hong); //Object -> hong이 나와야함
ye.bind(hong)(); //Object -> hong이 나와야함
```

### 22.2.1 일반 함수 호출

- 기본적으로 this에는 전역객체가 바인딩됨

```js
function ye() {
  console.log("ye의 this: ", this); //window
  function ho() {
    console.log("ho의 this: ", this); //window
  }
  ho();
}
ye();
```

- 전역함수 물론 ~, 중첩 함수를 일반 함수로 호출하면 함수 내부의 this에는 전역객체가 바인딩됨
- 객제 미생성 일반함수에서의 this는 의미가 x

```js
//strict mode가 적용된 일반함수 내부 this

function ye() {
  "use strict";

  console.log("ye의 this: ", this); //undefined
  function ho() {
    console.log("ho의 this: ", this); //undefined
  }
  ho();
}
ye();
```

- 메서드 내 중첩함수도 일반함수 호출시 -> 중첩함수 내부 this는 전역객체 바인딩

```js
//var 키워드로 선언 ! 한 전역변수 value는 전역객체 프로퍼티
var value = 1;
// const value = 1;(시험삼아)

const yel = {
  value: 20,
  ho() {
    console.log("ho의 this: ", this); //{value: 20, ho: ƒ}
    console.log("ho의 this.가치: ", this.value); // 20

    // 메서드 내에서 정의한 중첩함수
    function ye() {
      console.log("ye의 this: ", this); //Window
      console.log("ye의 this.가치: ", this.value); //1
    }

    //메서드 내에서 정의한 중첩함수도 일반 함수로 호출시 -> this 에는 전역객체가 바인딩
    ye();
  },
};

yel.ho();
```

- 콜백함수가 일반함수 호출시 콜백함수내 this에도 전역객체 바인딩 -> 어떠한 함수라도 일반함수 호출시 this에 전역객체가 바인딩

```js
var value = 1;

const yel = {
  value: 100,
  ho() {
    console.log("ho의 this: ", this); //{value: 100, ho: ƒ}
    //콜백 함수 내부의 this에는 전역객체 바인딩됨.
    setTimeout(function () {
      console.log("콜백의 this :", this); //whindow -> 전역객체가 바인딩됨
      console.log("콜백의 this.가치 :", this.value); //1
    }, 100);
  },
};
yel.ho();
```

\*\* setTimeout 함수? 두번째 인수로 전달한 시간 만큼 대기한 다음, 첫번쨰 인수로 전달한 콜백함수를 호출하는 타이머 함수 -> 41장

- 이처럼 일반 함수로 호출된 모든 함수(중첩, 콜백 포함)내부의 this에는 전역객체가 바인딩됨

- 문제가 있다 ? -> 중첩함수, 콜백함수의 this가 전역객체를 바인딩 한다는것은 일부 로직을 대신하는경우인 헬퍼함수의 역활에 혼선을 빚음 -> 동작하기 어렵게 만듬

- 메서드 내부의 중첩함수 or 콜백함수의 this 바인딩을 메서드의 this 바인딩과 일치시키는 법

```js
var value = 1;

const yel = {
  value: 100,
  ho() {
    // this 바인딩(yel)을 변수 that에 할당.
    const that = this;

    // 콜백함수 내부에서 this 대신 that을 참조
    setTimeout(function () {
      console.log(that.value); //100
    }, 100);
  },
};

yel.ho();
```

- 그 밖에 자스 this 를 명시적으로 바인딩 할 수있는 메서드 -> Function.prototype. apply, Function.prototype.call, Function.prototype.bind 제공

```js
var value = 1;

const yel = {
  value: 100,
  ho() {
    setTimeout(
      function () {
        console.log(this.value); //100
      }.bind(this),
      100
    );
  },
};

yel.ho();
```

- 화살표 함수를 사용해서 this 바인딩 일치(26장)

```js
var value = 1;

const yel = {
  value: 100,
  ho() {
    setTimeout(() => console.log(this.value), 100); //100
  },
};

yel.ho();
```

### 22.2.2 메서드 호출

- 메서드 내부의 this에는 메서드를 호출한 객체, 메서드를 호출할때 이름 앞에 마침표(.) 연산자 앞에 기술한 객체가 바인딩
- 메서드 내부 this는 메서드를 소유한 객체가 아닌 메서드를 호출한 객체에 바인딩

```js
const 닝겐 = {
  name: "yelim",
  이름이혹시() {
    //메서드 내부의 this는 메서드를 호출한 객체에 바인딩됨
    return this.name;
  },
};

//메서드 '이름이혹시'를 호출한 객체는 닝겐이다
console.log(닝겐.이름이혹시()); //yelim
```

- 위 예제에 이름이혹시 메서드는 닝겐 객체의 메서드로 정의되었다.
- 메서드는 프로퍼티에 바인딩된 함수
- 닝겐 객체의 이름이혹시 프로퍼티가 가리키는 함수객체는 닝겐 객체에 포함된것이 아닌 독립적인 별도의 객체
- 이름이혹시 프로퍼티가 함수객체를 가리키고 있을뿐
- SO, 이름이혹시 메서드는 다른객체의 프로퍼티의 할당하는 것으로 다른객체의 메서드가 될수 있고, 일반변수에 할당 -> 일반함수로 호출 ㄱㄴ

```js
const 다른닝겐 = {
  name: "hong",
};
//이름이혹시 메서드를 다른닝겐 객체의 메서드로 할당
다른닝겐.이름이혹시 = 닝겐.이름이혹시;

//이름이혹시 메서드를 호출한 객체는 다른닝겐이다.
console.log(다른닝겐.이름이혹시()); //hong

//이름이혹시 메서드를 변수에 할당
const 이름이혹시 = 닝겐.이름이혹시;

//이름이혹시 메서드를 일반함수로 호출
console.log(이름이혹시()); //''-> 기본값
//일반함수로 호출된 이름이혹시 함수 내부의 this.name은 브라우저 환경에서 window.name과 같다.
```

- 메서드 내부의 this는 프로퍼티로 메서드를 가리키고 있는 객체와는 관계가 없음 -> 메서드를 호출한 객체에 바인딩
- this에 바인딩될 객체는 호출시점에 결정됨.
  -> this 입장 : 나를 누가 호출하였는가 ~ ! 나를 누가 불렀으얽

- 프로토타입 메서드 내부 this도 해당 메서드를 호출한 객체에 바인딩됨

```js
function 닝겐(name) {
  this.name = name;
}

닝겐.prototype.이름이혹시 = function () {
  return this.name;
};

const 나 = new 닝겐("yelim");

// 이름이혹시 메서드를 호출한 객체는 나 이다
console.log(나.이름이혹시()); // (1)yelim

닝겐.prototype.name = "hong";

// 이름이혹시 메서드를 호출한 객체는 닝겐.prototype 이다.
console.log(닝겐.prototype.이름이혹시()); //(2)hong
```

- (1)의 경우 '이름이혹시' 메서드를 호출할 객체는 '나' 다. -> 이름이혹시 메서드 내부의 this는 나를 가리킴 -> this.name = 'yelim'
- (2)의 경우 '이름이혹시' 메서드를 호출한 객체는 닝겐.prototype 이다. 닝겐.prototype도 객체로서 직접메서드 호출 ㄱㄴ -> 이름이혹시 메서드 내부의 this는 닝겐.prototype을 가리킴 -> this.name = 'hong'

### 22.2.3. 생성자 함수 호출

- 생성자 함수 내부의 this에는 (미래에)생성할 인스턴스가 바인딩

```js
//생성자 함수
function Yelim(age) {
  //생성자 함수 내부의 this -> 생성자 함수가 생성할 인스턴스 가리킴
  this.age = age;
  this.내년나이 = function () {
    return 1 + this.age;
  };
}

// 희망나이 20인 yelim 객체생성
const yelim1 = new Yelim(20);

// 현재나이 27인 yelim 객체^^..생성
const yelim2 = new Yelim(27);

console.log(yelim1.내년나이()); //21
console.log(yelim2.내년나이()); //28
```

- 생성자 함수는 이름그대로 객체(인스턴스)를 생성하는 함수 -> new 연산자 필수라구 ! !

```js
// new 연산자 없이는 ~ 생성자 함수가 아니야 ~ 일반함수야
const yelim3 = Yelim(17);

//일반함수로 호출된 Yelim에는 반환문이 없어 ~ -> undefined 반환
console.log(yelim3);
undefined;

//일반 함수로 호출된 Yelim 내부 this는 -> 전역객체 가리킴
console.log(age); //17
```

### 22.2.4 Function.prototype.apply/call/bind 메서드에 의한 간접호출

- apply/call/bind 메서드는 Function.prototype의 메서드 -> 모든함수가 상속받아 사용 ㄱㄴ
- Function.prototype.apply, Function.prototype.call 메서드는 this로 사용할 객체와 인수 리스트를 인수로 전달받아 호출

```js
/**
 * 주어진 this 바인딩과 인수 리스트 배열을 사용하여 함수를 호출한다.
 * @param thisArg - this로 사용할 객체
 * @param argArray - 함수에게 전달할 인수 리스트의 배열 또는 유사 배열 객체
 * @returns 호출된 함수의 반환값
 */

 Function.prototype.apply(thisArg[ , argsArray])

 /**
  * 주어진 this 바인딩과 ,로 구분된 인수 리스트를 사용하여 함수를 호출한다.
  * @param thisArg - this로 사용할 객체
  * @param arg1, arg2, ... - 함수에게 전달할 인수 리스트
  * @returns 호출된 함수의 반환값
  */
 Function.prototype.call (thisArg[, arg1[, arg2[, ...]]])
```

```js
function 바인딩겟() {
  return this;
}

//this 사용할 객체
const thisArg = { a: 1 };

console.log(바인딩겟()); //window

//바인딩겟 함수를 호출하면서 인수로 전달한 객체를 바인딩겟 함수의 this에 바인딩함
console.log(바인딩겟.apply(thisArg)); //{a:1}
console.log(바인딩겟.call(thisArg)); //{a:1}
```

- apply와 call 메서드의 본질적인 기능은 -> 함수를 호출하는 것
- apply 와 call 메서드는 함수 호출시 첫번째 인수로 전달한 특정객체를 호출한 함수의 this에 바인딩
- apply 와 call 메서드는 함수에 인수전달방식만 다를뿐 -> 동일하게 동작

```js
function 바인딩겟() {
  console.log(arguments);
  return this;
}

//this로 사용할 객체
const thisArg = { a: 1 };

// 바인딩겟 함수호출 -> 인수로 전달할객체 바인딩겟 함수 this에 바인딩
//apply 메서드는 호출할 함수의 인수를 배열로 묶어전달
console.log(바인딩겟.apply(thisArg, [1, 2, 3]));
//Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// {a: 1}

// call 메서드는 호출할 함수의 인수리스트를 쉼표로 구분
console.log(바인딩겟.call(thisArg, 1, 2, 3));
//Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// {a: 1}
```

- apply 와 call 메서드는 호출할 함수에 인수를 전달하는 방식만 다를뿐 !
- 대표적인 용도 : argument 객체와 같은 유사배열 메서드를 사용하는 경우 !
- argument 객체는 배열 x -> Array.prototype.slice 같은 배열의 메서드 사용 x-> apply, call 메서드 이용시 ㄱㄴ

```js
function 배열어쩌구() {
  console.log(arguments);

  //arguments 객체를 배열로 변환
  //Array.prototype.slice를 인수 없이 호출하면 배열의 복사본을 생성
  const 배열 = Array.prototype.slice.call(arguments);
  //const 배열 = Array.prototype.slice.call(arguments);
  console.log(배열);

  return 배열;
}

배열어쩌구(1, 2, 3); //[1, 2, 3]
```

- 자세한건 27장 배열
- Function.prototype.bind 메서드는 apply 와 call 메서드와 달리 함수호출 x, this로 사용할 객체만 전달

```js
function 바인딩겟() {
  return this;
}

//this로 사용할 객체
const thisArg = { a: 1 };

//bind 메서드는 함수에 this로 사용할 객체를 전달
//bind 메서드는 함수를 호출하지는 않는다
console.log(바인딩겟.bind(thisArg)); //ƒ 바인딩겟(){return this;}
//bind 메서드는 함수를 호출하지는 않으므로 명시적으로 호출해야함
console.log(바인딩겟.bind(thisArg)()); //{a: 1}
```

- bind 메서드는 this 메서드 내부의 중첩함수 또는 콜백함수의 this가 불일치하는 문제를 해결하기위해 사용

```js
const 닝겐 = {
  name: "yelim",
  ho(callback) {
    // (1)
    setTimeout(callback, 100);
  },
};

닝겐.ho(function () {
  console.log(`안녕 나는 ${this.name}.`); //(2) 안녕 나는 .
});
```

- 닝겐.ho의 콜백함수 호출이전(1)시점 this는 닝겐객체를 가리킴
- BUT ! ! 닝겐.ho의 콜백함수가 일반함수로 호출된(2)의 시점의 this는 전역객체 (window)를 가리킴(this.name = window.name)

- 콜백함수 닝겐.ho는 외부함수를 돕는 헬퍼함수(보조함수) -> 여기서 this가 다르면 문제~~
- bind 메서드 사용으로 일치시키자 !

```js
const 닝겐 = {
  name: "yelim",
  ho(callback) {
    // bind 메서드로 callback 함수 내부의 this 바인딩을 전달
    setTimeout(callback.bind(this), 100);
  },
};

닝겐.ho(function () {
  console.log(`안녕 나는 ${this.name}.`); // 안녕 나는 yelim.
});
```

** 정리해봄세 **

- 일반함수호출 -> 전역객체
- 메서드호출 -> 메서드를 호출한 객체
- 생성자함수호출 -> 생성자함수가(미래에)생성할 인스턴스
- Function.prototype.apply/call/bind 메서드에 의한 간접호출 -> Function.prototype.apply/call/bind 메서드의 첫번째 인수로 전달한 객체
