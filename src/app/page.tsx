import Image from "next/image";
import main from "../../public/images/main.jpg";

export default function Home() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Image style={{ borderRadius: "100%" }} src={main} alt="main yelim" width={300} height={300} priority />
    </div>
  );
}
