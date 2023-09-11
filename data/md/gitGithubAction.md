# github Actions

## github Actions 기본 5가지

1. Event
   - main branch 로 merge 하거나 commit 을 push, issue를 누군가가 열때 그때 수행해야 하는 일들을 처리
2. Workflows
3. Jobs
4. Actions
5. Runners

## github Actions 을 사용하여 자기 repo에 md 파일 생성하기

```yml
name: Create MD File

on:
  push:
    branches:
      - main # Change this to the branch where you want to trigger the action

jobs:
  create-md:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Create MD File
        run: |
          echo "# My New Markdown File" > new-file.md
        working-directory: ./ # 최상위 디렉터리로 설정

      - name: Commit and Push
        run: |
          git config --global user.name "AwesomeYelim"
          git config --global user.email "uiop01900@gmail.com"
          git add .
          git commit -m "Create new Markdown file"
          git push
```

## github Actions 을 사용하여 다른 repo에 md 파일 생성하기

1. 우선적으로는 토큰을 하나 생성해준다

> https://github.com/settings/tokens

2. 접근할 repo에 가서 Workflow permissions 을 read and write 로 바꿔준다

```yml
name: Create MD File

on:
  push:
    branches: [main]
    pull_request:
      branches: [main]
jobs:
  create-md:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          persist-credentials: false
          fetch-depth: 0

      - name: Create MD File
        run: |
          echo "# My New Markdown File" > new-file.md
        working-directory: ./

      - name: Set up Git credentials
        run: |
          git config --global user.email "uiop01900@gmail.com"
          git config --global user.name "AwesomeYelim"
          git config --global credential.helper "store --file=.git-credentials"
          echo "https://github.com:${{ secrets.MDFILEINTERLOCK  }}" > .git-credentials
        env:
          API_TOKEN_GITHUB: ${{ secrets.MDFILEINTERLOCK  }}

      - name: Commit and Push
        id: push_directory
        uses: cpina/github-action-push-to-another-repository@main
        env:
          API_TOKEN_GITHUB: ${{ secrets.MDFILEINTERLOCK  }}
        with:
          source-directory: "."
          destination-github-username: "AwesomeYelim"
          destination-repository-name: "push할 repository 이름"
          commit-message: "test"
          target-branch: main
          target-directory: "생성할 테스트 파일"
```

## githubAction 사용하여 다른 repository 와 md 파일 동기화 시키기

- 최상단 루트에 다음 builde.sh 파일을 생성해준다.

```sh

mkdir output
cp -R ./Basic/* ./output
cp -R ./output ./Basic
```

- workflow.yml 파일에 가서 다음과 같이 입력

```yml
name: MD File Interlock

on:
  push:
    branches: [main]
    pull_request:
      branches: [main]
jobs:
  create-md:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          persist-credentials: false
          fetch-depth: 0

      - name: creates output
        run: sh ./build.sh

      - name: Commit and Push
        id: push_directory
        uses: cpina/github-action-push-to-another-repository@main
        env:
          API_TOKEN_GITHUB: ${{ secrets.MDFILEINTERLOCK  }}
        with:
          source-directory: "output"
          destination-github-username: "AwesomeYelim"
          destination-repository-name: "AwesomeYelim"
          commit-message: "test"
          target-branch: main
          target-directory: "yelimtest"
```

> 참고

     https://vanilla-van-6e4.notion.site/vercel-47312c7c2a9c492dbdabc40c47489cfa

     https://velog.io/@rmaomina/github-actions-file-sync#%EC%84%B1%EA%B3%B5

> ++ 나는 `b_`로 시작되는 파일들로 블로그에 올릴 글들을 구별해 놓고, 터미널 명령어로 끝의 글자들을 따서 rename 해주었음

```sh

mkdir output # 최상위 root에 output 이라는 파일을 만들겠다.

# 디렉토리까지 복사
# find ./* -name *.md | cpio -pdm output # 디렉토리까지 복사


# 파일 그대로 복사
# find ./* -type f -name "b_*.md" ! -path "*/node_modules/*" -exec cp {} output \;


# 'b_' 이부분만 삭제해줌
# find ./* -type f -name "b_*.md" ! -path "*/node_modules/*" -exec sh -c 'cp "$1" "output/$(basename "$1" | sed "s/b_//")"' _ {} \;

# 'b_' 이부분만 삭제 및 '_'기준으로 split 해준 배열의 마지막 요소 값 사용
find ./* -type f -name "b_*.md" ! -path "*/node_modules/*" -exec sh -c 'cp "$1" "output/$(basename "$1" | awk -F_ "{print \$NF}")"' _ {} \; # '_'기준으로 split 한뒤 마지막 요소값만 사용


# 만약 indexing 값이 필요하다면 이것을 사용
# index=1
# find ./* -type f -name "b_*.md" ! -path "*/node_modules/*" -print | while read -r file; do
#     cp "$file" "output/${index}_$(basename "$file" | awk -F_ "{print \$NF}")"
#     index=$((index+1))
# done


```

## hongyelim repo에 있는 md 파일과 <=> firebase 에 있는 data 객체 동기화 과정

- 우선 test script를 만들어서 hongyelim 내부에서 실행 시켜보자
- 그 다음 study를 push 할때마다 트리거 가능한 파일을 hongyelim 내부에 생성한다.

- `[hongyelimrepo]`.github/workflow/test_action.yml 파일 생성
- src/app/test.ts 경로의 ts 파일을 실행하려고 함

```yml
name: Execute Test Script

on:
  workflow_dispatch:
    inputs:
      logLevel:
        description: "Log level"
        required: true
        default: "warning"
        type: choice
        options:
          - info
          - warning
          - debug
      tags:
        description: "Test scenario tags"
        required: false
        type: boolean
      environment:
        description: "Environment to run tests against"
        type: environment
        required: true
  repository_dispatch:
    types: [run-test-script]

jobs:
  run-script:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Install TypeScript # github action 환경에서 따로 설치 해주어야함
        run: yarn add typescript --dev

      - name: Install ts-node # github action 환경에서 따로 설치 해주어야함
        run: yarn global add ts-node

      - name: Run Test Script
        run: $(yarn global bin)/ts-node src/app/test.ts
```

- `[Studyrepo]` yml 파일에 다음을 추가

```yml
- name: Trigger "hongyelim" Workflow
        run: |
          curl -X POST \
            -H "Authorization: token ${{ secrets.MDFILEINTERLOCK }}" \
            -H "Accept: application/vnd.github.v3+json" \
            -d '{"ref": "main"}' \
            https://api.github.com/repos/hongyelim/hongyelim/actions/workflows/test_action.yml/dispatches
        env:
          API_TOKEN_GITHUB: ${{ secrets.MDFILEINTERLOCK }}
```

-
