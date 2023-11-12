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
        const response = await axiosInstance.get(`search/?search=${searchTerm}`);
        const conversations = response.data.conversations_filtered;
        console.log("SidebarContainer/conversations? ", conversations);
        setActiveChat((prevState) => ({ ...prevState, conversations: conversations }));
      } catch (error) {
        console.error("Error fetching conversations", error.message);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [searchTerm]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (!activeChat.conversations) {
    return <>Loading</>;
  }

  // if (activeChat.conversations.length === 0) {
  //   return <>No conversations</>;
  // }

  if (isLoading) {
    return <>Loading...</>;
  }

  return <Sidebar handleChange={handleChange} conversations={activeChat.conversations} />;
};

export default SidebarContainer;
