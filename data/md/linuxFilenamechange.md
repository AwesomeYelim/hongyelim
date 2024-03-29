# 파일명 일괄 변경하기

## 이름 찾기 및 변경

- 가끔 블로그에 올릴 목적으로 쓴글이 아닌데 블로그에 올리게 된글들이 심심치 않게 생긴다.

> 그럴때 마다 `b_` 를 붙여주기 너무 **~~귀찮아~~**

- 다음 명령어를 입력해 준다...🐒

```sh

find ./ -name "*[찾을 파일이름]*"  | sed -e 'p' -e "s/[찾을 파일이름]/[바꿀 파일이름]/g" |xargs -n 2 mv

# ex) '01_nestinit' 이 포함된 파일명을 'b_01_nestinit' 으로 바꾼다.
# find ./ -name "*01_nestinit*"  | sed -e 'p' -e "s/01_nestinit/b_01_nestinit/g" |xargs -n 2 mv
```

## 명령어 뜯어보기

1. `find`: 디렉터리 계층 구조에서 파일과 디렉터리를 검색하는 데 사용되는 명령어
2. `./`: 검색을 위한 시작 디렉터리(현재 디렉터리)를 지정한다.
3. `-name` : 파일 이름과 일치하는 패턴을 지정한다.
4. `|(파이프 기호)`: find 명령의 출력을 가져와서 다음 명령의 입력으로 전달한다.
5. `sed`: 텍스트 필터링 및 변환을 위한 스트림 편집기이다.
6. `-e 'p'`: 편집 명령을 지정하는 `sed`에 대한 옵션이다. 각 줄을 복사한다.
7. `-e "s/[찾을 파일이름]/[바꿀 파일이름]/g"`: 각 줄에서 대체를 수행하여 `[찾을 파일이름]`를 전역적으로 `[바꿀 파일이름]`로 바꾼다.(=>각 줄의 모든 항목)
8. `xargs`: 표준 입력(stdin)에서 항목을 읽고 명령을 실행하는 명령이다.
9. `-n 2`: `xargs`가 한 번에 최대 두 개의 인수를 사용해야 함을 지정한다.
10. `mv`: `mv` 명령은 파일을 이동하거나 이름을 바꾸는 데 사용된다.
