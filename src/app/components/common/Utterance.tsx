"use client";

import Cookies from "js-cookie";

interface Props {
  data?: number;
}

export const Utterance = (): JSX.Element => {
  //

  const theme = Cookies.get("theme") === "dark" ? "github-dark" : "github-light";
  return (
    <section
      ref={(elem) => {
        if (!elem) {
          return;
        }
        const scriptElem = document.createElement("script");
        scriptElem.src = "https://utteranc.es/client.js";
        scriptElem.async = true;
        scriptElem.setAttribute("repo", "cpro95/utterances_mycodings_fly_dev");
        scriptElem.setAttribute("issue-term", "pathname");
        scriptElem.setAttribute("theme", theme);
        scriptElem.setAttribute("label", "blog-comment");
        scriptElem.crossOrigin = "anonymous";
        elem.replaceChildren(scriptElem);
      }}
    />
  );
};
