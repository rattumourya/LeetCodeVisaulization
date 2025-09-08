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
SubarraySumEqualsK.CODE_LINE_HEIGHT = 20;
SubarraySumEqualsK.CODE_STANDARD_COLOR = "#000000";
SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR = "#FF0000";

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
  this.arrRectX = [];
  this.arrRectY = [];
  this.prefixLabelID = -1;
  this.prefixValueID = -1;
  this.countLabelID = -1;
  this.countValueID = -1;
  this.containsLabelID = -1;
  this.containsValueID = -1;
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
  const ARR_START_X = (CANVAS_W - (this.arr.length * (RECT_W + RECT_SP) - RECT_SP)) / 2;
  const ARR_START_Y = 100;
  
  this.commands = [];
  this.arrRectIDs = [];
  this.arrRectX = [];
  this.arrRectY = [];
  
  // Title
  this.titleID = this.nextIndex++;
  const title = "Animated solution for Subarray Sum Equals K";
  this.cmd("CreateLabel", this.titleID, title, CANVAS_W / 2, 40, 1);
  this.cmd("SetTextStyle", this.titleID, "bold 23");
  
  // Array display
  for (let i = 0; i < this.arr.length; i++) {
    const id = this.nextIndex++;
    const x = ARR_START_X + i * (RECT_W + RECT_SP);
    const y = ARR_START_Y;
    this.arrRectIDs.push(id);
    this.arrRectX.push(x);
    this.arrRectY.push(y);
    this.cmd("CreateRectangle", id, String(this.arr[i]), RECT_W, RECT_H, x, y);
  }
  
    // Prefix sum, condition check, and count labels
  const VAR_START_Y = ARR_START_Y + 80;
  const VAR_X = 80;
  
  // Variable labels and values aligned in two columns
  const VAR_LABEL_X = VAR_X;
  const VAR_VALUE_X = VAR_LABEL_X + 100;

  this.prefixLabelID = this.nextIndex++;
  this.prefixValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.prefixLabelID, "prefix", VAR_LABEL_X, VAR_START_Y, 0);
  this.cmd("CreateLabel", this.prefixValueID, "0", VAR_VALUE_X, VAR_START_Y, 0);
  this.prefixValueX = VAR_VALUE_X;
  this.prefixValueY = VAR_START_Y;
  this.cmd("SetTextStyle", this.prefixLabelID, "bold 18");
  this.cmd("SetTextStyle", this.prefixValueID, "bold 18");

  this.containsLabelID = this.nextIndex++;
  this.containsValueID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.containsLabelID,
    "map.containsKey(prefix - k)",
    VAR_LABEL_X,
    VAR_START_Y + 40,
    0
  );
  this.cmd(
    "CreateLabel",
    this.containsValueID,
    "false",
    VAR_VALUE_X,
    VAR_START_Y + 40,
    0
  );
  this.cmd("SetTextStyle", this.containsLabelID, "bold 18");
  this.cmd("SetTextStyle", this.containsValueID, "bold 18");

  this.countLabelID = this.nextIndex++;
  this.countValueID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.countLabelID,
    "count",
    VAR_LABEL_X,
    VAR_START_Y + 80,
    0
  );
  this.cmd(
    "CreateLabel",
    this.countValueID,
    "0",
    VAR_VALUE_X,
    VAR_START_Y + 80,
    0
  );
  this.countValueX = VAR_VALUE_X;
  this.countValueY = VAR_START_Y + 80;
  this.cmd("SetTextStyle", this.countLabelID, "bold 18");
  this.cmd("SetTextStyle", this.countValueID, "bold 18");

    // Map display as dictionary, start empty until algorithm begins
    this.mapLabelID = this.nextIndex++;
    this.mapValueID = this.nextIndex++;
    const MAP_Y = VAR_START_Y + 120;
  this.cmd("CreateLabel", this.mapLabelID, "map", VAR_LABEL_X, MAP_Y, 0);
  this.cmd("CreateLabel", this.mapValueID, "{}", VAR_VALUE_X, MAP_Y, 0);
  this.mapValueX = VAR_VALUE_X;
  this.mapValueY = MAP_Y;
  this.cmd("SetTextStyle", this.mapLabelID, "bold 18");
  this.cmd("SetTextStyle", this.mapValueID, "bold 18");
  
  // Pseudocode display centered below the map
  const CODE_START_Y = VAR_START_Y + 140;
  const CODE_START_X = CANVAS_W / 2 - 140; // approximate center
  this.codeID = this.addCodeToCanvasBase(
    SubarraySumEqualsK.CODE,
    CODE_START_X,
    CODE_START_Y,
    SubarraySumEqualsK.CODE_LINE_HEIGHT,
    SubarraySumEqualsK.CODE_STANDARD_COLOR
  );
  
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
  const map = { 0: 1 };
  
  // show variables with an empty map before seeding
  this.cmd("SetText", this.prefixValueID, prefix);
  this.cmd("SetText", this.countValueID, count);
  this.cmd("SetText", this.containsValueID, "false");
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
  
  for (let i = 0; i < this.arr.length; i++) {
    const rectID = this.arrRectIDs[i];
    this.cmd("SetForegroundColor", this.codeID[4][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
    this.cmd("SetBackgroundColor", rectID, "#FFD700");
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.codeID[4][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);
    
    this.cmd("SetForegroundColor", this.codeID[5][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
    const moveID = this.nextIndex++;
    const moveText = this.arr[i] >= 0 ? "+" + this.arr[i] : String(this.arr[i]);
    this.cmd("CreateLabel", moveID, moveText, this.arrRectX[i], this.arrRectY[i]);
    this.cmd("Move", moveID, this.prefixValueX, this.prefixValueY);
    this.cmd("Step");
    this.cmd("Delete", moveID);
    prefix += this.arr[i];
    this.cmd("SetText", this.prefixValueID, prefix);
    this.cmd("Step");
    this.cmd("SetForegroundColor", this.codeID[5][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);

    this.cmd("SetForegroundColor", this.codeID[6][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
    const need = prefix - this.k;
    const lookupID = this.nextIndex++;
    this.cmd("CreateLabel", lookupID, String(need), this.prefixValueX, this.prefixValueY);
    this.cmd("Move", lookupID, this.mapValueX, this.mapValueY);
    this.cmd("Step");
    this.cmd("Delete", lookupID);
    const found = map[need] != null;
    this.cmd("SetText", this.containsValueID, found ? "true" : "false");
    this.cmd("SetBackgroundColor", this.containsValueID, "#FFFF00");
    this.cmd("Step");
    this.cmd("SetBackgroundColor", this.containsValueID, "#FFFFFF");
    if (found) {
        this.cmd("SetForegroundColor", this.codeID[7][0], SubarraySumEqualsK.CODE_HIGHLIGHT_COLOR);
        const valID = this.nextIndex++;
        this.cmd("CreateLabel", valID, String(map[need]), this.mapValueX, this.mapValueY);
        this.cmd("SetBackgroundColor", this.mapValueID, "#FF9999");
        this.cmd("Move", valID, this.countValueX, this.countValueY);
        this.cmd("Step");
        this.cmd("SetBackgroundColor", this.mapValueID, "#FFFFFF");
        this.cmd("Delete", valID);
        count += map[need];
        this.cmd("SetText", this.countValueID, count);
        this.cmd("Step");

        this.cmd("SetForegroundColor", this.codeID[7][0], SubarraySumEqualsK.CODE_STANDARD_COLOR);
      }
    this.cmd("SetBackgroundColor", this.mapValueID, "#FFFFFF");
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
    
    this.cmd("SetBackgroundColor", rectID, "#FFFFFF");
  }
  
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