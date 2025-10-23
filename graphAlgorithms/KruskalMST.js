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
KruskalMST.GRAPH_NODE_RADIUS = 26;
KruskalMST.GRAPH_NODE_COLOR = "#f5f5ff";
KruskalMST.GRAPH_NODE_BORDER = "#1b3a4b";
KruskalMST.GRAPH_NODE_TEXT = "#1b3a4b";

KruskalMST.GRAPH_PANEL_CENTER_X = 210;
KruskalMST.GRAPH_PANEL_CENTER_Y =
  KruskalMST.GRAPH_TOP + KruskalMST.ROW2_HEIGHT / 2;
KruskalMST.GRAPH_PANEL_WIDTH = 400;
KruskalMST.GRAPH_PANEL_HEIGHT = KruskalMST.ROW2_HEIGHT - 40;

KruskalMST.MST_PANEL_CENTER_X = 540;
KruskalMST.MST_PANEL_CENTER_Y = KruskalMST.GRAPH_PANEL_CENTER_Y;
KruskalMST.MST_PANEL_WIDTH = 340;
KruskalMST.MST_PANEL_HEIGHT = KruskalMST.GRAPH_PANEL_HEIGHT;
KruskalMST.PANEL_BG = "#fbfcff";
KruskalMST.PANEL_BORDER = "#90a4ae";

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

KruskalMST.MST_NODE_COLOR = "#fff8e1";
KruskalMST.MST_NODE_BORDER = "#6c4f3d";
KruskalMST.MST_NODE_TEXT = "#6c4f3d";

KruskalMST.GRAPH_LAYOUT_CONFIG = {
  baseX: 80,
  stepX: 100,
  baseY: KruskalMST.GRAPH_TOP + 120,
  rowSpacing: 140,
};

KruskalMST.MST_LAYOUT_CONFIG = {
  baseX: 420,
  stepX: 85,
  baseY: KruskalMST.GRAPH_TOP + 120,
  rowSpacing: 140,
};

KruskalMST.TEMPLATE_ALLOWED = [
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
  this.mstVertexPositions = [];
  this.mstVertexIDs = [];
  this.mstEdgePairs = {};
  this.edgeList = [];
  this.edgeMap = {};
  this.infoPanelRectID = -1;
  this.infoLabelID = -1;
  this.mstWeightLabelID = -1;
  this.graphPanelRectID = -1;
  this.graphPanelTitleID = -1;
  this.mstPanelRectID = -1;
  this.mstPanelTitleID = -1;
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
  this.createMSTDisplay();
  this.createCodeDisplay();
  this.updateInfoPanel(
    "Click \"Run Kruskal\" to build the MST. The right panel reflects MST growth."
  );
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

  this.graphPanelRectID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.graphPanelRectID,
    "",
    KruskalMST.GRAPH_PANEL_WIDTH,
    KruskalMST.GRAPH_PANEL_HEIGHT,
    KruskalMST.GRAPH_PANEL_CENTER_X,
    KruskalMST.GRAPH_PANEL_CENTER_Y
  );
  this.cmd("SetForegroundColor", this.graphPanelRectID, KruskalMST.PANEL_BORDER);
  this.cmd("SetBackgroundColor", this.graphPanelRectID, KruskalMST.PANEL_BG);
  this.cmd("SetRectangleLineThickness", this.graphPanelRectID, 1);

  this.graphPanelTitleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.graphPanelTitleID,
    "Random Graph",
    KruskalMST.GRAPH_PANEL_CENTER_X,
    KruskalMST.GRAPH_TOP + 40,
    1
  );
  this.cmd("SetTextStyle", this.graphPanelTitleID, "bold 22");
  this.cmd("SetForegroundColor", this.graphPanelTitleID, KruskalMST.INFO_TEXT_COLOR);

  this.mstPanelRectID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.mstPanelRectID,
    "",
    KruskalMST.MST_PANEL_WIDTH,
    KruskalMST.MST_PANEL_HEIGHT,
    KruskalMST.MST_PANEL_CENTER_X,
    KruskalMST.MST_PANEL_CENTER_Y
  );
  this.cmd("SetForegroundColor", this.mstPanelRectID, KruskalMST.PANEL_BORDER);
  this.cmd("SetBackgroundColor", this.mstPanelRectID, KruskalMST.PANEL_BG);
  this.cmd("SetRectangleLineThickness", this.mstPanelRectID, 1);

  this.mstPanelTitleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.mstPanelTitleID,
    "MST Construction",
    KruskalMST.MST_PANEL_CENTER_X,
    KruskalMST.GRAPH_TOP + 40,
    1
  );
  this.cmd("SetTextStyle", this.mstPanelTitleID, "bold 22");
  this.cmd("SetForegroundColor", this.mstPanelTitleID, KruskalMST.INFO_TEXT_COLOR);
};

KruskalMST.prototype.generateGraphData = function () {
  var nodeCount = 7;
  this.vertexLabels = this.createVertexLabels(nodeCount);
  this.generateRandomGraph(nodeCount);
};

KruskalMST.prototype.createVertexLabels = function (count) {
  var labels = [];
  var limit = Math.min(count, 26);
  for (var i = 0; i < limit; i++) {
    labels.push(String.fromCharCode(65 + i));
  }
  return labels;
};

KruskalMST.prototype.generateRandomGraph = function (vertexCount) {
  this.vertexPositions = this.computePanelLayout(
    vertexCount,
    KruskalMST.GRAPH_LAYOUT_CONFIG
  );
  this.mstVertexPositions = this.computePanelLayout(
    vertexCount,
    KruskalMST.MST_LAYOUT_CONFIG
  );

  var allowed = KruskalMST.TEMPLATE_ALLOWED;
  var usedPairs = {};
  var undirectedEdges = [];
  var self = this;

  var isPairAllowed = function (a, b) {
    if (a === b) {
      return false;
    }
    var forward = allowed[a] && allowed[a][b];
    var backward = allowed[b] && allowed[b][a];
    return !!(forward || backward);
  };

  var tryAddPair = function (u, v) {
    if (!isPairAllowed(u, v)) {
      return false;
    }
    var key = self.edgeKey(u, v);
    if (usedPairs[key]) {
      return false;
    }
    usedPairs[key] = true;
    undirectedEdges.push({
      u: Math.min(u, v),
      v: Math.max(u, v),
    });
    return true;
  };

  var connected = [0];
  var remaining = [];
  for (var index = 1; index < vertexCount; index++) {
    remaining.push(index);
  }

  while (remaining.length > 0) {
    var candidates = [];
    for (var c = 0; c < connected.length; c++) {
      for (var r = 0; r < remaining.length; r++) {
        var from = connected[c];
        var to = remaining[r];
        if (isPairAllowed(from, to)) {
          candidates.push({ from: from, to: to });
        }
      }
    }

    if (candidates.length === 0) {
      var fallbackTarget = remaining.pop();
      var fallbackConnected = false;
      for (var search = 0; search < connected.length && !fallbackConnected; search++) {
        fallbackConnected = tryAddPair(connected[search], fallbackTarget);
      }
      if (!fallbackConnected) {
        for (
          var explore = 0;
          explore < vertexCount && !fallbackConnected;
          explore++
        ) {
          if (explore === fallbackTarget) {
            continue;
          }
          fallbackConnected = tryAddPair(explore, fallbackTarget);
        }
      }
      if (!fallbackConnected && connected.length > 0) {
        var arbitrary = connected[0];
        var manualKey = self.edgeKey(arbitrary, fallbackTarget);
        if (!usedPairs[manualKey]) {
          usedPairs[manualKey] = true;
          undirectedEdges.push({
            u: Math.min(arbitrary, fallbackTarget),
            v: Math.max(arbitrary, fallbackTarget),
          });
        }
      }
      connected.push(fallbackTarget);
      continue;
    }

    var choiceIndex = Math.floor(Math.random() * candidates.length);
    var selection = candidates[choiceIndex];
    if (tryAddPair(selection.from, selection.to)) {
      var removalIndex = remaining.indexOf(selection.to);
      if (removalIndex !== -1) {
        remaining.splice(removalIndex, 1);
      }
      connected.push(selection.to);
    } else {
      var alternative = remaining.pop();
      tryAddPair(connected[0], alternative);
      connected.push(alternative);
    }
  }

  var baseEdgePercent = 0.45;
  for (var i = 0; i < vertexCount; i++) {
    for (var j = i + 1; j < vertexCount; j++) {
      if (!isPairAllowed(i, j)) {
        continue;
      }
      if (usedPairs[self.edgeKey(i, j)]) {
        continue;
      }
      if (Math.random() <= baseEdgePercent) {
        tryAddPair(i, j);
      }
    }
  }

  if (undirectedEdges.length < vertexCount - 1) {
    for (var attach = 1; attach < vertexCount; attach++) {
      if (undirectedEdges.length >= vertexCount - 1) {
        break;
      }
      tryAddPair(attach - 1, attach);
    }
  }

  this.shuffleArray(undirectedEdges);

  this.edgeList = [];
  for (var e = 0; e < undirectedEdges.length; e++) {
    var pair = undirectedEdges[e];
    this.edgeList.push({
      u: pair.u,
      v: pair.v,
      weight: this.randomWeight(),
    });
  }
};

KruskalMST.prototype.computePanelLayout = function (vertexCount, config) {
  var layout = [];
  var rowPattern = [4, 3, 4, 3, 4];

  for (var row = 0, index = 0; row < rowPattern.length; row++) {
    var count = rowPattern[row];
    var startX = count === 4 ? config.baseX : config.baseX + config.stepX / 2;
    var y = config.baseY + row * config.rowSpacing;
    for (var col = 0; col < count && index < vertexCount; col++, index++) {
      layout.push({ x: startX + col * config.stepX, y: y });
    }
    if (layout.length >= vertexCount) {
      break;
    }
  }

  return layout;
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

KruskalMST.prototype.createMSTDisplay = function () {
  this.mstVertexIDs = new Array(this.vertexLabels.length);
  this.mstEdgePairs = {};

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var id = this.nextIndex++;
    this.mstVertexIDs[i] = id;
    var pos = this.mstVertexPositions[i];
    this.cmd(
      "CreateCircle",
      id,
      this.vertexLabels[i],
      pos.x,
      pos.y,
      KruskalMST.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, KruskalMST.MST_NODE_COLOR);
    this.cmd("SetForegroundColor", id, KruskalMST.MST_NODE_BORDER);
    this.cmd("SetTextColor", id, KruskalMST.MST_NODE_TEXT);
    this.cmd("SetHighlight", id, 0);
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
          " to keep the forest acyclic while updating the MST panel."
      );
      this.addEdgeToMST(u, v, weight);
      this.cmd("SetHighlight", this.mstVertexIDs[u], 1);
      this.cmd("SetHighlight", this.mstVertexIDs[v], 1);
      this.cmd("Step");
      this.cmd("SetHighlight", this.mstVertexIDs[u], 0);
      this.cmd("SetHighlight", this.mstVertexIDs[v], 0);
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
  this.clearMSTEdges();
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

KruskalMST.prototype.addEdgeToMST = function (u, v, weight) {
  if (!this.mstVertexIDs.length) {
    return;
  }
  var key = this.edgeKey(u, v);
  if (this.mstEdgePairs[key]) {
    return;
  }

  var fromID = this.mstVertexIDs[u];
  var toID = this.mstVertexIDs[v];
  this.cmd(
    "Connect",
    fromID,
    toID,
    KruskalMST.EDGE_ACCEPT_COLOR,
    0,
    0,
    String(weight)
  );
  this.cmd("SetEdgeThickness", fromID, toID, KruskalMST.EDGE_MST_THICKNESS);
  this.cmd("SetEdgeHighlight", fromID, toID, 0);
  this.mstEdgePairs[key] = { from: fromID, to: toID };
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

KruskalMST.prototype.clearMSTEdges = function () {
  if (!this.mstEdgePairs) {
    this.mstEdgePairs = {};
    return;
  }

  for (var key in this.mstEdgePairs) {
    if (!Object.prototype.hasOwnProperty.call(this.mstEdgePairs, key)) {
      continue;
    }
    var entry = this.mstEdgePairs[key];
    this.cmd("Disconnect", entry.from, entry.to);
  }

  this.mstEdgePairs = {};
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new KruskalMST(animManag, canvas.width, canvas.height);
}
