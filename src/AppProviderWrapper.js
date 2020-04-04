import React from "react";

import App from "./App";
import AppProvider from "./AppProvider";

class AppProviderWrapper extends React.Component {
  render() {
    const { role } = this.props;
    return (
      <AppProvider>
        <App role={role} />
      </AppProvider>
    );
  }
}

export default AppProviderWrapper;
