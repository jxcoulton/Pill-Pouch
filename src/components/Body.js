import React from "react";
import Resources from "./Resources";
import Identify from "./Indentify";
import MyHistory from "./MyHistory";
import Interactions from "./Interactions";

const Body = () => {
  return (
    <div className="bodyWrap">
      <Resources />
      <Identify />
      <Interactions />
      <MyHistory />
    </div>
  );
};

export default Body;
