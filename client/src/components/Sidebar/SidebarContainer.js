import React, { useState, useEffect, useContext } from "react";
import { Sidebar } from "./index";
import { axiosInstance } from "../../API/axiosConfig";
import { ActiveChatContext } from "../../context/activeChat";
import useFilteredConversations from "../../hooks/useFilteredConversations.js";

const SidebarContainer = (props) => {
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("conversations/");
        const conversations = response.data.conversations;
        setActiveChat((prevState) => ({ ...prevState, conversations: conversations }));
        console.log("SidebarContainer/activeChat.conversations? ", activeChat.conversations);
      } catch (error) {
        console.error("Error fetching conversations", error.message);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredConversations = useFilteredConversations(
    searchTerm,
    activeChat.conversations,
    activeChat.users
  );

  console.log("Sidebar/filteredConversations?", filteredConversations);

  if (!activeChat.conversations) {
    return <>Loading</>;
  }

  // if (activeChat.conversations.length === 0) {
  //   return <>No conversations</>;
  // }

  if (isLoading) {
    return <>Loading...</>;
  }

  return <Sidebar handleChange={handleChange} filteredConversations={filteredConversations} />;
};

export default SidebarContainer;
