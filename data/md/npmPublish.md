# npm 에 내가 만든 공통 모듈 배포해보기

- 지난번 나는 `ellipsis` 를 알아서 처리해주는 공통 함수를 만들었었다.

<https://hongyelim.vercel.app/posts/commonfnEllipsis>

- 이 함수를 다른 프로젝트에 자유롭게 적용할겸 npm 에 publishing 하는것도 알고 싶어서 한번 시도해본다. (✿◠‿◠)

## 진행순서(매우 간단)

1. 우선 npm 사이트에 가서 회원가입을 해준다.
2. 배포할 프로젝트 폴더를 만들고 다음과 같이 입력 => `package.json 생성` 및 `로그인`을 해준다.

```sh
 npm init
 npm login
```

3. package.json

- 나는 그냥 간단하게 우선 생성해봤다.

```json
{
  "name": "react-text-settle", // lib 이름
  "version": "0.0.4",
  "description": "ellipsis && titletag",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "hongyelim",
  "license": "MIT"
}
```

4. 만들어진 파일이 `ts` 파일이라면 배포할 함수 모듈을 `js` 와 `d.ts` 로 분리해 줘야한다.(이건 차차 정돈할 예정..)

![b_npmPublish459](./img/b_npmPublish459.png)

5. 터미널에 해당 root 로 간뒤 다음을 입력

```sh
npm publish
```

- 이름이 겹치는것은 다음과 같이 403 에러가 발생됨으로 미리 홈페이지에서 검색해 보자

![b_npmPublish48](./img/b_npmPublish48.png)

## 버전 업데이트

> 수정한 파일을 `npm` 에 꾸준히 업데이트를 시켜주고 싶다면?

- 우선 버전 업데이트를 시켜준다(Major/ Minor/ Patch) 선택 or 직접 입력

```sh
npm version patch
```

- 다시 배포

```sh
npm publish
```

## 배포한 lib 삭제하고 싶다면??

- 다음 입력 `--f`(다른사람이 설치했다면 사용)

```sh
npm unpublish --f
```

- 그리하여 배포된 <del>내 작고 귀여운</del> 라이브러리..

![b_npmPublish433](./img/b_npmPublish433.png)

- 다음과 같이 사용해줬을때 내 프로젝트엔 잘 적용이 되는데 <del>다른사람의 라이브러리와 중복 적용이 안되는것</del>을 `..차차 고쳐나갈 예정..`

```jsx
import titleCondition from "react-text-settle";
...
    <HeadingTag
      className="heading_group"
      key={children}
      {...style}
      {...titleCondition}
...
```

![b_npmPublish422](./img/b_npmPublish422.png)
