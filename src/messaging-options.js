import privateInfo from "./privateInfo";

export default {
  userName: "solace-cloud-client",
  password: privateInfo.solace_connection_password,
  invocationContext: {
    host: privateInfo.solace_host,
    port: 20745,
    clientId: ""
  },
  timeout: 3,
  keepAliveInterval: 60,
  cleanSession: true,
  useSSL: true,
  reconnect: true
};
