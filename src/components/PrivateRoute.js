import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import { Dashboard } from "./Dashboard";

export function PrivateRoute() {
  const { user } = useAuth();

  //route to dashboard verify if user exist allow to dashboard else direct to login page
  return (
    <Route
      render={() => {
        return user ? <Dashboard /> : <Redirect to="/login" />;
      }}
    ></Route>
  );
}
