"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./MdfileViewer.scss";
import { styled } from "styled-components";
import { useState } from "react";

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
      transition: 0.2s linear;
      &:hover {
        color: #858585;
      }
    }
  }
`;

export const MdfileViewer = ({ mdPost }: MarkdownViewProps): JSX.Element => {
  const [pos, setPost] = useState(0);
  const innerText = mdPost.match(/#+\s(.+)/g)?.join("\n\n");

  const heading = ({ level, children }: { level: number; children: React.ReactNode[] }) => {
    const style = {
      style: {
        marginLeft: level * 20,
        fontSize: 25 - level * 4,
        fontWeight: 700 - level * 100,
      },
    };
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
      <HeadingTag
        {...style}
        onClick={(e) => {
          e.preventDefault();
          console.log(e.currentTarget.innerHTML);
          // window.scrollTo(0, 300);
          console.log(pos);
        }}>
        {children}
      </HeadingTag>
    );
  };

  return (
    <>
      <div className="md_wrapper">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              setPost(children, props.node.position?.end.offset!);
              return !inline && match ? (
                <SyntaxHighlighter language={match[1]} PreTag="div" {...props} style={coldarkCold}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}>
          {mdPost}
        </ReactMarkdown>
      </div>
      <TOCwrapper>
        <div className="toc_content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: heading,
              h2: heading,
              h3: heading,
              h4: heading,
            }}>
            {innerText!}
          </ReactMarkdown>
        </div>
      </TOCwrapper>
    </>
  );
};