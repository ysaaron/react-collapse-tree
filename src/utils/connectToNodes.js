import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import d3 from 'd3';

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

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

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
      //onClick={() => { onNodeClick(nodeData) }}
      /**/
      let {
        connectDragSource,
        connectDropTarget,
        onNodeClick,
        isDragging,
        nodeData
      } = this.props
      // console.log(this.props.nodeData)
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
      } else {
        this.setState({
          isClick: false
        });
      }
    }

  }

  Wrapper.propsTypes = {
    onNodeClick: React.PropTypes.func.isRequired,
    onNodeBeginDrag: React.PropTypes.func.isRequired,
    onNodeEndDrag: React.PropTypes.func.isRequired,
    onNodeDidDrop: React.PropTypes.func.isRequired,
    nodeData: React.PropTypes.object.isRequired
  };

  let dndSource = DragSource('Node', nodeDragSource, dragCollect)(Wrapper);
  return DropTarget('Node', dropNodeTarget, collect)(dndSource);
}
