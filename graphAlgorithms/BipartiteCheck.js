// Custom visualization for checking if an undirected graph is bipartite using a DFS based coloring.

function BipartiteCheck(am, w, h) {
  this.init(am, w, h);
}

BipartiteCheck.prototype = new Algorithm();
BipartiteCheck.prototype.constructor = BipartiteCheck;
BipartiteCheck.superclass = Algorithm.prototype;

BipartiteCheck.CANVAS_WIDTH = 900;
BipartiteCheck.CANVAS_HEIGHT = 1600;

BipartiteCheck.ROW1_HEIGHT = 240;
BipartiteCheck.ROW2_HEIGHT = 760;
BipartiteCheck.ROW3_HEIGHT =
  BipartiteCheck.CANVAS_HEIGHT - BipartiteCheck.ROW1_HEIGHT - BipartiteCheck.ROW2_HEIGHT;

BipartiteCheck.ROW1_CENTER_Y = BipartiteCheck.ROW1_HEIGHT / 2;
BipartiteCheck.ROW2_START_Y = BipartiteCheck.ROW1_HEIGHT;
BipartiteCheck.ROW3_START_Y =
  BipartiteCheck.ROW1_HEIGHT + BipartiteCheck.ROW2_HEIGHT;

BipartiteCheck.TITLE_Y = BipartiteCheck.ROW1_CENTER_Y - 40;
BipartiteCheck.START_INFO_Y = BipartiteCheck.ROW1_CENTER_Y + 36;
BipartiteCheck.STATUS_INFO_Y = BipartiteCheck.START_INFO_Y + 40;

BipartiteCheck.GRAPH_AREA_CENTER_X = 320;
BipartiteCheck.GRAPH_NODE_RADIUS = 22;
BipartiteCheck.GRAPH_NODE_COLOR = "#e3f2fd";
BipartiteCheck.GRAPH_NODE_BORDER = "#0b3954";
BipartiteCheck.GRAPH_NODE_TEXT = "#003049";
BipartiteCheck.GRAPH_NODE_COLOR_A = "#a2d2ff";
BipartiteCheck.GRAPH_NODE_COLOR_B = "#ffc8dd";
BipartiteCheck.GRAPH_NODE_CONFLICT_COLOR = "#ffadad";
BipartiteCheck.GRAPH_NODE_CONFLICT_TEXT = "#7f1d1d";
BipartiteCheck.HIGHLIGHT_RADIUS = BipartiteCheck.GRAPH_NODE_RADIUS;
BipartiteCheck.EDGE_COLOR = "#4a4e69";
BipartiteCheck.EDGE_VISITED_COLOR = "#66bb6a";
BipartiteCheck.EDGE_CONFLICT_COLOR = "#ff3b30";
BipartiteCheck.EDGE_THICKNESS = 3;
BipartiteCheck.EDGE_ACTIVE_THICKNESS = 2;
BipartiteCheck.EDGE_TREE_THICKNESS = 6;

BipartiteCheck.ARRAY_BASE_X = 700;
BipartiteCheck.ARRAY_COLUMN_SPACING = 90;
BipartiteCheck.ARRAY_TOP_Y = BipartiteCheck.ROW2_START_Y + 90;
BipartiteCheck.ARRAY_CELL_HEIGHT = 52;
BipartiteCheck.ARRAY_CELL_WIDTH = 60;
BipartiteCheck.ARRAY_CELL_INNER_HEIGHT = 42;
BipartiteCheck.ARRAY_HEADER_HEIGHT = BipartiteCheck.ARRAY_CELL_INNER_HEIGHT;
BipartiteCheck.ARRAY_RECT_COLOR = "#f1f1f6";
BipartiteCheck.ARRAY_RECT_BORDER = "#2b2d42";
BipartiteCheck.ARRAY_RECT_HIGHLIGHT_BORDER = "#d62828";
BipartiteCheck.ARRAY_RECT_BORDER_THICKNESS = 1;
BipartiteCheck.ARRAY_RECT_HIGHLIGHT_THICKNESS = 3;
BipartiteCheck.ARRAY_TEXT_COLOR = "#2b2d42";
BipartiteCheck.ARRAY_COLOR_FILL_A = "#d8eefe";
BipartiteCheck.ARRAY_COLOR_FILL_B = "#ffe5f1";
BipartiteCheck.ARRAY_HEADER_GAP = 20;
BipartiteCheck.BOTTOM_SECTION_GAP = 56;
BipartiteCheck.CODE_TOP_PADDING = 12;

BipartiteCheck.CODE_START_X = 120;
BipartiteCheck.CODE_LINE_HEIGHT = 32;
BipartiteCheck.CODE_STANDARD_COLOR = "#1d3557";
BipartiteCheck.CODE_HIGHLIGHT_COLOR = "#e63946";
BipartiteCheck.CODE_FONT = "bold 22";

BipartiteCheck.RECURSION_AREA_CENTER_X = 640;
BipartiteCheck.RECURSION_HEADER_HEIGHT = 44;
BipartiteCheck.RECURSION_LABEL_MARGIN = 14;
BipartiteCheck.RECURSION_AREA_BOTTOM_MARGIN = 30;
BipartiteCheck.RECURSION_FRAME_WIDTH = 320;
BipartiteCheck.RECURSION_FRAME_HEIGHT = 34;
BipartiteCheck.RECURSION_FRAME_MIN_HEIGHT = 22;
BipartiteCheck.RECURSION_FRAME_SPACING = 10;
BipartiteCheck.RECURSION_FRAME_MIN_SPACING = 6;
BipartiteCheck.RECURSION_RECT_COLOR = "#f8f9fa";
BipartiteCheck.RECURSION_RECT_BORDER = "#1d3557";
BipartiteCheck.RECURSION_RECT_ACTIVE_BORDER = "#e63946";
BipartiteCheck.RECURSION_TEXT_COLOR = "#1d3557";
BipartiteCheck.RECURSION_FONT = "bold 18";

BipartiteCheck.TITLE_COLOR = "#1d3557";
BipartiteCheck.START_INFO_COLOR = "#264653";
BipartiteCheck.STATUS_INFO_COLOR = "#1d3557";
BipartiteCheck.STATUS_FAIL_COLOR = "#c1121f";
BipartiteCheck.HIGHLIGHT_COLOR = "#ff3b30";

BipartiteCheck.COLOR_LABELS = {
  "-1": { text: "-1", fill: BipartiteCheck.ARRAY_RECT_COLOR },
  "0": { text: "0", fill: BipartiteCheck.ARRAY_COLOR_FILL_A },
  "1": { text: "1", fill: BipartiteCheck.ARRAY_COLOR_FILL_B }
};

BipartiteCheck.CODE_LINES = [
  ["bool dfsColor(int u, int color) {"],
  ["    colorArr[u] = color;"],
  ["    for (int v : adj[u]) {"],
  ["        if (colorArr[v] == -1) {"],
  ["            if (!dfsColor(v, 1 - color))"],
  ["                return false;"],
  ["        } else if (colorArr[v] == color) {"],
  ["            return false;"],
  ["        }"],
  ["    }"],
  ["    return true;"],
  ["}"]
];

// Allowed adjacency template derived from the DFS classroom visualization so
// the undirected graph reuses its well-spaced layout without overlaps.
BipartiteCheck.TEMPLATE_ALLOWED = [
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

// Matching curve data from the DFS classroom visualization template. Only
// entries with a non-zero magnitude will render as curved edges.
BipartiteCheck.TEMPLATE_CURVES = [
  [0, 0, -0.4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

BipartiteCheck.prototype.init = function (am, w, h) {
  BipartiteCheck.superclass.init.call(this, am, w, h);

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
  this.colorRectIDs = [];
  this.parentRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.codeID = [];
  this.highlightCircleID = -1;
  this.currentCodeLine = -1;
  this.startDisplayID = -1;
  this.statusDisplayID = -1;
  this.recursionBackgroundID = -1;
  this.recursionHeaderID = -1;
  this.recursionFrameIDs = [];
  this.activeRecursionIndex = -1;
  this.recursionDepth = 0;
  this.bottomSectionTopY =
    BipartiteCheck.ROW3_START_Y + BipartiteCheck.CODE_TOP_PADDING;

  this.colorState = [];
  this.parents = [];
  this.conflictPair = null;

  this.implementAction(this.reset.bind(this), 0);
};

BipartiteCheck.prototype.addControls = function () {
  addLabelToAlgorithmBar("Start Vertex:");
  this.startField = addControlToAlgorithmBar("Text", "A");
  this.startField.size = 4;
  this.startButton = addControlToAlgorithmBar("Button", "Check Bipartite");
  this.startButton.onclick = this.startCallback.bind(this);
  this.startField.onkeydown = this.returnSubmit(
    this.startField,
    this.startCallback.bind(this),
    2,
    false
  );

  this.newGraphButton = addControlToAlgorithmBar("Button", "New Graph");
  this.newGraphButton.onclick = this.resetCallback.bind(this);

  this.undirectedDFSButton = addControlToAlgorithmBar(
    "Button",
    "Undirected DFS"
  );
  this.undirectedDFSButton.onclick = function () {
    window.location.href = "UndirectedDFS.html";
  };

  this.controls.push(
    this.startField,
    this.startButton,
    this.newGraphButton,
    this.undirectedDFSButton
  );
};

BipartiteCheck.prototype.reset = function () {
  this.nextIndex = 0;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  return this.setup();
};

BipartiteCheck.prototype.setup = function () {
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
  this.createRecursionArea();

  this.highlightCodeLine(-1);

  if (this.startField) {
    this.setStartFieldValue(this.vertexLabels[0]);
  }

  this.cmd("Step");
  return this.commands;
};

BipartiteCheck.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

BipartiteCheck.prototype.chooseVertexCount = function () {
  return 10;
};

BipartiteCheck.prototype.createVertexLabels = function (count) {
  var labels = [];
  for (var i = 0; i < count; i++) {
    labels.push(String.fromCharCode("A".charCodeAt(0) + i));
  }
  return labels;
};

BipartiteCheck.prototype.createTitleRow = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "Bipartite Check On Undirected Graph",
    BipartiteCheck.CANVAS_WIDTH / 2,
    BipartiteCheck.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, BipartiteCheck.TITLE_COLOR);

  this.startDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.startDisplayID,
    "Start Vertex: A",
    BipartiteCheck.CANVAS_WIDTH / 2,
    BipartiteCheck.START_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.startDisplayID, "bold 24");
  this.cmd("SetForegroundColor", this.startDisplayID, BipartiteCheck.START_INFO_COLOR);

  this.statusDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.statusDisplayID,
    "Status: Ready",
    BipartiteCheck.CANVAS_WIDTH / 2,
    BipartiteCheck.STATUS_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.statusDisplayID, "bold 22");
  this.cmd("SetForegroundColor", this.statusDisplayID, BipartiteCheck.STATUS_INFO_COLOR);
};

BipartiteCheck.prototype.createGraphArea = function () {
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
      BipartiteCheck.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, BipartiteCheck.GRAPH_NODE_COLOR);
    this.cmd("SetForegroundColor", id, BipartiteCheck.GRAPH_NODE_BORDER);
    this.cmd("SetTextColor", id, BipartiteCheck.GRAPH_NODE_TEXT);
    this.cmd("SetHighlight", id, 0);
  }

  for (var j = 0; j < this.edgePairs.length; j++) {
    var pair = this.edgePairs[j];
    var key = this.edgeKey(pair.u, pair.v);
    this.edgeOrientation[key] = {
      from: pair.u,
      to: pair.v
    };
    this.edgeStates[key] = { tree: false };
    this.edgeMeta[key] = pair;
    this.cmd(
      "Connect",
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      BipartiteCheck.EDGE_COLOR,
      pair.curve,
      0,
      ""
    );
    this.cmd(
      "SetEdgeThickness",
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      BipartiteCheck.EDGE_THICKNESS
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
    BipartiteCheck.HIGHLIGHT_COLOR,
    startPos.x,
    startPos.y,
    BipartiteCheck.HIGHLIGHT_RADIUS
  );
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

BipartiteCheck.prototype.createArrayArea = function () {
  var colorHeaderID = this.nextIndex++;
  var parentHeaderID = this.nextIndex++;
  var headerY =
    BipartiteCheck.ARRAY_TOP_Y -
    BipartiteCheck.ARRAY_CELL_HEIGHT / 2 -
    BipartiteCheck.ARRAY_HEADER_GAP;

  this.cmd(
    "CreateLabel",
    colorHeaderID,
    "Color",
    BipartiteCheck.ARRAY_BASE_X,
    headerY
  );
  this.cmd("SetTextStyle", colorHeaderID, "bold 20");
  this.cmd("SetForegroundColor", colorHeaderID, BipartiteCheck.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    parentHeaderID,
    "Parent",
    BipartiteCheck.ARRAY_BASE_X + BipartiteCheck.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", parentHeaderID, "bold 20");
  this.cmd("SetForegroundColor", parentHeaderID, BipartiteCheck.CODE_STANDARD_COLOR);

  this.colorRectIDs = new Array(this.vertexLabels.length);
  this.parentRectIDs = new Array(this.vertexLabels.length);
  this.vertexRowLabelIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rowY = BipartiteCheck.ARRAY_TOP_Y + i * BipartiteCheck.ARRAY_CELL_HEIGHT;

    var vertexLabelID = this.nextIndex++;
    this.vertexRowLabelIDs[i] = vertexLabelID;
    this.cmd(
      "CreateLabel",
      vertexLabelID,
      this.vertexLabels[i],
      BipartiteCheck.ARRAY_BASE_X - 60,
      rowY,
      0
    );
    this.cmd("SetTextStyle", vertexLabelID, "bold 20");
    this.cmd("SetForegroundColor", vertexLabelID, BipartiteCheck.START_INFO_COLOR);

    var colorID = this.nextIndex++;
    this.colorRectIDs[i] = colorID;
    this.cmd(
      "CreateRectangle",
      colorID,
      BipartiteCheck.COLOR_LABELS["-1"].text,
      BipartiteCheck.ARRAY_CELL_WIDTH,
      BipartiteCheck.ARRAY_CELL_INNER_HEIGHT,
      BipartiteCheck.ARRAY_BASE_X,
      rowY
    );
    this.cmd("SetForegroundColor", colorID, BipartiteCheck.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", colorID, BipartiteCheck.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", colorID, BipartiteCheck.ARRAY_TEXT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      colorID,
      BipartiteCheck.ARRAY_RECT_BORDER_THICKNESS
    );

    var parentID = this.nextIndex++;
    this.parentRectIDs[i] = parentID;
    this.cmd(
      "CreateRectangle",
      parentID,
      "-",
      BipartiteCheck.ARRAY_CELL_WIDTH,
      BipartiteCheck.ARRAY_CELL_INNER_HEIGHT,
      BipartiteCheck.ARRAY_BASE_X + BipartiteCheck.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", parentID, BipartiteCheck.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", parentID, BipartiteCheck.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", parentID, BipartiteCheck.ARRAY_TEXT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      parentID,
      BipartiteCheck.ARRAY_RECT_BORDER_THICKNESS
    );
  }

  var lastRowIndex = this.vertexLabels.length - 1;
  if (lastRowIndex >= 0) {
    var lastCenterY =
      BipartiteCheck.ARRAY_TOP_Y + lastRowIndex * BipartiteCheck.ARRAY_CELL_HEIGHT;
    var arrayBottomY =
      lastCenterY + BipartiteCheck.ARRAY_CELL_INNER_HEIGHT / 2;
    this.bottomSectionTopY = arrayBottomY + BipartiteCheck.BOTTOM_SECTION_GAP;
  }
};

BipartiteCheck.prototype.colorKeyForValue = function (value) {
  if (value === 0 || value === "0") {
    return "0";
  }
  if (value === 1 || value === "1") {
    return "1";
  }
  return "-1";
};

BipartiteCheck.prototype.getColorInfo = function (value) {
  var key = this.colorKeyForValue(value);
  return BipartiteCheck.COLOR_LABELS[key] || BipartiteCheck.COLOR_LABELS["-1"];
};

BipartiteCheck.prototype.updateColorCell = function (index, value) {
  if (!this.colorRectIDs || index < 0 || index >= this.colorRectIDs.length) {
    return;
  }
  var rectID = this.colorRectIDs[index];
  var info = this.getColorInfo(value);
  this.cmd("SetText", rectID, info.text);
  this.cmd("SetBackgroundColor", rectID, info.fill);
  this.cmd("SetTextColor", rectID, BipartiteCheck.ARRAY_TEXT_COLOR);
};

BipartiteCheck.prototype.setColorCellHighlight = function (index, active) {
  if (!this.colorRectIDs || index < 0 || index >= this.colorRectIDs.length) {
    return;
  }
  var rectID = this.colorRectIDs[index];
  var borderColor = active
    ? BipartiteCheck.ARRAY_RECT_HIGHLIGHT_BORDER
    : BipartiteCheck.ARRAY_RECT_BORDER;
  var thickness = active
    ? BipartiteCheck.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : BipartiteCheck.ARRAY_RECT_BORDER_THICKNESS;
  this.cmd("SetForegroundColor", rectID, borderColor);
  this.cmd("SetRectangleLineThickness", rectID, thickness);
};

BipartiteCheck.prototype.applyVertexColor = function (index, value) {
  if (!this.vertexIDs || index < 0 || index >= this.vertexIDs.length) {
    return;
  }
  var fill = BipartiteCheck.GRAPH_NODE_COLOR;
  var textColor = BipartiteCheck.GRAPH_NODE_TEXT;
  if (value === 0 || value === "0") {
    fill = BipartiteCheck.GRAPH_NODE_COLOR_A;
    textColor = BipartiteCheck.GRAPH_NODE_BORDER;
  } else if (value === 1 || value === "1") {
    fill = BipartiteCheck.GRAPH_NODE_COLOR_B;
    textColor = BipartiteCheck.GRAPH_NODE_BORDER;
  }
  this.cmd("SetBackgroundColor", this.vertexIDs[index], fill);
  this.cmd("SetTextColor", this.vertexIDs[index], textColor);
};

BipartiteCheck.prototype.setVertexConflict = function (index) {
  if (!this.vertexIDs || index < 0 || index >= this.vertexIDs.length) {
    return;
  }
  this.cmd(
    "SetBackgroundColor",
    this.vertexIDs[index],
    BipartiteCheck.GRAPH_NODE_CONFLICT_COLOR
  );
  this.cmd(
    "SetTextColor",
    this.vertexIDs[index],
    BipartiteCheck.GRAPH_NODE_CONFLICT_TEXT
  );
};

BipartiteCheck.prototype.setStatus = function (message, isError) {
  if (this.statusDisplayID === -1) {
    return;
  }
  this.cmd("SetText", this.statusDisplayID, message);
  var color = isError
    ? BipartiteCheck.STATUS_FAIL_COLOR
    : BipartiteCheck.STATUS_INFO_COLOR;
  this.cmd("SetForegroundColor", this.statusDisplayID, color);
};

BipartiteCheck.prototype.createCodeDisplay = function () {
  var startY = this.bottomSectionTopY + BipartiteCheck.CODE_TOP_PADDING;
  this.codeID = this.addCodeToCanvasBase(
    BipartiteCheck.CODE_LINES,
    BipartiteCheck.CODE_START_X,
    startY,
    BipartiteCheck.CODE_LINE_HEIGHT,
    BipartiteCheck.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], BipartiteCheck.CODE_FONT);
    }
  }
};

BipartiteCheck.prototype.computeRecursionLayout = function (frameCount) {
  var layout = {
    height: BipartiteCheck.RECURSION_FRAME_HEIGHT,
    spacing: BipartiteCheck.RECURSION_FRAME_SPACING,
    startY:
      this.bottomSectionTopY +
      BipartiteCheck.RECURSION_HEADER_HEIGHT +
      BipartiteCheck.RECURSION_LABEL_MARGIN +
      BipartiteCheck.RECURSION_FRAME_HEIGHT / 2
  };

  if (frameCount <= 0) {
    return layout;
  }

  var availableHeight =
    BipartiteCheck.CANVAS_HEIGHT -
    (this.bottomSectionTopY +
      BipartiteCheck.RECURSION_HEADER_HEIGHT +
      BipartiteCheck.RECURSION_LABEL_MARGIN +
      BipartiteCheck.RECURSION_AREA_BOTTOM_MARGIN);

  if (availableHeight <= 0) {
    return layout;
  }

  var spacing = frameCount === 1 ? 0 : layout.spacing;
  var height = Math.min(
    BipartiteCheck.RECURSION_FRAME_HEIGHT,
    Math.max(
      BipartiteCheck.RECURSION_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    )
  );

  var totalHeight = height * frameCount + spacing * (frameCount - 1);
  if (totalHeight > availableHeight) {
    spacing = Math.max(
      BipartiteCheck.RECURSION_FRAME_MIN_SPACING,
      Math.floor(
        (availableHeight - height * frameCount) / Math.max(1, frameCount - 1)
      )
    );
    if (spacing < 0) {
      spacing = 0;
    }
    height = Math.max(
      BipartiteCheck.RECURSION_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    );
  }

  layout.height = height;
  layout.spacing = spacing;
  layout.startY =
    this.bottomSectionTopY +
    BipartiteCheck.RECURSION_HEADER_HEIGHT +
    BipartiteCheck.RECURSION_LABEL_MARGIN +
    height / 2;

  return layout;
};

BipartiteCheck.prototype.createRecursionArea = function () {
  var frameCount = this.vertexLabels.length;
  var layout = this.computeRecursionLayout(frameCount);
  var framesTop = layout.startY - layout.height / 2;
  var totalFrameHeight =
    frameCount > 0
      ? layout.height * frameCount + layout.spacing * (frameCount - 1)
      : 0;
  this.recursionBackgroundID = -1;

  this.recursionHeaderID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.recursionHeaderID,
    "Call Stack",
    BipartiteCheck.RECURSION_AREA_CENTER_X + 20,
    this.bottomSectionTopY + BipartiteCheck.RECURSION_HEADER_HEIGHT / 2,
    0
  );
  this.cmd(
    "SetForegroundColor",
    this.recursionHeaderID,
    BipartiteCheck.CODE_STANDARD_COLOR
  );
  this.cmd("SetTextStyle", this.recursionHeaderID, "bold 22");

  this.recursionFrameIDs = [];
  this.activeRecursionIndex = -1;
  this.recursionDepth = 0;

  var y = layout.startY;

  for (var i = 0; i < frameCount; i++) {
    var rectID = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      BipartiteCheck.RECURSION_FRAME_WIDTH,
      layout.height,
      BipartiteCheck.RECURSION_AREA_CENTER_X + 50,
      y
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      BipartiteCheck.RECURSION_RECT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, BipartiteCheck.RECURSION_RECT_BORDER);
    this.cmd("SetAlpha", rectID, 0);
    this.cmd("SetTextColor", rectID, BipartiteCheck.RECURSION_TEXT_COLOR);
    this.cmd("SetTextStyle", rectID, BipartiteCheck.RECURSION_FONT);

    this.recursionFrameIDs.push(rectID);

    y += layout.height + layout.spacing;
  }
};

BipartiteCheck.prototype.resetRecursionArea = function () {
  this.recursionDepth = 0;
  this.activeRecursionIndex = -1;
  for (var i = 0; i < this.recursionFrameIDs.length; i++) {
    this.cmd("SetAlpha", this.recursionFrameIDs[i], 0);
    this.cmd("SetText", this.recursionFrameIDs[i], "");
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[i],
      BipartiteCheck.RECURSION_RECT_BORDER
    );
  }
};

BipartiteCheck.prototype.pushRecursionFrame = function (vertex, colorValue) {
  if (
    this.recursionDepth < 0 ||
    this.recursionDepth >= this.recursionFrameIDs.length ||
    !this.vertexLabels ||
    vertex < 0 ||
    vertex >= this.vertexLabels.length
  ) {
    return;
  }

  if (this.activeRecursionIndex >= 0 && this.activeRecursionIndex < this.recursionFrameIDs.length) {
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[this.activeRecursionIndex],
      BipartiteCheck.RECURSION_RECT_BORDER
    );
  }

  var frameID = this.recursionFrameIDs[this.recursionDepth];
  var label = this.vertexLabels[vertex];
  var colorInfo = this.getColorInfo(colorValue);
  var text = "dfsColor(" + label + ", " + colorInfo.text + ")";
  this.cmd("SetText", frameID, text);
  this.cmd("SetAlpha", frameID, 1);
  this.cmd("SetForegroundColor", frameID, BipartiteCheck.RECURSION_RECT_ACTIVE_BORDER);

  this.activeRecursionIndex = this.recursionDepth;
  this.recursionDepth++;
};

BipartiteCheck.prototype.popRecursionFrame = function () {
  if (this.recursionDepth <= 0) {
    return;
  }

  this.recursionDepth--;
  var frameID = this.recursionFrameIDs[this.recursionDepth];
  this.cmd("SetAlpha", frameID, 0);
  this.cmd("SetText", frameID, "");
  this.cmd("SetForegroundColor", frameID, BipartiteCheck.RECURSION_RECT_BORDER);

  this.activeRecursionIndex = this.recursionDepth - 1;
  if (this.activeRecursionIndex >= 0 && this.activeRecursionIndex < this.recursionFrameIDs.length) {
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[this.activeRecursionIndex],
      BipartiteCheck.RECURSION_RECT_ACTIVE_BORDER
    );
  }
};

BipartiteCheck.prototype.highlightCodeLine = function (lineIndex) {
  if (this.currentCodeLine >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[this.currentCodeLine][0],
      BipartiteCheck.CODE_STANDARD_COLOR
    );
  }
  this.currentCodeLine = lineIndex;
  if (lineIndex >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[lineIndex][0],
      BipartiteCheck.CODE_HIGHLIGHT_COLOR
    );
  }
};

BipartiteCheck.prototype.clearTraversalState = function () {
  this.colorState = new Array(this.vertexLabels.length);
  this.parents = new Array(this.vertexLabels.length);
  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.colorState[i] = -1;
    this.parents[i] = null;
    this.updateColorCell(i, -1);
    this.setColorCellHighlight(i, false);
    this.cmd("SetText", this.parentRectIDs[i], "-");
    this.applyVertexColor(i, -1);
  }
  this.setStatus("Status: Ready", false);
  this.conflictPair = null;
  this.resetEdgesToUndirected();
  this.resetRecursionArea();
};

BipartiteCheck.prototype.edgeKey = function (u, v) {
  return u < v ? u + "-" + v : v + "-" + u;
};

BipartiteCheck.prototype.resetEdgesToUndirected = function () {
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
      BipartiteCheck.EDGE_COLOR,
      edge.curve,
      0,
      ""
    );
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      BipartiteCheck.EDGE_THICKNESS
    );
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    var edgeKey = this.edgeKey(edge.u, edge.v);
    this.edgeOrientation[edgeKey] = { from: edge.u, to: edge.v };
    this.edgeStates[edgeKey] = { tree: false, conflict: false };
    this.edgeMeta[edgeKey] = edge;
  }
};

BipartiteCheck.prototype.setEdgeState = function (u, v, options) {
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

BipartiteCheck.prototype.setEdgeActive = function (u, v, active) {
  var key = this.edgeKey(u, v);
  var orientation = this.edgeOrientation[key];
  if (!orientation) {
    return;
  }
  var fromID = this.vertexIDs[orientation.from];
  var toID = this.vertexIDs[orientation.to];
  var baseColor = BipartiteCheck.EDGE_COLOR;
  if (this.edgeStates[key]) {
    if (this.edgeStates[key].conflict) {
      baseColor = BipartiteCheck.EDGE_CONFLICT_COLOR;
    } else if (this.edgeStates[key].tree) {
      baseColor = BipartiteCheck.EDGE_VISITED_COLOR;
    }
  }

  if (active) {
    this.setEdgeState(u, v, {
      highlight: true,
      color: baseColor
    });
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      BipartiteCheck.EDGE_ACTIVE_THICKNESS
    );
  } else {
    var keepHighlight =
      this.edgeStates[key] && this.edgeStates[key].conflict ? true : false;
    this.setEdgeState(u, v, {
      highlight: keepHighlight,
      color: baseColor
    });
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      keepHighlight
        ? BipartiteCheck.EDGE_TREE_THICKNESS
        : BipartiteCheck.EDGE_THICKNESS
    );
  }
};

BipartiteCheck.prototype.animateHighlightTraversal = function (fromIndex, toIndex) {
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
    this.cmd("Move", this.highlightCircleID, Math.round(endPos.x), Math.round(endPos.y));
    this.cmd("Step");
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
    this.highlightCircleID,
    Math.round(controlX),
    Math.round(controlY),
    Math.round(endPos.x),
    Math.round(endPos.y)
  );
  this.cmd("Step");
};

BipartiteCheck.prototype.getStartFieldValue = function () {
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

BipartiteCheck.prototype.setStartFieldValue = function (text) {
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

BipartiteCheck.prototype.markEdgeAsTreeEdge = function (parent, child) {
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
    BipartiteCheck.EDGE_VISITED_COLOR,
    curve,
    1,
    ""
  );
  this.cmd(
    "SetEdgeThickness",
    this.vertexIDs[parent],
    this.vertexIDs[child],
    BipartiteCheck.EDGE_TREE_THICKNESS
  );
  this.cmd(
    "SetEdgeHighlight",
    this.vertexIDs[parent],
    this.vertexIDs[child],
    1
  );
  this.edgeOrientation[key] = { from: parent, to: child };
  this.edgeStates[key] = { tree: true, conflict: false };
};

BipartiteCheck.prototype.markEdgeAsConflict = function (u, v) {
  var key = this.edgeKey(u, v);
  var orientation = this.edgeOrientation[key];
  var meta = this.edgeMeta[key];
  if (!meta) {
    return;
  }
  if (orientation) {
    this.cmd(
      "Disconnect",
      this.vertexIDs[orientation.from],
      this.vertexIDs[orientation.to]
    );
  }
  var curve = meta.curve;
  if (curve !== 0 && u === meta.v && v === meta.u) {
    curve = -curve;
  }
  this.cmd(
    "Connect",
    this.vertexIDs[u],
    this.vertexIDs[v],
    BipartiteCheck.EDGE_CONFLICT_COLOR,
    curve,
    1,
    ""
  );
  this.cmd(
    "SetEdgeThickness",
    this.vertexIDs[u],
    this.vertexIDs[v],
    BipartiteCheck.EDGE_TREE_THICKNESS
  );
  this.cmd(
    "SetEdgeHighlight",
    this.vertexIDs[u],
    this.vertexIDs[v],
    1
  );
  this.edgeOrientation[key] = { from: u, to: v };
  this.edgeStates[key] = { tree: false, conflict: true };
};

BipartiteCheck.prototype.computeTemplateLayout = function (vertexCount) {
  var layout = [];
  var baseX = 160;
  var stepX = 130;
  var baseY = BipartiteCheck.ROW2_START_Y + 120;
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

BipartiteCheck.prototype.generateRandomGraph = function (vertexCount) {
  this.vertexPositions = this.computeTemplateLayout(vertexCount);

  var allowed = BipartiteCheck.TEMPLATE_ALLOWED;
  var curves = BipartiteCheck.TEMPLATE_CURVES;
  var edges = [];
  var existing = {};

  var addEdge = function (u, v) {
    if (u === v) {
      return false;
    }
    if (!allowed[u] || !allowed[v]) {
      return false;
    }
    var a = Math.min(u, v);
    var b = Math.max(u, v);
    if (!allowed[a] || !allowed[a][b]) {
      return false;
    }
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

  var partitionA = [0, 2, 4, 7, 9];
  var partitionB = [1, 3, 5, 6, 8];

  var makeBipartite = Math.random() < 0.5;
  this.lastGraphWasBipartite = makeBipartite;

  var baseEdges = [
    [0, 1],
    [2, 1],
    [2, 3],
    [4, 1],
    [4, 5],
    [2, 6],
    [4, 8],
    [7, 8],
    [9, 5]
  ];

  for (var b = 0; b < baseEdges.length; b++) {
    addEdge(baseEdges[b][0], baseEdges[b][1]);
  }

  var crossPairs = [];
  for (var i = 0; i < partitionA.length; i++) {
    for (var j = 0; j < partitionB.length; j++) {
      var aVertex = partitionA[i];
      var bVertex = partitionB[j];
      if (allowed[aVertex] && allowed[aVertex][bVertex]) {
        crossPairs.push([aVertex, bVertex]);
      }
    }
  }

  for (var shuffle = crossPairs.length - 1; shuffle > 0; shuffle--) {
    var swapIndex = Math.floor(Math.random() * (shuffle + 1));
    var temp = crossPairs[shuffle];
    crossPairs[shuffle] = crossPairs[swapIndex];
    crossPairs[swapIndex] = temp;
  }

  var crossProbability = makeBipartite ? 0.6 : 0.5;
  for (var c = 0; c < crossPairs.length; c++) {
    if (Math.random() <= crossProbability) {
      addEdge(crossPairs[c][0], crossPairs[c][1]);
    }
  }

  if (!makeBipartite) {
    var samePairs = [];
    var collectSamePairs = function (group) {
      for (var x = 0; x < group.length; x++) {
        for (var y = x + 1; y < group.length; y++) {
          var first = group[x];
          var second = group[y];
          if (allowed[first] && allowed[first][second]) {
            samePairs.push([first, second]);
          }
        }
      }
    };

    collectSamePairs(partitionA);
    collectSamePairs(partitionB);

    for (var shuffleSame = samePairs.length - 1; shuffleSame > 0; shuffleSame--) {
      var swapSame = Math.floor(Math.random() * (shuffleSame + 1));
      var tempSame = samePairs[shuffleSame];
      samePairs[shuffleSame] = samePairs[swapSame];
      samePairs[swapSame] = tempSame;
    }

    if (samePairs.length > 0) {
      addEdge(samePairs[0][0], samePairs[0][1]);
    }

    for (var s = 1; s < samePairs.length; s++) {
      if (Math.random() <= 0.35) {
        addEdge(samePairs[s][0], samePairs[s][1]);
      }
    }
  }

  this.edgePairs = edges;
};

BipartiteCheck.prototype.applyVertexClamping = function (
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

BipartiteCheck.prototype.relaxVertices = function (
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

BipartiteCheck.prototype.roundVertexPositions = function () {
  for (var i = 0; i < this.vertexPositions.length; i++) {
    this.vertexPositions[i].x = Math.round(this.vertexPositions[i].x);
    this.vertexPositions[i].y = Math.round(this.vertexPositions[i].y);
  }
};

BipartiteCheck.prototype.pushVerticesAwayFromEdges = function (
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

BipartiteCheck.prototype.isWhitespaceChar = function (ch) {
  return (
    ch === " " ||
    ch === "\t" ||
    ch === "\n" ||
    ch === "\r" ||
    ch === "\f" ||
    ch === "\u00a0"
  );
};

BipartiteCheck.prototype.cleanInputLabel = function (inputLabel) {
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

BipartiteCheck.prototype.findVertexIndex = function (label) {
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

BipartiteCheck.prototype.startCallback = function () {
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

BipartiteCheck.prototype.runTraversal = function (startIndex) {
  this.commands = [];

  this.clearTraversalState();

  var startLabel = this.vertexLabels[startIndex];
  this.cmd(
    "SetText",
    this.startDisplayID,
    "Start Vertex: " + startLabel
  );

  this.setStatus("Status: Checking...", false);

  var order = [];
  var added = {};
  order.push(startIndex);
  added[startIndex] = true;
  for (var i = 0; i < this.vertexLabels.length; i++) {
    if (!added[i]) {
      order.push(i);
      added[i] = true;
    }
  }

  var success = true;

  this.cmd("SetAlpha", this.highlightCircleID, 0);

  for (var idx = 0; idx < order.length && success; idx++) {
    var vertex = order[idx];
    if (this.colorState[vertex] !== -1) {
      continue;
    }

    var pos = this.vertexPositions[vertex];
    this.cmd("SetAlpha", this.highlightCircleID, 1);
    this.cmd("Move", this.highlightCircleID, pos.x, pos.y);
    this.cmd("Step");

    this.parents[vertex] = null;
    var componentResult = this.dfsColor(vertex, 0);
    if (!componentResult) {
      success = false;
    }
  }

  if (success) {
    this.setStatus("Status: Graph is bipartite", false);
  } else {
    var conflictText = "Status: Graph is not bipartite";
    if (this.conflictPair) {
      var a = this.vertexLabels[this.conflictPair.u];
      var b = this.vertexLabels[this.conflictPair.v];
      conflictText = "Status: Conflict between " + a + " and " + b;
    }
    this.setStatus(conflictText, true);
  }

  this.highlightCodeLine(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);

  return this.commands;
};

BipartiteCheck.prototype.dfsColor = function (u, colorValue) {
  this.pushRecursionFrame(u, colorValue);
  this.cmd("Step");

  this.highlightCodeLine(0);
  this.cmd("Step");

  this.highlightCodeLine(1);
  this.setColorCellHighlight(u, true);
  this.cmd("Step");

  this.colorState[u] = colorValue;
  this.updateColorCell(u, colorValue);
  this.applyVertexColor(u, colorValue);
  this.cmd("Step");

  this.setColorCellHighlight(u, false);

  this.highlightCodeLine(2);
  this.cmd("Step");

  var neighbors = this.adjacencyList[u];
  for (var i = 0; i < neighbors.length; i++) {
    var v = neighbors[i];

    if (this.parents[u] !== null && this.parents[u] === v) {
      continue;
    }

    this.highlightCodeLine(3);
    this.setEdgeActive(u, v, true);
    this.cmd("Step");

    this.setColorCellHighlight(v, true);
    this.cmd("Step");

    if (this.colorState[v] === -1) {
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

      var nextColor = colorValue === 0 ? 1 : 0;
      var result = this.dfsColor(v, nextColor);
      this.animateHighlightTraversal(v, u);
      if (!result) {
        this.highlightCodeLine(5);
        this.cmd("Step");
        this.setColorCellHighlight(v, false);
        this.setEdgeActive(u, v, false);
        this.cmd("Step");
        this.popRecursionFrame();
        return false;
      }
    } else if (this.colorState[v] === colorValue) {
      this.highlightCodeLine(6);
      this.cmd("Step");

      this.conflictPair = { u: u, v: v };
      this.markEdgeAsConflict(u, v);
      this.setVertexConflict(u);
      this.setVertexConflict(v);
      this.setColorCellHighlight(v, false);
      this.setEdgeActive(u, v, false);

      var conflictMessage =
        "Status: Conflict between " +
        this.vertexLabels[u] +
        " and " +
        this.vertexLabels[v];
      this.setStatus(conflictMessage, true);

      this.cmd("Step");

      this.highlightCodeLine(7);
      this.cmd("Step");
      this.popRecursionFrame();
      return false;
    }

    this.setColorCellHighlight(v, false);
    this.setEdgeActive(u, v, false);
    this.highlightCodeLine(2);
    this.cmd("Step");
  }

  this.highlightCodeLine(9);
  this.cmd("Step");
  this.highlightCodeLine(10);
  this.cmd("Step");
  this.popRecursionFrame();
  return true;
};

BipartiteCheck.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

BipartiteCheck.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new BipartiteCheck(animManag, canvas.width, canvas.height);
}
