import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <div className="footContact">
          <div className="comMethod">
            <div className="icon">
              <img className="iconImg" src="icons/igLogo.png" />
            </div>
            <a href="https://www.instagram.com/mkgmagic">@MKGMagic</a>
          </div>
          <div className="comMethod">
            <div className="icon">
              <i
                className="fas fa-envelope"
                style={{
                  left: "2px",
                  top: "1px",
                  marginRight: "4px",
                  color: "lightgrey",
                  fontSize: "16px",
                }}
              />
            </div>
            <a href="mailto:mkgmagicpours@gmail.com">MKGMagicPours@gmail.com</a>
          </div>
        </div>
        <div className="footPageNav">
          <div className="section">
            <Link href="/">
              <a>Home Page</a>
            </Link>
            <Link href="/gallery">
              <a>Gallery Page</a>
            </Link>
          </div>
          <div className="section">
            <Link href="/commission">
              <a
                onClick={() => {
                  window.sessionStorage.removeItem("active");
                }}
              >
                Commission Page
              </a>
            </Link>
            <Link href="about_me">
              <a>About Me Page</a>
            </Link>
          </div>
        </div>
        <div className="footFeedback">
          <p>Any comments, questions, or concerns?</p>
          <a href="about_me#comment">Submit Feedback</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
