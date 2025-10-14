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
DijkstraVisualization.TABLE_COLUMNS = [
  { label: "Vertex", x: 120, width: 90 },
  { label: "Known", x: 280, width: 100 },
  { label: "Distance", x: 440, width: 140 },
  { label: "Parent", x: 600, width: 110 },
];
DijkstraVisualization.TABLE_HEADER_FONT = "bold 20";
DijkstraVisualization.TABLE_CELL_FONT = "bold 18";
DijkstraVisualization.TABLE_HEADER_COLOR = "#1a237e";
DijkstraVisualization.TABLE_TEXT_COLOR = "#1f2933";
DijkstraVisualization.TABLE_HIGHLIGHT_COLOR = "#ffe0b2";

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
DijkstraVisualization.PATH_LEFT_COLOR = "#7ec8e3";
DijkstraVisualization.PATH_START_X = DijkstraVisualization.CODE_LEFT_X + 460;
DijkstraVisualization.PATH_VALUE_START_X = DijkstraVisualization.PATH_START_X + 80;
DijkstraVisualization.PATH_START_Y = DijkstraVisualization.CODE_START_Y;
DijkstraVisualization.PATH_LINE_HEIGHT = 30;

DijkstraVisualization.INFO_Y = DijkstraVisualization.TITLE_Y + 48;
DijkstraVisualization.INFO_FONT = "bold 20";
DijkstraVisualization.INFO_COLOR = "#000000";
DijkstraVisualization.INFO_BACKDROP_COLOR = "#fff9c4";
DijkstraVisualization.INFO_BACKGROUND_DEFAULT = "#f6f7fb";
DijkstraVisualization.INFO_HIGHLIGHT_COLOR = "#fff4b8";
DijkstraVisualization.INFO_HIGHLIGHT_WIDTH = 620;
DijkstraVisualization.INFO_HIGHLIGHT_HEIGHT = 44;
DijkstraVisualization.INFO_HIGHLIGHT_LEFT_X =
  DijkstraVisualization.CANVAS_WIDTH / 2 -
  DijkstraVisualization.INFO_HIGHLIGHT_WIDTH / 2;
DijkstraVisualization.INFO_CURSOR_WIDTH = 12;
DijkstraVisualization.INFO_CURSOR_COLOR = "#ffec8b";
DijkstraVisualization.INFO_CURSOR_ALPHA = 0.85;
DijkstraVisualization.INFO_MIN_HIGHLIGHT_WIDTH = 18;
DijkstraVisualization.INFO_WORD_EXTRA_STEPS = 0;
DijkstraVisualization.INFO_PUNCTUATION_EXTRA_STEPS = 1;
DijkstraVisualization.INFO_END_HOLD_STEPS = 1;
DijkstraVisualization.DEFAULT_INFO_TEXT =
  "Click 'Run Dijkstra' to watch the animation. Use 'New Graph' for variety.";

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
  this.infoBackdropID = -1;
  this.infoHighlightID = -1;
  this.infoCursorID = -1;

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
  this.infoBackdropID = -1;
  this.infoHighlightID = -1;
  this.infoCursorID = -1;
  this.statusID = -1;

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

  this.infoBackdropID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.infoBackdropID,
    "",
    DijkstraVisualization.INFO_HIGHLIGHT_WIDTH,
    DijkstraVisualization.INFO_HIGHLIGHT_HEIGHT,
    DijkstraVisualization.INFO_HIGHLIGHT_LEFT_X,
    DijkstraVisualization.INFO_Y,
    "left",
    "center"
  );
  this.cmd(
    "SetForegroundColor",
    this.infoBackdropID,
    DijkstraVisualization.INFO_BACKDROP_COLOR
  );
  this.cmd(
    "SetBackgroundColor",
    this.infoBackdropID,
    DijkstraVisualization.INFO_BACKDROP_COLOR
  );
  this.cmd("SetLayer", this.infoBackdropID, 1);
  this.cmd("SetAlpha", this.infoBackdropID, 0);
  this.cmd(
    "SetPosition",
    this.infoBackdropID,
    DijkstraVisualization.INFO_HIGHLIGHT_LEFT_X,
    DijkstraVisualization.INFO_Y
  );

  this.infoHighlightID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.infoHighlightID,
    "",
    DijkstraVisualization.INFO_HIGHLIGHT_WIDTH,
    DijkstraVisualization.INFO_HIGHLIGHT_HEIGHT,
    DijkstraVisualization.INFO_HIGHLIGHT_LEFT_X,
    DijkstraVisualization.INFO_Y,
    "left",
    "center"
  );
  this.cmd(
    "SetForegroundColor",
    this.infoHighlightID,
    DijkstraVisualization.INFO_HIGHLIGHT_COLOR
  );
  this.cmd(
    "SetBackgroundColor",
    this.infoHighlightID,
    DijkstraVisualization.INFO_HIGHLIGHT_COLOR
  );
  this.cmd("SetLayer", this.infoHighlightID, 2);
  this.cmd("SetAlpha", this.infoHighlightID, 0);
  this.cmd(
    "SetPosition",
    this.infoHighlightID,
    DijkstraVisualization.INFO_HIGHLIGHT_LEFT_X,
    DijkstraVisualization.INFO_Y
  );
  this.cmd("SetWidth", this.infoHighlightID, 0);

  this.infoCursorID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.infoCursorID,
    "",
    DijkstraVisualization.INFO_CURSOR_WIDTH,
    DijkstraVisualization.INFO_HIGHLIGHT_HEIGHT,
    DijkstraVisualization.INFO_HIGHLIGHT_LEFT_X,
    DijkstraVisualization.INFO_Y,
    "center",
    "center"
  );
  this.cmd(
    "SetBackgroundColor",
    this.infoCursorID,
    DijkstraVisualization.INFO_CURSOR_COLOR
  );
  this.cmd(
    "SetForegroundColor",
    this.infoCursorID,
    DijkstraVisualization.INFO_CURSOR_COLOR
  );
  this.cmd("SetLayer", this.infoCursorID, 3);
  this.cmd("SetAlpha", this.infoCursorID, 0);

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
  this.cmd("SetForegroundColor", this.infoLabelID, DijkstraVisualization.INFO_COLOR);
  this.cmd(
    "SetBackgroundColor",
    this.infoLabelID,
    DijkstraVisualization.INFO_BACKGROUND_DEFAULT
  );
  this.cmd("SetLayer", this.infoLabelID, 4);

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

  this.cmd("SetForegroundColor", this.infoLabelID, DijkstraVisualization.INFO_COLOR);
  var highlightExists = this.infoHighlightID >= 0;
  var cursorExists = this.infoCursorID >= 0;
  var backdropExists = this.infoBackdropID >= 0;

  if (!highlightExists || !animate) {
    this.cmd("SetText", this.infoLabelID, text);
    this.cmd(
      "SetBackgroundColor",
      this.infoLabelID,
      DijkstraVisualization.INFO_BACKGROUND_DEFAULT
    );
    if (backdropExists) {
      this.cmd("SetAlpha", this.infoBackdropID, 0);
    }
    if (highlightExists) {
      this.cmd("SetAlpha", this.infoHighlightID, 0);
      this.cmd("SetWidth", this.infoHighlightID, 0);
    }
    if (cursorExists) {
      this.cmd("SetAlpha", this.infoCursorID, 0);
    }
    return;
  }

  this.cmd("SetText", this.infoLabelID, "");
  this.cmd(
    "SetBackgroundColor",
    this.infoLabelID,
    DijkstraVisualization.INFO_BACKGROUND_DEFAULT
  );
  if (backdropExists) {
    this.cmd(
      "SetPosition",
      this.infoBackdropID,
      DijkstraVisualization.INFO_HIGHLIGHT_LEFT_X,
      DijkstraVisualization.INFO_Y
    );
    this.cmd("SetAlpha", this.infoBackdropID, 1);
    this.cmd(
      "SetWidth",
      this.infoBackdropID,
      DijkstraVisualization.INFO_HIGHLIGHT_WIDTH
    );
  }
  this.cmd("SetAlpha", this.infoHighlightID, 1);
  this.cmd(
    "SetPosition",
    this.infoHighlightID,
    DijkstraVisualization.INFO_HIGHLIGHT_LEFT_X,
    DijkstraVisualization.INFO_Y
  );
  this.cmd(
    "SetWidth",
    this.infoHighlightID,
    DijkstraVisualization.INFO_MIN_HIGHLIGHT_WIDTH
  );

  var cursorStartX =
    DijkstraVisualization.INFO_HIGHLIGHT_LEFT_X +
    DijkstraVisualization.INFO_MIN_HIGHLIGHT_WIDTH;
  if (cursorExists) {
    this.cmd(
      "SetPosition",
      this.infoCursorID,
      cursorStartX,
      DijkstraVisualization.INFO_Y
    );
    this.cmd(
      "SetAlpha",
      this.infoCursorID,
      DijkstraVisualization.INFO_CURSOR_ALPHA
    );
  }

  var tokens = text.match(/[^\s]+|\s+/g);
  if (!tokens) {
    tokens = [text];
  }

  var compactLength = text.replace(/\s+/g, "").length;
  if (compactLength === 0) {
    compactLength = text.length;
  }
  if (compactLength === 0) {
    compactLength = 1;
  }

  var revealedChars = 0;
  var rendered = "";
  var leftEdge = DijkstraVisualization.INFO_HIGHLIGHT_LEFT_X;
  var fullWidth = DijkstraVisualization.INFO_HIGHLIGHT_WIDTH;

  for (var t = 0; t < tokens.length; t++) {
    rendered += tokens[t];
    this.cmd("SetText", this.infoLabelID, rendered);

    var trimmed = tokens[t].replace(/\s+/g, "");
    if (trimmed.length === 0) {
      continue;
    }

    revealedChars += trimmed.length;
    if (revealedChars > compactLength) {
      revealedChars = compactLength;
    }

    var ratio = revealedChars / compactLength;
    if (ratio < 0) {
      ratio = 0;
    } else if (ratio > 1) {
      ratio = 1;
    }

    var highlightWidth = Math.max(
      DijkstraVisualization.INFO_MIN_HIGHLIGHT_WIDTH,
      fullWidth * ratio
    );
    if (highlightWidth > fullWidth) {
      highlightWidth = fullWidth;
    }
    this.cmd("SetWidth", this.infoHighlightID, highlightWidth);

    if (cursorExists) {
      var caretX = leftEdge + highlightWidth;
      if (caretX > leftEdge + fullWidth) {
        caretX = leftEdge + fullWidth;
      }
      this.cmd(
        "SetPosition",
        this.infoCursorID,
        caretX,
        DijkstraVisualization.INFO_Y
      );
    }

    this.cmd("Step");

    for (
      var hold = 0;
      hold < DijkstraVisualization.INFO_WORD_EXTRA_STEPS;
      hold++
    ) {
      this.cmd("Step");
    }

    if (/[.,!?;:]$/.test(trimmed)) {
      for (
        var pause = 0;
        pause < DijkstraVisualization.INFO_PUNCTUATION_EXTRA_STEPS;
        pause++
      ) {
        this.cmd("Step");
      }
    }
  }

  this.cmd("SetText", this.infoLabelID, text);

  if (backdropExists) {
    this.cmd("SetAlpha", this.infoBackdropID, 0);
  }
  this.cmd("SetAlpha", this.infoHighlightID, 0);
  this.cmd("SetWidth", this.infoHighlightID, 0);
  if (cursorExists) {
    this.cmd("SetAlpha", this.infoCursorID, 0);
  }

  for (
    var finishHold = 0;
    finishHold < DijkstraVisualization.INFO_END_HOLD_STEPS;
    finishHold++
  ) {
    this.cmd("Step");
  }
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
    this.cmd("SetForegroundColor", vertexCell, DijkstraVisualization.TABLE_TEXT_COLOR);
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
    this.cmd("SetForegroundColor", knownCell, DijkstraVisualization.TABLE_TEXT_COLOR);
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
    this.cmd("SetForegroundColor", distanceCell, DijkstraVisualization.TABLE_TEXT_COLOR);
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
    this.cmd("SetForegroundColor", parentCell, DijkstraVisualization.TABLE_TEXT_COLOR);
    this.cmd("SetBackgroundColor", parentCell, "#ffffff");
    this.parentCellIDs[i] = parentCell;
  }
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

  var leftID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    leftID,
    "",
    DijkstraVisualization.PATH_START_X,
    y,
    0
  );
  this.cmd("SetTextStyle", leftID, DijkstraVisualization.PATH_FONT);
  this.cmd("SetForegroundColor", leftID, DijkstraVisualization.PATH_LEFT_COLOR);

  var rightID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    rightID,
    "",
    DijkstraVisualization.PATH_VALUE_START_X,
    y,
    0
  );
  this.cmd("SetTextStyle", rightID, DijkstraVisualization.PATH_FONT);
  this.cmd("SetForegroundColor", rightID, DijkstraVisualization.PATH_TEXT_COLOR);

  var labelPair = {
    left: leftID,
    right: rightID,
  };

  this.pathLabelsByVertex[vertexIndex] = labelPair;
  this.pathOrder.push(vertexIndex);
  this.pathLabelIDs.push(leftID);
  this.pathLabelIDs.push(rightID);
  return labelPair;
};

DijkstraVisualization.prototype.composePathLine = function (
  vertexIndex,
  parent,
  startIndex,
  dist
) {
  var vertexLabel = this.vertexData[vertexIndex].label;
  var parentIndex = parent[vertexIndex];
  var parentLabel = parentIndex === -1
    ? "∅"
    : this.vertexData[parentIndex].label;
  var pathText = this.buildPathString(vertexIndex, parent, startIndex);
  var hasPath = pathText && pathText.length > 0;
  var distance = dist && dist[vertexIndex] !== undefined && dist[vertexIndex] !== Infinity
    ? dist[vertexIndex]
    : null;

  var leftPart = vertexLabel + " → " + parentLabel;
  var segments = [];

  if (hasPath) {
    leftPart += ":";
    segments.push(pathText);
  }

  if (distance !== null) {
    segments.push("[" + distance + "]");
  }

  var rightPart = segments.join(" ");

  return {
    left: leftPart,
    right: rightPart,
  };
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
  var labelPair = this.ensurePathLabel(vertexIndex);
  var text = this.composePathLine(vertexIndex, parent, startIndex, dist);
  this.cmd("SetText", labelPair.left, text.left);
  this.cmd("SetText", labelPair.right, text.right);
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

  this.highlightCodeLine(9);
  this.cmd("Step");

  while (pq.length > 0) {
    pq.sort(function (a, b) {
      return a.distance - b.distance;
    });

    var current = pq.shift();
    var u = current.vertex;

    this.highlightCodeLine(10);
    this.cmd("Step");

    this.highlightCodeLine(11);
    this.cmd("Step");

    if (visited[u]) {
      this.cmd("Step");
      continue;
    }

    this.highlightCodeLine(12);
    this.updateStatus(
      "Processing vertex " +
        this.vertexData[u].label +
        " with current distance " +
        (dist[u] === Infinity ? this.infinitySymbol : dist[u]) +
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
      this.updateStatus(
        "Checking edge " +
          fromLabel +
          " → " +
          toLabel +
          " with weight " +
          weight +
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
            alternative +
            " via " +
            fromLabel +
            "."
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
        this.cmd("Step");
      } else {
        this.updateStatus(
          "Keeping current distance of " +
            toLabel +
            " (" +
            (dist[v] === Infinity ? this.infinitySymbol : dist[v]) +
            ") because it is shorter."
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

