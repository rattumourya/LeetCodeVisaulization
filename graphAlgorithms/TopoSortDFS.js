// Custom visualization for topological sorting using DFS on a directed acyclic graph
// with a 9:16 canvas layout inspired by the Directed DFS visualization.

function TopoSortDFS(am, w, h) {
  this.init(am, w, h);
}

TopoSortDFS.prototype = new Algorithm();
TopoSortDFS.prototype.constructor = TopoSortDFS;
TopoSortDFS.superclass = Algorithm.prototype;

TopoSortDFS.CANVAS_WIDTH = 900;
TopoSortDFS.CANVAS_HEIGHT = 1600;

TopoSortDFS.ROW1_HEIGHT = 240;
TopoSortDFS.ROW2_HEIGHT = 760;
TopoSortDFS.ROW3_HEIGHT =
  TopoSortDFS.CANVAS_HEIGHT - TopoSortDFS.ROW1_HEIGHT - TopoSortDFS.ROW2_HEIGHT;

TopoSortDFS.ROW1_CENTER_Y = TopoSortDFS.ROW1_HEIGHT / 2;
TopoSortDFS.ROW2_START_Y = TopoSortDFS.ROW1_HEIGHT;
TopoSortDFS.ROW3_START_Y =
  TopoSortDFS.ROW1_HEIGHT + TopoSortDFS.ROW2_HEIGHT;

TopoSortDFS.TITLE_Y = TopoSortDFS.ROW1_CENTER_Y - 40;
TopoSortDFS.START_INFO_Y = TopoSortDFS.ROW1_CENTER_Y + 40;

TopoSortDFS.GRAPH_AREA_CENTER_X = 360;
TopoSortDFS.GRAPH_NODE_RADIUS = 22;
TopoSortDFS.GRAPH_NODE_COLOR = "#e3f2fd";
TopoSortDFS.GRAPH_NODE_BORDER = "#0b3954";
TopoSortDFS.GRAPH_NODE_TEXT = "#003049";
TopoSortDFS.GRAPH_NODE_VISITED_COLOR = "#66bb6a";
TopoSortDFS.GRAPH_NODE_VISITED_TEXT_COLOR = "#0b3d1f";
TopoSortDFS.HIGHLIGHT_RADIUS = TopoSortDFS.GRAPH_NODE_RADIUS;
TopoSortDFS.EDGE_COLOR = "#4a4e69";
TopoSortDFS.EDGE_VISITED_COLOR = "#66bb6a";
TopoSortDFS.EDGE_THICKNESS = 3;
TopoSortDFS.EDGE_HIGHLIGHT_THICKNESS = TopoSortDFS.EDGE_THICKNESS;
TopoSortDFS.BIDIRECTIONAL_CURVE = 0.35;
TopoSortDFS.BIDIRECTIONAL_EXTRA_OFFSET = 0.12;
// Minimum curvature magnitude to keep opposite-direction edges visually parallel.
TopoSortDFS.MIN_PARALLEL_SEPARATION = 0.42;
TopoSortDFS.PARALLEL_EDGE_GAP = 0.18;
TopoSortDFS.CURVE_EPSILON = 0.01;
TopoSortDFS.CURVE_BASE_MAGNITUDE = 0.28;
TopoSortDFS.CURVE_INCREMENT = 0.14;
TopoSortDFS.ANGLE_BUCKET_SCALE = 16;

TopoSortDFS.ARRAY_BASE_X = 720;
TopoSortDFS.ARRAY_COLUMN_SPACING = 80;
TopoSortDFS.ARRAY_TOP_Y = TopoSortDFS.ROW2_START_Y + 70;
TopoSortDFS.ARRAY_CELL_HEIGHT = 52;
TopoSortDFS.ARRAY_CELL_WIDTH = 60;
TopoSortDFS.ARRAY_CELL_INNER_HEIGHT = 42;
TopoSortDFS.ARRAY_HEADER_HEIGHT = TopoSortDFS.ARRAY_CELL_INNER_HEIGHT;
TopoSortDFS.ARRAY_RECT_COLOR = "#f1f1f6";
TopoSortDFS.ARRAY_RECT_BORDER = "#2b2d42";
TopoSortDFS.ARRAY_RECT_HIGHLIGHT_BORDER = "#d62828";
TopoSortDFS.ARRAY_RECT_BORDER_THICKNESS = 1;
TopoSortDFS.ARRAY_RECT_HIGHLIGHT_THICKNESS = 3;
TopoSortDFS.ARRAY_TEXT_COLOR = "#2b2d42";
TopoSortDFS.ARRAY_VISITED_FILL = "#b3e5fc";
TopoSortDFS.ARRAY_HEADER_GAP = 20;
TopoSortDFS.ARRAY_HORIZONTAL_GAP = 80;
TopoSortDFS.CANVAS_SIDE_PADDING = 40;
TopoSortDFS.BOTTOM_PANEL_TOP_PADDING = 36;
TopoSortDFS.ORDER_LABEL_GAP = 8;
TopoSortDFS.ORDER_LABEL_BOTTOM_MARGIN = 4;
TopoSortDFS.ORDER_LABEL_FONT_SIZE = 22;
TopoSortDFS.ORDER_LABEL_FONT =
  "bold " + TopoSortDFS.ORDER_LABEL_FONT_SIZE;
TopoSortDFS.ORDER_CELL_WIDTH = 60;
TopoSortDFS.ORDER_CELL_HEIGHT = 48;
TopoSortDFS.ORDER_CELL_SPACING = 12;
TopoSortDFS.ORDER_RECT_COLOR = "#f8f9fa";
TopoSortDFS.ORDER_RECT_BORDER = "#1d3557";
TopoSortDFS.ORDER_RECT_TEXT_COLOR = "#1d3557";
TopoSortDFS.ORDER_RECT_HIGHLIGHT_BORDER = "#ffb703";
TopoSortDFS.ORDER_RECT_HIGHLIGHT_FILL = "#ffe8b6";
TopoSortDFS.BOTTOM_SECTION_GAP = 16;
TopoSortDFS.CODE_TOP_PADDING = 4;
TopoSortDFS.STACK_SECTION_RAISE = 28;
TopoSortDFS.STACK_ORDER_VERTICAL_GAP = 32;

TopoSortDFS.CODE_START_X = 80;
TopoSortDFS.CODE_LINE_HEIGHT = 30;
TopoSortDFS.CODE_STANDARD_COLOR = "#1d3557";
TopoSortDFS.CODE_HIGHLIGHT_COLOR = "#e63946";
TopoSortDFS.CODE_FONT = "bold 18";

TopoSortDFS.RECURSION_AREA_CENTER_X = 660;
TopoSortDFS.RECURSION_HEADER_HEIGHT = 44;
TopoSortDFS.RECURSION_LABEL_MARGIN = 14;
TopoSortDFS.RECURSION_AREA_BOTTOM_MARGIN = 30;
TopoSortDFS.RECURSION_FRAME_WIDTH = 320;
TopoSortDFS.RECURSION_FRAME_HEIGHT = 34;
TopoSortDFS.RECURSION_FRAME_MIN_HEIGHT = 22;
TopoSortDFS.RECURSION_FRAME_SPACING = 10;
TopoSortDFS.RECURSION_FRAME_MIN_SPACING = 6;
TopoSortDFS.RECURSION_RECT_COLOR = "#f8f9fa";
TopoSortDFS.RECURSION_RECT_BORDER = "#1d3557";
TopoSortDFS.RECURSION_RECT_ACTIVE_BORDER = "#e63946";
TopoSortDFS.RECURSION_TEXT_COLOR = "#1d3557";
TopoSortDFS.RECURSION_FONT = "bold 18";

TopoSortDFS.TITLE_COLOR = "#1d3557";
TopoSortDFS.START_INFO_COLOR = "#264653";
TopoSortDFS.HIGHLIGHT_COLOR = "#ff3b30";
TopoSortDFS.DEFAULT_STATUS_TEXT =
  "Vertices are added to the order when recursion unwinds.";

TopoSortDFS.GRAPH_MODE_SAMPLE = "sample";
TopoSortDFS.GRAPH_MODE_RANDOM = "random";
TopoSortDFS.RANDOM_VERTEX_COUNT = 7;

TopoSortDFS.SAMPLE_GRAPH = (function () {
  var topY = TopoSortDFS.ROW2_START_Y + 110;
  var middleY = topY + 180;
  var bottomY = middleY + 180;
  var leftX = TopoSortDFS.GRAPH_AREA_CENTER_X - 220;
  var centerX = TopoSortDFS.GRAPH_AREA_CENTER_X;
  var rightX = TopoSortDFS.GRAPH_AREA_CENTER_X + 220;
  var midLeftX = TopoSortDFS.GRAPH_AREA_CENTER_X - 90;
  var midRightX = TopoSortDFS.GRAPH_AREA_CENTER_X + 90;
  var bottomLeftX = TopoSortDFS.GRAPH_AREA_CENTER_X - 140;
  var bottomRightX = TopoSortDFS.GRAPH_AREA_CENTER_X + 140;

  return {
    vertexCount: 7,
    positions: [
      { x: leftX, y: topY },
      { x: centerX, y: topY },
      { x: rightX, y: topY },
      { x: midLeftX, y: middleY },
      { x: midRightX, y: middleY },
      { x: bottomLeftX, y: bottomY },
      { x: bottomRightX, y: bottomY }
    ],
    edges: [
      { from: 0, to: 3 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 6 }
    ]
  };
})();

TopoSortDFS.CODE_LINES = [
  ["private void dfs(int v, boolean[] visited, Stack<Integer> stack) {"],
  ["    visited[v] = true;"],
  ["    for (int neighbor : adj[v]) {"],
  ["        if (!visited[neighbor]) {"],
  ["            dfs(neighbor, visited, stack);"],
  ["        }"],
  ["    }"],
  ["    stack.push(v);"],
  ["}"],
  ["// Return topological sort as a List<Integer>"],
  ["List<Integer> topologicalSort() {"],
  ["    Stack<Integer> stack = new Stack<>();"],
  ["    boolean[] visited = new boolean[V];"],
  ["    for (int i = 0; i < V; i++) {"],
  ["        if (!visited[i]) {"],
  ["            dfs(i, visited, stack);"],
  ["        }"],
  ["    }"],
  ["    List<Integer> topoOrder = new ArrayList<>();"],
  ["    while (!stack.isEmpty()) {"],
  ["        topoOrder.add(stack.pop());"],
  ["    }"],
  ["    return topoOrder;"],
  ["}"]
];
TopoSortDFS.TEMPLATE_ALLOWED = [
  [false, true, true, false, true, false, false, true, false, false],
  [false, false, true, false, true, true, false, true, false, false],
  [false, false, false, true, false, true, true, false, true, false],
  [false, false, false, false, true, false, true, false, true, true],
  [false, false, false, false, false, true, true, true, true, true],
  [false, false, false, false, false, false, true, false, true, true],
  [false, false, false, false, false, false, false, true, true, true],
  [false, false, false, false, false, false, false, false, true, true],
  [false, false, false, false, false, false, false, false, false, true],
  [false, false, false, false, false, false, false, false, false, false]
];

TopoSortDFS.EDGE_CURVES = [
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

TopoSortDFS.prototype.init = function (am, w, h) {
  TopoSortDFS.superclass.init.call(this, am, w, h);

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
  this.finishRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.stackCellIDs = [];
  this.orderCellIDs = [];
  this.orderLabelIDs = [];
  this.stack = [];
  this.codeID = [];
  this.highlightCircleID = -1;
  this.currentCodeLine = -1;
  this.statusDisplayID = -1;
  this.recursionBackgroundID = -1;
  this.recursionHeaderID = -1;
  this.recursionFrameIDs = [];
  this.activeRecursionIndex = -1;
  this.recursionDepth = 0;
  this.bottomSectionTopY =
    TopoSortDFS.ROW3_START_Y + TopoSortDFS.BOTTOM_PANEL_TOP_PADDING;

  this.visited = [];
  this.finishOrder = [];
  this.topoOrder = [];
  this.finishCounter = 0;
  this.stackPointer = 0;
  this.nextOrderIndex = 0;

  this.graphMode = TopoSortDFS.GRAPH_MODE_RANDOM;

  this.implementAction(this.reset.bind(this), 0);
};

TopoSortDFS.prototype.addControls = function () {
  this.runButton = addControlToAlgorithmBar(
    "Button",
    "Run Topological Sort"
  );
  this.runButton.onclick = this.runCallback.bind(this);

  this.newGraphButton = addControlToAlgorithmBar("Button", "New DAG");
  this.newGraphButton.onclick = this.newGraphCallback.bind(this);

  this.controls.push(this.runButton, this.newGraphButton);
};

TopoSortDFS.prototype.reset = function () {
  this.nextIndex = 0;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  return this.setup();
};

TopoSortDFS.prototype.setup = function () {
  this.commands = [];

  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};
  this.edgeCurveOverrides = {};

  var vertexCount;
  if (this.graphMode === TopoSortDFS.GRAPH_MODE_RANDOM) {
    vertexCount = TopoSortDFS.RANDOM_VERTEX_COUNT;
  } else {
    vertexCount = TopoSortDFS.SAMPLE_GRAPH.vertexCount;
  }
  this.vertexLabels = this.createVertexLabels(vertexCount);
  if (this.graphMode === TopoSortDFS.GRAPH_MODE_RANDOM) {
    this.generateRandomGraph(vertexCount);
  } else {
    this.buildSampleGraph(vertexCount);
  }

  this.createTitleRow();
  this.createGraphArea();
  this.createArrayArea();
  this.createCodeDisplay();
  this.createRecursionArea();

  this.highlightCodeLine(-1);

  this.clearTraversalState();

  this.cmd("Step");
  return this.commands;
};

TopoSortDFS.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

TopoSortDFS.prototype.newGraphCallback = function () {
  this.graphMode = TopoSortDFS.GRAPH_MODE_RANDOM;
  this.implementAction(this.reset.bind(this), 0);
};

TopoSortDFS.prototype.createVertexLabels = function (count) {
  var labels = [];
  var limit = Math.min(count, 26);
  for (var i = 0; i < limit; i++) {
    labels.push(String.fromCharCode(65 + i));
  }
  return labels;
};

TopoSortDFS.prototype.generateRandomGraph = function (vertexCount) {
  this.vertexPositions = this.computeTemplateLayout(vertexCount);
  this.adjacencyList = new Array(vertexCount);
  this.edgeCurveOverrides = {};

  var allowed = TopoSortDFS.TEMPLATE_ALLOWED;

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
      TopoSortDFS.EDGE_CURVES[min] &&
      typeof TopoSortDFS.EDGE_CURVES[min][max] === "number"
    ) {
      return TopoSortDFS.EDGE_CURVES[min][max];
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
        magnitude = TopoSortDFS.BIDIRECTIONAL_CURVE;
        offsetIndex = idx - 1;
      } else {
        offsetIndex = idx;
      }
      var offset = TopoSortDFS.BIDIRECTIONAL_EXTRA_OFFSET * offsetIndex;
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
      var minParallel = TopoSortDFS.MIN_PARALLEL_SEPARATION;
      var magnitude = Math.abs(baseCurve);
      if (magnitude < minParallel) {
        magnitude = minParallel;
      }
      if (magnitude < 0.01) {
        magnitude = minParallel;
      }
      var forwardCurve = baseSign * magnitude;
      var backwardCurve = baseSign * (magnitude + TopoSortDFS.PARALLEL_EDGE_GAP);
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
        ? TopoSortDFS.BIDIRECTIONAL_CURVE
        : -TopoSortDFS.BIDIRECTIONAL_CURVE;
  }

  this.ensureEdgeSeparation(directedEdges);

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

TopoSortDFS.prototype.buildSampleGraph = function (vertexCount) {
  var sample = TopoSortDFS.SAMPLE_GRAPH;
  if (sample.positions && sample.positions.length >= vertexCount) {
    this.vertexPositions = sample.positions.slice(0, vertexCount);
  } else {
    this.vertexPositions = this.computeTemplateLayout(vertexCount);
  }
  this.adjacencyList = new Array(vertexCount);
  this.edgeCurveOverrides = {};

  for (var i = 0; i < vertexCount; i++) {
    this.adjacencyList[i] = [];
  }

  var edges = [];
  for (var e = 0; e < sample.edges.length; e++) {
    var edge = sample.edges[e];
    if (edge.from >= vertexCount || edge.to >= vertexCount) {
      continue;
    }
    edges.push({
      from: edge.from,
      to: edge.to,
      curve: 0
    });
  }

  this.ensureEdgeSeparation(edges);

  for (var idx = 0; idx < edges.length; idx++) {
    var finalEdge = edges[idx];
    this.adjacencyList[finalEdge.from].push(finalEdge.to);
    this.edgeCurveOverrides[this.edgeKey(finalEdge.from, finalEdge.to)] =
      finalEdge.curve;
  }
};

TopoSortDFS.prototype.ensureEdgeSeparation = function (edgeList) {
  if (!edgeList || edgeList.length === 0) {
    return;
  }

  var groups = {};
  for (var i = 0; i < edgeList.length; i++) {
    var edge = edgeList[i];
    if (!edge) {
      continue;
    }
    if (Math.abs(edge.curve) > TopoSortDFS.CURVE_EPSILON) {
      continue;
    }
    var fromPos = this.vertexPositions[edge.from];
    var toPos = this.vertexPositions[edge.to];
    if (!fromPos || !toPos) {
      continue;
    }
    var angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
    var bucketKey =
      edge.from + ":" + Math.round(angle * TopoSortDFS.ANGLE_BUCKET_SCALE);
    if (!groups[bucketKey]) {
      groups[bucketKey] = [];
    }
    groups[bucketKey].push({
      edge: edge,
      fromPos: fromPos,
      toPos: toPos
    });
  }

  for (var key in groups) {
    if (!Object.prototype.hasOwnProperty.call(groups, key)) {
      continue;
    }
    var bucketEdges = groups[key];
    if (bucketEdges.length <= 1) {
      continue;
    }

    bucketEdges.sort(function (a, b) {
      var dy = a.toPos.y - b.toPos.y;
      if (Math.abs(dy) > 1) {
        return dy;
      }
      return a.toPos.x - b.toPos.x;
    });

    var offsetPattern = [];
    if (bucketEdges.length % 2 === 1) {
      offsetPattern.push(0);
      for (var step = 1; step <= (bucketEdges.length - 1) / 2; step++) {
        offsetPattern.unshift(-step);
        offsetPattern.push(step);
      }
    } else {
      for (var half = 0; half < bucketEdges.length / 2; half++) {
        var offset = half + 0.5;
        offsetPattern.unshift(-offset);
        offsetPattern.push(offset);
      }
    }

    for (var idx = 0; idx < bucketEdges.length; idx++) {
      var entry = bucketEdges[idx];
      var dx = entry.toPos.x - entry.fromPos.x;
      var sign = dx >= 0 ? 1 : -1;
      if (Math.abs(dx) < 1) {
        sign =
          entry.fromPos.x <= TopoSortDFS.GRAPH_AREA_CENTER_X ? 1 : -1;
      }

      var offsetValue = offsetPattern[idx];
      var direction = offsetValue >= 0 ? 1 : -1;
      var magnitude =
        TopoSortDFS.CURVE_BASE_MAGNITUDE +
        Math.abs(offsetValue) * TopoSortDFS.CURVE_INCREMENT;

      entry.edge.curve = sign * direction * magnitude;
    }
  }
};

TopoSortDFS.prototype.computeTemplateLayout = function (vertexCount) {
  var layout = [];
  var baseX = 200;
  var stepX = 130;
  var baseY = TopoSortDFS.ROW2_START_Y + 120;
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

TopoSortDFS.prototype.createTitleRow = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "Topological Sort Using DFS",
    TopoSortDFS.CANVAS_WIDTH / 2,
    TopoSortDFS.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, TopoSortDFS.TITLE_COLOR);

  this.statusDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.statusDisplayID,
    TopoSortDFS.DEFAULT_STATUS_TEXT,
    TopoSortDFS.CANVAS_WIDTH / 2,
    TopoSortDFS.START_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.statusDisplayID, "bold 24");
  this.cmd("SetForegroundColor", this.statusDisplayID, TopoSortDFS.START_INFO_COLOR);
};

TopoSortDFS.prototype.createGraphArea = function () {
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
      TopoSortDFS.GRAPH_NODE_RADIUS
    );
    this.cmd("SetBackgroundColor", id, TopoSortDFS.GRAPH_NODE_COLOR);
    this.cmd("SetForegroundColor", id, TopoSortDFS.GRAPH_NODE_BORDER);
    this.cmd("SetTextColor", id, TopoSortDFS.GRAPH_NODE_TEXT);
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
        TopoSortDFS.EDGE_COLOR,
        curve,
        1,
        ""
      );
      this.cmd(
        "SetEdgeThickness",
        this.vertexIDs[from],
        this.vertexIDs[to],
        TopoSortDFS.EDGE_THICKNESS
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
    TopoSortDFS.HIGHLIGHT_COLOR,
    startPos.x,
    startPos.y,
    TopoSortDFS.HIGHLIGHT_RADIUS
  );
  this.cmd("SetAlpha", this.highlightCircleID, 0);
};

TopoSortDFS.prototype.createArrayArea = function () {
  var visitedHeaderID = this.nextIndex++;
  var stackHeaderID = this.nextIndex++;
  var headerY =
    TopoSortDFS.ARRAY_TOP_Y - TopoSortDFS.ARRAY_CELL_HEIGHT / 2 - TopoSortDFS.ARRAY_HEADER_GAP;

  this.cmd(
    "CreateLabel",
    visitedHeaderID,
    "Visited",
    TopoSortDFS.ARRAY_BASE_X,
    headerY
  );
  this.cmd("SetTextStyle", visitedHeaderID, "bold 20");
  this.cmd("SetForegroundColor", visitedHeaderID, TopoSortDFS.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    stackHeaderID,
    "Push #",
    TopoSortDFS.ARRAY_BASE_X + TopoSortDFS.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", stackHeaderID, "bold 20");
  this.cmd("SetForegroundColor", stackHeaderID, TopoSortDFS.CODE_STANDARD_COLOR);

  this.visitedRectIDs = new Array(this.vertexLabels.length);
  this.finishRectIDs = new Array(this.vertexLabels.length);
  this.vertexRowLabelIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rowY = TopoSortDFS.ARRAY_TOP_Y + i * TopoSortDFS.ARRAY_CELL_HEIGHT;

    var vertexLabelID = this.nextIndex++;
    this.vertexRowLabelIDs[i] = vertexLabelID;
    this.cmd(
      "CreateLabel",
      vertexLabelID,
      this.vertexLabels[i],
      TopoSortDFS.ARRAY_BASE_X - 58,
      rowY,
      0
    );
    this.cmd("SetTextStyle", vertexLabelID, "bold 20");
    this.cmd("SetForegroundColor", vertexLabelID, TopoSortDFS.START_INFO_COLOR);

    var visitedID = this.nextIndex++;
    this.visitedRectIDs[i] = visitedID;
    this.cmd(
      "CreateRectangle",
      visitedID,
      "F",
      TopoSortDFS.ARRAY_CELL_WIDTH,
      TopoSortDFS.ARRAY_CELL_INNER_HEIGHT,
      TopoSortDFS.ARRAY_BASE_X,
      rowY
    );
    this.cmd("SetForegroundColor", visitedID, TopoSortDFS.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", visitedID, TopoSortDFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", visitedID, TopoSortDFS.ARRAY_TEXT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      visitedID,
      TopoSortDFS.ARRAY_RECT_BORDER_THICKNESS
    );

    var finishID = this.nextIndex++;
    this.finishRectIDs[i] = finishID;
    this.cmd(
      "CreateRectangle",
      finishID,
      "-",
      TopoSortDFS.ARRAY_CELL_WIDTH,
      TopoSortDFS.ARRAY_CELL_INNER_HEIGHT,
      TopoSortDFS.ARRAY_BASE_X + TopoSortDFS.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", finishID, TopoSortDFS.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", finishID, TopoSortDFS.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", finishID, TopoSortDFS.ARRAY_TEXT_COLOR);
  }

  var lastRowIndex = this.vertexLabels.length - 1;
  if (lastRowIndex >= 0) {
    var lastCenterY =
      TopoSortDFS.ARRAY_TOP_Y + lastRowIndex * TopoSortDFS.ARRAY_CELL_HEIGHT;
    var arrayBottomY =
      lastCenterY + TopoSortDFS.ARRAY_CELL_INNER_HEIGHT / 2;
    this.bottomSectionTopY =
      arrayBottomY + TopoSortDFS.BOTTOM_SECTION_GAP;
  }

  this.createOrderArea();
};

TopoSortDFS.prototype.createOrderArea = function () {
  var count = this.vertexLabels.length;
  this.stackCellIDs = new Array(count);
  this.orderCellIDs = new Array(count);
  this.orderLabelIDs = [];

  var baseLabelY = this.bottomSectionTopY - TopoSortDFS.STACK_SECTION_RAISE;
  var stackLabelY = baseLabelY;
  var stackRowTop =
    stackLabelY +
    TopoSortDFS.ORDER_LABEL_FONT_SIZE +
    TopoSortDFS.ORDER_LABEL_BOTTOM_MARGIN +
    TopoSortDFS.ORDER_LABEL_GAP;
  var stackRowY = stackRowTop + TopoSortDFS.ORDER_CELL_HEIGHT / 2;

  var orderLabelY =
    stackRowTop +
    TopoSortDFS.ORDER_CELL_HEIGHT +
    TopoSortDFS.STACK_ORDER_VERTICAL_GAP;
  var orderRowTop =
    orderLabelY +
    TopoSortDFS.ORDER_LABEL_FONT_SIZE +
    TopoSortDFS.ORDER_LABEL_BOTTOM_MARGIN +
    TopoSortDFS.ORDER_LABEL_GAP;
  var orderRowY = orderRowTop + TopoSortDFS.ORDER_CELL_HEIGHT / 2;

  var arrayWidth =
    count > 0
      ? count * TopoSortDFS.ORDER_CELL_WIDTH +
        Math.max(0, count - 1) * TopoSortDFS.ORDER_CELL_SPACING
      : 0;
  var arrayStartX = TopoSortDFS.CODE_START_X;
  var labelCenterX = arrayStartX + arrayWidth / 2;

  var stackLabelID = this.nextIndex++;
  this.orderLabelIDs.push(stackLabelID);
  this.cmd(
    "CreateLabel",
    stackLabelID,
    "Stack (top on right)",
    labelCenterX,
    stackLabelY,
    0
  );
  this.cmd("SetTextStyle", stackLabelID, TopoSortDFS.ORDER_LABEL_FONT);
  this.cmd("SetForegroundColor", stackLabelID, TopoSortDFS.CODE_STANDARD_COLOR);

  if (count > 0) {
    for (var i = 0; i < count; i++) {
      var stackCellX =
        arrayStartX +
        i * (TopoSortDFS.ORDER_CELL_WIDTH + TopoSortDFS.ORDER_CELL_SPACING);
      var stackCellID = this.nextIndex++;
      this.stackCellIDs[i] = stackCellID;
      this.cmd(
        "CreateRectangle",
        stackCellID,
        "",
        TopoSortDFS.ORDER_CELL_WIDTH,
        TopoSortDFS.ORDER_CELL_HEIGHT,
        stackCellX,
        stackRowY,
        "center",
        "center"
      );
      this.cmd("SetForegroundColor", stackCellID, TopoSortDFS.ORDER_RECT_BORDER);
      this.cmd("SetBackgroundColor", stackCellID, TopoSortDFS.ORDER_RECT_COLOR);
      this.cmd("SetTextColor", stackCellID, TopoSortDFS.ORDER_RECT_TEXT_COLOR);
    }
  }

  var orderLabelID = this.nextIndex++;
  this.orderLabelIDs.push(orderLabelID);
  this.cmd(
    "CreateLabel",
    orderLabelID,
    "Topological Order",
    labelCenterX,
    orderLabelY,
    0
  );
  this.cmd("SetTextStyle", orderLabelID, TopoSortDFS.ORDER_LABEL_FONT);
  this.cmd("SetForegroundColor", orderLabelID, TopoSortDFS.CODE_STANDARD_COLOR);

  if (count > 0) {
    for (var j = 0; j < count; j++) {
      var orderCellX =
        arrayStartX +
        j * (TopoSortDFS.ORDER_CELL_WIDTH + TopoSortDFS.ORDER_CELL_SPACING);
      var orderCellID = this.nextIndex++;
      this.orderCellIDs[j] = orderCellID;
      this.cmd(
        "CreateRectangle",
        orderCellID,
        "",
        TopoSortDFS.ORDER_CELL_WIDTH,
        TopoSortDFS.ORDER_CELL_HEIGHT,
        orderCellX,
        orderRowY,
        "center",
        "center"
      );
      this.cmd("SetForegroundColor", orderCellID, TopoSortDFS.ORDER_RECT_BORDER);
      this.cmd("SetBackgroundColor", orderCellID, TopoSortDFS.ORDER_RECT_COLOR);
      this.cmd("SetTextColor", orderCellID, TopoSortDFS.ORDER_RECT_TEXT_COLOR);
    }
  }

  this.bottomSectionTopY =
    orderRowTop + TopoSortDFS.ORDER_CELL_HEIGHT + TopoSortDFS.BOTTOM_SECTION_GAP;
  this.stack = [];
  this.stackPointer = 0;
  this.topoOrder = [];
  this.nextOrderIndex = 0;
};

TopoSortDFS.prototype.setVisitedCellHighlight = function (index, active) {
  if (index < 0 || index >= this.visitedRectIDs.length) {
    return;
  }
  var color = active
    ? TopoSortDFS.ARRAY_RECT_HIGHLIGHT_BORDER
    : TopoSortDFS.ARRAY_RECT_BORDER;
  var thickness = active
    ? TopoSortDFS.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : TopoSortDFS.ARRAY_RECT_BORDER_THICKNESS;
  var rectID = this.visitedRectIDs[index];
  this.cmd("SetForegroundColor", rectID, color);
  this.cmd("SetRectangleLineThickness", rectID, thickness);
};

TopoSortDFS.prototype.createCodeDisplay = function () {
  var startY = this.bottomSectionTopY + TopoSortDFS.CODE_TOP_PADDING;
  this.codeID = this.addCodeToCanvasBase(
    TopoSortDFS.CODE_LINES,
    TopoSortDFS.CODE_START_X,
    startY,
    TopoSortDFS.CODE_LINE_HEIGHT,
    TopoSortDFS.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], TopoSortDFS.CODE_FONT);
    }
  }
};

TopoSortDFS.prototype.computeRecursionLayout = function (frameCount) {
  var layout = {
    height: TopoSortDFS.RECURSION_FRAME_HEIGHT,
    spacing: TopoSortDFS.RECURSION_FRAME_SPACING,
    startY:
      this.bottomSectionTopY +
      TopoSortDFS.RECURSION_HEADER_HEIGHT +
      TopoSortDFS.RECURSION_LABEL_MARGIN +
      TopoSortDFS.RECURSION_FRAME_HEIGHT / 2
  };

  if (frameCount <= 0) {
    return layout;
  }

  var availableHeight =
    TopoSortDFS.CANVAS_HEIGHT -
    (this.bottomSectionTopY +
      TopoSortDFS.RECURSION_HEADER_HEIGHT +
      TopoSortDFS.RECURSION_LABEL_MARGIN +
      TopoSortDFS.RECURSION_AREA_BOTTOM_MARGIN);

  if (availableHeight <= 0) {
    return layout;
  }

  var spacing = frameCount === 1 ? 0 : layout.spacing;
  var height = Math.min(
    TopoSortDFS.RECURSION_FRAME_HEIGHT,
    Math.max(
      TopoSortDFS.RECURSION_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    )
  );

  var totalHeight = height * frameCount + spacing * (frameCount - 1);
  if (totalHeight > availableHeight) {
    spacing = Math.max(
      TopoSortDFS.RECURSION_FRAME_MIN_SPACING,
      Math.floor(
        (availableHeight - height * frameCount) / Math.max(1, frameCount - 1)
      )
    );
    if (spacing < 0) {
      spacing = 0;
    }
    height = Math.max(
      TopoSortDFS.RECURSION_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    );
  }

  layout.height = height;
  layout.spacing = spacing;
  layout.startY =
    this.bottomSectionTopY +
    TopoSortDFS.RECURSION_HEADER_HEIGHT +
    TopoSortDFS.RECURSION_LABEL_MARGIN +
    height / 2;

  return layout;
};

TopoSortDFS.prototype.createRecursionArea = function () {
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
    TopoSortDFS.RECURSION_AREA_CENTER_X,
    this.bottomSectionTopY + TopoSortDFS.RECURSION_HEADER_HEIGHT / 2,
    0
  );
  this.cmd(
    "SetForegroundColor",
    this.recursionHeaderID,
    TopoSortDFS.CODE_STANDARD_COLOR
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
      TopoSortDFS.RECURSION_FRAME_WIDTH,
      layout.height,
      TopoSortDFS.RECURSION_AREA_CENTER_X,
      y
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      TopoSortDFS.RECURSION_RECT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, TopoSortDFS.RECURSION_RECT_BORDER);
    this.cmd("SetAlpha", rectID, 0);
    this.cmd("SetTextColor", rectID, TopoSortDFS.RECURSION_TEXT_COLOR);
    this.cmd("SetTextStyle", rectID, TopoSortDFS.RECURSION_FONT);

    this.recursionFrameIDs.push(rectID);

    y += layout.height + layout.spacing;
  }
};

TopoSortDFS.prototype.resetRecursionArea = function () {
  this.recursionDepth = 0;
  this.activeRecursionIndex = -1;
  for (var i = 0; i < this.recursionFrameIDs.length; i++) {
    this.cmd("SetAlpha", this.recursionFrameIDs[i], 0);
    this.cmd("SetText", this.recursionFrameIDs[i], "");
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[i],
      TopoSortDFS.RECURSION_RECT_BORDER
    );
  }
};

TopoSortDFS.prototype.pushRecursionFrame = function (vertex) {
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
      TopoSortDFS.RECURSION_RECT_BORDER
    );
  }

  var frameID = this.recursionFrameIDs[this.recursionDepth];
  var text = "dfs(" + this.vertexLabels[vertex] + ", visited, stack)";
  this.cmd("SetText", frameID, text);
  this.cmd("SetAlpha", frameID, 1);
  this.cmd(
    "SetForegroundColor",
    frameID,
    TopoSortDFS.RECURSION_RECT_ACTIVE_BORDER
  );

  this.activeRecursionIndex = this.recursionDepth;
  this.recursionDepth++;
};

TopoSortDFS.prototype.popRecursionFrame = function () {
  if (this.recursionDepth <= 0) {
    return;
  }

  this.recursionDepth--;
  var frameID = this.recursionFrameIDs[this.recursionDepth];
  this.cmd("SetAlpha", frameID, 0);
  this.cmd("SetText", frameID, "");
  this.cmd("SetForegroundColor", frameID, TopoSortDFS.RECURSION_RECT_BORDER);

  this.activeRecursionIndex = this.recursionDepth - 1;
  if (this.activeRecursionIndex >= 0 && this.activeRecursionIndex < this.recursionFrameIDs.length) {
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[this.activeRecursionIndex],
      TopoSortDFS.RECURSION_RECT_ACTIVE_BORDER
    );
  }
};

TopoSortDFS.prototype.highlightCodeLine = function (lineIndex) {
  if (this.currentCodeLine >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[this.currentCodeLine][0],
      TopoSortDFS.CODE_STANDARD_COLOR
    );
  }
  this.currentCodeLine = lineIndex;
  if (lineIndex >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[lineIndex][0],
      TopoSortDFS.CODE_HIGHLIGHT_COLOR
    );
  }
};

TopoSortDFS.prototype.clearTraversalState = function () {
  var count = this.vertexLabels.length;
  this.visited = new Array(count);
  this.finishOrder = new Array(count);
  this.topoOrder = [];
  this.finishCounter = 0;
  this.stack = [];
  this.stackPointer = 0;
  this.nextOrderIndex = 0;

  for (var i = 0; i < count; i++) {
    this.visited[i] = false;
    this.finishOrder[i] = null;
    if (this.visitedRectIDs[i] !== undefined) {
      this.cmd("SetText", this.visitedRectIDs[i], "F");
      this.cmd(
        "SetBackgroundColor",
        this.visitedRectIDs[i],
        TopoSortDFS.ARRAY_RECT_COLOR
      );
      this.cmd(
        "SetForegroundColor",
        this.visitedRectIDs[i],
        TopoSortDFS.ARRAY_RECT_BORDER
      );
      this.cmd(
        "SetRectangleLineThickness",
        this.visitedRectIDs[i],
        TopoSortDFS.ARRAY_RECT_BORDER_THICKNESS
      );
      this.cmd(
        "SetTextColor",
        this.visitedRectIDs[i],
        TopoSortDFS.ARRAY_TEXT_COLOR
      );
    }
    if (this.finishRectIDs[i] !== undefined) {
      this.cmd("SetText", this.finishRectIDs[i], "-");
      this.cmd(
        "SetBackgroundColor",
        this.finishRectIDs[i],
        TopoSortDFS.ARRAY_RECT_COLOR
      );
      this.cmd(
        "SetForegroundColor",
        this.finishRectIDs[i],
        TopoSortDFS.ARRAY_RECT_BORDER
      );
      this.cmd(
        "SetTextColor",
        this.finishRectIDs[i],
        TopoSortDFS.ARRAY_TEXT_COLOR
      );
    }
    if (this.vertexIDs[i] !== undefined) {
      this.cmd(
        "SetBackgroundColor",
        this.vertexIDs[i],
        TopoSortDFS.GRAPH_NODE_COLOR
      );
      this.cmd(
        "SetTextColor",
        this.vertexIDs[i],
        TopoSortDFS.GRAPH_NODE_TEXT
      );
    }
  }

  for (var k = 0; k < this.stackCellIDs.length; k++) {
    var stackCellID = this.stackCellIDs[k];
    this.cmd("SetText", stackCellID, "");
    this.cmd("SetBackgroundColor", stackCellID, TopoSortDFS.ORDER_RECT_COLOR);
    this.cmd("SetForegroundColor", stackCellID, TopoSortDFS.ORDER_RECT_BORDER);
  }

  for (var j = 0; j < this.orderCellIDs.length; j++) {
    var cellID = this.orderCellIDs[j];
    this.cmd("SetText", cellID, "");
    this.cmd("SetBackgroundColor", cellID, TopoSortDFS.ORDER_RECT_COLOR);
    this.cmd("SetForegroundColor", cellID, TopoSortDFS.ORDER_RECT_BORDER);
  }

  if (this.statusDisplayID >= 0) {
    this.cmd("SetText", this.statusDisplayID, TopoSortDFS.DEFAULT_STATUS_TEXT);
  }

  this.resetEdgeStates();
  this.clearEdgeHighlights();
  this.resetRecursionArea();
  if (this.highlightCircleID >= 0) {
    this.cmd("SetAlpha", this.highlightCircleID, 0);
  }
};

TopoSortDFS.prototype.recordFinish = function (vertex) {
  if (
    vertex < 0 ||
    vertex >= this.vertexLabels.length ||
    !this.finishRectIDs ||
    vertex >= this.finishRectIDs.length
  ) {
    return;
  }

  this.finishCounter++;
  this.finishOrder[vertex] = this.finishCounter;
  var finishID = this.finishRectIDs[vertex];
  this.cmd("SetText", finishID, String(this.finishCounter));
  this.cmd(
    "SetBackgroundColor",
    finishID,
    TopoSortDFS.ORDER_RECT_HIGHLIGHT_FILL
  );
  this.cmd(
    "SetForegroundColor",
    finishID,
    TopoSortDFS.ORDER_RECT_BORDER
  );
  this.cmd("Step");

  var label = this.vertexLabels[vertex];
  if (this.statusDisplayID >= 0) {
    this.cmd(
      "SetText",
      this.statusDisplayID,
      "Finished " + label + " (finish #" + this.finishCounter + ")"
    );
  }

  this.pushToStack(vertex, label);
};

TopoSortDFS.prototype.pushToStack = function (vertex, label) {
  if (
    !this.stackCellIDs ||
    this.stackPointer < 0 ||
    this.stackPointer >= this.stackCellIDs.length
  ) {
    return;
  }

  var cellID = this.stackCellIDs[this.stackPointer];
  var displayLabel = label != null ? label : this.vertexLabels[vertex];
  if (this.statusDisplayID >= 0) {
    this.cmd(
      "SetText",
      this.statusDisplayID,
      "Push " + displayLabel + " onto stack"
    );
  }
  this.stack[this.stackPointer] = vertex;
  this.cmd("SetText", cellID, displayLabel);
  this.cmd(
    "SetBackgroundColor",
    cellID,
    TopoSortDFS.ORDER_RECT_HIGHLIGHT_FILL
  );
  this.cmd(
    "SetForegroundColor",
    cellID,
    TopoSortDFS.ORDER_RECT_HIGHLIGHT_BORDER
  );
  this.cmd("Step");
  this.cmd("SetForegroundColor", cellID, TopoSortDFS.ORDER_RECT_BORDER);
  this.stackPointer++;
};

TopoSortDFS.prototype.popStackToOrder = function () {
  if (
    !this.stackCellIDs ||
    !this.orderCellIDs ||
    this.stackPointer <= 0
  ) {
    return null;
  }

  this.stackPointer--;
  var vertex = this.stack[this.stackPointer];
  if (vertex === undefined || vertex === null) {
    this.stack[this.stackPointer] = undefined;
    return null;
  }
  var label = this.vertexLabels[vertex];
  var stackCellID = this.stackCellIDs[this.stackPointer];

  this.cmd(
    "SetForegroundColor",
    stackCellID,
    TopoSortDFS.ORDER_RECT_HIGHLIGHT_BORDER
  );
  this.cmd(
    "SetBackgroundColor",
    stackCellID,
    TopoSortDFS.ORDER_RECT_HIGHLIGHT_FILL
  );
  this.cmd("Step");

  this.cmd("SetText", stackCellID, "");
  this.cmd("SetBackgroundColor", stackCellID, TopoSortDFS.ORDER_RECT_COLOR);
  this.cmd("SetForegroundColor", stackCellID, TopoSortDFS.ORDER_RECT_BORDER);
  this.stack[this.stackPointer] = undefined;

  if (this.nextOrderIndex >= 0 && this.nextOrderIndex < this.orderCellIDs.length) {
    var orderCellID = this.orderCellIDs[this.nextOrderIndex];
    this.topoOrder[this.nextOrderIndex] = vertex;
    this.cmd("SetText", orderCellID, label);
    this.cmd(
      "SetBackgroundColor",
      orderCellID,
      TopoSortDFS.ORDER_RECT_HIGHLIGHT_FILL
    );
    this.cmd(
      "SetForegroundColor",
      orderCellID,
      TopoSortDFS.ORDER_RECT_HIGHLIGHT_BORDER
    );
    this.cmd("Step");
    this.cmd("SetForegroundColor", orderCellID, TopoSortDFS.ORDER_RECT_BORDER);
    this.nextOrderIndex++;
  }

  this.stack.length = this.stackPointer;
  return vertex;
};

TopoSortDFS.prototype.clearEdgeHighlights = function () {
  if (!this.edgePairs) {
    return;
  }
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    this.highlightEdge(edge.from, edge.to, false);
  }
};

TopoSortDFS.prototype.edgeKey = function (from, to) {
  return from + "->" + to;
};

TopoSortDFS.prototype.getEdgeCurve = function (from, to) {
  var key = this.edgeKey(from, to);
  if (
    this.edgeCurveOverrides &&
    Object.prototype.hasOwnProperty.call(this.edgeCurveOverrides, key)
  ) {
    return this.edgeCurveOverrides[key];
  }
  if (
    TopoSortDFS.EDGE_CURVES[from] &&
    typeof TopoSortDFS.EDGE_CURVES[from][to] === "number"
  ) {
    return TopoSortDFS.EDGE_CURVES[from][to];
  }
  return 0;
};

TopoSortDFS.prototype.updateEdgeBaseColor = function (from, to) {
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
  var baseColor = TopoSortDFS.EDGE_COLOR;
  if (this.edgeStates[key] && this.edgeStates[key].tree) {
    baseColor = TopoSortDFS.EDGE_VISITED_COLOR;
  }
  this.cmd("SetEdgeColor", this.vertexIDs[from], this.vertexIDs[to], baseColor);
};

TopoSortDFS.prototype.setEdgeTreeState = function (from, to, isTree) {
  var key = this.edgeKey(from, to);
  if (!this.edgeStates[key]) {
    this.edgeStates[key] = {};
  }
  this.edgeStates[key].tree = isTree;
  this.updateEdgeBaseColor(from, to);
};

TopoSortDFS.prototype.resetEdgeStates = function () {
  if (!this.edgePairs) {
    return;
  }
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    var key = this.edgeKey(edge.from, edge.to);
    if (!this.edgeStates[key]) {
      this.edgeStates[key] = { tree: false };
    }
    this.edgeStates[key].tree = false;
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
      this.cmd("SetEdgeThickness", fromID, toID, TopoSortDFS.EDGE_THICKNESS);
      this.cmd("SetEdgeHighlight", fromID, toID, 0);
    }
  }
};

TopoSortDFS.prototype.highlightEdge = function (from, to, active) {
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
      TopoSortDFS.EDGE_HIGHLIGHT_THICKNESS
    );
    this.cmd("SetEdgeHighlight", fromID, toID, 1);
  } else {
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    this.cmd("SetEdgeThickness", fromID, toID, TopoSortDFS.EDGE_THICKNESS);
    this.updateEdgeBaseColor(from, to);
  }
};

TopoSortDFS.prototype.animateHighlightTraversal = function (
  fromIndex,
  toIndex,
  preferKey
) {
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

TopoSortDFS.prototype.runCallback = function () {
  this.implementAction(this.runTopologicalSort.bind(this), 0);
};

TopoSortDFS.prototype.runTopologicalSort = function () {
  this.commands = [];

  if (!this.vertexLabels || this.vertexLabels.length === 0) {
    return this.commands;
  }

  this.clearTraversalState();
  this.disableUI();

  this.highlightCodeLine(10);
  this.cmd("Step");

  this.highlightCodeLine(11);
  this.cmd("Step");

  this.highlightCodeLine(12);
  this.cmd("Step");

  var count = this.vertexLabels.length;
  for (var u = 0; u < count; u++) {
    this.highlightCodeLine(13);
    this.cmd("Step");

    this.highlightCodeLine(14);
    this.cmd("Step");

    if (!this.visited[u]) {
      this.cmd(
        "SetText",
        this.statusDisplayID,
        "Starting DFS from " + this.vertexLabels[u]
      );
      var pos = this.vertexPositions[u];
      this.cmd("SetAlpha", this.highlightCircleID, 1);
      this.cmd("Move", this.highlightCircleID, pos.x, pos.y);
      this.cmd("Step");

      this.highlightCodeLine(15);
      this.cmd("Step");

      this.dfsVisit(u);

      this.cmd("SetAlpha", this.highlightCircleID, 0);
    }

    this.highlightCodeLine(16);
    this.cmd("Step");
  }

  this.highlightCodeLine(17);
  this.cmd("Step");

  this.highlightCodeLine(18);
  this.cmd("Step");

  this.highlightCodeLine(19);
  this.cmd("Step");

  if (this.stackPointer > 0 && this.statusDisplayID >= 0) {
    this.cmd(
      "SetText",
      this.statusDisplayID,
      "Pop vertices from stack to build order"
    );
  }

  while (this.stackPointer > 0) {
    this.highlightCodeLine(20);
    this.cmd("Step");

    var popped = this.popStackToOrder();
    if (popped !== null && this.statusDisplayID >= 0) {
      this.cmd(
        "SetText",
        this.statusDisplayID,
        "Pop " + this.vertexLabels[popped] + " to output"
      );
    }

    this.highlightCodeLine(21);
    this.cmd("Step");

    this.highlightCodeLine(19);
    this.cmd("Step");
  }

  this.highlightCodeLine(22);
  this.cmd("Step");

  this.highlightCodeLine(23);
  this.cmd("Step");

  this.highlightCodeLine(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);
  this.cmd("SetText", this.statusDisplayID, "Topological order ready.");
  this.enableUI();

  return this.commands;
};

TopoSortDFS.prototype.dfsVisit = function (u) {
  this.pushRecursionFrame(u);
  this.cmd("Step");

  this.highlightCodeLine(0);
  this.cmd("Step");

  this.highlightCodeLine(1);
  this.setVisitedCellHighlight(u, true);
  this.cmd("Step");

  if (!this.visited[u]) {
    this.visited[u] = true;
    this.cmd("SetText", this.visitedRectIDs[u], "T");
    this.cmd(
      "SetBackgroundColor",
      this.visitedRectIDs[u],
      TopoSortDFS.ARRAY_VISITED_FILL
    );
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[u],
      TopoSortDFS.GRAPH_NODE_VISITED_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[u],
      TopoSortDFS.GRAPH_NODE_VISITED_TEXT_COLOR
    );
    this.cmd("Step");
  }
  this.setVisitedCellHighlight(u, false);

  this.highlightCodeLine(2);
  this.cmd("Step");

  var neighbors = this.adjacencyList[u];
  for (var i = 0; i < neighbors.length; i++) {
    var v = neighbors[i];
    this.highlightCodeLine(3);
    if (this.statusDisplayID >= 0) {
      this.cmd(
        "SetText",
        this.statusDisplayID,
        "Checking edge " + this.vertexLabels[u] + " → " + this.vertexLabels[v]
      );
    }
    this.highlightEdge(u, v, true);
    this.cmd("Step");

    this.setVisitedCellHighlight(v, true);
    this.cmd("Step");

    if (!this.visited[v]) {
      this.highlightCodeLine(4);
      this.cmd("Step");
      this.setEdgeTreeState(u, v, true);
      if (this.statusDisplayID >= 0) {
        this.cmd(
          "SetText",
          this.statusDisplayID,
          "Tree edge " + this.vertexLabels[u] + " → " + this.vertexLabels[v]
        );
      }

      this.highlightCodeLine(5);
      this.animateHighlightTraversal(u, v, this.edgeKey(u, v));

      this.dfsVisit(v);

      this.animateHighlightTraversal(v, u, this.edgeKey(u, v));
    } else if (this.statusDisplayID >= 0) {
      this.cmd(
        "SetText",
        this.statusDisplayID,
        this.vertexLabels[v] + " already visited — skip."
      );
    }

    this.setVisitedCellHighlight(v, false);

    this.highlightCodeLine(6);
    this.cmd("Step");

    this.highlightEdge(u, v, false);

    this.highlightCodeLine(2);
    this.cmd("Step");
  }

  this.highlightCodeLine(7);
  this.cmd("Step");
  this.recordFinish(u);
  this.highlightCodeLine(8);
  this.cmd("Step");
  this.popRecursionFrame();
};

TopoSortDFS.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

TopoSortDFS.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new TopoSortDFS(animManag, canvas.width, canvas.height);
}
