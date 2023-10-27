import React, { createContext, useState } from "react";

const ActiveChatContext = createContext(undefined);

function ActiveChatProvider({ children }) {
  const [activeChat, setActiveChat] = useState({
    userId: null,
    username: null,
    messages: [],
    conversationId: null
  });

  return (
    <ActiveChatContext.Provider value={{ activeChat, setActiveChat }}>
      {children}
    </ActiveChatContext.Provider>
  );
}

export { ActiveChatProvider, ActiveChatContext };