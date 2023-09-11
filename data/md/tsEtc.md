# 당연한거지만 막상 쓸 때 생각안날꺼 같은 것들

## 객체 keys 값 values 값 뽑기

```ts
const obj = {
  a: 1,
  b: 2,
  c: "3",
} as const;

type Obj = typeof obj;
type ObjKeys = keyof typeof obj; // key 만
type ObjValues = (typeof obj)[keyof typeof obj]; // value 만
```

## type aliase 과 interface 의 차이 - interface 가 좀더 객체지향, 같은 이름으로 중복 선언가능(서로 간에 합쳐짐)

```ts
interface A {
  talk: () => void;
}
interface A {
  eat: () => void;
}
interface A {
  sleep: () => void;
}

const a: A = {
  talk() {},
  eat() {},
  sleep() {},
  shit() {},
};

interface A {
  shit: () => void;
}
```

## 잉여속성 검사를 피해가는 방법

**❓잉여속성 검사**

> 객체 리터럴에서 발생되는 잉여 propertise 에 대해 제한을 거는 속성

```ts
type A = { name: string };
type B = { age: number };

type AB = A | B;
type C = A & B; // {name: string, age: number}

const ab: AB = { name: "yelim" };
const c: C = { name: "yelim", age: 27, married: false }; // 더 좁은 타입이지만 married: false 에서 error가 발생한다. (잉여속성검사 속성때문)
```

```ts
type A = { name: string };
type B = { age: number };

type AB = A | B;
type C = A & B; // {name: string, age: number}

const ab: AB = { name: "yelim" };
const cc = { name: "yelim", age: 27, married: false };
const c: C = cc; // 다음과 같이 중간 할당해주는 부분이 생기면 피해갈수 있음
```

## void

- 다음 3가지 경우만 void 로 인정

```ts
function a(): void {}
function b(): void {
  return undefined;
}
function c(): void {
  return;
}
```

- 같은 void 인데 다른 경우

  1. 직접 void 선언한 것과 (return 값 없어야만 함)
  2. 메서드 형식으로 선언한것 (return 값 있어도 상관 x)
  3. 매개변수 void로 선언된것 (return 값 있어도 상관 x)

```ts
function a(): void {} // 1

interface H {
  talk: () => void;
} // 2

function a(callback: () => void): void {} // 3
```

- 그럼 2,3 의 void 는 무슨 의미? => void 이지만 사용하지 않겠다

```ts
const human: H = {
  talk() {
    return "abc";
  },
};

a(() => {
  return 3;
});
```

## 강제로 변환하는 방법 (as 대신)

```ts
const b = <string>(<unknown>3); // const b = 3 as unknown as string; 이것과 같은거임
```

- 하지만 추천하지 않는다 컴파일시 js코드의 element와 혼선이 올수도 있기 때문에 error 발생여부 다분함

## declare 언제 씀?

- 외부에서 만들어진 애들을 타입선언할때 사용

## any 쓰지마

- 왜? typescript가 type checking 하는걸 포기해버림

## type guard

- 자주 쓰이는 기법

```ts
1. typeof
2. Array.isArray();
3. instanceof
class A {
  aaa() {}
}
class B {
  bbb() {}
}

function aOrB(params: A | B) {
  if (params instanceof A) {
    params.aaa();
  }
}

aOrB(new A());
4. in
5. is // 타입을 구분해주는 커스텀 함수를 직접 만들 수 있음(복잡해졌을 시 사용)
interface Cat {
  meow: number;
}
interface Dog {
  bow: number;
}
// is 를 사용함으로써 catOrDog scope범위로 타입을 좁힐 수 있음
function catOrDog(a: Cat | Dog): a is Dog {
  if ((a as Cat).meow) {
    return false;
  }
  return true;
}

function pet(a: Cat | Dog) {
  if (catOrDog(a)) {
    console.log(a.bow);
  }
  if ("meow" in a) {
    console.log(a.meow);
  }
}
const aa = {
  meow: 1,
};
pet(aa);

```

- 클래스 자체의 타입은 typeof 클래스(typeof A)

## obj

- {} , Object, object 의 차이
  > {} , Object 는 모든 타입 (null 과 undefined 제외)

```ts
const x: {} = "hello";
const y: Object = "hello";
const xx: object = "hello"; // error 뜨쥬?
const yy: object = { say: "hello" };
const z: unknown = "hi";
```

## unknown

- unknown = {} | null | undefined
- unknowm 이 any보다 나은 이유는 나중에 타입을 재정의 할수 있음

```ts
const z: unknown = "hi";
```

## class

- instance type 과 class type

```ts
class A {
  a: string;
  b: number;
  constructor(a: string, b: number = 123) {
    this.a = "123";
    this.b = 123123;
  }

  method() {}
}

const a: A = new A("123"); // A 는 instance를 가리키고
const b: typeof A = A; // typeof A 를 해야지 class A 자체를 가리킴
```

- ts 과 js 에서 제공되는 type

```ts
class A {
  private a: string = "123"; // ts 에서 제공되는 type(이걸 추천)
  #b: number = 123; // js 에서 제공되는 type

  method() {
    console.log(this.a, this.#b);
  }
}
```

- class 모양 interface로 통제하기

```ts
// 추상
interface A {
  readonly a: string;
  b: string;
}

// 구현
// interface A의 규격을 따른다
class B implements A {
  a: string = "123";
  b: string = "hello";
}

// class에서는 abstract class 라는 추상 class가 있기 때문에 애초에 interface를 잘 사용하지 않음, 또한 class 자체로 타입이 되는 부분
```

- 번외(class 문법 관련)

```ts
interface A {
  readonly a: string;
  b: string;
}

class B implements A {
  private a: string = "123";
  protected b: string = "hello";
  c: string = "wow";
}

// private, protected(class 안에 상속받은 class안에서도 쓸수 있음) 는 안에서만 쓸수 있음
// c는 밖에서도 사용 가능함

//            public           protected           private
// 클래스내부     O                 O                  O
// 인스턴스       O                 X                  X
// 상속클래스     O                 O                  X
```

## generic 위치

- 화살표 함수는 prameter 앞에 표기

```ts
type Fn = <T>(a: T, b: T) => T;
const fn: Fn = (a, b) => {
  return (a = b);
};
// or
// T = unknown 이나 T extends unknown 와 같은 기본값을 붙여주어도 괜찮음
const fn = <T>(a: T, b: T) => ({ a, b });
```

```ts
class A<T> {}
```

- filter 메서드 return 값 generic 잡아주기

```ts
// filter 의 타입을 까보면 다음과 같이 되어있음
filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];


// 하지만 다음과 같은 식에서는 return 값 타입추론이 다음과 같이 표기됨 -> const fitered: (string | number )[]
const fitered = ["123", 123, "234", 234].filter((el) => {
  typeof el === "string";
});


// 다음과 같이 reuturn 값을 is로 재선언 해줄시 const fitered: string[] 로 타입추론이 가능하다
const fitered = ["123", 123, "234", 234].filter((el: string | number): el is string => typeof el === "string");



```
