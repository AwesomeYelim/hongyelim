# NextJs 에서 svg 이미지 다루기

- next 에서 제공되는 Image와 같은 정적모듈은 svg의 요소를 커스텀할만한 속성을 제공해주지 않는다.

- 나는 dark 모드에는 svg > g > path 의 stroke 속성을 white 로 하려고 svg 모듈을 import 하는 방법을 찾다가 이렇게 글을 남기게 되었다..!

- 우선 사용할 renderer 설치

```sh
yarn add @svgr/webpack
```

- next.config.js 설정

```js
module.exports = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    }); // 주의할점은 webpack 함수 상단에서 처리해줘야함

    return config;
  },
};
```

- 커스텀 하고 싶은 svg 속성을 props로 전달하고 싶다면 svg 값을 다음과 같이 `current` 로 지정해준다.

<img src='./img/b_svgwelcome.png'>

- 그리고 나서 다음과 같이 사용하면 된다.

```jsx
import Welcome from "../../public/images/welcome.svg";

export default async function HomePage() {
  return (
    <div className="welcome_img">
      <Welcome width={200} height={150} stroke="red" />
    </div>
  );
}
```
