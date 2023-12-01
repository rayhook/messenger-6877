import { useContext, useEffect } from "react";
import { ActiveChatContext } from "../context/ActiveChatContext";
import { axiosInstance } from "../API/axiosConfig";

const useGetNewMessages = () => {
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);

  const getNewMessages = async () => {
    const reqData = {
      conversationId: activeChat.conversationId,
      lastMessageId: activeChat.lastMessageId
    };

    try {
      const response = await axiosInstance.get("/messages/check-new/", { params: reqData });
      const last_message_id = response.data.last_message_id;
      const newMessages = response.data.new_messages;

      if (newMessages && newMessages.length > 0) {
        setActiveChat((prevState) => ({
          ...prevState,
          messages: [...prevState.messages, ...newMessages],
          lastMessageId: last_message_id
        }));
      }
    } catch (error) {
      console.error("Error fetching new messages", error.message);
    }
  };

  useEffect(() => {
    let intervalId;
    if (activeChat.conversationId) {
      intervalId = setInterval(() => getNewMessages(), 500);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeChat.conversationId, activeChat.lastMessageId]);

  return { getNewMessages };
};

export default useGetNewMessages;
