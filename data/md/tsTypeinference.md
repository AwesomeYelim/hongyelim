# 타입 추론 Type Inference 에 대하여..

## 타입 추론이란 ?

프로그래밍 언어에서 변수 또는 표현식의 타입을 명시적으로 선언하지 않고 컴파일러가 컨텍스트를 통해 타입을 유추하여 결정하는 기능이다.

## 타입 추론을 활용하면 좋은이유 !

- 타입추론을 활용하면 다음과 같은 이점들이 있다.

1. 간결한 코드 작성
2. 변경 관리 용이성
3. 재사용성 및 확장성
4. 동적 타입 언어에서 정적 타입 효과
5. 재사용성 및 확장성

## 나는 어떻게 활용을 하였나...

### 1. 사용 동기

- 다음과 같은 번역 작업에서 자동 literal 추론 뿐만 아닌 JSON 파일의 value 와 맞지 않는 텍스트를 골라내기 위해서 타입추론 을 십분 활용해야겠다고 생각했다.

- https://hongyelim.vercel.app/posts/i18nextCustomHooks

### 2. copyKo.d.ts 생성

- 우선 sheetDownloader.ts 가 실행될때 참조할 copyKo.d.ts 를 따로 생성해준다.

```js
// literal type 추론 적용
if (strLang === "ko") {
  fs.writeFile(
    `src/common/hooks/copyKo.d.ts`,
    `export declare const FixKo = ${JSON.stringify(jsonLang, null, 3)} as const`,
    (err) => console.log(err)
  );
}
```

> 왜 `/locales/ko/translation.json` 파일 로는 추론이 안되나...?

    - json 을 import 시키면 다음과 같이 컴파일러가 literal 속성이 아닌 string 으로 타입을 간주해버린다..

<img src='./img/b_typeinfer01.png'>

> 참고사항 ✨

    뒤에 `as const` 로 지정하면 다음과 같이 properties 들이 readonly 로 변하게 되어 literal 그대로 타입이 적용된다.

  <img src='./img/b_typeinfer02.png'>

### 3. copyKo.d.ts 활용

- 그렇다면 이제 key 값을 generic으로 받아서 value 값을 유추해보도록 하자.

```ts
import { FixKo } from "./copyKo";

export declare namespace TransType {
  type Ko = typeof FixKo;
  interface TransComp {
    defaults?: string;
    compvalue?:
      | {
          count?: number | string;
          context?: number | string;
        }
      | { readonly [key: string]: number | string };
    components: { [key in string]: JSX.Element };
  }

  interface TransMag<T extends keyof Ko, B = T> {
    key: T | T[] | string[]; // 2. key는 KO 를 참조한 키값을 가진다. => (중간에 배열로 들어오는 상황 또한 고려)
    defaultMsg: T extends B ? ([B] extends [T] ? Ko[T] : string) : Ko[T]; // 3. [B] extends [T] 이부분은 key 가 T 인지 (T[] | string[]) 인가로 T의 타입을 유추하는 부분이다. - 분배법칙을 통해 배열인지 아닌지 구분점을 넣어놓음.
    TagComp?: TransType.TransComp;
    value?: { [key in string]: number | string };
    text?: string;
  }
}

//  1. 다음과 같이 keyof TransType.Ko 에 참조된 키값을 받는다.
export function UseTrans<T extends keyof TransType.Ko>({ key, defaultMsg, TagComp, value }: TransType.TransMag<T>) {
  // .....
}
```

- 이런식으로 타입을 지정하게 되면 단일 key 값을 받을때에는 다음과 같이 타입을 유추할 수 있다.

<img src='./img/b_typeinfer03.png'>
