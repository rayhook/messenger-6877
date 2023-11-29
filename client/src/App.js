import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";

import { theme } from "./themes/theme";
import Routes from "./routes";
import { ActiveChatProvider } from "./context/activeChat";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <ActiveChatProvider>
      <AuthProvider>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </MuiThemeProvider>
      </AuthProvider>
    </ActiveChatProvider>
  );
}

export default App;
