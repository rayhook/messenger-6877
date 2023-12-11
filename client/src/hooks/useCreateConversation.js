import { useContext } from "react";
import { axiosInstance } from "../API/axiosConfig";
import { ActiveChatContext } from "../context/ActiveChatContext";
import { AuthContext } from "../context/AuthContext";
const useCreateConversation = () => {
  const { setActiveChat } = useContext(ActiveChatContext);
  const { setAuth } = useContext(AuthContext);

  const createConversation = async (user2) => {
    try {
      const response = await axiosInstance.post("/conversations/", { user2 });
      const userId = response.data.user_id;
      const conversationId = response.data.conversation_id;
      setActiveChat((prevState) => ({ ...prevState, conversationId }));
      setAuth((prevState) => ({ ...prevState, userId: userId }));
    } catch (error) {
      console.error(`error creating conversation ${error.message}`);
    }
  };
  return createConversation;
};

export default useCreateConversation;
