import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { AuthProvider } from "../contexts/Auth";
import { UserDataProvider } from "../contexts/userData";
import { PrivateRoute } from "./PrivateRoute";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/private-theming";

//default theme to ref palette
const colorTheme = createTheme({
  palette: {
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#ed882f",
    },
  },
});

//provider palette / component styles
const theme = createTheme({
  palette: {
    primary: {
      main: colorTheme.palette.primary.main,
    },
    secondary: {
      main: colorTheme.palette.secondary.main,
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          marginRight: "2px",
          marginLeft: "2px",
          backgroundColor: colorTheme.palette.grey[300],
          color: colorTheme.palette.grey[500],
          "&.Mui-selected": {
            backgroundColor: colorTheme.palette.background.default,
          },
        },
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: "50px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: "15px",
          margin: "10px",
          backgroundColor: colorTheme.palette.grey[100],
          height: "90%",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInput-underline:after": {
            borderBottomColor: colorTheme.palette.secondary.main,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: colorTheme.palette.secondary.main,
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: colorTheme.palette.secondary.main,
            },
          },
          input: { textTransform: "capitalize" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: colorTheme.palette.primary.main,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: colorTheme.palette.primary.contrastText,
          padding: "10px",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          textTransform: "capitalize",
        },
      },
    },
  },
});

export default function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <UserDataProvider>
            <ThemeProvider theme={theme}>
              <Switch>
                <PrivateRoute exact path="/" component={Dashboard} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
              </Switch>
            </ThemeProvider>
          </UserDataProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}
