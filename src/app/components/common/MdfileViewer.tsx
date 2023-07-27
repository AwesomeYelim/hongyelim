"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./MdfileViewer.scss";
import { useState } from "react";

interface MarkdownViewProps {
  mdPost: string;
}

export const MdfileViewer = ({ mdPost }: MarkdownViewProps): JSX.Element => {
  const [toc, setToc] = useState([]);
  const headTag = mdPost.match(/(\#{4})\w+/);
  // console.log(, headTag);

  return (
    <div className="md_wrapper">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

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
  );
};
