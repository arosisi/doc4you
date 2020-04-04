import React from "react";
import { Route, Switch } from "react-router-dom";

import RoleSelector from "./components/RoleSelector";
import AppProviderWrapper from "./AppProviderWrapper";
import strings from "./strings";

class AppRouter extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={RoleSelector} />
        <Route
          path='/doctor'
          render={props => (
            <AppProviderWrapper {...props} role={strings.DOCTOR} />
          )}
        />
        <Route
          path='/patient'
          render={props => (
            <AppProviderWrapper {...props} role={strings.PATIENT} />
          )}
        />
      </Switch>
    );
  }
}

export default AppRouter;
