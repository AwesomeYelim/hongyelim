

# typescript 초기세팅

```
yarn init  -y // pakage.json 만들기
yarn add typescript // typescript 설치
npx tsc --init // tsconfig.json 만들기
npx tsc --noEmit // compile 전에 검사하기(에밋 아니고 이밋)
npx tsc // ts -> js 변환
```

# 🚩 놓치고 있던 기본 개념

- typescript는 변수 , 매개변수, 리턴값에서만 type을 지정한다 !
- 타이핑 : 타입을 붙여주는 행위
- type aliase(일명 ~ 라 불리는, 가명) : 'type name = '으로 타입을 지정해주는것

## 다양한 함수 타입 타이핑 케이스

```ts
// 화살표 함수를 블록에 감싸 타입 선언해줄수 있음
const yelimFn: { (x: number, y: number): number } = (x, y) => {
  return x + y;
};

// 함수 하나를 타입형식으로 만들수도 있음
function haha(a: number, b: number): number;
function haha(a, b) {
  return a + b;
}

// 이렇게 안하고 싶으면 앞에 declare 붙여주면 됨(대신 컴파일시 사라짐)
declare function haha(a: number, b: number): number;

// 인자 값 spread 형식 및 분해할당
function rest(a: number, ...arg: number[]) {
  console.log(a, arg);
}

rest(1, 2, 3, 4);

// 번외 배열 재 할당 가능(객체타입이니깐;;)
const arr: [string, number, number] = ["2", 1, 2];
arr[1] = 3;

console.log(arr); // [ '2', 3, 2 ]
```

## tuple 타입 : 다음과 같이 배열 타입을 지정시 사용가능(갯수, 타입 맞춰야함)

```ts
const tutu: [number, number, string] = [123, 123, "name"];
```

## 고정타입(하지만 타입추론됨으로 굳이 안해도됨 const는 어짜피 fix 됨)

```ts
const imture: true = true; // true 로 지정
const five: 5 = 5; // 5 로 지정
const naming: "yelim" = "yelim"; // yelim 로 지정
```

## string 과 String 의 차이점

```
string 은 원시타입이고
String 은 new String()/래퍼 객체 타입임
```

## enum (변수를 한데모아 처리하거나 compile 된 js 코드에서는 없애고 싶을때 사용함)

```ts
// 각자 0,1,2,3 index 가 부여됨
const enum EDirection {
  Up,
  Down,
  Left,
  Right,
}

// 숫자 할당시 다음 숫자로 numbering 됨 3,4,5,6
const enum EDirection {
  Up = 3,
  Down,
  Left,
  Right,
}
```
