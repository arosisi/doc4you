import React from "react";

import RegistrationForm from "./RegistrationForm";
import VerificationForm from "./VerificationForm";

class Registration extends React.Component {
  state = { emailAddress: "", isVerifying: false };

  switchToVerification = emailAddress =>
    this.setState({ emailAddress, isVerifying: true });

  render() {
    const { emailAddress, isVerifying } = this.state;
    const { role, logInUser } = this.props;
    return !isVerifying ? (
      <RegistrationForm role={role} onSubmit={this.switchToVerification} />
    ) : (
      <VerificationForm
        emailAddress={emailAddress}
        onSubmit={logInUser}
        action='register'
      />
    );
  }
}

export default Registration;
