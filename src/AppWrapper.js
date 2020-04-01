import React from "react";
import { BrowserRouter } from "react-router-dom";

import AppProvider from "./AppProvider";
import App from "./App";

class AppWrapper extends React.Component {
  render() {
    return (
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    );
  }
}

export default AppWrapper;
