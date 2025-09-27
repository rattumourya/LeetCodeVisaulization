// Custom bucket sort visualization that uses the tall 720x1280 layout that is
// shared by the modern animations in this project. The animation mirrors the
// behaviour of AlgorithmLibrary/BucketSort.js but restructures the visual
// presentation so it fits in the portrait canvas and highlights the key steps
// of the algorithm: distributing values into buckets, sorting each bucket, and
// concatenating the buckets back into the output array.

function BucketSort(am, w, h) {
  this.init(am, w, h);
}

BucketSort.prototype = new Algorithm();
BucketSort.prototype.constructor = BucketSort;
BucketSort.superclass = Algorithm.prototype;

BucketSort.CANVAS_WIDTH = 720;
BucketSort.CANVAS_HEIGHT = 1280;

BucketSort.ARRAY_SIZE = 10;
BucketSort.MAX_VALUE = 99;
BucketSort.BUCKET_COUNT = 5;
BucketSort.BUCKET_CAPACITY = 6;

BucketSort.RECT_WIDTH = 54;
BucketSort.RECT_HEIGHT = 48;
BucketSort.ARRAY_SPACING = 62;
BucketSort.BUCKET_SPACING = 120;
BucketSort.BUCKET_VERTICAL_GAP = 58;

BucketSort.INPUT_Y = 220;
BucketSort.BUCKET_TOP_Y = 480;
BucketSort.BUCKET_LABEL_Y = 420;
BucketSort.OUTPUT_Y = 920;
BucketSort.ARRAY_LABEL_GAP = 62;
BucketSort.INDEX_GAP = 36;

BucketSort.TITLE_Y = 60;
BucketSort.INFO_Y = 140;

BucketSort.CODE_START_Y = 1060;
BucketSort.CODE_LINE_HEIGHT = 22;
BucketSort.CODE_FONT = "bold 18";
BucketSort.CODE_SECTION_GAP = 28;
BucketSort.CODE_COLUMNS = [110, 420];
BucketSort.CODE_LAYOUT = [0, 0, 0, 1, 1];

BucketSort.INPUT_DEFAULT_COLOR = "#edf2fb";
BucketSort.INPUT_ACTIVE_COLOR = "#ffcad4";
BucketSort.INPUT_FINAL_COLOR = "#a9def9";
BucketSort.INPUT_BORDER_COLOR = "#1d3557";

BucketSort.BUCKET_DEFAULT_COLOR = "#fcefb4";
BucketSort.BUCKET_ACTIVE_COLOR = "#ffd166";
BucketSort.BUCKET_SORTED_COLOR = "#a3c4f3";
BucketSort.BUCKET_BORDER_COLOR = "#1d3557";

BucketSort.OUTPUT_DEFAULT_COLOR = "#dee2ff";
BucketSort.OUTPUT_ACTIVE_COLOR = "#90e0ef";
BucketSort.OUTPUT_FINAL_COLOR = "#8ac926";
BucketSort.OUTPUT_BORDER_COLOR = "#1d3557";

BucketSort.INDEX_COLOR = "#0b2545";
BucketSort.TITLE_COLOR = "#1d3557";
BucketSort.INFO_COLOR = "#2b2d42";
BucketSort.CODE_STANDARD_COLOR = "#1d3557";
BucketSort.CODE_HIGHLIGHT_COLOR = "#d62828";

BucketSort.CODE_SECTIONS = [
  {
    lines: [
      "void bucketSort(int[] arr) {",
      "  List<List<Integer>> buckets = initBuckets(BUCKET_COUNT);",
      "  distribute(arr, buckets);",
      "  sortBuckets(buckets);",
      "  gather(arr, buckets);",
      "}",
    ],
  },
  {
    lines: [
      "List<List<Integer>> initBuckets(int k) {",
      "  List<List<Integer>> buckets = new ArrayList<>();",
      "  for (int i = 0; i < k; i++) {",
      "    buckets.add(new ArrayList<>());",
      "  }",
      "  return buckets;",
      "}",
    ],
  },
  {
    lines: [
      "void distribute(int[] arr, List<List<Integer>> buckets) {",
      "  for (int value : arr) {",
      "    int b = indexFor(value);",
      "    buckets.get(b).add(value);",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "void sortBuckets(List<List<Integer>> buckets) {",
      "  for (List<Integer> bucket : buckets) {",
      "    Collections.sort(bucket);",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "void gather(int[] arr, List<List<Integer>> buckets) {",
      "  int index = 0;",
      "  for (List<Integer> bucket : buckets) {",
      "    for (int value : bucket) {",
      "      arr[index++] = value;",
      "    }",
      "  }",
      "}",
    ],
  },
];

BucketSort.prototype.init = function (am, w, h) {
  BucketSort.superclass.init.call(this, am, w, h);

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

  this.arrayData = new Array(BucketSort.ARRAY_SIZE);
  this.arrayRects = new Array(BucketSort.ARRAY_SIZE);
  this.arrayIndexLabels = new Array(BucketSort.ARRAY_SIZE);
  this.arrayPositions = new Array(BucketSort.ARRAY_SIZE);

  this.bucketRects = [];
  this.bucketPositions = [];
  this.bucketFill = new Array(BucketSort.BUCKET_COUNT);
  this.bucketContents = new Array(BucketSort.BUCKET_COUNT);

  this.outputData = new Array(BucketSort.ARRAY_SIZE);
  this.outputRects = new Array(BucketSort.ARRAY_SIZE);
  this.outputIndexLabels = new Array(BucketSort.ARRAY_SIZE);
  this.outputPositions = new Array(BucketSort.ARRAY_SIZE);

  this.codeIDs = [];
  this.highlightedSection = -1;
  this.highlightedLine = -1;

  this.commands = [];

  this.createTitle();
  this.createInfoPanel();
  this.createInputArray();
  this.createBucketColumns();
  this.createOutputArray();
  this.createCodeDisplay();

  this.randomizeValues(false);

  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.skipForward();
  this.animationManager.clearHistory();
  this.commands = [];
};

BucketSort.prototype.addControls = function () {
  this.randomizeButton = addControlToAlgorithmBar(
    "Button",
    "Randomize Array"
  );
  this.randomizeButton.onclick = this.randomizeCallback.bind(this);

  this.sortButton = addControlToAlgorithmBar("Button", "Bucket Sort");
  this.sortButton.onclick = this.sortCallback.bind(this);
};

BucketSort.prototype.createTitle = function () {
  this.titleLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleLabelID,
    "Bucket Sort",
    BucketSort.CANVAS_WIDTH / 2,
    BucketSort.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleLabelID, "bold 34");
  this.cmd("SetForegroundColor", this.titleLabelID, BucketSort.TITLE_COLOR);
};

BucketSort.prototype.createInfoPanel = function () {
  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    BucketSort.CANVAS_WIDTH / 2,
    BucketSort.INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, BucketSort.INFO_COLOR);
};

BucketSort.prototype.createInputArray = function () {
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Input Array",
    BucketSort.CANVAS_WIDTH / 2,
    BucketSort.INPUT_Y - BucketSort.ARRAY_LABEL_GAP,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, BucketSort.INFO_COLOR);

  var startX =
    BucketSort.CANVAS_WIDTH / 2 -
    ((BucketSort.ARRAY_SIZE - 1) * BucketSort.ARRAY_SPACING) / 2;

  for (var i = 0; i < BucketSort.ARRAY_SIZE; i++) {
    var x = startX + i * BucketSort.ARRAY_SPACING;
    this.arrayPositions[i] = x;

    var rectID = this.nextIndex++;
    this.arrayRects[i] = rectID;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      BucketSort.RECT_WIDTH,
      BucketSort.RECT_HEIGHT,
      x,
      BucketSort.INPUT_Y,
      "center",
      "center"
    );
    this.cmd("SetBackgroundColor", rectID, BucketSort.INPUT_DEFAULT_COLOR);
    this.cmd("SetForegroundColor", rectID, BucketSort.INPUT_BORDER_COLOR);

    var indexID = this.nextIndex++;
    this.arrayIndexLabels[i] = indexID;
    this.cmd(
      "CreateLabel",
      indexID,
      i,
      x,
      BucketSort.INPUT_Y + BucketSort.RECT_HEIGHT / 2 + BucketSort.INDEX_GAP,
      0
    );
    this.cmd("SetTextStyle", indexID, "bold 16");
    this.cmd("SetForegroundColor", indexID, BucketSort.INDEX_COLOR);
  }
};

BucketSort.prototype.createBucketColumns = function () {
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Buckets",
    BucketSort.CANVAS_WIDTH / 2,
    BucketSort.BUCKET_LABEL_Y - 40,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, BucketSort.INFO_COLOR);

  var startX =
    BucketSort.CANVAS_WIDTH / 2 -
    ((BucketSort.BUCKET_COUNT - 1) * BucketSort.BUCKET_SPACING) / 2;

  for (var b = 0; b < BucketSort.BUCKET_COUNT; b++) {
    var x = startX + b * BucketSort.BUCKET_SPACING;
    var bucketRects = [];
    var bucketPos = [];

    var rangeStart = Math.floor(
      (BucketSort.MAX_VALUE + 1) * (b / BucketSort.BUCKET_COUNT)
    );
    var rangeEnd = Math.floor(
      (BucketSort.MAX_VALUE + 1) * ((b + 1) / BucketSort.BUCKET_COUNT) - 1
    );
    var bucketLabel = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      bucketLabel,
      "Bucket " + b + " (" + rangeStart + "-" + rangeEnd + ")",
      x,
      BucketSort.BUCKET_LABEL_Y,
      1
    );
    this.cmd("SetTextStyle", bucketLabel, "bold 18");
    this.cmd("SetForegroundColor", bucketLabel, BucketSort.INFO_COLOR);

    for (var slot = 0; slot < BucketSort.BUCKET_CAPACITY; slot++) {
      var y = BucketSort.BUCKET_TOP_Y + slot * BucketSort.BUCKET_VERTICAL_GAP;
      var rectID = this.nextIndex++;
      bucketRects.push(rectID);
      bucketPos.push({ x: x, y: y });
      this.cmd(
        "CreateRectangle",
        rectID,
        "",
        BucketSort.RECT_WIDTH,
        BucketSort.RECT_HEIGHT,
        x,
        y,
        "center",
        "center"
      );
      this.cmd(
        "SetBackgroundColor",
        rectID,
        BucketSort.BUCKET_DEFAULT_COLOR
      );
      this.cmd("SetForegroundColor", rectID, BucketSort.BUCKET_BORDER_COLOR);
    }

    this.bucketRects[b] = bucketRects;
    this.bucketPositions[b] = bucketPos;
    this.bucketFill[b] = 0;
    this.bucketContents[b] = [];
  }
};

BucketSort.prototype.createOutputArray = function () {
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Output Array",
    BucketSort.CANVAS_WIDTH / 2,
    BucketSort.OUTPUT_Y - BucketSort.ARRAY_LABEL_GAP,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, BucketSort.INFO_COLOR);

  var startX =
    BucketSort.CANVAS_WIDTH / 2 -
    ((BucketSort.ARRAY_SIZE - 1) * BucketSort.ARRAY_SPACING) / 2;

  for (var i = 0; i < BucketSort.ARRAY_SIZE; i++) {
    var x = startX + i * BucketSort.ARRAY_SPACING;
    this.outputPositions[i] = x;

    var rectID = this.nextIndex++;
    this.outputRects[i] = rectID;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      BucketSort.RECT_WIDTH,
      BucketSort.RECT_HEIGHT,
      x,
      BucketSort.OUTPUT_Y,
      "center",
      "center"
    );
    this.cmd("SetBackgroundColor", rectID, BucketSort.OUTPUT_DEFAULT_COLOR);
    this.cmd("SetForegroundColor", rectID, BucketSort.OUTPUT_BORDER_COLOR);

    var indexID = this.nextIndex++;
    this.outputIndexLabels[i] = indexID;
    this.cmd(
      "CreateLabel",
      indexID,
      i,
      x,
      BucketSort.OUTPUT_Y + BucketSort.RECT_HEIGHT / 2 + BucketSort.INDEX_GAP,
      0
    );
    this.cmd("SetTextStyle", indexID, "bold 16");
    this.cmd("SetForegroundColor", indexID, BucketSort.INDEX_COLOR);

    this.outputData[i] = null;
  }
};

BucketSort.prototype.createCodeDisplay = function () {
  this.codeIDs = [];
  var columnHeights = [];
  for (var c = 0; c < BucketSort.CODE_COLUMNS.length; c++) {
    columnHeights[c] = BucketSort.CODE_START_Y;
  }

  for (var sectionIndex = 0; sectionIndex < BucketSort.CODE_SECTIONS.length; sectionIndex++) {
    var section = BucketSort.CODE_SECTIONS[sectionIndex];
    var columnIndex = BucketSort.CODE_LAYOUT[sectionIndex];
    var columnX = BucketSort.CODE_COLUMNS[columnIndex];
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
      this.cmd("SetTextStyle", labelID, BucketSort.CODE_FONT);
      this.cmd(
        "SetForegroundColor",
        labelID,
        BucketSort.CODE_STANDARD_COLOR
      );
      lineIDs.push(labelID);
      currentY += BucketSort.CODE_LINE_HEIGHT;
    }
    this.codeIDs.push(lineIDs);
    columnHeights[columnIndex] = currentY + BucketSort.CODE_SECTION_GAP;
  }
};

BucketSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this, true), 0);
};

BucketSort.prototype.sortCallback = function () {
  this.implementAction(this.runBucketSort.bind(this), 0);
};

BucketSort.prototype.randomizeValues = function (showMessage) {
  for (var i = 0; i < BucketSort.ARRAY_SIZE; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.cmd("SetText", this.arrayRects[i], value);
    this.cmd("SetBackgroundColor", this.arrayRects[i], BucketSort.INPUT_DEFAULT_COLOR);
  }

  for (var b = 0; b < BucketSort.BUCKET_COUNT; b++) {
    this.bucketFill[b] = 0;
    this.bucketContents[b] = [];
    for (var slot = 0; slot < BucketSort.BUCKET_CAPACITY; slot++) {
      var rectID = this.bucketRects[b][slot];
      this.cmd("SetText", rectID, "");
      this.cmd(
        "SetBackgroundColor",
        rectID,
        BucketSort.BUCKET_DEFAULT_COLOR
      );
    }
  }

  for (var j = 0; j < BucketSort.ARRAY_SIZE; j++) {
    this.outputData[j] = null;
    this.cmd("SetText", this.outputRects[j], "");
    this.cmd(
      "SetBackgroundColor",
      this.outputRects[j],
      BucketSort.OUTPUT_DEFAULT_COLOR
    );
  }

  this.clearCodeHighlights();
  if (showMessage) {
    this.setInfo("Array randomized. Ready for bucket sort!", true);
  }
};

BucketSort.prototype.randomizeArray = function (showMessage) {
  this.commands = [];
  this.randomizeValues(showMessage);
  return this.commands;
};

BucketSort.prototype.generateRandomValue = function () {
  return Math.floor(Math.random() * (BucketSort.MAX_VALUE + 1));
};

BucketSort.prototype.runBucketSort = function () {
  this.commands = [];
  this.disableUI();
  this.clearCodeHighlights();

  for (var b = 0; b < BucketSort.BUCKET_COUNT; b++) {
    this.bucketFill[b] = 0;
    this.bucketContents[b] = [];
    for (var slot = 0; slot < BucketSort.BUCKET_CAPACITY; slot++) {
      var rectID = this.bucketRects[b][slot];
      this.cmd("SetText", rectID, "");
      this.cmd(
        "SetBackgroundColor",
        rectID,
        BucketSort.BUCKET_DEFAULT_COLOR
      );
    }
  }

  for (var k = 0; k < BucketSort.ARRAY_SIZE; k++) {
    this.outputData[k] = null;
    this.cmd("SetText", this.outputRects[k], "");
    this.cmd(
      "SetBackgroundColor",
      this.outputRects[k],
      BucketSort.OUTPUT_DEFAULT_COLOR
    );
    this.cmd(
      "SetBackgroundColor",
      this.arrayRects[k],
      BucketSort.INPUT_DEFAULT_COLOR
    );
  }

  this.setInfo("Distribute values into buckets based on their range.", true);
  this.highlightCode(0, 0, true);
  this.highlightCode(0, 1, true);
  this.highlightCode(1, 0, true);
  this.highlightCode(1, 1, true);
  this.highlightCode(1, 2, true);
  this.highlightCode(1, 3, true);
  this.highlightCode(1, 4, true);
  this.highlightCode(1, 5, true);

  this.highlightCode(0, 2, true);
  this.highlightCode(2, 0, true);

  for (var idx = 0; idx < this.arrayData.length; idx++) {
    this.highlightCode(2, 1, true);
    this.setInputHighlight(idx, true);
    var value = this.arrayData[idx];
    this.setInfo("Process value " + value + " at index " + idx + ".", true);

    this.highlightCode(2, 2, true);
    var bucketIndex = this.computeBucketIndex(value);
    this.setInfo("Value " + value + " maps to bucket " + bucketIndex + ".", true);

    var slot = this.bucketFill[bucketIndex];
    if (slot >= BucketSort.BUCKET_CAPACITY) {
      slot = BucketSort.BUCKET_CAPACITY - 1;
    }

    var moveLabel = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      moveLabel,
      value,
      this.arrayPositions[idx],
      BucketSort.INPUT_Y,
      1
    );
    this.cmd("SetTextStyle", moveLabel, "bold 20");

    var highlight = this.nextIndex++;
    this.cmd(
      "CreateHighlightCircle",
      highlight,
      "#1d3557",
      this.arrayPositions[idx],
      BucketSort.INPUT_Y
    );
    this.cmd(
      "Move",
      highlight,
      this.bucketPositions[bucketIndex][slot].x,
      this.bucketPositions[bucketIndex][slot].y
    );
    this.cmd(
      "Move",
      moveLabel,
      this.bucketPositions[bucketIndex][slot].x,
      this.bucketPositions[bucketIndex][slot].y
    );
    this.cmd("Step");
    this.cmd("Delete", highlight);

    this.highlightCode(2, 3, true);
    this.bucketContents[bucketIndex].push(value);
    this.bucketFill[bucketIndex] = Math.min(
      this.bucketFill[bucketIndex] + 1,
      BucketSort.BUCKET_CAPACITY
    );

    var rectID = this.bucketRects[bucketIndex][slot];
    this.cmd("SetText", rectID, value);
    this.cmd(
      "SetBackgroundColor",
      rectID,
      BucketSort.BUCKET_ACTIVE_COLOR
    );
    this.cmd("Delete", moveLabel);

    this.setInputHighlight(idx, false);
    this.cmd("Step");
  }

  this.setInfo("Sort the values inside each bucket individually.", true);
  this.highlightCode(0, 3, true);
  this.highlightCode(3, 0, true);

  for (var bucket = 0; bucket < BucketSort.BUCKET_COUNT; bucket++) {
    this.highlightCode(3, 1, true);
    if (this.bucketContents[bucket].length === 0) {
      this.setInfo("Bucket " + bucket + " is empty.", true);
      continue;
    }

    this.setInfo(
      "Sorting bucket " + bucket + " with " + this.bucketContents[bucket].length + " values.",
      true
    );
    this.highlightCode(3, 2, true);

    var sortedBucket = this.bucketContents[bucket].slice();
    sortedBucket.sort(function (a, b) {
      return a - b;
    });
    this.bucketContents[bucket] = sortedBucket;

    for (var slotIndex = 0; slotIndex < sortedBucket.length; slotIndex++) {
      var targetRect = this.bucketRects[bucket][slotIndex];
      this.cmd("SetText", targetRect, sortedBucket[slotIndex]);
      this.cmd(
        "SetBackgroundColor",
        targetRect,
        BucketSort.BUCKET_SORTED_COLOR
      );
      this.cmd("Step");
    }
  }

  this.setInfo("Concatenate the buckets back into the output array.", true);
  this.highlightCode(0, 4, true);
  this.highlightCode(4, 0, true);
  this.highlightCode(4, 1, true);

  var outputIndex = 0;
  for (var bIndex = 0; bIndex < BucketSort.BUCKET_COUNT; bIndex++) {
    this.highlightCode(4, 2, true);
    var bucketValues = this.bucketContents[bIndex];
    for (var valueIndex = 0; valueIndex < bucketValues.length; valueIndex++) {
      this.highlightCode(4, 3, true);
      var valueToPlace = bucketValues[valueIndex];
      var sourceRect = this.bucketRects[bIndex][valueIndex];

      var movingLabel = this.nextIndex++;
      this.cmd(
        "CreateLabel",
        movingLabel,
        valueToPlace,
        this.bucketPositions[bIndex][valueIndex].x,
        this.bucketPositions[bIndex][valueIndex].y,
        1
      );
      this.cmd("SetTextStyle", movingLabel, "bold 20");

      this.cmd(
        "Move",
        movingLabel,
        this.outputPositions[outputIndex],
        BucketSort.OUTPUT_Y
      );
      this.cmd("Step");

      this.cmd("SetText", sourceRect, "");
      this.cmd(
        "SetBackgroundColor",
        sourceRect,
        BucketSort.BUCKET_DEFAULT_COLOR
      );

      this.cmd("SetText", this.outputRects[outputIndex], valueToPlace);
      this.cmd(
        "SetBackgroundColor",
        this.outputRects[outputIndex],
        BucketSort.OUTPUT_ACTIVE_COLOR
      );
      this.outputData[outputIndex] = valueToPlace;
      this.cmd("Delete", movingLabel);
      this.cmd("Step");

      this.highlightCode(4, 4, true);
      outputIndex++;
    }
  }

  this.highlightCode(4, 5, true);

  for (var copyIdx = 0; copyIdx < this.outputData.length; copyIdx++) {
    var sortedValue = this.outputData[copyIdx];
    this.arrayData[copyIdx] = sortedValue;
    this.cmd("SetText", this.arrayRects[copyIdx], sortedValue);
    this.cmd(
      "SetBackgroundColor",
      this.arrayRects[copyIdx],
      BucketSort.INPUT_FINAL_COLOR
    );
    this.cmd(
      "SetBackgroundColor",
      this.outputRects[copyIdx],
      BucketSort.OUTPUT_FINAL_COLOR
    );
    this.cmd("Step");
  }

  this.highlightCode(0, 5, true);
  this.highlightCode(-1, -1, false);

  this.setInfo("Bucket sort complete!", true);
  this.enableUI();
  return this.commands;
};

BucketSort.prototype.computeBucketIndex = function (value) {
  var bucketRange = Math.ceil((BucketSort.MAX_VALUE + 1) / BucketSort.BUCKET_COUNT);
  var index = Math.floor(value / bucketRange);
  if (index >= BucketSort.BUCKET_COUNT) {
    index = BucketSort.BUCKET_COUNT - 1;
  }
  return index;
};

BucketSort.prototype.setInfo = function (text, stepAfter) {
  this.cmd("SetText", this.infoLabelID, text);
  if (stepAfter) {
    this.cmd("Step");
  }
};

BucketSort.prototype.setInputHighlight = function (index, highlight) {
  if (index < 0 || index >= this.arrayRects.length) {
    return;
  }
  var color = BucketSort.INPUT_DEFAULT_COLOR;
  if (highlight) {
    color = BucketSort.INPUT_ACTIVE_COLOR;
  }
  this.cmd("SetBackgroundColor", this.arrayRects[index], color);
};

BucketSort.prototype.clearCodeHighlights = function () {
  if (this.codeIDs && this.codeIDs.length > 0) {
    for (var section = 0; section < this.codeIDs.length; section++) {
      var lines = this.codeIDs[section];
      for (var i = 0; i < lines.length; i++) {
        this.cmd(
          "SetForegroundColor",
          lines[i],
          BucketSort.CODE_STANDARD_COLOR
        );
      }
    }
  }
  this.highlightedSection = -1;
  this.highlightedLine = -1;
};

BucketSort.prototype.highlightCode = function (section, line, withStep) {
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
      BucketSort.CODE_STANDARD_COLOR
    );
  }

  if (section >= 0 && line >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[section][line],
      BucketSort.CODE_HIGHLIGHT_COLOR
    );
  }

  this.highlightedSection = section;
  this.highlightedLine = line;

  if (withStep) {
    this.cmd("Step");
  }
};

BucketSort.prototype.disableUI = function () {
  this.randomizeButton.disabled = true;
  this.sortButton.disabled = true;
};

BucketSort.prototype.enableUI = function () {
  this.randomizeButton.disabled = false;
  this.sortButton.disabled = false;
};

BucketSort.prototype.reset = function () {
  return this.randomizeArray(false);
};

var currentAlg = null;

function init() {
  var animManag = initCanvas();
  if (typeof canvas !== "undefined") {
    canvas.width = BucketSort.CANVAS_WIDTH;
    canvas.height = BucketSort.CANVAS_HEIGHT;
  }
  if (animManag && animManag.animatedObjects) {
    animManag.animatedObjects.width = BucketSort.CANVAS_WIDTH;
    animManag.animatedObjects.height = BucketSort.CANVAS_HEIGHT;
  }
  currentAlg = new BucketSort(
    animManag,
    BucketSort.CANVAS_WIDTH,
    BucketSort.CANVAS_HEIGHT
  );
}

