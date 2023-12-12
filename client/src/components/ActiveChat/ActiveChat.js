import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { ActiveChatContext } from "../../context/ActiveChatContext";
import useGetNewMessages from "../../hooks/useGetNewMessages";

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
  const { activeChat } = useContext(ActiveChatContext);

  useGetNewMessages();

  return (
    <Box className={classes.root}>
      {activeChat.conversationId && (
        <>
          <Header username={activeChat.user2} online={true} />
          <Box className={classes.chatContainer}>
            <Messages />
            <Input className={classes.inputContainer} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
