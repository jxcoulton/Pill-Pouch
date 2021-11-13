import React, { useState, useContext } from "react";
import axios from "axios";
import UserDataContext from "../contexts/userData";
import Loading from "./Loading";

const Interactions = () => {
  const { currentMeds } = useContext(UserDataContext);

  const [isOpen, setIsOpen] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
    setInteractions();
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
    setLoading(true);
    let rxcuiString = "";
    currentMeds.forEach((drug) => {
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
        setLoading(false);
        interactionList.length === 0
          ? setInteractions(<h2>No results</h2>)
          : setInteractions(
              <div className="interaction-pop-up">
                <h1>Results</h1>
                <div className="interaction-box-line"></div>
                <div className="interaction-list-box">{interactionList}</div>
              </div>
            );
      });
  };

  return (
    <div className="bodyBox interaction-box">
      <div className="body-box-content" onClick={togglePopUp}>
        <img
          className="box-image"
          alt="resources icon"
          src="http://cdn.onlinewebfonts.com/svg/img_448306.png"
        />
        <h1 className="bodyBoxInteractions">INTERACTIONS</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box interaction-pop-up">
            <span className="close-icon" onClick={togglePopUp}>
              <img
                className="close-icon-img"
                alt="close button"
                src="http://cdn.onlinewebfonts.com/svg/download_118699.png"
              />
            </span>
            <h1>My Medications</h1>
            <div className="interaction-box-line"></div>
            <div className="med-list-box">
              {medsList()}
              {currentMeds.length === 0 ? (
                <h4>Add medications to view interactions</h4>
              ) : (
                <button className="submit-button" onClick={submitCompare}>
                  Search
                </button>
              )}
            </div>
            {loading ? <Loading /> : interactions}
          </div>
        </div>
      )}
    </div>
  );
};
export default Interactions;
