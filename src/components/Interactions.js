import React, { useState, useContext } from "react";
import axios from "axios";
import ProfileMedications from "./ProfileMedications";
import UserDataContext from "../contexts/userData";
import { Typography, useTheme, Button, Card, Box } from "@mui/material";

//function to find interactions in API results
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
    //concat all the ids to input into the API call to search interactions
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
        let interactionList = interactionsDisplay.map((detail, index) => {
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
            <>
              <Typography variant="h5">Results</Typography>
              {interactionList}
            </>
          ) : (
            <p>No Interactions</p>
          )
        );
      });
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      <Card
        variant="outlined"
        theme={theme}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ProfileMedications />
        <Button variant="contained" onClick={submitCompare} theme={theme}>
          Search Interactions
        </Button>
      </Card>
      {interactions && (
        <Card
          variant="outlined"
          theme={theme}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {interactions}
        </Card>
      )}
    </Box>
  );
};
export default Interactions;
