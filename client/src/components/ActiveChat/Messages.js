import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { ActiveChatContext } from "../../context/activeChat";

const Messages = (props) => {
  // const { messages } = props;

  const { activeChat } = useContext(ActiveChatContext);
  console.log("activeChat.messages", activeChat.messages);
  console.log("activeChat.userId", activeChat.userId);
  return (
    <Box>
      {activeChat.messages &&
        activeChat.messages.map((message) => {
          const time = moment(message.timestamp).format("h:mm");
          console.log("message.user_Id", message.user_id);
          if (message.user_id === activeChat.userId) {
            return <SenderBubble key={message.id} text={message.text} time={time} />;
          } else {
            return <OtherUserBubble key={message.id} text={message.text} time={time} />;
          }
        })}
    </Box>
  );
};

export default Messages;
