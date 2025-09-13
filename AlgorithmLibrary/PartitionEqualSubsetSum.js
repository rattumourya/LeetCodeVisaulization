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
  this.weightLabelIDs = [];
  this.capacityLabelIDs = [];
  this.weightLabelIDs = [];
  this.capacityLabelIDs = [];

  this.titleID = -1;
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

  const TITLE_Y = 30;
  const RECT_W = 25;
  const RECT_H = 25;
  const RECT_SP = 3;

  const total = this.arr.reduce((a, b) => a + b, 0);
  const target = Math.floor(total / 2);
  const gridWidth = (target + 1) * (RECT_W + RECT_SP) - RECT_SP;
  const arrWidth = this.n * (RECT_W + RECT_SP) - RECT_SP;
  const maxWidth = Math.max(arrWidth, gridWidth);
  const startX = Math.floor((canvasW - maxWidth) / 2);
  const startY = 80;

  this.RECT_W = RECT_W;
  this.RECT_H = RECT_H;
  this.RECT_SP = RECT_SP;
  this.startX = startX;
  this.startY = startY;

  this.commands = [];
  this.arrIDs = [];
  this.arrX = [];
  this.arrY = [];
  this.dpIDs = [];
  this.dpX = [];
  this.dpY = [];
  this.codeIDs = [];

  // Title centered at top of canvas
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Bottom-Up 2D Tabulation (0/1 Knapsack)",
    canvasW / 2,
    TITLE_Y,
    1
  );
  this.cmd("SetForegroundColor", this.titleID, "#000000");
  this.cmd("SetTextStyle", this.titleID, "bold 16");

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
  const infoY = startY + RECT_H + 40;
  this.infoY = infoY;
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
  this.cmd("SetTextStyle", this.sumLabelID, "bold 14");
  this.cmd("SetTextStyle", this.targetLabelID, "bold 14");

  // Explanatory message moved slightly left and enlarged
  const messageX = canvasW - 240;
  const messageY = TITLE_Y + 40;
  this.messageID = this.nextIndex++;
  this.cmd("CreateLabel", this.messageID, "", messageX, messageY, 0);
  this.cmd("SetForegroundColor", this.messageID, "#003366");
  this.cmd("SetTextStyle", this.messageID, "18");

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

// Build the visual DP table once the target is known
PartitionEqualSubsetSum.prototype.createDPGrid = function (target) {
  const RECT_W = this.RECT_W;
  const RECT_H = this.RECT_H;
  const RECT_SP = this.RECT_SP;
  const startX = this.startX;
  const dpStartY = this.infoY + 100;

  // clear any existing grid/labels
  for (const row of this.dpIDs) {
    for (const id of row) this.cmd("Delete", id);
  }
  for (const id of this.weightLabelIDs) this.cmd("Delete", id);
  for (const id of this.capacityLabelIDs) this.cmd("Delete", id);
  if (this.resultLabelID !== -1) this.cmd("Delete", this.resultLabelID);
  if (this.resultValueID !== -1) this.cmd("Delete", this.resultValueID);
  for (const id of this.codeIDs) this.cmd("Delete", id);

  this.dpIDs = [];
  this.dpX = [];
  this.dpY = [];
  this.weightLabelIDs = [];
  this.capacityLabelIDs = [];
  this.codeIDs = [];

  for (let i = 0; i <= this.n; i++) {
    const rowIDs = [];
    const rowX = [];
    const rowY = [];
    const y = dpStartY + i * (RECT_H + RECT_SP);
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

    const vlabel = this.nextIndex++;
    const vtext = i === 0 ? "0" : String(this.arr[i - 1]);
    const vlabelX = startX - (RECT_W / 2 + RECT_SP + 12);
    const vlabelY = y; // center vertically with the row
    this.cmd("CreateLabel", vlabel, vtext, vlabelX, vlabelY, 0);
    this.cmd("SetForegroundColor", vlabel, "#000000");
    this.cmd("SetTextStyle", vlabel, "12");
    this.weightLabelIDs.push(vlabel);
  }

  const gridBottomY = dpStartY + this.n * (RECT_H + RECT_SP);
  const capLabelY = gridBottomY + RECT_H / 2 + RECT_SP;
  for (let j = 0; j <= target; j++) {
    const lid = this.nextIndex++;
    const x = startX + j * (RECT_W + RECT_SP);
    this.cmd("CreateLabel", lid, String(j), x, capLabelY, 0);
    this.cmd("SetForegroundColor", lid, "#000000");
    this.cmd("SetTextStyle", lid, "12");
    this.capacityLabelIDs.push(lid);
  }

  this.resultLabelID = this.nextIndex++;
  this.resultValueID = this.nextIndex++;
  const resY = capLabelY + 40;
  this.cmd("CreateLabel", this.resultLabelID, "Can Partition:", startX, resY, 0);
  this.cmd("CreateLabel", this.resultValueID, "?", startX + 140, resY, 0);
  this.cmd("SetTextStyle", this.resultLabelID, "bold 14");

  const CODE_LINE_H = 22;
  const codeY = resY + 40;
  const canvas = document.getElementById("canvas");
  const canvasW = canvas ? canvas.width : 540;
  const maxCodeLen = Math.max(...PartitionEqualSubsetSum.CODE.map((s) => s.length));
  const CODE_CHAR_W = 7;
  const codeStartX = Math.floor((canvasW - maxCodeLen * CODE_CHAR_W) / 2);
  for (let i = 0; i < PartitionEqualSubsetSum.CODE.length; i++) {
    const id = this.nextIndex++;
    this.codeIDs.push(id);

    this.cmd(
      "CreateLabel",
      id,
      PartitionEqualSubsetSum.CODE[i],
      codeStartX,
      codeY + i * CODE_LINE_H,
      0
    );
    this.cmd("SetForegroundColor", id, "#000000");
  }

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

  this.createDPGrid(target);
  this.cmd("Step");

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

