"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
// import fs from "fs";
import mdfile from "./md/test.md";

interface MarkdownViewProps {
  post: string;
}

export const MdfileViewer = ({ post }: MarkdownViewProps): JSX.Element => {
  // const mark = fs.readFileSync("ylblog/src/app/components/common/md/test.md", "utf-8");
  // console.log(mark);

  const children = `Here is some JavaScript code:

  ~~~js
  console.log('It works!')
  const hhh = {
    yelim : true
  }

  console.log(hhh)
  ~~~
  `;
  return (
    <div>
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
        {children}
      </ReactMarkdown>
    </div>
  );
};
