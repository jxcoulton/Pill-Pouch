import React, { useContext, useState } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import UserDataContext from "../contexts/userData";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { DialogContent, DialogTitle } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
};

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

  let str =
    !!newStrengths &&
    Array.from(new Set(newStrengths.map(JSON.stringify))).map((item) =>
      item.replace(/[[\]]/g, "").replace(/,/g, "/")
    );

  const newTags =
    str.length > 0 &&
    str.map((med, i) => (
      <MenuItem key={i} value={med}>
        {med}
      </MenuItem>
    ));

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
        {/* {dialog title with input value} */}
        <DialogContent sx={{height: "400px"}}>
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
