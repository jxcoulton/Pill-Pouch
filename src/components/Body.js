import React from "react";
import Resources from "./Resources";
import Identify from "./Identify";
import MyHistory from "./MyHistory";
import Interactions from "./Interactions";

const Body = () => {
  return (
    <>
      <div className="body-wrap">
        <Resources />
        <Identify />
        <Interactions />
        <MyHistory />
      </div>
    </>
  );
};

export default Body;
