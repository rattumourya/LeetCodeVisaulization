// Custom visualization for Dijkstra's algorithm on a directed graph using a 9:16 canvas.

function DirectedDijkstra(am, w, h) {
  this.init(am, w, h);
}

DirectedDijkstra.prototype = new Algorithm();
DirectedDijkstra.prototype.constructor = DirectedDijkstra;
DirectedDijkstra.superclass = Algorithm.prototype;

DirectedDijkstra.CANVAS_WIDTH = 900;
DirectedDijkstra.CANVAS_HEIGHT = 1600;

DirectedDijkstra.ROW1_HEIGHT = 240;
DirectedDijkstra.ROW2_HEIGHT = 760;
DirectedDijkstra.ROW3_HEIGHT =
  DirectedDijkstra.CANVAS_HEIGHT - DirectedDijkstra.ROW1_HEIGHT - DirectedDijkstra.ROW2_HEIGHT;

DirectedDijkstra.ROW1_CENTER_Y = DirectedDijkstra.ROW1_HEIGHT / 2;
DirectedDijkstra.ROW2_START_Y = DirectedDijkstra.ROW1_HEIGHT;
DirectedDijkstra.ROW3_START_Y =
  DirectedDijkstra.ROW1_HEIGHT + DirectedDijkstra.ROW2_HEIGHT;

DirectedDijkstra.TITLE_Y = DirectedDijkstra.ROW1_CENTER_Y - 40;
DirectedDijkstra.START_INFO_Y = DirectedDijkstra.ROW1_CENTER_Y + 40;

DirectedDijkstra.GRAPH_AREA_CENTER_X = 320;
DirectedDijkstra.GRAPH_NODE_RADIUS = 22;
DirectedDijkstra.GRAPH_NODE_COLOR = "#e3f2fd";
DirectedDijkstra.GRAPH_NODE_BORDER = "#0b3954";
DirectedDijkstra.GRAPH_NODE_TEXT = "#003049";
DirectedDijkstra.GRAPH_NODE_VISITED_COLOR = "#66bb6a";
DirectedDijkstra.GRAPH_NODE_VISITED_TEXT_COLOR = "#0b3d1f";
DirectedDijkstra.HIGHLIGHT_RADIUS = DirectedDijkstra.GRAPH_NODE_RADIUS;
DirectedDijkstra.EDGE_COLOR = "#4a4e69";
DirectedDijkstra.EDGE_TREE_COLOR = "#2a9d8f";
DirectedDijkstra.EDGE_ACTIVE_COLOR = "#ff6f59";
DirectedDijkstra.EDGE_THICKNESS = 3;
DirectedDijkstra.EDGE_TREE_THICKNESS = 4;
DirectedDijkstra.EDGE_ACTIVE_THICKNESS = 5;
DirectedDijkstra.BIDIRECTIONAL_CURVE = 0.35;
DirectedDijkstra.PARALLEL_EDGE_GAP = 0.18;

DirectedDijkstra.ARRAY_BASE_X = 650;
DirectedDijkstra.ARRAY_COLUMN_SPACING = 88;
DirectedDijkstra.ARRAY_TOP_Y = DirectedDijkstra.ROW2_START_Y + 90;
DirectedDijkstra.ARRAY_CELL_HEIGHT = 52;
DirectedDijkstra.ARRAY_CELL_WIDTH = 70;
DirectedDijkstra.ARRAY_CELL_INNER_HEIGHT = 42;
DirectedDijkstra.ARRAY_RECT_COLOR = "#f1f1f6";
DirectedDijkstra.ARRAY_RECT_BORDER = "#2b2d42";
DirectedDijkstra.ARRAY_RECT_HIGHLIGHT_BORDER = "#e76f51";
DirectedDijkstra.ARRAY_RECT_BORDER_THICKNESS = 1;
DirectedDijkstra.ARRAY_RECT_HIGHLIGHT_THICKNESS = 3;
DirectedDijkstra.ARRAY_TEXT_COLOR = "#2b2d42";
DirectedDijkstra.ARRAY_VISITED_FILL = "#b3e5fc";
DirectedDijkstra.ARRAY_UPDATE_FILL = "#ffe8d6";
DirectedDijkstra.ARRAY_HEADER_GAP = 20;
DirectedDijkstra.BOTTOM_SECTION_GAP = 56;
DirectedDijkstra.CODE_TOP_PADDING = 12;

DirectedDijkstra.CODE_START_X = 120;
DirectedDijkstra.CODE_LINE_HEIGHT = 32;
DirectedDijkstra.CODE_STANDARD_COLOR = "#1d3557";
DirectedDijkstra.CODE_HIGHLIGHT_COLOR = "#e63946";
DirectedDijkstra.CODE_FONT = "bold 22";

DirectedDijkstra.PRIORITY_QUEUE_SLOT_COUNT = 9;
DirectedDijkstra.QUEUE_AREA_CENTER_X = 650;
DirectedDijkstra.QUEUE_TOP_Y = DirectedDijkstra.ROW3_START_Y + 120;
DirectedDijkstra.QUEUE_SLOT_WIDTH = 220;
DirectedDijkstra.QUEUE_SLOT_HEIGHT = 44;
DirectedDijkstra.QUEUE_SLOT_SPACING = 10;
DirectedDijkstra.QUEUE_HEADER_GAP = 52;
DirectedDijkstra.QUEUE_RECT_COLOR = "#f8f9fa";
DirectedDijkstra.QUEUE_RECT_BORDER = "#1d3557";
DirectedDijkstra.QUEUE_RECT_ACTIVE_BORDER = "#e76f51";
DirectedDijkstra.QUEUE_RECT_BORDER_THICKNESS = 1;
DirectedDijkstra.QUEUE_RECT_ACTIVE_THICKNESS = 3;
DirectedDijkstra.QUEUE_TEXT_COLOR = "#1d3557";
DirectedDijkstra.QUEUE_FONT = "bold 18";

DirectedDijkstra.TITLE_COLOR = "#1d3557";
DirectedDijkstra.START_INFO_COLOR = "#264653";
DirectedDijkstra.HIGHLIGHT_COLOR = "#ff3b30";

DirectedDijkstra.CODE_LINES = [
  ["void dijkstra(int start) {"],
  ["    Arrays.fill(dist, INF);"],
  ["    Arrays.fill(parent, -1);"],
  ["    Arrays.fill(visited, false);"],
  ["    dist[start] = 0;"],
  ["    PriorityQueue<Node> pq = new PriorityQueue<>();"],
  ["    pq.offer(new Node(start, 0));"],
  ["    while (!pq.isEmpty()) {"],
  ["        Node current = pq.poll();"],
  ["        int u = current.vertex;"],
  ["        if (visited[u]) { continue; }"],
  ["        visited[u] = true;"],
  ["        for (Edge edge : adj[u]) {"],
  ["            int v = edge.to;"],
  ["            int weight = edge.weight;"],
  ["            if (dist[u] + weight < dist[v]) {"],
  ["                dist[v] = dist[u] + weight;"],
  ["                parent[v] = u;"],
  ["                pq.offer(new Node(v, dist[v]));"],
  ["            }"],
  ["        }"],
  ["    }"],
  ["}"]
];

DirectedDijkstra.TEMPLATES = [
  {
    vertexCount: 6,
    edges: [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 8 },
      { from: 0, to: 3, weight: 6 },
      { from: 1, to: 2, weight: 2 },
      { from: 1, to: 4, weight: 5 },
      { from: 2, to: 3, weight: 3 },
      { from: 2, to: 4, weight: 7 },
      { from: 2, to: 5, weight: 9 },
      { from: 3, to: 4, weight: 2 },
      { from: 3, to: 5, weight: 4 },
      { from: 4, to: 5, weight: 1 },
    ],
  },
  {
    vertexCount: 6,
    edges: [
      { from: 0, to: 1, weight: 3 },
      { from: 0, to: 2, weight: 7 },
      { from: 0, to: 3, weight: 5 },
      { from: 1, to: 2, weight: 1 },
      { from: 1, to: 4, weight: 4 },
      { from: 2, to: 3, weight: 2 },
      { from: 2, to: 4, weight: 6 },
      { from: 2, to: 5, weight: 8 },
      { from: 3, to: 5, weight: 3 },
      { from: 4, to: 3, weight: 4 },
      { from: 4, to: 5, weight: 2 },
    ],
  },
  {
    vertexCount: 6,
    edges: [
      { from: 0, to: 1, weight: 6 },
      { from: 0, to: 2, weight: 5 },
      { from: 0, to: 3, weight: 9 },
      { from: 1, to: 2, weight: 2 },
      { from: 1, to: 4, weight: 7 },
      { from: 2, to: 3, weight: 4 },
      { from: 2, to: 5, weight: 6 },
      { from: 3, to: 4, weight: 3 },
      { from: 3, to: 5, weight: 5 },
      { from: 4, to: 5, weight: 2 },
      { from: 4, to: 2, weight: 3 },
    ],
  },
];

DirectedDijkstra.prototype.init = function (am, w, h) {
  DirectedDijkstra.superclass.init.call(this, am, w, h);

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
  this.visitedRectIDs = [];
  this.distanceRectIDs = [];
  this.parentRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.priorityQueueRectIDs = [];
  this.codeID = [];
  this.highlightCircleID = -1;
  this.currentCodeLine = -1;
  this.startDisplayID = -1;
  this.queueLabelID = -1;
  this.priorityQueueData = [];
  this.priorityQueueActiveIndex = -1;
  this.bottomSectionTopY =
    DirectedDijkstra.ROW3_START_Y + DirectedDijkstra.CODE_TOP_PADDING;

  this.visited = [];
  this.distance = [];
  this.parent = [];

  this.implementAction(this.reset.bind(this), 0);
};

DirectedDijkstra.prototype.addControls = function () {
  addLabelToAlgorithmBar("Start Vertex:");
  this.startField = addControlToAlgorithmBar("Text", "A");
  this.startField.size = 4;
  this.startButton = addControlToAlgorithmBar("Button", "Run Dijkstra");
  this.startButton.onclick = this.startCallback.bind(this);
  this.startField.onkeydown = this.returnSubmit(
    this.startField,
    this.startCallback.bind(this),
    2,
    false
  );

  this.newGraphButton = addControlToAlgorithmBar("Button", "New Graph");
  this.newGraphButton.onclick = this.resetCallback.bind(this);

  this.controls.push(this.startField, this.startButton, this.newGraphButton);
};

DirectedDijkstra.prototype.reset = function () {
  this.commands = [];
  this.nextIndex = 0;

  this.selectTemplate();
  this.createTitleRow();
  this.createGraphArea();
  this.createArrayArea();
  this.createPriorityQueueArea();
  this.createCodeDisplay();

  this.resetAlgorithmState();
  this.highlightCodeLine(-1);

  return this.commands;
};

DirectedDijkstra.prototype.selectTemplate = function () {
  var template =
    DirectedDijkstra.TEMPLATES[
      Math.floor(Math.random() * DirectedDijkstra.TEMPLATES.length)
    ];

  var vertexCount = template.vertexCount;
  this.vertexLabels = this.buildVertexLabels(vertexCount);
  this.vertexPositions = this.computeCircularLayout(vertexCount);
  this.adjacencyList = new Array(vertexCount);
  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};
  this.edgeCurveOverrides = template.curveOverrides || {};

  for (var i = 0; i < vertexCount; i++) {
    this.adjacencyList[i] = [];
  }

  for (var j = 0; j < template.edges.length; j++) {
    var edge = template.edges[j];
    if (
      edge.from < 0 ||
      edge.from >= vertexCount ||
      edge.to < 0 ||
      edge.to >= vertexCount
    ) {
      continue;
    }
    this.adjacencyList[edge.from].push({ to: edge.to, weight: edge.weight });
  }
};

DirectedDijkstra.prototype.buildVertexLabels = function (vertexCount) {
  var labels = [];
  for (var i = 0; i < vertexCount; i++) {
    labels.push(String.fromCharCode(65 + i));
  }
  return labels;
};

DirectedDijkstra.prototype.computeCircularLayout = function (vertexCount) {
  var layout = [];
  var radius = 220;
  var centerX = DirectedDijkstra.GRAPH_AREA_CENTER_X;
  var centerY = DirectedDijkstra.ROW2_START_Y + 240;

  for (var i = 0; i < vertexCount; i++) {
    var angle = (2 * Math.PI * i) / vertexCount - Math.PI / 2;
    var x = centerX + radius * Math.cos(angle);
    var y = centerY + radius * Math.sin(angle);
    layout.push({ x: Math.round(x), y: Math.round(y) });
  }

  return layout;
};

DirectedDijkstra.prototype.createTitleRow = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "Dijkstra Shortest Paths (Directed Graph)",
    DirectedDijkstra.CANVAS_WIDTH / 2,
    DirectedDijkstra.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, DirectedDijkstra.TITLE_COLOR);

  this.startDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.startDisplayID,
    "Start Vertex: A",
    DirectedDijkstra.CANVAS_WIDTH / 2,
    DirectedDijkstra.START_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.startDisplayID, "bold 24");
  this.cmd("SetForegroundColor", this.startDisplayID, DirectedDijkstra.START_INFO_COLOR);
};

DirectedDijkstra.prototype.edgeKey = function (from, to) {
  return from + "->" + to;
};

DirectedDijkstra.prototype.getEdgeCurve = function (from, to) {
  var key = this.edgeKey(from, to);
  if (this.edgeCurveOverrides && this.edgeCurveOverrides.hasOwnProperty(key)) {
    return this.edgeCurveOverrides[key];
  }
  return 0;
};

DirectedDijkstra.prototype.createGraphArea = function () {
  this.vertexIDs = new Array(this.vertexLabels.length);
  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};

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
      DirectedDijkstra.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, DirectedDijkstra.GRAPH_NODE_COLOR);
    this.cmd("SetForegroundColor", id, DirectedDijkstra.GRAPH_NODE_BORDER);
    this.cmd("SetTextColor", id, DirectedDijkstra.GRAPH_NODE_TEXT);
    this.cmd("SetHighlight", id, 0);
  }

  for (var from = 0; from < this.adjacencyList.length; from++) {
    for (var j = 0; j < this.adjacencyList[from].length; j++) {
      var neighbor = this.adjacencyList[from][j];
      var curve = this.getEdgeCurve(from, neighbor.to);
      var pair = { from: from, to: neighbor.to, curve: curve, weight: neighbor.weight };
      var key = this.edgeKey(from, neighbor.to);
      this.edgePairs.push(pair);
      this.edgeStates[key] = { tree: false };
      this.edgeMeta[key] = pair;
      this.cmd(
        "Connect",
        this.vertexIDs[from],
        this.vertexIDs[neighbor.to],
        DirectedDijkstra.EDGE_COLOR,
        curve,
        1,
        neighbor.weight
      );
      this.cmd(
        "SetEdgeThickness",
        this.vertexIDs[from],
        this.vertexIDs[neighbor.to],
        DirectedDijkstra.EDGE_THICKNESS
      );
      this.cmd(
        "SetEdgeHighlight",
        this.vertexIDs[from],
        this.vertexIDs[neighbor.to],
        0
      );
    }
  }

  this.highlightCircleID = this.nextIndex++;
  var startPos = this.vertexPositions[0];
  this.cmd(
    "CreateHighlightCircle",
    this.highlightCircleID,
    DirectedDijkstra.HIGHLIGHT_COLOR,
    startPos.x,
    startPos.y,
    DirectedDijkstra.HIGHLIGHT_RADIUS
  );
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

DirectedDijkstra.prototype.createArrayArea = function () {
  var visitedHeaderID = this.nextIndex++;
  var distHeaderID = this.nextIndex++;
  var parentHeaderID = this.nextIndex++;
  var headerY =
    DirectedDijkstra.ARRAY_TOP_Y -
    DirectedDijkstra.ARRAY_CELL_HEIGHT / 2 -
    DirectedDijkstra.ARRAY_HEADER_GAP;

  this.cmd(
    "CreateLabel",
    visitedHeaderID,
    "Visited",
    DirectedDijkstra.ARRAY_BASE_X,
    headerY
  );
  this.cmd("SetTextStyle", visitedHeaderID, "bold 20");
  this.cmd("SetForegroundColor", visitedHeaderID, DirectedDijkstra.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    distHeaderID,
    "dist",
    DirectedDijkstra.ARRAY_BASE_X + DirectedDijkstra.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", distHeaderID, "bold 20");
  this.cmd("SetForegroundColor", distHeaderID, DirectedDijkstra.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    parentHeaderID,
    "parent",
    DirectedDijkstra.ARRAY_BASE_X + 2 * DirectedDijkstra.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", parentHeaderID, "bold 20");
  this.cmd("SetForegroundColor", parentHeaderID, DirectedDijkstra.CODE_STANDARD_COLOR);

  this.visitedRectIDs = new Array(this.vertexLabels.length);
  this.distanceRectIDs = new Array(this.vertexLabels.length);
  this.parentRectIDs = new Array(this.vertexLabels.length);
  this.vertexRowLabelIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rowY = DirectedDijkstra.ARRAY_TOP_Y + i * DirectedDijkstra.ARRAY_CELL_HEIGHT;

    var labelID = this.nextIndex++;
    this.vertexRowLabelIDs[i] = labelID;
    this.cmd(
      "CreateLabel",
      labelID,
      this.vertexLabels[i],
      DirectedDijkstra.ARRAY_BASE_X - 60,
      rowY,
      0
    );
    this.cmd("SetTextStyle", labelID, "bold 20");
    this.cmd("SetForegroundColor", labelID, DirectedDijkstra.START_INFO_COLOR);

    var visitedID = this.nextIndex++;
    this.visitedRectIDs[i] = visitedID;
    this.cmd(
      "CreateRectangle",
      visitedID,
      "F",
      DirectedDijkstra.ARRAY_CELL_WIDTH,
      DirectedDijkstra.ARRAY_CELL_INNER_HEIGHT,
      DirectedDijkstra.ARRAY_BASE_X,
      rowY
    );
    this.cmd("SetForegroundColor", visitedID, DirectedDijkstra.ARRAY_RECT_BORDER);
    this.cmd(
      "SetRectangleLineThickness",
      visitedID,
      DirectedDijkstra.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", visitedID, DirectedDijkstra.ARRAY_TEXT_COLOR);
    this.cmd("SetBackgroundColor", visitedID, DirectedDijkstra.ARRAY_RECT_COLOR);

    var distID = this.nextIndex++;
    this.distanceRectIDs[i] = distID;
    this.cmd(
      "CreateRectangle",
      distID,
      "\u221E",
      DirectedDijkstra.ARRAY_CELL_WIDTH,
      DirectedDijkstra.ARRAY_CELL_INNER_HEIGHT,
      DirectedDijkstra.ARRAY_BASE_X + DirectedDijkstra.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", distID, DirectedDijkstra.ARRAY_RECT_BORDER);
    this.cmd(
      "SetRectangleLineThickness",
      distID,
      DirectedDijkstra.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", distID, DirectedDijkstra.ARRAY_TEXT_COLOR);
    this.cmd("SetBackgroundColor", distID, DirectedDijkstra.ARRAY_RECT_COLOR);

    var parentID = this.nextIndex++;
    this.parentRectIDs[i] = parentID;
    this.cmd(
      "CreateRectangle",
      parentID,
      "-",
      DirectedDijkstra.ARRAY_CELL_WIDTH,
      DirectedDijkstra.ARRAY_CELL_INNER_HEIGHT,
      DirectedDijkstra.ARRAY_BASE_X + 2 * DirectedDijkstra.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", parentID, DirectedDijkstra.ARRAY_RECT_BORDER);
    this.cmd(
      "SetRectangleLineThickness",
      parentID,
      DirectedDijkstra.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", parentID, DirectedDijkstra.ARRAY_TEXT_COLOR);
    this.cmd("SetBackgroundColor", parentID, DirectedDijkstra.ARRAY_RECT_COLOR);
  }
};

DirectedDijkstra.prototype.createPriorityQueueArea = function () {
  this.priorityQueueRectIDs = [];
  this.priorityQueueData = [];

  this.queueLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.queueLabelID,
    "Priority Queue (min dist)",
    DirectedDijkstra.QUEUE_AREA_CENTER_X,
    DirectedDijkstra.QUEUE_TOP_Y - DirectedDijkstra.QUEUE_HEADER_GAP,
    0
  );
  this.cmd("SetTextStyle", this.queueLabelID, "bold 20");
  this.cmd("SetForegroundColor", this.queueLabelID, DirectedDijkstra.CODE_STANDARD_COLOR);

  for (var i = 0; i < DirectedDijkstra.PRIORITY_QUEUE_SLOT_COUNT; i++) {
    var rectID = this.nextIndex++;
    this.priorityQueueRectIDs.push(rectID);
    var y =
      DirectedDijkstra.QUEUE_TOP_Y + i * (DirectedDijkstra.QUEUE_SLOT_HEIGHT + DirectedDijkstra.QUEUE_SLOT_SPACING);
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      DirectedDijkstra.QUEUE_SLOT_WIDTH,
      DirectedDijkstra.QUEUE_SLOT_HEIGHT,
      DirectedDijkstra.QUEUE_AREA_CENTER_X,
      y
    );
    this.cmd("SetForegroundColor", rectID, DirectedDijkstra.QUEUE_RECT_BORDER);
    this.cmd(
      "SetRectangleLineThickness",
      rectID,
      DirectedDijkstra.QUEUE_RECT_BORDER_THICKNESS
    );
    this.cmd("SetBackgroundColor", rectID, DirectedDijkstra.QUEUE_RECT_COLOR);
    this.cmd("SetTextColor", rectID, DirectedDijkstra.QUEUE_TEXT_COLOR);
    this.cmd("SetTextStyle", rectID, DirectedDijkstra.QUEUE_FONT);
    this.cmd("SetHighlight", rectID, 0);
  }
};

DirectedDijkstra.prototype.createCodeDisplay = function () {
  var startY = this.bottomSectionTopY + DirectedDijkstra.CODE_TOP_PADDING;
  this.codeID = this.addCodeToCanvasBase(
    DirectedDijkstra.CODE_LINES,
    DirectedDijkstra.CODE_START_X,
    startY,
    DirectedDijkstra.CODE_LINE_HEIGHT,
    DirectedDijkstra.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], DirectedDijkstra.CODE_FONT);
    }
  }
};

DirectedDijkstra.prototype.resetAlgorithmState = function () {
  this.visited = new Array(this.vertexLabels.length);
  this.distance = new Array(this.vertexLabels.length);
  this.parent = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.visited[i] = false;
    this.distance[i] = Infinity;
    this.parent[i] = -1;

    this.cmd("SetText", this.visitedRectIDs[i], "F");
    this.cmd("SetBackgroundColor", this.visitedRectIDs[i], DirectedDijkstra.ARRAY_RECT_COLOR);

    this.cmd("SetBackgroundColor", this.vertexIDs[i], DirectedDijkstra.GRAPH_NODE_COLOR);
    this.cmd("SetTextColor", this.vertexIDs[i], DirectedDijkstra.GRAPH_NODE_TEXT);

    this.cmd("SetText", this.distanceRectIDs[i], "\u221E");
    this.cmd("SetBackgroundColor", this.distanceRectIDs[i], DirectedDijkstra.ARRAY_RECT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      this.distanceRectIDs[i],
      DirectedDijkstra.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd(
      "SetForegroundColor",
      this.distanceRectIDs[i],
      DirectedDijkstra.ARRAY_RECT_BORDER
    );

    this.cmd("SetText", this.parentRectIDs[i], "-");
    this.cmd("SetBackgroundColor", this.parentRectIDs[i], DirectedDijkstra.ARRAY_RECT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      this.parentRectIDs[i],
      DirectedDijkstra.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd(
      "SetForegroundColor",
      this.parentRectIDs[i],
      DirectedDijkstra.ARRAY_RECT_BORDER
    );
  }

  this.resetTreeEdges();
  this.clearPriorityQueue();
  this.setPriorityQueueActive(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

DirectedDijkstra.prototype.resetTreeEdges = function () {
  for (var k = 0; k < this.edgePairs.length; k++) {
    var info = this.edgePairs[k];
    this.cmd(
      "SetEdgeColor",
      this.vertexIDs[info.from],
      this.vertexIDs[info.to],
      DirectedDijkstra.EDGE_COLOR
    );
    this.cmd(
      "SetEdgeThickness",
      this.vertexIDs[info.from],
      this.vertexIDs[info.to],
      DirectedDijkstra.EDGE_THICKNESS
    );
    this.edgeStates[this.edgeKey(info.from, info.to)] = { tree: false };
  }
};

DirectedDijkstra.prototype.clearPriorityQueue = function () {
  this.priorityQueueData = [];
  for (var i = 0; i < this.priorityQueueRectIDs.length; i++) {
    var rectID = this.priorityQueueRectIDs[i];
    this.cmd("SetText", rectID, "");
    this.cmd("SetBackgroundColor", rectID, DirectedDijkstra.QUEUE_RECT_COLOR);
    this.cmd("SetRectangleLineThickness", rectID, DirectedDijkstra.QUEUE_RECT_BORDER_THICKNESS);
    this.cmd("SetForegroundColor", rectID, DirectedDijkstra.QUEUE_RECT_BORDER);
  }
};

DirectedDijkstra.prototype.highlightCodeLine = function (lineNumber) {
  if (this.currentCodeLine === lineNumber) {
    return;
  }
  if (this.currentCodeLine >= 0 && this.currentCodeLine < this.codeID.length) {
    for (var i = 0; i < this.codeID[this.currentCodeLine].length; i++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[this.currentCodeLine][i],
        DirectedDijkstra.CODE_STANDARD_COLOR
      );
    }
  }

  this.currentCodeLine = lineNumber;

  if (lineNumber >= 0 && lineNumber < this.codeID.length) {
    for (var j = 0; j < this.codeID[lineNumber].length; j++) {
      this.cmd(
        "SetForegroundColor",
        this.codeID[lineNumber][j],
        DirectedDijkstra.CODE_HIGHLIGHT_COLOR
      );
    }
  }
};

DirectedDijkstra.prototype.updateStartDisplay = function (label) {
  if (this.startDisplayID === -1) {
    return;
  }
  this.cmd(
    "SetText",
    this.startDisplayID,
    "Start Vertex: " + label
  );
};

DirectedDijkstra.prototype.formatDistance = function (value) {
  return value === Infinity ? "\u221E" : String(value);
};

DirectedDijkstra.prototype.setDistanceValue = function (index, value, highlight) {
  this.distance[index] = value;
  var display = this.formatDistance(value);
  this.cmd("SetText", this.distanceRectIDs[index], display);
  if (highlight) {
    this.cmd("SetBackgroundColor", this.distanceRectIDs[index], DirectedDijkstra.ARRAY_UPDATE_FILL);
  }
};

DirectedDijkstra.prototype.setParentValue = function (index, parentIndex) {
  if (parentIndex === -1) {
    this.cmd("SetText", this.parentRectIDs[index], "-");
  } else {
    this.cmd("SetText", this.parentRectIDs[index], this.vertexLabels[parentIndex]);
  }
};

DirectedDijkstra.prototype.setDistanceCellHighlight = function (index, active) {
  if (index < 0 || index >= this.distanceRectIDs.length) {
    return;
  }
  var rectID = this.distanceRectIDs[index];
  var thickness = active
    ? DirectedDijkstra.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : DirectedDijkstra.ARRAY_RECT_BORDER_THICKNESS;
  var color = active
    ? DirectedDijkstra.ARRAY_RECT_HIGHLIGHT_BORDER
    : DirectedDijkstra.ARRAY_RECT_BORDER;
  this.cmd("SetRectangleLineThickness", rectID, thickness);
  this.cmd("SetForegroundColor", rectID, color);
};

DirectedDijkstra.prototype.setPriorityQueueActive = function (slotIndex) {
  if (this.priorityQueueActiveIndex === slotIndex) {
    return;
  }
  if (this.priorityQueueActiveIndex >= 0 && this.priorityQueueActiveIndex < this.priorityQueueRectIDs.length) {
    var previousRect = this.priorityQueueRectIDs[this.priorityQueueActiveIndex];
    this.cmd("SetRectangleLineThickness", previousRect, DirectedDijkstra.QUEUE_RECT_BORDER_THICKNESS);
    this.cmd("SetForegroundColor", previousRect, DirectedDijkstra.QUEUE_RECT_BORDER);
  }

  this.priorityQueueActiveIndex = slotIndex;

  if (slotIndex >= 0 && slotIndex < this.priorityQueueRectIDs.length) {
    var activeRect = this.priorityQueueRectIDs[slotIndex];
    this.cmd("SetRectangleLineThickness", activeRect, DirectedDijkstra.QUEUE_RECT_ACTIVE_THICKNESS);
    this.cmd("SetForegroundColor", activeRect, DirectedDijkstra.QUEUE_RECT_ACTIVE_BORDER);
  }
};

DirectedDijkstra.prototype.updatePriorityQueueDisplay = function () {
  for (var i = 0; i < this.priorityQueueRectIDs.length; i++) {
    var rectID = this.priorityQueueRectIDs[i];
    if (i < this.priorityQueueData.length) {
      var entry = this.priorityQueueData[i];
      var label = this.vertexLabels[entry.vertex] + " (" + this.formatDistance(entry.distance) + ")";
      this.cmd("SetText", rectID, label);
    } else {
      this.cmd("SetText", rectID, "");
    }
  }
  this.setPriorityQueueActive(-1);
};

DirectedDijkstra.prototype.pushToPriorityQueue = function (vertex, distance) {
  this.priorityQueueData.push({ vertex: vertex, distance: distance });
  this.priorityQueueData.sort(function (a, b) {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return a.vertex - b.vertex;
  });
  this.updatePriorityQueueDisplay();
};

DirectedDijkstra.prototype.popFromPriorityQueue = function () {
  if (this.priorityQueueData.length === 0) {
    return null;
  }
  var entry = this.priorityQueueData.shift();
  this.updatePriorityQueueDisplay();
  return entry;
};

DirectedDijkstra.prototype.moveHighlightCircleToVertex = function (index) {
  if (index < 0 || index >= this.vertexPositions.length) {
    return;
  }
  var pos = this.vertexPositions[index];
  this.cmd("SetAlpha", this.highlightCircleID, 1);
  this.cmd("Move", this.highlightCircleID, pos.x, pos.y);
};

DirectedDijkstra.prototype.highlightEdge = function (from, to, active) {
  var fromID = this.vertexIDs[from];
  var toID = this.vertexIDs[to];
  var color = active
    ? DirectedDijkstra.EDGE_ACTIVE_COLOR
    : this.edgeStates[this.edgeKey(from, to)] && this.edgeStates[this.edgeKey(from, to)].tree
    ? DirectedDijkstra.EDGE_TREE_COLOR
    : DirectedDijkstra.EDGE_COLOR;
  var thickness = active
    ? DirectedDijkstra.EDGE_ACTIVE_THICKNESS
    : this.edgeStates[this.edgeKey(from, to)] && this.edgeStates[this.edgeKey(from, to)].tree
    ? DirectedDijkstra.EDGE_TREE_THICKNESS
    : DirectedDijkstra.EDGE_THICKNESS;
  this.cmd("SetEdgeColor", fromID, toID, color);
  this.cmd("SetEdgeThickness", fromID, toID, thickness);
};

DirectedDijkstra.prototype.setTreeEdge = function (from, to, isTreeEdge) {
  var key = this.edgeKey(from, to);
  if (!this.edgeStates[key]) {
    this.edgeStates[key] = { tree: false };
  }
  this.edgeStates[key].tree = isTreeEdge;
  this.highlightEdge(from, to, false);
};

DirectedDijkstra.prototype.markVertexVisited = function (index) {
  if (index < 0 || index >= this.vertexIDs.length) {
    return;
  }
  this.visited[index] = true;
  this.cmd("SetText", this.visitedRectIDs[index], "T");
  this.cmd("SetBackgroundColor", this.visitedRectIDs[index], DirectedDijkstra.ARRAY_VISITED_FILL);
  this.cmd("SetBackgroundColor", this.vertexIDs[index], DirectedDijkstra.GRAPH_NODE_VISITED_COLOR);
  this.cmd("SetTextColor", this.vertexIDs[index], DirectedDijkstra.GRAPH_NODE_VISITED_TEXT_COLOR);
};

DirectedDijkstra.prototype.runDijkstra = function (startIndex) {
  this.commands = [];

  if (typeof startIndex !== "number" || startIndex < 0 || startIndex >= this.vertexLabels.length) {
    startIndex = 0;
  }

  this.resetAlgorithmState();

  var startLabel = this.vertexLabels[startIndex];
  this.startField.value = startLabel;
  this.updateStartDisplay(startLabel);

  this.highlightCodeLine(0);
  this.cmd("Step");

  this.highlightCodeLine(1);
  this.cmd("Step");

  this.highlightCodeLine(2);
  this.cmd("Step");

  this.highlightCodeLine(3);
  this.cmd("Step");

  this.highlightCodeLine(4);
  this.setDistanceValue(startIndex, 0, true);
  this.cmd("Step");
  this.cmd("SetBackgroundColor", this.distanceRectIDs[startIndex], DirectedDijkstra.ARRAY_RECT_COLOR);

  this.highlightCodeLine(5);
  this.cmd("Step");

  this.highlightCodeLine(6);
  this.pushToPriorityQueue(startIndex, 0);
  this.cmd("Step");

  while (this.priorityQueueData.length > 0) {
    this.highlightCodeLine(7);
    this.cmd("Step");

    this.updatePriorityQueueDisplay();
    this.setPriorityQueueActive(0);
    this.cmd("Step");

    this.highlightCodeLine(8);
    var entry = this.popFromPriorityQueue();
    if (!entry) {
      break;
    }
    var currentVertex = entry.vertex;
    var currentDistance = entry.distance;

    this.highlightCodeLine(9);
    this.moveHighlightCircleToVertex(currentVertex);
    this.cmd("Step");

    this.highlightCodeLine(10);
    if (this.visited[currentVertex]) {
      this.cmd("Step");
      this.highlightCodeLine(21);
      this.cmd("Step");
      continue;
    }

    this.highlightCodeLine(11);
    this.markVertexVisited(currentVertex);
    this.cmd("Step");

    for (var i = 0; i < this.adjacencyList[currentVertex].length; i++) {
      var neighbor = this.adjacencyList[currentVertex][i];
      var nextVertex = neighbor.to;
      var weight = neighbor.weight;

      this.highlightCodeLine(12);
      this.highlightEdge(currentVertex, nextVertex, true);
      this.cmd("Step");

      this.highlightCodeLine(13);
      this.cmd("Step");

      this.highlightCodeLine(14);
      this.cmd("Step");

      var newDistance = currentDistance + weight;
      this.highlightCodeLine(15);
      this.setDistanceCellHighlight(nextVertex, true);
      this.cmd("Step");

      if (newDistance < this.distance[nextVertex]) {
        this.highlightCodeLine(16);
        this.setDistanceValue(nextVertex, newDistance, true);
        this.cmd("Step");
        this.cmd("SetBackgroundColor", this.distanceRectIDs[nextVertex], DirectedDijkstra.ARRAY_RECT_COLOR);

        this.highlightCodeLine(17);
        var previousParent = this.parent[nextVertex];
        if (previousParent !== -1) {
          this.setTreeEdge(previousParent, nextVertex, false);
        }
        this.parent[nextVertex] = currentVertex;
        this.setParentValue(nextVertex, currentVertex);
        this.setTreeEdge(currentVertex, nextVertex, true);
        this.cmd("Step");

        this.highlightCodeLine(18);
        this.pushToPriorityQueue(nextVertex, newDistance);
        this.cmd("Step");
      }

      this.highlightCodeLine(19);
      this.cmd("Step");

      this.setDistanceCellHighlight(nextVertex, false);
      this.highlightEdge(currentVertex, nextVertex, false);
      this.cmd("Step");
    }

    this.highlightCodeLine(20);
    this.cmd("Step");
  }

  this.highlightCodeLine(21);
  this.cmd("Step");
  this.highlightCodeLine(22);
  this.cmd("Step");
  this.highlightCodeLine(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);

  return this.commands;
};

DirectedDijkstra.prototype.startCallback = function () {
  var startValue = this.startField.value.trim().toUpperCase();
  if (startValue.length === 0) {
    startValue = "A";
  }
  var index = this.vertexLabels.indexOf(startValue);
  if (index === -1) {
    index = 0;
    startValue = this.vertexLabels[0];
  }
  this.startField.value = startValue;
  this.implementAction(this.runDijkstra.bind(this), index);
};

DirectedDijkstra.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

DirectedDijkstra.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

DirectedDijkstra.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new DirectedDijkstra(animManag, canvas.width, canvas.height);
}
