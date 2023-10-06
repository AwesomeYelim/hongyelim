"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { styled } from "styled-components";
import { ElementContent } from "react-markdown/lib/ast-to-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { titleCondition } from "./functions/ellipsis";
import Image from "next/image";

// import { useDark } from "../hooks";
import { Inter } from "next/font/google";
import "./MdfileViewer.scss";

interface MarkdownViewProps {
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

export const MdfileViewer = ({
  mdPost,
  useToc = false,
}: MarkdownViewProps): JSX.Element => {
  let innerText: RegExpMatchArray | string | null;

  innerText = mdPost
    ?.replace(/\`\`\`([\s\S]*?)\`\`\`/g, "")
    .match(/#+\s(.+)/gm);

  const [target, setTarget] = useState("");
  const { mdRef } = { mdRef: useRef<HTMLDivElement>(null) };

  const post: {
    [key in string]: number;
  } = {};

  // 초기 md h tag 위치값 표기 및 h hag 랜더링
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

    return <HeadingTag>{children as string}</HeadingTag>;
  };

  // 오른쪽 toc
  const heading = ({
    level,
    children,
  }: {
    level: number;
    children: string;
  }) => {
    const style = {
      style: {
        marginLeft: level * 20,
        fontSize: target === children ? 15 : 13,
        fontWeight: target === children ? 700 : 700 - level * 150,
      },
    };
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
      <HeadingTag
        key={children}
        {...style}
        {...titleCondition}
        onClick={(e) => {
          e.preventDefault();

          window.scroll({
            left: 0,
            top: post![e.currentTarget.innerHTML] + 200,
            behavior: "smooth",
          });
          // if (target !== e.currentTarget.innerHTML) {
          //   setTarget(e.currentTarget.innerHTML);
          // }
        }}
      >
        {children}
      </HeadingTag>
    );
  };

  const scrollEffect = useCallback(() => {
    Object.entries(post).forEach(([key, scrollY], i, arr) => {
      if (!i || arr[arr.length - 1]) {
        if (window.scrollY === scrollY || window.scrollY > scrollY) {
          setTarget(key);
        }
      } else if (window.scrollY === scrollY || window.scrollY + 110 > scrollY) {
        setTarget(key);
      }
    });
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", scrollEffect);

    return () => document.removeEventListener("scroll", scrollEffect);
  }, []);

  /**  memo 에서 md 파일 입력시 스크롤 이벤트 */
  useEffect(() => {
    if (
      mdRef.current &&
      mdRef.current.clientHeight < mdRef.current?.scrollHeight
    ) {
      mdRef.current.scroll({
        top: mdRef.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [mdPost]);

  const headingTag = useToc && {
    h1: tocHandler,
    h2: tocHandler,
    h3: tocHandler,
    h4: tocHandler,
  };

  return (
    <>
      {/* markdown contents */}
      <div className="md_wrapper" ref={mdRef}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  PreTag="div"
                  {...props}
                  style={coldarkDark}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={`${inter.className} ${className}`} {...props}>
                  {children}
                </code>
              );
            },
            ...headingTag,
            img: ({ node }) => {
              return (
                <Image
                  className="main_img"
                  src={`/images/md/${
                    (node.properties?.src as string).split("b_")[1]
                  }`}
                  alt="mdImag"
                  width={500}
                  height={150}
                  style={{ width: "100%", height: "100%" }}
                  loading="eager"
                  priority
                />
              );
            },
          }}
        >
          {mdPost}
        </ReactMarkdown>
      </div>
      {/* 오른쪽 TOC */}
      {useToc && (
        <TOCwrapper>
          <div className="toc_content">
            <span
              onClick={() => {
                window.scroll({ left: 0, top: 0, behavior: "smooth" });
                setTarget("");
              }}
            >
              목차
            </span>
            {innerText?.map((el) => {
              const [level, children] = el.split("# ");
              return heading({ level: level.length + 1, children });
            })}
          </div>
        </TOCwrapper>
      )}
    </>
  );
};
