"use client";

import classNames from "classnames";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../public/images/logo.svg";

const Nav = styled.div<{ $hide: boolean }>`
  position: fixed;
  top: 0;
  z-index: 99;
  width: 1024px;
  height: ${({ $hide }) => ($hide ? "80px" : "0px")};
  display: flex;
  justify-content: space-between;
  background-color: white;
  align-items: center;
  transition: 0.2s ease-in-out;
  // box-shadow: 5px 5px 10px;
  overflow: hidden;
  .logo {
    padding: 15px;
  }
  nav {
    display: flex;
    justify-content: flex-end;
    gap: 30px;
    padding: 30px;
    > a {
      color: #565656;
      font-weight: 700;
      &.active {
        color: #b3b3b3;
      }
    }
  }
`;
export default function NavBar() {
  const [navInfo, setNavInfo] = useState({ to: 0, hide: true });
  const location = usePathname();

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
    <Nav $hide={navInfo.hide}>
      <Link href="/" className="logo">
        <Image src={logo} alt="logo" width={50} height={50} priority />
      </Link>
      <nav>
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
