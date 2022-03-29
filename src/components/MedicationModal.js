import React, { useContext, useState } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import UserDataContext from "../contexts/userData";
import {
  Button,
  Typography,
  Select,
  MenuItem,
  DialogContent,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default function MedicationModal() {
  const {
    foundMeds,
    setFoundMeds,
    openDialog,
    setOpenDialog,
    updateMedications,
    setUpdateMedications,
  } = useContext(UserDataContext);
  const { user } = useAuth();
  const [medStrength, setMedStrength] = useState(" ");

  const handleClose = () => {
    setOpenDialog(false);
    setFoundMeds();
    setMedStrength(" ");
  };

  const addToCurrentMeds = (e) => {
    addMedication(e);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setMedStrength(e.target.value);
  };

  async function addMedication(e) {
    setOpenDialog(false);
    setFoundMeds();
    setMedStrength(" ");
    const drugId = e.target.parentElement.id;
    const drugName = e.target.name;
    await supabase
      .from("drugs")
      .insert({ drug_name: drugName, rxcui: drugId, user_id: user?.id });
    Toastify({
      text: `${
        drugName.charAt(0).toUpperCase() + drugName.slice(1)
      } has been added`,
      duration: 3000,
      position: "left",
    }).showToast();
    setUpdateMedications(!updateMedications);
  }

  //finding all the numbers in the medication name to create strength filter
  let newStrengths =
    !!foundMeds &&
    foundMeds
      .map((med) =>
        med.name
          .split(" ")
          .map(Number)
          .filter((num, i) => !isNaN(num) && i !== 0)
      )
      .sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

  //formatting the found strengths into a string
  let str =
    !!newStrengths &&
    Array.from(new Set(newStrengths.map(JSON.stringify))).map((item) =>
      item.replace(/[[\]]/g, "").replace(/,/g, "/")
    );

  //creating options for the dropdown
  const newTags =
    str.length > 0 &&
    str.map((med, i) => (
      <MenuItem key={i} value={med}>
        {med}
      </MenuItem>
    ));

  //filtering the medications to display strength
  const filteredMeds =
    !!foundMeds &&
    foundMeds
      .filter((med) =>
        !medStrength || medStrength === " "
          ? true
          : med.name
              .split(" ")
              .map(Number)
              .filter((num, i) => !isNaN(num) && i !== 0)
              .join("") === medStrength.split("/").map(Number).join("")
      )
      .map((drug, index) => {
        return (
          <Typography
            id={drug.rxcui}
            key={index}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              name={drug.name}
              onClick={addToCurrentMeds}
              variant="text"
              sx={{ padding: "20px" }}
            >
              Add {drug.name}
            </Button>
          </Typography>
        );
      });

  return (
    <>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogContent sx={{ height: "400px" }}>
          <Select
            onChange={(e) => handleChange(e)}
            defaultValue=" "
            value={medStrength}
            sx={{ width: "200px" }}
          >
            <MenuItem key="default" value=" " sx={{ color: "gray" }}>
              Select Strength
            </MenuItem>
            {newTags}
          </Select>
          {filteredMeds}
        </DialogContent>
      </Dialog>
    </>
  );
}
