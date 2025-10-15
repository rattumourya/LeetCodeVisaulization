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
BellmanFordVisualization.NODE_RADIUS = 28;
BellmanFordVisualization.NODE_COLOR = "#f6f7fb";
BellmanFordVisualization.NODE_BORDER_COLOR = "#283593";
BellmanFordVisualization.NODE_TEXT_COLOR = "#0d1b2a";
BellmanFordVisualization.NODE_ACTIVE_COLOR = "#ffe082";
BellmanFordVisualization.NODE_VISITED_COLOR = "#c5e1a5";
BellmanFordVisualization.NODE_VISITED_TEXT_COLOR = "#1b4332";

BellmanFordVisualization.WEIGHT_LABEL_FONT =
  "bold 22px 'Courier New', monospace";
BellmanFordVisualization.WEIGHT_LABEL_COLOR = "#1d4ed8";
BellmanFordVisualization.WEIGHT_LABEL_MUTED_COLOR = "#2563eb";
BellmanFordVisualization.WEIGHT_LABEL_POSITIVE_COLOR = "#2e7d32";
BellmanFordVisualization.WEIGHT_LABEL_NEGATIVE_COLOR = "#c62828";
BellmanFordVisualization.WEIGHT_LABEL_MARGIN = 2;
BellmanFordVisualization.WEIGHT_LABEL_CHAR_WIDTH = 13;
BellmanFordVisualization.WEIGHT_LABEL_HEIGHT = 28;

BellmanFordVisualization.EDGE_COLOR = "#424874";
BellmanFordVisualization.EDGE_HIGHLIGHT_COLOR = "#ff7043";
BellmanFordVisualization.EDGE_THICKNESS = 3;

BellmanFordVisualization.TABLE_HEADER_Y = 600;
BellmanFordVisualization.TABLE_ROW_HEIGHT = 44;
BellmanFordVisualization.TABLE_FIRST_ROW_Y =
  BellmanFordVisualization.TABLE_HEADER_Y + 50;
BellmanFordVisualization.TABLE_TOTAL_WIDTH =
  BellmanFordVisualization.CANVAS_WIDTH / 2;
BellmanFordVisualization.TABLE_LEFT_X = 24;
BellmanFordVisualization.TABLE_RIGHT_X =
  BellmanFordVisualization.TABLE_LEFT_X +
  BellmanFordVisualization.TABLE_TOTAL_WIDTH;
BellmanFordVisualization.TABLE_COLUMN_COUNT = 3;
BellmanFordVisualization.TABLE_COLUMN_LABELS = [
  "Vertex",
  "Distance",
  "Parent",
];
BellmanFordVisualization.TABLE_COLUMN_WIDTH =
  BellmanFordVisualization.TABLE_TOTAL_WIDTH /
  BellmanFordVisualization.TABLE_COLUMN_COUNT;
BellmanFordVisualization.TABLE_COLUMNS = (function () {
  var columns = [];
  var left = BellmanFordVisualization.TABLE_LEFT_X;
  var width = BellmanFordVisualization.TABLE_COLUMN_WIDTH;
  for (
    var i = 0;
    i < BellmanFordVisualization.TABLE_COLUMN_LABELS.length;
    i++
  ) {
    columns.push({
      label: BellmanFordVisualization.TABLE_COLUMN_LABELS[i],
      x: left + width / 2,
      width: width,
    });
    left += width;
  }
  return columns;
})();
BellmanFordVisualization.TABLE_HEADER_FONT = "bold 20";
BellmanFordVisualization.TABLE_CELL_FONT = "bold 18";
BellmanFordVisualization.TABLE_HEADER_COLOR = "#1a237e";
BellmanFordVisualization.TABLE_TEXT_COLOR = "#1f2933";
BellmanFordVisualization.TABLE_HIGHLIGHT_COLOR = "#ffe0b2";
BellmanFordVisualization.TABLE_BORDER_COLOR = "#1a237e";
BellmanFordVisualization.TABLE_BORDER_THICKNESS = 2;

BellmanFordVisualization.CODE_TITLE_Y = 900;
BellmanFordVisualization.CODE_START_Y = 920;
BellmanFordVisualization.CODE_LINE_HEIGHT = 14;
BellmanFordVisualization.CODE_LEFT_X =
  BellmanFordVisualization.TABLE_COLUMNS[0].x -
  BellmanFordVisualization.TABLE_COLUMNS[0].width / 2 +
  5;
BellmanFordVisualization.CODE_FONT = "bold 15px 'Courier New', monospace";
BellmanFordVisualization.CODE_HIGHLIGHT_FONT =
  "bold 17px 'Courier New', monospace";
BellmanFordVisualization.CODE_STANDARD_COLOR = "#102a43";
BellmanFordVisualization.CODE_HIGHLIGHT_COLOR = "#d81b60";

BellmanFordVisualization.INFO_BOX_WIDTH = 660;
BellmanFordVisualization.INFO_BOX_HEIGHT = 86;
BellmanFordVisualization.INFO_BOX_X =
  BellmanFordVisualization.CANVAS_WIDTH / 2;
BellmanFordVisualization.INFO_BOX_Y = BellmanFordVisualization.TITLE_Y + 62;
BellmanFordVisualization.INFO_ITERATION_FONT = "bold 18";
BellmanFordVisualization.INFO_ITERATION_COLOR = "#1a237e";
BellmanFordVisualization.INFO_SIDE_MARGIN = 36;
BellmanFordVisualization.INFO_ITERATION_CHAR_WIDTH = 9;
BellmanFordVisualization.INFO_TOP_LINE_Y =
  BellmanFordVisualization.INFO_BOX_Y;

BellmanFordVisualization.PATH_TITLE_FONT = "bold 18";
BellmanFordVisualization.PATH_FONT = "bold 14px 'Courier New', monospace";
BellmanFordVisualization.PATH_TITLE_COLOR = "#0b3d91";
BellmanFordVisualization.PATH_TEXT_COLOR = "#102a43";
BellmanFordVisualization.PATH_TABLE_MARGIN_LEFT = 32;
BellmanFordVisualization.PATH_TABLE_MARGIN_RIGHT = 32;
BellmanFordVisualization.PATH_TABLE_LEFT_EDGE =
  BellmanFordVisualization.TABLE_RIGHT_X +
  BellmanFordVisualization.PATH_TABLE_MARGIN_LEFT;
BellmanFordVisualization.PATH_TABLE_AVAILABLE_WIDTH =
  BellmanFordVisualization.CANVAS_WIDTH -
  BellmanFordVisualization.PATH_TABLE_LEFT_EDGE -
  BellmanFordVisualization.PATH_TABLE_MARGIN_RIGHT;
BellmanFordVisualization.PATH_TABLE_COLUMN_LABELS = [
  "Vertex",
  "Path",
  "Distance",
];
BellmanFordVisualization.PATH_TABLE_TOTAL_WIDTH = 0;
BellmanFordVisualization.PATH_TABLE_COLUMNS = (function () {
  var available = Math.max(
    BellmanFordVisualization.PATH_TABLE_AVAILABLE_WIDTH,
    210
  );
  var first = Math.max(60, Math.floor(available * 0.25));
  var third = Math.max(60, Math.floor(available * 0.24));
  var second = available - first - third;
  if (second < 90) {
    var deficit = 90 - second;
    second = 90;
    if (first - deficit / 2 >= 55 && third - deficit / 2 >= 55) {
      first -= Math.floor(deficit / 2);
      third -= deficit - Math.floor(deficit / 2);
    } else if (first > third) {
      first = Math.max(55, first - deficit);
    } else {
      third = Math.max(55, third - deficit);
    }
  }
  var left = BellmanFordVisualization.PATH_TABLE_LEFT_EDGE;
  var labels = BellmanFordVisualization.PATH_TABLE_COLUMN_LABELS;
  var widths = [first, second, third];
  var columns = [];
  for (var i = 0; i < labels.length; i++) {
    var width = widths[i];
    columns.push({
      label: labels[i],
      width: width,
      x: left + width / 2,
    });
    left += width;
  }
  BellmanFordVisualization.PATH_TABLE_TOTAL_WIDTH =
    left - BellmanFordVisualization.PATH_TABLE_LEFT_EDGE;
  return columns;
})();
BellmanFordVisualization.PATH_TITLE_X =
  BellmanFordVisualization.PATH_TABLE_LEFT_EDGE +
  BellmanFordVisualization.PATH_TABLE_TOTAL_WIDTH / 2;
BellmanFordVisualization.PATH_TITLE_Y =
  BellmanFordVisualization.TABLE_HEADER_Y - 36;
BellmanFordVisualization.PATH_TABLE_HEADER_Y =
  BellmanFordVisualization.TABLE_HEADER_Y;
BellmanFordVisualization.PATH_TABLE_ROW_HEIGHT =
  BellmanFordVisualization.TABLE_ROW_HEIGHT;
BellmanFordVisualization.PATH_TABLE_FIRST_ROW_Y =
  BellmanFordVisualization.TABLE_FIRST_ROW_Y;
BellmanFordVisualization.PATH_TABLE_HEADER_FONT = "bold 18";
BellmanFordVisualization.PATH_TABLE_CELL_FONT = "bold 16";
BellmanFordVisualization.PATH_TABLE_BORDER_COLOR = "#0b3d91";
BellmanFordVisualization.PATH_TABLE_BORDER_THICKNESS = 2;
BellmanFordVisualization.PATH_TABLE_HIGHLIGHT_COLOR = "#d1f2eb";

BellmanFordVisualization.BIDIRECTIONAL_CURVE_INNER = 0.18;
BellmanFordVisualization.BIDIRECTIONAL_CURVE_OUTER = 0.28;

BellmanFordVisualization.TITLE_FONT = "bold 34";

BellmanFordVisualization.VERTEX_DATA = [
  { label: "S", x: 150, y: 420, weightAnchor: "left" },
  { label: "T", x: 340, y: 240, weightAnchor: "top" },
  { label: "X", x: 560, y: 320, weightAnchor: "right" },
  { label: "Y", x: 240, y: 520, weightAnchor: "bottom" },
  { label: "Z", x: 520, y: 500, weightAnchor: "bottom" },
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
  this.pathsTitleID = -1;
  this.currentCodeLine = -1;
  this.statusID = -1;
  this.titleID = -1;
  this.infoBoxID = -1;
  this.infoMainTextID = -1;
  this.infoDetailTextID = -1;
  this.iterationLabelID = -1;
  this.pathVertexCellIDs = [];
  this.pathRouteCellIDs = [];
  this.pathDistanceCellIDs = [];

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
  this.pathsTitleID = -1;
  this.currentCodeLine = -1;
  this.infoBoxID = -1;
  this.infoMainTextID = -1;
  this.infoDetailTextID = -1;
  this.iterationLabelID = -1;
  this.weightLabelIDs = [];
  this.currentIterationText = "";
  this.pathVertexCellIDs = [];
  this.pathRouteCellIDs = [];
  this.pathDistanceCellIDs = [];

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
  this.createInfoPanel();
  this.createGraph();
  this.createTable();
  this.createCodeDisplay();
  this.createPathsPanel();
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

BellmanFordVisualization.prototype.createInfoPanel = function () {
  var boxX = BellmanFordVisualization.INFO_BOX_X;
  var boxY = BellmanFordVisualization.INFO_BOX_Y;

  this.infoBoxID = -1;
  this.infoMainTextID = -1;
  this.infoDetailTextID = -1;

  this.iterationLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.iterationLabelID,
    "Iterations: 0",
    boxX,
    boxY,
    0
  );
  this.cmd(
    "SetTextStyle",
    this.iterationLabelID,
    BellmanFordVisualization.INFO_ITERATION_FONT
  );
  this.cmd(
    "SetForegroundColor",
    this.iterationLabelID,
    BellmanFordVisualization.INFO_ITERATION_COLOR
  );
  this.currentIterationText = "Iterations: 0";

  this.positionInfoTexts();
};

BellmanFordVisualization.prototype.positionInfoTexts = function () {
  if (this.iterationLabelID < 0) {
    return;
  }

  this.cmd(
    "SetPosition",
    this.iterationLabelID,
    BellmanFordVisualization.INFO_BOX_X,
    BellmanFordVisualization.INFO_BOX_Y
  );
};

BellmanFordVisualization.prototype.updateStatus = function () {
  // Info panel now only displays the iteration counter.
};

BellmanFordVisualization.prototype.updateIterationDisplay = function (
  current,
  total,
  label
) {
  if (this.iterationLabelID < 0) {
    return;
  }

  var iterationText;
  if (typeof current === "string") {
    iterationText = current;
  } else if (typeof label === "string" && label.length > 0) {
    iterationText = label;
  } else if (typeof total === "number" && total > 0) {
    iterationText = "Iteration " + current + " / " + total;
  } else {
    iterationText = "Iterations: " + (current || 0);
  }

  this.currentIterationText = iterationText;
  this.cmd("SetText", this.iterationLabelID, this.currentIterationText);
  this.positionInfoTexts();
};

BellmanFordVisualization.prototype.formatDistance = function (value) {
  if (value === Infinity) {
    return this.infinitySymbol;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return String(value || "");
};

BellmanFordVisualization.prototype.describeRelaxation = function (
  fromLabel,
  toLabel,
  distFrom,
  weight,
  distTo,
  canRelax
) {
  if (distFrom === Infinity) {
    return (
      "dist[" +
      fromLabel +
      "] is " +
      this.infinitySymbol +
      ", so " +
      toLabel +
      " is unreachable through this edge."
    );
  }

  var candidate = distFrom + weight;
  var candidateText = this.formatDistance(candidate);
  var distToText = this.formatDistance(distTo);
  var expression =
    "dist[" +
    fromLabel +
    "] + " +
    weight +
    " = " +
    candidateText;

  if (canRelax) {
    return (
      expression +
      " improves " +
      distToText +
      ", so update dist[" +
      toLabel +
      "] to " +
      candidateText +
      "."
    );
  }

  return (
    expression +
    " is not smaller than " +
    distToText +
    ", so keep the current value."
  );
};

BellmanFordVisualization.prototype.getWeightLabelMetrics = function (text) {
  var content = typeof text === "string" ? text : this.formatDistance(text);
  var length = content ? content.length : 0;
  if (length <= 0) {
    length = 1;
  }
  return {
    width: length * BellmanFordVisualization.WEIGHT_LABEL_CHAR_WIDTH,
    height: BellmanFordVisualization.WEIGHT_LABEL_HEIGHT,
  };
};

BellmanFordVisualization.prototype.getWeightLabelPosition = function (
  index,
  text
) {
  var metrics = this.getWeightLabelMetrics(text);
  var vertex = BellmanFordVisualization.VERTEX_DATA[index];
  var anchor = vertex.weightAnchor || "top";
  var radius = BellmanFordVisualization.NODE_RADIUS;
  var margin = BellmanFordVisualization.WEIGHT_LABEL_MARGIN;
  var x = vertex.x;
  var y = vertex.y;

  switch (anchor) {
    case "left":
      x = vertex.x - radius - margin - metrics.width / 2;
      break;
    case "right":
      x = vertex.x + radius + margin + metrics.width / 2;
      break;
    case "bottom":
      y = vertex.y + radius + margin + metrics.height / 2;
      break;
    case "top":
    default:
      y = vertex.y - radius - margin - metrics.height / 2;
      break;
  }

  return { x: x, y: y };
};

BellmanFordVisualization.prototype.updateWeightLabel = function (
  index,
  text,
  color
) {
  if (
    !this.weightLabelIDs ||
    index < 0 ||
    index >= this.weightLabelIDs.length
  ) {
    return;
  }

  var labelID = this.weightLabelIDs[index];
  if (labelID === undefined || labelID < 0) {
    return;
  }

  var displayText = typeof text === "string" ? text : this.formatDistance(text);
  this.cmd("SetText", labelID, displayText);
  if (color) {
    this.cmd("SetForegroundColor", labelID, color);
  }

  var pos = this.getWeightLabelPosition(index, displayText);
  this.cmd("SetPosition", labelID, pos.x, pos.y);
};

BellmanFordVisualization.prototype.showRelaxationOnNode = function (
  fromIndex,
  toIndex,
  weight,
  distFrom,
  priorDistTo,
  canRelax,
  resultDist
) {
  if (
    !this.weightLabelIDs ||
    toIndex < 0 ||
    toIndex >= this.weightLabelIDs.length
  ) {
    return;
  }

  var displayText;
  var color = BellmanFordVisualization.WEIGHT_LABEL_COLOR;

  if (typeof resultDist === "number") {
    displayText = this.formatDistance(resultDist);
  } else if (distFrom !== Infinity) {
    var comparator = canRelax ? "<" : "\u2265";
    displayText =
      this.formatDistance(distFrom) +
      " + " +
      weight +
      " " +
      comparator +
      " " +
      this.formatDistance(priorDistTo);
    color = canRelax
      ? BellmanFordVisualization.WEIGHT_LABEL_POSITIVE_COLOR
      : BellmanFordVisualization.WEIGHT_LABEL_NEGATIVE_COLOR;
  } else {
    displayText = this.formatDistance(priorDistTo);
    color =
      priorDistTo === Infinity
        ? BellmanFordVisualization.WEIGHT_LABEL_MUTED_COLOR
        : BellmanFordVisualization.WEIGHT_LABEL_COLOR;
  }

  this.updateWeightLabel(toIndex, displayText, color);
};

BellmanFordVisualization.prototype.createGraph = function () {
  this.vertexIDs = new Array(BellmanFordVisualization.VERTEX_DATA.length);
  this.weightLabelIDs = new Array(BellmanFordVisualization.VERTEX_DATA.length);

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

    var weightLabelID = this.nextIndex++;
    this.weightLabelIDs[i] = weightLabelID;
    this.cmd("CreateLabel", weightLabelID, this.infinitySymbol, vertex.x, vertex.y, 1);
    this.cmd(
      "SetTextStyle",
      weightLabelID,
      BellmanFordVisualization.WEIGHT_LABEL_FONT
    );
    this.cmd(
      "SetForegroundColor",
      weightLabelID,
      BellmanFordVisualization.WEIGHT_LABEL_MUTED_COLOR
    );
    this.updateWeightLabel(
      i,
      this.infinitySymbol,
      BellmanFordVisualization.WEIGHT_LABEL_MUTED_COLOR
    );
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
    this.cmd(
      "SetForegroundColor",
      vertexCell,
      BellmanFordVisualization.TABLE_BORDER_COLOR
    );
    this.cmd(
      "SetRectangleLineThickness",
      vertexCell,
      BellmanFordVisualization.TABLE_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", vertexCell, BellmanFordVisualization.TABLE_TEXT_COLOR);
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
    this.cmd(
      "SetForegroundColor",
      distanceCell,
      BellmanFordVisualization.TABLE_BORDER_COLOR
    );
    this.cmd(
      "SetRectangleLineThickness",
      distanceCell,
      BellmanFordVisualization.TABLE_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", distanceCell, BellmanFordVisualization.TABLE_TEXT_COLOR);
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
    this.cmd(
      "SetForegroundColor",
      parentCell,
      BellmanFordVisualization.TABLE_BORDER_COLOR
    );
    this.cmd(
      "SetRectangleLineThickness",
      parentCell,
      BellmanFordVisualization.TABLE_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", parentCell, BellmanFordVisualization.TABLE_TEXT_COLOR);
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
};

BellmanFordVisualization.prototype.createPathsPanel = function () {
  var columns = BellmanFordVisualization.PATH_TABLE_COLUMNS;

  this.pathsTitleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.pathsTitleID,
    "Shortest Paths",
    BellmanFordVisualization.PATH_TITLE_X,
    BellmanFordVisualization.PATH_TITLE_Y,
    0
  );
  this.cmd(
    "SetTextStyle",
    this.pathsTitleID,
    BellmanFordVisualization.PATH_TITLE_FONT
  );
  this.cmd(
    "SetForegroundColor",
    this.pathsTitleID,
    BellmanFordVisualization.PATH_TITLE_COLOR
  );

  for (var c = 0; c < columns.length; c++) {
    var headerID = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      headerID,
      columns[c].label,
      columns[c].x,
      BellmanFordVisualization.PATH_TABLE_HEADER_Y,
      1
    );
    this.cmd(
      "SetTextStyle",
      headerID,
      BellmanFordVisualization.PATH_TABLE_HEADER_FONT
    );
    this.cmd(
      "SetForegroundColor",
      headerID,
      BellmanFordVisualization.PATH_TITLE_COLOR
    );
  }

  var vertexCount = BellmanFordVisualization.VERTEX_DATA.length;
  this.pathVertexCellIDs = new Array(vertexCount);
  this.pathRouteCellIDs = new Array(vertexCount);
  this.pathDistanceCellIDs = new Array(vertexCount);

  for (var i = 0; i < vertexCount; i++) {
    var rowY =
      BellmanFordVisualization.PATH_TABLE_FIRST_ROW_Y +
      i * BellmanFordVisualization.PATH_TABLE_ROW_HEIGHT;

    var vertexCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      vertexCell,
      BellmanFordVisualization.VERTEX_DATA[i].label,
      columns[0].width,
      BellmanFordVisualization.PATH_TABLE_ROW_HEIGHT - 6,
      columns[0].x,
      rowY
    );
    this.cmd(
      "SetTextStyle",
      vertexCell,
      BellmanFordVisualization.PATH_TABLE_CELL_FONT
    );
    this.cmd(
      "SetForegroundColor",
      vertexCell,
      BellmanFordVisualization.PATH_TABLE_BORDER_COLOR
    );
    this.cmd(
      "SetRectangleLineThickness",
      vertexCell,
      BellmanFordVisualization.PATH_TABLE_BORDER_THICKNESS
    );
    this.cmd(
      "SetTextColor",
      vertexCell,
      BellmanFordVisualization.PATH_TEXT_COLOR
    );
    this.cmd("SetBackgroundColor", vertexCell, "#ffffff");
    this.pathVertexCellIDs[i] = vertexCell;

    var pathCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      pathCell,
      "",
      columns[1].width,
      BellmanFordVisualization.PATH_TABLE_ROW_HEIGHT - 6,
      columns[1].x,
      rowY
    );
    this.cmd(
      "SetTextStyle",
      pathCell,
      BellmanFordVisualization.PATH_TABLE_CELL_FONT
    );
    this.cmd(
      "SetForegroundColor",
      pathCell,
      BellmanFordVisualization.PATH_TABLE_BORDER_COLOR
    );
    this.cmd(
      "SetRectangleLineThickness",
      pathCell,
      BellmanFordVisualization.PATH_TABLE_BORDER_THICKNESS
    );
    this.cmd(
      "SetTextColor",
      pathCell,
      BellmanFordVisualization.PATH_TEXT_COLOR
    );
    this.cmd("SetBackgroundColor", pathCell, "#ffffff");
    this.pathRouteCellIDs[i] = pathCell;

    var distanceCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      distanceCell,
      "",
      columns[2].width,
      BellmanFordVisualization.PATH_TABLE_ROW_HEIGHT - 6,
      columns[2].x,
      rowY
    );
    this.cmd(
      "SetTextStyle",
      distanceCell,
      BellmanFordVisualization.PATH_TABLE_CELL_FONT
    );
    this.cmd(
      "SetForegroundColor",
      distanceCell,
      BellmanFordVisualization.PATH_TABLE_BORDER_COLOR
    );
    this.cmd(
      "SetRectangleLineThickness",
      distanceCell,
      BellmanFordVisualization.PATH_TABLE_BORDER_THICKNESS
    );
    this.cmd(
      "SetTextColor",
      distanceCell,
      BellmanFordVisualization.PATH_TEXT_COLOR
    );
    this.cmd("SetBackgroundColor", distanceCell, "#ffffff");
    this.pathDistanceCellIDs[i] = distanceCell;
  }

  this.clearPathsDisplay();
};

BellmanFordVisualization.prototype.clearPathsDisplay = function () {
  if (this.pathsTitleID >= 0) {
    this.cmd("SetText", this.pathsTitleID, "Shortest Paths");
  }

  var i;
  if (this.pathVertexCellIDs) {
    for (i = 0; i < this.pathVertexCellIDs.length; i++) {
      if (this.pathVertexCellIDs[i] >= 0) {
        this.cmd("SetBackgroundColor", this.pathVertexCellIDs[i], "#ffffff");
      }
    }
  }

  if (this.pathRouteCellIDs) {
    for (i = 0; i < this.pathRouteCellIDs.length; i++) {
      if (this.pathRouteCellIDs[i] >= 0) {
        this.cmd("SetText", this.pathRouteCellIDs[i], "");
        this.cmd("SetBackgroundColor", this.pathRouteCellIDs[i], "#ffffff");
      }
    }
  }

  if (this.pathDistanceCellIDs) {
    for (i = 0; i < this.pathDistanceCellIDs.length; i++) {
      if (this.pathDistanceCellIDs[i] >= 0) {
        this.cmd("SetText", this.pathDistanceCellIDs[i], "");
        this.cmd("SetBackgroundColor", this.pathDistanceCellIDs[i], "#ffffff");
      }
    }
  }
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

BellmanFordVisualization.prototype.buildPathIndices = function (
  vertexIndex,
  parent,
  startIndex
) {
  var indices = [];
  var current = vertexIndex;
  var guard = 0;

  while (current !== -1 && guard <= parent.length) {
    indices.push(current);
    if (current === startIndex) {
      break;
    }
    current = parent[current];
    guard++;
  }

  if (indices.length === 0 || indices[indices.length - 1] !== startIndex) {
    return [];
  }

  indices.reverse();
  return indices;
};

BellmanFordVisualization.prototype.setPathRowHighlight = function (
  index,
  active
) {
  if (
    !this.pathVertexCellIDs ||
    index < 0 ||
    index >= this.pathVertexCellIDs.length
  ) {
    return;
  }

  var color = active
    ? BellmanFordVisualization.PATH_TABLE_HIGHLIGHT_COLOR
    : "#ffffff";
  var cells = [
    this.pathVertexCellIDs[index],
    this.pathRouteCellIDs ? this.pathRouteCellIDs[index] : -1,
    this.pathDistanceCellIDs ? this.pathDistanceCellIDs[index] : -1,
  ];

  for (var i = 0; i < cells.length; i++) {
    if (cells[i] !== undefined && cells[i] >= 0) {
      this.cmd("SetBackgroundColor", cells[i], color);
    }
  }
};

BellmanFordVisualization.prototype.flashPath = function (
  pathIndices,
  dist
) {
  if (!pathIndices || pathIndices.length === 0) {
    return;
  }

  var edges = [];
  for (var i = 0; i < pathIndices.length; i++) {
    this.highlightVertex(
      pathIndices[i],
      BellmanFordVisualization.NODE_ACTIVE_COLOR,
      false
    );
  }

  for (var j = 0; j < pathIndices.length - 1; j++) {
    var from = pathIndices[j];
    var to = pathIndices[j + 1];
    if (this.graphHasEdge(from, to)) {
      this.highlightEdge(from, to, true);
      edges.push({ from: from, to: to });
    }
  }

  this.cmd("Step");

  for (j = 0; j < edges.length; j++) {
    this.highlightEdge(edges[j].from, edges[j].to, false);
  }

  for (i = 0; i < pathIndices.length; i++) {
    if (!dist || dist[pathIndices[i]] !== Infinity) {
      this.highlightVertex(
        pathIndices[i],
        BellmanFordVisualization.NODE_VISITED_COLOR,
        true
      );
    }
  }
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
    var pathIndices = this.buildPathIndices(i, parent, startIndex);
    if (!pathText || pathText.length === 0 || pathIndices.length === 0) {
      continue;
    }

    var distanceText = this.formatDistance(dist[i]);

    this.setPathRowHighlight(i, true);
    if (this.pathRouteCellIDs && this.pathRouteCellIDs[i] >= 0) {
      this.cmd("SetText", this.pathRouteCellIDs[i], pathText);
    }
    if (this.pathDistanceCellIDs && this.pathDistanceCellIDs[i] >= 0) {
      this.cmd("SetText", this.pathDistanceCellIDs[i], distanceText);
    }

    this.cmd("Step");
    this.flashPath(pathIndices, dist);
    this.setPathRowHighlight(i, false);
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
      this.cmd(
        "SetTextStyle",
        this.codeID[this.currentCodeLine][j],
        BellmanFordVisualization.CODE_FONT
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
      this.cmd(
        "SetTextStyle",
        this.codeID[line][k],
        BellmanFordVisualization.CODE_HIGHLIGHT_FONT
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

  var vertexCount = BellmanFordVisualization.VERTEX_DATA.length;
  var startLabel = BellmanFordVisualization.VERTEX_DATA[startIndex].label;

  this.updateIterationDisplay(0, vertexCount - 1, "Setup phase");
  this.updateStatus(
    "Initialization",
    "Set dist[*] = " +
      this.infinitySymbol +
      " and parent[*] = -1. Starting from vertex " +
      startLabel +
      "."
  );
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
  this.updateWeightLabel(
    startIndex,
    this.formatDistance(0),
    BellmanFordVisualization.WEIGHT_LABEL_POSITIVE_COLOR
  );
  this.cmd("Step");
  this.updateDistanceCell(startIndex, 0, false);
  this.updateWeightLabel(
    startIndex,
    this.formatDistance(0),
    BellmanFordVisualization.WEIGHT_LABEL_COLOR
  );

  this.updateStatus(
    "Source ready",
    "dist[" + startLabel + "] = 0 while all other vertices remain at " +
      this.infinitySymbol +
      "."
  );
  this.highlightVertex(
    startIndex,
    BellmanFordVisualization.NODE_ACTIVE_COLOR,
    false
  );
  this.cmd("Step");
  this.highlightVertex(
    startIndex,
    BellmanFordVisualization.NODE_VISITED_COLOR,
    true
  );
  this.cmd("Step");

  for (var iteration = 1; iteration <= vertexCount - 1; iteration++) {
    this.updateIterationDisplay(iteration, vertexCount - 1);
    this.updateStatus(
      "Pass " + iteration + ": relax every edge",
      "Scan each edge and update distances when we find a shorter path."
    );
    this.cmd("Step");

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
      var previousDist = dist[v];
      var canRelax =
        dist[u] !== Infinity && dist[u] + weight < previousDist;
      this.showRelaxationOnNode(
        u,
        v,
        weight,
        dist[u],
        previousDist,
        canRelax
      );
      this.updateStatus(
        "Consider edge " +
          fromLabel +
          " → " +
          toLabel +
          " (w=" +
          weight +
          ")",
        this.describeRelaxation(
          fromLabel,
          toLabel,
          dist[u],
          weight,
          previousDist,
          canRelax
        ),
        !canRelax
      );
      this.cmd("Step");

      if (canRelax) {
        this.highlightCodeLine(10);
        dist[v] = dist[u] + weight;
        this.showRelaxationOnNode(
          u,
          v,
          weight,
          dist[u],
          previousDist,
          canRelax,
          dist[v]
        );
        this.updateDistanceCell(v, dist[v], true);
        this.cmd("Step");
        this.updateDistanceCell(v, dist[v], false);

        this.highlightVertex(
          v,
          BellmanFordVisualization.NODE_ACTIVE_COLOR,
          false
        );
        this.cmd("Step");
        this.highlightVertex(
          v,
          BellmanFordVisualization.NODE_VISITED_COLOR,
          true
        );
        this.updateWeightLabel(
          v,
          this.formatDistance(dist[v]),
          BellmanFordVisualization.WEIGHT_LABEL_COLOR
        );

        this.highlightCodeLine(11);
        parent[v] = u;
        this.updateParentCell(v, u, true);
        this.cmd("Step");
        this.updateParentCell(v, u, false);

        this.updateStatus(
          "Updated " + toLabel,
          "New distance is " +
            this.formatDistance(dist[v]) +
            " via parent " +
            fromLabel +
            "."
        );

        this.highlightCodeLine(12);
        updated = true;
        this.cmd("Step");
      } else {
        this.updateWeightLabel(
          v,
          this.formatDistance(previousDist),
          previousDist === Infinity
            ? BellmanFordVisualization.WEIGHT_LABEL_MUTED_COLOR
            : BellmanFordVisualization.WEIGHT_LABEL_COLOR
        );
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
      this.updateIterationDisplay(
        "Stable after " + iteration + " passes"
      );
      this.updateStatus(
        "No changes in pass " + iteration,
        "All distances stayed the same, so the algorithm stops early.",
        true
      );
      this.cmd("Step");
      break;
    }

    this.highlightCodeLine(16);
    this.cmd("Step");
    this.updateStatus(
      "Continue to next pass",
      "At least one edge improved a distance in pass " + iteration + "."
    );
    this.cmd("Step");
  }

  this.highlightCodeLine(17);
  this.cmd("Step");

  this.updateIterationDisplay("Cycle check");
  this.updateStatus(
    "Final check for negative cycles",
    "Run one more scan: if an edge can still relax, a negative cycle exists."
  );
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

    var priorDistTo = dist[to];
    var detectsCycle =
      dist[from] !== Infinity && dist[from] + weightCheck < priorDistTo;
    this.showRelaxationOnNode(
      from,
      to,
      weightCheck,
      dist[from],
      priorDistTo,
      detectsCycle
    );

    this.updateStatus(
      "Cycle test on " + fromLabel + " → " + toLabel,
      this.describeRelaxation(
        fromLabel,
        toLabel,
        dist[from],
        weightCheck,
        priorDistTo,
        detectsCycle
      ),
      !detectsCycle
    );
    this.cmd("Step");

    if (detectsCycle) {
      this.highlightCodeLine(19);
      negativeCycle = true;
      this.updateStatus(
        "Negative cycle detected",
        "Edge " +
          fromLabel +
          " → " +
          toLabel +
          " can still relax, so distances diverge."
      );
      this.cmd("Step");
      this.highlightEdge(from, to, false);
      break;
    }

    this.updateWeightLabel(
      to,
      this.formatDistance(priorDistTo),
      priorDistTo === Infinity
        ? BellmanFordVisualization.WEIGHT_LABEL_MUTED_COLOR
        : BellmanFordVisualization.WEIGHT_LABEL_COLOR
    );

    this.highlightCodeLine(20);
    this.highlightEdge(from, to, false);
    this.cmd("Step");
  }

  this.highlightCodeLine(21);
  this.updateIterationDisplay(
    negativeCycle ? "Negative cycle" : "Completed"
  );
  this.updateStatus(
    negativeCycle
      ? "Negative cycle detected; shortest paths are undefined."
      : "Bellman-Ford computation complete.",
    negativeCycle
      ? "Remove the cycle or adjust weights to obtain valid shortest paths."
      : "Distances are finalized; review the table or the path list below."
  );
  this.cmd("Step");

  this.highlightCodeLine(22);
  this.cmd("Step");

  this.highlightCodeLine(-1);

  if (!negativeCycle) {
    this.finalizeVertexColors(dist, startIndex);
    this.displayShortestPaths(startIndex, parent, dist);
    this.updateStatus(
      "Shortest paths ready",
      "Each reachable vertex shows the path discovered from " + startLabel + "."
    );
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

  if (this.weightLabelIDs) {
    for (var r = 0; r < this.weightLabelIDs.length; r++) {
      if (this.weightLabelIDs[r] >= 0) {
        this.updateWeightLabel(
          r,
          this.infinitySymbol,
          BellmanFordVisualization.WEIGHT_LABEL_MUTED_COLOR
        );
      }
    }
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

BellmanFordVisualization.prototype.finalizeVertexColors = function (
  dist,
  startIndex
) {
  for (var i = 0; i < dist.length; i++) {
    if (dist[i] === Infinity) {
      continue;
    }
    this.highlightVertex(
      i,
      BellmanFordVisualization.NODE_VISITED_COLOR,
      true
    );
  }

  if (dist[startIndex] === Infinity) {
    this.highlightVertex(
      startIndex,
      BellmanFordVisualization.NODE_VISITED_COLOR,
      true
    );
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

