import { useContext, useState } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
// import { setActiveChat } from "../../store/activeConversation";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  }
}));

const Chat = ({ id, otherUser, handleSelectChat }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root} onClick={() => handleSelectChat(id, otherUser)}>
      <BadgeAvatar username={otherUser} online="true" sidebar={true} />
      <ChatContent username={otherUser} />
    </Box>
  );
};

export default Chat;
