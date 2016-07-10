import React from 'react';
import { DragDropContext } from 'react-dnd';
import MouseEventBackend from 'react-dnd-mouse-backend';

import { walkThroughTree, removeNodeFromParent, collapseTree, moveNodeToOtherNode } from '../utils/walkThroughTree';
import { getTreeHandler, diagonal } from '../utils/treeHandler';

import SvgChart from './SvgChart';
import Links from './Links';
import Nodes from './Nodes';

let tree = undefined;
let dia = undefined;

class CollapseTree extends React.Component {
  constructor(props) {
    super(props);

    tree = getTreeHandler([this.props.height, this.props.width], this.props.getChildren);
    console.log(dia)
    let nodes = tree.nodes(this.props.source).map((d, index) => {
      d.id = index;
      let axis = props.getAxis(d);
      d.x = axis[0];
      d.y = axis[1];
      d.x0 = d.x;
      d.y0 = d.y;
      d.isDisplay = true;
      return d;
    }),
    links = tree.links(nodes);

    this.state = {
      isDragging: false,
      nodes: nodes,
      links: links,
      eventNode: nodes[0]
    };
  }

  render() {
    return (
      <SvgChart height={this.props.height}
                width={this.props.width}
                blockZooming={this.state.isDragging}>
        <Links linksData={this.state.links}
                eventNode={this.state.eventNode}
                isDragging={this.state.isDragging}
                diagonal={diagonal(this.props.getAxis)}
                getAxis={this.props.getAxis} />
        <Nodes nodesData={this.state.nodes}
                eventNode={this.state.eventNode}
                onNodeClick={this.onNodeClick.bind(this)}
                onNodeBeginDrag={this.onNodeBeginDrag.bind(this)}
                onNodeEndDrag={this.onNodeEndDrag.bind(this)}
                onNodeDidDrop={this.onNodeDidDrop.bind(this)}
                getAxis={this.props.getAxis} />
      </SvgChart>
    );
  }

  onNodeBeginDrag(node) {
    walkThroughTree(node, (item) => { return item.children; }, (item) => { item.isDisplay = false; });

    let {
      x: endingX,
      y: endingY
    } = node;

    this.setState({
      isDragging: true,
      nodes: this.state.nodes,
      eventNode: {
        id: node.id,
        x: node.x,
        y: node.y,
        x0: endingX,
        y0: endingY
      }
    });
  }

  onNodeEndDrag(node) {
    walkThroughTree(node, (item) => { return item.children; }, (item) => { item.isDisplay = true; });

    this.setState({
      isDragging: false
    });
  }

  onNodeDidDrop(droppedNode, draggedNode) {
    let tmpNodes = this.state.nodes.slice();
    let droppedIndex = tmpNodes.indexOf(droppedNode), draggedIndex = tmpNodes.indexOf(draggedNode);

    if(droppedIndex == -1 || draggedIndex == -1)
      return;

    moveNodeToOtherNode(droppedNode, draggedNode);
    removeNodeFromParent(draggedNode);

    let {
      x: endingX,
      y: endingY
    } = droppedNode;

    let newNodes = tree.nodes(this.props.source).map((d) => {
      let axis = this.props.getAxis(d);
      d.x = axis[0];
      d.y = axis[1];
      return d;
    });

    this.setState({
      nodes: newNodes,
      links: tree.links(newNodes),
      eventNode: {
        id: droppedNode.id,
        x: droppedNode.x,
        y: droppedNode.y,
        x0: endingX,
        y0: endingY
      }
    });
  }

  onNodeClick(node) {
    let tmpNodes = this.state.nodes.slice();
    let index = tmpNodes.indexOf(node);

    if(index == -1)
      return;

    collapseTree(node);

    let {
      x: endingX,
      y: endingY
    } = node;

    tmpNodes.forEach((item) => {
      item.x0 = item.x;
      item.y0 = item.y;
    })

    let newNodes = tree.nodes(this.props.source).map((d) => {
      let axis = this.props.getAxis(d);
      d.x = axis[0];
      d.y = axis[1];
      return d;
    });

    this.setState({
      nodes: newNodes,
      links: tree.links(newNodes),
      eventNode: {
        id: node.id,
        x: node.x,
        y: node.y,
        x0: endingX,
        y0: endingY
      }
    });
  }
};

CollapseTree.propTypes = {
  source: React.PropTypes.object.isRequired,
  getChildren: React.PropTypes.func,
  getAxis: React.PropTypes.func,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
};

CollapseTree.defaultProps = {
  height: 500,
  width: 500,
  getChildren: (node) => { return node.children; },
  getAxis: (node) => { return [node.x, node.y] }
}

export default DragDropContext(MouseEventBackend)(CollapseTree);
