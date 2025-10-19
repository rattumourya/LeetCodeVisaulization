// Custom visualization for Union-Find (Disjoint Set Union) processing
// edges of an undirected graph using a 9:16 canvas layout inspired by
// other portrait graph visualizations in this repository.

function UnionFindGraph(am, w, h) {
  this.init(am, w, h);
}

UnionFindGraph.prototype = new Algorithm();
UnionFindGraph.prototype.constructor = UnionFindGraph;
UnionFindGraph.superclass = Algorithm.prototype;

UnionFindGraph.CANVAS_WIDTH = 900;
UnionFindGraph.CANVAS_HEIGHT = 1600;

UnionFindGraph.ROW1_HEIGHT = 240;
UnionFindGraph.ROW2_HEIGHT = 760;
UnionFindGraph.ROW3_HEIGHT =
  UnionFindGraph.CANVAS_HEIGHT - UnionFindGraph.ROW1_HEIGHT - UnionFindGraph.ROW2_HEIGHT;

UnionFindGraph.ROW1_CENTER_Y = UnionFindGraph.ROW1_HEIGHT / 2;
UnionFindGraph.ROW2_START_Y = UnionFindGraph.ROW1_HEIGHT;
UnionFindGraph.ROW3_START_Y =
  UnionFindGraph.ROW1_HEIGHT + UnionFindGraph.ROW2_HEIGHT;

UnionFindGraph.TITLE_Y = UnionFindGraph.ROW1_CENTER_Y - 48;
UnionFindGraph.STATUS_Y = UnionFindGraph.ROW1_CENTER_Y + 8;
UnionFindGraph.COMPONENT_Y = UnionFindGraph.STATUS_Y + 44;
UnionFindGraph.MESSAGE_Y = UnionFindGraph.COMPONENT_Y + 44;

UnionFindGraph.GRAPH_NODE_RADIUS = 22;
UnionFindGraph.GRAPH_NODE_COLOR = "#f1f5f9";
UnionFindGraph.GRAPH_NODE_BORDER = "#0b3954";
UnionFindGraph.GRAPH_NODE_TEXT = "#003049";
UnionFindGraph.HIGHLIGHT_RADIUS = UnionFindGraph.GRAPH_NODE_RADIUS;
UnionFindGraph.EDGE_COLOR = "#4a4e69";
UnionFindGraph.EDGE_THICKNESS = 3;
UnionFindGraph.EDGE_HIGHLIGHT_THICKNESS = 5;
UnionFindGraph.EDGE_ACTIVE_COLOR = "#ff9f1c";
UnionFindGraph.EDGE_UNION_COLOR = "#2a9d8f";
UnionFindGraph.EDGE_CYCLE_COLOR = "#ef476f";

UnionFindGraph.ARRAY_BASE_X = 720;
UnionFindGraph.ARRAY_COLUMN_SPACING = 90;
UnionFindGraph.ARRAY_TOP_Y = UnionFindGraph.ROW2_START_Y + 90;
UnionFindGraph.ARRAY_CELL_HEIGHT = 52;
UnionFindGraph.ARRAY_CELL_WIDTH = 64;
UnionFindGraph.ARRAY_CELL_INNER_HEIGHT = 42;
UnionFindGraph.ARRAY_HEADER_HEIGHT = UnionFindGraph.ARRAY_CELL_INNER_HEIGHT;
UnionFindGraph.ARRAY_RECT_COLOR = "#f8fafc";
UnionFindGraph.ARRAY_RECT_BORDER = "#2b2d42";
UnionFindGraph.ARRAY_RECT_HIGHLIGHT_BORDER = "#d62828";
UnionFindGraph.ARRAY_RECT_BORDER_THICKNESS = 1;
UnionFindGraph.ARRAY_RECT_HIGHLIGHT_THICKNESS = 3;
UnionFindGraph.ARRAY_TEXT_COLOR = "#2b2d42";
UnionFindGraph.ARRAY_HEADER_GAP = 20;
UnionFindGraph.BOTTOM_SECTION_GAP = 56;
UnionFindGraph.CODE_TOP_PADDING = 12;

UnionFindGraph.CODE_START_X = 120;
UnionFindGraph.CODE_LINE_HEIGHT = 32;
UnionFindGraph.CODE_STANDARD_COLOR = "#1d3557";
UnionFindGraph.CODE_HIGHLIGHT_COLOR = "#e63946";
UnionFindGraph.CODE_FONT = "bold 22";

UnionFindGraph.TITLE_COLOR = "#1d3557";
UnionFindGraph.STATUS_COLOR = "#264653";
UnionFindGraph.MESSAGE_COLOR = "#3a0ca3";
UnionFindGraph.HIGHLIGHT_COLOR = "#ff3b30";

UnionFindGraph.COMPONENT_COLORS = [
  "#fde2e4",
  "#cdeac0",
  "#bee1e6",
  "#fff1e6",
  "#e2ece9",
  "#fdecc8",
  "#d8e2dc",
  "#f0efeb",
  "#cddafd",
  "#e7c6ff"
];

UnionFindGraph.CODE_LINES = [
  ["int find(int x) {"],
  ["    if (parent[x] != x) {"],
  ["        parent[x] = find(parent[x]);"],
  ["    }"],
  ["    return parent[x];"],
  ["}"],
  [""],
  ["void unionSets(int a, int b) {"],
  ["    int rootA = find(a);"],
  ["    int rootB = find(b);"],
  ["    if (rootA == rootB) {"],
  ["        // already connected"],
  ["        return;"],
  ["    }"],
  ["    if (rank[rootA] < rank[rootB]) {"],
  ["        swap(rootA, rootB);"],
  ["    }"],
  ["    parent[rootB] = rootA;"],
  ["    if (rank[rootA] == rank[rootB]) {"],
  ["        rank[rootA]++;"],
  ["    }"],
  ["}"],
  [""],
  ["for (Edge e : edges) {"],
  ["    unionSets(e.u, e.v);"],
  ["}"],
];

UnionFindGraph.TEMPLATE_ALLOWED = [
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

UnionFindGraph.EDGE_CURVES = [
  [0, 0, -0.4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0.4, 0, 0, 0, 0, -0.35, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0.35, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

UnionFindGraph.prototype.init = function (am, w, h) {
  UnionFindGraph.superclass.init.call(this, am, w, h);

  this.controls = [];
  this.addControls();

  this.vertexLabels = [];
  this.vertexPositions = [];
  this.adjacencyList = [];
  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};
  this.edgeCurveOverrides = {};
  this.vertexIDs = [];
  this.parentRectIDs = [];
  this.rankRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.codeID = [];
  this.highlightCircleID = -1;
  this.currentCodeLine = -1;
  this.edgeStatusLabelID = -1;
  this.componentLabelID = -1;
  this.statusMessageID = -1;
  this.bottomSectionTopY =
    UnionFindGraph.ROW3_START_Y + UnionFindGraph.CODE_TOP_PADDING;

  this.parent = [];
  this.rank = [];

  this.commands = [];
  this.implementAction(this.reset.bind(this), 0);
};

UnionFindGraph.prototype.addControls = function () {
  this.runButton = addControlToAlgorithmBar("Button", "Run Union-Find");
  this.runButton.onclick = this.runCallback.bind(this);

  this.newGraphButton = addControlToAlgorithmBar("Button", "New Graph");
  this.newGraphButton.onclick = this.resetCallback.bind(this);

  this.controls.push(this.runButton, this.newGraphButton);
};

UnionFindGraph.prototype.reset = function () {
  this.nextIndex = 0;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  return this.setup();
};

UnionFindGraph.prototype.setup = function () {
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

  this.resetUnionFindState();

  this.highlightCodeLine(-1);
  this.cmd("Step");
  return this.commands;
};

UnionFindGraph.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

UnionFindGraph.prototype.runCallback = function () {
  this.implementAction(this.runUnionFind.bind(this), 0);
};

UnionFindGraph.prototype.createVertexLabels = function (count) {
  var labels = [];
  var limit = Math.min(count, 26);
  for (var i = 0; i < limit; i++) {
    labels.push(String.fromCharCode(65 + i));
  }
  return labels;
};

UnionFindGraph.prototype.generateRandomGraph = function (vertexCount) {
  this.vertexPositions = this.computeTemplateLayout(vertexCount);
  this.adjacencyList = new Array(vertexCount);

  var allowed = UnionFindGraph.TEMPLATE_ALLOWED;
  var curves = UnionFindGraph.EDGE_CURVES;

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

UnionFindGraph.prototype.computeTemplateLayout = function (vertexCount) {
  var layout = [];
  var baseX = 200;
  var stepX = 130;
  var baseY = UnionFindGraph.ROW2_START_Y + 120;
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

UnionFindGraph.prototype.createTitleRow = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "Union-Find On Undirected Graph",
    UnionFindGraph.CANVAS_WIDTH / 2,
    UnionFindGraph.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, UnionFindGraph.TITLE_COLOR);

  this.edgeStatusLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.edgeStatusLabelID,
    "Processed edges: 0 / 0",
    UnionFindGraph.CANVAS_WIDTH / 2,
    UnionFindGraph.STATUS_Y,
    1
  );
  this.cmd("SetTextStyle", this.edgeStatusLabelID, "bold 24");
  this.cmd("SetForegroundColor", this.edgeStatusLabelID, UnionFindGraph.STATUS_COLOR);

  this.componentLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.componentLabelID,
    "Components: 0",
    UnionFindGraph.CANVAS_WIDTH / 2,
    UnionFindGraph.COMPONENT_Y,
    1
  );
  this.cmd("SetTextStyle", this.componentLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.componentLabelID, UnionFindGraph.STATUS_COLOR);

  this.statusMessageID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.statusMessageID,
    "Ready to run union-find",
    UnionFindGraph.CANVAS_WIDTH / 2,
    UnionFindGraph.MESSAGE_Y,
    1
  );
  this.cmd("SetTextStyle", this.statusMessageID, "bold 20");
  this.cmd("SetForegroundColor", this.statusMessageID, UnionFindGraph.MESSAGE_COLOR);
};

UnionFindGraph.prototype.createGraphArea = function () {
  this.vertexIDs = new Array(this.vertexLabels.length);
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
      UnionFindGraph.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, UnionFindGraph.GRAPH_NODE_COLOR);
    this.cmd("SetForegroundColor", id, UnionFindGraph.GRAPH_NODE_BORDER);
    this.cmd("SetTextColor", id, UnionFindGraph.GRAPH_NODE_TEXT);
    this.cmd("SetHighlight", id, 0);
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
    this.edgeStates[key] = { status: "default", color: null };
    this.edgeMeta[key] = {
      key: key,
      baseFrom: a,
      baseTo: b,
      curve: curve,
      currentFrom: a,
      currentTo: b,
      currentCurve: curve,
      directed: false,
    };
    this.renderEdgeMetaConnection(this.edgeMeta[key]);
  }

  this.highlightCircleID = this.nextIndex++;
  var startPos = this.vertexPositions[0];
  if (!startPos) {
    startPos = { x: UnionFindGraph.CANVAS_WIDTH / 2, y: UnionFindGraph.ROW2_START_Y + 120 };
  }
  this.cmd(
    "CreateHighlightCircle",
    this.highlightCircleID,
    UnionFindGraph.HIGHLIGHT_COLOR,
    startPos.x,
    startPos.y,
    UnionFindGraph.HIGHLIGHT_RADIUS
  );
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

UnionFindGraph.prototype.createArrayArea = function () {
  var parentHeaderID = this.nextIndex++;
  var rankHeaderID = this.nextIndex++;
  var headerY =
    UnionFindGraph.ARRAY_TOP_Y -
    UnionFindGraph.ARRAY_CELL_HEIGHT / 2 -
    UnionFindGraph.ARRAY_HEADER_GAP;

  this.cmd(
    "CreateLabel",
    parentHeaderID,
    "parent",
    UnionFindGraph.ARRAY_BASE_X,
    headerY
  );
  this.cmd("SetTextStyle", parentHeaderID, "bold 20");
  this.cmd("SetForegroundColor", parentHeaderID, UnionFindGraph.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    rankHeaderID,
    "rank",
    UnionFindGraph.ARRAY_BASE_X + UnionFindGraph.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", rankHeaderID, "bold 20");
  this.cmd("SetForegroundColor", rankHeaderID, UnionFindGraph.CODE_STANDARD_COLOR);

  this.parentRectIDs = new Array(this.vertexLabels.length);
  this.rankRectIDs = new Array(this.vertexLabels.length);
  this.vertexRowLabelIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rowY = UnionFindGraph.ARRAY_TOP_Y + i * UnionFindGraph.ARRAY_CELL_HEIGHT;

    var vertexLabelID = this.nextIndex++;
    this.vertexRowLabelIDs[i] = vertexLabelID;
    this.cmd(
      "CreateLabel",
      vertexLabelID,
      this.vertexLabels[i],
      UnionFindGraph.ARRAY_BASE_X - 66,
      rowY,
      0
    );
    this.cmd("SetTextStyle", vertexLabelID, "bold 20");
    this.cmd("SetForegroundColor", vertexLabelID, UnionFindGraph.STATUS_COLOR);

    var parentID = this.nextIndex++;
    this.parentRectIDs[i] = parentID;
    this.cmd(
      "CreateRectangle",
      parentID,
      "-",
      UnionFindGraph.ARRAY_CELL_WIDTH,
      UnionFindGraph.ARRAY_CELL_INNER_HEIGHT,
      UnionFindGraph.ARRAY_BASE_X,
      rowY
    );
    this.cmd("SetForegroundColor", parentID, UnionFindGraph.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", parentID, UnionFindGraph.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", parentID, UnionFindGraph.ARRAY_TEXT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      parentID,
      UnionFindGraph.ARRAY_RECT_BORDER_THICKNESS
    );

    var rankID = this.nextIndex++;
    this.rankRectIDs[i] = rankID;
    this.cmd(
      "CreateRectangle",
      rankID,
      "0",
      UnionFindGraph.ARRAY_CELL_WIDTH,
      UnionFindGraph.ARRAY_CELL_INNER_HEIGHT,
      UnionFindGraph.ARRAY_BASE_X + UnionFindGraph.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", rankID, UnionFindGraph.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", rankID, UnionFindGraph.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", rankID, UnionFindGraph.ARRAY_TEXT_COLOR);
  }

  var lastRowIndex = this.vertexLabels.length - 1;
  if (lastRowIndex >= 0) {
    var lastCenterY =
      UnionFindGraph.ARRAY_TOP_Y + lastRowIndex * UnionFindGraph.ARRAY_CELL_HEIGHT;
    var arrayBottomY =
      lastCenterY + UnionFindGraph.ARRAY_CELL_INNER_HEIGHT / 2;
    this.bottomSectionTopY =
      arrayBottomY + UnionFindGraph.BOTTOM_SECTION_GAP;
  }
};

UnionFindGraph.prototype.createCodeDisplay = function () {
  var startY = this.bottomSectionTopY + UnionFindGraph.CODE_TOP_PADDING;
  this.codeID = this.addCodeToCanvasBase(
    UnionFindGraph.CODE_LINES,
    UnionFindGraph.CODE_START_X,
    startY,
    UnionFindGraph.CODE_LINE_HEIGHT,
    UnionFindGraph.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], UnionFindGraph.CODE_FONT);
    }
  }
};

UnionFindGraph.prototype.highlightCodeLine = function (lineIndex) {
  if (this.currentCodeLine >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[this.currentCodeLine][0],
      UnionFindGraph.CODE_STANDARD_COLOR
    );
  }
  this.currentCodeLine = lineIndex;
  if (lineIndex >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[lineIndex][0],
      UnionFindGraph.CODE_HIGHLIGHT_COLOR
    );
  }
};

UnionFindGraph.prototype.resetUnionFindState = function () {
  this.parent = new Array(this.vertexLabels.length);
  this.rank = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.parent[i] = i;
    this.rank[i] = 0;
    this.updateParentCell(i);
    this.updateRankCell(i);
    if (this.vertexIDs[i]) {
      this.cmd("SetBackgroundColor", this.vertexIDs[i], UnionFindGraph.GRAPH_NODE_COLOR);
      this.cmd("SetTextColor", this.vertexIDs[i], UnionFindGraph.GRAPH_NODE_TEXT);
    }
  }

  this.resetEdgeStates();
  this.refreshComponentColors();
  this.updateEdgeStatusLabel(0, this.edgePairs.length, "");
  this.updateStatusMessage("Click \"Run Union-Find\" to process edges");
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

UnionFindGraph.prototype.updateParentCell = function (index) {
  if (index < 0 || index >= this.parentRectIDs.length) {
    return;
  }
  var parentID = this.parentRectIDs[index];
  var text = "-";
  if (this.parent && index < this.parent.length) {
    text = this.indexToLabel(this.parent[index]);
  }
  this.cmd("SetText", parentID, text);
  this.cmd("SetForegroundColor", parentID, UnionFindGraph.ARRAY_RECT_BORDER);
  this.cmd(
    "SetRectangleLineThickness",
    parentID,
    UnionFindGraph.ARRAY_RECT_BORDER_THICKNESS
  );
};

UnionFindGraph.prototype.updateRankCell = function (index) {
  if (index < 0 || index >= this.rankRectIDs.length) {
    return;
  }
  var rankID = this.rankRectIDs[index];
  var value = this.rank && index < this.rank.length ? this.rank[index] : 0;
  this.cmd("SetText", rankID, String(value));
  this.cmd("SetForegroundColor", rankID, UnionFindGraph.ARRAY_RECT_BORDER);
  this.cmd(
    "SetRectangleLineThickness",
    rankID,
    UnionFindGraph.ARRAY_RECT_BORDER_THICKNESS
  );
};

UnionFindGraph.prototype.highlightParentCell = function (index, active) {
  if (index < 0 || index >= this.parentRectIDs.length) {
    return;
  }
  var color = active
    ? UnionFindGraph.ARRAY_RECT_HIGHLIGHT_BORDER
    : UnionFindGraph.ARRAY_RECT_BORDER;
  var thickness = active
    ? UnionFindGraph.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : UnionFindGraph.ARRAY_RECT_BORDER_THICKNESS;
  var parentID = this.parentRectIDs[index];
  this.cmd("SetForegroundColor", parentID, color);
  this.cmd("SetRectangleLineThickness", parentID, thickness);
};

UnionFindGraph.prototype.highlightRankCell = function (index, active) {
  if (index < 0 || index >= this.rankRectIDs.length) {
    return;
  }
  var color = active
    ? UnionFindGraph.ARRAY_RECT_HIGHLIGHT_BORDER
    : UnionFindGraph.ARRAY_RECT_BORDER;
  var thickness = active
    ? UnionFindGraph.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : UnionFindGraph.ARRAY_RECT_BORDER_THICKNESS;
  var rankID = this.rankRectIDs[index];
  this.cmd("SetForegroundColor", rankID, color);
  this.cmd("SetRectangleLineThickness", rankID, thickness);
};

UnionFindGraph.prototype.runUnionFind = function () {
  if (!this.edgePairs || this.edgePairs.length === 0) {
    return this.commands;
  }

  this.commands = [];
  this.resetUnionFindState();
  var processed = 0;
  var total = this.edgePairs.length;

  for (var e = 0; e < this.edgePairs.length; e++) {
    var edge = this.edgePairs[e];
    var from = edge.from;
    var to = edge.to;
    var edgeLabel = this.indexToLabel(from) + "-" + this.indexToLabel(to);

    this.highlightCodeLine(23);
    this.updateEdgeStatusLabel(processed, total, edgeLabel);
    this.setEdgeHighlight(from, to, true, UnionFindGraph.EDGE_ACTIVE_COLOR);
    this.updateStatusMessage("Processing edge " + edgeLabel);
    this.cmd("Step");

    this.highlightCodeLine(24);
    this.cmd("Step");

    this.highlightCodeLine(7);
    var rootA = this.animateFind(from);
    this.highlightCodeLine(8);
    var rootB = this.animateFind(to);

    this.highlightCodeLine(9);
    this.cmd("Step");

    if (rootA === rootB) {
      this.highlightCodeLine(10);
      this.cmd("Step");
      this.highlightCodeLine(11);
      this.cmd("Step");
      this.setEdgeState(from, to, "cycle", UnionFindGraph.EDGE_CYCLE_COLOR);
      this.updateStatusMessage(
        "Edge " + edgeLabel + " forms a cycle (already connected)"
      );
      this.highlightCodeLine(12);
      this.cmd("Step");
    } else {
      this.highlightCodeLine(13);
      this.cmd("Step");
      this.highlightCodeLine(14);
      this.cmd("Step");
      if (this.rank[rootA] < this.rank[rootB]) {
        this.highlightCodeLine(15);
        this.cmd("Step");
        var temp = rootA;
        rootA = rootB;
        rootB = temp;
      }
      this.highlightCodeLine(16);
      this.cmd("Step");

      this.highlightCodeLine(17);
      this.cmd("Step");
      this.parent[rootB] = rootA;
      this.highlightParentCell(rootB, true);
      this.updateParentCell(rootB);
      this.cmd("Step");
      this.highlightParentCell(rootB, false);

      this.highlightCodeLine(18);
      this.cmd("Step");
      if (this.rank[rootA] === this.rank[rootB]) {
        this.highlightCodeLine(19);
        this.cmd("Step");
        this.rank[rootA]++;
        this.highlightRankCell(rootA, true);
        this.updateRankCell(rootA);
        this.cmd("Step");
        this.highlightRankCell(rootA, false);
      }
      this.highlightCodeLine(20);
      this.cmd("Step");

      this.setEdgeState(from, to, "union", UnionFindGraph.EDGE_UNION_COLOR);
      this.updateStatusMessage(
        "Union sets via edge " +
          edgeLabel +
          " (roots " +
          this.indexToLabel(rootA) +
          ", " +
          this.indexToLabel(rootB) +
          ")"
      );
    }

    this.highlightCodeLine(21);
    this.cmd("Step");

    this.setEdgeHighlight(from, to, false);
    processed++;
    this.updateEdgeStatusLabel(processed, total, "");
    this.refreshComponentColors();
  }

  this.highlightCodeLine(25);
  this.cmd("Step");
  this.highlightCodeLine(-1);
  this.updateEdgeStatusLabel(total, total, "complete");
  this.updateStatusMessage("All edges processed with union-find");
  this.cmd("Step");

  return this.commands;
};

UnionFindGraph.prototype.animateFind = function (vertex) {
  if (vertex < 0 || vertex >= this.parent.length) {
    return vertex;
  }
  var path = this.followParentChain(vertex);
  if (path.length === 0) {
    return vertex;
  }

  this.highlightCodeLine(0);
  this.cmd("Step");

  this.cmd("SetAlpha", this.highlightCircleID, 1);
  for (var i = 0; i < path.length; i++) {
    var index = path[i];
    var pos = this.vertexPositions[index];
    if (pos) {
      this.cmd("Move", this.highlightCircleID, pos.x, pos.y);
    }
    this.cmd("Step");
    if (i < path.length - 1) {
      this.highlightCodeLine(1);
      this.highlightParentCell(index, true);
      this.cmd("Step");
      this.highlightCodeLine(2);
      this.cmd("Step");
      this.highlightCodeLine(3);
      this.highlightParentCell(index, false);
      this.cmd("Step");
    }
  }

  var root = path[path.length - 1];
  if (path.length > 1) {
    this.highlightCodeLine(2);
    this.cmd("Step");
    for (var j = 0; j < path.length - 1; j++) {
      var node = path[j];
      this.parent[node] = root;
      this.highlightParentCell(node, true);
      this.updateParentCell(node);
      this.cmd("Step");
      this.highlightParentCell(node, false);
    }
    this.highlightCodeLine(3);
    this.cmd("Step");
  }

  this.highlightCodeLine(4);
  this.cmd("Step");
  this.cmd("SetAlpha", this.highlightCircleID, 0);
  this.highlightCodeLine(5);
  this.cmd("Step");

  return root;
};

UnionFindGraph.prototype.followParentChain = function (vertex) {
  var path = [];
  var current = vertex;
  var guard = 0;
  while (
    typeof current === "number" &&
    current >= 0 &&
    current < this.parent.length &&
    guard < 50
  ) {
    path.push(current);
    if (this.parent[current] === current) {
      break;
    }
    current = this.parent[current];
    guard++;
  }
  if (
    path.length > 0 &&
    (path[path.length - 1] !== current || path[path.length - 1] !== this.parent[current])
  ) {
    if (
      typeof current === "number" &&
      current >= 0 &&
      current < this.parent.length &&
      path[path.length - 1] !== current
    ) {
      path.push(current);
    }
  }
  return path;
};

UnionFindGraph.prototype.refreshComponentColors = function () {
  if (!this.vertexIDs) {
    return;
  }
  var colorMap = {};
  var colorIndex = 0;
  var components = {};
  for (var i = 0; i < this.parent.length; i++) {
    var root = this.findRootNoCompression(i);
    if (!colorMap.hasOwnProperty(root)) {
      colorMap[root] = this.getRootColor(colorIndex++);
    }
    components[root] = true;
    var color = colorMap[root];
    this.cmd("SetBackgroundColor", this.vertexIDs[i], color);
    this.cmd("SetTextColor", this.vertexIDs[i], UnionFindGraph.GRAPH_NODE_TEXT);
  }
  this.updateComponentLabel(Object.keys(components).length);
};

UnionFindGraph.prototype.getRootColor = function (index) {
  if (!UnionFindGraph.COMPONENT_COLORS.length) {
    return UnionFindGraph.GRAPH_NODE_COLOR;
  }
  var colorIndex = index % UnionFindGraph.COMPONENT_COLORS.length;
  return UnionFindGraph.COMPONENT_COLORS[colorIndex];
};

UnionFindGraph.prototype.resetEdgeStates = function () {
  if (!this.edgePairs) {
    return;
  }
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    var key = this.edgeKey(edge.from, edge.to);
    if (!this.edgeStates[key]) {
      this.edgeStates[key] = { status: "default", color: null };
    }
    this.edgeStates[key].status = "default";
    this.edgeStates[key].color = null;
    this.updateEdgeBaseColor(edge.from, edge.to);
    if (
      this.vertexIDs &&
      edge.from >= 0 &&
      edge.to >= 0 &&
      edge.from < this.vertexIDs.length &&
      edge.to < this.vertexIDs.length
    ) {
      this.cmd(
        "SetEdgeThickness",
        this.vertexIDs[edge.from],
        this.vertexIDs[edge.to],
        UnionFindGraph.EDGE_THICKNESS
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

UnionFindGraph.prototype.updateEdgeStatusLabel = function (processed, total, current) {
  if (this.edgeStatusLabelID < 0) {
    return;
  }
  var text = "Processed edges: " + processed + " / " + total;
  if (current && current.length > 0) {
    text += " (" + current + ")";
  }
  this.cmd("SetText", this.edgeStatusLabelID, text);
};

UnionFindGraph.prototype.updateComponentLabel = function (countOverride) {
  if (this.componentLabelID < 0) {
    return;
  }
  var count = countOverride;
  if (typeof count !== "number") {
    var roots = {};
    for (var i = 0; i < this.parent.length; i++) {
      roots[this.findRootNoCompression(i)] = true;
    }
    count = Object.keys(roots).length;
  }
  this.cmd("SetText", this.componentLabelID, "Components: " + count);
};

UnionFindGraph.prototype.updateStatusMessage = function (text) {
  if (this.statusMessageID < 0) {
    return;
  }
  this.cmd("SetText", this.statusMessageID, text);
};

UnionFindGraph.prototype.findRootNoCompression = function (vertex) {
  var current = vertex;
  var guard = 0;
  while (
    typeof current === "number" &&
    current >= 0 &&
    current < this.parent.length &&
    guard < 50
  ) {
    if (this.parent[current] === current) {
      return current;
    }
    current = this.parent[current];
    guard++;
  }
  return vertex;
};

UnionFindGraph.prototype.indexToLabel = function (index) {
  if (
    typeof index === "number" &&
    index >= 0 &&
    index < this.vertexLabels.length
  ) {
    return this.vertexLabels[index];
  }
  return String(index);
};

UnionFindGraph.prototype.edgeKey = function (a, b) {
  return a < b ? a + "-" + b : b + "-" + a;
};

UnionFindGraph.prototype.getEdgeInfo = function (from, to) {
  var a = Math.min(from, to);
  var b = Math.max(from, to);
  var key = this.edgeKey(a, b);
  var meta = this.edgeMeta ? this.edgeMeta[key] : null;
  return {
    key: key,
    fromIndex: a,
    toIndex: b,
    meta: meta,
  };
};

UnionFindGraph.prototype.getEdgeCurve = function (from, to) {
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
    UnionFindGraph.EDGE_CURVES[a] &&
    typeof UnionFindGraph.EDGE_CURVES[a][b] === "number"
  ) {
    return UnionFindGraph.EDGE_CURVES[a][b];
  }
  return 0;
};

UnionFindGraph.prototype.getEdgeBaseColorByKey = function (key) {
  var state = this.edgeStates ? this.edgeStates[key] : null;
  if (!state) {
    return UnionFindGraph.EDGE_COLOR;
  }
  if (state.status === "union") {
    return state.color || UnionFindGraph.EDGE_UNION_COLOR;
  }
  if (state.status === "cycle") {
    return state.color || UnionFindGraph.EDGE_CYCLE_COLOR;
  }
  return UnionFindGraph.EDGE_COLOR;
};

UnionFindGraph.prototype.updateEdgeBaseColor = function (from, to) {
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

UnionFindGraph.prototype.renderEdgeMetaConnection = function (meta) {
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
    0,
    ""
  );
  this.cmd(
    "SetEdgeThickness",
    this.vertexIDs[fromIndex],
    this.vertexIDs[toIndex],
    UnionFindGraph.EDGE_THICKNESS
  );
  this.cmd(
    "SetEdgeHighlight",
    this.vertexIDs[fromIndex],
    this.vertexIDs[toIndex],
    0
  );
};

UnionFindGraph.prototype.setEdgeHighlight = function (from, to, active, color) {
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
    fromIndex = meta.currentFrom;
    toIndex = meta.currentTo;
  }
  var fromID = this.vertexIDs[fromIndex];
  var toID = this.vertexIDs[toIndex];
  if (active) {
    var highlightColor = color || UnionFindGraph.EDGE_ACTIVE_COLOR;
    this.cmd("SetEdgeColor", fromID, toID, highlightColor);
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UnionFindGraph.EDGE_HIGHLIGHT_THICKNESS
    );
    this.cmd("SetEdgeHighlight", fromID, toID, 1);
  } else {
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UnionFindGraph.EDGE_THICKNESS
    );
    this.updateEdgeBaseColor(from, to);
  }
};

UnionFindGraph.prototype.setEdgeState = function (from, to, status, color) {
  var key = this.edgeKey(Math.min(from, to), Math.max(from, to));
  if (!this.edgeStates[key]) {
    this.edgeStates[key] = { status: "default", color: null };
  }
  this.edgeStates[key].status = status;
  this.edgeStates[key].color = color || null;
  this.updateEdgeBaseColor(from, to);
};

