import { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signUp } = useAuth();
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
        position: "left",
      }).showToast();
    } else {
      history.push("/");
    }
  }

  return (
    <div className="main-body">
      <div className="head-wrap">
        <h2 className="web-name">Pill-Pal</h2>
        <h1 className="banner-title">Making medicine less scary</h1>
      </div>
      <div className="login-box">
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="input-email">Email</label>
          <input id="input-email" type="email" ref={emailRef} />
          <br />
          <label htmlFor="input-password">Password</label>
          <input id="input-password" type="password" ref={passwordRef} />
          <br />
          <br />
          <button className="btn-primary" type="submit">
            Sign up
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
