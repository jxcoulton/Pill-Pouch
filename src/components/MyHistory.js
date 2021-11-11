import React, { useState, useContext } from "react";
import UserDataContext from "../contexts/userData";
import "toastify-js/src/toastify.css";

const MyHistory = () => {
  const { currentMeds, userAllergies, userInfo, userEmerContact } =
    useContext(UserDataContext);

  const [isOpen, setIsOpen] = useState(false);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

  const medsList = () => {
    const medications = [];
    currentMeds.forEach((med, index) => {
      medications.push(
        // <li id={med.drug_id} key={index} className="currentMedsList">
        <p
          className="currentMedsList"
          id={med.drug_id}
          key={index}
          value={index}
        >
          {med.drug_name}
        </p>
        // </li>
      );
    });
    return medications;
  };

  const allergyList = () => {
    const allergies = [];
    userAllergies.forEach((allergy, index) => {
      allergies.push(
        // <li id={allergy.allergy_id} key={index} className="currentMedsList">
        <p
          className="currentMedsList"
          id={allergy.allergy_id}
          key={index}
          value={index}
        >
          - {allergy.allergen}
        </p>
        // </li>
      );
    });
    return allergies;
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
                <h3>My Rx's</h3>
                <div className="my-history-box-line"></div>
                <h5>
                  Medications:{" "}
                  {Object.keys(currentMeds).length !== 0 ? medsList() : `N/A`}
                </h5>
              </div>
              <div className="my-history-sections">
                <h3>My Information</h3>
                <div className="my-history-box-line"></div>
                <h5>
                  Name:{" "}
                  {userInfo[0].full_name !== null
                    ? userInfo[0].full_name
                    : `N/A`}
                </h5>
                <h5>
                  Allergies:{" "}
                  {Object.keys(userAllergies).length !== 0
                    ? allergyList()
                    : `N/A`}
                </h5>
              </div>
              <div className="my-history-sections">
                <h3>My Contacts</h3>
                <div className="my-history-box-line"></div>
                <h5>
                  Emergency Contact:{" "}
                  {userEmerContact.ec_full_name !== null ? (
                    <div className="ec-info">
                      <h5>{userEmerContact.ec_full_name}</h5>
                      <h5>{userEmerContact.ec_relationship}</h5>
                      <h5>{userEmerContact.ec_phone}</h5>
                    </div>
                  ) : (
                    `N/A`
                  )}
                </h5>
              </div>
            </div>
            <span className="close-icon" onClick={togglePopUp}>
              <img
                className="close-icon-img"
                alt="close button"
                src="http://cdn.onlinewebfonts.com/svg/download_118699.png"
              />
            </span>
            <p>
              It is recommended that you{" "}
              <button onClick={handlePrint}>Print</button> a copy to keep on you
              and include any medical conditions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHistory;
