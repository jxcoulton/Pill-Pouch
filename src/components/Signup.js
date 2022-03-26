import { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import AppBar from "./AppBar";
import Footer from "./Footer";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/system";
import { Button } from "@mui/material";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 200,
  bgcolor: "white",
  p: 4,
  borderRadius: "10px",
};

export function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signUp } = useAuth();
  const history = useHistory();
  const theme = useTheme();

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
    <Box sx={{ bgcolor: "primary.main", width: "100vw", height: "100vh" }}>
      <Typography variant="h4" sx={{ paddingTop: "20px", paddingLeft: "24px" }}>
        Pill-Pal
      </Typography>
      <Typography
        variant="h5"
        sx={{
          position: "absolute",
          top: "27%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Create an Account!
      </Typography>
      <Box sx={style}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            width: "100%",
            height: "100%",
          }}
        >
          <TextField
            // name="email"
            theme={theme}
            required
            type="email"
            inputRef={emailRef}
            label="Email"
          />
          <TextField
            // name="password"
            theme={theme}
            required
            type="password"
            inputRef={passwordRef}
            label="Password"
          />
          <Button
            variant="contained"
            type="submit"
            theme={theme}
            sx={{ padding: "15px" }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
      <Typography
        variant="button"
        sx={{
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Already Have an Account? <Link to="/login">LogIn</Link>
      </Typography>
      <Box
        sx={{
          position: "absolute",
          top: "90%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
}
