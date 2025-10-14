// Custom visualization for Dijkstra's shortest path algorithm on a weighted graph.

function DijkstraVisualization(am, w, h) {
  this.init(am, w, h);
}

DijkstraVisualization.prototype = new Algorithm();
DijkstraVisualization.prototype.constructor = DijkstraVisualization;
DijkstraVisualization.superclass = Algorithm.prototype;

DijkstraVisualization.CANVAS_WIDTH = 720;
DijkstraVisualization.CANVAS_HEIGHT = 1280;

DijkstraVisualization.TITLE_Y = 60;
// The prior layout included a status label along the bottom of the canvas.
// The revised design removes that status strip, so we no longer track
// coordinates for it.
DijkstraVisualization.NODE_RADIUS = 26;
DijkstraVisualization.NODE_COLOR = "#f6f7fb";
DijkstraVisualization.NODE_BORDER_COLOR = "#283593";
DijkstraVisualization.NODE_TEXT_COLOR = "#0d1b2a";
DijkstraVisualization.NODE_ACTIVE_COLOR = "#ffe082";
DijkstraVisualization.NODE_VISITED_COLOR = "#c5e1a5";
DijkstraVisualization.NODE_VISITED_TEXT_COLOR = "#1b4332";

DijkstraVisualization.EDGE_COLOR = "#424874";
DijkstraVisualization.EDGE_HIGHLIGHT_COLOR = "#ff7043";
DijkstraVisualization.EDGE_THICKNESS = 3;

DijkstraVisualization.TABLE_HEADER_Y = 540;
DijkstraVisualization.TABLE_ROW_HEIGHT = 40;
DijkstraVisualization.TABLE_FIRST_ROW_Y =
  DijkstraVisualization.TABLE_HEADER_Y + 50;
DijkstraVisualization.TABLE_LEFT_X = 70;
DijkstraVisualization.TABLE_COLUMN_WIDTH = 80;
DijkstraVisualization.TABLE_COLUMN_GAP = 6;
DijkstraVisualization.TABLE_COLUMN_LABELS = [
  "Vertex",
  "Known",
  "Distance",
  "Parent",
];
DijkstraVisualization.TABLE_COLUMNS = (function () {
  var columns = [];
  var baseCenter =
    DijkstraVisualization.TABLE_LEFT_X +
    DijkstraVisualization.TABLE_COLUMN_WIDTH / 2;
  var step =
    DijkstraVisualization.TABLE_COLUMN_WIDTH +
    DijkstraVisualization.TABLE_COLUMN_GAP;
  for (var i = 0; i < DijkstraVisualization.TABLE_COLUMN_LABELS.length; i++) {
    columns.push({
      label: DijkstraVisualization.TABLE_COLUMN_LABELS[i],
      width: DijkstraVisualization.TABLE_COLUMN_WIDTH,
      x: baseCenter + i * step,
    });
  }
  return columns;
})();
DijkstraVisualization.TABLE_HEADER_FONT = "bold 20";
DijkstraVisualization.TABLE_CELL_FONT = "bold 18";
DijkstraVisualization.TABLE_HEADER_COLOR = "#1a237e";
DijkstraVisualization.TABLE_TEXT_COLOR = "#1f2933";
DijkstraVisualization.TABLE_HIGHLIGHT_COLOR = "#ffe0b2";
DijkstraVisualization.TABLE_BORDER_COLOR = "#1a237e";
DijkstraVisualization.TABLE_BORDER_THICKNESS = 2;

DijkstraVisualization.PQ_HEADER_X = 560;
DijkstraVisualization.PQ_HEADER_Y = DijkstraVisualization.TABLE_HEADER_Y;
DijkstraVisualization.PQ_FIRST_ROW_Y = DijkstraVisualization.TABLE_FIRST_ROW_Y;
DijkstraVisualization.PQ_ROW_HEIGHT = DijkstraVisualization.TABLE_ROW_HEIGHT;
DijkstraVisualization.PQ_ITEM_WIDTH = 220;
DijkstraVisualization.PQ_ITEM_HEIGHT =
  DijkstraVisualization.PQ_ROW_HEIGHT - 6;
DijkstraVisualization.PQ_FONT = DijkstraVisualization.TABLE_CELL_FONT;
DijkstraVisualization.PQ_HEADER_COLOR = DijkstraVisualization.TABLE_HEADER_COLOR;
DijkstraVisualization.PQ_TEXT_COLOR = DijkstraVisualization.TABLE_TEXT_COLOR;
DijkstraVisualization.PQ_HIGHLIGHT_COLOR = "#bbdefb";
DijkstraVisualization.PQ_EMPTY_FONT = "bold 16";
DijkstraVisualization.PQ_EMPTY_TEXT = "Queue is empty";

DijkstraVisualization.CODE_TITLE_Y = 840;
DijkstraVisualization.CODE_START_Y = 860;
DijkstraVisualization.CODE_LINE_HEIGHT = 14;
DijkstraVisualization.CODE_LEFT_X =
  DijkstraVisualization.TABLE_COLUMNS[0].x -
  DijkstraVisualization.TABLE_COLUMNS[0].width / 2 +
  5;
DijkstraVisualization.CODE_FONT = "bold 15px 'Courier New', monospace";
DijkstraVisualization.CODE_HIGHLIGHT_FONT = "bold 17px 'Courier New', monospace";
DijkstraVisualization.CODE_STANDARD_COLOR = "#102a43";
DijkstraVisualization.CODE_HIGHLIGHT_COLOR = "#d50000";

DijkstraVisualization.PATH_TITLE_FONT = "bold 18";
DijkstraVisualization.PATH_FONT = "bold 16px 'Courier New', monospace";
DijkstraVisualization.PATH_TITLE_COLOR = "#0b3d91";
DijkstraVisualization.PATH_TEXT_COLOR = "#102a43";
DijkstraVisualization.PATH_START_X = DijkstraVisualization.CODE_LEFT_X + 480;
DijkstraVisualization.PATH_START_Y = DijkstraVisualization.CODE_START_Y;
DijkstraVisualization.PATH_LINE_HEIGHT = 30;

DijkstraVisualization.INFO_Y = DijkstraVisualization.TITLE_Y + 48;
DijkstraVisualization.INFO_FONT = "bold 20";
DijkstraVisualization.INFO_COLOR = "#0d1b2a";
DijkstraVisualization.INFO_PASSIVE_COLOR = "#5f6c80";
DijkstraVisualization.INFO_BACKGROUND_DEFAULT = "#f6f7fb";
DijkstraVisualization.INFO_HIGHLIGHT_HEIGHT = 44;
DijkstraVisualization.INFO_PROGRESS_HEIGHT = 6;
DijkstraVisualization.INFO_PROGRESS_MIN_WIDTH = 180;
DijkstraVisualization.INFO_PROGRESS_MAX_WIDTH = 660;
DijkstraVisualization.INFO_PROGRESS_TEXT_PADDING = 36;
DijkstraVisualization.INFO_PROGRESS_COLOR = "#9bd5ff";
DijkstraVisualization.INFO_PROGRESS_BASE_COLOR = "#cbd2d9";
DijkstraVisualization.INFO_PROGRESS_Y =
  DijkstraVisualization.INFO_Y +
  DijkstraVisualization.INFO_HIGHLIGHT_HEIGHT / 2 +
  6;
DijkstraVisualization.INFO_PROGRESS_STEPS = 12;
DijkstraVisualization.INFO_PROGRESS_END_HOLD_STEPS = 0;
DijkstraVisualization.INFO_PROGRESS_MIN_REMAINING_WIDTH = 1;
DijkstraVisualization.INFO_FONT_CANVAS =
  DijkstraVisualization.INFO_FONT + "px Arial";
DijkstraVisualization.DEFAULT_INFO_TEXT =
  "Click 'Run Dijkstra' to watch the animation. Use 'New Graph' for variety.";

DijkstraVisualization.measureInfoTextWidth = (function () {
  var canvas = null;
  var context = null;
  return function (text) {
    if (!canvas) {
      canvas = document.createElement("canvas");
      if (canvas.getContext) {
        context = canvas.getContext("2d");
      }
    }
    if (!context) {
      return (text ? text.length : 0) * 12;
    }
    context.font = DijkstraVisualization.INFO_FONT_CANVAS;
    return context.measureText(text || "").width;
  };
})();

DijkstraVisualization.prototype.computeInfoProgressMetrics = function (text) {
  var measuredWidth = DijkstraVisualization.measureInfoTextWidth(text);
  if (!isFinite(measuredWidth) || measuredWidth <= 0) {
    measuredWidth = 0;
  }
  measuredWidth += DijkstraVisualization.INFO_PROGRESS_TEXT_PADDING;
  var minWidth = DijkstraVisualization.INFO_PROGRESS_MIN_WIDTH;
  var maxWidth = DijkstraVisualization.INFO_PROGRESS_MAX_WIDTH;
  if (!isFinite(minWidth) || minWidth < 0) {
    minWidth = 0;
  }
  if (!isFinite(maxWidth) || maxWidth <= 0) {
    maxWidth = DijkstraVisualization.CANVAS_WIDTH - 40;
  }
  if (measuredWidth < minWidth) {
    measuredWidth = minWidth;
  } else if (measuredWidth > maxWidth) {
    measuredWidth = maxWidth;
  }

  var left = DijkstraVisualization.CANVAS_WIDTH / 2 - measuredWidth / 2;
  return {
    width: measuredWidth,
    left: left,
    y: DijkstraVisualization.INFO_PROGRESS_Y,
  };
};

DijkstraVisualization.BIDIRECTIONAL_CURVE_INNER = 0.18;
DijkstraVisualization.BIDIRECTIONAL_CURVE_OUTER = 0.28;

DijkstraVisualization.TITLE_FONT = "bold 34";

DijkstraVisualization.GRAPH_MODE_DEFAULT = "default";
DijkstraVisualization.GRAPH_MODE_RANDOM = "random";
DijkstraVisualization.MIN_RANDOM_WEIGHT = 1;
DijkstraVisualization.MAX_RANDOM_WEIGHT = 12;

DijkstraVisualization.DEFAULT_VERTEX_DATA = [
  { label: "A", x: 150, y: 310 },
  { label: "B", x: 320, y: 210 },
  { label: "C", x: 220, y: 440 },
  { label: "D", x: 500, y: 270 },
  { label: "E", x: 420, y: 460 },
  { label: "F", x: 600, y: 360 },
];

DijkstraVisualization.DEFAULT_GRAPH_EDGES = [
  [
    { to: 1, weight: 4 },
    { to: 2, weight: 2 },
  ],
  [
    { to: 2, weight: 1 },
    { to: 3, weight: 5 },
    { to: 4, weight: 3 },
  ],
  [
    { to: 1, weight: 1 },
    { to: 3, weight: 8 },
    { to: 4, weight: 10 },
  ],
  [
    { to: 4, weight: 2 },
    { to: 5, weight: 6 },
  ],
  [
    { to: 5, weight: 2 },
  ],
  [],
];

DijkstraVisualization.RANDOM_LAYOUTS = [
  [
    { x: 150, y: 300 },
    { x: 320, y: 200 },
    { x: 220, y: 430 },
    { x: 500, y: 260 },
    { x: 420, y: 450 },
    { x: 600, y: 350 },
  ],
  [
    { x: 170, y: 320 },
    { x: 300, y: 210 },
    { x: 200, y: 460 },
    { x: 470, y: 280 },
    { x: 400, y: 480 },
    { x: 570, y: 360 },
  ],
  [
    { x: 160, y: 340 },
    { x: 290, y: 220 },
    { x: 210, y: 470 },
    { x: 460, y: 300 },
    { x: 390, y: 500 },
    { x: 560, y: 380 },
  ],
];

DijkstraVisualization.ALLOWED_EDGE_PAIRS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [2, 5],
  [3, 4],
  [3, 5],
  [4, 5],
];

DijkstraVisualization.CODE_LINES = [
  ["void dijkstra(int start) {"],
  ["  boolean[] visited = new boolean[n];"],
  ["  int[] dist = new int[n];"],
  ["  int[] parent = new int[n];"],
  ["  Arrays.fill(dist, INF);"],
  ["  Arrays.fill(parent, -1);"] ,
  ["  dist[start] = 0;"],
  ["  PriorityQueue<Node> pq = new PriorityQueue<>();"],
  ["  pq.offer(new Node(start, 0));"],
  ["  while (!pq.isEmpty()) {"],
  ["    Node cur = pq.poll();"],
  ["    if (visited[cur.id]) continue;"],
  ["    visited[cur.id] = true;"],
  ["    for (Edge e : graph[cur.id]) {"],
  ["      int alt = dist[cur.id] + e.weight;"],
  ["      if (alt < dist[e.to]) {"],
  ["        dist[e.to] = alt;"],
  ["        parent[e.to] = cur.id;"],
  ["        pq.offer(new Node(e.to, alt));"],
  ["      }"],
  ["    }"],
  ["  }"],
  ["}"],
];

DijkstraVisualization.prototype.init = function (am, w, h) {
  DijkstraVisualization.superclass.init.call(this, am, w, h);

  if (
    typeof objectManager !== "undefined" &&
    objectManager &&
    objectManager.statusReport
  ) {
    objectManager.statusReport.setText("");
    objectManager.statusReport.addedToScene = false;
  }

  if (this.animationManager && this.animationManager.setAllLayers) {
    this.animationManager.setAllLayers([0, 1, 2, 3, 4]);
  }

  this.controls = [];
  this.addControls();

  this.vertexIDs = [];
  this.edgeMap = {};
  this.bidirectionalOrientation = {};
  this.vertexData = [];
  this.graphEdges = [];
  this.distanceCellIDs = [];
  this.knownCellIDs = [];
  this.parentCellIDs = [];
  this.vertexCellIDs = [];
  this.codeID = [];
  this.pathLabelIDs = [];
  this.pathLabelsByVertex = {};
  this.pathOrder = [];
  this.pathsTitleID = -1;
  this.currentCodeLine = -1;
  this.statusID = -1;
  this.titleID = -1;
  this.infoLabelID = -1;
  this.infoProgressTrackID = -1;
  this.infoProgressCoverID = -1;
  this.priorityQueueHeaderID = -1;
  this.priorityQueueEmptyLabelID = -1;
  this.priorityQueueItemIDs = [];

  this.graphMode = DijkstraVisualization.GRAPH_MODE_DEFAULT;

  this.infinitySymbol = "\u221E";

  this.implementAction(this.reset.bind(this), 0);
};

DijkstraVisualization.prototype.addControls = function () {
  addLabelToAlgorithmBar("Start Vertex:");
  this.startField = addControlToAlgorithmBar("Text", "A");
  this.startField.size = 4;
  this.startButton = addControlToAlgorithmBar("Button", "Run Dijkstra");
  this.startButton.onclick = this.startCallback.bind(this);
  this.startField.onkeydown = this.returnSubmit(
    this.startField,
    this.startCallback.bind(this),
    1,
    false
  );

  this.newGraphButton = addControlToAlgorithmBar("Button", "New Graph");
  this.newGraphButton.onclick = this.newGraphCallback.bind(this);

  this.resetButton = addControlToAlgorithmBar("Button", "Reset Layout");
  this.resetButton.onclick = this.resetCallback.bind(this);

  this.controls.push(
    this.startField,
    this.startButton,
    this.newGraphButton,
    this.resetButton
  );
};

DijkstraVisualization.prototype.resetCallback = function () {
  this.graphMode = DijkstraVisualization.GRAPH_MODE_DEFAULT;
  this.implementAction(this.reset.bind(this), 0);
};

DijkstraVisualization.prototype.newGraphCallback = function () {
  this.graphMode = DijkstraVisualization.GRAPH_MODE_RANDOM;
  this.implementAction(this.reset.bind(this), 0);
};

DijkstraVisualization.prototype.reset = function () {
  this.nextIndex = 0;
  this.vertexIDs = [];
  this.edgeMap = {};
  this.bidirectionalOrientation = {};
  this.vertexData = [];
  this.graphEdges = [];
  this.distanceCellIDs = [];
  this.knownCellIDs = [];
  this.parentCellIDs = [];
  this.vertexCellIDs = [];
  this.codeID = [];
  this.pathLabelIDs = [];
  this.pathLabelsByVertex = {};
  this.pathOrder = [];
  this.pathsTitleID = -1;
  this.currentCodeLine = -1;
  this.infoLabelID = -1;
  this.infoProgressTrackID = -1;
  this.infoProgressCoverID = -1;
  this.statusID = -1;
  this.priorityQueueHeaderID = -1;
  this.priorityQueueEmptyLabelID = -1;
  this.priorityQueueItemIDs = [];

  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }

  return this.setup();
};

DijkstraVisualization.prototype.setup = function () {
  this.commands = [];

  if (this.graphMode === DijkstraVisualization.GRAPH_MODE_RANDOM) {
    this.generateRandomGraph();
  } else {
    this.loadDefaultGraph();
  }

  this.createTitle();
  this.createGraph();
  this.createTable();
  this.createPriorityQueueDisplay();
  this.createCodeDisplay();
  this.highlightCodeLine(-1);

  if (this.startField) {
    this.setStartFieldValue(this.vertexData[0].label);
  }

  this.cmd("Step");
  return this.commands;
};

DijkstraVisualization.prototype.cloneGraphEdges = function (edges) {
  var result = new Array(edges.length);
  for (var i = 0; i < edges.length; i++) {
    result[i] = [];
    if (!edges[i]) {
      continue;
    }
    for (var j = 0; j < edges[i].length; j++) {
      var edge = edges[i][j];
      result[i].push({ to: edge.to, weight: edge.weight });
    }
  }
  return result;
};

DijkstraVisualization.prototype.sortAdjacencyLists = function () {
  for (var i = 0; i < this.graphEdges.length; i++) {
    this.graphEdges[i].sort(function (a, b) {
      return a.to - b.to;
    });
  }
};

DijkstraVisualization.prototype.loadDefaultGraph = function () {
  this.vertexData = [];
  for (var i = 0; i < DijkstraVisualization.DEFAULT_VERTEX_DATA.length; i++) {
    var vertex = DijkstraVisualization.DEFAULT_VERTEX_DATA[i];
    this.vertexData.push({ label: vertex.label, x: vertex.x, y: vertex.y });
  }

  this.graphEdges = this.cloneGraphEdges(
    DijkstraVisualization.DEFAULT_GRAPH_EDGES
  );
  this.sortAdjacencyLists();
};

DijkstraVisualization.prototype.randomWeight = function () {
  var min = DijkstraVisualization.MIN_RANDOM_WEIGHT;
  var max = DijkstraVisualization.MAX_RANDOM_WEIGHT;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

DijkstraVisualization.prototype.addDirectedEdge = function (from, to, weight) {
  if (from === to) {
    return;
  }

  var adjacency = this.graphEdges[from];
  for (var i = 0; i < adjacency.length; i++) {
    if (adjacency[i].to === to) {
      adjacency[i].weight = weight;
      return;
    }
  }
  adjacency.push({ to: to, weight: weight });
};

DijkstraVisualization.prototype.generateRandomGraph = function () {
  var layoutIndex = Math.floor(
    Math.random() * DijkstraVisualization.RANDOM_LAYOUTS.length
  );
  var layout = DijkstraVisualization.RANDOM_LAYOUTS[layoutIndex];
  var vertexCount = DijkstraVisualization.DEFAULT_VERTEX_DATA.length;

  this.vertexData = new Array(vertexCount);
  for (var i = 0; i < vertexCount; i++) {
    var vertexTemplate = DijkstraVisualization.DEFAULT_VERTEX_DATA[i];
    var position = layout[i % layout.length];
    this.vertexData[i] = {
      label: vertexTemplate.label,
      x: position.x,
      y: position.y,
    };
  }

  this.graphEdges = new Array(vertexCount);
  for (var j = 0; j < vertexCount; j++) {
    this.graphEdges[j] = [];
  }

  for (var p = 0; p < DijkstraVisualization.ALLOWED_EDGE_PAIRS.length; p++) {
    var pair = DijkstraVisualization.ALLOWED_EDGE_PAIRS[p];
    var from = pair[0];
    var to = pair[1];
    var roll = Math.random();

    if (roll < 0.45) {
      this.addDirectedEdge(from, to, this.randomWeight());
    }
    if (roll > 0.55) {
      this.addDirectedEdge(to, from, this.randomWeight());
    }
  }

  for (var v = 0; v < vertexCount; v++) {
    if (this.graphEdges[v].length === 0) {
      var candidate = v;
      while (candidate === v) {
        candidate = Math.floor(Math.random() * vertexCount);
      }
      this.addDirectedEdge(v, candidate, this.randomWeight());
    }
  }

  this.sortAdjacencyLists();
};

DijkstraVisualization.prototype.createTitle = function () {
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Dijkstra's Shortest Path",
    DijkstraVisualization.CANVAS_WIDTH / 2,
    DijkstraVisualization.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleID, DijkstraVisualization.TITLE_FONT);
  this.cmd("SetForegroundColor", this.titleID, "#102a43");

  this.infoLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.infoLabelID,
    "",
    DijkstraVisualization.CANVAS_WIDTH / 2,
    DijkstraVisualization.INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.infoLabelID, DijkstraVisualization.INFO_FONT);
  this.cmd(
    "SetForegroundColor",
    this.infoLabelID,
    DijkstraVisualization.INFO_PASSIVE_COLOR
  );
  this.cmd(
    "SetBackgroundColor",
    this.infoLabelID,
    DijkstraVisualization.INFO_BACKGROUND_DEFAULT
  );
  this.cmd("SetLayer", this.infoLabelID, 4);

  var initialProgressMetrics = this.computeInfoProgressMetrics(
    DijkstraVisualization.DEFAULT_INFO_TEXT
  );

  this.infoProgressTrackID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.infoProgressTrackID,
    "",
    initialProgressMetrics.width,
    DijkstraVisualization.INFO_PROGRESS_HEIGHT,
    initialProgressMetrics.left,
    initialProgressMetrics.y,
    "left",
    "center"
  );
  this.cmd(
    "SetForegroundColor",
    this.infoProgressTrackID,
    DijkstraVisualization.INFO_PROGRESS_BASE_COLOR
  );
  this.cmd(
    "SetBackgroundColor",
    this.infoProgressTrackID,
    DijkstraVisualization.INFO_PROGRESS_BASE_COLOR
  );
  this.cmd("SetLayer", this.infoProgressTrackID, 2);
  this.cmd("SetAlpha", this.infoProgressTrackID, 0);

  this.infoProgressCoverID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.infoProgressCoverID,
    "",
    initialProgressMetrics.width,
    DijkstraVisualization.INFO_PROGRESS_HEIGHT,
    initialProgressMetrics.left,
    initialProgressMetrics.y,
    "left",
    "center"
  );
  this.cmd(
    "SetForegroundColor",
    this.infoProgressCoverID,
    DijkstraVisualization.INFO_PROGRESS_COLOR
  );
  this.cmd(
    "SetBackgroundColor",
    this.infoProgressCoverID,
    DijkstraVisualization.INFO_PROGRESS_COLOR
  );
  this.cmd("SetLayer", this.infoProgressCoverID, 3);
  this.cmd("SetAlpha", this.infoProgressCoverID, 0);

  this.updateStatus(DijkstraVisualization.DEFAULT_INFO_TEXT, false);
};

DijkstraVisualization.prototype.updateStatus = function (message, animate) {
  if (this.infoLabelID < 0) {
    return;
  }

  var text = message;
  if (!text) {
    text = DijkstraVisualization.DEFAULT_INFO_TEXT;
  }

  if (animate === undefined) {
    animate = true;
  }

  this.cmd("SetText", this.infoLabelID, text);
  this.cmd(
    "SetForegroundColor",
    this.infoLabelID,
    DijkstraVisualization.INFO_PASSIVE_COLOR
  );
  this.cmd(
    "SetBackgroundColor",
    this.infoLabelID,
    DijkstraVisualization.INFO_BACKGROUND_DEFAULT
  );

  if (
    this.infoProgressTrackID < 0 ||
    this.infoProgressCoverID < 0
  ) {
    return;
  }

  var metrics = this.computeInfoProgressMetrics(text);
  var left = metrics.left;
  var y = metrics.y;
  var fullWidth = metrics.width;

  this.cmd("SetWidth", this.infoProgressTrackID, fullWidth);
  this.cmd("SetPosition", this.infoProgressTrackID, left, y);
  this.cmd(
    "SetHeight",
    this.infoProgressTrackID,
    DijkstraVisualization.INFO_PROGRESS_HEIGHT
  );
  this.cmd(
    "SetWidth",
    this.infoProgressCoverID,
    fullWidth
  );
  this.cmd("SetPosition", this.infoProgressCoverID, left, y);
  this.cmd(
    "SetHeight",
    this.infoProgressCoverID,
    DijkstraVisualization.INFO_PROGRESS_HEIGHT
  );

  if (!animate) {
    this.cmd("SetAlpha", this.infoProgressTrackID, 0);
    this.cmd("SetAlpha", this.infoProgressCoverID, 0);
    return;
  }

  this.cmd("SetAlpha", this.infoProgressTrackID, 1);
  this.cmd("SetAlpha", this.infoProgressCoverID, 1);
  this.cmd("Step");

  var steps = DijkstraVisualization.INFO_PROGRESS_STEPS;
  if (!steps || steps < 1) {
    steps = 1;
  }

  var minRemaining = DijkstraVisualization.INFO_PROGRESS_MIN_REMAINING_WIDTH;
  if (!isFinite(minRemaining) || minRemaining < 0) {
    minRemaining = 0;
  }

  for (var s = 0; s < steps; s++) {
    var ratio = (steps - (s + 1)) / steps;
    if (ratio < 0) {
      ratio = 0;
    }

    var remainingWidth = fullWidth * ratio;
    if (remainingWidth < 0) {
      remainingWidth = 0;
    }

    if (remainingWidth > 0 && remainingWidth < minRemaining) {
      remainingWidth = minRemaining;
    }

    var newLeft = left + (fullWidth - remainingWidth);
    this.cmd("SetWidth", this.infoProgressCoverID, remainingWidth);
    this.cmd("SetPosition", this.infoProgressCoverID, newLeft, y);
    this.cmd("Step");
  }

  this.cmd("SetAlpha", this.infoProgressCoverID, 0);
  this.cmd("SetWidth", this.infoProgressCoverID, fullWidth);
  this.cmd("SetPosition", this.infoProgressCoverID, left, y);

  var holdSteps = DijkstraVisualization.INFO_PROGRESS_END_HOLD_STEPS;
  for (var h = 0; h < holdSteps; h++) {
    this.cmd("Step");
  }

  this.cmd("SetAlpha", this.infoProgressTrackID, 0);
};

DijkstraVisualization.prototype.createGraph = function () {
  this.vertexIDs = new Array(this.vertexData.length);

  for (var i = 0; i < this.vertexData.length; i++) {
    var vertex = this.vertexData[i];
    var id = this.nextIndex++;
    this.vertexIDs[i] = id;
    this.cmd(
      "CreateCircle",
      id,
      vertex.label,
      vertex.x,
      vertex.y,
      DijkstraVisualization.NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, DijkstraVisualization.NODE_COLOR);
    this.cmd("SetForegroundColor", id, DijkstraVisualization.NODE_BORDER_COLOR);
    this.cmd("SetTextColor", id, DijkstraVisualization.NODE_TEXT_COLOR);
    this.cmd("SetHighlight", id, 0);
  }

  for (var from = 0; from < this.graphEdges.length; from++) {
    var edges = this.graphEdges[from];
    for (var j = 0; j < edges.length; j++) {
      var edge = edges[j];
      var edgeKey = this.edgeKey(from, edge.to);
      this.edgeMap[edgeKey] = {
        from: from,
        to: edge.to,
        weight: edge.weight,
      };
      var curve = this.shouldCurveEdge(from, edge.to)
        ? this.curveForPair(from, edge.to)
        : 0;
      this.cmd(
        "Connect",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        DijkstraVisualization.EDGE_COLOR,
        curve,
        1,
        String(edge.weight)
      );
      this.cmd(
        "SetEdgeThickness",
        this.vertexIDs[from],
        this.vertexIDs[edge.to],
        DijkstraVisualization.EDGE_THICKNESS
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

DijkstraVisualization.prototype.createTable = function () {
  for (var c = 0; c < DijkstraVisualization.TABLE_COLUMNS.length; c++) {
    var column = DijkstraVisualization.TABLE_COLUMNS[c];
    var headerID = this.nextIndex++;
    this.cmd(
      "CreateLabel",
      headerID,
      column.label,
      column.x,
      DijkstraVisualization.TABLE_HEADER_Y,
      1
    );
    this.cmd("SetTextStyle", headerID, DijkstraVisualization.TABLE_HEADER_FONT);
    this.cmd("SetForegroundColor", headerID, DijkstraVisualization.TABLE_HEADER_COLOR);
  }

  var vertexCount = this.vertexData.length;
  this.vertexCellIDs = new Array(vertexCount);
  this.knownCellIDs = new Array(vertexCount);
  this.distanceCellIDs = new Array(vertexCount);
  this.parentCellIDs = new Array(vertexCount);

  for (var i = 0; i < vertexCount; i++) {
    var rowY = DijkstraVisualization.TABLE_FIRST_ROW_Y +
      i * DijkstraVisualization.TABLE_ROW_HEIGHT;

    var vertexCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      vertexCell,
      this.vertexData[i].label,
      DijkstraVisualization.TABLE_COLUMNS[0].width,
      DijkstraVisualization.TABLE_ROW_HEIGHT - 6,
      DijkstraVisualization.TABLE_COLUMNS[0].x,
      rowY
    );
    this.cmd("SetTextStyle", vertexCell, DijkstraVisualization.TABLE_CELL_FONT);
    this.cmd("SetForegroundColor", vertexCell, DijkstraVisualization.TABLE_BORDER_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      vertexCell,
      DijkstraVisualization.TABLE_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", vertexCell, DijkstraVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", vertexCell, "#ffffff");
    this.vertexCellIDs[i] = vertexCell;

    var knownCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      knownCell,
      "F",
      DijkstraVisualization.TABLE_COLUMNS[1].width,
      DijkstraVisualization.TABLE_ROW_HEIGHT - 6,
      DijkstraVisualization.TABLE_COLUMNS[1].x,
      rowY
    );
    this.cmd("SetTextStyle", knownCell, DijkstraVisualization.TABLE_CELL_FONT);
    this.cmd("SetForegroundColor", knownCell, DijkstraVisualization.TABLE_BORDER_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      knownCell,
      DijkstraVisualization.TABLE_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", knownCell, DijkstraVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", knownCell, "#ffffff");
    this.knownCellIDs[i] = knownCell;

    var distanceCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      distanceCell,
      this.infinitySymbol,
      DijkstraVisualization.TABLE_COLUMNS[2].width,
      DijkstraVisualization.TABLE_ROW_HEIGHT - 6,
      DijkstraVisualization.TABLE_COLUMNS[2].x,
      rowY
    );
    this.cmd(
      "SetTextStyle",
      distanceCell,
      DijkstraVisualization.TABLE_CELL_FONT
    );
    this.cmd(
      "SetForegroundColor",
      distanceCell,
      DijkstraVisualization.TABLE_BORDER_COLOR
    );
    this.cmd(
      "SetRectangleLineThickness",
      distanceCell,
      DijkstraVisualization.TABLE_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", distanceCell, DijkstraVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", distanceCell, "#ffffff");
    this.distanceCellIDs[i] = distanceCell;

    var parentCell = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      parentCell,
      "-",
      DijkstraVisualization.TABLE_COLUMNS[3].width,
      DijkstraVisualization.TABLE_ROW_HEIGHT - 6,
      DijkstraVisualization.TABLE_COLUMNS[3].x,
      rowY
    );
    this.cmd("SetTextStyle", parentCell, DijkstraVisualization.TABLE_CELL_FONT);
    this.cmd("SetForegroundColor", parentCell, DijkstraVisualization.TABLE_BORDER_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      parentCell,
      DijkstraVisualization.TABLE_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", parentCell, DijkstraVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", parentCell, "#ffffff");
    this.parentCellIDs[i] = parentCell;
  }
};

DijkstraVisualization.prototype.createPriorityQueueDisplay = function () {
  this.priorityQueueHeaderID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.priorityQueueHeaderID,
    "Priority Queue",
    DijkstraVisualization.PQ_HEADER_X,
    DijkstraVisualization.PQ_HEADER_Y,
    1
  );
  this.cmd(
    "SetTextStyle",
    this.priorityQueueHeaderID,
    DijkstraVisualization.TABLE_HEADER_FONT
  );
  this.cmd(
    "SetForegroundColor",
    this.priorityQueueHeaderID,
    DijkstraVisualization.PQ_HEADER_COLOR
  );

  this.priorityQueueEmptyLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.priorityQueueEmptyLabelID,
    DijkstraVisualization.PQ_EMPTY_TEXT,
    DijkstraVisualization.PQ_HEADER_X,
    DijkstraVisualization.PQ_FIRST_ROW_Y,
    1
  );
  this.cmd(
    "SetTextStyle",
    this.priorityQueueEmptyLabelID,
    DijkstraVisualization.PQ_EMPTY_FONT
  );
  this.cmd(
    "SetForegroundColor",
    this.priorityQueueEmptyLabelID,
    DijkstraVisualization.INFO_PASSIVE_COLOR
  );

  this.priorityQueueItemIDs = [];
};

DijkstraVisualization.prototype.resetPriorityQueueDisplay = function () {
  this.clearPriorityQueueItems();
  if (this.priorityQueueEmptyLabelID !== -1) {
    this.cmd(
      "SetText",
      this.priorityQueueEmptyLabelID,
      DijkstraVisualization.PQ_EMPTY_TEXT
    );
  }
};

DijkstraVisualization.prototype.clearPriorityQueueItems = function () {
  if (!this.priorityQueueItemIDs) {
    this.priorityQueueItemIDs = [];
    return;
  }
  for (var i = 0; i < this.priorityQueueItemIDs.length; i++) {
    this.cmd("Delete", this.priorityQueueItemIDs[i]);
  }
  this.priorityQueueItemIDs = [];
};

DijkstraVisualization.prototype.renderPriorityQueueItems = function (
  queue,
  highlightVertex
) {
  this.clearPriorityQueueItems();

  if (!queue || queue.length === 0) {
    if (this.priorityQueueEmptyLabelID !== -1) {
      this.cmd(
        "SetText",
        this.priorityQueueEmptyLabelID,
        DijkstraVisualization.PQ_EMPTY_TEXT
      );
    }
    return;
  }

  if (this.priorityQueueEmptyLabelID !== -1) {
    this.cmd("SetText", this.priorityQueueEmptyLabelID, "");
  }

  var sorted = queue.slice(0);
  sorted.sort(function (a, b) {
    return a.distance - b.distance;
  });

  var highlightIndex = typeof highlightVertex === "number" ? highlightVertex : -1;

  for (var i = 0; i < sorted.length; i++) {
    var item = sorted[i];
    var label =
      this.vertexData[item.vertex].label +
      " (" +
      this.formatDistance(item.distance) +
      ")";
    var rectID = this.nextIndex++;
    var rowY =
      DijkstraVisualization.PQ_FIRST_ROW_Y +
      i * DijkstraVisualization.PQ_ROW_HEIGHT;
    this.cmd(
      "CreateRectangle",
      rectID,
      label,
      DijkstraVisualization.PQ_ITEM_WIDTH,
      DijkstraVisualization.PQ_ITEM_HEIGHT,
      DijkstraVisualization.PQ_HEADER_X,
      rowY
    );
    this.cmd("SetTextStyle", rectID, DijkstraVisualization.PQ_FONT);
    this.cmd(
      "SetForegroundColor",
      rectID,
      DijkstraVisualization.PQ_TEXT_COLOR
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      item.vertex === highlightIndex
        ? DijkstraVisualization.PQ_HIGHLIGHT_COLOR
        : "#ffffff"
    );
    this.priorityQueueItemIDs.push(rectID);
  }
};

DijkstraVisualization.prototype.peekPriorityQueue = function (queue) {
  if (!queue || queue.length === 0) {
    return null;
  }

  var best = queue[0];
  for (var i = 1; i < queue.length; i++) {
    if (queue[i].distance < best.distance) {
      best = queue[i];
    } else if (queue[i].distance === best.distance) {
      var currentLabel = this.vertexData[queue[i].vertex].label;
      var bestLabel = this.vertexData[best.vertex].label;
      if (currentLabel < bestLabel) {
        best = queue[i];
      }
    }
  }
  return best;
};

DijkstraVisualization.prototype.createCodeDisplay = function () {
  this.codeID = this.addCodeToCanvasBase(
    DijkstraVisualization.CODE_LINES,
    DijkstraVisualization.CODE_LEFT_X,
    DijkstraVisualization.CODE_START_Y,
    DijkstraVisualization.CODE_LINE_HEIGHT,
    DijkstraVisualization.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], DijkstraVisualization.CODE_FONT);
    }
  }

  this.pathsTitleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.pathsTitleID,
    "Shortest Paths",
    DijkstraVisualization.PATH_START_X,
    DijkstraVisualization.CODE_TITLE_Y,
    0
  );
  this.cmd("SetTextStyle", this.pathsTitleID, DijkstraVisualization.PATH_TITLE_FONT);
  this.cmd("SetForegroundColor", this.pathsTitleID, DijkstraVisualization.PATH_TITLE_COLOR);
};

DijkstraVisualization.prototype.clearPathsDisplay = function () {
  if (!this.pathLabelIDs) {
    this.pathLabelIDs = [];
  }

  for (var i = 0; i < this.pathLabelIDs.length; i++) {
    this.cmd("Delete", this.pathLabelIDs[i]);
  }

  this.pathLabelIDs = [];
  this.pathLabelsByVertex = {};
  this.pathOrder = [];
};

DijkstraVisualization.prototype.buildPathString = function (
  vertexIndex,
  parent,
  startIndex
) {
  var labels = [];
  var current = vertexIndex;
  var guard = 0;
  while (current !== -1 && guard <= parent.length) {
    labels.push(this.vertexData[current].label);
    if (current === startIndex) {
      break;
    }
    current = parent[current];
    guard++;
  }

  labels.reverse();
  return labels.join(" → ");
};

DijkstraVisualization.prototype.initializePathsPanel = function (startIndex) {
  this.clearPathsDisplay();

  if (this.pathsTitleID >= 0) {
    this.cmd(
      "SetText",
      this.pathsTitleID,
      "Paths from " + this.vertexData[startIndex].label
    );
  }
};

DijkstraVisualization.prototype.ensurePathLabel = function (vertexIndex) {
  if (this.pathLabelsByVertex.hasOwnProperty(vertexIndex)) {
    return this.pathLabelsByVertex[vertexIndex];
  }

  var row = this.pathOrder.length;
  var y =
    DijkstraVisualization.PATH_START_Y +
    row * DijkstraVisualization.PATH_LINE_HEIGHT;

  var labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    "",
    DijkstraVisualization.PATH_START_X,
    y,
    0
  );
  this.cmd("SetTextStyle", labelID, DijkstraVisualization.PATH_FONT);
  this.cmd("SetForegroundColor", labelID, DijkstraVisualization.PATH_TEXT_COLOR);

  this.pathLabelsByVertex[vertexIndex] = labelID;
  this.pathOrder.push(vertexIndex);
  this.pathLabelIDs.push(labelID);
  return labelID;
};

DijkstraVisualization.prototype.composePathLine = function (
  vertexIndex,
  parent,
  startIndex,
  dist
) {
  var pathText = this.buildPathString(vertexIndex, parent, startIndex);
  var hasPath = pathText && pathText.length > 0;
  var distance = dist && dist[vertexIndex] !== undefined && dist[vertexIndex] !== Infinity
    ? dist[vertexIndex]
    : null;

  var segments = [];

  if (hasPath) {
    segments.push(pathText);
  }

  if (distance !== null) {
    segments.push("[" + distance + "]");
  }

  return segments.join(" ");
};

DijkstraVisualization.prototype.updateAnimatedPath = function (
  vertexIndex,
  parent,
  startIndex,
  dist,
  skipStep
) {
  if (!dist || dist[vertexIndex] === Infinity) {
    return;
  }

  var existed = this.pathLabelsByVertex.hasOwnProperty(vertexIndex);
  var labelID = this.ensurePathLabel(vertexIndex);
  var text = this.composePathLine(vertexIndex, parent, startIndex, dist);
  this.cmd("SetText", labelID, text);
  if (!skipStep || !existed) {
    this.cmd("Step");
  }
};

DijkstraVisualization.prototype.finalizePathsDisplay = function (
  startIndex,
  parent,
  dist
) {
  if (!dist) {
    return;
  }

  for (var i = 0; i < dist.length; i++) {
    if (dist[i] === Infinity) {
      continue;
    }
    this.updateAnimatedPath(i, parent, startIndex, dist, true);
  }
};

DijkstraVisualization.prototype.edgeKey = function (from, to) {
  return from + "->" + to;
};

DijkstraVisualization.prototype.pairKey = function (a, b) {
  return a < b ? a + ":" + b : b + ":" + a;
};

DijkstraVisualization.prototype.shouldCurveEdge = function (from, to) {
  return from !== to && this.graphHasEdge(to, from);
};

DijkstraVisualization.prototype.curveForPair = function (from, to) {
  var orientation = this.getBidirectionalOrientation(from, to);
  var magnitude = from < to
    ? DijkstraVisualization.BIDIRECTIONAL_CURVE_INNER
    : DijkstraVisualization.BIDIRECTIONAL_CURVE_OUTER;
  return orientation * magnitude;
};

DijkstraVisualization.prototype.getBidirectionalOrientation = function (
  from,
  to
) {
  var key = this.pairKey(from, to);
  if (this.bidirectionalOrientation.hasOwnProperty(key)) {
    return this.bidirectionalOrientation[key];
  }

  var fromVertex = this.vertexData[from];
  var toVertex = this.vertexData[to];
  var midY = (fromVertex.y + toVertex.y) / 2;
  var orientation = midY < DijkstraVisualization.TABLE_HEADER_Y ? -1 : 1;

  this.bidirectionalOrientation[key] = orientation;
  return orientation;
};

DijkstraVisualization.prototype.graphHasEdge = function (from, to) {
  var adjacency = this.graphEdges[from] || [];
  for (var i = 0; i < adjacency.length; i++) {
    if (adjacency[i].to === to) {
      return true;
    }
  }
  return false;
};

DijkstraVisualization.prototype.highlightCodeLine = function (line) {
  if (this.currentCodeLine !== -1 && this.codeID[this.currentCodeLine]) {
    for (var j = 0; j < this.codeID[this.currentCodeLine].length; j++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[this.currentCodeLine][j],
        DijkstraVisualization.CODE_STANDARD_COLOR
      );
      this.cmd(
        "SetTextStyle",
        this.codeID[this.currentCodeLine][j],
        DijkstraVisualization.CODE_FONT
      );
    }
  }

  this.currentCodeLine = line;

  if (line >= 0 && this.codeID[line]) {
    for (var k = 0; k < this.codeID[line].length; k++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[line][k],
        DijkstraVisualization.CODE_HIGHLIGHT_COLOR
      );
      this.cmd(
        "SetTextStyle",
        this.codeID[line][k],
        DijkstraVisualization.CODE_HIGHLIGHT_FONT
      );
    }
  }
};

DijkstraVisualization.prototype.cleanInputLabel = function (value) {
  if (!value) {
    return "";
  }
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase();
};

DijkstraVisualization.prototype.setStartFieldValue = function (value) {
  if (this.startField) {
    this.startField.value = value;
  }
};

DijkstraVisualization.prototype.getStartFieldValue = function () {
  return this.startField ? this.startField.value : "";
};

DijkstraVisualization.prototype.findVertexIndex = function (label) {
  var clean = this.cleanInputLabel(label);
  for (var i = 0; i < this.vertexData.length; i++) {
    if (this.vertexData[i].label === clean) {
      return i;
    }
  }
  return -1;
};

DijkstraVisualization.prototype.formatDistance = function (value) {
  if (value === Infinity) {
    return this.infinitySymbol;
  }

  if (typeof value === "number") {
    if (!isFinite(value)) {
      return this.infinitySymbol;
    }
    return value.toString();
  }

  if (value === undefined || value === null) {
    return this.infinitySymbol;
  }

  return String(value);
};

DijkstraVisualization.prototype.startCallback = function () {
  var value = this.getStartFieldValue();
  var index = this.findVertexIndex(value);
  if (index === -1) {
    index = 0;
    this.setStartFieldValue(this.vertexData[0].label);
  } else {
    this.setStartFieldValue(this.vertexData[index].label);
  }

  this.implementAction(this.runDijkstra.bind(this), index);
};

DijkstraVisualization.prototype.runDijkstra = function (startIndex) {
  this.commands = [];

  this.resetTableState();
  this.resetGraphState();
  this.initializePathsPanel(startIndex);
  this.resetPriorityQueueDisplay();

  var startLabel = this.vertexData[startIndex].label;
  this.updateStatus("Running Dijkstra from vertex " + startLabel + ".");

  var vertexCount = this.vertexData.length;
  var dist = new Array(vertexCount);
  var parent = new Array(vertexCount);
  var visited = new Array(vertexCount);

  for (var i = 0; i < vertexCount; i++) {
    dist[i] = Infinity;
    parent[i] = -1;
    visited[i] = false;
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

  this.highlightCodeLine(6);
  this.cmd("Step");
  dist[startIndex] = 0;
  this.updateDistanceCell(startIndex, 0, true);
  this.updateAnimatedPath(startIndex, parent, startIndex, dist);
  this.updateDistanceCell(startIndex, 0, false);

  this.highlightCodeLine(7);
  this.cmd("Step");
  var pq = [];
  this.highlightCodeLine(8);
  this.cmd("Step");
  pq.push({ vertex: startIndex, distance: 0 });
  this.renderPriorityQueueItems(pq, startIndex);

  this.highlightCodeLine(9);
  this.cmd("Step");
  this.renderPriorityQueueItems(pq);

  while (pq.length > 0) {
    var nextEntry = this.peekPriorityQueue(pq);
    this.highlightCodeLine(10);
    this.renderPriorityQueueItems(
      pq,
      nextEntry ? nextEntry.vertex : -1
    );
    this.cmd("Step");

    pq.sort(function (a, b) {
      return a.distance - b.distance;
    });

    var current = pq.shift();
    var u = current.vertex;

    this.renderPriorityQueueItems(pq);

    this.highlightCodeLine(11);
    this.cmd("Step");

    if (visited[u]) {
      this.renderPriorityQueueItems(pq);
      this.cmd("Step");
      continue;
    }

    this.highlightCodeLine(12);
    this.updateStatus(
      "Processing vertex " +
        this.vertexData[u].label +
        " with current distance " +
        this.formatDistance(dist[u]) +
        "."
    );
    visited[u] = true;
    this.setKnownCell(u, true);
    this.highlightVertex(u, DijkstraVisualization.NODE_ACTIVE_COLOR);
    this.cmd("Step");

    this.highlightVertex(u, DijkstraVisualization.NODE_VISITED_COLOR, true);

    this.highlightCodeLine(13);
    this.cmd("Step");
    var neighbors = this.graphEdges[u];
    var i;
    for (i = 0; i < neighbors.length; i++) {
      var edge = neighbors[i];
      var v = edge.to;
      var weight = edge.weight;
      var fromLabel = this.vertexData[u].label;
      var toLabel = this.vertexData[v].label;

      this.highlightCodeLine(13);
      this.cmd("Step");

      this.highlightCodeLine(14);
      this.highlightEdge(u, v, true);
      this.cmd("Step");

      this.highlightCodeLine(15);
      var alternative = dist[u] + weight;
      var formattedFromDistance = this.formatDistance(dist[u]);
      var formattedAlternative = this.formatDistance(alternative);
      var formattedCurrent = this.formatDistance(dist[v]);
      this.updateStatus(
        "Checking edge " +
          fromLabel +
          " → " +
          toLabel +
          " with weight " +
          weight +
          ". Current path cost: " +
          formattedFromDistance +
          " + " +
          weight +
          " = " +
          formattedAlternative +
          "."
      );
      this.cmd("Step");

      if (alternative < dist[v]) {
        this.highlightCodeLine(16);
        dist[v] = alternative;
        parent[v] = u;
        this.updateDistanceCell(v, alternative, true);
        this.updateStatus(
          "Updated distance of " +
            toLabel +
            " to " +
            formattedAlternative +
            " via " +
            fromLabel +
            " (" +
            formattedFromDistance +
            " + " +
            weight +
            ")."
        );
        this.cmd("Step");
        this.updateDistanceCell(v, alternative, false);

        this.highlightCodeLine(17);
        this.updateParentCell(v, u, true);
        this.cmd("Step");
        this.updateParentCell(v, u, false);

        this.updateAnimatedPath(v, parent, startIndex, dist);

        this.highlightCodeLine(18);
        pq.push({ vertex: v, distance: alternative });
        this.renderPriorityQueueItems(pq, v);
        this.cmd("Step");
        this.renderPriorityQueueItems(pq);
      } else {
        this.updateStatus(
          "Keeping current distance of " +
            toLabel +
            " (" +
            formattedCurrent +
            ") because the alternative path costs " +
            formattedAlternative +
            "."
        );
        this.cmd("Step");
      }

      this.highlightCodeLine(19);
      this.highlightEdge(u, v, false);
      this.cmd("Step");
    }

    this.highlightCodeLine(20);
    this.updateStatus(
      "Completed processing vertex " +
        this.vertexData[u].label +
        "."
    );
    this.cmd("Step");
  }

  this.highlightCodeLine(21);
  this.updateStatus("Dijkstra computation complete.");
  this.cmd("Step");
  this.renderPriorityQueueItems(pq);
  this.highlightCodeLine(22);
  this.cmd("Step");

  this.highlightCodeLine(-1);

  this.finalizePathsDisplay(startIndex, parent, dist);

  return this.commands;
};

DijkstraVisualization.prototype.resetTableState = function () {
  for (var i = 0; i < this.knownCellIDs.length; i++) {
    this.cmd("SetText", this.knownCellIDs[i], "F");
    this.cmd("SetBackgroundColor", this.knownCellIDs[i], "#ffffff");
  }
  for (var j = 0; j < this.distanceCellIDs.length; j++) {
    this.cmd("SetText", this.distanceCellIDs[j], this.infinitySymbol);
    this.cmd("SetBackgroundColor", this.distanceCellIDs[j], "#ffffff");
  }
  for (var k = 0; k < this.parentCellIDs.length; k++) {
    this.cmd("SetText", this.parentCellIDs[k], "-");
    this.cmd("SetBackgroundColor", this.parentCellIDs[k], "#ffffff");
  }
};

DijkstraVisualization.prototype.resetGraphState = function () {
  for (var i = 0; i < this.vertexIDs.length; i++) {
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[i],
      DijkstraVisualization.NODE_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[i],
      DijkstraVisualization.NODE_TEXT_COLOR
    );
  }

  for (var key in this.edgeMap) {
    if (this.edgeMap.hasOwnProperty(key)) {
      var edge = this.edgeMap[key];
      this.cmd(
        "SetEdgeColor",
        this.vertexIDs[edge.from],
        this.vertexIDs[edge.to],
        DijkstraVisualization.EDGE_COLOR
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

DijkstraVisualization.prototype.updateDistanceCell = function (
  index,
  value,
  highlight
) {
  this.cmd("SetText", this.distanceCellIDs[index], value);
  if (highlight) {
    this.cmd(
      "SetBackgroundColor",
      this.distanceCellIDs[index],
      DijkstraVisualization.TABLE_HIGHLIGHT_COLOR
    );
  } else {
    this.cmd("SetBackgroundColor", this.distanceCellIDs[index], "#ffffff");
  }
};

DijkstraVisualization.prototype.updateParentCell = function (
  index,
  parentIndex,
  highlight
) {
  var parentLabel = parentIndex === -1
    ? "-"
    : this.vertexData[parentIndex].label;
  var shouldHighlight = highlight;
  if (typeof shouldHighlight !== "boolean") {
    shouldHighlight = true;
  }
  this.cmd("SetText", this.parentCellIDs[index], parentLabel);
  this.cmd(
    "SetBackgroundColor",
    this.parentCellIDs[index],
    shouldHighlight ? DijkstraVisualization.TABLE_HIGHLIGHT_COLOR : "#ffffff"
  );
};

DijkstraVisualization.prototype.setKnownCell = function (index, known) {
  this.cmd("SetText", this.knownCellIDs[index], known ? "T" : "F");
  this.cmd(
    "SetBackgroundColor",
    this.knownCellIDs[index],
    known ? DijkstraVisualization.TABLE_HIGHLIGHT_COLOR : "#ffffff"
  );
};

DijkstraVisualization.prototype.highlightVertex = function (
  index,
  color,
  visited
) {
  this.cmd("SetBackgroundColor", this.vertexIDs[index], color);
  if (visited) {
    this.cmd(
      "SetTextColor",
      this.vertexIDs[index],
      DijkstraVisualization.NODE_VISITED_TEXT_COLOR
    );
  }
};

DijkstraVisualization.prototype.highlightEdge = function (from, to, active) {
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
      ? DijkstraVisualization.EDGE_HIGHLIGHT_COLOR
      : DijkstraVisualization.EDGE_COLOR
  );
};

DijkstraVisualization.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

DijkstraVisualization.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new DijkstraVisualization(animManag, canvas.width, canvas.height);
}

