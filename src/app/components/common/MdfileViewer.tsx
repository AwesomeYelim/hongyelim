"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { styled } from "styled-components";
import { ElementContent } from "react-markdown/lib/ast-to-react";
import { useEffect, useState } from "react";
import { titleCondition } from "./functions/ellipsis";
// import { useDark } from "../hooks";
import "./MdfileViewer.scss";

interface MarkdownViewProps {
  mdPost: string;
}

const TOCwrapper = styled.div`
  position: absolute;
  right: -1rem;
  .toc_content {
    position: fixed;
    top: 30%;
    width: 250px;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
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

export const MdfileViewer = ({ mdPost }: MarkdownViewProps): JSX.Element => {
  const innerText = mdPost.match(/#+\s(.+)/g);
  const [target, setTarget] = useState("");

  const post: {
    [key in string]: number;
  } = {};

  // const [dark] = useDark();

  // 초기 md h tag 위치값 표기 및 h hag 랜더링
  const tocHandler = ({
    level,
    children,
    node: {
      children: [el],
    },
  }: {
    level: number;
    children: React.ReactNode[];
    node: {
      children: ElementContent[];
    };
  }) => {
    const { value, position } = el as ElementContent & {
      value: string;
    };

    post[value] = position?.end.offset as number;
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    return <HeadingTag>{children}</HeadingTag>;
  };

  // 오른쪽 toc
  const heading = ({ level, children }: { level: number; children: string }) => {
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
          window.scroll({ left: 0, top: post![e.currentTarget.innerHTML] + 100, behavior: "smooth" });
          // setTarget(e.currentTarget.innerHTML);
        }}>
        {children}
      </HeadingTag>
    );
  };

  const scrollEffect = () => {
    Object.entries(post).forEach(([key, scrollY]) => {
      if (window.scrollY === scrollY || window.scrollY + 110 > scrollY) {
        setTarget(key);
      }
    });
  };

  useEffect(() => {
    document.addEventListener("scroll", scrollEffect);
  }, []);

  return (
    <>
      {/* markdown contents */}
      <div className="md_wrapper">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
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
            h1: tocHandler,
            h2: tocHandler,
            h3: tocHandler,
            h4: tocHandler,
          }}>
          {mdPost}
        </ReactMarkdown>
      </div>
      {/* 오른쪽 TOC */}
      <TOCwrapper>
        <div className="toc_content">
          <span
            onClick={() => {
              window.scroll({ left: 0, top: 0, behavior: "smooth" });
              setTarget("");
            }}>
            목차
          </span>
          {innerText?.map((el) => {
            const [level, children] = el.split("# ");
            return heading({ level: level.length + 1, children });
          })}
        </div>
      </TOCwrapper>
    </>
  );
};
