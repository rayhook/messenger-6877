import { useContext, useState } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
// import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import axios from "axios";

import { ActiveChatContext } from "../../context/activeChat";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  }
}));

const Chat = ({ username }) => {
  const classes = useStyles();
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);

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

  const handleCreateConversation = async () => {
    try {
      const response = await axiosInstance.post("/conversation/create", { username });
      if (response.status === 201) {
        setActiveChat({
          ...activeChat,
          username,
          conversationId: response.data.conversation_id
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = async (conversation) => {
    // await props.setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box className={classes.root} onClick={handleCreateConversation}>
      <BadgeAvatar username={username} online="true" sidebar={true} />
      <ChatContent username={username} />
    </Box>
  );
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setActiveChat: (id) => {
//       dispatch(setActiveChat(id));
//     }
//   };
// };

// export default connect(null, mapDispatchToProps)(Chat);

export default Chat;
