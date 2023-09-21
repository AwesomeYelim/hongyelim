# 03. i18next CustomHooks 만들기

## i18next 에서 제공되는 `<Trans/>` 커스텀 하기

- i18next 에서 제공되는 `t()` 와 `<Trans/>` 이 있지만 다음과 같은 용이함을 지닌 customhook을 만들어야 겠다고 생각이 들었다.

  1. key 값이 명시되어 가독성을 높임
  2. literal 타입추론이 가능해야함
     <img src='./img/b_literaltype.png'/>
  3. 한개의 hook으로 통일
  4. 여러 번역값 사용 및 함수자체 커스텀

## 공통모듈에서의 customhook

- index.ts(customhook 공통 모듈)

```ts
import { t } from "i18next";
import { TransType, UseTrans } from "./useTranslation";

/**  단순 text 만 포함시 */
export const textTrans = <T extends keyof TransType.Ko>({ key, defaultMsg, TagComp, value }: TransType.TransMag<T>) => {
  /** 단순 text 배열로 들어올시 */
  if (typeof key === "object" && key.length > 1) {
    const severalKey = key.map((keyEl) => t(keyEl)).join("");

    return severalKey;
  }
  /** tag 및 가변값 포함시  */
  if (TagComp || value) {
    UseTrans({ key, defaultMsg, TagComp, value });
  }
  return t(key, { defaultValue: defaultMsg });
};
```

## 개별모듈에서 customhook

- useTranslation.tsx

```jsx

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
// eslint-disable-next-line import/extensions
import { FixKo } from './copyKo';

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
    key: T | T[] | string[];
    /** key 가 T[] 으로 들어올시 타입을 Ko[T] 타입이 아닌 string 으로 처리   */
    defaultMsg: T extends B ? ([B] extends [T] ? Ko[T] : string) : Ko[T];
    TagComp?: TransType.TransComp;
    value?: { [key in string]: number | string };
    text?: string;
  }
}

/** tag 및 가변값 포함시  */
export function UseTrans<T extends keyof TransType.Ko>({ key, defaultMsg, TagComp, value }: TransType.TransMag<T>) {
  const { t } = useTranslation();

  /** HTML 태그 가 들어갈 시 Translate 사용하는 Component  */
  if (TagComp) {
    return (
      <Trans
        i18nKey={key}
        defaultsValue={defaultMsg} // JSON 의 key가 없을때 보여주는 메세지
        defaults={TagComp?.defaults} // 받는 key 값의 있고 번역 대상 value가 없을 때 메세지를 보여준다.
        components={TagComp?.components}
        // {...TagComp.compvalue} // tag 와 가변값을 함께 사용
        values={TagComp.compvalue}
      />
    );
  }

  if (value) return t(key, value);
}

```

- 사용방법은 다음을 참조하자..!

- https://hongyelim.vercel.app/posts/i18nextHowtouseCustomhooks
