import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import _ from "lodash";

import RoleIcon from "./RoleIcon";
import strings from "../strings";

class RoleSelector extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Container style={{ marginTop: 50 }}>
        <Row>
          <Col xs={6}>
            <RoleIcon
              src='doctor.png'
              caption={_.capitalize(strings.DOCTOR)}
              style={{ float: "right" }}
              onClick={() => history.push(strings.DOCTOR)}
            />
          </Col>
          <Col xs={6}>
            <RoleIcon
              src='patient.png'
              caption={_.capitalize(strings.PATIENT)}
              onClick={() => history.push(strings.PATIENT)}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default RoleSelector;
