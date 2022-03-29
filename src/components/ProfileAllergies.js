import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import TextField from "@mui/material/TextField";
import { Typography, Button } from "@mui/material";
import { useTheme } from "@mui/system";
import Toastify from "toastify-js";

const ProfileAllergies = () => {
  const { user } = useAuth();
  const [userAllergies, setUserAllergies] = useState([]);
  const [addedAllergy, setAddedAllergy] = useState();
  const [updateAllergies, setUpdateAllergies] = useState([]);
  const theme = useTheme();

  //get database allergies on change to user or when allergies updated
  useEffect(() => {
    const fetchUserAllergies = async () => {
      try {
        const { error, data } = await supabase
          .from("allergies")
          .select("*")
          .eq("user_id", user?.id);
        if (error) throw new Error(error);
        if (data) setUserAllergies(data);
      } catch (error) {
        setUserAllergies([]);
      }
    };
    fetchUserAllergies();
  }, [user, updateAllergies, setUserAllergies]);

  const handleAddAllergy = (e) => {
    setAddedAllergy(e.target.value);
  };

  //map allergies to display
  const allergyList = () => {
    let allergies = userAllergies.map((allergy, index) => {
      return (
        <Typography
          id={allergy.allergy_id}
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "5px",
            justifyContent: "space-between",
            textTransform: "capitalize",
          }}
        >
          {allergy.allergen}
          <input
            name={allergy.allergen}
            type="image"
            onClick={deleteCurrentAllergy}
            title="Delete"
            src="/Delete.png"
            alt="delete button"
          />
        </Typography>
      );
    });
    return allergies;
  };

  //add allergy to database
  const updateAllergy = async (e) => {
    e.preventDefault();
    if (!!addedAllergy && addedAllergy.length > 0) {
      await supabase
        .from("allergies")
        .insert({ allergen: addedAllergy, user_id: user?.id })
        .eq("user_id", user?.id);
      Toastify({
        text: `${
          addedAllergy.charAt(0).toUpperCase() + addedAllergy.slice(1)
        } allergy has been added`,
        duration: 3000,
        position: "left",
      }).showToast();
      setUpdateAllergies(!updateAllergies);
    } else {
      Toastify({
        text: `No allergy entered`,
        duration: 3000,
        position: "left",
      }).showToast();
    }
    setAddedAllergy();
    e.target.reset();
  };

  //delete allergy from database
  async function deleteCurrentAllergy(e) {
    e.preventDefault();
    const allergyId = e.target.parentElement.id;
    const allergyName = e.target.name;
    const { error } = await supabase
      .from("allergies")
      .delete()
      .eq("user_id", user?.id)
      .eq("allergy_id", allergyId);
    if (error) {
      Toastify({
        text: `Something went wrong`,
        duration: 3000,
        position: "left",
      }).showToast();
    } else {
      Toastify({
        text: `${
          allergyName.charAt(0).toUpperCase() + allergyName.slice(1)
        } allergy has been removed`,
        duration: 3000,
        position: "left",
      }).showToast();
      setUpdateAllergies(!updateAllergies);
    }
  }

  return (
    <div>
      <div>
        <Typography variant="h5">Allergies</Typography>
      </div>
      {Object.keys(userAllergies).length !== 0 ? allergyList() : `N/A`}
      <form
        onChange={handleAddAllergy}
        onSubmit={(e) => {
          updateAllergy(e);
        }}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          placeholder="Allergy"
          name="allergen"
          variant="standard"
          theme={theme}
        />
        <br />
        <Button variant="contained" theme={theme}>
          Add Allergy
        </Button>
      </form>
    </div>
  );
};

export default ProfileAllergies;
