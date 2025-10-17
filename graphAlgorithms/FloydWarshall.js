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
FloydWarshallVisualization.EDGE_THICKNESS = 3;
FloydWarshallVisualization.EDGE_WEIGHT_COLOR = "#1d4ed8";

FloydWarshallVisualization.MATRIX_TOP_Y = 560;
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
FloydWarshallVisualization.MARKER_COLOR = "#d81b60";
FloydWarshallVisualization.MARKER_LAYER = 0;
FloydWarshallVisualization.MARKER_TRACK_PADDING = 12;
FloydWarshallVisualization.MARKER_TRACK_THICKNESS = 18;
FloydWarshallVisualization.MARKER_I_TRACK_WIDTH = 24;
FloydWarshallVisualization.MARKER_I_TRACK_GAP = 6;
FloydWarshallVisualization.MARKER_TRACK_COLOR = "#fde2ff";
FloydWarshallVisualization.MARKER_TRACK_BORDER_COLOR = "#f8bbd0";
FloydWarshallVisualization.MARKER_TRACK_ALPHA = 0.35;
FloydWarshallVisualization.MARKER_TRACK_LAYER = 0;
FloydWarshallVisualization.ROW_HEADER_EXTRA_GAP = 10;

FloydWarshallVisualization.RANDOM_EDGE_PROBABILITY = 0.4;
FloydWarshallVisualization.RANDOM_WEIGHT_MIN = 1;
FloydWarshallVisualization.RANDOM_WEIGHT_MAX = 9;

FloydWarshallVisualization.SINGLE_EDGE_CURVE = 0.24;
FloydWarshallVisualization.BIDIRECTIONAL_EDGE_CURVE = 0.56;
FloydWarshallVisualization.PARALLEL_EDGE_GAP = 0.12;
FloydWarshallVisualization.LOOP_EDGE_CURVE = 0.52;

FloydWarshallVisualization.CODE_START_Y = 860;
FloydWarshallVisualization.CODE_LEFT_X =
  FloydWarshallVisualization.MATRIX_LEFT_X;
FloydWarshallVisualization.CODE_LINE_HEIGHT = 18;
FloydWarshallVisualization.CODE_FONT = "bold 15px 'Courier New', monospace";
FloydWarshallVisualization.CODE_HIGHLIGHT_FONT =
  "bold 17px 'Courier New', monospace";
FloydWarshallVisualization.CODE_STANDARD_COLOR = "#102a43";
FloydWarshallVisualization.CODE_HIGHLIGHT_COLOR = "#d81b60";

FloydWarshallVisualization.INFINITY_SYMBOL = "\u221E";

FloydWarshallVisualization.DEFAULT_VERTEX_DATA = [
  { label: "A", x: 160, y: 360 },
  { label: "B", x: 360, y: 240 },
  { label: "C", x: 560, y: 360 },
  { label: "D", x: 360, y: 500 },
];

FloydWarshallVisualization.DEFAULT_GRAPH_EDGES = [
  [
    { to: 1, weight: 3 },
    { to: 2, weight: 8 },
    { to: 3, weight: 7 },
  ],
  [
    { to: 2, weight: 2 },
    { to: 3, weight: 5 },
  ],
  [
    { to: 3, weight: 1 },
  ],
  [
    { to: 0, weight: 4 },
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
  this.markerTrackIDs = { k: -1, j: -1, i: -1 };
  this.iMarkerX = 0;
  this.jMarkerY = 0;
  this.kMarkerY = 0;

  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }

  return this.setup();
};

FloydWarshallVisualization.prototype.generateRandomGraphData = function () {
  this.vertexData = this.cloneVertexData(
    FloydWarshallVisualization.DEFAULT_VERTEX_DATA
  );

  var vertexCount = this.vertexData.length;
  var edges = new Array(vertexCount);
  for (var i = 0; i < vertexCount; i++) {
    edges[i] = [];
  }

  if (vertexCount > 1) {
    for (var from = 0; from < vertexCount; from++) {
      var ensureIndex = Math.floor(Math.random() * (vertexCount - 1));
      if (ensureIndex >= from) {
        ensureIndex += 1;
      }
      this.addDirectedEdge(edges, from, ensureIndex, this.randomWeight());
    }
  }

  for (var u = 0; u < vertexCount; u++) {
    for (var v = 0; v < vertexCount; v++) {
      if (u === v) {
        continue;
      }
      if (this.edgeExists(edges, u, v)) {
        continue;
      }
      if (Math.random() < FloydWarshallVisualization.RANDOM_EDGE_PROBABILITY) {
        this.addDirectedEdge(edges, u, v, this.randomWeight());
      }
    }
    edges[u].sort(function (a, b) {
      return a.to - b.to;
    });
  }

  this.graphEdges = edges;
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
      var curveKey = from + "-" + edge.to;
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

FloydWarshallVisualization.prototype.createMarkerTrack = function (
  x,
  y,
  width,
  height
) {
  if (width <= 0 || height <= 0) {
    return -1;
  }
  var trackID = this.nextIndex++;
  this.cmd("CreateRectangle", trackID, "", width, height, x, y);
  this.cmd(
    "SetForegroundColor",
    trackID,
    FloydWarshallVisualization.MARKER_TRACK_BORDER_COLOR
  );
  this.cmd(
    "SetBackgroundColor",
    trackID,
    FloydWarshallVisualization.MARKER_TRACK_COLOR
  );
  this.cmd(
    "SetLayer",
    trackID,
    FloydWarshallVisualization.MARKER_TRACK_LAYER
  );
  this.cmd("SetAlpha", trackID, FloydWarshallVisualization.MARKER_TRACK_ALPHA);
  return trackID;
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

  var horizontalTrackThickness = FloydWarshallVisualization.MARKER_TRACK_THICKNESS;
  var horizontalPadding = FloydWarshallVisualization.MARKER_TRACK_PADDING;
  var verticalTrackWidth = FloydWarshallVisualization.MARKER_I_TRACK_WIDTH;
  var verticalTrackGap = FloydWarshallVisualization.MARKER_I_TRACK_GAP;
  var hasMatrix = n > 0;
  var kTrackY = hasMatrix
    ? top - horizontalPadding - horizontalTrackThickness / 2
    : top;
  var jTrackY = hasMatrix
    ? top + horizontalPadding + horizontalTrackThickness / 2
    : top;
  var iTrackX = hasMatrix
    ? rowHeaderX - verticalTrackGap - verticalTrackWidth / 2
    : rowHeaderX;

  if (hasMatrix) {
    this.markerTrackIDs.k = this.createMarkerTrack(
      matrixCenterX,
      kTrackY,
      matrixWidth,
      horizontalTrackThickness
    );
    this.markerTrackIDs.j = this.createMarkerTrack(
      matrixCenterX,
      jTrackY,
      matrixWidth,
      horizontalTrackThickness
    );
    this.markerTrackIDs.i = this.createMarkerTrack(
      iTrackX,
      matrixCenterY,
      verticalTrackWidth,
      matrixHeight
    );
  } else {
    this.markerTrackIDs = { k: -1, j: -1, i: -1 };
  }

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

  var initialColumnX =
    this.columnHeaderPositions.length > 0
      ? this.columnHeaderPositions[0]
      : left;
  var initialRowY =
    this.rowHeaderPositions.length > 0
      ? this.rowHeaderPositions[0].y
      : top + rowSpacing;

  this.kMarkerID = this.createIndexMarker("k", initialColumnX, this.kMarkerY);
  this.jMarkerID = this.createIndexMarker("j", initialColumnX, this.jMarkerY);
  this.iMarkerID = this.createIndexMarker("i", this.iMarkerX, initialRowY);
  this.hideIndexMarkers();

  this.initialDistances = this.buildInitialDistances();
  this.distances = this.cloneMatrix(this.initialDistances);

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
  this.codeID = this.addCodeToCanvasBase(
    FloydWarshallVisualization.CODE_LINES,
    FloydWarshallVisualization.CODE_LEFT_X,
    FloydWarshallVisualization.CODE_START_Y,
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
  y
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
    FloydWarshallVisualization.MARKER_COLOR
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

FloydWarshallVisualization.prototype.cloneMatrix = function (matrix) {
  var clone = new Array(matrix.length);
  for (var i = 0; i < matrix.length; i++) {
    clone[i] = matrix[i].slice();
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

        var distIK = this.distances[i][k];
        var distKJ = this.distances[k][j];
        var current = this.distances[i][j];
        var candidate = this.computeCandidate(distIK, distKJ);

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
