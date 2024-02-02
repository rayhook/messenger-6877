import { useContext } from "react";
import { axiosInstance } from "../API/axiosConfig";
import { ActiveChatContext } from "../context/ActiveChatContext";
import { AuthContext } from "../context/AuthContext";
const useCreateConversation = () => {
  const { setActiveChat } = useContext(ActiveChatContext);
  const { setAuth } = useContext(AuthContext);

  const createConversation = async (user2, searchTerm) => {
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
      console.error(`error creating conversation ${error.message}`);
    }
  };
  return createConversation;
};

export default useCreateConversation;
