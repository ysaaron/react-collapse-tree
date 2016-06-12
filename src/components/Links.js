import React from 'react';
import { TransitionMotion, spring } from 'react-motion';
import d3 from 'd3';

const diagonal = d3.svg.diagonal().projection((d) => { return [d.y, d.x]; });

export default class Links extends React.Component {
  constructor(props) {
    super(props);

    this._willEnter = this._willEnter.bind(this);
    this._willLeave = this._willLeave.bind(this);
    this._getDefaultStyles = this._getDefaultStyles.bind(this);
    this._getStyles = this._getStyles.bind(this);
    this._renderLinks = this._renderLinks.bind(this);
  }

  render() {
    return (
      <TransitionMotion
        willLeave={this._willLeave}
        willEnter={this._willEnter}
        styles={this._getStyles}
        defaultStyles={this._getDefaultStyles()}>
        {
          (interpolatedStyles) => {
            return this._renderLinks(interpolatedStyles);
          }
        }
      </TransitionMotion>
    );
  }

  _willEnter(styleThatEntered) {
    let startingNode = this.props.startingNode;

    return {
      x0: startingNode.x0,
      y0: startingNode.y0,
      x: startingNode.x0,
      y: startingNode.y0
    };
  }

  _willLeave() {
    let startingNode = this.props.startingNode;

    return {
      x0: spring(startingNode.x),
      y0: spring(startingNode.y),
      x: spring(startingNode.x),
      y: spring(startingNode.y)
    };
  }

  _getDefaultStyles() {
    let startingNode = this.props.startingNode;

    return this.props.linkData.map((link) => {
      let style = {
        x0: startingNode.x0,
        y0: startingNode.y0,
        x: startingNode.x0,
        y: startingNode.y0
      };

      return {
        key: `${link.target.id}`,
        style: style,
        data: link
      };
    });
  }

  _getStyles() {
    return this.props.linkData.map((link) => {
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

  _renderLinks(interpolatedStyles) {
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

      return (
        <path key={config.key}
              d={d}>
        </path>
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
  linkData: React.PropTypes.array,
  sourceNode: React.PropTypes.object,
  startingNode: React.PropTypes.object
};
