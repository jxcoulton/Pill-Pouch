import { useHistory } from "react-router";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import Body from "./Body";

export function Dashboard() {
  // Get current user and signOut function from context
  const { user, signOut } = useAuth();
  const [activeItems, setActiveItems] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function returnUsername() {
      try {
        const { error, data } = await supabase
          .from("profiles")
          .select("user_id, username")
          .eq("user_id", user?.id);
        if (error) setActiveItems(user?.email);
        if (data) setActiveItems(data[0].username);
      } catch {
        setActiveItems(user?.email);
      }
    }
    returnUsername();
  }, []);

  async function handleSignOut() {
    // Ends user session
    await signOut();
    // Redirects the user to Login page
    history.push("/login");
  }

  return (
    <div>
      <div className="headWrap">
        <h1>Medication doesn't have to be SCARY</h1>
        <h1>Pill Pouch</h1>
        <p>Welcome, {activeItems}!</p>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
      <Body />
    </div>
  );
}
