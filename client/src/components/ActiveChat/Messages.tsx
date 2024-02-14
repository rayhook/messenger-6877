import { useContext, useEffect, useRef } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from ".";
import moment from "moment";
import { ActiveChatContext } from "../../context/ActiveChatContext";
import { AuthContext } from "../../context/AuthContext";

const Messages = () => {
  const { activeChat } = useContext(ActiveChatContext);
  const { auth } = useContext(AuthContext);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat.messages]);

  return (
    <Box>
      {activeChat.messages &&
        activeChat.messages.map((message) => {
          const time = moment(message.created_timestamp).format("h:mm");
          if (message.user === auth.userId) {
            return <SenderBubble key={message.id} text={message.text} time={time} />;
          } else {
            return <OtherUserBubble key={message.id} text={message.text} time={time} />;
          }
        })}
      <div ref={lastMessageRef}></div>
    </Box>
  );
};

export default Messages;
