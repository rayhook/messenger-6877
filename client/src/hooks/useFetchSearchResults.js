import { useContext } from "react";
import { axiosInstance } from "../API/axiosConfig";
import { ActiveChatContext } from "../context/ActiveChatContext";

const useFetchSearchResults = (searchTerm) => {
  const { setActiveChat } = useContext(ActiveChatContext);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`search/?search=${searchTerm}`);
      const conversations = response.data;
      setActiveChat((prevState) => ({
        ...prevState,
        conversations: conversations.conversation_list,
        newContacts: conversations.new_contacts
      }));
    } catch (error) {
      console.error("Error fetching conversations", error.message);
    }
  };
  return fetchData;
};

export default useFetchSearchResults;
