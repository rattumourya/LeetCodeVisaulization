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
DirectedBFS.QUEUE_HEADER_HEIGHT = 44;
DirectedBFS.QUEUE_LABEL_MARGIN = 14;
DirectedBFS.QUEUE_AREA_BOTTOM_MARGIN = 30;
DirectedBFS.QUEUE_FRAME_WIDTH = 320;
DirectedBFS.QUEUE_FRAME_HEIGHT = 34;
DirectedBFS.QUEUE_FRAME_MIN_HEIGHT = 22;
DirectedBFS.QUEUE_FRAME_SPACING = 10;
DirectedBFS.QUEUE_FRAME_MIN_SPACING = 6;
DirectedBFS.QUEUE_RECT_COLOR = "#f8f9fa";
DirectedBFS.QUEUE_RECT_BORDER = "#1d3557";
DirectedBFS.QUEUE_RECT_ACTIVE_BORDER = "#e63946";
DirectedBFS.QUEUE_TEXT_COLOR = "#1d3557";
DirectedBFS.QUEUE_FONT = "bold 18";

DirectedBFS.TITLE_COLOR = "#1d3557";
DirectedBFS.START_INFO_COLOR = "#264653";
DirectedBFS.HIGHLIGHT_COLOR = "#ff3b30";
DirectedBFS.LEGEND_BASE_X = 80;
DirectedBFS.LEGEND_RECT_WIDTH = 34;
DirectedBFS.LEGEND_RECT_HEIGHT = 18;
DirectedBFS.LEGEND_SPACING = 12;
DirectedBFS.LEGEND_TEXT_GAP = 14;
DirectedBFS.LEGEND_FONT = "bold 14";
DirectedBFS.LEGEND_TEXT_COLOR = "#1d3557";
DirectedBFS.LEGEND_DEFAULT_BASE_Y = DirectedBFS.ROW2_START_Y + 120;

DirectedBFS.LEVEL_COLORS = [
  "#c6e2ff",
  "#d0f4de",
  "#ffeacc",
  "#e8d7ff",
  "#f0f4c3",
  "#c8f7f4",
  "#dbe7ff",
  "#f2e7fe"
];

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
    ["}"]
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
  [false, false, false, false, false, true, true, false, true, false]
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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
  this.vertexLevelColors = [];
  this.vertexEdgeColors = [];
  this.vertexIDs = [];
  this.frontierHighlightStates = {};
  this.visitedRectIDs = [];
  this.parentRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.codeID = [];
  this.currentCodeLine = -1;
  this.startDisplayID = -1;
  this.queueHeaderID = -1;
  this.queueFrameIDs = [];
  this.queueContents = [];
  this.frontierHighlightIDs = {};
  this.frontierHighlightList = [];
  this.frontierHighlightStates = {};
  this.levelLegendEntries = [];
  this.levelLegendAnchorY = null;
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

  var radioButtons = addRadioButtonGroupToAlgorithmBar(
    ["Directed Graph", "Undirected Graph"],
    "GraphType"
  );
  this.directedGraphButton = radioButtons[0];
  this.undirectedGraphButton = radioButtons[1];
  this.directedGraphButton.checked = true;
  this.directedGraphButton.disabled = true;
  this.undirectedGraphButton.disabled = true;

  this.controls.push(this.startField, this.startButton, this.newGraphButton);
};

DirectedBFS.prototype.reset = function () {
  this.nextIndex = 0;
  this.frontierHighlightIDs = {};
  this.frontierHighlightList = [];
  this.frontierHighlightStates = {};
  this.levelLegendEntries = [];
  this.levelLegendAnchorY = null;
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
  this.createQueueArea();

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
      curve: 0
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
          curve: 0
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
          curve: 0
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
            curve: 0
          });
          directedMap[a + "->" + c] = true;
          hasCurveCandidate = true;
        } else if (isDirectionAllowed(c, a) && !directedMap[c + "->" + a]) {
          directedEdges.push({
            from: c,
            to: a,
            min: a,
            max: c,
            curve: 0
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
        min: entry.min,
        max: entry.max
      };
    }
    pairBuckets[bucketKey].edges.push(entry);
  }

  var hasCurveEdge = false;
  var applyCurves = function (list, baseCurveValue, orientationSign) {
    if (!list.length) {
      return;
    }
    list[0].curve = baseCurveValue;
    if (Math.abs(baseCurveValue) > 0.01) {
      hasCurveEdge = true;
    }
    var baseSign;
    if (Math.abs(baseCurveValue) > 0.01) {
      baseSign = baseCurveValue >= 0 ? 1 : -1;
    } else {
      baseSign = orientationSign >= 0 ? 1 : -1;
    }
    for (var idx = 1; idx < list.length; idx++) {
      var magnitude = Math.abs(baseCurveValue);
      var offsetIndex;
      if (magnitude < 0.01) {
        magnitude = DirectedBFS.BIDIRECTIONAL_CURVE;
        offsetIndex = idx - 1;
      } else {
        offsetIndex = idx;
      }
      var offset = DirectedBFS.BIDIRECTIONAL_EXTRA_OFFSET * offsetIndex;
      var curveValue = baseSign * (magnitude + offset);
      list[idx].curve = curveValue;
      if (Math.abs(curveValue) > 0.01) {
        hasCurveEdge = true;
      }
    }
  };

  for (var bucketKey in pairBuckets) {
    if (!Object.prototype.hasOwnProperty.call(pairBuckets, bucketKey)) {
      continue;
    }
    var bucket = pairBuckets[bucketKey];
    var baseCurve = baseCurveForPair(bucket.min, bucket.max);
    var forward = [];
    var backward = [];
    for (var bi = 0; bi < bucket.edges.length; bi++) {
      var edgeRecord = bucket.edges[bi];
      if (edgeRecord.from === bucket.min && edgeRecord.to === bucket.max) {
        forward.push(edgeRecord);
      } else {
        backward.push(edgeRecord);
      }
    }

    if (forward.length > 0 && backward.length > 0) {
      var baseSign = 1;
      if (Math.abs(baseCurve) > 0.01) {
        baseSign = baseCurve >= 0 ? 1 : -1;
      }
      var minParallel = DirectedBFS.MIN_PARALLEL_SEPARATION;
      var magnitude = Math.abs(baseCurve);
      if (magnitude < minParallel) {
        magnitude = minParallel;
      }
      if (magnitude < 0.01) {
        magnitude = minParallel;
      }
      var forwardCurve = baseSign * magnitude;
      var backwardCurve = baseSign * (magnitude + DirectedBFS.PARALLEL_EDGE_GAP);
      applyCurves(forward, forwardCurve, baseSign);
      applyCurves(backward, backwardCurve, baseSign);
    } else if (forward.length > 0) {
      var curveValue = Math.abs(baseCurve) < 0.01 ? 0 : baseCurve;
      applyCurves(forward, curveValue, 1);
    } else if (backward.length > 0) {
      var reverseCurve = Math.abs(baseCurve) < 0.01 ? 0 : -baseCurve;
      applyCurves(backward, reverseCurve, -1);
    }
  }

  if (!hasCurveEdge && directedEdges.length > 0) {
    var fallbackEdge = directedEdges[0];
    fallbackEdge.curve =
      fallbackEdge.from === fallbackEdge.min
        ? DirectedBFS.BIDIRECTIONAL_CURVE
        : -DirectedBFS.BIDIRECTIONAL_CURVE;
  }

  for (var listIndex = 0; listIndex < directedEdges.length; listIndex++) {
    var finalEdge = directedEdges[listIndex];
    this.adjacencyList[finalEdge.from].push(finalEdge.to);
    this.edgeCurveOverrides[this.edgeKey(finalEdge.from, finalEdge.to)] =
      finalEdge.curve;
  }

  for (var list = 0; list < this.adjacencyList.length; list++) {
    shuffle(this.adjacencyList[list]);
  }
};

DirectedBFS.prototype.computeTemplateLayout = function (vertexCount) {
  var layout = [];
  var baseX = 200;
  var stepX = 130;
  var baseY = DirectedBFS.ROW2_START_Y + 120;
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

DirectedBFS.prototype.createGraphArea = function () {
  this.vertexIDs = new Array(this.vertexLabels.length);
  this.vertexLevelColors = new Array(this.vertexLabels.length);
  this.vertexEdgeColors = new Array(this.vertexLabels.length);
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
    this.vertexLevelColors[i] = null;
    this.vertexEdgeColors[i] = null;
  }

  for (var from = 0; from < this.adjacencyList.length; from++) {
    for (var j = 0; j < this.adjacencyList[from].length; j++) {
      var to = this.adjacencyList[from][j];
      var curve = this.getEdgeCurve(from, to);
      var pair = { from: from, to: to, curve: curve };
      var key = this.edgeKey(from, to);
      this.edgePairs.push(pair);
      this.edgeStates[key] = { tree: false, color: null };
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
    this.cmd("SetBackgroundColor", visitedID, DirectedBFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", visitedID, DirectedBFS.ARRAY_TEXT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      visitedID,
      DirectedBFS.ARRAY_RECT_BORDER_THICKNESS
    );

    var parentID = this.nextIndex++;
    this.parentRectIDs[i] = parentID;
    this.cmd(
      "CreateRectangle",
      parentID,
      "-",
      DirectedBFS.ARRAY_CELL_WIDTH,
      DirectedBFS.ARRAY_CELL_INNER_HEIGHT,
      DirectedBFS.ARRAY_BASE_X + DirectedBFS.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", parentID, DirectedBFS.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", parentID, DirectedBFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", parentID, DirectedBFS.ARRAY_TEXT_COLOR);
  }

  var lastRowIndex = this.vertexLabels.length - 1;
  if (lastRowIndex >= 0) {
    var lastCenterY =
      DirectedBFS.ARRAY_TOP_Y + lastRowIndex * DirectedBFS.ARRAY_CELL_HEIGHT;
    var arrayBottomY =
      lastCenterY + DirectedBFS.ARRAY_CELL_INNER_HEIGHT / 2;
    this.bottomSectionTopY =
      arrayBottomY + DirectedBFS.BOTTOM_SECTION_GAP;
  }
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

DirectedBFS.prototype.computeQueueLayout = function (frameCount) {
  var layout = {
    height: DirectedBFS.QUEUE_FRAME_HEIGHT,
    spacing: DirectedBFS.QUEUE_FRAME_SPACING,
    startY:
      this.bottomSectionTopY +
      DirectedBFS.QUEUE_HEADER_HEIGHT +
      DirectedBFS.QUEUE_LABEL_MARGIN +
      DirectedBFS.QUEUE_FRAME_HEIGHT / 2
  };

  if (frameCount <= 0) {
    return layout;
  }

  var availableHeight =
    DirectedBFS.CANVAS_HEIGHT -
    (this.bottomSectionTopY +
      DirectedBFS.QUEUE_HEADER_HEIGHT +
      DirectedBFS.QUEUE_LABEL_MARGIN +
      DirectedBFS.QUEUE_AREA_BOTTOM_MARGIN);

  if (availableHeight <= 0) {
    return layout;
  }

  var spacing = frameCount === 1 ? 0 : layout.spacing;
  var height = Math.min(
    DirectedBFS.QUEUE_FRAME_HEIGHT,
    Math.max(
      DirectedBFS.QUEUE_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    )
  );

  var totalHeight = height * frameCount + spacing * (frameCount - 1);
  if (totalHeight > availableHeight) {
    spacing = Math.max(
      DirectedBFS.QUEUE_FRAME_MIN_SPACING,
      Math.floor(
        (availableHeight - height * frameCount) / Math.max(1, frameCount - 1)
      )
    );
    if (spacing < 0) {
      spacing = 0;
    }
    height = Math.max(
      DirectedBFS.QUEUE_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    );
  }

  layout.height = height;
  layout.spacing = spacing;
  layout.startY =
    this.bottomSectionTopY +
    DirectedBFS.QUEUE_HEADER_HEIGHT +
    DirectedBFS.QUEUE_LABEL_MARGIN +
    height / 2;

  return layout;
};

DirectedBFS.prototype.createQueueArea = function () {
  var frameCount = this.vertexLabels.length;
  var layout = this.computeQueueLayout(frameCount);

  this.queueHeaderID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.queueHeaderID,
    "Queue",
    DirectedBFS.QUEUE_AREA_CENTER_X,
    this.bottomSectionTopY + DirectedBFS.QUEUE_HEADER_HEIGHT / 2,
    0
  );
  this.cmd(
    "SetForegroundColor",
    this.queueHeaderID,
    DirectedBFS.CODE_STANDARD_COLOR
  );
  this.cmd("SetTextStyle", this.queueHeaderID, "bold 22");

  this.queueFrameIDs = [];
  var y = layout.startY;

  for (var i = 0; i < frameCount; i++) {
    var rectID = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      DirectedBFS.QUEUE_FRAME_WIDTH,
      layout.height,
      DirectedBFS.QUEUE_AREA_CENTER_X,
      y
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      DirectedBFS.QUEUE_RECT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, DirectedBFS.QUEUE_RECT_BORDER);
    this.cmd("SetAlpha", rectID, 0);
    this.cmd("SetTextColor", rectID, DirectedBFS.QUEUE_TEXT_COLOR);
    this.cmd("SetTextStyle", rectID, DirectedBFS.QUEUE_FONT);

    this.queueFrameIDs.push(rectID);
    y += layout.height + layout.spacing;
  }

  this.resetQueueArea();
};

DirectedBFS.prototype.resetQueueArea = function () {
  this.queueContents = [];
  for (var i = 0; i < this.queueFrameIDs.length; i++) {
    var frameID = this.queueFrameIDs[i];
    this.cmd("SetAlpha", frameID, 0);
    this.cmd("SetText", frameID, "");
    this.cmd("SetForegroundColor", frameID, DirectedBFS.QUEUE_RECT_BORDER);
  }
};

DirectedBFS.prototype.updateQueueDisplay = function () {
  var frontHighlightColor = DirectedBFS.QUEUE_RECT_ACTIVE_BORDER;
  var defaultColor = DirectedBFS.QUEUE_RECT_BORDER;
  for (var i = 0; i < this.queueFrameIDs.length; i++) {
    var frameID = this.queueFrameIDs[i];
    if (i < this.queueContents.length) {
      var vertexIndex = this.queueContents[i];
      var label =
        vertexIndex >= 0 && vertexIndex < this.vertexLabels.length
          ? this.vertexLabels[vertexIndex]
          : "";
      this.cmd("SetText", frameID, label);
      this.cmd("SetAlpha", frameID, 1);
    } else {
      this.cmd("SetText", frameID, "");
      this.cmd("SetAlpha", frameID, 0);
    }

    if (i === 0 && this.queueContents.length > 0) {
      this.cmd("SetForegroundColor", frameID, frontHighlightColor);
    } else {
      this.cmd("SetForegroundColor", frameID, defaultColor);
    }
  }
};

DirectedBFS.prototype.enqueueQueueVertex = function (vertexIndex) {
  this.queueContents.push(vertexIndex);
  this.updateQueueDisplay();
};

DirectedBFS.prototype.dequeueQueueVertex = function () {
  if (this.queueContents.length === 0) {
    return -1;
  }
  var vertexIndex = this.queueContents.shift();
  this.updateQueueDisplay();
  return vertexIndex;
};

DirectedBFS.prototype.clearFrontierHighlights = function () {
  if (!this.frontierHighlightIDs) {
    this.frontierHighlightIDs = {};
  }
  var indices = [];
  for (var key in this.frontierHighlightIDs) {
    if (!this.frontierHighlightIDs.hasOwnProperty(key)) {
      continue;
    }
    var index = parseInt(key, 10);
    if (!isNaN(index)) {
      indices.push(index);
    }
  }

  for (var i = 0; i < indices.length; i++) {
    this.releaseFrontierHighlight(indices[i], false);
  }

  this.frontierHighlightList = [];
  this.frontierHighlightIDs = {};
  this.frontierHighlightStates = {};
};

DirectedBFS.prototype.createHighlightCircleAtPosition = function (x, y) {
  if (typeof x !== "number" || typeof y !== "number") {
    return -1;
  }
  var circleID = this.nextIndex++;
  this.cmd(
    "CreateHighlightCircle",
    circleID,
    DirectedBFS.HIGHLIGHT_COLOR,
    Math.round(x),
    Math.round(y),
    DirectedBFS.HIGHLIGHT_RADIUS
  );
  this.cmd("SetAlpha", circleID, 1);
  if (!this.frontierHighlightList) {
    this.frontierHighlightList = [];
  }
  this.frontierHighlightList.push(circleID);
  return circleID;
};

DirectedBFS.prototype.setFrontierHighlightState = function (vertexIndex, active) {
  if (!this.frontierHighlightIDs) {
    this.frontierHighlightIDs = {};
  }
  if (!this.frontierHighlightStates) {
    this.frontierHighlightStates = {};
  }

  var circleID = this.frontierHighlightIDs[vertexIndex];

  if (typeof circleID === "undefined") {
    if (!active) {
      this.frontierHighlightStates[vertexIndex] = false;
      return -1;
    }
    var position = this.vertexPositions[vertexIndex];
    if (!position) {
      this.frontierHighlightStates[vertexIndex] = false;
      return -1;
    }
    circleID = this.createHighlightCircleAtPosition(position.x, position.y);
    if (circleID === -1) {
      this.frontierHighlightStates[vertexIndex] = false;
      return -1;
    }
    this.frontierHighlightIDs[vertexIndex] = circleID;
  }

  if (this.frontierHighlightStates[vertexIndex] === active) {
    return circleID;
  }

  this.frontierHighlightStates[vertexIndex] = active;
  this.cmd("SetHighlight", circleID, active ? 1 : 0);
  this.cmd("SetAlpha", circleID, active ? 1 : 0);

  return circleID;
};

DirectedBFS.prototype.activateFrontierHighlight = function (vertexIndex) {
  return this.setFrontierHighlightState(vertexIndex, true);
};

DirectedBFS.prototype.deactivateFrontierHighlight = function (vertexIndex) {
  return this.setFrontierHighlightState(vertexIndex, false);
};

DirectedBFS.prototype.ensureFrontierHighlight = function (vertexIndex) {
  return this.activateFrontierHighlight(vertexIndex);
};

DirectedBFS.prototype.createFrontierHighlightFromParent = function (
  parentIndex,
  vertexIndex
) {
  if (!this.frontierHighlightIDs) {
    this.frontierHighlightIDs = {};
  }
  if (typeof this.frontierHighlightIDs[vertexIndex] !== "undefined") {
    return this.frontierHighlightIDs[vertexIndex];
  }

  var parentPos = this.vertexPositions[parentIndex];
  var childPos = this.vertexPositions[vertexIndex];
  if (!parentPos || !childPos) {
    return -1;
  }

  var circleID = this.createHighlightCircleAtPosition(parentPos.x, parentPos.y);
  if (circleID === -1) {
    return -1;
  }

  var preferKey = this.edgeKey(parentIndex, vertexIndex);
  this.frontierHighlightIDs[vertexIndex] = circleID;
  if (!this.frontierHighlightStates) {
    this.frontierHighlightStates = {};
  }
  this.frontierHighlightStates[vertexIndex] = true;
  this.cmd("SetHighlight", circleID, 1);
  this.animateHighlightTraversal(circleID, parentIndex, vertexIndex, preferKey);
  return circleID;
};

DirectedBFS.prototype.releaseFrontierHighlight = function (vertexIndex, showStep) {
  if (!this.frontierHighlightIDs) {
    this.frontierHighlightIDs = {};
  }
  var circleID = this.frontierHighlightIDs[vertexIndex];
  if (typeof circleID === "undefined") {
    return -1;
  }

  this.deactivateFrontierHighlight(vertexIndex);

  delete this.frontierHighlightIDs[vertexIndex];
  if (this.frontierHighlightList) {
    for (var i = 0; i < this.frontierHighlightList.length; i++) {
      if (this.frontierHighlightList[i] === circleID) {
        this.frontierHighlightList.splice(i, 1);
        break;
      }
    }
  }
  if (this.frontierHighlightStates) {
    this.frontierHighlightStates[vertexIndex] = false;
  }

  if (showStep) {
    this.cmd("Step");
  }
  this.cmd("Delete", circleID);
  return circleID;
};

DirectedBFS.prototype.removeFrontierHighlight = function (vertexIndex) {
  return this.releaseFrontierHighlight(vertexIndex, false);
};

DirectedBFS.prototype.removeFrontierHighlightsForLevel = function (vertexList) {
  if (!vertexList || vertexList.length === 0) {
    return;
  }
  for (var i = 0; i < vertexList.length; i++) {
    this.releaseFrontierHighlight(vertexList[i], true);
  }
  vertexList.length = 0;
};

DirectedBFS.prototype.highlightCodeLine = function (lineIndex) {
  if (this.currentCodeLine >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[this.currentCodeLine][0],
      DirectedBFS.CODE_STANDARD_COLOR
    );
  }
  this.currentCodeLine = lineIndex;
  if (lineIndex >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[lineIndex][0],
      DirectedBFS.CODE_HIGHLIGHT_COLOR
    );
  }
};

DirectedBFS.prototype.clearTraversalState = function () {
  this.clearFrontierHighlights();
  this.resetLevelLegends();
  this.visited = new Array(this.vertexLabels.length);
  this.parentArr = new Array(this.vertexLabels.length);
  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.visited[i] = false;
    this.parentArr[i] = null;
    if (this.vertexLevelColors && i < this.vertexLevelColors.length) {
      this.vertexLevelColors[i] = null;
    }
    if (this.vertexEdgeColors && i < this.vertexEdgeColors.length) {
      this.vertexEdgeColors[i] = null;
    }
    this.cmd("SetText", this.visitedRectIDs[i], "F");
    this.cmd("SetBackgroundColor", this.visitedRectIDs[i], DirectedBFS.ARRAY_RECT_COLOR);
    this.cmd(
      "SetForegroundColor",
      this.visitedRectIDs[i],
      DirectedBFS.ARRAY_RECT_BORDER
    );
    this.cmd(
      "SetRectangleLineThickness",
      this.visitedRectIDs[i],
      DirectedBFS.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", this.visitedRectIDs[i], DirectedBFS.ARRAY_TEXT_COLOR);
    this.cmd("SetText", this.parentRectIDs[i], "-");
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[i],
      DirectedBFS.GRAPH_NODE_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[i],
      DirectedBFS.GRAPH_NODE_TEXT
    );
  }
  this.resetEdgeStates();
  this.clearEdgeHighlights();
  this.resetQueueArea();
};

DirectedBFS.prototype.resetLevelLegends = function () {
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

DirectedBFS.prototype.prepareLevelLegend = function (startIndex) {
  if (!this.levelLegendEntries) {
    this.levelLegendEntries = [];
  }

  var anchorY = null;
  if (
    this.vertexPositions &&
    startIndex >= 0 &&
    startIndex < this.vertexPositions.length &&
    this.vertexPositions[startIndex]
  ) {
    anchorY = this.vertexPositions[startIndex].y;
  }

  if (typeof anchorY !== "number") {
    anchorY = DirectedBFS.LEGEND_DEFAULT_BASE_Y;
  }

  this.levelLegendAnchorY = anchorY;
};

DirectedBFS.prototype.getLevelLegendY = function (depth) {
  var baseY =
    typeof this.levelLegendAnchorY === "number"
      ? this.levelLegendAnchorY
      : DirectedBFS.LEGEND_DEFAULT_BASE_Y;
  var offset = depth * (DirectedBFS.LEGEND_RECT_HEIGHT + DirectedBFS.LEGEND_SPACING);
  return baseY + offset;
};

DirectedBFS.prototype.ensureLevelLegendEntry = function (depth, color) {
  if (typeof depth !== "number" || depth < 0) {
    return;
  }

  if (!this.levelLegendEntries) {
    this.levelLegendEntries = [];
  }

  var entry = this.levelLegendEntries[depth];
  var fillColor =
    typeof color === "string" ? color : DirectedBFS.GRAPH_NODE_COLOR;

  if (!entry) {
    var rectID = this.nextIndex++;
    var y = this.getLevelLegendY(depth);
    var x = DirectedBFS.LEGEND_BASE_X;

    this.cmd(
      "CreateRectangle",
      rectID,
      "",
      DirectedBFS.LEGEND_RECT_WIDTH,
      DirectedBFS.LEGEND_RECT_HEIGHT,
      x,
      y
    );
    this.cmd("SetForegroundColor", rectID, DirectedBFS.GRAPH_NODE_BORDER);
    this.cmd("SetBackgroundColor", rectID, fillColor);

    var labelID = this.nextIndex++;
    var labelText = "Level " + depth;
    var labelX =
      x + DirectedBFS.LEGEND_RECT_WIDTH / 2 + DirectedBFS.LEGEND_TEXT_GAP;

    this.cmd("CreateLabel", labelID, labelText, labelX, y, 0);
    this.cmd("SetTextStyle", labelID, DirectedBFS.LEGEND_FONT);
    this.cmd("SetForegroundColor", labelID, DirectedBFS.LEGEND_TEXT_COLOR);

    entry = { rectID: rectID, labelID: labelID, color: fillColor };
    this.levelLegendEntries[depth] = entry;
    return;
  }

  if (typeof color === "string") {
    this.cmd("SetBackgroundColor", entry.rectID, fillColor);
    entry.color = fillColor;
  }
};

DirectedBFS.prototype.clearEdgeHighlights = function () {
  if (!this.edgePairs) {
    return;
  }
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    this.highlightEdge(edge.from, edge.to, false);
  }
};

DirectedBFS.prototype.edgeKey = function (from, to) {
  return from + "->" + to;
};

DirectedBFS.prototype.getEdgeCurve = function (from, to) {
  var key = this.edgeKey(from, to);
  if (
    this.edgeCurveOverrides &&
    Object.prototype.hasOwnProperty.call(this.edgeCurveOverrides, key)
  ) {
    return this.edgeCurveOverrides[key];
  }
  if (
    DirectedBFS.EDGE_CURVES[from] &&
    typeof DirectedBFS.EDGE_CURVES[from][to] === "number"
  ) {
    return DirectedBFS.EDGE_CURVES[from][to];
  }
  return 0;
};

DirectedBFS.prototype.updateEdgeBaseColor = function (from, to) {
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
  var baseColor = DirectedBFS.EDGE_COLOR;
  if (this.edgeStates[key] && this.edgeStates[key].tree) {
    baseColor =
      this.edgeStates[key].color || DirectedBFS.EDGE_VISITED_COLOR;
  }
  this.cmd("SetEdgeColor", this.vertexIDs[from], this.vertexIDs[to], baseColor);
};

DirectedBFS.prototype.setEdgeTreeState = function (from, to, isTree, color) {
  var key = this.edgeKey(from, to);
  if (!this.edgeStates[key]) {
    this.edgeStates[key] = { tree: false, color: null };
  }
  this.edgeStates[key].tree = isTree;
  if (isTree) {
    if (typeof color === "string") {
      this.edgeStates[key].color = color;
    }
  } else {
    this.edgeStates[key].color = null;
  }
  this.updateEdgeBaseColor(from, to);
};

DirectedBFS.prototype.resetEdgeStates = function () {
  if (!this.edgePairs) {
    return;
  }
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    var key = this.edgeKey(edge.from, edge.to);
    if (!this.edgeStates[key]) {
      this.edgeStates[key] = { tree: false, color: null };
    }
    this.edgeStates[key].tree = false;
    this.edgeStates[key].color = null;
    this.updateEdgeBaseColor(edge.from, edge.to);
    if (
      this.vertexIDs &&
      edge.from >= 0 &&
      edge.to >= 0 &&
      edge.from < this.vertexIDs.length &&
      edge.to < this.vertexIDs.length
    ) {
      var fromID = this.vertexIDs[edge.from];
      var toID = this.vertexIDs[edge.to];
      this.cmd("SetEdgeThickness", fromID, toID, DirectedBFS.EDGE_THICKNESS);
      this.cmd("SetEdgeHighlight", fromID, toID, 0);
    }
  }
};

DirectedBFS.prototype.getLevelColor = function (depth) {
  var palette = DirectedBFS.LEVEL_COLORS;
  if (!palette || palette.length === 0) {
    return DirectedBFS.GRAPH_NODE_VISITED_COLOR;
  }
  var index = depth % palette.length;
  return palette[index];
};

DirectedBFS.prototype.applyVertexLevelColor = function (vertexIndex, depth) {
  if (
    !this.vertexIDs ||
    vertexIndex < 0 ||
    vertexIndex >= this.vertexIDs.length
  ) {
    return DirectedBFS.GRAPH_NODE_VISITED_COLOR;
  }
  var color = this.getLevelColor(depth);
  if (this.vertexLevelColors && vertexIndex < this.vertexLevelColors.length) {
    this.vertexLevelColors[vertexIndex] = color;
  }
  var derivedEdgeColor = this.deriveEdgeColor(color);
  if (this.vertexEdgeColors && vertexIndex < this.vertexEdgeColors.length) {
    this.vertexEdgeColors[vertexIndex] = derivedEdgeColor;
  }
  this.cmd(
    "SetBackgroundColor",
    this.vertexIDs[vertexIndex],
    color
  );
  this.cmd(
    "SetTextColor",
    this.vertexIDs[vertexIndex],
    DirectedBFS.GRAPH_NODE_VISITED_TEXT_COLOR
  );
  return color;
};

DirectedBFS.prototype.getVertexEdgeColor = function (vertexIndex) {
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
    vertexIndex < this.vertexLevelColors.length
  ) {
    return this.deriveEdgeColor(this.vertexLevelColors[vertexIndex]);
  }
  return null;
};

DirectedBFS.prototype.deriveEdgeColor = function (nodeColor) {
  if (typeof nodeColor !== "string") {
    return DirectedBFS.EDGE_VISITED_COLOR;
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

DirectedBFS.prototype.parseHexColor = function (hex) {
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
  var num = parseInt(cleaned, 16);
  if (isNaN(num)) {
    return null;
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

DirectedBFS.prototype.rgbToHex = function (r, g, b) {
  var toHex = function (value) {
    var clamped = Math.max(0, Math.min(255, Math.round(value)));
    var hex = clamped.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
};

DirectedBFS.prototype.rgbToHsl = function (r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s;
  var l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
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

DirectedBFS.prototype.hslToRgb = function (h, s, l) {
  var hue2rgb = function (p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  var r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
};

DirectedBFS.prototype.highlightEdge = function (from, to, active) {
  if (
    !this.vertexIDs ||
    from < 0 ||
    to < 0 ||
    from >= this.vertexIDs.length ||
    to >= this.vertexIDs.length
  ) {
    return;
  }
  var fromID = this.vertexIDs[from];
  var toID = this.vertexIDs[to];
  if (active) {
    this.updateEdgeBaseColor(from, to);
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      DirectedBFS.EDGE_HIGHLIGHT_THICKNESS
    );
    this.cmd("SetEdgeHighlight", fromID, toID, 1);
  } else {
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    this.cmd("SetEdgeThickness", fromID, toID, DirectedBFS.EDGE_THICKNESS);
    this.updateEdgeBaseColor(from, to);
  }
};

DirectedBFS.prototype.animateHighlightTraversal = function (
  circleID,
  fromIndex,
  toIndex,
  preferKey
) {
  if (typeof circleID !== "number" || circleID < 0) {
    return;
  }
  if (fromIndex === toIndex) {
    return;
  }

  var startPos = this.vertexPositions[fromIndex];
  var endPos = this.vertexPositions[toIndex];
  if (!startPos || !endPos) {
    return;
  }
  var curve = 0;
  var hasCurve = false;

  if (typeof preferKey === "string") {
    var preferredMeta = this.edgeMeta[preferKey];
    if (preferredMeta) {
      curve = preferredMeta.curve;
      if (
        preferredMeta.from !== fromIndex ||
        preferredMeta.to !== toIndex
      ) {
        curve = -curve;
      }
      hasCurve = true;
    }
  }

  if (!hasCurve) {
    var key = this.edgeKey(fromIndex, toIndex);
    var meta = this.edgeMeta[key];
    if (meta) {
      curve = meta.curve;
      hasCurve = true;
    } else {
      var reverseMeta = this.edgeMeta[this.edgeKey(toIndex, fromIndex)];
      if (reverseMeta) {
        curve = -reverseMeta.curve;
        hasCurve = true;
      }
    }
  }

  if (Math.abs(curve) < 0.01) {
    this.cmd("Move", circleID, Math.round(endPos.x), Math.round(endPos.y));
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
    circleID,
    Math.round(controlX),
    Math.round(controlY),
    Math.round(endPos.x),
    Math.round(endPos.y)
  );
};

DirectedBFS.prototype.getStartFieldValue = function () {
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

  this.bfsTraversal(startIndex);

  this.highlightCodeLine(-1);

  return this.commands;
};

DirectedBFS.prototype.bfsTraversal = function (startIndex) {
  var queue = [];
  var vertexDepths = new Array(this.vertexLabels.length);

  this.prepareLevelLegend(startIndex);

  this.highlightCodeLine(0);
  this.cmd("Step");

  this.highlightCodeLine(1);
  this.cmd("Step");

  this.highlightCodeLine(2);
  this.setVisitedCellHighlight(startIndex, true);
  this.cmd("Step");
  if (!this.visited[startIndex]) {
    this.visited[startIndex] = true;
    this.cmd("SetText", this.visitedRectIDs[startIndex], "T");
    this.cmd(
      "SetBackgroundColor",
      this.visitedRectIDs[startIndex],
      DirectedBFS.ARRAY_VISITED_FILL
    );
    var startColor = this.applyVertexLevelColor(startIndex, 0);
    this.ensureLevelLegendEntry(0, startColor);
    this.cmd("Step");
  }
  this.setVisitedCellHighlight(startIndex, false);

  this.highlightCodeLine(3);
  this.cmd("SetText", this.parentRectIDs[startIndex], "-");
  this.cmd("Step");

  this.highlightCodeLine(4);
  queue.push(startIndex);
  vertexDepths[startIndex] = 0;
  this.enqueueQueueVertex(startIndex);
  this.activateFrontierHighlight(startIndex);
  this.cmd("Step");

  while (queue.length > 0) {
    this.highlightCodeLine(5);
    this.cmd("Step");

    this.highlightCodeLine(6);
    var u = queue[0];
    var uDepth = 0;
    if (typeof vertexDepths[u] === "number") {
      uDepth = vertexDepths[u];
    }
    this.cmd("Step");

    this.highlightCodeLine(7);
    queue.shift();
    this.dequeueQueueVertex();
    this.cmd("Step");

    this.highlightCodeLine(8);
    this.cmd("Step");

    var neighbors = this.adjacencyList[u];
    for (var i = 0; i < neighbors.length; i++) {
      var v = neighbors[i];

      this.highlightEdge(u, v, true);
      this.cmd("Step");

      this.highlightCodeLine(9);
      this.setVisitedCellHighlight(v, true);
      this.cmd("Step");

      if (!this.visited[v]) {
        this.highlightCodeLine(10);
        this.visited[v] = true;
        this.cmd("SetText", this.visitedRectIDs[v], "T");
        this.cmd(
          "SetBackgroundColor",
          this.visitedRectIDs[v],
          DirectedBFS.ARRAY_VISITED_FILL
        );
        var vDepth = uDepth + 1;
        vertexDepths[v] = vDepth;
        var levelColor = this.applyVertexLevelColor(v, vDepth);
        this.ensureLevelLegendEntry(vDepth, levelColor);
        this.cmd("Step");

        this.highlightCodeLine(11);
        this.parentArr[v] = u;
        this.cmd("SetText", this.parentRectIDs[v], this.vertexLabels[u]);
        var edgeColor = this.getVertexEdgeColor(v) || levelColor;
        this.setEdgeTreeState(u, v, true, edgeColor);
        this.cmd("Step");

        this.highlightCodeLine(12);
        queue.push(v);
        this.enqueueQueueVertex(v);
        this.createFrontierHighlightFromParent(u, v);
        this.cmd("Step");
      }

      this.highlightCodeLine(13);
      this.cmd("Step");

      this.setVisitedCellHighlight(v, false);
      this.highlightEdge(u, v, false);
      this.cmd("Step");

      this.highlightCodeLine(8);
      this.cmd("Step");
    }

    this.highlightCodeLine(14);
    this.cmd("Step");

    this.releaseFrontierHighlight(u, true);
  }

  this.highlightCodeLine(15);
  this.cmd("Step");

  this.highlightCodeLine(16);
  this.cmd("Step");
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
