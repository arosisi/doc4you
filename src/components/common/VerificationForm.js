import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { Formik } from "formik";

import withConsumer from "../../withConsumer";
import privateInfo from "../../privateInfo";

class VerificationForm extends React.Component {
  state = { isSubmitting: false, showAlert: false };

  submit = ({ verificationCode }) => {
    const { context, emailAddress } = this.props;
    this.setState({ isSubmitting: true }, () =>
      fetch(privateInfo.users_api_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress,
          verificationCode,
          action: "verify"
        })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            context.logIn(response.user);
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
    const { action } = this.props;
    return (
      <Container style={{ margin: "20px 0" }}>
        <Formik onSubmit={this.submit} initialValues={{ verificationCode: "" }}>
          {({ handleSubmit, handleChange, values }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='verificationCode'>
                <Form.Label>Verification Code</Form.Label>
                <Form.Control
                  value={values.verificationCode}
                  isInvalid={showAlert}
                  onChange={event => {
                    this.setState({ showAlert: false });
                    handleChange(event);
                  }}
                />
                <Form.Text className='text-muted'>
                  An email with the verification code has been sent to your
                  email address.
                </Form.Text>
                <Form.Text className='text-muted'>
                  Enter the verification code to {action}.
                </Form.Text>
              </Form.Group>

              {!isSubmitting ? (
                <Button
                  variant='primary'
                  type='submit'
                  disabled={!values.verificationCode}
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
                  Invalid verification code.
                </Alert>
              )}
            </Form>
          )}
        </Formik>
      </Container>
    );
  }
}

export default withConsumer(VerificationForm);
