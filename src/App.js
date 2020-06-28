import React from "react";
import messaging from "./Messaging";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { withStyles } from "@material-ui/styles";

import Map from "./components/map/Map";
import Panel from "./components/Panel";
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
    windowWidth: window.innerWidth,
    loading: true,
    connected: false,
    messages: [],
    messageSelected: null
  };

  componentDidMount() {
    window.addEventListener("resize", this.resize);

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
            this.getPreviousMessages();
            this.authenticate();
            this.connect();
          }
        )
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
    messaging.disconnect();
    messaging.unregister();
  }

  resize = ({ target }) =>
    this.setState({
      windowWidth: target.innerWidth
    });

  getPreviousMessages = () => {
    fetch(privateInfo.availabilities_api_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get availabilities" })
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({ messages: response.availabilities });
        } else {
          console.log(response.message);
        }
      })
      .catch(error =>
        console.log("Unable to connect to API availabilities.", error)
      );
  };

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
        messaging.registerConnectionLostCallback(() =>
          this.setState({ connected: false })
        );
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
    if (messageObj.patientId) {
      // message sent from a patient
      // no new availability will be added
      this.setState({
        messages: messages.map(message => {
          const { doctorId, patientId, selected } = messageObj;
          if (message.doctorId === doctorId) {
            return {
              ...message,
              availability: message.availability.map(({ timeSlot, ...other }) =>
                timeSlot === selected.timeSlot
                  ? { patientId, timeSlot }
                  : { timeSlot, ...other }
              )
            };
          }
          return message;
        })
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
      windowWidth,
      loading,
      connected,
      coords,
      zoom,
      messages,
      messageSelected
    } = this.state;
    const { context, classes, role } = this.props;
    return (
      <Container fluid={true}>
        <Row>
          <Col
            style={{
              height: windowWidth < 992 ? "50vh" : "100vh",
              width: "100%"
            }}
          >
            {coords && zoom && (
              <Map
                coords={coords}
                zoom={zoom}
                messages={messages}
                onSelect={message =>
                  this.setState({ messageSelected: message })
                }
              />
            )}
          </Col>
          <Col md={12} lg={5}>
            {loading ? (
              <Spinner
                className={classes.spinner}
                animation='border'
                variant='primary'
              />
            ) : (
              <Panel
                context={context}
                connected={connected}
                role={role}
                coords={coords}
                messageSelected={messageSelected}
                onSubmitTimeSlot={() =>
                  this.setState({ messageSelected: null })
                }
                onLogOut={() => this.setState({ messageSelected: null })}
              />
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withConsumer(withStyles(styles)(App));
