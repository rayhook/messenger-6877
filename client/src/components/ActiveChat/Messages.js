import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { ActiveChatContext } from "../../context/activeChat";

const Messages = (props) => {
  // const { messages } = props;

  const { activeChat } = useContext(ActiveChatContext);

  return (
    <Box>
      {activeChat.messages &&
        activeChat.messages.map((message) => {
          const time = moment(message.timestamp).format("h:mm");
          // return message.user_id === userId ? (
          //   <SenderBubble
          //     key={message.id}
          //     text={message.text}
          //     time={time}
          //     attachments={message.attachments}
          //   />
          // ) : (
          //   <OtherUserBubble
          //     key={message.id}
          //     text={message.text}
          //     time={time}
          //     otherUser={otherUser}
          //     attachments={message.attachments}
          //   />
          // );
          return <SenderBubble key={message.id} text={message.text} time={time} />;
        })}
    </Box>
  );
};

export default Messages;
