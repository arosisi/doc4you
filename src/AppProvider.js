import React from "react";

import AppContext from "./AppContext";

class AppProvider extends React.Component {
  state = {
    user: null,
    logIn: user => this.setState({ user }),
    logOut: () => this.setState({ user: null })
  };

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
