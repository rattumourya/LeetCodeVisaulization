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
FloydWarshallVisualization.MATRIX_LEFT_X = 80;
FloydWarshallVisualization.MATRIX_CELL_WIDTH = 90;
FloydWarshallVisualization.MATRIX_CELL_HEIGHT = 50;
FloydWarshallVisualization.MATRIX_ROW_GAP = 6;
FloydWarshallVisualization.MATRIX_COLUMN_GAP = 8;
FloydWarshallVisualization.MATRIX_HEADER_FONT = "bold 20";
FloydWarshallVisualization.MATRIX_CELL_FONT = "bold 18";
FloydWarshallVisualization.MATRIX_HEADER_COLOR = "#1a237e";
FloydWarshallVisualization.MATRIX_CELL_BORDER_COLOR = "#1a237e";
FloydWarshallVisualization.MATRIX_CELL_TEXT_COLOR = "#102a43";
FloydWarshallVisualization.MATRIX_CELL_BACKGROUND = "#e8ebf8";
FloydWarshallVisualization.MATRIX_CELL_HIGHLIGHT = "#ffecb3";
FloydWarshallVisualization.MATRIX_CELL_UPDATE = "#c8e6c9";
FloydWarshallVisualization.MATRIX_HEADER_HIGHLIGHT = "#d81b60";

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

FloydWarshallVisualization.VERTEX_DATA = [
  { label: "A", x: 160, y: 360 },
  { label: "B", x: 360, y: 240 },
  { label: "C", x: 560, y: 360 },
  { label: "D", x: 360, y: 500 },
];

FloydWarshallVisualization.GRAPH_EDGES = [
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

  this.infinitySymbol = FloydWarshallVisualization.INFINITY_SYMBOL;

  this.implementAction(this.reset.bind(this), 0);
};

FloydWarshallVisualization.prototype.addControls = function () {
  this.runButton = addControlToAlgorithmBar(
    "Button",
    "Run Floyd-Warshall"
  );
  this.runButton.onclick = this.runCallback.bind(this);

  this.resetButton = addControlToAlgorithmBar("Button", "Reset Layout");
  this.resetButton.onclick = this.resetCallback.bind(this);

  this.controls.push(this.runButton, this.resetButton);
};

FloydWarshallVisualization.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

FloydWarshallVisualization.prototype.runCallback = function () {
  this.implementAction(this.runAlgorithm.bind(this), 0);
};

FloydWarshallVisualization.prototype.reset = function () {
  this.nextIndex = 0;
  this.vertexIDs = [];
  this.edgeMap = {};
  this.matrixCellIDs = [];
  this.rowHeaderIDs = [];
  this.columnHeaderIDs = [];
  this.codeID = [];
  this.currentCodeLine = -1;
  this.infoPrimaryID = -1;
  this.infoDetailID = -1;
  this.calculationID = -1;
  this.distances = [];
  this.initialDistances = [];

  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }

  return this.setup();
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
  var vertexData = FloydWarshallVisualization.VERTEX_DATA;
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
  for (var from = 0; from < FloydWarshallVisualization.GRAPH_EDGES.length; from++) {
    var edges = FloydWarshallVisualization.GRAPH_EDGES[from];
    for (var j = 0; j < edges.length; j++) {
      var edge = edges[j];
      this.edgeMap[from + "-" + edge.to] = { from: from, to: edge.to };
      this.cmd(
        "Connect",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        FloydWarshallVisualization.EDGE_COLOR,
        0,
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

FloydWarshallVisualization.prototype.createMatrix = function () {
  var n = FloydWarshallVisualization.VERTEX_DATA.length;
  this.matrixCellIDs = new Array(n);
  this.rowHeaderIDs = new Array(n);
  this.columnHeaderIDs = new Array(n);

  var rowHeight = FloydWarshallVisualization.MATRIX_CELL_HEIGHT;
  var colWidth = FloydWarshallVisualization.MATRIX_CELL_WIDTH;
  var columnGap = FloydWarshallVisualization.MATRIX_COLUMN_GAP;
  var rowGap = FloydWarshallVisualization.MATRIX_ROW_GAP;
  var top = FloydWarshallVisualization.MATRIX_TOP_Y;
  var left = FloydWarshallVisualization.MATRIX_LEFT_X;

  for (var c = 0; c < n; c++) {
    var headerID = this.nextIndex++;
    this.columnHeaderIDs[c] = headerID;
    var x =
      left +
      (c + 1) * (colWidth + columnGap) -
      (colWidth + columnGap) / 2;
    this.cmd(
      "CreateLabel",
      headerID,
      FloydWarshallVisualization.VERTEX_DATA[c].label,
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
    var rowY = top + (r + 1) * (rowHeight + rowGap);

    var rowHeaderID = this.nextIndex++;
    this.rowHeaderIDs[r] = rowHeaderID;
    this.cmd(
      "CreateLabel",
      rowHeaderID,
      FloydWarshallVisualization.VERTEX_DATA[r].label,
      left,
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
      var cellX =
        left +
        (c + 1) * (colWidth + columnGap) -
        (colWidth + columnGap) / 2;
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
  var n = FloydWarshallVisualization.VERTEX_DATA.length;
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

  for (var from = 0; from < FloydWarshallVisualization.GRAPH_EDGES.length; from++) {
    var edges = FloydWarshallVisualization.GRAPH_EDGES[from];
    for (var e = 0; e < edges.length; e++) {
      var edge = edges[e];
      distances[from][edge.to] = edge.weight;
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
  var n = FloydWarshallVisualization.VERTEX_DATA.length;
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
    var intermediateLabel = FloydWarshallVisualization.VERTEX_DATA[k].label;
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
    this.cmd("Step");

    for (var i = 0; i < n; i++) {
      this.highlightCodeLine(2);
      this.setVertexActive(i, true);
      this.setHeaderHighlight(this.rowHeaderIDs, i, true);
      this.cmd("Step");

      for (var j = 0; j < n; j++) {
        this.highlightCodeLine(3);
        this.setVertexActive(j, true);
        this.setHeaderHighlight(this.columnHeaderIDs, j, true);
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
          FloydWarshallVisualization.VERTEX_DATA[i].label +
          "][" +
          FloydWarshallVisualization.VERTEX_DATA[j].label +
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
              FloydWarshallVisualization.VERTEX_DATA[i].label +
              "][" +
              FloydWarshallVisualization.VERTEX_DATA[j].label +
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
    }

    this.setVertexActive(k, false);
    this.setHeaderHighlight(this.rowHeaderIDs, k, false);
    this.setHeaderHighlight(this.columnHeaderIDs, k, false);
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
