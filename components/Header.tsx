import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { pathname } = router;
  console.log(pathname);

  return (
    <div className="head">
      <img className="headBackImg" />
      <div className="headBackImgTint" />
      <div className="tabWrapper">
        <Link href="/">
          <a>
            <div className="clearStyle tab startTab">
              <p className="tabTxt">
                {pathname === "/" ? (
                  <u>
                    <b>Home</b>
                  </u>
                ) : (
                  <b>Home</b>
                )}
              </p>
            </div>
          </a>
        </Link>
        <Link href="/gallery">
          <a>
            <div className="clearStyle tab">
              <p className="tabTxt">
                {pathname === "/gallery" ? (
                  <u>
                    <b>Gallery</b>
                  </u>
                ) : (
                  <b>Gallery</b>
                )}
              </p>
            </div>
          </a>
        </Link>
        <Link href="/commission">
          <a
            onClick={() => {
              window.sessionStorage.removeItem("active");
            }}
          >
            <div className="clearStyle tab">
              <p className="tabTxt">
                {pathname === "/commission" ? (
                  <u>
                    <b>Commission</b>
                  </u>
                ) : (
                  <b>Commission</b>
                )}
              </p>
            </div>
          </a>
        </Link>
        <Link href="/about_me">
          <a>
            <div className="clearStyle tab endTab">
              <p className="tabTxt">
                {pathname === "/about_me" ? (
                  <u>
                    <b>About Me</b>
                  </u>
                ) : (
                  <b>About Me</b>
                )}
              </p>
            </div>
          </a>
        </Link>
      </div>
      <div className="headTitle">
        <img className="logo" src="head/MKGmagic-Logo.png" />
      </div>
    </div>
  );
};

export default Header;
