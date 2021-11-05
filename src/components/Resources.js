import React, { useState } from "react";

const Resources = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bodyBox resourcesBox" onClick={togglePopUp}>
      <div className="bodyBoxContent" onClick={togglePopUp}>
        <h1 className="bodyBoxResources">Resources</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            <div className="resourcesPopUp">
              <span className="close-icon" onClick={togglePopUp}>
                x
              </span>
              {
                <>
                  <h1 className="bodyBoxResources">Resources</h1>
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
                </>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Resources;
