// Merge sort animation tailored for the 720x1080 canvas. The implementation
// mirrors the look-and-feel of the other custom animated sorting demos and is
// built on top of the legacy animation framework that powers this repository.

function MergeSort(am, w, h) {
  this.init(am, w, h);
}

MergeSort.prototype = new Algorithm();
MergeSort.prototype.constructor = MergeSort;
MergeSort.superclass = Algorithm.prototype;

MergeSort.CANVAS_WIDTH = 720;
MergeSort.CANVAS_HEIGHT = 1080;

MergeSort.BAR_COUNT = 12;
MergeSort.BAR_WIDTH = 24;
MergeSort.BAR_SPACING = 48;
MergeSort.BAR_START_X = 96;
MergeSort.BAR_BASE_Y = 600;
MergeSort.BAR_LABEL_OFFSET = 26;
MergeSort.BAR_LABEL_Y = MergeSort.BAR_BASE_Y + MergeSort.BAR_LABEL_OFFSET;

MergeSort.TEMP_BASE_Y = 360;
MergeSort.TEMP_LABEL_Y = MergeSort.TEMP_BASE_Y + MergeSort.BAR_LABEL_OFFSET;

MergeSort.VALUE_MIN = 15;
MergeSort.VALUE_MAX = 90;
MergeSort.SCALE_FACTOR = 3;

MergeSort.TITLE_Y = 60;
MergeSort.INFO_Y = 140;
MergeSort.LEGEND_Y = MergeSort.BAR_LABEL_Y + 36;
MergeSort.LEGEND_SPACING = 170;
MergeSort.LEGEND_BOX_WIDTH = 42;
MergeSort.LEGEND_BOX_HEIGHT = 24;
MergeSort.LEGEND_LABEL_GAP = 10;

MergeSort.CODE_START_Y = MergeSort.LEGEND_Y + 70;
MergeSort.CODE_LINE_HEIGHT = 15;
MergeSort.CODE_STANDARD_COLOR = "#1f3d7a";
MergeSort.CODE_HIGHLIGHT_COLOR = "#d62828";
MergeSort.CODE_FONT = "bold 14";
MergeSort.CODE_LEFT_X = 80;
MergeSort.CODE_RIGHT_X = 430;

MergeSort.DEFAULT_COLOR = "#8fb8ff";
MergeSort.ACTIVE_SPLIT_COLOR = "#ffd166";
MergeSort.COMPARE_COLOR = "#ffb703";
MergeSort.TEMP_COLOR = "#cde7ff";
MergeSort.MERGED_COLOR = "#9bf6ff";
MergeSort.FINAL_COLOR = "#8ac926";
MergeSort.BORDER_COLOR = "#1d3557";
MergeSort.LABEL_COLOR = "#0b2545";
MergeSort.ACTIVE_TEXT_COLOR = "#3a0f0f";

MergeSort.CODE_SECTIONS = [
  [
    "void mergeSort(int[] arr, int left, int right) {",
    "  if (left >= right) {",
    "    return;",
    "  }",
    "  int mid = left + (right - left) / 2;",
    "  mergeSort(arr, left, mid);",
    "  mergeSort(arr, mid + 1, right);",
    "  merge(arr, left, mid, right);",
    "}",
  ],
  [
    "void merge(int[] arr, int left, int mid, int right) {",
    "  int[] merged = new int[right - left + 1];",
    "  int i = left, j = mid + 1, k = 0;",
    "  while (i <= mid && j <= right) {",
    "    if (arr[i] <= arr[j]) {",
    "      merged[k++] = arr[i++];",
    "    } else {",
    "      merged[k++] = arr[j++];",
    "    }",
    "  }",
    "  while (i <= mid) {",
    "    merged[k++] = arr[i++];",
    "  }",
    "  while (j <= right) {",
    "    merged[k++] = arr[j++];",
    "  }",
    "  for (int offset = 0; offset < merged.length; offset++) {",
    "    arr[left + offset] = merged[offset];",
    "  }",
    "}",
  ],
];

MergeSort.prototype.init = function (am, w, h) {
  MergeSort.superclass.init.call(this, am, w, h);

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

  this.arrayData = new Array(MergeSort.BAR_COUNT);
  this.barObjects = new Array(MergeSort.BAR_COUNT);
  this.barLabels = new Array(MergeSort.BAR_COUNT);
  this.barPositionsX = new Array(MergeSort.BAR_COUNT);
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

MergeSort.prototype.addControls = function () {
  this.randomizeButton = addControlToAlgorithmBar("Button", "Randomize Array");
  this.randomizeButton.onclick = this.randomizeCallback.bind(this);

  this.sortButton = addControlToAlgorithmBar("Button", "Merge Sort");
  this.sortButton.onclick = this.sortCallback.bind(this);
};

MergeSort.prototype.createTitle = function () {
  this.titleLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleLabelID,
    "Merge Sort",
    MergeSort.CANVAS_WIDTH / 2,
    MergeSort.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleLabelID, "bold 32");
  this.cmd("SetForegroundColor", this.titleLabelID, MergeSort.BORDER_COLOR);
};

MergeSort.prototype.createInfoPanel = function () {
  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    MergeSort.CANVAS_WIDTH / 2,
    MergeSort.INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, "#3c096c");
};

MergeSort.prototype.createLegend = function () {
  var entries = [
    { label: "Array element", color: MergeSort.DEFAULT_COLOR },
    { label: "Active split", color: MergeSort.ACTIVE_SPLIT_COLOR },
    { label: "Comparing", color: MergeSort.COMPARE_COLOR },
    { label: "Merged", color: MergeSort.MERGED_COLOR },
  ];

  var centerX = MergeSort.CANVAS_WIDTH / 2;
  for (var i = 0; i < entries.length; i++) {
    var offset = (i - (entries.length - 1) / 2) * MergeSort.LEGEND_SPACING;
    var groupCenter = centerX + offset;
    var boxID = this.nextIndex++;
    var labelID = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      boxID,
      "",
      MergeSort.LEGEND_BOX_WIDTH,
      MergeSort.LEGEND_BOX_HEIGHT,
      groupCenter,
      MergeSort.LEGEND_Y,
      "center",
      "center"
    );
    this.cmd("SetBackgroundColor", boxID, entries[i].color);
    this.cmd("SetForegroundColor", boxID, MergeSort.BORDER_COLOR);
    this.cmd("CreateLabel", labelID, entries[i].label, groupCenter, MergeSort.LEGEND_Y + MergeSort.LEGEND_BOX_HEIGHT / 2 + MergeSort.LEGEND_LABEL_GAP, 1);
    this.cmd("SetTextStyle", labelID, "bold 18");
    this.cmd("SetForegroundColor", labelID, MergeSort.BORDER_COLOR);
    this.legendIDs.push({ box: boxID, label: labelID });
  }
};

MergeSort.prototype.createBars = function () {
  for (var i = 0; i < MergeSort.BAR_COUNT; i++) {
    var xPos = MergeSort.BAR_START_X + i * MergeSort.BAR_SPACING;
    this.barPositionsX[i] = xPos;
    var value = this.generateRandomValue();
    this.arrayData[i] = value;

    var rectID = this.nextIndex++;
    var labelID = this.nextIndex++;
    this.barObjects[i] = rectID;
    this.barLabels[i] = labelID;

    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      MergeSort.BAR_WIDTH,
      value * MergeSort.SCALE_FACTOR,
      xPos,
      MergeSort.BAR_BASE_Y,
      "center",
      "bottom"
    );
    this.cmd("SetForegroundColor", rectID, MergeSort.BORDER_COLOR);
    this.cmd("SetBackgroundColor", rectID, MergeSort.DEFAULT_COLOR);

    this.cmd("CreateLabel", labelID, value, xPos, MergeSort.BAR_LABEL_Y, 1);
    this.cmd("SetForegroundColor", labelID, MergeSort.LABEL_COLOR);
    this.cmd("SetTextStyle", labelID, "bold 16");
  }
};

MergeSort.prototype.createCodeDisplay = function () {
  this.codeID = [];
  var columns = [MergeSort.CODE_LEFT_X, MergeSort.CODE_RIGHT_X];
  for (var col = 0; col < MergeSort.CODE_SECTIONS.length; col++) {
    var section = MergeSort.CODE_SECTIONS[col];
    var lineY = MergeSort.CODE_START_Y;
    for (var line = 0; line < section.length; line++) {
      var lineEntry = section[line];
      var segments = Array.isArray(lineEntry) ? lineEntry : [lineEntry];
      var labelGroup = [];
      for (var seg = 0; seg < segments.length; seg++) {
        var labelID = this.nextIndex++;
        this.cmd(
          "CreateLabel",
          labelID,
          segments[seg],
          columns[col],
          lineY,
          0
        );
        this.cmd("SetTextStyle", labelID, MergeSort.CODE_FONT);
        this.cmd("SetForegroundColor", labelID, MergeSort.CODE_STANDARD_COLOR);
        labelGroup.push(labelID);
        lineY += MergeSort.CODE_LINE_HEIGHT;
      }
      this.codeID.push(labelGroup);
    }
  }
};

MergeSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this), 0);
};

MergeSort.prototype.sortCallback = function () {
  this.implementAction(this.runMergeSort.bind(this), 0);
};

MergeSort.prototype.randomizeArray = function () {
  this.commands = [];
  for (var i = 0; i < this.arrayData.length; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.cmd("SetHeight", this.barObjects[i], value * MergeSort.SCALE_FACTOR);
    this.cmd("SetText", this.barLabels[i], value);
    this.cmd("SetBackgroundColor", this.barObjects[i], MergeSort.DEFAULT_COLOR);
    this.cmd("SetForegroundColor", this.barLabels[i], MergeSort.LABEL_COLOR);
    this.cmd("Move", this.barObjects[i], this.barPositionsX[i], MergeSort.BAR_BASE_Y);
    this.cmd("Move", this.barLabels[i], this.barPositionsX[i], MergeSort.BAR_LABEL_Y);
  }
  this.clearCodeHighlights();
  this.cmd("SetText", this.infoLabelID, "Array randomized. Ready to sort!");
  this.cmd("Step");
  return this.commands;
};

MergeSort.prototype.runMergeSort = function () {
  this.commands = [];
  this.clearCodeHighlights();
  this.cmd("SetText", this.infoLabelID, "Starting merge sort...");
  this.cmd("Step");
  this.mergeSortRecursive(0, this.arrayData.length - 1, 0);
  this.highlightCodeLine(-1, false);
  this.cmd("SetText", this.infoLabelID, "Merge sort complete.");
  this.cmd("Step");
  return this.commands;
};

MergeSort.prototype.mergeSortRecursive = function (left, right, depth) {
  this.highlightCodeLine(0, true);
  this.highlightRange(left, right, MergeSort.ACTIVE_SPLIT_COLOR, true);
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Splitting range [" + left + ", " + right + "]"
  );
  this.cmd("Step");

  this.highlightCodeLine(1, true);
  if (left >= right) {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Base case reached at index " + left + "."
    );
    this.cmd("Step");
    this.restoreRange(left, right, depth === 0);
    return;
  }

  this.highlightCodeLine(4, true);
  var mid = Math.floor((left + right) / 2);
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Midpoint at index " + mid + "."
  );
  this.cmd("Step");

  this.highlightCodeLine(5, true);
  this.mergeSortRecursive(left, mid, depth + 1);

  this.highlightCodeLine(6, true);
  this.mergeSortRecursive(mid + 1, right, depth + 1);

  this.highlightCodeLine(7, true);
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Merging ranges [" + left + ", " + mid + "] and [" + (mid + 1) + ", " + right + "]"
  );
  this.cmd("Step");
  this.mergeRanges(left, mid, right, depth);
  this.restoreRange(left, right, depth === 0);
};

MergeSort.prototype.mergeRanges = function (left, mid, right, depth) {
  this.highlightCodeLine(9, true);
  this.highlightCodeLine(10, true);
  this.highlightCodeLine(11, true);

  var leftItems = [];
  var rightItems = [];
  var i;
  for (i = left; i <= mid; i++) {
    leftItems.push(this.createWorkingItem(i));
  }
  for (i = mid + 1; i <= right; i++) {
    rightItems.push(this.createWorkingItem(i));
  }

  var merged = [];
  var leftIndex = 0;
  var rightIndex = 0;

  while (leftIndex < leftItems.length && rightIndex < rightItems.length) {
    this.highlightCodeLine(12, true);
    var leftItem = leftItems[leftIndex];
    var rightItem = rightItems[rightIndex];
    this.highlightComparison(leftItem, rightItem);

    this.highlightCodeLine(13, true);
    if (leftItem.value <= rightItem.value) {
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Taking " + leftItem.value + " from left half."
      );
      this.cmd("Step");
      merged.push(leftItem);
      leftIndex++;
      this.placeMergedItem(leftItem, left + merged.length - 1, depth === 0);
      this.restoreItemColor(rightItem);
    } else {
      this.highlightCodeLine(16, true);
      this.cmd(
        "SetText",
        this.infoLabelID,
        "Taking " + rightItem.value + " from right half."
      );
      this.cmd("Step");
      merged.push(rightItem);
      rightIndex++;
      this.placeMergedItem(rightItem, left + merged.length - 1, depth === 0);
      this.restoreItemColor(leftItem);
    }
  }

  if (leftIndex < leftItems.length) {
    this.highlightCodeLine(19, true);
  }
  while (leftIndex < leftItems.length) {
    var remainingLeft = leftItems[leftIndex];
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Appending remaining left value " + remainingLeft.value + "."
    );
    this.cmd("Step");
    merged.push(remainingLeft);
    leftIndex++;
    this.placeMergedItem(remainingLeft, left + merged.length - 1, depth === 0);
  }

  if (rightIndex < rightItems.length) {
    this.highlightCodeLine(22, true);
  }
  while (rightIndex < rightItems.length) {
    var remainingRight = rightItems[rightIndex];
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Appending remaining right value " + remainingRight.value + "."
    );
    this.cmd("Step");
    merged.push(remainingRight);
    rightIndex++;
    this.placeMergedItem(remainingRight, left + merged.length - 1, depth === 0);
  }

  this.highlightCodeLine(25, true);
  this.cmd(
    "SetText",
    this.infoLabelID,
    "Copying merged values back into array positions " + left + ".." + right + "."
  );
  this.cmd("Step");

  for (i = 0; i < merged.length; i++) {
    var targetIndex = left + i;
    this.arrayData[targetIndex] = merged[i].value;
    this.barObjects[targetIndex] = merged[i].rectID;
    this.barLabels[targetIndex] = merged[i].labelID;
    this.cmd("SetText", merged[i].labelID, merged[i].value);
    this.cmd(
      "SetForegroundColor",
      merged[i].labelID,
      MergeSort.LABEL_COLOR
    );
    this.cmd(
      "SetBackgroundColor",
      merged[i].rectID,
      depth === 0 ? MergeSort.FINAL_COLOR : MergeSort.MERGED_COLOR
    );
  }
};

MergeSort.prototype.createWorkingItem = function (index) {
  var rectID = this.barObjects[index];
  var labelID = this.barLabels[index];
  var value = this.arrayData[index];
  this.cmd(
    "Move",
    rectID,
    this.barPositionsX[index],
    MergeSort.TEMP_BASE_Y
  );
  this.cmd(
    "Move",
    labelID,
    this.barPositionsX[index],
    MergeSort.TEMP_LABEL_Y
  );
  this.cmd("SetBackgroundColor", rectID, MergeSort.TEMP_COLOR);
  this.cmd("SetForegroundColor", labelID, MergeSort.LABEL_COLOR);
  this.cmd("Step");
  return {
    rectID: rectID,
    labelID: labelID,
    value: value,
  };
};

MergeSort.prototype.highlightComparison = function (leftItem, rightItem) {
  this.cmd(
    "SetBackgroundColor",
    leftItem.rectID,
    MergeSort.COMPARE_COLOR
  );
  this.cmd(
    "SetBackgroundColor",
    rightItem.rectID,
    MergeSort.COMPARE_COLOR
  );
  this.cmd(
    "SetForegroundColor",
    leftItem.labelID,
    MergeSort.ACTIVE_TEXT_COLOR
  );
  this.cmd(
    "SetForegroundColor",
    rightItem.labelID,
    MergeSort.ACTIVE_TEXT_COLOR
  );
  this.cmd("Step");
};

MergeSort.prototype.restoreItemColor = function (item) {
  this.cmd(
    "SetBackgroundColor",
    item.rectID,
    MergeSort.TEMP_COLOR
  );
  this.cmd("SetForegroundColor", item.labelID, MergeSort.LABEL_COLOR);
};

MergeSort.prototype.placeMergedItem = function (item, positionIndex, isFinalPass) {
  var targetX = this.barPositionsX[positionIndex];
  this.cmd("Move", item.rectID, targetX, MergeSort.BAR_BASE_Y);
  this.cmd("Move", item.labelID, targetX, MergeSort.BAR_LABEL_Y);
  this.cmd(
    "SetBackgroundColor",
    item.rectID,
    isFinalPass ? MergeSort.FINAL_COLOR : MergeSort.MERGED_COLOR
  );
  this.cmd("SetForegroundColor", item.labelID, MergeSort.LABEL_COLOR);
  this.cmd("Step");
};

MergeSort.prototype.highlightRange = function (
  left,
  right,
  color,
  stepAfter
) {
  for (var i = left; i <= right; i++) {
    this.cmd("SetBackgroundColor", this.barObjects[i], color);
    this.cmd("SetForegroundColor", this.barLabels[i], MergeSort.LABEL_COLOR);
  }
  if (stepAfter) {
    this.cmd("Step");
  }
};

MergeSort.prototype.restoreRange = function (left, right, isFinalRange) {
  for (var i = left; i <= right; i++) {
    var color = isFinalRange ? MergeSort.FINAL_COLOR : MergeSort.MERGED_COLOR;
    this.cmd("SetBackgroundColor", this.barObjects[i], color);
    this.cmd("SetForegroundColor", this.barLabels[i], MergeSort.LABEL_COLOR);
  }
  this.cmd("Step");
};

MergeSort.prototype.highlightCodeLine = function (line, stepAfter) {
  if (this.highlightedLine >= 0 && this.codeID[this.highlightedLine]) {
    for (var i = 0; i < this.codeID[this.highlightedLine].length; i++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[this.highlightedLine][i],
        MergeSort.CODE_STANDARD_COLOR
      );
    }
  }
  if (line >= 0 && this.codeID[line]) {
    for (var j = 0; j < this.codeID[line].length; j++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[line][j],
        MergeSort.CODE_HIGHLIGHT_COLOR
      );
    }
  }
  this.highlightedLine = line;
  if (stepAfter) {
    this.cmd("Step");
  }
};

MergeSort.prototype.clearCodeHighlights = function () {
  for (var i = 0; i < this.codeID.length; i++) {
    if (this.codeID[i]) {
      for (var j = 0; j < this.codeID[i].length; j++) {
        this.cmd(
          "SetForegroundColor",
          this.codeID[i][j],
          MergeSort.CODE_STANDARD_COLOR
        );
      }
    }
  }
  this.highlightedLine = -1;
};

MergeSort.prototype.generateRandomValue = function () {
  return (
    MergeSort.VALUE_MIN +
    Math.floor(
      Math.random() * (MergeSort.VALUE_MAX - MergeSort.VALUE_MIN + 1)
    )
  );
};

MergeSort.prototype.reset = function () {
  return this.randomizeArray();
};

MergeSort.prototype.disableUI = function () {
  this.randomizeButton.disabled = true;
  this.sortButton.disabled = true;
};

MergeSort.prototype.enableUI = function () {
  this.randomizeButton.disabled = false;
  this.sortButton.disabled = false;
};

var currentAlg = null;

function init() {
  var animManag = initCanvas();
  if (typeof canvas !== "undefined") {
    canvas.width = MergeSort.CANVAS_WIDTH;
    canvas.height = MergeSort.CANVAS_HEIGHT;
  }
  if (animManag && animManag.animatedObjects) {
    animManag.animatedObjects.width = MergeSort.CANVAS_WIDTH;
    animManag.animatedObjects.height = MergeSort.CANVAS_HEIGHT;
  }
  currentAlg = new MergeSort(
    animManag,
    MergeSort.CANVAS_WIDTH,
    MergeSort.CANVAS_HEIGHT
  );
}
