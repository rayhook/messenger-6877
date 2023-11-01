import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";
import axios from "axios";
import { ActiveChatContext } from "../../context/activeChat";
import useFilteredConversations from "../../hooks/useFilteredConversations.js";
import useConversations from "../../hooks/useConversations.js";

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

  const { activeChat, setActiveChat } = useContext(ActiveChatContext);
  const { handleChange, searchTerm } = props;

  const { loading } = useConversations();

  const filteredConversations = useFilteredConversations(
    searchTerm,
    activeChat.conversations || [],
    activeChat.users
  );

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {loading ? (
        <>Loading conversations</>
      ) : (
        filteredConversations?.map((convo) => (
          <Chat key={convo.id} username={convo.username} convoId={convo.id}></Chat>
        ))
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations
  };
};

export default connect(mapStateToProps)(Sidebar);
