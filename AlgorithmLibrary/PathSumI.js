// BSD-2-Clause license header retained from original framework.

/*
 * PathSumI.js - Animated solution for LeetCode 112.
 * - Build tree from level-order input
 * - DFS search to check for target sum path
 * - 9:16 layout with three sections:
 *   1) top: binary tree with centered title
 *   2) middle: structured Java code snippet
 *   3) bottom: call stack visualization
 */

function PathSumI(am, w, h) { this.init(am, w, h); }

PathSumI.prototype = new Algorithm();
PathSumI.prototype.constructor = PathSumI;
PathSumI.superclass = Algorithm.prototype;

PathSumI.prototype.init = function (am, w, h) {
  PathSumI.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.arr = [];
  this.target = 22;
  this.rootID = -1;

  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};
  this.nodeX = {};
  this.nodeY = {};

  this.callStackIDs = [];
  this.remainLabelIDs = [];
  this.codeIDs = [];
  this.traverseCircleID = -1;

  // layout constants for 9:16 canvas (540x960)
  this.sectionDivY1 = 360; // tree / code divider
  this.sectionDivY2 = 660; // code / stack divider
  this.stackRectW = 80;
  this.stackRectH = 30;
  this.stackSpacing = this.stackRectH + 10;
  this.stackStartX = 270;
  this.stackStartY = this.sectionDivY2 + 120;
};

PathSumI.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Tree (level-order, use null for empty):");
  this.inputField = addControlToAlgorithmBar("Text", "");
  this.inputField.size = 40;

  addLabelToAlgorithmBar("Target Sum:");
  this.targetField = addControlToAlgorithmBar("Text", "22");
  this.targetField.size = 5;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Tree");
  this.buildButton.onclick = this.buildTreeCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Check Path");
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

PathSumI.prototype.buildTreeCallback = function () {
  const raw = this.inputField.value.trim();
  if (raw.length === 0) return;
  const vals = raw
    .split(/[\s,]+/)
    .map((v) => (v === "null" || v === "NULL" || v === "None" ? null : parseInt(v)));
  this.arr = vals;
  const t = parseInt(this.targetField.value);
  if (!isNaN(t)) this.target = t;
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

PathSumI.prototype.buildTreeFromArray = function (arr) {
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

PathSumI.prototype.layoutTree = function (root) {
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

PathSumI.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") doPlayPause();
};

PathSumI.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") doPlayPause();
    animationManager.step();
  }
};

PathSumI.prototype.setup = function () {
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

  if (!this.arr || this.arr.length === 0) return this.commands;

  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};
  this.nodeX = {};
  this.nodeY = {};
  this.callStackIDs = [];
  this.remainLabelIDs = [];
  this.codeIDs = [];

  this.root = this.buildTreeFromArray(this.arr);
  this.layoutTree(this.root);

  const hLine1 = this.nextIndex++;
  this.cmd("CreateLine", hLine1, 0, this.sectionDivY1, 540, this.sectionDivY1);
  const hLine2 = this.nextIndex++;
  this.cmd("CreateLine", hLine2, 0, this.sectionDivY2, 540, this.sectionDivY2);

  this.titleID = this.nextIndex++;
  this.cmd("CreateLabel", this.titleID, "Path Sum (LeetCode 112)", 270, 40, 1);
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
    this.nodeX[node.id] = node.x;
    this.nodeY[node.id] = node.y;
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

  const code = [
    "public boolean hasPathSum(TreeNode root, int targetSum) {",
    "    if (root == null) return false;",
    "    if (root.left == null && root.right == null) return targetSum == root.val;",
    "    int next = targetSum - root.val;",
    "    return hasPathSum(root.left, next) || hasPathSum(root.right, next);",
    "}",
  ];
  const codeX = 540 / 2 - 220;
  for (let i = 0; i < code.length; i++) {
    const id = this.nextIndex++;
    const y = this.sectionDivY1 + 30 + i * 20;
    this.cmd("CreateLabel", id, code[i], codeX, y, 0);
    this.cmd("SetTextStyle", id, "18");
    this.codeIDs.push(id);
  }

  this.stackLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.stackLabelID,
    "Call Stack:",
    270,
    this.sectionDivY2 + 80,
    1
  );
  this.cmd("SetTextStyle", this.stackLabelID, "bold 16");

  return this.commands;
};

PathSumI.prototype.reset = function () {
  this.nextIndex = 0;
  if (animationManager?.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.callStackIDs = [];
  this.remainLabelIDs = [];
  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};
  this.nodeX = {};
  this.nodeY = {};
  this.rootID = -1;
  this.codeIDs = [];
  this.traverseCircleID = -1;
};

PathSumI.prototype.startCallback = function () {
  const t = parseInt(this.targetField.value);
  if (!isNaN(t)) this.target = t;
  if (this.rootID === -1) return;
  this.implementAction(this.runSearch.bind(this), 0);
};

PathSumI.prototype.runSearch = function () {
  this.commands = [];
  for (const id of this.callStackIDs) this.cmd("Delete", id);
  for (const id of this.remainLabelIDs) this.cmd("Delete", id);
  if (this.traverseCircleID !== -1) this.cmd("Delete", this.traverseCircleID);
  for (const id in this.nodeValue) {
    this.cmd("SetBackgroundColor", parseInt(id), "#FFF");
    this.cmd("SetHighlight", parseInt(id), 0);
  }
  this.callStackIDs = [];
  this.remainLabelIDs = [];
  this.traverseCircleID = this.nextIndex++;
  if (this.rootID !== -1) {
    this.cmd(
      "CreateHighlightCircle",
      this.traverseCircleID,
      "#F00",
      this.nodeX[this.rootID],
      this.nodeY[this.rootID]
    );
    this.cmd("SetLayer", this.traverseCircleID, 1);
  }
  const pathNodeIDs = [];
  this.keepGreen = {};

  const highlight = (line) => {
    for (let i = 0; i < this.codeIDs.length; i++) {
      this.cmd("SetHighlight", this.codeIDs[i], i === line ? 1 : 0);
    }
  };

  const pushStack = (text) => {
    const id = this.nextIndex++;
    const x = this.stackStartX;
    const y = this.stackStartY + this.callStackIDs.length * this.stackSpacing;
    this.cmd(
      "CreateRectangle",
      id,
      text,
      this.stackRectW,
      this.stackRectH,
      x,
      y
    );
    this.callStackIDs.push(id);
    this.cmd("Step");
    return id;
  };

  const popStack = () => {
    if (this.callStackIDs.length === 0) return;
    const id = this.callStackIDs.pop();
    this.cmd("Delete", id);
    this.cmd("Step");
  };

  const dfs = (nodeID, target) => {
    const label =
      (nodeID == null ? "null" : this.nodeValue[nodeID]) + "," + target;
    pushStack(label);
    highlight(1);
    this.cmd("Step");
    if (nodeID == null) {
      popStack();
      return false;
    }

    highlight(2);
    const val = this.nodeValue[nodeID];
    this.cmd("SetHighlight", nodeID, 1);
    pathNodeIDs.push(nodeID);
    this.cmd("SetBackgroundColor", nodeID, "#ADD8E6");
    this.cmd("Step");

    highlight(3);
    const next = target - val;
    const remID = this.nextIndex++;
    const rx = this.nodeX[nodeID];
    const ry = this.nodeY[nodeID] - 40;
    this.cmd("CreateLabel", remID, "next = " + String(next), rx, ry, 0);
    this.remainLabelIDs.push(remID);
    this.cmd("Step");

    if (this.leftChild[nodeID] == null && this.rightChild[nodeID] == null) {
      highlight(2);
      this.cmd("Step");
      if (target === val) {
        this.keepGreen[nodeID] = true;
        this.cmd("SetBackgroundColor", nodeID, "#90EE90");
        this.cmd("SetHighlight", nodeID, 0);
        if (this.traverseCircleID !== -1) {
          this.cmd("Delete", this.traverseCircleID);
          this.traverseCircleID = -1;
        }
        this.cmd("Step");
        popStack();
        return true;
      } else {
        const remLabel = this.remainLabelIDs.pop();
        this.cmd("Delete", remLabel);
        pathNodeIDs.pop();
        this.cmd("SetBackgroundColor", nodeID, "#FFF");
        this.cmd("SetHighlight", nodeID, 0);
        this.cmd("Step");
        popStack();
        return false;
      }
    }

    highlight(4);
    this.cmd("SetForegroundColor", this.codeIDs[4], "#F00");
    let left = false;
    if (this.leftChild[nodeID] != null) {
      const l = this.leftChild[nodeID];
      this.cmd("SetEdgeHighlight", nodeID, l, 1);
      this.cmd("Move", this.traverseCircleID, this.nodeX[l], this.nodeY[l]);
      this.cmd("Step");
      left = dfs(l, next);
      if (!left && this.traverseCircleID !== -1) {
        this.cmd("Move", this.traverseCircleID, this.nodeX[nodeID], this.nodeY[nodeID]);
        this.cmd("Step");
      }
      this.cmd("SetEdgeHighlight", nodeID, l, 0);
    } else {
      this.cmd("Step");
    }
    this.cmd("SetForegroundColor", this.codeIDs[4], "#000");
    if (left) {
      this.keepGreen[nodeID] = true;
      this.cmd("SetBackgroundColor", nodeID, "#90EE90");
      this.cmd("SetHighlight", nodeID, 0);
      popStack();
      return true;
    }

    highlight(4);
    this.cmd("SetForegroundColor", this.codeIDs[4], "#F00");
    let right = false;
    if (this.rightChild[nodeID] != null) {
      const r = this.rightChild[nodeID];
      this.cmd("SetEdgeHighlight", nodeID, r, 1);
      this.cmd("Move", this.traverseCircleID, this.nodeX[r], this.nodeY[r]);
      this.cmd("Step");
      right = dfs(r, next);
      if (!right && this.traverseCircleID !== -1) {
        this.cmd("Move", this.traverseCircleID, this.nodeX[nodeID], this.nodeY[nodeID]);
        this.cmd("Step");
      }
      this.cmd("SetEdgeHighlight", nodeID, r, 0);
    } else {
      this.cmd("Step");
    }
    this.cmd("SetForegroundColor", this.codeIDs[4], "#000");
    if (right) {
      this.keepGreen[nodeID] = true;
      this.cmd("SetBackgroundColor", nodeID, "#90EE90");
      this.cmd("SetHighlight", nodeID, 0);
      popStack();
      return true;
    }

    const remLabel = this.remainLabelIDs.pop();
    this.cmd("Delete", remLabel);
    pathNodeIDs.pop();
    if (!this.keepGreen[nodeID]) this.cmd("SetBackgroundColor", nodeID, "#FFF");
    this.cmd("SetHighlight", nodeID, 0);
    this.cmd("Step");
    popStack();
    return false;
  };

  highlight(0);
  this.cmd("Step");
  dfs(this.rootID, this.target);
  if (this.traverseCircleID !== -1) {
    this.cmd("Delete", this.traverseCircleID);
    this.traverseCircleID = -1;
    this.cmd("Step");
  }
  return this.commands;
};

PathSumI.prototype.disableUI = function () {
  for (let c of this.controls) c.disabled = true;
};

PathSumI.prototype.enableUI = function () {
  for (let c of this.controls) c.disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new PathSumI(animManag, canvas.width, canvas.height);
}

