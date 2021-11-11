import React, { useState } from "react";

const Resources = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bodyBox resources-box" onClick={togglePopUp}>
      <div className="body-box-content" onClick={togglePopUp}>
        <img
          className="box-image"
          alt="resources icon"
          src="http://cdn.onlinewebfonts.com/svg/img_323457.png"
        />
        <h1 className="bodyBoxResources">RESOURCES</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box resource-pop-up">
            <span className="close-icon" onClick={togglePopUp}>
              <img
                className="close-icon-img"
                alt="close button"
                src="http://cdn.onlinewebfonts.com/svg/download_118699.png"
              />
            </span>
            {
              <>
                <h1 className="bodyBoxResources">Resources</h1>
                <div className="resource-box-line"></div>
                <div className="resource-list-box">
                  <a
                    href="https://apps2.deadiversion.usdoj.gov/pubdispsearch/spring/main;jsessionid=ETV-RUjzIiOTdJAeLdIkesgeocjtKdDFK0Qr-9kF.web2?execution=e1s1"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Medication Disposal
                  </a>
                  <br />
                  <a
                    href="https://www.goodrx.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lower Prices for Prescriptions
                  </a>
                  <br />
                  <a
                    href="https://www.fda.gov/drugs/drug-safety-and-availability/drug-recalls"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Recall Notices
                  </a>
                  <br />
                  <a
                    href="https://triage.webpoisoncontrol.org/#!/exclusions"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Poison control website
                  </a>
                  <br />
                  <a href="tel:1-800-222-1222">
                    poison control number (1-800-222-1222)
                  </a>
                </div>
              </>
            }
          </div>
        </div>
      )}
    </div>
  );
};
export default Resources;
