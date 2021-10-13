import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        if (message.senderId === userId) {
          if (message.attachments) {
            return (
              <SenderBubble
                key={message.id}
                text={message.text}
                time={time}
                attachments={message.attachments}
              />
            );
          } else {
            return <SenderBubble key={message.id} text={message.text} time={time} attachments="" />;
          }
        } else {
          if (message.attachments) {
            return (
              <OtherUserBubble
                key={message.id}
                text={message.text}
                attachments={message.attachments}
                time={time}
                otherUser={otherUser}
              />
            );
          } else {
            return (
              <OtherUserBubble
                key={message.id}
                text={message.text}
                time={time}
                otherUser={otherUser}
                attachments=""
              />
            );
          }
        }
      })}
    </Box>
  );
};

export default Messages;
