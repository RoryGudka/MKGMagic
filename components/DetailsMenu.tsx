import {
  handleCommissionClick,
  handleLeftArrowClick2,
  handleOutsideCoverClick,
  handlePurchaseClick,
  handleRightArrowClick2,
} from "../scripts/image_browser";

import React from "react";

interface Props {
  id: number;
}

const DetailsMenu: React.FC<Props> = ({ id }) => {
  return (
    <div className="cover">
      <div
        className="covFade"
        onClick={(e) => handleOutsideCoverClick(id, e)}
      />
      <div className="covInfo">
        <div style={{ textAlign: "right", width: "100%" }}>
          <div
            className="clearStyle exitBtn"
            onClick={(e) => handleOutsideCoverClick(id, e)}
          >
            <i className="exitIcon fas fa-times" />
          </div>
        </div>
        <div className="colorFade2" />
        <div className="imageBrowser2">
          <div className="carousel2" />
        </div>
        <div className="loadingWrapper2">
          <p className="loadingLbl2">Loading</p>
        </div>
        <div className="arrowWrapper2">
          <div
            className="clearStyle arrow2 left2"
            onClick={() => handleLeftArrowClick2(id)}
          >
            <i className="fas fa-chevron-left" />
          </div>
          <div
            className="clearStyle arrow2 right2"
            onClick={() => handleRightArrowClick2(id)}
          >
            <i className="fas fa-chevron-right" />
          </div>
        </div>
        <p className="coverTitle" />
        <p className="coverSize" />
        <p className="coverPrice" />
        <p className="coverDesc" />
        <div className="purchaseWrapper">
          <div
            className="clearStyle coverCommission"
            onClick={() => handleCommissionClick(id)}
          >
            <p className="purchaseButton">Commission a Piece Like This</p>
          </div>
          <div
            className="clearStyle coverBuy"
            onClick={() => handlePurchaseClick(id)}
          >
            <p className="purchaseButton">Buy it now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsMenu;
