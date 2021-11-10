import React, { useState} from "react";

import "toastify-js/src/toastify.css";


const MyHistory = ({currentMeds, userAllergies, userInfo, userEmerContact}) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

  const medsList = () => {
    const medications = [];
    currentMeds.forEach((med, index) => {
      medications.push(
        <li id={med.drug_id} key={index} className="currentMedsList">
          <h5 value={index}>{med.drug_name}</h5>
        </li>
      );
    });
    return medications;
  };

  const allergyList = () => {
    const allergies = [];
    userAllergies.forEach((allergy, index) => {
      allergies.push(
        <li id={allergy.allergy_id} key={index} className="currentMedsList">
          <h5 value={index}>{allergy.allergen}</h5>
        </li>
      );
    });
    return allergies;
  };

  return (
    <div className="bodyBox myHistoryBox">
      <div className="bodyBoxContent" onClick={togglePopUp}>
        <h1 className="bodyBoxMyHistory">My History</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box" id="printWindow">
            <div>
              <h3>My Rx's</h3>
              <h5>
                Medications:{" "}
                {Object.keys(currentMeds).length !== 0 ? medsList() : `N/A`}
              </h5>
            </div>
            <div>
              <h3>My Information</h3>
              <h5>
                Name: {userInfo[0].full_name !== null ? userInfo[0].full_name : `N/A`}
              </h5>
              <h5>
                Allergies:{" "}
                {Object.keys(userAllergies).length !== 0
                  ? allergyList()
                  : `N/A`}
              </h5>
            </div>
            <div>
              <h3>My Contacts</h3>
              <h5>
                Emergency Contact:{" "}
                {userEmerContact.ec_full_name !== null ? (
                  <div>
                    <h5>{userEmerContact.ec_full_name}</h5>
                    <h5>{userEmerContact.ec_relationship}</h5>
                    <h5>{userEmerContact.ec_phone}</h5>
                  </div>
                ) : (
                  `N/A`
                )}
              </h5>
            </div>
            <span className="close-icon" onClick={togglePopUp}>
              x
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHistory;
