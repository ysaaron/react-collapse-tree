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
