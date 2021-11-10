import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { AuthProvider } from "../contexts/Auth";
import { UserDataProvider } from "../contexts/userData";
import { PrivateRoute } from "./PrivateRoute";
import Profile from "./Profile";

export function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <UserDataProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <PrivateRoute path="/profile" component={Profile} />
            </Switch>
          </UserDataProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}
