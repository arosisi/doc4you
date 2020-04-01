import React from "react";
import Figure from "react-bootstrap/Figure";

class RoleIcon extends React.Component {
  render() {
    const { src, caption, style, onClick } = this.props;
    return (
      <Figure style={style}>
        <Figure.Image
          src={src}
          style={{
            height: 150,
            cursor: "pointer"
          }}
          onDragStart={event => event.preventDefault()}
          onClick={onClick}
        />
        <Figure.Caption style={{ userSelect: "none", textAlign: "center" }}>
          {caption}
        </Figure.Caption>
      </Figure>
    );
  }
}

export default RoleIcon;
