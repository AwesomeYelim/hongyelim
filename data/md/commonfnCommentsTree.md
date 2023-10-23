# 댓글 구조 만들며 tree 구조 재구현해보기

## 예전 tree 구조

- 예전에 (약 9개월전) 팀장님의 챌린지로 1차원 디렉토리 배열을 받아 트리로 구현했던 적이 있었다..
- 그때 당시의 코드는 이러했는데

  A 요소의 아이디(dirId) 와 B 요소 부모의 아이디(dirPid) 가 같으면 A 요소 children에 B 요소 가 들어가는 로직을 구현했었다.

```ts
// 팀장님 트리문제

// 참조 값을 활용한 트리구조 로직 구현
let source = [
  { dirId: 1, dirPid: 0, name: "yelim" },
  { dirId: 2, dirPid: 1, name: "wonsuk" },
  { dirId: 3, dirPid: 1, name: "sohee" },
  { dirId: 4, dirPid: 3, name: "soyoung" },
  { dirId: 5, dirPid: 3, name: "sungbin" },
  { dirId: 6, dirPid: 4, name: "heayeon" },
];

function tree(temp) {
  let result = [];
  let map = {};

  if (!temp.length) {
    return result;
  }

  for (let item of temp) {
    map[item.dirId] = item;
    let parent = map[item.dirPid];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  }
  //   console.log(map);
  return result;
}

console.log(tree(source));
```

## 지금 tree 구조

- 이번에는 상황이 좀 달랐다. 뭐 데이터 구조를 위와 같이 바꿔서 진행해도 괜찮지만 나는 unique 값을 댓글 입력 시간으로 number[] 로 받고 있었다. 그러다보니 조금 다르게 생각해야될 부분이 생겨 다시 구성을 해보기로 하였다.

  com_created_at 의 length 가 depth 라고 할수 있으며, 자식 number 요소는 부모의 number 를 차례대로 포함한다

```ts
export {};

type Data = { com_created_at: number[] };
type ChildrenD = Data & { children: Data[] };

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

const commentsTree = (arr: Data[]) => {
  // 우선 length 긴 애들부터 재배치 한다. 자식요소들 시간순으로 고정배치되도록함
  arr = arr.sort((a, b) => {
    const ac = a.com_created_at;
    const bc = b.com_created_at;
    if (ac.length === bc.length) return bc[bc.length - 1] - ac[ac.length - 1];
    return bc.length - ac.length;
  });

  const lengthOne = arr.filter((highData) => {
    arr.forEach((data) => {
      const h = highData.com_created_at;
      const d = data.com_created_at;
      /** 중복제거 */
      const duplePrevent = !(highData as ChildrenD).children
        ?.map((el) => el.com_created_at[el.com_created_at.length - 1])
        .includes(d[d.length - 1]);

      // 부모요소의 끝에부분과 자식요소의 끝에서 두번째 부분이 일치 하고 & 중복요소가 포함되지 않도록 조건을 건다.
      if (h[h.length - 1] === d[d.length - 2] && duplePrevent) {
        ((highData as ChildrenD).children || ((highData as ChildrenD).children = [])).push(data);
      }
    });

    // 마지막에 최상위 요소만 남긴다
    return highData?.com_created_at?.length === 1;
  });
  return lengthOne;
};

console.log(commentsTree(data));
```

## 회고

- 뭔가 더 복잡해진거 같은 기분이 들고,
- 좀 아직 불완전한 부분들이 발생될거 같아서.. 계속 코드를 수정해 나가야겠다. ^^
