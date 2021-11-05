import React, { useState } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";

const MyHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [currentMeds, setCurrentMeds] = useState([]);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
    async function getUsersMeds() {
      try {
        const { error, data } = await supabase
          .from("drugs")
          .select("user_id, drug_name, rxcui, drug_id")
          .eq("user_id", user?.id);
        if (error) setCurrentMeds([]);
        if (data) setCurrentMeds(data);
      } catch {
        setCurrentMeds([]);
      }
    }
    getUsersMeds();
  };

  const medsList = () => {
    const medications = [];
    currentMeds.forEach((med, index) => {
      medications.push(
        <li id={med.drug_id} key={index} className="currentMedsList">
          <h5 value={index}>{med.drug_name}</h5>
          <button
            className="delete_button"
            onClick={deleteCurrentMed}
            title="Delete"
          >
            x
          </button>
        </li>
      );
    });
    return medications;
  };

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
      alert(`Sorry, try again later.`);
    } else {
      alert(`${drugName} removed from chart`);
    }
    setIsOpen(!isOpen);
  }

  return (
    <div className="bodyBox myHistoryBox">
      <div className="bodyBoxContent" onClick={togglePopUp}>
        <h1 className="bodyBoxMyHistory">My History</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            <span className="close-icon" onClick={togglePopUp}>
              x
            </span>
            {<p>hello</p>}
            {medsList()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHistory;
