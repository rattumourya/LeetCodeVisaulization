// Selection sort animation with the custom 720x1080 layout that matches
// the Insertion Sort demo. The implementation follows the conventions of
// the in-house animation framework and focuses on showcasing how the
// algorithm scans for the minimum element on each pass.

function SelectionSort(am, w, h) {
  this.init(am, w, h);
}

SelectionSort.prototype = new Algorithm();
SelectionSort.prototype.constructor = SelectionSort;
SelectionSort.superclass = Algorithm.prototype;

SelectionSort.CANVAS_WIDTH = 720;
SelectionSort.CANVAS_HEIGHT = 1080;

SelectionSort.BAR_COUNT = 12;
SelectionSort.BAR_WIDTH = 42;
SelectionSort.BAR_SPACING = 52;
SelectionSort.BAR_START_X = 80;
SelectionSort.BAR_BASE_Y = 560;
SelectionSort.BAR_LABEL_OFFSET = 32;
SelectionSort.BAR_LABEL_Y =
  SelectionSort.BAR_BASE_Y + SelectionSort.BAR_LABEL_OFFSET;
SelectionSort.BAR_LAYER = 0;
SelectionSort.BAR_LABEL_LAYER = 1;
SelectionSort.MIN_LAYER = 2;
SelectionSort.MIN_LABEL_LAYER = 3;
SelectionSort.LEGEND_OFFSET = 110;
SelectionSort.INDEX_LABEL_OFFSET = 72;
SelectionSort.INDEX_LABEL_Y =
  SelectionSort.BAR_BASE_Y + SelectionSort.INDEX_LABEL_OFFSET;
SelectionSort.VALUE_MIN = 20;
SelectionSort.VALUE_MAX = 100;
SelectionSort.SCALE_FACTOR = 4;

SelectionSort.TITLE_Y = 36;
SelectionSort.INFO_Y = 140;
SelectionSort.LEGEND_Y =
  SelectionSort.BAR_LABEL_Y + SelectionSort.LEGEND_OFFSET;
SelectionSort.LEGEND_SPACING = 200;
SelectionSort.LEGEND_BOX_WIDTH = 42;
SelectionSort.LEGEND_BOX_HEIGHT = 24;
SelectionSort.LEGEND_LABEL_VERTICAL_GAP = 10;

SelectionSort.CODE_START_X = SelectionSort.CANVAS_WIDTH / 2 - 180;
SelectionSort.CODE_START_Y = 760;
SelectionSort.CODE_LINE_HEIGHT = 34;
SelectionSort.CODE_STANDARD_COLOR = "#1f3d7a";
SelectionSort.CODE_HIGHLIGHT_COLOR = "#d62828";
SelectionSort.CODE_FONT = "bold 20";

SelectionSort.DEFAULT_COLOR = "#8fb8ff";
SelectionSort.ACTIVE_COLOR = "#ffb703";
SelectionSort.MIN_COLOR = "#fb8500";
SelectionSort.SORTED_COLOR = "#8ac926";
SelectionSort.BORDER_COLOR = "#1d3557";
SelectionSort.LABEL_COLOR = "#0b2545";
SelectionSort.ACTIVE_TEXT_COLOR = "#9c2a2a";
SelectionSort.MIN_TEXT_COLOR = "#3a0f0f";

SelectionSort.prototype.getCodeDefinition = function () {
  return [
    ["for (int i = 0; i < n - 1; i++) {"],
    ["    int minIndex = i;"],
    ["    for (int j = i + 1; j < n; j++) {"],
    ["        if (a[j] < a[minIndex]) {"],
    ["            minIndex = j;"],
    ["        }"],
    ["    }"],
    ["    swap(a, i, minIndex);"],
    ["}"],
  ];
};

SelectionSort.prototype.init = function (am, w, h) {
  SelectionSort.superclass.init.call(this, am, w, h);

  this.animationManager.setAllLayers([
    SelectionSort.BAR_LAYER,
    SelectionSort.BAR_LABEL_LAYER,
    SelectionSort.MIN_LAYER,
    SelectionSort.MIN_LABEL_LAYER,
  ]);

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

  this.arrayData = new Array(SelectionSort.BAR_COUNT);
  this.barObjects = new Array(SelectionSort.BAR_COUNT);
  this.barLabels = new Array(SelectionSort.BAR_COUNT);
  this.barPositionsX = new Array(SelectionSort.BAR_COUNT);
  this.sorted = new Array(SelectionSort.BAR_COUNT);
  this.legendIDs = [];
  this.codeID = [];
  this.highlightedLine = -1;
  this.currentMinIndex = -1;

  this.commands = [];
  this.createTitle();
  this.createInfoPanel();
  this.createLegend();
  this.createBars();
  this.createIndexMarkers();
  this.createCodeDisplay();

  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.skipForward();
  this.animationManager.clearHistory();
  this.commands = [];
};

SelectionSort.prototype.addControls = function () {
  this.randomizeButton = addControlToAlgorithmBar(
    "Button",
    "Randomize Array"
  );
  this.randomizeButton.onclick = this.randomizeCallback.bind(this);

  this.sortButton = addControlToAlgorithmBar("Button", "Selection Sort");
  this.sortButton.onclick = this.sortCallback.bind(this);
};

SelectionSort.prototype.createTitle = function () {
  this.titleLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleLabelID,
    "Selection Sort",
    SelectionSort.CANVAS_WIDTH / 2,
    SelectionSort.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleLabelID, "bold 32");
  this.cmd("SetForegroundColor", this.titleLabelID, SelectionSort.BORDER_COLOR);
};

SelectionSort.prototype.createInfoPanel = function () {
  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    SelectionSort.CANVAS_WIDTH / 2,
    SelectionSort.INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, "#3c096c");
};

SelectionSort.prototype.createLegend = function () {
  var entries = [
    { label: "Unsorted", color: SelectionSort.DEFAULT_COLOR },
    { label: "Current Minimum", color: SelectionSort.MIN_COLOR },
    { label: "Comparing", color: SelectionSort.ACTIVE_COLOR },
    { label: "Sorted", color: SelectionSort.SORTED_COLOR },
  ];
  var centerX = SelectionSort.CANVAS_WIDTH / 2;
  for (var i = 0; i < entries.length; i++) {
    var offset = (i - (entries.length - 1) / 2) * SelectionSort.LEGEND_SPACING;
    var groupCenter = centerX + offset;
    var boxID = this.nextIndex++;
    var labelID = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      boxID,
      "",
      SelectionSort.LEGEND_BOX_WIDTH,
      SelectionSort.LEGEND_BOX_HEIGHT,
      groupCenter,
      SelectionSort.LEGEND_Y,
      "center",
      "center"
    );
    this.cmd("SetBackgroundColor", boxID, entries[i].color);
    this.cmd("SetForegroundColor", boxID, SelectionSort.BORDER_COLOR);
    var labelY =
      SelectionSort.LEGEND_Y +
      SelectionSort.LEGEND_BOX_HEIGHT / 2 +
      SelectionSort.LEGEND_LABEL_VERTICAL_GAP;
    this.cmd(
      "CreateLabel",
      labelID,
      entries[i].label,
      groupCenter,
      labelY,
      1
    );
    this.cmd("SetForegroundColor", labelID, SelectionSort.BORDER_COLOR);
    this.cmd("SetTextStyle", labelID, "bold 18");
    this.legendIDs.push({ box: boxID, label: labelID });
  }
};

SelectionSort.prototype.createBars = function () {
  for (var i = 0; i < SelectionSort.BAR_COUNT; i++) {
    var xPos = SelectionSort.BAR_START_X + i * SelectionSort.BAR_SPACING;
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
      SelectionSort.BAR_WIDTH,
      value * SelectionSort.SCALE_FACTOR,
      xPos,
      SelectionSort.BAR_BASE_Y,
      "center",
      "bottom"
    );
    this.cmd("SetForegroundColor", rectID, SelectionSort.BORDER_COLOR);
    this.cmd("SetBackgroundColor", rectID, SelectionSort.DEFAULT_COLOR);
    this.cmd("SetLayer", rectID, SelectionSort.BAR_LAYER);
    this.cmd(
      "CreateLabel",
      labelID,
      value,
      xPos,
      SelectionSort.BAR_LABEL_Y,
      1
    );
    this.cmd("SetForegroundColor", labelID, SelectionSort.LABEL_COLOR);
    this.cmd("SetTextStyle", labelID, "bold 16");
    this.cmd("SetLayer", labelID, SelectionSort.BAR_LABEL_LAYER);
  }
};

SelectionSort.prototype.createIndexMarkers = function () {
  this.iMarkerID = this.nextIndex++;
  this.jMarkerID = this.nextIndex++;

  this.cmd(
    "CreateLabel",
    this.iMarkerID,
    "",
    SelectionSort.BAR_START_X,
    SelectionSort.INDEX_LABEL_Y,
    1
  );
  this.cmd("SetForegroundColor", this.iMarkerID, SelectionSort.BORDER_COLOR);
  this.cmd("SetTextStyle", this.iMarkerID, "bold 20");
  this.cmd("SetLayer", this.iMarkerID, SelectionSort.BAR_LABEL_LAYER);

  this.cmd(
    "CreateLabel",
    this.jMarkerID,
    "",
    SelectionSort.BAR_START_X,
    SelectionSort.INDEX_LABEL_Y,
    1
  );
  this.cmd("SetForegroundColor", this.jMarkerID, SelectionSort.BORDER_COLOR);
  this.cmd("SetTextStyle", this.jMarkerID, "bold 20");
  this.cmd("SetLayer", this.jMarkerID, SelectionSort.BAR_LABEL_LAYER);
};

SelectionSort.prototype.createCodeDisplay = function () {
  this.codeID = this.addCodeToCanvasBase(
    this.getCodeDefinition(),
    SelectionSort.CODE_START_X,
    SelectionSort.CODE_START_Y,
    SelectionSort.CODE_LINE_HEIGHT,
    SelectionSort.CODE_STANDARD_COLOR,
    0,
    0
  );
  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], SelectionSort.CODE_FONT);
    }
  }
};

SelectionSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this), 0);
};

SelectionSort.prototype.sortCallback = function () {
  this.implementAction(this.runSelectionSort.bind(this), 0);
};

SelectionSort.prototype.randomizeArray = function () {
  this.commands = [];
  this.currentMinIndex = -1;
  for (var i = 0; i < this.arrayData.length; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.sorted[i] = false;
    this.cmd(
      "SetHeight",
      this.barObjects[i],
      value * SelectionSort.SCALE_FACTOR
    );
    this.cmd("SetText", this.barLabels[i], value);
    this.cmd(
      "SetBackgroundColor",
      this.barObjects[i],
      SelectionSort.DEFAULT_COLOR
    );
    this.cmd("SetForegroundColor", this.barLabels[i], SelectionSort.LABEL_COLOR);
    this.cmd("SetLayer", this.barObjects[i], SelectionSort.BAR_LAYER);
    this.cmd("SetLayer", this.barLabels[i], SelectionSort.BAR_LABEL_LAYER);
    this.cmd(
      "Move",
      this.barObjects[i],
      this.barPositionsX[i],
      SelectionSort.BAR_BASE_Y
    );
    this.cmd(
      "Move",
      this.barLabels[i],
      this.barPositionsX[i],
      SelectionSort.BAR_LABEL_Y
    );
  }
  this.clearCodeHighlights();
  this.cmd("SetText", this.infoLabelID, "Array randomized. Ready to sort!");
  this.updateIndexMarker(this.iMarkerID, "", -1, false);
  this.updateIndexMarker(this.jMarkerID, "", -1, false);
  this.cmd("Step");
  return this.commands;
};

SelectionSort.prototype.runSelectionSort = function () {
  this.commands = [];
  this.clearCodeHighlights();
  this.currentMinIndex = -1;
  var n = this.arrayData.length;

  this.updateSortedColors(-1, false);
  this.cmd("SetText", this.infoLabelID, "Starting selection sort...");
  this.cmd("Step");

  for (var i = 0; i < n - 1; i++) {
    this.updateIndexMarker(this.iMarkerID, "i", i, false);
    this.updateIndexMarker(this.jMarkerID, "", -1, false);
    this.highlightCodeLine(0, true);

    var minIndex = i;
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Scan for the smallest value from index " + i + "."
    );
    this.highlightCodeLine(1, true);
    this.setMinCandidate(minIndex, true);

    this.highlightCodeLine(2, true);

    for (var j = i + 1; j < n; j++) {
      this.updateIndexMarker(this.jMarkerID, "j", j, false);
      this.highlightComparison(j);
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Compare " +
          this.arrayData[j] +
          " with current minimum " +
          this.arrayData[minIndex] +
          "."
      );
      this.highlightCodeLine(3, true);

      if (this.arrayData[j] < this.arrayData[minIndex]) {
        this.cmd(
          "SetText",
          this.infoLabelID,
          this.arrayData[j] + " becomes the new minimum."
        );
        this.highlightCodeLine(4, true);
        minIndex = j;
        this.setMinCandidate(minIndex, true);
        this.highlightCodeLine(5, true);
      } else {
        this.cmd(
          "SetText",
          this.infoLabelID,
          this.arrayData[j] +
            " is not smaller than " +
            this.arrayData[minIndex] +
            "."
        );
        this.highlightCodeLine(5, true);
        this.restoreColor(j);
      }
    }

    this.updateIndexMarker(this.jMarkerID, "", -1, false);

    this.highlightCodeLine(6, true);
    if (minIndex !== i) {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Swap values at indices " + i + " and " + minIndex + "."
      );
    } else {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Index " + i + " already holds the minimum."
      );
    }

    this.highlightCodeLine(7, true);
    this.swapBars(i, minIndex);
    this.currentMinIndex = -1;
    this.updateSortedColors(i, true);
  }

  this.highlightCodeLine(8, true);
  this.updateSortedColors(n - 1, true);
  this.highlightCodeLine(-1, false);
  this.cmd("SetText", this.infoLabelID, "Selection sort complete.");
  this.updateIndexMarker(this.iMarkerID, "", -1, false);
  this.updateIndexMarker(this.jMarkerID, "", -1, false);
  this.cmd("Step");
  return this.commands;
};

SelectionSort.prototype.highlightComparison = function (index) {
  if (index < 0 || !this.barObjects[index]) {
    return;
  }
  this.cmd(
    "SetBackgroundColor",
    this.barObjects[index],
    SelectionSort.ACTIVE_COLOR
  );
  this.cmd(
    "SetForegroundColor",
    this.barLabels[index],
    SelectionSort.ACTIVE_TEXT_COLOR
  );
  this.cmd("SetLayer", this.barObjects[index], SelectionSort.MIN_LAYER);
  this.cmd("SetLayer", this.barLabels[index], SelectionSort.MIN_LABEL_LAYER);
  this.cmd("Step");
};

SelectionSort.prototype.setMinCandidate = function (index, stepAfter) {
  if (index < 0 || !this.barObjects[index]) {
    return;
  }
  if (this.currentMinIndex >= 0 && this.currentMinIndex !== index) {
    var previous = this.currentMinIndex;
    this.currentMinIndex = -1;
    this.restoreColor(previous);
  }
  this.currentMinIndex = index;
  this.cmd(
    "SetBackgroundColor",
    this.barObjects[index],
    SelectionSort.MIN_COLOR
  );
  this.cmd(
    "SetForegroundColor",
    this.barLabels[index],
    SelectionSort.MIN_TEXT_COLOR
  );
  this.cmd("SetLayer", this.barObjects[index], SelectionSort.MIN_LAYER);
  this.cmd("SetLayer", this.barLabels[index], SelectionSort.MIN_LABEL_LAYER);
  if (stepAfter) {
    this.cmd("Step");
  }
};

SelectionSort.prototype.restoreColor = function (index) {
  if (index < 0 || !this.barObjects[index]) {
    return;
  }
  var isSorted = !!this.sorted[index];
  var isMin = index === this.currentMinIndex;
  var background = isMin
    ? SelectionSort.MIN_COLOR
    : isSorted
    ? SelectionSort.SORTED_COLOR
    : SelectionSort.DEFAULT_COLOR;
  var foreground = isMin
    ? SelectionSort.MIN_TEXT_COLOR
    : SelectionSort.LABEL_COLOR;
  var rectLayer = isMin
    ? SelectionSort.MIN_LAYER
    : SelectionSort.BAR_LAYER;
  var labelLayer = isMin
    ? SelectionSort.MIN_LABEL_LAYER
    : SelectionSort.BAR_LABEL_LAYER;

  this.cmd("SetBackgroundColor", this.barObjects[index], background);
  this.cmd("SetForegroundColor", this.barLabels[index], foreground);
  this.cmd("SetLayer", this.barObjects[index], rectLayer);
  this.cmd("SetLayer", this.barLabels[index], labelLayer);
};

SelectionSort.prototype.updateIndexMarker = function (
  markerID,
  label,
  index,
  stepAfter
) {
  if (!markerID) {
    return;
  }
  if (index === undefined || index < 0 || index >= this.barPositionsX.length) {
    this.cmd("SetText", markerID, "");
  } else {
    this.cmd("SetText", markerID, label);
    this.cmd(
      "Move",
      markerID,
      this.barPositionsX[index],
      SelectionSort.INDEX_LABEL_Y
    );
  }
  if (stepAfter) {
    this.cmd("Step");
  }
};

SelectionSort.prototype.swapBars = function (indexA, indexB) {
  if (indexA < 0 || indexB < 0) {
    return;
  }
  if (indexA === indexB) {
    if (this.currentMinIndex !== indexA) {
      this.currentMinIndex = indexA;
    }
    this.restoreColor(indexA);
    this.cmd("Step");
    return;
  }

  var rectA = this.barObjects[indexA];
  var labelA = this.barLabels[indexA];
  var valueA = this.arrayData[indexA];
  var rectB = this.barObjects[indexB];
  var labelB = this.barLabels[indexB];
  var valueB = this.arrayData[indexB];

  this.cmd("SetBackgroundColor", rectA, SelectionSort.ACTIVE_COLOR);
  this.cmd("SetForegroundColor", labelA, SelectionSort.ACTIVE_TEXT_COLOR);
  this.cmd("SetBackgroundColor", rectB, SelectionSort.ACTIVE_COLOR);
  this.cmd("SetForegroundColor", labelB, SelectionSort.ACTIVE_TEXT_COLOR);
  this.cmd("Step");

  this.cmd(
    "Move",
    rectA,
    this.barPositionsX[indexB],
    SelectionSort.BAR_BASE_Y
  );
  this.cmd(
    "Move",
    labelA,
    this.barPositionsX[indexB],
    SelectionSort.BAR_LABEL_Y
  );
  this.cmd(
    "Move",
    rectB,
    this.barPositionsX[indexA],
    SelectionSort.BAR_BASE_Y
  );
  this.cmd(
    "Move",
    labelB,
    this.barPositionsX[indexA],
    SelectionSort.BAR_LABEL_Y
  );
  this.cmd("Step");

  this.barObjects[indexA] = rectB;
  this.barLabels[indexA] = labelB;
  this.arrayData[indexA] = valueB;
  this.barObjects[indexB] = rectA;
  this.barLabels[indexB] = labelA;
  this.arrayData[indexB] = valueA;

  if (this.currentMinIndex === indexB) {
    this.currentMinIndex = indexA;
  } else if (this.currentMinIndex === indexA) {
    this.currentMinIndex = indexB;
  }

  this.restoreColor(indexB);
  this.restoreColor(indexA);
};

SelectionSort.prototype.updateSortedColors = function (sortedEnd, stepAfter) {
  if (sortedEnd === undefined) {
    sortedEnd = -1;
  }
  for (var i = 0; i < this.barObjects.length; i++) {
    var isSorted = sortedEnd >= 0 && i <= sortedEnd;
    this.sorted[i] = isSorted;
    this.restoreColor(i);
  }
  if (stepAfter) {
    this.cmd("Step");
  }
};

SelectionSort.prototype.highlightCodeLine = function (line, stepAfter) {
  if (this.highlightedLine >= 0 && this.codeID[this.highlightedLine]) {
    for (var i = 0; i < this.codeID[this.highlightedLine].length; i++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[this.highlightedLine][i],
        SelectionSort.CODE_STANDARD_COLOR
      );
    }
  }
  if (line >= 0 && this.codeID[line]) {
    for (var j = 0; j < this.codeID[line].length; j++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[line][j],
        SelectionSort.CODE_HIGHLIGHT_COLOR
      );
    }
  }
  this.highlightedLine = line;
  if (stepAfter) {
    this.cmd("Step");
  }
};

SelectionSort.prototype.clearCodeHighlights = function () {
  for (var i = 0; i < this.codeID.length; i++) {
    if (this.codeID[i]) {
      for (var j = 0; j < this.codeID[i].length; j++) {
        this.cmd(
          "SetForegroundColor",
          this.codeID[i][j],
          SelectionSort.CODE_STANDARD_COLOR
        );
      }
    }
  }
  this.highlightedLine = -1;
};

SelectionSort.prototype.generateRandomValue = function () {
  return (
    SelectionSort.VALUE_MIN +
    Math.floor(
      Math.random() * (SelectionSort.VALUE_MAX - SelectionSort.VALUE_MIN + 1)
    )
  );
};

SelectionSort.prototype.reset = function () {
  return this.randomizeArray();
};

SelectionSort.prototype.disableUI = function () {
  this.randomizeButton.disabled = true;
  this.sortButton.disabled = true;
};

SelectionSort.prototype.enableUI = function () {
  this.randomizeButton.disabled = false;
  this.sortButton.disabled = false;
};

var currentAlg = null;

function init() {
  var animManag = initCanvas();
  if (typeof canvas !== "undefined") {
    canvas.width = SelectionSort.CANVAS_WIDTH;
    canvas.height = SelectionSort.CANVAS_HEIGHT;
  }
  if (animManag && animManag.animatedObjects) {
    animManag.animatedObjects.width = SelectionSort.CANVAS_WIDTH;
    animManag.animatedObjects.height = SelectionSort.CANVAS_HEIGHT;
  }
  currentAlg = new SelectionSort(
    animManag,
    SelectionSort.CANVAS_WIDTH,
    SelectionSort.CANVAS_HEIGHT
  );
}
