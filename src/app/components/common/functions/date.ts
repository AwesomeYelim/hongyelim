/**
 * 1. 컴포넌트 : src/app/components/common/functions/date.ts
 * 2. 작성일 : 2023.10.15 / 12시 59분 12초
 * 3. 작성자 : 홍예림
 * 4. 설명 : date 변환 공통함수
 */

const dateFn = (epoch: number) => {
  const option = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const changedDate = new Date(epoch * 1000).toLocaleDateString(
    "ko-kr",
    option as {}
  );
  return changedDate;
};

export default dateFn;
