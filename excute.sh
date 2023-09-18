
# 특정 라인 만 복사
# sed -n '1,38 p' .gitignore | tee test.txt # .gitignore 파일의 1-38 줄까지 복사해서 test.txt 에 붙여넣겠다
# cat test.txt | tee .gitignore # test.txt 전체 복사 .gitignore 붙여넣기
# rm test.txt # test.txt 파일삭제



#----------------------------------------------------------------

# 특정 글자수 제외후 복사
# cat .gitignore | grep -v "prisma" | tee test.txt


#----------------------------------------------------------------


# 특정 글자수가 포함된 행 제외후 복사
# sed '/test\/\*/d' .gitignore | tee test.txt # 특정 글자수가 포함된 행 제외후 복사(이스케이프 시켜줘야함)
# echo "\n/src/app/api/test/*" >> test.txt # test.txt 에 /src/app/api/test/* 내용추가
# cat test.txt | tee .gitignore # test.txt 전체 복사 .gitignore 에 붙여넣기
# rm test.txt # test.txt 삭제

