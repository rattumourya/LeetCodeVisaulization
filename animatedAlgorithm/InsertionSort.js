// Insertion sort animation customized for the 720x1080 layout.
// The implementation mirrors the structure used by the existing
// Bubble Sort demo but adjusts the geometry so that the bars occupy
// the middle of the screen and the code panel is anchored to the
// bottom portion of the canvas.

function InsertionSort(am, w, h) {
  this.init(am, w, h);
}

InsertionSort.prototype = new Algorithm();
InsertionSort.prototype.constructor = InsertionSort;
InsertionSort.superclass = Algorithm.prototype;

InsertionSort.CANVAS_WIDTH = 720;
InsertionSort.CANVAS_HEIGHT = 1080;

InsertionSort.BAR_COUNT = 12;
InsertionSort.BAR_WIDTH = 42;
InsertionSort.BAR_SPACING = 52;
InsertionSort.BAR_START_X = 80;
InsertionSort.BAR_BASE_Y = 640;
InsertionSort.BAR_LABEL_OFFSET = 32;
InsertionSort.BAR_LABEL_Y = InsertionSort.BAR_BASE_Y + InsertionSort.BAR_LABEL_OFFSET;
InsertionSort.LEGEND_OFFSET = 56;
InsertionSort.VALUE_MIN = 20;
InsertionSort.VALUE_MAX = 100;
InsertionSort.SCALE_FACTOR = 4;
InsertionSort.KEY_LIFT = 160;

InsertionSort.TITLE_Y = 60;
InsertionSort.INFO_Y = 200;
InsertionSort.LEGEND_Y = InsertionSort.BAR_LABEL_Y + InsertionSort.LEGEND_OFFSET;
InsertionSort.LEGEND_SPACING = 160;
InsertionSort.LEGEND_BOX_WIDTH = 42;
InsertionSort.LEGEND_BOX_HEIGHT = 24;
InsertionSort.LEGEND_LABEL_GAP = 12;

InsertionSort.CODE_START_X = 100;
InsertionSort.CODE_START_Y = 760;
InsertionSort.CODE_LINE_HEIGHT = 34;
InsertionSort.CODE_STANDARD_COLOR = "#1f3d7a";
InsertionSort.CODE_HIGHLIGHT_COLOR = "#d62828";
InsertionSort.CODE_FONT = "bold 20";

InsertionSort.DEFAULT_COLOR = "#8fb8ff";
InsertionSort.ACTIVE_COLOR = "#ffb703";
InsertionSort.KEY_COLOR = "#fb8500";
InsertionSort.SORTED_COLOR = "#8ac926";
InsertionSort.BORDER_COLOR = "#1d3557";
InsertionSort.LABEL_COLOR = "#0b2545";
InsertionSort.ACTIVE_TEXT_COLOR = "#9c2a2a";
InsertionSort.KEY_TEXT_COLOR = "#3a0f0f";

InsertionSort.prototype.getCodeDefinition = function () {
  return [
    ["for (int i = 1; i < n; i++) {"],
    ["    int key = a[i];"],
    ["    int j = i - 1;"],
    ["    while (j >= 0 && a[j] > key) {"],
    ["        a[j + 1] = a[j];"],
    ["        j--;"],
    ["    }"],
    ["    a[j + 1] = key;"],
    ["}"],
  ];
};

InsertionSort.prototype.init = function (am, w, h) {
  InsertionSort.superclass.init.call(this, am, w, h);

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

  this.arrayData = new Array(InsertionSort.BAR_COUNT);
  this.barObjects = new Array(InsertionSort.BAR_COUNT);
  this.barLabels = new Array(InsertionSort.BAR_COUNT);
  this.barPositionsX = new Array(InsertionSort.BAR_COUNT);
  this.sorted = new Array(InsertionSort.BAR_COUNT);
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

InsertionSort.prototype.addControls = function () {
  this.randomizeButton = addControlToAlgorithmBar(
    "Button",
    "Randomize Array"
  );
  this.randomizeButton.onclick = this.randomizeCallback.bind(this);

  this.sortButton = addControlToAlgorithmBar("Button", "Insertion Sort");
  this.sortButton.onclick = this.sortCallback.bind(this);
};

InsertionSort.prototype.createTitle = function () {
  this.titleLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleLabelID,
    "Insertion Sort",
    InsertionSort.CANVAS_WIDTH / 2,
    InsertionSort.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleLabelID, "bold 32");
  this.cmd("SetForegroundColor", this.titleLabelID, InsertionSort.BORDER_COLOR);
};

InsertionSort.prototype.createInfoPanel = function () {
  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    InsertionSort.CANVAS_WIDTH / 2,
    InsertionSort.INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, "#3c096c");
};

InsertionSort.prototype.createLegend = function () {
  var entries = [
    { label: "Unsorted", color: InsertionSort.DEFAULT_COLOR },
    { label: "Key", color: InsertionSort.KEY_COLOR },
    { label: "Comparing", color: InsertionSort.ACTIVE_COLOR },
    { label: "Sorted", color: InsertionSort.SORTED_COLOR },
  ];
  var centerX = InsertionSort.CANVAS_WIDTH / 2;
  for (var i = 0; i < entries.length; i++) {
    var offset = (i - (entries.length - 1) / 2) * InsertionSort.LEGEND_SPACING;
    var groupCenter = centerX + offset;
    var boxID = this.nextIndex++;
    var labelID = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      boxID,
      "",
      InsertionSort.LEGEND_BOX_WIDTH,
      InsertionSort.LEGEND_BOX_HEIGHT,
      groupCenter,
      InsertionSort.LEGEND_Y,
      "center",
      "center"
    );
    this.cmd("SetBackgroundColor", boxID, entries[i].color);
    this.cmd("SetForegroundColor", boxID, InsertionSort.BORDER_COLOR);
    var labelX =
      groupCenter +
      InsertionSort.LEGEND_BOX_WIDTH / 2 +
      InsertionSort.LEGEND_LABEL_GAP;
    this.cmd(
      "CreateLabel",
      labelID,
      entries[i].label,
      labelX,
      InsertionSort.LEGEND_Y,
      0
    );
    this.cmd("SetForegroundColor", labelID, InsertionSort.BORDER_COLOR);
    this.cmd("SetTextStyle", labelID, "bold 18");
    this.legendIDs.push({ box: boxID, label: labelID });
  }
};

InsertionSort.prototype.createBars = function () {
  for (var i = 0; i < InsertionSort.BAR_COUNT; i++) {
    var xPos = InsertionSort.BAR_START_X + i * InsertionSort.BAR_SPACING;
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
      InsertionSort.BAR_WIDTH,
      value * InsertionSort.SCALE_FACTOR,
      xPos,
      InsertionSort.BAR_BASE_Y,
      "center",
      "bottom"
    );
    this.cmd("SetForegroundColor", rectID, InsertionSort.BORDER_COLOR);
    this.cmd("SetBackgroundColor", rectID, InsertionSort.DEFAULT_COLOR);

    this.cmd(
      "CreateLabel",
      labelID,
      value,
      xPos,
      InsertionSort.BAR_LABEL_Y,
      1
    );
    this.cmd("SetForegroundColor", labelID, InsertionSort.LABEL_COLOR);
    this.cmd("SetTextStyle", labelID, "bold 16");
  }
};

InsertionSort.prototype.createCodeDisplay = function () {
  this.codeID = this.addCodeToCanvasBase(
    this.getCodeDefinition(),
    InsertionSort.CODE_START_X,
    InsertionSort.CODE_START_Y,
    InsertionSort.CODE_LINE_HEIGHT,
    InsertionSort.CODE_STANDARD_COLOR,
    0,
    0
  );
  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], InsertionSort.CODE_FONT);
    }
  }
};

InsertionSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this), 0);
};

InsertionSort.prototype.sortCallback = function () {
  this.implementAction(this.runInsertionSort.bind(this), 0);
};

InsertionSort.prototype.randomizeArray = function () {
  this.commands = [];
  for (var i = 0; i < this.arrayData.length; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.sorted[i] = false;
    this.barObjects[i] = this.barObjects[i];
    this.barLabels[i] = this.barLabels[i];
    this.cmd(
      "SetHeight",
      this.barObjects[i],
      value * InsertionSort.SCALE_FACTOR
    );
    this.cmd("SetText", this.barLabels[i], value);
    this.cmd(
      "SetBackgroundColor",
      this.barObjects[i],
      InsertionSort.DEFAULT_COLOR
    );
    this.cmd("SetForegroundColor", this.barLabels[i], InsertionSort.LABEL_COLOR);
    this.cmd(
      "Move",
      this.barObjects[i],
      this.barPositionsX[i],
      InsertionSort.BAR_BASE_Y
    );
    this.cmd(
      "Move",
      this.barLabels[i],
      this.barPositionsX[i],
      InsertionSort.BAR_LABEL_Y
    );
  }
  this.clearCodeHighlights();
  this.updateSortedColors(-1, false);
  this.cmd("SetText", this.infoLabelID, "Array randomized. Ready to sort!");
  this.cmd("Step");
  return this.commands;
};

InsertionSort.prototype.runInsertionSort = function () {
  this.commands = [];
  this.clearCodeHighlights();
  var n = this.arrayData.length;
  this.cmd("SetText", this.infoLabelID, "Starting insertion sort...");
  this.cmd("Step");

  for (var i = 1; i < n; i++) {
    this.highlightCodeLine(0, true);

    var keyValue = this.arrayData[i];
    var keyRect = this.barObjects[i];
    var keyLabel = this.barLabels[i];

    this.cmd(
      "SetText",
      this.infoLabelID,
      "Insert value " + keyValue + " from index " + i
    );
    this.highlightCodeLine(1, true);
    this.setKeyAppearance(keyRect, keyLabel, true);
    this.liftKey(keyRect, keyLabel, i);

    this.highlightCodeLine(2, true);
    var j = i - 1;

    this.barObjects[i] = null;
    this.barLabels[i] = null;
    this.arrayData[i] = null;

    while (j >= 0 && this.arrayData[j] !== null && this.arrayData[j] > keyValue) {
      this.highlightCodeLine(3, true);
      this.highlightComparison(j);
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Shift " + this.arrayData[j] + " right to make room."
      );
      this.highlightCodeLine(4, true);
      this.shiftBarRight(j);
      this.highlightCodeLine(5, true);
      j--;
      this.highlightCodeLine(6, true);
    }

    this.highlightCodeLine(3, true);
    if (j >= 0 && this.arrayData[j] !== null) {
      this.highlightComparison(j);
      this.cmd(
        "SetText",
        this.infoLabelID,
        this.arrayData[j] + " ≤ key. Insert position found."
      );
      this.cmd("Step");
      this.restoreColor(j);
    } else {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Reached front of array. Insert key at index 0."
      );
      this.cmd("Step");
    }

    var targetIndex = j + 1;
    this.highlightCodeLine(7, true);
    this.barObjects[targetIndex] = keyRect;
    this.barLabels[targetIndex] = keyLabel;
    this.arrayData[targetIndex] = keyValue;
    this.dropKey(keyRect, keyLabel, targetIndex);
    this.setKeyAppearance(keyRect, keyLabel, false);
    this.updateSortedColors(i, true);
  }

  this.highlightCodeLine(8, true);
  this.highlightCodeLine(-1, false);
  this.cmd("SetText", this.infoLabelID, "Insertion sort complete.");
  this.cmd("Step");
  return this.commands;
};

InsertionSort.prototype.highlightComparison = function (index) {
  if (index < 0 || !this.barObjects[index]) {
    return;
  }
  this.cmd(
    "SetBackgroundColor",
    this.barObjects[index],
    InsertionSort.ACTIVE_COLOR
  );
  this.cmd(
    "SetForegroundColor",
    this.barLabels[index],
    InsertionSort.ACTIVE_TEXT_COLOR
  );
  this.cmd("Step");
};

InsertionSort.prototype.restoreColor = function (index) {
  if (index < 0 || !this.barObjects[index]) {
    return;
  }
  var color = this.sorted[index]
    ? InsertionSort.SORTED_COLOR
    : InsertionSort.DEFAULT_COLOR;
  this.cmd("SetBackgroundColor", this.barObjects[index], color);
  this.cmd(
    "SetForegroundColor",
    this.barLabels[index],
    InsertionSort.LABEL_COLOR
  );
};

InsertionSort.prototype.shiftBarRight = function (index) {
  var movedRect = this.barObjects[index];
  var movedLabel = this.barLabels[index];
  var movedValue = this.arrayData[index];
  if (movedRect == null) {
    return;
  }

  this.cmd("SetBackgroundColor", movedRect, InsertionSort.ACTIVE_COLOR);
  this.cmd("SetForegroundColor", movedLabel, InsertionSort.ACTIVE_TEXT_COLOR);
  this.cmd("Step");

  this.cmd(
    "Move",
    movedRect,
    this.barPositionsX[index + 1],
    InsertionSort.BAR_BASE_Y
  );
  this.cmd(
    "Move",
    movedLabel,
    this.barPositionsX[index + 1],
    InsertionSort.BAR_LABEL_Y
  );
  this.cmd("Step");

  this.cmd("SetBackgroundColor", movedRect, InsertionSort.DEFAULT_COLOR);
  this.cmd("SetForegroundColor", movedLabel, InsertionSort.LABEL_COLOR);

  this.barObjects[index + 1] = movedRect;
  this.barLabels[index + 1] = movedLabel;
  this.arrayData[index + 1] = movedValue;

  this.barObjects[index] = null;
  this.barLabels[index] = null;
  this.arrayData[index] = null;
};

InsertionSort.prototype.setKeyAppearance = function (rectID, labelID, isKey) {
  if (rectID == null || labelID == null) {
    return;
  }
  this.cmd(
    "SetBackgroundColor",
    rectID,
    isKey ? InsertionSort.KEY_COLOR : InsertionSort.DEFAULT_COLOR
  );
  this.cmd(
    "SetForegroundColor",
    labelID,
    isKey ? InsertionSort.KEY_TEXT_COLOR : InsertionSort.LABEL_COLOR
  );
};

InsertionSort.prototype.liftKey = function (rectID, labelID, column) {
  this.cmd(
    "Move",
    rectID,
    this.barPositionsX[column],
    InsertionSort.BAR_BASE_Y - InsertionSort.KEY_LIFT
  );
  this.cmd(
    "Move",
    labelID,
    this.barPositionsX[column],
    InsertionSort.BAR_LABEL_Y - InsertionSort.KEY_LIFT
  );
  this.cmd("Step");
};

InsertionSort.prototype.dropKey = function (rectID, labelID, column) {
  this.cmd(
    "Move",
    rectID,
    this.barPositionsX[column],
    InsertionSort.BAR_BASE_Y
  );
  this.cmd(
    "Move",
    labelID,
    this.barPositionsX[column],
    InsertionSort.BAR_LABEL_Y
  );
  this.cmd("Step");
};

InsertionSort.prototype.updateSortedColors = function (sortedEnd, stepAfter) {
  if (sortedEnd === undefined) {
    sortedEnd = -1;
  }
  for (var i = 0; i < this.barObjects.length; i++) {
    var isSorted = sortedEnd >= 0 && i <= sortedEnd;
    this.sorted[i] = isSorted;
    if (this.barObjects[i]) {
      this.cmd(
        "SetBackgroundColor",
        this.barObjects[i],
        isSorted ? InsertionSort.SORTED_COLOR : InsertionSort.DEFAULT_COLOR
      );
      this.cmd(
        "SetForegroundColor",
        this.barLabels[i],
        InsertionSort.LABEL_COLOR
      );
    }
  }
  if (stepAfter) {
    this.cmd("Step");
  }
};

InsertionSort.prototype.highlightCodeLine = function (line, stepAfter) {
  if (this.highlightedLine >= 0 && this.codeID[this.highlightedLine]) {
    for (var i = 0; i < this.codeID[this.highlightedLine].length; i++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[this.highlightedLine][i],
        InsertionSort.CODE_STANDARD_COLOR
      );
    }
  }
  if (line >= 0 && this.codeID[line]) {
    for (var j = 0; j < this.codeID[line].length; j++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[line][j],
        InsertionSort.CODE_HIGHLIGHT_COLOR
      );
    }
  }
  this.highlightedLine = line;
  if (stepAfter) {
    this.cmd("Step");
  }
};

InsertionSort.prototype.clearCodeHighlights = function () {
  for (var i = 0; i < this.codeID.length; i++) {
    if (this.codeID[i]) {
      for (var j = 0; j < this.codeID[i].length; j++) {
        this.cmd(
          "SetForegroundColor",
          this.codeID[i][j],
          InsertionSort.CODE_STANDARD_COLOR
        );
      }
    }
  }
  this.highlightedLine = -1;
};

InsertionSort.prototype.generateRandomValue = function () {
  return (
    InsertionSort.VALUE_MIN +
    Math.floor(
      Math.random() * (InsertionSort.VALUE_MAX - InsertionSort.VALUE_MIN + 1)
    )
  );
};

InsertionSort.prototype.reset = function () {
  return this.randomizeArray();
};

InsertionSort.prototype.disableUI = function () {
  this.randomizeButton.disabled = true;
  this.sortButton.disabled = true;
};

InsertionSort.prototype.enableUI = function () {
  this.randomizeButton.disabled = false;
  this.sortButton.disabled = false;
};

var currentAlg = null;

function init() {
  var animManag = initCanvas();
  if (typeof canvas !== "undefined") {
    canvas.width = InsertionSort.CANVAS_WIDTH;
    canvas.height = InsertionSort.CANVAS_HEIGHT;
  }
  if (animManag && animManag.animatedObjects) {
    animManag.animatedObjects.width = InsertionSort.CANVAS_WIDTH;
    animManag.animatedObjects.height = InsertionSort.CANVAS_HEIGHT;
  }
  currentAlg = new InsertionSort(
    animManag,
    InsertionSort.CANVAS_WIDTH,
    InsertionSort.CANVAS_HEIGHT
  );
}
