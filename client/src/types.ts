import { ReactNode } from "react";
export interface Classes {
  [key: string]: string;
}

export interface UserDataType {
  username: string;
  email: string;
  password?: string;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface ConversationType {
  id: string;
  with_user: string;
  created_timestamp: string;
}

export interface ActiveChatState {
  username: null | string;
  conversations: ConversationType[];
  newContacts: []; // define types here
  conversationId: null; // define types here
  messages: []; // define types here
  users: []; // define types here
  user2: null; // define types here
  lastMessageId: null;
  lastConversationId: null;
}
