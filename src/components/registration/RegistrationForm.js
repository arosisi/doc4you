import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { Formik } from "formik";

import strings from "../../strings";
import privateInfo from "../../privateInfo";

class RegistrationForm extends React.Component {
  state = { isSubmitting: false, showAlert: false };

  isFormComplete = ({
    firstName,
    lastName,
    address,
    phoneNumber,
    emailAddress
  }) => {
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

  submit = ({ firstName, lastName, address, phoneNumber, emailAddress }) => {
    const { role, onSubmit } = this.props;
    this.setState({ isSubmitting: true }, () =>
      fetch(privateInfo[process.env.NODE_ENV].users_api_endpoint, {
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
    const { isSubmitting, showAlert } = this.state;
    const { role } = this.props;
    return (
      <Container style={{ margin: "20px 0" }}>
        <Formik
          onSubmit={this.submit}
          initialValues={{
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
            emailAddress: ""
          }}
        >
          {({ handleSubmit, handleChange, values }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group controlId='firstName' as={Col}>
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    value={values.firstName}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId='lastName' as={Col}>
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    value={values.lastName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form.Row>

              {role === strings.DOCTOR && (
                <Form.Group controlId='address'>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    value={values.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              )}

              {role === strings.DOCTOR && (
                <Form.Group controlId='phoneNumber'>
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    value={values.phoneNumber}
                    onChange={handleChange}
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
                  value={values.emailAddress}
                  isInvalid={showAlert}
                  onChange={event => {
                    this.setState({ showAlert: false });
                    handleChange(event);
                  }}
                />
                <Form.Text className='text-muted'>
                  You will receive an email with the verification code.
                </Form.Text>
              </Form.Group>

              {!isSubmitting ? (
                <Button
                  variant='primary'
                  type='submit'
                  disabled={!this.isFormComplete(values)}
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
          )}
        </Formik>
      </Container>
    );
  }
}

export default RegistrationForm;
