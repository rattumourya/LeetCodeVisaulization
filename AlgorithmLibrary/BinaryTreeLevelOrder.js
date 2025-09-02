// BSD-2-Clause license header from the original framework applies.

/*
 * BinaryTreeLevelOrder.js - Animated solution for LeetCode 102
 * - Build binary tree from level-order input
 * - Level-order traversal animation
 * - YouTube "Video Mode" (9:16 portrait)
 * - Canvas recording via MediaRecorder
 */

function BinaryTreeLevelOrder(am, w, h) { this.init(am, w, h); }

BinaryTreeLevelOrder.prototype = new Algorithm();
BinaryTreeLevelOrder.prototype.constructor = BinaryTreeLevelOrder;
BinaryTreeLevelOrder.superclass = Algorithm.prototype;

BinaryTreeLevelOrder.prototype.init = function (am, w, h) {
  BinaryTreeLevelOrder.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.arr = [];
  this.root = null;
  this.resultLabelID = -1;

  this.videoMode = false;
  this.recording = false;
  this.mediaRecorder = null;
  this.chunks = [];

  this.setup();
};

BinaryTreeLevelOrder.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Tree (level-order, use null for empty):");
  this.inputField = addControlToAlgorithmBar("Text", "");
  this.inputField.size = 40;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Tree");
  this.buildButton.onclick = this.buildTreeCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Traverse");
  this.startButton.onclick = this.startCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.videoButton = addControlToAlgorithmBar("Button", "Video Mode");
  this.videoButton.onclick = this.videoModeCallback.bind(this);

  this.recordButton = addControlToAlgorithmBar("Button", "Start Recording");
  this.recordButton.onclick = this.recordCallback.bind(this);

  this.controls.push(
    this.inputField,
    this.buildButton,
    this.startButton,
    this.videoButton,
    this.recordButton
  );
};

BinaryTreeLevelOrder.prototype.buildTreeCallback = function () {
  const raw = this.inputField.value.trim();
  if (!raw) return;
  const vals = raw
    .split(/[\s,]+/)
    .map((v) =>
      v === "null" || v === "NULL" || v === "None" ? null : v
    );
  this.arr = vals;
  this.reset();
};

function TreeNode(val) {
  this.val = val;
  this.left = null;
  this.right = null;
  this.x = 0;
  this.y = 0;
  this.id = -1;
}

BinaryTreeLevelOrder.prototype.buildTreeFromArray = function (arr) {
  if (!arr || arr.length === 0) return null;
  const nodes = arr.map((v) => (v === null ? null : new TreeNode(v)));
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

BinaryTreeLevelOrder.prototype.layoutTree = function () {
  const canvasElem = document.getElementById("canvas");
  const w = canvasElem ? canvasElem.width : 1000;
  const startY = this.videoMode ? 80 : 60;
  const levelHeight = this.videoMode ? 80 : 80;
  const recurse = (node, x, y, offset) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.left) recurse(node.left, x - offset, y + levelHeight, offset / 2);
    if (node.right) recurse(node.right, x + offset, y + levelHeight, offset / 2);
  };
  recurse(this.root, w / 2, startY, w / 4);
};

BinaryTreeLevelOrder.prototype.setup = function () {
  if (!this.arr || this.arr.length === 0) {
    this.arr = [3, 9, 20, null, null, 15, 7];
  }
  this.root = this.buildTreeFromArray(this.arr);
  this.layoutTree();

  this.commands = [];
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

  const canvasElem = document.getElementById("canvas");
  const canvasH = canvasElem ? canvasElem.height : 600;
  this.resultLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.resultLabelID, "Result: []", 20, canvasH - 40, 0);
  this.cmd("SetForegroundColor", this.resultLabelID, "#000000");

  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.clearHistory();
};

BinaryTreeLevelOrder.prototype.reset = function () {
  this.nextIndex = 0;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

BinaryTreeLevelOrder.prototype.startCallback = function () {
  if (!this.root) return;
  this.implementAction(this.traverseTree.bind(this), 0);
};

BinaryTreeLevelOrder.prototype.traverseTree = function () {
  this.commands = [];
  const queue = [];
  const result = [];
  queue.push(this.root);
  while (queue.length > 0) {
    const size = queue.length;
    const levelVals = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      this.cmd("SetHighlight", node.id, 1);
      this.cmd("Step");
      this.cmd("SetHighlight", node.id, 0);
      levelVals.push(String(node.val));
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push("[" + levelVals.join(", ") + "]");
    this.cmd(
      "SetText",
      this.resultLabelID,
      "Result: [" + result.join(", ") + "]"
    );
    this.cmd("Step");
  }
  return this.commands;
};

BinaryTreeLevelOrder.prototype.videoModeCallback = function () {
  this.videoMode = !this.videoMode;
  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    if (this.videoMode) {
      canvasElem.width = 540;
      canvasElem.height = 960;
      if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
        animationManager.animatedObjects.width = 540;
        animationManager.animatedObjects.height = 960;
      }
    } else {
      canvasElem.width = 1000;
      canvasElem.height = 600;
      if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
        animationManager.animatedObjects.width = 1000;
        animationManager.animatedObjects.height = 600;
      }
    }
  }
  this.reset();
};

BinaryTreeLevelOrder.prototype.recordCallback = function () {
  if (this.recording) {
    this.stopRecording();
  } else {
    this.startRecording();
  }
};

BinaryTreeLevelOrder.prototype.startRecording = function () {
  const canvasElem = document.getElementById("canvas");
  if (!canvasElem || !canvasElem.captureStream) return;
  this.chunks = [];
  const stream = canvasElem.captureStream(30);
  try {
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  } catch (e) {
    return;
  }
  this.mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) this.chunks.push(e.data);
  };
  this.mediaRecorder.onstop = () => {
    const blob = new Blob(this.chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "levelorder.webm";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };
  this.mediaRecorder.start();
  this.recording = true;
  this.recordButton.value = "Stop Recording";
};

BinaryTreeLevelOrder.prototype.stopRecording = function () {
  if (this.mediaRecorder && this.recording) {
    this.mediaRecorder.stop();
  }
  this.recording = false;
  this.recordButton.value = "Start Recording";
};

BinaryTreeLevelOrder.prototype.disableUI = function () {
  for (let i = 0; i < this.controls.length; i++) this.controls[i].disabled = true;
};
BinaryTreeLevelOrder.prototype.enableUI = function () {
  for (let i = 0; i < this.controls.length; i++) this.controls[i].disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new BinaryTreeLevelOrder(animManag, canvas.width, canvas.height);
}
