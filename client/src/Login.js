import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, Box, Button, FormControl, TextField, makeStyles } from "@material-ui/core";
import { login } from "./store/utils/thunkCreators";
import { ChatIcon } from "./resources/ChatIcon";
import signInImg from "./resources/bg-img.png";

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
  const { user, login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
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
                    typography: "body1",
                    fontSize: 22,
                    color: "#8c8c8c",
                    mr: "3.5rem"
                  }}
                >
                  Don't have an account?
                </Box>
              </Box>

              <Button
                className={classes.loginButton}
                variant="outlined"
                size="large"
                onClick={() => history.push("/register")}
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
                  <form onSubmit={handleLogin}>
                    <Box sx={{ m: "2", flexDirection: "row" }}>
                      <Box
                        sx={{
                          fontSize: "2.75rem",
                          fontWeight: "500",
                          marginY: "2rem",
                          paddingY: "1.5rem"
                        }}
                      >
                        Welcome back!
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
                              aria-label="password"
                              label="Password"
                              type="password"
                              inputProps={{ minLength: 6 }}
                              name="password"
                              required
                            />
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
                            Login
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

    // <Grid container justifyContent="center">
    //   <Box>
    //     <Grid container item>
    //       <Typography>Don't have an account?</Typography>
    //       <Button onClick={() => history.push("/register")}>Register</Button>
    //     </Grid>
    //     <form onSubmit={handleLogin}>
    //       <Grid>
    //         <Grid>
    //           <FormControl margin="normal" required>
    //             <TextField aria-label="username" label="Username" name="username" type="text" />
    //           </FormControl>
    //         </Grid>
    //         <FormControl margin="normal" required>
    //           <TextField label="password" aria-label="password" type="password" name="password" />
    //         </FormControl>
    //         <Grid>
    //           <Button type="submit" variant="contained" size="large">
    //             Login
    //           </Button>
    //         </Grid>
    //       </Grid>
    //     </form>
    //   </Box>
    // </Grid>
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
