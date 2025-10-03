// Custom visualization for DFS traversal on an undirected graph with an expanded canvas.

function UndirectedDFS(am, w, h) {
  this.init(am, w, h);
}

UndirectedDFS.prototype = new Algorithm();
UndirectedDFS.prototype.constructor = UndirectedDFS;
UndirectedDFS.superclass = Algorithm.prototype;

UndirectedDFS.CANVAS_WIDTH = 900;
UndirectedDFS.CANVAS_HEIGHT = 1600;

UndirectedDFS.ROW1_HEIGHT = 240;
UndirectedDFS.ROW2_HEIGHT = 760;
UndirectedDFS.ROW3_HEIGHT =
  UndirectedDFS.CANVAS_HEIGHT - UndirectedDFS.ROW1_HEIGHT - UndirectedDFS.ROW2_HEIGHT;

UndirectedDFS.ROW1_CENTER_Y = UndirectedDFS.ROW1_HEIGHT / 2;
UndirectedDFS.ROW2_START_Y = UndirectedDFS.ROW1_HEIGHT;
UndirectedDFS.ROW3_START_Y =
  UndirectedDFS.ROW1_HEIGHT + UndirectedDFS.ROW2_HEIGHT;

UndirectedDFS.TITLE_Y = UndirectedDFS.ROW1_CENTER_Y - 40;
UndirectedDFS.START_INFO_Y = UndirectedDFS.ROW1_CENTER_Y + 40;

UndirectedDFS.GRAPH_AREA_CENTER_X = 360;
UndirectedDFS.GRAPH_NODE_RADIUS = 22;
UndirectedDFS.GRAPH_NODE_COLOR = "#e3f2fd";
UndirectedDFS.GRAPH_NODE_BORDER = "#0b3954";
UndirectedDFS.GRAPH_NODE_TEXT = "#003049";
UndirectedDFS.GRAPH_NODE_VISITED_COLOR = "#66bb6a";
UndirectedDFS.GRAPH_NODE_VISITED_TEXT_COLOR = "#0b3d1f";
UndirectedDFS.HIGHLIGHT_RADIUS = UndirectedDFS.GRAPH_NODE_RADIUS;
UndirectedDFS.EDGE_COLOR = "#4a4e69";
UndirectedDFS.EDGE_VISITED_COLOR = "#66bb6a";
UndirectedDFS.EDGE_THICKNESS = 3;
UndirectedDFS.EDGE_ACTIVE_THICKNESS = 2;
UndirectedDFS.EDGE_TREE_THICKNESS = 6;

UndirectedDFS.ARRAY_BASE_X = 720;
UndirectedDFS.ARRAY_COLUMN_SPACING = 80;
UndirectedDFS.ARRAY_TOP_Y = UndirectedDFS.ROW2_START_Y + 90;
UndirectedDFS.ARRAY_CELL_HEIGHT = 52;
UndirectedDFS.ARRAY_CELL_WIDTH = 60;
UndirectedDFS.ARRAY_CELL_INNER_HEIGHT = 42;
UndirectedDFS.ARRAY_HEADER_HEIGHT = UndirectedDFS.ARRAY_CELL_INNER_HEIGHT;
UndirectedDFS.ARRAY_RECT_COLOR = "#f1f1f6";
UndirectedDFS.ARRAY_RECT_BORDER = "#2b2d42";
UndirectedDFS.ARRAY_RECT_HIGHLIGHT_BORDER = "#d62828";
UndirectedDFS.ARRAY_RECT_BORDER_THICKNESS = 1;
UndirectedDFS.ARRAY_RECT_HIGHLIGHT_THICKNESS = 3;
UndirectedDFS.ARRAY_TEXT_COLOR = "#2b2d42";
UndirectedDFS.ARRAY_VISITED_FILL = "#b3e5fc";
UndirectedDFS.ARRAY_HEADER_GAP = 20;
UndirectedDFS.BOTTOM_SECTION_GAP = 56;
UndirectedDFS.CODE_TOP_PADDING = 12;

UndirectedDFS.CODE_START_X = 120;
UndirectedDFS.CODE_LINE_HEIGHT = 32;
UndirectedDFS.CODE_STANDARD_COLOR = "#1d3557";
UndirectedDFS.CODE_HIGHLIGHT_COLOR = "#e63946";
UndirectedDFS.CODE_FONT = "bold 22";

UndirectedDFS.RECURSION_AREA_CENTER_X = 660;
UndirectedDFS.RECURSION_HEADER_HEIGHT = 44;
UndirectedDFS.RECURSION_LABEL_MARGIN = 14;
UndirectedDFS.RECURSION_AREA_BOTTOM_MARGIN = 30;
UndirectedDFS.RECURSION_FRAME_WIDTH = 320;
UndirectedDFS.RECURSION_FRAME_HEIGHT = 34;
UndirectedDFS.RECURSION_FRAME_MIN_HEIGHT = 22;
UndirectedDFS.RECURSION_FRAME_SPACING = 10;
UndirectedDFS.RECURSION_FRAME_MIN_SPACING = 6;
UndirectedDFS.RECURSION_RECT_COLOR = "#f8f9fa";
UndirectedDFS.RECURSION_RECT_BORDER = "#1d3557";
UndirectedDFS.RECURSION_RECT_ACTIVE_BORDER = "#e63946";
UndirectedDFS.RECURSION_TEXT_COLOR = "#1d3557";
UndirectedDFS.RECURSION_FONT = "bold 18";

UndirectedDFS.TITLE_COLOR = "#1d3557";
UndirectedDFS.START_INFO_COLOR = "#264653";
UndirectedDFS.HIGHLIGHT_COLOR = "#ff3b30";

UndirectedDFS.CODE_LINES = [
  ["void dfs(int u, int parent) {"],
  ["    visited[u] = true;"],
  ["    for (int v : adj[u]) {"],
  ["        if (v != parent && !visited[v]) {"],
  ["            parentArr[v] = u;"],
  ["            dfs(v, u);"],
  ["        }"],
  ["    }"],
  ["}"]
];

// Allowed adjacency template derived from the DFS classroom visualization so
// the undirected graph reuses its well-spaced layout without overlaps.
UndirectedDFS.TEMPLATE_ALLOWED = [
  [false, true, true, false, true, false, false, true, false, false],
  [true, false, true, false, true, true, false, false, false, false],
  [true, true, false, true, false, true, true, false, false, false],
  [false, false, true, false, false, false, true, false, false, false],
  [true, true, false, false, false, true, false, true, true, false],
  [false, true, true, false, true, false, true, false, true, true],
  [false, false, true, true, false, true, false, false, false, true],
  [true, false, false, false, true, false, false, false, true, false],
  [false, false, false, false, true, true, false, true, false, true],
  [false, false, false, false, false, true, true, false, true, false]
];

// Matching curve data from the DFS classroom visualization template. Only
// entries with a non-zero magnitude will render as curved edges.
UndirectedDFS.TEMPLATE_CURVES = [
  [0, 0, -0.4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

UndirectedDFS.prototype.init = function (am, w, h) {
  UndirectedDFS.superclass.init.call(this, am, w, h);

  this.controls = [];
  this.addControls();

  this.vertexLabels = [];
  this.vertexPositions = [];
  this.adjacencyList = [];
  this.edgePairs = [];
  this.edgeOrientation = {};
  this.edgeStates = {};
  this.edgeMeta = {};
  this.vertexIDs = [];
  this.visitedRectIDs = [];
  this.parentRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.codeID = [];
  this.highlightCircleID = -1;
  this.currentCodeLine = -1;
  this.startDisplayID = -1;
  this.recursionBackgroundID = -1;
  this.recursionHeaderID = -1;
  this.recursionFrameIDs = [];
  this.activeRecursionIndex = -1;
  this.recursionDepth = 0;
  this.bottomSectionTopY =
    UndirectedDFS.ROW3_START_Y + UndirectedDFS.CODE_TOP_PADDING;

  this.visited = [];
  this.parentArr = [];

  this.implementAction(this.reset.bind(this), 0);
};

UndirectedDFS.prototype.addControls = function () {
  addLabelToAlgorithmBar("Start Vertex:");
  this.startField = addControlToAlgorithmBar("Text", "A");
  this.startField.size = 4;
  this.startButton = addControlToAlgorithmBar("Button", "Run DFS");
  this.startButton.onclick = this.startCallback.bind(this);
  this.startField.onkeydown = this.returnSubmit(
    this.startField,
    this.startCallback.bind(this),
    2,
    false
  );

  this.newGraphButton = addControlToAlgorithmBar("Button", "New Graph");
  this.newGraphButton.onclick = this.resetCallback.bind(this);

  this.directedGraphButton = addControlToAlgorithmBar("Button", "Directed DFS");
  this.directedGraphButton.onclick = function () {
    window.location.href = "DirectedDFS.html";
  };

  this.controls.push(
    this.startField,
    this.startButton,
    this.newGraphButton,
    this.directedGraphButton
  );
};

UndirectedDFS.prototype.reset = function () {
  this.nextIndex = 0;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  return this.setup();
};

UndirectedDFS.prototype.setup = function () {
  this.commands = [];

  this.edgeOrientation = {};
  this.edgeStates = {};
  this.edgeMeta = {};

  var vertexCount = this.chooseVertexCount();
  this.vertexLabels = this.createVertexLabels(vertexCount);
  this.generateRandomGraph(vertexCount);

  this.adjacencyList = new Array(this.vertexLabels.length);
  for (var i = 0; i < this.adjacencyList.length; i++) {
    this.adjacencyList[i] = [];
  }
  for (var e = 0; e < this.edgePairs.length; e++) {
    var edge = this.edgePairs[e];
    this.adjacencyList[edge.u].push(edge.v);
    this.adjacencyList[edge.v].push(edge.u);
  }

  this.createTitleRow();
  this.createGraphArea();
  this.createArrayArea();
  this.createCodeDisplay();
  this.createRecursionArea();

  this.highlightCodeLine(-1);

  if (this.startField) {
    this.setStartFieldValue(this.vertexLabels[0]);
  }

  this.cmd("Step");
  return this.commands;
};

UndirectedDFS.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

UndirectedDFS.prototype.chooseVertexCount = function () {
  return 10;
};

UndirectedDFS.prototype.createVertexLabels = function (count) {
  var labels = [];
  for (var i = 0; i < count; i++) {
    labels.push(String.fromCharCode("A".charCodeAt(0) + i));
  }
  return labels;
};

UndirectedDFS.prototype.createTitleRow = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "DFS Traversal On Undirected Graph",
    UndirectedDFS.CANVAS_WIDTH / 2,
    UndirectedDFS.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, UndirectedDFS.TITLE_COLOR);

  this.startDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.startDisplayID,
    "Start Vertex: A",
    UndirectedDFS.CANVAS_WIDTH / 2,
    UndirectedDFS.START_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.startDisplayID, "bold 24");
  this.cmd("SetForegroundColor", this.startDisplayID, UndirectedDFS.START_INFO_COLOR);
};

UndirectedDFS.prototype.createGraphArea = function () {
  this.vertexIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var id = this.nextIndex++;
    this.vertexIDs[i] = id;
    var pos = this.vertexPositions[i];
    this.cmd(
      "CreateCircle",
      id,
      this.vertexLabels[i],
      pos.x,
      pos.y,
      UndirectedDFS.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, UndirectedDFS.GRAPH_NODE_COLOR);
    this.cmd("SetForegroundColor", id, UndirectedDFS.GRAPH_NODE_BORDER);
    this.cmd("SetTextColor", id, UndirectedDFS.GRAPH_NODE_TEXT);
    this.cmd("SetHighlight", id, 0);
  }

  for (var j = 0; j < this.edgePairs.length; j++) {
    var pair = this.edgePairs[j];
    var key = this.edgeKey(pair.u, pair.v);
    this.edgeOrientation[key] = {
      from: pair.u,
      to: pair.v
    };
    this.edgeStates[key] = { tree: false };
    this.edgeMeta[key] = pair;
    this.cmd(
      "Connect",
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      UndirectedDFS.EDGE_COLOR,
      pair.curve,
      0,
      ""
    );
    this.cmd(
      "SetEdgeThickness",
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      UndirectedDFS.EDGE_THICKNESS
    );
    this.cmd(
      "SetEdgeHighlight",
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      0
    );
  }

  this.highlightCircleID = this.nextIndex++;
  var startPos = this.vertexPositions[0];
  this.cmd(
    "CreateHighlightCircle",
    this.highlightCircleID,
    UndirectedDFS.HIGHLIGHT_COLOR,
    startPos.x,
    startPos.y,
    UndirectedDFS.HIGHLIGHT_RADIUS
  );
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

UndirectedDFS.prototype.createArrayArea = function () {
  var visitedHeaderID = this.nextIndex++;
  var parentHeaderID = this.nextIndex++;
  var headerY =
    UndirectedDFS.ARRAY_TOP_Y - UndirectedDFS.ARRAY_CELL_HEIGHT / 2 - UndirectedDFS.ARRAY_HEADER_GAP;

  this.cmd(
    "CreateLabel",
    visitedHeaderID,
    "Visited",
    UndirectedDFS.ARRAY_BASE_X,
    headerY
  );
  this.cmd("SetTextStyle", visitedHeaderID, "bold 20");
  this.cmd("SetForegroundColor", visitedHeaderID, UndirectedDFS.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    parentHeaderID,
    "parentArr",
    UndirectedDFS.ARRAY_BASE_X + UndirectedDFS.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", parentHeaderID, "bold 20");
  this.cmd("SetForegroundColor", parentHeaderID, UndirectedDFS.CODE_STANDARD_COLOR);

  this.visitedRectIDs = new Array(this.vertexLabels.length);
  this.parentRectIDs = new Array(this.vertexLabels.length);
  this.vertexRowLabelIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rowY = UndirectedDFS.ARRAY_TOP_Y + i * UndirectedDFS.ARRAY_CELL_HEIGHT;

    var vertexLabelID = this.nextIndex++;
    this.vertexRowLabelIDs[i] = vertexLabelID;
    this.cmd(
      "CreateLabel",
      vertexLabelID,
      this.vertexLabels[i],
      UndirectedDFS.ARRAY_BASE_X - 58,
      rowY,
      0
    );
    this.cmd("SetTextStyle", vertexLabelID, "bold 20");
    this.cmd("SetForegroundColor", vertexLabelID, UndirectedDFS.START_INFO_COLOR);

    var visitedID = this.nextIndex++;
    this.visitedRectIDs[i] = visitedID;
    this.cmd(
      "CreateRectangle",
      visitedID,
      "F",
      UndirectedDFS.ARRAY_CELL_WIDTH,
      UndirectedDFS.ARRAY_CELL_INNER_HEIGHT,
      UndirectedDFS.ARRAY_BASE_X,
      rowY
    );
    this.cmd("SetForegroundColor", visitedID, UndirectedDFS.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", visitedID, UndirectedDFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", visitedID, UndirectedDFS.ARRAY_TEXT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      visitedID,
      UndirectedDFS.ARRAY_RECT_BORDER_THICKNESS
    );

    var parentID = this.nextIndex++;
    this.parentRectIDs[i] = parentID;
    this.cmd(
      "CreateRectangle",
      parentID,
      "null",
      UndirectedDFS.ARRAY_CELL_WIDTH,
      UndirectedDFS.ARRAY_CELL_INNER_HEIGHT,
      UndirectedDFS.ARRAY_BASE_X + UndirectedDFS.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", parentID, UndirectedDFS.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", parentID, UndirectedDFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", parentID, UndirectedDFS.ARRAY_TEXT_COLOR);
  }

  var lastRowIndex = this.vertexLabels.length - 1;
  if (lastRowIndex >= 0) {
    var lastCenterY =
      UndirectedDFS.ARRAY_TOP_Y + lastRowIndex * UndirectedDFS.ARRAY_CELL_HEIGHT;
    var arrayBottomY =
      lastCenterY + UndirectedDFS.ARRAY_CELL_INNER_HEIGHT / 2;
    this.bottomSectionTopY = arrayBottomY + UndirectedDFS.BOTTOM_SECTION_GAP;
  }
};

UndirectedDFS.prototype.setVisitedCellHighlight = function (index, active) {
  if (index < 0 || index >= this.visitedRectIDs.length) {
    return;
  }
  var color = active
    ? UndirectedDFS.ARRAY_RECT_HIGHLIGHT_BORDER
    : UndirectedDFS.ARRAY_RECT_BORDER;
  var thickness = active
    ? UndirectedDFS.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : UndirectedDFS.ARRAY_RECT_BORDER_THICKNESS;
  var rectID = this.visitedRectIDs[index];
  this.cmd("SetForegroundColor", rectID, color);
  this.cmd("SetRectangleLineThickness", rectID, thickness);
};

UndirectedDFS.prototype.createCodeDisplay = function () {
  var startY = this.bottomSectionTopY + UndirectedDFS.CODE_TOP_PADDING;
  this.codeID = this.addCodeToCanvasBase(
    UndirectedDFS.CODE_LINES,
    UndirectedDFS.CODE_START_X,
    startY,
    UndirectedDFS.CODE_LINE_HEIGHT,
    UndirectedDFS.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], UndirectedDFS.CODE_FONT);
    }
  }
};

UndirectedDFS.prototype.computeRecursionLayout = function (frameCount) {
  var layout = {
    height: UndirectedDFS.RECURSION_FRAME_HEIGHT,
    spacing: UndirectedDFS.RECURSION_FRAME_SPACING,
    startY:
      this.bottomSectionTopY +
      UndirectedDFS.RECURSION_HEADER_HEIGHT +
      UndirectedDFS.RECURSION_LABEL_MARGIN +
      UndirectedDFS.RECURSION_FRAME_HEIGHT / 2
  };

  if (frameCount <= 0) {
    return layout;
  }

  var availableHeight =
    UndirectedDFS.CANVAS_HEIGHT -
    (this.bottomSectionTopY +
      UndirectedDFS.RECURSION_HEADER_HEIGHT +
      UndirectedDFS.RECURSION_LABEL_MARGIN +
      UndirectedDFS.RECURSION_AREA_BOTTOM_MARGIN);

  if (availableHeight <= 0) {
    return layout;
  }

  var spacing = frameCount === 1 ? 0 : layout.spacing;
  var height = Math.min(
    UndirectedDFS.RECURSION_FRAME_HEIGHT,
    Math.max(
      UndirectedDFS.RECURSION_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    )
  );

  var totalHeight = height * frameCount + spacing * (frameCount - 1);
  if (totalHeight > availableHeight) {
    spacing = Math.max(
      UndirectedDFS.RECURSION_FRAME_MIN_SPACING,
      Math.floor(
        (availableHeight - height * frameCount) / Math.max(1, frameCount - 1)
      )
    );
    if (spacing < 0) {
      spacing = 0;
    }
    height = Math.max(
      UndirectedDFS.RECURSION_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    );
  }

  layout.height = height;
  layout.spacing = spacing;
  layout.startY =
    this.bottomSectionTopY +
    UndirectedDFS.RECURSION_HEADER_HEIGHT +
    UndirectedDFS.RECURSION_LABEL_MARGIN +
    height / 2;

  return layout;
};

UndirectedDFS.prototype.createRecursionArea = function () {
  var frameCount = this.vertexLabels.length;
  var layout = this.computeRecursionLayout(frameCount);
  var framesTop = layout.startY - layout.height / 2;
  var totalFrameHeight =
    frameCount > 0
      ? layout.height * frameCount + layout.spacing * (frameCount - 1)
      : 0;
  this.recursionBackgroundID = -1;

  this.recursionHeaderID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.recursionHeaderID,
    "Call Stack",
    UndirectedDFS.RECURSION_AREA_CENTER_X,
    this.bottomSectionTopY + UndirectedDFS.RECURSION_HEADER_HEIGHT / 2,
    0
  );
  this.cmd(
    "SetForegroundColor",
    this.recursionHeaderID,
    UndirectedDFS.CODE_STANDARD_COLOR
  );
  this.cmd("SetTextStyle", this.recursionHeaderID, "bold 22");

  this.recursionFrameIDs = [];
  this.activeRecursionIndex = -1;
  this.recursionDepth = 0;

  var y = layout.startY;

  for (var i = 0; i < frameCount; i++) {
    var rectID = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      UndirectedDFS.RECURSION_FRAME_WIDTH,
      layout.height,
      UndirectedDFS.RECURSION_AREA_CENTER_X,
      y
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      UndirectedDFS.RECURSION_RECT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, UndirectedDFS.RECURSION_RECT_BORDER);
    this.cmd("SetAlpha", rectID, 0);
    this.cmd("SetTextColor", rectID, UndirectedDFS.RECURSION_TEXT_COLOR);
    this.cmd("SetTextStyle", rectID, UndirectedDFS.RECURSION_FONT);

    this.recursionFrameIDs.push(rectID);

    y += layout.height + layout.spacing;
  }
};

UndirectedDFS.prototype.resetRecursionArea = function () {
  this.recursionDepth = 0;
  this.activeRecursionIndex = -1;
  for (var i = 0; i < this.recursionFrameIDs.length; i++) {
    this.cmd("SetAlpha", this.recursionFrameIDs[i], 0);
    this.cmd("SetText", this.recursionFrameIDs[i], "");
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[i],
      UndirectedDFS.RECURSION_RECT_BORDER
    );
  }
};

UndirectedDFS.prototype.pushRecursionFrame = function (vertex, parent) {
  if (
    this.recursionDepth < 0 ||
    this.recursionDepth >= this.recursionFrameIDs.length ||
    !this.vertexLabels ||
    vertex < 0 ||
    vertex >= this.vertexLabels.length
  ) {
    return;
  }

  if (this.activeRecursionIndex >= 0 && this.activeRecursionIndex < this.recursionFrameIDs.length) {
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[this.activeRecursionIndex],
      UndirectedDFS.RECURSION_RECT_BORDER
    );
  }

  var frameID = this.recursionFrameIDs[this.recursionDepth];
  var parentLabel = "null";
  if (
    typeof parent === "number" &&
    parent >= 0 &&
    parent < this.vertexLabels.length
  ) {
    parentLabel = this.vertexLabels[parent];
  }
  var text =
    "dfs(" + this.vertexLabels[vertex] + ", " + parentLabel + ")";
  this.cmd("SetText", frameID, text);
  this.cmd("SetAlpha", frameID, 1);
  this.cmd("SetForegroundColor", frameID, UndirectedDFS.RECURSION_RECT_ACTIVE_BORDER);

  this.activeRecursionIndex = this.recursionDepth;
  this.recursionDepth++;
};

UndirectedDFS.prototype.popRecursionFrame = function () {
  if (this.recursionDepth <= 0) {
    return;
  }

  this.recursionDepth--;
  var frameID = this.recursionFrameIDs[this.recursionDepth];
  this.cmd("SetAlpha", frameID, 0);
  this.cmd("SetText", frameID, "");
  this.cmd("SetForegroundColor", frameID, UndirectedDFS.RECURSION_RECT_BORDER);

  this.activeRecursionIndex = this.recursionDepth - 1;
  if (this.activeRecursionIndex >= 0 && this.activeRecursionIndex < this.recursionFrameIDs.length) {
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[this.activeRecursionIndex],
      UndirectedDFS.RECURSION_RECT_ACTIVE_BORDER
    );
  }
};

UndirectedDFS.prototype.highlightCodeLine = function (lineIndex) {
  if (this.currentCodeLine >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[this.currentCodeLine][0],
      UndirectedDFS.CODE_STANDARD_COLOR
    );
  }
  this.currentCodeLine = lineIndex;
  if (lineIndex >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[lineIndex][0],
      UndirectedDFS.CODE_HIGHLIGHT_COLOR
    );
  }
};

UndirectedDFS.prototype.clearTraversalState = function () {
  this.visited = new Array(this.vertexLabels.length);
  this.parentArr = new Array(this.vertexLabels.length);
  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.visited[i] = false;
    this.parentArr[i] = null;
    this.cmd("SetText", this.visitedRectIDs[i], "F");
    this.cmd("SetBackgroundColor", this.visitedRectIDs[i], UndirectedDFS.ARRAY_RECT_COLOR);
    this.cmd(
      "SetForegroundColor",
      this.visitedRectIDs[i],
      UndirectedDFS.ARRAY_RECT_BORDER
    );
    this.cmd(
      "SetRectangleLineThickness",
      this.visitedRectIDs[i],
      UndirectedDFS.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetText", this.parentRectIDs[i], "null");
    this.cmd(
      "SetBackgroundColor",
      this.parentRectIDs[i],
      UndirectedDFS.ARRAY_RECT_COLOR
    );
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[i],
      UndirectedDFS.GRAPH_NODE_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[i],
      UndirectedDFS.GRAPH_NODE_TEXT
    );
  }
  this.resetEdgesToUndirected();
  this.resetRecursionArea();
};

UndirectedDFS.prototype.edgeKey = function (u, v) {
  return u < v ? u + "-" + v : v + "-" + u;
};

UndirectedDFS.prototype.resetEdgesToUndirected = function () {
  var key;
  for (key in this.edgeOrientation) {
    if (!this.edgeOrientation.hasOwnProperty(key)) {
      continue;
    }
    var orientation = this.edgeOrientation[key];
    this.cmd(
      "Disconnect",
      this.vertexIDs[orientation.from],
      this.vertexIDs[orientation.to]
    );
  }

  this.edgeOrientation = {};
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    var fromID = this.vertexIDs[edge.u];
    var toID = this.vertexIDs[edge.v];
    this.cmd(
      "Connect",
      fromID,
      toID,
      UndirectedDFS.EDGE_COLOR,
      edge.curve,
      0,
      ""
    );
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UndirectedDFS.EDGE_THICKNESS
    );
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    var edgeKey = this.edgeKey(edge.u, edge.v);
    this.edgeOrientation[edgeKey] = {
      from: edge.u,
      to: edge.v,
      directed: 0
    };
    this.edgeStates[edgeKey] = {
      tree: false,
      baseFrom: edge.u,
      baseTo: edge.v
    };
    this.edgeMeta[edgeKey] = edge;
  }
};

UndirectedDFS.prototype.getCurveForOrientation = function (key, from, to) {
  var meta = this.edgeMeta[key];
  if (!meta) {
    return 0;
  }
  var curve = meta.curve;
  if (curve !== 0 && from === meta.v && to === meta.u) {
    curve = -curve;
  }
  return curve;
};

UndirectedDFS.prototype.ensureEdgeConnection = function (
  key,
  from,
  to,
  color,
  directed,
  thickness,
  highlight
) {
  if (
    !this.vertexIDs ||
    from < 0 ||
    to < 0 ||
    from >= this.vertexIDs.length ||
    to >= this.vertexIDs.length
  ) {
    return;
  }

  var current = this.edgeOrientation[key];
  var needsReconnect = true;
  if (current) {
    var currentDirected = current.directed ? 1 : 0;
    var desiredDirected = directed ? 1 : 0;
    if (
      current.from === from &&
      current.to === to &&
      currentDirected === desiredDirected
    ) {
      needsReconnect = false;
    } else {
      this.cmd(
        "Disconnect",
        this.vertexIDs[current.from],
        this.vertexIDs[current.to]
      );
    }
  }

  var fromID = this.vertexIDs[from];
  var toID = this.vertexIDs[to];

  if (needsReconnect) {
    var curve = this.getCurveForOrientation(key, from, to);
    this.cmd(
      "Connect",
      fromID,
      toID,
      color,
      curve,
      directed ? 1 : 0,
      ""
    );
  } else {
    this.cmd("SetEdgeColor", fromID, toID, color);
  }

  this.cmd("SetEdgeThickness", fromID, toID, thickness);
  this.cmd("SetEdgeHighlight", fromID, toID, highlight ? 1 : 0);

  this.edgeOrientation[key] = { from: from, to: to, directed: directed ? 1 : 0 };
};

UndirectedDFS.prototype.setEdgeActive = function (u, v, active) {
  var key = this.edgeKey(u, v);
  var state = this.edgeStates[key];
  if (!state) {
    return;
  }

  var isTree = !!state.tree;
  var baseColor = isTree
    ? UndirectedDFS.EDGE_VISITED_COLOR
    : UndirectedDFS.EDGE_COLOR;

  if (active) {
    this.ensureEdgeConnection(
      key,
      u,
      v,
      baseColor,
      true,
      isTree
        ? UndirectedDFS.EDGE_TREE_THICKNESS
        : UndirectedDFS.EDGE_ACTIVE_THICKNESS,
      true
    );
  } else if (isTree) {
    var treeFrom = state.treeFrom;
    var treeTo = state.treeTo;
    if (treeFrom === undefined || treeTo === undefined) {
      var orientation = this.edgeOrientation[key];
      if (orientation) {
        treeFrom = orientation.from;
        treeTo = orientation.to;
      } else {
        treeFrom = u;
        treeTo = v;
      }
    }
    this.ensureEdgeConnection(
      key,
      treeFrom,
      treeTo,
      UndirectedDFS.EDGE_VISITED_COLOR,
      true,
      UndirectedDFS.EDGE_TREE_THICKNESS,
      false
    );
  } else {
    var baseFrom = state.baseFrom;
    var baseTo = state.baseTo;
    if (baseFrom === undefined || baseTo === undefined) {
      var meta = this.edgeMeta[key];
      if (meta) {
        baseFrom = meta.u;
        baseTo = meta.v;
      } else {
        baseFrom = u;
        baseTo = v;
      }
      state.baseFrom = baseFrom;
      state.baseTo = baseTo;
    }
    this.ensureEdgeConnection(
      key,
      baseFrom,
      baseTo,
      UndirectedDFS.EDGE_COLOR,
      false,
      UndirectedDFS.EDGE_THICKNESS,
      false
    );
  }
};

UndirectedDFS.prototype.animateHighlightTraversal = function (fromIndex, toIndex) {
  if (fromIndex === toIndex) {
    return;
  }

  var startPos = this.vertexPositions[fromIndex];
  var endPos = this.vertexPositions[toIndex];
  var key = this.edgeKey(fromIndex, toIndex);
  var meta = this.edgeMeta[key];
  var curve = 0;
  if (meta) {
    curve = meta.curve;
    if (curve !== 0 && fromIndex === meta.v && toIndex === meta.u) {
      curve = -curve;
    }
  }

  if (!meta || Math.abs(curve) < 0.01) {
    this.cmd("Move", this.highlightCircleID, Math.round(endPos.x), Math.round(endPos.y));
    this.cmd("Step");
    return;
  }

  var dx = endPos.x - startPos.x;
  var dy = endPos.y - startPos.y;
  var midX = (startPos.x + endPos.x) / 2;
  var midY = (startPos.y + endPos.y) / 2;
  var controlX = midX - dy * curve;
  var controlY = midY + dx * curve;

  this.cmd(
    "MoveAlongCurve",
    this.highlightCircleID,
    Math.round(controlX),
    Math.round(controlY),
    Math.round(endPos.x),
    Math.round(endPos.y)
  );
  this.cmd("Step");
};

UndirectedDFS.prototype.getStartFieldValue = function () {
  if (!this.startField) {
    return "";
  }

  var field = this.startField;
  if (typeof field.value === "string") {
    return field.value;
  }
  if (field.value !== undefined && field.value !== null) {
    return String(field.value);
  }
  if (field.getAttribute) {
    var attr = field.getAttribute("value");
    if (typeof attr === "string") {
      return attr;
    }
  }
  return "";
};

UndirectedDFS.prototype.setStartFieldValue = function (text) {
  if (!this.startField) {
    return;
  }

  var value = typeof text === "string" ? text : "";
  if (typeof this.startField.value !== "undefined") {
    this.startField.value = value;
  } else if (this.startField.setAttribute) {
    this.startField.setAttribute("value", value);
  }
};

UndirectedDFS.prototype.markEdgeAsTreeEdge = function (parent, child) {
  var key = this.edgeKey(parent, child);
  var orientation = this.edgeOrientation[key];
  var meta = this.edgeMeta[key];
  if (!orientation || !meta) {
    return;
  }

  this.cmd(
    "Disconnect",
    this.vertexIDs[orientation.from],
    this.vertexIDs[orientation.to]
  );
  var curve = meta.curve;
  if (curve !== 0 && parent === meta.v && child === meta.u) {
    curve = -curve;
  }

  this.cmd(
    "Connect",
    this.vertexIDs[parent],
    this.vertexIDs[child],
    UndirectedDFS.EDGE_VISITED_COLOR,
    curve,
    1,
    ""
  );
  this.cmd(
    "SetEdgeThickness",
    this.vertexIDs[parent],
    this.vertexIDs[child],
    UndirectedDFS.EDGE_TREE_THICKNESS
  );
  this.cmd(
    "SetEdgeHighlight",
    this.vertexIDs[parent],
    this.vertexIDs[child],
    0
  );
  this.edgeOrientation[key] = { from: parent, to: child, directed: 1 };
  if (!this.edgeStates[key]) {
    this.edgeStates[key] = {};
  }
  this.edgeStates[key].tree = true;
  this.edgeStates[key].treeFrom = parent;
  this.edgeStates[key].treeTo = child;
};

UndirectedDFS.prototype.computeTemplateLayout = function (vertexCount) {
  var layout = [];
  var baseX = 180;
  var stepX = 130;
  var baseY = UndirectedDFS.ROW2_START_Y + 120;
  var rowSpacing = 150;
  var rowPattern = [4, 3, 4, 3, 4];

  for (var row = 0, index = 0; row < rowPattern.length; row++) {
    var count = rowPattern[row];
    var startX = count === 4 ? baseX : baseX + stepX / 2;
    var y = baseY + row * rowSpacing;
    for (var col = 0; col < count && index < vertexCount; col++, index++) {
      layout.push({ x: startX + col * stepX, y: y });
    }
    if (layout.length >= vertexCount) {
      break;
    }
  }

  return layout;
};

UndirectedDFS.prototype.generateRandomGraph = function (vertexCount) {
  this.vertexPositions = this.computeTemplateLayout(vertexCount);

  var allowed = UndirectedDFS.TEMPLATE_ALLOWED;
  var curves = UndirectedDFS.TEMPLATE_CURVES;
  var edges = [];
  var existing = {};

  var addEdge = function (u, v) {
    if (u === v) {
      return false;
    }
    var a = Math.min(u, v);
    var b = Math.max(u, v);
    var key = a + "-" + b;
    if (existing[key]) {
      return false;
    }
    var curve = 0;
    if (
      curves[a] &&
      typeof curves[a][b] === "number" &&
      Math.abs(curves[a][b]) > 0.0001
    ) {
      curve = curves[a][b];
    }
    edges.push({ u: a, v: b, curve: curve });
    existing[key] = true;
    return true;
  };

  for (var v = 1; v < vertexCount; v++) {
    var neighbors = [];
    for (var u = 0; u < vertexCount; u++) {
      if (allowed[v] && allowed[v][u]) {
        neighbors.push(u);
      }
    }
    if (neighbors.length > 0) {
      for (var t = neighbors.length - 1; t >= 0; t--) {
        var swap = Math.floor(Math.random() * (t + 1));
        var candidate = neighbors[swap];
        neighbors[swap] = neighbors[t];
        neighbors[t] = candidate;
        if (addEdge(candidate, v)) {
          break;
        }
      }
    }
  }

  var edgePercent = 0.45;
  for (var i = 0; i < vertexCount; i++) {
    for (var j = i + 1; j < vertexCount; j++) {
      if (!allowed[i] || !allowed[i][j]) {
        continue;
      }
      if (existing[i + "-" + j]) {
        continue;
      }
      if (Math.random() <= edgePercent) {
        addEdge(i, j);
      }
    }
  }

  var hasCurve = false;
  for (var e = 0; e < edges.length; e++) {
    if (Math.abs(edges[e].curve) > 0.01) {
      hasCurve = true;
      break;
    }
  }
  if (!hasCurve) {
    for (var r = 0; r < vertexCount && !hasCurve; r++) {
      for (var c = r + 1; c < vertexCount && !hasCurve; c++) {
        if (!allowed[r] || !allowed[r][c]) {
          continue;
        }
        if (
          curves[r] &&
          typeof curves[r][c] === "number" &&
          Math.abs(curves[r][c]) > 0.01
        ) {
          if (addEdge(r, c)) {
            hasCurve = true;
          }
        }
      }
    }
  }

  this.edgePairs = edges;
};

UndirectedDFS.prototype.applyVertexClamping = function (
  minX,
  maxX,
  minY,
  maxY
) {
  for (var i = 0; i < this.vertexPositions.length; i++) {
    this.vertexPositions[i].x = Math.max(
      minX,
      Math.min(maxX, this.vertexPositions[i].x)
    );
    this.vertexPositions[i].y = Math.max(
      minY,
      Math.min(maxY, this.vertexPositions[i].y)
    );
  }
};

UndirectedDFS.prototype.relaxVertices = function (
  minSeparation,
  iterations,
  minX,
  maxX,
  minY,
  maxY
) {
  iterations = Math.max(0, iterations);
  for (var iteration = 0; iteration < iterations; iteration++) {
    for (var a = 0; a < this.vertexPositions.length; a++) {
      for (var b = a + 1; b < this.vertexPositions.length; b++) {
        var dx = this.vertexPositions[b].x - this.vertexPositions[a].x;
        var dy = this.vertexPositions[b].y - this.vertexPositions[a].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) {
          dx = (Math.random() - 0.5) * 0.01;
          dy = (Math.random() - 0.5) * 0.01;
          dist = Math.sqrt(dx * dx + dy * dy);
        }
        if (dist < minSeparation) {
          var push = (minSeparation - dist) / 2;
          var nx = dx / dist;
          var ny = dy / dist;
          this.vertexPositions[a].x -= nx * push;
          this.vertexPositions[a].y -= ny * push;
          this.vertexPositions[b].x += nx * push;
          this.vertexPositions[b].y += ny * push;
        }
      }
    }
    this.applyVertexClamping(minX, maxX, minY, maxY);
  }
};

UndirectedDFS.prototype.roundVertexPositions = function () {
  for (var i = 0; i < this.vertexPositions.length; i++) {
    this.vertexPositions[i].x = Math.round(this.vertexPositions[i].x);
    this.vertexPositions[i].y = Math.round(this.vertexPositions[i].y);
  }
};

UndirectedDFS.prototype.pushVerticesAwayFromEdges = function (
  edges,
  clearance,
  iterations,
  minX,
  maxX,
  minY,
  maxY
) {
  if (!edges || edges.length === 0) {
    return;
  }
  var vertexCount = this.vertexPositions.length;
  var influence = clearance * 0.45;
  for (var iter = 0; iter < iterations; iter++) {
    var adjustments = new Array(vertexCount);
    for (var i = 0; i < vertexCount; i++) {
      adjustments[i] = { x: 0, y: 0 };
    }
    var changed = false;

    for (var e = 0; e < edges.length; e++) {
      var u = edges[e].u;
      var v = edges[e].v;
      var start = this.vertexPositions[u];
      var end = this.vertexPositions[v];
      var edgeDX = end.x - start.x;
      var edgeDY = end.y - start.y;
      var edgeLenSq = edgeDX * edgeDX + edgeDY * edgeDY;
      if (edgeLenSq === 0) {
        continue;
      }

      for (var w = 0; w < vertexCount; w++) {
        if (w === u || w === v) {
          continue;
        }
        var point = this.vertexPositions[w];
        var t =
          ((point.x - start.x) * edgeDX + (point.y - start.y) * edgeDY) /
          edgeLenSq;
        t = Math.max(0, Math.min(1, t));
        var closestX = start.x + t * edgeDX;
        var closestY = start.y + t * edgeDY;
        var diffX = point.x - closestX;
        var diffY = point.y - closestY;
        var dist = Math.sqrt(diffX * diffX + diffY * diffY);
        if (dist < clearance) {
          var away = Math.max(dist, 0.0001);
          var strength = (clearance - dist) / clearance;
          adjustments[w].x += (diffX / away) * strength * influence;
          adjustments[w].y += (diffY / away) * strength * influence;
          changed = true;
        }
      }
    }

    if (!changed) {
      break;
    }

    for (var idx = 0; idx < vertexCount; idx++) {
      this.vertexPositions[idx].x += adjustments[idx].x;
      this.vertexPositions[idx].y += adjustments[idx].y;
    }

    this.applyVertexClamping(minX, maxX, minY, maxY);
  }
};

UndirectedDFS.prototype.isWhitespaceChar = function (ch) {
  return (
    ch === " " ||
    ch === "\t" ||
    ch === "\n" ||
    ch === "\r" ||
    ch === "\f" ||
    ch === "\u00a0"
  );
};

UndirectedDFS.prototype.cleanInputLabel = function (inputLabel) {
  if (typeof inputLabel !== "string") {
    return "";
  }

  var start = 0;
  while (
    start < inputLabel.length &&
    this.isWhitespaceChar(inputLabel.charAt(start))
  ) {
    start++;
  }

  var end = inputLabel.length - 1;
  while (end >= start && this.isWhitespaceChar(inputLabel.charAt(end))) {
    end--;
  }

  var trimmed = "";
  for (var i = start; i <= end; i++) {
    trimmed += inputLabel.charAt(i);
  }

  return trimmed;
};

UndirectedDFS.prototype.findVertexIndex = function (label) {
  if (!this.vertexLabels) {
    return -1;
  }
  for (var i = 0; i < this.vertexLabels.length; i++) {
    if (this.vertexLabels[i] === label) {
      return i;
    }
  }
  return -1;
};

UndirectedDFS.prototype.startCallback = function () {
  if (
    !this.startField ||
    !this.vertexLabels ||
    this.vertexLabels.length === 0
  ) {
    return;
  }

  var raw = this.cleanInputLabel(this.getStartFieldValue());
  var label = "";
  if (raw.length > 0) {
    label = raw.charAt(0).toUpperCase();
  }

  var index = -1;
  if (label.length > 0) {
    index = this.findVertexIndex(label);
  }

  if (index === -1) {
    index = 0;
    label = this.vertexLabels[0];
  }

  this.setStartFieldValue(label);
  this.implementAction(this.runTraversal.bind(this), index);
};

UndirectedDFS.prototype.runTraversal = function (startIndex) {
  this.commands = [];

  this.clearTraversalState();

  var startLabel = this.vertexLabels[startIndex];
  this.cmd(
    "SetText",
    this.startDisplayID,
    "Start Vertex: " + startLabel
  );

  var startPos = this.vertexPositions[startIndex];
  this.cmd("SetAlpha", this.highlightCircleID, 1);
  this.cmd("Move", this.highlightCircleID, startPos.x, startPos.y);
  this.cmd("Step");

  this.dfsVisit(startIndex, -1);

  this.highlightCodeLine(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);

  return this.commands;
};

UndirectedDFS.prototype.dfsVisit = function (u, parent) {
  this.pushRecursionFrame(u, parent);
  this.cmd("Step");

  this.highlightCodeLine(0);
  this.cmd("Step");

  this.highlightCodeLine(1);
  this.setVisitedCellHighlight(u, true);
  this.cmd("Step");
  if (!this.visited[u]) {
    this.visited[u] = true;
    this.cmd("SetText", this.visitedRectIDs[u], "T");
    this.cmd(
      "SetBackgroundColor",
      this.visitedRectIDs[u],
      UndirectedDFS.ARRAY_VISITED_FILL
    );
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[u],
      UndirectedDFS.GRAPH_NODE_VISITED_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[u],
      UndirectedDFS.GRAPH_NODE_VISITED_TEXT_COLOR
    );
    this.cmd("Step");
  }
  this.setVisitedCellHighlight(u, false);

  this.highlightCodeLine(2);
  this.cmd("Step");

  var neighbors = this.adjacencyList[u];
  for (var i = 0; i < neighbors.length; i++) {
    var v = neighbors[i];

    this.setEdgeActive(u, v, true);
    this.cmd("Step");

    this.highlightCodeLine(3);
    this.cmd("Step");

    this.setVisitedCellHighlight(v, true);
    this.cmd("Step");

    if (v !== parent && !this.visited[v]) {
      this.highlightCodeLine(4);
      this.parentArr[v] = u;
      this.cmd(
        "SetText",
        this.parentRectIDs[v],
        this.vertexLabels[u]
      );
      this.cmd("Step");

      this.highlightCodeLine(5);
      this.cmd("Step");
      this.animateHighlightTraversal(u, v);

      this.dfsVisit(v, u);

      this.animateHighlightTraversal(v, u);
      this.markEdgeAsTreeEdge(u, v);
      this.cmd("Step");
    }

    this.highlightCodeLine(6);
    this.cmd("Step");

    this.setVisitedCellHighlight(v, false);
    this.cmd("Step");

    this.setEdgeActive(u, v, false);

    this.highlightCodeLine(2);
    this.cmd("Step");
  }

  this.highlightCodeLine(7);
  this.cmd("Step");
  this.highlightCodeLine(8);
  this.cmd("Step");
  this.popRecursionFrame();
};

UndirectedDFS.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

UndirectedDFS.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new UndirectedDFS(animManag, canvas.width, canvas.height);
}
