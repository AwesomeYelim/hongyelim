# 02. i18next 사용 + google sheets 연동하기

## 왜 google sheets 연동화 작업이 필요했을까 ?

- 우선 지난 프로젝트를 겪으며 번역작업에 있어서 같은 과정을 여러번 반복하게 되는 과정을 겪었었다.

- 예를 들면

  - devops 에서 번역요청 -> ui 텍스트 수정 -> devops 에서 수정확인 및 재요청
  - devops 에서 번역요청 -> ui 텍스트 누락 -> devops 에 텍스트 번역요청 -> ui 쪽에 전달 -> ui 반영및 devops 전달...

- 뭐 이것보다 더 많은 사례들이 있어서 무조건 googlesheet 로 연동 시켜서 협업하기 용이하게 만들어야겠다고 생각했다..

## google sheets 토큰 및 auth 발급

- Google Sheets를 다른 시스템이나 애플리케이션에 연동하면 Google Sheets API를 사용하여 데이터를 읽고 쓸 수 있다.

- google sheets 를 연동하려면 다음과 같은 3가지가 필요하다.

1. GOOGLE_SERVICE_ACCOUNT_ID
2. GOOGLE_SERVICE_ACCOUNT_EMAIL
3. GOOGLE_PRIVATE_KEY

- 다음과 같은 과정을 진행해주자.

1. Google Cloud Platform 설정:

Google Cloud Console(https://console.cloud.google.com)에 로그인하고 새 프로젝트를 만든다.
만든 프로젝트를 선택하고 "Google Sheets API"를 활성화 한다.

2. API 키나 OAuth 2.0 클라이언트 ID 생성:

프로젝트 설정에서 "사용자 인증 정보"로 이동하여 API 키나 OAuth 2.0 클라이언트 ID를 생성한다.

3. 권한 설정:

Google Sheets에 대한 읽기/쓰기 권한을 설정하려면 API 키나 OAuth 2.0 클라이언트 ID에 대해 권한을 설정한다. => sheet 에서 설정 가능함.

4. API 사용:

- sheetDownload.ts 파일 생성(삭제기능과 ui => sheet 업데이트 기능은 혼선이 올거 같아 삭제함)

```ts
import fs from "fs";
import * as path from "path";
import google from "google-spreadsheet";
// import prettier from 'prettier'
import dotenv from "dotenv";
import ko from "../ko/translation.json";
import ja from "../ja/translation.json";

// google-spreadsheet => Json 연동
async function Downloader() {
  // 서버실행 이전에 env path -> 개발환경으로 설정, env file 을 호출
  dotenv.config({ path: ".env.development", override: true });

  // google Spreadsheet id
  const doc = new google.GoogleSpreadsheet(process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_ID as string);

  await doc.useServiceAccountAuth({
    client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
    private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY as string,
  });

  await doc.loadInfo();
  const sheet1 = doc.sheetsByIndex[0]; // WorkSheet1 선택
  const rows = await sheet1.getRows();
  const sheetHeader = doc.sheetsById[0].headerValues; // WorkSheet1 header
  const trimHeader = [...sheetHeader].splice(1, sheetHeader.length - 1); // 'ss_numbering' 부분 제외
  // console.log(sheetHeader); // :FIXME api headerValues 가 [] 로 올때가 있음 - 추후 수정

  const langArr = [ko, ja];

  const headers = langArr.map((langVar, i) => {
    return { [trimHeader[i]]: langVar };
  });

  type IS = { [key in string]: string };

  headers.forEach((_, i) => {
    const sheetLang: IS = {};
    let jsonLang: IS = {};
    const [strLang, objLang]: [string, IS] = [trimHeader[i], langArr[i]];

    rows.forEach((row) => {
      // 각 header 부분의 value 를 객체 형식으로 만들어줌
      sheetLang[row.ss_numbering] = row[strLang];
    });

    // 각각의 언어 파일내 추가된 key의 여부를 확인
    const addKeys = Object.keys(sheetLang).filter((key) => !Object.keys(objLang).includes(key));

    // value 값이 수정된 경우
    const differValues = Object.entries(sheetLang).filter(([key, value]) => objLang[key] !== value);

    // // key 또는 value 값이 삭제된 경우
    // const deleteProps = Object.entries(objLang).filter(
    //   ([key, value]) => !Object.keys(sheetLang).includes(key) || !Object.values(sheetLang).includes(value)
    // );

    // 추가된 키가 있거나 && 수정사항 발생시 && 삭제된 사항이 있을시 파일 수정 실행
    if ((addKeys && addKeys.length) || (differValues && differValues.length)) {
      jsonLang = { ...sheetLang };
      // // 삭제된 key 가 있는경우
      // if (deleteProps.length) {
      //   deleteProps.forEach(([key]) => {
      //     delete jsonLang[key];
      //   });
      // }

      // 추가된 키가 있는경우
      if (addKeys.length) {
        addKeys.forEach((key) => {
          jsonLang[key] = sheetLang[key];
        });
      }
      // 수정된 값이 있는경우
      if (differValues.length) {
        differValues.forEach(([key, value]) => {
          jsonLang[key] = value;
        });
      }

      fs.writeFile(
        path.join(`src/locales/${strLang}/translation.json`),
        // prettier.format(JSON.stringify(jsonLang), { filepath: `src/locales/${strLang}/translation.json` }),
        JSON.stringify(jsonLang, null, 3),
        (err) => console.log(err)
      );

      // literal type 추론 적용
      if (strLang === "ko") {
        fs.writeFile(
          `src/common/hooks/copyKo.d.ts`,
          `export declare const FixKo = ${JSON.stringify(jsonLang, null, 3)} as const`,
          (err) => console.log(err)
        );
      }
    }
  });
}
Downloader();
```

5. script 설정

- package.json 에 다음과 같이 sheetDownloader.ts 실행 스크립트를 넣어주었다.
- Google Sheets 업데이트 발생시에 `yarn sheet:download` 해주면 됨

```json
  "scripts": {
    "sheet:download": "npx ts-node src/locales/translation/sheetDownloader.ts"
  },
```
