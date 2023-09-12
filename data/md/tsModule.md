# 앰비언트 선언, 선언 병합, 값과 타입

## declarations merging

- interface merging

```ts
interface Merge {
  one: string;
}
interface Merge {
  two: number;
}

// 중복선언 merging 됨
const example: Merge = {
  one: "1",
  two: 2,
};
```

- ambient declaration (앰비언트 선언)

  ❓ 언제 쓸까
  외부에 js 파일이 있고 그것에 대한 d.ts 파일을 따로 만들고자 할때 사용함

* 아래와 같이 만들수 있음

```ts
declare namespace NS {
  const v: string;
}
declare enum Enum {
  Admin = 1,
}

declare function func(param: number): string;
declare const variables: number;
declare class C {
  constructor(p1: string, p2: string);
}

new C(func(variable), NS.v);
```

- declare 병합표

  <img src="img/b_declare.png" style="height:200px;">

- typescript 공식문서에 있는표 ( compile시 타입은 사라지지만 값으로는 존재하는 개체 정리)
  <img src="img/b_declare2.png" style="height:200px;">

- 예시

```ts
namespace Ex {
  interface Inner {
    test: string;
  }
  type test2 = number;
  export const a = "hi";
}

// npx tsc index 실행시
// var Ex;
// (function (Ex) {
//     Ex.a = "hi";
// })(Ex || (Ex = {}));

// ==> Ex = { a : 'hi } // 이런식의 객체 형식이 된다고 볼수 있음
```

# 데코레이터 (ts 5.0)

- 꾸며주는 것(중복 방지)

- 다음과 같이 console.log("start") 와 console.log("end") 가 중복되는 함수가 있다.

```ts
class A {
  eat() {
    console.log("start");
    console.log("Eat");
    console.log("end");
  }
  work() {
    console.log("start");
    console.log("Work");
    console.log("end");
  }
  sleep() {
    console.log("start");
    console.log("Sleep");
    console.log("end");
  }
}
```

- 다음과 같은 decolation 모듈로 이용 가능

```ts
function startAndEnd(origin: any, context: any) {
  return function replace(this: any, ...args: any[]) {
    console.log("start");
    const result = origin.call(this, ...args);
    console.log("end");
    return result;
  };
}

class A {
  @startAndEnd
  eat() {
    console.log("Eat");
  }
  @startAndEnd
  work() {
    console.log("Work");
  }
  @startAndEnd sleep() {
    console.log("Sleep");
  }
}
```
