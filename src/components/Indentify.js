import axios from "axios";
import React, { useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/Auth";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const Identify = () => {
  const initialFormData = {
    color: "",
    imprint: "",
    shape: "",
  };
  const [isOpen, setIsOpen] = useState(false);
  const [foundMeds, setFoundMeds] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [currentMeds, setCurrentMeds] = useState([]);
  const { user } = useAuth();

  async function addMedication(e) {
    const drugId = e.target.parentElement.id;
    const drugName = e.target.previousElementSibling.innerHTML;
    await supabase
      .from("drugs")
      .insert({ drug_name: drugName, rxcui: drugId, user_id: user?.id });
    getUsersMeds();
    Toastify({
      text: `${drugName} has be added`,
      duration: 3000,
    }).showToast();
  }

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
    resetState();
    getUsersMeds();
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

  async function deleteCurrentMed(e) {
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
    getUsersMeds();
  }

  const fetchByPill = (e) => {
    e.preventDefault();
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
              <li id={drug.rxcui} key={index}>
                <h5>{drug.name}</h5>
                <button onClick={addToCurrentMeds}>Add to my chart</button>
                <img
                  className="medImages"
                  src={drug.imageUrl}
                  alt={drug.name}
                />
              </li>
            );
        });
        setFoundMeds(medications);
      });
    e.target.reset();
  };

  const fetchByName = (e) => {
    e.preventDefault();
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
                  <li id={drug.rxcui} key={index}>
                    <h5>{drug.name}</h5>
                    <button onClick={addToCurrentMeds}>Add to my chart</button>
                  </li>
                );
            }
          } else {
            drug.name !== "" &&
              medications.push(
                <li id={drug.rxcui} key={index}>
                  <h5>{drug.name}</h5>
                  <button onClick={addToCurrentMeds}>Add to my chart</button>
                </li>
              );
          }
        });
        setFoundMeds(medications);
      });
    e.target.reset();
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

  return (
    <div className="bodyBox identifyBox">
      <div className="bodyBoxContent" onClick={togglePopUp}>
        <h1 className="bodyBoxIdentify">Find Medications</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            <form
              className="identifyForm"
              onChange={handleChange}
              onSubmit={(e) => fetchByPill(e)}
            >
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
              <button type="submit">Search</button>
            </form>
            OR
            <form
              className="identifyForm"
              onChange={handleChange}
              onSubmit={(e) => fetchByName(e)}
            >
              <h4>Name and Strength</h4>
              <input type="text" name="name" placeholder="name and strength" />
              <button type="submit">Search</button>
            </form>
            <div>{medsList()}</div>
            <div className="foundMedsList">{foundMeds}</div>
            <span className="close-icon" onClick={togglePopUp}>
              x
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Identify;
