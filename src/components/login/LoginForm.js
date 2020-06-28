import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { Formik } from "formik";

import privateInfo from "../../privateInfo";

class LoginForm extends React.Component {
  state = { isSubmitting: false, showAlert: false };

  submit = ({ emailAddress }) => {
    const { role, onSubmit } = this.props;
    this.setState({ isSubmitting: true }, () =>
      fetch(privateInfo.users_api_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailAddress, role, action: "log in" })
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
            console.log(response.message);
          }
        })
        .catch(error => console.log("Unable to connect to API users.", error))
    );
  };

  render() {
    const { isSubmitting, showAlert } = this.state;
    return (
      <Container style={{ margin: "20px 0" }}>
        <Formik onSubmit={this.submit} initialValues={{ emailAddress: "" }}>
          {({ handleSubmit, handleChange, values }) => (
            <Form onSubmit={handleSubmit}>
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
                  disabled={!values.emailAddress}
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
                  Something went wrong. Please try again later.
                </Alert>
              )}
            </Form>
          )}
        </Formik>
      </Container>
    );
  }
}

export default LoginForm;
