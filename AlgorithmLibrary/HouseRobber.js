// BSD-2-Clause license header from the original framework applies.

/*
 * HouseRobber.js - Animated solution for LeetCode 198
 * - Custom input of house values
 * - Pause/Play & Step
 * - Code highlighting
 * - YouTube "Video Mode" (9:16 portrait): Title -> Houses -> DP -> Result -> Code
 */

function HouseRobber(am, w, h) { this.init(am, w, h); }

HouseRobber.prototype = new Algorithm();
HouseRobber.prototype.constructor = HouseRobber;
HouseRobber.superclass = Algorithm.prototype;

HouseRobber.prototype.init = function (am, w, h) {
  HouseRobber.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.arr = [];
  this.n = 0;

  this.houseIDs = [];
  this.dpIDs = [];
  this.codeLineIDs = [];
  this.titleID = -1;
  this.resultLabelID = -1;
  this.resultValueID = -1;

  this.videoMode = false;

  this.setup();
};

HouseRobber.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Houses (comma/space):");
  this.inputField = addControlToAlgorithmBar("Text", "");
  this.inputField.size = 40;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Array");
  this.buildButton.onclick = this.buildArrayCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Run DP");
  this.startButton.onclick = this.startCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.pauseButton = addControlToAlgorithmBar("Button", "Pause / Play");
  this.pauseButton.onclick = this.pauseCallback.bind(this);

  this.stepButton = addControlToAlgorithmBar("Button", "Next Step");
  this.stepButton.onclick = this.stepCallback.bind(this);

  this.videoButton = addControlToAlgorithmBar("Button", "Video Mode");
  this.videoButton.onclick = this.videoModeCallback.bind(this);

  this.controls.push(this.inputField, this.buildButton, this.startButton, this.videoButton);
};

HouseRobber.prototype.videoModeCallback = function () {
  this.videoMode = !this.videoMode;

  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    if (this.videoMode) {
      canvasElem.width = 540; // 9:16 base width
      if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
        animationManager.animatedObjects.width = 540;
      }
    } else {
      canvasElem.width = 1000;
      if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
        animationManager.animatedObjects.width = 1000;
      }
    }
  }
  this.reset();
};

HouseRobber.prototype.buildArrayCallback = function () {
  const raw = this.inputField.value.trim();
  if (!raw) return;
  const vals = raw.split(/[\s,;]+/).map(Number).filter(v => !isNaN(v));
  if (vals.length === 0) return;
  this.arr = vals;
  this.n = vals.length;
  this.reset();
};

HouseRobber.prototype.setup = function () {
  if (!this.arr || this.arr.length === 0) {
    this.arr = [2, 7, 9, 3, 1];
  }
  this.n = this.arr.length;

  // Layout + sizes
  const canvasElem = document.getElementById("canvas");
  const canvasW = canvasElem ? canvasElem.width : 1000;

  const HOUSE_SIZE = this.videoMode ? 56 : 64;
  const HOUSE_SP   = 8;

  const DP_SIZE    = this.videoMode ? 46 : 52;
  const DP_SP      = 8;

  const TITLE_TOP_MARGIN = this.videoMode ? 60 : 40;

  // Center the houses row
  const housesWidth = this.n * (HOUSE_SIZE + HOUSE_SP) - HOUSE_SP;

  this.commands = [];
  this.houseIDs = [];
  this.dpIDs = [];
  this.codeLineIDs = [];

  let startX, startY;
  if (this.videoMode) {
    startX = Math.max(10, Math.floor((canvasW - housesWidth) / 2));
    startY = TITLE_TOP_MARGIN + 40; // title sits above
  } else {
    startX = 50;
    startY = 80;
  }

// Title on canvas
this.titleID = this.nextIndex++;
const titleText = "Animated solution for leetcode 198";
const titleX = this.videoMode ? canvasW / 2 : startX + housesWidth / 2;
const titleY = this.videoMode ? TITLE_TOP_MARGIN : startY - 40;
this.cmd("CreateLabel", this.titleID, titleText, titleX, titleY, 1);
this.cmd("SetForegroundColor", this.titleID, "#000000");
this.cmd("SetTextSize", this.titleID, 22);   // << NEW

  // Draw houses
  for (let i = 0; i < this.n; i++) {
    const id = this.nextIndex++;
    this.houseIDs.push(id);
    const x = startX + i * (HOUSE_SIZE + HOUSE_SP);
    const y = startY;
    this.cmd("CreateRectangle", id, String(this.arr[i]), HOUSE_SIZE, HOUSE_SIZE, x, y);
    this.cmd("SetBackgroundColor", id, "#f0f7ff");
    this.cmd("SetForegroundColor", id, "#000000");

    // index label
    const lid = this.nextIndex++;
    this.cmd("CreateLabel", lid, "i=" + i, x + HOUSE_SIZE/2, y + HOUSE_SIZE + 15, 1);
    this.cmd("SetForegroundColor", lid, "#888888");
  }

  // DP row (under houses)
  const dpStartY = startY + HOUSE_SIZE + 50;
  for (let i = 0; i < this.n; i++) {
    const id = this.nextIndex++;
    this.dpIDs.push(id);
    const x = startX + i * (DP_SIZE + DP_SP);
    this.cmd("CreateRectangle", id, "", DP_SIZE, DP_SIZE, x, dpStartY);
    this.cmd("SetBackgroundColor", id, "#eeeeee");
    this.cmd("SetForegroundColor", id, "#000000");
  }

  // Result labels (left aligned with houses)
  this.resultLabelID = this.nextIndex++;
  this.resultValueID = this.nextIndex++;
  const resultY = dpStartY + DP_SIZE + 30;
  this.cmd("CreateLabel", this.resultLabelID, "Max Rob Amount:", startX, resultY, 0);
  this.cmd("SetForegroundColor", this.resultLabelID, "#000000");
  this.cmd("CreateLabel", this.resultValueID, "0", startX + 160, resultY, 0);
  this.cmd("SetForegroundColor", this.resultValueID, "#000000");

  // Code paradigm (right side normal; below in video mode)
  this.codeLines = [
    "if n == 0: return 0",
    "dp[0] = nums[0]",
    "dp[1] = max(nums[0], nums[1])",
    "for i in 2..n-1:",
    "  take = dp[i-2] + nums[i]",
    "  skip = dp[i-1]",
    "  dp[i] = max(skip, take)",
    "return dp[n-1]"
  ];

  const CODE_LINE_H = this.videoMode ? 20 : 22;

  if (!this.videoMode) {
    const codeX = startX + Math.max(housesWidth, this.n * (DP_SIZE + DP_SP) - DP_SP) + 80;
    const codeY = startY - 10;
    for (let i = 0; i < this.codeLines.length; i++) {
      const id = this.nextIndex++;
      this.codeLineIDs.push(id);
      this.cmd("CreateLabel", id, this.codeLines[i], codeX, codeY + i * CODE_LINE_H, 0);
      this.cmd("SetForegroundColor", id, "#000000");
    }
    // Canvas height for normal
    const needed = resultY + 100;
    const canvasElem3 = document.getElementById("canvas");
    if (canvasElem3) canvasElem3.height = Math.max(needed, 600);
    if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
      animationManager.animatedObjects.height = Math.max(needed, 600);
    }
  } else {
    // Video mode: code below result
    const codeX = startX;
    const codeY = resultY + 40;

    // Header
    this.codeHeaderID = this.nextIndex++;
    this.cmd("CreateLabel", this.codeHeaderID, "Number Of Island:", codeX, codeY - CODE_LINE_H, 0);
    this.cmd("SetForegroundColor", this.codeHeaderID, "#00aa00");
    // (We keep the historical header style per your outline request)

    for (let i = 0; i < this.codeLines.length; i++) {
      const id = this.nextIndex++;
      this.codeLineIDs.push(id);
      this.cmd("CreateLabel", id, this.codeLines[i], codeX, codeY + i * CODE_LINE_H, 0);
      this.cmd("SetForegroundColor", id, "#000000");
    }

    // Canvas height respects 9:16 minimum
    const bottom = codeY + this.codeLines.length * CODE_LINE_H + 80;
    const ratioH = Math.round(canvasW * 16 / 9);
    const finalH = Math.max(bottom, ratioH);
    if (canvasElem) canvasElem.height = finalH;
    if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
      animationManager.animatedObjects.height = finalH;
    }
  }

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

HouseRobber.prototype.highlightCode = function (lineIdx) {
  for (let i = 0; i < this.codeLineIDs.length; i++) {
    this.cmd("SetHighlight", this.codeLineIDs[i], i === lineIdx ? 1 : 0);
  }
  this.cmd("Step");
};

HouseRobber.prototype.startCallback = function () {
  this.implementAction(this.runDP.bind(this), "");
};

HouseRobber.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") doPlayPause();
};

HouseRobber.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") doPlayPause();
    animationManager.step();
  }
};

HouseRobber.prototype.runDP = function () {
  this.commands = [];

  const n = this.n;
  const a = this.arr.slice();
  if (n === 0) {
    this.highlightCode(0);
    return this.commands;
  }

  const dp = new Array(n).fill(0);

  // dp[0]
  this.highlightCode(1);
  dp[0] = a[0];
  this.cmd("SetText", this.dpIDs[0], String(dp[0]));
  this.cmd("SetBackgroundColor", this.dpIDs[0], "#dff7df");
  this.cmd("Step");
  this.cmd("SetText", this.resultValueID, String(dp[0]));

  if (n > 1) {
    // dp[1]
    this.highlightCode(2);
    dp[1] = Math.max(a[0], a[1]);
    this.cmd("SetText", this.dpIDs[1], String(dp[1]));
    this.cmd("SetBackgroundColor", this.dpIDs[1], "#dff7df");
    this.cmd("Step");
    this.cmd("SetText", this.resultValueID, String(dp[1]));
  }

  for (let i = 2; i < n; i++) {
    // for loop line
    this.highlightCode(3);

    // take = dp[i-2] + a[i]
    this.highlightCode(4);
    const take = dp[i - 2] + a[i];
    // flash dp[i-2] and house[i]
    this.cmd("SetBackgroundColor", this.dpIDs[i - 2], "#ffe9a8");
    this.cmd("SetBackgroundColor", this.houseIDs[i], "#ffe9a8");
    this.cmd("Step");
    this.cmd("SetBackgroundColor", this.dpIDs[i - 2], "#dff7df");
    this.cmd("SetBackgroundColor", this.houseIDs[i], "#f0f7ff");

    // skip = dp[i-1]
    this.highlightCode(5);
    const skip = dp[i - 1];
    this.cmd("SetBackgroundColor", this.dpIDs[i - 1], "#ffe9a8");
    this.cmd("Step");
    this.cmd("SetBackgroundColor", this.dpIDs[i - 1], "#dff7df");

    // dp[i] = max(skip, take)
    this.highlightCode(6);
    dp[i] = Math.max(skip, take);
    this.cmd("SetText", this.dpIDs[i], String(dp[i]));
    this.cmd("SetBackgroundColor", this.dpIDs[i], "#dff7df");
    // emphasize winning choice
    if (dp[i] === take) {
      this.cmd("SetBackgroundColor", this.houseIDs[i], "#ffd4d4");
      this.cmd("Step");
      this.cmd("SetBackgroundColor", this.houseIDs[i], "#f0f7ff");
    } else {
      this.cmd("SetBackgroundColor", this.dpIDs[i - 1], "#ffd4d4");
      this.cmd("Step");
      this.cmd("SetBackgroundColor", this.dpIDs[i - 1], "#dff7df");
    }

    this.cmd("SetText", this.resultValueID, String(dp[i]));
    this.cmd("Step");
  }

  // return dp[n-1]
  this.highlightCode(7);
  return this.commands;
};

HouseRobber.prototype.reset = function () {
  this.nextIndex = 0;
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

HouseRobber.prototype.disableUI = function () {
  for (let i = 0; i < this.controls.length; i++) this.controls[i].disabled = true;
};
HouseRobber.prototype.enableUI = function () {
  for (let i = 0; i < this.controls.length; i++) this.controls[i].disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new HouseRobber(animManag, canvas.width, canvas.height);
}