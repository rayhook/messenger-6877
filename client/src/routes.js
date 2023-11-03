import React, { useEffect, useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Signup from "./Signup.js";
import Login from "./Login.js";
import { Home, SnackbarError } from "./components";

const Routes = (props) => {
  // const { user, fetchUser } = props;

  const [errorMessage, setErrorMessage] = useState("");
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
      </Switch>
    </>
  );
};

export default Routes;
