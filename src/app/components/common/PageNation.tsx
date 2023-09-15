"use client";

import classNames from "classnames";
import { useRecoilValue } from "recoil";
import { postsAtom } from "../Recoil";
import "./PageNation.scss";
import { useEffect, useState } from "react";

interface Props {
  offset: number;
  currentNum: [{ current: number; total: number; }, React.Dispatch<React.SetStateAction<{ current: number; total: number; }>>];
}

export const PageNation = (props: Props): JSX.Element => {
  const postsId = useRecoilValue(postsAtom)?.map((el) => el.id);
  const {
    offset,
    currentNum: [current, setCurrentNum],
  } = props;

  const [selectedNum, setSelectedNum] = useState(1);
  const idArr = postsId && Array(Math.ceil(postsId.length / offset)).fill(0);

  useEffect(() => {
    setCurrentNum((pre) => ({...pre, current : postsId.length }));
  }, []);

  return (
    <div className="pageNum_wrapper">
      {idArr?.map((_, i, arr) => {
        return (
          <span
            className={classNames("pageNum_el", { active: selectedNum === i + 1 })}
            key={i}
            onClick={() => {
              setCurrentNum({current : arr.length - i, total : postsId.length});
              setSelectedNum(i + 1);
            }}>
            {i + 1}
          </span>
        );
      })}
    </div>
  );
};
