// Custom visualization for the Bellman-Ford shortest path algorithm on a weighted graph.

function BellmanFordVisualization(am, w, h) {
  this.init(am, w, h);
}

BellmanFordVisualization.prototype = new Algorithm();
BellmanFordVisualization.prototype.constructor = BellmanFordVisualization;
BellmanFordVisualization.superclass = Algorithm.prototype;

BellmanFordVisualization.CANVAS_WIDTH = 720;
BellmanFordVisualization.CANVAS_HEIGHT = 1280;

BellmanFordVisualization.TITLE_Y = 60;
// The prior layout included a status label along the bottom of the canvas.
// The revised design removes that status strip, so we no longer track
// coordinates for it.
BellmanFordVisualization.NODE_RADIUS = 32;
BellmanFordVisualization.NODE_COLOR = "#f6f7fb";
BellmanFordVisualization.NODE_BORDER_COLOR = "#283593";
BellmanFordVisualization.NODE_TEXT_COLOR = "#0d1b2a";
BellmanFordVisualization.NODE_ACTIVE_COLOR = "#ffe082";
BellmanFordVisualization.NODE_VISITED_COLOR = "#c5e1a5";
BellmanFordVisualization.NODE_VISITED_TEXT_COLOR = "#1b4332";

BellmanFordVisualization.EDGE_COLOR = "#424874";
BellmanFordVisualization.EDGE_HIGHLIGHT_COLOR = "#ff7043";
BellmanFordVisualization.EDGE_THICKNESS = 3;

BellmanFordVisualization.TABLE_HEADER_Y = 600;
BellmanFordVisualization.TABLE_ROW_HEIGHT = 44;
BellmanFordVisualization.TABLE_FIRST_ROW_Y =
  BellmanFordVisualization.TABLE_HEADER_Y + 50;
BellmanFordVisualization.TABLE_COLUMNS = [
  { label: "Vertex", x: 140, width: 90 },
  { label: "Distance", x: 360, width: 160 },
  { label: "Parent", x: 560, width: 120 },
];
BellmanFordVisualization.TABLE_HEADER_FONT = "bold 20";
BellmanFordVisualization.TABLE_CELL_FONT = "bold 18";
BellmanFordVisualization.TABLE_HEADER_COLOR = "#1a237e";
BellmanFordVisualization.TABLE_TEXT_COLOR = "#1f2933";
BellmanFordVisualization.TABLE_HIGHLIGHT_COLOR = "#ffe0b2";

BellmanFordVisualization.CODE_TITLE_Y = 900;
BellmanFordVisualization.CODE_START_Y = 920;
BellmanFordVisualization.CODE_LINE_HEIGHT = 14;
BellmanFordVisualization.CODE_LEFT_X =
  BellmanFordVisualization.TABLE_COLUMNS[0].x -
  BellmanFordVisualization.TABLE_COLUMNS[0].width / 2 +
  5;
BellmanFordVisualization.CODE_FONT = "bold 13px 'Courier New', monospace";
BellmanFordVisualization.CODE_STANDARD_COLOR = "#102a43";
BellmanFordVisualization.CODE_HIGHLIGHT_COLOR = "#d81b60";

BellmanFordVisualization.PATH_TITLE_FONT = "bold 18";
BellmanFordVisualization.PATH_FONT = "bold 14px 'Courier New', monospace";
BellmanFordVisualization.PATH_TITLE_COLOR = "#0b3d91";
BellmanFordVisualization.PATH_TEXT_COLOR = "#102a43";
BellmanFordVisualization.PATH_START_X = BellmanFordVisualization.CODE_LEFT_X + 360;
BellmanFordVisualization.PATH_START_Y = BellmanFordVisualization.CODE_START_Y;
BellmanFordVisualization.PATH_LINE_HEIGHT = 26;

BellmanFordVisualization.BIDIRECTIONAL_CURVE_INNER = 0.18;
BellmanFordVisualization.BIDIRECTIONAL_CURVE_OUTER = 0.28;

BellmanFordVisualization.TITLE_FONT = "bold 34";

BellmanFordVisualization.VERTEX_DATA = [
  { label: "S", x: 160, y: 360 },
  { label: "T", x: 360, y: 160 },
  { label: "X", x: 580, y: 260 },
  { label: "Y", x: 260, y: 540 },
  { label: "Z", x: 560, y: 520 },
];

BellmanFordVisualization.GRAPH_EDGES = [
  [
    { to: 1, weight: 6 },
    { to: 3, weight: 7 },
  ],
  [
    { to: 2, weight: 5 },
    { to: 3, weight: 8 },
    { to: 4, weight: -4 },
  ],
  [
    { to: 1, weight: -2 },
  ],
  [
    { to: 2, weight: -3 },
    { to: 4, weight: 9 },
  ],
  [
    { to: 2, weight: 7 },
    { to: 0, weight: 2 },
  ],
];

BellmanFordVisualization.CODE_LINES = [
  ["void bellmanFord(int start) {"],
  ["  int[] dist = new int[n];"],
  ["  int[] parent = new int[n];"],
  ["  Arrays.fill(dist, INF);"],
  ["  Arrays.fill(parent, -1);"] ,
  ["  dist[start] = 0;"],
  ["  for (int i = 1; i <= n - 1; i++) {"],
  ["    boolean updated = false;"],
  ["    for (Edge e : edges) {"],
  ["      if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {"],
  ["        dist[e.v] = dist[e.u] + e.w;"],
  ["        parent[e.v] = e.u;"],
  ["        updated = true;"],
  ["      }"],
  ["    }"],
  ["    if (!updated) break;"],
  ["  }"],
  ["  for (Edge e : edges) {"],
  ["    if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {"],
  ["      throw new IllegalStateException(\"Negative cycle\");"],
  ["    }"],
  ["  }"],
  ["}"],
];

BellmanFordVisualization.prototype.init = function (am, w, h) {
  BellmanFordVisualization.superclass.init.call(this, am, w, h);

  if (
    typeof objectManager !== "undefined" &&
    objectManager &&
    objectManager.statusReport
  ) {
    objectManager.statusReport.setText("");
    objectManager.statusReport.addedToScene = false;
  }

  this.controls = [];
  this.addControls();

  this.vertexIDs = [];
  this.edgeMap = {};
  this.allEdges = [];
  this.bidirectionalOrientation = {};
  this.distanceCellIDs = [];
  this.parentCellIDs = [];
  this.vertexCellIDs = [];
  this.codeID = [];
  this.pathLabelIDs = [];
  this.pathsTitleID = -1;
  this.currentCodeLine = -1;
  this.statusID = -1;
  this.titleID = -1;

  this.infinitySymbol = "\u221E";

  this.implementAction(this.reset.bind(this), 0);
};

BellmanFordVisualization.prototype.addControls = function () {
  addLabelToAlgorithmBar("Start Vertex:");
  this.startField = addControlToAlgorithmBar(
    "Text",
    BellmanFordVisualization.VERTEX_DATA[0].label
  );
  this.startField.size = 4;
  this.startButton = addControlToAlgorithmBar(
    "Button",
    "Run Bellman-Ford"
  );
  this.startButton.onclick = this.startCallback.bind(this);
  this.startField.onkeydown = this.returnSubmit(
    this.startField,
    this.startCallback.bind(this),
    1,
    false
  );

  this.resetButton = addControlToAlgorithmBar("Button", "Reset Layout");
  this.resetButton.onclick = this.resetCallback.bind(this);

  this.controls.push(this.startField, this.startButton, this.resetButton);
};

BellmanFordVisualization.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

BellmanFordVisualization.prototype.reset = function () {
  this.nextIndex = 0;
  this.vertexIDs = [];
  this.edgeMap = {};
  this.allEdges = [];
  this.bidirectionalOrientation = {};
  this.distanceCellIDs = [];
  this.parentCellIDs = [];
  this.vertexCellIDs = [];
  this.codeID = [];
  this.pathLabelIDs = [];
  this.pathsTitleID = -1;
  this.currentCodeLine = -1;

  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }

  return this.setup();
};

BellmanFordVisualization.prototype.setup = function () {
  this.commands = [];

  this.createTitle();
  this.createGraph();
  this.createTable();
  this.createCodeDisplay();
  this.highlightCodeLine(-1);

  if (this.startField) {
    this.setStartFieldValue(BellmanFordVisualization.VERTEX_DATA[0].label);
  }

  this.cmd("Step");
  return this.commands;
};

BellmanFordVisualization.prototype.createTitle = function () {
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Bellman-Ford Shortest Paths",
    BellmanFordVisualization.CANVAS_WIDTH / 2,
    BellmanFordVisualization.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleID, BellmanFordVisualization.TITLE_FONT);
  this.cmd("SetForegroundColor", this.titleID, "#102a43");

  // Remove the animation status banner from the layout.
  this.statusID = null;
};

BellmanFordVisualization.prototype.updateStatus = function () {
  // Status messaging has been fully removed from the layout.
  return;
};

BellmanFordVisualization.prototype.createGraph = function () {
  this.vertexIDs = new Array(BellmanFordVisualization.VERTEX_DATA.length);

  for (var i = 0; i < BellmanFordVisualization.VERTEX_DATA.length; i++) {
    var vertex = BellmanFordVisualization.VERTEX_DATA[i];
    var id = this.nextIndex++;
    this.vertexIDs[i] = id;
    this.cmd(
      "CreateCircle",
      id,
      vertex.label,
      vertex.x,
      vertex.y,
      BellmanFordVisualization.NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, BellmanFordVisualization.NODE_COLOR);
    this.cmd("SetForegroundColor", id, BellmanFordVisualization.NODE_BORDER_COLOR);
    this.cmd("SetTextColor", id, BellmanFordVisualization.NODE_TEXT_COLOR);
    this.cmd("SetHighlight", id, 0);
  }

  for (var from = 0; from < BellmanFordVisualization.GRAPH_EDGES.length; from++) {
    var edges = BellmanFordVisualization.GRAPH_EDGES[from];
    for (var j = 0; j < edges.length; j++) {
      var edge = edges[j];
      var edgeKey = this.edgeKey(from, edge.to);
      this.edgeMap[edgeKey] = {
        from: from,
        to: edge.to,
        weight: edge.weight,
      };
      this.allEdges.push({
        from: from,
        to: edge.to,
        weight: edge.weight,
      });
      var curve = this.shouldCurveEdge(from, edge.to)
        ? this.curveForPair(from, edge.to)
        : 0;
      this.cmd(
        "Connect",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        BellmanFordVisualization.EDGE_COLOR,
        curve,
        1,
        String(edge.weight)
      );
      this.cmd(
        "SetEdgeThickness",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        BellmanFordVisualization.EDGE_THICKNESS
      );
      this.cmd(
        "SetEdgeHighlight",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        0
      );
    }
  }
};

BellmanFordVisualization.prototype.createTable = function () {
  for (var c = 0; c < BellmanFordVisualization.TABLE_COLUMNS.length; c++) {
    var column = BellmanFordVisualization.TABLE_COLUMNS[c];
    var headerID = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      headerID,
      column.label,
      column.x,
      BellmanFordVisualization.TABLE_HEADER_Y,
      1
    );
    this.cmd("SetTextStyle", headerID, BellmanFordVisualization.TABLE_HEADER_FONT);
    this.cmd("SetForegroundColor", headerID, BellmanFordVisualization.TABLE_HEADER_COLOR);
  }

  var vertexCount = BellmanFordVisualization.VERTEX_DATA.length;
  this.vertexCellIDs = new Array(vertexCount);
  this.distanceCellIDs = new Array(vertexCount);
  this.parentCellIDs = new Array(vertexCount);

  for (var i = 0; i < vertexCount; i++) {
    var rowY = BellmanFordVisualization.TABLE_FIRST_ROW_Y +
      i * BellmanFordVisualization.TABLE_ROW_HEIGHT;

    var vertexCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      vertexCell,
      BellmanFordVisualization.VERTEX_DATA[i].label,
      BellmanFordVisualization.TABLE_COLUMNS[0].width,
      BellmanFordVisualization.TABLE_ROW_HEIGHT - 6,
      BellmanFordVisualization.TABLE_COLUMNS[0].x,
      rowY
    );
    this.cmd("SetTextStyle", vertexCell, BellmanFordVisualization.TABLE_CELL_FONT);
    this.cmd("SetForegroundColor", vertexCell, BellmanFordVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", vertexCell, "#ffffff");
    this.vertexCellIDs[i] = vertexCell;

    var distanceCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      distanceCell,
      this.infinitySymbol,
      BellmanFordVisualization.TABLE_COLUMNS[1].width,
      BellmanFordVisualization.TABLE_ROW_HEIGHT - 6,
      BellmanFordVisualization.TABLE_COLUMNS[1].x,
      rowY
    );
    this.cmd(
      "SetTextStyle",
      distanceCell,
      BellmanFordVisualization.TABLE_CELL_FONT
    );
    this.cmd("SetForegroundColor", distanceCell, BellmanFordVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", distanceCell, "#ffffff");
    this.distanceCellIDs[i] = distanceCell;

    var parentCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      parentCell,
      "-",
      BellmanFordVisualization.TABLE_COLUMNS[2].width,
      BellmanFordVisualization.TABLE_ROW_HEIGHT - 6,
      BellmanFordVisualization.TABLE_COLUMNS[2].x,
      rowY
    );
    this.cmd("SetTextStyle", parentCell, BellmanFordVisualization.TABLE_CELL_FONT);
    this.cmd("SetForegroundColor", parentCell, BellmanFordVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", parentCell, "#ffffff");
    this.parentCellIDs[i] = parentCell;
  }
};

BellmanFordVisualization.prototype.createCodeDisplay = function () {
  this.codeID = this.addCodeToCanvasBase(
    BellmanFordVisualization.CODE_LINES,
    BellmanFordVisualization.CODE_LEFT_X,
    BellmanFordVisualization.CODE_START_Y,
    BellmanFordVisualization.CODE_LINE_HEIGHT,
    BellmanFordVisualization.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], BellmanFordVisualization.CODE_FONT);
    }
  }

  this.pathsTitleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.pathsTitleID,
    "Shortest Paths",
    BellmanFordVisualization.PATH_START_X,
    BellmanFordVisualization.CODE_TITLE_Y,
    0
  );
  this.cmd("SetTextStyle", this.pathsTitleID, BellmanFordVisualization.PATH_TITLE_FONT);
  this.cmd("SetForegroundColor", this.pathsTitleID, BellmanFordVisualization.PATH_TITLE_COLOR);
};

BellmanFordVisualization.prototype.clearPathsDisplay = function () {
  if (!this.pathLabelIDs) {
    this.pathLabelIDs = [];
  }

  for (var i = 0; i < this.pathLabelIDs.length; i++) {
    this.cmd("Delete", this.pathLabelIDs[i]);
  }

  this.pathLabelIDs = [];
};

BellmanFordVisualization.prototype.buildPathString = function (
  vertexIndex,
  parent,
  startIndex
) {
  var labels = [];
  var current = vertexIndex;
  var guard = 0;
  while (current !== -1 && guard <= parent.length) {
    labels.push(BellmanFordVisualization.VERTEX_DATA[current].label);
    if (current === startIndex) {
      break;
    }
    current = parent[current];
    guard++;
  }

  labels.reverse();
  return labels.join(" → ");
};

BellmanFordVisualization.prototype.displayShortestPaths = function (
  startIndex,
  parent,
  dist
) {
  this.clearPathsDisplay();

  if (this.pathsTitleID >= 0) {
    this.cmd(
      "SetText",
      this.pathsTitleID,
      "Paths from " + BellmanFordVisualization.VERTEX_DATA[startIndex].label
    );
  }

  for (var i = 0; i < dist.length; i++) {
    if (dist[i] === Infinity) {
      continue;
    }

    var pathText = this.buildPathString(i, parent, startIndex);
    var pathID = this.nextIndex++;
    var y =
      BellmanFordVisualization.PATH_START_Y +
      this.pathLabelIDs.length * BellmanFordVisualization.PATH_LINE_HEIGHT;

    this.cmd("CreateLabel", pathID, pathText, BellmanFordVisualization.PATH_START_X, y, 0);
    this.cmd("SetTextStyle", pathID, BellmanFordVisualization.PATH_FONT);
    this.cmd("SetForegroundColor", pathID, BellmanFordVisualization.PATH_TEXT_COLOR);

    this.pathLabelIDs.push(pathID);
    this.cmd("Step");
  }
};

BellmanFordVisualization.prototype.edgeKey = function (from, to) {
  return from + "->" + to;
};

BellmanFordVisualization.prototype.pairKey = function (a, b) {
  return a < b ? a + ":" + b : b + ":" + a;
};

BellmanFordVisualization.prototype.shouldCurveEdge = function (from, to) {
  return from !== to && this.graphHasEdge(to, from);
};

BellmanFordVisualization.prototype.curveForPair = function (from, to) {
  var orientation = this.getBidirectionalOrientation(from, to);
  var magnitude = from < to
    ? BellmanFordVisualization.BIDIRECTIONAL_CURVE_INNER
    : BellmanFordVisualization.BIDIRECTIONAL_CURVE_OUTER;
  return orientation * magnitude;
};

BellmanFordVisualization.prototype.getBidirectionalOrientation = function (
  from,
  to
) {
  var key = this.pairKey(from, to);
  if (this.bidirectionalOrientation.hasOwnProperty(key)) {
    return this.bidirectionalOrientation[key];
  }

  var fromVertex = BellmanFordVisualization.VERTEX_DATA[from];
  var toVertex = BellmanFordVisualization.VERTEX_DATA[to];
  var midY = (fromVertex.y + toVertex.y) / 2;
  var orientation = midY < BellmanFordVisualization.TABLE_HEADER_Y ? -1 : 1;

  this.bidirectionalOrientation[key] = orientation;
  return orientation;
};

BellmanFordVisualization.prototype.graphHasEdge = function (from, to) {
  var adjacency = BellmanFordVisualization.GRAPH_EDGES[from] || [];
  for (var i = 0; i < adjacency.length; i++) {
    if (adjacency[i].to === to) {
      return true;
    }
  }
  return false;
};

BellmanFordVisualization.prototype.highlightCodeLine = function (line) {
  if (this.currentCodeLine !== -1 && this.codeID[this.currentCodeLine]) {
    for (var j = 0; j < this.codeID[this.currentCodeLine].length; j++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[this.currentCodeLine][j],
        BellmanFordVisualization.CODE_STANDARD_COLOR
      );
    }
  }

  this.currentCodeLine = line;

  if (line >= 0 && this.codeID[line]) {
    for (var k = 0; k < this.codeID[line].length; k++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[line][k],
        BellmanFordVisualization.CODE_HIGHLIGHT_COLOR
      );
    }
  }
};

BellmanFordVisualization.prototype.cleanInputLabel = function (value) {
  if (!value) {
    return "";
  }
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase();
};

BellmanFordVisualization.prototype.setStartFieldValue = function (value) {
  if (this.startField) {
    this.startField.value = value;
  }
};

BellmanFordVisualization.prototype.getStartFieldValue = function () {
  return this.startField ? this.startField.value : "";
};

BellmanFordVisualization.prototype.findVertexIndex = function (label) {
  var clean = this.cleanInputLabel(label);
  for (var i = 0; i < BellmanFordVisualization.VERTEX_DATA.length; i++) {
    if (BellmanFordVisualization.VERTEX_DATA[i].label === clean) {
      return i;
    }
  }
  return -1;
};

BellmanFordVisualization.prototype.startCallback = function () {
  var value = this.getStartFieldValue();
  var index = this.findVertexIndex(value);
  if (index === -1) {
    index = 0;
    this.setStartFieldValue(BellmanFordVisualization.VERTEX_DATA[0].label);
  } else {
    this.setStartFieldValue(BellmanFordVisualization.VERTEX_DATA[index].label);
  }

  this.implementAction(this.runBellmanFord.bind(this), index);
};

BellmanFordVisualization.prototype.runBellmanFord = function (startIndex) {
  this.commands = [];

  this.resetTableState();
  this.resetGraphState();
  this.clearPathsDisplay();

  var startLabel = BellmanFordVisualization.VERTEX_DATA[startIndex].label;
  this.updateStatus("Running Bellman-Ford from vertex " + startLabel + ".");

  var vertexCount = BellmanFordVisualization.VERTEX_DATA.length;
  var dist = new Array(vertexCount);
  var parent = new Array(vertexCount);

  for (var i = 0; i < vertexCount; i++) {
    dist[i] = Infinity;
    parent[i] = -1;
  }

  this.highlightCodeLine(0);
  this.cmd("Step");
  this.highlightCodeLine(1);
  this.cmd("Step");
  this.highlightCodeLine(2);
  this.cmd("Step");
  this.highlightCodeLine(3);
  this.cmd("Step");
  this.highlightCodeLine(4);
  this.cmd("Step");

  this.highlightCodeLine(5);
  this.cmd("Step");
  dist[startIndex] = 0;
  this.updateDistanceCell(startIndex, 0, true);
  this.cmd("Step");
  this.updateDistanceCell(startIndex, 0, false);

  for (var iteration = 1; iteration <= vertexCount - 1; iteration++) {
    this.highlightCodeLine(6);
    this.cmd("Step");

    var updated = false;
    this.highlightCodeLine(7);
    this.cmd("Step");

    for (var e = 0; e < this.allEdges.length; e++) {
      var edge = this.allEdges[e];
      var u = edge.from;
      var v = edge.to;
      var weight = edge.weight;
      var fromLabel = BellmanFordVisualization.VERTEX_DATA[u].label;
      var toLabel = BellmanFordVisualization.VERTEX_DATA[v].label;

      this.highlightCodeLine(8);
      this.highlightEdge(u, v, true);
      this.cmd("Step");

      this.highlightCodeLine(9);
      var canRelax =
        dist[u] !== Infinity && dist[u] + weight < dist[v];
      this.updateStatus(
        "Relaxing edge " +
          fromLabel +
          " → " +
          toLabel +
          " (w=" +
          weight +
          ")"
      );
      this.cmd("Step");

      if (canRelax) {
        this.highlightCodeLine(10);
        dist[v] = dist[u] + weight;
        this.updateDistanceCell(v, dist[v], true);
        this.cmd("Step");
        this.updateDistanceCell(v, dist[v], false);

        this.highlightCodeLine(11);
        parent[v] = u;
        this.updateParentCell(v, u, true);
        this.cmd("Step");
        this.updateParentCell(v, u, false);

        this.highlightCodeLine(12);
        updated = true;
        this.cmd("Step");
      }

      this.highlightCodeLine(13);
      this.highlightEdge(u, v, false);
      this.cmd("Step");
    }

    this.highlightCodeLine(14);
    this.cmd("Step");

    this.highlightCodeLine(15);
    this.cmd("Step");
    if (!updated) {
      break;
    }

    this.highlightCodeLine(16);
    this.cmd("Step");
  }

  this.highlightCodeLine(17);
  this.cmd("Step");

  var negativeCycle = false;

  for (var i2 = 0; i2 < this.allEdges.length; i2++) {
    var edgeCheck = this.allEdges[i2];
    var from = edgeCheck.from;
    var to = edgeCheck.to;
    var weightCheck = edgeCheck.weight;
    var fromLabel = BellmanFordVisualization.VERTEX_DATA[from].label;
    var toLabel = BellmanFordVisualization.VERTEX_DATA[to].label;

    this.highlightCodeLine(18);
    this.highlightEdge(from, to, true);
    this.cmd("Step");

    var detectsCycle =
      dist[from] !== Infinity && dist[from] + weightCheck < dist[to];

    if (detectsCycle) {
      this.highlightCodeLine(19);
      negativeCycle = true;
      this.updateStatus(
        "Negative cycle detected via edge " +
          fromLabel +
          " → " +
          toLabel +
          "."
      );
      this.cmd("Step");
      this.highlightEdge(from, to, false);
      break;
    }

    this.highlightCodeLine(20);
    this.highlightEdge(from, to, false);
    this.cmd("Step");
  }

  this.highlightCodeLine(21);
  this.updateStatus(
    negativeCycle
      ? "Negative cycle detected; shortest paths are undefined."
      : "Bellman-Ford computation complete."
  );
  this.cmd("Step");

  this.highlightCodeLine(22);
  this.cmd("Step");

  this.highlightCodeLine(-1);

  if (!negativeCycle) {
    this.displayShortestPaths(startIndex, parent, dist);
  }

  return this.commands;
};

BellmanFordVisualization.prototype.resetTableState = function () {
  for (var j = 0; j < this.distanceCellIDs.length; j++) {
    this.cmd("SetText", this.distanceCellIDs[j], this.infinitySymbol);
    this.cmd("SetBackgroundColor", this.distanceCellIDs[j], "#ffffff");
  }
  for (var k = 0; k < this.parentCellIDs.length; k++) {
    this.cmd("SetText", this.parentCellIDs[k], "-");
    this.cmd("SetBackgroundColor", this.parentCellIDs[k], "#ffffff");
  }
};

BellmanFordVisualization.prototype.resetGraphState = function () {
  for (var i = 0; i < this.vertexIDs.length; i++) {
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[i],
      BellmanFordVisualization.NODE_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[i],
      BellmanFordVisualization.NODE_TEXT_COLOR
    );
  }

  for (var key in this.edgeMap) {
    if (this.edgeMap.hasOwnProperty(key)) {
      var edge = this.edgeMap[key];
      this.cmd(
        "SetEdgeColor",
        this.vertexIDs[edge.from],
        this.vertexIDs[edge.to],
        BellmanFordVisualization.EDGE_COLOR
      );
      this.cmd(
        "SetEdgeHighlight",
        this.vertexIDs[edge.from],
        this.vertexIDs[edge.to],
        0
      );
    }
  }
};

BellmanFordVisualization.prototype.updateDistanceCell = function (
  index,
  value,
  highlight
) {
  this.cmd("SetText", this.distanceCellIDs[index], value);
  if (highlight) {
    this.cmd(
      "SetBackgroundColor",
      this.distanceCellIDs[index],
      BellmanFordVisualization.TABLE_HIGHLIGHT_COLOR
    );
  } else {
    this.cmd("SetBackgroundColor", this.distanceCellIDs[index], "#ffffff");
  }
};

BellmanFordVisualization.prototype.updateParentCell = function (
  index,
  parentIndex,
  highlight
) {
  var parentLabel = parentIndex === -1
    ? "-"
    : BellmanFordVisualization.VERTEX_DATA[parentIndex].label;
  var shouldHighlight = highlight;
  if (typeof shouldHighlight !== "boolean") {
    shouldHighlight = true;
  }
  this.cmd("SetText", this.parentCellIDs[index], parentLabel);
  this.cmd(
    "SetBackgroundColor",
    this.parentCellIDs[index],
    shouldHighlight ? BellmanFordVisualization.TABLE_HIGHLIGHT_COLOR : "#ffffff"
  );
};

BellmanFordVisualization.prototype.highlightVertex = function (
  index,
  color,
  visited
) {
  this.cmd("SetBackgroundColor", this.vertexIDs[index], color);
  if (visited) {
    this.cmd(
      "SetTextColor",
      this.vertexIDs[index],
      BellmanFordVisualization.NODE_VISITED_TEXT_COLOR
    );
  }
};

BellmanFordVisualization.prototype.highlightEdge = function (from, to, active) {
  this.cmd(
    "SetEdgeHighlight",
    this.vertexIDs[from],
    this.vertexIDs[to],
    active ? 1 : 0
  );
  this.cmd(
    "SetEdgeColor",
    this.vertexIDs[from],
    this.vertexIDs[to],
    active
      ? BellmanFordVisualization.EDGE_HIGHLIGHT_COLOR
      : BellmanFordVisualization.EDGE_COLOR
  );
};

BellmanFordVisualization.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

BellmanFordVisualization.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new BellmanFordVisualization(animManag, canvas.width, canvas.height);
}

