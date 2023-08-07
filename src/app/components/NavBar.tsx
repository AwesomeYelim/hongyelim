"use client";

import classNames from "classnames";
import Cookies from "js-cookie";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Nav = styled.div<{ $hide: boolean }>`
  height: ${({ $hide }) => ($hide ? "111px" : "0px")};
`;
export default function NavBar() {
  const location = usePathname();

  const {
    navInfo: [navInfo, setNavInfo],
    dark: [dark, setDark],
  } = {
    navInfo: useState({ to: 0, hide: true }),
    dark: useState(Cookies.get("theme") === "dark"),
  };

  const scrollToHide = useCallback(() => {
    setNavInfo((prev) => ({ ...prev, to: window.pageYOffset }));
    //  스크롤 아래로 내릴때
    if (navInfo.to < window.pageYOffset) {
      setNavInfo({ to: window.pageYOffset, hide: false });
      //  스크롤 위로 올릴때
    } else if (navInfo.to > window.pageYOffset) {
      setNavInfo({ to: window.pageYOffset, hide: true });
    }
  }, [navInfo]);

  useEffect(() => {
    document.addEventListener("scroll", scrollToHide);
    return () => document.removeEventListener("scroll", scrollToHide);
  }, [navInfo]);

  return (
    <Nav $hide={navInfo.hide} className="nav_wrapper">
      <Link href="/" className="logo">
        <i />
      </Link>
      <nav>
        <i
          className="mode"
          onClick={() => {
            setDark(!dark);
            if (dark) {
              document.documentElement.dataset.theme = "light";
              Cookies.set("theme", "light");
            } else {
              document.documentElement.dataset.theme = "dark";
              Cookies.set("theme", "dark");
            }
          }}
        />
        <Link href="/profile" className={classNames({ active: location?.includes("/profile") })}>
          Profile
        </Link>
        <Link href="/posts" className={classNames({ active: location?.includes("/posts") })}>
          Posts
        </Link>
        <Link href="/contact" className={classNames({ active: location?.includes("/contact") })}>
          Contact
        </Link>
      </nav>
    </Nav>
  );
}
