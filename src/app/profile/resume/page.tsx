import Image from "next/image";
import "./resume.scss";

interface Props {
  data?: number;
}

export default function ResumePage() {
  //
  return (
    <>
      <div className="progress">
        <span className="bar"></span>
      </div>
      <div id="wrap">
        <section className="profile">
          <h2>Profile & Contact</h2>
          <ul>
            <li>이름 : 홍예림</li>
            <li>
              이메일 : uiop01900@gmail.com
              <a className="mail" href="mailto:uiop01900@gmail.com?subject=안녕하세요.">
                ✉︎
              </a>
            </li>
            <li>
              연락처 : 010 - 8291 - 1153
              <button
                className="n_copy"
                // onClick={() => {
                //   const t = document.createElement("textarea");
                //   document.body.appendChild(t);
                //   t.value = "010-8291-1153";
                //   t.select();
                //   document.execCommand("copy");
                //   document.body.removeChild(t);
                // }}
              >
                copy
              </button>
            </li>
          </ul>
          <article>
            <a href="https://yelim-blog.vercel.app/" target="_blank">
              <button>Blog</button>
            </a>
            <a href="https://github.com/AwesomeYelim" target="_blank">
              <button>Github</button>
            </a>
          </article>
        </section>
        <section className="skill">
          <h2> I develop with</h2>
          {/* <Image
            src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=222323"
            width={40}
            height={10}
            alt="JavaScript"
          />
          <Image
            src="https://img.shields.io/badge/-Typescript-1F11B6?style=flat-square&logo=Typescript&logoColor=white"
            width={40}
            height={10}
            alt="Typescript"
          />
          <Image
            src="https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white"
            width={40}
            height={10}
            alt="React"
          />
          <Image
            src="https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=redux&logoColor=white"
            width={40}
            height={10}
            alt="React"
          />
          <Image
            src="https://img.shields.io/badge/Next.js-333?style=flat-square&logo=Next.js&logoColor=fff"
            width={40}
            height={10}
            alt="Next"
          />
          <Image
            src="https://img.shields.io/badge/Reactquery-red?style=flat-square&logo=Reactquery&logoColor=fff"
            width={40}
            height={10}
            alt="Reactquery"
          />
          <Image
            src="https://img.shields.io/badge/Node.js-darkgreen?style=flat-square&logo=Node.js&logoColor=fff"
            width={40}
            height={10}
            alt="Node"
          />
          <Image
            src="https://img.shields.io/badge/Sass-DB7093?style=flat-square&logo=Sass&logoColor=fff"
            width={40}
            height={10}
            alt="Sass"
          />
          <Image
            src="https://img.shields.io/badge/Three.js-764ABC?style=flat-square&logo=Three.js&logoColor=fff"
            width={40}
            height={10}
            alt="Three"
          /> */}
        </section>
        <section className="edu">
          <h2>Education</h2>
          <ul>
            <li>멋쟁이사자처럼 프론트앤드 스쿨 과정 21.10 ~ 22.1 수료</li>
            <li>그린컴퓨터학원 UI/UX 퍼블리셔 과정 21.5 ~ 21.9 수료</li>
            <li>Brock univ ESL 과정이수 16. 8 ~ 17.5</li>
            <li>일신여자고등학교 (이과) 11. 3 ~ 14. 2 졸</li>
          </ul>
        </section>
        <section className="coperation">
          <h2>Project</h2>
          <ol>
            <li>
              판다콘 기프티콘 웹서비스 UI&UX 디자인 및 React 구현 프로젝트
              <a href="https://www.figma.com/file/hAIFVC5e4t8kNl9P277e3p/%ED%8C%90%EB%8B%A4%EC%BD%98" target="_blank">
                link
              </a>
            </li>
            <li>
              판다콘 기프티콘 웹서비스 UI&UX 디자인 및 React 구현 프로젝트
              <a href="https://www.figma.com/file/hAIFVC5e4t8kNl9P277e3p/%ED%8C%90%EB%8B%A4%EC%BD%98" target="_blank">
                link
              </a>
            </li>
            <li>
              바나나마켓 UI&UX 디자인 및 반응형 웹 JavaScript 구현 프로젝트
              <a href="https://github.com/AwesomeYelim/BANANAMARKET" target="_blank">
                link
              </a>
            </li>
            <li>
              SHAKE SHACK 웹페이지 UI&UX 디자인 및 웹 리뉴얼 프로젝트
              <a href="https://github.com/AwesomeYelim/SHAKESHACK" target="_blank">
                link
              </a>
            </li>
          </ol>
        </section>

        <section className="career">
          <h2>Career</h2>
          <ul>
            <li>ssr 보안 솔루션 ui 개발 22. 7 ~ 현재</li>
            <li>GTC9 웹 디자이너, 번역, 로고제작 21. 1 ~ 21. 4</li>
            {/* <li>충북인터넷방송 미디어 크리에이티브 활동 20. 1 ~ 20. 12</li>
            <li>스터디서치 영어교육리더 활동 19. 5 ~ 19. 8</li> */}
          </ul>
        </section>
      </div>
    </>
  );
}
