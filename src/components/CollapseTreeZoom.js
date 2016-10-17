import React from 'react';
import d3 from 'd3';
import { DragDropContext } from 'react-dnd';
import MouseEventBackend from 'react-dnd-mouse-backend';

import { walkThroughTree } from '../utils/walkThroughTree';

import SvgChart from './SvgChart';
import Links from './Links';
import Nodes from './Nodes';

class CollapseTree extends React.Component {
  constructor(props) {
    super(props);

    var tree = d3.layout.tree().size([this.props.height, this.props.width]),
        nodes = tree.nodes(this.props.source),
        links = tree.links(nodes);

    nodes.forEach((d, index) => {
      d._children = undefined;
      d.id = index;
      d.y = d.depth * 180;
      d.x0 = d.x;
      d.y0 = d.y;
      d.isDisplay = true;
    });

    this.state = {
      isDragging: false,
      tree: tree,
      nodes: nodes,
      links: links,
      eventNode: nodes[0]
    };
  }

  render() {
    return (
      <SvgChart
        height={this.props.height}
        width={this.props.width}
        blockZooming={this.state.isDragging}
        >
        <Links
          linksData={this.state.links}
          eventNode={this.state.eventNode}
          isDragging={this.state.isDragging}
        />
        <Nodes
          nodesData={this.state.nodes}
          eventNode={this.state.eventNode}
          onNodeClick={this.handleNodeClick.bind(this)}
          onNodeBeginDrag={this.handleNodeBeginDrag.bind(this)}
          onNodeEndDrag={this.handleNodeEndDrag.bind(this)}
          onNodeDidDrop={this.handleNodeDidDrop.bind(this)}
        />
      </SvgChart>
    );
  }

  handleNodeBeginDrag(node) {
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

  handleNodeEndDrag(node) {
    walkThroughTree(node, (item) => { return item.children; }, (item) => { item.isDisplay = true; });

    this.setState({
      isDragging: false
    });
  }

  handleNodeDidDrop(droppedNode, draggedNode) {
    let tmpNodes = this.state.nodes.slice();
    let droppedIndex = tmpNodes.indexOf(droppedNode);
    let draggedIndex = tmpNodes.indexOf(draggedNode);

    if(droppedIndex == -1 || draggedIndex == -1)
      return;
    //move node to another node
    if(!!tmpNodes[droppedIndex].children) {
      droppedNode.children.push(draggedNode);
    } else if(!!tmpNodes[droppedIndex]._children) {
      droppedNode._children.push(draggedNode);
    } else {
      droppedNode.children = [];
      droppedNode.children.push(draggedNode);
    }

    //remove draggedNode from parant
    let indexInParant = draggedNode.parent.children.indexOf(draggedNode);
    draggedNode.parent = draggedNode.parent.children.splice(indexInParant, 1);

    let {
      x: endingX,
      y: endingY
    } = droppedNode;

    var newNodes = this.state.tree.nodes(this.props.source).map((d) => {
      d.y = d.depth * 180;
      return d;
    });
    let newLinks = this.state.tree.links(newNodes);
    this.setState({
      nodes: newNodes,
      links: newLinks,
      eventNode: {
        id: droppedNode.id,
        x: droppedNode.x,
        y: droppedNode.y,
        x0: endingX,
        y0: endingY
      }
    });
  }

  handleNodeClick(node) {
    let tmpNodes = this.state.nodes.slice();
    let index = tmpNodes.indexOf(node);
    let isUpdated = true;

    if(index == -1)
      return;

    if(!!tmpNodes[index].children) {
      tmpNodes[index]._children = tmpNodes[index].children;
      tmpNodes[index].children = undefined;
    } else if(!!tmpNodes[index]._children) {
      tmpNodes[index].children = tmpNodes[index]._children;
      tmpNodes[index]._children = undefined;
    } else {
      isUpdated = false;
    }

    if(isUpdated) {
      let {
        x: endingX,
        y: endingY
      } = node;

      tmpNodes.forEach((item) => {
        item.x0 = item.x;
        item.y0 = item.y;
      })

      var newNodes = this.state.tree.nodes(this.props.source).map((d) => {
        d.y = d.depth * 180;
        return d;
      });
      let newLinks = this.state.tree.links(newNodes);
      this.setState({
        nodes: newNodes,
        links: newLinks,
        eventNode: {
          id: node.id,
          x: node.x,
          y: node.y,
          x0: endingX,
          y0: endingY
        }
      });
    }
  }
};

CollapseTree.propTypes = {
  source: React.PropTypes.object.isRequired,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  depth: React.PropTypes.number
};

CollapseTree.defaultProps = {
  height: 1000,
  width: 1000,
  depth: 1
}

export default DragDropContext(MouseEventBackend)(CollapseTree);
