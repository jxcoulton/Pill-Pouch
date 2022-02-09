import axios from "axios";
import React, { useState, useContext } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/Auth";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import UserDataContext from "../contexts/userData";
import Loading from "./Loading";

const Identify = () => {
  const { setStateChange, stateChange, currentMeds, setCurrentMeds } =
    useContext(UserDataContext);

  const initialFormData = {
    name: "",
  };
  const [isOpen, setIsOpen] = useState(false);
  const [foundMeds, setFoundMeds] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const togglePopUp = () => {
    setIsOpen(!isOpen);
    resetState();
  };

  const handleChange = (e) => {
    const value =
      e.target.value === ""
        ? ""
        : `${e.target.value}`;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const resetState = () => {
    setFormData(initialFormData);
    setFoundMeds([]);
  };

  const addToCurrentMeds = (e) => {
    addMedication(e);
  };

  async function addMedication(e) {
    setLoading(true);
    setFoundMeds([]);
    const drugId = e.target.parentElement.id;
    const drugName = e.target.previousElementSibling.innerHTML;
    await supabase
      .from("drugs")
      .insert({ drug_name: drugName, rxcui: drugId, user_id: user?.id });
    Toastify({
      text: `${drugName} has be added`,
      duration: 3000,
      position: "left",
    }).showToast();
    setCurrentMeds([]);
    setLoading(false);
    setStateChange(!stateChange);
  }

  async function deleteCurrentMed(e) {
    setLoading(true);
    setFoundMeds([]);
    const drugId = e.target.parentElement.id;
    const drugName = e.target.previousElementSibling.innerHTML;
    const { error } = await supabase
      .from("drugs")
      .delete()
      .eq("drug_id", drugId)
      .eq("user_id", user?.id);
    if (error) {
      Toastify({
        text: `something went wrong`,
        duration: 3000,
        position: "left",
      }).showToast();
    } else {
      Toastify({
        text: `${drugName} has be removed`,
        duration: 3000,
        position: "left",
      }).showToast();
    }
    setCurrentMeds([]);
    setLoading(false);
    setStateChange(!stateChange);
  }

  function findProp(obj, prop) {
    var result = [];
    function recursivelyFindProp(o, keyToBeFound) {
      Object.keys(o).forEach(function (key) {
        if (typeof o[key] === "object") {
          recursivelyFindProp(o[key], keyToBeFound);
        } else {
          if (key === keyToBeFound && !!o.name) result.push(o);
          result.push(o)
        }
      });
    }
    recursivelyFindProp(obj, prop);
    return result;
  }

  const fetchByPill = (e) => {
    e.preventDefault();
    axios
      .get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${formData.name}`)
      .then((res) => {
        const results = res.data.drugGroup.conceptGroup;
        const medications = [];
        if (typeof results !== "undefined") {
          let found = findProp(results, "conceptProperties")
          const items = found.sort((a, b) => {
            return a.rxcui - b.rxcui;
          });
          items.forEach((drug, index) => {
            if (!drug.name) {
            } else if (index > 0) {
              if (drug.rxcui !== items[index - 1].rxcui) {
                drug.name !== "" &&
                  medications.push(
                    <li className="returned-med-card" id={drug.rxcui} key={index}>
                      <h5>{drug.name}</h5>
                      <button className="btn-primary" onClick={addToCurrentMeds}>
                        Add to my chart
                      </button>
                    </li>
                  );
              }
            } else {
              drug.name !== "" &&
                medications.push(
                  <li className="returned-med-card" id={drug.rxcui} key={index}>
                    <h5>{drug.name}</h5>
                    <button className="btn-primary" onClick={addToCurrentMeds}>
                      Add to my chart
                    </button>
                  </li>
                );
            }
          });
          medications.length === 0
            ? setFoundMeds(<h2 className="identify-sections">No results</h2>)
            : setFoundMeds(
              <div className="identify-sections">
                <h1>Results</h1>
                <div className="identify-box-line"></div>
                <div className="found-meds-list">{medications}</div>
              </div>
            );
        }  else {
          Toastify({
            text: `No results found for ${formData.name}`,
            duration: 3000,
            position: "left",
          }).showToast();
        }
      });
    // }
    e.target.reset();
    setFormData(initialFormData);
  };

  const medsList = () => {
    const medications = [];
    currentMeds.forEach((med, index) => {
      medications.push(
        <li id={med.drug_id} key={index} className="current-meds-list">
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

  return (
    <div className="bodyBox identify-box">
      <div className="body-box-content" onClick={togglePopUp}>
        <img
          className="box-image"
          alt="resources icon"
          src="http://cdn.onlinewebfonts.com/svg/img_456268.png"
        />
        <h1 className="bodyBoxIdentify">FIND MEDICATIONS</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box identify-pop-up">
            <div className="identify-sections">
              <h1>My Medications</h1>
              <div className="identify-box-line"></div>
              <div className="med-list-find-box">
                {loading ? <Loading /> : medsList()}
              </div>
            </div>
            <div className="identify-sections">
              <h1>Search</h1>
              <div className="identify-box-line"></div>
              <div className="med-list-find-box">
                <form onChange={handleChange} onSubmit={(e) => fetchByPill(e)}>
                  <div className="identify-form">
                    <h4>Name</h4>
                    <input type="text" name="name" placeholder="name" />
                    <p className="search-disclaimer">
                      *when searching do not enter strength*
                    </p>
                    <button className="submit-button" type="submit">
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {foundMeds}
            <span className="close-icon" onClick={togglePopUp}>
              <img
                className="close-icon-img"
                alt="close button"
                src="http://cdn.onlinewebfonts.com/svg/download_118699.png"
              />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Identify;
