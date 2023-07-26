"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import "./MdfileViewer.scss";

interface MarkdownViewProps {
  mdPost: string;
}

export const MdfileViewer = ({ mdPost }: MarkdownViewProps): JSX.Element => {
  console.log(mdPost, mdPost.match(/-/g));

  return (
    <div className="md_wrapper">
      <ReactMarkdown
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
