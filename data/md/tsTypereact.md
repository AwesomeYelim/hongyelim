# react 타입 분석

## react module & tsconfig.json 설정

- import 되어있는 module 을 쫒아서 index.d.ts 를 보면 module 의 종류를 알수 있다.

```ts
export = React; //common.js v
export default ~  // es module
export as namespace React // UMD
```

- common.js 모듈은 module 을 불러오는 형식이 다음과 같지만..

```ts
import * as React from "react";
import React = require("react");
```

- tsconfig.json 에서 다음과 같이 설정이 된다면

```json
"esModuleInterop": true
```

- 다음과 같이 module을 import 해올수 있다.

```ts
import React from "react";
```

**📍 또한 react를 import 해오지 않아도 되는데..(근데 기본적으로 typescript는 jsx문법을 인식하지 못한다는것은 생각해놔야함)**

- tsconfig.json 에서 다음 처럼 변경해주면 삽가능하다.

```json
   "jsx": "react-jsx"
```

## react type 분석

### React.FC/ FunctionComponent

- 굳이 return 값에 대한 타입을 지정하지 않아도 다음과 같이 타입추론 가능(어짜피 JSX.Element or null)

<img src='./img/b_fc1.png' width='500px'/>

- 다음과 같은 구조를 보며 props가 왜 객체로 받는지에 대한 이해도가 더 명확해진다.

```ts
type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
  (props: P, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}
```

- 원래 react18버전 이전까진 children 을 받고 안받고의 여부로 FC/ VFC(VoidFunctionComponent) 가 나뉘어져 있었음 -> 하지만 FC 로 통합됨

  ❓ 만약 FC에서 children을 받고 싶다면 다음과 같이 children type을 지정하는것을 추천드림

  ```ts
  interface Props {
    data?: number;
    children?: ReactNode | undefined;
  }
  ```

## hooks typing

### useState

- 인자값으로 직접 변수를 넣는가 콜백 함수를 넣는가(lazy initialization)

  🚩lazy initialization 에 대해선 다음글 참조

  - lazy initialization 는 복잡한 함수에 대한 초기값에서 리랜더링을 방지하기 위해 사용된다.
    https://yceffort.kr/2020/10/IIFE-on-use-state-of-react

```ts
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
```

### useEffect

**✔ 번외) 다음과 같은 함수가 있을때 'setS()' 함수는 비동기임**

- 비동기인 함수에 await 를 붙여서 동기로 만들수 없다 -> async - await 를 붙일수 있는곳은 return 값이 Promise 인곳만 가능 !!

```ts
export const ReactC: FC<Props> = (p: Props) => {
  const [s, setS] = useState("");

  useEffect(() => {
    setS(() => {
      return "asdasd";
    });
  }, []);
  return <div>asdasd</div>;
};
```

- 또한 useEffect() hook은 type을 살펴보면 return 값이 void로 고정되어있기 때문에 async 자체를 못붙임 ~

```ts
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
```

- 뭐 이런식의 모양은 가능하다고 볼수있다

```ts
useEffect(() => {
  const fuc = async () => {
    await axios.post("http://어쩌구");
  };
  fuc();
}, []);
```

#### ❓그러면 lifeCycle이 끝날때 호출되는 이건 뭐임?

```ts
useEffect(() => {
  console.log("asda?");
  return () => {
    console.log("cleanup");
  };
}, []);
```

#### 다시 타입을 쫒아가보자 ^^

```ts
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
```

- EffectCallback - Destructor type 을 봐보면

```ts
type EffectCallback = () => void | Destructor;
```

```ts
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never }; // 이게 clean up 함수 typing임
```

- 그렇기 때문에 cleans up 함수에 return 값 쓰면 에러나쥬?

<img src='./img/b_hook.png' width='500px'>

#### 번외)) Destructor 위에 쓰인 unique symbol 이라는건 뭘까

✔ unique symbol : Symbol() 타이핑하는 방법

```ts
declare const UNDEFINED_VOID_ONLY: unique symbol; // ✔
// Destructors are only allowed to return void.
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
```

#### 번외)) branding 기법

- ts 에는 branded type 이라는게 있다.

ex ) 예를 들어... 다음과 같은 euro 를 usd 달러 로 단위환산을 해주는 함수가 있다고 하자

```ts
const usd = 10;
const eur = 10;
const krw = 2000;
function euroToUsd(euro: number): number {
  return euro * 1.18;
}

console.log(`USD : ${euroToUsd(eur)} `); // 📍 근데 만약 여기에 euroToUsd(krw) 이런식으로 인자값을 잘못 넣어준다면 ??
```

- number는 원시 값이기 때문에 값이 잘못 들어갈 경우를 대비한 branded type(가상속성) 이 필요하다.

  다음과 같이 지정이 가능하다

  ```ts
  type Brand<K, T> = K & { _brand: T };

  type EUR = Brand<number, "EUR">;
  type USD = Brand<number, "USD">;
  type KRW = Brand<number, "KRW">;

  const usd = 10 as USD;
  const eur = 10 as EUR;
  const krw = 2000 as KRW;
  function euroToUsd(euro: EUR): number {
    return euro * 1.18;
  }

  console.log(`USD : ${euroToUsd(eur)} `); // euroToUsd 인자 값으로 branded type 'EUR' 만 가능함
  ```

  [다시useEffect_type을 가보자](#다시-타입을-쫒아가보자)

  ```ts
  function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  ```

  - 다음과 같은 인자값 deps의 타입 DependencyList를 쫒아가 보면

  ```ts
  type DependencyList = ReadonlyArray<unknown>; //읽기전용 arr
  ```

  - 다음과 같다고 보면됨

  ```ts
  const depth: readonly [] = [];
  useEffect(() => {
    console.log("asda?");
  }, depth); // 원래는 context inference(문맥적 추론) 에 의해서 자연스레 ReadonlyArray<unknown> 라고 추론되는거임
  ```

### useCallback

- 다음과 같은 useCallback error가 있다

<img src='./img/b_usecallback.png' width='500px'>

- parameter 타입에 error가 발생한다.. 타입을 까보자

```ts
function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
```

- react 18버전 이전의 타이핑(이때는 any 로 지정되어 있어서 error는 안남)

```ts
function useCallback<T extends (...arg: any[]) => any>(callback: T, deps: DependencyList): T;
```

- 그러면 parameter 를 타이핑 해주어야 함

```ts
const call = useCallback((e: MouseEvent<HTMLDivElement>) => {
  // 내장된 MouseEvent 사용시 error 뜸으로 반드시 !! react 에 지정되어있는  MouseEvent module type을 사용하기 => import { FC, MouseEvent, ReactNode, useCallback, useEffect, useState } from "react";

  return <div></div>;
}, []);
```

### useRef

- useRef 의 타입을 보면 3개가 overloading 되어있다.

```ts
function useRef<T>(initialValue: T): MutableRefObject<T>; // 1
function useRef<T>(initialValue: T | null): RefObject<T>; // 2
function useRef<T = undefined>(): MutableRefObject<T | undefined>; // 3
```

- 우리가 흔히 쓰는 element 에 달기위한 ref를 만들기 위해서는 2번 타입과 연결 해줘야한다.

```ts
export const ReactC: FC<Props> = (p: Props) => {
  const divRef = useRef<HTMLDivElement>(null); // ✔
  const inputRef = useRef(0);

  const call = useCallback((e: MouseEvent<HTMLDivElement>) => {
    return <div></div>;
  }, []);

  useEffect(() => {
    inputRef.current += 1;
  }, []);
  return (
    <div onClick={call} ref={divRef}>
      <input />
    </div>
  );
};
```

- 그렇기 위해서는 generic 을 명시해주고 초기값을 null 로 설정해 주어야함

  ❓ 왜

  ```ts
  function useRef<T>(initialValue: T | null): RefObject<T>;
  interface RefObject<T> {
    readonly current: T | null;
  }
  type RefCallback<T> = { bivarianceHack(instance: T | null): void }["bivarianceHack"];
  type Ref<T> = RefCallback<T> | RefObject<T> | null;
  ```

  - 왜냐면 2번타입은'initialValue' 의 타입이 T | null 로 더 좁은 범위(반공변성)로 지정되어있기 때문에 초깃값을 null 로 할지라도 하나의 T 타입을 따라가는 거임

  - 만약에 초깃값을 이런식으로 넣어준다면? => [2번 타입](#useref)으로 표기됨

  ```ts
  const divRef = useRef<HTMLDivElement>(document.querySelector("div"));
  // (alias) useRef<HTMLDivElement>(initialValue: HTMLDivElement | null): React.RefObject<HTMLDivElement> (+2 overloads)
  ```

  - 하지만 '!(NonNullable assertion)'을 걸어주게 되면 => [1번 타입](#useref)으로 표기됨

  ```ts
  const divRef = useRef<HTMLDivElement>(document.querySelector("div")!);
  // useRef<HTMLDivElement>(initialValue: HTMLDivElement): React.MutableRefObject<HTMLDivElement> (+2 overloads)
  ```

- 1번 타입은 리랜더링을 방지하기 위한 state 로 만들때 사용

## class components typing

- 다음과 같은 구조가 있음

```ts
import { Component, FormEvent } from "react";

interface P {
  name: string;
  title: string;
}
interface S {
  word: string;
  value: string;
}
class RC extends Component<P, S> {
  state = {
    name: "yelim",
    value: "",
    result: "",
    word: "",
  };

  onSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    this.setState({ value: "" });
  };
}
```

- extends 된 Component 타입을 따라가보자

```ts
interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}
class Component<P, S> {
  static contextType?: Context<any> | undefined;

  constructor(props: P, context: any);
  setState<K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | null) | (Pick<S, K> | S | null),
    callback?: () => void
  ): void;

  forceUpdate(callback?: () => void): void;
  render(): ReactNode;

  readonly props: Readonly<P>;
  state: Readonly<S>;

  refs: {
    [key: string]: ReactInstance;
  };
}
```

- 다음 부분이 가능하게 된 이유를 살펴보자

```ts
onSubmitForm = (e: FormEvent) => {
  e.preventDefault();
  this.setState({ value: "" }); // state 의 프로퍼티가 필수적으로 들어가지 않아도 error 가 나질않음
};
```

❓ 왜 그럴까

- 'Pick<S, K> | S | null' 이부분에서의 지정된 타입때문에

```ts
setState<K extends keyof S>(
state: ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | null) | (Pick<S, K> | S | null),
callback?: () => void

): void;
```

#### ReactElement 와 ReactNode

- 다음과 같이 [class render](#class-components-typing)의 return type은 ReactNode 이지만 [FunctionComponent](#reactfc-functioncomponent) 의 return type은 ReactElement이다

```ts
// -----class--------------------
 render(): ReactNode;

// -----FunctionComponent---------
 (props: P, context?: any): ReactElement<any, any> | null;
```

- ReactNode 타입을 따라가 보면 ReactNode 는 ReactElement 를 포괄한다.(더욱 다양한 type의 return 값을 가질수 있다.)

```ts
type ReactNode =
  | ReactElement
  | string
  | number
  | Iterable<ReactNode>
  | ReactPortal
  | boolean
  | null
  | undefined
  | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES];
```

- 그렇기 때문에 다음과 같은 구조도 가능

```ts
import { Component, FormEvent } from "react";

interface P {
  name: string;
  title: string;
}
interface S {
  word: string;
  value: string;
}

class RC extends Component<P, S> {
  state = {
    name: "yelim",
    value: "",
    result: "",
    word: "",
  };

  onSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    this.setState({ value: "" });
  };

  render() {
    return "hello";
  }
}

export const A = () => {
  return <RC name="myname" title="test" />;
};
```
