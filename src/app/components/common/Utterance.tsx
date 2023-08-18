"use client";

import Cookies from "js-cookie";

export const Utterance = (): JSX.Element => {
  //

  const theme = document.documentElement.dataset.theme === "dark" ? "github-dark" : "github-light";

  return (
    <section
      ref={(elem) => {
        if (!elem) {
          return;
        }
        const scriptElem = document.createElement("script");
        scriptElem.src = "https://utteranc.es/client.js";
        scriptElem.async = true;
        scriptElem.setAttribute("repo", "AwesomeYelim/hongyelim");
        scriptElem.setAttribute("issue-term", "pathname");
        scriptElem.setAttribute("theme", theme);
        scriptElem.setAttribute("label", "blog-comment");
        scriptElem.crossOrigin = "anonymous";
        elem.replaceChildren(scriptElem);
      }}
    />
  );
};
