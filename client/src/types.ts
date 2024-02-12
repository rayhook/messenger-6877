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

export interface NewContactsType {
  id: number;
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

export interface SidebarProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  conversations: ConversationType[];
  newContacts: NewContactsType[];
  searchTerm: string;
  handleSelectChat: (id: string, user2: string) => Promise<void>;
}
