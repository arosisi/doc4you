import React from "react";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "./AppRouter";

class AppRouterWrapper extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    );
  }
}

export default AppRouterWrapper;
