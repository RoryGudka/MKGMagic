import {
  filterChangeDiv,
  filterChangeSelect,
  handleOutsideFilterClick,
  sort,
} from "../scripts/image_browser";

import React from "react";

interface Props {
  id: number;
}

const FiltersMenu: React.FC<Props> = ({ id }) => {
  return (
    <div className="cover">
      <div className="covFade" onClick={(e) => handleOutsideFilterClick(id, e)}>
        <p>p</p>
      </div>
      <div className="filtInfo">
        <div className="colorFadeFilter" />
        <div style={{ textAlign: "right", width: "100%" }}>
          <div
            className="clearStyle exitBtn"
            onClick={(e) => handleOutsideFilterClick(id, e)}
          >
            <i className="exitIcon fas fa-times" />
          </div>
        </div>
        <div className="sortLblWrapper">
          <label className="filtLbl"> Sort By: </label>
        </div>
        <div className="colorLblWrapper">
          <label className="filtLbl"> Colors: </label>
        </div>
        <div className="sortWrapper">
          <div
            className="clearStyle randomBtn sortBtn"
            onClick={() => sort(id, "random")}
          >
            <p className="sortText">Random</p>
          </div>
          <div
            className="clearStyle titleBtn sortBtn"
            onClick={() => sort(id, "title", "toggle")}
          >
            <p className="sortText">Title</p>
            <i className="sortArrow fas fa-caret-down" />
          </div>
          <div
            className="clearStyle sizeBtn sortBtn"
            onClick={() => sort(id, "size", "toggle")}
          >
            <p className="sortText">Size</p>
            <i className="sortArrow fas fa-caret-down" />
          </div>
          <div
            className="clearStyle priceBtn sortBtn"
            onClick={() => sort(id, "price", "toggle")}
          >
            <p className="sortText">Price</p>
            <i className="sortArrow fas fa-caret-down" />
          </div>
          <div
            className="clearStyle dateBtn sortBtn"
            onClick={() => sort(id, "date", "toggle")}
          >
            <p className="sortText">Date</p>
            <i className="sortArrow fas fa-caret-down" />
          </div>
          <div style={{ textAlign: "left" }}>
            <label className="filtLbl" style={{ marginTop: "20px" }}>
              Pour Type
            </label>
          </div>
          <select
            className="clearStyle filtSel"
            name="types"
            id="types"
            onChange={() => filterChangeSelect(id, event)}
          >
            <option>No Filter</option>
            <option value="bclassic">Classic Pours</option>
            <option value="bcharOrScene">Characters and Scenes</option>
            <option value="bwood">Wood Pours</option>
          </select>
          <div style={{ textAlign: "left" }}>
            <label className="filtLbl"> Spirit </label>
          </div>
          <select
            className="clearStyle filtSel"
            name="events"
            id="events"
            onChange={() => filterChangeSelect(id, event)}
          >
            <option>No Filter</option>
            <option value="bpride">Pride</option>
            <option value="bhalloween">Halloween</option>
            <option value="bchristmas">Christmas</option>
          </select>
        </div>
        <div className="colorGradientWrapper">
          <div className="colorGradient" />
          <div className="colorSelectWrapper">
            <div
              className="colorSelect"
              style={{ borderRadius: "10px 10px 0 0" }}
              onClick={() => filterChangeDiv(id, event, "cred")}
            >
              <p className="innerColorText">Red</p>
            </div>
            <div
              className="colorSelect"
              onClick={() => filterChangeDiv(id, event, "corange")}
            >
              <p className="innerColorText">Orange</p>
            </div>
            <div
              className="colorSelect"
              onClick={() => filterChangeDiv(id, event, "cyellow")}
            >
              <p className="innerColorText">Yellow</p>
            </div>
            <div
              className="colorSelect"
              onClick={() => filterChangeDiv(id, event, "cgreen")}
            >
              <p className="innerColorText">Green</p>
            </div>
            <div
              className="colorSelect"
              onClick={() => filterChangeDiv(id, event, "cblue")}
            >
              <p className="innerColorText">Blue</p>
            </div>
            <div
              className="colorSelect"
              onClick={() => filterChangeDiv(id, event, "cpurple")}
            >
              <p className="innerColorText">Purple</p>
            </div>
            <div
              className="colorSelect"
              onClick={() => filterChangeDiv(id, event, "cpink")}
            >
              <p className="innerColorText">Pink</p>
            </div>
            <div
              className="colorSelect"
              onClick={() => filterChangeDiv(id, event, "cwhite")}
            >
              <p className="innerColorText">White</p>
            </div>
            <div
              className="colorSelect"
              onClick={() => filterChangeDiv(id, event, "cblack")}
            >
              <p className="innerColorText">Black</p>
            </div>
            <div
              className="colorSelect"
              onClick={() => filterChangeDiv(id, event, "cgold")}
            >
              <p className="innerColorText">Gold</p>
            </div>
            <div
              className="colorSelect"
              onClick={() => filterChangeDiv(id, event, "csilver")}
            >
              <p className="innerColorText">Silver</p>
            </div>
            <div
              className="colorSelect"
              style={{ borderRadius: "0 0 10px 10px" }}
              onClick={() => filterChangeDiv(id, event, "ccopper")}
            >
              <p className="innerColorText">Copper</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersMenu;
