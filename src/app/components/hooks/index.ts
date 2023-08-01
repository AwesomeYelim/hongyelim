import { useEffect, useState } from "react";
import { coldarkCold, cb } from "react-syntax-highlighter/dist/esm/styles/prism";

export const useDark = (button?: boolean) => {
  const $ = localStorage.getItem("data-theme");

  const [color, setColor] = useState<{
    [key: string]: React.CSSProperties;
  }>($ === "dark" ? cb : coldarkCold);

  const dark = color;

  useEffect(() => {
    if ($ === "dark") {
      setColor(cb);
    } else {
      setColor(coldarkCold);
    }
  }, [$, button]);

  return [dark];
};
