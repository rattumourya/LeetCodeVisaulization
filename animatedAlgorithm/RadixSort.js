// Custom radix sort visualization in the 720x1280 layout used by the Heap Sort
// demo. The animation walks through each stable counting sort pass that radix
// sort performs, highlighting how the algorithm buckets digits, builds
// positions, and copies the partially sorted output back for the next pass.

function RadixSort(am, w, h) {
  this.init(am, w, h);
}

RadixSort.prototype = new Algorithm();
RadixSort.prototype.constructor = RadixSort;
RadixSort.superclass = Algorithm.prototype;

RadixSort.CANVAS_WIDTH = 720;
RadixSort.CANVAS_HEIGHT = 1280;

RadixSort.ARRAY_SIZE = 9;
RadixSort.MAX_VALUE = 999;
RadixSort.BASE = 10;
RadixSort.COUNT_SIZE = RadixSort.BASE;

RadixSort.RECT_WIDTH = 54;
RadixSort.RECT_HEIGHT = 48;
RadixSort.ARRAY_SPACING = 62;

RadixSort.INPUT_Y = 240;
RadixSort.COUNT_Y = 440;
RadixSort.OUTPUT_Y = 640;
RadixSort.ARRAY_LABEL_GAP = 62;
RadixSort.INDEX_GAP = 36;

RadixSort.PASS_INFO_Y = 200;
RadixSort.EXP_INFO_Y = RadixSort.PASS_INFO_Y + 36;

RadixSort.TITLE_Y = 60;
RadixSort.INFO_Y = 140;

RadixSort.CODE_START_Y = RadixSort.OUTPUT_Y + 120;
RadixSort.CODE_LINE_HEIGHT = 22;
RadixSort.CODE_FONT = "bold 18";
RadixSort.CODE_SECTION_GAP = 32;
RadixSort.CODE_COLUMNS = [150, 520];
RadixSort.CODE_LAYOUT = [0, 1, 1, 1, 1];

RadixSort.INPUT_DEFAULT_COLOR = "#edf2fb";
RadixSort.INPUT_ACTIVE_COLOR = "#ffcad4";
RadixSort.INPUT_FINAL_COLOR = "#a9def9";
RadixSort.INPUT_BORDER_COLOR = "#1d3557";
RadixSort.INPUT_DIM_ALPHA = 0.25;

RadixSort.COUNT_DEFAULT_COLOR = "#e0fbfc";
RadixSort.COUNT_ACTIVE_COLOR = "#ffd166";
RadixSort.COUNT_PREFIX_COLOR = "#a3c4f3";
RadixSort.COUNT_BORDER_COLOR = "#1d3557";

RadixSort.OUTPUT_DEFAULT_COLOR = "#dee2ff";
RadixSort.OUTPUT_ACTIVE_COLOR = "#90e0ef";
RadixSort.OUTPUT_FINAL_COLOR = "#8ac926";
RadixSort.OUTPUT_BORDER_COLOR = "#1d3557";

RadixSort.INDEX_COLOR = "#0b2545";
RadixSort.TITLE_COLOR = "#1d3557";
RadixSort.INFO_COLOR = "#2b2d42";
RadixSort.CODE_STANDARD_COLOR = "#1d3557";
RadixSort.CODE_HIGHLIGHT_COLOR = "#d62828";
RadixSort.MOVE_LABEL_COLOR = "#003049";
RadixSort.PLACE_NAMES = [
  "ones",
  "tens",
  "hundreds",
  "thousands",
  "ten-thousands",
  "hundred-thousands",
];

RadixSort.CODE_SECTIONS = [
  {
    lines: [
      "void radixSort(int[] arr) {",
      "  int max = findMax(arr);",
      "  for (int exp = 1; max / exp > 0; exp *= 10) {",
      "    countingSortByDigit(arr, exp);",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "void countingSortByDigit(int[] arr, int exp) {",
      "  int[] count = new int[10];",
      "  for (int value : arr) {",
      "    int digit = (value / exp) % 10;",
      "    count[digit]++;",
      "  }",
    ],
  },
  {
    lines: [
      "  for (int i = 1; i < 10; i++) {",
      "    count[i] += count[i - 1];",
      "  }",
    ],
  },
  {
    lines: [
      "  int[] out = new int[arr.length];",
      "  for (int i = arr.length - 1; i >= 0; i--) {",
      "    int value = arr[i];",
      "    int digit = (value / exp) % 10;",
      "    out[--count[digit]] = value;",
      "  }",
    ],
  },
  {
    lines: [
      "  for (int i = 0; i < arr.length; i++) {",
      "    arr[i] = out[i];",
      "  }",
      "}",
    ],
  },
];

RadixSort.prototype.init = function (am, w, h) {
  RadixSort.superclass.init.call(this, am, w, h);

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

  this.arrayData = new Array(RadixSort.ARRAY_SIZE);
  this.arrayRects = new Array(RadixSort.ARRAY_SIZE);
  this.arrayIndexLabels = new Array(RadixSort.ARRAY_SIZE);
  this.arrayPositions = new Array(RadixSort.ARRAY_SIZE);

  this.countData = new Array(RadixSort.COUNT_SIZE);
  this.countRects = new Array(RadixSort.COUNT_SIZE);
  this.countIndexLabels = new Array(RadixSort.COUNT_SIZE);
  this.countPositions = new Array(RadixSort.COUNT_SIZE);

  this.outputData = new Array(RadixSort.ARRAY_SIZE);
  this.outputRects = new Array(RadixSort.ARRAY_SIZE);
  this.outputIndexLabels = new Array(RadixSort.ARRAY_SIZE);
  this.outputPositions = new Array(RadixSort.ARRAY_SIZE);

  this.codeIDs = [];
  this.highlightedSection = -1;
  this.highlightedLine = -1;
  this.inputDimmed = false;

  this.commands = [];

  this.createTitle();
  this.createInfoPanel();
  this.createPassDetails();
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

RadixSort.prototype.addControls = function () {
  this.randomizeButton = addControlToAlgorithmBar(
    "Button",
    "Randomize Array"
  );
  this.randomizeButton.onclick = this.randomizeCallback.bind(this);

  this.sortButton = addControlToAlgorithmBar("Button", "Radix Sort");
  this.sortButton.onclick = this.sortCallback.bind(this);
};

RadixSort.prototype.createTitle = function () {
  this.titleLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleLabelID,
    "Radix Sort",
    RadixSort.CANVAS_WIDTH / 2,
    RadixSort.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleLabelID, "bold 34");
  this.cmd("SetForegroundColor", this.titleLabelID, RadixSort.TITLE_COLOR);
};

RadixSort.prototype.createInfoPanel = function () {
  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    RadixSort.CANVAS_WIDTH / 2,
    RadixSort.INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, RadixSort.INFO_COLOR);
};

RadixSort.prototype.createPassDetails = function () {
  this.passLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.passLabelID,
    "",
    RadixSort.CANVAS_WIDTH / 2,
    RadixSort.PASS_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.passLabelID, "italic 18");
  this.cmd("SetForegroundColor", this.passLabelID, RadixSort.INFO_COLOR);

  this.exponentLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.exponentLabelID,
    "",
    RadixSort.CANVAS_WIDTH / 2,
    RadixSort.EXP_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.exponentLabelID, "bold 20");
  this.cmd("SetForegroundColor", this.exponentLabelID, RadixSort.INFO_COLOR);
};

RadixSort.prototype.createInputArray = function () {
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Input Array",
    RadixSort.CANVAS_WIDTH / 2,
    RadixSort.INPUT_Y - RadixSort.ARRAY_LABEL_GAP,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, RadixSort.INFO_COLOR);

  var startX =
    RadixSort.CANVAS_WIDTH / 2 -
    ((RadixSort.ARRAY_SIZE - 1) * RadixSort.ARRAY_SPACING) / 2;

  for (var i = 0; i < RadixSort.ARRAY_SIZE; i++) {
    var x = startX + i * RadixSort.ARRAY_SPACING;
    this.arrayPositions[i] = x;

    var rectID = this.nextIndex++;
    this.arrayRects[i] = rectID;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      RadixSort.RECT_WIDTH,
      RadixSort.RECT_HEIGHT,
      x,
      RadixSort.INPUT_Y,
      "center",
      "center"
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      RadixSort.INPUT_DEFAULT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, RadixSort.INPUT_BORDER_COLOR);

    var indexID = this.nextIndex++;
    this.arrayIndexLabels[i] = indexID;
    this.cmd(
      "CreateLabel",
      indexID,
      i,
      x,
      RadixSort.INPUT_Y + RadixSort.RECT_HEIGHT / 2 + RadixSort.INDEX_GAP,
      0
    );
    this.cmd("SetTextStyle", indexID, "bold 16");
    this.cmd("SetForegroundColor", indexID, RadixSort.INDEX_COLOR);
  }
};

RadixSort.prototype.createCountArray = function () {
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Count of Values",
    RadixSort.CANVAS_WIDTH / 2,
    RadixSort.COUNT_Y - RadixSort.ARRAY_LABEL_GAP,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, RadixSort.INFO_COLOR);

  var startX =
    RadixSort.CANVAS_WIDTH / 2 -
    ((RadixSort.COUNT_SIZE - 1) * RadixSort.ARRAY_SPACING) / 2;

  for (var i = 0; i < RadixSort.COUNT_SIZE; i++) {
    var x = startX + i * RadixSort.ARRAY_SPACING;
    this.countPositions[i] = x;

    var rectID = this.nextIndex++;
    this.countRects[i] = rectID;
    this.cmd(
      "CreateRectangle",
      rectID,
      "0",
      RadixSort.RECT_WIDTH,
      RadixSort.RECT_HEIGHT,
      x,
      RadixSort.COUNT_Y,
      "center",
      "center"
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      RadixSort.COUNT_DEFAULT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, RadixSort.COUNT_BORDER_COLOR);

    var indexID = this.nextIndex++;
    this.countIndexLabels[i] = indexID;
    this.cmd(
      "CreateLabel",
      indexID,
      i,
      x,
      RadixSort.COUNT_Y + RadixSort.RECT_HEIGHT / 2 + RadixSort.INDEX_GAP,
      0
    );
    this.cmd("SetTextStyle", indexID, "bold 16");
    this.cmd("SetForegroundColor", indexID, RadixSort.INDEX_COLOR);

    this.countData[i] = 0;
  }
};

RadixSort.prototype.createOutputArray = function () {
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Output Array",
    RadixSort.CANVAS_WIDTH / 2,
    RadixSort.OUTPUT_Y - RadixSort.ARRAY_LABEL_GAP,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, RadixSort.INFO_COLOR);

  var startX =
    RadixSort.CANVAS_WIDTH / 2 -
    ((RadixSort.ARRAY_SIZE - 1) * RadixSort.ARRAY_SPACING) / 2;

  for (var i = 0; i < RadixSort.ARRAY_SIZE; i++) {
    var x = startX + i * RadixSort.ARRAY_SPACING;
    this.outputPositions[i] = x;

    var rectID = this.nextIndex++;
    this.outputRects[i] = rectID;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      RadixSort.RECT_WIDTH,
      RadixSort.RECT_HEIGHT,
      x,
      RadixSort.OUTPUT_Y,
      "center",
      "center"
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      RadixSort.OUTPUT_DEFAULT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, RadixSort.OUTPUT_BORDER_COLOR);

    var indexID = this.nextIndex++;
    this.outputIndexLabels[i] = indexID;
    this.cmd(
      "CreateLabel",
      indexID,
      i,
      x,
      RadixSort.OUTPUT_Y + RadixSort.RECT_HEIGHT / 2 + RadixSort.INDEX_GAP,
      0
    );
    this.cmd("SetTextStyle", indexID, "bold 16");
    this.cmd("SetForegroundColor", indexID, RadixSort.INDEX_COLOR);

    this.outputData[i] = null;
  }
};

RadixSort.prototype.createCodeDisplay = function () {
  this.codeIDs = [];
  var columnHeights = [];
  for (var c = 0; c < RadixSort.CODE_COLUMNS.length; c++) {
    columnHeights[c] = RadixSort.CODE_START_Y;
  }

  for (var sectionIndex = 0; sectionIndex < RadixSort.CODE_SECTIONS.length; sectionIndex++) {
    var section = RadixSort.CODE_SECTIONS[sectionIndex];
    var columnIndex = RadixSort.CODE_LAYOUT[sectionIndex];
    var columnX = RadixSort.CODE_COLUMNS[columnIndex];
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
      this.cmd("SetTextStyle", labelID, RadixSort.CODE_FONT);
      this.cmd(
        "SetForegroundColor",
        labelID,
        RadixSort.CODE_STANDARD_COLOR
      );
      lineIDs.push(labelID);
      currentY += RadixSort.CODE_LINE_HEIGHT;
    }
    this.codeIDs.push(lineIDs);
    columnHeights[columnIndex] = currentY + RadixSort.CODE_SECTION_GAP;
  }
};

RadixSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this, true), 0);
};

RadixSort.prototype.sortCallback = function () {
  this.implementAction(this.runRadixSort.bind(this), 0);
};

RadixSort.prototype.randomizeValues = function (showMessage) {
  for (var i = 0; i < RadixSort.ARRAY_SIZE; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.cmd("SetText", this.arrayRects[i], value);
    this.cmd(
      "SetBackgroundColor",
      this.arrayRects[i],
      RadixSort.INPUT_DEFAULT_COLOR
    );
    this.cmd("SetAlpha", this.arrayRects[i], 1);
  }
  this.inputDimmed = false;

  this.resetBucketsAndOutput();
  this.clearPassDisplay();
  this.clearCodeHighlights();
  if (showMessage) {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Array randomized. Ready for radix sort passes!"
    );
    this.cmd("Step");
  }
};

RadixSort.prototype.randomizeArray = function (showMessage) {
  this.commands = [];
  this.randomizeValues(showMessage);
  return this.commands;
};

RadixSort.prototype.resetBucketsAndOutput = function () {
  for (var j = 0; j < RadixSort.COUNT_SIZE; j++) {
    this.countData[j] = 0;
    this.cmd("SetText", this.countRects[j], 0);
    this.cmd(
      "SetBackgroundColor",
      this.countRects[j],
      RadixSort.COUNT_DEFAULT_COLOR
    );
  }

  for (var k = 0; k < RadixSort.ARRAY_SIZE; k++) {
    this.outputData[k] = null;
    this.cmd("SetText", this.outputRects[k], "");
    this.cmd(
      "SetBackgroundColor",
      this.outputRects[k],
      RadixSort.OUTPUT_DEFAULT_COLOR
    );
  }
};

RadixSort.prototype.generateRandomValue = function () {
  return Math.floor(Math.random() * (RadixSort.MAX_VALUE + 1));
};

RadixSort.prototype.runRadixSort = function () {
  this.commands = [];
  this.disableUI();
  this.clearCodeHighlights();

  for (var idx = 0; idx < this.arrayRects.length; idx++) {
    this.cmd(
      "SetBackgroundColor",
      this.arrayRects[idx],
      RadixSort.INPUT_DEFAULT_COLOR
    );
  }
  this.resetBucketsAndOutput();
  this.restoreInputAlpha();

  this.highlightCode(0, 0, true);
  this.highlightCode(0, 1, true);
  var maxValue = 0;
  for (var m = 0; m < this.arrayData.length; m++) {
    if (this.arrayData[m] > maxValue) {
      maxValue = this.arrayData[m];
    }
  }
  this.setInfo(
    "Largest value is " + maxValue + ", so we know how many digits to inspect.",
    true
  );

  var totalPasses = 0;
  var tempExp = 1;
  while (Math.floor(maxValue / tempExp) > 0) {
    totalPasses += 1;
    tempExp *= RadixSort.BASE;
  }
  if (totalPasses === 0) {
    totalPasses = 1;
  }

  this.highlightCode(0, 2, true);
  this.setInfo("We will run " + totalPasses + " digit pass(es).", true);

  var exp = 1;
  for (var pass = 0; pass < totalPasses; pass++) {
    var placeName = this.getPlaceName(pass);
    this.highlightCode(0, 3, true);
    this.updatePassDisplay(pass, totalPasses, exp);
    this.setInfo(
      "Pass " + (pass + 1) + ": bucket values by the " + placeName + " digit.",
      true
    );
    this.resetBucketsAndOutput();
    this.dimInputForPass();

    this.highlightCode(1, 0, true);
    this.highlightCode(1, 1, true);
    this.highlightCode(1, 2, true);

    for (var i = 0; i < this.arrayData.length; i++) {
      this.setInputHighlight(i, true);
      this.highlightCode(1, 3, true);
      var value = this.arrayData[i];
      var digit = this.getDigitForValue(value, exp);
      this.setInfo(
        "Value " + value + " contributes digit " + digit + " in the " +
          placeName + " place.",
        true
      );
      this.highlightCode(1, 4, true);
      this.setCountHighlight(digit, "active");
      this.countData[digit] += 1;
      this.cmd("SetText", this.countRects[digit], this.countData[digit]);
      this.setInfo(
        "Increment bucket " + digit + " to " + this.countData[digit] + ".",
        true
      );
      this.setInputHighlight(i, false);
      this.setCountHighlight(digit, "default");
    }

    this.highlightCode(1, 5, true);
    this.highlightCode(2, 0, true);
    this.setInfo(
      "Build running totals so each digit knows its output range.",
      true
    );

    for (var c = 1; c < this.countData.length; c++) {
      this.highlightCode(2, 1, true);
      this.setCountHighlight(c - 1, "prefix");
      this.setCountHighlight(c, "active");
      var newValue = this.countData[c] + this.countData[c - 1];
      this.countData[c] = newValue;
      this.cmd("SetText", this.countRects[c], newValue);
      this.setInfo(
        "Bucket " + c + " now holds position " + newValue + ".",
        true
      );
      this.setCountHighlight(c - 1, "default");
      this.setCountHighlight(c, "default");
    }
    this.highlightCode(2, 2, true);

    this.highlightCode(3, 0, true);
    this.highlightCode(3, 1, true);
    this.setInfo(
      "Place elements into the output array from right to left for stability.",
      true
    );

    for (var pos = this.arrayData.length - 1; pos >= 0; pos--) {
      this.highlightCode(3, 2, true);
      this.setInputHighlight(pos, true);
      var current = this.arrayData[pos];
      this.setInfo(
        "Take value " + current + " from index " + pos + ".",
        true
      );
      this.highlightCode(3, 3, true);
      var currentDigit = this.getDigitForValue(current, exp);
      this.setCountHighlight(currentDigit, "active");
      this.highlightCode(3, 4, true);
      this.countData[currentDigit] -= 1;
      var target = this.countData[currentDigit];
      this.cmd("SetText", this.countRects[currentDigit], this.countData[currentDigit]);
      this.setOutputHighlight(target, "active");
      var moveLabel = this.nextIndex++;
      this.cmd(
        "CreateLabel",
        moveLabel,
        current,
        this.arrayPositions[pos],
        RadixSort.INPUT_Y
      );
      this.cmd("SetForegroundColor", moveLabel, RadixSort.MOVE_LABEL_COLOR);
      this.cmd(
        "Move",
        moveLabel,
        this.outputPositions[target],
        RadixSort.OUTPUT_Y
      );
      this.cmd("Step");
      this.cmd("Delete", moveLabel);
      this.nextIndex--;
      this.outputData[target] = current;
      this.cmd("SetText", this.outputRects[target], current);
      this.cmd(
        "SetBackgroundColor",
        this.outputRects[target],
        RadixSort.OUTPUT_FINAL_COLOR
      );
      this.setInfo(
        "Place " + current + " in output slot " + target + ".",
        true
      );
      this.setInputHighlight(pos, false);
      this.setCountHighlight(currentDigit, "default");
      this.setOutputHighlight(target, "final");
    }

    this.highlightCode(4, 0, true);
    this.setInfo(
      "Copy the partially sorted values back into the input array.",
      true
    );

    for (var copyIdx = 0; copyIdx < this.outputData.length; copyIdx++) {
      this.highlightCode(4, 1, true);
      this.setOutputHighlight(copyIdx, "active");
      this.setInputHighlight(copyIdx, true);
      var sortedValue = this.outputData[copyIdx];
      var copyLabel = this.nextIndex++;
      this.cmd(
        "CreateLabel",
        copyLabel,
        sortedValue,
        this.outputPositions[copyIdx],
        RadixSort.OUTPUT_Y
      );
      this.cmd("SetForegroundColor", copyLabel, RadixSort.MOVE_LABEL_COLOR);
      this.cmd(
        "Move",
        copyLabel,
        this.arrayPositions[copyIdx],
        RadixSort.INPUT_Y
      );
      this.cmd("Step");
      this.cmd("Delete", copyLabel);
      this.nextIndex--;
      this.cmd("SetText", this.arrayRects[copyIdx], sortedValue);
      this.setInfo(
        "arr[" + copyIdx + "] becomes " + sortedValue + ".",
        true
      );
      var finalPass = pass === totalPasses - 1;
      this.setInputHighlight(copyIdx, false, finalPass);
      this.setOutputHighlight(copyIdx, "final");
    }
    this.restoreInputAlpha();
    this.highlightCode(4, 2, true);
    this.highlightCode(4, 3, true);

    if (pass < totalPasses - 1) {
      this.setInfo(
        "End of pass " + (pass + 1) + ". Prepare for the next digit.",
        true
      );
    }

    exp *= RadixSort.BASE;
  }

  this.highlightCode(0, 4, true);
  this.highlightCode(0, 5, true);
  this.highlightCode(-1, -1, false);
  this.setInfo("Radix sort complete!", true);
  this.cmd("SetText", this.passLabelID, "All passes complete.");
  this.cmd("SetText", this.exponentLabelID, "");
  this.enableUI();
  return this.commands;
};

RadixSort.prototype.setInfo = function (text, stepAfter) {
  this.cmd("SetText", this.infoLabelID, text);
  if (stepAfter) {
    this.cmd("Step");
  }
};

RadixSort.prototype.updatePassDisplay = function (passIndex, totalPasses, exp) {
  var place = this.getPlaceName(passIndex);
  this.cmd(
    "SetText",
    this.passLabelID,
    "Pass " + (passIndex + 1) + "/" + totalPasses +
      " – sorting by the " + place + " digit"
  );
  this.cmd(
    "SetText",
    this.exponentLabelID,
    "exp = " + exp + ", base = " + RadixSort.BASE
  );
};

RadixSort.prototype.clearPassDisplay = function () {
  this.cmd("SetText", this.passLabelID, "");
  this.cmd("SetText", this.exponentLabelID, "");
};

RadixSort.prototype.getDigitForValue = function (value, exp) {
  return Math.floor(value / exp) % RadixSort.BASE;
};

RadixSort.prototype.getPlaceName = function (passIndex) {
  if (passIndex >= 0 && passIndex < RadixSort.PLACE_NAMES.length) {
    return RadixSort.PLACE_NAMES[passIndex];
  }
  return "10^" + passIndex;
};

RadixSort.prototype.dimInputForPass = function () {
  this.inputDimmed = true;
  for (var i = 0; i < this.arrayRects.length; i++) {
    this.cmd("SetAlpha", this.arrayRects[i], RadixSort.INPUT_DIM_ALPHA);
  }
};

RadixSort.prototype.restoreInputAlpha = function () {
  this.inputDimmed = false;
  for (var i = 0; i < this.arrayRects.length; i++) {
    this.cmd("SetAlpha", this.arrayRects[i], 1);
  }
};

RadixSort.prototype.setInputHighlight = function (index, highlight, final) {
  if (index < 0 || index >= this.arrayRects.length) {
    return;
  }
  var color = RadixSort.INPUT_DEFAULT_COLOR;
  if (final) {
    color = RadixSort.INPUT_FINAL_COLOR;
  } else if (highlight) {
    color = RadixSort.INPUT_ACTIVE_COLOR;
  }
  var alpha = this.inputDimmed ? RadixSort.INPUT_DIM_ALPHA : 1;
  var targetAlpha = alpha;
  if (highlight || final) {
    targetAlpha = 1;
  }
  this.cmd("SetBackgroundColor", this.arrayRects[index], color);
  this.cmd("SetAlpha", this.arrayRects[index], targetAlpha);
};

RadixSort.prototype.setCountHighlight = function (index, mode) {
  if (index < 0 || index >= this.countRects.length) {
    return;
  }
  var color = RadixSort.COUNT_DEFAULT_COLOR;
  if (mode === "active") {
    color = RadixSort.COUNT_ACTIVE_COLOR;
  } else if (mode === "prefix") {
    color = RadixSort.COUNT_PREFIX_COLOR;
  }
  this.cmd("SetBackgroundColor", this.countRects[index], color);
};

RadixSort.prototype.setOutputHighlight = function (index, mode) {
  if (index < 0 || index >= this.outputRects.length) {
    return;
  }
  var color = RadixSort.OUTPUT_DEFAULT_COLOR;
  if (mode === "active") {
    color = RadixSort.OUTPUT_ACTIVE_COLOR;
  } else if (mode === "final") {
    color = RadixSort.OUTPUT_FINAL_COLOR;
  }
  this.cmd("SetBackgroundColor", this.outputRects[index], color);
};

RadixSort.prototype.clearCodeHighlights = function () {
  if (this.codeIDs && this.codeIDs.length > 0) {
    for (var section = 0; section < this.codeIDs.length; section++) {
      var lines = this.codeIDs[section];
      for (var i = 0; i < lines.length; i++) {
        this.cmd(
          "SetForegroundColor",
          lines[i],
          RadixSort.CODE_STANDARD_COLOR
        );
      }
    }
  }
  this.highlightedSection = -1;
  this.highlightedLine = -1;
};

RadixSort.prototype.highlightCode = function (section, line, withStep) {
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
      RadixSort.CODE_STANDARD_COLOR
    );
  }

  if (section >= 0 && line >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[section][line],
      RadixSort.CODE_HIGHLIGHT_COLOR
    );
  }

  this.highlightedSection = section;
  this.highlightedLine = line;

  if (withStep) {
    this.cmd("Step");
  }
};

RadixSort.prototype.disableUI = function () {
  this.randomizeButton.disabled = true;
  this.sortButton.disabled = true;
};

RadixSort.prototype.enableUI = function () {
  this.randomizeButton.disabled = false;
  this.sortButton.disabled = false;
};

RadixSort.prototype.reset = function () {
  return this.randomizeArray(false);
};

var currentAlg = null;

function init() {
  var animManag = initCanvas();
  if (typeof canvas !== "undefined") {
    canvas.width = RadixSort.CANVAS_WIDTH;
    canvas.height = RadixSort.CANVAS_HEIGHT;
  }
  if (animManag && animManag.animatedObjects) {
    animManag.animatedObjects.width = RadixSort.CANVAS_WIDTH;
    animManag.animatedObjects.height = RadixSort.CANVAS_HEIGHT;
  }
  currentAlg = new RadixSort(
    animManag,
    RadixSort.CANVAS_WIDTH,
    RadixSort.CANVAS_HEIGHT
  );
}
