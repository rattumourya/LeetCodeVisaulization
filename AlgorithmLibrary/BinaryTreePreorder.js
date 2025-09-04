// BSD-2-Clause license header from the original framework applies.

/*
 * BinaryTreePreorder.js - Animated solution for LeetCode 144
 * Builds a binary tree from level-order input and performs
 * preorder traversal with synchronized code highlighting.
 * Layout is optimized for 9:16 canvas (540x960).
 */

function BinaryTreePreorder(am, w, h) {
  this.init(am, w, h);
}

BinaryTreePreorder.prototype = new Algorithm();
BinaryTreePreorder.prototype.constructor = BinaryTreePreorder;
BinaryTreePreorder.superclass = Algorithm.prototype;

BinaryTreePreorder.prototype.init = function (am, w, h) {
  BinaryTreePreorder.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.arr = [];
  this.root = null;
  this.outputIDs = [];
  this.outputNextX = 0;
  this.outputY = 0;
  this.codeLineID = [];
};

BinaryTreePreorder.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Tree (level-order, use null for empty):");
  this.inputField = addControlToAlgorithmBar("Text", "");
  this.inputField.size = 40;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Tree");
  this.buildButton.onclick = this.buildTreeCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Traverse");
  this.startButton.onclick = this.startCallback.bind(this);

  this.controls.push(this.inputField, this.buildButton, this.startButton);
};

BinaryTreePreorder.prototype.buildTreeCallback = function () {
  const raw = this.inputField.value.trim();
  if (!raw) return;
  const vals = raw
    .split(/[\s,]+/)
    .map((v) => (v === "null" || v === "NULL" || v === "None" ? null : v));
  this.arr = vals;
  this.reset();
};

function PTNode(val) {
  this.val = val;
  this.left = null;
  this.right = null;
  this.x = 0;
  this.y = 0;
  this.id = -1;
}

BinaryTreePreorder.prototype.buildTreeFromArray = function (arr) {
  if (!arr || arr.length === 0) return null;
  const nodes = arr.map((v) => (v === null ? null : new PTNode(v)));
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]) {
      const li = 2 * i + 1;
      const ri = 2 * i + 2;
      if (li < nodes.length) nodes[i].left = nodes[li];
      if (ri < nodes.length) nodes[i].right = nodes[ri];
    }
  }
  return nodes[0];
};

BinaryTreePreorder.prototype.layoutTree = function () {
  const canvasElem = document.getElementById("canvas");
  const w = canvasElem ? canvasElem.width : 540;
  const startY = 80;
  const levelHeight = 90;
  const recurse = (node, x, y, offset) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.left) recurse(node.left, x - offset, y + levelHeight, offset / 2);
    if (node.right) recurse(node.right, x + offset, y + levelHeight, offset / 2);
  };
  recurse(this.root, w / 2, startY, w / 4);
};

BinaryTreePreorder.prototype.setup = function () {
  if (!this.arr || this.arr.length === 0) {
    this.arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }
  this.root = this.buildTreeFromArray(this.arr);
  this.layoutTree();

  this.commands = [];
  const canvasElem = document.getElementById("canvas");
  const canvasW = canvasElem ? canvasElem.width : 540;
  const canvasH = canvasElem ? canvasElem.height : 960;

  // Title at the top of the canvas
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Binary Tree Preorder Traversal (LeetCode 144)",
    canvasW / 2,
    30,
    1
  );
  this.cmd("SetForegroundColor", this.titleID, "#000");
  this.cmd("SetTextStyle", this.titleID, "bold 20");

  // Build tree nodes
  const queue = [];
  if (this.root) {
    this.root.id = this.nextIndex++;
    this.cmd("CreateCircle", this.root.id, this.root.val, this.root.x, this.root.y);
    this.cmd("SetHighlight", this.root.id, 1);
    this.cmd("Step");
    this.cmd("SetHighlight", this.root.id, 0);
    queue.push(this.root);
  }
  while (queue.length > 0) {
    const node = queue.shift();
    if (node.left) {
      node.left.id = this.nextIndex++;
      this.cmd("CreateCircle", node.left.id, node.left.val, node.left.x, node.left.y);
      this.cmd("Connect", node.id, node.left.id);
      this.cmd("SetHighlight", node.left.id, 1);
      this.cmd("Step");
      this.cmd("SetHighlight", node.left.id, 0);
      queue.push(node.left);
    }
    if (node.right) {
      node.right.id = this.nextIndex++;
      this.cmd("CreateCircle", node.right.id, node.right.val, node.right.x, node.right.y);
      this.cmd("Connect", node.id, node.right.id);
      this.cmd("SetHighlight", node.right.id, 1);
      this.cmd("Step");
      this.cmd("SetHighlight", node.right.id, 0);
      queue.push(node.right);
    }
  }

  // Output area in middle section
  this.outputLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.outputLabelID, "Output:", 20, Math.floor(canvasH / 2), 0);
  this.cmd("SetForegroundColor", this.outputLabelID, "#000000");
  this.outputNextX = 120;
  this.outputY = Math.floor(canvasH / 2);
  this.outputIDs = [];

  // Structured pseudocode in bottom section
  this.codeLines = [
    "function preorder(node) {",
    "  if (node === null) {",
    "    return;",
    "  }",
    "  visit(node);",
    "  preorder(node.left);",
    "  preorder(node.right);",
    "}",
  ];
  this.codeLineID = new Array(this.codeLines.length);
  const CODE_LINE_H = 24;
  const codeY = this.outputY + 80;
  const codeX = canvasW / 2;
  for (let i = 0; i < this.codeLines.length; i++) {
    const id = this.nextIndex++;
    this.codeLineID[i] = id;
    this.cmd("CreateLabel", id, this.codeLines[i], codeX, codeY + i * CODE_LINE_H, 1);
    this.cmd("SetForegroundColor", id, "#000");
    this.cmd("SetTextSize", id, 20);
  }

  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.clearHistory();
};

BinaryTreePreorder.prototype.reset = function () {
  this.nextIndex = 0;
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

BinaryTreePreorder.prototype.startCallback = function () {
  if (!this.root) return;
  this.implementAction(this.traverseTree.bind(this), 0);
};

BinaryTreePreorder.prototype.showCode = function (lineIndex) {
  if (!this.codeLineID) return;
  for (let i = 0; i < this.codeLineID.length; i++) {
    this.cmd("SetHighlight", this.codeLineID[i], i === lineIndex ? 1 : 0);
  }
  this.cmd("Step");
};

BinaryTreePreorder.prototype.traverseTree = function () {
  this.commands = [];
  this.showCode(0);
  const traverse = (node) => {
    this.showCode(1);
    if (!node) {
      this.showCode(2);
      this.showCode(3);
      return;
    }
    this.showCode(4);
    this.cmd("SetHighlight", node.id, 1);
    this.cmd("Step");
    const labelID = this.nextIndex++;
    this.cmd("CreateLabel", labelID, node.val, node.x, node.y);
    this.cmd("Move", labelID, this.outputNextX, this.outputY);
    this.cmd("Step");
    this.cmd("SetHighlight", node.id, 0);
    this.outputIDs.push(labelID);
    this.outputNextX += 40;
    this.showCode(5);
    traverse(node.left);
    this.showCode(6);
    traverse(node.right);
    this.showCode(7);
  };
  traverse(this.root);
  return this.commands;
};

BinaryTreePreorder.prototype.disableUI = function () {
  for (let i = 0; i < this.controls.length; i++) this.controls[i].disabled = true;
};

BinaryTreePreorder.prototype.enableUI = function () {
  for (let i = 0; i < this.controls.length; i++) this.controls[i].disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new BinaryTreePreorder(animManag, canvas.width, canvas.height);
}

