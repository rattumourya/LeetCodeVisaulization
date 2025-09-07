// BSD-2-Clause license header retained from original framework.

/*
 * PathSumIII.js - Animated solution for LeetCode 437.
 * - Build tree from level-order input
 * - DFS with prefix sums to count paths equal to target
 * - Control buttons: Build Tree, Find Paths, Prev/Next/Stop/Resume
 * - Each qualifying path is highlighted with animated colored lines
 */

function PathSumIII(am, w, h) { this.init(am, w, h); }

PathSumIII.prototype = new Algorithm();
PathSumIII.prototype.constructor = PathSumIII;
PathSumIII.superclass = Algorithm.prototype;

PathSumIII.prototype.init = function(am, w, h) {
  PathSumIII.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.arr = [];
  this.target = 8;
  this.rootID = -1;

  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};
  this.nodeX = {};
  this.nodeY = {};

  this.codeIDs = [];
  this.sumLabelIDs = [];
  this.countLabelID = -1;
  // IDs for colored path lines for successful paths
  this.pathHighlightIDs = [];
  this.pathIdx = 0;
  // 540x960 canvas sections
  this.sectionDivY1 = 360;
  this.sectionDivY2 = 660;
};

// Generate a distinct hex color for each discovered path.
// Animation library only accepts "#RRGGBB" or "0xRRGGBB" formats,
// so convert from HSL spacing to an RGB hex string.
PathSumIII.prototype.nextPathColor = function() {
  const hue = (this.pathIdx * 137) % 360; // use golden-angle increment
  this.pathIdx++;
  const s = 0.7;
  const l = 0.45;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  const toHex = (v) => {
    const h = Math.round((v + m) * 255).toString(16);
    return h.length === 1 ? "0" + h : h;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
};

PathSumIII.prototype.addControls = function() {
  this.controls = [];

  addLabelToAlgorithmBar("Tree (level-order, use null for empty):");
  this.inputField = addControlToAlgorithmBar("Text", "");
  this.inputField.size = 40;

  addLabelToAlgorithmBar("Target Sum:");
  this.targetField = addControlToAlgorithmBar("Text", "8");
  this.targetField.size = 5;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Tree");
  this.buildButton.onclick = this.buildTreeCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Find Paths");
  this.startButton.onclick = this.startCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.prevButton = addControlToAlgorithmBar("Button", "Prev Step");
  this.prevButton.onclick = this.prevCallback.bind(this);
  this.nextButton = addControlToAlgorithmBar("Button", "Next Step");
  this.nextButton.onclick = this.nextCallback.bind(this);
  this.stopButton = addControlToAlgorithmBar("Button", "Stop");
  this.stopButton.onclick = this.stopCallback.bind(this);
  this.resumeButton = addControlToAlgorithmBar("Button", "Resume");
  this.resumeButton.onclick = this.resumeCallback.bind(this);

  this.controls.push(
    this.inputField,
    this.targetField,
    this.buildButton,
    this.startButton,
    this.prevButton,
    this.nextButton,
    this.stopButton,
    this.resumeButton
  );
};

PathSumIII.prototype.buildTreeCallback = function() {
  const raw = this.inputField.value.trim();
  if (raw.length === 0) return;
  const vals = raw
    .split(/[\s,]+/)
    .map(v => (v === "null" || v === "NULL" || v === "None" ? null : parseInt(v)));
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

PathSumIII.prototype.buildTreeFromArray = function(arr) {
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

PathSumIII.prototype.layoutTree = function(root) {
  const setPos = (node, depth, x) => {
    if (!node) return;
    const spacing = 540 / Math.pow(2, depth + 1);
    node.x = x;
    node.y = 60 + depth * 60;
    setPos(node.left, depth + 1, x - spacing / 2);
    setPos(node.right, depth + 1, x + spacing / 2);
  };
  setPos(root, 0, 270);
};

PathSumIII.prototype.setup = function() {
  this.commands = [];
  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    canvasElem.width = 540;
    canvasElem.height = 960;
    if (animationManager && animationManager.animatedObjects) {
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
  this.sumLabelIDs = [];

  this.root = this.buildTreeFromArray(this.arr);
  this.layoutTree(this.root);

  const hLine1 = this.nextIndex++;
  this.cmd("CreateLine", hLine1, 0, this.sectionDivY1, 540, this.sectionDivY1);
  const hLine2 = this.nextIndex++;
  this.cmd("CreateLine", hLine2, 0, this.sectionDivY2, 540, this.sectionDivY2);

  this.titleID = this.nextIndex++;
  this.cmd("CreateLabel", this.titleID, "Path Sum III (LeetCode 437)", 270, 40, 1);
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

  // code listing
  const code = [
    "function pathSum(root, target){",
    "  let map = {0:1};",
    "  return dfs(root,0,target,map);",
    "}",
    "function dfs(n,c,t,m){",
    "  if(!n) return 0;",
    "  c += n.val;",
    "  let res = m[c-t]||0;",
    "  m[c] = (m[c]||0)+1;",
    "  res += dfs(n.left,c,t,m);",
    "  res += dfs(n.right,c,t,m);",
    "  m[c]--;",
    "  return res;",
    "}",
  ];
  const codeX = 540 / 2 - 200;
  for (let i = 0; i < code.length; i++) {
    const id = this.nextIndex++;
    const y = this.sectionDivY1 + 30 + i * 20;
    this.cmd("CreateLabel", id, code[i], codeX, y, 0);
    this.codeIDs.push(id);
  }

  this.countLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.countLabelID, "Count: 0", 270, this.sectionDivY2 + 40, 1);

  return this.commands;
};

PathSumIII.prototype.reset = function() {
  this.nextIndex = 0;
  if (animationManager && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.root = null;
  this.rootID = -1;
  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};
  this.nodeX = {};
  this.nodeY = {};
  this.codeIDs = [];
  this.sumLabelIDs = [];
  this.countLabelID = -1;
  this.pathHighlightIDs = [];
  this.pathIdx = 0;
};

PathSumIII.prototype.startCallback = function() {
  const t = parseInt(this.targetField.value);
  if (!isNaN(t)) this.target = t;
  if (this.rootID === -1) return;
  this.implementAction(this.findPaths.bind(this), 0);
};

PathSumIII.prototype.findPaths = function() {
  this.commands = [];
  for (const id of this.sumLabelIDs) this.cmd("Delete", id);
  this.sumLabelIDs = [];
  for (const edge of this.pathHighlightIDs) {
    this.cmd("Disconnect", edge.from, edge.to);
  }
  this.pathHighlightIDs = [];
  this.pathIdx = 0;
  for (const id in this.nodeValue) {
    this.cmd("SetBackgroundColor", parseInt(id), "#FFF");
  }
  this.cmd("SetText", this.countLabelID, "Count: 0");
  let count = 0;
  const prefix = { 0: [-1] };
  const path = [];
  const highlight = (line) => {
    for (let i = 0; i < this.codeIDs.length; i++) {
      this.cmd("SetHighlight", this.codeIDs[i], i === line ? 1 : 0);
    }
  };

  const showPath = (nodes) => {
    // Draw straight line segments in a unique color for this path
    const color = this.nextPathColor();
    let prev = null;
    for (const nid of nodes) {
      if (prev !== null) {
        // Thicker straight segment for path highlighting
        this.cmd("Connect", prev, nid, color, 0, true, "", 3);
        this.cmd("Step");
        this.pathHighlightIDs.push({ from: prev, to: nid });
      }
      prev = nid;
    }
  };

  const dfs = (nodeID, cur) => {
    highlight(5);
    this.cmd("Step");
    if (nodeID == null) {
      highlight(5);
      return 0;
    }
    highlight(6);
    const val = this.nodeValue[nodeID];
    cur += val;
    path.push(nodeID);
    this.cmd("Step");
    highlight(7);
    const need = cur - this.target;
    if (prefix[need]) {
      for (const idx of prefix[need]) {
        const nodes = path.slice(idx + 1);
        showPath(nodes);
        count++;
      }
      this.cmd("SetText", this.countLabelID, "Count: " + count);
    }
    this.cmd("Step");
    highlight(8);
    if (!prefix[cur]) prefix[cur] = [];
    prefix[cur].push(path.length - 1);
    const sumID = this.nextIndex++;
    const x = this.nodeX[nodeID];
    const y = this.nodeY[nodeID] - 40;
    this.cmd("CreateLabel", sumID, "s=" + cur, x, y, 0);
    this.sumLabelIDs.push(sumID);
    this.cmd("Step");
    highlight(9);
    if (this.leftChild[nodeID] != null) dfs(this.leftChild[nodeID], cur);
    highlight(10);
    if (this.rightChild[nodeID] != null) dfs(this.rightChild[nodeID], cur);
    highlight(11);
    prefix[cur].pop();
    if (prefix[cur].length === 0) delete prefix[cur];
    const label = this.sumLabelIDs.pop();
    this.cmd("Delete", label);
    path.pop();
    this.cmd("Step");
    return 0;
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
  highlight(4);
  this.cmd("Step");
  return this.commands;
};

PathSumIII.prototype.prevCallback = function() {
  this.animationManager.stepBack();
};

PathSumIII.prototype.nextCallback = function() {
  this.animationManager.step();
};

PathSumIII.prototype.stopCallback = function() {
  this.animationManager.SetPaused(true);
};

PathSumIII.prototype.resumeCallback = function() {
  this.animationManager.SetPaused(false);
};

PathSumIII.prototype.disableUI = function() {
  for (let c of this.controls) c.disabled = true;
};

PathSumIII.prototype.enableUI = function() {
  for (let c of this.controls) c.disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new PathSumIII(animManag, canvas.width, canvas.height);
}
