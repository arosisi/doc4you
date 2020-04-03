import React from "react";
import messaging from "../Messaging";
import Paho from "paho-mqtt";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import strings from "../strings";

class SelectionForm extends React.Component {
  state = { timeSlot: "" };

  submit = event => {
    event.preventDefault();
    const { timeSlot } = this.state;
    const { message, onSubmit } = this.props;
    let messageToSend = new Paho.Message(
      JSON.stringify({
        ...message,
        timeSlot: timeSlot || message.availability[0]
      })
    );
    messageToSend.destinationName = strings.DESTINATION;
    messaging.send(messageToSend);
    this.setState({ timeSlot: "" }, onSubmit);
  };

  render() {
    const { timeSlot } = this.state;
    const { connected, message } = this.props;
    return (
      <Container style={{ margin: "20px 0 20px 0" }}>
        {message ? (
          <Form onSubmit={this.submit}>
            <Form.Group controlId='name'>
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                value={`${message.firstName} ${message.lastName}`}
                disabled
              />
            </Form.Group>

            <Form.Group controlId='address'>
              <Form.Label>Address</Form.Label>
              <Form.Control value={message.address} disabled />
            </Form.Group>

            <Form.Group controlId='phoneNumber'>
              <Form.Label>Phone number</Form.Label>
              <Form.Control value={message.phoneNumber} disabled />
            </Form.Group>

            <Form.Group controlId='availability'>
              <Form.Label>Select a timeslot</Form.Label>
              <Form.Control
                as='select'
                value={timeSlot || message.availability[0]}
                onChange={event => {
                  this.setState({
                    timeSlot: event.currentTarget.value
                  });
                }}
              >
                {message.availability.map(timeSlot => (
                  <option key={timeSlot}>{timeSlot}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='submit'>
              <Button variant='primary' type='submit' disabled={!connected}>
                Submit
              </Button>
              {!connected && (
                <Form.Text className='text-danger'>
                  Something went wrong. Please try again later.
                </Form.Text>
              )}
            </Form.Group>
          </Form>
        ) : (
          <div>Click on a dot on the map to see doctor availability.</div>
        )}
      </Container>
    );
  }
}

export default SelectionForm;
