import React, { useEffect, useState, useContext, useCallback } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";
import axios from "axios";
import { ActiveChatContext } from "../../context/activeChat";
// import { setActiveChat } from "../../store/activeConversation.js";

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
  const [convoId, setConvoId] = useState();

  const { activeChat, setActiveChat } = useContext(ActiveChatContext);

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
    async function fetchConversations() {
      try {
        const response = await axiosInstance.get("conversations/");
        const conversations = response.data.conversations;
        setActiveChat({ ...activeChat, conversations: conversations });
      } catch (error) {
        console.error("Error fetching conversations", error.message);
      }
    }
    fetchConversations();
  }, []);

  const conversationIncludeSearch = (activeChat.conversations || []).filter((convo) =>
    convo.username.includes(searchTerm)
  );
  const map = new Map();
  for (let convo of conversationIncludeSearch) {
    map.set(convo.id);
  }
  const uverIncludeSearch = activeChat.users.filter(
    (user) => user.username.includes(searchTerm) && !map.has(user.id)
  );

  const conversationUserSearchCombined = conversationIncludeSearch.concat(uverIncludeSearch);

  console.log("Sidebar/conversationUserSearchCombined? ", conversationUserSearchCombined);
  console.log(
    "Sidebar/conversationIncludeSearch? ",
    conversationIncludeSearch,
    "Sidebar/uverIncludeSearch? ",
    uverIncludeSearch
  );

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {searchTerm !== ""
        ? conversationUserSearchCombined?.map((convo) => (
            <Chat key={convo.id} username={convo.username} convoId={convo.id}></Chat>
          ))
        : activeChat.conversations?.map((convo) => (
            <Chat key={convo.id} username={convo.username} convoId={convo.id}></Chat>
          ))}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations
  };
};

export default connect(mapStateToProps)(Sidebar);
