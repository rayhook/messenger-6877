import { useContext } from "react";
import { axiosInstance } from "../API/axiosConfig";
import { ActiveChatContext } from "../context/ActiveChatContext";
import { AuthContext } from "../context/AuthContext";
import { getErrorMessage, reportError } from "../utils/catchError";

const useCreateConversation = () => {
  const { setActiveChat } = useContext(ActiveChatContext);
  const { setAuth } = useContext(AuthContext);

  const createConversation = async (user2: string, searchTerm: string) => {
    try {
      const response = await axiosInstance.post("/conversations/", {
        user2,
        query: searchTerm
      });
      const userId = response.data.user_id;
      const conversationId = response.data.conversation_id;
      setActiveChat((prevState) => ({
        ...prevState,
        conversationId: conversationId,
        conversations: response.data.conversations_list,
        newContacts: response.data.new_contacts,
        lastConversationId: response.data.last_conversation_id
      }));
      setAuth((prevState) => ({ ...prevState, userId: userId }));
    } catch (error) {
      reportError({
        customMessage: "Error creating conversation",
        message: getErrorMessage(error)
      });
    }
  };
  return createConversation;
};

export default useCreateConversation;
