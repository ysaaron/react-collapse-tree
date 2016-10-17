import React from 'react';

export default class TestingNode extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <g>
        <rect width={20}
              height={20}
              style={{
                "file": "rgb(0,0,255)",
                "strokeWidth": "3",
                "stroke": "rgb(0,0,87)"
              }}></rect>
          <text>{this.props.nodeData.id}</text>
      </g>
    );
  }
}
