// Custom visualization for BFS traversal on an undirected graph using a 9:16 canvas.

function UndirectedBFS(am, w, h) {
  this.init(am, w, h);
}

UndirectedBFS.prototype = new Algorithm();
UndirectedBFS.prototype.constructor = UndirectedBFS;
UndirectedBFS.superclass = Algorithm.prototype;

UndirectedBFS.CANVAS_WIDTH = 900;
UndirectedBFS.CANVAS_HEIGHT = 1600;

UndirectedBFS.ROW1_HEIGHT = 240;
UndirectedBFS.ROW2_HEIGHT = 760;
UndirectedBFS.ROW3_HEIGHT =
  UndirectedBFS.CANVAS_HEIGHT - UndirectedBFS.ROW1_HEIGHT - UndirectedBFS.ROW2_HEIGHT;

UndirectedBFS.ROW1_CENTER_Y = UndirectedBFS.ROW1_HEIGHT / 2;
UndirectedBFS.ROW2_START_Y = UndirectedBFS.ROW1_HEIGHT;
UndirectedBFS.ROW3_START_Y =
  UndirectedBFS.ROW1_HEIGHT + UndirectedBFS.ROW2_HEIGHT;

UndirectedBFS.TITLE_Y = UndirectedBFS.ROW1_CENTER_Y - 40;
UndirectedBFS.START_INFO_Y = UndirectedBFS.ROW1_CENTER_Y + 40;

UndirectedBFS.GRAPH_AREA_CENTER_X = 360;
UndirectedBFS.GRAPH_NODE_RADIUS = 22;
UndirectedBFS.GRAPH_NODE_COLOR = "#e3f2fd";
UndirectedBFS.GRAPH_NODE_BORDER = "#0b3954";
UndirectedBFS.GRAPH_NODE_TEXT = "#003049";
UndirectedBFS.GRAPH_NODE_VISITED_COLOR = "#66bb6a";
UndirectedBFS.GRAPH_NODE_VISITED_TEXT_COLOR = "#0b3d1f";
UndirectedBFS.HIGHLIGHT_RADIUS = UndirectedBFS.GRAPH_NODE_RADIUS;
UndirectedBFS.EDGE_COLOR = "#4a4e69";
UndirectedBFS.EDGE_VISITED_COLOR = "#66bb6a";
UndirectedBFS.EDGE_THICKNESS = 3;
UndirectedBFS.EDGE_HIGHLIGHT_THICKNESS = UndirectedBFS.EDGE_THICKNESS;
UndirectedBFS.BIDIRECTIONAL_CURVE = 0.35;
UndirectedBFS.BIDIRECTIONAL_EXTRA_OFFSET = 0.12;
// Minimum curvature magnitude to keep opposite-direction edges visually parallel.
UndirectedBFS.MIN_PARALLEL_SEPARATION = 0.42;
UndirectedBFS.PARALLEL_EDGE_GAP = 0.18;
UndirectedBFS.FRONTIER_BLINK_BRIGHT_ALPHA = 1;
UndirectedBFS.FRONTIER_BLINK_DIM_ALPHA = 0.7;

UndirectedBFS.ARRAY_BASE_X = 720;
UndirectedBFS.ARRAY_COLUMN_SPACING = 80;
UndirectedBFS.ARRAY_TOP_Y = UndirectedBFS.ROW2_START_Y + 90;
UndirectedBFS.ARRAY_CELL_HEIGHT = 52;
UndirectedBFS.ARRAY_CELL_WIDTH = 60;
UndirectedBFS.ARRAY_CELL_INNER_HEIGHT = 42;
UndirectedBFS.ARRAY_HEADER_HEIGHT = UndirectedBFS.ARRAY_CELL_INNER_HEIGHT;
UndirectedBFS.ARRAY_RECT_COLOR = "#f1f1f6";
UndirectedBFS.ARRAY_RECT_BORDER = "#2b2d42";
UndirectedBFS.ARRAY_RECT_HIGHLIGHT_BORDER = "#d62828";
UndirectedBFS.ARRAY_RECT_BORDER_THICKNESS = 1;
UndirectedBFS.ARRAY_RECT_HIGHLIGHT_THICKNESS = 3;
UndirectedBFS.ARRAY_TEXT_COLOR = "#2b2d42";
UndirectedBFS.ARRAY_VISITED_FILL = "#b3e5fc";
UndirectedBFS.ARRAY_HEADER_GAP = 20;
UndirectedBFS.BOTTOM_SECTION_GAP = 56;
UndirectedBFS.CODE_TOP_PADDING = 12;

UndirectedBFS.CODE_START_X = 120;
UndirectedBFS.CODE_LINE_HEIGHT = 32;
UndirectedBFS.CODE_STANDARD_COLOR = "#1d3557";
UndirectedBFS.CODE_HIGHLIGHT_COLOR = "#e63946";
UndirectedBFS.CODE_FONT = "bold 22";

UndirectedBFS.QUEUE_AREA_CENTER_X = 660;
UndirectedBFS.QUEUE_HEADER_HEIGHT = 44;
UndirectedBFS.QUEUE_LABEL_MARGIN = 14;
UndirectedBFS.QUEUE_AREA_BOTTOM_MARGIN = 30;
UndirectedBFS.QUEUE_FRAME_WIDTH = 320;
UndirectedBFS.QUEUE_FRAME_HEIGHT = 34;
UndirectedBFS.QUEUE_FRAME_MIN_HEIGHT = 22;
UndirectedBFS.QUEUE_FRAME_SPACING = 10;
UndirectedBFS.QUEUE_FRAME_MIN_SPACING = 6;
UndirectedBFS.QUEUE_RECT_COLOR = "#f8f9fa";
UndirectedBFS.QUEUE_RECT_BORDER = "#1d3557";
UndirectedBFS.QUEUE_RECT_ACTIVE_BORDER = "#e63946";
UndirectedBFS.QUEUE_TEXT_COLOR = "#1d3557";
UndirectedBFS.QUEUE_FONT = "bold 18";

UndirectedBFS.TITLE_COLOR = "#1d3557";
UndirectedBFS.START_INFO_COLOR = "#264653";
UndirectedBFS.HIGHLIGHT_COLOR = "#ff3b30";
UndirectedBFS.LEGEND_BASE_X = 80;
UndirectedBFS.LEGEND_RECT_WIDTH = 34;
UndirectedBFS.LEGEND_RECT_HEIGHT = 18;
UndirectedBFS.LEGEND_SPACING = 12;
UndirectedBFS.LEGEND_TEXT_GAP = 14;
UndirectedBFS.LEGEND_FONT = "bold 14";
UndirectedBFS.LEGEND_TEXT_COLOR = "#1d3557";
UndirectedBFS.LEGEND_DEFAULT_BASE_Y = UndirectedBFS.ROW2_START_Y + 120;

UndirectedBFS.LEVEL_COLORS = [
  "#c6e2ff",
  "#d0f4de",
  "#ffeacc",
  "#e8d7ff",
  "#f0f4c3",
  "#c8f7f4",
  "#dbe7ff",
  "#f2e7fe"
];

UndirectedBFS.CODE_LINES = [
    ["void bfs(int start) {"],
    ["    queue<int> q;"],
    ["    visited[start] = true;"],
    ["    parentArr[start] = -1;"],
    ["    q.push(start);"],
    ["    while (!q.empty()) {"],
    ["        int u = q.front();"],
    ["        q.pop();"],
    ["        for (int v : adj[u]) {"],
    ["            if (!visited[v]) {"],
    ["                visited[v] = true;"],
    ["                parentArr[v] = u;"],
    ["                q.push(v);"],
    ["            }"],
    ["        }"],
    ["    }"],
    ["}"]
  ];

UndirectedBFS.TEMPLATE_ALLOWED = [
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

UndirectedBFS.EDGE_CURVES = [
  [0, 0, -0.4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0.4, 0, 0, 0, 0, -0.35, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0.35, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

UndirectedBFS.prototype.init = function (am, w, h) {
  UndirectedBFS.superclass.init.call(this, am, w, h);

  this.controls = [];
  this.addControls();

  this.vertexLabels = [];
  this.vertexPositions = [];
  this.adjacencyList = [];
  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};
  this.edgeCurveOverrides = {};
  this.vertexLevelColors = [];
  this.vertexEdgeColors = [];
  this.vertexHighlightColors = [];
  this.vertexIDs = [];
  this.visitedRectIDs = [];
  this.parentRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.codeID = [];
  this.currentCodeLine = -1;
  this.startDisplayID = -1;
  this.queueHeaderID = -1;
  this.queueFrameIDs = [];
  this.queueContents = [];
  this.frontierHighlightIDs = {};
  this.frontierHighlightList = [];
  this.frontierBlinkStates = {};
  this.activeFrontierVertex = null;
  this.levelLegendEntries = [];
  this.levelLegendAnchorY = null;
  this.bottomSectionTopY =
    UndirectedBFS.ROW3_START_Y + UndirectedBFS.CODE_TOP_PADDING;

  this.visited = [];
  this.parentArr = [];

  this.implementAction(this.reset.bind(this), 0);
};

UndirectedBFS.prototype.addControls = function () {
  addLabelToAlgorithmBar("Start Vertex:");
  this.startField = addControlToAlgorithmBar("Text", "A");
  this.startField.size = 4;
  this.startButton = addControlToAlgorithmBar("Button", "Run BFS");
  this.startButton.onclick = this.startCallback.bind(this);
  this.startField.onkeydown = this.returnSubmit(
    this.startField,
    this.startCallback.bind(this),
    2,
    false
  );

  this.newGraphButton = addControlToAlgorithmBar("Button", "New Graph");
  this.newGraphButton.onclick = this.resetCallback.bind(this);

  this.directedGraphButton = addControlToAlgorithmBar(
    "Button",
    "Directed BFS"
  );
  this.directedGraphButton.onclick = function () {
    window.location.href = "DirectedBFS.html";
  };

  this.controls.push(
    this.startField,
    this.startButton,
    this.newGraphButton,
    this.directedGraphButton
  );
};

UndirectedBFS.prototype.reset = function () {
  this.nextIndex = 0;
  this.frontierHighlightIDs = {};
  this.frontierHighlightList = [];
  this.frontierBlinkStates = {};
  this.activeFrontierVertex = null;
  this.levelLegendEntries = [];
  this.levelLegendAnchorY = null;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  return this.setup();
};

UndirectedBFS.prototype.setup = function () {
  this.commands = [];

  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};
  this.edgeCurveOverrides = {};

  var vertexCount = 10;
  this.vertexLabels = this.createVertexLabels(vertexCount);
  this.generateRandomGraph(vertexCount);

  this.createTitleRow();
  this.createGraphArea();
  this.createArrayArea();
  this.createCodeDisplay();
  this.createQueueArea();

  this.highlightCodeLine(-1);

  if (this.startField) {
    this.setStartFieldValue(this.vertexLabels[0]);
  }

  this.cmd("Step");
  return this.commands;
};

UndirectedBFS.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

UndirectedBFS.prototype.createVertexLabels = function (count) {
  var labels = [];
  var limit = Math.min(count, 26);
  for (var i = 0; i < limit; i++) {
    labels.push(String.fromCharCode(65 + i));
  }
  return labels;
};

UndirectedBFS.prototype.generateRandomGraph = function (vertexCount) {
  this.vertexPositions = this.computeTemplateLayout(vertexCount);
  this.adjacencyList = new Array(vertexCount);

  var allowed = UndirectedBFS.TEMPLATE_ALLOWED;
  var curves = UndirectedBFS.EDGE_CURVES;

  var shuffle = function (array) {
    for (var idx = array.length - 1; idx > 0; idx--) {
      var swap = Math.floor(Math.random() * (idx + 1));
      var temp = array[idx];
      array[idx] = array[swap];
      array[swap] = temp;
    }
  };

  for (var i = 0; i < vertexCount; i++) {
    this.adjacencyList[i] = [];
  }

  var existing = {};
  var edges = [];

  var pairKey = function (a, b) {
    return a < b ? a + "-" + b : b + "-" + a;
  };

  var isAllowedPair = function (u, v) {
    return (
      allowed[u] &&
      allowed[v] &&
      allowed[u][v] &&
      allowed[v][u]
    );
  };

  var self = this;
  var addEdge = function (u, v) {
    if (u === v) {
      return false;
    }
    if (!isAllowedPair(u, v)) {
      return false;
    }
    var a = Math.min(u, v);
    var b = Math.max(u, v);
    var key = pairKey(a, b);
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
    edges.push({ from: a, to: b, curve: curve });
    existing[key] = true;
    self.adjacencyList[u].push(v);
    self.adjacencyList[v].push(u);
    return true;
  };

  for (var v = 1; v < vertexCount; v++) {
    var options = [];
    for (var u = 0; u < vertexCount; u++) {
      if (u === v) {
        continue;
      }
      if (isAllowedPair(v, u)) {
        options.push(u);
      }
    }
    if (options.length === 0) {
      continue;
    }
    shuffle(options);
    for (var n = 0; n < options.length; n++) {
      if (addEdge(v, options[n])) {
        break;
      }
    }
  }

  var edgePercent = 0.45;
  for (var i = 0; i < vertexCount; i++) {
    for (var j = i + 1; j < vertexCount; j++) {
      if (!isAllowedPair(i, j)) {
        continue;
      }
      var key = pairKey(i, j);
      if (existing[key]) {
        continue;
      }
      if (Math.random() <= edgePercent) {
        addEdge(i, j);
      }
    }
  }

  var hasCurveEdge = false;
  for (var e = 0; e < edges.length; e++) {
    if (Math.abs(edges[e].curve) > 0.01) {
      hasCurveEdge = true;
      break;
    }
  }

  if (!hasCurveEdge) {
    for (var r = 0; r < vertexCount && !hasCurveEdge; r++) {
      for (var c = r + 1; c < vertexCount && !hasCurveEdge; c++) {
        if (!isAllowedPair(r, c)) {
          continue;
        }
        var templateCurve = 0;
        if (
          curves[r] &&
          typeof curves[r][c] === "number" &&
          Math.abs(curves[r][c]) > 0.01
        ) {
          templateCurve = curves[r][c];
        }
        if (templateCurve === 0) {
          continue;
        }
        if (addEdge(r, c)) {
          hasCurveEdge = true;
        }
      }
    }
  }

  this.edgePairs = edges;
};


UndirectedBFS.prototype.computeTemplateLayout = function (vertexCount) {
  var layout = [];
  var baseX = 200;
  var stepX = 130;
  var baseY = UndirectedBFS.ROW2_START_Y + 120;
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

UndirectedBFS.prototype.createTitleRow = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "BFS Traversal On Undirected Graph",
    UndirectedBFS.CANVAS_WIDTH / 2,
    UndirectedBFS.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, UndirectedBFS.TITLE_COLOR);

  this.startDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.startDisplayID,
    "Start Vertex: A",
    UndirectedBFS.CANVAS_WIDTH / 2,
    UndirectedBFS.START_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.startDisplayID, "bold 24");
  this.cmd("SetForegroundColor", this.startDisplayID, UndirectedBFS.START_INFO_COLOR);
};

UndirectedBFS.prototype.createGraphArea = function () {
  this.vertexIDs = new Array(this.vertexLabels.length);
  this.vertexLevelColors = new Array(this.vertexLabels.length);
  this.vertexEdgeColors = new Array(this.vertexLabels.length);
  this.vertexHighlightColors = new Array(this.vertexLabels.length);
  if (!this.edgePairs) {
    this.edgePairs = [];
  }

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
      UndirectedBFS.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, UndirectedBFS.GRAPH_NODE_COLOR);
    this.cmd("SetForegroundColor", id, UndirectedBFS.GRAPH_NODE_BORDER);
    this.cmd("SetTextColor", id, UndirectedBFS.GRAPH_NODE_TEXT);
    this.cmd("SetHighlight", id, 0);
    this.vertexLevelColors[i] = null;
    this.vertexEdgeColors[i] = null;
    this.vertexHighlightColors[i] = null;
  }

  for (var e = 0; e < this.edgePairs.length; e++) {
    var pair = this.edgePairs[e];
    var a = Math.min(pair.from, pair.to);
    var b = Math.max(pair.from, pair.to);
    var curve = this.getEdgeCurve(a, b);
    pair.from = a;
    pair.to = b;
    pair.curve = curve;
    var key = this.edgeKey(a, b);
    this.edgeStates[key] = { tree: false, color: null };
    this.edgeMeta[key] = {
      key: key,
      baseFrom: a,
      baseTo: b,
      curve: curve,
      currentFrom: a,
      currentTo: b,
      currentCurve: curve,
      directed: false
    };
    this.renderEdgeMetaConnection(this.edgeMeta[key]);
  }

};

UndirectedBFS.prototype.createArrayArea = function () {
  var visitedHeaderID = this.nextIndex++;
  var parentHeaderID = this.nextIndex++;
  var headerY =
    UndirectedBFS.ARRAY_TOP_Y - UndirectedBFS.ARRAY_CELL_HEIGHT / 2 - UndirectedBFS.ARRAY_HEADER_GAP;

  this.cmd(
    "CreateLabel",
    visitedHeaderID,
    "Visited",
    UndirectedBFS.ARRAY_BASE_X,
    headerY
  );
  this.cmd("SetTextStyle", visitedHeaderID, "bold 20");
  this.cmd("SetForegroundColor", visitedHeaderID, UndirectedBFS.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    parentHeaderID,
    "parentArr",
    UndirectedBFS.ARRAY_BASE_X + UndirectedBFS.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", parentHeaderID, "bold 20");
  this.cmd("SetForegroundColor", parentHeaderID, UndirectedBFS.CODE_STANDARD_COLOR);

  this.visitedRectIDs = new Array(this.vertexLabels.length);
  this.parentRectIDs = new Array(this.vertexLabels.length);
  this.vertexRowLabelIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rowY = UndirectedBFS.ARRAY_TOP_Y + i * UndirectedBFS.ARRAY_CELL_HEIGHT;

    var vertexLabelID = this.nextIndex++;
    this.vertexRowLabelIDs[i] = vertexLabelID;
    this.cmd(
      "CreateLabel",
      vertexLabelID,
      this.vertexLabels[i],
      UndirectedBFS.ARRAY_BASE_X - 58,
      rowY,
      0
    );
    this.cmd("SetTextStyle", vertexLabelID, "bold 20");
    this.cmd("SetForegroundColor", vertexLabelID, UndirectedBFS.START_INFO_COLOR);

    var visitedID = this.nextIndex++;
    this.visitedRectIDs[i] = visitedID;
    this.cmd(
      "CreateRectangle",
      visitedID,
      "F",
      UndirectedBFS.ARRAY_CELL_WIDTH,
      UndirectedBFS.ARRAY_CELL_INNER_HEIGHT,
      UndirectedBFS.ARRAY_BASE_X,
      rowY
    );
    this.cmd("SetForegroundColor", visitedID, UndirectedBFS.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", visitedID, UndirectedBFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", visitedID, UndirectedBFS.ARRAY_TEXT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      visitedID,
      UndirectedBFS.ARRAY_RECT_BORDER_THICKNESS
    );

    var parentID = this.nextIndex++;
    this.parentRectIDs[i] = parentID;
    this.cmd(
      "CreateRectangle",
      parentID,
      "-",
      UndirectedBFS.ARRAY_CELL_WIDTH,
      UndirectedBFS.ARRAY_CELL_INNER_HEIGHT,
      UndirectedBFS.ARRAY_BASE_X + UndirectedBFS.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", parentID, UndirectedBFS.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", parentID, UndirectedBFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", parentID, UndirectedBFS.ARRAY_TEXT_COLOR);
  }

  var lastRowIndex = this.vertexLabels.length - 1;
  if (lastRowIndex >= 0) {
    var lastCenterY =
      UndirectedBFS.ARRAY_TOP_Y + lastRowIndex * UndirectedBFS.ARRAY_CELL_HEIGHT;
    var arrayBottomY =
      lastCenterY + UndirectedBFS.ARRAY_CELL_INNER_HEIGHT / 2;
    this.bottomSectionTopY =
      arrayBottomY + UndirectedBFS.BOTTOM_SECTION_GAP;
  }
};

UndirectedBFS.prototype.setVisitedCellHighlight = function (index, active) {
  if (index < 0 || index >= this.visitedRectIDs.length) {
    return;
  }
  var color = active
    ? UndirectedBFS.ARRAY_RECT_HIGHLIGHT_BORDER
    : UndirectedBFS.ARRAY_RECT_BORDER;
  var thickness = active
    ? UndirectedBFS.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : UndirectedBFS.ARRAY_RECT_BORDER_THICKNESS;
  var rectID = this.visitedRectIDs[index];
  this.cmd("SetForegroundColor", rectID, color);
  this.cmd("SetRectangleLineThickness", rectID, thickness);
};

UndirectedBFS.prototype.createCodeDisplay = function () {
  var startY = this.bottomSectionTopY + UndirectedBFS.CODE_TOP_PADDING;
  this.codeID = this.addCodeToCanvasBase(
    UndirectedBFS.CODE_LINES,
    UndirectedBFS.CODE_START_X,
    startY,
    UndirectedBFS.CODE_LINE_HEIGHT,
    UndirectedBFS.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], UndirectedBFS.CODE_FONT);
    }
  }
};

UndirectedBFS.prototype.computeQueueLayout = function (frameCount) {
  var layout = {
    height: UndirectedBFS.QUEUE_FRAME_HEIGHT,
    spacing: UndirectedBFS.QUEUE_FRAME_SPACING,
    startY:
      this.bottomSectionTopY +
      UndirectedBFS.QUEUE_HEADER_HEIGHT +
      UndirectedBFS.QUEUE_LABEL_MARGIN +
      UndirectedBFS.QUEUE_FRAME_HEIGHT / 2
  };

  if (frameCount <= 0) {
    return layout;
  }

  var availableHeight =
    UndirectedBFS.CANVAS_HEIGHT -
    (this.bottomSectionTopY +
      UndirectedBFS.QUEUE_HEADER_HEIGHT +
      UndirectedBFS.QUEUE_LABEL_MARGIN +
      UndirectedBFS.QUEUE_AREA_BOTTOM_MARGIN);

  if (availableHeight <= 0) {
    return layout;
  }

  var spacing = frameCount === 1 ? 0 : layout.spacing;
  var height = Math.min(
    UndirectedBFS.QUEUE_FRAME_HEIGHT,
    Math.max(
      UndirectedBFS.QUEUE_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    )
  );

  var totalHeight = height * frameCount + spacing * (frameCount - 1);
  if (totalHeight > availableHeight) {
    spacing = Math.max(
      UndirectedBFS.QUEUE_FRAME_MIN_SPACING,
      Math.floor(
        (availableHeight - height * frameCount) / Math.max(1, frameCount - 1)
      )
    );
    if (spacing < 0) {
      spacing = 0;
    }
    height = Math.max(
      UndirectedBFS.QUEUE_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    );
  }

  layout.height = height;
  layout.spacing = spacing;
  layout.startY =
    this.bottomSectionTopY +
    UndirectedBFS.QUEUE_HEADER_HEIGHT +
    UndirectedBFS.QUEUE_LABEL_MARGIN +
    height / 2;

  return layout;
};

UndirectedBFS.prototype.createQueueArea = function () {
  var frameCount = this.vertexLabels.length;
  var layout = this.computeQueueLayout(frameCount);

  this.queueHeaderID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.queueHeaderID,
    "Queue",
    UndirectedBFS.QUEUE_AREA_CENTER_X,
    this.bottomSectionTopY + UndirectedBFS.QUEUE_HEADER_HEIGHT / 2,
    0
  );
  this.cmd(
    "SetForegroundColor",
    this.queueHeaderID,
    UndirectedBFS.CODE_STANDARD_COLOR
  );
  this.cmd("SetTextStyle", this.queueHeaderID, "bold 22");

  this.queueFrameIDs = [];
  var y = layout.startY;

  for (var i = 0; i < frameCount; i++) {
    var rectID = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      UndirectedBFS.QUEUE_FRAME_WIDTH,
      layout.height,
      UndirectedBFS.QUEUE_AREA_CENTER_X,
      y
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      UndirectedBFS.QUEUE_RECT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, UndirectedBFS.QUEUE_RECT_BORDER);
    this.cmd("SetAlpha", rectID, 0);
    this.cmd("SetTextColor", rectID, UndirectedBFS.QUEUE_TEXT_COLOR);
    this.cmd("SetTextStyle", rectID, UndirectedBFS.QUEUE_FONT);

    this.queueFrameIDs.push(rectID);
    y += layout.height + layout.spacing;
  }

  this.resetQueueArea();
};

UndirectedBFS.prototype.resetQueueArea = function () {
  this.queueContents = [];
  for (var i = 0; i < this.queueFrameIDs.length; i++) {
    var frameID = this.queueFrameIDs[i];
    this.cmd("SetAlpha", frameID, 0);
    this.cmd("SetText", frameID, "");
    this.cmd("SetForegroundColor", frameID, UndirectedBFS.QUEUE_RECT_BORDER);
  }
};

UndirectedBFS.prototype.updateQueueDisplay = function () {
  var frontHighlightColor = UndirectedBFS.QUEUE_RECT_ACTIVE_BORDER;
  var defaultColor = UndirectedBFS.QUEUE_RECT_BORDER;
  for (var i = 0; i < this.queueFrameIDs.length; i++) {
    var frameID = this.queueFrameIDs[i];
    if (i < this.queueContents.length) {
      var vertexIndex = this.queueContents[i];
      var label =
        vertexIndex >= 0 && vertexIndex < this.vertexLabels.length
          ? this.vertexLabels[vertexIndex]
          : "";
      this.cmd("SetText", frameID, label);
      this.cmd("SetAlpha", frameID, 1);
    } else {
      this.cmd("SetText", frameID, "");
      this.cmd("SetAlpha", frameID, 0);
    }

    if (i === 0 && this.queueContents.length > 0) {
      this.cmd("SetForegroundColor", frameID, frontHighlightColor);
    } else {
      this.cmd("SetForegroundColor", frameID, defaultColor);
    }
  }
};

UndirectedBFS.prototype.enqueueQueueVertex = function (vertexIndex) {
  this.queueContents.push(vertexIndex);
  this.updateQueueDisplay();
};

UndirectedBFS.prototype.dequeueQueueVertex = function () {
  if (this.queueContents.length === 0) {
    return -1;
  }
  var vertexIndex = this.queueContents.shift();
  this.updateQueueDisplay();
  return vertexIndex;
};

UndirectedBFS.prototype.clearFrontierHighlights = function () {
  if (!this.frontierHighlightList) {
    this.frontierHighlightList = [];
  }
  for (var i = 0; i < this.frontierHighlightList.length; i++) {
    var circleID = this.frontierHighlightList[i];
    this.cmd("Delete", circleID);
  }
  this.frontierHighlightList = [];
  this.frontierHighlightIDs = {};
  this.frontierBlinkStates = {};
  this.activeFrontierVertex = null;
};

UndirectedBFS.prototype.createHighlightCircleAtPosition = function (
  x,
  y,
  color
) {
  if (typeof x !== "number" || typeof y !== "number") {
    return -1;
  }
  var circleID = this.nextIndex++;
  var highlightColor =
    typeof color === "string" && color.length > 0
      ? color
      : UndirectedBFS.HIGHLIGHT_COLOR;
  this.cmd(
    "CreateHighlightCircle",
    circleID,
    highlightColor,
    Math.round(x),
    Math.round(y),
    UndirectedBFS.HIGHLIGHT_RADIUS
  );
  this.cmd("SetAlpha", circleID, 1);
  if (!this.frontierHighlightList) {
    this.frontierHighlightList = [];
  }
  this.frontierHighlightList.push(circleID);
  return circleID;
};

UndirectedBFS.prototype.ensureFrontierHighlight = function (vertexIndex) {
  if (!this.frontierHighlightIDs) {
    this.frontierHighlightIDs = {};
  }
  if (typeof this.frontierHighlightIDs[vertexIndex] !== "undefined") {
    return this.frontierHighlightIDs[vertexIndex];
  }
  var position = this.vertexPositions[vertexIndex];
  if (!position) {
    return -1;
  }
  var highlightColor = this.getVertexHighlightColor(vertexIndex);
  var circleID = this.createHighlightCircleAtPosition(
    position.x,
    position.y,
    highlightColor
  );
  if (circleID !== -1) {
    this.frontierHighlightIDs[vertexIndex] = circleID;
  }
  return circleID;
};

UndirectedBFS.prototype.setFrontierHighlightColor = function (
  vertexIndex,
  color
) {
  if (typeof vertexIndex !== "number") {
    return;
  }
  if (!this.frontierHighlightIDs) {
    this.frontierHighlightIDs = {};
  }
  var circleID = this.frontierHighlightIDs[vertexIndex];
  if (typeof circleID === "undefined") {
    circleID = this.ensureFrontierHighlight(vertexIndex);
  }
  if (circleID === -1) {
    return;
  }
  var targetColor =
    typeof color === "string" && color.length > 0
      ? color
      : this.getVertexHighlightColor(vertexIndex);
  this.cmd("SetForegroundColor", circleID, targetColor);
};

UndirectedBFS.prototype.createFrontierHighlightFromParent = function (
  parentIndex,
  vertexIndex
) {
  if (!this.frontierHighlightIDs) {
    this.frontierHighlightIDs = {};
  }
  if (typeof this.frontierHighlightIDs[vertexIndex] !== "undefined") {
    return this.frontierHighlightIDs[vertexIndex];
  }

  var parentPos = this.vertexPositions[parentIndex];
  var childPos = this.vertexPositions[vertexIndex];
  if (!parentPos || !childPos) {
    return -1;
  }

  var highlightColor = this.getVertexHighlightColor(vertexIndex);
  var circleID = this.createHighlightCircleAtPosition(
    parentPos.x,
    parentPos.y,
    highlightColor
  );
  if (circleID === -1) {
    return -1;
  }

  var preferKey = this.edgeKey(parentIndex, vertexIndex);
  this.animateHighlightTraversal(circleID, parentIndex, vertexIndex, preferKey);
  this.frontierHighlightIDs[vertexIndex] = circleID;
  return circleID;
};

UndirectedBFS.prototype.removeFrontierHighlight = function (vertexIndex) {
  if (!this.frontierHighlightIDs) {
    this.frontierHighlightIDs = {};
  }
  var circleID = this.frontierHighlightIDs[vertexIndex];
  if (typeof circleID === "undefined") {
    return -1;
  }
  if (this.frontierBlinkStates) {
    delete this.frontierBlinkStates[vertexIndex];
  }
  delete this.frontierHighlightIDs[vertexIndex];
  if (this.frontierHighlightList) {
    for (var i = 0; i < this.frontierHighlightList.length; i++) {
      if (this.frontierHighlightList[i] === circleID) {
        this.frontierHighlightList.splice(i, 1);
        break;
      }
    }
  }
  this.cmd("SetAlpha", circleID, 0);
  return circleID;
};

UndirectedBFS.prototype.setActiveFrontierVertex = function (vertexIndex) {
  this.activeFrontierVertex = typeof vertexIndex === "number" ? vertexIndex : null;
  if (typeof this.activeFrontierVertex !== "number") {
    return;
  }
  if (!this.frontierBlinkStates) {
    this.frontierBlinkStates = {};
  }
  var circleID = this.ensureFrontierHighlight(this.activeFrontierVertex);
  if (circleID === -1) {
    this.activeFrontierVertex = null;
    return;
  }
  this.setFrontierHighlightColor(
    this.activeFrontierVertex,
    UndirectedBFS.HIGHLIGHT_COLOR
  );
  this.frontierBlinkStates[this.activeFrontierVertex] = "bright";
  this.cmd(
    "SetAlpha",
    circleID,
    UndirectedBFS.FRONTIER_BLINK_BRIGHT_ALPHA
  );
};

UndirectedBFS.prototype.toggleFrontierBlink = function (vertexIndex) {
  if (typeof vertexIndex !== "number") {
    return;
  }
  if (!this.frontierBlinkStates) {
    this.frontierBlinkStates = {};
  }
  var circleID = this.frontierHighlightIDs[vertexIndex];
  if (typeof circleID === "undefined") {
    circleID = this.ensureFrontierHighlight(vertexIndex);
    if (circleID === -1) {
      return;
    }
  }
  var currentState = this.frontierBlinkStates[vertexIndex];
  var nextState = currentState === "dim" ? "bright" : "dim";
  var nextAlpha =
    nextState === "bright"
      ? UndirectedBFS.FRONTIER_BLINK_BRIGHT_ALPHA
      : UndirectedBFS.FRONTIER_BLINK_DIM_ALPHA;
  this.frontierBlinkStates[vertexIndex] = nextState;
  this.cmd("SetAlpha", circleID, nextAlpha);
};

UndirectedBFS.prototype.stepWithActiveBlink = function () {
  if (typeof this.activeFrontierVertex === "number") {
    this.toggleFrontierBlink(this.activeFrontierVertex);
  }
  this.cmd("Step");
};

UndirectedBFS.prototype.finishActiveFrontierVertex = function () {
  if (typeof this.activeFrontierVertex !== "number") {
    return -1;
  }
  var vertexIndex = this.activeFrontierVertex;
  this.activeFrontierVertex = null;
  return this.removeFrontierHighlight(vertexIndex);
};

UndirectedBFS.prototype.removeFrontierHighlightsForLevel = function (vertexList) {
  if (!vertexList || vertexList.length === 0) {
    return;
  }
  var deleted = [];
  for (var i = 0; i < vertexList.length; i++) {
    var circleID = this.removeFrontierHighlight(vertexList[i]);
    if (circleID !== -1) {
      deleted.push(circleID);
    }
  }
  vertexList.length = 0;
  if (deleted.length > 0) {
    this.cmd("Step");
    for (var j = 0; j < deleted.length; j++) {
      this.cmd("Delete", deleted[j]);
    }
  }
};

UndirectedBFS.prototype.highlightCodeLine = function (lineIndex) {
  if (this.currentCodeLine >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[this.currentCodeLine][0],
      UndirectedBFS.CODE_STANDARD_COLOR
    );
  }
  this.currentCodeLine = lineIndex;
  if (lineIndex >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[lineIndex][0],
      UndirectedBFS.CODE_HIGHLIGHT_COLOR
    );
  }
};

UndirectedBFS.prototype.clearTraversalState = function () {
  this.clearFrontierHighlights();
  this.resetLevelLegends();
  this.visited = new Array(this.vertexLabels.length);
  this.parentArr = new Array(this.vertexLabels.length);
  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.visited[i] = false;
    this.parentArr[i] = null;
    if (this.vertexLevelColors && i < this.vertexLevelColors.length) {
      this.vertexLevelColors[i] = null;
    }
    if (this.vertexEdgeColors && i < this.vertexEdgeColors.length) {
      this.vertexEdgeColors[i] = null;
    }
    if (
      this.vertexHighlightColors &&
      i < this.vertexHighlightColors.length
    ) {
      this.vertexHighlightColors[i] = null;
    }
    this.cmd("SetText", this.visitedRectIDs[i], "F");
    this.cmd("SetBackgroundColor", this.visitedRectIDs[i], UndirectedBFS.ARRAY_RECT_COLOR);
    this.cmd(
      "SetForegroundColor",
      this.visitedRectIDs[i],
      UndirectedBFS.ARRAY_RECT_BORDER
    );
    this.cmd(
      "SetRectangleLineThickness",
      this.visitedRectIDs[i],
      UndirectedBFS.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", this.visitedRectIDs[i], UndirectedBFS.ARRAY_TEXT_COLOR);
    this.cmd("SetText", this.parentRectIDs[i], "-");
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[i],
      UndirectedBFS.GRAPH_NODE_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[i],
      UndirectedBFS.GRAPH_NODE_TEXT
    );
  }
  this.resetEdgeStates();
  this.clearEdgeHighlights();
  this.resetQueueArea();
};

UndirectedBFS.prototype.resetLevelLegends = function () {
  if (!this.levelLegendEntries || this.levelLegendEntries.length === 0) {
    this.levelLegendEntries = [];
    this.levelLegendAnchorY = null;
    return;
  }

  for (var i = 0; i < this.levelLegendEntries.length; i++) {
    var entry = this.levelLegendEntries[i];
    if (!entry) {
      continue;
    }
    if (typeof entry.rectID === "number") {
      this.cmd("Delete", entry.rectID);
    }
    if (typeof entry.labelID === "number") {
      this.cmd("Delete", entry.labelID);
    }
  }

  this.levelLegendEntries = [];
  this.levelLegendAnchorY = null;
};

UndirectedBFS.prototype.prepareLevelLegend = function (startIndex) {
  if (!this.levelLegendEntries) {
    this.levelLegendEntries = [];
  }

  var anchorY = null;
  if (
    this.vertexPositions &&
    startIndex >= 0 &&
    startIndex < this.vertexPositions.length &&
    this.vertexPositions[startIndex]
  ) {
    anchorY = this.vertexPositions[startIndex].y;
  }

  if (typeof anchorY !== "number") {
    anchorY = UndirectedBFS.LEGEND_DEFAULT_BASE_Y;
  }

  this.levelLegendAnchorY = anchorY;
};

UndirectedBFS.prototype.getLevelLegendY = function (depth) {
  var baseY =
    typeof this.levelLegendAnchorY === "number"
      ? this.levelLegendAnchorY
      : UndirectedBFS.LEGEND_DEFAULT_BASE_Y;
  var offset = depth * (UndirectedBFS.LEGEND_RECT_HEIGHT + UndirectedBFS.LEGEND_SPACING);
  return baseY + offset;
};

UndirectedBFS.prototype.ensureLevelLegendEntry = function (depth, color) {
  if (typeof depth !== "number" || depth < 0) {
    return;
  }

  if (!this.levelLegendEntries) {
    this.levelLegendEntries = [];
  }

  var entry = this.levelLegendEntries[depth];
  var fillColor =
    typeof color === "string" ? color : UndirectedBFS.GRAPH_NODE_COLOR;

  if (!entry) {
    var rectID = this.nextIndex++;
    var y = this.getLevelLegendY(depth);
    var x = UndirectedBFS.LEGEND_BASE_X;

    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      UndirectedBFS.LEGEND_RECT_WIDTH,
      UndirectedBFS.LEGEND_RECT_HEIGHT,
      x,
      y
    );
    this.cmd("SetForegroundColor", rectID, UndirectedBFS.GRAPH_NODE_BORDER);
    this.cmd("SetBackgroundColor", rectID, fillColor);

    var labelID = this.nextIndex++;
    var labelText = "Level " + depth;
    var labelX =
      x + UndirectedBFS.LEGEND_RECT_WIDTH / 2 + UndirectedBFS.LEGEND_TEXT_GAP;

    this.cmd("CreateLabel", labelID, labelText, labelX, y, 0);
    this.cmd("SetTextStyle", labelID, UndirectedBFS.LEGEND_FONT);
    this.cmd("SetForegroundColor", labelID, UndirectedBFS.LEGEND_TEXT_COLOR);

    entry = { rectID: rectID, labelID: labelID, color: fillColor };
    this.levelLegendEntries[depth] = entry;
    return;
  }

  if (typeof color === "string") {
    this.cmd("SetBackgroundColor", entry.rectID, fillColor);
    entry.color = fillColor;
  }
};

UndirectedBFS.prototype.clearEdgeHighlights = function () {
  if (!this.edgePairs) {
    return;
  }
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    this.highlightEdge(edge.from, edge.to, false);
  }
};

UndirectedBFS.prototype.edgeKey = function (from, to) {
  return from < to ? from + "-" + to : to + "-" + from;
};

UndirectedBFS.prototype.getEdgeInfo = function (from, to) {
  var a = Math.min(from, to);
  var b = Math.max(from, to);
  var key = this.edgeKey(a, b);
  var meta = this.edgeMeta ? this.edgeMeta[key] : null;
  var reversed = false;
  if (meta) {
    if (meta.directed) {
      reversed = from === meta.currentTo && to === meta.currentFrom;
    } else {
      reversed = from === meta.baseTo && to === meta.baseFrom;
    }
  } else {
    reversed = from > to;
  }
  return {
    key: key,
    fromIndex: a,
    toIndex: b,
    meta: meta,
    reversed: reversed
  };
};

UndirectedBFS.prototype.getEdgeCurve = function (from, to) {
  var a = Math.min(from, to);
  var b = Math.max(from, to);
  var key = this.edgeKey(a, b);
  if (
    this.edgeCurveOverrides &&
    Object.prototype.hasOwnProperty.call(this.edgeCurveOverrides, key)
  ) {
    return this.edgeCurveOverrides[key];
  }
  if (
    UndirectedBFS.EDGE_CURVES[a] &&
    typeof UndirectedBFS.EDGE_CURVES[a][b] === "number"
  ) {
    return UndirectedBFS.EDGE_CURVES[a][b];
  }
  return 0;
};

UndirectedBFS.prototype.getEdgeBaseColorByKey = function (key) {
  var baseColor = UndirectedBFS.EDGE_COLOR;
  if (this.edgeStates[key] && this.edgeStates[key].tree) {
    baseColor =
      this.edgeStates[key].color || UndirectedBFS.EDGE_VISITED_COLOR;
  }
  return baseColor;
};

UndirectedBFS.prototype.updateEdgeBaseColor = function (from, to) {
  if (
    !this.vertexIDs ||
    from < 0 ||
    to < 0 ||
    from >= this.vertexIDs.length ||
    to >= this.vertexIDs.length
  ) {
    return;
  }
  var info = this.getEdgeInfo(from, to);
  var key = info.key;
  var meta = info.meta;
  var baseColor = this.getEdgeBaseColorByKey(key);
  var fromIndex = info.fromIndex;
  var toIndex = info.toIndex;
  if (meta) {
    if (typeof meta.currentFrom === "number") {
      fromIndex = meta.currentFrom;
    }
    if (typeof meta.currentTo === "number") {
      toIndex = meta.currentTo;
    }
  }
  this.cmd(
    "SetEdgeColor",
    this.vertexIDs[fromIndex],
    this.vertexIDs[toIndex],
    baseColor
  );
};

UndirectedBFS.prototype.renderEdgeMetaConnection = function (meta) {
  if (!meta) {
    return;
  }
  if (
    !this.vertexIDs ||
    typeof meta.currentFrom !== "number" ||
    typeof meta.currentTo !== "number"
  ) {
    return;
  }
  var fromIndex = meta.currentFrom;
  var toIndex = meta.currentTo;
  var curve = typeof meta.currentCurve === "number" ? meta.currentCurve : 0;
  var color = this.getEdgeBaseColorByKey(meta.key);
  this.cmd(
    "Connect",
    this.vertexIDs[fromIndex],
    this.vertexIDs[toIndex],
    color,
    curve,
    meta.directed ? 1 : 0,
    ""
  );
  this.cmd(
    "SetEdgeThickness",
    this.vertexIDs[fromIndex],
    this.vertexIDs[toIndex],
    UndirectedBFS.EDGE_THICKNESS
  );
  this.cmd(
    "SetEdgeHighlight",
    this.vertexIDs[fromIndex],
    this.vertexIDs[toIndex],
    0
  );
};

UndirectedBFS.prototype.setEdgeDirection = function (from, to, directed) {
  var info = this.getEdgeInfo(from, to);
  var meta = info.meta;
  if (!meta) {
    return;
  }
  var desiredDirected = !!directed;
  var desiredFrom = desiredDirected ? from : meta.baseFrom;
  var desiredTo = desiredDirected ? to : meta.baseTo;
  if (
    desiredFrom < 0 ||
    desiredTo < 0 ||
    desiredFrom >= this.vertexIDs.length ||
    desiredTo >= this.vertexIDs.length
  ) {
    return;
  }

  var baseCurve = typeof meta.curve === "number" ? meta.curve : 0;
  var desiredCurve = baseCurve;
  if (desiredFrom === meta.baseTo && desiredTo === meta.baseFrom) {
    desiredCurve = -baseCurve;
  } else if (desiredFrom !== meta.baseFrom || desiredTo !== meta.baseTo) {
    desiredCurve = desiredFrom < desiredTo ? baseCurve : -baseCurve;
  }

  if (
    meta.currentFrom === desiredFrom &&
    meta.currentTo === desiredTo &&
    !!meta.directed === desiredDirected &&
    typeof meta.currentCurve === "number" &&
    Math.abs(meta.currentCurve - desiredCurve) < 0.0001
  ) {
    this.updateEdgeBaseColor(info.fromIndex, info.toIndex);
    return;
  }

  if (
    typeof meta.currentFrom === "number" &&
    typeof meta.currentTo === "number" &&
    meta.currentFrom >= 0 &&
    meta.currentTo >= 0 &&
    meta.currentFrom < this.vertexIDs.length &&
    meta.currentTo < this.vertexIDs.length
  ) {
    this.cmd(
      "Disconnect",
      this.vertexIDs[meta.currentFrom],
      this.vertexIDs[meta.currentTo]
    );
  }

  meta.currentFrom = desiredFrom;
  meta.currentTo = desiredTo;
  meta.directed = desiredDirected;
  meta.currentCurve = desiredCurve;

  this.renderEdgeMetaConnection(meta);
  this.updateEdgeBaseColor(info.fromIndex, info.toIndex);
};

UndirectedBFS.prototype.setEdgeTreeState = function (from, to, isTree, color) {
  var a = Math.min(from, to);
  var b = Math.max(from, to);
  var key = this.edgeKey(a, b);
  if (!this.edgeStates[key]) {
    this.edgeStates[key] = { tree: false, color: null };
  }
  this.edgeStates[key].tree = isTree;
  if (isTree) {
    if (typeof color === "string") {
      this.edgeStates[key].color = color;
    }
  } else {
    this.edgeStates[key].color = null;
  }
  this.updateEdgeBaseColor(a, b);
};

UndirectedBFS.prototype.resetEdgeStates = function () {
  if (!this.edgePairs) {
    return;
  }
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    var key = this.edgeKey(edge.from, edge.to);
    if (!this.edgeStates[key]) {
      this.edgeStates[key] = { tree: false, color: null };
    }
    this.edgeStates[key].tree = false;
    this.edgeStates[key].color = null;
    this.setEdgeDirection(edge.from, edge.to, false);
    this.updateEdgeBaseColor(edge.from, edge.to);
    if (
      this.vertexIDs &&
      edge.from >= 0 &&
      edge.to >= 0 &&
      edge.from < this.vertexIDs.length &&
      edge.to < this.vertexIDs.length
    ) {
      var fromID = this.vertexIDs[edge.from];
      var toID = this.vertexIDs[edge.to];
      this.cmd("SetEdgeThickness", fromID, toID, UndirectedBFS.EDGE_THICKNESS);
      this.cmd("SetEdgeHighlight", fromID, toID, 0);
    }
  }
};

UndirectedBFS.prototype.getLevelColor = function (depth) {
  var palette = UndirectedBFS.LEVEL_COLORS;
  if (!palette || palette.length === 0) {
    return UndirectedBFS.GRAPH_NODE_VISITED_COLOR;
  }
  var index = depth % palette.length;
  return palette[index];
};

UndirectedBFS.prototype.applyVertexLevelColor = function (vertexIndex, depth) {
  if (
    !this.vertexIDs ||
    vertexIndex < 0 ||
    vertexIndex >= this.vertexIDs.length
  ) {
    return UndirectedBFS.GRAPH_NODE_VISITED_COLOR;
  }
  var color = this.getLevelColor(depth);
  if (this.vertexLevelColors && vertexIndex < this.vertexLevelColors.length) {
    this.vertexLevelColors[vertexIndex] = color;
  }
  var derivedEdgeColor = this.deriveEdgeColor(color);
  if (this.vertexEdgeColors && vertexIndex < this.vertexEdgeColors.length) {
    this.vertexEdgeColors[vertexIndex] = derivedEdgeColor;
  }
  var highlightColor = this.deriveHighlightColor(derivedEdgeColor || color);
  if (
    this.vertexHighlightColors &&
    vertexIndex < this.vertexHighlightColors.length
  ) {
    this.vertexHighlightColors[vertexIndex] = highlightColor;
  }
  this.cmd(
    "SetBackgroundColor",
    this.vertexIDs[vertexIndex],
    color
  );
  this.cmd(
    "SetTextColor",
    this.vertexIDs[vertexIndex],
    UndirectedBFS.GRAPH_NODE_VISITED_TEXT_COLOR
  );
  return color;
};

UndirectedBFS.prototype.getVertexEdgeColor = function (vertexIndex) {
  if (
    this.vertexEdgeColors &&
    vertexIndex >= 0 &&
    vertexIndex < this.vertexEdgeColors.length &&
    typeof this.vertexEdgeColors[vertexIndex] === "string"
  ) {
    return this.vertexEdgeColors[vertexIndex];
  }
  if (
    this.vertexLevelColors &&
    vertexIndex >= 0 &&
    vertexIndex < this.vertexLevelColors.length
  ) {
    return this.deriveEdgeColor(this.vertexLevelColors[vertexIndex]);
  }
  return null;
};

UndirectedBFS.prototype.getVertexHighlightColor = function (vertexIndex) {
  if (
    this.vertexHighlightColors &&
    vertexIndex >= 0 &&
    vertexIndex < this.vertexHighlightColors.length &&
    typeof this.vertexHighlightColors[vertexIndex] === "string"
  ) {
    return this.vertexHighlightColors[vertexIndex];
  }
  var edgeColor = this.getVertexEdgeColor(vertexIndex);
  if (typeof edgeColor === "string" && edgeColor.length > 0) {
    return this.deriveHighlightColor(edgeColor);
  }
  if (
    this.vertexLevelColors &&
    vertexIndex >= 0 &&
    vertexIndex < this.vertexLevelColors.length &&
    typeof this.vertexLevelColors[vertexIndex] === "string"
  ) {
    return this.deriveHighlightColor(this.vertexLevelColors[vertexIndex]);
  }
  return UndirectedBFS.HIGHLIGHT_COLOR;
};

UndirectedBFS.prototype.deriveEdgeColor = function (nodeColor) {
  if (typeof nodeColor !== "string") {
    return UndirectedBFS.EDGE_VISITED_COLOR;
  }
  var rgb = this.parseHexColor(nodeColor);
  if (!rgb) {
    return nodeColor;
  }
  var hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = Math.min(1, hsl.s + 0.2);
  hsl.l = Math.max(0, Math.min(1, hsl.l - 0.18));
  var derivedRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
  return this.rgbToHex(derivedRgb.r, derivedRgb.g, derivedRgb.b);
};

UndirectedBFS.prototype.deriveHighlightColor = function (baseColor) {
  if (typeof baseColor !== "string") {
    return UndirectedBFS.HIGHLIGHT_COLOR;
  }
  var rgb = this.parseHexColor(baseColor);
  if (!rgb) {
    return baseColor;
  }
  var hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = Math.min(1, hsl.s + 0.25);
  hsl.l = Math.max(0, Math.min(1, hsl.l * 0.6));
  var derivedRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
  return this.rgbToHex(derivedRgb.r, derivedRgb.g, derivedRgb.b);
};

UndirectedBFS.prototype.parseHexColor = function (hex) {
  if (typeof hex !== "string") {
    return null;
  }
  var cleaned = hex.trim();
  if (cleaned.charAt(0) === "#") {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.length === 3) {
    cleaned =
      cleaned.charAt(0) +
      cleaned.charAt(0) +
      cleaned.charAt(1) +
      cleaned.charAt(1) +
      cleaned.charAt(2) +
      cleaned.charAt(2);
  }
  if (cleaned.length !== 6) {
    return null;
  }
  var num = parseInt(cleaned, 16);
  if (isNaN(num)) {
    return null;
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

UndirectedBFS.prototype.rgbToHex = function (r, g, b) {
  var toHex = function (value) {
    var clamped = Math.max(0, Math.min(255, Math.round(value)));
    var hex = clamped.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
};

UndirectedBFS.prototype.rgbToHsl = function (r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s;
  var l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h, s: s, l: l };
};

UndirectedBFS.prototype.hslToRgb = function (h, s, l) {
  var hue2rgb = function (p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  var r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
};

UndirectedBFS.prototype.highlightEdge = function (from, to, active) {
  if (
    !this.vertexIDs ||
    from < 0 ||
    to < 0 ||
    from >= this.vertexIDs.length ||
    to >= this.vertexIDs.length
  ) {
    return;
  }
  var info = this.getEdgeInfo(from, to);
  var meta = info.meta;
  var fromIndex = info.fromIndex;
  var toIndex = info.toIndex;
  if (meta) {
    if (meta.directed) {
      fromIndex = meta.currentFrom;
      toIndex = meta.currentTo;
    } else {
      fromIndex = meta.baseFrom;
      toIndex = meta.baseTo;
    }
  }
  var fromID = this.vertexIDs[fromIndex];
  var toID = this.vertexIDs[toIndex];
  if (active) {
    this.updateEdgeBaseColor(info.fromIndex, info.toIndex);
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UndirectedBFS.EDGE_HIGHLIGHT_THICKNESS
    );
    this.cmd("SetEdgeHighlight", fromID, toID, 1);
  } else {
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    this.cmd("SetEdgeThickness", fromID, toID, UndirectedBFS.EDGE_THICKNESS);
    this.updateEdgeBaseColor(info.fromIndex, info.toIndex);
  }
};

UndirectedBFS.prototype.animateHighlightTraversal = function (
  circleID,
  fromIndex,
  toIndex,
  preferKey
) {
  if (typeof circleID !== "number" || circleID < 0) {
    return;
  }
  if (fromIndex === toIndex) {
    return;
  }

  var startPos = this.vertexPositions[fromIndex];
  var endPos = this.vertexPositions[toIndex];
  if (!startPos || !endPos) {
    return;
  }
  var info = this.getEdgeInfo(fromIndex, toIndex);
  var meta = info.meta;

  if (!meta && typeof preferKey === "string") {
    var preferredMeta = this.edgeMeta ? this.edgeMeta[preferKey] : null;
    if (preferredMeta) {
      meta = preferredMeta;
      info = {
        key: preferKey,
        fromIndex: preferredMeta.baseFrom,
        toIndex: preferredMeta.baseTo,
        meta: preferredMeta,
        reversed:
          fromIndex === preferredMeta.baseTo &&
          toIndex === preferredMeta.baseFrom
      };
    }
  }

  var curve = 0;
  if (meta) {
    var baseCurve = typeof meta.curve === "number" ? meta.curve : 0;
    var directedCurve =
      typeof meta.currentCurve === "number" ? meta.currentCurve : baseCurve;
    if (meta.directed) {
      if (fromIndex === meta.currentFrom && toIndex === meta.currentTo) {
        curve = directedCurve;
      } else if (fromIndex === meta.currentTo && toIndex === meta.currentFrom) {
        curve = -directedCurve;
      } else if (fromIndex === meta.baseTo && toIndex === meta.baseFrom) {
        curve = -baseCurve;
      } else {
        curve = baseCurve;
      }
    } else {
      curve = baseCurve;
      if (fromIndex === meta.baseTo && toIndex === meta.baseFrom) {
        curve = -curve;
      }
    }
  }

  if (Math.abs(curve) < 0.01) {
    this.cmd("Move", circleID, Math.round(endPos.x), Math.round(endPos.y));
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
    circleID,
    Math.round(controlX),
    Math.round(controlY),
    Math.round(endPos.x),
    Math.round(endPos.y)
  );
};

UndirectedBFS.prototype.getStartFieldValue = function () {
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

UndirectedBFS.prototype.setStartFieldValue = function (text) {
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

UndirectedBFS.prototype.isWhitespaceChar = function (ch) {
  return (
    ch === " " ||
    ch === "\t" ||
    ch === "\n" ||
    ch === "\r" ||
    ch === "\f" ||
    ch === "\u00a0"
  );
};

UndirectedBFS.prototype.cleanInputLabel = function (inputLabel) {
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

UndirectedBFS.prototype.findVertexIndex = function (label) {
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

UndirectedBFS.prototype.startCallback = function () {
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

UndirectedBFS.prototype.runTraversal = function (startIndex) {
  this.commands = [];

  this.clearTraversalState();

  var startLabel = this.vertexLabels[startIndex];
  this.cmd(
    "SetText",
    this.startDisplayID,
    "Start Vertex: " + startLabel
  );

  this.bfsTraversal(startIndex);

  this.highlightCodeLine(-1);

  return this.commands;
};

UndirectedBFS.prototype.bfsTraversal = function (startIndex) {
  var queue = [];
  var vertexDepths = new Array(this.vertexLabels.length);

  this.prepareLevelLegend(startIndex);

  this.highlightCodeLine(0);
  this.cmd("Step");

  this.highlightCodeLine(1);
  this.cmd("Step");

  this.highlightCodeLine(2);
  this.setVisitedCellHighlight(startIndex, true);
  this.cmd("Step");
  if (!this.visited[startIndex]) {
    this.visited[startIndex] = true;
    this.cmd("SetText", this.visitedRectIDs[startIndex], "T");
    this.cmd(
      "SetBackgroundColor",
      this.visitedRectIDs[startIndex],
      UndirectedBFS.ARRAY_VISITED_FILL
    );
    var startColor = this.applyVertexLevelColor(startIndex, 0);
    this.ensureLevelLegendEntry(0, startColor);
    this.cmd("Step");
  }
  this.setVisitedCellHighlight(startIndex, false);

  this.highlightCodeLine(3);
  this.cmd("SetText", this.parentRectIDs[startIndex], "-");
  this.cmd("Step");

  this.highlightCodeLine(4);
  queue.push(startIndex);
  vertexDepths[startIndex] = 0;
  this.enqueueQueueVertex(startIndex);
  this.ensureFrontierHighlight(startIndex);
  this.cmd("Step");

  while (queue.length > 0) {
    this.highlightCodeLine(5);
    this.cmd("Step");

    this.highlightCodeLine(6);
    var u = queue[0];
    var uDepth = 0;
    if (typeof vertexDepths[u] === "number") {
      uDepth = vertexDepths[u];
    }
    this.setActiveFrontierVertex(u);
    this.stepWithActiveBlink();

    this.highlightCodeLine(7);
    queue.shift();
    this.dequeueQueueVertex();
    this.stepWithActiveBlink();

    this.highlightCodeLine(8);
    this.stepWithActiveBlink();

    var neighbors = this.adjacencyList[u];
    for (var i = 0; i < neighbors.length; i++) {
      var v = neighbors[i];

      var shouldHighlightEdge = !this.visited[v];
      if (shouldHighlightEdge) {
        this.highlightEdge(u, v, true);
      }
      this.stepWithActiveBlink();

      this.highlightCodeLine(9);
      this.setVisitedCellHighlight(v, true);
      this.stepWithActiveBlink();

      if (!this.visited[v]) {
        this.highlightCodeLine(10);
        this.visited[v] = true;
        this.cmd("SetText", this.visitedRectIDs[v], "T");
        this.cmd(
          "SetBackgroundColor",
          this.visitedRectIDs[v],
          UndirectedBFS.ARRAY_VISITED_FILL
        );
        var vDepth = uDepth + 1;
        vertexDepths[v] = vDepth;
        var levelColor = this.applyVertexLevelColor(v, vDepth);
        this.ensureLevelLegendEntry(vDepth, levelColor);
        this.stepWithActiveBlink();

        this.highlightCodeLine(11);
        this.parentArr[v] = u;
        this.cmd("SetText", this.parentRectIDs[v], this.vertexLabels[u]);
        var edgeColor = this.getVertexEdgeColor(v) || levelColor;
        this.setEdgeTreeState(u, v, true, edgeColor);
        this.setEdgeDirection(u, v, true);
        this.highlightEdge(u, v, true);
        this.stepWithActiveBlink();

        this.highlightCodeLine(12);
        queue.push(v);
        this.enqueueQueueVertex(v);
        this.createFrontierHighlightFromParent(u, v);
        this.stepWithActiveBlink();
      }

      this.highlightCodeLine(13);
      this.stepWithActiveBlink();

      this.setVisitedCellHighlight(v, false);
      this.highlightEdge(u, v, false);
      this.stepWithActiveBlink();

      this.highlightCodeLine(8);
      this.stepWithActiveBlink();
    }

    this.highlightCodeLine(14);
    var removedCircleID = this.finishActiveFrontierVertex();
    if (removedCircleID !== -1) {
      this.cmd("Delete", removedCircleID);
    }
    this.cmd("Step");
  }

  this.highlightCodeLine(15);
  this.cmd("Step");

  this.highlightCodeLine(16);
  this.cmd("Step");
};

UndirectedBFS.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

UndirectedBFS.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new UndirectedBFS(animManag, canvas.width, canvas.height);
}
