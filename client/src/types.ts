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
