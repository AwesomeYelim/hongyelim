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
    const tg = document.querySelector(`.moveEvent_wrap .moveEvent_el:nth-child(${arg + 1})`);
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
                  style.marginBottom = "20px";
                } else {
                  style.marginBottom = "0px";
                }
                /** pointer 가 아래를 향할때 */
              } else {
                if (i !== 1) {
                  style.marginBottom = "0px";
                } else {
                  style.marginBottom = "20px";
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
      onDragEnd={(e) => {
        e.preventDefault();
        drag.to = drag.to as EventEl;
        drag.target = drag.target as EventEl;

        const copyArr = [...drag.list];
        const [tg_ind, t_ind] = [copyArr.indexOf(drag.target), copyArr.indexOf(drag.to)];

        const [slice] = copyArr.splice(tg_ind, 1);

        copyArr.splice(t_ind, 0, slice);

        setDrag({ ...drag, list: copyArr, grab: false });

        /** 초기화   */
        targetAll.forEach((el) => {
          (el as Style).style.marginBottom = "0px";
        });
      }}>
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
