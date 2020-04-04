import options from "./messaging-options";
import Paho from "paho-mqtt";

class Messaging extends Paho.Client {
  constructor() {
    super(
      options.invocationContext.host,
      Number(options.invocationContext.port),
      options.invocationContext.clientId
    );
    this.onMessageArrived = this.handleMessage.bind(this);
    this.onConnectionLost = this.handleConnectionLost.bind(this);
    this.callbacks = [];
    this.connectionLostCallback = null;
  }

  connectWithPromise() {
    return new Promise((resolve, reject) => {
      options.onSuccess = resolve;
      options.onFailure = reject;
      this.connect(options);
    });
  }

  // called when the client loses its connection
  handleConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      this.connectionLostCallback();
      console.log("Connection lost with Solace Cloud");
    }
    // Add auto connect logic with backoff here if you want to automatically reconnect
  }

  register(callback) {
    this.callbacks.push(callback);
  }

  registerConnectionLostCallback(callback) {
    this.connectionLostCallback = callback;
  }

  unregister() {
    this.callbacks = [];
  }

  // called when a message arrives
  handleMessage(message) {
    console.log("Received message", message.payloadString);
    this.callbacks.forEach(callback => callback(message));
  }
}

const messaging = new Messaging();
export default messaging;
