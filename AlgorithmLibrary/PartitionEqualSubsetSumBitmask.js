// BSD-2-Clause license header from original framework applies.

/*
 * PartitionEqualSubsetSumBitmask.js - Animated bit masking solution for
 * LeetCode 416. Uses a BigInteger-style bitset to track achievable sums.
 */

function PartitionEqualSubsetSumBitmask(am, w, h) {
  this.init(am, w, h);
}

PartitionEqualSubsetSumBitmask.prototype = new Algorithm();
PartitionEqualSubsetSumBitmask.prototype.constructor = PartitionEqualSubsetSumBitmask;
PartitionEqualSubsetSumBitmask.superclass = Algorithm.prototype;

PartitionEqualSubsetSumBitmask.CODE = [
  "boolean canPartition(int[] nums) {",
  "  int sum = 0;",
  "  for (int x : nums) sum += x;",
  "  if ((sum & 1) == 1) return false;",
  "  int target = sum / 2;",
  "  BigInteger B = BigInteger.ONE;",
  "  for (int x : nums) {",
  "    B = B.or(B.shiftLeft(x));",
  "    if (B.testBit(target)) return true;",
  "  }",
  "  return B.testBit(target);",
  "}",
];

PartitionEqualSubsetSumBitmask.prototype.init = function (am, w, h) {
  PartitionEqualSubsetSumBitmask.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.arr = [];
  this.n = 0;

  this.arrIDs = [];
  this.arrX = [];
  this.arrY = [];
  this.bitIDs = [];
  this.bitX = [];
  this.bitY = [];
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

PartitionEqualSubsetSumBitmask.prototype.addControls = function () {
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

PartitionEqualSubsetSumBitmask.prototype.buildArrayCallback = function () {
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

PartitionEqualSubsetSumBitmask.prototype.setup = function () {
  if (!this.arr || this.arr.length === 0) {
    this.arr = [1, 5, 11, 5];
  }
  this.n = this.arr.length;

  const canvas = document.getElementById("canvas");
  let canvasW = canvas ? canvas.width : 540;
  let canvasH = canvas ? canvas.height : 960;

  const TITLE_Y = 30;
  const RECT_W = 25;
  const RECT_H = 25;
  const RECT_SP = 3;

  const total = this.arr.reduce((a, b) => a + b, 0);
  const target = Math.floor(total / 2);
  const arrWidth = this.n * (RECT_W + RECT_SP) - RECT_SP;
  const bitWidth = (target + 1) * (RECT_W + RECT_SP) - RECT_SP;
  const maxWidth = Math.max(arrWidth, bitWidth);
  const neededWidth = maxWidth + 40;
  if (canvasW < neededWidth) {
    canvasW = neededWidth;
    canvasH = Math.round(canvasW * (16 / 9));
    if (canvas) {
      canvas.width = canvasW;
      canvas.height = canvasH;
    }
    if (
      typeof animationManager !== "undefined" &&
      animationManager.animatedObjects
    ) {
      animationManager.animatedObjects.width = canvasW;
      animationManager.animatedObjects.height = canvasH;
    }
  }

  const SHIFT_OFFSET = 60;
  const baseStartX = Math.floor((canvasW - maxWidth) / 2);
  const minStartX = 20;
  const maxStartX = canvasW - maxWidth - 20;
  let startX = baseStartX + SHIFT_OFFSET;
  if (maxStartX < minStartX) {
    startX = minStartX;
  } else {
    startX = Math.min(Math.max(startX, minStartX), maxStartX);
  }
  const startY = 80;

  this.RECT_W = RECT_W;
  this.RECT_H = RECT_H;
  this.RECT_SP = RECT_SP;
  this.startX = startX;
  this.startY = startY;
  this.shiftX = SHIFT_OFFSET;

  this.commands = [];
  this.arrIDs = [];
  this.arrX = [];
  this.arrY = [];
  this.bitIDs = [];
  this.bitX = [];
  this.bitY = [];
  this.codeIDs = [];
  this.capacityLabelIDs = [];

  // Title
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Bit Mask DP (BigInteger)",
    canvasW / 2,
    TITLE_Y,
    1
  );
  this.cmd("SetForegroundColor", this.titleID, "#000000");
  this.cmd("SetTextStyle", this.titleID, "bold 16");

  // Array numbers
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

  const messageX = this.targetValueX + 200;
  const messageY = this.targetValueY;
  this.messageID = this.nextIndex++;
  this.cmd("CreateLabel", this.messageID, "", messageX, messageY, 0);
  this.cmd("SetForegroundColor", this.messageID, "#003366");
  this.cmd("SetTextStyle", this.messageID, "18");

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

PartitionEqualSubsetSumBitmask.prototype.createBitArray = function (target) {
  const RECT_W = this.RECT_W;
  const RECT_H = this.RECT_H;
  const RECT_SP = this.RECT_SP;
  const startX = this.startX;
  const bitStartY = this.infoY + 100;
  const step = RECT_W + RECT_SP;
  const indexLabelGap = Math.round(RECT_H / 2 + 24);
  const shiftYOffset = indexLabelGap + RECT_H + 40;
  this.shiftYOffset = shiftYOffset;

  for (const id of this.bitIDs) this.cmd("Delete", id);
  for (const id of this.capacityLabelIDs) this.cmd("Delete", id);
  if (this.resultLabelID !== -1) this.cmd("Delete", this.resultLabelID);
  if (this.resultValueID !== -1) this.cmd("Delete", this.resultValueID);
  for (const id of this.codeIDs) this.cmd("Delete", id);

  this.bitIDs = [];
  this.bitX = [];
  this.bitY = [];
  this.capacityLabelIDs = [];
  this.codeIDs = [];

  for (let j = 0; j <= target; j++) {
    const id = this.nextIndex++;
    const x = startX + (target - j) * step;
    const y = bitStartY;
    this.bitIDs.push(id);
    this.bitX.push(x);
    this.bitY.push(y);
    this.cmd("CreateRectangle", id, "0", RECT_W, RECT_H, x, y);
    this.cmd("SetBackgroundColor", id, "#eeeeee");
    this.cmd("SetForegroundColor", id, "#000000");
  }

  const capLabelY = bitStartY + indexLabelGap;
  for (let j = 0; j <= target; j++) {
    const lid = this.nextIndex++;
    const x = startX + (target - j) * step;
    this.cmd("CreateLabel", lid, String(j), x, capLabelY, 0);
    this.cmd("SetForegroundColor", lid, "#000000");
    this.cmd("SetTextStyle", lid, "12");
    this.capacityLabelIDs.push(lid);
  }

  this.resultLabelID = this.nextIndex++;
  this.resultValueID = this.nextIndex++;
  const resY = bitStartY + shiftYOffset + RECT_H / 2 + 60;
  this.cmd("CreateLabel", this.resultLabelID, "Can Partition:", startX, resY, 0);
  this.cmd("CreateLabel", this.resultValueID, "?", startX + 140, resY, 0);
  this.cmd("SetTextStyle", this.resultLabelID, "bold 14");

  const CODE_LINE_H = 22;
  const codeY = resY + 50;
  const canvas = document.getElementById("canvas");
  const canvasW = canvas ? canvas.width : 540;
  const maxCodeLen = Math.max(...PartitionEqualSubsetSumBitmask.CODE.map((s) => s.length));
  const CODE_CHAR_W = 7;
  const codeWidth = maxCodeLen * CODE_CHAR_W;
  const baseCodeStart = Math.floor((canvasW - codeWidth) / 2);
  let codeStartX = baseCodeStart + this.shiftX;
  const minCodeStart = 20;
  const maxCodeStart = canvasW - codeWidth - 20;
  if (maxCodeStart < minCodeStart) {
    codeStartX = minCodeStart;
  } else {
    codeStartX = Math.min(Math.max(codeStartX, minCodeStart), maxCodeStart);
  }
  for (let i = 0; i < PartitionEqualSubsetSumBitmask.CODE.length; i++) {
    const id = this.nextIndex++;
    this.codeIDs.push(id);
    this.cmd(
      "CreateLabel",
      id,
      PartitionEqualSubsetSumBitmask.CODE[i],
      codeStartX,
      codeY + i * CODE_LINE_H,
      0
    );
    this.cmd("SetForegroundColor", id, "#000000");
  }

  const neededH =
    codeY + PartitionEqualSubsetSumBitmask.CODE.length * CODE_LINE_H + 80;
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
};

PartitionEqualSubsetSumBitmask.prototype.highlightCode = function (line) {
  for (let i = 0; i < this.codeIDs.length; i++) {
    this.cmd("SetHighlight", this.codeIDs[i], i === line ? 1 : 0);
  }
  this.cmd("Step");
};

PartitionEqualSubsetSumBitmask.prototype.startCallback = function () {
  if (!this.arr || this.arr.length === 0) return;
  this.implementAction(this.runAlgorithm.bind(this), 0);
};

PartitionEqualSubsetSumBitmask.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") doPlayPause();
};

PartitionEqualSubsetSumBitmask.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") doPlayPause();
    animationManager.step();
  }
};

PartitionEqualSubsetSumBitmask.prototype.runAlgorithm = function () {
  this.commands = [];
  let sum = 0;
  var captionID = this.displayCaption("Computing total sum");
  this.highlightCode(1);
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
  this.highlightCode(3);
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

  this.highlightCode(4);
  const target = Math.floor(sum / 2);
  this.cmd("SetText", this.targetValueID, String(target));
  this.cmd("SetText", this.messageID, "Target = " + target);
  this.cmd("Step");

  captionID = this.displayCaption("Building bit mask");
  this.createBitArray(target);
  this.cmd("Step");

  this.highlightCode(5);
  const bits = new Array(target + 1).fill(false);
  bits[0] = true;
  this.cmd("SetText", this.bitIDs[0], "1");
  this.cmd("SetBackgroundColor", this.bitIDs[0], "#dff7df");
  this.cmd("SetText", this.messageID, "Initial mask has bit 0 set");
  this.cmd("Step");

  for (let i = 0; i < this.n; i++) {
    this.removeCaption(captionID);
    captionID = this.displayCaption("Considering number " + this.arr[i]);
    this.highlightCode(6);
    this.cmd("SetBackgroundColor", this.arrIDs[i], "#ffe9a8");
    this.cmd("SetText", this.messageID, "Considering number " + this.arr[i]);
    this.cmd("Step");

    // create shifted row
    const shiftIDs = [];
    for (let j = 0; j <= target; j++) {
      const id = this.nextIndex++;
      this.cmd(
        "CreateRectangle",
        id,
        bits[j] ? "1" : "0",
        this.RECT_W,
        this.RECT_H,
        this.bitX[j],
        this.bitY[j] + this.shiftYOffset
      );
      this.cmd("SetBackgroundColor", id, bits[j] ? "#dff7df" : "#eeeeee");
      this.cmd("SetForegroundColor", id, "#000000");
      shiftIDs.push(id);
    }
    this.cmd("Step");

    const deltaX = this.arr[i] * (this.RECT_W + this.RECT_SP);
    for (let j = 0; j <= target; j++) {
      this.cmd(
        "Move",
        shiftIDs[j],
        this.bitX[j] - deltaX,
        this.bitY[j] + this.shiftYOffset
      );
    }
    this.cmd("Step");

    this.highlightCode(7);
    for (let j = target; j >= 0; j--) {
      this.cmd("SetBackgroundColor", this.bitIDs[j], "#ffd4d4");
      if (j >= this.arr[i]) {
        this.cmd("SetBackgroundColor", shiftIDs[j - this.arr[i]], "#ffd4d4");
      }
      this.cmd("SetText", this.messageID, "Updating bit " + j);
      this.cmd("Step");
      const newVal = bits[j] || (j >= this.arr[i] ? bits[j - this.arr[i]] : false);
      bits[j] = newVal;
      this.cmd("SetText", this.bitIDs[j], newVal ? "1" : "0");
      this.cmd("SetBackgroundColor", this.bitIDs[j], newVal ? "#dff7df" : "#eeeeee");
      if (j >= this.arr[i]) {
        this.cmd("SetBackgroundColor", shiftIDs[j - this.arr[i]], bits[j - this.arr[i]] ? "#dff7df" : "#eeeeee");
      }
    }
    for (let j = 0; j <= target; j++) {
      this.cmd("SetBackgroundColor", this.bitIDs[j], bits[j] ? "#dff7df" : "#eeeeee");
    }
    this.cmd("Step");

    for (const id of shiftIDs) this.cmd("Delete", id);

    this.highlightCode(8);
    if (bits[target]) {
      this.cmd("SetText", this.resultValueID, "true");
      this.cmd("SetText", this.messageID, "Partition possible");
      this.removeCaption(captionID);
      captionID = this.displayCaption("Partition possible");
      this.cmd("Step");
      this.removeCaption(captionID);
      this.cmd("SetBackgroundColor", this.arrIDs[i], "#f0f7ff");
      this.showOutroSlide("Thanks for watching! Subscribe and comment!");
      return this.commands;
    }
    this.cmd("SetBackgroundColor", this.arrIDs[i], "#f0f7ff");
  }

  this.removeCaption(captionID);
  this.highlightCode(10);
  this.cmd("SetText", this.resultValueID, bits[target] ? "true" : "false");
  this.cmd("SetText", this.messageID, bits[target] ? "Partition possible" : "No partition");
  captionID = this.displayCaption(bits[target] ? "Partition possible" : "No partition");
  this.cmd("Step");
  this.removeCaption(captionID);
  this.showOutroSlide("Thanks for watching! Subscribe and comment!");
  return this.commands;
};

PartitionEqualSubsetSumBitmask.prototype.reset = function () {
  this.nextIndex = 0;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

PartitionEqualSubsetSumBitmask.prototype.disableUI = function () {
  for (let i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

PartitionEqualSubsetSumBitmask.prototype.enableUI = function () {
  for (let i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new PartitionEqualSubsetSumBitmask(
    animManag,
    canvas.width,
    canvas.height
  );
}

