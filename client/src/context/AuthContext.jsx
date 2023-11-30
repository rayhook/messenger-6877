import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ActiveChatContext } from "./ActiveChatContext";

export const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  auth: {
    isLoggedIn: false,
    userId: null
  },
  setAuth: () => {}
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: !!localStorage.getItem("access"), userId: null });
  const API_URL = "http://127.0.0.1:8000/messenger/";
  const { setActiveChat } = useContext(ActiveChatContext);

  useEffect(() => {
    const validateToken = async () => {
      const accessToekn = localStorage.getItem("access");
      if (!accessToekn) return;
      try {
        const response = await axios.post(API_URL + "api/token/validate/", {
          token: accessToekn
        });
        if (response.data.isValid) {
          setAuth({ isLoggedIn: true, userId: localStorage.getItem("userId") });
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

  const login = async (userData) => {
    try {
      const response = await axios.post(API_URL + "login/", userData);

      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("userId", response.data.userId);

      setAuth((prevState) => ({ ...prevState, isLoggedIn: true, userId: response.data.userId }));
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async () => {
    try {
      const tokenData = { refresh: localStorage.getItem("refresh") };
      await axios.post(API_URL + "logout/", tokenData);
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
        users: [],
        lastMessageId: null
      }));
    } catch (err) {
      console.error("Logout failed", err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, auth, setAuth }}>{children}</AuthContext.Provider>
  );
};
