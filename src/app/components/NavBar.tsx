"use client";

import classNames from "classnames";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Nav = styled.div<{ $hide: boolean }>`
  height: ${({ $hide }) => ($hide ? "80px" : "0px")};
`;
export default function NavBar() {
  let $ = document.body;
  const lo = localStorage;

  const location = usePathname();

  const {
    navInfo: [navInfo, setNavInfo],
    dark: [dark, setDark],
  } = {
    navInfo: useState({ to: 0, hide: true }),
    dark: useState(lo.getItem("data-theme") === "dark"),
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

  useEffect(() => {
    if (lo.getItem("data-theme") === "dark") {
      $.setAttribute("data-theme", "dark");
    } else {
      $.setAttribute("data-theme", "light");
    }
  }, [dark]);

  return (
    <Nav $hide={navInfo.hide} className="nav_wrapper">
      <Link href="/" className="logo">
        <svg width="17" height="50" viewBox="0 0 48 143" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M36.9774 34.4737C36.3857 34.7719 35.6744 35.2175 34.9055 35.7699M34.9055 35.7699C30.5564 38.894 24.3618 45.4314 27.5106 48.0095C29.9131 49.9766 45.946 50.2026 45.946 45.2681C45.946 39.5139 38.7783 37.1043 36.4791 36.3584C36.1791 36.2611 35.6011 36.0366 34.9055 35.7699ZM34.9055 35.7699C32.8614 34.986 29.8025 33.8368 29.8025 34.4737M31.5962 36.0157C30.1738 22.1569 26.4109 16.3057 20.8339 6.7166M36.0805 29.8475L36.0567 29.7464C34.7324 24.1207 33.4066 18.4883 31.1478 13.7415C30.457 12.2898 29.8025 8.64653 29.8025 9.80072M15.4529 8.25866H28.7064C29.699 8.25866 37.1474 5.98604 34.9844 4.83187C28.23 1.22768 20.1701 2.09043 13.1609 2.09043C10.7339 2.09043 2 3.99681 2 2.09043M35.1837 51.4363C38.5683 58.8852 42.1773 64.2606 34.7353 67.6279C28.9454 70.2477 22.6869 72.6977 17.6452 77.6513C8.74643 86.3945 37.0258 94.6139 40.4154 94.6139C41.2167 94.6139 42.041 94.2124 42.8077 93.5269M42.8077 93.5269C44.1695 92.3093 45.3495 90.1959 45.8962 87.846C46.4993 85.2536 44.3438 90.1542 42.8077 93.5269ZM42.8077 93.5269C42.4414 94.331 42.1104 95.0482 41.8603 95.5563C36.8318 105.774 29.6992 114.677 26.9127 126.997C24.9314 135.757 41.8318 120.468 42.1593 121.172C44.5129 126.23 43.1607 140.876 38.7712 140.876C35.877 140.876 34.7463 142.062 34.0876 137.106C32.8994 128.169 35.8892 128.539 40.5649 128.539"
            stroke={dark ? "white" : "black"}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </Link>
      <nav>
        <i
          className={classNames("mode", { dark })}
          onClick={() => {
            setDark(!dark);
            if (dark) {
              $.setAttribute("data-theme", "light");
              lo.setItem("data-theme", "light");
            } else {
              $.setAttribute("data-theme", "dark");
              lo.setItem("data-theme", "dark");
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
