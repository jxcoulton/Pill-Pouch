import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../contexts/Auth";
import { useState } from "react";
import Body from "./Body";
import UserDataContext from "../contexts/userData";

export function Dashboard() {
  const { userInfo, setStateChange, stateChange } = useContext(UserDataContext);
  const { signOut } = useAuth();
  const history = useHistory();
  const [hoverOpen, setHoverOpen] = useState(false);

  useEffect(() => {
    setStateChange(!stateChange);
  }, []);

  const toggleUserButton = () => {
    setHoverOpen(!hoverOpen);
  };

  const toggleUserButtonFalse = () => {
    setHoverOpen(false);
  };

  async function handleSignOut() {
    await signOut();
    history.push("/login");
  }

  async function handleProfilePage() {
    history.push("/Profile");
  }

  return (
    <div>
      <div className="headWrap">
        <h1>Medication doesn't have to be SCARY</h1>
        <h1>Pill-Pal</h1>
        <p>
          Welcome,{" "}
          {Object.keys(userInfo).length !== 0
            ? userInfo[0].full_name || userInfo[0].username
            : "User"}
          !
        </p>
        <div>
          <input
            onClick={toggleUserButton}
            type="image"
            className="delete_button"
            title="Delete"
            src="https://webstockreview.net/images/clipart-pen-pen-icon-15.png"
            alt="delete button"
          />
          {hoverOpen && (
            <div className="hoverDiv" onMouseLeave={toggleUserButtonFalse}>
              <h5 onClick={handleSignOut}>Sign out</h5>
              <h5 onClick={handleProfilePage}>Edit Profile</h5>
            </div>
          )}
        </div>
      </div>
      <Body />
    </div>
  );
}
