// Custom visualization for Dijkstra's algorithm on a directed graph using a 9:16 canvas.

function DirectedDijkstra(am, w, h) {
  this.init(am, w, h);
}

DirectedDijkstra.prototype = new Algorithm();
DirectedDijkstra.prototype.constructor = DirectedDijkstra;
DirectedDijkstra.superclass = Algorithm.prototype;

DirectedDijkstra.CANVAS_WIDTH = 1200;
DirectedDijkstra.CANVAS_HEIGHT = 1280;

DirectedDijkstra.ROW1_HEIGHT = 260;
DirectedDijkstra.ROW2_HEIGHT = 500;
DirectedDijkstra.ROW3_HEIGHT =
  DirectedDijkstra.CANVAS_HEIGHT - DirectedDijkstra.ROW1_HEIGHT - DirectedDijkstra.ROW2_HEIGHT;

DirectedDijkstra.ROW1_CENTER_Y = DirectedDijkstra.ROW1_HEIGHT / 2;
DirectedDijkstra.ROW2_START_Y = DirectedDijkstra.ROW1_HEIGHT;
DirectedDijkstra.ROW3_START_Y =
  DirectedDijkstra.ROW1_HEIGHT + DirectedDijkstra.ROW2_HEIGHT;

DirectedDijkstra.TITLE_Y = DirectedDijkstra.ROW1_CENTER_Y - 70;
DirectedDijkstra.INFO_PANEL_Y = DirectedDijkstra.TITLE_Y + 94;
DirectedDijkstra.START_INFO_Y = DirectedDijkstra.INFO_PANEL_Y + 76;

DirectedDijkstra.GRAPH_AREA_CENTER_X = 410;
DirectedDijkstra.GRAPH_NODE_RADIUS = 18;
DirectedDijkstra.GRAPH_NODE_COLOR = "#e3f2fd";
DirectedDijkstra.GRAPH_NODE_BORDER = "#0b3954";
DirectedDijkstra.GRAPH_NODE_TEXT = "#003049";
DirectedDijkstra.GRAPH_NODE_VISITED_COLOR = "#66bb6a";
DirectedDijkstra.GRAPH_NODE_VISITED_TEXT_COLOR = "#0b3d1f";
DirectedDijkstra.START_NODE_COLOR = "#43a047";
DirectedDijkstra.START_NODE_TEXT_COLOR = "#0b3d1f";
DirectedDijkstra.HIGHLIGHT_RADIUS = DirectedDijkstra.GRAPH_NODE_RADIUS;
DirectedDijkstra.EDGE_COLOR = "#4a4e69";
DirectedDijkstra.EDGE_TREE_COLOR = "#2a9d8f";
DirectedDijkstra.EDGE_ACTIVE_COLOR = "#ff6f59";
DirectedDijkstra.EDGE_THICKNESS = 3;
DirectedDijkstra.EDGE_TREE_THICKNESS = 4;
DirectedDijkstra.EDGE_ACTIVE_THICKNESS = 5;
DirectedDijkstra.BIDIRECTIONAL_CURVE = 0.35;
DirectedDijkstra.PARALLEL_EDGE_GAP = 0.18;

DirectedDijkstra.ARRAY_BASE_X = 820;
DirectedDijkstra.ARRAY_COLUMN_SPACING = 130;
DirectedDijkstra.ARRAY_TOP_Y = DirectedDijkstra.ROW2_START_Y + 80;
DirectedDijkstra.ARRAY_CELL_HEIGHT = 44;
DirectedDijkstra.ARRAY_CELL_WIDTH = 70;
DirectedDijkstra.ARRAY_CELL_INNER_HEIGHT = 34;
DirectedDijkstra.ARRAY_RECT_COLOR = "#f1f1f6";
DirectedDijkstra.ARRAY_RECT_BORDER = "#2b2d42";
DirectedDijkstra.ARRAY_RECT_HIGHLIGHT_BORDER = "#e76f51";
DirectedDijkstra.ARRAY_RECT_BORDER_THICKNESS = 1;
DirectedDijkstra.ARRAY_RECT_HIGHLIGHT_THICKNESS = 3;
DirectedDijkstra.ARRAY_TEXT_COLOR = "#2b2d42";
DirectedDijkstra.ARRAY_VISITED_FILL = "#b3e5fc";
DirectedDijkstra.ARRAY_UPDATE_FILL = "#ffe8d6";
DirectedDijkstra.ARRAY_HEADER_GAP = 20;
DirectedDijkstra.BOTTOM_SECTION_TOP_OFFSET = -160;
DirectedDijkstra.CODE_TOP_PADDING = 12;

DirectedDijkstra.CODE_START_X = 60;
DirectedDijkstra.CODE_LINE_HEIGHT = 30;
DirectedDijkstra.CODE_STANDARD_COLOR = "#1d3557";
DirectedDijkstra.CODE_HIGHLIGHT_COLOR = "#e63946";
DirectedDijkstra.CODE_FONT = "bold 18";

DirectedDijkstra.INFO_PANEL_WIDTH = 900;
DirectedDijkstra.INFO_PANEL_HEIGHT = 130;
DirectedDijkstra.INFO_PANEL_FILL = "#eef2ff";
DirectedDijkstra.INFO_PANEL_BORDER = "#1d3557";
DirectedDijkstra.INFO_PANEL_TEXT_COLOR = "#1d3557";
DirectedDijkstra.INFO_PANEL_BORDER_THICKNESS = 2;
DirectedDijkstra.INFO_PANEL_ALERT_BORDER = "#c62828";
DirectedDijkstra.INFO_PANEL_ALERT_BORDER_THICKNESS = 3;
DirectedDijkstra.INFO_PANEL_DEFAULT_TEXT =
  "Info: Dijkstra always settles the unvisited node with the smallest distance from the start. Watch the info panel as teal tree paths build up and the gold route marks the minimum-distance path.";
DirectedDijkstra.INFO_PANEL_TEXT_STYLE = "bold 18";
DirectedDijkstra.INFO_PANEL_TEXT_PADDING_X = 32;
DirectedDijkstra.INFO_PANEL_TEXT_PADDING_Y = 24;
DirectedDijkstra.INFO_PANEL_APPROX_CHAR_WIDTH = 9.2;
DirectedDijkstra.INFO_PANEL_LINE_SPACING = 26;
DirectedDijkstra.INFO_PANEL_PROGRESS_HEIGHT = 14;
DirectedDijkstra.INFO_PANEL_PROGRESS_BOTTOM_PADDING = 20;
DirectedDijkstra.INFO_PANEL_PROGRESS_TRACK_COLOR = "#fdecea";
DirectedDijkstra.INFO_PANEL_PROGRESS_TRACK_BORDER = "#f8bbd0";
DirectedDijkstra.INFO_PANEL_PROGRESS_FILL_COLOR = "#c62828";
DirectedDijkstra.INFO_PANEL_PROGRESS_FILL_MARGIN = 8;
DirectedDijkstra.INFO_PANEL_PROGRESS_MIN_STEPS = 2;
DirectedDijkstra.INFO_PANEL_PROGRESS_BASE_STEPS = 2;
DirectedDijkstra.INFO_PANEL_PROGRESS_MAX_STEPS = 12;
DirectedDijkstra.INFO_PANEL_PROGRESS_CHARS_PER_STEP = 28;

DirectedDijkstra.LEGEND_BASE_X = 80;
DirectedDijkstra.LEGEND_RECT_WIDTH = 34;
DirectedDijkstra.LEGEND_RECT_HEIGHT = 18;
DirectedDijkstra.LEGEND_SPACING = 12;
DirectedDijkstra.LEGEND_TEXT_GAP = 16;
DirectedDijkstra.LEGEND_FONT = "bold 14";
DirectedDijkstra.LEGEND_TEXT_COLOR = "#1d3557";
DirectedDijkstra.LEGEND_DEFAULT_BASE_Y = DirectedDijkstra.ROW2_START_Y + 70;
DirectedDijkstra.LEGEND_MIN_X = 70;
DirectedDijkstra.LEGEND_GRAPH_GAP = 140;

DirectedDijkstra.LEVEL_COLORS = [
  "#c6e2ff",
  "#d0f4de",
  "#ffeacc",
  "#e8d7ff",
  "#f0f4c3",
  "#c8f7f4",
  "#dbe7ff",
  "#f2e7fe",
];

DirectedDijkstra.PRIORITY_QUEUE_SLOT_COUNT = 14;
DirectedDijkstra.QUEUE_AREA_CENTER_X =
  DirectedDijkstra.ARRAY_BASE_X + DirectedDijkstra.ARRAY_COLUMN_SPACING;
DirectedDijkstra.QUEUE_TOP_Y = DirectedDijkstra.ROW3_START_Y + 20;
DirectedDijkstra.QUEUE_SLOT_WIDTH = 200;
DirectedDijkstra.QUEUE_SLOT_HEIGHT = 32;
DirectedDijkstra.QUEUE_SLOT_SPACING = 6;
DirectedDijkstra.QUEUE_HEADER_GAP = 40;
DirectedDijkstra.QUEUE_COLUMN_SPACING = 24;
DirectedDijkstra.QUEUE_RECT_COLOR = "#f8f9fa";
DirectedDijkstra.QUEUE_RECT_BORDER = "#1d3557";
DirectedDijkstra.QUEUE_RECT_ACTIVE_BORDER = "#e76f51";
DirectedDijkstra.QUEUE_RECT_BORDER_THICKNESS = 1;
DirectedDijkstra.QUEUE_RECT_ACTIVE_THICKNESS = 3;
DirectedDijkstra.QUEUE_TEXT_COLOR = "#1d3557";
DirectedDijkstra.QUEUE_FONT = "bold 16";

DirectedDijkstra.TITLE_COLOR = "#1d3557";
DirectedDijkstra.START_INFO_COLOR = "#264653";
DirectedDijkstra.HIGHLIGHT_COLOR = "#ff3b30";
DirectedDijkstra.PATH_EDGE_COLOR = "#ff9f1c";
DirectedDijkstra.PATH_EDGE_THICKNESS = 6;
DirectedDijkstra.PATH_NODE_COLOR = "#ffe066";
DirectedDijkstra.PATH_NODE_TEXT_COLOR = "#1d3557";
DirectedDijkstra.PATH_TREE_NODE_COLOR = "#d7ecff";
DirectedDijkstra.PATH_TREE_TEXT_COLOR = "#0b3954";
DirectedDijkstra.PATH_TREE_EDGE_COLOR = "#64b5f6";
DirectedDijkstra.PATH_TREE_EDGE_THICKNESS = 5;
DirectedDijkstra.RANDOM_WEIGHT_MIN = 1;
DirectedDijkstra.RANDOM_WEIGHT_MAX = 9;
DirectedDijkstra.RANDOM_TEMPLATE_ATTEMPTS = 10;
DirectedDijkstra.CUMULATIVE_FONT = "bold 20";
DirectedDijkstra.CUMULATIVE_LABEL_OFFSET_Y = -34;
DirectedDijkstra.CUSTOM_LAYOUT_POINTS = [
  { x: 160, y: DirectedDijkstra.ROW2_START_Y + 210 },
  { x: 280, y: DirectedDijkstra.ROW2_START_Y + 140 },
  { x: 300, y: DirectedDijkstra.ROW2_START_Y + 310 },
  { x: 390, y: DirectedDijkstra.ROW2_START_Y + 220 },
  { x: 480, y: DirectedDijkstra.ROW2_START_Y + 140 },
  { x: 480, y: DirectedDijkstra.ROW2_START_Y + 310 },
  { x: 570, y: DirectedDijkstra.ROW2_START_Y + 150 },
  { x: 570, y: DirectedDijkstra.ROW2_START_Y + 300 },
  { x: 660, y: DirectedDijkstra.ROW2_START_Y + 220 },
];

DirectedDijkstra.CODE_LINES = [
  ["void dijkstra(int start) {"],
  ["    Arrays.fill(dist, INF);"],
  ["    Arrays.fill(parent, -1);"],
  ["    Arrays.fill(processed, false);"],
  ["    PriorityQueue<Node> pq = new PriorityQueue<>();"],
  ["    dist[start] = 0;"],
  ["    pq.offer(new Node(start, 0));"],
  ["    while (!pq.isEmpty()) {"],
  ["        Node node = pq.poll();"],
  ["        int u = node.vertex;"],
  ["        if (processed[u]) continue;"],
  ["        processed[u] = true;"],
  ["        for (Edge edge : adj[u]) {"],
  ["            int v = edge.to;"],
  ["            int weight = edge.weight;"],
  ["            int newDist = dist[u] + weight;"],
  ["            if (newDist < dist[v]) {"],
  ["                dist[v] = newDist;"],
  ["                parent[v] = u;"],
  ["                pq.offer(new Node(v, newDist));"],
  ["            }"],
  ["        }"],
  ["    }"],
  ["}"],
];

DirectedDijkstra.TEMPLATES = [
  {
    vertexCount: 9,
    labels: ["s", "a", "h", "f", "b", "e", "c", "g", "d"],
    edges: [
      { from: 0, to: 1, weight: 5 },
      { from: 0, to: 2, weight: 2 },
      { from: 1, to: 2, weight: 2 },
      { from: 1, to: 3, weight: 3 },
      { from: 1, to: 4, weight: 7 },
      { from: 2, to: 3, weight: 4 },
      { from: 2, to: 5, weight: 9 },
      { from: 3, to: 4, weight: 2 },
      { from: 3, to: 5, weight: 6 },
      { from: 4, to: 6, weight: 8 },
      { from: 4, to: 5, weight: 5 },
      { from: 4, to: 7, weight: 7 },
      { from: 5, to: 7, weight: 2 },
      { from: 6, to: 8, weight: 4 },
      { from: 7, to: 8, weight: 3 },
    ],
  },
];

DirectedDijkstra.prototype.init = function (am, w, h) {
  DirectedDijkstra.superclass.init.call(this, am, w, h);

  if (
    this.animationManager &&
    this.animationManager.animatedObjects &&
    this.animationManager.animatedObjects.statusReport
  ) {
    this.animationManager.animatedObjects.statusReport.setText("");
    this.animationManager.animatedObjects.statusReport.addedToScene = false;
  }

  this.controls = [];
  this.addControls();

  this.vertexLabels = [];
  this.vertexPositions = [];
  this.adjacencyList = [];
  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};
  this.edgeCurveOverrides = {};
  this.vertexLevels = [];
  this.vertexLevelColors = [];
  this.vertexEdgeColors = [];
  this.vertexHighlightColors = [];
  this.levelLegendEntries = [];
  this.levelLegendAnchorY = null;
  this.legendBaseX = DirectedDijkstra.LEGEND_BASE_X;
  this.activeStartIndex = -1;
  this.vertexIDs = [];
  this.visitedRectIDs = [];
  this.distanceRectIDs = [];
  this.parentRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.priorityQueueRectIDs = [];
  this.codeID = [];
  this.highlightCircleID = -1;
  this.currentCodeLine = -1;
  this.cumulativeContext = null;
  this.startDisplayID = -1;
  this.queueLabelID = -1;
  this.infoPanelRectID = -1;
  this.infoPanelTextID = -1;
  this.infoPanelProgressTrackID = -1;
  this.infoPanelProgressFillID = -1;
  this.infoPanelPendingActions = [];
  this.priorityQueueData = [];
  this.priorityQueueActiveIndex = -1;
  this.lastGraphSignature = null;
  this.bottomSectionTopY =
    DirectedDijkstra.ROW3_START_Y + DirectedDijkstra.BOTTOM_SECTION_TOP_OFFSET;

  this.visited = [];
  this.distance = [];
  this.parent = [];

  this.implementAction(this.reset.bind(this), 0);
};

DirectedDijkstra.prototype.addControls = function () {
  addLabelToAlgorithmBar("Start Vertex:");
  this.startField = addControlToAlgorithmBar("Text", "0");
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
  if (
    this.animationManager &&
    this.animationManager.animatedObjects &&
    typeof this.animationManager.animatedObjects.clearAllObjects === "function"
  ) {
    this.animationManager.animatedObjects.clearAllObjects();
  }

  this.commands = [];
  this.nextIndex = 0;
  this.legendBaseX = DirectedDijkstra.LEGEND_BASE_X;
  this.cumulativeContext = null;

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
  var templates = DirectedDijkstra.TEMPLATES;
  if (!templates || templates.length === 0) {
    this.vertexLabels = [];
    this.vertexPositions = [];
    this.adjacencyList = [];
    this.edgePairs = [];
    this.edgeStates = {};
    this.edgeMeta = {};
    this.edgeCurveOverrides = {};
    return;
  }

  var template = null;
  var signature = null;
  for (var attempt = 0; attempt < DirectedDijkstra.RANDOM_TEMPLATE_ATTEMPTS; attempt++) {
    template = this.generateRandomTemplate();
    signature = this.computeTemplateSignature(template);
    if (!signature || signature !== this.lastGraphSignature) {
      break;
    }
  }

  if (!template) {
    template = templates[0];
    signature = this.computeTemplateSignature(template);
  }

  if (signature && this.lastGraphSignature && signature === this.lastGraphSignature) {
    signature = this.forceDifferentTemplateSignature(template, signature);
  }

  this.lastGraphSignature = signature;

  var vertexCount = template.vertexCount;
  if (template.labels && template.labels.length === vertexCount) {
    this.vertexLabels = template.labels.slice();
  } else {
    this.vertexLabels = this.buildVertexLabels(vertexCount);
  }
  this.vertexPositions = this.computeCircularLayout(vertexCount);
  this.adjacencyList = new Array(vertexCount);
  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};
  this.edgeCurveOverrides = {};

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

  this.applyAutomaticCurveOverrides();

  if (template.curveOverrides) {
    for (var key in template.curveOverrides) {
      if (template.curveOverrides.hasOwnProperty(key)) {
        this.edgeCurveOverrides[key] = template.curveOverrides[key];
      }
    }
  }
};

DirectedDijkstra.prototype.forceDifferentTemplateSignature = function (template, signature) {
  if (!template || !template.edges || template.edges.length === 0) {
    return signature;
  }

  var baselineSignature = signature;
  var maxAttempts = template.edges.length * DirectedDijkstra.RANDOM_TEMPLATE_ATTEMPTS;

  for (var attempt = 0; attempt < maxAttempts; attempt++) {
    var edgeIndex = attempt % template.edges.length;
    var edge = template.edges[edgeIndex];
    var originalWeight = edge.weight;
    var newWeight = originalWeight;

    var rerollAttempts = DirectedDijkstra.RANDOM_TEMPLATE_ATTEMPTS;
    while (rerollAttempts-- > 0 && newWeight === originalWeight) {
      newWeight = this.randomIntInRange(
        DirectedDijkstra.RANDOM_WEIGHT_MIN,
        DirectedDijkstra.RANDOM_WEIGHT_MAX
      );
    }

    if (newWeight === originalWeight) {
      if (DirectedDijkstra.RANDOM_WEIGHT_MIN === DirectedDijkstra.RANDOM_WEIGHT_MAX) {
        return signature;
      }
      newWeight =
        originalWeight === DirectedDijkstra.RANDOM_WEIGHT_MAX
          ? DirectedDijkstra.RANDOM_WEIGHT_MIN
          : originalWeight + 1;
    }

    edge.weight = newWeight;

    signature = this.computeTemplateSignature(template);
    if (signature !== baselineSignature) {
      break;
    }
  }

  return signature;
};

DirectedDijkstra.prototype.generateRandomTemplate = function () {
  var templates = DirectedDijkstra.TEMPLATES;
  if (!templates || templates.length === 0) {
    return null;
  }
  var base = templates[Math.floor(Math.random() * templates.length)];
  if (!base) {
    return null;
  }

  var edges = [];
  for (var i = 0; i < base.edges.length; i++) {
    var original = base.edges[i];
    edges.push({
      from: original.from,
      to: original.to,
      weight: this.randomIntInRange(
        DirectedDijkstra.RANDOM_WEIGHT_MIN,
        DirectedDijkstra.RANDOM_WEIGHT_MAX
      ),
    });
  }

  var curveOverrides = null;
  if (base.curveOverrides) {
    curveOverrides = {};
    for (var key in base.curveOverrides) {
      if (base.curveOverrides.hasOwnProperty(key)) {
        curveOverrides[key] = base.curveOverrides[key];
      }
    }
  }

  return {
    vertexCount: base.vertexCount,
    labels:
      base.labels && base.labels.length === base.vertexCount
        ? base.labels.slice()
        : null,
    edges: edges,
    curveOverrides: curveOverrides,
  };
};

DirectedDijkstra.prototype.remapTemplate = function (base) {
  if (!base) {
    return null;
  }
  var outDegrees = new Array(base.vertexCount);
  for (var d = 0; d < base.vertexCount; d++) {
    outDegrees[d] = 0;
  }
  for (var e = 0; e < base.edges.length; e++) {
    outDegrees[base.edges[e].from]++;
  }

  var permutation = this.randomPermutation(base.vertexCount);
  for (var attempt = 0; attempt < DirectedDijkstra.RANDOM_TEMPLATE_ATTEMPTS; attempt++) {
    var startBaseIndex = -1;
    for (var p = 0; p < permutation.length; p++) {
      if (permutation[p] === 0) {
        startBaseIndex = p;
        break;
      }
    }
    if (startBaseIndex !== -1 && outDegrees[startBaseIndex] > 0) {
      break;
    }
    permutation = this.randomPermutation(base.vertexCount);
  }
  var usedEdges = {};
  var edges = [];

  for (var i = 0; i < base.edges.length; i++) {
    var original = base.edges[i];
    var from = permutation[original.from];
    var to = permutation[original.to];
    if (from === to) {
      continue;
    }
    var key = this.edgeKey(from, to);
    if (usedEdges[key]) {
      continue;
    }
    usedEdges[key] = true;
    edges.push({
      from: from,
      to: to,
      weight: this.randomIntInRange(
        DirectedDijkstra.RANDOM_WEIGHT_MIN,
        DirectedDijkstra.RANDOM_WEIGHT_MAX
      ),
    });
  }

  this.shuffleArray(edges);

  return {
    vertexCount: base.vertexCount,
    edges: edges,
  };
};

DirectedDijkstra.prototype.randomPermutation = function (size) {
  var arr = [];
  for (var i = 0; i < size; i++) {
    arr.push(i);
  }
  this.shuffleArray(arr);
  return arr;
};

DirectedDijkstra.prototype.shuffleArray = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};

DirectedDijkstra.prototype.randomIntInRange = function (min, max) {
  if (min > max) {
    var temp = min;
    min = max;
    max = temp;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};

DirectedDijkstra.prototype.computeTemplateSignature = function (template) {
  if (!template) {
    return null;
  }
  var parts = [];
  for (var i = 0; i < template.edges.length; i++) {
    var edge = template.edges[i];
    parts.push(edge.from + ":" + edge.to + ":" + edge.weight);
  }
  parts.sort();
  return template.vertexCount + "|" + parts.join(",");
};

DirectedDijkstra.prototype.applyAutomaticCurveOverrides = function () {
  var pairTracker = {};

  for (var from = 0; from < this.adjacencyList.length; from++) {
    for (var i = 0; i < this.adjacencyList[from].length; i++) {
      var neighbor = this.adjacencyList[from][i];
      var to = neighbor.to;
      var edgeKey = this.edgeKey(from, to);

      if (this.edgeCurveOverrides.hasOwnProperty(edgeKey)) {
        continue;
      }

      if (to < 0 || to >= this.adjacencyList.length) {
        continue;
      }

      var reverseExists = false;
      for (var j = 0; j < this.adjacencyList[to].length; j++) {
        if (this.adjacencyList[to][j].to === from) {
          reverseExists = true;
          break;
        }
      }

      if (!reverseExists) {
        continue;
      }

      var canonicalKey = from < to ? from + ":" + to : to + ":" + from;
      if (pairTracker[canonicalKey]) {
        continue;
      }

      this.edgeCurveOverrides[this.edgeKey(from, to)] = DirectedDijkstra.BIDIRECTIONAL_CURVE;
      this.edgeCurveOverrides[this.edgeKey(to, from)] = -DirectedDijkstra.BIDIRECTIONAL_CURVE;
      pairTracker[canonicalKey] = true;
    }
  }
};

DirectedDijkstra.prototype.buildVertexLabels = function (vertexCount) {
  var labels = [];
  for (var i = 0; i < vertexCount; i++) {
    labels.push(String(i));
  }
  return labels;
};

DirectedDijkstra.prototype.computeCircularLayout = function (vertexCount) {
  if (
    DirectedDijkstra.CUSTOM_LAYOUT_POINTS &&
    vertexCount <= DirectedDijkstra.CUSTOM_LAYOUT_POINTS.length
  ) {
    var customLayout = [];
    for (var i = 0; i < vertexCount; i++) {
      var point = DirectedDijkstra.CUSTOM_LAYOUT_POINTS[i];
      customLayout.push({ x: point.x, y: point.y });
    }
    return customLayout;
  }

  var layout = [];
  var radius = 210;
  var centerX = DirectedDijkstra.GRAPH_AREA_CENTER_X;
  var centerY = DirectedDijkstra.ROW2_START_Y + 240;

  for (var j = 0; j < vertexCount; j++) {
    var angle = (2 * Math.PI * j) / vertexCount - Math.PI / 2;
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
    "Directed Dijkstra Shortest Paths",
    DirectedDijkstra.CANVAS_WIDTH / 2,
    DirectedDijkstra.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, DirectedDijkstra.TITLE_COLOR);

  this.createInfoPanel();

  var defaultStartLabel =
    this.vertexLabels && this.vertexLabels.length > 0 ? this.vertexLabels[0] : "0";
  this.startDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.startDisplayID,
    "Start Vertex: " + defaultStartLabel,
    DirectedDijkstra.CANVAS_WIDTH / 2,
    DirectedDijkstra.START_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.startDisplayID, "bold 24");
  this.cmd("SetForegroundColor", this.startDisplayID, DirectedDijkstra.START_INFO_COLOR);
};

DirectedDijkstra.prototype.createInfoPanel = function () {
  this.infoPanelRectID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.infoPanelRectID,
    "",
    DirectedDijkstra.INFO_PANEL_WIDTH,
    DirectedDijkstra.INFO_PANEL_HEIGHT,
    DirectedDijkstra.CANVAS_WIDTH / 2,
    DirectedDijkstra.INFO_PANEL_Y
  );
  this.cmd("SetForegroundColor", this.infoPanelRectID, DirectedDijkstra.INFO_PANEL_BORDER);
  this.cmd("SetBackgroundColor", this.infoPanelRectID, DirectedDijkstra.INFO_PANEL_FILL);
  this.cmd(
    "SetRectangleLineThickness",
    this.infoPanelRectID,
    DirectedDijkstra.INFO_PANEL_BORDER_THICKNESS
  );

  this.infoPanelTextID = this.nextIndex++;
  var anchor = this.getInfoPanelTextAnchor();
  var defaultText = this.wrapInfoPanelText(DirectedDijkstra.INFO_PANEL_DEFAULT_TEXT);
  this.cmd(
    "CreateLabel",
    this.infoPanelTextID,
    defaultText,
    anchor.x,
    anchor.y,
    0
  );
  this.cmd("SetTextStyle", this.infoPanelTextID, DirectedDijkstra.INFO_PANEL_TEXT_STYLE);
  this.cmd("SetForegroundColor", this.infoPanelTextID, DirectedDijkstra.INFO_PANEL_TEXT_COLOR);
  this.cmd(
    "SetTextLineSpacing",
    this.infoPanelTextID,
    DirectedDijkstra.INFO_PANEL_LINE_SPACING
  );

  this.initializeInfoPanelProgressBar();
};

DirectedDijkstra.prototype.getInfoPanelTextAnchor = function () {
  var panelLeft =
    DirectedDijkstra.CANVAS_WIDTH / 2 - DirectedDijkstra.INFO_PANEL_WIDTH / 2;
  var panelTop =
    DirectedDijkstra.INFO_PANEL_Y - DirectedDijkstra.INFO_PANEL_HEIGHT / 2;
  return {
    x: panelLeft + DirectedDijkstra.INFO_PANEL_TEXT_PADDING_X,
    y: panelTop + DirectedDijkstra.INFO_PANEL_TEXT_PADDING_Y,
  };
};

DirectedDijkstra.prototype.initializeInfoPanelProgressBar = function () {
  var metrics = this.getInfoPanelProgressMetrics();
  var fillMetrics = this.getInfoPanelProgressFillMetrics(metrics);
  var trackWidth = Math.max(1, Math.round(metrics.width));
  var trackCenterX = Math.round(metrics.centerX);
  var trackCenterY = Math.round(metrics.centerY);

  this.infoPanelProgressTrackID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.infoPanelProgressTrackID,
    "",
    trackWidth,
    DirectedDijkstra.INFO_PANEL_PROGRESS_HEIGHT,
    trackCenterX,
    trackCenterY
  );
  this.cmd(
    "SetForegroundColor",
    this.infoPanelProgressTrackID,
    DirectedDijkstra.INFO_PANEL_PROGRESS_TRACK_BORDER
  );
  this.cmd(
    "SetBackgroundColor",
    this.infoPanelProgressTrackID,
    DirectedDijkstra.INFO_PANEL_PROGRESS_TRACK_COLOR
  );
  this.cmd("SetRectangleLineThickness", this.infoPanelProgressTrackID, 1);
  this.cmd("SetAlpha", this.infoPanelProgressTrackID, 0);

  var fillHeight = Math.max(2, DirectedDijkstra.INFO_PANEL_PROGRESS_HEIGHT - 4);
  var fillWidth = Math.max(1, Math.round(fillMetrics.width));
  var fillCenterX = Math.round(fillMetrics.centerX);

  this.infoPanelProgressFillID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.infoPanelProgressFillID,
    "",
    fillWidth,
    fillHeight,
    fillCenterX,
    trackCenterY
  );
  this.cmd(
    "SetForegroundColor",
    this.infoPanelProgressFillID,
    DirectedDijkstra.INFO_PANEL_PROGRESS_FILL_COLOR
  );
  this.cmd(
    "SetBackgroundColor",
    this.infoPanelProgressFillID,
    DirectedDijkstra.INFO_PANEL_PROGRESS_FILL_COLOR
  );
  this.cmd("SetRectangleLineThickness", this.infoPanelProgressFillID, 0);
  this.cmd("SetAlpha", this.infoPanelProgressFillID, 0);
};

DirectedDijkstra.prototype.getInfoPanelProgressMetrics = function () {
  var availableWidth = this.getInfoPanelAvailableWidth();
  if (availableWidth <= 0) {
    availableWidth =
      DirectedDijkstra.INFO_PANEL_WIDTH -
      2 * DirectedDijkstra.INFO_PANEL_TEXT_PADDING_X;
  }
  var panelLeft =
    DirectedDijkstra.CANVAS_WIDTH / 2 - DirectedDijkstra.INFO_PANEL_WIDTH / 2;
  var left = panelLeft + DirectedDijkstra.INFO_PANEL_TEXT_PADDING_X;
  var width = Math.max(40, availableWidth);
  var centerX = left + width / 2;
  var centerY =
    DirectedDijkstra.INFO_PANEL_Y +
    DirectedDijkstra.INFO_PANEL_HEIGHT / 2 -
    DirectedDijkstra.INFO_PANEL_PROGRESS_BOTTOM_PADDING;
  return {
    left: left,
    width: width,
    centerX: centerX,
    centerY: centerY,
  };
};

DirectedDijkstra.prototype.getInfoPanelProgressFillMetrics = function (
  trackMetrics
) {
  var margin = DirectedDijkstra.INFO_PANEL_PROGRESS_FILL_MARGIN;
  if (typeof margin !== "number" || margin < 0) {
    margin = 0;
  }
  var width = Math.max(2, trackMetrics.width - margin);
  var left = trackMetrics.left + margin / 2;
  return {
    left: left,
    width: width,
    centerX: left + width / 2,
  };
};

DirectedDijkstra.prototype.layoutInfoPanelProgressBar = function () {
  if (
    this.infoPanelProgressTrackID === -1 ||
    this.infoPanelProgressFillID === -1
  ) {
    return null;
  }

  var trackMetrics = this.getInfoPanelProgressMetrics();
  var fillMetrics = this.getInfoPanelProgressFillMetrics(trackMetrics);

  this.cmd(
    "SetPosition",
    this.infoPanelProgressTrackID,
    Math.round(trackMetrics.centerX),
    Math.round(trackMetrics.centerY)
  );
  this.cmd(
    "SetWidth",
    this.infoPanelProgressTrackID,
    Math.max(1, Math.round(trackMetrics.width))
  );
  this.cmd(
    "SetPosition",
    this.infoPanelProgressFillID,
    Math.round(fillMetrics.centerX),
    Math.round(trackMetrics.centerY)
  );
  this.cmd(
    "SetWidth",
    this.infoPanelProgressFillID,
    Math.max(1, Math.round(fillMetrics.width))
  );

  return {
    track: trackMetrics,
    fill: fillMetrics,
  };
};

DirectedDijkstra.prototype.estimateInfoPanelReadSteps = function (text) {
  if (typeof text !== "string" || text.length === 0) {
    return 0;
  }

  var normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length === 0) {
    return 0;
  }

  var base = DirectedDijkstra.INFO_PANEL_PROGRESS_BASE_STEPS;
  if (typeof base !== "number" || base < 0) {
    base = 0;
  }

  var per = DirectedDijkstra.INFO_PANEL_PROGRESS_CHARS_PER_STEP;
  var extra = 0;
  if (typeof per === "number" && per > 0) {
    extra = Math.ceil(normalized.length / per);
  }

  var steps = base + extra;
  var minSteps = DirectedDijkstra.INFO_PANEL_PROGRESS_MIN_STEPS;
  if (typeof minSteps !== "number" || minSteps < 0) {
    minSteps = 0;
  }
  var maxSteps = DirectedDijkstra.INFO_PANEL_PROGRESS_MAX_STEPS;
  if (typeof maxSteps !== "number" || maxSteps <= 0) {
    maxSteps = steps;
  }

  steps = Math.max(minSteps, steps);
  steps = Math.min(maxSteps, steps);
  return steps;
};

DirectedDijkstra.prototype.runInfoPanelPendingActions = function () {
  if (!this.infoPanelPendingActions || this.infoPanelPendingActions.length === 0) {
    return;
  }
  for (var i = 0; i < this.infoPanelPendingActions.length; i++) {
    var fn = this.infoPanelPendingActions[i];
    if (typeof fn === "function") {
      fn.call(this);
    }
  }
  this.infoPanelPendingActions = [];
};

DirectedDijkstra.prototype.animateInfoPanelReading = function (text) {
  var metricsInfo = this.layoutInfoPanelProgressBar();
  var steps = this.estimateInfoPanelReadSteps(text);

  if (!metricsInfo || steps <= 0) {
    this.runInfoPanelPendingActions();
    return;
  }

  var trackMetrics = metricsInfo.track;
  var fillMetrics = metricsInfo.fill;
  var fullWidth = fillMetrics.width;
  var fillLeft = fillMetrics.left;
  var trackCenterY = Math.round(trackMetrics.centerY);
  var initialWidth = Math.max(1, Math.round(fullWidth));
  var initialCenterX = Math.round(fillMetrics.centerX);

  this.cmd(
    "SetForegroundColor",
    this.infoPanelRectID,
    DirectedDijkstra.INFO_PANEL_ALERT_BORDER
  );
  this.cmd(
    "SetRectangleLineThickness",
    this.infoPanelRectID,
    DirectedDijkstra.INFO_PANEL_ALERT_BORDER_THICKNESS
  );
  this.cmd("SetAlpha", this.infoPanelProgressTrackID, 1);
  this.cmd("SetAlpha", this.infoPanelProgressFillID, 1);
  this.cmd("SetWidth", this.infoPanelProgressFillID, initialWidth);
  this.cmd(
    "SetPosition",
    this.infoPanelProgressFillID,
    initialCenterX,
    trackCenterY
  );

  this.cmd("Step");

  var remainingWidth = fullWidth;
  for (var i = 0; i < steps; i++) {
    remainingWidth = (fillMetrics.width * (steps - (i + 1))) / steps;
    if (remainingWidth < 0) {
      remainingWidth = 0;
    }
    var width = Math.max(0, remainingWidth);
    var roundedWidth = Math.round(width);
    if (roundedWidth < 1 && width > 0) {
      roundedWidth = 1;
    }
    if (roundedWidth < 1) {
      roundedWidth = 1;
    }
    var centerX = fillLeft + (width <= 0 ? 0 : width / 2);
    var roundedCenterX = Math.round(centerX);
    this.cmd(
      "SetWidth",
      this.infoPanelProgressFillID,
      roundedWidth
    );
    this.cmd(
      "SetPosition",
      this.infoPanelProgressFillID,
      roundedCenterX,
      trackCenterY
    );
    this.cmd("Step");
  }

  this.cmd("SetAlpha", this.infoPanelProgressFillID, 0);
  this.cmd("SetAlpha", this.infoPanelProgressTrackID, 0);
  this.cmd(
    "SetForegroundColor",
    this.infoPanelRectID,
    DirectedDijkstra.INFO_PANEL_BORDER
  );
  this.cmd(
    "SetRectangleLineThickness",
    this.infoPanelRectID,
    DirectedDijkstra.INFO_PANEL_BORDER_THICKNESS
  );

  this.runInfoPanelPendingActions();
};

DirectedDijkstra.prototype.getInfoPanelAvailableWidth = function () {
  return (
    DirectedDijkstra.INFO_PANEL_WIDTH -
    2 * DirectedDijkstra.INFO_PANEL_TEXT_PADDING_X
  );
};

DirectedDijkstra.prototype.getInfoPanelCanvasContext = function () {
  if (
    this.animationManager &&
    this.animationManager.animatedObjects &&
    this.animationManager.animatedObjects.ctx
  ) {
    return this.animationManager.animatedObjects.ctx;
  }
  return null;
};

DirectedDijkstra.prototype.getInfoPanelCanvasFont = function () {
  var style = DirectedDijkstra.INFO_PANEL_TEXT_STYLE;
  if (!style) {
    return null;
  }

  var fontParts = style.split(/\s+/);
  var weight = "";
  var size = null;

  for (var i = 0; i < fontParts.length; i++) {
    var part = fontParts[i];
    if (!part) {
      continue;
    }
    if (/^[0-9]+$/.test(part)) {
      size = part;
    } else {
      weight = weight.length > 0 ? weight + " " + part : part;
    }
  }

  if (!size) {
    size = "16";
  }

  if (weight.length > 0) {
    return weight + " " + size + "px Arial";
  }
  return size + "px Arial";
};

DirectedDijkstra.prototype.positionInfoPanelText = function () {
  if (this.infoPanelTextID === -1) {
    return;
  }
  var anchor = this.getInfoPanelTextAnchor();
  this.cmd("SetPosition", this.infoPanelTextID, anchor.x, anchor.y);
};

DirectedDijkstra.prototype.wrapInfoPanelText = function (text) {
  if (typeof text !== "string") {
    return "";
  }

  var normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length === 0) {
    return "";
  }

  var maxWidth = this.getInfoPanelAvailableWidth();
  if (maxWidth <= 0) {
    return normalized;
  }

  var ctx = this.getInfoPanelCanvasContext();
  var font = this.getInfoPanelCanvasFont();
  var useApprox = !ctx || !font;
  if (!useApprox) {
    ctx.save();
    ctx.font = font;
  }

  var approxWidth = DirectedDijkstra.INFO_PANEL_APPROX_CHAR_WIDTH;
  if (!approxWidth || approxWidth <= 0) {
    approxWidth = 9;
  }

  var words = normalized.split(" ");
  var lines = [];
  var currentLine = "";

  var measure = function (candidate) {
    if (!candidate) {
      return 0;
    }
    if (!useApprox) {
      return ctx.measureText(candidate).width;
    }
    return candidate.length * approxWidth;
  };

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (!word) {
      continue;
    }
    var candidate = currentLine.length === 0 ? word : currentLine + " " + word;
    if (measure(candidate) > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  if (!useApprox) {
    ctx.restore();
  }

  return lines.join("\n");
};

DirectedDijkstra.prototype.setInfoPanelText = function (text, afterPause) {
  if (typeof text !== "string" || text.length === 0) {
    text = DirectedDijkstra.INFO_PANEL_DEFAULT_TEXT;
  }

  if (!this.infoPanelPendingActions) {
    this.infoPanelPendingActions = [];
  } else {
    this.infoPanelPendingActions.length = 0;
  }

  if (typeof afterPause === "function") {
    this.infoPanelPendingActions.push(afterPause);
  }

  if (this.infoPanelTextID !== -1) {
    var wrapped = this.wrapInfoPanelText(text);
    this.cmd("SetText", this.infoPanelTextID, wrapped);
    this.positionInfoPanelText();
    this.cmd(
      "SetTextLineSpacing",
      this.infoPanelTextID,
      DirectedDijkstra.INFO_PANEL_LINE_SPACING
    );
    this.animateInfoPanelReading(wrapped);
  } else {
    this.runInfoPanelPendingActions();
  }
};

DirectedDijkstra.prototype.resetInfoPanel = function () {
  this.setInfoPanelText(DirectedDijkstra.INFO_PANEL_DEFAULT_TEXT);
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

  this.updateLegendBaseX();

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
      this.edgeStates[key] = { tree: false, color: null };
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
    "Priority queue (min heap)",
    DirectedDijkstra.QUEUE_AREA_CENTER_X,
    DirectedDijkstra.QUEUE_TOP_Y - DirectedDijkstra.QUEUE_HEADER_GAP,
    0
  );
  this.cmd("SetTextStyle", this.queueLabelID, "bold 18");
  this.cmd("SetForegroundColor", this.queueLabelID, DirectedDijkstra.CODE_STANDARD_COLOR);
};

DirectedDijkstra.prototype.getLegendBaseX = function () {
  if (typeof this.legendBaseX === "number") {
    return this.legendBaseX;
  }
  return DirectedDijkstra.LEGEND_BASE_X;
};

DirectedDijkstra.prototype.updateLegendBaseX = function () {
  if (!this.vertexPositions || this.vertexPositions.length === 0) {
    this.legendBaseX = DirectedDijkstra.LEGEND_BASE_X;
    return;
  }

  var minX = Infinity;
  for (var i = 0; i < this.vertexPositions.length; i++) {
    var pos = this.vertexPositions[i];
    if (!pos) {
      continue;
    }
    if (pos.x < minX) {
      minX = pos.x;
    }
  }

  if (minX === Infinity) {
    this.legendBaseX = DirectedDijkstra.LEGEND_BASE_X;
    return;
  }

  var candidate =
    minX - DirectedDijkstra.GRAPH_NODE_RADIUS - DirectedDijkstra.LEGEND_GRAPH_GAP;
  if (candidate < DirectedDijkstra.LEGEND_MIN_X) {
    candidate = DirectedDijkstra.LEGEND_MIN_X;
  }
  this.legendBaseX = candidate;
};

DirectedDijkstra.prototype.ensurePriorityQueueCapacity = function (desiredLength) {
  while (this.priorityQueueRectIDs.length < desiredLength) {
    var rectID = this.nextIndex++;
    this.priorityQueueRectIDs.push(rectID);
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      DirectedDijkstra.QUEUE_SLOT_WIDTH,
      DirectedDijkstra.QUEUE_SLOT_HEIGHT,
      DirectedDijkstra.QUEUE_AREA_CENTER_X,
      DirectedDijkstra.QUEUE_TOP_Y
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

  while (this.priorityQueueRectIDs.length > desiredLength) {
    var removed = this.priorityQueueRectIDs.pop();
    this.cmd("Delete", removed);
  }
};

DirectedDijkstra.prototype.layoutPriorityQueueRectangles = function () {
  var count = this.priorityQueueRectIDs.length;
  if (count === 0) {
    if (this.queueLabelID !== -1) {
      this.cmd(
        "Move",
        this.queueLabelID,
        DirectedDijkstra.QUEUE_AREA_CENTER_X,
        DirectedDijkstra.QUEUE_TOP_Y - DirectedDijkstra.QUEUE_HEADER_GAP
      );
    }
    return;
  }

  var slotStep = DirectedDijkstra.QUEUE_SLOT_HEIGHT + DirectedDijkstra.QUEUE_SLOT_SPACING;
  var availableHeight = DirectedDijkstra.CANVAS_HEIGHT - DirectedDijkstra.QUEUE_TOP_Y;
  var maxRows = Math.max(1, Math.floor(availableHeight / slotStep));
  var columns = Math.max(1, Math.ceil(count / maxRows));
  var columnStep = DirectedDijkstra.QUEUE_SLOT_WIDTH + DirectedDijkstra.QUEUE_COLUMN_SPACING;
  var minX = Infinity;
  var maxX = -Infinity;

  for (var i = 0; i < count; i++) {
    var rectID = this.priorityQueueRectIDs[i];
    var column = Math.floor(i / maxRows);
    var row = i % maxRows;
    var targetX =
      DirectedDijkstra.QUEUE_AREA_CENTER_X +
      (column - (columns - 1) / 2) * columnStep;
    var targetY = DirectedDijkstra.QUEUE_TOP_Y + row * slotStep;
    this.cmd("Move", rectID, targetX, targetY);
    if (targetX < minX) {
      minX = targetX;
    }
    if (targetX > maxX) {
      maxX = targetX;
    }
  }

  if (this.queueLabelID !== -1) {
    var labelCenterX =
      minX === Infinity || maxX === -Infinity
        ? DirectedDijkstra.QUEUE_AREA_CENTER_X
        : (minX + maxX) / 2;
    this.cmd(
      "Move",
      this.queueLabelID,
      labelCenterX,
      DirectedDijkstra.QUEUE_TOP_Y - DirectedDijkstra.QUEUE_HEADER_GAP
    );
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
  this.resetLevelLegend();
  this.clearCumulativeSumDisplay();
  this.resetInfoPanel();
  this.activeStartIndex = -1;

  var length = this.vertexLabels.length;
  this.visited = new Array(length);
  this.distance = new Array(length);
  this.parent = new Array(length);
  this.vertexLevels = new Array(length);
  this.vertexLevelColors = new Array(length);
  this.vertexEdgeColors = new Array(length);
  this.vertexHighlightColors = new Array(length);

  for (var i = 0; i < length; i++) {
    this.visited[i] = false;
    this.distance[i] = Infinity;
    this.parent[i] = -1;
    this.vertexLevels[i] = -1;
    this.vertexLevelColors[i] = null;
    this.vertexEdgeColors[i] = null;
    this.vertexHighlightColors[i] = null;

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

  if (this.vertexIDs.length > 0) {
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[0],
      DirectedDijkstra.START_NODE_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[0],
      DirectedDijkstra.START_NODE_TEXT_COLOR
    );
  }

  if (this.vertexLabels && this.vertexLabels.length > 0) {
    var startLabel = this.vertexLabels[0];
    if (this.startField) {
      this.startField.value = startLabel;
    }
    this.updateStartDisplay(startLabel);
  }

  this.resetTreeEdges();
  this.clearPriorityQueue();
  this.setPriorityQueueActive(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

DirectedDijkstra.prototype.resetLevelLegend = function () {
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

DirectedDijkstra.prototype.prepareLevelLegend = function (startIndex) {
  if (!this.vertexPositions || this.vertexPositions.length === 0) {
    this.levelLegendAnchorY = DirectedDijkstra.LEGEND_DEFAULT_BASE_Y;
    return;
  }

  if (
    typeof startIndex === "number" &&
    startIndex >= 0 &&
    startIndex < this.vertexPositions.length &&
    this.vertexPositions[startIndex]
  ) {
    this.levelLegendAnchorY = this.vertexPositions[startIndex].y;
  } else {
    this.levelLegendAnchorY = DirectedDijkstra.LEGEND_DEFAULT_BASE_Y;
  }
};

DirectedDijkstra.prototype.getLevelLegendY = function (level) {
  var baseY =
    typeof this.levelLegendAnchorY === "number"
      ? this.levelLegendAnchorY
      : DirectedDijkstra.LEGEND_DEFAULT_BASE_Y;
  return (
    baseY +
    level * (DirectedDijkstra.LEGEND_RECT_HEIGHT + DirectedDijkstra.LEGEND_SPACING)
  );
};

DirectedDijkstra.prototype.ensureLevelLegendEntry = function (level, color) {
  if (typeof level !== "number" || level < 0) {
    return;
  }

  if (!this.levelLegendEntries) {
    this.levelLegendEntries = [];
  }

  if (typeof this.levelLegendAnchorY !== "number") {
    this.prepareLevelLegend(this.activeStartIndex || 0);
  }

  var entry = this.levelLegendEntries[level];
  var fillColor = typeof color === "string" ? color : DirectedDijkstra.GRAPH_NODE_COLOR;

  if (!entry) {
    var rectID = this.nextIndex++;
    var labelID = this.nextIndex++;
    var y = this.getLevelLegendY(level);
    var baseX = this.getLegendBaseX();

    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      DirectedDijkstra.LEGEND_RECT_WIDTH,
      DirectedDijkstra.LEGEND_RECT_HEIGHT,
      baseX,
      y
    );
    this.cmd("SetForegroundColor", rectID, DirectedDijkstra.GRAPH_NODE_BORDER);
    this.cmd("SetBackgroundColor", rectID, fillColor);

    var labelX =
      baseX +
      DirectedDijkstra.LEGEND_RECT_WIDTH / 2 +
      DirectedDijkstra.LEGEND_TEXT_GAP;
    this.cmd(
      "CreateLabel",
      labelID,
      "Level " + level,
      labelX,
      y,
      0
    );
    this.cmd("SetTextStyle", labelID, DirectedDijkstra.LEGEND_FONT);
    this.cmd("SetForegroundColor", labelID, DirectedDijkstra.LEGEND_TEXT_COLOR);

    this.levelLegendEntries[level] = {
      rectID: rectID,
      labelID: labelID,
      color: fillColor,
    };
    return;
  }

  if (entry.color !== fillColor) {
    this.cmd("SetBackgroundColor", entry.rectID, fillColor);
    entry.color = fillColor;
  }
};

DirectedDijkstra.prototype.getLevelColor = function (level) {
  if (!DirectedDijkstra.LEVEL_COLORS || DirectedDijkstra.LEVEL_COLORS.length === 0) {
    return DirectedDijkstra.GRAPH_NODE_VISITED_COLOR;
  }
  var index = level % DirectedDijkstra.LEVEL_COLORS.length;
  if (index < 0) {
    index += DirectedDijkstra.LEVEL_COLORS.length;
  }
  return DirectedDijkstra.LEVEL_COLORS[index];
};

DirectedDijkstra.prototype.setVertexLevel = function (vertexIndex, level) {
  if (!this.vertexLevels || vertexIndex < 0 || vertexIndex >= this.vertexLevels.length) {
    return null;
  }
  if (typeof level !== "number" || level < 0) {
    level = 0;
  }
  this.vertexLevels[vertexIndex] = level;
  var color = this.getLevelColor(level);
  if (this.vertexLevelColors && vertexIndex < this.vertexLevelColors.length) {
    this.vertexLevelColors[vertexIndex] = color;
  }
  var edgeColor = this.deriveEdgeColor(color);
  if (this.vertexEdgeColors && vertexIndex < this.vertexEdgeColors.length) {
    this.vertexEdgeColors[vertexIndex] = edgeColor;
  }
  var highlightColor = this.deriveHighlightColor(edgeColor || color);
  if (this.vertexHighlightColors && vertexIndex < this.vertexHighlightColors.length) {
    this.vertexHighlightColors[vertexIndex] = highlightColor;
  }
  return color;
};

DirectedDijkstra.prototype.applyVertexLevelColor = function (vertexIndex, level) {
  if (!this.vertexIDs || vertexIndex < 0 || vertexIndex >= this.vertexIDs.length) {
    return DirectedDijkstra.GRAPH_NODE_VISITED_COLOR;
  }

  if (
    (!this.vertexLevelColors || !this.vertexLevelColors[vertexIndex]) &&
    typeof level === "number"
  ) {
    this.setVertexLevel(vertexIndex, level);
  }

  var color =
    this.vertexLevelColors && this.vertexLevelColors[vertexIndex]
      ? this.vertexLevelColors[vertexIndex]
      : this.getLevelColor(level || 0);

  this.cmd("SetBackgroundColor", this.vertexIDs[vertexIndex], color);
  this.cmd(
    "SetTextColor",
    this.vertexIDs[vertexIndex],
    DirectedDijkstra.GRAPH_NODE_VISITED_TEXT_COLOR
  );

  return color;
};

DirectedDijkstra.prototype.getVertexEdgeColor = function (vertexIndex) {
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
    vertexIndex < this.vertexLevelColors.length &&
    typeof this.vertexLevelColors[vertexIndex] === "string"
  ) {
    return this.deriveEdgeColor(this.vertexLevelColors[vertexIndex]);
  }

  return null;
};

DirectedDijkstra.prototype.deriveEdgeColor = function (nodeColor) {
  if (typeof nodeColor !== "string") {
    return DirectedDijkstra.EDGE_TREE_COLOR;
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

DirectedDijkstra.prototype.deriveHighlightColor = function (baseColor) {
  if (typeof baseColor !== "string") {
    return DirectedDijkstra.HIGHLIGHT_COLOR;
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

DirectedDijkstra.prototype.parseHexColor = function (hex) {
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
  var r = parseInt(cleaned.substring(0, 2), 16);
  var g = parseInt(cleaned.substring(2, 4), 16);
  var b = parseInt(cleaned.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }
  return { r: r, g: g, b: b };
};

DirectedDijkstra.prototype.rgbToHsl = function (r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h;
  var s;
  var l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
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

DirectedDijkstra.prototype.hslToRgb = function (h, s, l) {
  var r;
  var g;
  var b;

  if (s === 0) {
    r = g = b = l;
  } else {
    var hue2rgb = function (p, q, t) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

DirectedDijkstra.prototype.rgbToHex = function (r, g, b) {
  var toHex = function (value) {
    var hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
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
    this.edgeStates[this.edgeKey(info.from, info.to)] = {
      tree: false,
      color: null,
    };
  }
};

DirectedDijkstra.prototype.clearPriorityQueue = function () {
  this.priorityQueueData = [];
  for (var i = 0; i < this.priorityQueueRectIDs.length; i++) {
    this.cmd("Delete", this.priorityQueueRectIDs[i]);
  }
  this.priorityQueueRectIDs = [];
  this.resetQueueHighlights();
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

DirectedDijkstra.prototype.clearCumulativeSumDisplay = function () {
  this.cumulativeContext = null;
};

DirectedDijkstra.prototype.describeCumulativeSum = function (
  fromIndex,
  toIndex,
  currentDistance,
  weight,
  newDistance
) {
  var fromLabel =
    this.vertexLabels && fromIndex >= 0 && fromIndex < this.vertexLabels.length
      ? this.vertexLabels[fromIndex]
      : String(fromIndex);
  var toLabel =
    this.vertexLabels && toIndex >= 0 && toIndex < this.vertexLabels.length
      ? this.vertexLabels[toIndex]
      : String(toIndex);
  var distText = currentDistance === Infinity ? "\u221E" : String(currentDistance);
  var weightText = typeof weight === "number" ? String(weight) : "?";
  var result =
    "dist[" +
    fromLabel +
    "] " +
    distText +
    " + w(" +
    fromLabel +
    "," +
    toLabel +
    ") " +
    weightText;
  if (typeof newDistance === "number" && newDistance !== Infinity) {
    result += " = " + newDistance;
  }
  return result;
};

DirectedDijkstra.prototype.buildEdgeEvaluationSummary = function (
  fromIndex,
  toIndex,
  weight,
  newDistance,
  previousDistance,
  shouldRelax
) {
  var fromLabel =
    this.vertexLabels && fromIndex >= 0 && fromIndex < this.vertexLabels.length
      ? this.vertexLabels[fromIndex]
      : String(fromIndex);
  var toLabel =
    this.vertexLabels && toIndex >= 0 && toIndex < this.vertexLabels.length
      ? this.vertexLabels[toIndex]
      : String(toIndex);

  var currentDistance =
    this.distance && fromIndex >= 0 && fromIndex < this.distance.length
      ? this.distance[fromIndex]
      : Infinity;
  var candidateExpression = this.describeCumulativeSum(
    fromIndex,
    toIndex,
    currentDistance,
    weight,
    newDistance
  );

  var previousText = this.formatDistance(previousDistance);
  var summary =
    "Evaluating edge " +
    fromLabel +
    " \u2192 " +
    toLabel +
    " (w=" +
    (typeof weight === "number" ? weight : "?") +
    "). " +
    "After the countdown finishes we highlight the edge, compute " +
    candidateExpression +
    ", and compare it with dist[" +
    toLabel +
    "] = " +
    previousText +
    ". ";

  if (shouldRelax) {
    summary +=
      "The candidate is smaller, so update the distance and parent, flash the refreshed path, and push " +
      toLabel +
      " into the priority queue.";
  } else {
    summary +=
      "The candidate is not smaller, so keep the existing distance and simply clear the highlight.";
  }

  return summary;
};

DirectedDijkstra.prototype.summarizeOutgoingEdges = function (vertexIndex) {
  var result = { count: 0, text: "" };
  if (
    typeof vertexIndex !== "number" ||
    vertexIndex < 0 ||
    vertexIndex >= this.adjacencyList.length
  ) {
    return result;
  }

  var neighbors = this.adjacencyList[vertexIndex] || [];
  if (neighbors.length === 0) {
    var label =
      this.vertexLabels && vertexIndex < this.vertexLabels.length
        ? this.vertexLabels[vertexIndex]
        : String(vertexIndex);
    result.text = label + " has no outgoing edges to inspect.";
    return result;
  }

  var parts = [];
  for (var i = 0; i < neighbors.length; i++) {
    var edge = neighbors[i];
    var toLabel =
      this.vertexLabels && edge.to < this.vertexLabels.length
        ? this.vertexLabels[edge.to]
        : String(edge.to);
    var weightText =
      typeof edge.weight === "number" ? String(edge.weight) : "?";
    parts.push(toLabel + " (w=" + weightText + ")");
  }

  result.count = neighbors.length;
  result.text =
    "Outgoing edges: " +
    parts.join(", ") +
    ". We will evaluate them in a single animation block after the countdown.";
  return result;
};

DirectedDijkstra.prototype.buildLevelPathMessage = function (
  level,
  labels,
  startLabel
) {
  if (!labels || labels.length === 0) {
    return "";
  }

  if (level === 0) {
    return (
      "Start vertex " +
      startLabel +
      " anchors every discovered path. It stays teal so you can trace each route from the root."
    );
  }

  var joined = labels.join(", ");
  return (
    "Level " +
    level +
    " nodes " +
    joined +
    " now glow teal, showing the entire path back to " +
    startLabel +
    "."
  );
};

DirectedDijkstra.prototype.showCumulativeSum = function (
  fromIndex,
  toIndex,
  weight,
  newDistance,
  afterPause
) {
  this.cumulativeContext = null;

  var currentDistance =
    this.distance && fromIndex < this.distance.length
      ? this.distance[fromIndex]
      : Infinity;
  var text = this.describeCumulativeSum(
    fromIndex,
    toIndex,
    currentDistance,
    weight,
    newDistance
  );

  this.cumulativeContext = {
    fromIndex: fromIndex,
    toIndex: toIndex,
    weight: weight,
    newDistance: newDistance,
    currentDistance: currentDistance,
    baseText: text,
  };

  this.setInfoPanelText(text, afterPause);
};

DirectedDijkstra.prototype.updateCumulativeSumDecision = function (
  toIndex,
  shouldRelax,
  afterPause
) {
  if (
    !this.cumulativeContext
  ) {
    return;
  }

  if (
    typeof toIndex === "number" &&
    typeof this.cumulativeContext.toIndex === "number" &&
    toIndex !== this.cumulativeContext.toIndex
  ) {
    return;
  }

  var fromIndex = this.cumulativeContext.fromIndex;
  var currentDistance = this.cumulativeContext.currentDistance;
  var weight = this.cumulativeContext.weight;
  var newDistance = this.cumulativeContext.newDistance;
  var baseText = this.cumulativeContext.baseText;

  var toLabel =
    this.vertexLabels &&
    this.cumulativeContext.toIndex >= 0 &&
    this.cumulativeContext.toIndex < this.vertexLabels.length
      ? this.vertexLabels[this.cumulativeContext.toIndex]
      : String(this.cumulativeContext.toIndex);
  var existing =
    this.distance &&
    this.cumulativeContext.toIndex >= 0 &&
    this.cumulativeContext.toIndex < this.distance.length
      ? this.formatDistance(this.distance[this.cumulativeContext.toIndex])
      : "\u221E";

  var comparison = shouldRelax
    ? " < dist[" + toLabel + "] " + existing + " \u2192 update"
    : " \u2265 dist[" + toLabel + "] " + existing + " \u2192 skip";

  this.setInfoPanelText(baseText + ". " + comparison, afterPause);
};

DirectedDijkstra.prototype.setPriorityQueueActive = function (slotIndex) {
  if (slotIndex >= 0) {
    this.resetQueueHighlights();
  }
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
  this.ensurePriorityQueueCapacity(this.priorityQueueData.length);
  this.layoutPriorityQueueRectangles();

  for (var i = 0; i < this.priorityQueueRectIDs.length; i++) {
    var rectID = this.priorityQueueRectIDs[i];
    var entry = this.priorityQueueData[i];
    var label =
      this.vertexLabels[entry.vertex] + " (" + this.formatDistance(entry.distance) + ")";
    this.cmd("SetText", rectID, label);
  }
  this.setPriorityQueueActive(-1);
};

DirectedDijkstra.prototype.pushToPriorityQueue = function (vertex, distance) {
  this.resetQueueHighlights();
  this.priorityQueueData.push({ vertex: vertex, distance: distance });
  this.priorityQueueData.sort(function (a, b) {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return a.vertex - b.vertex;
  });
  this.updatePriorityQueueDisplay();
  var slotIndex = this.findQueueIndex(vertex, distance);
  if (slotIndex >= 0 && slotIndex < this.priorityQueueRectIDs.length) {
    var rectID = this.priorityQueueRectIDs[slotIndex];
    this.cmd("SetBackgroundColor", rectID, DirectedDijkstra.ARRAY_UPDATE_FILL);
  }
};

DirectedDijkstra.prototype.findQueueIndex = function (vertex, distance) {
  for (var i = 0; i < this.priorityQueueData.length; i++) {
    var entry = this.priorityQueueData[i];
    if (entry.vertex === vertex && entry.distance === distance) {
      return i;
    }
  }
  return -1;
};

DirectedDijkstra.prototype.popFromPriorityQueue = function () {
  if (this.priorityQueueData.length === 0) {
    return null;
  }
  var entry = this.priorityQueueData.shift();
  this.updatePriorityQueueDisplay();
  this.resetQueueHighlights();
  return entry;
};

DirectedDijkstra.prototype.resetQueueHighlights = function () {
  if (!this.priorityQueueRectIDs) {
    return;
  }
  for (var i = 0; i < this.priorityQueueRectIDs.length; i++) {
    this.cmd(
      "SetBackgroundColor",
      this.priorityQueueRectIDs[i],
      DirectedDijkstra.QUEUE_RECT_COLOR
    );
  }
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
  if (active) {
    this.cmd("SetEdgeColor", fromID, toID, DirectedDijkstra.EDGE_ACTIVE_COLOR);
    this.cmd("SetEdgeThickness", fromID, toID, DirectedDijkstra.EDGE_ACTIVE_THICKNESS);
    return;
  }

  this.refreshEdgeAppearance(from, to);
};

DirectedDijkstra.prototype.setTreeEdge = function (from, to, isTreeEdge) {
  var key = this.edgeKey(from, to);
  if (!this.edgeStates[key]) {
    this.edgeStates[key] = { tree: false, color: null };
  }
  this.edgeStates[key].tree = isTreeEdge;
  if (isTreeEdge) {
    var color = this.getVertexEdgeColor(to) || DirectedDijkstra.EDGE_TREE_COLOR;
    this.edgeStates[key].color = color;
  } else {
    this.edgeStates[key].color = null;
  }
  this.refreshEdgeAppearance(from, to);
};

DirectedDijkstra.prototype.refreshEdgeAppearance = function (from, to) {
  if (
    !this.vertexIDs ||
    from < 0 ||
    to < 0 ||
    from >= this.vertexIDs.length ||
    to >= this.vertexIDs.length
  ) {
    return;
  }

  var key = this.edgeKey(from, to);
  var state = this.edgeStates ? this.edgeStates[key] : null;
  var baseColor = DirectedDijkstra.EDGE_COLOR;
  var thickness = DirectedDijkstra.EDGE_THICKNESS;

  if (state && state.tree) {
    baseColor = state.color || this.getVertexEdgeColor(to) || DirectedDijkstra.EDGE_TREE_COLOR;
    thickness = DirectedDijkstra.EDGE_TREE_THICKNESS;
  }

  this.cmd("SetEdgeColor", this.vertexIDs[from], this.vertexIDs[to], baseColor);
  this.cmd("SetEdgeThickness", this.vertexIDs[from], this.vertexIDs[to], thickness);
};

DirectedDijkstra.prototype.markVertexVisited = function (index) {
  if (index < 0 || index >= this.vertexIDs.length) {
    return;
  }
  this.visited[index] = true;
  this.cmd("SetText", this.visitedRectIDs[index], "T");
  this.cmd("SetBackgroundColor", this.visitedRectIDs[index], DirectedDijkstra.ARRAY_VISITED_FILL);
  var level =
    this.vertexLevels && this.vertexLevels[index] >= 0
      ? this.vertexLevels[index]
      : 0;
  var color = this.applyVertexLevelColor(index, level);
  this.ensureLevelLegendEntry(level, color);
};

DirectedDijkstra.prototype.buildPathToVertex = function (vertexIndex) {
  var path = [];
  if (
    typeof vertexIndex !== "number" ||
    vertexIndex < 0 ||
    !this.parent ||
    vertexIndex >= this.parent.length
  ) {
    return path;
  }

  var current = vertexIndex;
  var guard = 0;
  var limit = this.parent.length + 2;
  var stop = typeof this.activeStartIndex === "number" ? this.activeStartIndex : -1;

  while (current !== -1 && guard < limit) {
    path.push(current);
    if ((stop >= 0 && current === stop) || this.parent[current] === -1) {
      break;
    }
    current = this.parent[current];
    guard++;
  }

  if (path.length === 0) {
    return path;
  }

  var tail = path[path.length - 1];
  if (stop >= 0) {
    if (tail !== stop) {
      return [];
    }
  } else if (this.parent[tail] !== -1) {
    return [];
  }

  path.reverse();
  return path;
};

DirectedDijkstra.prototype.applyPathHighlight = function (path, palette) {
  if (!path || path.length === 0) {
    return false;
  }

  palette = palette || {};
  var nodeColor =
    palette.nodeColor || DirectedDijkstra.PATH_TREE_NODE_COLOR;
  var textColor =
    palette.textColor || DirectedDijkstra.PATH_TREE_TEXT_COLOR;
  var edgeColor = palette.edgeColor || DirectedDijkstra.PATH_TREE_EDGE_COLOR;
  var edgeThickness =
    typeof palette.edgeThickness === "number"
      ? palette.edgeThickness
      : DirectedDijkstra.PATH_TREE_EDGE_THICKNESS;
  var seenNodes = palette.seenNodes || null;
  var seenEdges = palette.seenEdges || null;

  var changed = false;

  for (var i = 0; i < path.length; i++) {
    var nodeIndex = path[i];
    if (
      typeof nodeIndex !== "number" ||
      nodeIndex < 0 ||
      nodeIndex >= this.vertexIDs.length
    ) {
      continue;
    }
    if (!seenNodes || !seenNodes[nodeIndex]) {
      if (seenNodes) {
        seenNodes[nodeIndex] = true;
      }
      this.cmd(
        "SetBackgroundColor",
        this.vertexIDs[nodeIndex],
        nodeColor
      );
      this.cmd("SetTextColor", this.vertexIDs[nodeIndex], textColor);
      changed = true;
    }
  }

  for (var j = 0; j < path.length - 1; j++) {
    var from = path[j];
    var to = path[j + 1];
    if (
      typeof from !== "number" ||
      typeof to !== "number" ||
      from < 0 ||
      to < 0 ||
      from >= this.vertexIDs.length ||
      to >= this.vertexIDs.length
    ) {
      continue;
    }
    var edgeKey = this.edgeKey(from, to);
    if (!seenEdges || !seenEdges[edgeKey]) {
      if (seenEdges) {
        seenEdges[edgeKey] = true;
      }
      if (!this.edgeStates[edgeKey]) {
        this.edgeStates[edgeKey] = { tree: true, color: edgeColor };
      } else {
        this.edgeStates[edgeKey].tree = true;
        this.edgeStates[edgeKey].color = edgeColor;
      }
      this.cmd(
        "SetEdgeColor",
        this.vertexIDs[from],
        this.vertexIDs[to],
        edgeColor
      );
      this.cmd(
        "SetEdgeThickness",
        this.vertexIDs[from],
        this.vertexIDs[to],
        edgeThickness
      );
      changed = true;
    }
  }

  return changed;
};

DirectedDijkstra.prototype.buildShortestPathTreeChildren = function () {
  if (!this.parent || this.parent.length === 0) {
    return [];
  }

  var count = this.parent.length;
  var children = new Array(count);
  for (var i = 0; i < count; i++) {
    children[i] = [];
  }

  for (var vertex = 0; vertex < count; vertex++) {
    var parentIndex = this.parent[vertex];
    if (
      typeof parentIndex !== "number" ||
      parentIndex < 0 ||
      parentIndex >= count ||
      this.distance[vertex] === Infinity
    ) {
      continue;
    }
    children[parentIndex].push(vertex);
  }

  if (this.vertexLabels && this.vertexLabels.length === count) {
    var self = this;
    for (var j = 0; j < children.length; j++) {
      if (children[j] && children[j].length > 1) {
        children[j].sort(function (a, b) {
          var labelA = self.vertexLabels[a];
          var labelB = self.vertexLabels[b];
          if (labelA < labelB) {
            return -1;
          }
          if (labelA > labelB) {
            return 1;
          }
          return a - b;
        });
      }
    }
  }

  return children;
};

DirectedDijkstra.prototype.highlightAllDiscoveredPaths = function (
  startIndex,
  shortestTarget
) {
  if (!this.vertexIDs || this.vertexIDs.length === 0) {
    return;
  }
  if (typeof startIndex !== "number" || startIndex < 0) {
    return;
  }
  if (startIndex >= this.vertexIDs.length) {
    return;
  }

  var children = this.buildShortestPathTreeChildren();
  if (!children || children.length === 0) {
    return;
  }

  var visited = new Array(this.vertexIDs.length);
  for (var i = 0; i < visited.length; i++) {
    visited[i] = false;
  }

  var queue = [];
  queue.push({ index: startIndex, level: 0 });
  visited[startIndex] = true;
  var front = 0;
  var startLabel =
    this.vertexLabels && startIndex < this.vertexLabels.length
      ? this.vertexLabels[startIndex]
      : String(startIndex);
  var paintedNodes = {};
  var paintedEdges = {};
  var levelPalette = {
    nodeColor: DirectedDijkstra.PATH_TREE_NODE_COLOR,
    textColor: DirectedDijkstra.PATH_TREE_TEXT_COLOR,
    edgeColor: DirectedDijkstra.PATH_TREE_EDGE_COLOR,
    edgeThickness: DirectedDijkstra.PATH_TREE_EDGE_THICKNESS,
    seenNodes: paintedNodes,
    seenEdges: paintedEdges,
  };

  while (front < queue.length) {
    var currentLevel = queue[front].level;
    var levelNodes = [];

    while (front < queue.length && queue[front].level === currentLevel) {
      var item = queue[front++];
      levelNodes.push(item.index);
      var childList = children[item.index];
      if (!childList || childList.length === 0) {
        continue;
      }
      for (var j = 0; j < childList.length; j++) {
        var child = childList[j];
        if (child < 0 || child >= visited.length || visited[child]) {
          continue;
        }
        visited[child] = true;
        queue.push({ index: child, level: currentLevel + 1 });
      }
    }

    if (levelNodes.length > 0) {
      var labels = [];
      var levelPaths = [];
      for (var k = 0; k < levelNodes.length; k++) {
        var nodeIndex = levelNodes[k];
        var label =
          this.vertexLabels && nodeIndex < this.vertexLabels.length
            ? this.vertexLabels[nodeIndex]
            : String(nodeIndex);
        labels.push(label);
        var levelPath = this.buildPathToVertex(nodeIndex);
        if (levelPath && levelPath.length > 0) {
          levelPaths.push(levelPath);
        }
      }
      var levelMessage = this.buildLevelPathMessage(
        currentLevel,
        labels,
        startLabel
      );
      if (levelMessage && levelMessage.length > 0) {
        (function (message, paths, palette) {
          this.setInfoPanelText(
            message,
            function () {
              var painted = false;
              for (var idx = 0; idx < paths.length; idx++) {
                painted =
                  this.applyPathHighlight(paths[idx], palette) || painted;
              }
              if (painted) {
                this.cmd("Step");
              }
            }.bind(this)
          );
        }.call(this, levelMessage, levelPaths, levelPalette));
      }
    }
  }

  if (
    typeof shortestTarget === "number" &&
    shortestTarget >= 0 &&
    shortestTarget < this.vertexIDs.length &&
    this.distance[shortestTarget] !== Infinity
  ) {
    var bestPath = this.buildPathToVertex(shortestTarget);
    if (bestPath && bestPath.length > 1) {
      var targetLabel = this.vertexLabels[shortestTarget];
      var bestCost = this.formatDistance(this.distance[shortestTarget]);
      var highlightMessage =
        "Shortest path from " +
        startLabel +
        " to " +
        targetLabel +
        " costs " +
        bestCost +
        ". It is highlighted in gold above the teal tree.";
      this.setInfoPanelText(
        highlightMessage,
        function () {
          this.highlightIdentifiedPath(startIndex, shortestTarget);
        }.bind(this)
      );
    }
  }
};

DirectedDijkstra.prototype.animateRelaxationPath = function (targetVertex) {
  var path = this.buildPathToVertex(targetVertex);
  if (!path || path.length < 2) {
    return;
  }

  var edges = [];
  for (var i = 0; i < path.length - 1; i++) {
    edges.push({ from: path[i], to: path[i + 1] });
  }

  for (var j = 0; j < edges.length; j++) {
    var segment = edges[j];
    this.cmd(
      "SetEdgeColor",
      this.vertexIDs[segment.from],
      this.vertexIDs[segment.to],
      DirectedDijkstra.EDGE_ACTIVE_COLOR
    );
    this.cmd(
      "SetEdgeThickness",
      this.vertexIDs[segment.from],
      this.vertexIDs[segment.to],
      DirectedDijkstra.EDGE_ACTIVE_THICKNESS
    );
  }

  this.cmd("Step");

  for (var k = 0; k < edges.length; k++) {
    this.refreshEdgeAppearance(edges[k].from, edges[k].to);
  }

  this.cmd("Step");
};

DirectedDijkstra.prototype.runDijkstra = function (startIndex) {
  this.commands = [];

  if (typeof startIndex !== "number" || startIndex < 0 || startIndex >= this.vertexLabels.length) {
    startIndex = 0;
  }

  this.resetAlgorithmState();
  this.activeStartIndex = startIndex;
  this.prepareLevelLegend(startIndex);
  var startColor = this.setVertexLevel(startIndex, 0);
  this.ensureLevelLegendEntry(0, startColor);

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
  this.cmd("Step");

  this.highlightCodeLine(5);
  this.setDistanceValue(startIndex, 0, true);
  this.cmd("Step");
  this.cmd(
    "SetBackgroundColor",
    this.distanceRectIDs[startIndex],
    DirectedDijkstra.ARRAY_RECT_COLOR
  );

  this.highlightCodeLine(6);
  this.pushToPriorityQueue(startIndex, 0);
  this.cmd("Step");
    this.setInfoPanelText(
      "Initialize " +
        startLabel +
        " with distance 0 and push it into the min-heap."
    );

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
    this.cmd("Step");

    this.highlightCodeLine(9);
    this.cmd("Step");

    var currentVertex = entry.vertex;
    var currentLabel = this.vertexLabels[currentVertex];
    var neighborSummary = this.summarizeOutgoingEdges(currentVertex);
    var extractionMessage =
      "Extract " +
      currentLabel +
      " with distance " +
      this.formatDistance(entry.distance) +
      ". " +
      (neighborSummary.count === 0
        ? currentLabel +
          " has no outgoing edges, so we simply mark it done and continue."
        : neighborSummary.text);
    this.setInfoPanelText(
      extractionMessage,
      function () {
        this.moveHighlightCircleToVertex(currentVertex);
        this.clearCumulativeSumDisplay();
        this.cmd("Step");
      }.bind(this)
    );

    if (this.visited[currentVertex]) {
      this.highlightCodeLine(10);
      this.cmd("Step");
      this.clearCumulativeSumDisplay();
      this.setInfoPanelText(
        currentLabel + " already processed. Skip to the next heap entry."
      );
      continue;
    }

    this.highlightCodeLine(11);
    this.markVertexVisited(currentVertex);
    this.cmd("Step");
    if (neighborSummary.count > 0) {
      this.setInfoPanelText(
        "Lock " +
          currentLabel +
          " as settled. We will now animate each edge comparison in order."
      );
    } else {
      this.setInfoPanelText(
        "Lock " +
          currentLabel +
          " as settled. With no outgoing edges to relax, the heap pop finishes immediately."
      );
    }

    this.highlightCodeLine(12);
    this.cmd("Step");

    for (var i = 0; i < this.adjacencyList[currentVertex].length; i++) {
      var neighbor = this.adjacencyList[currentVertex][i];
      var nextVertex = neighbor.to;
      var previousDistance = this.distance[nextVertex];

      this.highlightCodeLine(13);

      var currentDistance = this.distance[currentVertex];
      var newDistance = currentDistance + neighbor.weight;
      var shouldRelax = newDistance < this.distance[nextVertex];
      var summaryText = this.buildEdgeEvaluationSummary(
        currentVertex,
        nextVertex,
        neighbor.weight,
        newDistance,
        previousDistance,
        shouldRelax
      );

      this.setInfoPanelText(
        summaryText,
        function () {
          this.highlightEdge(currentVertex, nextVertex, true);
          this.cmd("Step");

          this.highlightCodeLine(14);
          this.cmd("Step");

          this.highlightCodeLine(15);
          this.setDistanceCellHighlight(nextVertex, true);
          this.cmd("Step");

          this.highlightCodeLine(16);
          this.cmd("Step");

          if (shouldRelax) {
            this.highlightCodeLine(17);
            this.setDistanceValue(nextVertex, newDistance, true);
            this.cmd("Step");
            this.cmd(
              "SetBackgroundColor",
              this.distanceRectIDs[nextVertex],
              DirectedDijkstra.ARRAY_RECT_COLOR
            );

            this.highlightCodeLine(18);
            var previousParent = this.parent[nextVertex];
            if (previousParent !== -1) {
              this.setTreeEdge(previousParent, nextVertex, false);
            }
            this.parent[nextVertex] = currentVertex;
            var childLevel =
              this.vertexLevels && this.vertexLevels[currentVertex] >= 0
                ? this.vertexLevels[currentVertex] + 1
                : 1;
            var levelColor = this.setVertexLevel(nextVertex, childLevel);
            this.ensureLevelLegendEntry(childLevel, levelColor);
            this.setParentValue(nextVertex, currentVertex);
            this.setTreeEdge(currentVertex, nextVertex, true);
            this.cmd("Step");

            this.animateRelaxationPath(nextVertex);

            this.highlightCodeLine(19);
            this.pushToPriorityQueue(nextVertex, newDistance);
            this.cmd("Step");
          }

          this.highlightCodeLine(20);
          this.cmd("Step");

          this.setDistanceCellHighlight(nextVertex, false);
          this.clearCumulativeSumDisplay();
          this.highlightEdge(currentVertex, nextVertex, false);
          this.cmd("Step");
        }.bind(this)
      );
    }
  }

  this.clearCumulativeSumDisplay();

  this.highlightCodeLine(21);
  this.cmd("Step");

  this.highlightCodeLine(22);
  this.cmd("Step");

  this.highlightCodeLine(23);
  this.cmd("Step");

  this.highlightCodeLine(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);

  var targetIndex = this.choosePathTargetIndex(startIndex);
  this.highlightAllDiscoveredPaths(startIndex, targetIndex);

  if (targetIndex !== -1) {
    var targetLabel = this.vertexLabels[targetIndex];
    this.setInfoPanelText(
      "Dijkstra finished. Every reachable tree path now glows teal, and the gold route from " +
        startLabel +
        " to " +
        targetLabel +
        " marks the minimum-distance path."
    );
  } else {
    this.setInfoPanelText(
      "Dijkstra finished. No other vertices were reachable beyond the start node."
    );
  }

  return this.commands;
};

DirectedDijkstra.prototype.choosePathTargetIndex = function (startIndex) {
  var bestIndex = -1;
  var bestDistance = Infinity;

  for (var i = 0; i < this.distance.length; i++) {
    if (i === startIndex) {
      continue;
    }
    if (this.distance[i] === Infinity) {
      continue;
    }
    if (this.distance[i] < bestDistance) {
      bestDistance = this.distance[i];
      bestIndex = i;
    }
  }

  return bestIndex;
};

DirectedDijkstra.prototype.highlightIdentifiedPath = function (startIndex, targetIndex) {
  if (
    typeof targetIndex !== "number" ||
    targetIndex < 0 ||
    targetIndex >= this.vertexIDs.length ||
    this.distance[targetIndex] === Infinity
  ) {
    return;
  }

  var path = this.buildPathToVertex(targetIndex);
  if (!path || path.length === 0) {
    return;
  }
  if (typeof startIndex === "number" && startIndex >= 0) {
    if (path[0] !== startIndex) {
      return;
    }
  }

  this.applyPathHighlight(path, {
    nodeColor: DirectedDijkstra.PATH_NODE_COLOR,
    textColor: DirectedDijkstra.PATH_NODE_TEXT_COLOR,
    edgeColor: DirectedDijkstra.PATH_EDGE_COLOR,
    edgeThickness: DirectedDijkstra.PATH_EDGE_THICKNESS,
  });
  this.cmd("Step");
};

DirectedDijkstra.prototype.startCallback = function () {
  var startValue = this.startField.value.trim();
  if (startValue.length === 0) {
    startValue =
      this.vertexLabels && this.vertexLabels.length > 0
        ? this.vertexLabels[0]
        : "0";
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
