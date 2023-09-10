

# 06. 위치 찾기

- 위치 찾기는 텍스트 문자열 안에서 반드시 일치해야하는 위치를 지정할때 사용

### **단어 경계 지정하기**
    \b 로 표시하는 단어경계 -> 단어의 시작이나 마지막을 일치 시킬때 사용
    \B 로 표시하는 단어경계 -> 단어의 시작이나 마지막을 일치 시키지 싶지 않을때 사용
    
**예시비교**

    - 예시
    the cat scattered his food all over room,
    -> cat 을 dog로 치환
    
|대입식|치환 결과|
| --- | --- |
|`cat`|the <mark>dog</mark> s<mark>dog</mark>tered his food all over room,|
|`\bcat\b`|the <mark>dog</mark> scattered his food all over room,|

📌 `\b`는 실제로 문자와 일치하는 것이 아닌 위치를 가리킴



**예시비교**

    - 예시
    Please enter the nine-digit id as it appears on your color - coded pass-key
    
|대입식|매칭결과|
| --- | --- |
|`\B-\B`|Please enter the nine-digit id as it appears on your color <mark>-</mark> coded pass-key|

📌 `\B-\B`는 단어구분(word-break)문자로 둘러싸인 하이픈과 일치함


### **문자열 경계 지정하기**
    단어 경계는 단어의 위치(단어의 시작, 단어의 마지막, 단어 전쳬)를 기반으로 위치를 찾음
    - 캐럿(^) : 문자열의 시작을 나타냄(📌 집합([]) 밖에서)
    - 달러기호($) : 문자열의 마지막을 나타냄
    - 다중행 모드(?m) : 캐럿(^)과 달러기호($) 로 표시한 경계문자의 다중행을 지원함(📌 (?m)을 지원하지 않는 정규표현식 구현도 많음)

