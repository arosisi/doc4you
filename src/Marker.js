import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

class Marker extends React.Component {
  render() {
    const { color, message, onSelect } = this.props;
    const {
      firstName,
      lastName,
      address1,
      address2,
      phoneNumber,
      availability
    } = message;

    const popover = (
      <Popover id="popover-basic">
        <Popover.Title as="h3">Doctor Information</Popover.Title>
        <Popover.Content>
          <p>{`Name: ${firstName} ${lastName}`}</p>
          <p>{`Address: ${address2 ? address2 + "-" : ""}${address1}`}</p>
          <p>{`Phone Number: ${phoneNumber}`}</p>
          <p style={{ marginBottom: "0.5rem" }}>Availability:</p>
          <ul style={{ marginLeft: "-0.5rem" }}>
            {availability.map(timeSlot => (
              <li key={timeSlot}>{timeSlot}</li>
            ))}
          </ul>
        </Popover.Content>
      </Popover>
    );

    return (
      <OverlayTrigger trigger="click" placement="right" overlay={popover}>
        <div
          style={{
            height: 20,
            width: 20,
            borderRadius: "100%",
            background: color,
            cursor: "pointer"
          }}
          onClick={onSelect}
        />
      </OverlayTrigger>
    );
  }
}

export default Marker;
