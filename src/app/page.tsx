import { Tag } from "./components/Tag";
import Image from "next/image";
import Welcome from "../../public/images/welcome.svg";
import "./styles/page.scss";

export default async function HomePage() {
  return (
    <div className="main_wrapper">
      <div className="svg_wrapper">
        <div className="welcome_img">
          <Welcome width={200} height={150} />
        </div>
        <div className="text_area">
          <p>안녕하세요.</p>
          <p>이곳은 새로운 정보를</p>
          <p>습득하고 공유하며 review 하기 위한 공간입니다.🌲</p>
          <p>💕 와 💬 는 큰 힘이 됩니다. 🙇‍♀️</p>
          <p>감사합니다. </p>
        </div>
      </div>
      <Tag />
    </div>
  );
}
