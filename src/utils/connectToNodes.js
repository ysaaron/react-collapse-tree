import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import d3 from 'd3';

let nodeDragSource = {
  beginDrag: function (props, monitor, component) {
    return {};
  }
};

function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    getDifferenceFromInitialOffset: monitor.getDifferenceFromInitialOffset()
  };
};

let nodeDropSource = {
  canDrop: function (props, monitor) {
    return true;
  }
};

function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
};

export default (WrapperedComponent, events) => {
  class Wrapper extends Component {
    constructor(props) {
      super(props);

      this._testOnClick = this._testOnClick.bind(this);
      this._getTranslate = this._getTranslate.bind(this);
    }

    render() {
      let connectToDrag = this.props.connectDragSource;
      let transform = this._getTranslate();
    	return connectToDrag(
      		<g onClick={this._testOnClick}
              transform={transform}>
      			<text>789</text>
      		</g>
	    );
    }

    _testOnClick() {
      // console.log(this)
      // this.props._toggleNode(this.props.nodeData);
    	// console.log('test in wrapper component');
    }

    _getTranslate() {
      let x, y;
      if(this.props.isDragging) {
        x = this.props.transformY + this.props.getDifferenceFromInitialOffset.x;
        y = this.props.transformX + this.props.getDifferenceFromInitialOffset.y;
      } else {
        x = this.props.transformY;
        y = this.props.transformX;
      }

      return `translate(${x}, ${y})`;
    }
  }

  Wrapper.propsTypes = {
    _toggleNode: React.PropTypes.func.isRequired,
    nodeData: React.PropTypes.object.isRequired
  };

  let source = DragSource('Node', nodeDragSource, dragCollect)(Wrapper);

  return source;
}
