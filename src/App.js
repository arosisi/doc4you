import React from "react";
import messaging from "./Messaging";
import GoogleMapReact from "google-map-react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { withStyles } from "@material-ui/styles";

import Panel from "./components/Panel";
import Marker from "./components/Marker";
import withConsumer from "./withConsumer";
import strings from "./strings";
import privateInfo from "./privateInfo";

const styles = {
  spinner: {
    margin: "15px 0"
  }
};

class App extends React.Component {
  state = {
    loading: true,
    connected: false,
    messages: [],
    messageSelected: null
  };

  componentDidMount() {
    const { context } = this.props;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position =>
        this.setState(
          {
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            zoom: 11
          },
          () => {
            context.logOut();
            this.authenticate();
            this.connect();
          }
        )
      );
    }
  }

  componentWillUnmount() {
    messaging.disconnect();
  }

  authenticate = () => {
    const { context, role } = this.props;
    fetch(privateInfo.users_api_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "authenticate" }),
      credentials: "include"
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({ loading: false });
          if (role === response.user.role) {
            context.logIn(response.user);
          }
        } else {
          this.setState({ loading: false });
          console.log(response.message);
        }
      })
      .catch(error => console.log("Unable to connect to API users.", error));
  };

  connect = () => {
    messaging
      .connectWithPromise()
      .then(response => {
        console.log("Succesfully connected to Solace Cloud.", response);
        messaging.subscribe(strings.DESTINATION);
        messaging.register(this.handleMessage);
        this.setState({ connected: true });
      })
      .catch(error => {
        console.log(
          "Unable to establish connection with Solace Cloud, see above logs for more details.",
          error
        );
      });
  };

  handleMessage = message => {
    const { messages } = this.state;
    const messageObj = JSON.parse(message.payloadString);
    if (messageObj.timeSlot) {
      // message sent from a patient
      // no new availability will be added
      // instead, an exisiting availability will lose a timeslot
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

  render() {
    const {
      loading,
      connected,
      coords,
      zoom,
      messages,
      messageSelected
    } = this.state;
    const { classes, role } = this.props;
    return (
      <Container fluid={true}>
        <Row>
          <Col md={12} lg={5}>
            {loading ? (
              <Spinner
                className={classes.spinner}
                animation='border'
                variant='primary'
              />
            ) : (
              <Panel
                connected={connected}
                role={role}
                coords={coords}
                messageSelected={messageSelected}
                onSelectTimeSlot={() =>
                  this.setState({ messageSelected: null })
                }
              />
            )}
          </Col>
          <Col style={{ height: "100vh", width: "100%" }}>
            {coords && zoom && (
              <GoogleMapReact
                bootstrapURLKeys={{ key: privateInfo.google_api_key }}
                defaultCenter={coords}
                defaultZoom={zoom}
              >
                {messages.map(message => (
                  <Marker
                    key={JSON.stringify(message)}
                    lat={message.lat}
                    lng={message.lng}
                    color='white'
                    message={message}
                    onSelect={() => this.setState({ messageSelected: message })}
                  />
                ))}
              </GoogleMapReact>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withConsumer(withStyles(styles)(App));
