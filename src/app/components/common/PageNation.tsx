"use client";

import classNames from "classnames";
import { useRecoilValue } from "recoil";
import { postsAtom } from "../Recoil";
import "./PageNation.scss";

interface Props {
  offset: number;
  currentNum: [number, React.Dispatch<React.SetStateAction<number>>];
}

export const PageNation = (props: Props): JSX.Element => {
  const postsId = useRecoilValue(postsAtom)?.map((el) => el.id);
  const {
    offset,
    currentNum: [current, setCurrentNum],
  } = props;

  const idArr = postsId && Array(Math.ceil(postsId.length / offset)).fill(0);

  return (
    <div className="pageNum_wrapper">
      {idArr?.map((_, i) => {
        return (
          <span
            className={classNames("pageNum_el", { active: current === i + 1 })}
            key={i}
            onClick={() => {
              setCurrentNum(i + 1);
            }}>
            {i + 1}
          </span>
        );
      })}
    </div>
  );
};
