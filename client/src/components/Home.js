import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import axios from "axios";
import { axiosInstance } from "../API/axiosConfig";
import { ActiveChatContext } from "../context/activeChat";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh"
  }
}));

const Home = (props) => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axiosInstance.get("users/");
      console.log("routes/response.data.users? ", response.data.users);
      setActiveChat((prevActiveChat) => ({ ...prevActiveChat, users: response.data.users }));
      console.log("Home/Conversations ", activeChat.conversations);
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

export default Home;
