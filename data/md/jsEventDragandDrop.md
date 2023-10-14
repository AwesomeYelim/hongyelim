# Drag and Drop 구현해 보기

## 요즘 다시금 꽂힌 mouseEvent....

- 예전(1년전)에 mouseEvent 관련한 줄자를 만들어본적이 있었다. 하지만 거의 나의 지분(?) 이 없이 팀장님의 도움으로 만들어 봤던거라 한번 생짜배기로 갑자기 구현해보고 싶었음..


⛳️ 그리하여 만들어본 <del>조금 허접한</del> drag and drop 

![b_jsEventDragandDrop20](./img/b_jsEventDragandDrop20.gif)

```jsx

"use client";

import { Dispatch, SetStateAction, useState } from "react";
import "./MoveEvent.scss";

interface EventEl {
  id: number;
  name: string;
}

type Style = Element & { style: { marginBottom: string } };

interface Drag {
  target?: EventEl;
  to?: EventEl;
  grab: boolean;
  list: EventEl[];
}

const EventEl = ({
  dragging: [drag, setDrag],
  el,
}: {
  dragging: [Drag, Dispatch<SetStateAction<Drag>>];
  el: EventEl;
}) => {
  const target = (arg: number) => {
    const tg = document.querySelector(
      `.moveEvent_wrap .moveEvent_el:nth-child(${arg + 1})`
    );
    if (tg) return tg;
  };

  const targetAll = document.querySelectorAll(".moveEvent_wrap .moveEvent_el");

  return (
    <div
      className="moveEvent_el"
      key={el.name}
      draggable
      onDragStart={(e) => {
        setDrag({ ...drag, target: el, grab: true });
      }}
      onDragOver={(e) => {
        e.preventDefault();
        drag.to = drag.to as EventEl;
        drag.target = drag.target as EventEl;

        setDrag({ ...drag, to: el });

        const indfn = (arg: EventEl) => drag.list.indexOf(arg);
        const ind = indfn(drag.to) as number;
        const tgList = [ind - 1, ind, ind + 1];

        const movingFn = (arg: boolean) => {
          tgList.forEach((tg, i) => {
            if (target(tg)) {
              const { style } = target(tg) as Style;
              /** pointer 가 위를 향할때 */
              if (arg) {
                if (!i) {
                  style.marginBottom = "10px";
                } else {
                  style.marginBottom = "0px";
                }
                /** pointer 가 아래를 향할때 */
              } else {
                if (i !== 1) {
                  style.marginBottom = "0px";
                } else {
                  style.marginBottom = "10px";
                }
              }
            }
          });
        };

        /** 초기화   */
        targetAll.forEach((el) => {
          (el as Style).style.marginBottom = "0px";
        });

        movingFn(indfn(drag.target) > indfn(drag.to));

        // console.log(el, indfn(drag.to), drag.list[indfn(drag.to) - 1], target(indfn(drag.to)));
      }}
      onDrop={(e) => {
        e.preventDefault();
        drag.to = drag.to as EventEl;
        drag.target = drag.target as EventEl;

        const copyArr = [...drag.list];
        const [tg_ind, t_ind] = [
          copyArr.indexOf(drag.target),
          copyArr.indexOf(drag.to),
        ];

        const [slice] = copyArr.splice(tg_ind, 1);

        copyArr.splice(t_ind, 0, slice);

        setDrag({ ...drag, list: copyArr, grab: false });
      }}
      onDragEnd={(e) => {
        e.preventDefault();

        /** 초기화   */
        targetAll.forEach((el) => {
          (el as Style).style.marginBottom = "0px";
        });
      }}
    >
      {el.name}
    </div>
  );
};

export default function MoveEvent() {
  const fakeData = Array(10)
    .fill(0)
    .map((_, i) => {
      return {
        id: i + 1,
        name: `${i + 1} 번째 입니다.`,
      };
    });
  const [drag, setDrag] = useState<Drag>({ list: fakeData, grab: false });

  return (
    <div className="moveEvent_wrap">
      {drag.list.map((el) => {
        const props = {
          dragging: [drag, setDrag] as [Drag, Dispatch<SetStateAction<Drag>>],
          el,
        };
        return <EventEl key={el.name} {...props} />;
      })}
    </div>
  );
}


```