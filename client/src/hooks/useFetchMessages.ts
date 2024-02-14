import { useContext } from "react";
import { axiosInstance } from "../API/axiosConfig";
import { ActiveChatContext } from "../context/ActiveChatContext";
import { AuthContext } from "../context/AuthContext";
import { getErrorMessage, reportError } from "../utils/catchError";

const useFetchMessages = () => {
  const { setActiveChat } = useContext(ActiveChatContext);
  const { setAuth } = useContext(AuthContext);

  const fetchMessages = async (conversaionId: number) => {
    try {
      const requestData = { conversationId: conversaionId };
      const response = await axiosInstance.get("messages/", { params: requestData });
      const messages = response.data.messages;
      const userId = response.data.user_id;
      const lastMessageId = response.data.last_message_id;
      setActiveChat((prevState) => ({
        ...prevState,
        conversationId: conversaionId,
        messages,
        lastMessageId
      }));
      setAuth((prevState) => ({ ...prevState, userId: userId }));
    } catch (error) {
      reportError({
        customMessage: "Error fetching messages",
        message: getErrorMessage(error)
      });
    }
  };

  return fetchMessages;
};

export default useFetchMessages;
