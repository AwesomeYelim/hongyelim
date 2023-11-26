# vs code 에서 Paste Image 사용하기

## 내가 느낀 불편사항

- vs code 에서 마크다운 파일을 작성하다보면 이미지 삽입이 굉장히 번거로움을 느낄수 있다.

- 이런 상황에 굉장히 유용한 plugin 을 발견하게 되는데.. 그것은 <mark style="background-color:pink">**Paste Image**</mark> 이다...

## 어떤점이 편리할까 ?

- [기존] 캡쳐 -> img 폴더에 img 넣기 -> md 파일에 img 태그 삽입
- [현재] 캡쳐 -> md 파일에 붙여넣기(alt + ctrl + v) 끝

## 어떻게 진행할수 있을까

### 01. Paste Image 다운

![b_pluginPasteimage59](./img/b_pluginPasteimage59.png)

- 우선 Paste Image 을 다운 받아준후.. 설정쪽을 커스텀 해주자

### 02. Paste Image setting customization

```json
{
  "pasteImage.defaultName": "${currentFileNameWithoutExt}hms", // 기본 이미지 파일 이름
  "pasteImage.basePath": "${projectRoot}", // 이미지 URL의 기본 경로
  "pasteImage.path": "${currentFileDir}/img", // 이미지 파일을 저장할 대상
  "pasteImage.namePrefix": "", // 이미지 파일 이름 앞에 추가되는 문자열
  "pasteImage.forceUnixStyleSeparator": true, // 파일 구분 기호 스타일을 유닉스 스타일로 강제 설정
  "pasteImage.insertPattern": "![${imageFileNameWithoutExt}](./img/${imageFileName})", // 텍스트에 붙여넣을 문자열의 패턴
  "pasteImage.prefix": "/", // 문자열은 붙여넣기 전에 확인된 이미지 경로 앞에 추가됨
  "pasteImage.filePathConfirmInputBoxMode": "onlyName", // 붙여넣기전 이름 확인
  "pasteImage.showFilePathConfirmInputBox": true // 붙여넣기전 경로 확인
}
```

- 나머지 부분(변수 지정하는 법)은 아래 사이트를 참고하자 !

<https://bepyan.github.io/blog/nextjs-blog/6-images-use-in-vscode>

## 생각했던것들

- 나는 각 디렉토리내의 img 폴더내의 `md파일이름_{unique 값}`(`${currentFileNameWithoutExt}hms` ) 으로 저장시켜 줄 생각이었음

- `${currentFileNameWithoutExt}hms` `hms` 부분에서 `index`을 써도 유니크 값으로 네이밍이 되지만 시분초단위로 끊는게 더 단순할거 같아서 `hms` 를 넣어주었음

- 계속.. 절대경로가 포함되어 붙여넣어 지길래 계속 삽질하다가 발견한것이 `"pasteImage.namePrefix": "",` 이놈을 초기값으로 설정해 주지 않아서였다^^.. 아무도 나처럼 해매지 않길바란다...

<details>
<summary>참고 사이트 </summary>
<div markdown="1">

<https://marketplace.visualstudio.com/items?itemName=mushan.vscode-paste-image>

</div>
<div markdown="2">

<https://bepyan.github.io/blog/nextjs-blog/6-images-use-in-vscode>

</div>
</details>
