import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

export default class SvgChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: null,
      translate: null
    };
  }

  componentDidMount() {
    var zoom = d3.behavior.zoom()
      .scaleExtent(this.props.scaleExtent)
      .on('zoom', () => {
        this.setState({
          scale: zoom.scale(),
          translate: zoom.translate()
        });
      })

    d3.select(ReactDOM.findDOMNode(this.refs.zoomChart))
      .call(zoom);
  }

  render() {
    return (
      <svg style={{
          height: this.props.height,
          width: this.props.width
        }}
        ref="zoomChart">
        <g transform={`translate(${this.state.translate}) scale(${this.state.scale})`}>
          {this.props.children}
        </g>
      </svg>
    );
  }
};

SvgChart.defaultProps = {
  onZoom: () => {},
  scaleExtent: [1, 10],
  width: 1000,
  height: 1000
};
