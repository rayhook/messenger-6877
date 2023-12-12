import React, { createContext, useState } from "react";

const ActiveChatContext = createContext(undefined);

function ActiveChatProvider({ children }) {
  const [activeChat, setActiveChat] = useState({
    username: null,
    conversations: [],
    newContacts: [],
    conversationId: null,
    messages: [],
    users: [],
    user2: null,
    lastMessageId: null
  });

  return (
    <ActiveChatContext.Provider value={{ activeChat, setActiveChat }}>
      {children}
    </ActiveChatContext.Provider>
  );
}

export { ActiveChatProvider, ActiveChatContext };
