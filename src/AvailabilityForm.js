import React from "react";
import messaging from "./Messaging";
import Paho from "paho-mqtt";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import strings from "./strings";

const timeSlots = [
  "9am-10am",
  "10am-11am",
  "11am-12pm",
  "12pm-1pm",
  "1pm-2pm",
  "2pm-3pm",
  "3pm-4pm",
  "4pm-5pm"
];

class AvailabilityForm extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    phoneNumber: "",
    availability: []
  };

  getAvailability = options => {
    const availability = [];
    // options is a HTMLOptionsCollection
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.selected) {
        availability.push(option.label);
      }
    }
    return availability;
  };

  isFormComplete = () => {
    const { firstName, lastName, address1, phoneNumber } = this.state;
    return firstName && lastName && address1 && phoneNumber;
  };

  submit = event => {
    const { coords } = this.props;
    event.preventDefault();
    let message = new Paho.Message(
      JSON.stringify({ ...this.state, ...coords })
    );
    message.destinationName = strings.DESTINATION;
    messaging.send(message);
    this.clearState();
  };

  clearState = () =>
    this.setState({
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      phoneNumber: "",
      availability: []
    });

  render() {
    const {
      firstName,
      lastName,
      address1,
      address2,
      phoneNumber,
      availability
    } = this.state;
    return (
      <Container style={{ margin: "20px 0 20px 0" }}>
        <Form noValidate onSubmit={this.submit}>
          <Form.Row>
            <Form.Group controlId="firstName" as={Col}>
              <Form.Label>First name</Form.Label>
              <Form.Control
                value={firstName}
                onChange={event =>
                  this.setState({ firstName: event.currentTarget.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="lastName" as={Col}>
              <Form.Label>Last name</Form.Label>
              <Form.Control
                value={lastName}
                onChange={event =>
                  this.setState({ lastName: event.currentTarget.value })
                }
              />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="address1">
            <Form.Label>Address</Form.Label>
            <Form.Control
              placeholder="1234 Main St"
              value={address1}
              onChange={event =>
                this.setState({ address1: event.currentTarget.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="address2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control
              placeholder="Apartment, studio, or floor"
              value={address2}
              onChange={event =>
                this.setState({ address2: event.currentTarget.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="phoneNumber">
            <Form.Label>Phone number</Form.Label>
            <Form.Control
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={event =>
                this.setState({ phoneNumber: event.currentTarget.value })
              }
            />
            <Form.Text className="text-muted">
              Patients may call this number to book an appointment.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="availability">
            <Form.Label>Select your availability</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={availability}
              onChange={event => {
                this.setState({
                  availability: this.getAvailability(
                    event.currentTarget.options
                  )
                });
              }}
            >
              {timeSlots.map(timeSlot => (
                <option key={timeSlot}>{timeSlot}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={!this.isFormComplete()}
          >
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}

export default AvailabilityForm;
