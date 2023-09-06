

# 원론적인 개념들

## 함수 overloading 이란?

> TypeScript에서는 같은 이름을 가진 함수를 여러 개 정의할 수 있음. 매개변수가 다르며 이름이 동일한 함수

```ts
// 같은 이름을 가진 함수를 여러 개 정의
function add(a: string, b: string): string;
function add(a: number, b: number): number;

// 함수 구현
function add(a: any, b: any): any {
  return a + b;
}

// 함수 호출
console.log(add(1, 2));
// 3
```

## Utility 만들어보기 (Omit 주목)

```ts
// Partial
type Pa<T> = {
  [key in keyof T]?: T[key];
};

//Pick
type Pi<T, K extends keyof T> = {
  [key in K]: T[key];
};

//Omit
type O<T, K> = {
  [key in keyof T as key extends K ? never : key]: T[key];
};

// Require
type R<T> = {
  [key in keyof T]-?: T[key];
};

// Readonly
type Re<T> = {
  readonly [key in keyof T]: T[key];
};

//  -Readonly
type UnRe<T> = {
  -readonly [key in keyof T]: T[key];
};

// type Opbj = {
//   name?: "yelim";
//   age?: 27;
//   hobby?: "study";
// };

// type Obj = {
//   name: "yelim";
//   age: 27;
//   hobby: "study";
// };

type UnReObj = {
  readonly name: "yelim";
  readonly age: 27;
  readonly hobby: "study";
};

// type Opt = Pr<Obj>;
// type Opt = Pi<Obj, "hobby" | "age">;
// type Opt = O<Obj, "hobby" | "age">;
// type Opt = R<Opbj>;
type Opt = UnRe<UnReObj>;
```

## infer

- infer(추론) 는 extends 에서만 사용이 가능
