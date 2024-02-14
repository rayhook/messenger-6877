import { useState, useEffect, useContext } from "react";
import { axiosInstance } from "../API/axiosConfig";
import { ActiveChatContext } from "../context/ActiveChatContext";
import { getErrorMessage, reportError } from "../utils/catchError";

const useConversations = () => {
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("conversations/");
        const conversations = response.data.conversations || [];
        setActiveChat({ ...activeChat, conversations: conversations });
        setLoading(false);
      } catch (error) {
        reportError({
          customMessage: "Error fetching conversations",
          message: getErrorMessage(error)
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading };
};

export default useConversations;
