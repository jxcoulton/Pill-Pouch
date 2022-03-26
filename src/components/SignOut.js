import React from "react";
import { useAuth } from "../contexts/Auth";
import { useHistory } from "react-router";

export default function SignOut() {
  const { signOut } = useAuth();
  const history = useHistory();

  async function handleSignOut() {
    await signOut();
    history.push("/login");
  }

  return (
    <div>
      <input
        type="image"
        onClick={handleSignOut}
        title="sign-out"
        alt="sign out icon"
        src="/Logout.png"
      />
    </div>
  );
}
