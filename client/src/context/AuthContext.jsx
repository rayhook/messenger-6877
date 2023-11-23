// import axios from "axios";
// import { createContext, useState } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({ isLoggedIn: false });

//   const login = async (user, userData) => {
//     const API_URL = "http://127.0.0.1:8000/messenger/";

//     try {
//       const response = await axios.post(API_URL + "login/", userData);

//       localStorage.setItem("refresh", response.data.refresh);
//       localStorage.setItem("access", response.data.access);

//       setActiveChat((prevActiveChat) => ({ ...prevActiveChat, userId: response.data.userId }));

//       setIsLoggedIn(true);
//     } catch (err) {
//       console.error(err.message);
//     }
//     setAuth((prevState) => ({ ...prevState, isLoggedIn: true }));
//   };

//   const logout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     setAuth((prevState) => ({ ...prevState, isLoggedIn: false }));
//   };

//   return <AuthContext.Provider value={{ login, logout, auth }}>{children}</AuthContext.Provider>;
// };
