import React from 'react';
import { TransitionMotion, spring } from 'react-motion';
import d3 from 'd3';

const diagonal = d3.svg.diagonal().projection((d) => { return [d.y, d.x]; });

export default class Links extends React.Component {
  constructor(props) {
    super(props);

    this.willEnter = this.willEnter.bind(this);
    this.willLeave = this.willLeave.bind(this);
    this.getDefaultStyles = this.getDefaultStyles.bind(this);
    this.getStyles = this.getStyles.bind(this);
    this.renderLinks = this.renderLinks.bind(this);
  }

  render() {
    return (
      <TransitionMotion
        willLeave={this.willLeave}
        willEnter={this.willEnter}
        styles={this.getStyles}
        defaultStyles={this.getDefaultStyles()}
      >
        {
          (interpolatedStyles) => {
            return this.renderLinks(interpolatedStyles);
          }
        }
      </TransitionMotion>
    );
  }

  willEnter(styleThatEntered) {
    let eventNode = this.props.eventNode;

    return {
      x0: eventNode.x0,
      y0: eventNode.y0,
      x: eventNode.x0,
      y: eventNode.y0
    };
  }

  willLeave() {
    let eventNode = this.props.eventNode;

    return {
      x0: spring(eventNode.x),
      y0: spring(eventNode.y),
      x: spring(eventNode.x),
      y: spring(eventNode.y)
    };
  }

  getDefaultStyles() {
    let eventNode = this.props.eventNode;

    return this.props.linksData.map((link) => {
      let style = {
        x0: eventNode.x0,
        y0: eventNode.y0,
        x: eventNode.x0,
        y: eventNode.y0
      };

      return {
        key: `${link.target.id}`,
        style: style,
        data: link
      };
    });
  }

  getStyles() {
    return this.props.linksData.map((link) => {
      let style = {
        x0: spring(link.source.x),
        y0: spring(link.source.y),
        x: spring(link.target.x),
        y: spring(link.target.y)
      };

      return {
        key: `${link.target.id}`,
        style: style,
        data: link
      };
    });
  }

  renderLinks(interpolatedStyles) {
    let linkSet = interpolatedStyles.map((config) => {
      let source = {
        x: config.style.x0,
        y: config.style.y0
      };
      let target = {
        x: config.style.x,
        y: config.style.y
      };
      let d = diagonal({
        source: source,
        target: target
      });
      let isParent = this.props.isDragging ? (this.props.eventNode.id == config.data.target.id) : false;
      let isDisplay = config.data.target.isDisplay && !isParent;

      return (
        <path
          key={config.key}
          style={{
            display: isDisplay ? '' : 'none'
          }}
          d={d}
        />
      );
    });

    return (
      <g>
        {linkSet}
      </g>
    );
  }
}

Links.propsTypes = {
  linksData: React.PropTypes.array.isRequired,
  eventNode: React.PropTypes.object.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};
