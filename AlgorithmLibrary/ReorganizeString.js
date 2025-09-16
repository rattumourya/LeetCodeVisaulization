// BSD-2-Clause license header retained from original framework.

function ReorganizeString(am, w, h) { this.init(am, w, h); }

ReorganizeString.prototype = new Algorithm();
ReorganizeString.prototype.constructor = ReorganizeString;
ReorganizeString.superclass = Algorithm.prototype;

ReorganizeString.prototype.init = function (am, w, h) {
  ReorganizeString.superclass.init.call(this, am, w, h);

  this.addControls();

  this.canvasW = 720;
  this.canvasH = 1280;

  this.freqBoxW = 64;
  this.freqBoxH = 46;
  this.freqCols = 8;
  this.freqGapX = 12;
  this.freqGapY = 12;
  this.freqStartY = 250;

  this.heapBoxW = 110;
  this.heapBoxH = 54;
  this.heapCols = 6;
  this.heapGapX = 16;
  this.heapGapY = 18;
  this.heapStartY = 610;

  this.currSlotPos = { x: 220, y: 560 };
  this.prevSlotPos = { x: 500, y: 560 };

  this.outputBoxW = 44;
  this.outputBoxH = 44;
  this.outputGapX = 10;
  this.outputGapY = 14;
  this.outputStartY = 920;

  this.inputString = "aab";

  this.reset();
  this.setupLayout();
  if (this.animationManager) {
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
  }
};

ReorganizeString.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("String:");
  this.inputField = addControlToAlgorithmBar("Text", "aab");
  this.inputField.size = 30;

  this.runButton = addControlToAlgorithmBar("Button", "Reorganize");
  this.runButton.onclick = this.startCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.pauseButton = addControlToAlgorithmBar("Button", "Pause / Play");
  this.pauseButton.onclick = this.pauseCallback.bind(this);

  this.stepButton = addControlToAlgorithmBar("Button", "Next Step");
  this.stepButton.onclick = this.stepCallback.bind(this);

  this.controls.push(this.inputField, this.runButton);
};

ReorganizeString.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") doPlayPause();
};

ReorganizeString.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") doPlayPause();
    animationManager.step();
  }
};

ReorganizeString.prototype.startCallback = function () {
  const raw = this.inputField.value;
  if (raw === undefined || raw === null) return;
  this.inputString = raw.trim();
  this.implementAction(this.runAnimation.bind(this), 0);
};

ReorganizeString.prototype.reset = function () {
  this.nextIndex = 0;
  this.commands = [];
  this.freqObjects = {};
  this.freqOrder = [];
  this.heapEntries = [];
  this.prevEntry = null;
  this.inputCharIDs = [];
  this.outputBoxes = [];
  this.resultString = "";
  this.codeIDs = [];
  this.explanationID = -1;
  if (this.animationManager && this.animationManager.animatedObjects) {
    this.animationManager.animatedObjects.clearAllObjects();
  }
};

ReorganizeString.prototype.setupLayout = function () {
  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    canvasElem.width = this.canvasW;
    canvasElem.height = this.canvasH;
  }
  if (this.animationManager && this.animationManager.animatedObjects) {
    this.animationManager.animatedObjects.width = this.canvasW;
    this.animationManager.animatedObjects.height = this.canvasH;
  }
  this.canvasWidth = this.canvasW;
  this.canvasHeight = this.canvasH;

  this.freqObjects = {};
  this.freqOrder = [];
  this.heapEntries = [];
  this.prevEntry = null;
  this.inputCharIDs = [];
  this.outputBoxes = [];
  this.resultString = "";
  this.codeIDs = [];

  const titleID = this.nextIndex++;
  this.cmd("CreateLabel", titleID, "Reorganize String (LeetCode 767)", this.canvasW / 2, 40, 1);
  this.cmd("SetTextStyle", titleID, "bold 26");

  const inputLabelID = this.nextIndex++;
  this.cmd("CreateLabel", inputLabelID, "Input characters", this.canvasW / 2, 100, 1);
  this.cmd("SetTextStyle", inputLabelID, "18");

  this.createInputBoxes();

  const freqLabelID = this.nextIndex++;
  this.cmd("CreateLabel", freqLabelID, "Frequency map", this.canvasW / 2, 210, 1);
  this.cmd("SetTextStyle", freqLabelID, "bold 18");

  this.nLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.nLabelID, "n = 0", this.canvasW / 2 - 160, 500, 1);
  this.cmd("SetTextStyle", this.nLabelID, "16");

  this.maxLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.maxLabelID, "maxFreq = 0", this.canvasW / 2 + 160, 500, 1);
  this.cmd("SetTextStyle", this.maxLabelID, "16");

  const heapLabelID = this.nextIndex++;
  this.cmd("CreateLabel", heapLabelID, "Max heap (priority queue)", this.canvasW / 2, 570, 1);
  this.cmd("SetTextStyle", heapLabelID, "bold 18");

  this.currSlotLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.currSlotLabelID, "curr", this.currSlotPos.x, this.currSlotPos.y - 40, 1);
  this.cmd("SetTextStyle", this.currSlotLabelID, "16");

  this.currSlotRectID = this.nextIndex++;
  this.cmd("CreateRectangle", this.currSlotRectID, "", this.heapBoxW, this.heapBoxH, this.currSlotPos.x, this.currSlotPos.y);
  this.cmd("SetForegroundColor", this.currSlotRectID, "#94a3b8");
  this.cmd("SetBackgroundColor", this.currSlotRectID, "#f8fafc");

  this.prevSlotLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.prevSlotLabelID, "prev (hold)", this.prevSlotPos.x, this.prevSlotPos.y - 40, 1);
  this.cmd("SetTextStyle", this.prevSlotLabelID, "16");

  this.prevSlotRectID = this.nextIndex++;
  this.cmd("CreateRectangle", this.prevSlotRectID, "", this.heapBoxW, this.heapBoxH, this.prevSlotPos.x, this.prevSlotPos.y);
  this.cmd("SetForegroundColor", this.prevSlotRectID, "#94a3b8");
  this.cmd("SetBackgroundColor", this.prevSlotRectID, "#f8fafc");

  this.prevStatusID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.prevStatusID,
    "empty",
    this.prevSlotPos.x,
    this.prevSlotPos.y + this.heapBoxH / 2 + 18,
    1
  );
  this.cmd("SetTextStyle", this.prevStatusID, "italic 14");

  const outputLabelID = this.nextIndex++;
  this.cmd("CreateLabel", outputLabelID, "Reorganized output", this.canvasW / 2, this.outputStartY - 40, 1);
  this.cmd("SetTextStyle", outputLabelID, "bold 18");

  this.codeLines = [
    "public String reorganizeString(String s) {",
    "    Map<Character, Integer> freq = new HashMap<>();",
    "    for (char c : s.toCharArray())",
    "        freq.put(c, freq.getOrDefault(c, 0) + 1);",
    "    int n = s.length();",
    "    int maxFreq = Collections.max(freq.values());",
    "    if (maxFreq > (n + 1) / 2) return \"\";",
    "    PriorityQueue<Map.Entry<Character, Integer>> maxHeap = new PriorityQueue<>((a, b) -> b.getValue() - a.getValue());",
    "    maxHeap.addAll(freq.entrySet());",
    "    StringBuilder sb = new StringBuilder();",
    "    Map.Entry<Character, Integer> prev = null;",
    "    while (!maxHeap.isEmpty()) {",
    "        Map.Entry<Character, Integer> curr = maxHeap.poll();",
    "        sb.append(curr.getKey());",
    "        curr.setValue(curr.getValue() - 1);",
    "        if (prev != null && prev.getValue() > 0)",
    "            maxHeap.offer(prev);",
    "        prev = curr;",
    "    }",
    "    return sb.toString();",
    "}",
  ];

  this.computeOutputLayout();

  this.explanationID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.explanationID,
    "Click Reorganize to animate the steps.",
    this.canvasW / 2,
    this.explanationY,
    1
  );
  this.cmd("SetTextStyle", this.explanationID, "italic 16");

  this.setupCodePanel();
};

ReorganizeString.prototype.computeOutputLayout = function () {
  const n = Math.max(this.inputString.length, 1);
  const maxCols = Math.max(1, Math.floor((this.canvasW - 120) / (this.outputBoxW + this.outputGapX)));
  this.outputCols = Math.max(1, Math.min(maxCols, n));
  this.outputRowsEstimate = Math.max(1, Math.ceil(n / this.outputCols));
  this.explanationY = this.outputStartY + this.outputRowsEstimate * (this.outputBoxH + this.outputGapY) + 40;
  this.codeStartY = this.explanationY + 60;
  const available = this.canvasH - this.codeStartY - 40;
  const lines = this.codeLines ? this.codeLines.length : 0;
  if (lines > 1) {
    this.codeLineHeight = Math.max(11, Math.min(18, Math.floor(available / (lines - 1))));
  } else {
    this.codeLineHeight = 14;
  }
  if (this.codeStartY + this.codeLineHeight * (lines - 1) > this.canvasH - 20) {
    const extra = this.codeStartY + this.codeLineHeight * (lines - 1) - (this.canvasH - 20);
    this.codeStartY -= extra;
  }
};

ReorganizeString.prototype.createInputBoxes = function () {
  const n = this.inputString.length;
  if (n === 0) {
    const msgID = this.nextIndex++;
    this.cmd("CreateLabel", msgID, "(empty string)", this.canvasW / 2, 150, 1);
    this.cmd("SetTextStyle", msgID, "16");
    return;
  }
  const totalW = n * this.freqBoxW + Math.max(0, n - 1) * 12;
  const startX = (this.canvasW - totalW) / 2 + this.freqBoxW / 2;
  for (let i = 0; i < n; i++) {
    const rectID = this.nextIndex++;
    const x = startX + i * (this.freqBoxW + 12);
    this.cmd("CreateRectangle", rectID, this.inputString[i], this.freqBoxW, this.freqBoxH, x, 150);
    this.cmd("SetBackgroundColor", rectID, "#ffffff");
    this.cmd("SetForegroundColor", rectID, "#1e293b");
    this.inputCharIDs.push(rectID);
  }
};

ReorganizeString.prototype.setupCodePanel = function () {
  for (let i = 0; i < this.codeLines.length; i++) {
    const id = this.nextIndex++;
    const y = this.codeStartY + i * this.codeLineHeight;
    this.cmd("CreateLabel", id, this.codeLines[i], 80, y, 0);
    this.cmd("SetTextStyle", id, "14");
    this.codeIDs.push(id);
  }
};

ReorganizeString.prototype.highlightCode = function (line) {
  for (let i = 0; i < this.codeIDs.length; i++) {
    this.cmd("SetHighlight", this.codeIDs[i], i === line ? 1 : 0);
  }
};

ReorganizeString.prototype.setExplanation = function (text) {
  if (this.explanationID !== -1) {
    this.cmd("SetText", this.explanationID, text);
  }
};

ReorganizeString.prototype.getFreqPosition = function (index) {
  const col = index % this.freqCols;
  const row = Math.floor(index / this.freqCols);
  const areaW = this.freqCols * this.freqBoxW + (this.freqCols - 1) * this.freqGapX;
  const startX = (this.canvasW - areaW) / 2 + this.freqBoxW / 2;
  const x = startX + col * (this.freqBoxW + this.freqGapX);
  const y = this.freqStartY + row * (this.freqBoxH + this.freqGapY);
  return { x, y };
};

ReorganizeString.prototype.getHeapPosition = function (index) {
  const col = index % this.heapCols;
  const row = Math.floor(index / this.heapCols);
  const areaW = this.heapCols * this.heapBoxW + (this.heapCols - 1) * this.heapGapX;
  const startX = (this.canvasW - areaW) / 2 + this.heapBoxW / 2;
  const x = startX + col * (this.heapBoxW + this.heapGapX);
  const y = this.heapStartY + row * (this.heapBoxH + this.heapGapY);
  return { x, y };
};

ReorganizeString.prototype.getOutputPosition = function (index) {
  const col = index % this.outputCols;
  const row = Math.floor(index / this.outputCols);
  const areaW = this.outputCols * this.outputBoxW + (this.outputCols - 1) * this.outputGapX;
  const startX = (this.canvasW - areaW) / 2 + this.outputBoxW / 2;
  const x = startX + col * (this.outputBoxW + this.outputGapX);
  const y = this.outputStartY + row * (this.outputBoxH + this.outputGapY);
  return { x, y };
};

ReorganizeString.prototype.sortHeapEntries = function () {
  this.heapEntries.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.char.localeCompare(b.char);
  });
};

ReorganizeString.prototype.reflowHeapPositions = function () {
  for (let i = 0; i < this.heapEntries.length; i++) {
    const pos = this.getHeapPosition(i);
    this.cmd("Move", this.heapEntries[i].rectID, pos.x, pos.y);
  }
};

ReorganizeString.prototype.updateHoldStatus = function () {
  if (this.prevStatusID === undefined) return;
  let text = "empty";
  if (this.prevEntry) {
    text = this.prevEntry.count > 0 ? "holding" : "depleted";
  }
  this.cmd("SetText", this.prevStatusID, text);
};

ReorganizeString.prototype.addOutputChar = function (ch) {
  const pos = this.getOutputPosition(this.outputBoxes.length);
  const rectID = this.nextIndex++;
  this.cmd("CreateRectangle", rectID, ch, this.outputBoxW, this.outputBoxH, pos.x, pos.y);
  this.cmd("SetBackgroundColor", rectID, "#bbf7d0");
  this.cmd("SetForegroundColor", rectID, "#1f2937");
  this.outputBoxes.push(rectID);
  this.resultString += ch;
};

ReorganizeString.prototype.runAnimation = function () {
  this.reset();
  this.setupLayout();
  this.cmd("Step");

  const s = this.inputString;
  if (s.length === 0) {
    this.highlightCode(1);
    this.setExplanation("Empty string detected; nothing to rearrange.");
    this.cmd("Step");
    this.highlightCode(19);
    this.setExplanation("Return \"\" as the reorganized string.");
    this.cmd("Step");
    return this.commands;
  }

  this.highlightCode(1);
  this.setExplanation("Create the frequency map for all characters.");
  this.cmd("Step");

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    this.highlightCode(2);
    this.cmd("SetBackgroundColor", this.inputCharIDs[i], "#fde68a");
    this.cmd("Step");
    this.highlightCode(3);
    if (!this.freqObjects[ch]) {
      const pos = this.getFreqPosition(this.freqOrder.length);
      const rectID = this.nextIndex++;
      this.cmd("CreateRectangle", rectID, ch + ":1", this.freqBoxW, this.freqBoxH, pos.x, pos.y);
      this.cmd("SetBackgroundColor", rectID, "#e0f2f1");
      this.cmd("SetForegroundColor", rectID, "#0f172a");
      this.freqObjects[ch] = { rectID, count: 1, index: this.freqOrder.length };
      this.freqOrder.push(ch);
      this.setExplanation("First occurrence of '" + ch + "' -> create entry 1.");
    } else {
      this.freqObjects[ch].count += 1;
      this.cmd("SetText", this.freqObjects[ch].rectID, ch + ":" + this.freqObjects[ch].count);
      this.cmd("SetBackgroundColor", this.freqObjects[ch].rectID, "#fde68a");
      this.setExplanation("Increment frequency of '" + ch + "' to " + this.freqObjects[ch].count + ".");
    }
    this.cmd("Step");
    this.cmd("SetBackgroundColor", this.freqObjects[ch].rectID, "#e0f2f1");
    this.cmd("SetBackgroundColor", this.inputCharIDs[i], "#ffffff");
  }

  const n = s.length;
  this.highlightCode(4);
  this.cmd("SetText", this.nLabelID, "n = " + n);
  this.setExplanation("The string length is " + n + ".");
  this.cmd("Step");

  let maxFreq = 0;
  let maxChar = null;
  for (const ch of this.freqOrder) {
    const count = this.freqObjects[ch].count;
    if (count > maxFreq) {
      maxFreq = count;
      maxChar = ch;
    }
  }
  this.highlightCode(5);
  this.cmd("SetText", this.maxLabelID, "maxFreq = " + maxFreq);
  if (maxChar !== null) {
    this.cmd("SetBackgroundColor", this.freqObjects[maxChar].rectID, "#fbcfe8");
  }
  this.setExplanation("Highest frequency is " + maxFreq + " (character '" + maxChar + "').");
  this.cmd("Step");
  if (maxChar !== null) {
    this.cmd("SetBackgroundColor", this.freqObjects[maxChar].rectID, "#e0f2f1");
  }

  this.highlightCode(6);
  const limit = Math.floor((n + 1) / 2);
  if (maxFreq > limit) {
    this.cmd("SetForegroundColor", this.maxLabelID, "#dc2626");
    this.setExplanation("maxFreq > (n + 1) / 2 so adjacent duplicates cannot be avoided.");
    this.cmd("Step");
    this.highlightCode(19);
    this.setExplanation("Return empty string because reorganization is impossible.");
    this.cmd("Step");
    return this.commands;
  }
  this.cmd("SetForegroundColor", this.maxLabelID, "#1f2937");
  this.setExplanation("Constraint satisfied; continue to build the heap.");
  this.cmd("Step");

  this.highlightCode(7);
  this.setExplanation("Create a max-heap ordered by remaining counts.");
  this.cmd("Step");

  const entries = [];
  for (const ch of this.freqOrder) {
    entries.push({ char: ch, count: this.freqObjects[ch].count });
  }
  entries.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.char.localeCompare(b.char);
  });

  this.highlightCode(8);
  for (let i = 0; i < entries.length; i++) {
    const info = entries[i];
    const freqObj = this.freqObjects[info.char];
    const startPos = this.getFreqPosition(freqObj.index);
    const rectID = this.nextIndex++;
    this.cmd("CreateRectangle", rectID, info.char + ":" + info.count, this.heapBoxW, this.heapBoxH, startPos.x, startPos.y);
    this.cmd("SetBackgroundColor", rectID, "#fde68a");
    this.cmd("SetForegroundColor", rectID, "#1f2937");
    const heapPos = this.getHeapPosition(i);
    this.cmd("Move", rectID, heapPos.x, heapPos.y);
    this.cmd("SetBackgroundColor", rectID, "#ffffff");
    this.cmd("Step");
    this.heapEntries.push({ char: info.char, count: info.count, rectID });
  }
  this.sortHeapEntries();
  this.reflowHeapPositions();
  this.cmd("Step");

  this.highlightCode(9);
  this.setExplanation("Prepare an empty builder to collect the rearranged characters.");
  this.cmd("Step");

  this.highlightCode(10);
  this.prevEntry = null;
  this.updateHoldStatus();
  this.setExplanation("prev is null initially; nothing is held back yet.");
  this.cmd("Step");

  while (this.heapEntries.length > 0) {
    this.highlightCode(11);
    this.setExplanation("Heap still has entries; continue looping.");
    this.cmd("Step");

    this.highlightCode(12);
    const curr = this.heapEntries.shift();
    this.cmd("SetBackgroundColor", curr.rectID, "#bfdbfe");
    this.cmd("Move", curr.rectID, this.currSlotPos.x, this.currSlotPos.y);
    this.cmd("Step");
    this.cmd("SetBackgroundColor", curr.rectID, "#ffffff");
    this.reflowHeapPositions();

    this.highlightCode(13);
    this.addOutputChar(curr.char);
    this.setExplanation("Append '" + curr.char + "' to the result string.");
    this.cmd("Step");

    this.highlightCode(14);
    curr.count -= 1;
    this.cmd("SetText", curr.rectID, curr.char + ":" + curr.count);
    this.setExplanation("Decrease remaining count of '" + curr.char + "' to " + curr.count + ".");
    this.cmd("Step");

    this.highlightCode(15);
    if (this.prevEntry) {
      if (this.prevEntry.count > 0) {
        this.highlightCode(16);
        this.setExplanation("Reinsert held entry '" + this.prevEntry.char + "' with count " + this.prevEntry.count + ".");
        this.heapEntries.push(this.prevEntry);
        this.sortHeapEntries();
        this.reflowHeapPositions();
        this.cmd("Step");
        this.prevEntry = null;
        this.updateHoldStatus();
      } else {
        this.setExplanation("Held entry '" + this.prevEntry.char + "' is exhausted and removed.");
        this.cmd("Delete", this.prevEntry.rectID);
        this.prevEntry = null;
        this.updateHoldStatus();
        this.cmd("Step");
      }
    } else {
      this.setExplanation("No held entry to consider.");
      this.cmd("Step");
    }

    this.highlightCode(17);
    this.prevEntry = curr;
    this.updateHoldStatus();
    if (curr.count > 0) {
      this.setExplanation("Hold '" + curr.char + "' for the next iteration.");
      this.cmd("Move", curr.rectID, this.prevSlotPos.x, this.prevSlotPos.y);
    } else {
      this.setExplanation("'" + curr.char + "' is depleted; it will not return to the heap.");
      this.cmd("Move", curr.rectID, this.prevSlotPos.x, this.prevSlotPos.y);
    }
    this.cmd("Step");
  }

  if (this.prevEntry && this.prevEntry.count <= 0) {
    this.cmd("Delete", this.prevEntry.rectID);
    this.prevEntry = null;
    this.updateHoldStatus();
  }

  this.highlightCode(19);
  this.setExplanation("Return the built string: " + this.resultString + ".");
  this.cmd("Step");

  return this.commands;
};

function init() {
  const animManag = initCanvas();
  currentAlgorithm = new ReorganizeString(animManag, 0, 0);
}
