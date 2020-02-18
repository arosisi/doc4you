import React from "react";

import LoginForm from "./LoginForm";
import VerificationForm from "./VerificationForm";

class Login extends React.Component {
  state = { emailAddress: "", isVerifying: false };

  switchToVerification = emailAddress =>
    this.setState({ emailAddress, isVerifying: true });

  render() {
    const { emailAddress, isVerifying } = this.state;
    const { role, logInUser } = this.props;
    return !isVerifying ? (
      <LoginForm role={role} onSubmit={this.switchToVerification} />
    ) : (
      <VerificationForm
        emailAddress={emailAddress}
        onSubmit={logInUser}
        action='log in'
      />
    );
  }
}

export default Login;
