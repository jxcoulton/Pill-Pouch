import React, { useState, useContext } from "react";
import axios from "axios";
import MedicationModal from "./MedicationModal";
import UserDataContext from "../contexts/userData";
import InputBase from "@mui/material/InputBase";
import { IconButton } from "@mui/material";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function findProp(obj, prop) {
  var result = [];
  function recursivelyFindProp(o, keyToBeFound) {
    Object.keys(o).forEach(function (key) {
      if (typeof o[key] === "object") {
        if (key === keyToBeFound) {
          o[key].forEach((i) => result.push(i));
        } else {
          recursivelyFindProp(o[key], keyToBeFound);
        }
      }
    });
  }
  recursivelyFindProp(obj, prop);
  return result;
}

const Identify = () => {
  const { setFoundMeds, setOpenDialog } = useContext(UserDataContext);
  const [formData, setFormData] = useState();

  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  const fetchByPill = (e) => {
    e.preventDefault();
    axios
      .get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${formData}`)
      .then((res) => {
        const results = res.data.drugGroup.conceptGroup;

        if (typeof results !== "undefined") {
          let found = findProp(results, "conceptProperties");
          const items = found.sort((a, b) => {
            return a.rxcui - b.rxcui;
          });

          !!items && setFoundMeds(items);
          setOpenDialog(true);
        } else {
          Toastify({
            text: `No results found. Use medication full name only`,
            duration: 3000,
            position: "left",
          }).showToast();
        }
      });
    e.target.reset();
    setFormData();
  };

  return (
    <>
      <form
        onInput={handleChange}
        onSubmit={(e) => fetchByPill(e)}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <InputBase
          name="medication"
          type="search"
          placeholder="Medication Search..."
          sx={{ paddingLeft: "20px", width: "100%" }}
        />
        <IconButton>
          <input
            type="image"
            title="Search"
            alt="Search icon"
            src="/Search.png"
          />
        </IconButton>
      </form>
      <MedicationModal />
    </>
  );
};

export default Identify;
