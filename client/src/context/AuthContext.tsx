import { createContext, useContext, useEffect, useState, SetStateAction, Dispatch } from "react";
import axios from "axios";
import { ActiveChatContext } from "./ActiveChatContext";
import { UserDataType, ProviderProps } from "../types";

interface AuthContextType {
  login: (userData: UserDataType) => Promise<void>;
  logout: () => Promise<void>;
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
  signup: (userData: UserDataType) => Promise<void>;
}

interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
}

export const AuthContext = createContext<AuthContextType>({
  login: async () => {},
  logout: async () => {},
  auth: {
    isLoggedIn: false,
    userId: null
  },
  setAuth: () => {},
  signup: async () => {}
});

export const AuthProvider = ({ children }: ProviderProps) => {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: !!localStorage.getItem("access"),
    userId: null
  });
  const { setActiveChat } = useContext(ActiveChatContext);

  useEffect(() => {
    const validateToken = async () => {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) return;
      try {
        const response = await axios.post(process.env.REACT_APP_API_URL + "api/token/validate/", {
          token: accessToken
        });
        if (response.data.isValid) {
          setAuth({ isLoggedIn: true, userId: Number(localStorage.getItem("userId")) });
        } else {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("userId");
          setAuth({ isLoggedIn: false, userId: null });
        }
      } catch (error) {
        console.error("Token validation error", error);
      }
    };
    validateToken();
  }, []);

  const login = async (userData: UserDataType) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + "login/", userData);

      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("userId", response.data.userId);

      setAuth((prevState) => ({ ...prevState, isLoggedIn: true, userId: response.data.userId }));
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      console.error(message);
    }
  };

  const signup = async (userData: UserDataType) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + "register/", userData);
      if (response.status === 201) {
        login(userData);
      } else {
        console.error("Register failed", response.statusText);
      }
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      console.error(message);
    }
  };

  const logout = async () => {
    try {
      const tokenData = { refresh: localStorage.getItem("refresh") };
      await axios.post(process.env.REACT_APP_API_URL + "logout/", tokenData);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("userId");
      setAuth((prevState) => ({ ...prevState, isLoggedIn: false, userId: null }));
      setActiveChat((prevState) => ({
        ...prevState,
        username: null,
        conversations: [],
        newContacts: [],
        conversationId: null,
        messages: [],
        lastMessageId: null
      }));
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      console.error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, signup, auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
