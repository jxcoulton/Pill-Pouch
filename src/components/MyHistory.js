import React, { useState } from "react";

const MyHistory = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bodyBox myHistoryBox" onClick={togglePopUp}>
      <div className="bodyBoxContent" onClick={togglePopUp}>
        <h1 className="bodyBoxMyHistory">My History</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            <span className="close-icon" onClick={togglePopUp}>
              x
            </span>
            {<p>My History</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHistory;
