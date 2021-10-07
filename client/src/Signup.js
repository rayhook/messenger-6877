import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  makeStyles,
  Typography
} from "@material-ui/core";

import { register } from "./store/utils/thunkCreators";
import signInImg from "./resources/bg-img.png";
import { ChatIcon } from "./resources/ChatIcon";

const useStyles = makeStyles({
  ChatIcon: {
    width: "9rem",
    height: "9rem",
    marginBottom: "3.5rem"
  },

  loginButton: {
    width: "14.5rem",
    height: "5rem",
    fontSize: 22,
    color: "#3A8DFF",
    boxShadow: "5px 2px 30px -12px rgba(0,0,0,0.35)",
    borderRadius: "0.5rem",
    border: "none",
    fontWeight: "bold"
  },

  createButton: {
    width: "16rem",
    height: "5.5rem",
    marginTop: "5rem",
    fontSize: 28,
    color: "#ffff",
    boxShadow: "0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 0 rgba(0, 127, 255, 0);",
    borderRadius: "0.5rem",
    border: "none",
    backgroundColor: "#3A8DFF",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#3A8DFF"
    }
  }
});

const Login = (props) => {
  const history = useHistory();
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };
  const classes = useStyles();
  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        margin: "0px"
      }}
    >
      <Grid container sx={{ justifyContent: { xs: "center", md: "normal" } }}>
        <Grid item xs={5}>
          <Box
            display={{ xs: "none", lg: "block" }}
            sx={{
              backgroundImage: `linear-gradient(#3A8DFF, #86B9FF)`,
              height: "100%",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: " column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ChatIcon className={classes.ChatIcon} />
              <Box sx={{ typography: "body", fontSize: 40, color: "#ffffff", fontWeight: "bold" }}>
                Converse with anyone
              </Box>
              <Box sx={{ typography: "body", fontSize: 40, color: "#ffffff", fontWeight: "bold" }}>
                with any language
              </Box>
            </Box>
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                opacity: "15%",
                top: "0rem",
                left: "0rem"
              }}
              src={signInImg}
              alt="signin background image"
            ></Box>
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: "3.5rem",
                mr: "3.5rem"
              }}
            >
              <Box display={{ xs: "none", md: "block" }}>
                <Box
                  sx={{
                    typography: "body2",
                    fontSize: 22,
                    color: "#8c8c8c",
                    mr: "3.5rem"
                  }}
                >
                  Already have an account?
                </Box>
              </Box>

              <Button
                className={classes.loginButton}
                variant="outlined"
                size="large"
                onClick={() => history.push("/login")}
              >
                Login
              </Button>
            </Box>

            <Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: "3.5rem"
                }}
              >
                <Box>
                  <form onSubmit={handleRegister}>
                    <Box sx={{ m: "2", flexDirection: "row" }}>
                      <Box
                        sx={{
                          typography: "body2",
                          fontSize: 40,
                          fontWeight: "500",
                          marginY: "2rem",
                          paddingY: "1.5rem"
                        }}
                      >
                        Create an account.
                      </Box>
                      <Box>
                        <Box>
                          <FormControl>
                            <TextField
                              InputLabelProps={{ shrink: false }}
                              aria-label="username"
                              label="Username"
                              name="username"
                              type="text"
                              required
                            />
                          </FormControl>
                        </Box>
                        <Box>
                          <FormControl>
                            <TextField
                              InputLabelProps={{ shrink: false }}
                              label="E-mail address"
                              aria-label="e-mail address"
                              type="email"
                              name="email"
                              required
                            />
                          </FormControl>
                        </Box>
                        <Box>
                          <FormControl error={!!formErrorMessage.confirmPassword}>
                            <TextField
                              InputLabelProps={{ shrink: false }}
                              aria-label="password"
                              label="Password"
                              type="password"
                              inputProps={{ minLength: 6 }}
                              name="password"
                              required
                            />
                            <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
                          </FormControl>
                        </Box>
                        <Box>
                          <FormControl error={!!formErrorMessage.confirmPassword}>
                            <TextField
                              InputLabelProps={{ shrink: false }}
                              label="Confirm Password"
                              aria-label="confirm password"
                              type="password"
                              inputProps={{ minLength: 6 }}
                              name="confirmPassword"
                              required
                            />
                            <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
                          </FormControl>
                        </Box>
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            className={classes.createButton}
                            type="submit"
                            variant="contained"
                            size="large"
                          >
                            Create
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </form>
                </Box>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => {
      dispatch(register(credentials));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
