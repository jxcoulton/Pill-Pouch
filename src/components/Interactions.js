import React, { useState } from "react";
import axios from "axios";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/Auth";

const Interactions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMeds, setCurrentMeds] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const { user } = useAuth();

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

  const togglePopUp = () => {
    setIsOpen(!isOpen);
    setInteractions();
    getUsersMeds();
  };

  function findProp(obj, prop) {
    var result = [];
    function recursivelyFindProp(o, keyToBeFound) {
      Object.keys(o).forEach(function (key) {
        if (typeof o[key] === "object") {
          recursivelyFindProp(o[key], keyToBeFound);
        } else {
          if (key === keyToBeFound) result.push(o[key]);
        }
      });
    }
    recursivelyFindProp(obj, prop);
    return result;
  }

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

  const submitCompare = () => {
    let rxcuiString = "";
    currentMeds.forEach((drug, index) => {
      rxcuiString += `${drug.rxcui}+`;
    });
    axios
      .get(
        `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcuiString}`
      )
      .then((res) => {
        const interactionList = [];
        const { data } = res;
        const interactionsDisplay = findProp(data, "description");
        interactionsDisplay.forEach((detail, index) => {
          if (index > 0) {
            if (detail !== interactionsDisplay[index - 1]) {
              interactionList.push(<p key={index}>{detail}</p>);
            }
          } else {
            interactionList.push(<p key={index}>{detail}</p>);
          }
        });
        setInteractions(interactionList);
      });
  };

  return (
    <div className="bodyBox interactionsBox">
      <div className="bodyBoxContent" onClick={togglePopUp}>
        <h1 className="bodyBoxInteractions">Interactions</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            <span className="close-icon" onClick={togglePopUp}>
              x
            </span>
            <p>Interactions</p>
            {medsList()}
            {interactions}
            <button onClick={submitCompare}>Compare</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Interactions;
