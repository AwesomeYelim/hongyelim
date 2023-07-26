"use client";

import classNames from "classnames";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = styled.nav`
  position: fixed;
  top: 0;
  display: flex;
  justify-content: flex-end;
  gap: 30px;
  padding: 30px;
  z-index: 999;
  > a {
    color: #565656;
    font-weight: 700;
    &.active {
      color: #b3b3b3;
    }
  }
`;
export default function NavBar() {
  const location = usePathname();

  return (
    <Nav>
      <Link href="/profile" className={classNames({ active: location?.includes("/profile") })}>
        Profile
      </Link>
      <Link href="/posts" className={classNames({ active: location?.includes("/posts") })}>
        Posts
      </Link>
      <Link href="/contact" className={classNames({ active: location?.includes("/contact") })}>
        Contact
      </Link>
    </Nav>
  );
}
