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
        console.log("SidebarContainer/conversation_list ", conversations.conversation_list);
        console.log("SidebarContainer/new_contacts ", conversations.new_contacts);
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
      console.log("SidebarContainer/conversation_list ", conversations.conversation_list);
      console.log("SidebarContainer/new_contacts ", conversations.new_contacts);
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
    console.log("handleSelectChat triggered!");
    const prefix = id.slice(0, 4);
    const idValue = Number(id.slice(6));
    if (prefix === "conv") {
      try {
        console.log("handleSectioChar-convo", idValue);
        const requestData = { conversationId: idValue };
        const response = await axiosInstance.get("messages/", { params: requestData });
        const messages = response.data.messages;
        setActiveChat((prevState) => ({ ...prevState, conversationId: idValue, messages }));
      } catch (error) {
        console.error(`error fetching messages, ${error.message}`);
      }
    } else {
      console.log("handleSectioChar-newc_user");
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
