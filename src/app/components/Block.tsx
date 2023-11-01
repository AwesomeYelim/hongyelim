import React from "react";
import Image from "next/image";
import styles from "../components/common/scss/common.module.scss";

interface Props {
  dotY: number;
  location: string;
}

export const Block = ({ dotY, location }: Props): JSX.Element => {
  const { block, dot } = styles;

  return (
    <div className={block} key={dotY} style={{ top: `${+dotY * 100}px` }}>
      <div className={dot} />
      <Image src={`/images${location}/empty.png`} alt="img" width={100} height={80} loading="eager" priority />
    </div>
  );
};
