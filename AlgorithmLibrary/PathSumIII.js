// BSD-2-Clause license header retained from original framework.

/*
 * PathSumIII.js - Custom animated solution for LeetCode 437.
 *
 * Features required by user specification:
 *  - 9:16 canvas (540x960) with centered title "PathSumIII (Leetcode 437)"
 *  - user inputs for array (level order) and target k
 *  - build tree on demand
 *  - animation to search paths using prefix sum hash map technique
 *  - 3x5 grid tracking prefix, map.containsKey(prefix-k), count, and map
 *  - Java-style pseudo code animated in sync
 */

function PathSumIII(am, w, h) {
  this.init(am, w, h);
}

PathSumIII.prototype = new Algorithm();
PathSumIII.prototype.constructor = PathSumIII;
PathSumIII.superclass = Algorithm.prototype;

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

  // layout constants
  // store canvas dimensions for later use
  this.canvasW = w;
  this.canvasH = h;

  this.treeRootX = w / 2;
  // push tree slightly lower to make room for a title label
  this.treeRootY = 120;
  this.levelHeight = 80;

  this.gridStartY = 300;
  this.cellW = w / 5;
  this.cellH = 40;

  this.codeStartY = this.gridStartY + this.cellH * 3 + 60;

  // grid element IDs
  this.prefixLabelID = -1;
  this.prefixValID = -1;
  this.containsLabelID = -1;
  this.containsValID = -1;
  this.countLabelID = -1;
  this.countValID = -1;
  this.mapLabelID = -1;
  this.mapPairIDs = {};

  // algorithm state
  this.prefix = 0;
  this.count = 0;
  this.map = {};

  // call stack visualization
  this.stackRectW = 120;
  this.stackRectH = 20;
  this.stackSpacing = this.stackRectH + 5;
  this.stackX = w - this.stackRectW / 2 - 10;
  this.stackStartY = this.codeStartY;
  this.callStackIDs = [];
  this.stackLabelID = -1;

};

PathSumIII.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Tree (level-order, use null for empty):");
  this.inputField = addControlToAlgorithmBar("Text", "");
  this.inputField.size = 40;

  addLabelToAlgorithmBar("Target:");
  this.targetField = addControlToAlgorithmBar("Text", "0");
  this.targetField.size = 5;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Binary Tree");
  this.buildButton.onclick = this.buildTreeCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Find Path");
  this.startButton.onclick = this.startCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.pauseButton = addControlToAlgorithmBar("Button", "Pause / Play");
  this.pauseButton.onclick = this.pauseCallback.bind(this);
  this.stepButton = addControlToAlgorithmBar("Button", "Next Step");
  this.stepButton.onclick = this.stepCallback.bind(this);

  this.controls.push(this.inputField, this.targetField, this.buildButton, this.startButton);
};

// callback to build tree from user input
PathSumIII.prototype.buildTreeCallback = function () {
  const raw = this.inputField.value.trim();
  if (raw.length === 0) {
    return;
  }
  // allow bracketed LeetCode-style input and ignore empty tokens
  const vals = raw
    .replace(/^\[|\]$/g, "")
    .split(/[\s,]+/)
    .filter((v) => v.length > 0)
    .map((v) =>
      v === "null" || v === "NULL" || v === "None" ? null : parseInt(v, 10)
    );
  this.arr = vals;

  const t = parseInt(this.targetField.value, 10);
  if (!isNaN(t)) {
    this.k = t;
  }

  // fully reset existing visualization before building a new tree
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

PathSumIII.prototype.assignIDs = function (node) {
  if (!node) return;
  node.id = this.nextIndex++;
  this.nodeValue[node.id] = node.val;
  this.leftChild[node.id] = null;
  this.rightChild[node.id] = null;
  this.assignIDs(node.left);
  this.assignIDs(node.right);
};

PathSumIII.prototype.computeNodePositions = function (node, x, y, width) {
  if (!node) return;
  node.x = x;
  node.y = y;
  this.nodeX[node.id] = x;
  this.nodeY[node.id] = y;
  if (node.left) {
    this.leftChild[node.id] = node.left.id;
    this.computeNodePositions(node.left, x - width / 2, y + this.levelHeight, width / 2);
  }
  if (node.right) {
    this.rightChild[node.id] = node.right.id;
    this.computeNodePositions(node.right, x + width / 2, y + this.levelHeight, width / 2);
  }
};

PathSumIII.prototype.setup = function () {
  this.commands = [];

  // canvas title
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "PathSumIII (Leetcode 437)",
    this.canvasW / 2,
    40,
    0
  );
  this.cmd("SetTextStyle", this.titleID, "bold 20");

  // build tree structure
  const root = this.buildTreeFromArray(this.arr);
  this.assignIDs(root);
  if (root) {
    this.computeNodePositions(root, this.treeRootX, this.treeRootY, 200);
    this.rootID = root.id;
    // create nodes & edges
    this.cmd("CreateCircle", root.id, root.val, root.x, root.y);
    this.cmd("SetForegroundColor", root.id, "#000");
    this.cmd("SetBackgroundColor", root.id, "#FFF");
    this.cmd("Step");

    const queue = [root];
    while (queue.length > 0) {
      const node = queue.shift();
      const id = node.id;
      if (node.left) {
        this.cmd(
          "CreateCircle",
          node.left.id,
          node.left.val,
          node.left.x,
          node.left.y
        );
        this.cmd("SetForegroundColor", node.left.id, "#000");
        this.cmd("SetBackgroundColor", node.left.id, "#FFF");
        this.cmd("Step");
        this.cmd("Connect", id, node.left.id);
        this.cmd("Step");
        queue.push(node.left);
      }
      if (node.right) {
        this.cmd(
          "CreateCircle",
          node.right.id,
          node.right.val,
          node.right.x,
          node.right.y
        );
        this.cmd("SetForegroundColor", node.right.id, "#000");
        this.cmd("SetBackgroundColor", node.right.id, "#FFF");
        this.cmd("Step");
        this.cmd("Connect", id, node.right.id);
        this.cmd("Step");
        queue.push(node.right);
      }
    }
  }

  // grid setup
  const y1 = this.gridStartY + this.cellH / 2;
  const y2 = this.gridStartY + this.cellH * 1 + this.cellH / 2;
  const y3 = this.gridStartY + this.cellH * 2 + this.cellH / 2;

  // centers of the five grid columns
  const x1 = this.cellW / 2;
  const x2 = this.cellW * 1.5;
  const x3 = this.cellW * 2.5; // unused column for spacing
  const x4 = this.cellW * 3.5;
  const x5 = this.cellW * 4.5;

  this.prefixLabelID = this.nextIndex++;
  this.prefixValID = this.nextIndex++;
  this.containsLabelID = this.nextIndex++;
  this.containsValID = this.nextIndex++;
  this.countLabelID = this.nextIndex++;
  this.countValID = this.nextIndex++;
  this.mapLabelID = this.nextIndex++;

  this.cmd("CreateLabel", this.prefixLabelID, "prefix", x1, y1, 1);
  this.cmd("SetTextStyle", this.prefixLabelID, "bold 16");
  this.cmd("CreateLabel", this.prefixValID, "0", x2, y1, 1);
  this.cmd("SetTextStyle", this.prefixValID, "16");
  this.prefixValX = x2;
  this.prefixValY = y1;

  this.cmd(
    "CreateLabel",
    this.containsLabelID,
    "map.containsKey(0)",
    x1,
    y2,
    1
  );
  this.cmd("SetTextStyle", this.containsLabelID, "bold 16");
  this.cmd("CreateLabel", this.containsValID, "false", x2, y2, 1);
  this.cmd("SetTextStyle", this.containsValID, "16");

  this.cmd("CreateLabel", this.countLabelID, "count", x4, y2, 1);
  this.cmd("SetTextStyle", this.countLabelID, "bold 16");
  this.cmd("CreateLabel", this.countValID, "0", x5, y2, 1);
  this.cmd("SetTextStyle", this.countValID, "16");
  this.countValX = x5;
  this.countValY = y2;

  this.cmd("CreateLabel", this.mapLabelID, "map", x1, y3, 1);
  this.cmd("SetTextStyle", this.mapLabelID, "bold 16");
  this.mapStartX = x2;
  this.mapStartY = y3;

  // code block
  const code = [
    "int count = 0;",
    "int prefix = 0;",
    "Map<Integer,Integer> map = new HashMap<>();",
    "map.put(0,1);",
    "void dfs(TreeNode node){",
    "  if(node==null) return;",
    "  prefix += node.val;",
    "  if(map.containsKey(prefix-k))",
    "    count += map.get(prefix-k);",
    "  map.put(prefix, map.getOrDefault(prefix,0)+1);",
    "  dfs(node.left);",
    "  dfs(node.right);",
    "  map.put(prefix, map.get(prefix)-1);",
    "  prefix -= node.val;",
    "}"
  ];
  this.codeIDs = [];
  const codeX = 30;
  const codeY = this.codeStartY;
  for (let i = 0; i < code.length; i++) {
    const id = this.nextIndex++;
    const y = codeY + i * 18;
    this.cmd("CreateLabel", id, code[i], codeX, y, 0);
    this.cmd("SetTextStyle", id, "16");
    this.codeIDs.push(id);
  }

  // call stack title
  this.stackLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.stackLabelID,
    "Call Stack",
    this.stackX,
    this.stackStartY - 30,
    0
  );
  this.cmd("SetTextStyle", this.stackLabelID, "bold 16");

  // highlight circle hidden initially
  this.hlID = this.nextIndex++;
  // red circle that tracks the current node during traversal
  // make highlight circle same size as tree nodes (default radius 20)
  this.cmd(
    "CreateHighlightCircle",
    this.hlID,
    "#FF0000",
    this.treeRootX,
    this.treeRootY,
    20
  );
  this.cmd("SetAlpha", this.hlID, 0);

  return this.commands;
};

PathSumIII.prototype.reset = function () {
  this.nextIndex = 0;
  if (typeof animationManager !== "undefined") {
    animationManager.resetAll();
  }
  this.commands = [];
  this.nodeValue = {};
  this.leftChild = {};
  this.rightChild = {};
  this.nodeX = {};
  this.nodeY = {};
  this.rootID = -1;
  this.codeIDs = [];
  this.mapPairIDs = {};
  this.prefix = 0;
  this.count = 0;
  this.map = {};
  this.callStackIDs = [];
};

PathSumIII.prototype.startCallback = function () {
  if (this.rootID === -1) return;
  this.disableUI();
  this.implementAction(this.runSearch.bind(this), 0);
};

PathSumIII.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") doPlayPause();
};

PathSumIII.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") {
      doPlayPause();
    }
    animationManager.step();
  }
};

PathSumIII.prototype.runSearch = function () {
  this.commands = [];
  this.prefix = 0;
  this.count = 0;
  this.map = { 0: 1 };
  this.updateGrid();
  this.highlightCode(0);
  this.cmd("Step");
  this.highlightCode(1);
  this.cmd("Step");
  this.highlightCode(2);
  this.cmd("Step");
  this.highlightCode(3);
  this.cmd("Step");
  this.cmd("SetAlpha", this.hlID, 1);
  this.dfs(this.rootID);
  this.highlightCode(14);
  this.cmd("Step");
  this.cmd("SetAlpha", this.hlID, 0);
  this.enableUI();
  return this.commands;
};

PathSumIII.prototype.updateGrid = function () {
  const diff = this.prefix - this.k;
  this.cmd("SetText", this.prefixValID, String(this.prefix));
  this.cmd(
    "SetText",
    this.containsLabelID,
    "map.containsKey(" + String(diff) + ")"
  );
  const exists = this.map.hasOwnProperty(diff);
  this.cmd("SetText", this.containsValID, exists ? "true" : "false");
  this.cmd("SetText", this.countValID, String(this.count));

  // update map row
  // delete existing map pair labels
  for (let key in this.mapPairIDs) {
    this.cmd("Delete", this.mapPairIDs[key]);
  }
  this.mapPairIDs = {};
  const keys = Object.keys(this.map).sort((a, b) => parseInt(a) - parseInt(b));
  const startX = this.mapStartX;
  const y = this.mapStartY;
  let x = startX;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const id = this.nextIndex++;
    const text = k + ':' + this.map[k];
    this.cmd("CreateLabel", id, text, x, y, 1);
    this.cmd("SetTextStyle", id, "16");
    this.mapPairIDs[k] = id;
    x += 60;
  }
};

PathSumIII.prototype.highlightCode = function (line) {
  for (let i = 0; i < this.codeIDs.length; i++) {
    this.cmd("SetHighlight", this.codeIDs[i], i === line ? 1 : 0);
  }
};

PathSumIII.prototype.pushStack = function (text) {
  const id = this.nextIndex++;
  const x = this.stackX;
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

PathSumIII.prototype.popStack = function () {
  if (this.callStackIDs.length === 0) return;
  const id = this.callStackIDs.pop();
  this.cmd("Delete", id);
  this.cmd("Step");
};

PathSumIII.prototype.dfs = function (nodeID) {
  const label = nodeID == null ? "dfs(null)" : "dfs(" + this.nodeValue[nodeID] + ")";
  this.pushStack(label);
  this.highlightCode(4); // void dfs(TreeNode node){
  this.cmd("Step");
  this.highlightCode(5); // if(node==null) return;
  if (nodeID != null) {
    this.cmd("Move", this.hlID, this.nodeX[nodeID], this.nodeY[nodeID]);
  }
  this.cmd("Step");

  if (nodeID == null) {
    this.popStack();
    return;
  }

  this.cmd("Step");

  const val = this.nodeValue[nodeID];
  this.highlightCode(6); // prefix += node.val;
  let dropID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    dropID,
    (val >= 0 ? "+" + val : String(val)),
    this.nodeX[nodeID],
    this.nodeY[nodeID],
    1
  );
  const pX = this.prefixValX;
  const pY = this.prefixValY;
  this.cmd("Move", dropID, pX, pY);
  this.cmd("Step");
  this.cmd("Delete", dropID);
  this.prefix += val;
  this.updateGrid();
  this.cmd("Step");

  this.highlightCode(7); // if(map.containsKey(prefix-k))
  const diff = this.prefix - this.k;
  const exists = this.map.hasOwnProperty(diff);
  if (exists) {
    this.cmd("SetForegroundColor", this.mapPairIDs[diff], "#F00");
  }
  this.cmd("Step");
  if (exists) {
    this.highlightCode(8); // count += map.get(prefix-k);
    const add = this.map[diff];
    let lab = this.nextIndex++;
    const ordered = Object.keys(this.map).sort((a, b) => parseInt(a) - parseInt(b));
    const pairIndex = ordered.indexOf(String(diff));
    const pairX = this.mapStartX + pairIndex * 60;
    const pairY = this.mapStartY;
    this.cmd("CreateLabel", lab, "+" + add, pairX, pairY, 1);
    const countX = this.countValX;
    const countY = this.countValY;
    this.cmd("Move", lab, countX, countY);
    this.cmd("Step");
    this.cmd("Delete", lab);
    this.count += add;
    this.updateGrid();
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.mapPairIDs[diff], "#000");
  }

  this.highlightCode(9); // map.put(prefix,...)
  if (this.map[this.prefix] == null) this.map[this.prefix] = 0;
  this.map[this.prefix]++;
  this.updateGrid();
  this.cmd("Step");

  this.highlightCode(10); // dfs(left)
  this.cmd("Step");
  this.dfs(this.leftChild[nodeID]);
  if (this.leftChild[nodeID] != null) {
    this.cmd("Move", this.hlID, this.nodeX[nodeID], this.nodeY[nodeID]);
    this.cmd("Step");
  }
  this.highlightCode(11); // dfs(right)
  this.cmd("Step");
  this.dfs(this.rightChild[nodeID]);
  if (this.rightChild[nodeID] != null) {
    this.cmd("Move", this.hlID, this.nodeX[nodeID], this.nodeY[nodeID]);
    this.cmd("Step");
  }

  this.highlightCode(12); // map.put(prefix, map.get(prefix)-1);
  this.map[this.prefix]--;
  if (this.map[this.prefix] === 0) delete this.map[this.prefix];
  this.updateGrid();
  this.cmd("Step");

  this.highlightCode(13); // prefix -= node.val;
  dropID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    dropID,
    (val >= 0 ? "-" + val : "+" + (-val)),
    this.nodeX[nodeID],
    this.nodeY[nodeID],
    1
  );
  this.cmd("Move", dropID, pX, pY);
  this.cmd("Step");
  this.cmd("Delete", dropID);
  this.prefix -= val;
  this.updateGrid();
  this.cmd("Step");

  this.highlightCode(14);
  this.cmd("Step");
  this.popStack();
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

