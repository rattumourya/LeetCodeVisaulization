// Custom visualization for DFS traversal on a directed graph using a 9:16 canvas.

function DirectedDFS(am, w, h) {
  this.init(am, w, h);
}

DirectedDFS.prototype = new Algorithm();
DirectedDFS.prototype.constructor = DirectedDFS;
DirectedDFS.superclass = Algorithm.prototype;

DirectedDFS.CANVAS_WIDTH = 720;
DirectedDFS.CANVAS_HEIGHT = 1280;

DirectedDFS.ROW1_HEIGHT = 240;
DirectedDFS.ROW2_HEIGHT = 640;
DirectedDFS.ROW3_HEIGHT =
  DirectedDFS.CANVAS_HEIGHT - DirectedDFS.ROW1_HEIGHT - DirectedDFS.ROW2_HEIGHT;

DirectedDFS.ROW1_CENTER_Y = DirectedDFS.ROW1_HEIGHT / 2;
DirectedDFS.ROW2_START_Y = DirectedDFS.ROW1_HEIGHT;
DirectedDFS.ROW3_START_Y =
  DirectedDFS.ROW1_HEIGHT + DirectedDFS.ROW2_HEIGHT;

DirectedDFS.TITLE_Y = DirectedDFS.ROW1_CENTER_Y - 40;
DirectedDFS.START_INFO_Y = DirectedDFS.ROW1_CENTER_Y + 40;

DirectedDFS.GRAPH_AREA_CENTER_X = 300;
DirectedDFS.GRAPH_NODE_RADIUS = 22;
DirectedDFS.GRAPH_NODE_COLOR = "#e3f2fd";
DirectedDFS.GRAPH_NODE_BORDER = "#0b3954";
DirectedDFS.GRAPH_NODE_TEXT = "#003049";
DirectedDFS.GRAPH_NODE_VISITED_COLOR = "#b8f5b1";
DirectedDFS.HIGHLIGHT_RADIUS = DirectedDFS.GRAPH_NODE_RADIUS;
DirectedDFS.EDGE_COLOR = "#4a4e69";
DirectedDFS.EDGE_HIGHLIGHT_COLOR = "#f77f00";

DirectedDFS.ARRAY_BASE_X = 540;
DirectedDFS.ARRAY_COLUMN_SPACING = 80;
DirectedDFS.ARRAY_TOP_Y = DirectedDFS.ROW2_START_Y + 90;
DirectedDFS.ARRAY_CELL_HEIGHT = 52;
DirectedDFS.ARRAY_CELL_WIDTH = 60;
DirectedDFS.ARRAY_CELL_INNER_HEIGHT = 42;
DirectedDFS.ARRAY_HEADER_HEIGHT = DirectedDFS.ARRAY_CELL_INNER_HEIGHT;
DirectedDFS.ARRAY_RECT_COLOR = "#f1f1f6";
DirectedDFS.ARRAY_RECT_BORDER = "#2b2d42";
DirectedDFS.ARRAY_TEXT_COLOR = "#2b2d42";
DirectedDFS.ARRAY_VISITED_FILL = "#90ee90";
DirectedDFS.ARRAY_HEADER_GAP = 20;

DirectedDFS.CODE_START_Y = DirectedDFS.ROW3_START_Y + 10;
DirectedDFS.CODE_LINE_HEIGHT = 32;
DirectedDFS.CODE_STANDARD_COLOR = "#1d3557";
DirectedDFS.CODE_HIGHLIGHT_COLOR = "#e63946";
DirectedDFS.CODE_FONT = "bold 22";

DirectedDFS.TITLE_COLOR = "#1d3557";
DirectedDFS.START_INFO_COLOR = "#264653";
DirectedDFS.HIGHLIGHT_COLOR = "#ff3b30";

DirectedDFS.CODE_LINES = [
  ["void dfs(int u) {"],
  ["    visited[u] = true;"],
  ["    for (int v : adj[u]) {"],
  ["        if (!visited[v]) {"],
  ["            parent[v] = u;"],
  ["            dfs(v);"],
  ["        }"],
  ["    }"],
  ["}"],
];

DirectedDFS.prototype.init = function (am, w, h) {
  DirectedDFS.superclass.init.call(this, am, w, h);

  this.controls = [];
  this.addControls();

  this.vertexLabels = [];
  this.vertexPositions = [];
  this.adjacencyList = [];
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

DirectedDFS.prototype.addControls = function () {
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

  var radioButtons = addRadioButtonGroupToAlgorithmBar(
    ["Directed Graph", "Undirected Graph"],
    "GraphType"
  );
  this.directedGraphButton = radioButtons[0];
  this.undirectedGraphButton = radioButtons[1];
  this.directedGraphButton.checked = true;
  this.directedGraphButton.disabled = true;
  this.undirectedGraphButton.disabled = true;

  this.controls.push(this.startField, this.startButton, this.newGraphButton);
};

DirectedDFS.prototype.reset = function () {
  this.nextIndex = 0;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  return this.setup();
};

DirectedDFS.prototype.setup = function () {
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
    { x: 190, y: DirectedDFS.ROW2_START_Y + 90 },
    { x: 310, y: DirectedDFS.ROW2_START_Y + 90 },
    { x: 120, y: DirectedDFS.ROW2_START_Y + 230 },
    { x: 260, y: DirectedDFS.ROW2_START_Y + 220 },
    { x: 360, y: DirectedDFS.ROW2_START_Y + 230 },
    { x: 120, y: DirectedDFS.ROW2_START_Y + 360 },
    { x: 240, y: DirectedDFS.ROW2_START_Y + 360 },
    { x: 360, y: DirectedDFS.ROW2_START_Y + 360 },
    { x: 190, y: DirectedDFS.ROW2_START_Y + 500 },
    { x: 310, y: DirectedDFS.ROW2_START_Y + 500 },
  ];

  this.adjacencyList = [
    [1, 2],
    [3, 4],
    [5, 6],
    [7],
    [7, 8],
    [8],
    [8, 9],
    [9],
    [],
    [],
  ];

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

DirectedDFS.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

DirectedDFS.prototype.createTitleRow = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "DFS Traversal On Directed Graph",
    DirectedDFS.CANVAS_WIDTH / 2,
    DirectedDFS.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, DirectedDFS.TITLE_COLOR);

  this.startDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.startDisplayID,
    "Start Vertex: A",
    DirectedDFS.CANVAS_WIDTH / 2,
    DirectedDFS.START_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.startDisplayID, "bold 24");
  this.cmd("SetForegroundColor", this.startDisplayID, DirectedDFS.START_INFO_COLOR);
};

DirectedDFS.prototype.createGraphArea = function () {
  this.vertexIDs = new Array(this.vertexLabels.length);
  this.edgePairs = [];

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
      DirectedDFS.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, DirectedDFS.GRAPH_NODE_COLOR);
    this.cmd("SetForegroundColor", id, DirectedDFS.GRAPH_NODE_BORDER);
    this.cmd("SetTextColor", id, DirectedDFS.GRAPH_NODE_TEXT);
    this.cmd("SetHighlight", id, 0);
  }

  for (var from = 0; from < this.adjacencyList.length; from++) {
    for (var j = 0; j < this.adjacencyList[from].length; j++) {
      var to = this.adjacencyList[from][j];
      this.edgePairs.push({ from: from, to: to });
      this.cmd(
        "Connect",
        this.vertexIDs[from],
        this.vertexIDs[to],
        DirectedDFS.EDGE_COLOR,
        0,
        1,
        ""
      );
    }
  }

  this.highlightCircleID = this.nextIndex++;
  var startPos = this.vertexPositions[0];
  this.cmd(
    "CreateHighlightCircle",
    this.highlightCircleID,
    DirectedDFS.HIGHLIGHT_COLOR,
    startPos.x,
    startPos.y,
    DirectedDFS.HIGHLIGHT_RADIUS
  );
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

DirectedDFS.prototype.createArrayArea = function () {
  var visitedHeaderID = this.nextIndex++;
  var parentHeaderID = this.nextIndex++;
  var headerY =
    DirectedDFS.ARRAY_TOP_Y - DirectedDFS.ARRAY_CELL_HEIGHT / 2 - DirectedDFS.ARRAY_HEADER_GAP;

  this.cmd(
    "CreateLabel",
    visitedHeaderID,
    "Visited",
    DirectedDFS.ARRAY_BASE_X,
    headerY
  );
  this.cmd("SetTextStyle", visitedHeaderID, "bold 20");
  this.cmd("SetForegroundColor", visitedHeaderID, DirectedDFS.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    parentHeaderID,
    "Parent",
    DirectedDFS.ARRAY_BASE_X + DirectedDFS.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", parentHeaderID, "bold 20");
  this.cmd("SetForegroundColor", parentHeaderID, DirectedDFS.CODE_STANDARD_COLOR);

  this.visitedRectIDs = new Array(this.vertexLabels.length);
  this.parentRectIDs = new Array(this.vertexLabels.length);
  this.vertexRowLabelIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rowY = DirectedDFS.ARRAY_TOP_Y + i * DirectedDFS.ARRAY_CELL_HEIGHT;

    var vertexLabelID = this.nextIndex++;
    this.vertexRowLabelIDs[i] = vertexLabelID;
    this.cmd(
      "CreateLabel",
      vertexLabelID,
      this.vertexLabels[i],
      DirectedDFS.ARRAY_BASE_X - 95,
      rowY,
      0
    );
    this.cmd("SetTextStyle", vertexLabelID, "bold 20");
    this.cmd("SetForegroundColor", vertexLabelID, DirectedDFS.START_INFO_COLOR);

    var visitedID = this.nextIndex++;
    this.visitedRectIDs[i] = visitedID;
    this.cmd(
      "CreateRectangle",
      visitedID,
      "F",
      DirectedDFS.ARRAY_CELL_WIDTH,
      DirectedDFS.ARRAY_CELL_INNER_HEIGHT,
      DirectedDFS.ARRAY_BASE_X,
      rowY
    );
    this.cmd("SetForegroundColor", visitedID, DirectedDFS.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", visitedID, DirectedDFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", visitedID, DirectedDFS.ARRAY_TEXT_COLOR);

    var parentID = this.nextIndex++;
    this.parentRectIDs[i] = parentID;
    this.cmd(
      "CreateRectangle",
      parentID,
      "-",
      DirectedDFS.ARRAY_CELL_WIDTH,
      DirectedDFS.ARRAY_CELL_INNER_HEIGHT,
      DirectedDFS.ARRAY_BASE_X + DirectedDFS.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", parentID, DirectedDFS.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", parentID, DirectedDFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", parentID, DirectedDFS.ARRAY_TEXT_COLOR);
  }
};

DirectedDFS.prototype.createCodeDisplay = function () {
  var codeStartX = DirectedDFS.CANVAS_WIDTH / 2 - 150;
  this.codeID = this.addCodeToCanvasBase(
    DirectedDFS.CODE_LINES,
    codeStartX,
    DirectedDFS.CODE_START_Y,
    DirectedDFS.CODE_LINE_HEIGHT,
    DirectedDFS.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], DirectedDFS.CODE_FONT);
    }
  }
};

DirectedDFS.prototype.highlightCodeLine = function (lineIndex) {
  if (this.currentCodeLine >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[this.currentCodeLine][0],
      DirectedDFS.CODE_STANDARD_COLOR
    );
  }
  this.currentCodeLine = lineIndex;
  if (lineIndex >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[lineIndex][0],
      DirectedDFS.CODE_HIGHLIGHT_COLOR
    );
  }
};

DirectedDFS.prototype.clearTraversalState = function () {
  this.visited = new Array(this.vertexLabels.length);
  this.parents = new Array(this.vertexLabels.length);
  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.visited[i] = false;
    this.parents[i] = null;
    this.cmd("SetText", this.visitedRectIDs[i], "F");
    this.cmd("SetBackgroundColor", this.visitedRectIDs[i], DirectedDFS.ARRAY_RECT_COLOR);
    this.cmd("SetText", this.parentRectIDs[i], "-");
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[i],
      DirectedDFS.GRAPH_NODE_COLOR
    );
  }
  this.clearEdgeHighlights();
};

DirectedDFS.prototype.clearEdgeHighlights = function () {
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    this.cmd(
      "SetEdgeHighlight",
      this.vertexIDs[edge.from],
      this.vertexIDs[edge.to],
      0
    );
    this.cmd(
      "SetEdgeColor",
      this.vertexIDs[edge.from],
      this.vertexIDs[edge.to],
      DirectedDFS.EDGE_COLOR
    );
  }
};

DirectedDFS.prototype.startCallback = function () {
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

DirectedDFS.prototype.runTraversal = function (startIndex) {
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

  this.dfsVisit(startIndex);

  this.highlightCodeLine(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);

  return this.commands;
};

DirectedDFS.prototype.dfsVisit = function (u) {
  this.highlightCodeLine(0);
  this.cmd("Step");

  this.highlightCodeLine(1);
  if (!this.visited[u]) {
    this.visited[u] = true;
    this.cmd("SetText", this.visitedRectIDs[u], "T");
    this.cmd(
      "SetBackgroundColor",
      this.visitedRectIDs[u],
      DirectedDFS.ARRAY_VISITED_FILL
    );
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[u],
      DirectedDFS.GRAPH_NODE_VISITED_COLOR
    );
    this.cmd("Step");
  }

  this.highlightCodeLine(2);
  this.cmd("Step");

  var neighbors = this.adjacencyList[u];
  for (var i = 0; i < neighbors.length; i++) {
    var v = neighbors[i];
    this.highlightCodeLine(3);
    this.cmd(
      "SetEdgeHighlight",
      this.vertexIDs[u],
      this.vertexIDs[v],
      1
    );
    this.cmd(
      "SetEdgeColor",
      this.vertexIDs[u],
      this.vertexIDs[v],
      DirectedDFS.EDGE_HIGHLIGHT_COLOR
    );
    this.cmd("Step");

    if (!this.visited[v]) {
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

      this.dfsVisit(v);

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

    this.cmd(
      "SetEdgeHighlight",
      this.vertexIDs[u],
      this.vertexIDs[v],
      0
    );
    this.cmd(
      "SetEdgeColor",
      this.vertexIDs[u],
      this.vertexIDs[v],
      DirectedDFS.EDGE_COLOR
    );

    this.highlightCodeLine(2);
    this.cmd("Step");
  }

  this.highlightCodeLine(7);
  this.cmd("Step");
  this.highlightCodeLine(8);
  this.cmd("Step");
};

DirectedDFS.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

DirectedDFS.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new DirectedDFS(animManag, canvas.width, canvas.height);
}
