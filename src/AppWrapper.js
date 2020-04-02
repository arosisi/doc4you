import React from "react";
import { BrowserRouter } from "react-router-dom";

import AppProvider from "./AppProvider";
import AppRouter from "./AppRouter";

class AppWrapper extends React.Component {
  render() {
    return (
      <AppProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
    );
  }
}

export default AppWrapper;
