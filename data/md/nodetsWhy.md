# node + typescript 적용하기 (프로젝트 구조 갖추기)

## 왜 사용하는가?

    node + typescript 왜 쓰는가? 서버의 안정성을 확보할 수있음

- node는 typescript를 직접 실행할수 x => deno 사용해야함
- node는 죽지않는 서버를 만드는게 중요함 pm2 를 살려야해 ~

## nvm(Node Version Manage)

### ❓ nvm

> Node Version Manage
> nvm은 node js 버전 매니저로 시스템에 여러 개의 nodejs 를 설치하고 사용할 버전을 쉽게 전환할 수록 도와주는 shell script로 rvm(Ruby Version Manager)와 비슷한 역할을 수행

### 💨 Error

- 간혹가다가 다음과 같은 에러를 마주한다.

```sh
'nvm'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다.
```

- 실행 prompt를 킨후, 다음 시스템 속성을 넣어줌

```
1. window + r
2. sysdm.cpl
```

- 다음을 순차적으로 진행한다

> 고급 - 환경 변수 - Path 선택후 - 편집 - C:\Users\User\AppData\Roaming\nvm 추가 (%NVM_HOME% 위에) - 재부팅

- 다음으로 nvm이 설치 되어있는지 확인한다

```
nvm -v // 현재 nvm 버전
nvm ls // 사용가능한 node 버전
nvm install 18 // node 18 버전중 최신버전 설치
nvm list available // node 버전중 이용가능한 list 확인
nvm use 18.16.1 // node 버전 중 18.16.1 버전을 사용하겠다
```
