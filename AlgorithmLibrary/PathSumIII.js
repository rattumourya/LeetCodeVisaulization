// BSD-2-Clause license header retained from original framework.

/*
 * PathSumIII.js - Visualization for LeetCode 437 Path Sum III.
 * Rewritten from scratch to use DFS + prefix sum.
 * - User provides level-order array and target.
 * - Build binary tree and show prefix / map / count grid.
 * - Animation highlights traversal, prefix updates, map lookups,
 *   and Java code lines in red while executing.
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
  "    int count = map.getOrDefault(prefix - k, 0);",
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

  this.prefixLabelID = -1;
  this.prefixValueID = -1;
  this.containsLabelID = -1;
  this.containsValueID = -1;
  this.countLabelID = -1;
  this.countValueID = -1;
  this.mapLabelID = -1;
  this.mapEntryIDs = {};
  this.containsKey = 0;

  this.codeIDs = [];

  this.travID = -1;

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
    // fall back to default example when no input provided
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

PathSumIII.prototype.setup = function () {
  this.commands = [];

  // Measure code width first so we can size the canvas accordingly
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
    if (animationManager?.animatedObjects) {
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
  this.mapEntryIDs = {};

  this.root = this.buildTreeFromArray(this.arr);
  this.layoutTree(this.root);

  // title on canvas
  this.titleID = this.nextIndex++;
  const titleX = (canvasElem ? canvasElem.width : canvasW) / 2;
  this.cmd("CreateLabel", this.titleID, "PathSumIII (Leetcode 437)", titleX, 40, 1);
  this.cmd("SetTextStyle", this.titleID, "bold 24");

  // draw tree
  const queue = [];
  if (this.root) {
    this.root.id = this.nextIndex++;
    this.cmd("CreateCircle", this.root.id, this.root.val, this.root.x, this.root.y);
    this.cmd("SetForegroundColor", this.root.id, "#000");
    this.cmd("SetBackgroundColor", this.root.id, "#FFF");
    this.cmd("Step");
    queue.push(this.root);
    this.rootID = this.root.id;
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

  // grid layout constants
  const CANVAS_W = canvasElem ? canvasElem.width : canvasW;
  const firstColW = 200; // wider first column for long labels
  const otherColW = (CANVAS_W - firstColW) / 4;
  this.firstColW = firstColW;
  this.cellW = otherColW; // width for remaining columns
  this.cellH = 40;
  this.rowGap = 20;
  this.gridStartY = 320;
  const colX = (i) => {
    if (i === 1) return firstColW / 2;
    return firstColW + otherColW * (i - 1.5);
  };
  const row1Y = this.gridStartY + this.cellH / 2;
  const row2Y = row1Y + this.cellH + this.rowGap;
  const row3Y = row2Y + this.cellH + this.rowGap;

  // row1 prefix cell (no rectangle)
  this.prefixLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.prefixLabelID, "prefix", colX(1), row1Y, 0, 16, "right");
  this.cmd("SetTextStyle", this.prefixLabelID, "bold 16");
  this.prefixValueID = this.nextIndex++;
  this.prefixValueX = colX(2);
  this.prefixValueY = row1Y;
  this.cmd("CreateLabel", this.prefixValueID, "0", this.prefixValueX, this.prefixValueY, 0, 16, "center");

  // row2 contains cell
  this.containsLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.containsLabelID,
    "map.containsKey(0)",
    colX(1),
    row2Y,
    0,
    16,
    "right"
  );
  this.cmd("SetTextStyle", this.containsLabelID, "bold 16");
  this.containsValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.containsValueID, "false", colX(2), row2Y, 0, 16, "center");

  // row2 count cell
  this.countLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.countLabelID, "count", colX(4), row2Y, 0, 16, "right");
  this.cmd("SetTextStyle", this.countLabelID, "bold 16");
  this.countValueID = this.nextIndex++;
  this.countValueX = colX(5);
  this.countValueY = row2Y;
  this.cmd("CreateLabel", this.countValueID, "0", this.countValueX, this.countValueY, 0, 16, "center");

  // row3 map cell spanning both columns
  this.mapLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.mapLabelID, "map", colX(1), row3Y, 0, 16, "right");
  this.cmd("SetTextStyle", this.mapLabelID, "bold 16");
  this.mapValueY = row3Y;
  this.mapValueStartX = colX(2);

  // initial map {0:1}
  this.prefix = 0;
  this.count = 0;
  this.map = { 0: 1 };
  this.containsKey = 0;
  this.renderMap();
  this.updateContainsLabel();

  // code block centered horizontally (left-aligned text)
  const codeStartX = (CANVAS_W - maxWidth) / 2;
  const codeStartY = row3Y + this.cellH / 2 + 60;
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

PathSumIII.prototype.renderMap = function () {
  for (const key in this.mapEntryIDs) {
    this.cmd("Delete", this.mapEntryIDs[key]);
  }
  this.mapEntryIDs = {};
  const keys = Object.keys(this.map).map(Number).sort((a, b) => a - b);
  let x = this.mapValueStartX;
  const step = this.cellW;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const id = this.nextIndex++;
    const text =
      (i === 0 ? "{ " : "") +
      k +
      " : " +
      this.map[k] +
      (i === keys.length - 1 ? " }" : " , ");
    this.cmd("CreateLabel", id, text, x, this.mapValueY, 0, 16, "center");
    this.mapEntryIDs[k] = { id: id, x: x };
    x += step;
  }
  this.updateContainsLabel();
};

PathSumIII.prototype.updateContainsLabel = function (key) {
  if (key !== undefined) {
    this.containsKey = key;
  }
  const has = this.map[this.containsKey] != null;
  this.cmd("SetText", this.containsValueID, has ? "true" : "false");
  return has;
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
  this.prefix = 0;
  this.count = 0;
  this.map = { 0: 1 };
  this.containsKey = 0;
  this.renderMap();
  this.cmd("SetText", this.prefixValueID, "0");
  this.cmd("SetText", this.countValueID, "0");
  this.cmd("SetText", this.containsLabelID, "map.containsKey(0)");
  this.updateContainsLabel();

  // code prelude
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

  // create traversal highlight circle
  this.travID = this.nextIndex++;
  this.cmd("CreateHighlightCircle", this.travID, "#FF0000", this.nodeX[this.rootID], this.nodeY[this.rootID]);

  const dfs = (nodeID, prefix) => {
    this.highlight(6);
    this.cmd("Step");
    if (nodeID == null) {
      return 0;
    }
    this.cmd("Move", this.travID, this.nodeX[nodeID], this.nodeY[nodeID]);
    this.cmd("Step");
    this.cmd("SetHighlight", nodeID, 1);

    this.highlight(7);
    this.cmd("Step");
    const val = this.nodeValue[nodeID];
    const moveID = this.nextIndex++;
    const text = val >= 0 ? "+" + val : String(val);
    this.cmd("CreateLabel", moveID, text, this.nodeX[nodeID], this.nodeY[nodeID]);
    this.cmd("Move", moveID, this.prefixValueX, this.prefixValueY);
    this.cmd("Step");
    this.cmd("Delete", moveID);
    prefix += val;
    this.cmd("SetText", this.prefixValueID, String(prefix));
    this.cmd("Step");

    this.highlight(8);
    this.cmd("Step");
    const need = prefix - this.k;
    this.cmd("SetText", this.containsLabelID, `map.containsKey(${need})`);
    const contains = this.updateContainsLabel(need);
    this.cmd("Step");
    let countLocal = contains ? this.map[need] : 0;
    if (contains) {
      const entry = this.mapEntryIDs[need];
      if (entry) {
        this.cmd("SetBackgroundColor", entry.id, "#FF9999");
        const mv = this.nextIndex++;
        this.cmd("CreateLabel", mv, "+" + this.map[need], entry.x, this.mapValueY);
        this.cmd("Move", mv, this.countValueX, this.countValueY);
        this.cmd("Step");
        this.cmd("Delete", mv);
        this.cmd("SetBackgroundColor", entry.id, "#FFFFFF");
      }
      this.count += this.map[need];
      this.cmd("SetText", this.countValueID, String(this.count));
      this.cmd("Step");
    }

    this.highlight(9);
    this.cmd("Step");
    this.map[prefix] = (this.map[prefix] || 0) + 1;
    this.renderMap();
    this.cmd("Step");

    this.highlight(10);
    this.cmd("Step");
    if (this.leftChild[nodeID] != null) {
      this.cmd("Move", this.travID, this.nodeX[this.leftChild[nodeID]], this.nodeY[this.leftChild[nodeID]]);
      this.cmd("Step");
      dfs(this.leftChild[nodeID], prefix);
      this.cmd("Move", this.travID, this.nodeX[nodeID], this.nodeY[nodeID]);
      this.cmd("Step");
    }

    this.highlight(11);
    this.cmd("Step");
    if (this.rightChild[nodeID] != null) {
      this.cmd("Move", this.travID, this.nodeX[this.rightChild[nodeID]], this.nodeY[this.rightChild[nodeID]]);
      this.cmd("Step");
      dfs(this.rightChild[nodeID], prefix);
      this.cmd("Move", this.travID, this.nodeX[nodeID], this.nodeY[nodeID]);
      this.cmd("Step");
    }

    this.highlight(12);
    this.cmd("Step");
    this.map[prefix]--;
    if (this.map[prefix] === 0) delete this.map[prefix];
    this.renderMap();
    this.cmd("Step");

    this.highlight(13);
    this.cmd("Step");
    const moveID2 = this.nextIndex++;
    const text2 = val >= 0 ? "-" + val : "+" + -val;
    this.cmd("CreateLabel", moveID2, text2, this.nodeX[nodeID], this.nodeY[nodeID]);
    this.cmd("Move", moveID2, this.prefixValueX, this.prefixValueY);
    this.cmd("Step");
    this.cmd("Delete", moveID2);
    prefix -= val;
    this.cmd("SetText", this.prefixValueID, String(prefix));
    this.cmd("Step");

    this.highlight(14);
    this.cmd("Step");
    this.cmd("SetHighlight", nodeID, 0);
    return countLocal;
  };

  dfs(this.rootID, 0);
  this.highlight(15);
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
