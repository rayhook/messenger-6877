import { useContext, useEffect } from "react";
import { ActiveChatContext } from "../context/ActiveChatContext";
import { axiosInstance } from "../API/axiosConfig";
import { getErrorMessage, reportError } from "../utils/catchError";

const useGetNewMessages = () => {
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);

  const getNewMessages = async () => {
    const reqData = {
      conversationId: activeChat.conversationId,
      lastMessageId: activeChat.lastMessageId,
      lastConversationId: activeChat.lastConversationId
    };

    try {
      const response = await axiosInstance.get("/messages/check-new/", { params: reqData });
      const last_message_id = response.data.last_message_id;
      const last_conversation_id = response.data.last_conversation_id;
      const newMessages = response.data.new_messages;
      const newConversation = response.data.new_conversations;

      if (newConversation && newConversation.length > 0) {
        setActiveChat((prevState) => ({
          ...prevState,
          conversations: [...prevState.conversations, ...(newConversation || [])],
          messages: [...(prevState.messages || []), ...(newMessages || [])],
          lastMessageId: last_message_id,
          lastConversationId: last_conversation_id
        }));
      } else if (newMessages && newMessages.length > 0) {
        setActiveChat((prevState) => ({
          ...prevState,
          messages: [...(prevState.messages || []), ...(newMessages || [])],
          lastMessageId: last_message_id
        }));
      }
    } catch (error) {
      reportError({
        customMessage: "Error fetching new messages",
        message: getErrorMessage(error)
      });
    }
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    intervalId = setInterval(() => getNewMessages(), 7000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeChat.conversationId, activeChat.lastMessageId, activeChat.lastConversationId]);

  return { getNewMessages };
};

export default useGetNewMessages;
