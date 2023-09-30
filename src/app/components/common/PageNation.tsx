"use client";

import classNames from "classnames";
import { useRecoilValue } from "recoil";
import { postsAtom } from "../Recoil";
import { PageNum } from "../Techlog";
import { Selected } from "../Tag";
import { useState } from "react";
import "./PageNation.scss";

interface Props {
  selected: Selected;
  offset: number;
  pageNum: [PageNum, React.Dispatch<React.SetStateAction<PageNum>>];
}

export const PageNation = (props: Props): JSX.Element => {
  const postsId = useRecoilValue(postsAtom)?.map((el) => el.id);

  const [dimension, setDimension] = useState({ page: 5, rightPageNum: 0 });

  const { page, rightPageNum } = dimension;

  const {
    offset,
    pageNum: [pageNum, setpageNum],
    selected: { keyword },
  } = props;

  const idArr = postsId && Array(Math.ceil(postsId?.length / offset)).fill(0);

  /** 2차원 배열 만들기  */
  const twoD =
    idArr &&
    Array(Math.ceil(idArr?.length / page))
      .fill([])
      .map((oneD, i) => {
        oneD = Array(page)
          .fill(0)
          .map((el, j) => {
            const calc = el + (j + 1) + page * i;
            return calc <= idArr.length ? calc : false;
          })
          .filter((el) => !!el);
        return oneD;
      });

  return keyword === "All" ? (
    <div className="pageNum_wrapper">
      {twoD?.[rightPageNum]?.map((el: number) => {
        return (
          <>
            {el !== 1 && el === twoD?.[rightPageNum]?.[0] && (
              <i
                className="left-btn"
                onClick={() => {
                  setDimension({
                    ...dimension,
                    rightPageNum: rightPageNum - 1,
                  });

                  setpageNum({
                    ...pageNum,
                    current: idArr.length - (twoD?.[rightPageNum - 1]?.[0] - 1),
                    selectedNum: twoD?.[rightPageNum - 1]?.[0],
                  });
                }}
              />
            )}
            <span
              className={classNames("pageNum_el", {
                active: pageNum.selectedNum === el,
              })}
              key={el}
              onClick={() => {
                setpageNum({
                  current: idArr.length - (el - 1),
                  total: postsId.length,
                  selectedNum: el,
                });
              }}
            >
              {el}
            </span>
            {el === twoD?.[rightPageNum]?.[page - 1] && (
              <i
                className="right-btn"
                onClick={() => {
                  setDimension({
                    ...dimension,
                    rightPageNum: rightPageNum + 1,
                  });
                  setpageNum({
                    ...pageNum,
                    current: idArr.length - (twoD?.[rightPageNum + 1]?.[0] - 1),
                    selectedNum: twoD?.[rightPageNum + 1]?.[0],
                  });
                }}
              />
            )}
          </>
        );
      })}
    </div>
  ) : (
    <></>
  );
};
