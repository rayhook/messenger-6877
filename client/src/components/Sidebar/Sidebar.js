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

const Sidebar = ({ handleChange, filteredConversations }) => {
  const classes = useStyles();
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);

  console.log("Sidebar/filteredConversations ", filteredConversations);

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />

      {filteredConversations.map((convo) => (
        <Chat
          key={convo.username}
          username={convo.username}
          convoId={convo.id}
          email={convo.email}
        ></Chat>
      ))}
    </Box>
  );
};

export default Sidebar;
