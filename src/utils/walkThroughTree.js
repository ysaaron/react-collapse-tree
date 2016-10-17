export function walkThroughTree(node, getChildren = () => {}, cb = () => {}) {
  let children = getChildren(node);
  if(!children || children == null)
    return;

  let nodesStack = [].concat(children);

  while(nodesStack.length > 0) {
    let targetNode = nodesStack.pop();

    children = getChildren(targetNode);
    if(!!children || children != null)
      nodesStack = nodesStack.concat(children);

    cb(targetNode);
  }
}

export function removeNodeFromParent(targetNode) {
  let targetNodeIndexInParant = targetNode.parent.children.indexOf(targetNode);
  targetNode.parent = targetNode.parent.children.splice(targetNodeIndexInParant, 1);
}

export function collapseTree(targetNode) {
  if(!!targetNode.children) {
    targetNode._children = targetNode.children;
    targetNode.children = undefined;
  } else if(!!targetNode._children) {
    targetNode.children = targetNode._children;
    targetNode._children = undefined;
  }
}

export function moveNodeToOtherNode(droppedNode, draggedNode) {
  if(!!droppedNode.children) {
    droppedNode.children.push(draggedNode);
  } else if(!!droppedNode._children) {
    droppedNode._children.push(draggedNode);
  } else {
    droppedNode.children = [];
    droppedNode.children.push(draggedNode);
  }
}
