import { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { user, signUp } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const { error } = await signUp({ email, password });

    if (error) {
      Toastify({
        text: `error signing up`,
        duration: 3000,
      }).showToast();
    } else {
      history.push("/");
    }
  }

  return (
    <>
      <div className="headWrap">
        <h1>Medication doesn't have to be SCARY</h1>
        <h1>Pill Pouch</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input-email">Email</label>
        <input id="input-email" type="email" ref={emailRef} />

        <label htmlFor="input-password">Password</label>
        <input id="input-password" type="password" ref={passwordRef} />

        <br />

        <button type="submit">Sign up</button>
      </form>
      <br />
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </>
  );
}
