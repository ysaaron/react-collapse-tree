import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import d3 from 'd3';

let nodeDragSource = {
  beginDrag: (props, monitor, component) => {
    props.onNodeDrag(props.nodeData, true);
    return props.nodeData;
  },
  endDrag: (props, monitor, component) => {
    props.onNodeDrag(props.nodeData, false);
  }
};

function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    getDifferenceFromInitialOffset: monitor.getDifferenceFromInitialOffset()
  };
};

let dropNodeTarget = {
  canDrop: function (props, monitor) {
    console.log(monitor.getItem());
    return props.nodeData.id !== monitor.getItem().id;
  },
  drop: function(props, monitor, component) {
    console.log(props);
    return props;
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

export default (WrapperedComponent, events) => {
  class Wrapper extends Component {
    constructor(props) {
      super(props);

      this._testOnClick = this._testOnClick.bind(this);
      this._getTranslate = this._getTranslate.bind(this);
    }

    render() {
      let {
        connectDragSource,
        connectDropTarget
      } = this.props
      let transform = this._getTranslate();
      let source = connectDragSource(
      		<g onClick={this._testOnClick}
              transform={transform}>
      			<text>789</text>
      		</g>
        );

      return connectDropTarget(source);
    }

    _testOnClick() {
      // console.log(this)
      // this.props._toggleNode(this.props.nodeData);
    	// console.log('test in wrapper component');
    }

    _getTranslate() {
      let x = 0, y = 0;
      if(this.props.isDragging) {
        let offsetX = 0, offsetY = 0;
        if(this.props.getDifferenceFromInitialOffset !== null){
          offsetX = this.props.getDifferenceFromInitialOffset.x;
          offsetY = this.props.getDifferenceFromInitialOffset.y;
        }

        x = this.props.transformY + offsetX;
        y = this.props.transformX + offsetY;
      } else {
        x = this.props.transformY;
        y = this.props.transformX;
      }

      return `translate(${x}, ${y})`;
    }
  }

  Wrapper.propsTypes = {
    onNodeClick: React.PropTypes.func.isRequired,
    onNodeDrag: React.PropTypes.func,
    nodeData: React.PropTypes.object.isRequired
  };

  Wrapper.defaultProps = {
    onNodeDrag: () => false
  }

  class DropContainer extends Component {
    constructor(props) {
      super(props)
    }

    render() {
      let {
        connectDropTarget
      } = this.props;

      return connectDropTarget(
        <g
        transform={`translate(${this.props.y}, ${this.props.x})`}
        style={{
          opacity: 0
        }}>
          <text>789</text>
        </g>
      )
    }
  }

  let source = DragSource('Node', nodeDragSource, dragCollect)(Wrapper);
  return DropTarget('Node', dropNodeTarget, collect)(source)

  // return {
  //   DragWrapper: ,
  //   DropWrapper:
  // };
}
