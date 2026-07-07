import Link from "next/link";
import React from "react";

export const Footer = ({ detail = false }: { detail?: boolean }): JSX.Element => {
  return (
    <div className="footer_wrapper">
      <footer>
        <div className="icon_group">
          <Link href="mailto:uiop01900@gmail.com" target="_blank" aria-label="이메일 보내기">
            <i className="email" />
          </Link>
          <Link href="https://github.com/AwesomeYelim" target="_blank" aria-label="GitHub 프로필">
            <i className="github" />
          </Link>
          <Link href="https://www.instagram.com/honyelim" target="_blank" aria-label="Instagram 프로필">
            <i className="instagram" />
          </Link>
        </div>
        {detail && (
          <div className="detail">
            <Link href="/">© 2023 hongyelim. All Rights Reserved.</Link>
          </div>
        )}
      </footer>
    </div>
  );
};
