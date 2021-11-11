import { createContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";

const UserDataContext = createContext({});

export const UserDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeItems, setActiveItems] = useState([]);
  const [currentMeds, setCurrentMeds] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [stateChange, setStateChange] = useState(false);
  const [userEmerContact, setUserEmerContact] = useState([]);
  const [userAllergies, setUserAllergies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    returnUsername();
    getUserProfile();
    getUsersMeds();
    getUserEmerContact();
    getUserAllergies();
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
    setLoading(false);
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
  return (
    <UserDataContext.Provider
      value={{
        userInfo,
        currentMeds,
        stateChange,
        setStateChange,
        userEmerContact,
        userAllergies,
        getUserProfile,
        setCurrentMeds,
        loading,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;
