import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { ActiveChatContext } from "../../context/ActiveChatContext";
import { AuthContext } from "../../context/AuthContext";

const Messages = () => {
  const { activeChat } = useContext(ActiveChatContext);
  const { auth } = useContext(AuthContext);
  return (
    <Box>
      {activeChat.messages &&
        activeChat.messages.map((message) => {
          const time = moment(message.timestamp).format("h:mm");
          if (message.user_id === auth.userId) {
            return <SenderBubble key={message.id} text={message.text} time={time} />;
          } else {
            return <OtherUserBubble key={message.id} text={message.text} time={time} />;
          }
        })}
    </Box>
  );
};

export default Messages;
