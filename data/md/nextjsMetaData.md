# meta Data 를 설정해보자

- nextjs 프로젝트 에서 meta data 설정시,, 경로 문제라던가, 캐싱문제라던가 조금의 난관이 있었어서 이렇게 기록을 해본다.

> meta data 란..?

- 정보의 특성과 속성을 설명하는 데이터이다. 웹 개발과 관련된 맥락에서는 주로 웹 페이지나 앱에 대한 정보를 설명하는 데이터를 가리킨다.

- 메타 데이터는 일반적으로 다음과 같은 정보를 포함한다.

  1. Title: 웹 페이지나 문서의 제목을 낸다. 이것은 페이지의 제목 바에 나타나거나 브라우저 탭에 표시된다.

  2. Description: 웹 페이지나 문서에 대한 간단한 설명을 제공한다. 검색 엔진에서 검색 결과에 표시되기도 한다.

  3. Keywords: 검색 엔진 최적화 (SEO)를 위해 사용되며, 웹 페이지의 내용을 요약하는 키워드나 구를 포함한다.

  4. Icon: 웹 페이지의 아이콘을 나타내며, 브라우저 탭이나 북마크에서 사용된다. 주로 파비콘(Favicon)이라고 불린다.

  5. Open Graph (og): 소셜 미디어에서 웹 페이지를 공유할 때 사용되며, 제목, 설명, 이미지 URL 등의 정보를 포함한다. 미리보기 이미지를 지정하는 데 사용된다.

  6. Language: 웹 페이지의 언어를 지정한다. 검색 엔진은 웹 페이지의 언어를 인식하여 검색 결과에 표시한다.

  - 그 밖에도 Twitter Card, Authorship, Robots Directives 등이 있다.

메타 데이터는 주로 HTML 문서의 `<head>` 섹션에 `<meta>` tag를 사용하여 정의된다. 이러한 메타 데이터는 검색 엔진 최적화 (SEO), 소셜 미디어 공유, 웹 페이지 미리보기 및 웹 페이지의 기타 특성을 제어하고 개선하는 데 사용된다.

- meta tag 내의 특성에 따라 상대경로, 절대경로를 사용해줘야 하는 것을 고려하지 못해 조금해맸다.

- next 에서는 정적 리소스가 캐싱되는 것을 막기위해 동적 경로를 그때마다 생성해주는 함수를 만드는것을 권장하는데.. 굳이 그럴필요까지 없을것 같아서 아래와 같이 상대경로, 절대경로로 설정해 주었다.

> <https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image>

```ts
export const metadata: Metadata = {
  title: "hongyelim",
  description: "this is yelim blog :)",
  icons: {
    shortcut: "/images/favicon.png", // public 내의 images 파일 => 상대경로
  },
  openGraph: {
    title: "YelimBlog",
    images: "https://hongyelim.vercel.app/images/main.jpg", // 배포이후 빌드된 사이트 주소로 입력해 주어야함 => 절대경로
  },
};
```
