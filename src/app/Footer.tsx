import Link from "next/link";
import React from "react";

export const Footer = ({ detail = false }: { detail?: boolean }): JSX.Element => {
  return (
    <div className="footer_wrapper">
      <footer>
        <div className="icon_group">
          <Link href="mailto:uiop01900@gmail.com" target="_blank">
            <i className="email" />
          </Link>
          <Link href="https://github.com/AwesomeYelim" target="_blank">
            <i className="github" />
          </Link>
          <Link href="https://www.instagram.com/honyelim" target="_blank">
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
