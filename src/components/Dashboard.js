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
  const [hoverOpen, setHoverOpen] = useState(false);

  useEffect(() => {
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
    returnUsername();
  }, []);

  const toggleUserButton = () => {
    setHoverOpen(!hoverOpen);
  };

  const toggleUserButtonFalse = () => {
    setHoverOpen(false);
  };

  async function handleSignOut() {
    // Ends user session
    await signOut();
    // Redirects the user to Login page
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
        <p>Welcome, {activeItems}!</p>
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
