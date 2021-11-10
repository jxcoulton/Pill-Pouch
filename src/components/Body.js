import React from "react";
import Resources from "./Resources";
import Identify from "./Indentify";
import MyHistory from "./MyHistory";
import Interactions from "./Interactions";

const Body = ( {currentMeds, userInfo, stateChange, setStateChange, userEmerContact, userAllergies}) => {
  return (
    <>
      <div className="bodyWrap">
        <Resources/>
        <Identify  currentMeds={currentMeds} stateChange={stateChange} setStateChange={setStateChange}/>
        <Interactions currentMeds={currentMeds} />
        <MyHistory currentMeds={currentMeds} userInfo={userInfo} userEmerContact={userEmerContact} userAllergies={userAllergies}/>
      </div>
    </>
  );
};

export default Body;
