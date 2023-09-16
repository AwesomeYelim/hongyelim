"use client";

import classNames from "classnames";
import { useRecoilValue } from "recoil";
import { postsAtom } from "../Recoil";
import "./PageNation.scss";
import { PageNum } from "../Techlog";

interface Props {
  offset: number;
  pageNum: [PageNum, React.Dispatch<React.SetStateAction<PageNum>>];
}

export const PageNation = (props: Props): JSX.Element => {
  const postsId = useRecoilValue(postsAtom)?.map((el) => el.id);
  const {
    offset,
    pageNum: [pageNum, setpageNum],
  } = props;

  const idArr = postsId && Array(Math.ceil(postsId.length / offset)).fill(0);


  return (
    <div className="pageNum_wrapper">
      {idArr?.map((_, i, arr) => {
        return (
          <span
            className={classNames("pageNum_el", { active: pageNum.selectedNum === i + 1 })}
            key={i}
            onClick={() => {
              setpageNum({current : arr.length - i, total : postsId.length, selectedNum : i + 1});
            }}>
            {i + 1}
          </span>
        );
      })}
    </div>
  );
};
