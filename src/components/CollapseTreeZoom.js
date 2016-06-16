import React from 'react';
import d3 from 'd3';
import { DragDropContext } from 'react-dnd';
import MouseEventBackend from 'react-dnd-mouse-backend';

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
      d.children = undefined;
      d.id = index;
      d.y = d.depth * 180;
      d.x0 = d.x;
      d.y0 = d.y;
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
      <SvgChart height={this.props.height}
                width={this.props.width}
                blockZooming={this.state.isDragging}>
        <Links linksData={this.state.links}
                eventNode={this.state.eventNode}
                isDragging={this.state.isDragging} />
        <Nodes nodesData={this.state.nodes}
                eventNode={this.state.eventNode}
                onNodeClick={this.onNodeClick.bind(this)}
                onNodeBeginDrag={this.onNodeBeginDrag.bind(this)}
                onNodeEndDrag={this.onNodeEndDrag.bind(this)}
                onNodeDrop={this.onNodeDrop.bind(this)}
                onNodeDidDrop={this.onNodeDidDrop.bind(this)} />
      </SvgChart>
    );
  }

  onNodeBeginDrag(node) {
    this.setState({
      isDragging: true
    });
  }

  onNodeEndDrag(node) {
    this.setState({
      isDragging: false
    });
  }

  onNodeDrop(draggedNode, offset) {
    console.log(draggedNode);
    console.log(offset);
  }

  onNodeDidDrop(droppedNode, draggedNode) {
    console.log(droppedNode);
    console.log(draggedNode);
  }

  onNodeClick(node) {
    var tmpNodes = this.state.nodes.slice();
    var index = tmpNodes.indexOf(node);
    var isUpdated = true;

    if(index == "-1")
      return;

    if(!!tmpNodes[index].children) {
      tmpNodes[index].children = tmpNodes[index].children;
      tmpNodes[index].children = undefined;
    } else if(!!tmpNodes[index].children) {
      tmpNodes[index].children = tmpNodes[index].children;
      tmpNodes[index].children = undefined;
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
      var newLinks = this.state.tree.links(newNodes);

      this.setState({
        nodes: newNodes,
        links: newLinks,
        sourceNode: {
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
