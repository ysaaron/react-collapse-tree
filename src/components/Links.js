import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

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
        defaultStyles={this.getDefaultStyles()}>
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
    return {
      x0: spring(this.props.eventNode.x),
      y0: spring(this.props.eventNode.y),
      x: spring(this.props.eventNode.x),
      y: spring(this.props.eventNode.y)
    };
  }

  getDefaultStyles() {
    return this.props.linksData.map((link) => {
      return {
        key: `${link.target.id}`,
        style: {
          x0: this.props.eventNode.x0,
          y0: this.props.eventNode.y0,
          x: this.props.eventNode.x0,
          y: this.props.eventNode.y0
        },
        data: link
      };
    });
  }

  getStyles() {
    return this.props.linksData.map((link) => {
      return {
        key: `${link.target.id}`,
        style: {
          x0: spring(link.source.x),
          y0: spring(link.source.y),
          x: spring(link.target.x),
          y: spring(link.target.y)
        },
        data: link
      };
    });
  }

  renderLinks(interpolatedStyles) {
    return (
      <g>
        {
          interpolatedStyles.map((config) => {
            let axis = this.props.getAxis(config.style);
            let d = this.props.diagonal({
              source: {
                x: config.style.x0,
                y: config.style.y0
              },
              target: {
                x: axis[0],
                y: axis[1]
              }
            });
            let isParent = this.props.isDragging ? (this.props.eventNode.id == config.data.target.id) : false;
            let isDisplay = config.data.target.isDisplay && !isParent;

            return (
              <path key={config.key}
                    style={{
                      display: isDisplay ? '' : 'none'
                    }}
                    d={d} />
            );
          })
        }
      </g>
    );
  }
}

Links.propsTypes = {
  linksData: React.PropTypes.array.isRequired,
  eventNode: React.PropTypes.object.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};
