# 터미널에서 파일내용 복사하여 다른 파일에 생성 + 붙여넣기

- 이 명령어는 linux 및 macOS 운영 체제에서 동작한다.

## 전체 내용 복사

```sh
cat test.txt | tee testcopy.txt
```

- 이 명령어를 사용하면 test.txt 파일의 내용을 읽어와 testcopy.txt 파일로 복사하며, 동시에 터미널에도 내용을 출력한다.

## 특정 범위의 내용을 복사

- 만약 특정 범위의 내용을 복사하고 싶다면 cat test.txt | tee testcopy.txt 명령어 대신 다음과 같이 sed 명령어를 사용할 수 있다.

```sh
sed -n 'start_line, end_line p' test.txt | tee testcopy.txt

```

- 여기서 start_line과 end_line은 복사하려는 텍스트의 시작 및 끝 라인을 나타내는 숫자로 바꿔야 한다.

> 예를 들어, 텍스트의 5번째 라인부터 10번째 라인까지 복사하려면 다음과 같이 사용할 수 있다.

```sh
sed -n '5,10 p' test.txt | tee testcopy.txt

```

- 이렇게 하면 test.txt 파일에서 특정 범위의 내용을 복사하여 testcopy.txt 파일로 붙여넣게 된다.
