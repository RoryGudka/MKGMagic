import React from "react";

interface Props {
  title: string;
}

const GalleryHeading: React.FC<Props> = ({ title }) => {
  return (
    <div className="galHeading">
      <div className="headingFade"></div>
      <p className="galHeadingP">{title}</p>
    </div>
  );
};

export default GalleryHeading;
