import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, Box, makeStyles } from "@material-ui/core";
import { login } from "./store/utils/thunkCreators";

import { LoginRegister, Form, SideImgColumn } from "./Signup";

const useStyles = makeStyles((theme) => ({
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
  registerFormGrid: {},

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
  const { user, login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };
  const registerRedirect = () => history.push("/register");

  const classes = useStyles();
  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.mainContainer}>
      <Grid item className={classes.gridLeft}>
        <SideImgColumn classes={classes} />
      </Grid>
      <Grid item className={classes.gridRight}>
        <Box className={classes.loginRegisterFormContanier}>
          <LoginRegister
            classes={classes}
            handleRedirect={registerRedirect}
            buttonText="Create account"
            title="Don't have an account?"
          />
          <Form
            type="login"
            handleAction={handleLogin}
            classes={classes}
            formTitle="Welcome back!"
            buttonText="Login"
          />
        </Box>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
