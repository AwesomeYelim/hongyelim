# git 브랜치 마다 gitignore 설정 다르게 적용하는 방법

## ⛳️ .gitignore 파일이란 ?  

- Git 저장소에서 버전 관리하지 않아야 하는 파일과 디렉토리를 지정하는 데 사용되는 설정 파일이다.
 이 파일은 Git으로 추적하지 않아야 하는 파일 및 디렉토리의 목록을 포함하고 있으며, Git이 이러한 파일을 무시하도록 지시한다. 이를 통해 Git 저장소를 깨끗하게 유지하고, 불필요한 파일을 저장소에 포함시키지 않을 수 있다.


## ⛳️ post-checkout.sample 을 커스텀 하여 .gitignore 파일을 branch 별로 수정해보자..!

- 하지만 (평소에는 필요하다가도) 배포환경과 직결되는 branch 에서는 .gitignore 파일에 포함시켜 커밋에서 제외를 시켜줘야 하는 경우가 있다. .git 자체에는 그러한 기능이 없으므로 post-checkout.sample 를 생성하여 커스텀 해주기로 한다.


>  우선 https://hongyelim.vercel.app/posts/gitFolder 를 참조하여 .git/hooks/post-checkout.sample 를 생성해준다.


- 그리고 다음과 같이 작성해준다.

> 🏏 리눅스 문법과 관련된 글은 아래를 참고하자 !

    https://hongyelim.vercel.app/posts/linuxSpecificChracter
    https://hongyelim.vercel.app/posts/linuxContentcopyPaste

```sh
#!/bin/sh

# .gitignore 파일에 generate 에서는 제외시키고 hotfix, develop 에서는 포함시키고 싶음

BRANCH_NAME=$(git symbolic-ref --short HEAD)


case "$BRANCH_NAME" in
    generate)
        sed -i '/translation\/\*/d' .gitignore # .gitignore 파일에 '/translation\/\*/d' 매치되는 행 삭제
        ;;
    hotfix)
        echo "client\/src\/locales\/translation\/\*" >> .gitignore # .gitignore 파일에 "client\/src\/locales\/translation\/\*" 추가
        ;;
    develop)
        echo "client\/src\/locales\/translation\/\*" >> .gitignore
        ;;
esac

```
- test 는 다음 명령어로 가능하다
```sh
chmod +x .git/hooks/post-checkout.sample # 권한 부여
sh .git/hooks/post-checkout.sample # 실행
```

**_post-checkout.sample 파일이 git 환경에 반영 되는 시점은 branch 를 check-out 할때마다 라는 사실을 기억하자.._**

