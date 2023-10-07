import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
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

const Sidebar = (props) => {
  const classes = useStyles();
  const conversations = props.conversations || [];
  const { handleChange, searchTerm } = props;

  const [socketUrl] = useState("ws://127.0.0.1:8000/ws/conversation/12/");
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback(
    () => sendMessage(JSON.stringify({ message: "Hello" })),
    []
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState];
  return (
    <Box className={classes.root}>
      <CurrentUser />
      <button onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
        Click Me to send 'Hello'
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {conversations
        .filter((conversation) => conversation.otherUser.username.includes(searchTerm))
        .map((conversation) => {
          return <Chat conversation={conversation} key={conversation.otherUser.username} />;
        })}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations
  };
};

export default connect(mapStateToProps)(Sidebar);
