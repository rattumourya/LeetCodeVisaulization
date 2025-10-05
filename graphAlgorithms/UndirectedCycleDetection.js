// Custom visualization for cycle detection on an undirected graph with an expanded canvas.

function UndirectedCycleDetection(am, w, h) {
  this.init(am, w, h);
}

UndirectedCycleDetection.prototype = new Algorithm();
UndirectedCycleDetection.prototype.constructor = UndirectedCycleDetection;
UndirectedCycleDetection.superclass = Algorithm.prototype;

UndirectedCycleDetection.CANVAS_WIDTH = 900;
UndirectedCycleDetection.CANVAS_HEIGHT = 1600;

UndirectedCycleDetection.ROW1_HEIGHT = 240;
UndirectedCycleDetection.ROW2_HEIGHT = 760;
UndirectedCycleDetection.ROW3_HEIGHT =
  UndirectedCycleDetection.CANVAS_HEIGHT - UndirectedCycleDetection.ROW1_HEIGHT - UndirectedCycleDetection.ROW2_HEIGHT;

UndirectedCycleDetection.ROW1_CENTER_Y = UndirectedCycleDetection.ROW1_HEIGHT / 2;
UndirectedCycleDetection.ROW2_START_Y = UndirectedCycleDetection.ROW1_HEIGHT;
UndirectedCycleDetection.ROW3_START_Y =
  UndirectedCycleDetection.ROW1_HEIGHT + UndirectedCycleDetection.ROW2_HEIGHT;

UndirectedCycleDetection.TITLE_Y = UndirectedCycleDetection.ROW1_CENTER_Y - 40;
UndirectedCycleDetection.START_INFO_Y = UndirectedCycleDetection.ROW1_CENTER_Y + 40;
UndirectedCycleDetection.STATUS_INFO_Y =
  UndirectedCycleDetection.START_INFO_Y + 38;

UndirectedCycleDetection.GRAPH_AREA_CENTER_X = 360;
UndirectedCycleDetection.GRAPH_NODE_RADIUS = 22;
UndirectedCycleDetection.GRAPH_NODE_COLOR = "#e3f2fd";
UndirectedCycleDetection.GRAPH_NODE_BORDER = "#0b3954";
UndirectedCycleDetection.GRAPH_NODE_TEXT = "#003049";
UndirectedCycleDetection.GRAPH_NODE_VISITED_COLOR = "#66bb6a";
UndirectedCycleDetection.GRAPH_NODE_VISITED_TEXT_COLOR = "#0b3d1f";
UndirectedCycleDetection.GRAPH_NODE_CYCLE_COLOR = "#ffe082";
UndirectedCycleDetection.GRAPH_NODE_CYCLE_TEXT_COLOR = "#5d3500";
UndirectedCycleDetection.HIGHLIGHT_RADIUS = UndirectedCycleDetection.GRAPH_NODE_RADIUS;
UndirectedCycleDetection.EDGE_COLOR = "#4a4e69";
UndirectedCycleDetection.EDGE_VISITED_COLOR = "#66bb6a";
UndirectedCycleDetection.EDGE_THICKNESS = 3;
UndirectedCycleDetection.EDGE_ACTIVE_THICKNESS = 2;
UndirectedCycleDetection.EDGE_TREE_THICKNESS = 6;
UndirectedCycleDetection.EDGE_CYCLE_COLOR = "#ffa726";
UndirectedCycleDetection.EDGE_CYCLE_THICKNESS = 7;

UndirectedCycleDetection.ARRAY_BASE_X = 720;
UndirectedCycleDetection.ARRAY_COLUMN_SPACING = 80;
UndirectedCycleDetection.ARRAY_TOP_Y = UndirectedCycleDetection.ROW2_START_Y + 90;
UndirectedCycleDetection.ARRAY_CELL_HEIGHT = 52;
UndirectedCycleDetection.ARRAY_CELL_WIDTH = 60;
UndirectedCycleDetection.ARRAY_CELL_INNER_HEIGHT = 42;
UndirectedCycleDetection.ARRAY_HEADER_HEIGHT = UndirectedCycleDetection.ARRAY_CELL_INNER_HEIGHT;
UndirectedCycleDetection.ARRAY_RECT_COLOR = "#f1f1f6";
UndirectedCycleDetection.ARRAY_RECT_BORDER = "#2b2d42";
UndirectedCycleDetection.ARRAY_RECT_HIGHLIGHT_BORDER = "#d62828";
UndirectedCycleDetection.ARRAY_RECT_BORDER_THICKNESS = 1;
UndirectedCycleDetection.ARRAY_RECT_HIGHLIGHT_THICKNESS = 3;
UndirectedCycleDetection.ARRAY_TEXT_COLOR = "#2b2d42";
UndirectedCycleDetection.ARRAY_VISITED_FILL = "#b3e5fc";
UndirectedCycleDetection.ARRAY_HEADER_GAP = 20;
UndirectedCycleDetection.BOTTOM_SECTION_GAP = 56;
UndirectedCycleDetection.CODE_TOP_PADDING = 12;

UndirectedCycleDetection.CODE_START_X = 120;
UndirectedCycleDetection.CODE_LINE_HEIGHT = 32;
UndirectedCycleDetection.CODE_STANDARD_COLOR = "#1d3557";
UndirectedCycleDetection.CODE_HIGHLIGHT_COLOR = "#e63946";
UndirectedCycleDetection.CODE_FONT = "bold 22";

UndirectedCycleDetection.RECURSION_AREA_CENTER_X = 660;
UndirectedCycleDetection.RECURSION_HEADER_HEIGHT = 44;
UndirectedCycleDetection.RECURSION_LABEL_MARGIN = 14;
UndirectedCycleDetection.RECURSION_AREA_BOTTOM_MARGIN = 30;
UndirectedCycleDetection.RECURSION_FRAME_WIDTH = 320;
UndirectedCycleDetection.RECURSION_FRAME_HEIGHT = 34;
UndirectedCycleDetection.RECURSION_FRAME_MIN_HEIGHT = 22;
UndirectedCycleDetection.RECURSION_FRAME_SPACING = 10;
UndirectedCycleDetection.RECURSION_FRAME_MIN_SPACING = 6;
UndirectedCycleDetection.RECURSION_RECT_COLOR = "#f8f9fa";
UndirectedCycleDetection.RECURSION_RECT_BORDER = "#1d3557";
UndirectedCycleDetection.RECURSION_RECT_ACTIVE_BORDER = "#e63946";
UndirectedCycleDetection.RECURSION_TEXT_COLOR = "#1d3557";
UndirectedCycleDetection.RECURSION_FONT = "bold 18";

UndirectedCycleDetection.TITLE_COLOR = "#1d3557";
UndirectedCycleDetection.START_INFO_COLOR = "#264653";
UndirectedCycleDetection.HIGHLIGHT_COLOR = "#ff3b30";
UndirectedCycleDetection.STATUS_COLOR_IDLE = "#264653";
UndirectedCycleDetection.STATUS_COLOR_SEARCH = "#1d3557";
UndirectedCycleDetection.STATUS_COLOR_FOUND = "#d84315";
UndirectedCycleDetection.STATUS_COLOR_MISS = "#00695c";
UndirectedCycleDetection.STATUS_IDLE_TEXT = "Cycle Status: awaiting run";
UndirectedCycleDetection.STATUS_SEARCHING_TEXT = "Cycle Status: exploring...";
UndirectedCycleDetection.STATUS_NO_CYCLE_TEXT = "Cycle Status: no cycle found";

UndirectedCycleDetection.CODE_LINES = [
  ["bool dfs(int u, int parent) {"],
  ["    visited[u] = true;"],
  ["    for (int v : adj[u]) {"],
  ["        if (!visited[v]) {"],
  ["            parentArr[v] = u;"],
  ["            if (dfs(v, u)) return true;"],
  ["        } else if (v != parent) {"],
  ["            return true;  // cycle detected"],
  ["        }"],
  ["    }"],
  ["    return false;"],
  ["}"]
];

// Allowed adjacency template derived from the DFS classroom visualization so
// the undirected graph reuses its well-spaced layout without overlaps.
UndirectedCycleDetection.TEMPLATE_ALLOWED = [
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
UndirectedCycleDetection.TEMPLATE_CURVES = [
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

UndirectedCycleDetection.prototype.init = function (am, w, h) {
  UndirectedCycleDetection.superclass.init.call(this, am, w, h);

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
  this.statusDisplayID = -1;
  this.recursionBackgroundID = -1;
  this.recursionHeaderID = -1;
  this.recursionFrameIDs = [];
  this.activeRecursionIndex = -1;
  this.recursionDepth = 0;
  this.bottomSectionTopY =
    UndirectedCycleDetection.ROW3_START_Y + UndirectedCycleDetection.CODE_TOP_PADDING;

  this.visited = [];
  this.parents = [];
  this.cycleFound = false;
  this.cyclePath = [];

  this.implementAction(this.reset.bind(this), 0);
};

UndirectedCycleDetection.prototype.addControls = function () {
  addLabelToAlgorithmBar("Start Vertex:");
  this.startField = addControlToAlgorithmBar("Text", "A");
  this.startField.size = 4;
  this.startButton = addControlToAlgorithmBar("Button", "Detect Cycle");
  this.startButton.onclick = this.startCallback.bind(this);
  this.startField.onkeydown = this.returnSubmit(
    this.startField,
    this.startCallback.bind(this),
    2,
    false
  );

  this.newGraphButton = addControlToAlgorithmBar("Button", "New Graph");
  this.newGraphButton.onclick = this.resetCallback.bind(this);

  this.directedGraphButton = addControlToAlgorithmBar("Button", "Undirected DFS");
  this.directedGraphButton.onclick = function () {
    window.location.href = "UndirectedDFS.html";
  };

  this.controls.push(
    this.startField,
    this.startButton,
    this.newGraphButton,
    this.directedGraphButton
  );
};

UndirectedCycleDetection.prototype.reset = function () {
  this.nextIndex = 0;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  return this.setup();
};

UndirectedCycleDetection.prototype.setup = function () {
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

UndirectedCycleDetection.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

UndirectedCycleDetection.prototype.chooseVertexCount = function () {
  return 10;
};

UndirectedCycleDetection.prototype.createVertexLabels = function (count) {
  var labels = [];
  for (var i = 0; i < count; i++) {
    labels.push(String.fromCharCode("A".charCodeAt(0) + i));
  }
  return labels;
};

UndirectedCycleDetection.prototype.createTitleRow = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "Cycle Detection In An Undirected Graph",
    UndirectedCycleDetection.CANVAS_WIDTH / 2,
    UndirectedCycleDetection.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, UndirectedCycleDetection.TITLE_COLOR);

  this.startDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.startDisplayID,
    "Start Vertex: A",
    UndirectedCycleDetection.CANVAS_WIDTH / 2,
    UndirectedCycleDetection.START_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.startDisplayID, "bold 24");
  this.cmd("SetForegroundColor", this.startDisplayID, UndirectedCycleDetection.START_INFO_COLOR);

  this.statusDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.statusDisplayID,
    UndirectedCycleDetection.STATUS_IDLE_TEXT,
    UndirectedCycleDetection.CANVAS_WIDTH / 2,
    UndirectedCycleDetection.STATUS_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.statusDisplayID, "bold 22");
  this.cmd(
    "SetForegroundColor",
    this.statusDisplayID,
    UndirectedCycleDetection.STATUS_COLOR_IDLE
  );
};

UndirectedCycleDetection.prototype.createGraphArea = function () {
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
      UndirectedCycleDetection.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, UndirectedCycleDetection.GRAPH_NODE_COLOR);
    this.cmd("SetForegroundColor", id, UndirectedCycleDetection.GRAPH_NODE_BORDER);
    this.cmd("SetTextColor", id, UndirectedCycleDetection.GRAPH_NODE_TEXT);
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
      UndirectedCycleDetection.EDGE_COLOR,
      pair.curve,
      0,
      ""
    );
    this.cmd(
      "SetEdgeThickness",
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      UndirectedCycleDetection.EDGE_THICKNESS
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
    UndirectedCycleDetection.HIGHLIGHT_COLOR,
    startPos.x,
    startPos.y,
    UndirectedCycleDetection.HIGHLIGHT_RADIUS
  );
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

UndirectedCycleDetection.prototype.createArrayArea = function () {
  var visitedHeaderID = this.nextIndex++;
  var parentHeaderID = this.nextIndex++;
  var headerY =
    UndirectedCycleDetection.ARRAY_TOP_Y - UndirectedCycleDetection.ARRAY_CELL_HEIGHT / 2 - UndirectedCycleDetection.ARRAY_HEADER_GAP;

  this.cmd(
    "CreateLabel",
    visitedHeaderID,
    "Visited",
    UndirectedCycleDetection.ARRAY_BASE_X,
    headerY
  );
  this.cmd("SetTextStyle", visitedHeaderID, "bold 20");
  this.cmd("SetForegroundColor", visitedHeaderID, UndirectedCycleDetection.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    parentHeaderID,
    "Parent",
    UndirectedCycleDetection.ARRAY_BASE_X + UndirectedCycleDetection.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", parentHeaderID, "bold 20");
  this.cmd("SetForegroundColor", parentHeaderID, UndirectedCycleDetection.CODE_STANDARD_COLOR);

  this.visitedRectIDs = new Array(this.vertexLabels.length);
  this.parentRectIDs = new Array(this.vertexLabels.length);
  this.vertexRowLabelIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rowY = UndirectedCycleDetection.ARRAY_TOP_Y + i * UndirectedCycleDetection.ARRAY_CELL_HEIGHT;

    var vertexLabelID = this.nextIndex++;
    this.vertexRowLabelIDs[i] = vertexLabelID;
    this.cmd(
      "CreateLabel",
      vertexLabelID,
      this.vertexLabels[i],
      UndirectedCycleDetection.ARRAY_BASE_X - 58,
      rowY,
      0
    );
    this.cmd("SetTextStyle", vertexLabelID, "bold 20");
    this.cmd("SetForegroundColor", vertexLabelID, UndirectedCycleDetection.START_INFO_COLOR);

    var visitedID = this.nextIndex++;
    this.visitedRectIDs[i] = visitedID;
    this.cmd(
      "CreateRectangle",
      visitedID,
      "F",
      UndirectedCycleDetection.ARRAY_CELL_WIDTH,
      UndirectedCycleDetection.ARRAY_CELL_INNER_HEIGHT,
      UndirectedCycleDetection.ARRAY_BASE_X,
      rowY
    );
    this.cmd("SetForegroundColor", visitedID, UndirectedCycleDetection.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", visitedID, UndirectedCycleDetection.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", visitedID, UndirectedCycleDetection.ARRAY_TEXT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      visitedID,
      UndirectedCycleDetection.ARRAY_RECT_BORDER_THICKNESS
    );

    var parentID = this.nextIndex++;
    this.parentRectIDs[i] = parentID;
    this.cmd(
      "CreateRectangle",
      parentID,
      "-",
      UndirectedCycleDetection.ARRAY_CELL_WIDTH,
      UndirectedCycleDetection.ARRAY_CELL_INNER_HEIGHT,
      UndirectedCycleDetection.ARRAY_BASE_X + UndirectedCycleDetection.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", parentID, UndirectedCycleDetection.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", parentID, UndirectedCycleDetection.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", parentID, UndirectedCycleDetection.ARRAY_TEXT_COLOR);
  }

  var lastRowIndex = this.vertexLabels.length - 1;
  if (lastRowIndex >= 0) {
    var lastCenterY =
      UndirectedCycleDetection.ARRAY_TOP_Y + lastRowIndex * UndirectedCycleDetection.ARRAY_CELL_HEIGHT;
    var arrayBottomY =
      lastCenterY + UndirectedCycleDetection.ARRAY_CELL_INNER_HEIGHT / 2;
    this.bottomSectionTopY = arrayBottomY + UndirectedCycleDetection.BOTTOM_SECTION_GAP;
  }
};

UndirectedCycleDetection.prototype.setVisitedCellHighlight = function (index, active) {
  if (index < 0 || index >= this.visitedRectIDs.length) {
    return;
  }
  var color = active
    ? UndirectedCycleDetection.ARRAY_RECT_HIGHLIGHT_BORDER
    : UndirectedCycleDetection.ARRAY_RECT_BORDER;
  var thickness = active
    ? UndirectedCycleDetection.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : UndirectedCycleDetection.ARRAY_RECT_BORDER_THICKNESS;
  var rectID = this.visitedRectIDs[index];
  this.cmd("SetForegroundColor", rectID, color);
  this.cmd("SetRectangleLineThickness", rectID, thickness);
};

UndirectedCycleDetection.prototype.createCodeDisplay = function () {
  var startY = this.bottomSectionTopY + UndirectedCycleDetection.CODE_TOP_PADDING;
  this.codeID = this.addCodeToCanvasBase(
    UndirectedCycleDetection.CODE_LINES,
    UndirectedCycleDetection.CODE_START_X,
    startY,
    UndirectedCycleDetection.CODE_LINE_HEIGHT,
    UndirectedCycleDetection.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], UndirectedCycleDetection.CODE_FONT);
    }
  }
};

UndirectedCycleDetection.prototype.computeRecursionLayout = function (frameCount) {
  var layout = {
    height: UndirectedCycleDetection.RECURSION_FRAME_HEIGHT,
    spacing: UndirectedCycleDetection.RECURSION_FRAME_SPACING,
    startY:
      this.bottomSectionTopY +
      UndirectedCycleDetection.RECURSION_HEADER_HEIGHT +
      UndirectedCycleDetection.RECURSION_LABEL_MARGIN +
      UndirectedCycleDetection.RECURSION_FRAME_HEIGHT / 2
  };

  if (frameCount <= 0) {
    return layout;
  }

  var availableHeight =
    UndirectedCycleDetection.CANVAS_HEIGHT -
    (this.bottomSectionTopY +
      UndirectedCycleDetection.RECURSION_HEADER_HEIGHT +
      UndirectedCycleDetection.RECURSION_LABEL_MARGIN +
      UndirectedCycleDetection.RECURSION_AREA_BOTTOM_MARGIN);

  if (availableHeight <= 0) {
    return layout;
  }

  var spacing = frameCount === 1 ? 0 : layout.spacing;
  var height = Math.min(
    UndirectedCycleDetection.RECURSION_FRAME_HEIGHT,
    Math.max(
      UndirectedCycleDetection.RECURSION_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    )
  );

  var totalHeight = height * frameCount + spacing * (frameCount - 1);
  if (totalHeight > availableHeight) {
    spacing = Math.max(
      UndirectedCycleDetection.RECURSION_FRAME_MIN_SPACING,
      Math.floor(
        (availableHeight - height * frameCount) / Math.max(1, frameCount - 1)
      )
    );
    if (spacing < 0) {
      spacing = 0;
    }
    height = Math.max(
      UndirectedCycleDetection.RECURSION_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    );
  }

  layout.height = height;
  layout.spacing = spacing;
  layout.startY =
    this.bottomSectionTopY +
    UndirectedCycleDetection.RECURSION_HEADER_HEIGHT +
    UndirectedCycleDetection.RECURSION_LABEL_MARGIN +
    height / 2;

  return layout;
};

UndirectedCycleDetection.prototype.createRecursionArea = function () {
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
    UndirectedCycleDetection.RECURSION_AREA_CENTER_X + 20,
    this.bottomSectionTopY + UndirectedCycleDetection.RECURSION_HEADER_HEIGHT / 2,
    0
  );
  this.cmd(
    "SetForegroundColor",
    this.recursionHeaderID,
    UndirectedCycleDetection.CODE_STANDARD_COLOR
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
      UndirectedCycleDetection.RECURSION_FRAME_WIDTH,
      layout.height,
      UndirectedCycleDetection.RECURSION_AREA_CENTER_X + 50,
      y
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      UndirectedCycleDetection.RECURSION_RECT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, UndirectedCycleDetection.RECURSION_RECT_BORDER);
    this.cmd("SetAlpha", rectID, 0);
    this.cmd("SetTextColor", rectID, UndirectedCycleDetection.RECURSION_TEXT_COLOR);
    this.cmd("SetTextStyle", rectID, UndirectedCycleDetection.RECURSION_FONT);

    this.recursionFrameIDs.push(rectID);

    y += layout.height + layout.spacing;
  }
};

UndirectedCycleDetection.prototype.resetRecursionArea = function () {
  this.recursionDepth = 0;
  this.activeRecursionIndex = -1;
  for (var i = 0; i < this.recursionFrameIDs.length; i++) {
    this.cmd("SetAlpha", this.recursionFrameIDs[i], 0);
    this.cmd("SetText", this.recursionFrameIDs[i], "");
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[i],
      UndirectedCycleDetection.RECURSION_RECT_BORDER
    );
  }
};

UndirectedCycleDetection.prototype.pushRecursionFrame = function (
  vertex,
  parent
) {
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
      UndirectedCycleDetection.RECURSION_RECT_BORDER
    );
  }

  var frameID = this.recursionFrameIDs[this.recursionDepth];
  var parentLabel =
    parent === null || parent === undefined
      ? "-"
      : this.vertexLabels[parent];
  var text = "dfs(" + this.vertexLabels[vertex] + ", " + parentLabel + ")";
  this.cmd("SetText", frameID, text);
  this.cmd("SetAlpha", frameID, 1);
  this.cmd("SetForegroundColor", frameID, UndirectedCycleDetection.RECURSION_RECT_ACTIVE_BORDER);

  this.activeRecursionIndex = this.recursionDepth;
  this.recursionDepth++;
};

UndirectedCycleDetection.prototype.popRecursionFrame = function () {
  if (this.recursionDepth <= 0) {
    return;
  }

  this.recursionDepth--;
  var frameID = this.recursionFrameIDs[this.recursionDepth];
  this.cmd("SetAlpha", frameID, 0);
  this.cmd("SetText", frameID, "");
  this.cmd("SetForegroundColor", frameID, UndirectedCycleDetection.RECURSION_RECT_BORDER);

  this.activeRecursionIndex = this.recursionDepth - 1;
  if (this.activeRecursionIndex >= 0 && this.activeRecursionIndex < this.recursionFrameIDs.length) {
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[this.activeRecursionIndex],
      UndirectedCycleDetection.RECURSION_RECT_ACTIVE_BORDER
    );
  }
};

UndirectedCycleDetection.prototype.highlightCodeLine = function (lineIndex) {
  if (this.currentCodeLine >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[this.currentCodeLine][0],
      UndirectedCycleDetection.CODE_STANDARD_COLOR
    );
  }
  this.currentCodeLine = lineIndex;
  if (lineIndex >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[lineIndex][0],
      UndirectedCycleDetection.CODE_HIGHLIGHT_COLOR
    );
  }
};

UndirectedCycleDetection.prototype.updateCycleStatus = function (text, color) {
  if (this.statusDisplayID < 0) {
    return;
  }
  this.cmd("SetText", this.statusDisplayID, text);
  var finalColor =
    color !== undefined ? color : UndirectedCycleDetection.STATUS_COLOR_IDLE;
  this.cmd("SetForegroundColor", this.statusDisplayID, finalColor);
};

UndirectedCycleDetection.prototype.clearTraversalState = function () {
  this.visited = new Array(this.vertexLabels.length);
  this.parents = new Array(this.vertexLabels.length);
  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.visited[i] = false;
    this.parents[i] = null;
    this.cmd("SetText", this.visitedRectIDs[i], "F");
    this.cmd("SetBackgroundColor", this.visitedRectIDs[i], UndirectedCycleDetection.ARRAY_RECT_COLOR);
    this.cmd(
      "SetForegroundColor",
      this.visitedRectIDs[i],
      UndirectedCycleDetection.ARRAY_RECT_BORDER
    );
    this.cmd(
      "SetRectangleLineThickness",
      this.visitedRectIDs[i],
      UndirectedCycleDetection.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetText", this.parentRectIDs[i], "-");
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[i],
      UndirectedCycleDetection.GRAPH_NODE_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[i],
      UndirectedCycleDetection.GRAPH_NODE_TEXT
    );
  }
  this.resetEdgesToUndirected();
  this.resetRecursionArea();
  this.cycleFound = false;
  this.cyclePath = [];
  this.updateCycleStatus(
    UndirectedCycleDetection.STATUS_IDLE_TEXT,
    UndirectedCycleDetection.STATUS_COLOR_IDLE
  );
};

UndirectedCycleDetection.prototype.edgeKey = function (u, v) {
  return u < v ? u + "-" + v : v + "-" + u;
};

UndirectedCycleDetection.prototype.resetEdgesToUndirected = function () {
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
      UndirectedCycleDetection.EDGE_COLOR,
      edge.curve,
      0,
      ""
    );
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UndirectedCycleDetection.EDGE_THICKNESS
    );
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    var edgeKey = this.edgeKey(edge.u, edge.v);
    this.edgeOrientation[edgeKey] = { from: edge.u, to: edge.v };
    this.edgeStates[edgeKey] = { tree: false };
    this.edgeMeta[edgeKey] = edge;
  }
};

UndirectedCycleDetection.prototype.setEdgeState = function (u, v, options) {
  var key = this.edgeKey(u, v);
  var orientation = this.edgeOrientation[key];
  if (!orientation) {
    return;
  }
  var fromID = this.vertexIDs[orientation.from];
  var toID = this.vertexIDs[orientation.to];
  if (options.highlight !== undefined) {
    this.cmd("SetEdgeHighlight", fromID, toID, options.highlight ? 1 : 0);
  }
  if (options.color) {
    this.cmd("SetEdgeColor", fromID, toID, options.color);
  }
};

UndirectedCycleDetection.prototype.setEdgeActive = function (
  u,
  v,
  active,
  force
) {
  var key = this.edgeKey(u, v);
  var orientation = this.edgeOrientation[key];
  if (!orientation) {
    return;
  }
  if (!active && !force && !this.cycleFound) {
    return;
  }
  var fromID = this.vertexIDs[orientation.from];
  var toID = this.vertexIDs[orientation.to];
  if (active) {
    this.setEdgeState(u, v, {
      highlight: true,
      color: UndirectedCycleDetection.HIGHLIGHT_COLOR
    });
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UndirectedCycleDetection.EDGE_ACTIVE_THICKNESS
    );
  } else {
    var baseColor = UndirectedCycleDetection.EDGE_COLOR;
    var highlight = false;
    var thickness = UndirectedCycleDetection.EDGE_THICKNESS;
    if (this.edgeStates[key]) {
      if (this.edgeStates[key].cycle) {
        baseColor = UndirectedCycleDetection.EDGE_CYCLE_COLOR;
        highlight = true;
        thickness = UndirectedCycleDetection.EDGE_CYCLE_THICKNESS;
      } else if (this.edgeStates[key].tree) {
        baseColor = UndirectedCycleDetection.EDGE_COLOR;
      }
    }

    this.setEdgeState(u, v, {
      highlight: highlight,
      color: baseColor
    });
    this.cmd("SetEdgeThickness", fromID, toID, thickness);
  }
};

UndirectedCycleDetection.prototype.releaseAllTraversalEdges = function () {
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    this.setEdgeActive(edge.u, edge.v, false, true);
  }
};

UndirectedCycleDetection.prototype.animateHighlightTraversal = function (fromIndex, toIndex) {
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

UndirectedCycleDetection.prototype.getStartFieldValue = function () {
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

UndirectedCycleDetection.prototype.setStartFieldValue = function (text) {
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

UndirectedCycleDetection.prototype.markEdgeAsTreeEdge = function (parent, child) {
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
    UndirectedCycleDetection.EDGE_COLOR,
    curve,
    1,
    ""
  );
  this.cmd(
    "SetEdgeThickness",
    this.vertexIDs[parent],
    this.vertexIDs[child],
    UndirectedCycleDetection.EDGE_TREE_THICKNESS
  );
  this.edgeOrientation[key] = { from: parent, to: child };
  var state = this.edgeStates[key] || {};
  state.tree = true;
  this.edgeStates[key] = state;
};

UndirectedCycleDetection.prototype.markEdgeAsCycleEdge = function (a, b) {
  var key = this.edgeKey(a, b);
  var meta = this.edgeMeta[key];
  if (!meta) {
    return;
  }

  var currentOrientation = this.edgeOrientation[key];
  if (currentOrientation) {
    this.cmd(
      "Disconnect",
      this.vertexIDs[currentOrientation.from],
      this.vertexIDs[currentOrientation.to]
    );
  }

  var curve = meta.curve;
  if (curve !== 0 && a === meta.v && b === meta.u) {
    curve = -curve;
  }

  this.cmd(
    "Connect",
    this.vertexIDs[a],
    this.vertexIDs[b],
    UndirectedCycleDetection.EDGE_CYCLE_COLOR,
    curve,
    1,
    ""
  );
  this.cmd(
    "SetEdgeThickness",
    this.vertexIDs[a],
    this.vertexIDs[b],
    UndirectedCycleDetection.EDGE_CYCLE_THICKNESS
  );
  this.cmd("SetEdgeHighlight", this.vertexIDs[a], this.vertexIDs[b], 1);
  this.edgeOrientation[key] = { from: a, to: b };
  var state = this.edgeStates[key] || {};
  state.tree = true;
  state.cycle = true;
  this.edgeStates[key] = state;
};

UndirectedCycleDetection.prototype.buildCyclePath = function (u, v) {
  var pathToRoot = [];
  var current = u;
  var guard = this.parents.length + 5;
  while (current !== null && guard-- > 0) {
    pathToRoot.push(current);
    current = this.parents[current];
  }

  var ancestorIndex = {};
  for (var i = 0; i < pathToRoot.length; i++) {
    ancestorIndex[pathToRoot[i]] = i;
  }

  var pathFromV = [];
  current = v;
  guard = this.parents.length + 5;
  while (current !== null && ancestorIndex[current] === undefined && guard-- > 0) {
    pathFromV.push(current);
    current = this.parents[current];
  }

  var cycle = [];
  if (current !== null && ancestorIndex[current] !== undefined) {
    for (var j = 0; j <= ancestorIndex[current]; j++) {
      cycle.push(pathToRoot[j]);
    }
    for (var k = 0; k < pathFromV.length; k++) {
      cycle.push(pathFromV[k]);
    }
    if (cycle[cycle.length - 1] !== current) {
      cycle.push(current);
    }
  } else {
    cycle = [u, v];
  }

  return cycle;
};

UndirectedCycleDetection.prototype.reportCycle = function (u, v) {
  if (this.cycleFound) {
    return;
  }

  var cycle = this.buildCyclePath(u, v);
  this.cycleFound = true;
  this.cyclePath = cycle;

  var sequence = cycle.slice().reverse();
  if (sequence[0] !== v) {
    sequence.unshift(v);
  }
  if (sequence[sequence.length - 1] !== u) {
    sequence.push(u);
  }
  sequence.push(v);

  var labelPath = [];
  for (var i = 0; i < sequence.length; i++) {
    labelPath.push(this.vertexLabels[sequence[i]]);
  }

  this.updateCycleStatus(
    "Cycle Detected: " + labelPath.join(" \u2192 "),
    UndirectedCycleDetection.STATUS_COLOR_FOUND
  );

  var seen = {};
  for (var idx = 0; idx < cycle.length; idx++) {
    var node = cycle[idx];
    if (!seen[node]) {
      this.cmd(
        "SetBackgroundColor",
        this.vertexIDs[node],
        UndirectedCycleDetection.GRAPH_NODE_CYCLE_COLOR
      );
      this.cmd(
        "SetTextColor",
        this.vertexIDs[node],
        UndirectedCycleDetection.GRAPH_NODE_CYCLE_TEXT_COLOR
      );
      seen[node] = true;
    }
  }

  for (var e = 0; e < cycle.length - 1; e++) {
    this.markEdgeAsCycleEdge(cycle[e], cycle[e + 1]);
  }
  this.markEdgeAsCycleEdge(u, v);

  var startIdx = sequence[0];
  var startPos = this.vertexPositions[startIdx];
  this.cmd("Move", this.highlightCircleID, startPos.x, startPos.y);
  this.cmd("Step");

  for (var step = 0; step < sequence.length - 1; step++) {
    this.animateHighlightTraversal(sequence[step], sequence[step + 1]);
  }
};

UndirectedCycleDetection.prototype.computeTemplateLayout = function (vertexCount) {
  var layout = [];
  var baseX = 180;
  var stepX = 130;
  var baseY = UndirectedCycleDetection.ROW2_START_Y + 120;
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

UndirectedCycleDetection.prototype.generateRandomGraph = function (vertexCount) {
  this.vertexPositions = this.computeTemplateLayout(vertexCount);

  var allowed = UndirectedCycleDetection.TEMPLATE_ALLOWED;
  var curves = UndirectedCycleDetection.TEMPLATE_CURVES;
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

UndirectedCycleDetection.prototype.applyVertexClamping = function (
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

UndirectedCycleDetection.prototype.relaxVertices = function (
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

UndirectedCycleDetection.prototype.roundVertexPositions = function () {
  for (var i = 0; i < this.vertexPositions.length; i++) {
    this.vertexPositions[i].x = Math.round(this.vertexPositions[i].x);
    this.vertexPositions[i].y = Math.round(this.vertexPositions[i].y);
  }
};

UndirectedCycleDetection.prototype.pushVerticesAwayFromEdges = function (
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

UndirectedCycleDetection.prototype.isWhitespaceChar = function (ch) {
  return (
    ch === " " ||
    ch === "\t" ||
    ch === "\n" ||
    ch === "\r" ||
    ch === "\f" ||
    ch === "\u00a0"
  );
};

UndirectedCycleDetection.prototype.cleanInputLabel = function (inputLabel) {
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

UndirectedCycleDetection.prototype.findVertexIndex = function (label) {
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

UndirectedCycleDetection.prototype.startCallback = function () {
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

UndirectedCycleDetection.prototype.runTraversal = function (startIndex) {
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

  this.parents[startIndex] = null;
  this.updateCycleStatus(
    UndirectedCycleDetection.STATUS_SEARCHING_TEXT,
    UndirectedCycleDetection.STATUS_COLOR_SEARCH
  );
  this.dfsVisit(startIndex, null);

  if (!this.cycleFound) {
    this.updateCycleStatus(
      UndirectedCycleDetection.STATUS_NO_CYCLE_TEXT,
      UndirectedCycleDetection.STATUS_COLOR_MISS
    );
    this.releaseAllTraversalEdges();
  }

  this.highlightCodeLine(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);

  return this.commands;
};

UndirectedCycleDetection.prototype.dfsVisit = function (u, parent) {
  if (this.cycleFound) {
    return;
  }

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
      UndirectedCycleDetection.ARRAY_VISITED_FILL
    );
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[u],
      UndirectedCycleDetection.GRAPH_NODE_VISITED_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[u],
      UndirectedCycleDetection.GRAPH_NODE_VISITED_TEXT_COLOR
    );
    this.cmd("Step");
  }
  this.setVisitedCellHighlight(u, false);

  this.highlightCodeLine(2);
  this.cmd("Step");

  var neighbors = this.adjacencyList[u];
  for (var i = 0; i < neighbors.length; i++) {
    if (this.cycleFound) {
      break;
    }
    var v = neighbors[i];
    this.setEdgeActive(u, v, true);
    this.highlightCodeLine(3);
    this.cmd("Step");
    this.setVisitedCellHighlight(v, true);
    this.cmd("Step");
    if (!this.visited[v]) {
      this.highlightCodeLine(4);
      this.parents[v] = u;
      this.cmd("SetText", this.parentRectIDs[v], this.vertexLabels[u]);
      this.cmd("Step");

      this.highlightCodeLine(5);
      this.cmd("Step");

      this.markEdgeAsTreeEdge(u, v);
      this.cmd("Step");
      this.animateHighlightTraversal(u, v);

      this.dfsVisit(v, u);

      if (this.cycleFound) {
        this.setVisitedCellHighlight(v, false);
        this.setEdgeActive(u, v, false);
        break;
      }

      this.animateHighlightTraversal(v, u);
      this.setVisitedCellHighlight(v, false);
      this.setEdgeActive(u, v, false);

      this.highlightCodeLine(8);
      this.cmd("Step");

      this.highlightCodeLine(2);
      this.cmd("Step");
    } else {
      this.highlightCodeLine(6);
      this.cmd("Step");

      if (v !== parent) {
        this.highlightCodeLine(7);
        this.cmd("Step");
        this.setVisitedCellHighlight(v, false);
        this.setEdgeActive(u, v, false);
        this.reportCycle(u, v);
        break;
      }

      this.setVisitedCellHighlight(v, false);
      this.setEdgeActive(u, v, false);

      this.highlightCodeLine(8);
      this.cmd("Step");

      this.highlightCodeLine(2);
      this.cmd("Step");
    }
  }

  if (!this.cycleFound) {
    this.highlightCodeLine(9);
    this.cmd("Step");
    this.highlightCodeLine(10);
    this.cmd("Step");
  }
  this.popRecursionFrame();
};

UndirectedCycleDetection.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

UndirectedCycleDetection.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new UndirectedCycleDetection(animManag, canvas.width, canvas.height);
}
