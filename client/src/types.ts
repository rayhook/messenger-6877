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

interface NewContactsType {
  id: string;
  with_user: string;
}

interface MessageType {
  id: number;
  conversation: number;
  user: number;
  text: string;
  created_timestamp: string;
}

export interface ActiveChatState {
  username: null | string;
  conversations: ConversationType[];
  newContacts: NewContactsType[];
  conversationId: null | number;
  messages: MessageType[] | null;
  user2: null | string;
  lastMessageId: null | number;
  lastConversationId: null | string;
}
