import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import strings from "./strings";
import privateInfo from "./privateInfo";

class RegistrationForm extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    emailAddress: "",
    isSubmitting: false,
    showAlert: false
  };

  isFormComplete = () => {
    const {
      firstName,
      lastName,
      address,
      phoneNumber,
      emailAddress
    } = this.state;
    const { role } = this.props;
    return (
      (role === strings.DOCTOR &&
        firstName &&
        lastName &&
        address &&
        phoneNumber &&
        emailAddress) ||
      (role === strings.PATIENT && firstName && lastName && emailAddress)
    );
  };

  submit = event => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      address,
      phoneNumber,
      emailAddress
    } = this.state;
    const { role, onSubmit } = this.props;
    this.setState({ isSubmitting: true }, () =>
      fetch(privateInfo.users_api_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          address,
          phoneNumber,
          emailAddress,
          role,
          action: "register"
        })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            onSubmit(emailAddress);
          } else {
            this.setState({
              isSubmitting: false,
              showAlert: true
            });
          }
        })
        .catch(error => console.log("Unable to connect to API users.", error))
    );
  };

  render() {
    const {
      firstName,
      lastName,
      address,
      phoneNumber,
      emailAddress,
      isSubmitting,
      showAlert
    } = this.state;
    const { role } = this.props;
    return (
      <Container style={{ margin: "20px 0" }}>
        <Form onSubmit={this.submit}>
          <Form.Row>
            <Form.Group controlId='firstName' as={Col}>
              <Form.Label>First name</Form.Label>
              <Form.Control
                value={firstName}
                onChange={event =>
                  this.setState({ firstName: event.currentTarget.value })
                }
              />
            </Form.Group>
            <Form.Group controlId='lastName' as={Col}>
              <Form.Label>Last name</Form.Label>
              <Form.Control
                value={lastName}
                onChange={event =>
                  this.setState({ lastName: event.currentTarget.value })
                }
              />
            </Form.Group>
          </Form.Row>

          {role === strings.DOCTOR && (
            <Form.Group controlId='address'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={address}
                onChange={event =>
                  this.setState({ address: event.currentTarget.value })
                }
              />
            </Form.Group>
          )}

          {role === strings.DOCTOR && (
            <Form.Group controlId='phoneNumber'>
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                value={phoneNumber}
                onChange={event =>
                  this.setState({ phoneNumber: event.currentTarget.value })
                }
              />
              <Form.Text className='text-muted'>
                Patients may call this number to book an appointment.
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group controlId='emailAddress'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              value={emailAddress}
              isInvalid={showAlert}
              onChange={event =>
                this.setState({
                  emailAddress: event.currentTarget.value,
                  showAlert: false
                })
              }
            />
            <Form.Text className='text-muted'>
              You will receive an email with the verification code.
            </Form.Text>
          </Form.Group>

          {!isSubmitting ? (
            <Button
              variant='primary'
              type='submit'
              disabled={!this.isFormComplete()}
            >
              Submit
            </Button>
          ) : (
            <Spinner animation='border' variant='primary' />
          )}

          {showAlert && (
            <Alert
              variant='danger'
              style={{ margin: "20px 0" }}
              dismissible
              onClose={() => this.setState({ showAlert: false })}
            >
              Email address has already been used.
            </Alert>
          )}
        </Form>
      </Container>
    );
  }
}

export default RegistrationForm;
