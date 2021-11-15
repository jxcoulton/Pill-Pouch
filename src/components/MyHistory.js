import React, { useState, useContext } from "react";
import UserDataContext from "../contexts/userData";

const MyHistory = () => {
  const {
    currentMeds,
    userAllergies,
    userInfo,
    userEmerContact,
    userConditions,
  } = useContext(UserDataContext);

  const [isOpen, setIsOpen] = useState(false);

  const togglePopUp = () => {
    if (userEmerContact !== undefined) {
      setIsOpen(!isOpen);
    }
  };

  const medsList = () => {
    const medications = [];
    currentMeds.forEach((med, index) => {
      medications.push(
        <h5
          className="currentMedsList"
          id={med.drug_id}
          key={index}
          value={index}
        >
          {med.drug_name}
        </h5>
      );
    });
    return medications;
  };

  const allergyList = () => {
    const allergies = [];
    userAllergies.forEach((allergy, index) => {
      allergies.push(
        <h5
          className="currentMedsList"
          id={allergy.allergy_id}
          key={index}
          value={index}
        >
          {allergy.allergen}
        </h5>
      );
    });
    return (
      <div className="my-history-block-sections">
        <div className="found-meds-list">{allergies}</div>
      </div>
    );
  };

  const conditionList = () => {
    const conditions = [];
    userConditions.forEach((condition, index) => {
      conditions.push(
        <h5
          className="currentMedsList"
          id={condition.condition_id}
          key={index}
          value={index}
        >
          {condition.condition}
        </h5>
      );
    });
    return (
      <div className="my-history-block-sections">
        <div className="found-meds-list">{conditions}</div>
      </div>
    );
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printWindow");
    let openWindow = window.open("");
    openWindow.document.write(printContent.innerHTML);
    openWindow.document.close();
    openWindow.focus();
    openWindow.print();
    openWindow.close();
  };

  return (
    <div className="bodyBox my-history-box">
      <div className="body-box-content" onClick={togglePopUp}>
        <img
          className="box-image"
          alt="resources icon"
          src="http://cdn.onlinewebfonts.com/svg/img_411433.png"
        />
        <h1 className="bodyBoxMyHistory">MY HISTORY</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box my-history-pop-up">
            <div id="printWindow" className="my-history-body">
              <div className="my-history-sections">
                <h3>My Information</h3>
                <div className="my-history-box-line"></div>
                <div className="history-list-box">
                  <div className="profile-space-break">
                    <div className="profile-space-line"></div>
                    <h4>Name</h4>
                    <div className="profile-space-line"></div>
                  </div>
                  <div className="my-history-block-sections">
                    <div className="found-meds-list">
                      <h5>{Object.keys(userInfo).length !== 0
                        ? userInfo[0].full_name
                        : `N/A`}</h5>
                    </div>
                  </div>
                  <div className="profile-space-break">
                    <div className="profile-space-line"></div>
                    <h4>Allergies</h4>
                    <div className="profile-space-line"></div>
                  </div>
                  {Object.keys(userAllergies).length !== 0
                    ? allergyList()
                    : `N/A`}
                  <div className="profile-space-break">
                    <div className="profile-space-line"></div>
                    <h4>Conditions</h4>
                    <div className="profile-space-line"></div>
                  </div>
                  {Object.keys(userConditions).length !== 0
                    ? conditionList()
                    : `N/A`}
                </div>
              </div>
              <div className="my-history-sections">
                <h3>My Prescriptions</h3>
                <div className="my-history-box-line"></div>

                <div className="history-list-box">
                  {Object.keys(currentMeds).length !== 0 ? medsList() : `N/A`}
                </div>
              </div>
              <div className="my-history-sections">
                <h3>Emergency Contact</h3>
                <div className="my-history-box-line"></div>
                <div className="history-list-box">
                  {Object.keys(userEmerContact).length !== 0 ? (
                    <div className="ec-info">
                      <h5>Name: {userEmerContact.ec_full_name}</h5>
                      <h5>Relationship: {userEmerContact.ec_relationship}</h5>
                      <h5>Phone: {userEmerContact.ec_phone}</h5>
                    </div>
                  ) : (
                    `N/A`
                  )}
                </div>
              </div>
            </div>
            <span className="close-icon" onClick={togglePopUp}>
              <img
                className="close-icon-img"
                alt="close button"
                src="http://cdn.onlinewebfonts.com/svg/download_118699.png"
              />
            </span>
            <p className="search-disclaimer">
              In case of an emergency{" "}
              <button onClick={handlePrint}>Print</button> a copy to keep with
              you
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHistory;
