// BSD-2-Clause license header retained from original framework.

function ReorganizeString(am, w, h) {
  this.init(am, w, h);
}

ReorganizeString.prototype = new Algorithm();
ReorganizeString.prototype.constructor = ReorganizeString;
ReorganizeString.superclass = Algorithm.prototype;

ReorganizeString.prototype.init = function (am, w, h) {
  ReorganizeString.superclass.init.call(this, am, w, h);

  this.canvasW = 720;
  this.canvasH = 1280;

  this.titleY = 48;
  this.inputLabelY = 120;
  this.inputBoxY = 174;

  this.charBoxW = 32;
  this.charBoxH = 32;
  this.charBoxGap = 18;

  this.freqLabelY = 244;
  this.freqMapY = 288;

  this.heapLabelY = 380;
  this.heapNodeRadius = 20;
  this.heapLevelGap = 110;
  this.heapRootY = 480;
  this.heapRootX = 470;
  this.heapInitialOffset = 90;

  this.currAnchor = { x: this.heapRootX - 150, y: this.heapRootY };
  this.prevAnchor = { x: this.currAnchor.x, y: this.currAnchor.y + 80 };

  this.outputTitleX = 90;
  this.outputLabelY = this.heapRootY + this.heapLevelGap * 2 - 40;
  this.outputStringY = this.outputLabelY;
  this.outputStringStartX = this.outputTitleX + 220;
  this.outputCharSpacing = 34;

  this.explanationX = this.outputStringStartX + 190;
  this.explanationY = this.outputLabelY;

  this.codeStartY = this.outputLabelY + 110;
  this.codeLineHeight = 18;
  this.codeLeftX = this.outputTitleX;

  this.inputString = "vvloo";

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

  this.addControls();

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
  this.inputField = addControlToAlgorithmBar("Text", this.inputString);
  this.inputField.size = 30;
  this.inputField.value = this.inputString;

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
  if (typeof doPlayPause === "function") {
    doPlayPause();
  }
};

ReorganizeString.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") {
      doPlayPause();
    }
    animationManager.step();
  }
};

ReorganizeString.prototype.startCallback = function () {
  const raw = this.inputField.value;
  if (raw === undefined || raw === null) {
    return;
  }
  this.inputString = raw.trim();
  this.implementAction(this.runAnimation.bind(this), 0);
};

ReorganizeString.prototype.reset = function () {
  this.nextIndex = 0;
  this.commands = [];
  this.inputCharIDs = [];
  this.freqCounts = {};
  this.freqOrder = [];
  this.heapEntries = [];
  this.heapConnections = [];
  this.currEntry = null;
  this.prevEntry = null;
  this.currSlotID = -1;
  this.prevSlotID = -1;
  this.outputString = "";
  this.resultString = "";
  this.freqMapID = -1;
  this.explanationID = -1;
  this.outputTitleID = -1;
  this.outputStringID = -1;
  this.currLabelID = -1;
  this.prevLabelID = -1;
  this.codeIDs = [];
  if (this.animationManager && this.animationManager.animatedObjects) {
    this.animationManager.animatedObjects.clearAllObjects();
  }
};

ReorganizeString.prototype.getSlotValueText = function (entry) {
  if (!entry) {
    return "null";
  }
  return entry.char + ", " + entry.count;
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

  const titleID = this.nextIndex++;
  this.cmd("CreateLabel", titleID, "Reorganize String (LeetCode 767)", this.canvasW / 2, this.titleY, 1);
  this.cmd("SetTextStyle", titleID, "bold 28");

  const inputLabelID = this.nextIndex++;
  this.cmd("CreateLabel", inputLabelID, "Input characters", this.canvasW / 2, this.inputLabelY, 1);
  this.cmd("SetTextStyle", inputLabelID, "18");

  this.createInputBoxes();

  const freqLabelID = this.nextIndex++;
  this.cmd("CreateLabel", freqLabelID, "Frequency Map", this.canvasW / 2, this.freqLabelY, 1);
  this.cmd("SetTextStyle", freqLabelID, "bold 20");

  this.freqMapID = this.nextIndex++;
  this.cmd("CreateLabel", this.freqMapID, "{}", this.canvasW / 2, this.freqMapY, 1);
  this.cmd("SetTextStyle", this.freqMapID, "18");
  this.cmd("SetForegroundColor", this.freqMapID, "#111827");

  this.explanationID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.explanationID,
    "Click Reorganize to animate the steps.",
    this.explanationX,
    this.explanationY,
    0
  );
  this.cmd("SetTextStyle", this.explanationID, "italic 18");
  this.cmd("SetForegroundColor", this.explanationID, "#0f172a");

  const heapLabelID = this.nextIndex++;
  this.cmd("CreateLabel", heapLabelID, "Max Heap", this.heapRootX, this.heapLabelY, 1);
  this.cmd("SetTextStyle", heapLabelID, "bold 20");

  this.currSlotID = this.nextIndex++;
  this.cmd("CreateCircle", this.currSlotID, "", this.currAnchor.x, this.currAnchor.y);
  this.cmd("SetWidth", this.currSlotID, this.heapNodeRadius * 2 + 8);
  this.cmd("SetBackgroundColor", this.currSlotID, "#f8fafc");
  this.cmd("SetForegroundColor", this.currSlotID, "#cbd5f5");
  this.cmd("SetLayer", this.currSlotID, 0);

  this.currLabelID = this.nextIndex++;
  const currLabelX = this.currAnchor.x - (this.heapNodeRadius + 70);
  this.cmd(
    "CreateLabel",
    this.currLabelID,
    "curr " + this.getSlotValueText(null),
    currLabelX,
    this.currAnchor.y,
    0
  );
  this.cmd("SetTextStyle", this.currLabelID, "bold 18");
  this.cmd("SetForegroundColor", this.currLabelID, "#111827");

  this.prevSlotID = this.nextIndex++;
  this.cmd("CreateCircle", this.prevSlotID, "", this.prevAnchor.x, this.prevAnchor.y);
  this.cmd("SetWidth", this.prevSlotID, this.heapNodeRadius * 2 + 8);
  this.cmd("SetBackgroundColor", this.prevSlotID, "#f8fafc");
  this.cmd("SetForegroundColor", this.prevSlotID, "#cbd5f5");
  this.cmd("SetLayer", this.prevSlotID, 0);

  this.prevLabelID = this.nextIndex++;
  const prevLabelX = this.prevAnchor.x - (this.heapNodeRadius + 70);
  this.cmd(
    "CreateLabel",
    this.prevLabelID,
    "prev " + this.getSlotValueText(null),
    prevLabelX,
    this.prevAnchor.y,
    0
  );
  this.cmd("SetTextStyle", this.prevLabelID, "bold 18");
  this.cmd("SetForegroundColor", this.prevLabelID, "#111827");

  this.outputTitleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.outputTitleID,
    "Reorganized string",
    this.outputTitleX,
    this.outputLabelY,
    0
  );
  this.cmd("SetTextStyle", this.outputTitleID, "bold 20");
  this.cmd("SetForegroundColor", this.outputTitleID, "#111827");

  this.outputStringID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.outputStringID,
    "",
    this.outputStringStartX,
    this.outputStringY,
    0
  );
  this.cmd("SetTextStyle", this.outputStringID, "24");
  this.cmd("SetForegroundColor", this.outputStringID, "#111827");

  this.setupCodePanel();
};

ReorganizeString.prototype.createInputBoxes = function () {
  this.inputCharIDs = [];
  const n = this.inputString.length;
  if (n === 0) {
    const emptyID = this.nextIndex++;
    this.cmd("CreateLabel", emptyID, "(empty string)", this.canvasW / 2, this.inputBoxY, 1);
    this.cmd("SetTextStyle", emptyID, "18");
    return;
  }
  const totalW = n * this.charBoxW + Math.max(0, n - 1) * this.charBoxGap;
  const startX = (this.canvasW - totalW) / 2 + this.charBoxW / 2;
  for (let i = 0; i < n; i++) {
    const x = startX + i * (this.charBoxW + this.charBoxGap);
    const rectID = this.nextIndex++;
    this.cmd("CreateRectangle", rectID, this.inputString[i], this.charBoxW, this.charBoxH, x, this.inputBoxY);
    this.cmd("SetBackgroundColor", rectID, "#ffffff");
    this.cmd("SetForegroundColor", rectID, "#111827");
    this.inputCharIDs.push(rectID);
  }
};

ReorganizeString.prototype.setupCodePanel = function () {
  for (let i = 0; i < this.codeLines.length; i++) {
    const id = this.nextIndex++;
    const y = this.codeStartY + i * this.codeLineHeight;
    this.cmd("CreateLabel", id, this.codeLines[i], this.codeLeftX, y, 0);
    this.cmd("SetTextStyle", id, "16px monospace");
    this.cmd("SetForegroundColor", id, "#111827");
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

ReorganizeString.prototype.updateFrequencyLabel = function () {
  if (this.freqMapID === -1) {
    return;
  }
  if (this.freqOrder.length === 0) {
    this.cmd("SetText", this.freqMapID, "{}");
    return;
  }
  const parts = [];
  for (const ch of this.freqOrder) {
    const info = this.freqCounts[ch];
    if (!info) {
      continue;
    }
    parts.push(ch + " : " + info.count);
  }
  const display = "{ " + parts.join(", ") + " }";
  this.cmd("SetText", this.freqMapID, display);
};

ReorganizeString.prototype.formatNodeText = function (entry) {
  return "(" + entry.char + "," + entry.count + ")";
};

ReorganizeString.prototype.createHeapEntry = function (char, count, index, total) {
  const span = Math.max(1, total || 1);
  const gap = this.heapNodeRadius * 2 + 20;
  const startX = this.heapRootX - ((span - 1) * gap) / 2 + (index || 0) * gap;
  const startY = this.freqMapY + 90;
  const nodeID = this.nextIndex++;
  const entry = { char, count, nodeID };
  this.cmd("CreateCircle", nodeID, this.formatNodeText(entry), startX, startY);
  this.cmd("SetWidth", nodeID, this.heapNodeRadius * 2);
  this.cmd("SetTextStyle", nodeID, "bold 14px monospace");
  this.cmd("SetBackgroundColor", nodeID, "#ffffff");
  this.cmd("SetForegroundColor", nodeID, "#111827");
  return entry;
};

ReorganizeString.prototype.getHeapPosition = function (index) {
  if (index < 0) {
    return { x: this.heapRootX, y: this.heapRootY };
  }
  const level = Math.floor(Math.log2(index + 1));
  let x = this.heapRootX;
  let offset = this.heapInitialOffset;
  let nodeIndex = index + 1;
  const path = [];
  while (nodeIndex > 1) {
    path.push(nodeIndex % 2 === 0 ? -1 : 1);
    nodeIndex = Math.floor(nodeIndex / 2);
  }
  for (let i = path.length - 1; i >= 0; i--) {
    x += path[i] * offset;
    offset /= 2;
  }
  const y = this.heapRootY + level * this.heapLevelGap;
  return { x, y };
};

ReorganizeString.prototype.clearHeapConnections = function () {
  if (!this.heapConnections || this.heapConnections.length === 0) {
    return;
  }
  for (const conn of this.heapConnections) {
    this.cmd("Disconnect", conn.parentID, conn.childID);
  }
  this.heapConnections = [];
};

ReorganizeString.prototype.reflowHeapPositions = function () {
  this.clearHeapConnections();
  for (let i = 0; i < this.heapEntries.length; i++) {
    const entry = this.heapEntries[i];
    const pos = this.getHeapPosition(i);
    this.cmd("Move", entry.nodeID, pos.x, pos.y);
  }
  for (let i = 0; i < this.heapEntries.length; i++) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < this.heapEntries.length) {
      this.cmd("Connect", this.heapEntries[i].nodeID, this.heapEntries[left].nodeID, "#94a3b8", 0, 0, "");
      this.heapConnections.push({ parentID: this.heapEntries[i].nodeID, childID: this.heapEntries[left].nodeID });
    }
    if (right < this.heapEntries.length) {
      this.cmd("Connect", this.heapEntries[i].nodeID, this.heapEntries[right].nodeID, "#94a3b8", 0, 0, "");
      this.heapConnections.push({ parentID: this.heapEntries[i].nodeID, childID: this.heapEntries[right].nodeID });
    }
  }
};

ReorganizeString.prototype.sortHeapEntries = function () {
  this.heapEntries.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.char.localeCompare(b.char);
  });
};

ReorganizeString.prototype.updateCurrDisplay = function (entry) {
  if (this.currLabelID === -1) {
    return;
  }
  this.cmd("SetText", this.currLabelID, "curr " + this.getSlotValueText(entry));
  this.cmd("SetForegroundColor", this.currLabelID, "#111827");
};

ReorganizeString.prototype.updatePrevDisplay = function (entry) {
  if (this.prevLabelID === -1) {
    return;
  }
  this.cmd("SetText", this.prevLabelID, "prev " + this.getSlotValueText(entry));
  this.cmd("SetForegroundColor", this.prevLabelID, "#111827");
};

ReorganizeString.prototype.moveEntryToCurrAnchor = function (entry) {
  this.cmd("SetBackgroundColor", entry.nodeID, "#f1f5f9");
  this.cmd("Move", entry.nodeID, this.currAnchor.x, this.currAnchor.y);
  this.currEntry = entry;
  this.updateCurrDisplay(entry);
};

ReorganizeString.prototype.moveEntryToPrevAnchor = function (entry) {
  const color = entry.count > 0 ? "#e0f2fe" : "#f1f5f9";
  this.cmd("Move", entry.nodeID, this.prevAnchor.x, this.prevAnchor.y);
  this.cmd("SetBackgroundColor", entry.nodeID, color);
  this.updatePrevDisplay(entry);
  this.currEntry = null;
};

ReorganizeString.prototype.animateAppendChar = function (entry) {
  if (!entry) {
    return;
  }
  const tempID = this.nextIndex++;
  this.cmd("CreateLabel", tempID, entry.char, this.currAnchor.x, this.currAnchor.y, 1);
  this.cmd("SetTextStyle", tempID, "bold 26");
  this.cmd("SetForegroundColor", tempID, "#111827");
  const targetX = this.outputStringStartX + this.resultString.length * this.outputCharSpacing;
  this.cmd("Move", tempID, targetX, this.outputStringY);
  this.cmd("Step");
  this.cmd("Delete", tempID);
  this.resultString += entry.char;
  if (this.outputStringID !== -1) {
    this.cmd("SetText", this.outputStringID, this.resultString);
    this.cmd("SetForegroundColor", this.outputStringID, "#111827");
  }
  this.cmd("Step");
};

ReorganizeString.prototype.updateNodeText = function (entry) {
  this.cmd("SetText", entry.nodeID, this.formatNodeText(entry));
};

ReorganizeString.prototype.runAnimation = function () {
  this.reset();
  this.setupLayout();
  this.cmd("Step");

  const s = this.inputString;
  if (s.length === 0) {
    this.highlightCode(1);
    this.setExplanation("Empty input string; nothing to reorganize.");
    this.cmd("Step");
    this.highlightCode(19);
    this.setExplanation("Return \"\".");
    this.cmd("Step");
    return this.commands;
  }

  this.highlightCode(1);
  this.setExplanation("Prepare a frequency map to count each character.");
  this.cmd("Step");

  this.freqCounts = {};
  this.freqOrder = [];

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    this.highlightCode(2);
    if (this.inputCharIDs[i] !== undefined) {
      this.cmd("SetBackgroundColor", this.inputCharIDs[i], "#fde68a");
    }
    this.cmd("Step");

    this.highlightCode(3);
    if (!this.freqCounts[ch]) {
      this.freqCounts[ch] = { count: 1 };
      this.freqOrder.push(ch);
      this.setExplanation("First occurrence of '" + ch + "' -> add to the map.");
    } else {
      this.freqCounts[ch].count += 1;
      this.setExplanation("Increment count of '" + ch + "' to " + this.freqCounts[ch].count + ".");
    }
    this.updateFrequencyLabel();
    this.cmd("Step");
    if (this.inputCharIDs[i] !== undefined) {
      this.cmd("SetBackgroundColor", this.inputCharIDs[i], "#ffffff");
    }
  }

  const n = s.length;
  this.highlightCode(4);
  this.setExplanation("The string has length " + n + ".");
  this.cmd("Step");

  let maxFreq = 0;
  let maxChar = null;
  for (const ch of this.freqOrder) {
    const count = this.freqCounts[ch].count;
    if (count > maxFreq) {
      maxFreq = count;
      maxChar = ch;
    }
  }

  this.highlightCode(5);
  this.cmd("SetForegroundColor", this.freqMapID, "#2563eb");
  if (maxChar !== null) {
    this.setExplanation("Maximum frequency is " + maxFreq + " for '" + maxChar + "'.");
  } else {
    this.setExplanation("No characters were collected.");
  }
  this.cmd("Step");
  this.cmd("SetForegroundColor", this.freqMapID, "#111827");

  this.highlightCode(6);
  const limit = Math.floor((n + 1) / 2);
  if (maxFreq > limit) {
    this.setExplanation(
      "maxFreq > (n + 1) / 2, so two identical letters must touch. Return empty string."
    );
    this.cmd("Step");
    this.highlightCode(19);
    this.currEntry = null;
    this.prevEntry = null;
    this.updateCurrDisplay(null);
    this.updatePrevDisplay(null);
    this.setExplanation("Return \"\" because reorganization is impossible.");
    this.cmd("Step");
    return this.commands;
  }
  this.setExplanation("Constraint satisfied; we can continue.");
  this.cmd("Step");

  const entries = [];
  for (const ch of this.freqOrder) {
    entries.push({ char: ch, count: this.freqCounts[ch].count });
  }
  entries.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.char.localeCompare(b.char);
  });

  this.highlightCode(7);
  this.setExplanation("Create a max heap ordered by remaining counts.");
  this.cmd("Step");

  this.highlightCode(8);
  for (let i = 0; i < entries.length; i++) {
    const info = entries[i];
    const entry = this.createHeapEntry(info.char, info.count, i, entries.length);
    this.setExplanation(
      "Place ('" +
        info.char +
        "', " +
        info.count +
        ") from the frequency map into the max heap."
    );
    this.cmd("Step");
    this.heapEntries.push(entry);
    this.reflowHeapPositions();
    this.cmd("Step");
  }
  this.sortHeapEntries();
  this.reflowHeapPositions();
  if (this.heapEntries.length > 0) {
    this.setExplanation("Max heap arranged with the largest count at the root.");
    this.cmd("Step");
  }

  this.highlightCode(9);
  this.resultString = "";
  this.setExplanation("Start building the answer in a StringBuilder.");
  this.cmd("Step");

  this.highlightCode(10);
  this.prevEntry = null;
  this.updatePrevDisplay(null);
  this.setExplanation("prev is null; nothing held from a previous step.");
  this.cmd("Step");

  while (this.heapEntries.length > 0) {
    this.highlightCode(11);
    this.setExplanation("Heap still has entries; continue reorganizing.");
    this.cmd("Step");

    this.highlightCode(12);
    const curr = this.heapEntries.shift();
    this.clearHeapConnections();
    this.moveEntryToCurrAnchor(curr);
    this.setExplanation("Poll the highest count entry '" + curr.char + "'.");
    this.cmd("Step");
    this.reflowHeapPositions();
    if (this.heapEntries.length > 0) {
      this.setExplanation("Rebuild the heap with the remaining entries.");
      this.cmd("Step");
    }
    this.cmd("SetBackgroundColor", curr.nodeID, "#ffffff");

    this.highlightCode(13);
    this.setExplanation("Append '" + curr.char + "' to the reorganized string.");
    this.animateAppendChar(curr);

    this.highlightCode(14);
    curr.count -= 1;
    this.updateNodeText(curr);
    this.setExplanation("Decrease the remaining count of '" + curr.char + "' to " + curr.count + ".");
    this.updateCurrDisplay(curr);
    this.cmd("Step");

    this.highlightCode(15);
    if (this.prevEntry) {
      if (this.prevEntry.count > 0) {
        this.highlightCode(16);
        const returning = this.prevEntry;
        this.prevEntry = null;
        this.setExplanation(
          "Reinsert held entry '" + returning.char + "' with count " + returning.count + " into the heap."
        );
        this.cmd("SetBackgroundColor", returning.nodeID, "#ffffff");
        this.cmd("Step");
        this.heapEntries.push(returning);
        this.sortHeapEntries();
        this.reflowHeapPositions();
        this.setExplanation("Heap rebuilt after reinserting '" + returning.char + "'.");
        this.cmd("Step");
      } else {
        this.setExplanation(
          "Held entry '" + this.prevEntry.char + "' is exhausted and removed from play."
        );
        this.cmd("Delete", this.prevEntry.nodeID);
        this.prevEntry = null;
        this.cmd("Step");
      }
    } else {
      this.setExplanation("No held entry to consider this round.");
      this.cmd("Step");
    }

    this.highlightCode(17);
    this.prevEntry = curr;
    if (curr.count > 0) {
      this.setExplanation("Hold '" + curr.char + "' so it cannot be reused immediately.");
    } else {
      this.setExplanation("'" + curr.char + "' is depleted; it will not return to the heap.");
    }
    this.moveEntryToPrevAnchor(curr);
    this.cmd("Step");

    if (curr.count <= 0) {
      this.setExplanation("'" + curr.char + "' has no remaining count and is discarded.");
      this.cmd("Delete", curr.nodeID);
      this.prevEntry = null;
      this.cmd("Step");
    }
  }

  this.highlightCode(19);
  this.setExplanation("Return the built string: " + this.resultString + ".");
  if (this.outputStringID !== -1) {
    this.cmd("SetText", this.outputStringID, this.resultString);
    this.cmd("SetForegroundColor", this.outputStringID, "#111827");
  }
  if (this.outputTitleID !== -1) {
    this.cmd("SetForegroundColor", this.outputTitleID, "#111827");
  }
  this.cmd("Step");

  this.setExplanation("Highlight the returned string to show completion.");
  if (this.outputTitleID !== -1) {
    this.cmd("SetForegroundColor", this.outputTitleID, "#16a34a");
  }
  if (this.outputStringID !== -1) {
    this.cmd("SetForegroundColor", this.outputStringID, "#16a34a");
  }
  this.cmd("Step");

  return this.commands;
};

function init() {
  const animManag = initCanvas();
  currentAlgorithm = new ReorganizeString(animManag, 0, 0);
}
