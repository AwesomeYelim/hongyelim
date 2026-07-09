"use client";

import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import scss from "react-syntax-highlighter/dist/esm/languages/prism/scss";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ElementContent, Position } from "react-markdown/lib/ast-to-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import dateFn from "./functions/date";
import { throttle } from "lodash";
import React from "react";
import titleCondition from "react-text-settle";
import "./MdfileViewer.scss";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("sh", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("golang", go);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("md", markdown);

interface MarkdownViewProps {
  created_at: number;
  mdPost: string;
  useToc?: boolean;
}

const Heading = ({
  level,
  children,
  target,
  post,
}: {
  level: number;
  children: string;
  target: [string, number];
  post: { [key in string]: number };
}) => {
  const style = {
    style: {
      marginLeft: level * 20,
      fontSize: target[0] === children ? 15 : 13,
      fontWeight: target[0] === children ? 700 : 500,
    },
  };
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      className="heading_group"
      key={children}
      {...style}
      {...titleCondition}
      onClick={(e) => {
        e.preventDefault();
        window.scroll({
          left: 0,
          top: post![e.currentTarget.innerHTML],
          behavior: "smooth",
        });
      }}>
      {children}
    </HeadingTag>
  );
};

const MdfileViewer = ({ mdPost, useToc = false, created_at }: MarkdownViewProps): JSX.Element => {
  let innerText: RegExpMatchArray | string | null;

  innerText = mdPost?.replace(/\`\`\`([\s\S]*?)\`\`\`/g, "").match(/#+\s(.+)/gm);

  const [target, setTarget] = useState<[string, number]>(["", 0]);
  const mdRef = useRef<HTMLDivElement>(null);

  const post: {
    [key in string]: number;
  } = {};

  const tocHandler = ({
    level,
    children,
    node: {
      children: [el],
    },
  }: {
    level: number;
    children: React.ReactNode[] | string;
    node: {
      children: ElementContent[];
    };
  }) => {
    const { value, position } = el as ElementContent & {
      value: string;
    };
    post[value] = position?.end.offset as number;

    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    if (HeadingTag === "h1") {
      return (
        <div className="h1_wrap">
          <HeadingTag>{children as string}</HeadingTag>
          <span>{dateFn(created_at)}</span>
        </div>
      );
    }
    return <HeadingTag>{children as string}</HeadingTag>;
  };

  const throttledScrollEffect = useRef(
    throttle(() => {}, 300)
  );

  const scrollEffect = useCallback(() => {
    Object.entries(post).forEach(([key, scrollY], i, arr) => {
      if (!i || arr[arr.length - 1]) {
        if (window.scrollY === scrollY || window.scrollY > scrollY) {
          setTarget([key, scrollY]);
        }
      } else if (window.scrollY === scrollY || window.scrollY + 110 > scrollY) {
        setTarget([key, scrollY]);
      }
    });
  }, [target[1]]);

  useEffect(() => {
    const handler = throttle(scrollEffect, 300);
    document.addEventListener("scroll", handler);
    return () => document.removeEventListener("scroll", handler);
  }, [scrollEffect]);

  const headingTag = useToc && {
    h1: tocHandler,
    h2: tocHandler,
    h3: tocHandler,
    h4: tocHandler,
  };

  return (
    <>
      {useToc && (
        <div className="toc_wrapper">
          <div className="toc_content">
            <span
              onClick={() => {
                window.scroll({ left: 0, top: 0, behavior: "smooth" });
                setTarget(["", 0]);
              }}>
              목차
            </span>
            {innerText?.map((el) => {
              const [level, children] = el.split("# ");

              const props = {
                level: level.length + 1,
                children,
                target,
                post,
              };
              return <Heading key={children} {...props} />;
            })}
          </div>
        </div>
      )}
      <div className="md_wrapper" ref={mdRef}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node }) => {
              const posi = node?.position as Position;

              posi.end.offset = (posi.end?.offset as number) + 150;
              posi.end.column = (posi.end?.column as number) + 150;

              const src = (node.properties?.src as string).split("_").at(-1);

              return (
                <Image
                  className="main_img"
                  src={src ? `/images/md/${src}` : `/images/empty.png`}
                  alt="mdImag"
                  width={500}
                  height={150}
                  style={{ width: "70%", height: "initial" }}
                  decoding="sync"
                  priority
                />
              );
            },
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter language={match[1]} PreTag="div" {...props} style={coldarkDark}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },

            ...headingTag,
          }}>
          {mdPost}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default React.memo(MdfileViewer);
