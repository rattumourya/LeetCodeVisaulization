// BSD-2-Clause license header from original framework applies.

/*
 * PartitionEqualSubsetSum.js - Animated solution for LeetCode 416
 * Provides controls to build an input array and watch the DP
 * that determines if the array can be partitioned into two
 * subsets with equal sum.
 */

function PartitionEqualSubsetSum(am, w, h) { this.init(am, w, h); }

PartitionEqualSubsetSum.prototype = new Algorithm();
PartitionEqualSubsetSum.prototype.constructor = PartitionEqualSubsetSum;
PartitionEqualSubsetSum.superclass = Algorithm.prototype;

// Pseudocode to display
PartitionEqualSubsetSum.CODE = [
  "sum = total(nums)",
  "if sum % 2 == 1: return false",
  "target = sum / 2",
  "dp[0] = true",
  "for num in nums:",
  "  for j = target..num:",
  "    dp[j] |= dp[j-num]",
  "return dp[target]"
];

PartitionEqualSubsetSum.prototype.init = function (am, w, h) {
  PartitionEqualSubsetSum.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.arr = [];
  this.n = 0;

  this.arrIDs = [];
  this.arrX = [];
  this.arrY = [];
  this.dpIDs = [];
  this.dpX = [];
  this.dpY = [];
  this.codeIDs = [];

  this.sumLabelID = -1;
  this.sumValueID = -1;
  this.targetLabelID = -1;
  this.targetValueID = -1;
  this.resultLabelID = -1;
  this.resultValueID = -1;

  this.setup();
};

PartitionEqualSubsetSum.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Array (comma/space):");
  this.inputField = addControlToAlgorithmBar("Text", "");
  this.inputField.size = 40;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Array");
  this.buildButton.onclick = this.buildArrayCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Run Partition");
  this.startButton.onclick = this.startCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.pauseButton = addControlToAlgorithmBar("Button", "Pause / Play");
  this.pauseButton.onclick = this.pauseCallback.bind(this);

  this.stepButton = addControlToAlgorithmBar("Button", "Next Step");
  this.stepButton.onclick = this.stepCallback.bind(this);

  this.controls.push(
    this.inputField,
    this.buildButton,
    this.startButton
  );
};

PartitionEqualSubsetSum.prototype.buildArrayCallback = function () {
  const raw = this.inputField.value.trim();
  if (!raw) return;
  const vals = raw
    .split(/[\s,;]+/)
    .map(Number)
    .filter((v) => !isNaN(v) && v > 0);
  if (vals.length === 0) return;
  this.arr = vals;
  this.n = vals.length;
  this.reset();
};

PartitionEqualSubsetSum.prototype.setup = function () {
  if (!this.arr || this.arr.length === 0) {
    this.arr = [1, 5, 11, 5];
  }
  this.n = this.arr.length;

  const canvas = document.getElementById("canvas");
  const canvasW = canvas ? canvas.width : 540;

  const RECT_W = 50;
  const RECT_H = 50;
  const RECT_SP = 10;

  const arrWidth = this.n * (RECT_W + RECT_SP) - RECT_SP;
  const startX = Math.max(10, Math.floor((canvasW - arrWidth) / 2));
  const startY = 80;

  this.commands = [];
  this.arrIDs = [];
  this.arrX = [];
  this.arrY = [];
  this.dpIDs = [];
  this.dpX = [];
  this.dpY = [];
  this.codeIDs = [];

  // Draw array numbers
  for (let i = 0; i < this.n; i++) {
    const id = this.nextIndex++;
    this.arrIDs.push(id);
    const x = startX + i * (RECT_W + RECT_SP);
    this.arrX.push(x);
    this.arrY.push(startY);
    this.cmd("CreateRectangle", id, String(this.arr[i]), RECT_W, RECT_H, x, startY);
    this.cmd("SetBackgroundColor", id, "#f0f7ff");
    this.cmd("SetForegroundColor", id, "#000000");
    const lid = this.nextIndex++;
    this.cmd("CreateLabel", lid, "nums[" + i + "]", x + RECT_W / 2, startY + RECT_H + 15, 1);
    this.cmd("SetForegroundColor", lid, "#888888");
  }

  // Sum and target labels
  const infoY = startY + RECT_H + 60;
  this.sumLabelID = this.nextIndex++;
  this.sumValueID = this.nextIndex++;
  this.sumValueX = startX + 60;
  this.sumValueY = infoY;
  this.targetLabelID = this.nextIndex++;
  this.targetValueID = this.nextIndex++;
  this.targetValueX = startX + 60;
  this.targetValueY = infoY + 30;
  this.cmd("CreateLabel", this.sumLabelID, "sum:", startX, infoY, 0);
    this.cmd("CreateLabel", this.sumValueID, "0", this.sumValueX, infoY, 0);
  this.cmd("CreateLabel", this.targetLabelID, "target:", startX, infoY + 30, 0);
  this.cmd("CreateLabel", this.targetValueID, "", this.targetValueX, this.targetValueY, 0);

  // DP array setup (size based on current target estimate)
  const total = this.arr.reduce((a, b) => a + b, 0);
  const target = Math.floor(total / 2);
  const dpY = infoY + 110;
  for (let j = 0; j <= target; j++) {
    const id = this.nextIndex++;
    this.dpIDs.push(id);
    const x = startX + j * (RECT_W + RECT_SP);
    this.dpX.push(x);
    this.dpY.push(dpY);
    this.cmd("CreateRectangle", id, "F", RECT_W, RECT_H, x, dpY);
    this.cmd("SetBackgroundColor", id, "#eeeeee");
    this.cmd("SetForegroundColor", id, "#000000");
    const lid = this.nextIndex++;
    this.cmd("CreateLabel", lid, String(j), x + RECT_W / 2, dpY + RECT_H + 15, 1);
    this.cmd("SetForegroundColor", lid, "#888888");
  }

  this.resultLabelID = this.nextIndex++;
  this.resultValueID = this.nextIndex++;
  const resY = dpY + RECT_H + 40;
  this.cmd("CreateLabel", this.resultLabelID, "Can Partition:", startX, resY, 0);
  this.cmd("CreateLabel", this.resultValueID, "?", startX + 140, resY, 0);

  // Code lines displayed beneath result
  const CODE_LINE_H = 22;
  const codeY = resY + 40;
  for (let i = 0; i < PartitionEqualSubsetSum.CODE.length; i++) {
    const id = this.nextIndex++;
    this.codeIDs.push(id);
    this.cmd(
      "CreateLabel",
      id,
      PartitionEqualSubsetSum.CODE[i],
      startX,
      codeY + i * CODE_LINE_H,
      0
    );
    this.cmd("SetForegroundColor", id, "#000000");
  }

  // extend canvas height if needed
  const neededH = codeY + PartitionEqualSubsetSum.CODE.length * CODE_LINE_H + 80;
  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    if (canvasElem.height < neededH) {
      canvasElem.height = neededH;
      if (
        typeof animationManager !== "undefined" &&
        animationManager.animatedObjects
      ) {
        animationManager.animatedObjects.height = neededH;
      }
    }
  }

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

PartitionEqualSubsetSum.prototype.highlightCode = function (line) {
  for (let i = 0; i < this.codeIDs.length; i++) {
    this.cmd("SetHighlight", this.codeIDs[i], i === line ? 1 : 0);
  }
  this.cmd("Step");
};

PartitionEqualSubsetSum.prototype.startCallback = function () {
  if (!this.arr || this.arr.length === 0) return;
  this.implementAction(this.runAlgorithm.bind(this), 0);
};

PartitionEqualSubsetSum.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") doPlayPause();
};

PartitionEqualSubsetSum.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function")
      doPlayPause();
    animationManager.step();
  }
};

PartitionEqualSubsetSum.prototype.runAlgorithm = function () {
  this.commands = [];
  let sum = 0;
  this.highlightCode(0);
  for (let i = 0; i < this.n; i++) {
    const moveID = this.nextIndex++;
    this.cmd("CreateLabel", moveID, String(this.arr[i]), this.arrX[i], this.arrY[i]);
    this.cmd("Move", moveID, this.sumValueX, this.sumValueY);
    this.cmd("Step");
    this.cmd("Delete", moveID);
    sum += this.arr[i];
    this.cmd("SetText", this.sumValueID, String(sum));
    this.cmd("Step");
  }

  this.highlightCode(1);
  if (sum % 2 === 1) {
    this.cmd("SetText", this.resultValueID, "false");
    return this.commands;
  }

  this.highlightCode(2);
  const target = Math.floor(sum / 2);
  this.cmd("SetText", this.targetValueID, String(target));

  // ensure dp array has enough cells
  if (this.dpIDs.length < target + 1) {
    // rebuild visualization to have larger dp array
    this.setup();
    return this.runAlgorithm();
  }

  this.highlightCode(3);
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  this.cmd("SetText", this.dpIDs[0], "T");
  this.cmd("SetBackgroundColor", this.dpIDs[0], "#dff7df");
  this.cmd("Step");

  for (let i = 0; i < this.n; i++) {
    this.highlightCode(4);
    this.cmd("SetBackgroundColor", this.arrIDs[i], "#ffe9a8");
    this.cmd("Step");
    for (let j = target; j >= this.arr[i]; j--) {
      this.highlightCode(5);
      this.cmd("SetBackgroundColor", this.dpIDs[j], "#ffd4d4");
      this.cmd("SetBackgroundColor", this.dpIDs[j - this.arr[i]], "#ffd4d4");
      this.cmd("Step");
      this.highlightCode(6);
      if (dp[j - this.arr[i]]) {
        dp[j] = true;
        this.cmd("SetText", this.dpIDs[j], "T");
        this.cmd("SetBackgroundColor", this.dpIDs[j], "#dff7df");
      }
      this.cmd("SetBackgroundColor", this.dpIDs[j - this.arr[i]], dp[j - this.arr[i]] ? "#dff7df" : "#eeeeee");
      this.cmd("SetBackgroundColor", this.dpIDs[j], dp[j] ? "#dff7df" : "#eeeeee");
      this.cmd("Step");
    }
    this.cmd("SetBackgroundColor", this.arrIDs[i], "#f0f7ff");
  }

  this.highlightCode(7);
  this.cmd("SetText", this.resultValueID, dp[target] ? "true" : "false");
  return this.commands;
};

PartitionEqualSubsetSum.prototype.reset = function () {
  this.nextIndex = 0;
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

PartitionEqualSubsetSum.prototype.disableUI = function () {
  for (let i = 0; i < this.controls.length; i++) this.controls[i].disabled = true;
};
PartitionEqualSubsetSum.prototype.enableUI = function () {
  for (let i = 0; i < this.controls.length; i++) this.controls[i].disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new PartitionEqualSubsetSum(animManag, canvas.width, canvas.height);
}

