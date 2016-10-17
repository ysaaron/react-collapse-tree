import d3 from 'd3';

export function getTreeHandler(size, getChildren) {
 if(!size || !getChildren)
  return;

 return d3.layout.tree().size(size).children(getChildren);
}

export function diagonal(custom) {
 return d3.svg.diagonal().projection(custom);
}
