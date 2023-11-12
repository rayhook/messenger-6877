import { useContext, useState } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
// import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { ActiveChatContext } from "../../context/activeChat";
import { axiosInstance } from "../../API/axiosConfig";

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

const Chat = ({ userId, otherUser }) => {
  const classes = useStyles();
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);

  const handleSelectConversation = async () => {
    try {
      const response = await axiosInstance.post("conversation/create", {
        userId
      });
      if (response.status === 201) {
        setActiveChat((prevState) => ({
          ...prevState,
          conversations: response.data.conversations,
          conversationId: response.data.conversation_id
        }));
      }
    } catch (error) {
      console.error("failed to create a conversation", error);
    }
  };

  return (
    <Box className={classes.root} onClick={handleSelectConversation}>
      <BadgeAvatar username={otherUser} online="true" sidebar={true} />
      <ChatContent username={otherUser} />
    </Box>
  );
};

export default Chat;
