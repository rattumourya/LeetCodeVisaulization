// BSD-2-Clause license header retained from original framework.

/*
 * PathSumII.js - Animated solution for LeetCode 113.
 * - Build tree from level-order input
 * - DFS search for target sum paths
 * - 9:16 layout with three sections:
 *   1) top: binary tree with centered title
 *   2) middle: current path (left column) and result paths (right column)
 *   3) bottom: centered Java code snippet
 */

function PathSumII(am, w, h) { this.init(am, w, h); }

PathSumII.prototype = new Algorithm();
PathSumII.prototype.constructor = PathSumII;
PathSumII.superclass = Algorithm.prototype;

PathSumII.prototype.init = function (am, w, h) {
  PathSumII.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.arr = [];
  this.target = 22;
  this.rootID = -1;

  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};

  this.pathRectIDs = [];
  this.resultRectIDs = [];
  this.resultIndex = 0;
  this.codeIDs = [];

  // layout constants for 9:16 canvas (540x960)
  this.sectionDivY1 = 360; // tree / path divider
  this.sectionDivY2 = 660; // path / code divider
  this.sectionDivX = 270; // splits middle section into path / result columns
  this.rectW = 40;
  this.rectH = 40;
  this.rectSP = 10;
  this.pathStartX = 60;
  this.pathStartY = this.sectionDivY1 + 80;
  this.resultStartX = this.sectionDivX + 60;
  this.resultStartY = this.sectionDivY1 + 80;
};

PathSumII.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Tree (level-order, use null for empty):");
  this.inputField = addControlToAlgorithmBar("Text", "");
  this.inputField.size = 40;

  addLabelToAlgorithmBar("Target Sum:");
  this.targetField = addControlToAlgorithmBar("Text", "22");
  this.targetField.size = 5;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Tree");
  this.buildButton.onclick = this.buildTreeCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Find Paths");
  this.startButton.onclick = this.startCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.pauseButton = addControlToAlgorithmBar("Button", "Pause / Play");
  this.pauseButton.onclick = this.pauseCallback.bind(this);

  this.stepButton = addControlToAlgorithmBar("Button", "Next Step");
  this.stepButton.onclick = this.stepCallback.bind(this);

  this.controls.push(
    this.inputField,
    this.targetField,
    this.buildButton,
    this.startButton
  );
};

PathSumII.prototype.buildTreeCallback = function () {
  const raw = this.inputField.value.trim();
  if (raw.length === 0) return;
  const vals = raw
    .split(/[\s,]+/)
    .map((v) => (v === "null" || v === "NULL" || v === "None" ? null : parseInt(v)));
  this.arr = vals;
  const t = parseInt(this.targetField.value);
  if (!isNaN(t)) this.target = t;
  this.reset();
  // rebuild tree with new input
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

PathSumII.prototype.buildTreeFromArray = function (arr) {
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

PathSumII.prototype.layoutTree = function (root) {
  const canvasElem = document.getElementById("canvas");
  const w = canvasElem ? canvasElem.width : 540;
  const startY = 100; // leave room for title
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

PathSumII.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") doPlayPause();
};

PathSumII.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") doPlayPause();
    animationManager.step();
  }
};

PathSumII.prototype.setup = function () {
  this.commands = [];

  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    canvasElem.width = 540;
    canvasElem.height = 960;
    if (animationManager?.animatedObjects) {
      animationManager.animatedObjects.width = 540;
      animationManager.animatedObjects.height = 960;
    }
  }

  if (!this.arr || this.arr.length === 0) {
    return this.commands;
  }

  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};

  this.root = this.buildTreeFromArray(this.arr);
  this.layoutTree(this.root);

  // divider lines for sections
  const hLine1 = this.nextIndex++;
  this.cmd("CreateLine", hLine1, 0, this.sectionDivY1, 540, this.sectionDivY1);
  const hLine2 = this.nextIndex++;
  this.cmd("CreateLine", hLine2, 0, this.sectionDivY2, 540, this.sectionDivY2);
  const vLine = this.nextIndex++;
  this.cmd("CreateLine", vLine, this.sectionDivX, this.sectionDivY1, this.sectionDivX, this.sectionDivY2);

  // title in section 1
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Path Sum II (LeetCode 113)",
    270,
    40,
    1
  );
  this.cmd("SetTextStyle", this.titleID, "bold 24");

  const queue = [];
  if (this.root) {
    this.root.id = this.nextIndex++;
    this.cmd("CreateCircle", this.root.id, this.root.val, this.root.x, this.root.y);
    this.cmd("SetForegroundColor", this.root.id, "#000");
    this.cmd("SetBackgroundColor", this.root.id, "#FFF");
    this.cmd("Step");
    queue.push(this.root);
  }
  while (queue.length > 0) {
    const node = queue.shift();
    this.nodeValue[node.id] = node.val;
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
  this.rootID = this.root ? this.root.id : -1;

  // code snippet in section 3
  const code = [
    "public List<List<Integer>> pathSum(TreeNode root, int t) {",
    "    List<List<Integer>> res = new ArrayList<>();",
    "    dfs(root, t, new ArrayList<>(), res);",
    "    return res;",
    "}",
    "private void dfs(TreeNode n, int s, List<Integer> p, List<List<Integer>> r){",
    "    if (n == null) return;",
    "    p.add(n.val); s -= n.val;",
    "    if(n.left==null && n.right==null && s==0) r.add(new ArrayList<>(p));",
    "    dfs(n.left, s, p, r);",
    "    dfs(n.right, s, p, r);",
    "    p.remove(p.size()-1);",
    "}",
  ];
  const codeX = 270;
  for (let i = 0; i < code.length; i++) {
    const id = this.nextIndex++;
    const y = this.sectionDivY2 + 20 + i * 20;
    this.cmd("CreateLabel", id, code[i], codeX, y, 1);
    this.codeIDs.push(id);
  }

  // labels for current path and results in section 2
  this.pathLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.pathLabelID,
    "Current Path:",
    this.sectionDivX / 2,
    this.sectionDivY1 + 40,
    1
  );
  this.resultLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.resultLabelID,
    "Result Path:",
    this.sectionDivX + (540 - this.sectionDivX) / 2,
    this.sectionDivY1 + 40,
    1
  );

  return this.commands;
};

PathSumII.prototype.reset = function () {
  this.nextIndex = 0;
  if (animationManager?.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.pathRectIDs = [];
  this.resultRectIDs = [];
  this.resultIndex = 0;
  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};
  this.rootID = -1;
  this.codeIDs = [];
};

PathSumII.prototype.startCallback = function () {
  const t = parseInt(this.targetField.value);
  if (!isNaN(t)) this.target = t;
  if (this.rootID === -1) return;
  this.implementAction(this.findPaths.bind(this), 0);
};

PathSumII.prototype.findPaths = function () {
  this.commands = [];
  for (const id of this.pathRectIDs) {
    this.cmd("Delete", id);
  }
  for (const id of this.resultRectIDs) {
    this.cmd("Delete", id);
  }
  for (const id in this.nodeValue) {
    this.cmd("SetBackgroundColor", parseInt(id), "#FFF");
    this.cmd("SetHighlight", parseInt(id), 0);
  }
  this.pathRectIDs = [];
  this.resultRectIDs = [];
  this.resultIndex = 0;
  const pathVals = [];
  const pathNodeIDs = [];
  this.keepBlue = {};

  const highlight = (line) => {
    for (let i = 0; i < this.codeIDs.length; i++) {
      this.cmd("SetHighlight", this.codeIDs[i], i === line ? 1 : 0);
    }
  };

  const dfs = (nodeID, sum) => {
    highlight(6);
    if (nodeID == null) {
      this.cmd("Step");
      return;
    }

    highlight(7);
    const val = this.nodeValue[nodeID];
    this.cmd("SetHighlight", nodeID, 1);
    this.cmd("Step");

    const rectID = this.nextIndex++;
    const idx = this.pathRectIDs.length;
    const x = this.pathStartX + idx * (this.rectW + this.rectSP);
    this.cmd("CreateRectangle", rectID, String(val), this.rectW, this.rectH, x, this.pathStartY);
    this.pathRectIDs.push(rectID);
    pathVals.push(val);
    pathNodeIDs.push(nodeID);
    this.cmd("SetBackgroundColor", nodeID, "#ADD8E6");
    sum += val;
    this.cmd("Step");

    highlight(8);
    if (this.leftChild[nodeID] == null && this.rightChild[nodeID] == null) {
      if (sum === this.target) {
        const y = this.resultStartY + this.resultIndex * (this.rectH + 10);
        for (let i = 0; i < pathVals.length; i++) {
          const id = this.nextIndex++;
          const rx = this.resultStartX + i * (this.rectW + this.rectSP);
          this.cmd("CreateRectangle", id, String(pathVals[i]), this.rectW, this.rectH, rx, y);
          this.resultRectIDs.push(id);
          this.keepBlue[pathNodeIDs[i]] = true;
        }
        this.resultIndex++;
        this.cmd("Step");
      }
    } else {
      highlight(9);
      if (this.leftChild[nodeID] != null) dfs(this.leftChild[nodeID], sum);
      highlight(10);
      if (this.rightChild[nodeID] != null) dfs(this.rightChild[nodeID], sum);
    }

    highlight(11);
    const lastID = this.pathRectIDs.pop();
    pathVals.pop();
    pathNodeIDs.pop();
    this.cmd("Delete", lastID);
    if (!this.keepBlue[nodeID]) {
      this.cmd("SetBackgroundColor", nodeID, "#FFF");
    }
    this.cmd("SetHighlight", nodeID, 0);
    this.cmd("Step");
  };

  highlight(0);
  this.cmd("Step");
  highlight(1);
  this.cmd("Step");
  highlight(2);
  this.cmd("Step");
  dfs(this.rootID, 0);
  highlight(3);
  this.cmd("Step");
  return this.commands;
};

PathSumII.prototype.disableUI = function () {
  for (let c of this.controls) c.disabled = true;
};

PathSumII.prototype.enableUI = function () {
  for (let c of this.controls) c.disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new PathSumII(animManag, canvas.width, canvas.height);
}
