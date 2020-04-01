import React from "react";
import { Route, Switch } from "react-router-dom";

import RoleSelectionBoard from "./components/RoleSelectionBoard";
import MainBoard from "./components/MainBoard";
import strings from "./strings";

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={RoleSelectionBoard} />
        <Route
          path='/doctor'
          render={props => <MainBoard {...props} role={strings.DOCTOR} />}
        />
        <Route
          path='/patient'
          render={props => <MainBoard {...props} role={strings.PATIENT} />}
        />
      </Switch>
    );
  }
}

export default App;
