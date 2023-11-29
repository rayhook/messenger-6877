import axios from "axios";
import { createContext, useContext, useState } from "react";
import { ActiveChatContext } from "./activeChat";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: false });
  const { setActiveChat } = useContext(ActiveChatContext);

  const API_URL = "http://127.0.0.1:8000/messenger/";
  const login = async (userData) => {
    try {
      const response = await axios.post(API_URL + "login/", userData);

      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("access", response.data.access);

      setActiveChat((prevState) => ({ ...prevState, userId: response.data.userId }));
      setAuth((prevState) => ({ ...prevState, isLoggedIn: true }));
    } catch (err) {
      console.error(err.message);
    }
    setAuth((prevState) => ({ ...prevState, isLoggedIn: true }));
  };

  const logout = async () => {
    try {
      const tokenData = { refresh: localStorage.getItem("refresh") };
      await axios.post(API_URL + "logout/", tokenData);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setAuth((prevState) => ({ ...prevState, isLoggedIn: false }));
    } catch (err) {
      console.error("Logout failed", err.message);
    }
  };

  return <AuthContext.Provider value={{ login, logout, auth }}>{children}</AuthContext.Provider>;
};
