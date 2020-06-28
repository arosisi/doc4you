import React from "react";
import GoogleMapReact from "google-map-react";

import Marker from "./Marker";
import privateInfo from "../../privateInfo";

class Map extends React.Component {
  render() {
    const { coords, zoom, messages, onSelect } = this.props;
    return (
      <GoogleMapReact
        bootstrapURLKeys={{
          key: privateInfo[process.env.NODE_ENV].google_api_key
        }}
        defaultCenter={coords}
        defaultZoom={zoom}
      >
        {messages
          .filter(message =>
            message.availability.some(({ patientId }) => !patientId)
          )
          .map(message => (
            <Marker
              key={JSON.stringify(message)}
              lat={message.lat}
              lng={message.lng}
              color='white'
              message={message}
              onSelect={() => onSelect(message)}
            />
          ))}
      </GoogleMapReact>
    );
  }
}

export default Map;
