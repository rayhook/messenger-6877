import React, { useState, useEffect, useContext } from "react";
import { Sidebar } from "./index";
import { axiosInstance } from "../../API/axiosConfig";
import { ActiveChatContext } from "../../context/activeChat";
import axios from "axios";

const SidebarContainer = (props) => {
  const { activeChat, setActiveChat } = useContext(ActiveChatContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = async (event) => {
    setSearchTerm(event.target.value);
    try {
      const response = await axiosInstance.get(`search/?search=${event.target.value}`);
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

  const handleSelectChat = async (id, otherUser) => {
    const convoPrefix = id.slice(0, 4);
    const convoId = Number(id.slice(6));
    if (convoPrefix === "conv") {
      try {
        const requestData = { conversationId: convoId };
        const response = await axiosInstance.get("messages/", { params: requestData });
        const messages = response.data.messages;
        const userId = response.data.user_id;
        const lastMessageId = response.data.last_message_id;
        setActiveChat((prevState) => ({
          ...prevState,
          conversationId: convoId,
          messages,
          lastMessageId,
          userId
        }));
      } catch (error) {
        console.error(`error fetching messages, ${error.message}`);
      }
    } else {
      try {
        const response = await axiosInstance.post("/conversation/create", { otherUser });
        const conversationId = response.conversation_id;
        setActiveChat((prevState) => ({ ...prevState, conversationId }));
      } catch (error) {
        console.error(`error creating conversation ${error.message}`);
      }
    }
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

  return (
    <Sidebar
      handleChange={handleChange}
      conversations={activeChat.conversations}
      newContacts={activeChat.newContacts}
      searchTerm={searchTerm}
      handleSelectChat={handleSelectChat}
    />
  );
};

export default SidebarContainer;
