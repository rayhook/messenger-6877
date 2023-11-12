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

const Sidebar = ({ handleChange, filteredConversations, conversations }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />

      {conversations.map((convo) => {
        if (convo.type === "conversation") {
          console.log("convo.other_user", convo.other_user);
          return <Chat key={convo.id} otherUser={convo.other_user}></Chat>;
        } else {
          return <Chat key={convo.id} userId={convo.id} otherUser={convo.other_user}></Chat>;
        }
      })}
    </Box>
  );
};

export default Sidebar;
