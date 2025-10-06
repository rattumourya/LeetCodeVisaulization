// Custom visualization for BFS traversal on a directed graph using a 9:16 canvas.

function DirectedBFS(am, w, h) {
  this.init(am, w, h);
}

DirectedBFS.prototype = new Algorithm();
DirectedBFS.prototype.constructor = DirectedBFS;
DirectedBFS.superclass = Algorithm.prototype;

DirectedBFS.CANVAS_WIDTH = 900;
DirectedBFS.CANVAS_HEIGHT = 1600;

DirectedBFS.ROW1_HEIGHT = 240;
DirectedBFS.ROW2_HEIGHT = 760;
DirectedBFS.ROW3_HEIGHT =
  DirectedBFS.CANVAS_HEIGHT - DirectedBFS.ROW1_HEIGHT - DirectedBFS.ROW2_HEIGHT;

DirectedBFS.ROW1_CENTER_Y = DirectedBFS.ROW1_HEIGHT / 2;
DirectedBFS.ROW2_START_Y = DirectedBFS.ROW1_HEIGHT;
DirectedBFS.ROW3_START_Y =
  DirectedBFS.ROW1_HEIGHT + DirectedBFS.ROW2_HEIGHT;

DirectedBFS.TITLE_Y = DirectedBFS.ROW1_CENTER_Y - 40;
DirectedBFS.START_INFO_Y = DirectedBFS.ROW1_CENTER_Y + 40;

DirectedBFS.GRAPH_AREA_CENTER_X = 360;
DirectedBFS.GRAPH_NODE_RADIUS = 22;
DirectedBFS.GRAPH_NODE_COLOR = "#e3f2fd";
DirectedBFS.GRAPH_NODE_BORDER = "#0b3954";
DirectedBFS.GRAPH_NODE_TEXT = "#003049";
DirectedBFS.GRAPH_NODE_VISITED_COLOR = "#66bb6a";
DirectedBFS.GRAPH_NODE_VISITED_TEXT_COLOR = "#0b3d1f";
DirectedBFS.HIGHLIGHT_RADIUS = DirectedBFS.GRAPH_NODE_RADIUS;
DirectedBFS.EDGE_COLOR = "#4a4e69";
DirectedBFS.EDGE_VISITED_COLOR = "#66bb6a";
DirectedBFS.EDGE_THICKNESS = 3;
DirectedBFS.EDGE_HIGHLIGHT_THICKNESS = DirectedBFS.EDGE_THICKNESS;
DirectedBFS.BIDIRECTIONAL_CURVE = 0.35;
DirectedBFS.BIDIRECTIONAL_EXTRA_OFFSET = 0.12;
// Minimum curvature magnitude to keep opposite-direction edges visually parallel.
DirectedBFS.MIN_PARALLEL_SEPARATION = 0.42;
DirectedBFS.PARALLEL_EDGE_GAP = 0.18;

DirectedBFS.ARRAY_BASE_X = 720;
DirectedBFS.ARRAY_COLUMN_SPACING = 80;
DirectedBFS.ARRAY_TOP_Y = DirectedBFS.ROW2_START_Y + 90;
DirectedBFS.ARRAY_CELL_HEIGHT = 52;
DirectedBFS.ARRAY_CELL_WIDTH = 60;
DirectedBFS.ARRAY_CELL_INNER_HEIGHT = 42;
DirectedBFS.ARRAY_HEADER_HEIGHT = DirectedBFS.ARRAY_CELL_INNER_HEIGHT;
DirectedBFS.ARRAY_RECT_COLOR = "#f1f1f6";
DirectedBFS.ARRAY_RECT_BORDER = "#2b2d42";
DirectedBFS.ARRAY_RECT_HIGHLIGHT_BORDER = "#d62828";
DirectedBFS.ARRAY_RECT_BORDER_THICKNESS = 1;
DirectedBFS.ARRAY_RECT_HIGHLIGHT_THICKNESS = 3;
DirectedBFS.ARRAY_TEXT_COLOR = "#2b2d42";
DirectedBFS.ARRAY_VISITED_FILL = "#b3e5fc";
DirectedBFS.ARRAY_HEADER_GAP = 20;
DirectedBFS.BOTTOM_SECTION_GAP = 56;
DirectedBFS.CODE_TOP_PADDING = 12;

DirectedBFS.CODE_START_X = 120;
DirectedBFS.CODE_LINE_HEIGHT = 32;
DirectedBFS.CODE_STANDARD_COLOR = "#1d3557";
DirectedBFS.CODE_HIGHLIGHT_COLOR = "#e63946";
DirectedBFS.CODE_FONT = "bold 22";

DirectedBFS.QUEUE_AREA_CENTER_X = 660;
DirectedBFS.QUEUE_TOP_Y = DirectedBFS.ROW3_START_Y - 120;
DirectedBFS.QUEUE_SLOT_WIDTH = 60;
DirectedBFS.QUEUE_SLOT_HEIGHT = 42;
DirectedBFS.QUEUE_SLOT_SPACING = 12;
DirectedBFS.QUEUE_SLOT_GAP = DirectedBFS.QUEUE_SLOT_WIDTH + DirectedBFS.QUEUE_SLOT_SPACING;
DirectedBFS.QUEUE_HEADER_GAP = 46;
DirectedBFS.QUEUE_RECT_COLOR = "#f8f9fa";
DirectedBFS.QUEUE_RECT_BORDER = "#1d3557";
DirectedBFS.QUEUE_RECT_ACTIVE_BORDER = "#e63946";
DirectedBFS.QUEUE_RECT_BORDER_THICKNESS = 1;
DirectedBFS.QUEUE_RECT_ACTIVE_THICKNESS = 3;
DirectedBFS.QUEUE_TEXT_COLOR = "#1d3557";
DirectedBFS.QUEUE_FONT = "bold 18";

DirectedBFS.TITLE_COLOR = "#1d3557";
DirectedBFS.START_INFO_COLOR = "#264653";
DirectedBFS.HIGHLIGHT_COLOR = "#ff3b30";

DirectedBFS.CODE_LINES = [
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
  ["}"],
];

DirectedBFS.TEMPLATE_ALLOWED = [
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

DirectedBFS.EDGE_CURVES = [
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

DirectedBFS.prototype.init = function (am, w, h) {
  DirectedBFS.superclass.init.call(this, am, w, h);

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
  this.parentRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.codeID = [];
  this.highlightCircleID = -1;
  this.currentCodeLine = -1;
  this.startDisplayID = -1;
  this.queueRectIDs = [];
  this.queueLabelID = -1;
  this.queueData = [];

  this.bottomSectionTopY =
    DirectedBFS.ROW3_START_Y + DirectedBFS.CODE_TOP_PADDING;

  this.visited = [];
  this.parentArr = [];

  this.implementAction(this.reset.bind(this), 0);
};

DirectedBFS.prototype.addControls = function () {
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

  this.controls.push(this.startField, this.startButton, this.newGraphButton);
};

DirectedBFS.prototype.reset = function () {
  this.nextIndex = 0;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  return this.setup();
};

DirectedBFS.prototype.setup = function () {
  this.commands = [];

  var vertexCount = 10;
  this.vertexLabels = this.createVertexLabels(vertexCount);
  this.generateRandomGraph(vertexCount);

  this.createTitleRow();
  this.createGraphArea();
  this.createArrayArea();
  this.createQueueArea();
  this.createCodeDisplay();

  this.highlightCodeLine(-1);

  if (this.startField) {
    this.setStartFieldValue(this.vertexLabels[0]);
  }

  this.cmd("Step");
  return this.commands;
};

DirectedBFS.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

DirectedBFS.prototype.createVertexLabels = function (count) {
  var labels = [];
  var limit = Math.min(count, 26);
  for (var i = 0; i < limit; i++) {
    labels.push(String.fromCharCode(65 + i));
  }
  return labels;
};

DirectedBFS.prototype.generateRandomGraph = function (vertexCount) {
  this.vertexPositions = this.computeTemplateLayout(vertexCount);
  this.adjacencyList = new Array(vertexCount);
  this.edgeCurveOverrides = {};

  var allowed = DirectedBFS.TEMPLATE_ALLOWED;

  var shuffle = function (array) {
    for (var idx = array.length - 1; idx > 0; idx--) {
      var swap = Math.floor(Math.random() * (idx + 1));
      var temp = array[idx];
      array[idx] = array[swap];
      array[swap] = temp;
    }
  };

  var isDirectionAllowed = function (from, to) {
    return allowed[from] && allowed[from][to];
  };

  var isPairAllowed = function (a, b) {
    return isDirectionAllowed(a, b) || isDirectionAllowed(b, a);
  };

  var pairKey = function (a, b) {
    return a < b ? a + "-" + b : b + "-" + a;
  };

  var baseEdges = [];
  var usedPairs = {};

  var tryAddBaseEdge = function (a, b) {
    if (a === b) {
      return false;
    }
    if (!isPairAllowed(a, b)) {
      return false;
    }
    var key = pairKey(a, b);
    if (usedPairs[key]) {
      return false;
    }
    var min = Math.min(a, b);
    var max = Math.max(a, b);
    baseEdges.push({ u: min, v: max });
    usedPairs[key] = true;
    return true;
  };

  for (var v = 1; v < vertexCount; v++) {
    var neighbors = [];
    for (var u = 0; u < vertexCount; u++) {
      if (u === v) {
        continue;
      }
      if (isPairAllowed(v, u)) {
        neighbors.push(u);
      }
    }
    if (neighbors.length === 0) {
      continue;
    }
    shuffle(neighbors);
    for (var n = 0; n < neighbors.length; n++) {
      if (tryAddBaseEdge(v, neighbors[n])) {
        break;
      }
    }
  }

  var baseEdgePercent = 0.45;
  for (var i = 0; i < vertexCount; i++) {
    for (var j = i + 1; j < vertexCount; j++) {
      if (!isPairAllowed(i, j)) {
        continue;
      }
      if (usedPairs[pairKey(i, j)]) {
        continue;
      }
      if (Math.random() <= baseEdgePercent) {
        tryAddBaseEdge(i, j);
      }
    }
  }

  var directedEdges = [];
  var directedMap = {};
  var incidentEdges = new Array(vertexCount);
  var outDegree = new Array(vertexCount);
  for (var p = 0; p < vertexCount; p++) {
    incidentEdges[p] = [];
    outDegree[p] = 0;
    this.adjacencyList[p] = [];
  }

  var baseRecords = new Array(baseEdges.length);
  for (var b = 0; b < baseEdges.length; b++) {
    var edge = baseEdges[b];
    var forwardAllowed = isDirectionAllowed(edge.u, edge.v);
    var backwardAllowed = isDirectionAllowed(edge.v, edge.u);
    if (!forwardAllowed && !backwardAllowed) {
      continue;
    }
    var from = edge.u;
    var to = edge.v;
    if (forwardAllowed && backwardAllowed) {
      if (Math.random() < 0.5) {
        from = edge.u;
        to = edge.v;
      } else {
        from = edge.v;
        to = edge.u;
      }
    } else if (forwardAllowed) {
      from = edge.u;
      to = edge.v;
    } else {
      from = edge.v;
      to = edge.u;
    }

    var record = {
      from: from,
      to: to,
      min: edge.u,
      max: edge.v,
      curve: 0,
    };
    directedEdges.push(record);
    baseRecords[b] = record;
    directedMap[from + "->" + to] = true;
    outDegree[from]++;
    incidentEdges[edge.u].push(b);
    incidentEdges[edge.v].push(b);
  }

  for (var vertex = 0; vertex < vertexCount; vertex++) {
    if (outDegree[vertex] === 0 && incidentEdges[vertex].length > 0) {
      var options = incidentEdges[vertex].slice();
      shuffle(options);
      for (var opt = 0; opt < options.length && outDegree[vertex] === 0; opt++) {
        var idx = options[opt];
        var record = baseRecords[idx];
        if (!record) {
          continue;
        }
        var other = record.min === vertex ? record.max : record.min;
        if (!isDirectionAllowed(vertex, other)) {
          continue;
        }
        var newKey = vertex + "->" + other;
        if (directedMap[newKey]) {
          continue;
        }
        var oldKey = record.from + "->" + record.to;
        delete directedMap[oldKey];
        outDegree[record.from]--;
        record.from = vertex;
        record.to = other;
        directedMap[newKey] = true;
        outDegree[vertex]++;
      }
    }
  }

  for (var ensure = 0; ensure < vertexCount; ensure++) {
    if (outDegree[ensure] === 0) {
      var extraNeighbors = [];
      if (allowed[ensure]) {
        for (var target = 0; target < vertexCount; target++) {
          if (target !== ensure && isDirectionAllowed(ensure, target)) {
            extraNeighbors.push(target);
          }
        }
      }
      shuffle(extraNeighbors);
      for (var en = 0; en < extraNeighbors.length; en++) {
        var neighbor = extraNeighbors[en];
        var ensureKey = ensure + "->" + neighbor;
        if (directedMap[ensureKey]) {
          continue;
        }
        directedEdges.push({
          from: ensure,
          to: neighbor,
          min: Math.min(ensure, neighbor),
          max: Math.max(ensure, neighbor),
          curve: 0,
        });
        directedMap[ensureKey] = true;
        outDegree[ensure]++;
        break;
      }
    }
  }

  var edgePercent = 0.35;
  for (var from = 0; from < vertexCount; from++) {
    if (!allowed[from]) {
      continue;
    }
    for (var to = 0; to < vertexCount; to++) {
      if (from === to || !allowed[from][to]) {
        continue;
      }
      var key = from + "->" + to;
      if (directedMap[key]) {
        continue;
      }
      if (Math.random() <= edgePercent) {
        directedEdges.push({
          from: from,
          to: to,
          min: Math.min(from, to),
          max: Math.max(from, to),
          curve: 0,
        });
        directedMap[key] = true;
        outDegree[from]++;
      }
    }
  }

  var baseCurveForPair = function (min, max) {
    if (
      DirectedBFS.EDGE_CURVES[min] &&
      typeof DirectedBFS.EDGE_CURVES[min][max] === "number"
    ) {
      return DirectedBFS.EDGE_CURVES[min][max];
    }
    return 0;
  };

  var hasCurveCandidate = false;
  for (var d = 0; d < directedEdges.length; d++) {
    var candidate = directedEdges[d];
    if (Math.abs(baseCurveForPair(candidate.min, candidate.max)) > 0.01) {
      hasCurveCandidate = true;
      break;
    }
  }

  if (!hasCurveCandidate) {
    for (var a = 0; a < vertexCount && !hasCurveCandidate; a++) {
      for (var c = a + 1; c < vertexCount && !hasCurveCandidate; c++) {
        var baseCurve = baseCurveForPair(a, c);
        if (Math.abs(baseCurve) < 0.01) {
          continue;
        }
        if (isDirectionAllowed(a, c) && !directedMap[a + "->" + c]) {
          directedEdges.push({
            from: a,
            to: c,
            min: a,
            max: c,
            curve: 0,
          });
          directedMap[a + "->" + c] = true;
          hasCurveCandidate = true;
        } else if (isDirectionAllowed(c, a) && !directedMap[c + "->" + a]) {
          directedEdges.push({
            from: c,
            to: a,
            min: a,
            max: c,
            curve: 0,
          });
          directedMap[c + "->" + a] = true;
          hasCurveCandidate = true;
        }
      }
    }
  }

  var pairBuckets = {};
  for (var edgeIndex = 0; edgeIndex < directedEdges.length; edgeIndex++) {
    var entry = directedEdges[edgeIndex];
    var bucketKey = entry.min + "-" + entry.max;
    if (!pairBuckets[bucketKey]) {
      pairBuckets[bucketKey] = {
        edges: [],
      };
    }
    pairBuckets[bucketKey].edges.push(entry);
  }

  var adjustCurve = function (baseCurve, offsetIndex) {
    if (Math.abs(baseCurve) < DirectedBFS.MIN_PARALLEL_SEPARATION) {
      var sign = baseCurve >= 0 ? 1 : -1;
      baseCurve =
        sign *
        Math.max(
          DirectedBFS.MIN_PARALLEL_SEPARATION,
          Math.abs(baseCurve) + offsetIndex * DirectedBFS.PARALLEL_EDGE_GAP
        );
    } else {
      baseCurve += offsetIndex * DirectedBFS.PARALLEL_EDGE_GAP;
    }
    return baseCurve;
  };

  for (var bucketKey in pairBuckets) {
    if (!pairBuckets.hasOwnProperty(bucketKey)) {
      continue;
    }
    var bucket = pairBuckets[bucketKey];
    var edges = bucket.edges;
    if (!edges || edges.length === 0) {
      continue;
    }

    edges.sort(function (a, b) {
      return a.from - b.from;
    });

    var baseParts = bucketKey.split("-");
    var min = parseInt(baseParts[0], 10);
    var max = parseInt(baseParts[1], 10);
    var baseCurve = baseCurveForPair(min, max);

    if (edges.length === 1) {
      edges[0].curve = baseCurve;
    } else if (edges.length === 2) {
      var forward = edges[0];
      var backward = edges[1];
      if (forward.from === backward.to && forward.to === backward.from) {
        forward.curve = baseCurve + DirectedBFS.BIDIRECTIONAL_EXTRA_OFFSET;
        backward.curve = -(
          baseCurve + DirectedBFS.BIDIRECTIONAL_EXTRA_OFFSET
        );
      } else {
        for (var e = 0; e < edges.length; e++) {
          edges[e].curve = adjustCurve(baseCurve, e);
        }
      }
    } else {
      for (var multi = 0; multi < edges.length; multi++) {
        edges[multi].curve = adjustCurve(baseCurve, multi);
      }
    }
  }

  for (var edgeIdx = 0; edgeIdx < directedEdges.length; edgeIdx++) {
    var edgeInfo = directedEdges[edgeIdx];
    this.adjacencyList[edgeInfo.from].push(edgeInfo.to);
    var curveKey = this.edgeKey(edgeInfo.from, edgeInfo.to);
    this.edgeCurveOverrides[curveKey] = edgeInfo.curve;
  }

  for (var vtx = 0; vtx < this.adjacencyList.length; vtx++) {
    this.adjacencyList[vtx].sort(function (a, b) {
      return a - b;
    });
  }
};

DirectedBFS.prototype.computeTemplateLayout = function (vertexCount) {
  var layout = [];
  var radius = 220;
  var centerX = DirectedBFS.GRAPH_AREA_CENTER_X;
  var centerY = DirectedBFS.ROW2_START_Y + 240;

  for (var i = 0; i < vertexCount; i++) {
    var angle = (2 * Math.PI * i) / vertexCount - Math.PI / 2;
    var x = centerX + radius * Math.cos(angle);
    var y = centerY + radius * Math.sin(angle);
    layout.push({ x: Math.round(x), y: Math.round(y) });
  }

  return layout;
};

DirectedBFS.prototype.createTitleRow = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "BFS Traversal On Directed Graph",
    DirectedBFS.CANVAS_WIDTH / 2,
    DirectedBFS.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, DirectedBFS.TITLE_COLOR);

  this.startDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.startDisplayID,
    "Start Vertex: A",
    DirectedBFS.CANVAS_WIDTH / 2,
    DirectedBFS.START_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.startDisplayID, "bold 24");
  this.cmd("SetForegroundColor", this.startDisplayID, DirectedBFS.START_INFO_COLOR);
};

DirectedBFS.prototype.edgeKey = function (from, to) {
  return from + "->" + to;
};

DirectedBFS.prototype.getEdgeCurve = function (from, to) {
  var override = this.edgeCurveOverrides[this.edgeKey(from, to)];
  if (typeof override === "number") {
    return override;
  }
  var min = Math.min(from, to);
  var max = Math.max(from, to);
  if (
    DirectedBFS.EDGE_CURVES[min] &&
    typeof DirectedBFS.EDGE_CURVES[min][max] === "number"
  ) {
    var curve = DirectedBFS.EDGE_CURVES[min][max];
    if (from > to) {
      curve = -curve;
    }
    return curve;
  }
  return 0;
};

DirectedBFS.prototype.getReverseEdgeMeta = function (from, to) {
  var key = this.edgeKey(to, from);
  return this.edgeMeta[key] || null;
};

DirectedBFS.prototype.createGraphArea = function () {
  this.vertexIDs = new Array(this.vertexLabels.length);
  this.edgePairs = [];

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
      DirectedBFS.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, DirectedBFS.GRAPH_NODE_COLOR);
    this.cmd("SetForegroundColor", id, DirectedBFS.GRAPH_NODE_BORDER);
    this.cmd("SetTextColor", id, DirectedBFS.GRAPH_NODE_TEXT);
    this.cmd("SetHighlight", id, 0);
  }

  for (var from = 0; from < this.adjacencyList.length; from++) {
    for (var j = 0; j < this.adjacencyList[from].length; j++) {
      var to = this.adjacencyList[from][j];
      var curve = this.getEdgeCurve(from, to);
      var pair = { from: from, to: to, curve: curve };
      var key = this.edgeKey(from, to);
      this.edgePairs.push(pair);
      this.edgeStates[key] = { tree: false };
      this.edgeMeta[key] = pair;
      this.cmd(
        "Connect",
        this.vertexIDs[from],
        this.vertexIDs[to],
        DirectedBFS.EDGE_COLOR,
        curve,
        1,
        ""
      );
      this.cmd(
        "SetEdgeThickness",
        this.vertexIDs[from],
        this.vertexIDs[to],
        DirectedBFS.EDGE_THICKNESS
      );
      this.cmd(
        "SetEdgeHighlight",
        this.vertexIDs[from],
        this.vertexIDs[to],
        0
      );
    }
  }

  this.highlightCircleID = this.nextIndex++;
  var startPos = this.vertexPositions[0];
  this.cmd(
    "CreateHighlightCircle",
    this.highlightCircleID,
    DirectedBFS.HIGHLIGHT_COLOR,
    startPos.x,
    startPos.y,
    DirectedBFS.HIGHLIGHT_RADIUS
  );
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

DirectedBFS.prototype.createArrayArea = function () {
  var visitedHeaderID = this.nextIndex++;
  var parentHeaderID = this.nextIndex++;
  var headerY =
    DirectedBFS.ARRAY_TOP_Y - DirectedBFS.ARRAY_CELL_HEIGHT / 2 - DirectedBFS.ARRAY_HEADER_GAP;

  this.cmd(
    "CreateLabel",
    visitedHeaderID,
    "Visited",
    DirectedBFS.ARRAY_BASE_X,
    headerY
  );
  this.cmd("SetTextStyle", visitedHeaderID, "bold 20");
  this.cmd("SetForegroundColor", visitedHeaderID, DirectedBFS.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    parentHeaderID,
    "parentArr",
    DirectedBFS.ARRAY_BASE_X + DirectedBFS.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", parentHeaderID, "bold 20");
  this.cmd("SetForegroundColor", parentHeaderID, DirectedBFS.CODE_STANDARD_COLOR);

  this.visitedRectIDs = new Array(this.vertexLabels.length);
  this.parentRectIDs = new Array(this.vertexLabels.length);
  this.vertexRowLabelIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rowY = DirectedBFS.ARRAY_TOP_Y + i * DirectedBFS.ARRAY_CELL_HEIGHT;

    var vertexLabelID = this.nextIndex++;
    this.vertexRowLabelIDs[i] = vertexLabelID;
    this.cmd(
      "CreateLabel",
      vertexLabelID,
      this.vertexLabels[i],
      DirectedBFS.ARRAY_BASE_X - 58,
      rowY,
      0
    );
    this.cmd("SetTextStyle", vertexLabelID, "bold 20");
    this.cmd("SetForegroundColor", vertexLabelID, DirectedBFS.START_INFO_COLOR);

    var visitedID = this.nextIndex++;
    this.visitedRectIDs[i] = visitedID;
    this.cmd(
      "CreateRectangle",
      visitedID,
      "F",
      DirectedBFS.ARRAY_CELL_WIDTH,
      DirectedBFS.ARRAY_CELL_INNER_HEIGHT,
      DirectedBFS.ARRAY_BASE_X,
      rowY
    );
    this.cmd("SetForegroundColor", visitedID, DirectedBFS.ARRAY_RECT_BORDER);
    this.cmd(
      "SetRectangleLineThickness",
      visitedID,
      DirectedBFS.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", visitedID, DirectedBFS.ARRAY_TEXT_COLOR);
    this.cmd("SetBackgroundColor", visitedID, DirectedBFS.ARRAY_RECT_COLOR);

    var parentID = this.nextIndex++;
    this.parentRectIDs[i] = parentID;
    this.cmd(
      "CreateRectangle",
      parentID,
      "",
      DirectedBFS.ARRAY_CELL_WIDTH,
      DirectedBFS.ARRAY_CELL_INNER_HEIGHT,
      DirectedBFS.ARRAY_BASE_X + DirectedBFS.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", parentID, DirectedBFS.ARRAY_RECT_BORDER);
    this.cmd(
      "SetRectangleLineThickness",
      parentID,
      DirectedBFS.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", parentID, DirectedBFS.ARRAY_TEXT_COLOR);
    this.cmd("SetBackgroundColor", parentID, DirectedBFS.ARRAY_RECT_COLOR);
  }
};

DirectedBFS.prototype.createQueueArea = function () {
  this.queueRectIDs = new Array(this.vertexLabels.length);
  this.queueData = [];

  this.queueLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.queueLabelID,
    "Queue",
    DirectedBFS.QUEUE_AREA_CENTER_X,
    DirectedBFS.QUEUE_TOP_Y - DirectedBFS.QUEUE_HEADER_GAP,
    0
  );
  this.cmd("SetTextStyle", this.queueLabelID, "bold 20");
  this.cmd("SetForegroundColor", this.queueLabelID, DirectedBFS.CODE_STANDARD_COLOR);

  var spacing = DirectedBFS.QUEUE_SLOT_GAP;
  var offset = ((this.vertexLabels.length - 1) * spacing) / 2;
  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rectID = this.nextIndex++;
    this.queueRectIDs[i] = rectID;
    var x = DirectedBFS.QUEUE_AREA_CENTER_X + i * spacing - offset;
    var y = DirectedBFS.QUEUE_TOP_Y;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      DirectedBFS.QUEUE_SLOT_WIDTH,
      DirectedBFS.QUEUE_SLOT_HEIGHT,
      x,
      y
    );
    this.cmd("SetForegroundColor", rectID, DirectedBFS.QUEUE_RECT_BORDER);
    this.cmd(
      "SetRectangleLineThickness",
      rectID,
      DirectedBFS.QUEUE_RECT_BORDER_THICKNESS
    );
    this.cmd("SetBackgroundColor", rectID, DirectedBFS.QUEUE_RECT_COLOR);
    this.cmd("SetTextColor", rectID, DirectedBFS.QUEUE_TEXT_COLOR);
    this.cmd("SetTextStyle", rectID, DirectedBFS.QUEUE_FONT);
    this.cmd("SetHighlight", rectID, 0);
  }
};

DirectedBFS.prototype.createCodeDisplay = function () {
  var startY = this.bottomSectionTopY + DirectedBFS.CODE_TOP_PADDING;
  this.codeID = this.addCodeToCanvasBase(
    DirectedBFS.CODE_LINES,
    DirectedBFS.CODE_START_X,
    startY,
    DirectedBFS.CODE_LINE_HEIGHT,
    DirectedBFS.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], DirectedBFS.CODE_FONT);
    }
  }
};

DirectedBFS.prototype.highlightCodeLine = function (lineNumber) {
  if (this.codeID.length === 0) {
    return;
  }
  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      var color = i === lineNumber
        ? DirectedBFS.CODE_HIGHLIGHT_COLOR
        : DirectedBFS.CODE_STANDARD_COLOR;
      this.cmd("SetForegroundColor", this.codeID[i][j], color);
    }
  }
  this.currentCodeLine = lineNumber;
};

DirectedBFS.prototype.setVisitedCellHighlight = function (index, active) {
  if (index < 0 || index >= this.visitedRectIDs.length) {
    return;
  }
  var color = active
    ? DirectedBFS.ARRAY_RECT_HIGHLIGHT_BORDER
    : DirectedBFS.ARRAY_RECT_BORDER;
  var thickness = active
    ? DirectedBFS.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : DirectedBFS.ARRAY_RECT_BORDER_THICKNESS;
  var rectID = this.visitedRectIDs[index];
  this.cmd("SetForegroundColor", rectID, color);
  this.cmd("SetRectangleLineThickness", rectID, thickness);
};

DirectedBFS.prototype.setParentCellHighlight = function (index, active) {
  if (index < 0 || index >= this.parentRectIDs.length) {
    return;
  }
  var color = active
    ? DirectedBFS.ARRAY_RECT_HIGHLIGHT_BORDER
    : DirectedBFS.ARRAY_RECT_BORDER;
  var thickness = active
    ? DirectedBFS.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : DirectedBFS.ARRAY_RECT_BORDER_THICKNESS;
  var rectID = this.parentRectIDs[index];
  this.cmd("SetForegroundColor", rectID, color);
  this.cmd("SetRectangleLineThickness", rectID, thickness);
};

DirectedBFS.prototype.resetQueueDisplay = function () {
  this.queueData = [];
  this.renderQueue();
};

DirectedBFS.prototype.renderQueue = function () {
  for (var i = 0; i < this.queueRectIDs.length; i++) {
    var rectID = this.queueRectIDs[i];
    var text = "";
    if (i < this.queueData.length) {
      text = this.vertexLabels[this.queueData[i]];
    }
    this.cmd("SetText", rectID, text);
    var isFront = i === 0 && this.queueData.length > 0;
    var color = isFront
      ? DirectedBFS.QUEUE_RECT_ACTIVE_BORDER
      : DirectedBFS.QUEUE_RECT_BORDER;
    var thickness = isFront
      ? DirectedBFS.QUEUE_RECT_ACTIVE_THICKNESS
      : DirectedBFS.QUEUE_RECT_BORDER_THICKNESS;
    this.cmd("SetForegroundColor", rectID, color);
    this.cmd("SetRectangleLineThickness", rectID, thickness);
  }
};

DirectedBFS.prototype.enqueueDisplay = function (vertexIndex) {
  this.queueData.push(vertexIndex);
  this.renderQueue();
};

DirectedBFS.prototype.dequeueDisplay = function () {
  if (this.queueData.length === 0) {
    return -1;
  }
  var value = this.queueData.shift();
  this.renderQueue();
  return value;
};

DirectedBFS.prototype.clearTraversalState = function () {
  this.visited = new Array(this.vertexLabels.length);
  this.parentArr = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.visited[i] = false;
    this.parentArr[i] = -1;
    this.cmd("SetText", this.visitedRectIDs[i], "F");
    this.cmd("SetBackgroundColor", this.visitedRectIDs[i], DirectedBFS.ARRAY_RECT_COLOR);
    this.cmd("SetText", this.parentRectIDs[i], "");
    this.cmd("SetBackgroundColor", this.parentRectIDs[i], DirectedBFS.ARRAY_RECT_COLOR);
    this.cmd("SetForegroundColor", this.visitedRectIDs[i], DirectedBFS.ARRAY_RECT_BORDER);
    this.cmd(
      "SetRectangleLineThickness",
      this.visitedRectIDs[i],
      DirectedBFS.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetForegroundColor", this.parentRectIDs[i], DirectedBFS.ARRAY_RECT_BORDER);
    this.cmd(
      "SetRectangleLineThickness",
      this.parentRectIDs[i],
      DirectedBFS.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetBackgroundColor", this.vertexIDs[i], DirectedBFS.GRAPH_NODE_COLOR);
    this.cmd("SetTextColor", this.vertexIDs[i], DirectedBFS.GRAPH_NODE_TEXT);
    this.cmd("SetHighlight", this.vertexIDs[i], 0);
  }

  for (var k = 0; k < this.edgePairs.length; k++) {
    var info = this.edgePairs[k];
    var fromID = this.vertexIDs[info.from];
    var toID = this.vertexIDs[info.to];
    this.cmd("SetEdgeColor", fromID, toID, DirectedBFS.EDGE_COLOR);
    this.cmd("SetEdgeThickness", fromID, toID, DirectedBFS.EDGE_THICKNESS);
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    var key = this.edgeKey(info.from, info.to);
    this.edgeStates[key] = { tree: false };
  }

  this.cmd("SetAlpha", this.highlightCircleID, 0);
  this.resetQueueDisplay();
  this.highlightCodeLine(-1);
};

DirectedBFS.prototype.markVertexVisited = function (index) {
  if (index < 0 || index >= this.vertexIDs.length) {
    return;
  }
  this.visited[index] = true;
  this.cmd("SetText", this.visitedRectIDs[index], "T");
  this.cmd("SetBackgroundColor", this.visitedRectIDs[index], DirectedBFS.ARRAY_VISITED_FILL);
  this.cmd("SetBackgroundColor", this.vertexIDs[index], DirectedBFS.GRAPH_NODE_VISITED_COLOR);
  this.cmd("SetTextColor", this.vertexIDs[index], DirectedBFS.GRAPH_NODE_VISITED_TEXT_COLOR);
};

DirectedBFS.prototype.setParentValue = function (child, parent) {
  if (child < 0 || child >= this.parentRectIDs.length) {
    return;
  }
  var text = parent === -1 ? "-" : this.vertexLabels[parent];
  this.parentArr[child] = parent;
  this.cmd("SetText", this.parentRectIDs[child], text);
};

DirectedBFS.prototype.highlightEdge = function (from, to, active) {
  var fromID = this.vertexIDs[from];
  var toID = this.vertexIDs[to];
  var thickness = active
    ? DirectedBFS.EDGE_HIGHLIGHT_THICKNESS + 1
    : DirectedBFS.EDGE_THICKNESS;
  this.cmd("SetEdgeHighlight", fromID, toID, active ? 1 : 0);
  this.cmd("SetEdgeThickness", fromID, toID, thickness);
};

DirectedBFS.prototype.setTreeEdge = function (from, to) {
  var fromID = this.vertexIDs[from];
  var toID = this.vertexIDs[to];
  this.cmd("SetEdgeColor", fromID, toID, DirectedBFS.EDGE_VISITED_COLOR);
  this.cmd("SetEdgeThickness", fromID, toID, DirectedBFS.EDGE_THICKNESS + 1);
  var key = this.edgeKey(from, to);
  this.edgeStates[key] = { tree: true };
};

DirectedBFS.prototype.moveHighlightCircleToVertex = function (index) {
  if (index < 0 || index >= this.vertexPositions.length) {
    return;
  }
  var pos = this.vertexPositions[index];
  this.cmd("Move", this.highlightCircleID, Math.round(pos.x), Math.round(pos.y));
};

DirectedBFS.prototype.getStartFieldValue = function () {
  if (!this.startField) {
    return "";
  }
  if (typeof this.startField.value === "string") {
    return this.startField.value;
  }
  if (this.startField.value !== undefined && this.startField.value !== null) {
    return String(this.startField.value);
  }
  if (this.startField.getAttribute) {
    var attr = this.startField.getAttribute("value");
    if (typeof attr === "string") {
      return attr;
    }
  }
  return "";
};

DirectedBFS.prototype.setStartFieldValue = function (text) {
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

DirectedBFS.prototype.isWhitespaceChar = function (ch) {
  return (
    ch === " " ||
    ch === "\t" ||
    ch === "\n" ||
    ch === "\r" ||
    ch === "\f" ||
    ch === "\u00a0"
  );
};

DirectedBFS.prototype.cleanInputLabel = function (inputLabel) {
  if (typeof inputLabel !== "string") {
    return "";
  }
  var start = 0;
  while (start < inputLabel.length && this.isWhitespaceChar(inputLabel.charAt(start))) {
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

DirectedBFS.prototype.findVertexIndex = function (label) {
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

DirectedBFS.prototype.startCallback = function () {
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

DirectedBFS.prototype.runTraversal = function (startIndex) {
  this.commands = [];

  this.clearTraversalState();

  var startLabel = this.vertexLabels[startIndex];
  this.cmd(
    "SetText",
    this.startDisplayID,
    "Start Vertex: " + startLabel
  );

  this.cmd("SetAlpha", this.highlightCircleID, 1);
  this.moveHighlightCircleToVertex(startIndex);
  this.cmd("Step");

  this.highlightCodeLine(0);
  this.cmd("Step");
  this.highlightCodeLine(1);
  this.cmd("Step");
  this.highlightCodeLine(2);
  this.setVisitedCellHighlight(startIndex, true);
  this.cmd("Step");
  this.markVertexVisited(startIndex);
  this.setVisitedCellHighlight(startIndex, false);

  this.highlightCodeLine(3);
  this.setParentCellHighlight(startIndex, true);
  this.cmd("Step");
  this.setParentValue(startIndex, -1);
  this.setParentCellHighlight(startIndex, false);

  this.highlightCodeLine(4);
  this.enqueueDisplay(startIndex);
  this.cmd("Step");

  this.highlightCodeLine(5);
  this.cmd("Step");

  while (this.queueData.length > 0) {
    this.highlightCodeLine(6);
    this.renderQueue();
    this.cmd("Step");

    this.highlightCodeLine(7);
    var current = this.dequeueDisplay();
    if (current === -1) {
      break;
    }
    this.cmd("Step");

    this.moveHighlightCircleToVertex(current);
    this.cmd("Step");

    this.highlightCodeLine(8);
    this.cmd("Step");

    var neighbors = this.adjacencyList[current];
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      this.highlightCodeLine(9);
      this.highlightEdge(current, neighbor, true);
      this.cmd("Step");

      if (!this.visited[neighbor]) {
        this.highlightCodeLine(10);
        this.setVisitedCellHighlight(neighbor, true);
        this.cmd("Step");
        this.markVertexVisited(neighbor);
        this.setVisitedCellHighlight(neighbor, false);

        this.highlightCodeLine(11);
        this.setParentCellHighlight(neighbor, true);
        this.cmd("Step");
        this.setParentValue(neighbor, current);
        this.setParentCellHighlight(neighbor, false);

        this.highlightCodeLine(12);
        this.enqueueDisplay(neighbor);
        this.setTreeEdge(current, neighbor);
        this.cmd("Step");
      }

      this.highlightEdge(current, neighbor, false);
      this.cmd("Step");
      this.highlightCodeLine(8);
      this.cmd("Step");
    }

    this.highlightCodeLine(5);
    this.cmd("Step");
  }

  this.highlightCodeLine(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);

  return this.commands;
};

DirectedBFS.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

DirectedBFS.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new DirectedBFS(animManag, canvas.width, canvas.height);
}

