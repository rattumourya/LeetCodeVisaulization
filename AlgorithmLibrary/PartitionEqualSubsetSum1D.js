// BSD-2-Clause license header from original framework applies.

/*
 * PartitionEqualSubsetSum1D.js - Animated space optimized solution for
 * LeetCode 416. This version mirrors the interface of the full 2‑D
 * visualization but only keeps a single one dimensional DP array.
 *
 * The animation code borrows heavily from PartitionEqualSubsetSum.js
 * but replaces the DP table construction and update logic to reflect
 * the 1‑D transition:
 *   dp[j] = dp[j] || dp[j - num]  (iterate j from target down to num)
 */

function PartitionEqualSubsetSum1D(am, w, h) {
  this.init(am, w, h);
}

PartitionEqualSubsetSum1D.prototype = new Algorithm();
PartitionEqualSubsetSum1D.prototype.constructor = PartitionEqualSubsetSum1D;
PartitionEqualSubsetSum1D.superclass = Algorithm.prototype;

PartitionEqualSubsetSum1D.CODE = [
  "boolean canPartition(int[] nums) {",
  "  int sum = total(nums);",
  "  if (sum % 2 == 1) return false;",
  "  int target = sum / 2;",
  "  boolean[] dp = new boolean[target + 1];",
  "  dp[0] = true;",
  "  for (int num : nums) {",
  "    for (int j = target; j >= num; j--) {",
  "      dp[j] = dp[j] || dp[j - num];",
  "    }",
  "  }",
  "  return dp[target];",
  "}",
];

PartitionEqualSubsetSum1D.prototype.init = function (am, w, h) {
  PartitionEqualSubsetSum1D.superclass.init.call(this, am, w, h);

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

PartitionEqualSubsetSum1D.prototype.addControls = function () {
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

PartitionEqualSubsetSum1D.prototype.buildArrayCallback = function () {
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

PartitionEqualSubsetSum1D.prototype.setup = function () {
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
  const arrWidth = this.n * (RECT_W + RECT_SP) - RECT_SP;
  const dpWidth = (target + 1) * (RECT_W + RECT_SP) - RECT_SP;
  const maxWidth = Math.max(arrWidth, dpWidth);
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
  this.capacityLabelIDs = [];

  // Title centered at top
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Space Optimized 1D DP (0/1 Knapsack)",
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
  this.cmd(
    "CreateLabel",
    this.targetValueID,
    "",
    this.targetValueX,
    this.targetValueY,
    0
  );
  this.cmd("SetTextStyle", this.sumLabelID, "bold 14");
  this.cmd("SetTextStyle", this.targetLabelID, "bold 14");

  // Message label placed beside target value
  const messageX = this.targetValueX + 160;
  const messageY = this.targetValueY;
  this.messageID = this.nextIndex++;
  this.cmd("CreateLabel", this.messageID, "", messageX, messageY, 0);
  this.cmd("SetForegroundColor", this.messageID, "#003366");
  this.cmd("SetTextStyle", this.messageID, "18");

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

// Build visual DP array once target known
PartitionEqualSubsetSum1D.prototype.createDPArray = function (target) {
  const RECT_W = this.RECT_W;
  const RECT_H = this.RECT_H;
  const RECT_SP = this.RECT_SP;
  const startX = this.startX;
  const dpStartY = this.infoY + 100;

  // delete previous dp/capacity/code/res labels
  for (const id of this.dpIDs) this.cmd("Delete", id);
  for (const id of this.capacityLabelIDs) this.cmd("Delete", id);
  if (this.resultLabelID !== -1) this.cmd("Delete", this.resultLabelID);
  if (this.resultValueID !== -1) this.cmd("Delete", this.resultValueID);
  for (const id of this.codeIDs) this.cmd("Delete", id);

  this.dpIDs = [];
  this.dpX = [];
  this.dpY = [];
  this.capacityLabelIDs = [];
  this.codeIDs = [];

  for (let j = 0; j <= target; j++) {
    const id = this.nextIndex++;
    const x = startX + j * (RECT_W + RECT_SP);
    const y = dpStartY;
    this.dpIDs.push(id);
    this.dpX.push(x);
    this.dpY.push(y);
    this.cmd("CreateRectangle", id, "F", RECT_W, RECT_H, x, y);
    this.cmd("SetBackgroundColor", id, "#eeeeee");
    this.cmd("SetForegroundColor", id, "#000000");
  }

  const capLabelY = dpStartY + RECT_H / 2 + RECT_SP + 10;
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

  // code snippet
  const CODE_LINE_H = 22;
  const codeY = resY + 40;
  const canvas = document.getElementById("canvas");
  const canvasW = canvas ? canvas.width : 540;
  const maxCodeLen = Math.max(...PartitionEqualSubsetSum1D.CODE.map((s) => s.length));
  const CODE_CHAR_W = 7;
  const codeStartX = Math.floor((canvasW - maxCodeLen * CODE_CHAR_W) / 2);
  for (let i = 0; i < PartitionEqualSubsetSum1D.CODE.length; i++) {
    const id = this.nextIndex++;
    this.codeIDs.push(id);
    this.cmd(
      "CreateLabel",
      id,
      PartitionEqualSubsetSum1D.CODE[i],
      codeStartX,
      codeY + i * CODE_LINE_H,
      0
    );
    this.cmd("SetForegroundColor", id, "#000000");
  }

  const neededH = codeY + PartitionEqualSubsetSum1D.CODE.length * CODE_LINE_H + 80;
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

PartitionEqualSubsetSum1D.prototype.highlightCode = function (line) {
  for (let i = 0; i < this.codeIDs.length; i++) {
    this.cmd("SetHighlight", this.codeIDs[i], i === line ? 1 : 0);
  }
  this.cmd("Step");
};

PartitionEqualSubsetSum1D.prototype.startCallback = function () {
  if (!this.arr || this.arr.length === 0) return;
  this.implementAction(this.runAlgorithm.bind(this), 0);
};

PartitionEqualSubsetSum1D.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") doPlayPause();
};

PartitionEqualSubsetSum1D.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") doPlayPause();
    animationManager.step();
  }
};

PartitionEqualSubsetSum1D.prototype.runAlgorithm = function () {
  this.commands = [];
  let sum = 0;
  var captionID = this.displayCaption("Computing total sum");
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

  this.removeCaption(captionID);
  captionID = this.displayCaption("Checking if sum is odd");
  this.highlightCode(2); // if odd
  if (sum % 2 === 1) {
    this.cmd("SetText", this.resultValueID, "false");
    this.cmd("SetText", this.messageID, "Total sum is odd -> cannot partition");
    this.removeCaption(captionID);
    captionID = this.displayCaption("Total sum is odd - cannot partition");
    this.cmd("Step");
    this.removeCaption(captionID);
    this.showOutroSlide("Thanks for watching! Subscribe and comment!");
    return this.commands;
  }
  this.removeCaption(captionID);

  this.highlightCode(3); // target
  const target = Math.floor(sum / 2);
  this.cmd("SetText", this.targetValueID, String(target));
  this.cmd("SetText", this.messageID, "Target = " + target);
  this.cmd("Step");

  captionID = this.displayCaption("Building DP array");
  this.createDPArray(target);
  this.cmd("Step");

  this.highlightCode(4); // boolean[] dp
  const dp = new Array(target + 1).fill(false);
  this.highlightCode(5); // dp[0] = true
  dp[0] = true;
  this.cmd("SetText", this.dpIDs[0], "T");
  this.cmd("SetBackgroundColor", this.dpIDs[0], "#dff7df");
  this.cmd("SetText", this.messageID, "Base case: dp[0] = true");
  this.cmd("Step");

  for (let i = 0; i < this.n; i++) {
    this.removeCaption(captionID);
    captionID = this.displayCaption("Considering number " + this.arr[i]);
    this.highlightCode(6); // for num : nums
    this.cmd("SetBackgroundColor", this.arrIDs[i], "#ffe9a8");
    this.cmd("SetText", this.messageID, "Considering number " + this.arr[i]);
    this.cmd("Step");

    for (let j = target; j >= this.arr[i]; j--) {
      this.highlightCode(7); // for j = target ...
      this.cmd("SetBackgroundColor", this.dpIDs[j], "#ffd4d4");
      this.cmd(
        "SetBackgroundColor",
        this.dpIDs[j - this.arr[i]],
        "#ffd4d4"
      );
      this.cmd("SetText", this.messageID, "Check j=" + j);
      this.cmd("Step");
      this.highlightCode(8); // dp[j] = dp[j] || dp[j - num]
      dp[j] = dp[j] || dp[j - this.arr[i]];
      this.cmd("SetText", this.dpIDs[j], dp[j] ? "T" : "F");
      this.cmd("SetBackgroundColor", this.dpIDs[j], dp[j] ? "#dff7df" : "#eeeeee");
      this.cmd(
        "SetBackgroundColor",
        this.dpIDs[j - this.arr[i]],
        dp[j - this.arr[i]] ? "#dff7df" : "#eeeeee"
      );
      this.cmd("Step");
    }
    for (let j = target; j >= this.arr[i]; j--) {
      this.cmd("SetBackgroundColor", this.dpIDs[j], dp[j] ? "#dff7df" : "#eeeeee");
    }
    this.cmd("SetBackgroundColor", this.arrIDs[i], "#f0f7ff");
  }

  this.removeCaption(captionID);
  this.highlightCode(11); // return dp[target]
  this.cmd(
    "SetText",
    this.resultValueID,
    dp[target] ? "true" : "false"
  );
  this.cmd(
    "SetText",
    this.messageID,
    dp[target] ? "Partition possible" : "No partition"
  );
  captionID = this.displayCaption(
    dp[target] ? "Partition possible" : "No partition"
  );
  this.cmd("Step");
  this.removeCaption(captionID);
  this.showOutroSlide("Thanks for watching! Subscribe and comment!");
  return this.commands;
};

PartitionEqualSubsetSum1D.prototype.reset = function () {
  this.nextIndex = 0;
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

PartitionEqualSubsetSum1D.prototype.disableUI = function () {
  for (let i = 0; i < this.controls.length; i++) this.controls[i].disabled = true;
};

PartitionEqualSubsetSum1D.prototype.enableUI = function () {
  for (let i = 0; i < this.controls.length; i++) this.controls[i].disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new PartitionEqualSubsetSum1D(
    animManag,
    canvas.width,
    canvas.height
  );
}

