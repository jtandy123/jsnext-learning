function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}

function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}

function make(array) {
  if (!array || array.length === 0) {
    return null;
  }
  if (array.length === 1) {
    return new Tree(null, array[0], null);
  }
  return new Tree(make(array[0]), array[1], make(array[2]));
}

const tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

// eslint-disable-next-line no-restricted-syntax
for (const node of inorder(tree)) {
  // eslint-disable-next-line no-console
  console.log(node);
}
