"use client";
import { CSSProperties, useEffect, useState } from "react";

export const Line = (): JSX.Element => {
  const [lineHeight, setLineHeight] = useState(0);
  const [dotobj, setDots] = useState({});

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    setLineHeight((pre) => (pre < scrollPosition ? scrollPosition : pre));
    const length = Math.floor(scrollPosition / 100);
    setDots((pre) => ({ ...pre, [length]: scrollPosition }));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const lineStyle = {
    width: "2px",
    height: `${lineHeight}px`,
    backgroundColor: "black",
    transform: "translateY(-10px)",
    transition: "height 0.1s",
  };

  const dotStyle = {
    width: "10px",
    height: "10px",
    backgroundColor: "red",
    borderRadius: "50%",
    position: "absolute",
    left: "21px",
  };

  return (
    <div style={{ height: "200vh" }}>
      <div style={lineStyle as CSSProperties} />
      {Object.entries(dotobj).map(([dotY], index) => {
        return (
          <div
            key={index}
            style={
              {
                ...dotStyle,
                top: `${+dotY * 100 + 110}px`,
                transform: "translateX(-5px)",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
};
