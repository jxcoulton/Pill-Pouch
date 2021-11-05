import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Signup } from "./Signup";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { AuthProvider } from "../contexts/Auth";
import { PrivateRoute } from "./PrivateRoute";

export function App() {
  return (
    <div>
      <Router>
        {/* Wrap routes in the AuthProvider 👇 */}
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}
