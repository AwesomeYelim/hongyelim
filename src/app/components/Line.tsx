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
  const fakeData = [
    { date: "23.11.02", img: "empty.png", contents: "이러저러랄랄" },
    { date: "23.11.02", img: "empty.png", contents: "이러저러랄랄" },
    { date: "23.11.02", img: "empty.png", contents: "이러저러랄랄" },
    { date: "23.11.02", img: "empty.png", contents: "이러저러랄랄" },
  ];
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
    <div className={line_wrapper} style={{ height: (fakeData.length + 2) * 200 }}>
      <div className={line} style={{ height: `${lineHeight}px` }} />
      {dotobj.map((dotY) => {
        const data = fakeData[dotY];
        const props = { dotY, location, ...data };
        return <Block key={dotY} {...props} />;
      })}
    </div>
  );
};
