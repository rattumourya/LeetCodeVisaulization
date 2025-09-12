// BSD-2-Clause license header from original framework applies.

/*
 * PartitionEqualSubsetSum.js - Animated solution for LeetCode 416
 * Provides controls to build an input array and watch the DP
 * that determines if the array can be partitioned into two
 * subsets with equal sum.
 */

function PartitionEqualSubsetSum(am, w, h) {
  this.init(am, w, h);
}

PartitionEqualSubsetSum.prototype = new Algorithm();
PartitionEqualSubsetSum.prototype.constructor = PartitionEqualSubsetSum;
PartitionEqualSubsetSum.superclass = Algorithm.prototype;

// Java-style reference code displayed alongside animation
PartitionEqualSubsetSum.CODE = [
  "boolean canPartition(int[] nums) {",
  "  int sum = total(nums);",
  "  if (sum % 2 == 1) return false;",
  "  int target = sum / 2;",
  "  boolean[][] dp = new boolean[n + 1][target + 1];",
  "  dp[0][0] = true;",
  "  for (int i = 1; i <= n; i++) {",
  "    for (int j = 0; j <= target; j++) {",
  "      dp[i][j] = dp[i - 1][j];",
  "      if (j >= nums[i - 1]) {",
  "        dp[i][j] |= dp[i - 1][j - nums[i - 1]];",
  "      }",
  "    }",
  "  }",
  "  return dp[n][target];",
  "}"
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
  this.messageID = -1;

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

  this.controls.push(this.inputField, this.buildButton, this.startButton);
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

  const RECT_W = 25;
  const RECT_H = 25;
  const RECT_SP = 3;

  const total = this.arr.reduce((a, b) => a + b, 0);
  const target = Math.floor(total / 2);
  const gridWidth = (target + 1) * (RECT_W + RECT_SP) - RECT_SP;
  const arrWidth = this.n * (RECT_W + RECT_SP) - RECT_SP;
  const maxWidth = Math.max(arrWidth, gridWidth);
  const startX = Math.floor((canvasW - maxWidth) / 2);
  const startY = 60;

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

  // DP matrix setup (n+1 by target+1)
  const dpStartY = infoY + 100;
  const gridHeight = (this.n + 1) * (RECT_H + RECT_SP) - RECT_SP;
  for (let i = 0; i <= this.n; i++) {
    const rowIDs = [];
    const rowX = [];
    const rowY = [];
    const y = dpStartY + i * (RECT_H + RECT_SP);
    // Row label (index centered beside row)
    const rlabel = this.nextIndex++;
    const rtext = String(i);
    this.cmd("CreateLabel", rlabel, rtext, startX - 15, y + RECT_H / 2, 0);
    this.cmd("SetForegroundColor", rlabel, "#888888");
    for (let j = 0; j <= target; j++) {
      const id = this.nextIndex++;
      const x = startX + j * (RECT_W + RECT_SP);
      rowIDs.push(id);
      rowX.push(x);
      rowY.push(y);
      this.cmd("CreateRectangle", id, "F", RECT_W, RECT_H, x, y);
      this.cmd("SetBackgroundColor", id, "#eeeeee");
      this.cmd("SetForegroundColor", id, "#000000");
    }
    this.dpIDs.push(rowIDs);
    this.dpX.push(rowX);
    this.dpY.push(rowY);
  }

  // Column labels (indices centered above columns)
  for (let j = 0; j <= target; j++) {
    const lid = this.nextIndex++;
    const x = startX + j * (RECT_W + RECT_SP) + RECT_W / 2;
    this.cmd("CreateLabel", lid, String(j), x, dpStartY - 15, 0);
    this.cmd("SetForegroundColor", lid, "#888888");
  }

  this.resultLabelID = this.nextIndex++;
  this.resultValueID = this.nextIndex++;
  const gridBottomY = dpStartY + gridHeight;
  const resY = gridBottomY + 40;
  this.cmd("CreateLabel", this.resultLabelID, "Can Partition:", startX, resY, 0);
  this.cmd("CreateLabel", this.resultValueID, "?", startX + 140, resY, 0);

  // Explanatory message centered beneath result
  const messageY = resY + 40;
  this.messageID = this.nextIndex++;
  this.cmd("CreateLabel", this.messageID, "", canvasW / 2, messageY, 1);
  this.cmd("SetForegroundColor", this.messageID, "#003366");

  // Code lines displayed beneath message, centered in canvas
  const CODE_LINE_H = 22;
  const codeY = messageY + 40;
  const maxCodeLen = Math.max(...PartitionEqualSubsetSum.CODE.map((s) => s.length));
  const CODE_CHAR_W = 7;
  const codeStartX = Math.floor((canvasW - maxCodeLen * CODE_CHAR_W) / 2);
  for (let i = 0; i < PartitionEqualSubsetSum.CODE.length; i++) {
    const id = this.nextIndex++;
    this.codeIDs.push(id);
    this.cmd("CreateLabel", id, PartitionEqualSubsetSum.CODE[i], codeStartX, codeY + i * CODE_LINE_H, 0);
    this.cmd("SetForegroundColor", id, "#000000");
  }

  // extend canvas height if needed
  const neededH = codeY + PartitionEqualSubsetSum.CODE.length * CODE_LINE_H + 80;
  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    if (canvasElem.height < neededH) {
      canvasElem.height = neededH;
      if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
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
    if (!animationManager.animationPaused && typeof doPlayPause === "function") doPlayPause();
    animationManager.step();
  }
};

PartitionEqualSubsetSum.prototype.runAlgorithm = function () {
  this.commands = [];
  let sum = 0;
  this.highlightCode(1); // int sum = total(nums)
  this.cmd("SetText", this.messageID, "Computing total sum");
  this.cmd("Step");

  for (let i = 0; i < this.n; i++) {
    const moveID = this.nextIndex++;
    this.cmd("CreateLabel", moveID, String(this.arr[i]), this.arrX[i], this.arrY[i]);
    this.cmd("Move", moveID, this.sumValueX, this.sumValueY);
    this.cmd("Step");
    this.cmd("Delete", moveID);
    sum += this.arr[i];
    this.cmd("SetText", this.sumValueID, String(sum));
    this.cmd("SetText", this.messageID, "Sum = " + sum);
    this.cmd("Step");
  }

  this.highlightCode(2); // if odd
  if (sum % 2 === 1) {
    this.cmd("SetText", this.resultValueID, "false");
    this.cmd("SetText", this.messageID, "Total sum is odd -> cannot partition");
    return this.commands;
  }

  this.highlightCode(3); // target
  const target = Math.floor(sum / 2);
  this.cmd("SetText", this.targetValueID, String(target));
  this.cmd("SetText", this.messageID, "Target = " + target);
  this.cmd("Step");

  // ensure dp matrix big enough
  if (this.dpIDs.length < this.n + 1 || (this.dpIDs[0] && this.dpIDs[0].length < target + 1)) {
    this.setup();
    return this.runAlgorithm();
  }

  this.highlightCode(4); // boolean[][] dp...
  const dp = Array.from({ length: this.n + 1 }, () => new Array(target + 1).fill(false));
  this.highlightCode(5); // dp[0][0] = true
  dp[0][0] = true;
  this.cmd("SetText", this.dpIDs[0][0], "T");
  this.cmd("SetBackgroundColor", this.dpIDs[0][0], "#dff7df");
  this.cmd("SetText", this.messageID, "Base case: dp[0][0] = true");
  this.cmd("Step");

  for (let i = 1; i <= this.n; i++) {
    this.highlightCode(6); // for (int i ...)
    this.cmd("SetBackgroundColor", this.arrIDs[i - 1], "#ffe9a8");
    this.cmd("SetText", this.messageID, "Considering number " + this.arr[i - 1]);
    this.cmd("Step");
    for (let j = 0; j <= target; j++) {
      this.highlightCode(7); // for (int j ...)
      this.cmd("SetBackgroundColor", this.dpIDs[i][j], "#ffd4d4");
      this.cmd("SetBackgroundColor", this.dpIDs[i - 1][j], "#ffd4d4");
      this.cmd("SetText", this.messageID, "Try sum " + j);
      this.cmd("Step");
      this.highlightCode(8); // dp[i][j] = dp[i - 1][j]
      if (dp[i - 1][j]) {
        dp[i][j] = true;
      }
      this.cmd(
        "SetBackgroundColor",
        this.dpIDs[i - 1][j],
        dp[i - 1][j] ? "#dff7df" : "#eeeeee"
      );
      if (j >= this.arr[i - 1]) {
        this.highlightCode(9); // if (j >= nums[i - 1])
        this.cmd(
          "SetBackgroundColor",
          this.dpIDs[i - 1][j - this.arr[i - 1]],
          "#ffd4d4"
        );
        this.cmd("Step");
        this.highlightCode(10); // dp[i][j] |= dp[i - 1][j - nums[i - 1]]
        if (dp[i - 1][j - this.arr[i - 1]]) {
          dp[i][j] = true;
        }
        this.cmd(
          "SetBackgroundColor",
          this.dpIDs[i - 1][j - this.arr[i - 1]],
          dp[i - 1][j - this.arr[i - 1]] ? "#dff7df" : "#eeeeee"
        );
      }
      this.cmd("SetText", this.dpIDs[i][j], dp[i][j] ? "T" : "F");
      this.cmd(
        "SetBackgroundColor",
        this.dpIDs[i][j],
        dp[i][j] ? "#dff7df" : "#eeeeee"
      );
      if (dp[i][j]) {
        this.cmd("SetText", this.messageID, "Found sum " + j);
      }
      this.cmd("Step");
    }
    this.cmd("SetBackgroundColor", this.arrIDs[i - 1], "#f0f7ff");
  }

  this.highlightCode(14); // return dp[n][target]
  this.cmd(
    "SetText",
    this.resultValueID,
    dp[this.n][target] ? "true" : "false"
  );
  this.cmd(
    "SetText",
    this.messageID,
    dp[this.n][target] ? "Partition possible" : "No partition"
  );
  this.cmd("Step");
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

