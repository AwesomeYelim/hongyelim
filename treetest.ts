export {};
type Data = { com_created_at: number[] };
const data = [
  { com_created_at: [1] },
  { com_created_at: [2] },
  { com_created_at: [1, 3] },
  { com_created_at: [1, 4] },
  { com_created_at: [1, 3, 5] },
  { com_created_at: [1, 3, 5, 6] },
  { com_created_at: [2, 7, 0] },
  { com_created_at: [2, 7] },
];

const commentsTree = (arr: { com_created_at: number[] }[]) => {
  arr = arr.sort((a, b) => b.com_created_at.length - a.com_created_at.length);

  const lengthOne = arr.filter((highData) => {
    arr.forEach((data) => {
      const h = highData.com_created_at;
      const d = data.com_created_at;
      /** 중복제거 */
      const duplePrevent = !(highData as Data & { children: Data[] }).children
        ?.map((el) => el.com_created_at[el.com_created_at.length - 1])
        .includes(d[d.length - 1]);

      if (h[h.length - 1] === d[d.length - 2] && duplePrevent) {
        (
          (highData as Data & { children: Data[] }).children ||
          ((highData as Data & { children: Data[] }).children = [])
        ).push(data);
      }
    });

    return highData?.com_created_at?.length === 1;
  });
  return lengthOne;
};

console.log(commentsTree(data));
