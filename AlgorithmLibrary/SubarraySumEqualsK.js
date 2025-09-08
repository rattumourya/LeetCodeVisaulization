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
  this.mapTitleID = -1;
  this.mapIDs = {};

  this.setup();
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
  const tgt = parseInt(this.kField.value);
  if (!isNaN(tgt)) this.k = tgt;
  this.reset();
};

SubarraySumEqualsK.prototype.setup = function() {
  if (!this.arr || this.arr.length === 0) {
    this.arr = [1, 2, 3];
    this.k = 3;
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
  this.mapIDs = {};

  // Title
  this.titleID = this.nextIndex++;
  const title = "Animated solution for Subarray Sum Equals K";
  this.cmd("CreateLabel", this.titleID, title, CANVAS_W/2, 40, 1);
  this.cmd("SetTextStyle", this.titleID, "bold 20");

  // Array display
  for (let i = 0; i < this.arr.length; i++) {
    const id = this.nextIndex++;
    const x = ARR_START_X + i * (RECT_W + RECT_SP);
    const y = ARR_START_Y;
    this.arrRectIDs.push(id);
    this.cmd("CreateRectangle", id, String(this.arr[i]), RECT_W, RECT_H, x, y);
  }

  // Prefix sum and count labels
  const VAR_START_Y = ARR_START_Y + 80;
  const VAR_X = 80;

  this.prefixLabelID = this.nextIndex++;
  this.prefixValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.prefixLabelID, "prefixSum:", VAR_X, VAR_START_Y, 0);
  this.cmd("CreateLabel", this.prefixValueID, "0", VAR_X + 100, VAR_START_Y, 0);

  this.countLabelID = this.nextIndex++;
  this.countValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.countLabelID, "count:", VAR_X, VAR_START_Y + 40, 0);
  this.cmd("CreateLabel", this.countValueID, "0", VAR_X + 100, VAR_START_Y + 40, 0);

  // Map title
  this.mapTitleID = this.nextIndex++;
  this.cmd("CreateLabel", this.mapTitleID, "Map (sum:freq)", CANVAS_W / 2, VAR_START_Y + 120, 0);

  this.mapStartX = VAR_X;
  this.mapStartY = VAR_START_Y + 150;
  this.mapRectW = 120;
  this.mapRectH = 30;
  this.mapRectSP = 5;

  // initialize map with {0:1}
  this.createMapEntry(0, 1);

  this.cmd("Step");
  return this.commands;
};

SubarraySumEqualsK.prototype.createMapEntry = function(sum, freq) {
  const idx = Object.keys(this.mapIDs).length;
  const x = this.mapStartX;
  const y = this.mapStartY + idx * (this.mapRectH + this.mapRectSP);
  const id = this.nextIndex++;
  this.cmd("CreateRectangle", id, `${sum}:${freq}`, this.mapRectW, this.mapRectH, x, y);
  this.mapIDs[sum] = { id: id, freq: freq };
  return id;
};

SubarraySumEqualsK.prototype.updateMapEntry = function(sum, freq) {
  const entry = this.mapIDs[sum];
  if (entry) {
    entry.freq = freq;
    this.cmd("SetText", entry.id, `${sum}:${freq}`);
  }
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

  this.cmd("SetText", this.prefixValueID, prefix);
  this.cmd("SetText", this.countValueID, count);

  for (let i = 0; i < this.arr.length; i++) {
    const rectID = this.arrRectIDs[i];
    this.cmd("SetBackgroundColor", rectID, "#FFD700");
    this.cmd("Step");

    prefix += this.arr[i];
    this.cmd("SetText", this.prefixValueID, prefix);
    this.cmd("Step");

    const need = prefix - this.k;
    if (map[need] != null) {
      count += map[need];
      this.cmd("SetText", this.countValueID, count);
      if (this.mapIDs[need]) {
        this.cmd("SetBackgroundColor", this.mapIDs[need].id, "#FF9999");
        this.cmd("Step");
        this.cmd("SetBackgroundColor", this.mapIDs[need].id, "#FFFFFF");
      }
    }

    if (map[prefix] == null) {
      map[prefix] = 1;
      this.createMapEntry(prefix, 1);
    } else {
      map[prefix]++;
      this.updateMapEntry(prefix, map[prefix]);
    }
    if (this.mapIDs[prefix]) {
      this.cmd("SetBackgroundColor", this.mapIDs[prefix].id, "#99CCFF");
      this.cmd("Step");
      this.cmd("SetBackgroundColor", this.mapIDs[prefix].id, "#FFFFFF");
    }

    this.cmd("SetBackgroundColor", rectID, "#FFFFFF");
  }

  return this.commands;
};

SubarraySumEqualsK.prototype.reset = function() {
  this.nextIndex = 0;
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
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

