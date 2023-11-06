import React from "react";
import Image from "next/image";
import styles from "../components/common/scss/common.module.scss";

interface Props {
  dotY: number;
  location: string;
  date: string;
  img: string;
  contents: string;
}

export const Block = ({
  dotY,
  location,
  contents,
  date,
  img,
}: Props): JSX.Element => {
  const { block, dot } = styles;

  return (
    <div className={block} key={dotY} style={{ top: `${+dotY * 200}px` }}>
      <div className={dot} />
      <span>{date}</span>
      <Image
        src={`/images${location}/${img}`}
        alt="img"
        width={200}
        height={150}
        loading="eager"
        priority
      />
      <p>{contents}</p>
    </div>
  );
};
