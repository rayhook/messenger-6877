import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import Signup from "./Signup.js";
import Login from "./Login.js";
import { Home, SnackbarError } from "./components";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min.js";

const Routes = (props) => {
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
