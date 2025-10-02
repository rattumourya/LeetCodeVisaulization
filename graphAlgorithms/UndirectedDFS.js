// Custom visualization for DFS traversal on an undirected graph with an expanded canvas.

function UndirectedDFS(am, w, h) {
  this.init(am, w, h);
}

UndirectedDFS.prototype = new Algorithm();
UndirectedDFS.prototype.constructor = UndirectedDFS;
UndirectedDFS.superclass = Algorithm.prototype;

UndirectedDFS.CANVAS_WIDTH = 880;
UndirectedDFS.CANVAS_HEIGHT = 1440;

UndirectedDFS.ROW1_HEIGHT = 240;
UndirectedDFS.ROW2_HEIGHT = 760;
UndirectedDFS.ROW3_HEIGHT =
  UndirectedDFS.CANVAS_HEIGHT - UndirectedDFS.ROW1_HEIGHT - UndirectedDFS.ROW2_HEIGHT;

UndirectedDFS.ROW1_CENTER_Y = UndirectedDFS.ROW1_HEIGHT / 2;
UndirectedDFS.ROW2_START_Y = UndirectedDFS.ROW1_HEIGHT;
UndirectedDFS.ROW3_START_Y =
  UndirectedDFS.ROW1_HEIGHT + UndirectedDFS.ROW2_HEIGHT;

UndirectedDFS.TITLE_Y = UndirectedDFS.ROW1_CENTER_Y - 40;
UndirectedDFS.START_INFO_Y = UndirectedDFS.ROW1_CENTER_Y + 40;

UndirectedDFS.GRAPH_AREA_CENTER_X = 360;
UndirectedDFS.GRAPH_NODE_RADIUS = 22;
UndirectedDFS.GRAPH_NODE_COLOR = "#e3f2fd";
UndirectedDFS.GRAPH_NODE_BORDER = "#0b3954";
UndirectedDFS.GRAPH_NODE_TEXT = "#003049";
UndirectedDFS.GRAPH_NODE_VISITED_COLOR = "#66bb6a";
UndirectedDFS.GRAPH_NODE_VISITED_TEXT_COLOR = "#0b3d1f";
UndirectedDFS.HIGHLIGHT_RADIUS = UndirectedDFS.GRAPH_NODE_RADIUS;
UndirectedDFS.EDGE_COLOR = "#4a4e69";
UndirectedDFS.EDGE_VISITED_COLOR = "#66bb6a";
UndirectedDFS.EDGE_THICKNESS = 3;

UndirectedDFS.EDGE_ACTIVE_THICKNESS = UndirectedDFS.EDGE_THICKNESS;
UndirectedDFS.EDGE_TREE_THICKNESS = 6;


UndirectedDFS.ARRAY_BASE_X = 720;
UndirectedDFS.ARRAY_COLUMN_SPACING = 80;
UndirectedDFS.ARRAY_TOP_Y = UndirectedDFS.ROW2_START_Y + 90;
UndirectedDFS.ARRAY_CELL_HEIGHT = 52;
UndirectedDFS.ARRAY_CELL_WIDTH = 60;
UndirectedDFS.ARRAY_CELL_INNER_HEIGHT = 42;
UndirectedDFS.ARRAY_HEADER_HEIGHT = UndirectedDFS.ARRAY_CELL_INNER_HEIGHT;
UndirectedDFS.ARRAY_RECT_COLOR = "#f1f1f6";
UndirectedDFS.ARRAY_RECT_BORDER = "#2b2d42";
UndirectedDFS.ARRAY_TEXT_COLOR = "#2b2d42";
UndirectedDFS.ARRAY_VISITED_FILL = "#b3e5fc";
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

// Allowed adjacency template derived from the DFS classroom visualization so
// the undirected graph reuses its well-spaced layout without overlaps.
UndirectedDFS.TEMPLATE_ALLOWED = [
  [false, true, true, false, true, false, false, true, false, false],
  [true, false, true, false, true, true, false, false, false, false],
  [true, true, false, true, false, true, true, false, false, false],
  [false, false, true, false, false, false, true, false, false, false],
  [true, true, false, false, false, true, false, true, true, false],
  [false, true, true, false, true, false, true, false, true, true],
  [false, false, true, true, false, true, false, false, false, true],
  [true, false, false, false, true, false, false, false, true, false],
  [false, false, false, false, true, true, false, true, false, true],
  [false, false, false, false, false, true, true, false, true, false],
];

// Matching curve data from the DFS classroom visualization template. Only
// entries with a non-zero magnitude will render as curved edges.
UndirectedDFS.TEMPLATE_CURVES = [
  [0, 0, -0.4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

UndirectedDFS.prototype.chooseVertexCount = function () {
  return 10;
};

UndirectedDFS.prototype.createVertexLabels = function (count) {
  var labels = [];
  for (var i = 0; i < count; i++) {
    labels.push(String.fromCharCode("A".charCodeAt(0) + i));
  }
  return labels;
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
    var key = this.edgeKey(pair.u, pair.v);
    this.edgeOrientation[key] = {
      from: pair.u,
      to: pair.v,
    };
    this.edgeStates[key] = { tree: false };
    this.edgeMeta[key] = pair;
    this.cmd(
      "Connect",
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      UndirectedDFS.EDGE_COLOR,
      pair.curve,
      0,
      ""
    );
    this.cmd(
      "SetEdgeThickness",
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      UndirectedDFS.EDGE_THICKNESS
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
      UndirectedDFS.ARRAY_BASE_X - 58,
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
    this.cmd(
      "SetTextColor",
      this.vertexIDs[i],
      UndirectedDFS.GRAPH_NODE_TEXT
    );
  }
  this.resetEdgesToUndirected();
};

UndirectedDFS.prototype.edgeKey = function (u, v) {
  return u < v ? u + "-" + v : v + "-" + u;
};

UndirectedDFS.prototype.resetEdgesToUndirected = function () {
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
      UndirectedDFS.EDGE_COLOR,
      edge.curve,
      0,
      ""
    );
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UndirectedDFS.EDGE_THICKNESS
    );
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    var edgeKey = this.edgeKey(edge.u, edge.v);
    this.edgeOrientation[edgeKey] = { from: edge.u, to: edge.v };
    this.edgeStates[edgeKey] = { tree: false };
    this.edgeMeta[edgeKey] = edge;
  }
};

UndirectedDFS.prototype.setEdgeState = function (u, v, options) {
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

UndirectedDFS.prototype.setEdgeActive = function (u, v, active) {
  var key = this.edgeKey(u, v);
  var orientation = this.edgeOrientation[key];
  if (!orientation) {
    return;
  }
  var fromID = this.vertexIDs[orientation.from];
  var toID = this.vertexIDs[orientation.to];
  var baseColor = UndirectedDFS.EDGE_COLOR;
  if (this.edgeStates[key] && this.edgeStates[key].tree) {
    baseColor = UndirectedDFS.EDGE_VISITED_COLOR;
  }

  if (active) {
    this.setEdgeState(u, v, {
      highlight: true,
      color: baseColor,
    });
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,

      UndirectedDFS.EDGE_ACTIVE_THICKNESS
    );
  } else {
    this.setEdgeState(u, v, { highlight: false, color: baseColor });
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UndirectedDFS.EDGE_THICKNESS
    );
  }
};

UndirectedDFS.prototype.animateHighlightTraversal = function (fromIndex, toIndex) {
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
    this.cmd("Move", this.highlightCircleID, endPos.x, endPos.y);
    this.cmd("Step");
    return;
  }

  var dx = endPos.x - startPos.x;
  var dy = endPos.y - startPos.y;
  var midX = (startPos.x + endPos.x) / 2;
  var midY = (startPos.y + endPos.y) / 2;
  var controlX = midX - dy * curve;
  var controlY = midY + dx * curve;

  var segments = 10;
  for (var step = 1; step <= segments; step++) {
    var t = step / segments;
    var invT = 1 - t;
    var px =
      invT * invT * startPos.x +
      2 * invT * t * controlX +
      t * t * endPos.x;
    var py =
      invT * invT * startPos.y +
      2 * invT * t * controlY +
      t * t * endPos.y;
    this.cmd("Move", this.highlightCircleID, Math.round(px), Math.round(py));
    this.cmd("Step");
  }
};

UndirectedDFS.prototype.markEdgeAsTreeEdge = function (parent, child) {
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
    UndirectedDFS.EDGE_VISITED_COLOR,
    curve,
    1,
    ""
  );
  this.cmd(
    "SetEdgeThickness",
    this.vertexIDs[parent],
    this.vertexIDs[child],

    UndirectedDFS.EDGE_TREE_THICKNESS
  );
  this.cmd(
    "SetEdgeHighlight",
    this.vertexIDs[parent],
    this.vertexIDs[child],
    1
  );
  this.edgeOrientation[key] = { from: parent, to: child };
  this.edgeStates[key] = { tree: true };
};

UndirectedDFS.prototype.computeTemplateLayout = function (vertexCount) {
  var layout = [];
  var baseX = 180;
  var stepX = 130;
  var baseY = UndirectedDFS.ROW2_START_Y + 120;
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

UndirectedDFS.prototype.generateRandomGraph = function (vertexCount) {
  this.vertexPositions = this.computeTemplateLayout(vertexCount);

  var allowed = UndirectedDFS.TEMPLATE_ALLOWED;
  var curves = UndirectedDFS.TEMPLATE_CURVES;
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

UndirectedDFS.prototype.applyVertexClamping = function (
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

UndirectedDFS.prototype.relaxVertices = function (
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

UndirectedDFS.prototype.roundVertexPositions = function () {
  for (var i = 0; i < this.vertexPositions.length; i++) {
    this.vertexPositions[i].x = Math.round(this.vertexPositions[i].x);
    this.vertexPositions[i].y = Math.round(this.vertexPositions[i].y);
  }
};

UndirectedDFS.prototype.pushVerticesAwayFromEdges = function (
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
    this.cmd(
      "SetTextColor",
      this.vertexIDs[u],
      UndirectedDFS.GRAPH_NODE_VISITED_TEXT_COLOR
    );
    this.cmd("Step");
  }

  this.highlightCodeLine(2);
  this.cmd("Step");

  var neighbors = this.adjacencyList[u];
  for (var i = 0; i < neighbors.length; i++) {
    var v = neighbors[i];
    if (v === parent) {
      continue;
    }
    this.highlightCodeLine(3);
    this.setEdgeActive(u, v, true);
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
      this.markEdgeAsTreeEdge(u, v);
      this.cmd("Step");
      this.animateHighlightTraversal(u, v);

      this.dfsVisit(v, u);

      this.animateHighlightTraversal(v, u);
    }

    this.highlightCodeLine(6);
    this.cmd("Step");

    this.setEdgeActive(u, v, false);

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
