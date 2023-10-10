# Event listener 에 따른 img 깜박임 현상 해결하기

- react 에서 마우스 오버 이벤트나 스크롤 관련된 이벤트를 통해 이미지를 띄우다 보면 이미지가 깜박거리는 현상을 마주할때가 많다.

## 원인 분석하기

- 원인이라고 생각되는 다양한 이유들이 있는데 다음과 같다.

1. (이벤트 발생에 따른)불필요한 리랜더링

   - 이벤트 발생이후에 이미지 업로드

2. 랜더링 업데이트 주기 불규칙
   - 랜더링 시점이 TTV (Time To View) 랑 맞지않을때(debounce 또는 throttle 이벤트를 사용했을때에도 시점이 안맞을 수 있음)
3. 네트워크 불안정 및 이미지 자체의 비동기설정

## 나 같은 경우에는..

- 다음과 같이 스크롤시 mdviewer 를 통해 랜더링된 이미지가 계속 깜박거리는 현상이 지속이 되었다.

![b_imgOptimization4](./img/b_imgOptimization4.gif)

- 옆에 TOC 에 스크롤 정보(scrollY)를 계속 전달하기 위해 사용한 이벤트 리스너가 1, 2번 문제를 발생시킨것 같았다.

## 시도한 방법들

- 사실 저 위에 1,2,3 [원인 분석하기](#원인-분석하기)들은 여러가지를 시도해보고 내린 결론들이었다.

1. MdfileViewer 내의 TOC 컴포넌트 밖으로 빼네기 (실패)

- TOC 에 스크롤 정보를 전달하면서 MdfileViewer 가 불필요한 랜더링을 한다고 판단 -> 빼냈지만 해결 x

2. throttle 로 감싸주기(실패)

```jsx
const scrollEffect = (e: Event) => {
  e.stopPropagation();
  Object.entries(post).forEach(([key, scrollY], i, arr) => {
    /** 처음 과 끝 부분 */
    if (!i || arr[arr.length - 1]) {
      if (window.scrollY === scrollY || window.scrollY > scrollY) {
        setTarget(key);
      }
    } else if (window.scrollY === scrollY || window.scrollY + 110 > scrollY) {
      setTarget(key);
    }
  });
};

useEffect(() => {
  document.addEventListener("scroll", throttle(scrollEffect, 300)); // throttle

  return () => document.removeEventListener("scroll", throttle(scrollEffect, 300)); // throttle
}, [scrollEffect]);
```

3. img 태그로 변환해서 img 속성중에 decoding 속성 sync 로 주기(실패)

- 예전 회사 프로젝트에서 mouseOver 시에 변경된 이미지로 로드 되었던 이벤트에서 같은 깜박임 현상이 일어났었는데 그때 다음 글을 읽고 `decoding="async"` 속성을 `sync` 로 변경하여 해결했던 경험이 있어서 시도해봤다...

<details>
<summary>참고 사이트 </summary>
<div markdown="1">

https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding

</div>
</details>

4. useCallback으로 감싸 dependency arr 에 target을 넣어 랜더링 시점 맞춰주기 + throttle 과 함께 (성공)

- 로직을 좀변경할 필요를 느꼈다..

```jsx
const scrollEffect = useCallback(() => {
  Object.entries(post).forEach(([key, scrollY], i, arr) => {
    /** 처음 과 끝 부분 */
    if (!i || arr[arr.length - 1]) {
      if (window.scrollY === scrollY || window.scrollY > scrollY) {
        setTarget([key, scrollY]);
      }
    } else if (window.scrollY === scrollY || window.scrollY + 110 > scrollY) {
      setTarget([key, scrollY]);
    }
  });
}, [target[1]]);

useEffect(() => {
  document.addEventListener("scroll", throttle(scrollEffect, 300), { capture: true });

  return () => document.removeEventListener("scroll", throttle(scrollEffect, 300), { capture: true });
}, [scrollEffect]);
```

- 진짜 웃긴거는 배포 환경에서만 깜박거림현상이 있다는 것이였다.. 아마 이전 304에러 때문에 `vercel.json`에 설정해놓은 `no-cache` 때문에 기존 이미지가 캐싱되지 않는것같아서 다음과 같이 다시 수정,.

```json
// vercel.json
{
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

## 해결.. 베리굿 ..
