// Custom visualization for Dijkstra's shortest path algorithm on a weighted graph.

function DijkstraVisualization(am, w, h) {
  this.init(am, w, h);
}

DijkstraVisualization.prototype = new Algorithm();
DijkstraVisualization.prototype.constructor = DijkstraVisualization;
DijkstraVisualization.superclass = Algorithm.prototype;

DijkstraVisualization.CANVAS_WIDTH = 720;
DijkstraVisualization.CANVAS_HEIGHT = 1280;

DijkstraVisualization.TITLE_Y = 60;
DijkstraVisualization.STATUS_Y = 110;

DijkstraVisualization.NODE_RADIUS = 32;
DijkstraVisualization.NODE_COLOR = "#f6f7fb";
DijkstraVisualization.NODE_BORDER_COLOR = "#283593";
DijkstraVisualization.NODE_TEXT_COLOR = "#0d1b2a";
DijkstraVisualization.NODE_ACTIVE_COLOR = "#ffe082";
DijkstraVisualization.NODE_VISITED_COLOR = "#c5e1a5";
DijkstraVisualization.NODE_VISITED_TEXT_COLOR = "#1b4332";

DijkstraVisualization.EDGE_COLOR = "#424874";
DijkstraVisualization.EDGE_HIGHLIGHT_COLOR = "#ff7043";
DijkstraVisualization.EDGE_THICKNESS = 3;

DijkstraVisualization.TABLE_HEADER_Y = 600;
DijkstraVisualization.TABLE_ROW_HEIGHT = 44;
DijkstraVisualization.TABLE_FIRST_ROW_Y =
  DijkstraVisualization.TABLE_HEADER_Y + 50;
DijkstraVisualization.TABLE_COLUMNS = [
  { label: "Vertex", x: 120, width: 90 },
  { label: "Known", x: 280, width: 100 },
  { label: "Distance", x: 440, width: 140 },
  { label: "Parent", x: 600, width: 110 },
];
DijkstraVisualization.TABLE_HEADER_FONT = "bold 20";
DijkstraVisualization.TABLE_CELL_FONT = "bold 18";
DijkstraVisualization.TABLE_HEADER_COLOR = "#1a237e";
DijkstraVisualization.TABLE_TEXT_COLOR = "#1f2933";
DijkstraVisualization.TABLE_HIGHLIGHT_COLOR = "#ffe0b2";

DijkstraVisualization.CODE_TITLE_Y = 900;
DijkstraVisualization.CODE_START_Y = 920;
DijkstraVisualization.CODE_LINE_HEIGHT = 16;
DijkstraVisualization.CODE_FONT = "15px 'Courier New'";
DijkstraVisualization.CODE_STANDARD_COLOR = "#102a43";
DijkstraVisualization.CODE_HIGHLIGHT_COLOR = "#d81b60";

DijkstraVisualization.STATUS_FONT = "bold 22";
DijkstraVisualization.TITLE_FONT = "bold 34";

DijkstraVisualization.VERTEX_DATA = [
  { label: "A", x: 150, y: 220 },
  { label: "B", x: 570, y: 220 },
  { label: "C", x: 150, y: 380 },
  { label: "D", x: 570, y: 380 },
  { label: "E", x: 150, y: 540 },
  { label: "F", x: 570, y: 540 },
];

DijkstraVisualization.GRAPH_EDGES = [
  [
    { to: 1, weight: 4 },
    { to: 2, weight: 2 },
  ],
  [
    { to: 2, weight: 1 },
    { to: 3, weight: 5 },
    { to: 4, weight: 3 },
  ],
  [
    { to: 1, weight: 1 },
    { to: 3, weight: 8 },
    { to: 4, weight: 10 },
  ],
  [
    { to: 4, weight: 2 },
    { to: 5, weight: 6 },
  ],
  [
    { to: 5, weight: 2 },
  ],
  [],
];

DijkstraVisualization.CODE_LINES = [
  ["void dijkstra(int start) {"],
  ["  boolean[] visited = new boolean[n];"],
  ["  int[] dist = new int[n];"],
  ["  int[] parent = new int[n];"],
  ["  Arrays.fill(dist, INF);"],
  ["  Arrays.fill(parent, -1);"] ,
  ["  dist[start] = 0;"],
  ["  PriorityQueue<Node> pq = new PriorityQueue<>();"],
  ["  pq.offer(new Node(start, 0));"],
  ["  while (!pq.isEmpty()) {"],
  ["    Node cur = pq.poll();"],
  ["    if (visited[cur.id]) continue;"],
  ["    visited[cur.id] = true;"],
  ["    for (Edge e : graph[cur.id]) {"],
  ["      int alt = dist[cur.id] + e.weight;"],
  ["      if (alt < dist[e.to]) {"],
  ["        dist[e.to] = alt;"],
  ["        parent[e.to] = cur.id;"],
  ["        pq.offer(new Node(e.to, alt));"],
  ["      }"],
  ["    }"],
  ["  }"],
  ["}"],
];

DijkstraVisualization.prototype.init = function (am, w, h) {
  DijkstraVisualization.superclass.init.call(this, am, w, h);

  this.controls = [];
  this.addControls();

  this.vertexIDs = [];
  this.edgeMap = {};
  this.distanceCellIDs = [];
  this.knownCellIDs = [];
  this.parentCellIDs = [];
  this.vertexCellIDs = [];
  this.codeID = [];
  this.currentCodeLine = -1;
  this.statusID = -1;
  this.titleID = -1;

  this.infinitySymbol = "\u221E";

  this.implementAction(this.reset.bind(this), 0);
};

DijkstraVisualization.prototype.addControls = function () {
  addLabelToAlgorithmBar("Start Vertex:");
  this.startField = addControlToAlgorithmBar("Text", "A");
  this.startField.size = 4;
  this.startButton = addControlToAlgorithmBar("Button", "Run Dijkstra");
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

DijkstraVisualization.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

DijkstraVisualization.prototype.reset = function () {
  this.nextIndex = 0;
  this.vertexIDs = [];
  this.edgeMap = {};
  this.distanceCellIDs = [];
  this.knownCellIDs = [];
  this.parentCellIDs = [];
  this.vertexCellIDs = [];
  this.codeID = [];
  this.currentCodeLine = -1;

  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }

  return this.setup();
};

DijkstraVisualization.prototype.setup = function () {
  this.commands = [];

  this.createTitle();
  this.createGraph();
  this.createTable();
  this.createCodeDisplay();
  this.highlightCodeLine(-1);

  if (this.startField) {
    this.setStartFieldValue(DijkstraVisualization.VERTEX_DATA[0].label);
  }

  this.cmd("Step");
  return this.commands;
};

DijkstraVisualization.prototype.createTitle = function () {
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Dijkstra's Shortest Path",
    DijkstraVisualization.CANVAS_WIDTH / 2,
    DijkstraVisualization.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleID, DijkstraVisualization.TITLE_FONT);
  this.cmd("SetForegroundColor", this.titleID, "#102a43");

  this.statusID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.statusID,
    "Select a start vertex and run the algorithm.",
    DijkstraVisualization.CANVAS_WIDTH / 2,
    DijkstraVisualization.STATUS_Y,
    1
  );
  this.cmd("SetTextStyle", this.statusID, DijkstraVisualization.STATUS_FONT);
  this.cmd("SetForegroundColor", this.statusID, "#1d3557");
};

DijkstraVisualization.prototype.createGraph = function () {
  this.vertexIDs = new Array(DijkstraVisualization.VERTEX_DATA.length);

  for (var i = 0; i < DijkstraVisualization.VERTEX_DATA.length; i++) {
    var vertex = DijkstraVisualization.VERTEX_DATA[i];
    var id = this.nextIndex++;
    this.vertexIDs[i] = id;
    this.cmd(
      "CreateCircle",
      id,
      vertex.label,
      vertex.x,
      vertex.y,
      DijkstraVisualization.NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, DijkstraVisualization.NODE_COLOR);
    this.cmd("SetForegroundColor", id, DijkstraVisualization.NODE_BORDER_COLOR);
    this.cmd("SetTextColor", id, DijkstraVisualization.NODE_TEXT_COLOR);
    this.cmd("SetHighlight", id, 0);
  }

  for (var from = 0; from < DijkstraVisualization.GRAPH_EDGES.length; from++) {
    var edges = DijkstraVisualization.GRAPH_EDGES[from];
    for (var j = 0; j < edges.length; j++) {
      var edge = edges[j];
      var edgeKey = this.edgeKey(from, edge.to);
      this.edgeMap[edgeKey] = {
        from: from,
        to: edge.to,
        weight: edge.weight,
      };
      this.cmd(
        "Connect",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        DijkstraVisualization.EDGE_COLOR,
        0,
        1,
        String(edge.weight)
      );
      this.cmd(
        "SetEdgeThickness",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        DijkstraVisualization.EDGE_THICKNESS
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

DijkstraVisualization.prototype.createTable = function () {
  for (var c = 0; c < DijkstraVisualization.TABLE_COLUMNS.length; c++) {
    var column = DijkstraVisualization.TABLE_COLUMNS[c];
    var headerID = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      headerID,
      column.label,
      column.x,
      DijkstraVisualization.TABLE_HEADER_Y,
      1
    );
    this.cmd("SetTextStyle", headerID, DijkstraVisualization.TABLE_HEADER_FONT);
    this.cmd("SetForegroundColor", headerID, DijkstraVisualization.TABLE_HEADER_COLOR);
  }

  var vertexCount = DijkstraVisualization.VERTEX_DATA.length;
  this.vertexCellIDs = new Array(vertexCount);
  this.knownCellIDs = new Array(vertexCount);
  this.distanceCellIDs = new Array(vertexCount);
  this.parentCellIDs = new Array(vertexCount);

  for (var i = 0; i < vertexCount; i++) {
    var rowY = DijkstraVisualization.TABLE_FIRST_ROW_Y +
      i * DijkstraVisualization.TABLE_ROW_HEIGHT;

    var vertexCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      vertexCell,
      DijkstraVisualization.VERTEX_DATA[i].label,
      DijkstraVisualization.TABLE_COLUMNS[0].width,
      DijkstraVisualization.TABLE_ROW_HEIGHT - 6,
      DijkstraVisualization.TABLE_COLUMNS[0].x,
      rowY
    );
    this.cmd("SetTextStyle", vertexCell, DijkstraVisualization.TABLE_CELL_FONT);
    this.cmd("SetForegroundColor", vertexCell, DijkstraVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", vertexCell, "#ffffff");
    this.vertexCellIDs[i] = vertexCell;

    var knownCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      knownCell,
      "F",
      DijkstraVisualization.TABLE_COLUMNS[1].width,
      DijkstraVisualization.TABLE_ROW_HEIGHT - 6,
      DijkstraVisualization.TABLE_COLUMNS[1].x,
      rowY
    );
    this.cmd("SetTextStyle", knownCell, DijkstraVisualization.TABLE_CELL_FONT);
    this.cmd("SetForegroundColor", knownCell, DijkstraVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", knownCell, "#ffffff");
    this.knownCellIDs[i] = knownCell;

    var distanceCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      distanceCell,
      this.infinitySymbol,
      DijkstraVisualization.TABLE_COLUMNS[2].width,
      DijkstraVisualization.TABLE_ROW_HEIGHT - 6,
      DijkstraVisualization.TABLE_COLUMNS[2].x,
      rowY
    );
    this.cmd(
      "SetTextStyle",
      distanceCell,
      DijkstraVisualization.TABLE_CELL_FONT
    );
    this.cmd("SetForegroundColor", distanceCell, DijkstraVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", distanceCell, "#ffffff");
    this.distanceCellIDs[i] = distanceCell;

    var parentCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      parentCell,
      "-",
      DijkstraVisualization.TABLE_COLUMNS[3].width,
      DijkstraVisualization.TABLE_ROW_HEIGHT - 6,
      DijkstraVisualization.TABLE_COLUMNS[3].x,
      rowY
    );
    this.cmd("SetTextStyle", parentCell, DijkstraVisualization.TABLE_CELL_FONT);
    this.cmd("SetForegroundColor", parentCell, DijkstraVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", parentCell, "#ffffff");
    this.parentCellIDs[i] = parentCell;
  }
};

DijkstraVisualization.prototype.createCodeDisplay = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "Java Paradigm",
    DijkstraVisualization.CANVAS_WIDTH / 2,
    DijkstraVisualization.CODE_TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 22");
  this.cmd("SetForegroundColor", titleID, "#0b3d91");

  this.codeID = this.addCodeToCanvasBase(
    DijkstraVisualization.CODE_LINES,
    DijkstraVisualization.CANVAS_WIDTH / 2 - 240,
    DijkstraVisualization.CODE_START_Y,
    DijkstraVisualization.CODE_LINE_HEIGHT,
    DijkstraVisualization.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], DijkstraVisualization.CODE_FONT);
    }
  }
};

DijkstraVisualization.prototype.edgeKey = function (from, to) {
  return from + "->" + to;
};

DijkstraVisualization.prototype.highlightCodeLine = function (line) {
  if (this.currentCodeLine !== -1 && this.codeID[this.currentCodeLine]) {
    for (var j = 0; j < this.codeID[this.currentCodeLine].length; j++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[this.currentCodeLine][j],
        DijkstraVisualization.CODE_STANDARD_COLOR
      );
    }
  }

  this.currentCodeLine = line;

  if (line >= 0 && this.codeID[line]) {
    for (var k = 0; k < this.codeID[line].length; k++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[line][k],
        DijkstraVisualization.CODE_HIGHLIGHT_COLOR
      );
    }
  }
};

DijkstraVisualization.prototype.cleanInputLabel = function (value) {
  if (!value) {
    return "";
  }
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase();
};

DijkstraVisualization.prototype.setStartFieldValue = function (value) {
  if (this.startField) {
    this.startField.value = value;
  }
};

DijkstraVisualization.prototype.getStartFieldValue = function () {
  return this.startField ? this.startField.value : "";
};

DijkstraVisualization.prototype.findVertexIndex = function (label) {
  var clean = this.cleanInputLabel(label);
  for (var i = 0; i < DijkstraVisualization.VERTEX_DATA.length; i++) {
    if (DijkstraVisualization.VERTEX_DATA[i].label === clean) {
      return i;
    }
  }
  return -1;
};

DijkstraVisualization.prototype.startCallback = function () {
  var value = this.getStartFieldValue();
  var index = this.findVertexIndex(value);
  if (index === -1) {
    index = 0;
    this.setStartFieldValue(DijkstraVisualization.VERTEX_DATA[0].label);
  } else {
    this.setStartFieldValue(DijkstraVisualization.VERTEX_DATA[index].label);
  }

  this.implementAction(this.runDijkstra.bind(this), index);
};

DijkstraVisualization.prototype.runDijkstra = function (startIndex) {
  this.commands = [];

  this.resetTableState();
  this.resetGraphState();

  var startLabel = DijkstraVisualization.VERTEX_DATA[startIndex].label;
  this.cmd(
    "SetText",
    this.statusID,
    "Running Dijkstra from vertex " + startLabel + "."
  );

  var vertexCount = DijkstraVisualization.VERTEX_DATA.length;
  var dist = new Array(vertexCount);
  var parent = new Array(vertexCount);
  var visited = new Array(vertexCount);

  for (var i = 0; i < vertexCount; i++) {
    dist[i] = Infinity;
    parent[i] = -1;
    visited[i] = false;
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

  this.highlightCodeLine(6);
  this.cmd("Step");
  dist[startIndex] = 0;
  this.updateDistanceCell(startIndex, 0, true);

  this.highlightCodeLine(7);
  this.cmd("Step");
  var pq = [];
  this.highlightCodeLine(8);
  this.cmd("Step");
  pq.push({ vertex: startIndex, distance: 0 });

  this.highlightCodeLine(9);
  this.cmd("Step");

  while (pq.length > 0) {
    pq.sort(function (a, b) {
      return a.distance - b.distance;
    });

    var current = pq.shift();
    var u = current.vertex;

    this.highlightCodeLine(10);
    this.cmd("Step");

    this.highlightCodeLine(11);
    this.cmd("Step");

    if (visited[u]) {
      this.cmd("Step");
      continue;
    }

    this.highlightCodeLine(12);
    this.cmd(
      "SetText",
      this.statusID,
      "Processing vertex " +
        DijkstraVisualization.VERTEX_DATA[u].label +
        " with current distance " +
        (dist[u] === Infinity ? this.infinitySymbol : dist[u]) +
        "."
    );
    visited[u] = true;
    this.setKnownCell(u, true);
    this.highlightVertex(u, DijkstraVisualization.NODE_ACTIVE_COLOR);
    this.cmd("Step");

    this.highlightVertex(u, DijkstraVisualization.NODE_VISITED_COLOR, true);

    this.highlightCodeLine(13);
    this.cmd("Step");
    var neighbors = DijkstraVisualization.GRAPH_EDGES[u];
    var i;
    for (i = 0; i < neighbors.length; i++) {
      var edge = neighbors[i];
      var v = edge.to;
      var weight = edge.weight;
      var fromLabel = DijkstraVisualization.VERTEX_DATA[u].label;
      var toLabel = DijkstraVisualization.VERTEX_DATA[v].label;

      this.highlightCodeLine(13);
      this.cmd("Step");

      this.highlightCodeLine(14);
      this.highlightEdge(u, v, true);
      this.cmd("Step");

      this.highlightCodeLine(15);
      var alternative = dist[u] + weight;
      this.cmd(
        "SetText",
        this.statusID,
        "Checking edge " +
          fromLabel +
          " → " +
          toLabel +
          " with weight " +
          weight +
          "."
      );
      this.cmd("Step");

      if (alternative < dist[v]) {
        this.highlightCodeLine(16);
        dist[v] = alternative;
        parent[v] = u;
        this.updateDistanceCell(v, alternative, true);
        this.cmd(
          "SetText",
          this.statusID,
          "Updated distance of " +
            toLabel +
            " to " +
            alternative +
            " via " +
            fromLabel +
            "."
        );
        this.cmd("Step");
        this.updateDistanceCell(v, alternative, false);

        this.highlightCodeLine(17);
        this.updateParentCell(v, u, true);
        this.cmd("Step");
        this.updateParentCell(v, u, false);

        this.highlightCodeLine(18);
        pq.push({ vertex: v, distance: alternative });
        this.cmd("Step");
      } else {
        this.cmd(
          "SetText",
          this.statusID,
          "Keeping current distance of " +
            toLabel +
            " (" +
            (dist[v] === Infinity ? this.infinitySymbol : dist[v]) +
            ") because it is shorter."
        );
        this.cmd("Step");
      }

      this.highlightCodeLine(19);
      this.highlightEdge(u, v, false);
      this.cmd("Step");
    }

    this.highlightCodeLine(20);
    this.cmd(
      "SetText",
      this.statusID,
      "Completed processing vertex " +
        DijkstraVisualization.VERTEX_DATA[u].label +
        "."
    );
    this.cmd("Step");
  }

  this.highlightCodeLine(21);
  this.cmd("SetText", this.statusID, "Dijkstra computation complete.");
  this.cmd("Step");
  this.highlightCodeLine(22);
  this.cmd("Step");

  this.highlightCodeLine(-1);

  return this.commands;
};

DijkstraVisualization.prototype.resetTableState = function () {
  for (var i = 0; i < this.knownCellIDs.length; i++) {
    this.cmd("SetText", this.knownCellIDs[i], "F");
    this.cmd("SetBackgroundColor", this.knownCellIDs[i], "#ffffff");
  }
  for (var j = 0; j < this.distanceCellIDs.length; j++) {
    this.cmd("SetText", this.distanceCellIDs[j], this.infinitySymbol);
    this.cmd("SetBackgroundColor", this.distanceCellIDs[j], "#ffffff");
  }
  for (var k = 0; k < this.parentCellIDs.length; k++) {
    this.cmd("SetText", this.parentCellIDs[k], "-");
    this.cmd("SetBackgroundColor", this.parentCellIDs[k], "#ffffff");
  }
};

DijkstraVisualization.prototype.resetGraphState = function () {
  for (var i = 0; i < this.vertexIDs.length; i++) {
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[i],
      DijkstraVisualization.NODE_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[i],
      DijkstraVisualization.NODE_TEXT_COLOR
    );
  }

  for (var key in this.edgeMap) {
    if (this.edgeMap.hasOwnProperty(key)) {
      var edge = this.edgeMap[key];
      this.cmd(
        "SetEdgeColor",
        this.vertexIDs[edge.from],
        this.vertexIDs[edge.to],
        DijkstraVisualization.EDGE_COLOR
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

DijkstraVisualization.prototype.updateDistanceCell = function (
  index,
  value,
  highlight
) {
  this.cmd("SetText", this.distanceCellIDs[index], value);
  if (highlight) {
    this.cmd(
      "SetBackgroundColor",
      this.distanceCellIDs[index],
      DijkstraVisualization.TABLE_HIGHLIGHT_COLOR
    );
  } else {
    this.cmd("SetBackgroundColor", this.distanceCellIDs[index], "#ffffff");
  }
};

DijkstraVisualization.prototype.updateParentCell = function (
  index,
  parentIndex,
  highlight
) {
  var parentLabel = parentIndex === -1
    ? "-"
    : DijkstraVisualization.VERTEX_DATA[parentIndex].label;
  var shouldHighlight = highlight;
  if (typeof shouldHighlight !== "boolean") {
    shouldHighlight = true;
  }
  this.cmd("SetText", this.parentCellIDs[index], parentLabel);
  this.cmd(
    "SetBackgroundColor",
    this.parentCellIDs[index],
    shouldHighlight ? DijkstraVisualization.TABLE_HIGHLIGHT_COLOR : "#ffffff"
  );
};

DijkstraVisualization.prototype.setKnownCell = function (index, known) {
  this.cmd("SetText", this.knownCellIDs[index], known ? "T" : "F");
  this.cmd(
    "SetBackgroundColor",
    this.knownCellIDs[index],
    known ? DijkstraVisualization.TABLE_HIGHLIGHT_COLOR : "#ffffff"
  );
};

DijkstraVisualization.prototype.highlightVertex = function (
  index,
  color,
  visited
) {
  this.cmd("SetBackgroundColor", this.vertexIDs[index], color);
  if (visited) {
    this.cmd(
      "SetTextColor",
      this.vertexIDs[index],
      DijkstraVisualization.NODE_VISITED_TEXT_COLOR
    );
  }
};

DijkstraVisualization.prototype.highlightEdge = function (from, to, active) {
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
      ? DijkstraVisualization.EDGE_HIGHLIGHT_COLOR
      : DijkstraVisualization.EDGE_COLOR
  );
};

DijkstraVisualization.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

DijkstraVisualization.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new DijkstraVisualization(animManag, canvas.width, canvas.height);
}

