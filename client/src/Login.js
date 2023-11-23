import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
import axios from "axios";

import { LeftGrid, RightGrid } from "./Signup";
import { useStyles } from "./Signup";
import { ActiveChatContext } from "./context/activeChat";

const Login = () => {
  const history = useHistory();

  const { activeChat, setActiveChat } = useContext(ActiveChatContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    const userData = { username, password };
    const API_URL = "http://127.0.0.1:8000/messenger/";

    try {
      const response = await axios.post(API_URL + "login/", userData);

      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("access", response.data.access);
      setActiveChat((prevActiveChat) => ({ ...prevActiveChat, userId: response.data.userId }));
      console.log("Login/activeChat.conversations: ", activeChat.conversations);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err.message);
    }
  };
  const registerRedirect = () => history.push("/register");

  const classes = useStyles();

  if (isLoggedIn) {
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
