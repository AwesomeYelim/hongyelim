# linux 여러 명령어들

## 다른 디렉토리에 `b_`로 시작되는 md 파일만 찾아서 복사 + `_` 기준으로 split 한뒤 맨마지막 요소글자만 name 으로 붙여넣기

```sh
find ./* -type f -name "b_*.md" ! -path "*/node_modules/*" -exec sh -c 'cp "$1" "output/$(basename "$1" | awk -F_ "{print \$NF}")"' _ {} \;

```

## + 다른이름으로 색인화 하여 복사 및 붙여넣기

```sh

index=1
find ./* -type f -name "b_*.md" ! -path "*/node_modules/*" -print | while read -r file; do
    cp "$file" "output/${index}_$(basename "$file" | awk -F_ "{print \$NF}")"
    index=$((index+1))
done

```

1.  index=1은 인덱스 변수를 1로 초기화 함
2.  find 명령은 기준에 맞는 파일을 찾는 데 사용
3.  읽는 동안 -r 파일, do는 find 명령으로 찾은 각 파일을 반복
4.  루프 내에서 cp "$file"은 파일을 복사
"output/${index}_$(basename "$file" | awk -F_ "{print \$NF}")"는 현재 인덱스와 인덱스의 마지막 부분을 포함하는 파일 이름으로 대상 경로를 지정. 파일 이름.
5.  index=$((index+1))는 각 파일의 색인을 증가시킴.

- 이렇게 하면 복사된 파일이 "출력" 디렉터리 내에서 순차적으로 indexing 시킬수 있음.
