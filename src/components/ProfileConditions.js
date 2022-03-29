import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import TextField from "@mui/material/TextField";
import { Typography, Button } from "@mui/material";
import { useTheme } from "@mui/system";
import Toastify from "toastify-js";

const ProfileConditions = () => {
  const { user } = useAuth();
  const [userConditions, setUserConditions] = useState([]);
  const [addedCondition, setAddedCondition] = useState();
  const [updateConditions, setUpdateConditions] = useState([]);
  const theme = useTheme();

  //get conditions from database on change to user of condition update
  useEffect(() => {
    const fetchUserConditions = async () => {
      try {
        const { error, data } = await supabase
          .from("conditions")
          .select("*")
          .eq("user_id", user?.id);
        if (error) throw new Error(error);
        if (data) setUserConditions(data);
      } catch (error) {
        setUserConditions([]);
      }
    };
    fetchUserConditions();
  }, [user, updateConditions, setUserConditions]);

  const handleAddCondition = (e) => {
    setAddedCondition(e.target.value);
  };

  //map conditions to display
  const conditionList = () => {
    const conditions = userConditions.map((condition, index) => {
      return (
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "5px",
            justifyContent: "space-between",
            textTransform: "capitalize",
          }}
          id={condition.condition_id}
          key={index}
        >
          {condition.condition}
          <input
            name={condition.condition}
            type="image"
            onClick={deleteCurrentCondition}
            title="Delete"
            src="/Delete.png"
            alt="delete button"
          />
        </Typography>
      );
    });
    return conditions;
  };

  //add condition to database
  const updateCondition = async (e) => {
    e.preventDefault();
    if (!!addedCondition && addedCondition.length > 0) {
      await supabase
        .from("conditions")
        .insert({ condition: addedCondition, user_id: user?.id })
        .eq("user_id", user?.id);

      Toastify({
        text: `${
          addedCondition.charAt(0).toUpperCase() + addedCondition.slice(1)
        } has been added to the chart`,
        duration: 3000,
        position: "left",
      }).showToast();
      setUpdateConditions(!updateConditions);
    } else {
      Toastify({
        text: `No allergy entered`,
        duration: 3000,
        position: "left",
      }).showToast();
    }
    setAddedCondition();
    e.target.reset();
  };

  //condition removed from database
  async function deleteCurrentCondition(e) {
    e.preventDefault();
    const conditionId = e.target.parentElement.id;
    const conditionName = e.target.name;
    const { error } = await supabase
      .from("conditions")
      .delete()
      .eq("user_id", user?.id)
      .eq("condition_id", conditionId);
    if (error) {
      Toastify({
        text: `Something went wrong`,
        duration: 3000,
        position: "left",
      }).showToast();
    } else {
      Toastify({
        text: `${
          conditionName.charAt(0).toUpperCase() + conditionName.slice(1)
        } has been removed from the chart`,
        duration: 3000,
        position: "left",
      }).showToast();
      setUpdateConditions(!updateConditions);
    }
  }

  return (
    <div>
      <div>
        <Typography variant="h5">Conditions</Typography>
      </div>
      {Object.keys(userConditions).length !== 0 ? conditionList() : `N/A`}
      <form
        onChange={handleAddCondition}
        onSubmit={(e) => {
          updateCondition(e);
        }}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          placeholder="Condition"
          name="condition"
          variant="standard"
          theme={theme}
        />
        <br />
        <Button variant="contained" theme={theme}>
          Add Condition
        </Button>
      </form>
    </div>
  );
};

export default ProfileConditions;
