import Techlog from "../components/Techlog";
import "./page.scss";

export default async function PostPage() {
  const mdtest = `
  # test1
  
  \`\`\`sh
  # test2
  \`\`\`


  # test3

  `;
  // const test = mdtest.match(/#+\s(.+)/g);
  const test = mdtest.match(/(\\`\\`\\`)?[\s]+?(1)/gm);

  console.log(test);

  return (
    <div className="techpost_page">
      <div className="post_title">
        <h1>Just Remember !</h1>
        <span>off the top of my head....</span>
      </div>
      <Techlog />
    </div>
  );
}
