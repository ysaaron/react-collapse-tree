import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

import connectToNodes from '../utils/connectToNodes';

let Wrapper = connectToNodes();

export default
 class Nodes extends React.Component {
  constructor(props) {
    super(props);

    this._willEnter = this._willEnter.bind(this);
    this._willLeave = this._willLeave.bind(this);
    this._getDefaultStyles = this._getDefaultStyles.bind(this);
    this._getStyles = this._getStyles.bind(this);
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
            return this._renderNodes(interpolatedStyles);
          }
        }
      </TransitionMotion>
    );
  }

  _renderNodes(interpolatedStyles) {
    let {
      nodeData,
      onNodeClick
    } = this.props;

    // <g key={config.key}
    //     transform={`translate(${config.style.y}, ${config.style.x})`}
    //     onClick={() => onNodeClick(config.data)}>
    //   <text>123</text>
    // </g>

    let nodes = interpolatedStyles.map((config) => {
      return (
        <Wrapper
          key={config.key}
          _toggleNode={onNodeClick}
          nodeData={config.data}
          transformX={config.style.x}
          transformY={config.style.y} />
      );
    });

    return (
      <g>
        {nodes}
      </g>
    );
  }

  _willEnter(styleThatEntered) {
    let startingNode = this.props.startingNode;

    return {
      x: startingNode.x0,
      y: startingNode.y0
    };
  }

  _willLeave() {
    let startingNode = this.props.startingNode;

    return {
      x: spring(startingNode.x),
      y: spring(startingNode.y)
    };
  }

  _getDefaultStyles() {
    let startingNode = this.props.startingNode;

    return this.props.nodeData.map((node) => {
      return {
        key: `${node.id}`,
        style: {
          x: startingNode.x0,
          y: startingNode.y0
        },
        data: node
      };
    });
  }

  _getStyles() {
    return this.props.nodeData.map((node) => {
      let key = node.id;
      let style = {
        x: spring(node.x),
        y: spring(node.y)
      };

      return {
        key: `${key}`,
        style: style,
        data: node
      };
    });
  }
}

Nodes.propTypes = {
  duration: React.PropTypes.number,
  projection: React.PropTypes.func,
  nodeData: React.PropTypes.array.isRequired,
  startingNode: React.PropTypes.object.isRequired
};
