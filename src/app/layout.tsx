import { Inter, Notable } from "next/font/google";
import Link from "next/link";
import Head from "next/head";
import NavBar from "./components/NavBar";
import "./reset.scss";
import "./layout.scss";
import "./dark.scss";
import Cookies from "js-cookie";

const inter = Inter({ subsets: ["latin"] });
// const notable = Notable({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "ylblog",
  description: "this is yelim blog :)",
  icons: {
    shortcut: "/images/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `

            const cookie = require("cookie");
            const theme = Cookies.get("theme");
            document.body.setAttribute("data-theme", theme);
            console.log(theme);

          `,
          }}></script> */}
      </head>
      <body
        className={inter.className}
        suppressHydrationWarning={true}
        // data-theme="dark"
      >
        <div className="wrapper">
          <NavBar />
          <div className="content">{children}</div>
        </div>
      </body>
    </html>
  );
}
