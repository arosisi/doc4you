import React from "react";
import messaging from "./Messaging";
import GoogleMapReact from "google-map-react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import Panel from "./Panel";
import Marker from "./Marker";
import strings from "./strings";
import privateInfo from "./privateInfo";

class App extends React.Component {
  state = {
    loading: true,
    connected: false,
    messages: [],
    messageSelected: null
  };

  componentDidMount() {
    messaging.register(this.handleMessage);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position =>
        this.setState(
          {
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            zoom: 11,
            loading: false
          },
          this.connect
        )
      );
    }
  }

  componentWillUnmount() {
    messaging.disconnect();
  }

  handleMessage = message => {
    const { messages } = this.state;
    const messageObj = JSON.parse(message.payloadString);
    if (messageObj.timeSlot) {
      // message sent from a patient
      // no new availability will be added
      // instead, an exisiting availability will lost a timeslot
      // if it has no timeslots afterwards, it will be deleted
      this.setState({
        messages: messages
          .map(message => {
            const { timeSlot, ...other } = messageObj;
            if (JSON.stringify(message) === JSON.stringify({ ...other })) {
              return {
                ...message,
                availability: message.availability.filter(
                  item => item !== timeSlot
                )
              };
            }
            return message;
          })
          .filter(message => message.availability.length)
      });
    } else {
      // message sent from a doctor
      // a new availability will be added
      this.setState({
        messages: messages.concat(messageObj)
      });
    }
  };

  connect = () =>
    messaging
      .connectWithPromise()
      .then(response => {
        console.log("Succesfully connected to Solace Cloud.", response);
        messaging.subscribe(strings.DESTINATION);
        this.setState({
          connected: true
        });
      })
      .catch(error => {
        console.log(
          "Unable to establish connection with Solace Cloud, see above logs for more details.",
          error
        );
      });

  render() {
    const {
      loading,
      connected,
      coords,
      messages,
      messageSelected
    } = this.state;
    return (
      <Container fluid={true}>
        {loading && connected ? (
          <Spinner animation="border" />
        ) : (
          <Row>
            <Col md={12} lg={5}>
              <Panel
                coords={coords}
                messageSelected={messageSelected}
                onSelectTimeSlot={() =>
                  this.setState({ messageSelected: null })
                }
              />
            </Col>
            <Col style={{ height: "100vh" }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: privateInfo.google_api_key }}
                defaultCenter={this.state.coords}
                defaultZoom={this.state.zoom}
              >
                {messages.map(message => (
                  <Marker
                    key={JSON.stringify(message)}
                    lat={message.lat}
                    lng={message.lng}
                    color="white"
                    message={message}
                    onSelect={() => this.setState({ messageSelected: message })}
                  />
                ))}
              </GoogleMapReact>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

export default App;
