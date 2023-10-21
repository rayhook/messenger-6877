import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { ActiveChatContext } from "../../context/activeChat";

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
  const conversation = props.conversation || {};

  console.log("activeChat from cotext in Activechat.js: ", activeChat);

  return (
    <Box className={classes.root}>
      {activeChat && (
        <>
          <Header username={activeChat.username} online={true} />
          <Box className={classes.chatContainer}>
            {/* <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
            /> */}
            <Input
              className={classes.inputContainer}
              otheruser={activeChat.username}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

export default connect(mapStateToProps, null)(ActiveChat);
