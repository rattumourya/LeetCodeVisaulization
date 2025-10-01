// BSD-2-Clause license header from the original framework applies.

/*
 * ClimbingStairs.js - Animated solution for LeetCode 70 (Climbing Stairs)
 * Layout mirrors the CoinChangeBFS portrait story board:
 *  - 9:16 canvas with top narration board and left-aligned Java code block
 *  - Controls for setting n, playing the DP animation, pause, and step
 *  - Visual stairs in the center, DP table at the bottom, and variable tracker
 */

function ClimbingStairs(am, w, h) {
  this.init(am, w, h);
}

ClimbingStairs.prototype = new Algorithm();
ClimbingStairs.prototype.constructor = ClimbingStairs;
ClimbingStairs.superclass = Algorithm.prototype;

ClimbingStairs.CODE = [
  "public int climbStairs(int n) {",
  "    if (n <= 1) return 1;",
  "    int prev2 = 1, prev1 = 1;",
  "    for (int i = 2; i <= n; i++) {",
  "        int curr = prev1 + prev2;",
  "        prev2 = prev1;",
  "        prev1 = curr;",
  "    }",
  "    return prev1;",
  "}",
];

ClimbingStairs.prototype.init = function (am, w, h) {
  ClimbingStairs.superclass.init.call(this, am, w, h);

  this.addControls();

  this.maxAnimatedSteps = 10;

  this.nextIndex = 0;
  this.inputSteps = 5;
  this.visualSteps = Math.min(this.inputSteps, this.maxAnimatedSteps);
  this.messageText = "Each step counts the two previous totals (Fibonacci style).";

  this.titleID = -1;
  this.summaryLabelID = -1;
  this.boardRectID = -1;
  this.boardTextID = -1;
  this.resultLabelID = -1;
  this.resultValueID = -1;
  this.walkerID = -1;

  this.codeLineIDs = [];
  this.stepRectIDs = [];
  this.stepLabelIDs = [];
  this.stepPositions = [];
  this.dpRectIDs = [];
  this.dpIndexIDs = [];
  this.variableLabelIDs = [];
  this.variableValueIDs = {};

  this.stepHeight = 50;
  this.stepSpacing = 14;
  this.walkerYOffset = 36;

  this.colors = {
    title: "#1b1b1b",
    summary: "#224466",
    boardBorder: "#1d3f72",
    boardFill: "#eef4ff",
    boardText: "#1d3f72",
    stepDefault: "#f5f7fb",
    stepComplete: "#dff7df",
    stepHighlight: "#ffe3a3",
    dpDefault: "#f5f7fb",
    dpActive: "#dff7df",
    dpHighlight: "#ffe3a3",
    result: "#0b5c3b",
    codeText: "#222222",
  };

  this.setup();
};

ClimbingStairs.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Steps (n):");
  this.stepsField = addControlToAlgorithmBar("Text", "5");
  this.stepsField.size = 6;

  this.inputButton = addControlToAlgorithmBar("Button", "Set Steps");
  this.inputButton.onclick = this.setInputCallback.bind(this);

  this.runButton = addControlToAlgorithmBar("Button", "Run Climb DP");
  this.runButton.onclick = this.runCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.pauseButton = addControlToAlgorithmBar("Button", "Pause / Play");
  this.pauseButton.onclick = this.pauseCallback.bind(this);

  this.stepButton = addControlToAlgorithmBar("Button", "Next Step");
  this.stepButton.onclick = this.stepCallback.bind(this);

  this.controls.push(this.stepsField, this.inputButton, this.runButton);
};

ClimbingStairs.prototype.setInputCallback = function () {
  const raw = parseInt(this.stepsField.value, 10);
  let n = Number.isNaN(raw) ? 5 : raw;
  n = Math.max(0, Math.min(45, n));
  this.stepsField.value = String(n);

  this.inputSteps = n;
  this.visualSteps = Math.min(n, this.maxAnimatedSteps);
  this.messageText =
    n > this.maxAnimatedSteps
      ? `Visualising only up to ${this.maxAnimatedSteps} steps to keep the stairs readable.`
      : "Each step counts the two previous totals (Fibonacci style).";

  this.reset();
};

ClimbingStairs.prototype.runCallback = function () {
  this.implementAction(this.runClimb.bind(this), "");
};

ClimbingStairs.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") {
    doPlayPause();
  }
};

ClimbingStairs.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") {
      doPlayPause();
    }
    animationManager.step();
  }
};

ClimbingStairs.prototype.setup = function () {
  const canvasElem = document.getElementById("canvas");
  const canvasW = canvasElem ? canvasElem.width : 720;
  const ratioHeight = Math.round((canvasW * 16) / 9);
  const canvasH = canvasElem ? Math.max(canvasElem.height, ratioHeight) : ratioHeight;

  if (canvasElem) {
    canvasElem.width = canvasW;
    canvasElem.height = canvasH;
  }
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.width = canvasW;
    animationManager.animatedObjects.height = canvasH;
  }

  this.stepRectIDs = [];
  this.stepLabelIDs = [];
  this.stepPositions = [];
  this.dpRectIDs = [];
  this.dpIndexIDs = [];
  this.codeLineIDs = [];
  this.variableLabelIDs = [];
  this.variableValueIDs = {};

  this.stepHeight = Math.max(42, Math.min(60, Math.floor(canvasH * 0.05)));
  this.stepSpacing = Math.max(10, Math.floor(this.stepHeight * 0.28));
  this.walkerYOffset = Math.max(34, Math.floor(this.stepHeight * 0.9));

  const boardWidth = Math.floor(canvasW * 0.78);
  const boardHeight = Math.floor(canvasH * 0.12);
  const boardY = 150;

  const summaryY = 80;
  const variablesY = boardY + boardHeight / 2 + 55;
  const stairsBaseY = variablesY + 160;
  const dpY = Math.min(canvasH - 160, stairsBaseY + 220);

  this.commands = [];

  this.titleID = this.nextIndex++;
  this.cmd("CreateLabel", this.titleID, "Climbing Stairs", canvasW / 2, 40, 1);
  this.cmd("SetTextStyle", this.titleID, "bold 28");
  this.cmd("SetForegroundColor", this.titleID, this.colors.title);

  this.summaryLabelID = this.nextIndex++;
  let summaryText = `n = ${this.inputSteps}`;
  if (this.inputSteps > this.visualSteps) {
    summaryText += ` (showing first ${this.visualSteps} steps)`;
  }
  this.cmd("CreateLabel", this.summaryLabelID, summaryText, canvasW / 2, summaryY, 1);
  this.cmd("SetTextStyle", this.summaryLabelID, "bold 18");
  this.cmd("SetForegroundColor", this.summaryLabelID, this.colors.summary);

  this.boardRectID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.boardRectID,
    "",
    boardWidth,
    boardHeight,
    canvasW / 2,
    boardY
  );
  this.cmd("SetForegroundColor", this.boardRectID, this.colors.boardBorder);
  this.cmd("SetBackgroundColor", this.boardRectID, this.colors.boardFill);

  this.boardTextID = this.nextIndex++;
  this.cmd("CreateLabel", this.boardTextID, this.messageText, canvasW / 2, boardY, 1);
  this.cmd("SetTextStyle", this.boardTextID, "bold 18");
  this.cmd("SetForegroundColor", this.boardTextID, this.colors.boardText);

  this.buildVariablesPanel(canvasW, variablesY);
  this.buildStairs(canvasW, stairsBaseY);
  this.buildDPRow(canvasW, dpY);
  this.buildCodePanel(canvasW);

  this.resultLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.resultLabelID, "Total ways:", canvasW / 2, dpY - 80, 1);
  this.cmd("SetTextStyle", this.resultLabelID, "bold 20");
  this.cmd("SetForegroundColor", this.resultLabelID, this.colors.boardBorder);

  this.resultValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.resultValueID, "–", canvasW / 2, dpY - 48, 1);
  this.cmd("SetTextStyle", this.resultValueID, "bold 30");
  this.cmd("SetForegroundColor", this.resultValueID, this.colors.result);

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

ClimbingStairs.prototype.buildVariablesPanel = function (canvasW, startY) {
  const names = ["prev2", "prev1", "curr"];
  const spacing = 38;
  const startX = 120;

  for (let i = 0; i < names.length; i++) {
    const labelID = this.nextIndex++;
    const valueID = this.nextIndex++;
    const y = startY + i * spacing;

    this.cmd("CreateLabel", labelID, `${names[i]}:`, startX, y, 0);
    this.cmd("SetTextStyle", labelID, "bold 18");
    this.cmd("SetForegroundColor", labelID, this.colors.boardBorder);

    this.cmd("CreateLabel", valueID, "–", startX + 110, y, 0);
    this.cmd("SetTextStyle", valueID, "bold 20");
    this.cmd("SetForegroundColor", valueID, this.colors.codeText);

    this.variableLabelIDs.push(labelID);
    this.variableValueIDs[names[i]] = valueID;
  }
};

ClimbingStairs.prototype.buildStairs = function (canvasW, baseY) {
  const stepsToDraw = this.visualSteps;
  const rectCount = stepsToDraw + 1;
  const spacing = this.stepSpacing;
  const availableWidth = canvasW - 260;
  const stepWidth = Math.max(
    40,
    Math.min(80, Math.floor((availableWidth - spacing * (rectCount - 1)) / rectCount))
  );
  const leftEdge = 220;
  const startX = leftEdge + stepWidth / 2;

  this.stepHeight = Math.max(42, Math.min(60, this.stepHeight));

  this.walkerID = this.nextIndex++;

  for (let i = 0; i <= stepsToDraw; i++) {
    const x = startX + i * (stepWidth + spacing);
    const y = baseY - i * Math.floor(this.stepHeight * 0.7);

    const rectID = this.nextIndex++;
    this.cmd("CreateRectangle", rectID, i === 0 ? "Start" : String(i), stepWidth, this.stepHeight, x, y);
    this.cmd("SetForegroundColor", rectID, this.colors.boardBorder);
    this.cmd("SetBackgroundColor", rectID, this.colors.stepDefault);
    this.cmd("SetTextColor", rectID, this.colors.codeText);
    this.cmd("SetTextStyle", rectID, "bold 16");

    const labelID = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      labelID,
      i === this.visualSteps ? "target" : `ways to reach ${i}`,
      x,
      y + this.stepHeight / 2 + 18,
      1
    );
    this.cmd("SetTextStyle", labelID, "bold 14");
    this.cmd("SetForegroundColor", labelID, this.colors.summary);

    this.stepRectIDs.push(rectID);
    this.stepLabelIDs.push(labelID);
    this.stepPositions.push({
      x,
      y,
    });
  }

  if (this.stepPositions.length > 0) {
    const startPos = this.stepPositions[0];
    const walkerY = startPos.y - this.stepHeight / 2 - this.walkerYOffset;
    this.cmd("CreateCircle", this.walkerID, "", 18, startPos.x, walkerY);
    this.cmd("SetBackgroundColor", this.walkerID, this.colors.stepHighlight);
    this.cmd("SetForegroundColor", this.walkerID, "#b15b00");
  } else {
    this.walkerID = -1;
  }
};

ClimbingStairs.prototype.buildDPRow = function (canvasW, dpY) {
  const dpCount = this.visualSteps + 1;
  const spacing = 12;
  const availableWidth = canvasW - 120;
  const dpWidth = Math.max(
    40,
    Math.min(78, Math.floor((availableWidth - spacing * (dpCount - 1)) / dpCount))
  );
  const startX = canvasW / 2 - ((dpCount * dpWidth + (dpCount - 1) * spacing) / 2) + dpWidth / 2;

  for (let i = 0; i < dpCount; i++) {
    const x = startX + i * (dpWidth + spacing);

    const rectID = this.nextIndex++;
    this.cmd("CreateRectangle", rectID, "", dpWidth, 48, x, dpY);
    this.cmd("SetForegroundColor", rectID, this.colors.boardBorder);
    this.cmd("SetBackgroundColor", rectID, this.colors.dpDefault);

    const indexID = this.nextIndex++;
    this.cmd("CreateLabel", indexID, `dp[${i}]`, x, dpY + 40, 1);
    this.cmd("SetTextStyle", indexID, "bold 14");
    this.cmd("SetForegroundColor", indexID, this.colors.summary);

    this.dpRectIDs.push(rectID);
    this.dpIndexIDs.push(indexID);
  }
};

ClimbingStairs.prototype.buildCodePanel = function (canvasW) {
  const startX = 80;
  const startY = 220;
  const lineHeight = 20;

  for (let i = 0; i < ClimbingStairs.CODE.length; i++) {
    const id = this.nextIndex++;
    this.cmd("CreateLabel", id, ClimbingStairs.CODE[i], startX, startY + i * lineHeight, 0);
    this.cmd("SetTextStyle", id, "16px 'Courier New'");
    this.cmd("SetForegroundColor", id, this.colors.codeText);
    this.codeLineIDs.push(id);
  }
};

ClimbingStairs.prototype.highlightCode = function (lineIdx, doStep) {
  for (let i = 0; i < this.codeLineIDs.length; i++) {
    this.cmd("SetHighlight", this.codeLineIDs[i], i === lineIdx ? 1 : 0);
  }
  if (doStep !== false) {
    this.cmd("Step");
  }
};

ClimbingStairs.prototype.setBoardMessage = function (text, doStep) {
  this.cmd("SetText", this.boardTextID, text);
  if (doStep) {
    this.cmd("Step");
  }
};

ClimbingStairs.prototype.moveWalkerTo = function (index, doStep) {
  if (this.walkerID < 0) return;
  if (index < 0 || index >= this.stepPositions.length) return;

  const pos = this.stepPositions[index];
  const y = pos.y - this.stepHeight / 2 - this.walkerYOffset;
  this.cmd("Move", this.walkerID, pos.x, y);
  if (doStep) {
    this.cmd("Step");
  }
};

ClimbingStairs.prototype.flashStep = function (index, color) {
  if (index < 0 || index >= this.stepRectIDs.length) return;
  const rectID = this.stepRectIDs[index];
  this.cmd("SetBackgroundColor", rectID, color || this.colors.stepHighlight);
  this.cmd("Step");
  this.cmd("SetBackgroundColor", rectID, this.colors.stepDefault);
};

ClimbingStairs.prototype.colorStep = function (index, color) {
  if (index < 0 || index >= this.stepRectIDs.length) return;
  this.cmd("SetBackgroundColor", this.stepRectIDs[index], color);
};

ClimbingStairs.prototype.updateDPCell = function (index, value, highlight) {
  if (index < 0 || index >= this.dpRectIDs.length) return;
  const rectID = this.dpRectIDs[index];
  this.cmd("SetText", rectID, String(value));
  this.cmd("SetBackgroundColor", rectID, highlight ? this.colors.dpHighlight : this.colors.dpActive);
};

ClimbingStairs.prototype.updateVariable = function (name, value) {
  const id = this.variableValueIDs[name];
  if (id === undefined) return;
  this.cmd("SetText", id, String(value));
};

ClimbingStairs.prototype.runClimb = function () {
  this.commands = [];

  const n = this.inputSteps;
  const animateLimit = this.visualSteps;
  const fullResult = this.computeWays(n);

  this.highlightCode(-1, false);
  this.setBoardMessage("We read n and prepare to count ways to climb.", true);
  this.highlightCode(0);

  if (n <= 1) {
    this.highlightCode(1);
    this.setBoardMessage(`n = ${n}. Base case: only one way to stay or take a single step.`, true);

    this.updateVariable("prev2", 1);
    this.updateVariable("prev1", 1);

    if (this.dpRectIDs.length > 0) {
      this.updateDPCell(0, 1, false);
      this.colorStep(0, this.colors.stepComplete);
      this.moveWalkerTo(Math.min(n, this.stepPositions.length - 1), true);
    }
    if (n === 1 && this.dpRectIDs.length > 1) {
      this.updateDPCell(1, 1, false);
      this.colorStep(1, this.colors.stepComplete);
    }

    this.highlightCode(8);
    this.setBoardMessage("Return 1 because there is no branching choice.", true);
    this.cmd("SetText", this.resultValueID, "1");
    return this.commands;
  }

  this.highlightCode(2);
  this.setBoardMessage("Initialize prev2 and prev1 to 1 (ways to reach steps 0 and 1).", true);
  this.updateVariable("prev2", 1);
  this.updateVariable("prev1", 1);

  if (this.dpRectIDs.length > 0) {
    this.updateDPCell(0, 1, false);
    this.colorStep(0, this.colors.stepComplete);
  }
  if (this.dpRectIDs.length > 1) {
    this.updateDPCell(1, 1, false);
    this.colorStep(1, this.colors.stepComplete);
    this.moveWalkerTo(Math.min(1, this.stepPositions.length - 1), true);
  }

  let prev2 = 1;
  let prev1 = 1;

  for (let i = 2; i <= n; i++) {
    this.highlightCode(3);
    this.setBoardMessage(`Step ${i}: add ways from steps ${i - 1} and ${i - 2}.`, true);

    const curr = prev1 + prev2;

    this.highlightCode(4);
    if (i <= animateLimit) {
      if (i - 1 < this.dpRectIDs.length) {
        this.cmd("SetBackgroundColor", this.dpRectIDs[i - 1], this.colors.dpHighlight);
      }
      if (i - 2 < this.dpRectIDs.length) {
        this.cmd("SetBackgroundColor", this.dpRectIDs[i - 2], this.colors.dpHighlight);
      }
      this.flashStep(Math.min(i, this.stepRectIDs.length - 1));
    }

    this.updateVariable("curr", curr);

    this.highlightCode(5, true);
    this.highlightCode(6, false);

    prev2 = prev1;
    prev1 = curr;

    this.updateVariable("prev2", prev2);
    this.updateVariable("prev1", prev1);

    if (i <= animateLimit && i < this.dpRectIDs.length) {
      this.updateDPCell(i, curr, true);
      this.colorStep(i, this.colors.stepComplete);
      this.moveWalkerTo(Math.min(i, this.stepPositions.length - 1), true);
    }

    if (i - 1 < this.dpRectIDs.length) {
      this.cmd("SetBackgroundColor", this.dpRectIDs[i - 1], this.colors.dpActive);
    }
    if (i - 2 < this.dpRectIDs.length) {
      this.cmd("SetBackgroundColor", this.dpRectIDs[i - 2], this.colors.dpActive);
    }
  }

  this.highlightCode(8);
  this.cmd("SetText", this.resultValueID, String(fullResult));

  if (n > animateLimit) {
    this.setBoardMessage(
      `Computed up to step ${n}. Only the first ${animateLimit} steps were shown for clarity.`,
      true
    );
  } else {
    this.setBoardMessage(`There are ${fullResult} distinct ways to climb ${n} steps.`, true);
  }

  return this.commands;
};

ClimbingStairs.prototype.computeWays = function (n) {
  if (n <= 1) {
    return 1;
  }
  let prev2 = 1;
  let prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
};

ClimbingStairs.prototype.reset = function () {
  this.nextIndex = 0;
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

ClimbingStairs.prototype.disableUI = function () {
  for (let i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
  if (this.pauseButton) this.pauseButton.disabled = false;
  if (this.stepButton) this.stepButton.disabled = false;
};

ClimbingStairs.prototype.enableUI = function () {
  for (let i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new ClimbingStairs(animManag, canvas.width, canvas.height);
}
