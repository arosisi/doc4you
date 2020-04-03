import React from "react";
import messaging from "../Messaging";
import Paho from "paho-mqtt";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";

import strings from "../strings";

class SelectionForm extends React.Component {
  submit = ({ availability }) => {
    const { message, onSubmit } = this.props;
    let messageToSend = new Paho.Message(
      JSON.stringify({
        ...message,
        timeSlot: availability
      })
    );
    messageToSend.destinationName = strings.DESTINATION;
    messaging.send(messageToSend);
    onSubmit();
  };

  render() {
    const { connected, message } = this.props;
    return (
      <Container style={{ margin: "20px 0 20px 0" }}>
        {message ? (
          <Formik
            onSubmit={this.submit}
            initialValues={{
              ...message,
              availability: message.availability[0]
            }}
          >
            {({ handleSubmit, handleChange, values }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId='name'>
                  <Form.Label>Doctor</Form.Label>
                  <Form.Control
                    value={`${values.firstName} ${values.lastName}`}
                    disabled
                  />
                </Form.Group>

                <Form.Group controlId='address'>
                  <Form.Label>Address</Form.Label>
                  <Form.Control value={values.address} disabled />
                </Form.Group>

                <Form.Group controlId='phoneNumber'>
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control value={values.phoneNumber} disabled />
                </Form.Group>

                <Form.Group controlId='availability'>
                  <Form.Label>Select a timeslot</Form.Label>
                  <Form.Control
                    as='select'
                    value={values.availability}
                    onChange={handleChange}
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
            )}
          </Formik>
        ) : (
          <div>Click on a dot on the map to see doctor availability.</div>
        )}
      </Container>
    );
  }
}

export default SelectionForm;
