# SEO

> Search engine optimization

<img src='cat.png' />

next 알못인 내가 next13으로 블로그를 만들게된 이유는 ssr 을통한 Search engine 의 최적화를 시키기 위해서 였다.

**_next에서 seo 노출에 시도해보자..._**

**네이버 웹마스터나 구글 서치 콘솔을 이용하여 웹사이트 최적화를 하다 보면**

- https://search.google.com/search-console
- https://searchadvisor.naver.com/console/board

sitemap 과 RSS를 제출하는 항목이 있다

> sitemap

sitemap 은 사이트 내의 모든 링크 주소가 담긴 파일이며

> RSS

RSS(Rich Site Summary)는 뉴스나 블로그 등에서 볼 수 있는 콘텐츠를 간략하게 정리해서 보여주는 표현 방식

우선 website를 각각의 포털사이트에 등록 시켜준뒤..

sitemap.xml을 만들어 준다.

- https://www.xml-sitemaps.com/

**사실 나는 위에서 만든거말고 아래의 next 공식문서를 참고하여 만들었음**

(next sitemap 관련 링크)

- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

```ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://hongyelim.vercel.app/",
      lastModified: new Date(),
    },
    {
      url: "https://hongyelim.vercel.app/profile",
      lastModified: new Date(),
    },
    {
      url: "https://hongyelim.vercel.app/posts",
      lastModified: new Date(),
    },
    {
      url: "https://hongyelim.vercel.app/memo",
      lastModified: new Date(),
    },
    {
      url: "https://hongyelim.vercel.app/archives",
      lastModified: new Date(),
    },
  ];
}
```
