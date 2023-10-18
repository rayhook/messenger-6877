import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";
import axios from "axios";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15
  }
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  // const conversations = props.conversations || [];
  const { handleChange, searchTerm } = props;

  const APIURL = "http://127.0.0.1:8000/messenger/";

  const axiosInstance = axios.create({
    baseURL: APIURL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access")}`
    }
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(APIURL + "api/token/refresh/", {
            refresh: localStorage.getItem("refresh")
          });
          if (res.status === 200) {
            localStorage.setItem("access", res.data.access);
            axiosInstance.defaults.headers["Authorization"] = `Bearer ${res.data.access}`;
            originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;
          }
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axiosInstance.get("users/");
        console.log("sidebar/response: ", response);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetcheding users", error.message);
      }
    }
    getUsers();
  }, []);

  const handleCreateConversation = async (userId) => {
    try {
      const response = await axiosInstance.post("/conversation/create", { userId });
      if (response.status === 200) {
      }
    } catch (error) {}
  };

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {users &&
        users.map((user) => (
          <div key={user.id} onClick={() => handleCreateConversation(user.id)}>
            {user.username}
          </div>
        ))}
      {/* {conversations
        .filter((conversation) => conversation.otherUser.username.includes(searchTerm))
        .map((conversation) => {
          return <Chat conversation={conversation} key={conversation.otherUser.username} />;
        })} */}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations
  };
};

export default connect(mapStateToProps)(Sidebar);
