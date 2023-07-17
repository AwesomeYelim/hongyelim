import ReactMarkdown from "react-markdown";

interface Props {
  data?: number;
}

export const MdfileViewer = (): JSX.Element => {
  //
  return (
    <ReactMarkdown>
      {`#  헤딩 
  
  ### 제목임

  **굵**

  ~~~ts
  type  = {
name : string
  }
  ~~~
  `}
    </ReactMarkdown>
  );
};
