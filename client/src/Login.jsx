import { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";

import { LeftGrid, RightGrid } from "./Signup";
import { useStyles } from "./Signup";
import { AuthContext } from "./context/AuthContext";

const Login = () => {
  const history = useHistory();

  const { auth, login } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    const userData = { username, password };

    login(userData);
  };

  const registerRedirect = () => history.push("/register");

  const classes = useStyles();

  if (auth.isLoggedIn) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.mainContainer}>
      <LeftGrid classes={classes} />
      <RightGrid
        classes={classes}
        title="Don't have an account?"
        handleRedirect={registerRedirect}
        buttonText="Create account"
        handleSubmit={handleLogin}
        formTitle="Welcome"
        SubmitButtonText="Login"
      />
    </Grid>
  );
};

export default Login;
