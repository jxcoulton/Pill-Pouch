import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import ProfileMedications from "./ProfileMedications";
import UserDataContext from "../contexts/userData";
import { Typography, useTheme } from "@mui/material";
import { Button } from "@mui/material";
import { Card } from "@mui/material";
import { Grid } from "@mui/material";

function findProp(obj, prop) {
  var result = [];
  function recursivelyFindProp(o, keyToBeFound) {
    Object.keys(o).forEach(function (key) {
      if (typeof o[key] === "object") {
        recursivelyFindProp(o[key], keyToBeFound);
      } else {
        if (key === keyToBeFound) result.push(o[key]);
      }
    });
  }
  recursivelyFindProp(obj, prop);
  return result;
}

const Interactions = () => {
  const { currentMeds } = useContext(UserDataContext);
  const [interactions, setInteractions] = useState();
  const theme = useTheme();

  const submitCompare = () => {
    let rxcuiString = "";
    currentMeds.forEach((drug) => {
      rxcuiString += `${drug.rxcui}+`;
    });
    axios
      .get(
        `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcuiString}`
      )
      .then((res) => {
        const { data } = res;
        const interactionsDisplay = findProp(data, "description");
        let interactionList = [];
        interactionList = interactionsDisplay.map((detail, index) => {
          if (index > 0) {
            if (detail !== interactionsDisplay[index - 1]) {
              return <p key={index}>{detail}</p>;
            }
          } else {
            return <p key={index}>{detail}</p>;
          }
          return interactionList;
        });
        setInteractions(
          interactionList.length !== 0 ? (
            <Card
              variant="outlined"
              theme={theme}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h5">Results</Typography> {interactionList}
            </Card>
          ) : (
            <p>No Interactions</p>
          )
        );
      });
  };

  return (
    <>
      <Card
        variant="outlined"
        theme={theme}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <ProfileMedications />
        <Button variant="contained" onClick={submitCompare} theme={theme}>
          Search Interactions
        </Button>
      </Card>
      {interactions}
    </>
  );
};
export default Interactions;
