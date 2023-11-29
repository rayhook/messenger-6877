import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: false, userId: null });
  const API_URL = "http://127.0.0.1:8000/messenger/";

  const login = async (userData) => {
    try {
      const response = await axios.post(API_URL + "login/", userData);

      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("access", response.data.access);

      setAuth((prevState) => ({ ...prevState, isLoggedIn: true, userId: response.data.userId }));
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
      setAuth((prevState) => ({ ...prevState, isLoggedIn: false, userId: null }));
    } catch (err) {
      console.error("Logout failed", err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, auth, setAuth }}>{children}</AuthContext.Provider>
  );
};
