import {
  handleCarouselClick,
  handleFilterBtnClick,
  handleGridClick,
  handleLeftArrowClick,
  handleRightArrowClick,
  handleSearch,
} from "../scripts/image_browser";

import { NextPage } from "next";
import React from "react";

interface Props {
  id: number;
}

const ImageBrowser: NextPage<Props> = ({ id }) => {
  return (
    <div className="imageBrowser">
      {/* Common Utilities and Aesthetics */}
      <div className="colorFade" />
      <div className="divider" />
      <div className="filtSwitchWrapper">
        <div
          className="clearStyle filtersBtn"
          onClick={(e) => handleFilterBtnClick(id, e)}
        >
          <i className="filtersBtnIcon fas fa-bars" />
          <p className="filtersBtnText">Filters</p>
        </div>
        <div className="switchWrapper">
          <div
            className="clearStyle carouselBtn activeSwitchBtn"
            onClick={(e) => handleCarouselClick(id, e)}
          >
            <i className="fas fa-clone" />
          </div>
          <div
            className="clearStyle gridBtn"
            onClick={(e) => handleGridClick(id, e)}
          >
            <i className="fas fa-th" />
          </div>
        </div>
      </div>
      <div className="searchWrap">
        <input
          className="clearStyle searchTxt"
          type="text"
          placeholder="Search"
          onInput={(e) => handleSearch(id, e)}
        />
        <i className="searchIcon fas fa-search" />
      </div>
      {/* Carousel */}
      <div className="carousel" />
      <div className="titleWrapper">
        <div className="icTitle" />
      </div>
      <div className="arrowWrapper">
        <div
          className="clearStyle arrow left"
          onClick={() => handleLeftArrowClick(id)}
        >
          <i className="fas fa-chevron-left" />
        </div>
        <div
          className="clearStyle arrow right"
          onClick={() => handleRightArrowClick(id)}
        >
          <i className="fas fa-chevron-right" />
        </div>
      </div>
      <div className="loadingWrapper">
        <p className="loadingLbl">Loading</p>
      </div>
      <div className="noMatchesWrapper">
        <p className="noMatches">No results match your search at this time</p>
      </div>
      {/* Gallery */}
      <div className="gallery" />
      <div className="extender" />
    </div>
  );
};

export default ImageBrowser;
