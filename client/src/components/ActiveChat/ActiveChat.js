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

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user } = props;
  const { activeChat } = useContext(ActiveChatContext);

  useEffect(() => {
    const fetchLastMessages = async () => {
      const lastMessageId = activeChat.lastMessageId;
      const reqData = { conversationID: activeChat.conversationID, lastMessageId };
      axiosInstance.get("/messages/last", { params: reqData });
    };
    setInterval(() => fetchLastMessages(), 5000);
  }, []);

  return (
    <Box className={classes.root}>
      {activeChat && (
        <>
          <Header username={activeChat.username} online={true} />
          <Box className={classes.chatContainer}>
            <Messages
            // messages={activeChat.messages}
            // otherUser={conversation.otherUser}
            // userId={user.id}
            />
            <Input
              className={classes.inputContainer}
              otheruser={activeChat.username}
              // conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
