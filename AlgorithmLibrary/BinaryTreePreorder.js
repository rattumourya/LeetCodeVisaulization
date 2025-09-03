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
  this.implementAction(this.buildTree.bind(this), 0);
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

  // Build using a sequential level-order process so inputs like
  // "1,null,3,4,7" (missing left child at root) are handled correctly.
  const rootVal = arr[0];
  if (rootVal === null) return null;

  const root = new PTNode(rootVal);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();
    if (!node) continue;

    const leftVal = arr[i++];
    if (leftVal !== undefined && leftVal !== null) {
      node.left = new PTNode(leftVal);
      queue.push(node.left);
    }

    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) {
        node.right = new PTNode(rightVal);
        queue.push(node.right);
      }
    }
  }

  return root;
};

BinaryTreePreorder.prototype.layoutTree = function () {
  const canvasElem = document.getElementById("canvas");
  const w = canvasElem ? canvasElem.width : 540;
  const startY = 110; // leave room for the canvas title
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

BinaryTreePreorder.prototype.buildTree = function () {
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.nextIndex = 0;

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

  // Output label centered vertically in middle section
  this.outputLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.outputLabelID, "Output:", 20, Math.floor(canvasH / 2), 0);
  this.cmd("SetForegroundColor", this.outputLabelID, "#000000");
  this.cmd("SetTextStyle", this.outputLabelID, "bold 16");
  this.outputNextX = 120;
  this.outputY = Math.floor(canvasH / 2);
  this.outputIDs = [];

  // Structured pseudocode displayed at the top of the bottom section
  this.codeLines = [
    "void preorder(TreeNode node) {",
    "  if (node == null) {",
    "    return;",
    "  }",
    "  visit(node);",
    "  preorder(node.left);",
    "  preorder(node.right);",
    "}",
  ];
  this.codeLineID = new Array(this.codeLines.length);
  const CODE_LINE_H = 24;
  const codeY = this.outputY + 80; // Margin below the middle output row
  const codeX = (canvasElem ? canvasElem.width : 540) / 2;
  for (let i = 0; i < this.codeLines.length; i++) {
    const id = this.nextIndex++;
    this.codeLineID[i] = id;
    this.cmd("CreateLabel", id, this.codeLines[i], codeX, codeY + i * CODE_LINE_H, 1);
    this.cmd("SetForegroundColor", id, "#000");
    this.cmd("SetTextStyle", id, 20);
  }
  this.cmd("Step");
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

  return this.commands;
};

// No separate reset; buildTree clears existing objects.

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
