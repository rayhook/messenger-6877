import React, { useContext, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Search, Chat, CurrentUser } from "./index.js";

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

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />

      {filteredConversations.map((convo) => (
        <Chat
          key={convo.id}
          convouser={convo.user}
          userId={convo.id}
          convoId={convo.id}
          username={convo.username}
          otherUser={convo.otheruser}
        ></Chat>
      ))}
    </Box>
  );
};

export default Sidebar;
