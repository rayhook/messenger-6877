import React, { useState, useEffect, useContext } from "react";
import { Sidebar } from "./index";
import { axiosInstance } from "../../API/axiosConfig";
import { ActiveChatContext } from "../../context/activeChat";

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

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <Sidebar
      handleChange={handleChange}
      searchTerm={searchTerm}
      conversations={activeChat.conversations}
    />
  );
};

export default SidebarContainer;
