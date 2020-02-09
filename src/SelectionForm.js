import React from "react";
import messaging from "./Messaging";
import Paho from "paho-mqtt";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import strings from "./strings";

class SelectionForm extends React.Component {
  state = { timeSlot: "" };

  submit = event => {
    const { timeSlot } = this.state;
    const { message, onSelect } = this.props;
    event.preventDefault();
    let messageToSend = new Paho.Message(
      JSON.stringify({
        ...message,
        timeSlot: timeSlot || message.availability[0]
      })
    );
    messageToSend.destinationName = strings.DESTINATION;
    messaging.send(messageToSend);
    onSelect();
  };

  render() {
    const { timeSlot } = this.state;
    const { message } = this.props;
    return (
      <Container style={{ margin: "20px 0 20px 0" }}>
        {message ? (
          <Form onSubmit={this.submit}>
            <Form.Group controlId="name">
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                value={`${message.firstName} ${message.lastName}`}
                disabled
              />
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={`${message.address2 ? message.address2 + "-" : ""}${
                  message.address1
                }`}
                disabled
              />
            </Form.Group>

            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone number</Form.Label>
              <Form.Control value={message.phoneNumber} disabled />
            </Form.Group>

            <Form.Group controlId="availability">
              <Form.Label>Select a timeslot</Form.Label>
              <Form.Control
                as="select"
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

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        ) : (
          <div>Click on a dot on the map to see doctor availability.</div>
        )}
      </Container>
    );
  }
}

export default SelectionForm;
