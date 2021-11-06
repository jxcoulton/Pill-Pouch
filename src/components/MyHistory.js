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
  const [userDoctor, setUserDoctor] = useState([]);

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

  async function getUserDoctor() {
    try {
      const { error, data } = await supabase
        .from("doctors")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setUserDoctor([]);
      if (data) setUserDoctor(data[0]);
    } catch {
      setUserDoctor([]);
    }
  }

  const togglePopUp = () => {
    setIsOpen(!isOpen);
    getUsersMeds();
    getUserProfile();
    getUserAllergies();
    getUserDoctor();
    getUserEmerContact();
  };

  const medsList = () => {
    const medications = [];
    currentMeds.forEach((med, index) => {
      medications.push(
        <li id={med.drug_id} key={index} className="currentMedsList">
          <h5 value={index}>{med.drug_name}</h5>
          <input
            type="image"
            className="delete_button"
            onClick={deleteCurrentMed}
            title="Delete"
            src="https://www.nicepng.com/png/detail/207-2079285_delete-comments-delete-icon-transparent.png"
            alt="delete button"
          />
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

  console.log(userAllergies);
  async function deleteCurrentMed(e) {
    const drugId = e.target.parentElement.id;
    const drugName = e.target.previousElementSibling.innerHTML;
    console.log(drugName);
    const { error } = await supabase
      .from("drugs")
      .delete()
      .eq("drug_id", drugId)
      .eq("user_id", user?.id);
    if (error) {
      Toastify({
        text: `something went wrong`,
        duration: 3000,
      }).showToast();
    } else {
      Toastify({
        text: `${drugName} has be removed`,
        duration: 3000,
      }).showToast();
    }
    getUsersMeds();
  }

  return (
    <div className="bodyBox myHistoryBox">
      <div className="bodyBoxContent" onClick={togglePopUp}>
        <h1 className="bodyBoxMyHistory">My History</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            <div>
              <h3>My Rx's</h3>
              {medsList()}
            </div>
            <div>
              <h3>My Information</h3>
              <h5>
                Name: {userInfo.full_name !== null ? userInfo.full_name : `N/A`}
              </h5>
              <h5>
                Allergies:{" "}
                {userAllergies.allergen !== null ? allergyList() : `N/A`}
              </h5>
            </div>
            <div>
              <h3>My Contacts</h3>
              <h5>
                Emergency Contact:{" "}
                {userEmerContact.ec_full_name !== null ? (
                  <div>
                    {userEmerContact.ec_full_name}
                    {userEmerContact.ec_relationship}
                    {userEmerContact.ec_phone}
                  </div>
                ) : (
                  `N/A`
                )}
              </h5>
              <h5>
                Primary Doctor:{" "}
                {userDoctor.dr_name !== null ? (
                  <div>
                    <p>{userDoctor.dr_name}</p>
                    <p>{userDoctor.office_name}</p>
                    <p>{userDoctor.dr_phone}</p>
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
