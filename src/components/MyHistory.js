import React, { useState } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const MyHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [currentMeds, setCurrentMeds] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [userAllergies, setUserAllergies] = useState([]);
  const [userEmerContact, setUserEmerContact] = useState([]);

  async function getUsersMeds() {
    try {
      const { error, data } = await supabase
        .from("drugs")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setCurrentMeds([]);
      if (data) setCurrentMeds(data);
    } catch {
      setCurrentMeds([]);
    }
  }

  async function getUserProfile() {
    try {
      const { error, data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setUserInfo([]);
      if (data) setUserInfo(data[0]);
    } catch {
      setUserInfo([]);
    }
  }

  async function getUserEmerContact() {
    try {
      const { error, data } = await supabase
        .from("emergency_contact")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setUserEmerContact([]);
      if (data) setUserEmerContact(data[0]);
    } catch {
      setUserEmerContact([]);
    }
  }

  async function getUserAllergies() {
    try {
      const { error, data } = await supabase
        .from("allergies")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setUserAllergies([]);
      if (data) setUserAllergies(data);
    } catch {
      setUserAllergies([]);
    }
  }

  const togglePopUp = () => {
    setIsOpen(!isOpen);
    getUsersMeds();
    getUserProfile();
    getUserAllergies();
    getUserEmerContact();
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

  const handlePrint = () => { };
  
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
                Name: {userInfo.full_name !== null ? userInfo.full_name : `N/A`}
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
            <button onChange={handlePrint}>Print Chart</button>
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
