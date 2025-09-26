// Heap sort visualization showing both the array representation and
// the corresponding binary heap tree in a 720x1280 layout.

function HeapSort(am, w, h) {
  this.init(am, w, h);
}

HeapSort.prototype = new Algorithm();
HeapSort.prototype.constructor = HeapSort;
HeapSort.superclass = Algorithm.prototype;

HeapSort.CANVAS_WIDTH = 720;
HeapSort.CANVAS_HEIGHT = 1280;

HeapSort.ARRAY_SIZE = 12;
HeapSort.ARRAY_RECT_WIDTH = 54;
HeapSort.ARRAY_RECT_HEIGHT = 42;
HeapSort.ARRAY_SPACING = 58;
HeapSort.ARRAY_Y = 210;
HeapSort.ARRAY_LABEL_Y = HeapSort.ARRAY_Y + 52;

HeapSort.TITLE_Y = 60;
HeapSort.INFO_Y = 130;

HeapSort.CODE_START_Y = 830;
HeapSort.CODE_LINE_HEIGHT = 18;
HeapSort.CODE_FONT = "bold 15";
HeapSort.CODE_SECTION_GAP = 26;
HeapSort.CODE_COLUMNS = [130, 450];
HeapSort.CODE_LAYOUT = [0, 0, 1];

HeapSort.DEFAULT_ARRAY_COLOR = "#edf2fb";
HeapSort.ACTIVE_ARRAY_COLOR = "#ffd166";
HeapSort.SORTED_ARRAY_COLOR = "#90ee90";
HeapSort.ARRAY_BORDER_COLOR = "#1d3557";
HeapSort.INDEX_LABEL_COLOR = "#0b2545";

HeapSort.NODE_DEFAULT_COLOR = "#ffe8cc";
HeapSort.NODE_ACTIVE_COLOR = "#ffca76";
HeapSort.NODE_SORTED_COLOR = "#90ee90";
HeapSort.NODE_BORDER_COLOR = "#1d3557";
HeapSort.NODE_TEXT_COLOR = "#001427";

HeapSort.INFO_COLOR = "#2b2d42";
HeapSort.TITLE_COLOR = "#1d3557";
HeapSort.CODE_STANDARD_COLOR = "#1d3557";
HeapSort.CODE_HIGHLIGHT_COLOR = "#d62828";
HeapSort.SWAP_LABEL_COLOR = "#14213d";
HeapSort.EDGE_COLOR = "#8d99ae";

HeapSort.TREE_POSITIONS = [
  { x: 360, y: 360 },
  { x: 210, y: 460 },
  { x: 510, y: 460 },
  { x: 140, y: 580 },
  { x: 280, y: 580 },
  { x: 440, y: 580 },
  { x: 580, y: 580 },
  { x: 90, y: 720 },
  { x: 170, y: 720 },
  { x: 250, y: 720 },
  { x: 330, y: 720 },
  { x: 410, y: 720 },
  { x: 490, y: 720 },
  { x: 570, y: 720 },
  { x: 650, y: 720 },
];

HeapSort.CODE_SECTIONS = [
  {
    lines: [
      "void heapSort(int[] arr) {",
      "  int n = arr.length;",
      "  buildMaxHeap(arr, n);",
      "  for (int end = n - 1; end > 0; end--) {",
      "    swap(arr, 0, end);",
      "    heapify(arr, 0, end);",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "void buildMaxHeap(int[] arr, int n) {",
      "  for (int i = n / 2 - 1; i >= 0; i--) {",
      "    heapify(arr, i, n);",
      "  }",
      "}",
    ],
  },
  {
    lines: [
      "void heapify(int[] arr, int idx, int heapSize) {",
      "  int largest = idx;",
      "  int left = 2 * idx + 1;",
      "  int right = 2 * idx + 2;",
      "  if (left < heapSize && arr[left] > arr[largest]) {",
      "    largest = left;",
      "  }",
      "  if (right < heapSize && arr[right] > arr[largest]) {",
      "    largest = right;",
      "  }",
      "  if (largest != idx) {",
      "    swap(arr, idx, largest);",
      "    heapify(arr, largest, heapSize);",
      "  }",
      "}",
    ],
  },
];

HeapSort.prototype.init = function (am, w, h) {
  HeapSort.superclass.init.call(this, am, w, h);

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

  this.arrayData = new Array(HeapSort.ARRAY_SIZE);
  this.arrayRects = new Array(HeapSort.ARRAY_SIZE);
  this.arrayIndexLabels = new Array(HeapSort.ARRAY_SIZE);
  this.arrayPositions = new Array(HeapSort.ARRAY_SIZE);
  this.treeNodes = new Array(HeapSort.ARRAY_SIZE);
  this.edgePairs = [];

  this.sortedIndices = {};
  this.removedNodes = {};
  this.heapSize = HeapSort.ARRAY_SIZE;

  this.commands = [];

  this.createTitle();
  this.createInfoPanel();
  this.createArrayVisuals();
  this.createTreeStructure();
  this.createCodeDisplay();

  this.randomizeValues(false);

  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.skipForward();
  this.animationManager.clearHistory();
  this.commands = [];
};

HeapSort.prototype.addControls = function () {
  this.randomizeButton = addControlToAlgorithmBar("Button", "Randomize Array");
  this.randomizeButton.onclick = this.randomizeCallback.bind(this);

  this.sortButton = addControlToAlgorithmBar("Button", "Heap Sort");
  this.sortButton.onclick = this.sortCallback.bind(this);
};

HeapSort.prototype.createTitle = function () {
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Heap Sort",
    HeapSort.CANVAS_WIDTH / 2,
    HeapSort.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleID, "bold 34");
  this.cmd("SetForegroundColor", this.titleID, HeapSort.TITLE_COLOR);
};

HeapSort.prototype.createInfoPanel = function () {
  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    HeapSort.CANVAS_WIDTH / 2,
    HeapSort.INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, HeapSort.INFO_COLOR);
};

HeapSort.prototype.createArrayVisuals = function () {
  var startX =
    HeapSort.CANVAS_WIDTH / 2 -
    ((HeapSort.ARRAY_SIZE - 1) * HeapSort.ARRAY_SPACING) / 2;

  for (var i = 0; i < HeapSort.ARRAY_SIZE; i++) {
    var x = startX + i * HeapSort.ARRAY_SPACING;
    this.arrayPositions[i] = x;

    var rectID = this.nextIndex++;
    this.arrayRects[i] = rectID;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      HeapSort.ARRAY_RECT_WIDTH,
      HeapSort.ARRAY_RECT_HEIGHT,
      x,
      HeapSort.ARRAY_Y,
      "center",
      "center"
    );
    this.cmd("SetForegroundColor", rectID, HeapSort.ARRAY_BORDER_COLOR);
    this.cmd("SetBackgroundColor", rectID, HeapSort.DEFAULT_ARRAY_COLOR);
    this.cmd("SetTextStyle", rectID, "bold 16");

    var indexLabel = this.nextIndex++;
    this.arrayIndexLabels[i] = indexLabel;
    this.cmd("CreateLabel", indexLabel, i, x, HeapSort.ARRAY_LABEL_Y, 1);
    this.cmd("SetForegroundColor", indexLabel, HeapSort.INDEX_LABEL_COLOR);
    this.cmd("SetTextStyle", indexLabel, "bold 14");
  }
};

HeapSort.prototype.createTreeStructure = function () {
  for (var i = 0; i < HeapSort.ARRAY_SIZE; i++) {
    var pos = HeapSort.TREE_POSITIONS[i];
    var nodeID = this.nextIndex++;
    this.treeNodes[i] = nodeID;
    this.cmd("CreateCircle", nodeID, "", pos.x, pos.y);
    this.cmd("SetTextStyle", nodeID, "bold 16");
    this.cmd("SetForegroundColor", nodeID, HeapSort.NODE_BORDER_COLOR);
    this.cmd("SetBackgroundColor", nodeID, HeapSort.NODE_DEFAULT_COLOR);
    this.cmd("SetAlpha", nodeID, 0);
    this.cmd("SetTextColor", nodeID, HeapSort.NODE_TEXT_COLOR);

    if (i > 0) {
      var parentIndex = Math.floor((i - 1) / 2);
      this.cmd("Connect", this.treeNodes[parentIndex], nodeID);
      this.cmd(
        "SetEdgeColor",
        this.treeNodes[parentIndex],
        nodeID,
        HeapSort.EDGE_COLOR
      );
      this.cmd(
        "SetEdgeAlpha",
        this.treeNodes[parentIndex],
        nodeID,
        0
      );
      this.edgePairs.push({ parent: parentIndex, child: i });
    }
  }
};

HeapSort.prototype.createCodeDisplay = function () {
  this.codeIDs = [];
  var columnHeights = [];
  for (var column = 0; column < HeapSort.CODE_COLUMNS.length; column++) {
    columnHeights[column] = HeapSort.CODE_START_Y;
  }

  for (var sectionIndex = 0; sectionIndex < HeapSort.CODE_SECTIONS.length; sectionIndex++) {
    var section = HeapSort.CODE_SECTIONS[sectionIndex];
    var columnIndex = HeapSort.CODE_LAYOUT[sectionIndex];
    var columnX = HeapSort.CODE_COLUMNS[columnIndex];
    var currentY = columnHeights[columnIndex];

    var lineIDs = [];
    for (var i = 0; i < section.lines.length; i++) {
      var labelID = this.nextIndex++;
      this.cmd("CreateLabel", labelID, section.lines[i], columnX, currentY, 0);
      this.cmd("SetTextStyle", labelID, HeapSort.CODE_FONT);
      this.cmd("SetForegroundColor", labelID, HeapSort.CODE_STANDARD_COLOR);
      lineIDs.push(labelID);
      currentY += HeapSort.CODE_LINE_HEIGHT;
    }

    this.codeIDs.push(lineIDs);
    columnHeights[columnIndex] = currentY + HeapSort.CODE_SECTION_GAP;
  }
  this.highlightedSection = -1;
  this.highlightedLine = -1;
};

HeapSort.prototype.randomizeCallback = function () {
  this.implementAction(this.randomizeArray.bind(this, true), 0);
};

HeapSort.prototype.sortCallback = function () {
  this.implementAction(this.runHeapSort.bind(this), 0);
};

HeapSort.prototype.randomizeArray = function (showReveal) {
  this.commands = [];
  this.randomizeValues(showReveal);
  return this.commands;
};

HeapSort.prototype.randomizeValues = function (showReveal) {
  this.sortedIndices = {};
  this.removedNodes = {};
  this.heapSize = HeapSort.ARRAY_SIZE;

  for (var i = 0; i < this.arrayData.length; i++) {
    var value = this.generateRandomValue();
    this.arrayData[i] = value;
    this.cmd("SetText", this.arrayRects[i], value);
    this.cmd("SetText", this.treeNodes[i], value);
    this.cmd("SetHighlight", this.arrayRects[i], 0);
    this.cmd("SetHighlight", this.treeNodes[i], 0);
  }

  this.clearCodeHighlights();
  this.refreshHeapColors();

  if (showReveal) {
    this.cmd("SetText", this.infoLabelID, "New input array generated.");
    this.hideTree();
    this.cmd("Step");
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Constructing binary tree from the array..."
    );
    this.revealTreeSequentially();
  } else {
    this.showTreeImmediately();
  }

  this.refreshHeapColors();
  this.cmd("SetText", this.infoLabelID, "Array ready for heap sort.");
};

HeapSort.prototype.hideTree = function () {
  for (var i = 0; i < this.treeNodes.length; i++) {
    this.cmd("SetAlpha", this.treeNodes[i], 0);
  }
  for (var j = 0; j < this.edgePairs.length; j++) {
    var edge = this.edgePairs[j];
    this.cmd(
      "SetEdgeAlpha",
      this.treeNodes[edge.parent],
      this.treeNodes[edge.child],
      0
    );
  }
};

HeapSort.prototype.showTreeImmediately = function () {
  for (var i = 0; i < this.treeNodes.length; i++) {
    this.cmd("SetAlpha", this.treeNodes[i], 1);
  }
  for (var j = 0; j < this.edgePairs.length; j++) {
    var edge = this.edgePairs[j];
    this.cmd(
      "SetEdgeAlpha",
      this.treeNodes[edge.parent],
      this.treeNodes[edge.child],
      1
    );
  }
};

HeapSort.prototype.revealTreeSequentially = function () {
  for (var i = 0; i < this.treeNodes.length; i++) {
    if (i > 0) {
      var parentIndex = Math.floor((i - 1) / 2);
      this.cmd(
        "SetEdgeAlpha",
        this.treeNodes[parentIndex],
        this.treeNodes[i],
        1
      );
    }
    this.cmd("SetAlpha", this.treeNodes[i], 1);
    this.cmd("SetHighlight", this.treeNodes[i], 1);
    this.cmd("Step");
    this.cmd("SetHighlight", this.treeNodes[i], 0);
  }
  this.refreshHeapColors();
};

HeapSort.prototype.runHeapSort = function () {
  this.commands = [];
  this.sortedIndices = {};
  this.removedNodes = {};
  this.heapSize = this.arrayData.length;
  this.refreshHeapColors();
  this.clearAllHighlights();
  this.clearCodeHighlights();

  this.cmd("SetText", this.infoLabelID, "Building a max heap from the array.");
  this.highlightCode(0, 0, true);
  this.highlightCode(0, 1, true);
  this.highlightCode(0, 2, true);
  this.buildMaxHeap(this.arrayData.length);

  this.highlightCode(0, 3, true);
  for (var end = this.arrayData.length - 1; end > 0; end--) {
    this.heapSize = end + 1;
    this.refreshHeapColors();
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Swap max element at index 0 with index " + end + "."
    );
    this.highlightNode(0, true);
    this.highlightNode(end, true);
    this.highlightCode(0, 4, true);
    this.swapValues(0, end);
    this.cmd("Step");
    this.highlightNode(0, false);
    this.highlightNode(end, false);

    this.sortedIndices[end] = true;
    this.removeNodeFromTree(end);
    this.heapSize = end;
    this.refreshHeapColors();

    this.cmd(
      "SetText",
      this.infoLabelID,
      "Restore heap property for heap size " + this.heapSize + "."
    );
    this.highlightCode(0, 5, true);
    if (this.heapSize > 0) {
      this.heapify(0, this.heapSize, 0);
    }
    this.highlightCode(0, 3, false);
  }

  this.sortedIndices[0] = true;
  this.removeNodeFromTree(0);
  this.heapSize = 0;
  this.refreshHeapColors();
  this.cmd("SetText", this.infoLabelID, "All elements sorted!");
  this.highlightCode(0, 6, true);
  this.clearCodeHighlights();
  this.clearAllHighlights();
  return this.commands;
};

HeapSort.prototype.buildMaxHeap = function (size) {
  this.heapSize = size;
  this.refreshHeapColors();
  this.highlightCode(1, 0, true);
  this.highlightCode(1, 1, true);
  for (var i = Math.floor(size / 2) - 1; i >= 0; i--) {
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Heapify index " + i + " to build the max heap."
    );
    this.highlightNode(i, true);
    this.highlightCode(1, 2, true);
    this.heapify(i, size, 0);
    this.highlightNode(i, false);
  }
  this.highlightCode(1, 3, true);
};

HeapSort.prototype.heapify = function (index, heapSize, depth) {
  if (index >= heapSize) {
    return;
  }

  this.heapSize = heapSize;
  this.refreshHeapColors();

  this.cmd(
    "SetText",
    this.infoLabelID,
    "Heapify index " + index + " within heap size " + heapSize + "."
  );
  this.highlightCode(2, 0, true);
  this.highlightNode(index, true);

  var largest = index;
  this.highlightCode(2, 1, true);
  var left = 2 * index + 1;
  this.highlightCode(2, 2, true);
  var right = 2 * index + 2;
  this.highlightCode(2, 3, true);

  if (left < heapSize) {
    this.highlightEdge(index, left, true);
    this.highlightNode(left, true);
    this.highlightCode(2, 4, true);
    if (this.arrayData[left] > this.arrayData[largest]) {
      largest = left;
      this.highlightCode(2, 5, true);
    }
    this.highlightEdge(index, left, false);
    this.highlightNode(left, false);
  }

  if (right < heapSize) {
    this.highlightEdge(index, right, true);
    this.highlightNode(right, true);
    this.highlightCode(2, 7, true);
    if (this.arrayData[right] > this.arrayData[largest]) {
      largest = right;
      this.highlightCode(2, 8, true);
    }
    this.highlightEdge(index, right, false);
    this.highlightNode(right, false);
  }

  if (largest !== index) {
    this.highlightNode(largest, true);
    this.highlightCode(2, 10, true);
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Swap index " + index + " with larger child index " + largest + "."
    );
    this.highlightCode(2, 11, true);
    this.swapValues(index, largest);
    this.cmd("Step");
    this.highlightNode(index, false);
    this.highlightNode(largest, false);
    this.highlightCode(2, 12, true);
    this.heapify(largest, heapSize, depth + 1);
  } else {
    this.highlightCode(2, 13, true);
    this.cmd(
      "SetText",
      this.infoLabelID,
      "Node at index " + index + " already satisfies heap property."
    );
    this.cmd("Step");
    this.highlightNode(index, false);
  }
};

HeapSort.prototype.swapValues = function (i, j) {
  if (i === j) {
    return;
  }

  var fromLabel = this.nextIndex++;
  var toLabel = this.nextIndex++;
  var treeFromLabel = this.nextIndex++;
  var treeToLabel = this.nextIndex++;

  this.cmd(
    "CreateLabel",
    fromLabel,
    this.arrayData[i],
    this.arrayPositions[i],
    HeapSort.ARRAY_Y,
    0
  );
  this.cmd("SetTextStyle", fromLabel, "bold 16");
  this.cmd(
    "CreateLabel",
    toLabel,
    this.arrayData[j],
    this.arrayPositions[j],
    HeapSort.ARRAY_Y,
    0
  );
  this.cmd("SetTextStyle", toLabel, "bold 16");
  this.cmd("SetForegroundColor", fromLabel, HeapSort.SWAP_LABEL_COLOR);
  this.cmd("SetForegroundColor", toLabel, HeapSort.SWAP_LABEL_COLOR);

  var posI = HeapSort.TREE_POSITIONS[i];
  var posJ = HeapSort.TREE_POSITIONS[j];

  this.cmd(
    "CreateLabel",
    treeFromLabel,
    this.arrayData[i],
    posI.x,
    posI.y,
    0
  );
  this.cmd("SetTextStyle", treeFromLabel, "bold 16");
  this.cmd("SetForegroundColor", treeFromLabel, HeapSort.SWAP_LABEL_COLOR);
  this.cmd(
    "CreateLabel",
    treeToLabel,
    this.arrayData[j],
    posJ.x,
    posJ.y,
    0
  );
  this.cmd("SetTextStyle", treeToLabel, "bold 16");
  this.cmd("SetForegroundColor", treeToLabel, HeapSort.SWAP_LABEL_COLOR);

  this.cmd("Move", fromLabel, this.arrayPositions[j], HeapSort.ARRAY_Y);
  this.cmd("Move", toLabel, this.arrayPositions[i], HeapSort.ARRAY_Y);
  this.cmd("Move", treeFromLabel, posJ.x, posJ.y);
  this.cmd("Move", treeToLabel, posI.x, posI.y);
  this.cmd("Step");
  this.cmd("Delete", fromLabel);
  this.cmd("Delete", toLabel);
  this.cmd("Delete", treeFromLabel);
  this.cmd("Delete", treeToLabel);

  var temp = this.arrayData[i];
  this.arrayData[i] = this.arrayData[j];
  this.arrayData[j] = temp;

  this.cmd("SetText", this.arrayRects[i], this.arrayData[i]);
  this.cmd("SetText", this.arrayRects[j], this.arrayData[j]);
  this.cmd("SetText", this.treeNodes[i], this.arrayData[i]);
  this.cmd("SetText", this.treeNodes[j], this.arrayData[j]);
  this.refreshHeapColors();
};

HeapSort.prototype.removeNodeFromTree = function (index) {
  if (
    index < 0 ||
    index >= this.treeNodes.length ||
    (this.removedNodes && this.removedNodes[index])
  ) {
    return;
  }

  this.removedNodes[index] = true;
  this.cmd("SetHighlight", this.arrayRects[index], 0);
  this.cmd("SetHighlight", this.treeNodes[index], 0);
  this.cmd("SetAlpha", this.treeNodes[index], 0);
  this.cmd("SetText", this.treeNodes[index], "");

  if (index > 0) {
    var parentIndex = Math.floor((index - 1) / 2);
    this.cmd(
      "SetEdgeAlpha",
      this.treeNodes[parentIndex],
      this.treeNodes[index],
      0
    );
  }

  var leftChild = 2 * index + 1;
  var rightChild = 2 * index + 2;
  if (leftChild < this.treeNodes.length) {
    this.cmd(
      "SetEdgeAlpha",
      this.treeNodes[index],
      this.treeNodes[leftChild],
      0
    );
  }
  if (rightChild < this.treeNodes.length) {
    this.cmd(
      "SetEdgeAlpha",
      this.treeNodes[index],
      this.treeNodes[rightChild],
      0
    );
  }

  this.cmd("Step");
};

HeapSort.prototype.highlightNode = function (index, highlight) {
  if (index < 0 || index >= this.arrayData.length) {
    return;
  }
  var value = highlight ? 1 : 0;
  this.cmd("SetHighlight", this.arrayRects[index], value);
  this.cmd("SetHighlight", this.treeNodes[index], value);
};

HeapSort.prototype.highlightEdge = function (parentIndex, childIndex, highlight) {
  if (
    parentIndex < 0 ||
    childIndex < 0 ||
    parentIndex >= this.arrayData.length ||
    childIndex >= this.arrayData.length
  ) {
    return;
  }
  this.cmd(
    "SetEdgeHighlight",
    this.treeNodes[parentIndex],
    this.treeNodes[childIndex],
    highlight ? 1 : 0
  );
};

HeapSort.prototype.refreshHeapColors = function () {
  for (var i = 0; i < this.arrayData.length; i++) {
    var rectColor = HeapSort.DEFAULT_ARRAY_COLOR;
    var nodeColor = HeapSort.NODE_DEFAULT_COLOR;
    var isRemoved = this.removedNodes && this.removedNodes[i];
    if (this.sortedIndices[i] || isRemoved) {
      rectColor = HeapSort.SORTED_ARRAY_COLOR;
      nodeColor = HeapSort.NODE_SORTED_COLOR;
    } else if (i < this.heapSize) {
      rectColor = HeapSort.ACTIVE_ARRAY_COLOR;
      nodeColor = HeapSort.NODE_ACTIVE_COLOR;
    }
    this.cmd("SetBackgroundColor", this.arrayRects[i], rectColor);
    this.cmd("SetBackgroundColor", this.treeNodes[i], nodeColor);
    if (isRemoved) {
      this.cmd("SetAlpha", this.treeNodes[i], 0);
    }
  }
};

HeapSort.prototype.generateRandomValue = function () {
  return Math.floor(10 + Math.random() * 90);
};

HeapSort.prototype.clearCodeHighlights = function () {
  if (this.highlightedSection !== -1 && this.highlightedLine !== -1) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[this.highlightedSection][this.highlightedLine],
      HeapSort.CODE_STANDARD_COLOR
    );
  }
  this.highlightedSection = -1;
  this.highlightedLine = -1;
};

HeapSort.prototype.highlightCode = function (section, line, withStep) {
  if (this.highlightedSection === section && this.highlightedLine === line) {
    if (withStep) {
      this.cmd("Step");
    }
    return;
  }

  if (this.highlightedSection !== -1 && this.highlightedLine !== -1) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[this.highlightedSection][this.highlightedLine],
      HeapSort.CODE_STANDARD_COLOR
    );
  }

  if (section >= 0 && line >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeIDs[section][line],
      HeapSort.CODE_HIGHLIGHT_COLOR
    );
  }

  this.highlightedSection = section;
  this.highlightedLine = line;

  if (withStep) {
    this.cmd("Step");
  }
};

HeapSort.prototype.clearAllHighlights = function () {
  for (var i = 0; i < this.arrayData.length; i++) {
    this.cmd("SetHighlight", this.arrayRects[i], 0);
    this.cmd("SetHighlight", this.treeNodes[i], 0);
  }
  for (var j = 0; j < this.edgePairs.length; j++) {
    var edge = this.edgePairs[j];
    this.cmd(
      "SetEdgeHighlight",
      this.treeNodes[edge.parent],
      this.treeNodes[edge.child],
      0
    );
  }
};

HeapSort.prototype.disableUI = function () {
  this.randomizeButton.disabled = true;
  this.sortButton.disabled = true;
};

HeapSort.prototype.enableUI = function () {
  this.randomizeButton.disabled = false;
  this.sortButton.disabled = false;
};

HeapSort.prototype.resetCallback = function () {
  this.randomizeValues(false);
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new HeapSort(animManag, canvas.width, canvas.height);
}
