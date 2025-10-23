// Custom visualization for Kruskal's Minimum Spanning Tree algorithm on a 9:16 canvas.

function KruskalMST(am, w, h) {
  this.init(am, w, h);
}

KruskalMST.prototype = new Algorithm();
KruskalMST.prototype.constructor = KruskalMST;
KruskalMST.superclass = Algorithm.prototype;

KruskalMST.CANVAS_WIDTH = 720;
KruskalMST.CANVAS_HEIGHT = 1280;

KruskalMST.ROW1_HEIGHT = 200;
KruskalMST.ROW2_HEIGHT = 540;
KruskalMST.ROW3_HEIGHT =
  KruskalMST.CANVAS_HEIGHT - KruskalMST.ROW1_HEIGHT - KruskalMST.ROW2_HEIGHT;

KruskalMST.TITLE_Y = 60;
KruskalMST.INFO_PANEL_CENTER_Y = 130;
KruskalMST.INFO_PANEL_WIDTH = 480;
KruskalMST.INFO_PANEL_HEIGHT = 110;
KruskalMST.MST_WEIGHT_Y = 180;

KruskalMST.GRAPH_TOP = KruskalMST.ROW1_HEIGHT;
KruskalMST.GRAPH_BOTTOM = KruskalMST.ROW1_HEIGHT + KruskalMST.ROW2_HEIGHT;
KruskalMST.GRAPH_NODE_RADIUS = 28;
KruskalMST.GRAPH_NODE_COLOR = "#f5f5ff";
KruskalMST.GRAPH_NODE_BORDER = "#1b3a4b";
KruskalMST.GRAPH_NODE_TEXT = "#1b3a4b";

KruskalMST.EDGE_COLOR = "#4a4e69";
KruskalMST.EDGE_CHECK_COLOR = "#ffb703";
KruskalMST.EDGE_ACCEPT_COLOR = "#2a9d8f";
KruskalMST.EDGE_REJECT_COLOR = "#e63946";
KruskalMST.EDGE_THICKNESS = 3;
KruskalMST.EDGE_SELECTED_THICKNESS = 5;
KruskalMST.EDGE_MST_THICKNESS = 6;

KruskalMST.INFO_PANEL_BG = "#eef1ff";
KruskalMST.INFO_PANEL_BORDER = "#264653";
KruskalMST.INFO_TEXT_COLOR = "#1d3557";
KruskalMST.TITLE_COLOR = "#14213d";

KruskalMST.CODE_START_X = 80;
KruskalMST.CODE_START_Y =
  KruskalMST.ROW1_HEIGHT + KruskalMST.ROW2_HEIGHT + 40;
KruskalMST.CODE_LINE_HEIGHT = 32;
KruskalMST.CODE_STANDARD_COLOR = "#1d3557";
KruskalMST.CODE_HIGHLIGHT_COLOR = "#e63946";
KruskalMST.CODE_FONT = "bold 22";

KruskalMST.CODE_LINES = [
  ["class KruskalMST {"],
  ["  void build(Graph g) {"],
  ["    List<Edge> edges = g.edges();"],
  ["    Collections.sort(edges);"],
  ["    for (Edge e : edges) {"],
  ["      int rootU = find(e.u);"],
  ["      int rootV = find(e.v);"],
  ["      if (rootU != rootV) {"],
  ["        mst.add(e);"],
  ["        union(rootU, rootV);"],
  ["      } else {"],
  ["        // edge would create a cycle"],
  ["      }"],
  ["    }"],
  ["  }"],
  ["}"],
];

KruskalMST.prototype.init = function (am, w, h) {
  KruskalMST.superclass.init.call(this, am, w, h);

  this.controls = [];
  this.addControls();

  this.vertexLabels = [];
  this.vertexPositions = [];
  this.vertexIDs = [];
  this.edgeList = [];
  this.edgeMap = {};
  this.infoPanelRectID = -1;
  this.infoLabelID = -1;
  this.mstWeightLabelID = -1;
  this.codeID = [];
  this.currentCodeLine = -1;
  this.currentMSTWeight = 0;

  this.implementAction(this.reset.bind(this), 0);
};

KruskalMST.prototype.addControls = function () {
  this.runButton = addControlToAlgorithmBar("Button", "Run Kruskal");
  this.runButton.onclick = this.runCallback.bind(this);

  this.newGraphButton = addControlToAlgorithmBar("Button", "New Graph");
  this.newGraphButton.onclick = this.resetCallback.bind(this);

  this.controls.push(this.runButton, this.newGraphButton);
};

KruskalMST.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

KruskalMST.prototype.runCallback = function () {
  this.implementAction(this.kruskal.bind(this), 0);
};

KruskalMST.prototype.reset = function () {
  this.nextIndex = 0;
  this.commands = [];

  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }

  return this.setup();
};

KruskalMST.prototype.setup = function () {
  this.commands = [];

  this.createBaseLayout();
  this.generateGraphData();
  this.createGraphDisplay();
  this.createCodeDisplay();
  this.updateInfoPanel("Click \"Run Kruskal\" to build the MST.");
  this.updateMSTWeightLabel(0);

  return this.commands;
};

KruskalMST.prototype.createBaseLayout = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "Kruskal's Minimum Spanning Tree",
    KruskalMST.CANVAS_WIDTH / 2,
    KruskalMST.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 36");
  this.cmd("SetForegroundColor", titleID, KruskalMST.TITLE_COLOR);

  this.infoPanelRectID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.infoPanelRectID,
    "",
    KruskalMST.INFO_PANEL_WIDTH,
    KruskalMST.INFO_PANEL_HEIGHT,
    KruskalMST.CANVAS_WIDTH / 2,
    KruskalMST.INFO_PANEL_CENTER_Y
  );
  this.cmd("SetForegroundColor", this.infoPanelRectID, KruskalMST.INFO_PANEL_BORDER);
  this.cmd("SetBackgroundColor", this.infoPanelRectID, KruskalMST.INFO_PANEL_BG);
  this.cmd("SetRectangleLineThickness", this.infoPanelRectID, 2);

  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    KruskalMST.CANVAS_WIDTH / 2,
    KruskalMST.INFO_PANEL_CENTER_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.infoLabelID, KruskalMST.INFO_TEXT_COLOR);

  this.mstWeightLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.mstWeightLabelID,
    "MST Weight: 0",
    KruskalMST.CANVAS_WIDTH / 2,
    KruskalMST.MST_WEIGHT_Y,
    1
  );
  this.cmd("SetTextStyle", this.mstWeightLabelID, "bold 20");
  this.cmd("SetForegroundColor", this.mstWeightLabelID, KruskalMST.INFO_TEXT_COLOR);
};

KruskalMST.prototype.generateGraphData = function () {
  var nodeCount = 7;
  this.vertexLabels = [];
  for (var i = 0; i < nodeCount; i++) {
    this.vertexLabels.push(String.fromCharCode(65 + i));
  }

  this.vertexPositions = this.computeRandomPositions(nodeCount);
  this.edgeList = this.generateRandomEdges(nodeCount);
};

KruskalMST.prototype.computeRandomPositions = function (nodeCount) {
  var columns = [120, 300, 480, 660];
  var rowSpacing = 180;
  var firstRowY = KruskalMST.GRAPH_TOP + 100;
  var anchors = [];

  for (var r = 0; r < 3; r++) {
    var rowY = firstRowY + r * rowSpacing;
    if (rowY > KruskalMST.GRAPH_BOTTOM - 80) {
      rowY = KruskalMST.GRAPH_BOTTOM - 80;
    }
    for (var c = 0; c < columns.length; c++) {
      anchors.push({ x: columns[c], y: rowY });
    }
  }

  this.shuffleArray(anchors);
  return anchors.slice(0, nodeCount);
};

KruskalMST.prototype.generateRandomEdges = function (nodeCount) {
  var edges = [];
  var usedPairs = {};

  var remaining = [];
  for (var i = 1; i < nodeCount; i++) {
    remaining.push(i);
  }
  var connected = [0];

  while (remaining.length > 0) {
    var fromIndex = Math.floor(Math.random() * connected.length);
    var toIndex = Math.floor(Math.random() * remaining.length);
    var u = connected[fromIndex];
    var v = remaining.splice(toIndex, 1)[0];
    connected.push(v);
    var key = this.edgeKey(u, v);
    usedPairs[key] = true;
    edges.push({ u: u, v: v, weight: this.randomWeight() });
  }

  var extraPairs = [];
  for (var a = 0; a < nodeCount; a++) {
    for (var b = a + 1; b < nodeCount; b++) {
      var pairKey = this.edgeKey(a, b);
      if (!usedPairs[pairKey]) {
        extraPairs.push({ u: a, v: b });
      }
    }
  }

  this.shuffleArray(extraPairs);
  var extraCount = Math.min(3 + Math.floor(Math.random() * 3), extraPairs.length);
  for (var e = 0; e < extraCount; e++) {
    var pair = extraPairs[e];
    var extraKey = this.edgeKey(pair.u, pair.v);
    usedPairs[extraKey] = true;
    edges.push({ u: pair.u, v: pair.v, weight: this.randomWeight() });
  }

  return edges;
};

KruskalMST.prototype.createGraphDisplay = function () {
  this.vertexIDs = new Array(this.vertexLabels.length);
  this.edgeMap = {};

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
      KruskalMST.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, KruskalMST.GRAPH_NODE_COLOR);
    this.cmd("SetForegroundColor", id, KruskalMST.GRAPH_NODE_BORDER);
    this.cmd("SetTextColor", id, KruskalMST.GRAPH_NODE_TEXT);
    this.cmd("SetHighlight", id, 0);
  }

  for (var e = 0; e < this.edgeList.length; e++) {
    var edge = this.edgeList[e];
    var key = this.edgeKey(edge.u, edge.v);
    var fromID = this.vertexIDs[edge.u];
    var toID = this.vertexIDs[edge.v];
    this.edgeMap[key] = { from: fromID, to: toID };

    this.cmd(
      "Connect",
      fromID,
      toID,
      KruskalMST.EDGE_COLOR,
      0,
      0,
      String(edge.weight)
    );
    this.cmd("SetEdgeThickness", fromID, toID, KruskalMST.EDGE_THICKNESS);
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
  }
};

KruskalMST.prototype.createCodeDisplay = function () {
  this.codeID = this.addCodeToCanvasBase(
    KruskalMST.CODE_LINES,
    KruskalMST.CODE_START_X,
    KruskalMST.CODE_START_Y,
    KruskalMST.CODE_LINE_HEIGHT,
    KruskalMST.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], KruskalMST.CODE_FONT);
    }
  }

  this.currentCodeLine = -1;
};

KruskalMST.prototype.highlightCodeLine = function (lineIndex) {
  if (this.currentCodeLine === lineIndex) {
    return;
  }

  if (this.currentCodeLine !== -1 && this.codeID[this.currentCodeLine]) {
    for (var j = 0; j < this.codeID[this.currentCodeLine].length; j++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[this.currentCodeLine][j],
        KruskalMST.CODE_STANDARD_COLOR
      );
    }
  }

  this.currentCodeLine = lineIndex;

  if (lineIndex >= 0 && this.codeID[lineIndex]) {
    for (var k = 0; k < this.codeID[lineIndex].length; k++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[lineIndex][k],
        KruskalMST.CODE_HIGHLIGHT_COLOR
      );
    }
  }
};

KruskalMST.prototype.updateInfoPanel = function (text) {
  if (this.infoLabelID !== -1) {
    this.cmd("SetText", this.infoLabelID, text);
  }
};

KruskalMST.prototype.updateMSTWeightLabel = function (weight) {
  this.currentMSTWeight = weight;
  if (this.mstWeightLabelID !== -1) {
    this.cmd(
      "SetText",
      this.mstWeightLabelID,
      "MST Weight: " + weight
    );
  }
};

KruskalMST.prototype.kruskal = function () {
  this.commands = [];
  this.highlightCodeLine(-1);
  this.clearNodeHighlights();
  this.resetEdgeStyles();
  this.updateMSTWeightLabel(0);

  var sortedEdges = this.edgeList.slice(0);
  var self = this;
  sortedEdges.sort(function (a, b) {
    if (a.weight !== b.weight) {
      return a.weight - b.weight;
    }
    var labelA = self.vertexLabels[a.u] + self.vertexLabels[a.v];
    var labelB = self.vertexLabels[b.u] + self.vertexLabels[b.v];
    return labelA < labelB ? -1 : labelA > labelB ? 1 : 0;
  });

  var parent = [];
  var rank = [];
  for (var i = 0; i < this.vertexLabels.length; i++) {
    parent[i] = i;
    rank[i] = 0;
  }

  this.highlightCodeLine(2);
  this.updateInfoPanel("Collecting the edges from the graph.");
  this.cmd("Step");

  this.highlightCodeLine(3);
  this.updateInfoPanel("Sorting edges by ascending weight.");
  this.cmd("Step");

  var mstWeight = 0;

  for (var e = 0; e < sortedEdges.length; e++) {
    var edge = sortedEdges[e];
    var u = edge.u;
    var v = edge.v;
    var weight = edge.weight;
    var label =
      this.vertexLabels[u] +
      "-" +
      this.vertexLabels[v] +
      " (" +
      weight +
      ")";

    this.highlightCodeLine(4);
    this.updateInfoPanel("Considering edge " + label + ".");
    this.setEdgeStyle(u, v, {
      color: KruskalMST.EDGE_CHECK_COLOR,
      thickness: KruskalMST.EDGE_SELECTED_THICKNESS,
      highlight: true,
    });
    this.cmd("SetHighlight", this.vertexIDs[u], 1);
    this.cmd("SetHighlight", this.vertexIDs[v], 1);
    this.cmd("Step");

    this.highlightCodeLine(5);
    var rootU = this.findSet(parent, u);
    this.updateInfoPanel(
      "Root of " + this.vertexLabels[u] + " is " + this.vertexLabels[rootU] + "."
    );
    this.cmd("Step");

    this.highlightCodeLine(6);
    var rootV = this.findSet(parent, v);
    this.updateInfoPanel(
      "Root of " + this.vertexLabels[v] + " is " + this.vertexLabels[rootV] + "."
    );
    this.cmd("Step");

    if (rootU !== rootV) {
      this.highlightCodeLine(7);
      this.updateInfoPanel(
        "Roots differ, so add " + label + " to the MST."
      );
      this.cmd("Step");

      this.highlightCodeLine(8);
      mstWeight += weight;
      this.updateMSTWeightLabel(mstWeight);
      this.cmd("Step");

      this.highlightCodeLine(9);
      this.unionSets(parent, rank, rootU, rootV);
      this.updateInfoPanel(
        "Union " +
          this.vertexLabels[rootU] +
          " and " +
          this.vertexLabels[rootV] +
          " to keep the forest acyclic."
      );
      this.cmd("Step");

      this.setEdgeStyle(u, v, {
        color: KruskalMST.EDGE_ACCEPT_COLOR,
        thickness: KruskalMST.EDGE_MST_THICKNESS,
        highlight: false,
      });
    } else {
      this.highlightCodeLine(10);
      this.updateInfoPanel(
        "Roots match, so " + label + " would create a cycle."
      );
      this.cmd("Step");

      this.highlightCodeLine(11);
      this.cmd("Step");

      this.setEdgeStyle(u, v, {
        color: KruskalMST.EDGE_REJECT_COLOR,
        thickness: KruskalMST.EDGE_THICKNESS,
        highlight: false,
      });
    }

    this.cmd("SetHighlight", this.vertexIDs[u], 0);
    this.cmd("SetHighlight", this.vertexIDs[v], 0);
    this.cmd("Step");
  }

  this.highlightCodeLine(13);
  this.updateInfoPanel(
    "Kruskal's algorithm completed. Total MST weight = " + mstWeight + "."
  );
  this.cmd("Step");
  this.highlightCodeLine(-1);

  return this.commands;
};

KruskalMST.prototype.resetEdgeStyles = function () {
  for (var e = 0; e < this.edgeList.length; e++) {
    var edge = this.edgeList[e];
    this.setEdgeStyle(edge.u, edge.v, {
      color: KruskalMST.EDGE_COLOR,
      thickness: KruskalMST.EDGE_THICKNESS,
      highlight: false,
    });
  }
};

KruskalMST.prototype.clearNodeHighlights = function () {
  for (var i = 0; i < this.vertexIDs.length; i++) {
    this.cmd("SetHighlight", this.vertexIDs[i], 0);
  }
};

KruskalMST.prototype.setEdgeStyle = function (u, v, style) {
  var key = this.edgeKey(u, v);
  var entry = this.edgeMap[key];
  if (!entry) {
    return;
  }

  var color = style && style.color ? style.color : KruskalMST.EDGE_COLOR;
  var thickness =
    style && style.thickness ? style.thickness : KruskalMST.EDGE_THICKNESS;
  var highlight = style && style.highlight ? 1 : 0;

  this.cmd("SetEdgeColor", entry.from, entry.to, color);
  this.cmd("SetEdgeThickness", entry.from, entry.to, thickness);
  this.cmd("SetEdgeHighlight", entry.from, entry.to, highlight);
};

KruskalMST.prototype.findSet = function (parent, node) {
  var root = node;
  while (parent[root] !== root) {
    root = parent[root];
  }

  while (node !== root) {
    var next = parent[node];
    parent[node] = root;
    node = next;
  }
  return root;
};

KruskalMST.prototype.unionSets = function (parent, rank, u, v) {
  if (u === v) {
    return;
  }

  if (rank[u] < rank[v]) {
    parent[u] = v;
  } else if (rank[u] > rank[v]) {
    parent[v] = u;
  } else {
    parent[v] = u;
    rank[u]++;
  }
};

KruskalMST.prototype.shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

KruskalMST.prototype.randomWeight = function () {
  return 1 + Math.floor(Math.random() * 20);
};

KruskalMST.prototype.edgeKey = function (u, v) {
  return u < v ? u + "-" + v : v + "-" + u;
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new KruskalMST(animManag, canvas.width, canvas.height);
}
