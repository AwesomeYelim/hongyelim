import { Tag } from "./components/Tag";
import Image from "next/image";
import Welcome from "../../public/images/welcome.svg";
import Dance from "../../public/images/dance.gif";
import "./styles/page.scss";

export default async function HomePage() {
  return (
    <div className="main_wrapper">
      <div className="svg_wrapper">
        <div className="welcome_img">
          <Welcome width={200} height={150} />
        </div>
        <div className="text_area">
          <p>Hello !</p>
          <p>
            This is <span>Yelimblog.</span>
          </p>
          <p>It `s time to learning new things !</p>
          <p className="upper">Just click it →</p>
        </div>
        <Image
          className="dance"
          src={Dance}
          alt="dance"
          height={200}
          width={200}
        />
      </div>
      <Tag />
    </div>
  );
}
