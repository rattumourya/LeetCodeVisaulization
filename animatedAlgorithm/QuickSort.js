// Quick sort visualization tuned for the merge sort style 720x1280 canvas.
// The animation mirrors that explanatory layout with highlighted code,
// descriptive text, and pointer-driven partitioning steps.

function QuickSort(am, w, h) {
  this.init(am, w, h);
}

QuickSort.prototype = new Algorithm();
QuickSort.prototype.constructor = QuickSort;
QuickSort.superclass = Algorithm.prototype;

QuickSort.CANVAS_WIDTH = 720;
QuickSort.CANVAS_HEIGHT = 1280;

QuickSort.BAR_COUNT = 12;
QuickSort.BAR_WIDTH = 44;
QuickSort.BAR_SPACING = 54;
QuickSort.BAR_START_X =
  QuickSort.CANVAS_WIDTH / 2 -
  ((QuickSort.BAR_COUNT - 1) * QuickSort.BAR_SPACING) / 2;
QuickSort.BAR_BASE_Y = 760;
QuickSort.BAR_LABEL_OFFSET = 32;
QuickSort.BAR_LABEL_Y = QuickSort.BAR_BASE_Y + QuickSort.BAR_LABEL_OFFSET;
QuickSort.POINTER_OFFSET = 50;
QuickSort.POINTER_Y = QuickSort.BAR_LABEL_Y + QuickSort.POINTER_OFFSET;

QuickSort.TITLE_Y = 60;
QuickSort.INFO_Y = 140;
QuickSort.LEGEND_Y = QuickSort.POINTER_Y + 36;
QuickSort.LEGEND_SPACING = 150;
QuickSort.LEGEND_BOX_WIDTH = 42;
QuickSort.LEGEND_BOX_HEIGHT = 24;
QuickSort.LEGEND_LABEL_GAP = 14;


QuickSort.CODE_TITLE_Y = QuickSort.LEGEND_Y + 60;
QuickSort.CODE_START_Y = QuickSort.CODE_TITLE_Y + 26;
QuickSort.CODE_LINE_HEIGHT = 16;
QuickSort.CODE_FONT = "bold 14";
QuickSort.CODE_TITLE_FONT = "bold 18";
QuickSort.CODE_LEFT_X = 90;
QuickSort.CODE_RIGHT_X = 440;

QuickSort.VALUE_MIN = 15;
QuickSort.VALUE_MAX = 95;
QuickSort.SCALE_FACTOR = 6.0;

QuickSort.DEFAULT_COLOR = "#e1e7ef";
QuickSort.ACTIVE_RANGE_COLOR = "#ffd166";
QuickSort.PIVOT_COLOR = "#f48c06";
QuickSort.FINAL_COLOR = "#43aa8b";
QuickSort.BORDER_COLOR = "#1d3557";
QuickSort.LABEL_COLOR = "#0b2545";
QuickSort.INFO_COLOR = "#3c096c";
QuickSort.CODE_STANDARD_COLOR = "#1f3d7a";
QuickSort.CODE_HIGHLIGHT_COLOR = "#d62828";
QuickSort.POINTER_COLOR = QuickSort.PIVOT_COLOR;
QuickSort.POINTER_BG = "#ffe8cc";
QuickSort.PIVOT_LINE_COLOR = QuickSort.PIVOT_COLOR;

QuickSort.LEGEND_ITEMS = [
  { label: "Active range", color: QuickSort.ACTIVE_RANGE_COLOR },
  { label: "Pivot", color: QuickSort.PIVOT_COLOR },
  { label: "Sorted", color: QuickSort.FINAL_COLOR },
];

QuickSort.CODE_SECTIONS = [
  {
    title: "quickSort",
    lines: [
      "void quickSort(int[] arr, int low, int high) {",
      "  if (low >= high) {",
      "    return;",
      "  }",
      "  int pivotIndex = partition(arr, low, high);",
      "  quickSort(arr, low, pivotIndex - 1);",
      "  quickSort(arr, pivotIndex + 1, high);",
      "}",
    ],
  },
  {
    title: "partition",
    lines: [
      "int partition(int[] arr, int low, int high) {",
      "  int pivot = arr[low];",
      "  int i = low + 1;",
      "  int j = high;",
      "  while (i <= j) {",
      "    while (i <= j && arr[i] < pivot) {",
      "      i++;",
      "    }",
      "    while (i <= j && arr[j] > pivot) {",
      "      j--;",
      "    }",
      "    if (i <= j) {",
      "      swap(arr, i, j);",
      "      i++;",
      "      j--;",
      "    }",
      "  }",
      "  swap(arr, low, j);",
      "  return j;",
      "}",
    ],
  },
];

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
  this.legendIDs = [];
  this.codeIDs = [];
  this.sortedIndices = {};

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
  this.cmd("SetForegroundColor", this.infoLabelID, QuickSort.INFO_COLOR);
};

QuickSort.prototype.createLegend = function () {
  var startX =
    QuickSort.CANVAS_WIDTH / 2 -
    ((QuickSort.LEGEND_ITEMS.length - 1) * QuickSort.LEGEND_SPACING) / 2;

  for (var i = 0; i < QuickSort.LEGEND_ITEMS.length; i++) {
    var item = QuickSort.LEGEND_ITEMS[i];
    var boxID = this.nextIndex++;
    var labelID = this.nextIndex++;
    var x = startX + i * QuickSort.LEGEND_SPACING;

    this.cmd(
      "CreateRectangle",
      boxID,
      "",
      QuickSort.LEGEND_BOX_WIDTH,
      QuickSort.LEGEND_BOX_HEIGHT,
      x,
      QuickSort.LEGEND_Y,
      "center",
      "center"
    );
    this.cmd("SetForegroundColor", boxID, QuickSort.BORDER_COLOR);
    this.cmd("SetBackgroundColor", boxID, item.color);

    this.cmd(
      "CreateLabel",
      labelID,
      item.label,
      x,
      QuickSort.LEGEND_Y + QuickSort.LEGEND_BOX_HEIGHT / 2 + QuickSort.LEGEND_LABEL_GAP,
      1
    );
    this.cmd("SetTextStyle", labelID, "bold 16");
    this.cmd("SetForegroundColor", labelID, QuickSort.BORDER_COLOR);

    this.legendIDs.push({ box: boxID, label: labelID });
  }
};

QuickSort.prototype.createBars = function () {
  var x = QuickSort.BAR_START_X;
  for (var i = 0; i < QuickSort.BAR_COUNT; i++) {
    var rectID = this.nextIndex++;
    this.barPositionsX[i] = x;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      QuickSort.BAR_WIDTH,
      20,
      x,
      QuickSort.BAR_BASE_Y,
      "center",
      "bottom"
    );
    this.cmd("SetForegroundColor", rectID, QuickSort.BORDER_COLOR);
    this.cmd("SetBackgroundColor", rectID, QuickSort.DEFAULT_COLOR);
    this.barObjects[i] = rectID;

    var labelID = this.nextIndex++;
    this.cmd("CreateLabel", labelID, "0", x, QuickSort.BAR_LABEL_Y, 1);
    this.cmd("SetForegroundColor", labelID, QuickSort.LABEL_COLOR);
    this.cmd("SetTextStyle", labelID, "bold 16");
    this.barLabels[i] = labelID;

    x += QuickSort.BAR_SPACING;
  }
};

QuickSort.prototype.createCodeDisplay = function () {
  var columns = [QuickSort.CODE_LEFT_X, QuickSort.CODE_RIGHT_X];
  this.codeIDs = [];
  for (var sectionIndex = 0; sectionIndex < QuickSort.CODE_SECTIONS.length; sectionIndex++) {
    var section = QuickSort.CODE_SECTIONS[sectionIndex];
    var columnX = columns[sectionIndex];
    var titleID = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      titleID,
      section.title,
      columnX,
      QuickSort.CODE_TITLE_Y,
      0
    );
    this.cmd("SetTextStyle", titleID, QuickSort.CODE_TITLE_FONT);
    this.cmd("SetForegroundColor", titleID, QuickSort.CODE_STANDARD_COLOR);

    var lineIDs = [];
    var lineY = QuickSort.CODE_START_Y;
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
      this.cmd("SetTextStyle", labelID, QuickSort.CODE_FONT);
      this.cmd("SetForegroundColor", labelID, QuickSort.CODE_STANDARD_COLOR);
      lineIDs.push(labelID);
      lineY += QuickSort.CODE_LINE_HEIGHT;
    }
    this.codeIDs.push(lineIDs);
  }

  this.highlightedSection = -1;
  this.highlightedLine = -1;
};

QuickSort.prototype.createPointers = function () {
  this.iPointerID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.iPointerID,
    "i",
    this.barPositionsX[0],
    QuickSort.POINTER_Y,
    0
  );
  this.cmd("SetTextStyle", this.iPointerID, "bold 20");
  this.cmd("SetForegroundColor", this.iPointerID, QuickSort.POINTER_COLOR);
  this.cmd("SetBackgroundColor", this.iPointerID, QuickSort.POINTER_BG);
  this.cmd("SetAlpha", this.iPointerID, 0);

  this.jPointerID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.jPointerID,
    "j",
    this.barPositionsX[0],
    QuickSort.POINTER_Y,
    0
  );
  this.cmd("SetTextStyle", this.jPointerID, "bold 20");
  this.cmd("SetForegroundColor", this.jPointerID, QuickSort.POINTER_COLOR);
  this.cmd("SetBackgroundColor", this.jPointerID, QuickSort.POINTER_BG);
  this.cmd("SetAlpha", this.jPointerID, 0);
};

QuickSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this), 0);
};

QuickSort.prototype.sortCallback = function () {
  this.implementAction(this.runQuickSort.bind(this), 0);
};

QuickSort.prototype.randomizeArray = function () {
  this.randomizeValues(true);
  return this.commands;
};

QuickSort.prototype.randomizeValues = function (includeStep, resetCommands) {
  if (resetCommands === undefined) {
    resetCommands = true;
  }
  if (resetCommands) {
    this.commands = [];
  }

  this.sortedIndices = {};
  for (var i = 0; i < this.arrayData.length; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.cmd("SetHeight", this.barObjects[i], value * QuickSort.SCALE_FACTOR);
    this.cmd("SetText", this.barLabels[i], value);
    this.cmd("SetBackgroundColor", this.barObjects[i], QuickSort.DEFAULT_COLOR);
    this.cmd("SetForegroundColor", this.barLabels[i], QuickSort.LABEL_COLOR);
    this.cmd("Move", this.barObjects[i], this.barPositionsX[i], QuickSort.BAR_BASE_Y);
    this.cmd("Move", this.barLabels[i], this.barPositionsX[i], QuickSort.BAR_LABEL_Y);
  }
  this.clearCodeHighlights();
  this.showPointer(this.iPointerID, false);
  this.showPointer(this.jPointerID, false);
  this.cmd("SetText", this.infoLabelID, "Array randomized. Ready to sort!");
  if (includeStep) {
    this.cmd("Step");
  }
};

QuickSort.prototype.runQuickSort = function () {
  this.commands = [];
  this.sortedIndices = {};
  this.resetBarColors();
  this.clearCodeHighlights();
  this.showPointer(this.iPointerID, false);
  this.showPointer(this.jPointerID, false);
  this.cmd("SetText", this.infoLabelID, "Starting quick sort...");
  this.cmd("Step");

  this.quickSortRecursive(0, this.arrayData.length - 1);

  this.clearCodeHighlights();
  this.showPointer(this.iPointerID, false);
  this.showPointer(this.jPointerID, false);
  this.cmd("SetText", this.infoLabelID, "Quick sort complete.");
  this.cmd("Step");
  return this.commands;
};

QuickSort.prototype.quickSortRecursive = function (low, high) {
  if (low > high) {
    return;
  }

  this.focusRange(low, high);
  this.highlightCode(0, 1, true);
  if (low >= high) {
    if (low === high && !this.sortedIndices[low]) {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Single element at index " + low + " is already sorted."
      );
      this.markSorted(low);
      this.cmd("Step");
    }
    this.restoreRange();
    return;
  }

  this.highlightCode(0, 4, true);
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Partitioning range [" + low + ", " + high + "]"
  );
  this.cmd("Step");
  var pivotIndex = this.partition(low, high);

  this.highlightCode(0, 5, true);
  if (pivotIndex - 1 >= low) {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Recurse on left partition [" + low + ", " + (pivotIndex - 1) + "]"
    );
    this.cmd("Step");
    this.quickSortRecursive(low, pivotIndex - 1);
  } else {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Left side already sorted."
    );
    this.cmd("Step");
  }

  this.highlightCode(0, 6, true);
  if (pivotIndex + 1 <= high) {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Recurse on right partition [" + (pivotIndex + 1) + ", " + high + "]"
    );
    this.cmd("Step");
    this.quickSortRecursive(pivotIndex + 1, high);
  } else {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Right side already sorted."
    );
    this.cmd("Step");
  }

  this.restoreRange();
};

QuickSort.prototype.partition = function (low, high) {
  this.focusRange(low, high);
  this.highlightCode(1, 0, true);
  var pivotValue = this.arrayData[low];
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Pivot selected at index " + low + " with value " + pivotValue
  );
  this.setBarColor(low, QuickSort.PIVOT_COLOR);
  var pivotLineID = this.nextIndex++;
  var pivotLineWidth = (QuickSort.BAR_COUNT + 1) * QuickSort.BAR_SPACING;
  var pivotLineX = QuickSort.BAR_START_X - QuickSort.BAR_SPACING / 2;
  var pivotLineY =
    QuickSort.BAR_BASE_Y - pivotValue * QuickSort.SCALE_FACTOR;
  this.cmd(
    "CreateRectangle",
    pivotLineID,
    "",
    pivotLineWidth,
    0,
    pivotLineX,
    pivotLineY,
    "left",
    "bottom"
  );
  this.cmd("SetForegroundColor", pivotLineID, QuickSort.PIVOT_LINE_COLOR);
  this.cmd("Step");

  this.highlightCode(1, 1, false);
  this.highlightCode(1, 2, true);
  var i = low + 1;
  this.movePointer(this.iPointerID, Math.min(i, high));
  this.showPointer(this.iPointerID, true);
  this.cmd("Step");

  this.highlightCode(1, 3, true);
  var j = high;
  this.movePointer(this.jPointerID, j);
  this.showPointer(this.jPointerID, true);
  this.cmd("Step");

  this.highlightCode(1, 4, true);
  while (i <= j) {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Scanning indices i=" + i + " and j=" + j + " against pivot " + pivotValue
    );
    this.cmd("Step");

    this.highlightCode(1, 5, true);
    while (i <= j && this.arrayData[i] < pivotValue) {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Value " + this.arrayData[i] + " at i is less than pivot. Move i right."
      );
      this.setBarColor(i, QuickSort.ACTIVE_RANGE_COLOR);
      i++;
      this.highlightCode(1, 6, true);
      this.movePointer(this.iPointerID, Math.min(i, high));
      this.cmd("Step");
      this.highlightCode(1, 5, true);
    }

    this.highlightCode(1, 8, true);
    while (i <= j && this.arrayData[j] > pivotValue) {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Value " + this.arrayData[j] + " at j is greater than pivot. Move j left."
      );
      this.setBarColor(j, QuickSort.ACTIVE_RANGE_COLOR);
      j--;
      this.highlightCode(1, 9, true);
      this.movePointer(this.jPointerID, Math.max(j, low));
      this.cmd("Step");
      this.highlightCode(1, 8, true);
    }

    if (i <= j) {
      this.highlightCode(1, 11, true);
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Swap values at i=" + i + " and j=" + j + "."
      );

      this.cmd("Step");
      if (i !== j) {
        this.swapBars(i, j);
        this.cmd("Step");
      }
      this.setBarColor(i, QuickSort.ACTIVE_RANGE_COLOR);
      this.setBarColor(j, QuickSort.ACTIVE_RANGE_COLOR);
      i++;
      j--;
      this.highlightCode(1, 13, true);
      this.movePointer(this.iPointerID, Math.min(i, high));
      this.highlightCode(1, 14, true);
      this.movePointer(this.jPointerID, Math.max(j, low));
      this.cmd("Step");
    } else {
      if (i >= 0 && i <= high) {
        this.setBarColor(i, QuickSort.ACTIVE_RANGE_COLOR);
      }
      if (j >= low && j < this.barObjects.length) {
        this.setBarColor(j, QuickSort.ACTIVE_RANGE_COLOR);
      }
    }

    this.highlightCode(1, 4, true);
  }

  this.highlightCode(1, 17, true);
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Place pivot into final index " + j + "."
  );
  this.setBarColor(low, QuickSort.PIVOT_COLOR);
  this.setBarColor(j, QuickSort.ACTIVE_RANGE_COLOR);
  this.cmd("Step");
  if (low !== j) {
    this.swapBars(low, j);
    this.cmd("Step");
  }

  this.setBarColor(low, QuickSort.ACTIVE_RANGE_COLOR);
  this.markSorted(j);
  this.cmd("Step");

  this.highlightCode(1, 18, false);
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Partition complete. Returning pivot index " + j + "."
  );
  this.cmd("Step");

  this.showPointer(this.iPointerID, false);
  this.showPointer(this.jPointerID, false);
  this.cmd("Delete", pivotLineID);
  this.restoreRange();
  return j;
};

QuickSort.prototype.swapBars = function (i, j) {
  var tempValue = this.arrayData[i];
  this.arrayData[i] = this.arrayData[j];
  this.arrayData[j] = tempValue;

  var tempBar = this.barObjects[i];
  this.barObjects[i] = this.barObjects[j];
  this.barObjects[j] = tempBar;

  var tempLabel = this.barLabels[i];
  this.barLabels[i] = this.barLabels[j];
  this.barLabels[j] = tempLabel;

  this.cmd("Move", this.barObjects[i], this.barPositionsX[i], QuickSort.BAR_BASE_Y);
  this.cmd("Move", this.barObjects[j], this.barPositionsX[j], QuickSort.BAR_BASE_Y);
  this.cmd("Move", this.barLabels[i], this.barPositionsX[i], QuickSort.BAR_LABEL_Y);
  this.cmd("Move", this.barLabels[j], this.barPositionsX[j], QuickSort.BAR_LABEL_Y);
};

QuickSort.prototype.focusRange = function (low, high) {
  this.resetBarColors();
  if (low > high) {
    return;
  }
  for (var i = low; i <= high; i++) {
    if (!this.sortedIndices[i]) {
      this.setBarColor(i, QuickSort.ACTIVE_RANGE_COLOR);
    }
  }
};

QuickSort.prototype.restoreRange = function () {
  this.resetBarColors();
};

QuickSort.prototype.resetBarColors = function () {
  for (var i = 0; i < this.arrayData.length; i++) {
    if (this.sortedIndices[i]) {
      this.setBarColor(i, QuickSort.FINAL_COLOR);
    } else {
      this.setBarColor(i, QuickSort.DEFAULT_COLOR);
    }
  }
};

QuickSort.prototype.setBarColor = function (index, color) {
  if (index < 0 || index >= this.barObjects.length) {
    return;
  }
  this.cmd("SetBackgroundColor", this.barObjects[index], color);
};

QuickSort.prototype.markSorted = function (index) {
  if (index < 0 || index >= this.arrayData.length) {
    return;
  }
  this.sortedIndices[index] = true;
  this.setBarColor(index, QuickSort.FINAL_COLOR);
};

QuickSort.prototype.movePointer = function (pointerID, index) {
  if (index < 0) {
    index = 0;
  }
  if (index >= this.barPositionsX.length) {
    index = this.barPositionsX.length - 1;
  }
  this.cmd("Move", pointerID, this.barPositionsX[index], QuickSort.POINTER_Y);
};

QuickSort.prototype.showPointer = function (pointerID, visible) {
  this.cmd("SetAlpha", pointerID, visible ? 1 : 0);
};

QuickSort.prototype.highlightCode = function (section, line, stepAfter) {
  if (this.highlightedSection >= 0 && this.highlightedLine >= 0) {
    var previous = this.codeIDs[this.highlightedSection][this.highlightedLine];
    this.cmd(
      "SetForegroundColor",
      previous,
      QuickSort.CODE_STANDARD_COLOR
    );
  }

  if (section >= 0 && line >= 0 && this.codeIDs[section] && this.codeIDs[section][line]) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[section][line],
      QuickSort.CODE_HIGHLIGHT_COLOR
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

QuickSort.prototype.clearCodeHighlights = function () {
  for (var section = 0; section < this.codeIDs.length; section++) {
    for (var line = 0; line < this.codeIDs[section].length; line++) {
      this.cmd(
        "SetForegroundColor",
        this.codeIDs[section][line],
        QuickSort.CODE_STANDARD_COLOR
      );
    }
  }
  this.highlightedSection = -1;
  this.highlightedLine = -1;
};

QuickSort.prototype.generateRandomValue = function () {
  return (
    QuickSort.VALUE_MIN +
    Math.floor(
      Math.random() * (QuickSort.VALUE_MAX - QuickSort.VALUE_MIN + 1)
    )
  );
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
