# ellipsis + titletag 공통 함수 만들기

## 일일이 처리하기 귀찮은 부분

---

- 테이블이나 여러 고정된 width 값에 담긴 text 들을 보면 여러 잘리는 현상들을 많이 마주하게 되는데..
- 그럴때마다 css 에 다음과 같은 속성을 추가해 주어야 말줄임표(...)로 사용이 가능하다.

```css
 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

- 게다가 그런 부분에 생략된 부분을 보여줘야하는 title tag 까지 넣어주어야 하는데.. 이런 고민을 한방에 처리해줄 함수를 만들기로 한다.
  (나 같은 경우에는 일본어 번역시에 튀어나오는 텍스트를 처리해 주어야 해서 i18n의 언어로 분기처리가 되어있다.)

## 우선 다음과 같은 부분을 생각해보아야한다.

---

1. overflow 의 여부 는 어떻게 알수 있는가 => e.clientWidth < e.scrollWidth 부분이 overflow 되어있다는 부분..

2. 화면에 랜더링 되기 이전에 overflow 의 여부가 확인 되어야함

3. onMouseOver 시에 title 태그가 확인되어야함

4. 안에 children 이 있을 경우 내부 text를 추적해서 적용해줘야함

## 결과 코드

---

```ts
import i18n from "locales/i18n";

export interface TitleEl extends Element {
  clientWidth: number;
  scrollWidth: number;
  title: string;
  innerText: string;
  children: HTMLCollectionOf<Element>;
}

export type TitleType = {
  ref: (e: HTMLDivElement | HTMLAnchorElement | null) => void;
  style?: React.CSSProperties;
};

const ellipsisStyle = (e: HTMLDivElement) => {
  e.style.overflow = "hidden";
  e.style.textOverflow = "ellipsis";
  e.style.whiteSpace = "nowrap";
  e.style.display = "block";
  e.title = e.innerText;

  return e;
};

/** children 이 있을경우 */
const depth = (currentTarget: TitleEl) => {
  if (currentTarget) {
    const { clientWidth, scrollWidth, children } = currentTarget;

    if (!children?.length && currentTarget?.innerText && clientWidth < scrollWidth) {
      ellipsisStyle(currentTarget as HTMLDivElement);
    } else {
      Array.prototype.filter.call(children, (el: TitleEl & HTMLCollectionOf<Element>) => depth(el));
    }
  }
};

/** 글자 width 값을 연산하여 ellipsis (...) 적용 및 title 태그를 반영해준다 */
export const titleCondition: TitleType = {
  ref: (e) => {
    if (e && i18n.language !== "ko") {
      const { children } = e;

      if (!children.length) {
        if (e.clientWidth < e.scrollWidth) {
          ellipsisStyle(e as HTMLDivElement);
        }

        // 화면에 딱 맞는 경우 flex 적용
        if (e.clientWidth === e.scrollWidth) {
          ellipsisStyle(e as HTMLDivElement);
        }
      } else {
        depth(e);
      }
    }
  },
};
```

## 이렇게 사용

---

- 다음과 같이 텍스트를 바로 감싸고 있는 element에 사용이 가능하다.

```js
<div className="title" {...titleCondition}>
  텍스트 어쩌구
</div>
```
