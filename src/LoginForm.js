import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

class LoginForm extends React.Component {
  state = { emailAddress: "", isSubmitting: false, showAlert: false };

  submit = event => {
    event.preventDefault();
    const { emailAddress } = this.state;
    const { role, onSubmit } = this.props;
    this.setState({ isSubmitting: true }, () =>
      fetch("http://localhost:9000/users", {
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
    const { emailAddress, isSubmitting, showAlert } = this.state;
    return (
      <Container style={{ margin: "20px 0" }}>
        <Form onSubmit={this.submit}>
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
            <Button variant='primary' type='submit' disabled={!emailAddress}>
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
              Invalid email address.
            </Alert>
          )}
        </Form>
      </Container>
    );
  }
}

export default LoginForm;
