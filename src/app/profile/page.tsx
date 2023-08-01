import Image from "next/image";
import main from "../../../public/images/main.png";
import "./ProfilePage.scss";

export default function ProfilePage() {
  // console.log(localStorage.getItem("data-theme") === "dark");

  return (
    <div>
      <Image className="main_img" src={main} alt="main yelim" width={100} height={100} priority />
      <p>Hi there! this is yelim, I am frontEnd Developer</p>
    </div>
  );
}
