import { useContext } from "react";
import { axiosInstance } from "../API/axiosConfig";
import { ActiveChatContext } from "../context/ActiveChatContext";

const useFetchSearchResults = (searchTerm) => {
  const { setActiveChat } = useContext(ActiveChatContext);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`search/?search=${searchTerm}`);
      setActiveChat((prevState) => ({
        ...prevState,
        username: response.data.username,
        conversations: response.data.conversation_list,
        newContacts: response.data.new_contacts,
        lastConversationId: response.data.last_conversation_id
      }));
    } catch (error) {
      console.error("Error fetching conversations", error.message);
    }
  };
  return fetchData;
};

export default useFetchSearchResults;
