// Custom Bubble Sort animation tailored for a 720x1080 canvas.
// The implementation follows the conventions used by the legacy
// animation framework that powers the other algorithm demos in this
// repository.

function BubbleSort(am, w, h) {
  this.init(am, w, h);
}

BubbleSort.prototype = new Algorithm();
BubbleSort.prototype.constructor = BubbleSort;
BubbleSort.superclass = Algorithm.prototype;

BubbleSort.CANVAS_WIDTH = 720;
BubbleSort.CANVAS_HEIGHT = 1080;

BubbleSort.BAR_COUNT = 12;
BubbleSort.BAR_WIDTH = 42;
BubbleSort.BAR_SPACING = 52;
BubbleSort.BAR_START_X = 80;
BubbleSort.BAR_BASE_Y = 900;
BubbleSort.BAR_LABEL_OFFSET = 36;
BubbleSort.BAR_LABEL_Y = BubbleSort.BAR_BASE_Y + BubbleSort.BAR_LABEL_OFFSET;
BubbleSort.VALUE_MIN = 20;
BubbleSort.VALUE_MAX = 100;
BubbleSort.SCALE_FACTOR = 4;

BubbleSort.TITLE_Y = 60;
BubbleSort.INFO_Y = 520;
BubbleSort.LEGEND_Y = BubbleSort.INFO_Y + 80;

BubbleSort.CODE_START_X = 140;
BubbleSort.CODE_START_Y = 160;

BubbleSort.CODE_LINE_HEIGHT = 34;
BubbleSort.CODE_STANDARD_COLOR = "#1f3d7a";
BubbleSort.CODE_HIGHLIGHT_COLOR = "#d62828";
BubbleSort.CODE_FONT = "bold 20";

BubbleSort.DEFAULT_COLOR = "#8fb8ff";
BubbleSort.ACTIVE_COLOR = "#ffb703";
BubbleSort.SORTED_COLOR = "#8ac926";
BubbleSort.BORDER_COLOR = "#1d3557";
BubbleSort.LABEL_COLOR = "#0b2545";
BubbleSort.ACTIVE_TEXT_COLOR = "#9c2a2a";

BubbleSort.CODE = [
  ["for (int pass = 0; pass < n - 1; pass++) {"],
  ["    boolean swapped = false;"],
  ["    for (int j = 0; j < n - pass - 1; j++) {"],
  ["        if (a[j] > a[j + 1]) {"],
  ["            swap(a, j, j + 1);"],
  ["            swapped = true;"],
  ["        }"],
  ["    }"],
  ["    if (!swapped) { break; }"],
  ["}"],
];

BubbleSort.prototype.init = function (am, w, h) {
  BubbleSort.superclass.init.call(this, am, w, h);

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

  this.arrayData = new Array(BubbleSort.BAR_COUNT);
  this.barObjects = new Array(BubbleSort.BAR_COUNT);
  this.barLabels = new Array(BubbleSort.BAR_COUNT);
  this.barPositionsX = new Array(BubbleSort.BAR_COUNT);
  this.sorted = new Array(BubbleSort.BAR_COUNT);
  this.legendIDs = [];
  this.codeID = [];
  this.highlightedLine = -1;

  this.commands = [];
  this.createTitle();
  this.createCodeDisplay();
  this.createInfoPanel();
  this.createBars();
  this.createLegend();

  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.skipForward();
  this.animationManager.clearHistory();
  this.commands = [];
};

BubbleSort.prototype.addControls = function () {
  this.randomizeButton = addControlToAlgorithmBar("Button", "Randomize Array");
  this.randomizeButton.onclick = this.randomizeCallback.bind(this);

  this.sortButton = addControlToAlgorithmBar("Button", "Bubble Sort");
  this.sortButton.onclick = this.sortCallback.bind(this);
};

BubbleSort.prototype.createTitle = function () {
  this.titleLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleLabelID,
    "Bubble Sort",
    BubbleSort.CANVAS_WIDTH / 2,
    BubbleSort.TITLE_Y,
    0
  );
  this.cmd("SetTextStyle", this.titleLabelID, "bold 32");
  this.cmd("SetForegroundColor", this.titleLabelID, BubbleSort.BORDER_COLOR);
};

BubbleSort.prototype.createBars = function () {
  for (var i = 0; i < BubbleSort.BAR_COUNT; i++) {
    var xPos = BubbleSort.BAR_START_X + i * BubbleSort.BAR_SPACING;
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
      BubbleSort.BAR_WIDTH,
      value * BubbleSort.SCALE_FACTOR,
      xPos,
      BubbleSort.BAR_BASE_Y,
      "center",
      "bottom"
    );
    this.cmd("SetForegroundColor", rectID, BubbleSort.BORDER_COLOR);
    this.cmd("SetBackgroundColor", rectID, BubbleSort.DEFAULT_COLOR);

    this.cmd("CreateLabel", labelID, value, xPos, BubbleSort.BAR_LABEL_Y, 0);
    this.cmd("SetForegroundColor", labelID, BubbleSort.LABEL_COLOR);
    this.cmd("SetTextStyle", labelID, "bold 16");
  }
};

BubbleSort.prototype.createInfoPanel = function () {
  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    BubbleSort.CANVAS_WIDTH / 2,
    BubbleSort.INFO_Y,
    0
  );

  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, "#3c096c");
};

BubbleSort.prototype.createLegend = function () {
  var entries = [
    { label: "Unsorted", color: BubbleSort.DEFAULT_COLOR },
    { label: "Comparing", color: BubbleSort.ACTIVE_COLOR },
    { label: "Sorted", color: BubbleSort.SORTED_COLOR },
  ];
  var centerX = BubbleSort.CANVAS_WIDTH / 2;
  var spacing = 170;
  for (var i = 0; i < entries.length; i++) {
    var x = centerX + (i - 1) * spacing;
    var boxID = this.nextIndex++;
    var labelID = this.nextIndex++;
    this.cmd("CreateRectangle", boxID, "", 36, 20, x, BubbleSort.LEGEND_Y, "center", "center");
    this.cmd("SetBackgroundColor", boxID, entries[i].color);
    this.cmd("SetForegroundColor", boxID, BubbleSort.BORDER_COLOR);
    this.cmd("CreateLabel", labelID, entries[i].label, x, BubbleSort.LEGEND_Y + 24, 0);
    this.cmd("SetForegroundColor", labelID, BubbleSort.BORDER_COLOR);
    this.cmd("SetTextStyle", labelID, "16");
    this.legendIDs.push({ box: boxID, label: labelID });
  }
};

BubbleSort.prototype.createCodeDisplay = function () {
  this.codeID = this.addCodeToCanvasBase(
    BubbleSort.CODE,
    BubbleSort.CODE_START_X,
    BubbleSort.CODE_START_Y,
    BubbleSort.CODE_LINE_HEIGHT,
    BubbleSort.CODE_STANDARD_COLOR
  );
  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], BubbleSort.CODE_FONT);
    }
  }
};

BubbleSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this), 0);
};

BubbleSort.prototype.sortCallback = function () {
  this.implementAction(this.runBubbleSort.bind(this), 0);
};

BubbleSort.prototype.randomizeArray = function () {
  this.commands = [];
  for (var i = 0; i < this.arrayData.length; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.sorted[i] = false;
    this.cmd("SetHeight", this.barObjects[i], value * BubbleSort.SCALE_FACTOR);
    this.cmd("SetText", this.barLabels[i], value);
    this.cmd("SetBackgroundColor", this.barObjects[i], BubbleSort.DEFAULT_COLOR);
    this.cmd("SetForegroundColor", this.barLabels[i], BubbleSort.LABEL_COLOR);
  }
  this.clearCodeHighlights();
  this.cmd("SetText", this.infoLabelID, "Array randomized. Ready to sort!");
  this.cmd("Step");
  return this.commands;
};

BubbleSort.prototype.runBubbleSort = function () {
  this.commands = [];
  this.clearCodeHighlights();
  var n = this.arrayData.length;
  for (var pass = 0; pass < n - 1; pass++) {
    this.highlightCodeLine(0);
    var swapped = false;
    this.highlightCodeLine(1);
    for (var j = 0; j < n - pass - 1; j++) {
      this.highlightCodeLine(2);
      this.highlightPair(j, j + 1);
      this.cmd("SetText", this.infoLabelID, "Comparing index " + j + " and " + (j + 1));
      this.highlightCodeLine(3);
      if (this.arrayData[j] > this.arrayData[j + 1]) {
        this.highlightCodeLine(4);
        this.cmd(
          "SetText",
          this.infoLabelID,
          "Swapping " + this.arrayData[j] + " and " + this.arrayData[j + 1]
        );
        this.swapBars(j, j + 1);
        swapped = true;
        this.highlightCodeLine(5);
      }
      this.unhighlightPair(j, j + 1);
    }
    this.markSorted(n - pass - 1);
    if (!swapped) {
      this.highlightCodeLine(8);
      this.cmd("SetText", this.infoLabelID, "No swaps needed. Array sorted early!");
      break;
    }
  }
  for (var i = 0; i < n; i++) {
    if (!this.sorted[i]) {
      this.markSorted(i);
    }
  }
  this.highlightCodeLine(-1);
  this.cmd("SetText", this.infoLabelID, "Bubble sort complete.");
  this.cmd("Step");
  return this.commands;
};

BubbleSort.prototype.highlightPair = function (i, j) {
  this.cmd("SetBackgroundColor", this.barObjects[i], BubbleSort.ACTIVE_COLOR);
  this.cmd("SetBackgroundColor", this.barObjects[j], BubbleSort.ACTIVE_COLOR);
  this.cmd("SetForegroundColor", this.barLabels[i], BubbleSort.ACTIVE_TEXT_COLOR);
  this.cmd("SetForegroundColor", this.barLabels[j], BubbleSort.ACTIVE_TEXT_COLOR);
  this.cmd("Step");
};

BubbleSort.prototype.unhighlightPair = function (i, j) {
  var colorI = this.sorted[i] ? BubbleSort.SORTED_COLOR : BubbleSort.DEFAULT_COLOR;
  var colorJ = this.sorted[j] ? BubbleSort.SORTED_COLOR : BubbleSort.DEFAULT_COLOR;
  this.cmd("SetBackgroundColor", this.barObjects[i], colorI);
  this.cmd("SetBackgroundColor", this.barObjects[j], colorJ);
  this.cmd("SetForegroundColor", this.barLabels[i], BubbleSort.LABEL_COLOR);
  this.cmd("SetForegroundColor", this.barLabels[j], BubbleSort.LABEL_COLOR);
  this.cmd("Step");
};

BubbleSort.prototype.swapBars = function (i, j) {
  var tempObj = this.barObjects[i];
  var tempLabel = this.barLabels[i];
  var tempVal = this.arrayData[i];

  this.cmd("Move", this.barObjects[i], this.barPositionsX[j], BubbleSort.BAR_BASE_Y);
  this.cmd("Move", this.barObjects[j], this.barPositionsX[i], BubbleSort.BAR_BASE_Y);
  this.cmd("Move", this.barLabels[i], this.barPositionsX[j], BubbleSort.BAR_LABEL_Y);
  this.cmd("Move", this.barLabels[j], this.barPositionsX[i], BubbleSort.BAR_LABEL_Y);
  this.cmd("Step");

  this.barObjects[i] = this.barObjects[j];
  this.barObjects[j] = tempObj;

  this.barLabels[i] = this.barLabels[j];
  this.barLabels[j] = tempLabel;

  this.arrayData[i] = this.arrayData[j];
  this.arrayData[j] = tempVal;

  this.cmd("SetText", this.barLabels[i], this.arrayData[i]);
  this.cmd("SetText", this.barLabels[j], this.arrayData[j]);

  this.sorted[i] = false;
  this.sorted[j] = false;
};

BubbleSort.prototype.markSorted = function (index) {
  this.sorted[index] = true;
  this.cmd("SetBackgroundColor", this.barObjects[index], BubbleSort.SORTED_COLOR);
  this.cmd("SetForegroundColor", this.barLabels[index], BubbleSort.LABEL_COLOR);
  this.cmd("Step");
};

BubbleSort.prototype.highlightCodeLine = function (line) {
  if (this.highlightedLine >= 0 && this.codeID[this.highlightedLine]) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[this.highlightedLine][0],
      BubbleSort.CODE_STANDARD_COLOR
    );
  }
  if (line >= 0 && this.codeID[line]) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[line][0],
      BubbleSort.CODE_HIGHLIGHT_COLOR
    );
  }
  this.highlightedLine = line;
};

BubbleSort.prototype.clearCodeHighlights = function () {
  for (var i = 0; i < this.codeID.length; i++) {
    if (this.codeID[i] && this.codeID[i][0]) {
      this.cmd("SetForegroundColor", this.codeID[i][0], BubbleSort.CODE_STANDARD_COLOR);
    }
  }
  this.highlightedLine = -1;
};

BubbleSort.prototype.generateRandomValue = function () {
  return (
    BubbleSort.VALUE_MIN +
    Math.floor(Math.random() * (BubbleSort.VALUE_MAX - BubbleSort.VALUE_MIN + 1))
  );
};

BubbleSort.prototype.reset = function () {
  return this.randomizeArray();
};

BubbleSort.prototype.disableUI = function () {
  this.randomizeButton.disabled = true;
  this.sortButton.disabled = true;
};

BubbleSort.prototype.enableUI = function () {
  this.randomizeButton.disabled = false;
  this.sortButton.disabled = false;
};

var currentAlg = null;

function init() {
  var animManag = initCanvas();
  if (typeof canvas !== "undefined") {
    canvas.width = BubbleSort.CANVAS_WIDTH;
    canvas.height = BubbleSort.CANVAS_HEIGHT;
  }
  if (animManag && animManag.animatedObjects) {
    animManag.animatedObjects.width = BubbleSort.CANVAS_WIDTH;
    animManag.animatedObjects.height = BubbleSort.CANVAS_HEIGHT;
  }
  currentAlg = new BubbleSort(animManag, BubbleSort.CANVAS_WIDTH, BubbleSort.CANVAS_HEIGHT);
}
