// Custom counting sort visualization in the 720x1280 layout used by the
// Heap Sort demo. The animation walks through the three core phases of the
// algorithm: counting occurrences, building prefix sums, and producing the
// sorted output array.

function CountingSort(am, w, h) {
  this.init(am, w, h);
}

CountingSort.prototype = new Algorithm();
CountingSort.prototype.constructor = CountingSort;
CountingSort.superclass = Algorithm.prototype;

CountingSort.CANVAS_WIDTH = 720;
CountingSort.CANVAS_HEIGHT = 1280;

CountingSort.ARRAY_SIZE = 9;
CountingSort.MAX_VALUE = 9;
CountingSort.COUNT_SIZE = CountingSort.MAX_VALUE + 1;

CountingSort.RECT_WIDTH = 54;
CountingSort.RECT_HEIGHT = 48;
CountingSort.ARRAY_SPACING = 62;

CountingSort.INPUT_Y = 240;
CountingSort.COUNT_Y = 440;
CountingSort.OUTPUT_Y = 640;
CountingSort.ARRAY_LABEL_GAP = 62;
CountingSort.INDEX_GAP = 36;

CountingSort.TITLE_Y = 60;
CountingSort.INFO_Y = 140;

CountingSort.CODE_START_Y = 860;
CountingSort.CODE_LINE_HEIGHT = 22;
CountingSort.CODE_FONT = "bold 18";
CountingSort.CODE_SECTION_GAP = 32;
CountingSort.CODE_COLUMNS = [110, 440];
CountingSort.CODE_LAYOUT = [0, 0, 0, 1, 1];

CountingSort.INPUT_DEFAULT_COLOR = "#edf2fb";
CountingSort.INPUT_ACTIVE_COLOR = "#ffcad4";
CountingSort.INPUT_FINAL_COLOR = "#a9def9";
CountingSort.INPUT_BORDER_COLOR = "#1d3557";

CountingSort.COUNT_DEFAULT_COLOR = "#e0fbfc";
CountingSort.COUNT_ACTIVE_COLOR = "#ffd166";
CountingSort.COUNT_PREFIX_COLOR = "#a3c4f3";
CountingSort.COUNT_BORDER_COLOR = "#1d3557";

CountingSort.OUTPUT_DEFAULT_COLOR = "#dee2ff";
CountingSort.OUTPUT_ACTIVE_COLOR = "#90e0ef";
CountingSort.OUTPUT_FINAL_COLOR = "#8ac926";
CountingSort.OUTPUT_BORDER_COLOR = "#1d3557";

CountingSort.INDEX_COLOR = "#0b2545";
CountingSort.TITLE_COLOR = "#1d3557";
CountingSort.INFO_COLOR = "#2b2d42";
CountingSort.CODE_STANDARD_COLOR = "#1d3557";
CountingSort.CODE_HIGHLIGHT_COLOR = "#d62828";
CountingSort.MOVE_LABEL_COLOR = "#003049";

CountingSort.CODE_SECTIONS = [
  {
    lines: [
      "void countingSort(int[] arr, int maxVal) {",
      "  int[] count = new int[maxVal + 1];",
      "  fillCounts(arr, count);",
      "  prefixSums(count);",
      "  int[] out = buildOutput(arr, count);",
      "  copyBack(arr, out);",
      "}",
    ],
  },
  {
    lines: [
      "void fillCounts(int[] arr, int[] count) {",
      "  for (int value : arr) {",
      "    count[value]++;",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "void prefixSums(int[] count) {",
      "  for (int i = 1; i < count.length; i++) {",
      "    count[i] += count[i - 1];",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "int[] buildOutput(int[] arr, int[] count) {",
      "  int[] out = new int[arr.length];",
      "  for (int i = arr.length - 1; i >= 0; i--) {",
      "    int value = arr[i];",
      "    out[--count[value]] = value;",
      "  }",
      "  return out;",
      "}",
    ],
  },
  {
    lines: [
      "void copyBack(int[] arr, int[] out) {",
      "  for (int i = 0; i < arr.length; i++) {",
      "    arr[i] = out[i];",
      "  }",
      "}",
    ],
  },
];

CountingSort.prototype.init = function (am, w, h) {
  CountingSort.superclass.init.call(this, am, w, h);

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

  this.arrayData = new Array(CountingSort.ARRAY_SIZE);
  this.arrayRects = new Array(CountingSort.ARRAY_SIZE);
  this.arrayIndexLabels = new Array(CountingSort.ARRAY_SIZE);
  this.arrayPositions = new Array(CountingSort.ARRAY_SIZE);

  this.countData = new Array(CountingSort.COUNT_SIZE);
  this.countRects = new Array(CountingSort.COUNT_SIZE);
  this.countIndexLabels = new Array(CountingSort.COUNT_SIZE);
  this.countPositions = new Array(CountingSort.COUNT_SIZE);

  this.outputData = new Array(CountingSort.ARRAY_SIZE);
  this.outputRects = new Array(CountingSort.ARRAY_SIZE);
  this.outputIndexLabels = new Array(CountingSort.ARRAY_SIZE);
  this.outputPositions = new Array(CountingSort.ARRAY_SIZE);

  this.codeIDs = [];
  this.highlightedSection = -1;
  this.highlightedLine = -1;

  this.commands = [];

  this.createTitle();
  this.createInfoPanel();
  this.createInputArray();
  this.createCountArray();
  this.createOutputArray();
  this.createCodeDisplay();

  this.randomizeValues(false);

  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.skipForward();
  this.animationManager.clearHistory();
  this.commands = [];
};

CountingSort.prototype.addControls = function () {
  this.randomizeButton = addControlToAlgorithmBar(
    "Button",
    "Randomize Array"
  );
  this.randomizeButton.onclick = this.randomizeCallback.bind(this);

  this.sortButton = addControlToAlgorithmBar("Button", "Counting Sort");
  this.sortButton.onclick = this.sortCallback.bind(this);
};

CountingSort.prototype.createTitle = function () {
  this.titleLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleLabelID,
    "Counting Sort",
    CountingSort.CANVAS_WIDTH / 2,
    CountingSort.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleLabelID, "bold 34");
  this.cmd("SetForegroundColor", this.titleLabelID, CountingSort.TITLE_COLOR);
};

CountingSort.prototype.createInfoPanel = function () {
  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    CountingSort.CANVAS_WIDTH / 2,
    CountingSort.INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, CountingSort.INFO_COLOR);
};

CountingSort.prototype.createInputArray = function () {
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Input Array",
    CountingSort.CANVAS_WIDTH / 2,
    CountingSort.INPUT_Y - CountingSort.ARRAY_LABEL_GAP,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, CountingSort.INFO_COLOR);

  var startX =
    CountingSort.CANVAS_WIDTH / 2 -
    ((CountingSort.ARRAY_SIZE - 1) * CountingSort.ARRAY_SPACING) / 2;

  for (var i = 0; i < CountingSort.ARRAY_SIZE; i++) {
    var x = startX + i * CountingSort.ARRAY_SPACING;
    this.arrayPositions[i] = x;

    var rectID = this.nextIndex++;
    this.arrayRects[i] = rectID;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      CountingSort.RECT_WIDTH,
      CountingSort.RECT_HEIGHT,
      x,
      CountingSort.INPUT_Y,
      "center",
      "center"
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      CountingSort.INPUT_DEFAULT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, CountingSort.INPUT_BORDER_COLOR);

    var indexID = this.nextIndex++;
    this.arrayIndexLabels[i] = indexID;
    this.cmd(
      "CreateLabel",
      indexID,
      i,
      x,
      CountingSort.INPUT_Y + CountingSort.RECT_HEIGHT / 2 + CountingSort.INDEX_GAP,
      0
    );
    this.cmd("SetTextStyle", indexID, "bold 16");
    this.cmd("SetForegroundColor", indexID, CountingSort.INDEX_COLOR);
  }
};

CountingSort.prototype.createCountArray = function () {
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Count of Values",
    CountingSort.CANVAS_WIDTH / 2,
    CountingSort.COUNT_Y - CountingSort.ARRAY_LABEL_GAP,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, CountingSort.INFO_COLOR);

  var startX =
    CountingSort.CANVAS_WIDTH / 2 -
    ((CountingSort.COUNT_SIZE - 1) * CountingSort.ARRAY_SPACING) / 2;

  for (var i = 0; i < CountingSort.COUNT_SIZE; i++) {
    var x = startX + i * CountingSort.ARRAY_SPACING;
    this.countPositions[i] = x;

    var rectID = this.nextIndex++;
    this.countRects[i] = rectID;
    this.cmd(
      "CreateRectangle",
      rectID,
      "0",
      CountingSort.RECT_WIDTH,
      CountingSort.RECT_HEIGHT,
      x,
      CountingSort.COUNT_Y,
      "center",
      "center"
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      CountingSort.COUNT_DEFAULT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, CountingSort.COUNT_BORDER_COLOR);

    var indexID = this.nextIndex++;
    this.countIndexLabels[i] = indexID;
    this.cmd(
      "CreateLabel",
      indexID,
      i,
      x,
      CountingSort.COUNT_Y + CountingSort.RECT_HEIGHT / 2 + CountingSort.INDEX_GAP,
      0
    );
    this.cmd("SetTextStyle", indexID, "bold 16");
    this.cmd("SetForegroundColor", indexID, CountingSort.INDEX_COLOR);

    this.countData[i] = 0;
  }
};

CountingSort.prototype.createOutputArray = function () {
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Output Array",
    CountingSort.CANVAS_WIDTH / 2,
    CountingSort.OUTPUT_Y - CountingSort.ARRAY_LABEL_GAP,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, CountingSort.INFO_COLOR);

  var startX =
    CountingSort.CANVAS_WIDTH / 2 -
    ((CountingSort.ARRAY_SIZE - 1) * CountingSort.ARRAY_SPACING) / 2;

  for (var i = 0; i < CountingSort.ARRAY_SIZE; i++) {
    var x = startX + i * CountingSort.ARRAY_SPACING;
    this.outputPositions[i] = x;

    var rectID = this.nextIndex++;
    this.outputRects[i] = rectID;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      CountingSort.RECT_WIDTH,
      CountingSort.RECT_HEIGHT,
      x,
      CountingSort.OUTPUT_Y,
      "center",
      "center"
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      CountingSort.OUTPUT_DEFAULT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, CountingSort.OUTPUT_BORDER_COLOR);

    var indexID = this.nextIndex++;
    this.outputIndexLabels[i] = indexID;
    this.cmd(
      "CreateLabel",
      indexID,
      i,
      x,
      CountingSort.OUTPUT_Y + CountingSort.RECT_HEIGHT / 2 + CountingSort.INDEX_GAP,
      0
    );
    this.cmd("SetTextStyle", indexID, "bold 16");
    this.cmd("SetForegroundColor", indexID, CountingSort.INDEX_COLOR);

    this.outputData[i] = null;
  }
};

CountingSort.prototype.createCodeDisplay = function () {
  this.codeIDs = [];
  var columnHeights = [];
  for (var c = 0; c < CountingSort.CODE_COLUMNS.length; c++) {
    columnHeights[c] = CountingSort.CODE_START_Y;
  }

  for (var sectionIndex = 0; sectionIndex < CountingSort.CODE_SECTIONS.length; sectionIndex++) {
    var section = CountingSort.CODE_SECTIONS[sectionIndex];
    var columnIndex = CountingSort.CODE_LAYOUT[sectionIndex];
    var columnX = CountingSort.CODE_COLUMNS[columnIndex];
    var currentY = columnHeights[columnIndex];

    var lineIDs = [];
    for (var line = 0; line < section.lines.length; line++) {
      var labelID = this.nextIndex++;
      this.cmd(
        "CreateLabel",
        labelID,
        section.lines[line],
        columnX,
        currentY,
        0
      );
      this.cmd("SetTextStyle", labelID, CountingSort.CODE_FONT);
      this.cmd(
        "SetForegroundColor",
        labelID,
        CountingSort.CODE_STANDARD_COLOR
      );
      lineIDs.push(labelID);
      currentY += CountingSort.CODE_LINE_HEIGHT;
    }
    this.codeIDs.push(lineIDs);
    columnHeights[columnIndex] = currentY + CountingSort.CODE_SECTION_GAP;
  }
};

CountingSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this, true), 0);
};

CountingSort.prototype.sortCallback = function () {
  this.implementAction(this.runCountingSort.bind(this), 0);
};

CountingSort.prototype.randomizeValues = function (showMessage) {
  for (var i = 0; i < CountingSort.ARRAY_SIZE; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.cmd("SetText", this.arrayRects[i], value);
    this.cmd(
      "SetBackgroundColor",
      this.arrayRects[i],
      CountingSort.INPUT_DEFAULT_COLOR
    );
  }

  for (var j = 0; j < CountingSort.COUNT_SIZE; j++) {
    this.countData[j] = 0;
    this.cmd("SetText", this.countRects[j], 0);
    this.cmd(
      "SetBackgroundColor",
      this.countRects[j],
      CountingSort.COUNT_DEFAULT_COLOR
    );
  }

  for (var k = 0; k < CountingSort.ARRAY_SIZE; k++) {
    this.outputData[k] = null;
    this.cmd("SetText", this.outputRects[k], "");
    this.cmd(
      "SetBackgroundColor",
      this.outputRects[k],
      CountingSort.OUTPUT_DEFAULT_COLOR
    );
  }

  this.clearCodeHighlights();
  if (showMessage) {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Array randomized. Ready for counting sort!"
    );
    this.cmd("Step");
  }
};

CountingSort.prototype.randomizeArray = function (showMessage) {
  this.commands = [];
  this.randomizeValues(showMessage);
  return this.commands;
};

CountingSort.prototype.generateRandomValue = function () {
  return Math.floor(Math.random() * (CountingSort.MAX_VALUE + 1));
};

CountingSort.prototype.runCountingSort = function () {
  this.commands = [];
  this.disableUI();
  this.clearCodeHighlights();

  for (var i = 0; i < CountingSort.COUNT_SIZE; i++) {
    this.countData[i] = 0;
    this.cmd("SetText", this.countRects[i], 0);
    this.cmd(
      "SetBackgroundColor",
      this.countRects[i],
      CountingSort.COUNT_DEFAULT_COLOR
    );
  }
  for (var k = 0; k < CountingSort.ARRAY_SIZE; k++) {
    this.outputData[k] = null;
    this.cmd("SetText", this.outputRects[k], "");
    this.cmd(
      "SetBackgroundColor",
      this.outputRects[k],
      CountingSort.OUTPUT_DEFAULT_COLOR
    );
    this.cmd(
      "SetBackgroundColor",
      this.arrayRects[k],
      CountingSort.INPUT_DEFAULT_COLOR
    );
  }

  this.setInfo("Count how often each value appears.", true);
  this.highlightCode(0, 0, true);
  this.highlightCode(0, 1, true);
  this.highlightCode(0, 2, true);
  this.highlightCode(1, 0, true);

  for (var idx = 0; idx < this.arrayData.length; idx++) {
    this.highlightCode(1, 1, true);
    this.setInputHighlight(idx, true);
    var value = this.arrayData[idx];
    this.setInfo("Read value " + value + " at index " + idx + ".", true);

    this.highlightCode(1, 2, true);
    this.setCountHighlight(value, "active");
    this.countData[value] += 1;
    this.cmd("SetText", this.countRects[value], this.countData[value]);
    this.setInfo(
      "Increment count[" + value + "] to " + this.countData[value] + ".",
      true
    );

    this.setInputHighlight(idx, false);
    this.setCountHighlight(value, "default");
  }

  this.highlightCode(1, 3, true);
  this.highlightCode(2, 0, true);
  this.setInfo("Build prefix sums to convert counts into positions.", true);

  for (var c = 1; c < this.countData.length; c++) {
    this.highlightCode(2, 1, true);
    this.setCountHighlight(c - 1, "prefix");
    this.setCountHighlight(c, "active");
    var newValue = this.countData[c] + this.countData[c - 1];
    this.highlightCode(2, 2, true);
    this.setInfo(
      "count[" + c + "] becomes " + newValue +
        " (adding count[" + (c - 1) + "]).",
      true
    );
    this.countData[c] = newValue;
    this.cmd("SetText", this.countRects[c], this.countData[c]);
    this.setCountHighlight(c - 1, "default");
    this.setCountHighlight(c, "default");
  }

  this.highlightCode(2, 3, true);
  this.highlightCode(0, 3, false);
  this.highlightCode(0, 4, true);
  this.highlightCode(3, 0, true);
  this.highlightCode(3, 1, true);
  this.setInfo("Traverse the input backwards to place each value.", true);

  for (var pos = this.arrayData.length - 1; pos >= 0; pos--) {
    this.highlightCode(3, 2, true);
    this.setInputHighlight(pos, true);
    var current = this.arrayData[pos];
    this.setInfo(
      "Value " + current + " leaves index " + pos + " for its final spot.",
      true
    );

    this.highlightCode(3, 3, true);
    this.setCountHighlight(current, "active");
    this.countData[current] -= 1;
    var target = this.countData[current];
    this.cmd("SetText", this.countRects[current], this.countData[current]);

    this.highlightCode(3, 4, true);
    this.setOutputHighlight(target, "active");
    var moveLabel = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      moveLabel,
      current,
      this.arrayPositions[pos],
      CountingSort.INPUT_Y
    );
    this.cmd("SetForegroundColor", moveLabel, CountingSort.MOVE_LABEL_COLOR);
    this.cmd("Move", moveLabel, this.outputPositions[target], CountingSort.OUTPUT_Y);
    this.cmd("Step");
    this.cmd("Delete", moveLabel);
    this.nextIndex--;

    this.outputData[target] = current;
    this.cmd("SetText", this.outputRects[target], current);
    this.cmd(
      "SetBackgroundColor",
      this.outputRects[target],
      CountingSort.OUTPUT_FINAL_COLOR
    );

    this.setInfo(
      "Place " + current + " at output index " + target + ".",
      true
    );
    this.setInputHighlight(pos, false);
    this.setCountHighlight(current, "default");
    this.setOutputHighlight(target, "final");
  }

  this.highlightCode(3, 5, true);
  this.highlightCode(3, 6, true);
  this.highlightCode(0, 5, true);
  this.highlightCode(4, 0, true);
  this.setInfo("Copy the sorted values back into the input array.", true);

  for (var copyIdx = 0; copyIdx < this.outputData.length; copyIdx++) {
    this.highlightCode(4, 1, true);
    this.setOutputHighlight(copyIdx, "active");
    this.setInputHighlight(copyIdx, true);
    var sortedValue = this.outputData[copyIdx];
    this.highlightCode(4, 2, true);
    var copyLabel = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      copyLabel,
      sortedValue,
      this.outputPositions[copyIdx],
      CountingSort.OUTPUT_Y
    );
    this.cmd("SetForegroundColor", copyLabel, CountingSort.MOVE_LABEL_COLOR);
    this.cmd(
      "Move",
      copyLabel,
      this.arrayPositions[copyIdx],
      CountingSort.INPUT_Y
    );
    this.cmd("Step");
    this.cmd("Delete", copyLabel);
    this.nextIndex--;
    this.cmd("SetText", this.arrayRects[copyIdx], sortedValue);
    this.cmd(
      "SetBackgroundColor",
      this.arrayRects[copyIdx],
      CountingSort.INPUT_FINAL_COLOR
    );
    this.setInfo(
      "arr[" + copyIdx + "] becomes " + sortedValue + ".",
      true
    );
    this.setOutputHighlight(copyIdx, "final");
    this.setInputHighlight(copyIdx, false, true);
  }

  this.highlightCode(4, 3, true);
  this.highlightCode(4, 4, true);
  this.highlightCode(0, 6, true);
  this.highlightCode(-1, -1, false);

  this.setInfo("Counting sort complete!", true);
  this.enableUI();
  return this.commands;
};

CountingSort.prototype.setInfo = function (text, stepAfter) {
  this.cmd("SetText", this.infoLabelID, text);
  if (stepAfter) {
    this.cmd("Step");
  }
};

CountingSort.prototype.setInputHighlight = function (index, highlight, final) {
  if (index < 0 || index >= this.arrayRects.length) {
    return;
  }
  var color = CountingSort.INPUT_DEFAULT_COLOR;
  if (final) {
    color = CountingSort.INPUT_FINAL_COLOR;
  } else if (highlight) {
    color = CountingSort.INPUT_ACTIVE_COLOR;
  }
  this.cmd("SetBackgroundColor", this.arrayRects[index], color);
};

CountingSort.prototype.setCountHighlight = function (index, mode) {
  if (index < 0 || index >= this.countRects.length) {
    return;
  }
  var color = CountingSort.COUNT_DEFAULT_COLOR;
  if (mode === "active") {
    color = CountingSort.COUNT_ACTIVE_COLOR;
  } else if (mode === "prefix") {
    color = CountingSort.COUNT_PREFIX_COLOR;
  }
  this.cmd("SetBackgroundColor", this.countRects[index], color);
};

CountingSort.prototype.setOutputHighlight = function (index, mode) {
  if (index < 0 || index >= this.outputRects.length) {
    return;
  }
  var color = CountingSort.OUTPUT_DEFAULT_COLOR;
  if (mode === "active") {
    color = CountingSort.OUTPUT_ACTIVE_COLOR;
  } else if (mode === "final") {
    color = CountingSort.OUTPUT_FINAL_COLOR;
  }
  this.cmd("SetBackgroundColor", this.outputRects[index], color);
};

CountingSort.prototype.clearCodeHighlights = function () {
  if (this.codeIDs && this.codeIDs.length > 0) {
    for (var section = 0; section < this.codeIDs.length; section++) {
      var lines = this.codeIDs[section];
      for (var i = 0; i < lines.length; i++) {
        this.cmd(
          "SetForegroundColor",
          lines[i],
          CountingSort.CODE_STANDARD_COLOR
        );
      }
    }
  }
  this.highlightedSection = -1;
  this.highlightedLine = -1;
};

CountingSort.prototype.highlightCode = function (section, line, withStep) {
  if (
    this.highlightedSection === section &&
    this.highlightedLine === line &&
    section >= 0 &&
    line >= 0
  ) {
    if (withStep) {
      this.cmd("Step");
    }
    return;
  }

  if (this.highlightedSection >= 0 && this.highlightedLine >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[this.highlightedSection][this.highlightedLine],
      CountingSort.CODE_STANDARD_COLOR
    );
  }

  if (section >= 0 && line >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[section][line],
      CountingSort.CODE_HIGHLIGHT_COLOR
    );
  }

  this.highlightedSection = section;
  this.highlightedLine = line;

  if (withStep) {
    this.cmd("Step");
  }
};

CountingSort.prototype.disableUI = function () {
  this.randomizeButton.disabled = true;
  this.sortButton.disabled = true;
};

CountingSort.prototype.enableUI = function () {
  this.randomizeButton.disabled = false;
  this.sortButton.disabled = false;
};

CountingSort.prototype.reset = function () {
  return this.randomizeArray(false);
};

var currentAlg = null;

function init() {
  var animManag = initCanvas();
  if (typeof canvas !== "undefined") {
    canvas.width = CountingSort.CANVAS_WIDTH;
    canvas.height = CountingSort.CANVAS_HEIGHT;
  }
  if (animManag && animManag.animatedObjects) {
    animManag.animatedObjects.width = CountingSort.CANVAS_WIDTH;
    animManag.animatedObjects.height = CountingSort.CANVAS_HEIGHT;
  }
  currentAlg = new CountingSort(
    animManag,
    CountingSort.CANVAS_WIDTH,
    CountingSort.CANVAS_HEIGHT
  );
}
