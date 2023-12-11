import React, { useState, useEffect, useContext } from "react";
import { Sidebar } from "./index";
import { ActiveChatContext } from "../../context/ActiveChatContext";
import useFetchSearchResults from "../../hooks/useFetchSearchResults";
import useFetchMessages from "../../hooks/useFetchMessages";
import useCreateConversation from "../../hooks/useCreateConversation";

const SidebarContainer = () => {
  const { activeChat } = useContext(ActiveChatContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fetchSearchResults = useFetchSearchResults(searchTerm);
  const fetchMessages = useFetchMessages();
  const createConversation = useCreateConversation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      fetchSearchResults();
      setIsLoading(false);
    };
    fetchData();
  }, [searchTerm]);

  const handleChange = async (event) => {
    setSearchTerm(event.target.value);
    fetchSearchResults();
  };

  const handleSelectChat = async (id, user2) => {
    const convoPrefix = id.slice(0, 4);
    const conversaionId = Number(id.slice(6));
    if (convoPrefix === "conv") {
      fetchMessages(conversaionId);
    } else {
      createConversation(user2);
    }
  };

  if (!activeChat.conversations || isLoading) {
    return <>Loading</>;
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
