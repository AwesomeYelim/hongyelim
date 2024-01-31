"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { styled } from "styled-components";
import { ElementContent, Position } from "react-markdown/lib/ast-to-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
// import { useDark } from "../hooks";
import dateFn from "./functions/date";
import { Inter } from "next/font/google";
import { throttle } from "lodash";
import React from "react";
import titleCondition from "react-text-settle";
import "./MdfileViewer.scss";

interface MarkdownViewProps {
  created_at: number;
  mdPost: string;
  useToc?: boolean;
}

const TOCwrapper = styled.div`
  position: absolute;
  right: -1rem;
  .toc_content {
    position: fixed;
    top: 30%;
    max-width: 300px;
    height: 500px;
    overflow-y: auto;
    padding-right: 20px;

    h1,
    h2,
    h3,
    h4 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      transition: 0.25s linear;
      font-size: 15px;
      height: 20px;
      &:hover {
        color: #858585;
      }
    }
    h1 {
      margin-top: 15px;
    }
    span {
      font-size: 15px;
      font-weight: bold;
      border-bottom: 2px solid #ccc;
      cursor: pointer;
      padding-left: 4px;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
  }
`;

const inter = Inter({ subsets: ["latin"] });

// 오른쪽 toc
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
      fontWeight: target[0] === children ? 700 : 700 - level * 150,
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

  // 초기 md h tag 위치값 표기 및 h tag 랜더링
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

  const scrollEffect = useCallback(() => {
    Object.entries(post).forEach(([key, scrollY], i, arr) => {
      /** 처음 과 끝 부분 */
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
    document.addEventListener("scroll", throttle(scrollEffect, 300));

    return () => document.removeEventListener("scroll", throttle(scrollEffect, 300));
  }, [scrollEffect]);

  // /**  memo 에서 md 파일 입력시 스크롤 이벤트 */
  // useEffect(() => {
  //   if (
  //     mdRef.current &&
  //     mdRef.current.clientHeight < mdRef.current?.scrollHeight
  //   ) {
  //     mdRef.current.scroll({
  //       top: mdRef.current?.scrollHeight,
  //       behavior: "smooth",
  //     });
  //   }
  // }, [mdPost]);

  const headingTag = useToc && {
    h1: tocHandler,
    h2: tocHandler,
    h3: tocHandler,
    h4: tocHandler,
  };

  return (
    <>
      {/* 오른쪽 TOC */}
      {useToc && (
        <TOCwrapper className="toc_wrapper">
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
        </TOCwrapper>
      )}
      {/* markdown contents */}
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
                  style={{ width: "100%", height: "100%" }}
                  decoding="sync"
                  priority
                  // fill
                  // placeholder="blur"
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
                <code className={`${inter.className} ${className}`} {...props}>
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
