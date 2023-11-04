import React, { useContext, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Search, Chat, CurrentUser } from "./index.js";
import { ActiveChatContext } from "../../context/activeChat";

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

const Sidebar = ({ searchTerm, handleChange, conversations }) => {
  const classes = useStyles();

  console.log("Sidebar/conversations ", conversations);

  // const filteredConversations = useFilteredConversations(
  //   searchTerm,
  //   conversations,
  //   activeChat.users
  // );

  if (!conversations) {
    return <>Loading</>;
  }

  if (conversations.length === 0) {
    return <>No conversations</>;
  }

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />

      {conversations.map((convo) => (
        <Chat
          key={convo.username || convo.id}
          username={convo.username}
          convoId={convo.id}
          email={convo.email}
        ></Chat>
      ))}
    </Box>
  );
};

export default Sidebar;
