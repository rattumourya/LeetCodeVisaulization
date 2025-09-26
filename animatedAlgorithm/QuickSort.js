// Quick sort animation that mirrors the modern 720x1080 layout used by the
// custom Merge Sort demo. The visualization highlights the pivot driven
// partitioning process with code annotations, info text, and color cues that
// match the existing style of the repository.

function QuickSort(am, w, h) {
  this.init(am, w, h);
}

QuickSort.prototype = new Algorithm();
QuickSort.prototype.constructor = QuickSort;
QuickSort.superclass = Algorithm.prototype;

QuickSort.CANVAS_WIDTH = 720;
QuickSort.CANVAS_HEIGHT = 1080;

QuickSort.BAR_COUNT = 12;
QuickSort.BAR_WIDTH = 24;
QuickSort.BAR_SPACING = 48;
QuickSort.BAR_START_X = 96;
QuickSort.BAR_BASE_Y = 600;
QuickSort.BAR_LABEL_OFFSET = 26;
QuickSort.BAR_LABEL_Y = QuickSort.BAR_BASE_Y + QuickSort.BAR_LABEL_OFFSET;

QuickSort.VALUE_MIN = 15;
QuickSort.VALUE_MAX = 90;
QuickSort.SCALE_FACTOR = 3;

QuickSort.TITLE_Y = 60;
QuickSort.INFO_Y = 140;
QuickSort.LEGEND_Y = QuickSort.BAR_LABEL_Y + 36;
QuickSort.LEGEND_SPACING = 120;
QuickSort.LEGEND_BOX_WIDTH = 42;
QuickSort.LEGEND_BOX_HEIGHT = 24;
QuickSort.LEGEND_LABEL_GAP = 10;

QuickSort.CODE_START_Y = QuickSort.LEGEND_Y + 70;
QuickSort.CODE_LINE_HEIGHT = 15;
QuickSort.CODE_STANDARD_COLOR = "#1f3d7a";
QuickSort.CODE_HIGHLIGHT_COLOR = "#d62828";
QuickSort.CODE_FONT = "bold 14";
QuickSort.CODE_LEFT_X = 60;
QuickSort.CODE_RIGHT_X = 360;

QuickSort.DEFAULT_COLOR = "#8fb8ff";
QuickSort.ACTIVE_RANGE_COLOR = "#ffd166";
QuickSort.PIVOT_COLOR = "#ffadad";
QuickSort.COMPARE_COLOR = "#ffb703";
QuickSort.SWAP_COLOR = "#9bf6ff";
QuickSort.FINAL_COLOR = "#8ac926";
QuickSort.BORDER_COLOR = "#1d3557";
QuickSort.LABEL_COLOR = "#0b2545";
QuickSort.ACTIVE_TEXT_COLOR = "#3a0f0f";

QuickSort.CODE_SECTIONS = [
  [
    "void quickSort(int[] arr, int low, int high) {",
    "  if (low >= high) {",
    "    return;",
    "  }",
    "  int pivotIndex = partition(arr, low, high);",
    "  quickSort(arr, low, pivotIndex - 1);",
    "  quickSort(arr, pivotIndex + 1, high);",
    "}",
  ],
  [
    "int partition(int[] arr, int low, int high) {",
    "  int pivot = arr[high];",
    "  int i = low - 1;",
    "  for (int j = low; j < high; j++) {",
    "    if (arr[j] <= pivot) {",
    "      i++;",
    "      swap(arr, i, j);",
    "    }",
    "  }",
    "  swap(arr, i + 1, high);",
    "  return i + 1;",
    "}",
  ],
];

QuickSort.CODE_MAP = {
  QUICK_DECL: 0,
  BASE_IF: 1,
  BASE_RETURN: 2,
  PARTITION_CALL: 4,
  RECURSE_LEFT: 5,
  RECURSE_RIGHT: 6,
  PARTITION_DECL: 8,
  PIVOT_LINE: 9,
  I_INIT: 10,
  LOOP_LINE: 11,
  IF_CHECK: 12,
  INCREMENT_I: 13,
  SWAP_INNER: 14,
  FINAL_SWAP: 17,
  RETURN_PIVOT: 18,
};

QuickSort.prototype.init = function (am, w, h) {
  QuickSort.superclass.init.call(this, am, w, h);

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

  this.arrayData = new Array(QuickSort.BAR_COUNT);
  this.barObjects = new Array(QuickSort.BAR_COUNT);
  this.barLabels = new Array(QuickSort.BAR_COUNT);
  this.barPositionsX = new Array(QuickSort.BAR_COUNT);
  this.sorted = new Array(QuickSort.BAR_COUNT);
  this.legendIDs = [];
  this.codeID = [];
  this.highlightedLine = -1;

  this.commands = [];
  this.createTitle();
  this.createInfoPanel();
  this.createLegend();
  this.createBars();
  this.createCodeDisplay();

  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.skipForward();
  this.animationManager.clearHistory();
  this.commands = [];
};

QuickSort.prototype.addControls = function () {
  this.randomizeButton = addControlToAlgorithmBar("Button", "Randomize Array");
  this.randomizeButton.onclick = this.randomizeCallback.bind(this);

  this.sortButton = addControlToAlgorithmBar("Button", "Quick Sort");
  this.sortButton.onclick = this.sortCallback.bind(this);
};

QuickSort.prototype.createTitle = function () {
  this.titleLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleLabelID,
    "Quick Sort",
    QuickSort.CANVAS_WIDTH / 2,
    QuickSort.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleLabelID, "bold 32");
  this.cmd("SetForegroundColor", this.titleLabelID, QuickSort.BORDER_COLOR);
};

QuickSort.prototype.createInfoPanel = function () {
  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    QuickSort.CANVAS_WIDTH / 2,
    QuickSort.INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, "#3c096c");
};

QuickSort.prototype.createLegend = function () {
  var entries = [
    { label: "Unsorted", color: QuickSort.DEFAULT_COLOR },
    { label: "Active range", color: QuickSort.ACTIVE_RANGE_COLOR },
    { label: "Pivot", color: QuickSort.PIVOT_COLOR },
    { label: "Comparing", color: QuickSort.COMPARE_COLOR },
    { label: "Swapped", color: QuickSort.SWAP_COLOR },
    { label: "Sorted", color: QuickSort.FINAL_COLOR },
  ];

  var centerX = QuickSort.CANVAS_WIDTH / 2;
  for (var i = 0; i < entries.length; i++) {
    var offset = (i - (entries.length - 1) / 2) * QuickSort.LEGEND_SPACING;
    var groupCenter = centerX + offset;
    var boxID = this.nextIndex++;
    var labelID = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      boxID,
      "",
      QuickSort.LEGEND_BOX_WIDTH,
      QuickSort.LEGEND_BOX_HEIGHT,
      groupCenter,
      QuickSort.LEGEND_Y,
      "center",
      "center"
    );
    this.cmd("SetBackgroundColor", boxID, entries[i].color);
    this.cmd("SetForegroundColor", boxID, QuickSort.BORDER_COLOR);
    this.cmd(
      "CreateLabel",
      labelID,
      entries[i].label,
      groupCenter,
      QuickSort.LEGEND_Y +
        QuickSort.LEGEND_BOX_HEIGHT / 2 +
        QuickSort.LEGEND_LABEL_GAP,
      1
    );
    this.cmd("SetTextStyle", labelID, "bold 18");
    this.cmd("SetForegroundColor", labelID, QuickSort.BORDER_COLOR);
    this.legendIDs.push({ box: boxID, label: labelID });
  }
};

QuickSort.prototype.createBars = function () {
  for (var i = 0; i < QuickSort.BAR_COUNT; i++) {
    var xPos = QuickSort.BAR_START_X + i * QuickSort.BAR_SPACING;
    this.barPositionsX[i] = xPos;
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.sorted[i] = false;

    var rectID = this.nextIndex++;
    var labelID = this.nextIndex++;
    this.barObjects[i] = rectID;
    this.barLabels[i] = labelID;

    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      QuickSort.BAR_WIDTH,
      value * QuickSort.SCALE_FACTOR,
      xPos,
      QuickSort.BAR_BASE_Y,
      "center",
      "bottom"
    );
    this.cmd("SetForegroundColor", rectID, QuickSort.BORDER_COLOR);
    this.cmd("SetBackgroundColor", rectID, QuickSort.DEFAULT_COLOR);

    this.cmd("CreateLabel", labelID, value, xPos, QuickSort.BAR_LABEL_Y, 1);
    this.cmd("SetForegroundColor", labelID, QuickSort.LABEL_COLOR);
    this.cmd("SetTextStyle", labelID, "bold 16");
  }
};

QuickSort.prototype.createCodeDisplay = function () {
  this.codeID = [];
  var columns = [QuickSort.CODE_LEFT_X, QuickSort.CODE_RIGHT_X];
  for (var col = 0; col < QuickSort.CODE_SECTIONS.length; col++) {
    var section = QuickSort.CODE_SECTIONS[col];
    var lineY = QuickSort.CODE_START_Y;
    for (var line = 0; line < section.length; line++) {
      var lineEntry = section[line];
      var segments = Array.isArray(lineEntry) ? lineEntry : [lineEntry];
      var labelGroup = [];
      for (var seg = 0; seg < segments.length; seg++) {
        var labelID = this.nextIndex++;
        this.cmd("CreateLabel", labelID, segments[seg], columns[col], lineY, 0);
        this.cmd("SetTextStyle", labelID, QuickSort.CODE_FONT);
        this.cmd("SetForegroundColor", labelID, QuickSort.CODE_STANDARD_COLOR);
        labelGroup.push(labelID);
        lineY += QuickSort.CODE_LINE_HEIGHT;
      }
      this.codeID.push(labelGroup);
    }
  }
};

QuickSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this), 0);
};

QuickSort.prototype.sortCallback = function () {
  this.implementAction(this.runQuickSort.bind(this), 0);
};

QuickSort.prototype.randomizeArray = function () {
  this.commands = [];
  for (var i = 0; i < this.arrayData.length; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.sorted[i] = false;
    this.cmd("SetHeight", this.barObjects[i], value * QuickSort.SCALE_FACTOR);
    this.cmd("SetText", this.barLabels[i], value);
    this.setBarColor(i, QuickSort.DEFAULT_COLOR, QuickSort.LABEL_COLOR);
    this.cmd("Move", this.barObjects[i], this.barPositionsX[i], QuickSort.BAR_BASE_Y);
    this.cmd("Move", this.barLabels[i], this.barPositionsX[i], QuickSort.BAR_LABEL_Y);
  }
  this.clearCodeHighlights();
  this.cmd("SetText", this.infoLabelID, "Array randomized. Ready to sort!");
  this.cmd("Step");
  return this.commands;
};

QuickSort.prototype.runQuickSort = function () {
  this.commands = [];
  this.clearCodeHighlights();
  this.cmd("SetText", this.infoLabelID, "Starting quick sort...");
  this.cmd("Step");
  this.quickSortRecursive(0, this.arrayData.length - 1, 0);
  this.highlightCodeLine(-1, false);
  this.cmd("SetText", this.infoLabelID, "Quick sort complete.");
  this.cmd("Step");
  return this.commands;
};

QuickSort.prototype.quickSortRecursive = function (low, high, depth) {
  if (low > high) {
    return;
  }

  this.highlightCodeLine(QuickSort.CODE_MAP.QUICK_DECL, false);
  this.colorRange(low, high, QuickSort.ACTIVE_RANGE_COLOR, false);
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Sorting range [" + low + ", " + high + "]"
  );
  this.cmd("Step");

  this.highlightCodeLine(QuickSort.CODE_MAP.BASE_IF, true);
  if (low >= high) {
    if (low === high && !this.sorted[low]) {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Single element at index " + low + " is already in place."
      );
      this.markSorted(low, true);
    } else {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Empty range encountered."
      );
      this.cmd("Step");
    }
    this.highlightCodeLine(QuickSort.CODE_MAP.BASE_RETURN, true);
    return;
  }

  this.highlightCodeLine(QuickSort.CODE_MAP.PARTITION_CALL, true);
  var pivotIndex = this.partition(low, high);

  this.highlightCodeLine(QuickSort.CODE_MAP.RECURSE_LEFT, true);
  this.quickSortRecursive(low, pivotIndex - 1, depth + 1);

  this.highlightCodeLine(QuickSort.CODE_MAP.RECURSE_RIGHT, true);
  this.quickSortRecursive(pivotIndex + 1, high, depth + 1);

  this.colorRange(low, high, QuickSort.FINAL_COLOR, true, true);
};

QuickSort.prototype.partition = function (low, high) {
  this.highlightCodeLine(QuickSort.CODE_MAP.PARTITION_DECL, true);
  this.highlightCodeLine(QuickSort.CODE_MAP.PIVOT_LINE, true);
  var pivotValue = this.arrayData[high];
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Choosing pivot " + pivotValue + " at index " + high + "."
  );
  this.highlightPivot(high);

  this.highlightCodeLine(QuickSort.CODE_MAP.I_INIT, true);
  var i = low - 1;

  this.highlightCodeLine(QuickSort.CODE_MAP.LOOP_LINE, true);
  for (var j = low; j < high; j++) {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Scanning index " + j + " against pivot " + pivotValue + "."
    );
    this.highlightComparisonIndex(j);

    this.highlightCodeLine(QuickSort.CODE_MAP.IF_CHECK, true);
    if (this.arrayData[j] <= pivotValue) {
      this.cmd(
        "SetText",
        this.infoLabelID,
        this.arrayData[j] + " <= " + pivotValue + ", expand left partition."
      );
      this.highlightCodeLine(QuickSort.CODE_MAP.INCREMENT_I, true);
      i++;
      this.highlightCodeLine(QuickSort.CODE_MAP.SWAP_INNER, true);
      if (i !== j) {
        this.highlightSwap(i, j);
        this.swapBars(i, j);
        this.resetPostSwap(i, j);
      } else {
        this.setBarColor(i, QuickSort.SWAP_COLOR, QuickSort.LABEL_COLOR);
        this.cmd("Step");
        this.setBarColor(i, QuickSort.ACTIVE_RANGE_COLOR, QuickSort.LABEL_COLOR);
      }
    } else {
      this.cmd(
        "SetText",
        this.infoLabelID,
        this.arrayData[j] + " > " + pivotValue + ", stay in right partition."
      );
      this.cmd("Step");
    }
    this.resetComparisonIndex(j);
  }

  this.highlightCodeLine(QuickSort.CODE_MAP.FINAL_SWAP, true);
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Place pivot in between partitions at index " + (i + 1) + "."
  );
  this.highlightSwap(i + 1, high);
  this.swapBars(i + 1, high);
  this.resetPostSwap(i + 1, high, true);
  this.markSorted(i + 1, true);

  this.highlightCodeLine(QuickSort.CODE_MAP.RETURN_PIVOT, true);
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Pivot settled at position " + (i + 1) + "."
  );
  this.cmd("Step");
  return i + 1;
};

QuickSort.prototype.swapBars = function (i, j) {
  if (i === j) {
    return;
  }
  var tempObj = this.barObjects[i];
  var tempLabel = this.barLabels[i];
  var tempVal = this.arrayData[i];
  var tempSorted = this.sorted[i];

  this.cmd("Move", this.barObjects[i], this.barPositionsX[j], QuickSort.BAR_BASE_Y);
  this.cmd("Move", this.barObjects[j], this.barPositionsX[i], QuickSort.BAR_BASE_Y);
  this.cmd("Move", this.barLabels[i], this.barPositionsX[j], QuickSort.BAR_LABEL_Y);
  this.cmd("Move", this.barLabels[j], this.barPositionsX[i], QuickSort.BAR_LABEL_Y);
  this.cmd("Step");

  this.barObjects[i] = this.barObjects[j];
  this.barObjects[j] = tempObj;

  this.barLabels[i] = this.barLabels[j];
  this.barLabels[j] = tempLabel;

  this.arrayData[i] = this.arrayData[j];
  this.arrayData[j] = tempVal;

  this.sorted[i] = this.sorted[j];
  this.sorted[j] = tempSorted;

  this.cmd("SetText", this.barLabels[i], this.arrayData[i]);
  this.cmd("SetText", this.barLabels[j], this.arrayData[j]);
};

QuickSort.prototype.highlightPivot = function (index) {
  this.setBarColor(index, QuickSort.PIVOT_COLOR, QuickSort.ACTIVE_TEXT_COLOR);
  this.cmd("Step");
};

QuickSort.prototype.highlightComparisonIndex = function (index) {
  this.setBarColor(index, QuickSort.COMPARE_COLOR, QuickSort.ACTIVE_TEXT_COLOR);
  this.cmd("Step");
};

QuickSort.prototype.resetComparisonIndex = function (index) {
  if (this.sorted[index]) {
    this.setBarColor(index, QuickSort.FINAL_COLOR, QuickSort.LABEL_COLOR);
  } else {
    this.setBarColor(index, QuickSort.ACTIVE_RANGE_COLOR, QuickSort.LABEL_COLOR);
  }
};

QuickSort.prototype.highlightSwap = function (i, j) {
  this.setBarColor(i, QuickSort.SWAP_COLOR, QuickSort.LABEL_COLOR);
  this.setBarColor(j, QuickSort.SWAP_COLOR, QuickSort.LABEL_COLOR);
  this.cmd("Step");
};

QuickSort.prototype.resetPostSwap = function (i, j, pivotPlaced) {
  if (!pivotPlaced) {
    this.setBarColor(i, QuickSort.ACTIVE_RANGE_COLOR, QuickSort.LABEL_COLOR);
  }
  if (!this.sorted[j]) {
    this.setBarColor(j, QuickSort.ACTIVE_RANGE_COLOR, QuickSort.LABEL_COLOR);
  }
  this.cmd("Step");
};

QuickSort.prototype.markSorted = function (index, stepAfter) {
  this.sorted[index] = true;
  this.setBarColor(index, QuickSort.FINAL_COLOR, QuickSort.LABEL_COLOR);
  if (stepAfter) {
    this.cmd("Step");
  }
};

QuickSort.prototype.colorRange = function (
  left,
  right,
  color,
  stepAfter,
  overrideSorted
) {
  left = Math.max(0, left);
  right = Math.min(this.arrayData.length - 1, right);
  if (left > right) {
    return;
  }
  for (var i = left; i <= right; i++) {
    if (!this.sorted[i] || overrideSorted) {
      this.setBarColor(i, color, QuickSort.LABEL_COLOR);
    }
  }
  if (stepAfter) {
    this.cmd("Step");
  }
};

QuickSort.prototype.setBarColor = function (index, color, textColor) {
  if (index < 0 || index >= this.barObjects.length) {
    return;
  }
  this.cmd("SetBackgroundColor", this.barObjects[index], color);
  this.cmd("SetForegroundColor", this.barLabels[index], textColor);
};

QuickSort.prototype.highlightCodeLine = function (line, stepAfter) {
  if (this.highlightedLine >= 0 && this.codeID[this.highlightedLine]) {
    for (var i = 0; i < this.codeID[this.highlightedLine].length; i++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[this.highlightedLine][i],
        QuickSort.CODE_STANDARD_COLOR
      );
    }
  }
  if (line >= 0 && this.codeID[line]) {
    for (var j = 0; j < this.codeID[line].length; j++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[line][j],
        QuickSort.CODE_HIGHLIGHT_COLOR
      );
    }
  }
  this.highlightedLine = line;
  if (stepAfter) {
    this.cmd("Step");
  }
};

QuickSort.prototype.clearCodeHighlights = function () {
  for (var i = 0; i < this.codeID.length; i++) {
    if (this.codeID[i]) {
      for (var j = 0; j < this.codeID[i].length; j++) {
        this.cmd(
          "SetForegroundColor",
          this.codeID[i][j],
          QuickSort.CODE_STANDARD_COLOR
        );
      }
    }
  }
  this.highlightedLine = -1;
};

QuickSort.prototype.generateRandomValue = function () {
  return (
    QuickSort.VALUE_MIN +
    Math.floor(Math.random() * (QuickSort.VALUE_MAX - QuickSort.VALUE_MIN + 1))
  );
};

QuickSort.prototype.reset = function () {
  return this.randomizeArray();
};

QuickSort.prototype.disableUI = function () {
  this.randomizeButton.disabled = true;
  this.sortButton.disabled = true;
};

QuickSort.prototype.enableUI = function () {
  this.randomizeButton.disabled = false;
  this.sortButton.disabled = false;
};

var currentAlg = null;

function init() {
  var animManag = initCanvas();
  if (typeof canvas !== "undefined") {
    canvas.width = QuickSort.CANVAS_WIDTH;
    canvas.height = QuickSort.CANVAS_HEIGHT;
  }
  if (animManag && animManag.animatedObjects) {
    animManag.animatedObjects.width = QuickSort.CANVAS_WIDTH;
    animManag.animatedObjects.height = QuickSort.CANVAS_HEIGHT;
  }
  currentAlg = new QuickSort(
    animManag,
    QuickSort.CANVAS_WIDTH,
    QuickSort.CANVAS_HEIGHT
  );
}
