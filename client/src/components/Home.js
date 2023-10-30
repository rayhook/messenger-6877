import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";
import axios from "axios";
import { axiosInstance } from "../API/axiosConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh"
  }
}));

const Home = (props) => {
  const classes = useStyles();
  // const { user, logout, fetchConversations } = props;
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axiosInstance.get("users/");
      console.log("routes/response.data.users? ", response.data.users);
      setUsers(response.data.users);
    };
    fetchUsers();
  }, []);

  const APIURL = "http://127.0.0.1:8000/messenger/";

  const handleLogout = async () => {
    try {
      const tokenData = { refresh: localStorage.getItem("refresh") };
      await axios.post(APIURL + "logout/", tokenData);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout failed", err.message);
    }
  };

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
