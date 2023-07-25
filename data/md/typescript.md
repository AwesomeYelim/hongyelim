# 어려운 개념

### 🚩 never 의 분배법칙

- never는 공집합이라 distributed 가 적용되지 않음
- union 과 generic 이 만나면 분배법칙이 실행됨

> 참조 - https://www.typescriptlang.org/ko/docs/handbook/2/conditional-types.html

- 일반적으로 분산성이 원하는 동작
  => 이러한 동작을 방지하려면 extends 키워드의 양 옆을 대괄호로 감싸면 됨

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;

type StrArrOrNumArr = (string | number)[];
```

### 🚩 잉여 속성 검사 원리 이해하기

> https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B0%9D%EC%B2%B4-%ED%83%80%EC%9E%85-%EC%B2%B4%ED%82%B9-%EC%9B%90%EB%A6%AC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0

### 🚩 프로그래밍 언어의 공변성(영어: Covariance)과 반공변성(영어: Contravariance)

    프로그래밍 언어가 타입 생성자(영어: type constructor)에 있어
    서브타입을 처리하는 방법을 나타내는 것으로,
    더 복잡한 타입간의 서브타입 관계가 타입 사이의 서브타입 관계에 따라 정의되거나,
    이를 배반해 정의됨을 가리킨다.

- 변성의 종류

1. 공변성 : A -> B 일때 T<A> -> T<B>인 경우
2. 반공변성 : A -> B 일때 T<B> -> T<A>인 경우
3. 이변성 : A -> B 일때 T<A> -> T<B> 도 되고 T<B> -> T<A> 도 되는 경우
4. 불변성 : A -> B 일때 T<A> -> T<B> 도 되고 T<B> -> T<A> 도 안되는 경우

- 함수의 매개변수는 반공변적이고, 리턴값은 공변적
  공변적인것 끼리는 -> 합집합이 됨
  반공변적인것 끼리는 -> 교집합이 됨

```ts
// 간단히 얘기해서 매개변수는 넓은 타입 => 좁은타입 / 리턴값은 좁은타입 => 넓은타입 으로 할당이 가능하다

type Union<T> = T extends { a: infer U; b: infer U } ? U : never; // 합집합 U = 1 | 2 | 3
type Result1 = Union<{ a: 1 | 2; b: 2 | 3 }>;

type IntersectionM<T> = T extends {
  a: (pa: infer U) => void;
  b: (pb: infer U) => void;
}
  ? U
  : never; // 교집합  U = 2

type Result2 = Intersection<{ a(pa: 1 | 2): void; b(pb: 2 | 3): void }>;
```

#### ❓ 왜 매개 변수 타입은 더 넚은 타입으로 지정하게 되었을까?

- 타입보다 적은 범위의 인자를 받으면 함수는 누락된 타입을 보장 할 수 없음 -> 타입 세이프(type safe) 하지 못함

* 지연평가 개념(지연 평가. 평가 흐름이 위에서 아래로(↓) 흐른다.)
  https://inpa.tistory.com/entry/LODASH-%F0%9F%93%9A-%EC%A7%80%EC%97%B0-%ED%8F%89%EA%B0%80-%EC%9B%90%EB%A6%AC-lodash%EB%8A%94-%EC%98%A4%ED%9E%88%EB%A0%A4-%EC%84%B1%EB%8A%A5%EC%9D%B4-%EC%A2%8B%EC%9D%84-%EC%88%98-%EC%9E%88%EB%8B%A4#thankYou

- 지연평가 때문에 발생되는 문제

```ts
// return 값의 타입(conditional type)을 가장 늦게 평가하기때문에 컴파일시 오류범위에 걸리게 된다.

function double<T extends string | number>(x: T): T extends string ? string : number {
  return x;
}

// 해결방법(type assertion 대신한 방법)

function double<T extends [T] extends [string] ? string : number>(x: T): [T] extends [string] ? string : number {
  return x;
}
```
