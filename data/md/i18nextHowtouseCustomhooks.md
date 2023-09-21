# i18next customhook 사용설명서

## textTrans 와 UseTrans 라는 custom hook 을 사용한다.

개요) 사용시 명시적인 부분과 가독성을 중시, 여러 케이스들을 생각하여 내장 모듈 `t()`와 `<Trans/>`를 customizing 함

- test case

  1. 일반 text 만 사용하는 경우

  ```tsx
  textTrans({ key: "ss_1293", defaultMsg: "탐지 경로 설정" });
  ```

  1-1. key 를 여러 개 쓰는 경우

  ```tsx
  textTrans({
    key: ["ss_1437", "ss_524"],
    defaultMsg: "현재 진행 중인 작업이 있습니다. 변경사항을 저장하지 않고 작업을 취소하시겠습니까?",
  });
  ```

  1-2. key를 여러개 쓰는데 중간에 \n(개행) 을 넣어야 되는 경우

  ```tsx
  textTrans({
    key: ["ss_1437", "\n", "ss_524"],
    defaultMsg: "현재 진행 중인 작업이 있습니다. 변경사항을 저장하지 않고 작업을 취소하시겠습니까?",
  });
  ```

  1-3. key를 여러개 쓰는데 중간에 띄어쓰기 를 넣어야 되는 경우

  ```tsx
  textTrans({ key: ["ss_208", " ", "ss_566"], defaultMsg: "OTP 로그인 사용" });
  ```

  2. 가변값이 들어갈 경우

  ```tsx
  UseTrans({ key: "ss_3", defaultMsg: "{{count}}개 대상", value: { count: csaData.assetCnt } }); // count 는 해당 value 내 가변값의 named
  ```

  2-1. 가변값이 2개 이상 들어가는 경우

  - ts 모듈일 경우

  ```ts
  t("ss_47", { min, compValue, defaultValue: "{{min}} ~ {{compValue}} 사이의 숫자만 입력 가능합니다." });
  ```

  - tsx 모듈일 경우

  ```tsx
  // tsx 모듈에 가변값이 2개이상 들어가는 경우가 없어서 예시로 반영합니다.
  UseTrans({
    key: "ss_19",
    defaultMsg: "{{compValue}} ~ {{max}} 사이의 숫자만 입력 가능합니다.",
    value: { compValue, max },
  });
  ```

  - hook call error 가 발생하는 경우

  ```tsx
  t("ss_55", { msg: status.msg, defaultValue: "파일 업로드에 {{msg}}" });

  <pre>
    {t("ss_143", {
      br: `\n`,
      defaultValue:
        "Agent 설치 시 그룹명과 함께 표기되는 이름입니다.{{br}}일부 터미널 환경은 ASCII 문자만 표현이 가능하므로,{{br}}그룹명이 올바로 표기되지 않을 때 {{br}}영문 이름을 참조할 수 있으며 ASCII 문자만 입력 가능합니다.",
    })}
  </pre>;
  ```

- hook call error 가 발생하는데 경우 가변값 및 태그를 사용해야할 경우

  ```tsx
  <Trans
    i18nKey="ss_364"
    defaultsValue="난독화, 인코딩 등으로 <span>일반적인 형태가 아닌 URL 정보</span>를 <br /> \n 탐지하는 데 사용합니다. BlackList 탐지로만 동작하며, <br /> \n 부분 검역은 지원하지 않습니다."
    components={{ span: <span />, br: <br /> }}
  />
  ```

  3. tag 가 들어가는 경우

  ```tsx
  UseTrans({
    key: "ss_250",
    defaultMsg: "가용 일정을 설정하지 않은 경우 <span>기본값(24시간)</span>으로 설정됩니다.",
    TagComp: { components: { span: <span /> } },
  });
  ```

  3-1. tag 내 가변값이 들어가는 경우, 함께 들어가는 경우 {{count}}, {{context}} 으로 naming 제한

  ```tsx
  UseTrans({
    key: "ss_79",
    defaultMsg: "{{context}}개<span>(예외: {{count}})</span>",
    TagComp: {
      components: { span: <span /> },
      value: { count: state.summary.exceptDirCnt, context: String(state.summary.targetDirCnt) },
    },
  });
  ```

  3-1 hookCall Error 날 경우

  ```tsx
  <Trans
    i18nKey="ss_562"
    defaultValue="비밀번호를 <span>{{count}}/{{value}}</span>회 잘못 입력하셨습니다. 5회 오류 시 이용이 제한됩니다."
    components={{ span: <span /> }}
    values={{ count: checkCount, value: systemData?.modifyLockLimitCnt || "-" }}
  />
  ```

  3-2. tag 내 추가 번역이 들어가야하는 경우

  ```tsx
  UseTrans({
    key: "ss_90",
    defaultMsg:
      "<span>{{count}}</span>에 대상 시스템의 웹 서비스 루트 디렉터리를 자동으로 <span>{{context}}</span>할 것인지 설정합니다.",
    TagComp: {
      components: { span: <span style={{ color: "#79D0F3" }} /> },
      compvalue: {
        count: textTrans({ key: "ss_145", defaultMsg: "Agent 설치 직후" }),
        context: textTrans({ key: "ss_736", defaultMsg: "수집" }),
      },
    },
  });
  ```

## css 모듈 수정시 참고사항

- `i18n.language` 다음과 같이 불러오게 되면 현재 설정 언어를 확인가능
- 공통 styled components를 건드리게 될 경우 `i18n.language`로 분기처리하여 처리

```js
import i18n from "i18next";

console.log(i18n.language);

// ex
<div
  className="check__error__tooltip"
  style={{
    right: i18n.language === "ko" ? "auto" : 125,
    zIndex: i18n.language === "ko" ? "auto" : 11,
  }}
/>;
```
