import React from "react";
import messaging from "../Messaging";
import Paho from "paho-mqtt";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";

import strings from "../strings";

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
  isFormComplete = ({
    firstName,
    lastName,
    address,
    phoneNumber,
    availability
  }) => firstName && lastName && address && phoneNumber && availability.length;

  submit = (values, { resetForm }) => {
    const { coords } = this.props;
    let message = new Paho.Message(
      JSON.stringify({ ...this.formatValues(values), ...coords })
    );
    message.destinationName = strings.DESTINATION;
    messaging.send(message);
    resetForm();
  };

  formatValues = values => {
    const { userId, availability, ...other } = values;
    return {
      doctorId: userId,
      availability: availability.map(timeSlot => ({ timeSlot })),
      ...other
    };
  };

  render() {
    const { context, connected } = this.props;
    return (
      <Container style={{ margin: "20px 0 20px 0" }}>
        <Formik
          onSubmit={this.submit}
          initialValues={{ ...context.getBasicUserInfo(), availability: [] }}
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

              <Form.Group controlId='address'>
                <Form.Label>Address</Form.Label>
                <Form.Control value={values.address} onChange={handleChange} />
              </Form.Group>

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

              <Form.Group controlId='availability'>
                <Form.Label>Select your availability</Form.Label>
                <Form.Control
                  as='select'
                  multiple
                  value={values.availability}
                  onChange={handleChange}
                >
                  {timeSlots.map(timeSlot => (
                    <option key={timeSlot}>{timeSlot}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId='submit'>
                <Button
                  variant='primary'
                  type='submit'
                  disabled={!connected || !this.isFormComplete(values)}
                >
                  Submit
                </Button>
                {!connected && (
                  <Form.Text className='text-danger'>
                    Something went wrong. Please try again later.
                  </Form.Text>
                )}
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Container>
    );
  }
}

export default AvailabilityForm;
