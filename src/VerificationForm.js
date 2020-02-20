import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import privateInfo from "./privateInfo";

class VerificationForm extends React.Component {
  state = { verificationCode: "", isSubmitting: false, showAlert: false };

  submit = event => {
    event.preventDefault();
    const { verificationCode } = this.state;
    const { emailAddress, onSubmit } = this.props;
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
            onSubmit();
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
    const { verificationCode, isSubmitting, showAlert } = this.state;
    const { action } = this.props;
    return (
      <Container style={{ margin: "20px 0" }}>
        <Form onSubmit={this.submit}>
          <Form.Group controlId='verificationCode'>
            <Form.Label>Verification Code</Form.Label>
            <Form.Control
              value={verificationCode}
              isInvalid={showAlert}
              onChange={event =>
                this.setState({
                  verificationCode: event.currentTarget.value,
                  showAlert: false
                })
              }
            />
            <Form.Text className='text-muted'>
              An email with the verification code has been sent to your email
              address.
            </Form.Text>
            <Form.Text className='text-muted'>
              Enter the verification code to {action}.
            </Form.Text>
          </Form.Group>

          {!isSubmitting ? (
            <Button
              variant='primary'
              type='submit'
              disabled={!verificationCode}
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
      </Container>
    );
  }
}

export default VerificationForm;
