import Image from "next/image";
import main from "../../../public/images/main.jpg";
import { Footer } from "../Footer";
import Link from "next/link";
import "./ProfilePage.scss";

const SKILLS = {
  "Language & Runtime": ["Go", "TypeScript", "Node.js"],
  "DB & Infra": [
    "Oracle",
    "PostgreSQL",
    "MySQL",
    "MariaDB",
    "MSSQL",
    "MongoDB",
    "Elasticsearch",
    "Redis",
    "gRPC",
    "Nginx",
  ],
  Cloud: ["Kubernetes (AKS·EKS)", "Azure", "OpenShift", "Firebase"],
  Frontend: ["React", "Redux Toolkit", "Next.js"],
};

const TIMELINE = [
  {
    period: "2024 ~ 현재",
    role: "백엔드·보안 엔지니어 — SCA",
    desc: "전자금융기반시설 보안 취약점 평가·컴플라이언스 진단 솔루션 SCA의 자산 수집 백엔드를 Go로 담당. 12종 DB·미들웨어·OS·Kubernetes를 하나의 수집 체계로 추상화하고, 에이전트–서버 연동과 바이너리 무결성 검증을 설계·구현.",
  },
  {
    period: "2022.07 ~ 2024.01",
    role: "프런트엔드 엔지니어 — SSR Corp",
    desc: "React·TypeScript로 보안 진단 제품(MetiEye 3.0 웹쉘 탐지, Solidstep CCE/CVE)의 UI 개발. 컴포넌트 89개 구현, i18n 자동화, OTP 로그인 고도화.",
  },
];

export default function ProfilePage() {
  return (
    <div className="profile_wrap">
      <h1>About me</h1>

      <div className="content_wrap">
        <div className="img_area">
          <Image className="main_img" src={main} alt="홍예림 프로필 사진" width={150} height={150} priority />
          <Footer />
        </div>
        <div className="intro_area">
          <p className="name">
            홍예림 <span>Yelim Hong</span>
          </p>
          <p className="role">백엔드·보안 개발자 (Go)</p>
          <p className="headline">이질적인 멀티플랫폼을 하나의 체계로 추상화·안정화합니다.</p>
          <br />
          <p>
            프런트엔드 엔지니어로 커리어를 시작해 보안 진단 제품의 UI를 만들었고,
            <br />
            지금은 백엔드·보안으로 깊이를 쌓아가고 있습니다.
          </p>
          <p>
            서로 다른 플랫폼의 이질성을 추상화해 <b>어디서든 안정적으로 동작하게</b> 만드는 데 강합니다.
          </p>
          <br />
          <b className="motto">Done is better than perfect</b>
        </div>
      </div>

      <section className="career_section">
        <h2>Career</h2>
        <ul className="career_list">
          {TIMELINE.map((item) => (
            <li key={item.period}>
              <span className="period">{item.period}</span>
              <div>
                <p className="role_title">{item.role}</p>
                <p className="role_desc">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="skills_section">
        <h2>Skills</h2>
        {Object.entries(SKILLS).map(([category, items]) => (
          <div key={category} className="skill_group">
            <span className="skill_category">{category}</span>
            <div className="skill_tags">
              {items.map((skill) => (
                <span key={skill} className="skill_tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Link
        href="https://tangy-slip-4d8.notion.site/About-Yelim-d8527c81adae431f8f75a9eb723f3b3c"
        className="resume_wrap"
        target="_blank">
        <b className="resume">이력서 전체 보기 →</b>
      </Link>
    </div>
  );
}
