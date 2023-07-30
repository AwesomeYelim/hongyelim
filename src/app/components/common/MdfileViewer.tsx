"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { styled } from "styled-components";
import { ElementContent } from "react-markdown/lib/ast-to-react";
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
      transition: 0.2s linear;
      &:hover {
        color: #858585;
      }
    }
  }
`;

export const MdfileViewer = ({ mdPost }: MarkdownViewProps): JSX.Element => {
  const post: { [key in string]: number } = {};
  // const [post, setPost] = useState<{ [key in string]: number }>();
  const innerText = mdPost.match(/#+\s(.+)/g);

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
          window.scrollTo(0, post![e.currentTarget.innerHTML] + 300);
        }}
      >
        {children}
      </HeadingTag>
    );
  };

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
    node: any;
  }) => {
    // setPost((post[value] = position?.end.offset));
    const { value, position } = el as ElementContent & {
      value: string;
    };
    post[value] = position?.end.offset as number;
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    return <HeadingTag>{children}</HeadingTag>;
  };
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
              // setPost(children, props.node.position?.end.offset!);

              return !inline && match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  PreTag="div"
                  {...props}
                  style={coldarkCold}
                >
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
          }}
        >
          {mdPost}
        </ReactMarkdown>
      </div>
      {/* 오른쪽 TOC */}
      <TOCwrapper>
        <div className="toc_content">
          {innerText?.map((el) => {
            const [level, children] = el.split("# ");
            return heading({ level: level.length + 1, children });
          })}
        </div>
      </TOCwrapper>
    </>
  );
};
