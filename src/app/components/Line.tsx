"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../components/common/scss/common.module.scss";
import { Block } from "./Block";

export const Line = (): JSX.Element => {
  const [lineHeight, setLineHeight] = useState(0);
  const [dotobj, setDots] = useState<number[]>([]);
  const location = usePathname();
  const { line_wrapper, line } = styles;

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setLineHeight((pre) => (pre < scrollPosition ? scrollPosition : pre));
    const length = Math.floor(scrollPosition / 200);
    const arr = Array.from({ length }, (_, i) => i);
    setDots((pre) => (pre.length > arr.length ? pre : arr));
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={line_wrapper}>
      <div className={line} style={{ height: `${lineHeight}px` }} />
      {dotobj.map((dotY) => {
        const props = { dotY, location };
        return <Block key={dotY} {...props} />;
      })}
    </div>
  );
};
