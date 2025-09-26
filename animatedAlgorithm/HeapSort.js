// Heap sort visualization following the modern 720x1280 layout that powers
// the Quick Sort page. The animation highlights the heap building phase and
// every sift-down (heapify) step with descriptive narration and code traces.

function HeapSort(am, w, h) {
  this.init(am, w, h);
}

HeapSort.prototype = new Algorithm();
HeapSort.prototype.constructor = HeapSort;
HeapSort.superclass = Algorithm.prototype;

HeapSort.CANVAS_WIDTH = 720;
HeapSort.CANVAS_HEIGHT = 1280;

HeapSort.BAR_COUNT = 12;
HeapSort.BAR_WIDTH = 44;
HeapSort.BAR_SPACING = 54;
HeapSort.BAR_START_X =
  HeapSort.CANVAS_WIDTH / 2 -
  ((HeapSort.BAR_COUNT - 1) * HeapSort.BAR_SPACING) / 2;
HeapSort.BAR_BASE_Y = 760;
HeapSort.BAR_LABEL_OFFSET = 32;
HeapSort.BAR_LABEL_Y = HeapSort.BAR_BASE_Y + HeapSort.BAR_LABEL_OFFSET;
HeapSort.POINTER_OFFSET = 26;
HeapSort.POINTER_Y = HeapSort.BAR_LABEL_Y + HeapSort.POINTER_OFFSET;

HeapSort.TITLE_Y = 60;
HeapSort.INFO_Y = 140;
HeapSort.LEGEND_Y = HeapSort.POINTER_Y + 36;
HeapSort.LEGEND_SPACING = 150;
HeapSort.LEGEND_BOX_WIDTH = 42;
HeapSort.LEGEND_BOX_HEIGHT = 24;
HeapSort.LEGEND_LABEL_GAP = 14;

HeapSort.CODE_START_Y = HeapSort.LEGEND_Y + 48;
HeapSort.CODE_LINE_HEIGHT = 16;
HeapSort.CODE_FONT = "bold 14";
HeapSort.CODE_LEFT_X = 90;
HeapSort.CODE_RIGHT_X = 440;

HeapSort.VALUE_MIN = 15;
HeapSort.VALUE_MAX = 95;
HeapSort.SCALE_FACTOR = 6.0;

HeapSort.DEFAULT_COLOR = "#e1e7ef";
HeapSort.ACTIVE_HEAP_COLOR = "#ffd166";
HeapSort.CURRENT_NODE_COLOR = "#f48c06";
HeapSort.SORTED_COLOR = "#43aa8b";
HeapSort.BORDER_COLOR = "#1d3557";
HeapSort.LABEL_COLOR = "#0b2545";
HeapSort.INFO_COLOR = "#3c096c";
HeapSort.CODE_STANDARD_COLOR = "#1f3d7a";
HeapSort.CODE_HIGHLIGHT_COLOR = "#d62828";
HeapSort.POINTER_COLOR = HeapSort.CURRENT_NODE_COLOR;
HeapSort.POINTER_BG = "#ffe8cc";

HeapSort.LEGEND_ITEMS = [
  { label: "Heap region", color: HeapSort.ACTIVE_HEAP_COLOR },
  { label: "Current focus", color: HeapSort.CURRENT_NODE_COLOR },
  { label: "Sorted", color: HeapSort.SORTED_COLOR },
];

HeapSort.CODE_SECTIONS = [
  {
    lines: [
      "void heapSort(int[] arr) {",
      "  int n = arr.length;",
      "  buildMaxHeap(arr, n);",
      "  for (int end = n - 1; end > 0; end--) {",
      "    swap(arr, 0, end);",
      "    heapify(arr, 0, end);",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "void buildMaxHeap(int[] arr, int n) {",
      "  for (int i = n / 2 - 1; i >= 0; i--) {",
      "    heapify(arr, i, n);",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "void heapify(int[] arr, int idx, int heapSize) {",
      "  int largest = idx;",
      "  int left = 2 * idx + 1;",
      "  int right = 2 * idx + 2;",
      "  if (left < heapSize && arr[left] > arr[largest]) {",
      "    largest = left;",
      "  }",
      "  if (right < heapSize && arr[right] > arr[largest]) {",
      "    largest = right;",
      "  }",
      "  if (largest != idx) {",
      "    swap(arr, idx, largest);",
      "    heapify(arr, largest, heapSize);",
      "  }",
      "}",
    ],
  },
];

HeapSort.prototype.init = function (am, w, h) {
  HeapSort.superclass.init.call(this, am, w, h);

  if (
    typeof objectManager !== "undefined" &&
    objectManager &&
    objectManager.statusReport
  ) {
    objectManager.statusReport.setText("");
    objectManager.statusReport.addedToScene = false;
  }

  this.addControls();
  this.nextIndex = 0;

  this.arrayData = new Array(HeapSort.BAR_COUNT);
  this.barObjects = new Array(HeapSort.BAR_COUNT);
  this.barLabels = new Array(HeapSort.BAR_COUNT);
  this.barPositionsX = new Array(HeapSort.BAR_COUNT);
  this.legendIDs = [];
  this.codeIDs = [];
  this.sortedIndices = {};
  this.heapSize = HeapSort.BAR_COUNT;

  this.commands = [];
  this.createTitle();
  this.createInfoPanel();
  this.createLegend();
  this.createBars();
  this.createCodeDisplay();
  this.createPointers();
  this.randomizeValues(false, false);

  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.skipForward();
  this.animationManager.clearHistory();
  this.commands = [];
};

HeapSort.prototype.addControls = function () {
  this.randomizeButton = addControlToAlgorithmBar("Button", "Randomize Array");
  this.randomizeButton.onclick = this.randomizeCallback.bind(this);

  this.sortButton = addControlToAlgorithmBar("Button", "Heap Sort");
  this.sortButton.onclick = this.sortCallback.bind(this);
};

HeapSort.prototype.createTitle = function () {
  this.titleLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleLabelID,
    "Heap Sort",
    HeapSort.CANVAS_WIDTH / 2,
    HeapSort.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleLabelID, "bold 32");
  this.cmd("SetForegroundColor", this.titleLabelID, HeapSort.BORDER_COLOR);
};

HeapSort.prototype.createInfoPanel = function () {
  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    HeapSort.CANVAS_WIDTH / 2,
    HeapSort.INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, HeapSort.INFO_COLOR);
};

HeapSort.prototype.createLegend = function () {
  var startX =
    HeapSort.CANVAS_WIDTH / 2 -
    ((HeapSort.LEGEND_ITEMS.length - 1) * HeapSort.LEGEND_SPACING) / 2;

  for (var i = 0; i < HeapSort.LEGEND_ITEMS.length; i++) {
    var item = HeapSort.LEGEND_ITEMS[i];
    var boxID = this.nextIndex++;
    var labelID = this.nextIndex++;
    var x = startX + i * HeapSort.LEGEND_SPACING;

    this.cmd(
      "CreateRectangle",
      boxID,
      "",
      HeapSort.LEGEND_BOX_WIDTH,
      HeapSort.LEGEND_BOX_HEIGHT,
      x,
      HeapSort.LEGEND_Y,
      "center",
      "center"
    );
    this.cmd("SetForegroundColor", boxID, HeapSort.BORDER_COLOR);
    this.cmd("SetBackgroundColor", boxID, item.color);

    this.cmd(
      "CreateLabel",
      labelID,
      item.label,
      x,
      HeapSort.LEGEND_Y + HeapSort.LEGEND_BOX_HEIGHT / 2 + HeapSort.LEGEND_LABEL_GAP,
      1
    );
    this.cmd("SetTextStyle", labelID, "bold 16");
    this.cmd("SetForegroundColor", labelID, HeapSort.BORDER_COLOR);

    this.legendIDs.push({ box: boxID, label: labelID });
  }
};

HeapSort.prototype.createBars = function () {
  var x = HeapSort.BAR_START_X;
  for (var i = 0; i < HeapSort.BAR_COUNT; i++) {
    var rectID = this.nextIndex++;
    this.barPositionsX[i] = x;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      HeapSort.BAR_WIDTH,
      20,
      x,
      HeapSort.BAR_BASE_Y,
      "center",
      "bottom"
    );
    this.cmd("SetForegroundColor", rectID, HeapSort.BORDER_COLOR);
    this.cmd("SetBackgroundColor", rectID, HeapSort.DEFAULT_COLOR);
    this.barObjects[i] = rectID;

    var labelID = this.nextIndex++;
    this.cmd("CreateLabel", labelID, "0", x, HeapSort.BAR_LABEL_Y, 1);
    this.cmd("SetForegroundColor", labelID, HeapSort.LABEL_COLOR);
    this.cmd("SetTextStyle", labelID, "bold 16");
    this.barLabels[i] = labelID;

    x += HeapSort.BAR_SPACING;
  }
};

HeapSort.prototype.createCodeDisplay = function () {
  var columns = [HeapSort.CODE_LEFT_X, HeapSort.CODE_RIGHT_X];
  this.codeIDs = [];
  for (var sectionIndex = 0; sectionIndex < HeapSort.CODE_SECTIONS.length; sectionIndex++) {
    var section = HeapSort.CODE_SECTIONS[sectionIndex];
    var columnX = columns[Math.min(sectionIndex, columns.length - 1)];
    var lineIDs = [];
    var lineY = HeapSort.CODE_START_Y;
    for (var line = 0; line < section.lines.length; line++) {
      var labelID = this.nextIndex++;
      this.cmd(
        "CreateLabel",
        labelID,
        section.lines[line],
        columnX,
        lineY,
        0
      );
      this.cmd("SetTextStyle", labelID, HeapSort.CODE_FONT);
      this.cmd("SetForegroundColor", labelID, HeapSort.CODE_STANDARD_COLOR);
      lineIDs.push(labelID);
      lineY += HeapSort.CODE_LINE_HEIGHT;
    }
    this.codeIDs.push(lineIDs);
  }

  this.highlightedSection = -1;
  this.highlightedLine = -1;
};

HeapSort.prototype.createPointers = function () {
  this.nodePointerID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.nodePointerID,
    "node",
    this.barPositionsX[0],
    HeapSort.POINTER_Y,
    0
  );
  this.cmd("SetTextStyle", this.nodePointerID, "bold 20");
  this.cmd("SetForegroundColor", this.nodePointerID, HeapSort.POINTER_COLOR);
  this.cmd("SetBackgroundColor", this.nodePointerID, HeapSort.POINTER_BG);
  this.cmd("SetAlpha", this.nodePointerID, 0);

  this.largestPointerID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.largestPointerID,
    "largest",
    this.barPositionsX[0],
    HeapSort.POINTER_Y,
    0
  );
  this.cmd("SetTextStyle", this.largestPointerID, "bold 20");
  this.cmd("SetForegroundColor", this.largestPointerID, HeapSort.POINTER_COLOR);
  this.cmd("SetBackgroundColor", this.largestPointerID, HeapSort.POINTER_BG);
  this.cmd("SetAlpha", this.largestPointerID, 0);
};

HeapSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this), 0);
};

HeapSort.prototype.sortCallback = function () {
  this.implementAction(this.runHeapSort.bind(this), 0);
};

HeapSort.prototype.randomizeArray = function () {
  this.randomizeValues(true);
  return this.commands;
};

HeapSort.prototype.randomizeValues = function (includeStep, resetCommands) {
  if (resetCommands === undefined) {
    resetCommands = true;
  }
  if (resetCommands) {
    this.commands = [];
  }
  this.sortedIndices = {};
  this.heapSize = this.arrayData.length;
  for (var i = 0; i < this.arrayData.length; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.cmd("SetHeight", this.barObjects[i], value * HeapSort.SCALE_FACTOR);
    this.cmd("SetText", this.barLabels[i], value);
    this.cmd("SetBackgroundColor", this.barObjects[i], HeapSort.DEFAULT_COLOR);
    this.cmd("SetForegroundColor", this.barLabels[i], HeapSort.LABEL_COLOR);
    this.cmd("Move", this.barObjects[i], this.barPositionsX[i], HeapSort.BAR_BASE_Y);
    this.cmd("Move", this.barLabels[i], this.barPositionsX[i], HeapSort.BAR_LABEL_Y);
  }
  this.focusHeap(this.heapSize);
  this.clearCodeHighlights();
  this.showPointer(this.nodePointerID, false);
  this.showPointer(this.largestPointerID, false);
  this.cmd("SetText", this.infoLabelID, "Array randomized. Ready to sort!");
  if (includeStep) {
    this.cmd("Step");
  }
};

HeapSort.prototype.runHeapSort = function () {
  this.commands = [];
  this.sortedIndices = {};
  this.heapSize = this.arrayData.length;
  this.focusHeap(this.heapSize);
  this.clearCodeHighlights();
  this.showPointer(this.nodePointerID, false);
  this.showPointer(this.largestPointerID, false);

  this.highlightCode(0, 0, true);
  this.highlightCode(0, 1, true);
  this.cmd("SetText", this.infoLabelID, "Building a max heap.");
  this.highlightCode(0, 2, true);
  this.buildMaxHeap(this.heapSize);

  this.highlightCode(0, 3, true);
  for (var end = this.arrayData.length - 1; end > 0; end--) {
    this.focusHeap(end + 1);
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Swap max element at root with index " + end + "."
    );
    this.highlightCode(0, 4, true);
    this.setBarColor(0, HeapSort.CURRENT_NODE_COLOR);
    this.setBarColor(end, HeapSort.CURRENT_NODE_COLOR);
    this.swapBars(0, end);
    this.cmd("Step");
    this.markSorted(end);

    this.heapSize = end;
    this.focusHeap(this.heapSize);
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Restore heap property for heap size " + this.heapSize + "."
    );
    this.highlightCode(0, 5, true);
    if (this.heapSize > 0) {
      this.heapify(0, this.heapSize, false);
    }
    this.focusHeap(this.heapSize);
  }

  this.markSorted(0);
  this.heapSize = 0;
  this.focusHeap(0);
  this.clearCodeHighlights();
  this.showPointer(this.nodePointerID, false);
  this.showPointer(this.largestPointerID, false);
  this.cmd("SetText", this.infoLabelID, "Heap sort complete.");
  this.cmd("Step");
  return this.commands;
};

HeapSort.prototype.buildMaxHeap = function (n) {
  if (n <= 1) {
    return;
  }
  this.focusHeap(n);
  this.highlightCode(1, 0, true);
  var start = Math.floor(n / 2) - 1;
  for (var i = start; i >= 0; i--) {
    this.focusHeap(n);
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Heapify node " + i + " during build phase."
    );
    this.highlightCode(1, 1, true);
    this.heapify(i, n, true);
    this.focusHeap(n);
  }
  this.highlightCode(1, 2, true);
};

HeapSort.prototype.heapify = function (idx, heapSize, buildingPhase) {
  if (idx >= heapSize) {
    return;
  }

  this.focusHeap(heapSize);
  this.setBarColor(idx, HeapSort.CURRENT_NODE_COLOR);
  this.movePointer(this.nodePointerID, idx);
  this.movePointer(this.largestPointerID, idx);
  this.showPointer(this.nodePointerID, true);
  this.showPointer(this.largestPointerID, true);

  this.highlightCode(2, 0, true);
  var largest = idx;
  var left = 2 * idx + 1;
  var right = 2 * idx + 2;
  var leftExists = left < heapSize;
  var rightExists = right < heapSize;
  this.highlightCode(2, 1, false);
  this.highlightCode(2, 2, true);

  this.cmd(
    "SetText",
    this.infoLabelID,
    "Check children of index " + idx + " within heap size " + heapSize + "."
  );
  this.cmd("Step");

  if (leftExists) {
    this.highlightCode(2, 3, true);
    this.setBarColor(left, HeapSort.CURRENT_NODE_COLOR);
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Compare left child value " + this.arrayData[left] + " at index " + left + "."
    );
    this.cmd("Step");
    if (this.arrayData[left] > this.arrayData[largest]) {
      this.highlightCode(2, 4, true);
      largest = left;
      this.movePointer(this.largestPointerID, largest);
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Left child becomes the largest candidate."
      );
      this.cmd("Step");
    } else {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Left child is not larger than current largest."
      );
      this.cmd("Step");
      this.setBarColor(left, HeapSort.ACTIVE_HEAP_COLOR);
    }
  } else {
    this.highlightCode(2, 3, true);
    this.cmd(
      "SetText",
      this.infoLabelID,
      "No left child exists for index " + idx + "."
    );
    this.cmd("Step");
  }

  if (rightExists) {
    this.highlightCode(2, 5, true);
    this.setBarColor(right, HeapSort.CURRENT_NODE_COLOR);
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Compare right child value " + this.arrayData[right] + " at index " + right + "."
    );
    this.cmd("Step");
    if (this.arrayData[right] > this.arrayData[largest]) {
      this.highlightCode(2, 6, true);
      var previousLargest = largest;
      largest = right;
      if (leftExists && previousLargest === left) {
        this.setBarColor(left, HeapSort.ACTIVE_HEAP_COLOR);
      }
      this.movePointer(this.largestPointerID, largest);
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Right child becomes the largest candidate."
      );
      this.cmd("Step");
    } else {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Right child is not larger than current largest."
      );
      this.cmd("Step");
      if (right !== largest) {
        this.setBarColor(right, HeapSort.ACTIVE_HEAP_COLOR);
      }
    }
  } else {
    this.highlightCode(2, 5, true);
    this.cmd(
      "SetText",
      this.infoLabelID,
      "No right child exists for index " + idx + "."
    );
    this.cmd("Step");
  }

  if (leftExists && largest !== left) {
    this.setBarColor(left, HeapSort.ACTIVE_HEAP_COLOR);
  }

  this.highlightCode(2, 7, true);
  if (largest !== idx) {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Swap node " + idx + " with child " + largest + " and continue heapify."
    );
    this.highlightCode(2, 8, true);
    this.setBarColor(idx, HeapSort.CURRENT_NODE_COLOR);
    this.setBarColor(largest, HeapSort.CURRENT_NODE_COLOR);
    this.swapBars(idx, largest);
    this.cmd("Step");
    this.focusHeap(heapSize);
    this.movePointer(this.nodePointerID, largest);
    this.movePointer(this.largestPointerID, largest);
    this.highlightCode(2, 9, true);
    this.heapify(largest, heapSize, buildingPhase);
    this.focusHeap(heapSize);
    if (buildingPhase) {
      this.setBarColor(idx, HeapSort.ACTIVE_HEAP_COLOR);
    }
  } else {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Node " + idx + " already satisfies the heap property."
    );
    this.cmd("Step");
  }

  this.showPointer(this.nodePointerID, false);
  this.showPointer(this.largestPointerID, false);
};

HeapSort.prototype.swapBars = function (i, j) {
  var tempValue = this.arrayData[i];
  this.arrayData[i] = this.arrayData[j];
  this.arrayData[j] = tempValue;

  var tempBar = this.barObjects[i];
  this.barObjects[i] = this.barObjects[j];
  this.barObjects[j] = tempBar;

  var tempLabel = this.barLabels[i];
  this.barLabels[i] = this.barLabels[j];
  this.barLabels[j] = tempLabel;

  this.cmd("Move", this.barObjects[i], this.barPositionsX[i], HeapSort.BAR_BASE_Y);
  this.cmd("Move", this.barObjects[j], this.barPositionsX[j], HeapSort.BAR_BASE_Y);
  this.cmd("Move", this.barLabels[i], this.barPositionsX[i], HeapSort.BAR_LABEL_Y);
  this.cmd("Move", this.barLabels[j], this.barPositionsX[j], HeapSort.BAR_LABEL_Y);
};

HeapSort.prototype.focusHeap = function (heapSize) {
  for (var i = 0; i < this.arrayData.length; i++) {
    if (this.sortedIndices[i]) {
      this.setBarColor(i, HeapSort.SORTED_COLOR);
    } else if (i < heapSize) {
      this.setBarColor(i, HeapSort.ACTIVE_HEAP_COLOR);
    } else {
      this.setBarColor(i, HeapSort.DEFAULT_COLOR);
    }
  }
};

HeapSort.prototype.setBarColor = function (index, color) {
  if (index < 0 || index >= this.barObjects.length) {
    return;
  }
  this.cmd("SetBackgroundColor", this.barObjects[index], color);
};

HeapSort.prototype.markSorted = function (index) {
  if (index < 0 || index >= this.arrayData.length) {
    return;
  }
  this.sortedIndices[index] = true;
  this.setBarColor(index, HeapSort.SORTED_COLOR);
};

HeapSort.prototype.movePointer = function (pointerID, index) {
  if (index < 0) {
    index = 0;
  }
  if (index >= this.barPositionsX.length) {
    index = this.barPositionsX.length - 1;
  }
  this.cmd("Move", pointerID, this.barPositionsX[index], HeapSort.POINTER_Y);
};

HeapSort.prototype.showPointer = function (pointerID, visible) {
  this.cmd("SetAlpha", pointerID, visible ? 1 : 0);
};

HeapSort.prototype.highlightCode = function (section, line, stepAfter) {
  if (this.highlightedSection >= 0 && this.highlightedLine >= 0) {
    var previous = this.codeIDs[this.highlightedSection][this.highlightedLine];
    this.cmd(
      "SetForegroundColor",
      previous,
      HeapSort.CODE_STANDARD_COLOR
    );
  }

  if (section >= 0 && line >= 0 && this.codeIDs[section] && this.codeIDs[section][line]) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[section][line],
      HeapSort.CODE_HIGHLIGHT_COLOR
    );
    this.highlightedSection = section;
    this.highlightedLine = line;
  } else {
    this.highlightedSection = -1;
    this.highlightedLine = -1;
  }

  if (stepAfter) {
    this.cmd("Step");
  }
};

HeapSort.prototype.clearCodeHighlights = function () {
  for (var section = 0; section < this.codeIDs.length; section++) {
    for (var line = 0; line < this.codeIDs[section].length; line++) {
      this.cmd(
        "SetForegroundColor",
        this.codeIDs[section][line],
        HeapSort.CODE_STANDARD_COLOR
      );
    }
  }
  this.highlightedSection = -1;
  this.highlightedLine = -1;
};

HeapSort.prototype.generateRandomValue = function () {
  return (
    HeapSort.VALUE_MIN +
    Math.floor(
      Math.random() * (HeapSort.VALUE_MAX - HeapSort.VALUE_MIN + 1)
    )
  );
};

HeapSort.prototype.disableUI = function () {
  this.randomizeButton.disabled = true;
  this.sortButton.disabled = true;
};

HeapSort.prototype.enableUI = function () {
  this.randomizeButton.disabled = false;
  this.sortButton.disabled = false;
};

var currentAlg = null;

function init() {
  var animManag = initCanvas();
  if (typeof canvas !== "undefined") {
    canvas.width = HeapSort.CANVAS_WIDTH;
    canvas.height = HeapSort.CANVAS_HEIGHT;
  }
  if (animManag && animManag.animatedObjects) {
    animManag.animatedObjects.width = HeapSort.CANVAS_WIDTH;
    animManag.animatedObjects.height = HeapSort.CANVAS_HEIGHT;
  }
  currentAlg = new HeapSort(
    animManag,
    HeapSort.CANVAS_WIDTH,
    HeapSort.CANVAS_HEIGHT
  );
}
