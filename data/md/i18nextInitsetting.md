# 01. i18next setting

## react-i18next 선택이유

---

    - 기존 cce에서 사용된 다국어번역 라이브러리인 react-intl 보단 react-i18next 더 범용적으로 사용되며, 여러가지 상황에 대응이 잘되어있음 (ex) 번역파일에 key값 없을시, 나오는 텍스트, 키값 추가시 감지라이브러리(parser) 모듈 제공 등등 

  <img src='./img/b_pakagesetting.png' />

```
yarn add i18next && react-i18next &&  i18next-browser-languagedetector && i18next-http-backend
```

## package 별 기능

---

- i18next : 주된 패키지
- react-i18next : react에서 지원되는 라이브러리 세팅
- i18next-browser-languagedetector : 브라우저내 언어 자동 탐지
- i18next-http-backend : 파일을 비동기식으로 로드하기위한 http

## 기본 세팅 과정

1. 최상단에 locales 폴더 생성후 국가별 폴더를 생성

2. 초기세팅 과정

   - i18n.ts 파일 생성

   ```ts
   import i18n from "i18next";
   import { initReactI18next } from "react-i18next";
   import detector from "i18next-browser-languagedetector";
   import backend from "i18next-http-backend";
   import { getCookie, setCookie } from "common/functions";

   import ko from "./ko/translation.json";
   import ja from "./ja/translation.json";

   /** react-i18 next versions 11.11.0 보다 높은 경우 세팅 해줌  */
   declare module "react-i18next" {
     interface Options {
       defaultNS: "ko";
       resources: {
         ko: typeof ko;
         ja: typeof ja;
       };
     }
   }
   export const localLang = localStorage.getItem("i18nextLng");

   /** body class 언어설정 및 cookie 삭제시 초기 설정 */
   export const changeClass = () => {
     const cookieLang = getCookie("lang");
     if (localLang) document.body.classList.add(i18n.language);

     if (!cookieLang || cookieLang === "null") {
       setCookie("lang", localLang === "ko-KR" ? "ko" : (localLang as string));
     }
   };

   i18n
     .use(backend)
     .use(detector)
     .use(initReactI18next)
     .init({
       resources: {
         ko: { translation: ko },
         ja: { translation: ja },
       } as const,
       fallbackLng: "ko",
       // lng: 'ko', /** default language -> 언어변환을 하여도 localStorage에 i18nextLng 값으로 'ko'가 들어감 - 예림 */
       ns: ["translation"],
       returnNull: false,
     });

   export default i18n;
   ```

- 최상단 index.tsx 파일에서 다음과 같이 감싸준다.

```ts
<I18nextProvider i18n={i18n}>
  <App />
</I18nextProvider>
```

3. ui 구성(언어 변환 컴포넌트)

- 언어를 변환하는 컴포넌트(PopOverMyInfo.tsx)에서 언어 선택 select box 그리기 🐧
- 언어 변환만 관련코드로 요약하자면 다음과 같다.

```jsx
import React, { useEffect, useState } from "react";
import { textTrans } from "common/hooks";
import { localLang } from "locales/i18n";
import i18next, { t } from "i18next";

export const PopOverMyInfo = () => {
  const [lang, setLang] = useState("ko");
  const langList = [
    { title: t("ss_39", "한국어"), value: "ko" },
    { title: t("ss_40", "일본어"), value: "ja" },
  ];

  /** popover 오픈시 localStorage에 있는 언어세팅 / 없으면 browser 언어반영  */
  useEffect(() => {
    let lang = localLang;
    if (localLang === "ko-KR") {
      lang = "ko";
    }
    i18next.changeLanguage(lang as string);
    setLang(lang as string);
  }, []);

  return (
    <Select
      className="lang__select"
      options={langList}
      selected={langList.find((item) => item.value === lang)}
      onChange={(selected) => {
        let { value } = selected;
        value = value as string;
        setLang(value);
        i18next.changeLanguage(value);
        localStorage.setItem("i18nextLng", value);
        /**interceptor 컴포넌트의 cookies에 세팅될수 있도록 reload 해준다 -예림 */
        window.location.reload();
      }}
    />
  );
};
```

4. 번역 적용 기본 동작원리

   1. PopOverMyInfo 컴포넌트에서 언어변경시 localStorage에 언어세팅
   2. index 에 감싸져있는 I18nextProvider 컴포넌트가 기본 제공되는 http 통신을 통해 전역적으로 작용
   3. Interceptor 컴포넌트에서 localStorage 에 세팅되어있는 language 추출 및 쿠키에 세팅해줌 -
   <!-- 4. logout 시 현사용자가 선호하는 언어(일반적으로 브라우저 UI의 언어) -> navigator.language 로 세팅(기획에 따라 반영옵션) -->

## 고려해야하는 사항들

    - react-i18next에서 제공되는 기능은 hook이기 때문에 제공된 모듈을 이용한 custom hook을 만들어서 관리를 해야함
    - init 속성의 lng 은 default 속성으로 localStorage의 i18nextLng은 변경되지않음

## Trans components 모듈 타입 이해하기

```ts
type TransChild = React.ReactNode | Record<string, unknown>;
export type TransProps<
  K extends TFuncKey<N, TKPrefix> extends infer A ? A : never,
  N extends Namespace = DefaultNamespace,
  TKPrefix = undefined,
  E = React.HTMLProps<HTMLDivElement>
> = E & {
  children?: TransChild | TransChild[];
  components?: readonly React.ReactElement[] | { readonly [tagName: string]: React.ReactElement };
  count?: number; // 가변값 추가 가능
  context?: string;
  defaults?: string;
  i18n?: i18n;
  i18nKey?: K | K[];
  ns?: N;
  parent?: string | React.ComponentType<any> | null; // used in React.createElement if not null
  tOptions?: {};
  values?: {};
  shouldUnescape?: boolean;
  t?: TFunction<N, TKPrefix>;
};

export function Trans<
  K extends TFuncKey<N, TKPrefix> extends infer A ? A : never,
  N extends Namespace = DefaultNamespace,
  TKPrefix extends KeyPrefix<N> = undefined,
  E = React.HTMLProps<HTMLDivElement>
>(props: TransProps<K, N, TKPrefix, E>): React.ReactElement;
```

```tsx
<Trans
  i18nKey="main.header.asset.me_5" // key 값
  defaultsValue="삭제하시겠습니까 ㅋㅋㅋ?" // 동일 문자 명시하는것
  defaults="are you sure to delete ㅋㅋㅋ?" // 번역 -> 일치키 없을시 대체되는 문자
  components={{ 1: <p style={{ color: "red", fontWeight: 300 }} /> }}
/>
```
