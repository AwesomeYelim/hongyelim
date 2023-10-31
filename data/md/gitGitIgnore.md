# .gitignore 가 동작을 안할 때

## .gitignore 에 반영된 파일

- `.gitignore` 에 추가된 파일들은 git status(변경사항)에 반영되지 않아야 한다.
- `.gitignore` 은 track 되지 않는것을 전제로 하지만 변경내역에 track 되고 있다면 조치를 취해줘야한다.

### 흔히들 쓰는 방법으로 캐싱된 파일들을 (all)제거하는 방법이 있다.

```sh
git rm -r --cached
```

### 필요에 따라 캐싱된 파일을 확인해서 지워야 하는 경우

#### 1. 캐싱된 파일을 살펴보자

```sh
git ls-files -c
```

or

```sh
git ls-files -t
```

- `-c` 옵션은 `캐시됨`을 의미하며, 현재 Git 인덱스(스테이징 영역)에 있는 파일을 나열한다.
- `-t` 옵션은 `tree` 를 의미하며, 작업 트리의 파일을 나열하여 작업 디렉터리에 있는 파일의 현재 상태를 보여준다.
  (추적되지 않은 파일, 수정된 파일, 다음 커밋을 위해 Git 인덱스(스테이징 영역)에 있는 파일을 포함하여 repository 모든 파일을 표시함)

#### 2. 캐싱된 파일만 지워보자

- 파일이름이 `.env` 일시

```sh
git rm .env --cached
```

#### 3. 어떻게 변했을까

- 터미널에 다음과 같이 치니 `? .env` 로 나오며 `.env` 파일이 tracking 되지 않음을 알수 있다.
- 그리고 이 파일은 `unstaged` 상태로 변경된다. (인덱스에서만 이 파일을 제거하고, 파일 시스템에서 제거하지 않는다.)

```sh
git ls-files -t --others
```

<details>
<summary>참고 사이트 </summary>
<div markdown="1">

<https://codingdog.tistory.com/entry/gitignore%EA%B0%80-%EB%8F%99%EC%9E%91-%EC%95%88-%ED%95%A0-%EB%95%8C-%EC%93%B4%EB%8B%A4%EB%8A%94-git-rm-cached-%EB%AA%85%EB%A0%B9%EC%96%B4%EB%A5%BC-%EC%95%8C%EC%95%84%EB%B4%85%EC%8B%9C%EB%8B%A4>

</div>

</details>
