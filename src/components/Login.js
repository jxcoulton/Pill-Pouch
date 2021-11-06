import { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { signIn } = useAuth();

  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    // Get email and password input values
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    // Calls `signIn` function from the context
    const { error } = await signIn({ email, password });
    if (error) {
      Toastify({
        text: `error signing in`,
        duration: 3000,
      }).showToast();
    } else {
      // Redirect user to Dashboard
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

        <button type="submit">Login</button>
      </form>
      <br />
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </>
  );
}
