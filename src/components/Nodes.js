import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

import connectToNodes from '../utils/connectToNodes';

class TestingNode extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <g>
        {/*<rect width={20}
              height={20}
              style={{
                "file": "rgb(0,0,255)",
                "strokeWidth": "3",
                "stroke": "rgb(0,0,87)"
              }}></rect>*/}
          <text>159</text>
      </g>
    );
  }
}


let DragWrapper = connectToNodes(TestingNode);

export default class Nodes extends React.Component {
  constructor(props) {
    super(props);

    this.getDefaultStyles = this.getDefaultStyles.bind(this);
  }

  render() {
    return (
      <g>
        <TransitionMotion
          willLeave={this.willLeave.bind(this)}
          willEnter={this.willEnter.bind(this)}
          styles={this.getStyles.bind(this)}
          defaultStyles={this.getDefaultStyles()}>
          {
            (interpolatedStyles) => {
              return this.renderNodes(interpolatedStyles);
            }
          }
        </TransitionMotion>
      </g>
    );
  }

  renderNodes(interpolatedStyles) {
    let {
      nodesData,
      onNodeClick,
      onNodeBeginDrag,
      onNodeEndDrag,
      onNodeDrop,
      onNodeDidDrop
    } = this.props;

    let nodes = interpolatedStyles.map((config) => {
      return (
          <DragWrapper
            key={config.key}
            onNodeClick={onNodeClick}
            onNodeBeginDrag={onNodeBeginDrag}
            onNodeEndDrag={onNodeEndDrag}
            onNodeDrop={onNodeDrop}
            onNodeDidDrop={onNodeDidDrop}
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

  willEnter(styleThatEntered) {
    let startingNode = this.props.eventNode;

    return {
      x: startingNode.x0,
      y: startingNode.y0
    };
  }

  willLeave() {
    let eventNode = this.props.eventNode;

    return {
      x: spring(eventNode.x),
      y: spring(eventNode.y)
    };
  }

  getDefaultStyles() {
    let eventNode = this.props.eventNode;

    return this.props.nodesData.map((node) => {
      return {
        key: `${node.id}`,
        style: {
          x: eventNode.x0,
          y: eventNode.y0
        },
        data: node
      };
    });
  }

  getStyles() {
    return this.props.nodesData.map((node) => {
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
  nodesData: React.PropTypes.array.isRequired,
  eventNode: React.PropTypes.object.isRequired,
  onNodeClick: React.PropTypes.func.isRequired,
  onNodeBeginDrag: React.PropTypes.func.isRequired,
  onNodeEndDrag: React.PropTypes.func.isRequired,
  onNodeDrop: React.PropTypes.func.isRequired,
  onNodeDidDrop: React.PropTypes.func.isRequired
};
