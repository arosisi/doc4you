import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { MdKeyboardBackspace } from "react-icons/md";

import Registration from "./registration/Registration";
import Login from "./login/Login";
import AvailabilityForm from "./AvailabilityForm";
import SelectionForm from "./SelectionForm";
import withConsumer from "../withConsumer";
import strings from "../strings";

class Panel extends React.Component {
  state = {
    isRegistering: false,
    isLoggingIn: false,
    isUsingAnonymously: true
  };

  render() {
    const { isRegistering, isLoggingIn, isUsingAnonymously } = this.state;
    const {
      context,
      connected,
      role,
      coords,
      messageSelected,
      onSelectTimeSlot
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
                this.setState({
                  isRegistering: true,
                  isLoggingIn: false,
                  isUsingAnonymously: false
                })
              }
            >
              Register
            </Button>
          )}
          {!isLoggedIn && (
            <Button
              variant='outline-success'
              onClick={() =>
                this.setState({
                  isLoggingIn: true,
                  isRegistering: false,
                  isUsingAnonymously: false
                })
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
                context.logOut();
                this.setState({
                  isRegistering: false,
                  isLoggingIn: false,
                  isUsingAnonymously: true
                });
              }}
            >
              Log Out
            </Button>
          )}
        </Row>
        {!isRegistering && !isLoggingIn && !isLoggedIn && (
          <p style={{ marginLeft: 15, color: "#28a745" }}>
            You are using this application as guest.
          </p>
        )}
        {(isRegistering || isLoggingIn) && !isLoggedIn && (
          <p style={{ marginLeft: 15, color: "#28a745" }}>
            <MdKeyboardBackspace
              style={{ fontSize: 18, cursor: "pointer" }}
              onClick={() =>
                this.setState({
                  isRegistering: false,
                  isLoggingIn: false,
                  isUsingAnonymously: true
                })
              }
            />{" "}
            Go back to using as guest
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
        {(isLoggedIn || isUsingAnonymously) && role === strings.DOCTOR && (
          <AvailabilityForm connected={connected} coords={coords} />
        )}
        {(isLoggedIn || isUsingAnonymously) && role === strings.PATIENT && (
          <SelectionForm
            message={messageSelected}
            onSelect={onSelectTimeSlot}
          />
        )}
      </Container>
    );
  }
}

export default withConsumer(Panel);
