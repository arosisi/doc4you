import React from "react";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Row from "react-bootstrap/Row";

import AvailabilityForm from "./AvailabilityForm";
import SelectionForm from "./SelectionForm";
import strings from "./strings";

class Panel extends React.Component {
  state = { title: "Select your role" };

  render() {
    const { title } = this.state;
    const { coords, messageSelected, onSelectTimeSlot } = this.props;
    return (
      <Container fluid={true}>
        <Row style={{ margin: "10px 0 20px 0", alignItems: "center" }}>
          <div style={{ marginRight: 10 }}>I am a</div>
          <DropdownButton
            id="dropdown-item-button"
            size="sm"
            variant="outline-primary"
            title={title}
          >
            <Dropdown.Item
              as="button"
              onClick={() => this.setState({ title: strings.DOCTOR })}
            >
              {strings.DOCTOR}
            </Dropdown.Item>
            <Dropdown.Item
              as="button"
              onClick={() => this.setState({ title: strings.PATIENT })}
            >
              {strings.PATIENT}
            </Dropdown.Item>
          </DropdownButton>
        </Row>
        {title === strings.DOCTOR && <AvailabilityForm coords={coords} />}
        {title === strings.PATIENT && (
          <SelectionForm
            message={messageSelected}
            onSelect={onSelectTimeSlot}
          />
        )}
      </Container>
    );
  }
}

export default Panel;
