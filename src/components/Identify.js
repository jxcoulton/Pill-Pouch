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
    color: "",
    imprint: "",
    shape: "",
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
        : `&${e.target.name}=${e.target.value.replace(/ /g, "%20")}`;
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
      }).showToast();
    } else {
      Toastify({
        text: `${drugName} has be removed`,
        duration: 3000,
      }).showToast();
    }
    setCurrentMeds([]);
    setLoading(false);
    setStateChange(!stateChange);
  }

  const fetchByPill = (e) => {
    e.preventDefault();
    if (e.target[3].value === "") {
      axios
        .get(
          `https://rximage.nlm.nih.gov/api/rximage/1/rxnav?${formData.color}${formData.imprint}${formData.shape}&rLimit=20&resolution=600`
        )
        .then((res) => {
          const medications = [];
          const items = res.data.nlmRxImages;
          items.forEach((drug, index) => {
            drug.name !== "" &&
              medications.push(
                <li className="returned-med-card" id={drug.rxcui} key={index}>
                  <img
                    className="medImages"
                    src={drug.imageUrl}
                    alt={drug.name}
                  />
                  <h5>{drug.name}</h5>
                  <button onClick={addToCurrentMeds}>Add to my chart</button>
                </li>
              );
          });
          setFoundMeds(medications);
        });
    } else if (e.target[3].value !== "") {
      axios
        .get(
          `https://rximage.nlm.nih.gov/api/rximage/1/rxnav?${formData.name}&rLimit=20&resolution=600`
        )
        .then((res) => {
          const medications = [];
          const items = res.data.nlmRxImages.sort((a, b) => {
            return a.rxcui - b.rxcui;
          });
          items.forEach((drug, index) => {
            if (index > 0) {
              if (drug.rxcui !== items[index - 1].rxcui) {
                drug.name !== "" &&
                  medications.push(
                    <li
                      className="returned-med-card"
                      id={drug.rxcui}
                      key={index}
                    >
                      <img
                        className="medImages"
                        src={drug.imageUrl}
                        alt={drug.name}
                      />
                      <h5>{drug.name}</h5>
                      <button onClick={addToCurrentMeds}>
                        Add to my chart
                      </button>
                    </li>
                  );
              }
            } else {
              drug.name !== "" &&
                medications.push(
                  <li className="returned-med-card" id={drug.rxcui} key={index}>
                    <img
                      className="medImages"
                      src={drug.imageUrl}
                      alt={drug.name}
                    />
                    <h5>{drug.name}</h5>
                    <button onClick={addToCurrentMeds}>Add to my chart</button>
                  </li>
                );
            }
          });
          setFoundMeds(medications);
        });
    }
    e.target.reset();
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
                    <h4>Color</h4>
                    <select name="color">
                      <option value="">Select a color</option>
                      <option value="black">Black</option>
                      <option value="gray">Gray</option>
                      <option value="white">White</option>
                      <option value="red">Red</option>
                      <option value="purple">Purple</option>
                      <option value="pink">Pink</option>
                      <option value="green">Green</option>
                      <option value="yellow">Yellow</option>
                      <option value="orange">Orange</option>
                      <option value="brown">Brown</option>
                      <option value="blue">Blue</option>
                      <option value="turquoise">Turquoise</option>
                    </select>
                    <h4>Imprint</h4>
                    <input type="text" name="imprint" placeholder="imprint" />
                    <h4>Shape</h4>
                    <select name="shape">
                      <option value="">Select a shape</option>
                      <option value="bullet">Bullet</option>
                      <option value="capsule">Capsule</option>
                      <option value="clover">Clover</option>
                      <option value="diamond">Diamond</option>
                      <option value="double%20circle">Double Circle</option>
                      <option value="freeform">Freeform</option>
                      <option value="gear">Gear</option>
                      <option value="heptagon">Heptagon</option>
                      <option value="hexagon">Hexagon</option>
                      <option value="octagon">Octagon</option>
                      <option value="oval">Oval</option>
                      <option value="pentagon">Pentagon</option>
                      <option value="rectangle">Rectangle</option>
                      <option value="round">Round</option>
                      <option value="semi-circle">Semi-Circle</option>
                      <option value="square">Square</option>
                      <option value="tear">Tear Drop</option>
                      <option value="trapezoid">Trapezoid</option>
                      <option value="triangle">Triangle</option>
                    </select>
                    <br />
                  </div>
                  <div className="or-space">
                    <div className="space-break">
                      <div className="space-line"></div>
                      OR
                      <div className="space-line"></div>
                    </div>
                  </div>
                  <div className="identify-form">
                    <h4>Name and Strength</h4>
                    <input
                      type="text"
                      name="name"
                      placeholder="name and strength"
                    />
                    <p className="search-disclaimer">
                      *when searching by name, images may differ from your
                      prescription*
                    </p>
                    <button className="submit-button" type="submit">
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="identify-sections">
              <h1>Results</h1>
              <div className="identify-box-line"></div>
              <div className="foundMedsList">{foundMeds}</div>
            </div>
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
