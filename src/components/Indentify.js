import axios from "axios";
import React, { useState } from "react";

const Identify = () => {
  const initialFormData = {
    color: "",
    imprint: "",
    shape: "",
  };
  const [isOpen, setIsOpen] = useState(false);
  const [foundMeds, setFoundMeds] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
    resetState();
    setFoundMeds([]);
  };

  const handleChange = (e) => {
    const value =
      e.target.value === "" ? "" : `&${e.target.name}=${e.target.value}`;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const resetState = () => {
    setFormData(initialFormData);
  };

  const fetchData = (e) => {
    e.preventDefault();
    axios
      .get(
        `https://rximage.nlm.nih.gov/api/rximage/1/rxnav?${formData.color}${formData.imprint}${formData.shape}&rLimit=20&resolution=600`
      )
      .then((res) => {
        const medications = [];
        const items = res.data.nlmRxImages;
        items.forEach((drug, index) => {
          medications.push(
            <li id={drug.rxcui} key={index}>
              <h5>{drug.name}</h5>
              <img className="medImages" src={drug.imageUrl} />
            </li>
          );
        });
        setFoundMeds(medications);
      });
  };
  console.log(formData);

  return (
    <div className="bodyBox identifyBox">
      <div className="bodyBoxContent" onClick={togglePopUp}>
        <h1 className="bodyBoxIdentify">Identify</h1>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            <form
              className="identifyForm"
              onChange={handleChange}
              onSubmit={(e) => fetchData(e)}
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
