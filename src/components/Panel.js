import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Registration from "./registration/Registration";
import Login from "./login/Login";
import AvailabilityForm from "./AvailabilityForm";
import SelectionForm from "./SelectionForm";
import strings from "../strings";
import privateInfo from "../privateInfo";

class Panel extends React.Component {
  state = {
    isRegistering: false,
    isLoggingIn: false
  };

  logOut = () => {
    fetch(privateInfo[process.env.NODE_ENV].users_api_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "log out" }),
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          console.log("Cookie cleared!");
        }
      })
      .catch(error => console.log("Unable to connect to API users.", error));
  };

  render() {
    const { isRegistering, isLoggingIn } = this.state;
    const {
      context,
      connected,
      role,
      coords,
      messageSelected,
      onSubmitTimeSlot,
      onLogOut
    } = this.props;
    const isLoggedIn = !!context.user;
    return (
      <Container fluid={true}>
        <Row style={{ margin: 15 }}>
          {!isLoggedIn && (
            <Button
              variant='outline-success'
              style={{ marginRight: 10 }}
              onClick={() =>
                this.setState({ isRegistering: true, isLoggingIn: false })
              }
            >
              Register
            </Button>
          )}
          {!isLoggedIn && (
            <Button
              variant='outline-success'
              onClick={() =>
                this.setState({ isLoggingIn: true, isRegistering: false })
              }
            >
              Log In
            </Button>
          )}
          {isLoggedIn && (
            <Button
              variant='outline-success'
              style={{ marginRight: 10 }}
              onClick={() => {
                // TODO
              }}
            >
              Profile
            </Button>
          )}
          {isLoggedIn && (
            <Button
              variant='outline-success'
              onClick={() => {
                this.logOut(); // clear cookie
                context.logOut(); // remove user
                onLogOut(); // remove message selection
                this.setState({ isRegistering: false, isLoggingIn: false });
              }}
            >
              Log Out
            </Button>
          )}
        </Row>
        {!isLoggedIn && (
          <p style={{ marginLeft: 15, color: "#28a745" }}>
            You need to log in to use the application.
          </p>
        )}
        {isLoggedIn && (
          <p style={{ marginLeft: 15, color: "#28a745" }}>
            Hello {context.user.firstName}!
          </p>
        )}
        {isRegistering && !isLoggedIn && (
          <Registration role={role} logInUser={this.logInUser} />
        )}
        {isLoggingIn && !isLoggedIn && (
          <Login role={role} logInUser={this.logInUser} />
        )}
        {isLoggedIn && role === strings.DOCTOR && (
          <AvailabilityForm
            context={context}
            connected={connected}
            coords={coords}
          />
        )}
        {isLoggedIn && role === strings.PATIENT && (
          <SelectionForm
            context={context}
            connected={connected}
            message={messageSelected}
            onSubmit={onSubmitTimeSlot}
          />
        )}
      </Container>
    );
  }
}

export default Panel;
