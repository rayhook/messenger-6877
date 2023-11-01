import { useState, useEffect, useContext } from "react";
import { axiosInstance } from "../API/axiosConfig";
import { ActiveChatContext } from "../context/activeChat";

const useConversations = () => {
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("conversations/");
        const conversations = response.data.conversations || [];
        console.log("useConversation called?", "conversations", conversations);
        setActiveChat({ ...activeChat, conversations: conversations });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching conversations", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading };
};

export default useConversations;
