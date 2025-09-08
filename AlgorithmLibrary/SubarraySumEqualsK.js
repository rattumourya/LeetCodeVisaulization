// BSD-2-Clause license header from original framework applies.

/*
 * SubarraySumEqualsK.js - Animated solution for LeetCode 560
 * Uses prefix sum and a map to count subarrays whose sum equals k.
 * User can supply custom array and target, then step through the algorithm.
 * Layout targets a 9:16 canvas (540x960).
 */

function SubarraySumEqualsK(am, w, h) { this.init(am, w, h); }

SubarraySumEqualsK.prototype = new Algorithm();
SubarraySumEqualsK.prototype.constructor = SubarraySumEqualsK;
SubarraySumEqualsK.superclass = Algorithm.prototype;

// Code panel constants
SubarraySumEqualsK.CODE_LINE_HEIGHT = 23; // increased from 20
SubarraySumEqualsK.CODE_FONT_SIZE = 19; // default was 16
SubarraySumEqualsK.CODE_STANDARD_COLOR = "#000000";
SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR = "#FF0000";
// Array element font size
SubarraySumEqualsK.ARRAY_FONT_SIZE = 23; // default was 20

// Java implementation displayed beside the animation
SubarraySumEqualsK.CODE = [
  ["int subarraySum(int[] nums, int k) {"],
  ["    int prefix = 0, count = 0;"],
  ["    Map<Integer, Integer> map = new HashMap<>();"],
  ["    map.put(0, 1);"],
  ["    for (int num : nums) {"],
  ["        prefix += num;"],
  ["        if (map.containsKey(prefix - k))"],
  ["            count += map.get(prefix - k);"],
  ["        map.put(prefix, map.getOrDefault(prefix, 0) + 1);"],
  ["    }"],
  ["    return count;"],
  ["}"],
];

SubarraySumEqualsK.prototype.init = function(am, w, h) {
  SubarraySumEqualsK.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.arr = [];
  this.k = 0;

  this.arrRectIDs = [];
  this.prefixLabelID = -1;
  this.prefixValueID = -1;
  this.countLabelID = -1;
  this.countValueID = -1;
  this.mapLabelID = -1;
  this.mapValueID = -1;
  this.codeID = [];

  // initial render via animation manager
  this.implementAction(this.reset.bind(this), 0);
};

SubarraySumEqualsK.prototype.addControls = function() {
  this.controls = [];

  addLabelToAlgorithmBar("Array (comma/space):");
  this.inputField = addControlToAlgorithmBar("Text", "");
  this.inputField.size = 40;

  addLabelToAlgorithmBar("Target k:");
  this.kField = addControlToAlgorithmBar("Text", "0");
  this.kField.size = 5;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Array");
  this.buildButton.onclick = this.buildArrayCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Count Subarrays");
  this.startButton.onclick = this.startCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.pauseButton = addControlToAlgorithmBar("Button", "Pause / Play");
  this.pauseButton.onclick = this.pauseCallback.bind(this);

  this.stepButton = addControlToAlgorithmBar("Button", "Next Step");
  this.stepButton.onclick = this.stepCallback.bind(this);

  this.controls.push(this.inputField, this.kField, this.buildButton, this.startButton);
};

SubarraySumEqualsK.prototype.buildArrayCallback = function() {
  const raw = this.inputField.value.trim();
  if (!raw) return;
  const vals = raw.split(/[\s,;]+/).map(Number).filter(v => !isNaN(v));
  if (vals.length === 0) return;
  this.arr = vals;
  const tgt = parseInt(this.kField.value, 10);
  if (!isNaN(tgt)) this.k = tgt;
  // rebuild the visuals with new input
  this.implementAction(this.reset.bind(this), 0);
};

SubarraySumEqualsK.prototype.setup = function() {
  if (!this.arr || this.arr.length === 0) {
    this.arr = [1, 2, 3];
    this.k = 3;
  }
  // ensure input fields reflect current array and target
  if (this.inputField) {
    this.inputField.value = this.arr.join(",");
  }
  if (this.kField) {
    this.kField.value = String(this.k);
  }
  const canvas = document.getElementById("canvas");
  const CANVAS_W = canvas ? canvas.width : 540;

  const RECT_W = 50;
  const RECT_H = 50;
  const RECT_SP = 10;
  const ARR_START_X = Math.round(
    (CANVAS_W - (this.arr.length * (RECT_W + RECT_SP) - RECT_SP)) / 2
  ); // round to whole pixel to avoid jitter
  const ARR_START_Y = 100;

  // store positions for later highlighting
  this.rectWidth = RECT_W;
  this.rectSpacing = RECT_SP;
  this.arrStartX = ARR_START_X;
  this.arrStartY = ARR_START_Y;

  this.commands = [];
  this.arrRectIDs = [];
  // Title (wrapped if too wide)
  const titleLines = [];
  const fullTitle = "Animated solution for Subarray Sum Equals K LeetCode 560";
  const tctx = document.createElement("canvas").getContext("2d");
  tctx.font = "bold 23px sans-serif";
  const words = fullTitle.split(" ");
  let line = "";
  const maxWidth = CANVAS_W - 20;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (tctx.measureText(test).width > maxWidth && line) {
      titleLines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  titleLines.push(line);
  this.titleIDs = [];
  for (let i = 0; i < titleLines.length; i++) {
    const id = this.nextIndex++;
    this.titleIDs.push(id);
    this.cmd("CreateLabel", id, titleLines[i], CANVAS_W / 2, 40 + i * 24, 1);
    this.cmd("SetTextStyle", id, "bold 23");
  }

  // Array display
  for (let i = 0; i < this.arr.length; i++) {
    const id = this.nextIndex++;
    const x = Math.round(ARR_START_X + i * (RECT_W + RECT_SP));
    const y = ARR_START_Y;
    this.arrRectIDs.push(id);
    this.cmd("CreateRectangle", id, String(this.arr[i]), RECT_W, RECT_H, x, y);
    this.cmd("SetTextStyle", id, SubarraySumEqualsK.ARRAY_FONT_SIZE);
  }

  // Prefix sum and count labels
  const VAR_START_Y = ARR_START_Y + 80;
  const VAR_X = 80;

  this.prefixLabelID = this.nextIndex++;
  this.prefixValueID = this.nextIndex++;
  const VALUE_X = VAR_X + 130;
  this.cmd("CreateLabel", this.prefixLabelID, "prefixSum:", VAR_X, VAR_START_Y, 0);
  this.cmd("CreateLabel", this.prefixValueID, "0", VALUE_X, VAR_START_Y, 0);
  this.cmd("SetTextStyle", this.prefixLabelID, "bold 18");
  this.cmd("SetTextStyle", this.prefixValueID, "bold 18");

  this.countLabelID = this.nextIndex++;
  this.countValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.countLabelID, "count:", VAR_X, VAR_START_Y + 40, 0);
  this.cmd("CreateLabel", this.countValueID, "0", VALUE_X, VAR_START_Y + 40, 0);
  this.cmd("SetTextStyle", this.countLabelID, "bold 18");
  this.cmd("SetTextStyle", this.countValueID, "bold 18");

  // Map display as dictionary, start empty until algorithm begins
  this.mapLabelID = this.nextIndex++;
  this.mapValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.mapLabelID, "Map(sum:freq):", VAR_X, VAR_START_Y + 80, 0);
  this.cmd("CreateLabel", this.mapValueID, "{}", VALUE_X, VAR_START_Y + 80, 0);
  this.cmd("SetTextStyle", this.mapLabelID, "bold 18");
  this.cmd("SetTextStyle", this.mapValueID, "bold 18");

  // Pseudocode display centered below the map
  const CODE_START_Y = VAR_START_Y + 140;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = SubarraySumEqualsK.CODE_FONT_SIZE + "px sans-serif";
  const maxCodeWidth = Math.max(
    ...SubarraySumEqualsK.CODE.map(line => ctx.measureText(line[0]).width)
  );
  const CODE_START_X = Math.floor((CANVAS_W - maxCodeWidth) / 2);
  this.codeID = this.addCodeToCanvasBase(
    SubarraySumEqualsK.CODE,
    CODE_START_X,
    CODE_START_Y,
    SubarraySumEqualsK.CODE_LINE_HEIGHT,
    SubarraySumEqualsK.CODE_STANDARD_COLOR
  );

  // Increase pseudocode font size
  for (const line of this.codeID) {
    for (const id of line) {
      this.cmd("SetTextStyle", id, SubarraySumEqualsK.CODE_FONT_SIZE);
    }
  }

  this.cmd("Step");
  return this.commands;
};

SubarraySumEqualsK.prototype.formatMap = function(map) {
  return '{' + Object.keys(map)
    .sort((a, b) => Number(a) - Number(b))
    .map(key => `${key}:${map[key]}`)
    .join(',') + '}';
};

SubarraySumEqualsK.prototype.startCallback = function() {
  if (!this.arr || this.arr.length === 0) return;
  this.implementAction(this.doAlgorithm.bind(this), 0);
};

SubarraySumEqualsK.prototype.doAlgorithm = function() {
  this.commands = [];
  let prefix = 0;
  let count = 0;
  const map = {0:1};

  // show variables with an empty map before seeding
  this.cmd("SetText", this.prefixValueID, prefix);
  this.cmd("SetText", this.countValueID, count);
  this.cmd("SetText", this.mapValueID, "{}");

  // Highlight function signature and initialization lines
  this.cmd("SetForegroundColor", this.codeID[0][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
  this.cmd("Step");
  this.cmd("SetForegroundColor", this.codeID[0][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);

  this.cmd("SetForegroundColor", this.codeID[1][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
  this.cmd("Step");
  this.cmd("SetForegroundColor", this.codeID[1][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);

  this.cmd("SetForegroundColor", this.codeID[2][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
  this.cmd("Step");
  this.cmd("SetForegroundColor", this.codeID[2][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);

  // seed map with 0:1
  this.cmd("SetForegroundColor", this.codeID[3][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
  this.cmd("SetText", this.mapValueID, this.formatMap(map));
  this.cmd("SetBackgroundColor", this.mapValueID, "#99CCFF");
  this.cmd("Step");
  this.cmd("SetBackgroundColor", this.mapValueID, "#FFFFFF");
  this.cmd("SetForegroundColor", this.codeID[3][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);

  const highlightID = this.nextIndex++;
  this.cmd(
    "CreateHighlightCircle",
    highlightID,
    "#FFD700",
    this.arrStartX,
    this.arrStartY,
    25
  );

  for (let i = 0; i < this.arr.length; i++) {
    const rectID = this.arrRectIDs[i];
    this.cmd(
      "SetForegroundColor",
      this.codeID[4][0],
      SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR
    );
    this.cmd("SetBackgroundColor", rectID, "#FFD700");
    this.cmd("Step");
    this.cmd(
      "SetForegroundColor",
      this.codeID[4][0],
      SubarraySumEqualsK.CODE_STANDARD_COLOR
    );

    this.cmd("SetForegroundColor", this.codeID[5][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
    prefix += this.arr[i];
    this.cmd("SetText", this.prefixValueID, prefix);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.codeID[5][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);

    this.cmd("SetForegroundColor", this.codeID[6][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
    const need = prefix - this.k;
    this.cmd("Step");
    if (map[need] != null) {
      this.cmd("SetForegroundColor", this.codeID[7][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
      count += map[need];
      this.cmd("SetText", this.countValueID, count);
      this.cmd("SetBackgroundColor", this.mapValueID, "#FF9999");
      this.cmd("Step");
      this.cmd("SetBackgroundColor", this.mapValueID, "#FFFFFF");
      this.cmd("SetForegroundColor", this.codeID[7][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);
    }
    this.cmd("SetForegroundColor", this.codeID[6][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);

    this.cmd("SetForegroundColor", this.codeID[8][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
    if (map[prefix] == null) {
      map[prefix] = 1;
    } else {
      map[prefix]++;
    }
    this.cmd("SetText", this.mapValueID, this.formatMap(map));
    this.cmd("SetBackgroundColor", this.mapValueID, "#99CCFF");
    this.cmd("Step");
    this.cmd("SetBackgroundColor", this.mapValueID, "#FFFFFF");
    this.cmd("SetForegroundColor", this.codeID[8][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);
  }

  this.cmd("Delete", highlightID);

  this.cmd("SetForegroundColor", this.codeID[10][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
  this.cmd("Step");
  this.cmd("SetForegroundColor", this.codeID[10][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);
  return this.commands;
};

SubarraySumEqualsK.prototype.reset = function() {
  this.nextIndex = 0;
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  return this.setup();
};

SubarraySumEqualsK.prototype.disableUI = function() {
  for (let c of this.controls) c.disabled = true;
};
SubarraySumEqualsK.prototype.enableUI = function() {
  for (let c of this.controls) c.disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new SubarraySumEqualsK(animManag, canvas.width, canvas.height);
}
