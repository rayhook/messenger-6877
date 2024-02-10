import React, { createContext, useState } from "react";
import { ProviderProps, ActiveChatState } from "../types";

interface ActiveChatContextType {
  activeChat: ActiveChatState;
  setActiveChat: React.Dispatch<React.SetStateAction<ActiveChatState>>;
}

const defaultActiveChatState: ActiveChatContextType = {
  activeChat: {
    username: null,
    conversations: [],
    newContacts: [],
    conversationId: null,
    messages: [],
    users: [],
    user2: null,
    lastMessageId: null,
    lastConversationId: null
  },
  setActiveChat: () => {}
};

const ActiveChatContext = createContext<ActiveChatContextType>(defaultActiveChatState);

function ActiveChatProvider({ children }: ProviderProps) {
  const [activeChat, setActiveChat] = useState(defaultActiveChatState.activeChat);

  return (
    <ActiveChatContext.Provider value={{ activeChat, setActiveChat }}>
      {children}
    </ActiveChatContext.Provider>
  );
}

export { ActiveChatProvider, ActiveChatContext };
