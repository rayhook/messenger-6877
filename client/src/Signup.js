import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Button,
  FormControl,
  TextField,
  makeStyles,
  Typography
} from "@material-ui/core";
import sideImg from "./resources/bg-img.png";
import { ChatIcon } from "./resources/ChatIcon";
import axios from "axios";

export const useStyles = makeStyles((theme) => ({
  mainContainer: {
    width: "100vw",
    height: "100vh"
  },

  gridLeft: {
    width: "40%",
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  gridRight: {
    width: "60%",
    [theme.breakpoints.down("md")]: {
      width: "100%"
    }
  },

  sideImgContainer: {
    backgroundImage: `linear-gradient(#3A8DFF, #86B9FF)`,
    height: "100%",
    position: "relative"
  },
  iconTitleContainer: {
    height: "100%",
    display: "flex",
    flexDirection: " column",
    justifyContent: "center",
    alignItems: "center"
  },
  imgContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: "15%",
    top: "0rem",
    left: "0rem"
  },
  ChatIcon: {
    width: theme.spacing(35),
    height: theme.spacing(35),
    marginBottom: theme.spacing(10)
  },

  loginRegisterFormContanier: {
    display: "flex",
    flexDirection: "column",
    marginRight: theme.spacing(15),
    marginLeft: theme.spacing(15),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    "@media (max-width:900px)": {
      marginTop: theme.spacing(15),
      marginBottom: theme.spacing(15)
    }
  },

  logingRegisterContainer: {
    display: "flex",
    justifyContent: "flex-end",
    "@media (max-width:900px)": {
      justifyContent: "center"
    },
    alignItems: "center"
  },

  LoginRegisterSubTitle: {
    marginRight: theme.spacing(12)
  },

  loginRegisterButton: {
    width: theme.spacing(55),
    height: theme.spacing(20),
    color: theme.palette.primary.main,
    boxShadow: "5px 2px 30px -12px rgba(0,0,0,0.35)",
    borderRadius: theme.spacing(1.2),
    border: "none"
  },
  formTitleContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: theme.spacing(40),
    "@media (max-width:900px)": {
      marginTop: theme.spacing(10)
    }
  },
  formTitle: {
    marginBottom: theme.spacing(5)
  },
  formButton: {
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(1),
    height: theme.spacing(20),
    width: theme.spacing(60),
    marginTop: theme.spacing(20),
    "@media (max-width:900px)": {
      marginTop: theme.spacing(10)
    },
    color: theme.palette.bright.main,
    boxShadow: "0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 0 rgba(0, 127, 255, 0);",
    borderRadius: theme.spacing(1.2),
    border: "none",
    "&:hover": {
      backgroundColor: theme.palette.bright.main,
      color: theme.palette.primary.main
    }
  }
}));

const Login = (props) => {
  const history = useHistory();
  const [isSignedup, setIsSignedup] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const userData = { username, email, password };
    const API_URL = "http://127.0.0.1:8000/messenger/";
    try {
      let response = await axios.post(API_URL + "register/", userData);
      if (response.status === 201) {
        try {
          let loginResponse = await axios.post(API_URL + "login/", { username, password });
          localStorage.setItem("access", loginResponse.data.access);
          localStorage.setItem("refresh", loginResponse.data.refresh);
          setIsSignedup(true);
        } catch (err) {
          console.error("Login failed: ", err.message);
        }
      } else {
        console.error("Register failed", response.statusText);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const loginRedirect = () => history.push("/login");

  const classes = useStyles();

  if (isSignedup) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.mainContainer}>
      <LeftGrid classes={classes} />
      <RightGrid
        classes={classes}
        title="Already have an account?"
        handleRedirect={loginRedirect}
        buttonText="Login"
        type="register"
        formTitle="Create an account."
        handleSubmit={handleRegister}
        SubmitButtonText="Create"
      />
    </Grid>
  );
};

export const LeftGrid = ({ classes }) => (
  <Grid item className={classes.gridLeft}>
    <SideImgColumn classes={classes} />
  </Grid>
);

export const RightGrid = ({
  classes,
  handleRedirect,
  handleSubmit,
  type,
  title,
  buttonText,
  formTitle,
  SubmitButtonText
}) => (
  <Grid item className={classes.gridRight}>
    <Box className={classes.loginRegisterFormContanier}>
      <LoginRegister
        classes={classes}
        handleRedirect={handleRedirect}
        buttonText={buttonText}
        title={title}
      />
      <Form
        type={type}
        handleAction={handleSubmit}
        classes={classes}
        formTitle={formTitle}
        SubmitButtonText={SubmitButtonText}
      />
    </Box>
  </Grid>
);

export const SideImgColumn = ({ classes }) => (
  <Box className={classes.sideImgContainer}>
    <Box className={classes.iconTitleContainer}>
      <ChatIcon className={classes.ChatIcon} />
      <Typography variant="h4">Converse with anyone</Typography>
      <Typography variant="h4">with any language</Typography>
    </Box>
    <img className={classes.imgContainer} src={sideImg} alt="talk to anyone" />
  </Box>
);

export const LoginRegister = ({ classes, handleRedirect, buttonText, title }) => (
  <Grid className={classes.logingRegisterContainer}>
    <Box className={classes.LoginRegisterSubTitle} display={{ xs: "none", md: "block" }}>
      <Typography color="secondary" variant="subtitle1">
        {title}
      </Typography>
    </Box>

    <Button
      className={classes.loginRegisterButton}
      variant="outlined"
      size="large"
      onClick={handleRedirect}
    >
      {buttonText}
    </Button>
  </Grid>
);

const FormContainer = ({ ariaLabel, label, name, type, inputProps }) => (
  <Box>
    <FormControl>
      <TextField
        InputLabelProps={{ shrink: false, required: false }}
        aria-label={ariaLabel}
        label={label}
        name={name}
        type={type}
        inputProps={inputProps}
        required
      />
    </FormControl>
  </Box>
);

export const Form = ({ handleAction, classes, formTitle, buttonText, type, SubmitButtonText }) => (
  <Grid>
    <Box className={classes.formTitleContainer}>
      <Box>
        <Box className={classes.formTitle}>
          <Typography variant="h3">{formTitle}</Typography>
        </Box>
        <form onSubmit={handleAction}>
          <Box>
            <Box>
              <FormContainer ariaLabel="username" label="Username" name="username" type="text" />
              {type === "register" && (
                <FormContainer
                  label="E-mail address"
                  ariaLabel="e-mail address"
                  name="email"
                  type="email"
                />
              )}
              <FormContainer
                ariaLabel="password"
                label="Password"
                name="password"
                type="password"
                inputProps={{ minLength: 6 }}
              />
            </Box>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button className={classes.formButton} type="submit" variant="contained">
                  {SubmitButtonText}
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  </Grid>
);

export default Login;
