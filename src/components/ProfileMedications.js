import React, { useContext, useEffect } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import UserDataContext from "../contexts/userData";
import { Typography } from "@mui/material";
import Toastify from "toastify-js";

const ProfileMedications = () => {
  const {
    currentMeds,
    setCurrentMeds,
    updateMedications,
    setUpdateMedications,
  } = useContext(UserDataContext);
  const { user } = useAuth();

  //fetch current meds from database
  useEffect(() => {
    const fetchCurrentMeds = async () => {
      try {
        const { error, data } = await supabase
          .from("drugs")
          .select("*")
          .eq("user_id", user?.id);
        if (error) throw new Error(error);
        if (data) setCurrentMeds(data);
      } catch {
        setCurrentMeds([]);
      }
    };
    fetchCurrentMeds();
  }, [user, updateMedications, setCurrentMeds]);

  //create a list of medications
  const medsList = () => {
    let medications = [];
    medications = currentMeds.map((med, index) => {
      return (
        <Typography
          id={med.drug_id}
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "5px",
            justifyContent: "space-between",
            textTransform: "capitalize",
            padding: "5px 0px",
          }}
        >
          {med.drug_name}
          <input
            name={med.drug_name}
            type="image"
            onClick={deleteCurrentMed}
            title="Delete"
            src="/Delete.png"
            alt="delete button"
          />
        </Typography>
      );
    });
    return medications;
  };

  //remove a medication from database
  async function deleteCurrentMed(e) {
    e.preventDefault();
    const drugId = e.target.parentElement.id;
    const drugName = e.target.name;
    const { error } = await supabase
      .from("drugs")
      .delete()
      .eq("drug_id", drugId)
      .eq("user_id", user?.id);
    if (error) {
      Toastify({
        text: `Something went wrong`,
        duration: 3000,
        position: "left",
      }).showToast();
    } else {
      Toastify({
        text: `${
          drugName.charAt(0).toUpperCase() + drugName.slice(1)
        } has been removed`,
        duration: 3000,
        position: "left",
      }).showToast();
      setUpdateMedications(!updateMedications);
    }
  }

  return (
    <>
      <Typography variant="h5">Medications</Typography>
      {Object.keys(currentMeds).length !== 0
        ? medsList()
        : `No Medications Added`}
    </>
  );
};

export default ProfileMedications;
