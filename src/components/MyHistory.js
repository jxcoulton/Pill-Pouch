import React, { useState } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";

const MyHistory = () => {
  const initialUserInfo = [
    {
      username: null,
      first_name: null,
      last_name: null,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [currentMeds, setCurrentMeds] = useState([]);
  const [userInfo, setUserInfo] = useState(initialUserInfo);

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

    async function getUserProfile() {
      try {
        const { error, data } = await supabase
          .from("profiles")
          .select("user_id, username, first_name, last_name")
          .eq("user_id", user?.id);
        if (error) setUserInfo(initialUserInfo);
        if (data) setUserInfo(data[0]);
      } catch {
        setUserInfo(initialUserInfo);
      }
    }
    getUsersMeds();
    getUserProfile();
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

  const updateItem = async (newValue, columnName) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ columnName: newValue })
        // .eq("user_id", user?.id)
        .eq("user_id", user?.id); //matching id of row to update

      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div className="bodyBox myHistoryBox">
      <div className="bodyBoxContent" onClick={togglePopUp}>
        <h1 className="bodyBoxMyHistory">My History</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            {<p>My Chart</p>}
            <div>{medsList()}</div>
            <div>
              <h5>
                Username: {userInfo.username !== null && userInfo.username}
              </h5>
              <form>
              <input placeholder="new username" />
              <input
                onClick={updateItem}
                type="image"
                className="delete_button"
                title="Delete"
                src="https://webstockreview.net/images/clipart-pen-pen-icon-15.png"
                alt="delete button"
              />
              </form>
              <h5>
                First Name:{" "}
                {userInfo.first_name !== null && userInfo.first_name}
              </h5>
              <input
                type="image"
                className="delete_button"
                title="Delete"
                src="https://webstockreview.net/images/clipart-pen-pen-icon-15.png"
                alt="delete button"
              />
              <h5>
                Last Name: {userInfo.last_name !== null && userInfo.last_name}
              </h5>
              <input
                type="image"
                className="delete_button"
                title="Delete"
                src="https://webstockreview.net/images/clipart-pen-pen-icon-15.png"
                alt="delete button"
              />
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
