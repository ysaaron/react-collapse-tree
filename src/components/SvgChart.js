import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

export default class SvgChart extends React.Component {
  constructor(props) {
    super(props);

    this._onZoom = this._onZoom.bind(this);
    this.state = {
      scale: 1,
      translate: [0, 0]
    };
  }

  componentDidMount() {
    this.zoom = d3.behavior.zoom()
                .scaleExtent(this.props.scaleExtent)
                .on('zoom', this._onZoom);

    d3.select(ReactDOM.findDOMNode(this.refs.zoomChart))
      .call(this.zoom);
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

  _onZoom() {
    if(!this.props.blockZooming) {
      this.setState({
        scale: this.zoom.scale(),
        translate: this.zoom.translate()
      });
    } else {
      this.zoom.translate(this.state.translate);
    }
  }
};

SvgChart.defaultProps = {
  blockZooming: false,
  scaleExtent: [1, 10],
  width: 1000,
  height: 1000
};
