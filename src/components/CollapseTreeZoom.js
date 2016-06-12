import React from 'react';
import d3 from 'd3';
import { DragDropContext } from 'react-dnd';
import MouseEventBackend from 'react-dnd-mouse-backend';

import SvgChart from './SvgChart';
import Links from './Links';
import Nodes from './Nodes';

let treeLayout = function function_name(argument) {
  // body...
}

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
    });

    this.state = {
      tree: tree,
      nodes: nodes,
      links: links,
      sourceNode: nodes[0]
    };
  }

  render() {
    return (
      <SvgChart height={this.props.height}
                width={this.props.width}>
        <Links linkData={this.state.links}
                startingNode={this.state.sourceNode} />
        <Nodes nodeData={this.state.nodes}
                onNodeClick={this._onNodeClick.bind(this)}
                startingNode={this.state.sourceNode} />
      </SvgChart>
    );
  }

  _onNodeClick(node) {
    var tmpNodes = this.state.nodes.slice();
    var index = tmpNodes.indexOf(node);
    var isUpdated = true;

    if(index == "-1")
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
