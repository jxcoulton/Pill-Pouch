import { useRef, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import UserDataContext from "../contexts/userData";

export function Login() {
  const { setUserInfo } = useContext(UserDataContext);

  useEffect(() => {
    setUserInfo([]);
  }, []);

  const emailRef = useRef();
  const passwordRef = useRef();

  const { signIn } = useAuth();

  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const { error } = await signIn({ email, password });
    if (error) {
      Toastify({
        text: `error signing in`,
        duration: 3000,
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
        <h2>Login to your account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="input-email">Email</label>
          <input id="input-email" type="email" ref={emailRef} />
          <br />
          <label htmlFor="input-password">Password</label>
          <input id="input-password" type="password" ref={passwordRef} />
          <p className="forgot-password-link">Forgot password?</p>
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
