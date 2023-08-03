import { getPosts } from "@/service/posts";
import Link from "next/link";
import Image from "next/image";
import main from "../../public/images/main.png";
import "./page.scss";

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="main_wrapper">
      <svg width="500" viewBox="0 0 3794 2088" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_i_1102_5)">
          <path
            d="M9 2078.21C56.3333 2040.55 165.7 1886.01 224.5 1569.21C283.3 1252.41 330.333 1147.21 346.5 1134.21C376 1364.21 446.7 1812.41 493.5 1765.21C552 1706.21 591.5 1515.21 606 1324.71C620.5 1134.21 626 904.713 655 909.213C684 913.713 709 1501.21 767.5 1491.21C826 1481.21 806.5 1080.21 894.5 693.713C941.3 537.313 985.667 472.213 1002 459.213C964.667 692.38 923.2 1116.61 1056 948.213C1222 737.713 1151 681.713 1134 672.713C1117 663.713 967.5 723.213 1073.5 1033.21C1124 1166.71 1238.52 941.519 1283.5 849.213C1369.5 672.713 1461 398.213 1450.5 190.713C1442.1 24.7128 1400 1.54615 1380 10.7128C1330.83 10.7128 1254.3 134.813 1341.5 631.213C1395 922.213 1620 714.5 1574.5 517.713C1552.4 422.124 1651.67 337.38 1696.5 308.213C1626.67 343.213 1475.24 514.877 1620 615.5C1776.5 724.287 1990 147.713 2007 169.213C1939 244.713 1840.3 417.113 1989.5 502.713C2069.9 542.313 2144.33 439.667 2166.5 374C2220.5 232.713 2145.02 1 2069 139.213C2052.5 169.213 2065.5 296.713 2226 205.213C2354.4 132.013 2356 116 2343 139.213C2372 129.713 2421.3 139.313 2386.5 253.713C2372.1 334.913 2380.5 341.88 2386.5 335.213C2418.67 259.88 2497.2 115.213 2554 139.213C2593 155.692 2600.5 205.213 2612.5 232.713C2612.5 253.713 2779 4.71289 2797.5 253.713C2797.5 417.713 2868.5 443.213 3291 291.213C3415.28 246.5 3264.07 132.55 3143.5 246.5C3061.5 324 3186 659.713 3784.5 355.213"
            stroke="black"
            strokeWidth="18"
            strokeMiterlimit="2.13145"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="start"></path>
        </g>
      </svg>

      <ul className="main_posts">
        {posts.map(({ id, title, image }) => {
          return (
            <li key={id}>
              <Link href={`/posts/${id}_${title}`}>
                <Image src={`/images/${image}.png`} alt={image} width={40} height={20} />
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
