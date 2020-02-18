import React from "react";

import RoleSelectionBoard from "./RoleSelectionBoard";
import MainBoard from "./MainBoard";

class App extends React.Component {
  state = { role: "" };

  render() {
    const { role } = this.state;
    return !role ? (
      <RoleSelectionBoard setRole={role => this.setState({ role })} />
    ) : (
      <MainBoard role={role} />
    );
  }
}

export default App;
