# md 파일에서 heading tag를 추출하는 방법

- md 파일에서 heading tag(# tag로 시작되는 글자)를 추출하기 위해 다음과 같은 정규식을 사용하였다.

```js
/#+\s(.+)/gm;
```

- 이것을 해석하면 다음과 같다

1. #+: 이 부분은 하나 이상의 #문자와 일치

2. \s: 공백 문자(예: 공백 또는 탭)와 일치

3. (.+).: 개행 문자를 제외한 모든 문자( ) 중 하나 이상을 매칭하여 캡쳐하는 캡쳐 그룹. 이는 +하나 이상의 문자와 일치한다는 의미

4. gm: 정규 표현식과 함께 사용되는 플래그는 다음과 같다.

   - g(전역): 첫 번째 일치 이후에 중지하는 대신 입력 문자열에 있는 패턴의 모든 인스턴스를 일치시키도록 정규식에 지시
   - m(여러 줄): ^및 $앵커가 전체 문자열의 시작과 끝뿐만 아니라 입력 문자열 내 각 줄의 시작과 끝과 일치하도록 허용함

**하지만 문제는 \`\`\`sh \`\`\` 안에있는 주석된(# ~~) 글자까지 포함된다는 것이었다.!**

- 그래서 통으로 정규식을 짜기보다는 다음과 같이 이중으로 처리하기로 한다.

```ts
let innerText: RegExpMatchArray | string | null;

innerText = mdPost
  ?.replace(/(\`\`\`([\s\S]*?)\`\`\`)/g, "")
  .match(/#+\s(.+)/gm);
```

- replace 안쪽의 정규식을 해석하면 다음과 같다.

1.  ```: 이 백틱은 문자 그대로 삼중 백틱을 일치시키는 데 사용됨. 백틱은 정규식의 특수 문자이므로 문자 그대로 일치시키려면 백슬래시 `\`로 이스케이프해야함

2.  `([\s\S]*?)`: 이 부분은 백틱 3개 사이의 내용을 일치시키고 캡처하는 그룹:

    - `[\s\S]*?`: 이 부분은 모든 문자(`[\s\S]`) 와 0번 이상 일치하는지, (`*? `).

      `[\s\S]` 패턴은 `\s`(공백) 및 `\S`(공백이 아닌) 문자 클래스를 결합하므로 공백 및 개행 문자를 포함한 모든 문자와 일치한다.

    - `*?`는 게으른 수량자임. 즉, 전체 정규식 패턴을 만족시키기 위해 가능한 한 적은 수의 문자와 일치함을 의미한다. 


- 그리하여..더 말끔해진 TOC 를 습득하였다.. ^^ 