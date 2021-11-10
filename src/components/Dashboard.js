import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import Body from "./Body";

export function Dashboard({updateUserInfo}) {
  const { user, signOut } = useAuth();
  const history = useHistory();
  const [hoverOpen, setHoverOpen] = useState(false);
  const [activeItems, setActiveItems] = useState([]);
  const [currentMeds, setCurrentMeds] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [stateChange, setStateChange] = useState(false);
  const [userEmerContact, setUserEmerContact] = useState([]);
  const [userAllergies, setUserAllergies] = useState([]);

  useEffect(() => {
    returnUsername();
    getUserProfile();
    getUsersMeds();
    getUserEmerContact()
    getUserAllergies()
    console.log("rendered");
  }, [stateChange]);

  async function returnUsername() {
    try {
      const { error, data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setActiveItems(user?.email);
      if (data) setActiveItems(data[0].username);
    } catch {
      await supabase
        .from("profiles")
        .insert({ username: user?.email, user_id: user?.id });
      await supabase.from("emergency_contact").insert({ user_id: user?.id });
      returnUsername();
    }
  }

  async function getUserProfile() {
    try {
      const { error, data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setUserInfo([]);
      if (data) setUserInfo(data);
    } catch {
      setUserInfo([]);
    }
  }

  async function getUsersMeds() {
    try {
      const { error, data } = await supabase
        .from("drugs")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setCurrentMeds([]);
      if (data) setCurrentMeds(data);
    } catch {
      setCurrentMeds([]);
    }
  }

  async function getUserEmerContact() {
    try {
      const { error, data } = await supabase
        .from("emergency_contact")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setUserEmerContact([]);
      if (data) setUserEmerContact(data[0]);
    } catch {
      setUserEmerContact([]);
    }
  }

  async function getUserAllergies() {
    try {
      const { error, data } = await supabase
        .from("allergies")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setUserAllergies([]);
      if (data) setUserAllergies(data);
    } catch {
      setUserAllergies([]);
    }
  }

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
        <h1>Pill Pouch</h1>
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
      <Body currentMeds={currentMeds} userInfo={userInfo} stateChange={stateChange} setStateChange={setStateChange} userEmerContact={userEmerContact} userAllergies={userAllergies} />
    </div>
  );
}
