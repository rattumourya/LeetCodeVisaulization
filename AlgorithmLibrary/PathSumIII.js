// BSD-2-Clause license header retained from original framework.

/*
 * PathSumIII.js - Visualization for LeetCode 437 Path Sum III.
 * Simplified animation highlighting tree traversal with a moving
 * red circle synchronized with Java code execution.
 */

function PathSumIII(am, w, h) { this.init(am, w, h); }

PathSumIII.prototype = new Algorithm();
PathSumIII.prototype.constructor = PathSumIII;
PathSumIII.superclass = Algorithm.prototype;

// Code display constants
PathSumIII.CODE_FONT_SIZE = 17;
PathSumIII.CODE_LINE_HEIGHT = 23;
PathSumIII.CODE_STANDARD_COLOR = "#000000";
PathSumIII.CODE_HIGHLIGHT_COLOR = "#FF0000";

PathSumIII.CODE = [
  "int pathSum(TreeNode root, int k) {",
  "    Map<Integer,Integer> map = new HashMap<>();",
  "    map.put(0, 1);",
  "    return dfs(root, 0, k, map);",
  "}",
  "int dfs(TreeNode node, int prefix, int k, Map<Integer,Integer> map) {",
  "    if (node == null) return 0;",
  "    prefix += node.val;",
  "    int count = 0;",
  "    if (map.containsKey(prefix - k)) count = map.get(prefix - k);",
  "    map.put(prefix, map.getOrDefault(prefix, 0) + 1);",
  "    count += dfs(node.left, prefix, k, map);",
  "    count += dfs(node.right, prefix, k, map);",
  "    map.put(prefix, map.get(prefix) - 1);",
  "    prefix -= node.val;",
  "    return count;",
  "}",
];

PathSumIII.prototype.init = function (am, w, h) {
  PathSumIII.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.arr = [];
  this.k = 0;
  this.rootID = -1;

  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};
  this.nodeX = {};
  this.nodeY = {};

  this.codeIDs = [];
  this.travID = -1;
  this.resultID = -1;

  // build default example on load
  this.reset();
  this.buildTreeCallback();
};

PathSumIII.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Tree (level-order):");
  this.inputField = addControlToAlgorithmBar("Text", "");
  this.inputField.size = 40;

  addLabelToAlgorithmBar("Target:");
  this.kField = addControlToAlgorithmBar("Text", "8");
  this.kField.size = 5;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Binary Tree");
  this.buildButton.onclick = this.buildTreeCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Find Path");
  this.startButton.onclick = this.startCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.pauseButton = addControlToAlgorithmBar("Button", "Pause / Play");
  this.pauseButton.onclick = this.pauseCallback.bind(this);

  this.stepButton = addControlToAlgorithmBar("Button", "Next Step");
  this.stepButton.onclick = this.stepCallback.bind(this);

  this.controls.push(
    this.inputField,
    this.kField,
    this.buildButton,
    this.startButton
  );
};

PathSumIII.prototype.buildTreeCallback = function () {
  const raw = this.inputField.value.trim();
  if (raw.length > 0) {
    this.arr = raw
      .split(/[\s,]+/)
      .map((v) =>
        v === "null" || v === "NULL" || v === "None" ? null : parseInt(v)
      );
  } else {
    this.arr = [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1];
  }
  const t = parseInt(this.kField.value);
  if (!isNaN(t)) this.k = t;
  this.reset();
  this.implementAction(this.setup.bind(this), 0);
};

function TreeNode(val) {
  this.val = val;
  this.left = null;
  this.right = null;
  this.x = 0;
  this.y = 0;
  this.id = -1;
}

PathSumIII.prototype.buildTreeFromArray = function (arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null && leftVal !== undefined) {
        node.left = new TreeNode(leftVal);
        queue.push(node.left);
      }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null && rightVal !== undefined) {
        node.right = new TreeNode(rightVal);
        queue.push(node.right);
      }
    }
  }
  return root;
};

PathSumIII.prototype.layoutTree = function (root) {
  const canvasElem = document.getElementById("canvas");
  const w = canvasElem ? canvasElem.width : 540;
  const startY = 100;
  const levelH = 80;
  const recurse = (node, x, y, offset) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.left) recurse(node.left, x - offset, y + levelH, offset / 2);
    if (node.right) recurse(node.right, x + offset, y + levelH, offset / 2);
  };
  recurse(root, w / 2, startY, w / 4);
};

PathSumIII.prototype.setup = function () {
  this.commands = [];

  // Measure code width for centering
  let maxWidth = 0;
  const measureCtx = document.createElement("canvas").getContext("2d");
  if (measureCtx) {
    measureCtx.font = PathSumIII.CODE_FONT_SIZE + "px Arial";
    for (const line of PathSumIII.CODE) {
      const w = measureCtx.measureText(line).width;
      if (w > maxWidth) maxWidth = w;
    }
    if (maxWidth === 0) {
      const charW =
        measureCtx.measureText("M").width || PathSumIII.CODE_FONT_SIZE * 0.6;
      maxWidth = charW * Math.max(...PathSumIII.CODE.map((s) => s.length));
    }
  } else {
    maxWidth =
      PathSumIII.CODE_FONT_SIZE * 0.6 * Math.max(...PathSumIII.CODE.map((s) => s.length));
  }

  const baseW = 540;
  const canvasW = Math.max(baseW, Math.ceil(maxWidth) + 20);
  const canvasH = 960;
  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    canvasElem.width = canvasW;
    canvasElem.height = canvasH;
    if (animationManager && animationManager.animatedObjects) {
      animationManager.animatedObjects.width = canvasW;
      animationManager.animatedObjects.height = canvasH;
    }
  }

  if (!this.arr || this.arr.length === 0) {
    this.arr = [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1];
    this.k = 8;
  }
  if (this.inputField) this.inputField.value = this.arr.join(",");
  if (this.kField) this.kField.value = String(this.k);

  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};
  this.nodeX = {};
  this.nodeY = {};

  this.root = this.buildTreeFromArray(this.arr);
  this.layoutTree(this.root);

  // Title and result label
  this.titleID = this.nextIndex++;
  this.cmd("CreateLabel", this.titleID, "PathSumIII (Leetcode 437)", canvasW / 2, 40, 1);
  this.cmd("SetTextStyle", this.titleID, "bold 24");

  this.resultID = this.nextIndex++;
  this.cmd("CreateLabel", this.resultID, "Paths: 0", canvasW / 2, 70, 0);
  this.cmd("SetTextStyle", this.resultID, "bold 16");

  // Draw tree and record node positions
  let maxY = 0;
  const queue = [];
  if (this.root) {
    this.root.id = this.nextIndex++;
    this.cmd("CreateCircle", this.root.id, this.root.val, this.root.x, this.root.y);
    this.cmd("SetForegroundColor", this.root.id, "#000");
    this.cmd("SetBackgroundColor", this.root.id, "#FFF");
    this.cmd("Step");
    queue.push(this.root);
    this.rootID = this.root.id;
    maxY = this.root.y;
  }
  while (queue.length > 0) {
    const node = queue.shift();
    this.nodeValue[node.id] = node.val;
    this.nodeX[node.id] = node.x;
    this.nodeY[node.id] = node.y;
    if (node.y > maxY) maxY = node.y;
    if (node.left) {
      node.left.id = this.nextIndex++;
      this.cmd("CreateCircle", node.left.id, node.left.val, node.left.x, node.left.y);
      this.cmd("SetForegroundColor", node.left.id, "#000");
      this.cmd("SetBackgroundColor", node.left.id, "#FFF");
      this.cmd("Connect", node.id, node.left.id);
      this.cmd("Step");
      queue.push(node.left);
    }
    if (node.right) {
      node.right.id = this.nextIndex++;
      this.cmd("CreateCircle", node.right.id, node.right.val, node.right.x, node.right.y);
      this.cmd("SetForegroundColor", node.right.id, "#000");
      this.cmd("SetBackgroundColor", node.right.id, "#FFF");
      this.cmd("Connect", node.id, node.right.id);
      this.cmd("Step");
      queue.push(node.right);
    }
    this.leftChild[node.id] = node.left ? node.left.id : null;
    this.rightChild[node.id] = node.right ? node.right.id : null;
  }

  // Code block centered horizontally with left indentation
  const codeStartX = Math.round((canvasW - maxWidth) / 2);
  const codeStartY = maxY + 80;
  for (let i = 0; i < PathSumIII.CODE.length; i++) {
    const id = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      id,
      PathSumIII.CODE[i],
      codeStartX,
      codeStartY + i * PathSumIII.CODE_LINE_HEIGHT,
      0,
      PathSumIII.CODE_FONT_SIZE,
      "left"
    );
    this.cmd("SetForegroundColor", id, PathSumIII.CODE_STANDARD_COLOR);
    this.codeIDs.push(id);
  }

  return this.commands;
};

PathSumIII.prototype.highlight = function (line) {
  for (let i = 0; i < this.codeIDs.length; i++) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[i],
      i === line ? PathSumIII.CODE_HIGHLIGHT_COLOR : PathSumIII.CODE_STANDARD_COLOR
    );
  }
};

PathSumIII.prototype.startCallback = function () {
  if (this.rootID === -1) return;
  this.disableUI();
  this.implementAction(this.runDFS.bind(this), 0);
};

PathSumIII.prototype.runDFS = function () {
  this.commands = [];
  this.map = { 0: 1 };
  this.count = 0;

  this.highlight(0);
  this.cmd("Step");
  this.highlight(1);
  this.cmd("Step");
  this.highlight(2);
  this.cmd("Step");
  this.highlight(3);
  this.cmd("Step");
  this.highlight(5);
  this.cmd("Step");

  // traversal highlight circle
  this.travID = this.nextIndex++;
  this.cmd(
    "CreateHighlightCircle",
    this.travID,
    "#FF0000",
    this.nodeX[this.rootID],
    this.nodeY[this.rootID]
  );
  this.cmd("Move", this.travID, this.nodeX[this.rootID], this.nodeY[this.rootID]);
  this.cmd("Step");

  const dfs = (nodeID, prefix) => {
    this.highlight(6);
    if (nodeID == null) {
      this.cmd("Step");
      return 0;
    }
    this.cmd("Step");

    this.highlight(7);
    prefix += this.nodeValue[nodeID];
    this.cmd("Step");

    this.highlight(8);
    let countLocal = 0;
    this.cmd("Step");

    this.highlight(9);
    const need = prefix - this.k;
    if (this.map[need]) countLocal = this.map[need];
    this.cmd("Step");

    this.highlight(10);
    this.map[prefix] = (this.map[prefix] || 0) + 1;
    this.cmd("Step");

    this.highlight(11);
    if (this.leftChild[nodeID] != null) {
      this.cmd(
        "Move",
        this.travID,
        this.nodeX[this.leftChild[nodeID]],
        this.nodeY[this.leftChild[nodeID]]
      );
      this.cmd("Step");
      countLocal += dfs(this.leftChild[nodeID], prefix);
      this.cmd("Move", this.travID, this.nodeX[nodeID], this.nodeY[nodeID]);
      this.cmd("Step");
    }

    this.highlight(12);
    if (this.rightChild[nodeID] != null) {
      this.cmd(
        "Move",
        this.travID,
        this.nodeX[this.rightChild[nodeID]],
        this.nodeY[this.rightChild[nodeID]]
      );
      this.cmd("Step");
      countLocal += dfs(this.rightChild[nodeID], prefix);
      this.cmd("Move", this.travID, this.nodeX[nodeID], this.nodeY[nodeID]);
      this.cmd("Step");
    }

    this.highlight(13);
    this.map[prefix]--;
    if (this.map[prefix] === 0) delete this.map[prefix];
    this.cmd("Step");

    this.highlight(14);
    prefix -= this.nodeValue[nodeID];
    this.cmd("Step");

    this.highlight(15);
    this.cmd("Step");
    return countLocal;
  };

  const total = dfs(this.rootID, 0);
  this.highlight(16);
  this.cmd("Step");
  this.cmd("SetText", this.resultID, "Paths: " + total);
  this.cmd("Step");

  this.enableUI();
  return this.commands;
};

PathSumIII.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") doPlayPause();
};

PathSumIII.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") doPlayPause();
    animationManager.step();
  }
};

PathSumIII.prototype.reset = function () {
  this.nextIndex = 0;
  this.rootID = -1;
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
};

PathSumIII.prototype.disableUI = function () {
  for (let c of this.controls) c.disabled = true;
};

PathSumIII.prototype.enableUI = function () {
  for (let c of this.controls) c.disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new PathSumIII(animManag, canvas.width, canvas.height);
}

