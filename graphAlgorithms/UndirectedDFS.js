// Custom visualization for DFS traversal on an undirected graph using a 9:16 canvas.

function UndirectedDFS(am, w, h) {
  this.init(am, w, h);
}

UndirectedDFS.prototype = new Algorithm();
UndirectedDFS.prototype.constructor = UndirectedDFS;
UndirectedDFS.superclass = Algorithm.prototype;

UndirectedDFS.CANVAS_WIDTH = 720;
UndirectedDFS.CANVAS_HEIGHT = 1280;

UndirectedDFS.ROW1_HEIGHT = 240;
UndirectedDFS.ROW2_HEIGHT = 640;
UndirectedDFS.ROW3_HEIGHT =
  UndirectedDFS.CANVAS_HEIGHT - UndirectedDFS.ROW1_HEIGHT - UndirectedDFS.ROW2_HEIGHT;

UndirectedDFS.ROW1_CENTER_Y = UndirectedDFS.ROW1_HEIGHT / 2;
UndirectedDFS.ROW2_START_Y = UndirectedDFS.ROW1_HEIGHT;
UndirectedDFS.ROW3_START_Y =
  UndirectedDFS.ROW1_HEIGHT + UndirectedDFS.ROW2_HEIGHT;

UndirectedDFS.TITLE_Y = UndirectedDFS.ROW1_CENTER_Y - 40;
UndirectedDFS.START_INFO_Y = UndirectedDFS.ROW1_CENTER_Y + 40;

UndirectedDFS.GRAPH_AREA_CENTER_X = 300;
UndirectedDFS.GRAPH_NODE_RADIUS = 22;
UndirectedDFS.GRAPH_NODE_COLOR = "#e3f2fd";
UndirectedDFS.GRAPH_NODE_BORDER = "#0b3954";
UndirectedDFS.GRAPH_NODE_TEXT = "#003049";
UndirectedDFS.GRAPH_NODE_VISITED_COLOR = "#b8f5b1";
UndirectedDFS.HIGHLIGHT_RADIUS = UndirectedDFS.GRAPH_NODE_RADIUS;
UndirectedDFS.EDGE_COLOR = "#4a4e69";
UndirectedDFS.EDGE_HIGHLIGHT_COLOR = "#f77f00";

UndirectedDFS.ARRAY_BASE_X = 540;
UndirectedDFS.ARRAY_COLUMN_SPACING = 80;
UndirectedDFS.ARRAY_TOP_Y = UndirectedDFS.ROW2_START_Y + 90;
UndirectedDFS.ARRAY_CELL_HEIGHT = 52;
UndirectedDFS.ARRAY_CELL_WIDTH = 60;
UndirectedDFS.ARRAY_CELL_INNER_HEIGHT = 42;
UndirectedDFS.ARRAY_HEADER_HEIGHT = UndirectedDFS.ARRAY_CELL_INNER_HEIGHT;
UndirectedDFS.ARRAY_RECT_COLOR = "#f1f1f6";
UndirectedDFS.ARRAY_RECT_BORDER = "#2b2d42";
UndirectedDFS.ARRAY_TEXT_COLOR = "#2b2d42";
UndirectedDFS.ARRAY_VISITED_FILL = "#90ee90";
UndirectedDFS.ARRAY_HEADER_GAP = 20;

UndirectedDFS.CODE_START_Y = UndirectedDFS.ROW3_START_Y + 10;
UndirectedDFS.CODE_LINE_HEIGHT = 32;
UndirectedDFS.CODE_STANDARD_COLOR = "#1d3557";
UndirectedDFS.CODE_HIGHLIGHT_COLOR = "#e63946";
UndirectedDFS.CODE_FONT = "bold 22";

UndirectedDFS.TITLE_COLOR = "#1d3557";
UndirectedDFS.START_INFO_COLOR = "#264653";
UndirectedDFS.HIGHLIGHT_COLOR = "#ff3b30";

UndirectedDFS.CODE_LINES = [
  ["void dfs(int u, int parent) {"],
  ["    visited[u] = true;"],
  ["    for (int v : adj[u]) {"],
  ["        if (v != parent && !visited[v]) {"],
  ["            parent[v] = u;"],
  ["            dfs(v, u);"],
  ["        }"],
  ["    }"],
  ["}"],
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
  this.vertexIDs = [];
  this.visitedRectIDs = [];
  this.parentRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.codeID = [];
  this.highlightCircleID = -1;
  this.currentCodeLine = -1;
  this.startDisplayID = -1;

  this.visited = [];
  this.parents = [];

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

  this.vertexLabels = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
  ];
  this.vertexPositions = [
    { x: 190, y: UndirectedDFS.ROW2_START_Y + 90 },
    { x: 310, y: UndirectedDFS.ROW2_START_Y + 90 },
    { x: 120, y: UndirectedDFS.ROW2_START_Y + 230 },
    { x: 260, y: UndirectedDFS.ROW2_START_Y + 220 },
    { x: 360, y: UndirectedDFS.ROW2_START_Y + 230 },
    { x: 120, y: UndirectedDFS.ROW2_START_Y + 360 },
    { x: 240, y: UndirectedDFS.ROW2_START_Y + 360 },
    { x: 360, y: UndirectedDFS.ROW2_START_Y + 360 },
    { x: 190, y: UndirectedDFS.ROW2_START_Y + 500 },
    { x: 310, y: UndirectedDFS.ROW2_START_Y + 500 },
  ];

  var edges = [
    { u: 0, v: 1 },
    { u: 0, v: 2 },
    { u: 1, v: 3 },
    { u: 1, v: 4 },
    { u: 2, v: 5 },
    { u: 2, v: 6 },
    { u: 3, v: 7 },
    { u: 4, v: 7 },
    { u: 4, v: 8 },
    { u: 6, v: 8 },
    { u: 7, v: 9 },
    { u: 8, v: 9 },
  ];

  this.adjacencyList = new Array(this.vertexLabels.length);
  for (var i = 0; i < this.adjacencyList.length; i++) {
    this.adjacencyList[i] = [];
  }
  for (var e = 0; e < edges.length; e++) {
    var edge = edges[e];
    this.adjacencyList[edge.u].push(edge.v);
    this.adjacencyList[edge.v].push(edge.u);
  }

  this.edgePairs = edges;
  this.edgeOrientation = {};

  this.createTitleRow();
  this.createGraphArea();
  this.createArrayArea();
  this.createCodeDisplay();

  this.highlightCodeLine(-1);

  if (this.startField) {
    this.startField.value = this.vertexLabels[0];
  }

  this.cmd("Step");
  return this.commands;
};

UndirectedDFS.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
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
    this.edgeOrientation[this.edgeKey(pair.u, pair.v)] = {
      from: pair.u,
      to: pair.v,
    };
    this.cmd(
      "Connect",
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      UndirectedDFS.EDGE_COLOR,
      0,
      0,
      ""
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
    "Parent",
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
      UndirectedDFS.ARRAY_BASE_X - 95,
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

    var parentID = this.nextIndex++;
    this.parentRectIDs[i] = parentID;
    this.cmd(
      "CreateRectangle",
      parentID,
      "-",
      UndirectedDFS.ARRAY_CELL_WIDTH,
      UndirectedDFS.ARRAY_CELL_INNER_HEIGHT,
      UndirectedDFS.ARRAY_BASE_X + UndirectedDFS.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", parentID, UndirectedDFS.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", parentID, UndirectedDFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", parentID, UndirectedDFS.ARRAY_TEXT_COLOR);
  }
};

UndirectedDFS.prototype.createCodeDisplay = function () {
  var codeStartX = UndirectedDFS.CANVAS_WIDTH / 2 - 150;
  this.codeID = this.addCodeToCanvasBase(
    UndirectedDFS.CODE_LINES,
    codeStartX,
    UndirectedDFS.CODE_START_Y,
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
  this.parents = new Array(this.vertexLabels.length);
  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.visited[i] = false;
    this.parents[i] = null;
    this.cmd("SetText", this.visitedRectIDs[i], "F");
    this.cmd("SetBackgroundColor", this.visitedRectIDs[i], UndirectedDFS.ARRAY_RECT_COLOR);
    this.cmd("SetText", this.parentRectIDs[i], "-");
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[i],
      UndirectedDFS.GRAPH_NODE_COLOR
    );
  }
  this.clearEdgeHighlights();
};

UndirectedDFS.prototype.clearEdgeHighlights = function () {
  for (var i = 0; i < this.edgePairs.length; i++) {
    var pair = this.edgePairs[i];
    this.setEdgeStyle(pair.u, pair.v, false);
  }
};

UndirectedDFS.prototype.setEdgeStyle = function (u, v, highlighted) {
  var key = this.edgeKey(u, v);
  var orientation = this.edgeOrientation[key];
  if (!orientation) {
    return;
  }
  var fromID = this.vertexIDs[orientation.from];
  var toID = this.vertexIDs[orientation.to];
  this.cmd("SetEdgeHighlight", fromID, toID, highlighted ? 1 : 0);
  this.cmd(
    "SetEdgeColor",
    fromID,
    toID,
    highlighted ? UndirectedDFS.EDGE_HIGHLIGHT_COLOR : UndirectedDFS.EDGE_COLOR
  );
};

UndirectedDFS.prototype.edgeKey = function (u, v) {
  return u < v ? u + "-" + v : v + "-" + u;
};

UndirectedDFS.prototype.startCallback = function () {
  if (!this.startField) return;
  var raw = this.startField.value.trim();
  if (raw.length === 0) return;
  var label = raw[0].toUpperCase();
  var index = this.vertexLabels.indexOf(label);
  if (index === -1) {
    return;
  }
  this.startField.value = label;
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
  this.highlightCodeLine(0);
  this.cmd("Step");

  this.highlightCodeLine(1);
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
    this.cmd("Step");
  }

  this.highlightCodeLine(2);
  this.cmd("Step");

  var neighbors = this.adjacencyList[u];
  for (var i = 0; i < neighbors.length; i++) {
    var v = neighbors[i];
    this.highlightCodeLine(3);
    this.setEdgeStyle(u, v, true);
    this.cmd("Step");

    if (v !== parent && !this.visited[v]) {
      this.highlightCodeLine(4);
      this.parents[v] = u;
      this.cmd(
        "SetText",
        this.parentRectIDs[v],
        this.vertexLabels[u]
      );
      this.cmd("Step");

      this.highlightCodeLine(5);
      this.cmd(
        "Move",
        this.highlightCircleID,
        this.vertexPositions[v].x,
        this.vertexPositions[v].y
      );
      this.cmd("Step");

      this.dfsVisit(v, u);

      this.cmd(
        "Move",
        this.highlightCircleID,
        this.vertexPositions[u].x,
        this.vertexPositions[u].y
      );
      this.cmd("Step");
    }

    this.highlightCodeLine(6);
    this.cmd("Step");

    this.setEdgeStyle(u, v, false);

    this.highlightCodeLine(2);
    this.cmd("Step");
  }

  this.highlightCodeLine(7);
  this.cmd("Step");
  this.highlightCodeLine(8);
  this.cmd("Step");
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
