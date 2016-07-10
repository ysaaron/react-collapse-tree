import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

export default (DecoratedComponent) => {
  class Wrapper extends Component {
    constructor(props) {
      super(props);

      this.isMouseDown = false;
      this.isMouseMoving = false;
      this.getTranslate = this.getTranslate.bind(this);

      this.state = {
        isClick: true
      };
    }

    render() {
      let {
        connectDragSource,
        connectDropTarget,
        isDragging,
        nodeData
      } = this.props

      let transform = this.getTranslate();
      let component = connectDragSource(
      		<g transform={transform}
            style={{
              display: nodeData.isDisplay ? '' : 'none'
            }}
            onMouseDown={this.onMouseDown.bind(this)}
            onMouseMove={this.onMouseMove.bind(this)}
            onMouseUp={this.onMouseUp.bind(this)}>
      			<DecoratedComponent
                {...this.props}
                {...this.state} />
      		</g>);

      return connectDropTarget(component);
    }

    getTranslate() {
      let x = 0, y = 0;
      if(this.props.isDragging && this.props.getDifferenceFromInitialOffset !== null) {
        x = this.props.transformY + this.props.getDifferenceFromInitialOffset.x;
        y = this.props.transformX + this.props.getDifferenceFromInitialOffset.y;
      } else {
        x = this.props.transformY;
        y = this.props.transformX;
      }

      return `translate(${x}, ${y})`;
    }

    onMouseDown() {
      this.isMouseDown = true;
      this.isMouseMoving = false;
    }

    onMouseMove() {
      this.isMouseMoving = true;
    }

    onMouseUp() {
      if(this.isMouseDown && !this.isMouseMoving) {
        this.setState({
          isClick: true
        });
        this.props.onNodeClick(this.props.nodeData);
      } else {
        this.setState({
          isClick: false
        });
      }

      this.isMouseDown = false;
    }

  }

  Wrapper.propsTypes = {
    onNodeClick: React.PropTypes.func.isRequired,
    onNodeBeginDrag: React.PropTypes.func.isRequired,
    onNodeEndDrag: React.PropTypes.func.isRequired,
    onNodeDidDrop: React.PropTypes.func.isRequired,
    nodeData: React.PropTypes.object.isRequired
  };

  let nodeDragSource = {
    canDrag: (props, monitor) => {
      return typeof(props.nodeData.parent) !== 'string';
    },
    beginDrag: (props, monitor, component) => {
      props.onNodeBeginDrag(props.nodeData);
      return props.nodeData;
    },
    endDrag: (props, monitor, component) => {
      props.onNodeEndDrag(props.nodeData);
    }
  };

  function dragCollect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
      getDifferenceFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
      didDrop: monitor.didDrop()
    };
  };

  let dropNodeTarget = {
    canDrop: function (props, monitor) {
      return props.nodeData.id !== monitor.getItem().id;
    },
    drop: function(props, monitor, component) {
      props.onNodeDidDrop(props.nodeData, monitor.getItem());
      return props;
    }
  };

  function dropCollect(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget()
    };
  }

  let dndSource = DragSource('Node', nodeDragSource, dragCollect)(Wrapper);
  return DropTarget('Node', dropNodeTarget, dropCollect)(dndSource);
}
