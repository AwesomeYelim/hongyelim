import Image from "next/image";
import main from "../../../public/images/main.jpg";
import { Footer } from "../Footer";
import Link from "next/link";
import "./ProfilePage.scss";

export default function ProfilePage() {
  return (
    <div className="profile_wrap">
      <h1>About me</h1>
      <div className="content_wrap">
        <div className="img_area">
          <Image
            className="main_img"
            src={main}
            alt="main yelim"
            width={150}
            height={150}
            priority
          />
          <Footer />
        </div>
        <div>
          <p>Hi there! this is yelim :), I am a web developer.</p>
          <br />
          <b>Done is better than perfect</b>
          <br />
          <p>I learned how to finish through this work. </p>
          <p>It was not an easy journey, </p>
          <p>but I learned to put a lot of effort into making something !</p>
          <p>it was and will be a very precious time for me.</p>
          <br />

          <p>
            <b>Learning</b>, it is a great thing!
          </p>
        </div>
      </div>
      <Link
        href="https://drive.google.com/file/d/1s4bhCJR6EddnHv9ydE7tqgjDrUhaVl2_/view?usp=sharing"
        className="resume_wrap"
        target="_blank"
      >
        <b className="resume">→ &nbsp; resume</b>
      </Link>
    </div>
  );
}
