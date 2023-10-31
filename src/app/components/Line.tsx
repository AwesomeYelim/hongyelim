"use client";

import { CSSProperties, useEffect, useState } from "react";
import Image from "next/image";
import { styled } from "styled-components";
// import "../components/common/scss/utils.scss";
import "./Line.scss";

export const Line = (): JSX.Element => {
  const [lineHeight, setLineHeight] = useState(0);
  const [dotobj, setDots] = useState<number[]>([]);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setLineHeight((pre) => (pre < scrollPosition ? scrollPosition : pre));
    const length = Math.floor(scrollPosition / 100);
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

  const lineStyle = {
    width: "2px",
    height: `${lineHeight - 100}px`,
    backgroundColor: "black",
    transition: "height 0.1s linear",
    // maxHeight: `${dotobj.length * 100}`,
  };

  const dotStyle = {
    width: "10px",
    height: "10px",
    backgroundColor: "black",
    borderRadius: "50%",
    position: "absolute",
    left: "-4px",
  };

  return (
    <div className="line_wrapper" style={{ position: "relative", height: "200vh" }}>
      <div style={lineStyle as CSSProperties} />
      {dotobj.map((dotY) => {
        return (
          <div
            key={dotY}
            style={
              {
                width: "80vw",
                height: 100,
                position: "absolute",
                top: `${+dotY * 100}px`,
              } as CSSProperties
            }>
            <div
              style={
                {
                  ...dotStyle,
                } as CSSProperties
              }
            />
            <Image
              src="/images/empty.png"
              style={{ marginTop: 10, marginLeft: 100 }}
              alt="img"
              width={100}
              height={80}
              loading="eager"
              priority
            />
          </div>
        );
      })}
    </div>
  );
};
