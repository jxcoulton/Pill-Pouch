import { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import Footer from "./Footer";
import { Box, Typography, TextField, Button, useTheme } from "@mui/material";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

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
        text: `Error signing up`,
        duration: 3000,
        position: "left",
      }).showToast();
    } else {
      history.push("/");
    }
  }

  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h4" sx={{ paddingTop: "20px", paddingLeft: "24px" }}>
        Pill-Pal
      </Typography>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: "30px",
          }}
        >
          Create an Account!
        </Typography>
        <Box
          sx={{
            bgcolor: theme.palette.background.default,
            p: 4,
            borderRadius: "10px",
            alignSelf: "center",
            minWidth: "300px",
            width: "30%",
            display: "flex",
            flexDirection: "column",
          }}
        >
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
              name="email"
              theme={theme}
              required
              type="email"
              inputRef={emailRef}
              label="Email"
              inputProps={{ style: { textTransform: "inherit" } }}
              sx={{ m: "10px" }}
            />
            <TextField
              name="password"
              theme={theme}
              required
              type="password"
              inputRef={passwordRef}
              label="Password"
              inputProps={{ style: { textTransform: "inherit" } }}
              sx={{ m: "10px" }}
            />
            <Button
              variant="contained"
              type="submit"
              theme={theme}
              sx={{ padding: "15px", m: "10px" }}
            >
              SIGN UP
            </Button>
          </form>
        </Box>
        <Typography variant="button" sx={{ p: "10px" }}>
          Already Have an Account? <Link to="/login">LogIn</Link>
        </Typography>
      </Box>
      <Box>
        <Footer />
      </Box>
    </Box>
  );
}
