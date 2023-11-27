import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { ActiveChatContext } from "../../context/activeChat";
import { axiosInstance } from "../../API/axiosConfig";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
    height: "75vh"
  },

  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
    height: "100%",
    overflowY: "scroll"
  },
  inputContainer: {
    display: "flex"
  }
}));

const ActiveChat = () => {
  const classes = useStyles();
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);

  const fetchLastMessages = async (convoId, lastMessage) => {
    const reqData = {
      conversationId: convoId,
      lastMessageId: lastMessage
    };
    const response = await axiosInstance.get("/update/messages/", { params: reqData });
    let newMessages = response.data.new_messages;
    let lastMessageId = response.data.last_message_id;
    if (newMessages && newMessages.length > 0) {
      setActiveChat((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, ...newMessages],
        lastMessageId
      }));
    }
  };

  useEffect(() => {
    let intervalId;
    if (activeChat.conversationId) {
      intervalId = setInterval(
        () => fetchLastMessages(activeChat.conversationId, activeChat.lastMessageId),
        6000
      );
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeChat.conversationId, activeChat.lastMessageId]);

  return (
    <Box className={classes.root}>
      {activeChat.conversationId && (
        <>
          <Header username={activeChat.username} online={true} />
          <Box className={classes.chatContainer}>
            <Messages />
            <Input className={classes.inputContainer} otheruser={activeChat.username} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
