// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

function BucketSort(am, w, h) {
  this.init(am, w, h);
}

BucketSort.prototype = new Algorithm();
BucketSort.prototype.constructor = BucketSort;
BucketSort.superclass = Algorithm.prototype;

BucketSort.CANVAS_WIDTH = 720;
BucketSort.CANVAS_HEIGHT = 1280;

BucketSort.ARRAY_SIZE = 9;
BucketSort.BUCKET_COUNT = BucketSort.ARRAY_SIZE;
BucketSort.MAX_VALUE = 999;

BucketSort.RECT_WIDTH = 54;
BucketSort.RECT_HEIGHT = 48;
BucketSort.ARRAY_SPACING = 62;
BucketSort.ARRAY_LABEL_GAP = 44;
BucketSort.INDEX_GAP = 32;

BucketSort.INPUT_Y = 240;
BucketSort.NODE_STAGING_Y = BucketSort.INPUT_Y + 110;
BucketSort.BUCKET_Y = 620;
BucketSort.OUTPUT_Y = 820;

BucketSort.NODE_WIDTH = 44;
BucketSort.NODE_HEIGHT = 50;

BucketSort.BUCKET_NODE_START_Y =
  BucketSort.BUCKET_Y - BucketSort.RECT_HEIGHT / 2 - BucketSort.NODE_HEIGHT / 2 - 18;
BucketSort.BUCKET_NODE_GAP = BucketSort.NODE_HEIGHT + 18;
BucketSort.OUTPUT_NODE_Y = BucketSort.OUTPUT_Y - 120;

BucketSort.TITLE_Y = 60;
BucketSort.INFO_Y = 140;
BucketSort.INFO_LINE_GAP = 26;

BucketSort.CODE_START_Y = 980;
BucketSort.CODE_LINE_HEIGHT = 22;
BucketSort.CODE_FONT = "bold 18";
BucketSort.CODE_SECTION_GAP = 32;
BucketSort.CODE_COLUMNS = [110, 440];
BucketSort.CODE_LAYOUT = [0, 0, 1];

BucketSort.INPUT_DEFAULT_COLOR = "#edf2fb";
BucketSort.INPUT_ACTIVE_COLOR = "#ffcad4";
BucketSort.INPUT_FINAL_COLOR = "#a9def9";
BucketSort.INPUT_BORDER_COLOR = "#1d3557";

BucketSort.BUCKET_DEFAULT_COLOR = "#f8f9fa";
BucketSort.BUCKET_ACTIVE_COLOR = "#ffd166";
BucketSort.BUCKET_BORDER_COLOR = "#1d3557";

BucketSort.NODE_FILL_COLOR = "#ffe066";
BucketSort.NODE_BORDER_COLOR = "#1d3557";

BucketSort.OUTPUT_DEFAULT_COLOR = "#dee2ff";
BucketSort.OUTPUT_ACTIVE_COLOR = "#90e0ef";
BucketSort.OUTPUT_FINAL_COLOR = "#8ac926";
BucketSort.OUTPUT_BORDER_COLOR = "#1d3557";

BucketSort.TITLE_COLOR = "#1d3557";
BucketSort.INFO_COLOR = "#2b2d42";
BucketSort.CODE_STANDARD_COLOR = "#1d3557";
BucketSort.CODE_HIGHLIGHT_COLOR = "#d62828";
BucketSort.MOVE_LABEL_COLOR = "#003049";
BucketSort.HIGHLIGHT_COLOR = "#ef476f";
BucketSort.INDEX_COLOR = "#0b2545";

BucketSort.INFO_LINES = [
  "Distribute values to linked buckets using a scaled index.",
  "Keep each bucket sorted, then gather them to rebuild the array.",
];

BucketSort.CODE_SECTIONS = [
  {
    lines: [
      "void bucketSort(int[] arr) {",
      "  List<Integer>[] buckets = initBuckets(arr.length);",
      "  scatter(arr, buckets);",
      "  gather(arr, buckets);",
      "}",
    ],
  },
  {
    lines: [
      "void scatter(int[] arr, List<Integer>[] buckets) {",
      "  for (int value : arr) {",
      "    int index = value * buckets.length / (MAX + 1);",
      "    insertSorted(buckets[index], value);",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "void gather(int[] arr, List<Integer>[] buckets) {",
      "  int write = 0;",
      "  for (List<Integer> bucket : buckets) {",
      "    for (int value : bucket) {",
      "      arr[write++] = value;",
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

  this.bucketRects = new Array(BucketSort.BUCKET_COUNT);
  this.bucketIndexLabels = new Array(BucketSort.BUCKET_COUNT);
  this.bucketPositions = new Array(BucketSort.BUCKET_COUNT);
  this.bucketNodes = new Array(BucketSort.BUCKET_COUNT);
  this.bucketFirstNode = new Array(BucketSort.BUCKET_COUNT);

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
  this.createBuckets();
  this.createOutputArray();
  this.createCodeDisplay();

  for (var i = 0; i < BucketSort.BUCKET_COUNT; i++) {
    this.bucketNodes[i] = [];
    this.bucketFirstNode[i] = null;
  }

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
  this.infoLabelIDs = [];
  for (var line = 0; line < BucketSort.INFO_LINES.length; line++) {
    var labelID = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      labelID,
      BucketSort.INFO_LINES[line],
      BucketSort.CANVAS_WIDTH / 2,
      BucketSort.INFO_Y + line * BucketSort.INFO_LINE_GAP,
      1
    );
    this.cmd("SetTextStyle", labelID, "bold 20");
    this.cmd("SetForegroundColor", labelID, BucketSort.INFO_COLOR);
    this.infoLabelIDs.push(labelID);
  }

  this.statusLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.statusLabelID,
    "",
    BucketSort.CANVAS_WIDTH / 2,
    BucketSort.INFO_Y + BucketSort.INFO_LINES.length * BucketSort.INFO_LINE_GAP + 30,
    1
  );
  this.cmd("SetTextStyle", this.statusLabelID, "bold 20");
  this.cmd("SetForegroundColor", this.statusLabelID, BucketSort.INFO_COLOR);
};

BucketSort.prototype.createInputArray = function () {
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

  var labelY =
    BucketSort.INPUT_Y +
    BucketSort.RECT_HEIGHT / 2 +
    BucketSort.INDEX_GAP +
    BucketSort.ARRAY_LABEL_GAP;
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Input Array",
    BucketSort.CANVAS_WIDTH / 2,
    labelY,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, BucketSort.INFO_COLOR);
};

BucketSort.prototype.createBuckets = function () {
  var startX =
    BucketSort.CANVAS_WIDTH / 2 -
    ((BucketSort.BUCKET_COUNT - 1) * BucketSort.ARRAY_SPACING) / 2;

  for (var i = 0; i < BucketSort.BUCKET_COUNT; i++) {
    var x = startX + i * BucketSort.ARRAY_SPACING;
    this.bucketPositions[i] = x;

    var rectID = this.nextIndex++;
    this.bucketRects[i] = rectID;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      BucketSort.RECT_WIDTH,
      BucketSort.RECT_HEIGHT,
      x,
      BucketSort.BUCKET_Y,
      "center",
      "center"
    );
    this.cmd("SetBackgroundColor", rectID, BucketSort.BUCKET_DEFAULT_COLOR);
    this.cmd("SetForegroundColor", rectID, BucketSort.BUCKET_BORDER_COLOR);
    this.cmd("SetNull", rectID, 1);

    var indexID = this.nextIndex++;
    this.bucketIndexLabels[i] = indexID;
    this.cmd(
      "CreateLabel",
      indexID,
      i,
      x,
      BucketSort.BUCKET_Y + BucketSort.RECT_HEIGHT / 2 + BucketSort.INDEX_GAP,
      0
    );
    this.cmd("SetTextStyle", indexID, "bold 16");
    this.cmd("SetForegroundColor", indexID, BucketSort.INDEX_COLOR);
  }

  var labelY =
    BucketSort.BUCKET_Y +
    BucketSort.RECT_HEIGHT / 2 +
    BucketSort.INDEX_GAP +
    BucketSort.ARRAY_LABEL_GAP;
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Buckets",
    BucketSort.CANVAS_WIDTH / 2,
    labelY,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, BucketSort.INFO_COLOR);
};

BucketSort.prototype.createOutputArray = function () {
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
  }

  var labelY =
    BucketSort.OUTPUT_Y +
    BucketSort.RECT_HEIGHT / 2 +
    BucketSort.INDEX_GAP +
    BucketSort.ARRAY_LABEL_GAP;
  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "Output Array",
    BucketSort.CANVAS_WIDTH / 2,
    labelY,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 22");
  this.cmd("SetForegroundColor", labelID, BucketSort.INFO_COLOR);
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
      this.cmd("CreateLabel", labelID, section.lines[line], columnX, currentY, 0);
      this.cmd("SetTextStyle", labelID, BucketSort.CODE_FONT);
      this.cmd("SetForegroundColor", labelID, BucketSort.CODE_STANDARD_COLOR);
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

  for (var j = 0; j < BucketSort.ARRAY_SIZE; j++) {
    this.outputData[j] = null;
    this.cmd("SetText", this.outputRects[j], "");
    this.cmd("SetBackgroundColor", this.outputRects[j], BucketSort.OUTPUT_DEFAULT_COLOR);
  }

  this.clearBuckets();
  this.clearCodeHighlights();
  this.cmd("SetText", this.statusLabelID, showMessage ? "Array randomized. Ready for bucket sort!" : "");
  if (showMessage) {
    this.cmd("Step");
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

BucketSort.prototype.clearBuckets = function () {
  for (var i = 0; i < BucketSort.BUCKET_COUNT; i++) {
    if (this.bucketFirstNode[i] !== null) {
      this.cmd("Disconnect", this.bucketRects[i], this.bucketFirstNode[i]);
    }
    this.bucketFirstNode[i] = null;
    this.cmd("SetNull", this.bucketRects[i], 1);

    var nodes = this.bucketNodes[i];
    if (!nodes) {
      this.bucketNodes[i] = [];
      continue;
    }
    while (nodes.length > 0) {
      var node = nodes.pop();
      if (node.next !== null) {
        this.cmd("Disconnect", node.graphicID, node.next.graphicID);
      }
      this.cmd("Delete", node.graphicID);
    }
  }
};

BucketSort.prototype.clearCodeHighlights = function () {
  if (this.highlightedSection === -1) {
    return;
  }
  for (var s = 0; s < this.codeIDs.length; s++) {
    for (var l = 0; l < this.codeIDs[s].length; l++) {
      this.cmd(
        "SetForegroundColor",
        this.codeIDs[s][l],
        BucketSort.CODE_STANDARD_COLOR
      );
    }
  }
  this.highlightedSection = -1;
  this.highlightedLine = -1;
};

BucketSort.prototype.highlightSection = function (sectionIndex, lineIndex) {
  this.clearCodeHighlights();
  if (
    sectionIndex >= 0 &&
    sectionIndex < this.codeIDs.length &&
    lineIndex >= 0 &&
    lineIndex < this.codeIDs[sectionIndex].length
  ) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[sectionIndex][lineIndex],
      BucketSort.CODE_HIGHLIGHT_COLOR
    );
    this.highlightedSection = sectionIndex;
    this.highlightedLine = lineIndex;
  }
};

BucketSort.prototype.createNode = function (value, startX) {
  var nodeID = this.nextIndex++;
  var node = {
    value: value,
    graphicID: nodeID,
    next: null,
  };

  this.cmd(
    "CreateLinkedList",
    nodeID,
    "",
    BucketSort.NODE_WIDTH,
    BucketSort.NODE_HEIGHT,
    startX,
    BucketSort.NODE_STAGING_Y
  );
  this.cmd("SetNull", nodeID, 1);
  this.cmd("SetForegroundColor", nodeID, BucketSort.NODE_BORDER_COLOR);
  this.cmd("SetBackgroundColor", nodeID, BucketSort.NODE_FILL_COLOR);

  return node;
};

BucketSort.prototype.insertNodeIntoBucket = function (bucketIndex, node) {
  var nodes = this.bucketNodes[bucketIndex];
  var position = 0;
  while (position < nodes.length && nodes[position].value <= node.value) {
    position++;
  }
  nodes.splice(position, 0, node);
  this.cmd(
    "SetBackgroundColor",
    this.bucketRects[bucketIndex],
    BucketSort.BUCKET_ACTIVE_COLOR
  );
  this.rebuildBucketLayout(bucketIndex);
  this.cmd("Step");
  this.cmd(
    "SetBackgroundColor",
    this.bucketRects[bucketIndex],
    BucketSort.BUCKET_DEFAULT_COLOR
  );
};

BucketSort.prototype.rebuildBucketLayout = function (bucketIndex) {
  var nodes = this.bucketNodes[bucketIndex];
  var headID = this.bucketRects[bucketIndex];

  if (this.bucketFirstNode[bucketIndex] !== null) {
    this.cmd("Disconnect", headID, this.bucketFirstNode[bucketIndex]);
  }

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].next !== null) {
      this.cmd("Disconnect", nodes[i].graphicID, nodes[i].next.graphicID);
      nodes[i].next = null;
    }
  }

  if (nodes.length === 0) {
    this.bucketFirstNode[bucketIndex] = null;
    this.cmd("SetNull", headID, 1);
    return;
  }

  this.cmd("SetNull", headID, 0);
  this.cmd("Connect", headID, nodes[0].graphicID);
  this.bucketFirstNode[bucketIndex] = nodes[0].graphicID;

  for (var index = 0; index < nodes.length; index++) {
    var node = nodes[index];
    var targetX = this.bucketPositions[bucketIndex];
    var targetY = BucketSort.BUCKET_NODE_START_Y - index * BucketSort.BUCKET_NODE_GAP;
    this.cmd("Move", node.graphicID, targetX, targetY);
  }

  for (var j = 0; j < nodes.length; j++) {
    if (j < nodes.length - 1) {
      this.cmd("SetNull", nodes[j].graphicID, 0);
      this.cmd("Connect", nodes[j].graphicID, nodes[j + 1].graphicID);
      nodes[j].next = nodes[j + 1];
    } else {
      this.cmd("SetNull", nodes[j].graphicID, 1);
      nodes[j].next = null;
    }
  }
};

BucketSort.prototype.runBucketSort = function () {
  this.commands = [];
  this.disableUI();
  this.clearCodeHighlights();
  this.cmd("SetText", this.statusLabelID, "Scattering values into buckets...");
  this.cmd("Step");

  this.clearBuckets();

  this.highlightSection(0, 1);
  this.cmd("Step");

  this.highlightSection(1, 1);
  this.cmd("Step");

  for (var i = 0; i < BucketSort.ARRAY_SIZE; i++) {
    var value = this.arrayData[i];

    this.highlightSection(1, 1);
    this.cmd("SetBackgroundColor", this.arrayRects[i], BucketSort.INPUT_ACTIVE_COLOR);

    var labelID = this.nextIndex++;
    this.cmd("CreateLabel", labelID, value, this.arrayPositions[i], BucketSort.INPUT_Y, 0);
    this.cmd("SetForegroundColor", labelID, BucketSort.MOVE_LABEL_COLOR);

    var node = this.createNode(value, this.arrayPositions[i]);
    this.cmd("SetText", node.graphicID, "");

    this.cmd("Move", labelID, this.arrayPositions[i], BucketSort.NODE_STAGING_Y);
    this.cmd("Step");

    this.cmd("SetText", node.graphicID, value);
    this.cmd("Delete", labelID);

    var bucketIndex = Math.floor(
      (value * BucketSort.BUCKET_COUNT) /
        (BucketSort.MAX_VALUE + 1)
    );
    this.highlightSection(1, 2);
    this.cmd("Step");

    var highlightID = this.nextIndex++;
    this.cmd(
      "CreateHighlightCircle",
      highlightID,
      BucketSort.HIGHLIGHT_COLOR,
      this.arrayPositions[i],
      BucketSort.NODE_STAGING_Y
    );
    this.cmd("Move", highlightID, this.bucketPositions[bucketIndex], BucketSort.BUCKET_Y);
    this.cmd("Step");
    this.cmd("Delete", highlightID);

    this.highlightSection(1, 3);
    this.insertNodeIntoBucket(bucketIndex, node);
    this.cmd("Step");

    this.cmd("SetBackgroundColor", this.arrayRects[i], BucketSort.INPUT_DEFAULT_COLOR);
  }

  this.cmd("SetText", this.statusLabelID, "Buckets ready. Gathering sorted values...");
  this.highlightSection(2, 0);
  this.cmd("Step");

  var writeIndex = 0;
  var sortedValues = [];

  for (var bucket = 0; bucket < BucketSort.BUCKET_COUNT; bucket++) {
    var nodes = this.bucketNodes[bucket];
    if (nodes.length > 0) {
      this.highlightSection(2, 2);
      this.cmd("Step");
    }
    while (nodes.length > 0) {
      var node = nodes.shift();
      if (node.next !== null) {
        this.cmd("Disconnect", node.graphicID, node.next.graphicID);
        node.next = null;
      }
      this.rebuildBucketLayout(bucket);

      this.highlightSection(2, 3);
      this.cmd("Step");

      this.cmd(
        "Move",
        node.graphicID,
        this.outputPositions[writeIndex],
        BucketSort.OUTPUT_NODE_Y
      );
      this.cmd("Step");

      this.highlightSection(2, 4);
      this.cmd("SetText", this.outputRects[writeIndex], node.value);
      this.cmd(
        "SetBackgroundColor",
        this.outputRects[writeIndex],
        BucketSort.OUTPUT_ACTIVE_COLOR
      );
      this.cmd("Step");
      this.cmd(
        "SetBackgroundColor",
        this.outputRects[writeIndex],
        BucketSort.OUTPUT_FINAL_COLOR
      );

      this.outputData[writeIndex] = node.value;
      sortedValues.push(node.value);
      this.cmd("Delete", node.graphicID);
      writeIndex++;
    }
  }

  for (var idx = 0; idx < sortedValues.length; idx++) {
    this.arrayData[idx] = sortedValues[idx];
    this.cmd("SetText", this.arrayRects[idx], sortedValues[idx]);
    this.cmd("SetBackgroundColor", this.arrayRects[idx], BucketSort.INPUT_FINAL_COLOR);
  }
  for (var fill = sortedValues.length; fill < BucketSort.ARRAY_SIZE; fill++) {
    this.cmd("SetBackgroundColor", this.arrayRects[fill], BucketSort.INPUT_FINAL_COLOR);
  }

  this.cmd("SetText", this.statusLabelID, "Bucket sort complete!");
  this.clearCodeHighlights();
  this.cmd("Step");

  this.enableUI();
  return this.commands;
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
