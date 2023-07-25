"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface MarkdownViewProps {
  post: string;
}

export const MdfileViewer = ({ post }: MarkdownViewProps): JSX.Element => {
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
              <SyntaxHighlighter language={match[1]} PreTag="div" {...props} style={coldarkCold}>
                {String(children).replace(/\n$/, "/n")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}>
        {post}
      </ReactMarkdown>
    </div>
  );
};
