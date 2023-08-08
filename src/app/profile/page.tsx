import Image from "next/image";
import main from "../../../public/images/main.png";
import { Footer } from "../Footer";
import "./ProfilePage.scss";

export default function ProfilePage() {
  return (
    <div className="profile_wrap">
      <h1>About me</h1>
      <div className="contnent_wrap">
        <div>
          <Image className="main_img" src={main} alt="main yelim" width={150} height={150} priority />
          <Footer />
        </div>
        <div>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
          <p>Hi there! this is yelim, I am a web developer.</p>
        </div>
      </div>
    </div>
  );
}
