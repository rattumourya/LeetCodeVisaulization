// Custom visualization for the Floyd-Warshall all-pairs shortest path algorithm.

function FloydWarshallVisualization(am, w, h) {
  this.init(am, w, h);
}

FloydWarshallVisualization.prototype = new Algorithm();
FloydWarshallVisualization.prototype.constructor = FloydWarshallVisualization;
FloydWarshallVisualization.superclass = Algorithm.prototype;

FloydWarshallVisualization.CANVAS_WIDTH = 720;
FloydWarshallVisualization.CANVAS_HEIGHT = 1280;

FloydWarshallVisualization.TITLE_Y = 60;
FloydWarshallVisualization.TITLE_FONT = "bold 34";
FloydWarshallVisualization.TITLE_COLOR = "#102a43";

FloydWarshallVisualization.INFO_PRIMARY_Y = 130;
FloydWarshallVisualization.INFO_SECONDARY_Y = 168;
FloydWarshallVisualization.INFO_FONT = "bold 20";
FloydWarshallVisualization.INFO_DETAIL_FONT = "bold 18";
FloydWarshallVisualization.INFO_PRIMARY_COLOR = "#1a237e";
FloydWarshallVisualization.INFO_DETAIL_COLOR = "#0d1b2a";
FloydWarshallVisualization.INFO_MUTED_COLOR = "#5f6c80";

FloydWarshallVisualization.NODE_RADIUS = 28;
FloydWarshallVisualization.NODE_COLOR = "#f6f7fb";
FloydWarshallVisualization.NODE_BORDER_COLOR = "#283593";
FloydWarshallVisualization.NODE_TEXT_COLOR = "#0d1b2a";
FloydWarshallVisualization.NODE_ACTIVE_COLOR = "#ffe082";

FloydWarshallVisualization.EDGE_COLOR = "#424874";
FloydWarshallVisualization.EDGE_ACTIVE_COLOR = "#ff7043";
FloydWarshallVisualization.EDGE_THICKNESS = 3;
FloydWarshallVisualization.EDGE_HIGHLIGHT_THICKNESS = 4;
FloydWarshallVisualization.EDGE_WEIGHT_COLOR = "#1d4ed8";
FloydWarshallVisualization.EDGE_DIRECT_PATH_COLOR = "#0d1b2a";
FloydWarshallVisualization.EDGE_K_PATH_COLOR = "#4a148c";
FloydWarshallVisualization.EDGE_SHORTEST_PATH_COLOR = "#2e7d32";

FloydWarshallVisualization.MATRIX_TOP_Y = 660;
FloydWarshallVisualization.MATRIX_LEFT_X = 120;
FloydWarshallVisualization.MATRIX_CELL_WIDTH = 90;
FloydWarshallVisualization.MATRIX_CELL_HEIGHT = 50;
FloydWarshallVisualization.MATRIX_ROW_GAP = 6;
FloydWarshallVisualization.MATRIX_COLUMN_GAP = 8;
FloydWarshallVisualization.MATRIX_HEADER_FONT = "bold 20";
FloydWarshallVisualization.MATRIX_CELL_FONT = "bold 18";
FloydWarshallVisualization.MATRIX_HEADER_COLOR = "#1a237e";
FloydWarshallVisualization.MATRIX_CELL_BORDER_COLOR = "#1a237e";
FloydWarshallVisualization.MATRIX_CELL_TEXT_COLOR = "#102a43";
FloydWarshallVisualization.MATRIX_CELL_BACKGROUND = "#ffebcd";
FloydWarshallVisualization.MATRIX_CELL_HIGHLIGHT = "#ffecb3";
FloydWarshallVisualization.MATRIX_CELL_UPDATE = "#c8e6c9";
FloydWarshallVisualization.MATRIX_HEADER_HIGHLIGHT = "#d81b60";
FloydWarshallVisualization.MATRIX_BORDER_THICKNESS = 2;

FloydWarshallVisualization.MARKER_FONT = "bold 20";
FloydWarshallVisualization.MARKER_COLOR_I = "#0d47a1";
FloydWarshallVisualization.MARKER_COLOR_J = "#0d47a1";
FloydWarshallVisualization.MARKER_COLOR_K = "#4a148c";
FloydWarshallVisualization.MARKER_TRACK_GAP = 44;
FloydWarshallVisualization.MARKER_J_VERTICAL_OFFSET =
  FloydWarshallVisualization.MARKER_TRACK_GAP;
FloydWarshallVisualization.MARKER_K_VERTICAL_OFFSET =
  FloydWarshallVisualization.MARKER_TRACK_GAP * 2;
FloydWarshallVisualization.ROW_HEADER_EXTRA_GAP = 16;
FloydWarshallVisualization.I_TRACK_OFFSET =
  FloydWarshallVisualization.MARKER_TRACK_GAP;

FloydWarshallVisualization.VERTEX_COUNT = 5;

FloydWarshallVisualization.TEMPLATE_ALLOWED = [
  [false, true, true, false, true],
  [false, false, true, true, true],
  [false, false, false, true, true],
  [true, false, false, false, true],
  [true, true, false, false, false],
];

FloydWarshallVisualization.TEMPLATE_BASE_EDGE_PERCENT = 0.45;
FloydWarshallVisualization.TEMPLATE_EXTRA_EDGE_PERCENT = 0.35;

FloydWarshallVisualization.RANDOM_WEIGHT_MIN = 1;
FloydWarshallVisualization.RANDOM_WEIGHT_MAX = 9;

FloydWarshallVisualization.SINGLE_EDGE_CURVE = 0;
FloydWarshallVisualization.BIDIRECTIONAL_EDGE_CURVE = 0.56;
FloydWarshallVisualization.PARALLEL_EDGE_GAP = 0.12;
FloydWarshallVisualization.LOOP_EDGE_CURVE = 0.52;

FloydWarshallVisualization.CODE_START_Y = 1040;
FloydWarshallVisualization.CODE_LEFT_X =
  FloydWarshallVisualization.MATRIX_LEFT_X;
FloydWarshallVisualization.CODE_LINE_HEIGHT = 18;
FloydWarshallVisualization.CODE_FONT = "bold 15px 'Courier New', monospace";
FloydWarshallVisualization.CODE_HIGHLIGHT_FONT =
  "bold 17px 'Courier New', monospace";
FloydWarshallVisualization.CODE_STANDARD_COLOR = "#102a43";
FloydWarshallVisualization.CODE_HIGHLIGHT_COLOR = "#d81b60";
FloydWarshallVisualization.CODE_MATRIX_GAP = 120;

FloydWarshallVisualization.INFINITY_SYMBOL = "\u221E";

FloydWarshallVisualization.DEFAULT_VERTEX_DATA = [
  { label: "A", x: 160, y: 360 },
  { label: "B", x: 360, y: 240 },
  { label: "C", x: 560, y: 360 },
  { label: "D", x: 460, y: 540 },
  { label: "E", x: 260, y: 540 },
];

FloydWarshallVisualization.DEFAULT_GRAPH_EDGES = [
  [
    { to: 1, weight: 3 },
    { to: 2, weight: 7 },
    { to: 4, weight: 4 },
  ],
  [
    { to: 2, weight: 2 },
    { to: 3, weight: 5 },
  ],
  [
    { to: 3, weight: 1 },
    { to: 4, weight: 6 },
  ],
  [
    { to: 0, weight: 8 },
  ],
  [
    { to: 0, weight: 5 },
    { to: 1, weight: 4 },
  ],
];

FloydWarshallVisualization.CODE_LINES = [
  ["void floydWarshall(int[][] dist) {"],
  ["  for (int k = 0; k < n; k++) {"],
  ["    for (int i = 0; i < n; i++) {"],
  ["      for (int j = 0; j < n; j++) {"],
  ["        if (dist[i][k] + dist[k][j] < dist[i][j]) {"],
  ["          dist[i][j] = dist[i][k] + dist[k][j];"],
  ["        }"],
  ["      }"],
  ["    }"],
  ["  }"],
  ["}"],
];

FloydWarshallVisualization.prototype.init = function (am, w, h) {
  FloydWarshallVisualization.superclass.init.call(this, am, w, h);

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

  this.vertexData = this.cloneVertexData(
    FloydWarshallVisualization.DEFAULT_VERTEX_DATA
  );
  this.graphEdges = this.cloneGraphEdges(
    FloydWarshallVisualization.DEFAULT_GRAPH_EDGES
  );

  this.infinitySymbol = FloydWarshallVisualization.INFINITY_SYMBOL;

  this.implementAction(this.reset.bind(this), 0);
};

FloydWarshallVisualization.prototype.addControls = function () {
  this.runButton = addControlToAlgorithmBar(
    "Button",
    "Run Floyd-Warshall"
  );
  this.runButton.onclick = this.runCallback.bind(this);

  this.newGraphButton = addControlToAlgorithmBar("Button", "New Graph");
  this.newGraphButton.onclick = this.newGraphCallback.bind(this);

  this.resetButton = addControlToAlgorithmBar("Button", "Reset Layout");
  this.resetButton.onclick = this.resetCallback.bind(this);

  this.controls.push(this.runButton, this.newGraphButton, this.resetButton);
};

FloydWarshallVisualization.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

FloydWarshallVisualization.prototype.runCallback = function () {
  this.implementAction(this.runAlgorithm.bind(this), 0);
};

FloydWarshallVisualization.prototype.newGraphCallback = function () {
  this.implementAction(this.newGraph.bind(this), 0);
};

FloydWarshallVisualization.prototype.newGraph = function () {
  this.generateRandomGraphData();
  return this.reset();
};

FloydWarshallVisualization.prototype.reset = function () {
  this.nextIndex = 0;
  this.vertexIDs = [];
  this.edgeMap = {};
  this.edgeCurves = {};
  this.matrixCellIDs = [];
  this.rowHeaderIDs = [];
  this.columnHeaderIDs = [];
  this.rowHeaderPositions = [];
  this.columnHeaderPositions = [];
  this.matrixBottomY = 0;
  this.codeID = [];
  this.currentCodeLine = -1;
  this.infoPrimaryID = -1;
  this.infoDetailID = -1;
  this.calculationID = -1;
  this.distances = [];
  this.initialDistances = [];
  this.iMarkerID = -1;
  this.jMarkerID = -1;
  this.kMarkerID = -1;
  this.iMarkerX = 0;
  this.jMarkerY = 0;
  this.kMarkerY = 0;
  this.activeEdgeHighlights = {};
  this.nextMatrix = [];
  this.initialNextMatrix = [];

  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }

  return this.setup();
};

FloydWarshallVisualization.prototype.generateRandomGraphData = function () {
  var vertexCount = FloydWarshallVisualization.VERTEX_COUNT;
  var templateVertices = this.cloneVertexData(
    FloydWarshallVisualization.DEFAULT_VERTEX_DATA
  );
  if (templateVertices.length > vertexCount) {
    templateVertices.length = vertexCount;
  }
  this.vertexData = templateVertices;

  var allowed = FloydWarshallVisualization.TEMPLATE_ALLOWED;

  var shuffle = function (array) {
    for (var idx = array.length - 1; idx > 0; idx--) {
      var swap = Math.floor(Math.random() * (idx + 1));
      var temp = array[idx];
      array[idx] = array[swap];
      array[swap] = temp;
    }
  };

  var isDirectionAllowed = function (from, to) {
    return !!(allowed[from] && allowed[from][to]);
  };

  var isPairAllowed = function (a, b) {
    return isDirectionAllowed(a, b) || isDirectionAllowed(b, a);
  };

  var pairKey = function (a, b) {
    return a < b ? a + "-" + b : b + "-" + a;
  };

  var baseEdges = [];
  var usedPairs = {};

  var tryAddBaseEdge = function (a, b) {
    if (a === b || !isPairAllowed(a, b)) {
      return false;
    }
    var key = pairKey(a, b);
    if (usedPairs[key]) {
      return false;
    }
    var min = Math.min(a, b);
    var max = Math.max(a, b);
    baseEdges.push({ u: min, v: max });
    usedPairs[key] = true;
    return true;
  };

  for (var vertex = 1; vertex < vertexCount; vertex++) {
    var neighbors = [];
    for (var candidate = 0; candidate < vertexCount; candidate++) {
      if (candidate === vertex || !isPairAllowed(vertex, candidate)) {
        continue;
      }
      neighbors.push(candidate);
    }
    if (neighbors.length === 0) {
      continue;
    }
    shuffle(neighbors);
    for (var n = 0; n < neighbors.length; n++) {
      if (tryAddBaseEdge(vertex, neighbors[n])) {
        break;
      }
    }
  }

  var baseEdgePercent = FloydWarshallVisualization.TEMPLATE_BASE_EDGE_PERCENT;
  for (var i = 0; i < vertexCount; i++) {
    for (var j = i + 1; j < vertexCount; j++) {
      if (!isPairAllowed(i, j) || usedPairs[pairKey(i, j)]) {
        continue;
      }
      if (Math.random() <= baseEdgePercent) {
        tryAddBaseEdge(i, j);
      }
    }
  }

  var directedEdges = [];
  var directedMap = {};
  var incidentEdges = new Array(vertexCount);
  var outDegree = new Array(vertexCount);
  for (var init = 0; init < vertexCount; init++) {
    incidentEdges[init] = [];
    outDegree[init] = 0;
  }

  var baseRecords = new Array(baseEdges.length);
  for (var b = 0; b < baseEdges.length; b++) {
    var edge = baseEdges[b];
    var forwardAllowed = isDirectionAllowed(edge.u, edge.v);
    var backwardAllowed = isDirectionAllowed(edge.v, edge.u);
    if (!forwardAllowed && !backwardAllowed) {
      continue;
    }
    var from = edge.u;
    var to = edge.v;
    if (forwardAllowed && backwardAllowed) {
      if (Math.random() < 0.5) {
        from = edge.u;
        to = edge.v;
      } else {
        from = edge.v;
        to = edge.u;
      }
    } else if (forwardAllowed) {
      from = edge.u;
      to = edge.v;
    } else {
      from = edge.v;
      to = edge.u;
    }

    var record = {
      from: from,
      to: to,
      min: Math.min(edge.u, edge.v),
      max: Math.max(edge.u, edge.v),
    };
    directedEdges.push(record);
    baseRecords[b] = record;
    directedMap[from + "->" + to] = true;
    outDegree[from]++;
    incidentEdges[edge.u].push(b);
    incidentEdges[edge.v].push(b);
  }

  for (var ensureVertex = 0; ensureVertex < vertexCount; ensureVertex++) {
    if (outDegree[ensureVertex] === 0 && incidentEdges[ensureVertex].length > 0) {
      var candidates = incidentEdges[ensureVertex].slice();
      shuffle(candidates);
      for (
        var opt = 0;
        opt < candidates.length && outDegree[ensureVertex] === 0;
        opt++
      ) {
        var idx = candidates[opt];
        var record = baseRecords[idx];
        if (!record) {
          continue;
        }
        var other = record.min === ensureVertex ? record.max : record.min;
        if (!isDirectionAllowed(ensureVertex, other)) {
          continue;
        }
        var newKey = ensureVertex + "->" + other;
        if (directedMap[newKey]) {
          continue;
        }
        var oldKey = record.from + "->" + record.to;
        delete directedMap[oldKey];
        outDegree[record.from]--;
        record.from = ensureVertex;
        record.to = other;
        directedMap[newKey] = true;
        outDegree[ensureVertex]++;
      }
    }
  }

  for (var ensure = 0; ensure < vertexCount; ensure++) {
    if (outDegree[ensure] === 0 && allowed[ensure]) {
      var extraNeighbors = [];
      for (var target = 0; target < vertexCount; target++) {
        if (target === ensure || !isDirectionAllowed(ensure, target)) {
          continue;
        }
        extraNeighbors.push(target);
      }
      shuffle(extraNeighbors);
      for (var en = 0; en < extraNeighbors.length; en++) {
        var neighbor = extraNeighbors[en];
        var ensureKey = ensure + "->" + neighbor;
        if (directedMap[ensureKey]) {
          continue;
        }
        directedEdges.push({
          from: ensure,
          to: neighbor,
          min: Math.min(ensure, neighbor),
          max: Math.max(ensure, neighbor),
        });
        directedMap[ensureKey] = true;
        outDegree[ensure]++;
        break;
      }
    }
  }

  var extraPercent = FloydWarshallVisualization.TEMPLATE_EXTRA_EDGE_PERCENT;
  for (var fromVertex = 0; fromVertex < vertexCount; fromVertex++) {
    if (!allowed[fromVertex]) {
      continue;
    }
    for (var toVertex = 0; toVertex < vertexCount; toVertex++) {
      if (
        fromVertex === toVertex ||
        !isDirectionAllowed(fromVertex, toVertex)
      ) {
        continue;
      }
      var dirKey = fromVertex + "->" + toVertex;
      if (directedMap[dirKey]) {
        continue;
      }
      if (Math.random() <= extraPercent) {
        directedEdges.push({
          from: fromVertex,
          to: toVertex,
          min: Math.min(fromVertex, toVertex),
          max: Math.max(fromVertex, toVertex),
        });
        directedMap[dirKey] = true;
        outDegree[fromVertex]++;
      }
    }
  }

  var adjacency = new Array(vertexCount);
  for (var a = 0; a < vertexCount; a++) {
    adjacency[a] = [];
  }

  for (var d = 0; d < directedEdges.length; d++) {
    var entry = directedEdges[d];
    this.addDirectedEdge(
      adjacency,
      entry.from,
      entry.to,
      this.randomWeight()
    );
  }

  for (var list = 0; list < adjacency.length; list++) {
    adjacency[list].sort(function (a, b) {
      return a.to - b.to;
    });
  }

  this.graphEdges = adjacency;
};

FloydWarshallVisualization.prototype.randomWeight = function () {
  var min = FloydWarshallVisualization.RANDOM_WEIGHT_MIN;
  var max = FloydWarshallVisualization.RANDOM_WEIGHT_MAX;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

FloydWarshallVisualization.prototype.addDirectedEdge = function (
  edges,
  from,
  to,
  weight
) {
  if (!edges[from]) {
    edges[from] = [];
  }
  for (var i = 0; i < edges[from].length; i++) {
    if (edges[from][i].to === to) {
      edges[from][i].weight = weight;
      return;
    }
  }
  edges[from].push({ to: to, weight: weight });
};

FloydWarshallVisualization.prototype.edgeExists = function (
  edges,
  from,
  to
) {
  if (!edges[from]) {
    return false;
  }
  for (var i = 0; i < edges[from].length; i++) {
    if (edges[from][i].to === to) {
      return true;
    }
  }
  return false;
};

FloydWarshallVisualization.prototype.cloneVertexData = function (data) {
  var clone = new Array(data.length);
  for (var i = 0; i < data.length; i++) {
    var vertex = data[i];
    clone[i] = { label: vertex.label, x: vertex.x, y: vertex.y };
  }
  return clone;
};

FloydWarshallVisualization.prototype.cloneGraphEdges = function (edges) {
  var clone = new Array(edges.length);
  for (var i = 0; i < edges.length; i++) {
    clone[i] = [];
    for (var j = 0; j < edges[i].length; j++) {
      var edge = edges[i][j];
      clone[i].push({ to: edge.to, weight: edge.weight });
    }
  }
  return clone;
};

FloydWarshallVisualization.prototype.setup = function () {
  this.commands = [];

  this.createTitle();
  this.createInfoPanel();
  this.createGraph();
  this.createMatrix();
  this.createCodeDisplay();
  this.highlightCodeLine(-1);
  this.setInfoTexts(
    "Click 'Run Floyd-Warshall' to start the animation.",
    ""
  );

  this.cmd("Step");
  return this.commands;
};

FloydWarshallVisualization.prototype.createTitle = function () {
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Floyd-Warshall All-Pairs Shortest Paths",
    FloydWarshallVisualization.CANVAS_WIDTH / 2,
    FloydWarshallVisualization.TITLE_Y,
    1
  );
  this.cmd(
    "SetTextStyle",
    this.titleID,
    FloydWarshallVisualization.TITLE_FONT
  );
  this.cmd("SetForegroundColor", this.titleID, FloydWarshallVisualization.TITLE_COLOR);
};

FloydWarshallVisualization.prototype.createInfoPanel = function () {
  this.infoPrimaryID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoPrimaryID,
    "",
    FloydWarshallVisualization.CANVAS_WIDTH / 2,
    FloydWarshallVisualization.INFO_PRIMARY_Y,
    1
  );
  this.cmd(
    "SetTextStyle",
    this.infoPrimaryID,
    FloydWarshallVisualization.INFO_FONT
  );
  this.cmd(
    "SetForegroundColor",
    this.infoPrimaryID,
    FloydWarshallVisualization.INFO_PRIMARY_COLOR
  );

  this.infoDetailID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoDetailID,
    "",
    FloydWarshallVisualization.CANVAS_WIDTH / 2,
    FloydWarshallVisualization.INFO_SECONDARY_Y,
    1
  );
  this.cmd(
    "SetTextStyle",
    this.infoDetailID,
    FloydWarshallVisualization.INFO_DETAIL_FONT
  );
  this.cmd(
    "SetForegroundColor",
    this.infoDetailID,
    FloydWarshallVisualization.INFO_DETAIL_COLOR
  );
};

FloydWarshallVisualization.prototype.edgeKey = function (from, to) {
  return from + "-" + to;
};

FloydWarshallVisualization.prototype.createGraph = function () {
  var vertexData = this.vertexData ||
    FloydWarshallVisualization.DEFAULT_VERTEX_DATA;
  this.vertexIDs = new Array(vertexData.length);

  for (var i = 0; i < vertexData.length; i++) {
    var id = this.nextIndex++;
    this.vertexIDs[i] = id;
    var vertex = vertexData[i];
    this.cmd("CreateCircle", id, vertex.label, vertex.x, vertex.y, FloydWarshallVisualization.NODE_RADIUS);
    this.cmd("SetBackgroundColor", id, FloydWarshallVisualization.NODE_COLOR);
    this.cmd("SetForegroundColor", id, FloydWarshallVisualization.NODE_BORDER_COLOR);
    this.cmd("SetTextColor", id, FloydWarshallVisualization.NODE_TEXT_COLOR);
    this.cmd("SetHighlight", id, 0);
  }

  this.edgeMap = {};
  var vertexCount = vertexData.length;
  var edgesData = this.graphEdges ||
    FloydWarshallVisualization.DEFAULT_GRAPH_EDGES;
  this.edgeCurves = this.computeEdgeCurves(edgesData, vertexCount);
  for (var from = 0; from < edgesData.length; from++) {
    var edges = edgesData[from];
    if (!edges) {
      continue;
    }
    for (var j = 0; j < edges.length; j++) {
      var edge = edges[j];
      var curveKey = this.edgeKey(from, edge.to);
      var curve =
        Object.prototype.hasOwnProperty.call(this.edgeCurves, curveKey)
          ? this.edgeCurves[curveKey]
          : 0;
      this.edgeMap[curveKey] = {
        from: from,
        to: edge.to,
        weight: edge.weight,
        curve: curve,
      };
      this.cmd(
        "Connect",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        FloydWarshallVisualization.EDGE_COLOR,
        curve,
        1,
        String(edge.weight)
      );
      this.cmd(
        "SetEdgeThickness",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        FloydWarshallVisualization.EDGE_THICKNESS
      );
      this.cmd(
        "SetEdgeTextColor",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        FloydWarshallVisualization.EDGE_WEIGHT_COLOR
      );
    }
  }
};

FloydWarshallVisualization.prototype.setEdgeHighlight = function (
  from,
  to,
  active,
  colorOverride,
  thicknessOverride
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
  var key = this.edgeKey(from, to);
  var edgeInfo = this.edgeMap[key];
  if (!edgeInfo) {
    return;
  }
  var fromID = this.vertexIDs[from];
  var toID = this.vertexIDs[to];
  if (typeof fromID === "undefined" || typeof toID === "undefined") {
    return;
  }
  var color = active
    ? colorOverride || FloydWarshallVisualization.EDGE_ACTIVE_COLOR
    : FloydWarshallVisualization.EDGE_COLOR;
  var thickness = active
    ? thicknessOverride || FloydWarshallVisualization.EDGE_HIGHLIGHT_THICKNESS
    : FloydWarshallVisualization.EDGE_THICKNESS;
  this.cmd("SetEdgeColor", fromID, toID, color);
  this.cmd("SetEdgeThickness", fromID, toID, thickness);
  if (!this.activeEdgeHighlights) {
    this.activeEdgeHighlights = {};
  }
  if (active) {
    this.activeEdgeHighlights[key] = true;
  } else {
    delete this.activeEdgeHighlights[key];
  }
};

FloydWarshallVisualization.prototype.clearEdgeHighlights = function () {
  if (!this.activeEdgeHighlights) {
    this.activeEdgeHighlights = {};
    return;
  }
  for (var key in this.activeEdgeHighlights) {
    if (!Object.prototype.hasOwnProperty.call(this.activeEdgeHighlights, key)) {
      continue;
    }
    var parts = key.split("-");
    if (parts.length !== 2) {
      continue;
    }
    var from = parseInt(parts[0], 10);
    var to = parseInt(parts[1], 10);
    if (isNaN(from) || isNaN(to)) {
      continue;
    }
    this.setEdgeHighlight(from, to, false);
  }
  this.activeEdgeHighlights = {};
};

FloydWarshallVisualization.prototype.computeEdgeCurves = function (
  edgesData,
  vertexCount
) {
  var curves = {};
  if (!edgesData || vertexCount <= 0) {
    return curves;
  }

  var pairBuckets = {};

  for (var from = 0; from < vertexCount; from++) {
    var edges = edgesData[from];
    if (!edges) {
      continue;
    }
    for (var j = 0; j < edges.length; j++) {
      var edge = edges[j];
      if (!edge || edge.to < 0 || edge.to >= vertexCount) {
        continue;
      }
      var pairKey;
      if (edge.to === from) {
        pairKey = from + "-" + edge.to + "-loop";
      } else {
        var min = Math.min(from, edge.to);
        var max = Math.max(from, edge.to);
        pairKey = min + "-" + max;
      }
      if (!pairBuckets[pairKey]) {
        pairBuckets[pairKey] = [];
      }
      pairBuckets[pairKey].push({ from: from, to: edge.to });
    }
  }

  var parallelGap = FloydWarshallVisualization.PARALLEL_EDGE_GAP;
  var singleMagnitude = FloydWarshallVisualization.SINGLE_EDGE_CURVE;
  var bidirectionalMagnitude =
    FloydWarshallVisualization.BIDIRECTIONAL_EDGE_CURVE;
  var loopMagnitude = FloydWarshallVisualization.LOOP_EDGE_CURVE;

  var assignCurves = function (list, baseMagnitude, directionSign) {
    if (!list || list.length === 0) {
      return;
    }
    list.sort(function (a, b) {
      if (a.from === b.from) {
        return a.to - b.to;
      }
      return a.from - b.from;
    });
    for (var idx = 0; idx < list.length; idx++) {
      var entry = list[idx];
      var curveValue = directionSign * (baseMagnitude + idx * parallelGap);
      curves[entry.from + "-" + entry.to] = curveValue;
    }
  };

  for (var key in pairBuckets) {
    if (!Object.prototype.hasOwnProperty.call(pairBuckets, key)) {
      continue;
    }
    var group = pairBuckets[key];
    if (!group || group.length === 0) {
      continue;
    }

    var forward = [];
    var backward = [];
    var loops = [];

    for (var index = 0; index < group.length; index++) {
      var entry = group[index];
      if (!entry) {
        continue;
      }
      if (entry.from === entry.to) {
        loops.push(entry);
      } else if (entry.from < entry.to) {
        forward.push(entry);
      } else {
        backward.push(entry);
      }
    }

    if (loops.length > 0) {
      assignCurves(loops, loopMagnitude, 1);
      continue;
    }

    if (forward.length > 0 && backward.length > 0) {
      assignCurves(forward, bidirectionalMagnitude, 1);
      assignCurves(backward, bidirectionalMagnitude, -1);
    } else {
      var singleList = forward.length > 0 ? forward : backward;
      var sign = forward.length > 0 ? 1 : -1;
      assignCurves(singleList, singleMagnitude, sign);
    }
  }

  return curves;
};

FloydWarshallVisualization.prototype.createMatrix = function () {
  var vertexData = this.vertexData ||
    FloydWarshallVisualization.DEFAULT_VERTEX_DATA;
  var n = vertexData.length;
  this.matrixCellIDs = new Array(n);
  this.rowHeaderIDs = new Array(n);
  this.columnHeaderIDs = new Array(n);
  this.rowHeaderPositions = new Array(n);
  this.columnHeaderPositions = new Array(n);

  var rowHeight = FloydWarshallVisualization.MATRIX_CELL_HEIGHT;
  var colWidth = FloydWarshallVisualization.MATRIX_CELL_WIDTH;
  var columnGap = FloydWarshallVisualization.MATRIX_COLUMN_GAP;
  var rowGap = FloydWarshallVisualization.MATRIX_ROW_GAP;
  var top = FloydWarshallVisualization.MATRIX_TOP_Y;
  var left = FloydWarshallVisualization.MATRIX_LEFT_X;
  var columnSpacing = colWidth + columnGap;
  var rowSpacing = rowHeight + rowGap;
  var matrixWidth = columnSpacing * n;
  var matrixHeight = rowSpacing * n;
  var matrixCenterX = left + matrixWidth / 2;
  var matrixCenterY = top + matrixHeight / 2;
  var rowHeaderX =
    left - columnSpacing / 2 - FloydWarshallVisualization.ROW_HEADER_EXTRA_GAP;

  var hasMatrix = n > 0;
  var jTrackGap = FloydWarshallVisualization.MARKER_J_VERTICAL_OFFSET;
  var kTrackGap = FloydWarshallVisualization.MARKER_K_VERTICAL_OFFSET;
  var jTrackY = hasMatrix ? top - jTrackGap : top;
  var kTrackY = hasMatrix ? top - kTrackGap : top;
  var iTrackX = hasMatrix
    ? rowHeaderX - FloydWarshallVisualization.I_TRACK_OFFSET
    : rowHeaderX;

  this.iMarkerX = iTrackX;
  this.kMarkerY = kTrackY;
  this.jMarkerY = jTrackY;

  var borderThickness = FloydWarshallVisualization.MATRIX_BORDER_THICKNESS;

  for (var c = 0; c < n; c++) {
    var headerID = this.nextIndex++;
    this.columnHeaderIDs[c] = headerID;
    var x = left + (c + 1) * columnSpacing - columnSpacing / 2;
    this.columnHeaderPositions[c] = x;
    this.cmd(
      "CreateLabel",
      headerID,
      vertexData[c].label,
      x,
      top,
      1
    );
    this.cmd(
      "SetTextStyle",
      headerID,
      FloydWarshallVisualization.MATRIX_HEADER_FONT
    );
    this.cmd(
      "SetForegroundColor",
      headerID,
      FloydWarshallVisualization.MATRIX_HEADER_COLOR
    );
  }

  for (var r = 0; r < n; r++) {
    var rowY = top + (r + 1) * rowSpacing;

    var rowHeaderID = this.nextIndex++;
    this.rowHeaderIDs[r] = rowHeaderID;
    this.rowHeaderPositions[r] = { x: rowHeaderX, y: rowY };
    this.cmd(
      "CreateLabel",
      rowHeaderID,
      vertexData[r].label,
      rowHeaderX,
      rowY,
      1
    );
    this.cmd(
      "SetTextStyle",
      rowHeaderID,
      FloydWarshallVisualization.MATRIX_HEADER_FONT
    );
    this.cmd(
      "SetForegroundColor",
      rowHeaderID,
      FloydWarshallVisualization.MATRIX_HEADER_COLOR
    );

    this.matrixCellIDs[r] = new Array(n);
    for (var c = 0; c < n; c++) {
      var cellX = left + (c + 1) * columnSpacing - columnSpacing / 2;
      var cellID = this.nextIndex++;
      this.matrixCellIDs[r][c] = cellID;
      this.cmd(
        "CreateRectangle",
        cellID,
        "",
        colWidth,
        rowHeight,
        cellX,
        rowY
      );
      this.cmd(
        "SetTextStyle",
        cellID,
        FloydWarshallVisualization.MATRIX_CELL_FONT
      );
      this.cmd(
        "SetForegroundColor",
        cellID,
        FloydWarshallVisualization.MATRIX_CELL_BORDER_COLOR
      );
      this.cmd(
        "SetRectangleLineThickness",
        cellID,
        borderThickness
      );
      this.cmd(
        "SetBackgroundColor",
        cellID,
        FloydWarshallVisualization.MATRIX_CELL_BACKGROUND
      );
      this.cmd(
        "SetTextColor",
        cellID,
        FloydWarshallVisualization.MATRIX_CELL_TEXT_COLOR
      );
    }
  }

  this.matrixBottomY = hasMatrix
    ? top + n * rowSpacing + rowHeight / 2
    : top;

  var initialColumnX =
    this.columnHeaderPositions.length > 0
      ? this.columnHeaderPositions[0]
      : left;
  var initialRowY =
    this.rowHeaderPositions.length > 0
      ? this.rowHeaderPositions[0].y
      : top + rowSpacing;

  this.kMarkerID = this.createIndexMarker(
    "k",
    initialColumnX,
    this.kMarkerY,
    FloydWarshallVisualization.MARKER_COLOR_K
  );
  this.jMarkerID = this.createIndexMarker(
    "j",
    initialColumnX,
    this.jMarkerY,
    FloydWarshallVisualization.MARKER_COLOR_J
  );
  this.iMarkerID = this.createIndexMarker(
    "i",
    this.iMarkerX,
    initialRowY,
    FloydWarshallVisualization.MARKER_COLOR_I
  );
  this.hideIndexMarkers();

  this.initialDistances = this.buildInitialDistances();
  this.distances = this.cloneMatrix(this.initialDistances);
  this.initialNextMatrix = this.buildInitialNextMatrix();
  this.nextMatrix = this.cloneMatrix(this.initialNextMatrix);

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      this.cmd(
        "SetText",
        this.matrixCellIDs[i][j],
        this.formatDistance(this.initialDistances[i][j])
      );
    }
  }
};

FloydWarshallVisualization.prototype.createCodeDisplay = function () {
  var startY = FloydWarshallVisualization.CODE_START_Y;
  if (
    typeof this.matrixBottomY === "number" &&
    !isNaN(this.matrixBottomY)
  ) {
    startY = Math.max(
      FloydWarshallVisualization.CODE_START_Y,
      this.matrixBottomY + FloydWarshallVisualization.CODE_MATRIX_GAP
    );
  }

  this.codeID = this.addCodeToCanvasBase(
    FloydWarshallVisualization.CODE_LINES,
    FloydWarshallVisualization.CODE_LEFT_X,
    startY,
    FloydWarshallVisualization.CODE_LINE_HEIGHT,
    FloydWarshallVisualization.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd(
        "SetTextStyle",
        this.codeID[i][j],
        FloydWarshallVisualization.CODE_FONT
      );
    }
  }
};

FloydWarshallVisualization.prototype.createIndexMarker = function (
  label,
  x,
  y,
  color
) {
  var id = this.nextIndex++;
  this.cmd("CreateLabel", id, label, x, y, 1);
  this.cmd(
    "SetTextStyle",
    id,
    FloydWarshallVisualization.MARKER_FONT
  );
  this.cmd(
    "SetForegroundColor",
    id,
    color || FloydWarshallVisualization.MARKER_COLOR_I
  );
  this.cmd("SetAlpha", id, 0);
  return id;
};

FloydWarshallVisualization.prototype.setMarkerVisible = function (
  markerID,
  visible
) {
  if (markerID < 0) {
    return;
  }
  this.cmd("SetAlpha", markerID, visible ? 1 : 0);
};

FloydWarshallVisualization.prototype.hideIndexMarkers = function () {
  this.setMarkerVisible(this.kMarkerID, false);
  this.setMarkerVisible(this.iMarkerID, false);
  this.setMarkerVisible(this.jMarkerID, false);
};

FloydWarshallVisualization.prototype.moveMarkerToColumn = function (
  markerID,
  columnIndex,
  y
) {
  if (
    markerID < 0 ||
    !this.columnHeaderPositions ||
    columnIndex < 0 ||
    columnIndex >= this.columnHeaderPositions.length
  ) {
    return;
  }
  var x = this.columnHeaderPositions[columnIndex];
  this.cmd("Move", markerID, x, y);
};

FloydWarshallVisualization.prototype.moveMarkerToRow = function (
  markerID,
  rowIndex
) {
  if (
    markerID < 0 ||
    !this.rowHeaderPositions ||
    rowIndex < 0 ||
    rowIndex >= this.rowHeaderPositions.length
  ) {
    return;
  }
  var pos = this.rowHeaderPositions[rowIndex];
  this.cmd("Move", markerID, this.iMarkerX, pos.y);
};

FloydWarshallVisualization.prototype.moveKMarker = function (k) {
  if (this.kMarkerID < 0) {
    return;
  }
  this.setMarkerVisible(this.kMarkerID, true);
  this.moveMarkerToColumn(this.kMarkerID, k, this.kMarkerY);
};

FloydWarshallVisualization.prototype.moveIMarker = function (i) {
  if (this.iMarkerID < 0) {
    return;
  }
  this.setMarkerVisible(this.iMarkerID, true);
  this.moveMarkerToRow(this.iMarkerID, i);
};

FloydWarshallVisualization.prototype.moveJMarker = function (j) {
  if (this.jMarkerID < 0) {
    return;
  }
  this.setMarkerVisible(this.jMarkerID, true);
  this.moveMarkerToColumn(this.jMarkerID, j, this.jMarkerY);
};

FloydWarshallVisualization.prototype.highlightCodeLine = function (line) {
  if (this.currentCodeLine !== -1 && this.codeID[this.currentCodeLine]) {
    for (var j = 0; j < this.codeID[this.currentCodeLine].length; j++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[this.currentCodeLine][j],
        FloydWarshallVisualization.CODE_STANDARD_COLOR
      );
      this.cmd(
        "SetTextStyle",
        this.codeID[this.currentCodeLine][j],
        FloydWarshallVisualization.CODE_FONT
      );
    }
  }

  this.currentCodeLine = line;

  if (line >= 0 && this.codeID[line]) {
    for (var k = 0; k < this.codeID[line].length; k++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[line][k],
        FloydWarshallVisualization.CODE_HIGHLIGHT_COLOR
      );
      this.cmd(
        "SetTextStyle",
        this.codeID[line][k],
        FloydWarshallVisualization.CODE_HIGHLIGHT_FONT
      );
    }
  }
};

FloydWarshallVisualization.prototype.buildInitialDistances = function () {
  var vertexData = this.vertexData ||
    FloydWarshallVisualization.DEFAULT_VERTEX_DATA;
  var edges = this.graphEdges ||
    FloydWarshallVisualization.DEFAULT_GRAPH_EDGES;
  var n = vertexData.length;
  var distances = new Array(n);

  for (var i = 0; i < n; i++) {
    distances[i] = new Array(n);
    for (var j = 0; j < n; j++) {
      if (i === j) {
        distances[i][j] = 0;
      } else {
        distances[i][j] = Infinity;
      }
    }
  }

  for (var from = 0; from < edges.length; from++) {
    var outgoing = edges[from];
    if (!outgoing) {
      continue;
    }
    for (var e = 0; e < outgoing.length; e++) {
      var edge = outgoing[e];
      if (edge.to >= 0 && edge.to < n) {
        distances[from][edge.to] = edge.weight;
      }
    }
  }

  return distances;
};

FloydWarshallVisualization.prototype.buildInitialNextMatrix = function () {
  var vertexData = this.vertexData ||
    FloydWarshallVisualization.DEFAULT_VERTEX_DATA;
  var edges = this.graphEdges ||
    FloydWarshallVisualization.DEFAULT_GRAPH_EDGES;
  var n = vertexData.length;
  var next = new Array(n);

  for (var i = 0; i < n; i++) {
    next[i] = new Array(n);
    for (var j = 0; j < n; j++) {
      next[i][j] = i === j ? j : null;
    }
  }

  for (var from = 0; from < edges.length; from++) {
    var outgoing = edges[from];
    if (!outgoing) {
      continue;
    }
    for (var e = 0; e < outgoing.length; e++) {
      var edge = outgoing[e];
      if (edge.to >= 0 && edge.to < n) {
        next[from][edge.to] = edge.to;
      }
    }
  }

  return next;
};

FloydWarshallVisualization.prototype.cloneMatrix = function (matrix) {
  if (!matrix || typeof matrix.length === "undefined") {
    return [];
  }
  var clone = new Array(matrix.length);
  for (var i = 0; i < matrix.length; i++) {
    clone[i] = matrix[i] ? matrix[i].slice() : [];
  }
  return clone;
};

FloydWarshallVisualization.prototype.formatDistance = function (value) {
  if (value === Infinity) {
    return this.infinitySymbol;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return String(value || "");
};

FloydWarshallVisualization.prototype.setInfoTexts = function (
  primary,
  detail
) {
  if (this.infoPrimaryID >= 0) {
    this.cmd("SetText", this.infoPrimaryID, primary || "");
    this.cmd(
      "SetForegroundColor",
      this.infoPrimaryID,
      primary ? FloydWarshallVisualization.INFO_PRIMARY_COLOR : FloydWarshallVisualization.INFO_MUTED_COLOR
    );
  }
  if (this.infoDetailID >= 0) {
    this.cmd("SetText", this.infoDetailID, detail || "");
  }
};

FloydWarshallVisualization.prototype.setVertexActive = function (
  vertex,
  active
) {
  if (vertex < 0 || vertex >= this.vertexIDs.length) {
    return;
  }
  this.cmd(
    "SetBackgroundColor",
    this.vertexIDs[vertex],
    active
      ? FloydWarshallVisualization.NODE_ACTIVE_COLOR
      : FloydWarshallVisualization.NODE_COLOR
  );
};

FloydWarshallVisualization.prototype.updateNextMatrix = function (
  i,
  j,
  k
) {
  if (!this.nextMatrix || !this.nextMatrix[i]) {
    return;
  }
  var nextIK =
    this.nextMatrix[i] && typeof this.nextMatrix[i][k] !== "undefined"
      ? this.nextMatrix[i][k]
      : null;
  var nextKJ =
    this.nextMatrix[k] && typeof this.nextMatrix[k][j] !== "undefined"
      ? this.nextMatrix[k][j]
      : null;
  if (nextIK === null || nextKJ === null) {
    return;
  }
  this.nextMatrix[i][j] = nextIK;
};

FloydWarshallVisualization.prototype.getPathEdges = function (
  start,
  end
) {
  var edges = [];
  if (
    !this.nextMatrix ||
    typeof start !== "number" ||
    typeof end !== "number" ||
    start < 0 ||
    end < 0 ||
    start >= this.nextMatrix.length ||
    end >= this.nextMatrix.length ||
    start === end
  ) {
    return edges;
  }

  if (!this.nextMatrix[start]) {
    return edges;
  }

  var steps = 0;
  var maxSteps = this.nextMatrix.length * this.nextMatrix.length;
  var current = start;

  while (current !== end && steps < maxSteps) {
    if (!this.nextMatrix[current]) {
      return [];
    }
    var nextVertex = this.nextMatrix[current][end];
    if (nextVertex === null || typeof nextVertex === "undefined") {
      return [];
    }
    edges.push({ from: current, to: nextVertex });
    if (nextVertex === end) {
      break;
    }
    if (nextVertex === current) {
      return [];
    }
    current = nextVertex;
    steps++;
  }

  if (current !== end) {
    return [];
  }

  return edges;
};

FloydWarshallVisualization.prototype.highlightEdgeList = function (
  edgeList,
  color
) {
  if (!edgeList || edgeList.length === 0) {
    return;
  }
  var seen = {};
  for (var idx = 0; idx < edgeList.length; idx++) {
    var edge = edgeList[idx];
    if (!edge) {
      continue;
    }
    var from = edge.from;
    var to = edge.to;
    if (typeof from !== "number" || typeof to !== "number") {
      continue;
    }
    var key = from + "-" + to;
    if (seen[key]) {
      continue;
    }
    seen[key] = true;
    this.setEdgeHighlight(
      from,
      to,
      true,
      color,
      FloydWarshallVisualization.EDGE_HIGHLIGHT_THICKNESS
    );
  }
};

FloydWarshallVisualization.prototype.highlightCandidatePaths = function (
  i,
  k,
  j,
  distIK,
  distKJ
) {
  if (
    typeof distIK === "undefined" ||
    distIK === null
  ) {
    distIK = this.distances && this.distances[i]
      ? this.distances[i][k]
      : Infinity;
  }
  if (
    typeof distKJ === "undefined" ||
    distKJ === null
  ) {
    distKJ = this.distances && this.distances[k]
      ? this.distances[k][j]
      : Infinity;
  }

  if (distIK !== Infinity && distKJ !== Infinity) {
    var viaEdges = this.getPathEdges(i, k).concat(this.getPathEdges(k, j));
    this.highlightEdgeList(
      viaEdges,
      FloydWarshallVisualization.EDGE_K_PATH_COLOR
    );
  }

  var directEdges = this.getPathEdges(i, j);
  this.highlightEdgeList(
    directEdges,
    FloydWarshallVisualization.EDGE_DIRECT_PATH_COLOR
  );
};

FloydWarshallVisualization.prototype.highlightShortestPath = function (
  i,
  j
) {
  var shortestEdges = this.getPathEdges(i, j);
  this.highlightEdgeList(
    shortestEdges,
    FloydWarshallVisualization.EDGE_SHORTEST_PATH_COLOR
  );
};

FloydWarshallVisualization.prototype.setHeaderHighlight = function (
  headerArray,
  index,
  active
) {
  if (!headerArray || index < 0 || index >= headerArray.length) {
    return;
  }
  this.cmd(
    "SetForegroundColor",
    headerArray[index],
    active
      ? FloydWarshallVisualization.MATRIX_HEADER_HIGHLIGHT
      : FloydWarshallVisualization.MATRIX_HEADER_COLOR
  );
};

FloydWarshallVisualization.prototype.highlightMatrixCell = function (
  row,
  col,
  background
) {
  if (
    row < 0 ||
    row >= this.matrixCellIDs.length ||
    col < 0 ||
    col >= this.matrixCellIDs[row].length
  ) {
    return;
  }
  var color =
    background || FloydWarshallVisualization.MATRIX_CELL_BACKGROUND;
  this.cmd("SetBackgroundColor", this.matrixCellIDs[row][col], color);
};

FloydWarshallVisualization.prototype.setMatrixCellValue = function (
  row,
  col,
  value
) {
  if (
    row < 0 ||
    row >= this.matrixCellIDs.length ||
    col < 0 ||
    col >= this.matrixCellIDs[row].length
  ) {
    return;
  }
  this.cmd(
    "SetText",
    this.matrixCellIDs[row][col],
    this.formatDistance(value)
  );
};

FloydWarshallVisualization.prototype.clearMatrixHighlights = function () {
  for (var i = 0; i < this.matrixCellIDs.length; i++) {
    for (var j = 0; j < this.matrixCellIDs[i].length; j++) {
      this.highlightMatrixCell(
        i,
        j,
        FloydWarshallVisualization.MATRIX_CELL_BACKGROUND
      );
    }
  }

  for (var r = 0; r < this.rowHeaderIDs.length; r++) {
    this.setHeaderHighlight(this.rowHeaderIDs, r, false);
  }
  for (var c = 0; c < this.columnHeaderIDs.length; c++) {
    this.setHeaderHighlight(this.columnHeaderIDs, c, false);
  }

  for (var v = 0; v < this.vertexIDs.length; v++) {
    this.setVertexActive(v, false);
  }

  this.hideIndexMarkers();
  this.clearEdgeHighlights();
};

FloydWarshallVisualization.prototype.computeCandidate = function (
  distIK,
  distKJ
) {
  if (distIK === Infinity || distKJ === Infinity) {
    return Infinity;
  }
  return distIK + distKJ;
};

FloydWarshallVisualization.prototype.runAlgorithm = function () {
  var vertexData = this.vertexData ||
    FloydWarshallVisualization.DEFAULT_VERTEX_DATA;
  var n = vertexData.length;
  this.commands = [];

  this.distances = this.cloneMatrix(this.initialDistances);
  this.nextMatrix = this.cloneMatrix(this.initialNextMatrix);
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      this.setMatrixCellValue(i, j, this.distances[i][j]);
    }
  }
  this.clearMatrixHighlights();

  this.highlightCodeLine(0);
  this.setInfoTexts("Starting Floyd-Warshall iterations.", "");
  this.cmd("Step");

  for (var k = 0; k < n; k++) {
    this.highlightCodeLine(1);
    var intermediateLabel = vertexData[k].label;
    this.setInfoTexts(
      "Considering intermediate vertex " + intermediateLabel +
        " (" +
        (k + 1) +
        "/" +
        n +
        ")",
      ""
    );
    this.setVertexActive(k, true);
    this.setHeaderHighlight(this.rowHeaderIDs, k, true);
    this.setHeaderHighlight(this.columnHeaderIDs, k, true);
    this.moveKMarker(k);
    this.cmd("Step");

    for (var i = 0; i < n; i++) {
      this.highlightCodeLine(2);
      this.setVertexActive(i, true);
      this.setHeaderHighlight(this.rowHeaderIDs, i, true);
      this.moveIMarker(i);
      this.setMarkerVisible(this.jMarkerID, false);
      this.clearEdgeHighlights();
      this.cmd("Step");

      for (var j = 0; j < n; j++) {
        this.highlightCodeLine(3);
        this.setVertexActive(j, true);
        this.setHeaderHighlight(this.columnHeaderIDs, j, true);
        this.moveJMarker(j);
        this.highlightMatrixCell(
          i,
          j,
          FloydWarshallVisualization.MATRIX_CELL_HIGHLIGHT
        );
        this.clearEdgeHighlights();
        var distIK = this.distances[i][k];
        var distKJ = this.distances[k][j];
        var current = this.distances[i][j];
        var candidate = this.computeCandidate(distIK, distKJ);

        this.highlightCandidatePaths(i, k, j, distIK, distKJ);

        var detail =
          "dist[" +
          vertexData[i].label +
          "][" +
          vertexData[j].label +
          "] = min(" +
          this.formatDistance(current) +
          ", " +
          this.formatDistance(distIK) +
          " + " +
          this.formatDistance(distKJ) +
          " = " +
          this.formatDistance(candidate) +
          ")";
        this.setInfoTexts(
          "Considering intermediate vertex " + intermediateLabel +
            " (" +
            (k + 1) +
            "/" +
            n +
            ")",
          detail
        );
        this.cmd("Step");

        this.highlightCodeLine(4);
        if (candidate < current) {
          this.highlightMatrixCell(
            i,
            j,
            FloydWarshallVisualization.MATRIX_CELL_UPDATE
          );
          this.distances[i][j] = candidate;
          this.setMatrixCellValue(i, j, candidate);
          this.updateNextMatrix(i, j, k);
          this.clearEdgeHighlights();
          this.highlightShortestPath(i, j);
          this.setInfoTexts(
            "Updated through " + intermediateLabel +
              ": dist[" +
              vertexData[i].label +
              "][" +
              vertexData[j].label +
              "] = " +
              this.formatDistance(candidate),
            detail
          );
          this.highlightCodeLine(5);
        } else {
          this.highlightCodeLine(4);
          this.setInfoTexts(
            "No shorter path through " + intermediateLabel + ".",
            detail
          );
        }
        this.cmd("Step");

        this.clearEdgeHighlights();
        this.highlightMatrixCell(
          i,
          j,
          FloydWarshallVisualization.MATRIX_CELL_BACKGROUND
        );
        this.setVertexActive(j, j === k || j === i);
        this.setHeaderHighlight(this.columnHeaderIDs, j, j === k);
      }

      this.setVertexActive(i, i === k);
      this.setHeaderHighlight(this.rowHeaderIDs, i, i === k);
      this.setMarkerVisible(this.jMarkerID, false);
    }

    this.setVertexActive(k, false);
    this.setHeaderHighlight(this.rowHeaderIDs, k, false);
    this.setHeaderHighlight(this.columnHeaderIDs, k, false);
    this.setMarkerVisible(this.iMarkerID, false);
    this.setMarkerVisible(this.kMarkerID, false);
  }

  this.highlightCodeLine(9);
  this.setInfoTexts(
    "All pairs processed. dist[i][j] now holds the shortest paths.",
    ""
  );
  this.cmd("Step");

  this.highlightCodeLine(-1);
  this.clearMatrixHighlights();
  this.setInfoTexts(
    "Animation complete. Use 'Reset Layout' to restart.",
    ""
  );
  this.cmd("Step");

  return this.commands;
};

var currentAlg; // eslint-disable-line no-unused-vars

function init() {
  var animManag = initCanvas(
    FloydWarshallVisualization.CANVAS_WIDTH,
    FloydWarshallVisualization.CANVAS_HEIGHT
  );
  currentAlg = new FloydWarshallVisualization(
    animManag,
    FloydWarshallVisualization.CANVAS_WIDTH,
    FloydWarshallVisualization.CANVAS_HEIGHT
  );
}
