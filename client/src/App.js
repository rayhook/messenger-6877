import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import { theme } from "./themes/theme";
import Routes from "./routes";
import { ActiveChatProvider } from "./context/activeChat";

function App() {
  return (
    <ActiveChatProvider>
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </MuiThemeProvider>
      </Provider>
    </ActiveChatProvider>
  );
}

export default App;
