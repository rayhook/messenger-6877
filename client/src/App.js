import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";

import { theme } from "./themes/theme";
import Routes from "./routes";
import { ActiveChatProvider } from "./context/activeChat";

function App() {
  return (
    <ActiveChatProvider>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </MuiThemeProvider>
    </ActiveChatProvider>
  );
}

export default App;
