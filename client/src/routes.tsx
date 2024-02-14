import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import { Home, SnackbarError } from "./components";

const Routes = () => {
  const [errorMessage] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  return (
    <>
      {snackBarOpen && (
        <SnackbarError
          setSnackBarOpen={setSnackBarOpen}
          errorMessage={errorMessage}
          snackBarOpen={snackBarOpen}
        />
      )}
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Signup} />
        <Route path="/home" component={Home} />
        <Redirect from="/" to="login" exact />
      </Switch>
    </>
  );
};

export default Routes;
