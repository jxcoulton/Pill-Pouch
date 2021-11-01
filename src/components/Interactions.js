import React, { useState } from "react";

const Interactions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bodyBox interactionsBox" onClick={togglePopUp}>
      <div className="bodyBoxContent" onClick={togglePopUp}>
        <h1 className="bodyBoxInteractions">Interactions</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            <span className="close-icon" onClick={togglePopUp}>
              x
            </span>
            {<p>Interactions</p>}
          </div>
        </div>
      )}
    </div>
  );
};
export default Interactions;
