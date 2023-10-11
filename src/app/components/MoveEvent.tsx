"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import "./MoveEvent.scss";

interface EventEl {
  id: number;
  name: string;
}

interface Drag {
  target?: EventEl;
  to?: EventEl;
  list: EventEl[];
}

const EventEl = ({
  dragging: [drag, setDrag],
  el,
}: {
  dragging: [Drag, Dispatch<SetStateAction<Drag>>];
  el: EventEl;
}) => {
  return (
    <div
      className="moveEvent_el"
      key={el.name}
      draggable
      onDragStart={(e) => {
        setDrag({ ...drag, target: el });
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag({ ...drag, to: el });

        // console.log(drag);
      }}
      onDragEnd={(e) => {
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

        setDrag({ ...drag, list: copyArr });
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
  const [drag, setDrag] = useState<Drag>({ list: fakeData });

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
