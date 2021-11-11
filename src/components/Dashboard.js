import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../contexts/Auth";
import { useState } from "react";
import Body from "./Body";
import Loading from "./Loading";
import UserDataContext from "../contexts/userData";

export function Dashboard() {
  const { userInfo, setStateChange, stateChange, loading } =
    useContext(UserDataContext);
  const { signOut } = useAuth();
  const history = useHistory();

  useEffect(() => {
    setStateChange(!stateChange);
  }, []);

  async function handleSignOut() {
    await signOut();
    history.push("/login");
  }

  async function handleProfilePage() {
    history.push("/Profile");
  }

  return (
    <div className="main-body">
      <div className="head-wrap">
        <h1>Pill-Pal</h1>
        <h1 className="banner-title">Medication doesn't have to be SCARY</h1>
      </div>
      <div className="logged-in-buttons">
        <h4>
          Welcome,{" "}
          {Object.keys(userInfo).length !== 0
            ? userInfo[0].full_name || userInfo[0].username
            : "User"}
          !
        </h4>
        <div className="logout-edit-buttons">
          <input
            type="image"
            className="edit-signout-button"
            onClick={handleProfilePage}
            title="edit profile"
            alt="edit profile icon"
            src="https://cdn4.iconfinder.com/data/icons/man-user-human-person-business-profile-avatar/100/20-1User_13-512.png"
          />
          <input
            type="image"
            className="edit-signout-button"
            onClick={handleSignOut}
            title="sign-out"
            alt="sign out icon"
            src="http://cdn.onlinewebfonts.com/svg/img_87594.png"
          />
        </div>
      </div>
      {loading ? <Loading /> : <Body />}
    </div>
  );
}
