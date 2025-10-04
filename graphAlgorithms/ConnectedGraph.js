// Custom visualization for connected components on an undirected graph using a 9:16 canvas.

function ConnectedGraph(am, w, h) {
  this.init(am, w, h);
}

ConnectedGraph.prototype = new Algorithm();
ConnectedGraph.prototype.constructor = ConnectedGraph;
ConnectedGraph.superclass = Algorithm.prototype;

ConnectedGraph.CANVAS_WIDTH = 900;
ConnectedGraph.CANVAS_HEIGHT = 1600;

ConnectedGraph.ROW1_HEIGHT = 240;
ConnectedGraph.ROW2_HEIGHT = 760;
ConnectedGraph.ROW3_HEIGHT =
  ConnectedGraph.CANVAS_HEIGHT - ConnectedGraph.ROW1_HEIGHT - ConnectedGraph.ROW2_HEIGHT;

ConnectedGraph.ROW1_CENTER_Y = ConnectedGraph.ROW1_HEIGHT / 2;
ConnectedGraph.ROW2_START_Y = ConnectedGraph.ROW1_HEIGHT;
ConnectedGraph.ROW3_START_Y =
  ConnectedGraph.ROW1_HEIGHT + ConnectedGraph.ROW2_HEIGHT;

ConnectedGraph.TITLE_Y = ConnectedGraph.ROW1_CENTER_Y - 40;
ConnectedGraph.START_INFO_Y = ConnectedGraph.ROW1_CENTER_Y + 40;

ConnectedGraph.GRAPH_AREA_CENTER_X = 360;
ConnectedGraph.GRAPH_NODE_RADIUS = 22;
ConnectedGraph.GRAPH_NODE_COLOR = "#e3f2fd";
ConnectedGraph.GRAPH_NODE_BORDER = "#0b3954";
ConnectedGraph.GRAPH_NODE_TEXT = "#003049";
ConnectedGraph.GRAPH_NODE_VISITED_COLOR = "#66bb6a";
ConnectedGraph.GRAPH_NODE_VISITED_TEXT_COLOR = "#0b3d1f";
ConnectedGraph.HIGHLIGHT_RADIUS = ConnectedGraph.GRAPH_NODE_RADIUS;
ConnectedGraph.EDGE_COLOR = "#4a4e69";
ConnectedGraph.EDGE_VISITED_COLOR = "#66bb6a";
ConnectedGraph.EDGE_THICKNESS = 3;
ConnectedGraph.EDGE_HIGHLIGHT_THICKNESS = ConnectedGraph.EDGE_THICKNESS;
ConnectedGraph.BIDIRECTIONAL_CURVE = 0.35;
ConnectedGraph.BIDIRECTIONAL_EXTRA_OFFSET = 0.12;
// Minimum curvature magnitude to keep opposite-direction edges visually parallel.
ConnectedGraph.MIN_PARALLEL_SEPARATION = 0.42;
ConnectedGraph.PARALLEL_EDGE_GAP = 0.18;

ConnectedGraph.ARRAY_BASE_X = 720;
ConnectedGraph.ARRAY_COLUMN_SPACING = 80;
ConnectedGraph.ARRAY_TOP_Y = ConnectedGraph.ROW2_START_Y + 90;
ConnectedGraph.ARRAY_CELL_HEIGHT = 52;
ConnectedGraph.ARRAY_CELL_WIDTH = 60;
ConnectedGraph.ARRAY_CELL_INNER_HEIGHT = 42;
ConnectedGraph.ARRAY_HEADER_HEIGHT = ConnectedGraph.ARRAY_CELL_INNER_HEIGHT;
ConnectedGraph.ARRAY_RECT_COLOR = "#f1f1f6";
ConnectedGraph.ARRAY_RECT_BORDER = "#2b2d42";
ConnectedGraph.ARRAY_RECT_HIGHLIGHT_BORDER = "#d62828";
ConnectedGraph.ARRAY_RECT_BORDER_THICKNESS = 1;
ConnectedGraph.ARRAY_RECT_HIGHLIGHT_THICKNESS = 3;
ConnectedGraph.ARRAY_TEXT_COLOR = "#2b2d42";
ConnectedGraph.ARRAY_VISITED_FILL = "#b3e5fc";
ConnectedGraph.ARRAY_HEADER_GAP = 20;
ConnectedGraph.BOTTOM_SECTION_GAP = 56;
ConnectedGraph.CODE_TOP_PADDING = 12;

ConnectedGraph.CODE_START_X = 120;
ConnectedGraph.CODE_LINE_HEIGHT = 32;
ConnectedGraph.CODE_STANDARD_COLOR = "#1d3557";
ConnectedGraph.CODE_HIGHLIGHT_COLOR = "#e63946";
ConnectedGraph.CODE_FONT = "bold 22";

ConnectedGraph.RECURSION_AREA_CENTER_X = 660;
ConnectedGraph.RECURSION_HEADER_HEIGHT = 44;
ConnectedGraph.RECURSION_LABEL_MARGIN = 14;
ConnectedGraph.RECURSION_AREA_BOTTOM_MARGIN = 30;
ConnectedGraph.RECURSION_FRAME_WIDTH = 320;
ConnectedGraph.RECURSION_FRAME_HEIGHT = 34;
ConnectedGraph.RECURSION_FRAME_MIN_HEIGHT = 22;
ConnectedGraph.RECURSION_FRAME_SPACING = 10;
ConnectedGraph.RECURSION_FRAME_MIN_SPACING = 6;
ConnectedGraph.RECURSION_RECT_COLOR = "#f8f9fa";
ConnectedGraph.RECURSION_RECT_BORDER = "#1d3557";
ConnectedGraph.RECURSION_RECT_ACTIVE_BORDER = "#e63946";
ConnectedGraph.RECURSION_TEXT_COLOR = "#1d3557";
ConnectedGraph.RECURSION_FONT = "bold 18";

ConnectedGraph.TITLE_COLOR = "#1d3557";
ConnectedGraph.START_INFO_COLOR = "#264653";
ConnectedGraph.HIGHLIGHT_COLOR = "#ff3b30";

ConnectedGraph.COMPONENT_COLORS = [
  "#66bb6a",
  "#ffca28",
  "#42a5f5",
  "#ab47bc",
  "#ef5350",
  "#8d6e63",
  "#26c6da",
  "#ffa726"
];

ConnectedGraph.CODE_LINES = [
  ["int componentId = 0;"],
  ["for (int u = 0; u < n; ++u) {"],
  ["    if (!visited[u]) {"],
  ["        componentId++;"],
  ["        dfs(u, componentId);"],
  ["    }"],
  ["}"],
  ["void dfs(int u, int id) {"],
  ["    visited[u] = true;"],
  ["    component[u] = id;"],
  ["    for (int v : adj[u]) {"],
  ["        if (!visited[v]) {"],
  ["            dfs(v, id);"],
  ["        }"],
  ["    }"],
  ["}"],
];

ConnectedGraph.TEMPLATE_ALLOWED = [
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

ConnectedGraph.EDGE_CURVES = [
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

ConnectedGraph.prototype.init = function (am, w, h) {
  ConnectedGraph.superclass.init.call(this, am, w, h);

  this.controls = [];
  this.addControls();

  this.vertexLabels = [];
  this.vertexPositions = [];
  this.adjacencyList = [];
  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};
  this.undirectedEdgeMeta = {};
  this.edgeCurveOverrides = {};
  this.undirectedEdges = [];
  this.vertexIDs = [];
  this.visitedRectIDs = [];
  this.componentRectIDs = [];
  this.vertexRowLabelIDs = [];
  this.codeID = [];
  this.highlightCircleID = -1;
  this.currentCodeLine = -1;
  this.startDisplayID = -1;
  this.componentCountLabelID = -1;
  this.recursionBackgroundID = -1;
  this.recursionHeaderID = -1;
  this.recursionFrameIDs = [];
  this.activeRecursionIndex = -1;
  this.recursionDepth = 0;
  this.bottomSectionTopY =
    ConnectedGraph.ROW3_START_Y + ConnectedGraph.CODE_TOP_PADDING;

  this.visited = [];
  this.componentAssignments = [];

  this.implementAction(this.reset.bind(this), 0);
};

ConnectedGraph.prototype.addControls = function () {
  addLabelToAlgorithmBar("Start Vertex:");
  this.startField = addControlToAlgorithmBar("Text", "A");
  this.startField.size = 4;
  this.startButton = addControlToAlgorithmBar("Button", "Find Components");
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

ConnectedGraph.prototype.reset = function () {
  this.nextIndex = 0;
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  return this.setup();
};

ConnectedGraph.prototype.setup = function () {
  this.commands = [];

  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};
  this.undirectedEdgeMeta = {};
  this.edgeCurveOverrides = {};

  var vertexCount = 10;
  this.vertexLabels = this.createVertexLabels(vertexCount);
  this.generateRandomGraph(vertexCount);

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

ConnectedGraph.prototype.resetCallback = function () {
  this.implementAction(this.reset.bind(this), 0);
};

ConnectedGraph.prototype.createVertexLabels = function (count) {
  var labels = [];
  var limit = Math.min(count, 26);
  for (var i = 0; i < limit; i++) {
    labels.push(String.fromCharCode(65 + i));
  }
  return labels;
};

ConnectedGraph.prototype.generateRandomGraph = function (vertexCount) {
  this.vertexPositions = this.computeTemplateLayout(vertexCount);
  this.adjacencyList = new Array(vertexCount);
  this.undirectedEdges = [];
  this.edgePairs = [];
  this.edgeStates = {};
  this.edgeMeta = {};
  this.undirectedEdgeMeta = {};
  this.edgeCurveOverrides = {};

  for (var i = 0; i < vertexCount; i++) {
    this.adjacencyList[i] = [];
  }

  var allowed = ConnectedGraph.TEMPLATE_ALLOWED;
  var curves = ConnectedGraph.EDGE_CURVES;
  var edges = [];
  var used = {};

  var addEdge = function (u, v) {
    if (u === v) {
      return false;
    }
    var a = Math.min(u, v);
    var b = Math.max(u, v);
    if (!allowed[a] || !allowed[a][b]) {
      return false;
    }
    var key = a + '-' + b;
    if (used[key]) {
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
    used[key] = true;
    return true;
  };

  for (var v = 1; v < vertexCount; v++) {
    var neighbors = [];
    for (var u = 0; u < vertexCount; u++) {
      if (allowed[v] && allowed[v][u]) {
        neighbors.push(u);
      }
    }
    if (neighbors.length === 0) {
      continue;
    }
    for (var t = neighbors.length - 1; t >= 0; t--) {
      var swap = Math.floor(Math.random() * (t + 1));
      var candidate = neighbors[swap];
      neighbors[swap] = neighbors[t];
      neighbors[t] = candidate;
      if (addEdge(candidate, v)) {
        break;
      }
    }
  }

  var edgePercent = 0.45;
  for (var i = 0; i < vertexCount; i++) {
    for (var j = i + 1; j < vertexCount; j++) {
      if (!allowed[i] || !allowed[i][j]) {
        continue;
      }
      if (used[i + '-' + j]) {
        continue;
      }
      if (Math.random() <= edgePercent) {
        addEdge(i, j);
      }
    }
  }

  if (edges.length === 0 && vertexCount >= 2) {
    addEdge(0, 1);
  }

  var componentData = this.countComponentsFromEdges(vertexCount, edges);
  if (componentData.count < 2) {
    edges = this.forceMultipleComponents(vertexCount, edges, allowed, curves);
    componentData = this.countComponentsFromEdges(vertexCount, edges);
  }

  if (componentData.count < 2) {
    edges = this.isolateRandomVertex(vertexCount, edges);
    componentData = this.countComponentsFromEdges(vertexCount, edges);
  }

  this.undirectedEdges = edges;

  for (var rebuild = 0; rebuild < this.adjacencyList.length; rebuild++) {
    this.adjacencyList[rebuild] = [];
  }

  for (var e = 0; e < edges.length; e++) {
    var edge = edges[e];
    this.adjacencyList[edge.u].push(edge.v);
    this.adjacencyList[edge.v].push(edge.u);
  }

  for (var list = 0; list < this.adjacencyList.length; list++) {
    var adj = this.adjacencyList[list];
    for (var n = adj.length - 1; n > 0; n--) {
      var swapIndex = Math.floor(Math.random() * (n + 1));
      var temp = adj[n];
      adj[n] = adj[swapIndex];
      adj[swapIndex] = temp;
    }
  }
};


ConnectedGraph.prototype.countComponentsFromEdges = function (vertexCount, edges) {
  var adjacency = new Array(vertexCount);
  for (var i = 0; i < vertexCount; i++) {
    adjacency[i] = [];
  }

  for (var e = 0; e < edges.length; e++) {
    var edge = edges[e];
    adjacency[edge.u].push(edge.v);
    adjacency[edge.v].push(edge.u);
  }

  var visited = new Array(vertexCount);
  for (var v = 0; v < vertexCount; v++) {
    visited[v] = false;
  }

  var stack = [];
  var count = 0;

  for (var start = 0; start < vertexCount; start++) {
    if (visited[start]) {
      continue;
    }
    count++;
    stack.length = 0;
    stack.push(start);
    visited[start] = true;

    while (stack.length > 0) {
      var node = stack.pop();
      var neighbors = adjacency[node];
      for (var n = 0; n < neighbors.length; n++) {
        var next = neighbors[n];
        if (!visited[next]) {
          visited[next] = true;
          stack.push(next);
        }
      }
    }
  }

  return { count: count, adjacency: adjacency };
};


ConnectedGraph.prototype.forceMultipleComponents = function (
  vertexCount,
  edges,
  allowed,
  curves
) {
  if (vertexCount <= 1) {
    return edges;
  }

  var order = [];
  for (var i = 0; i < vertexCount; i++) {
    order.push(i);
  }
  for (var shuffleIndex = order.length - 1; shuffleIndex > 0; shuffleIndex--) {
    var swapIndex = Math.floor(Math.random() * (shuffleIndex + 1));
    var temp = order[shuffleIndex];
    order[shuffleIndex] = order[swapIndex];
    order[swapIndex] = temp;
  }

  var splitPoint = Math.floor(vertexCount / 2);
  if (splitPoint <= 0) {
    splitPoint = 1;
  }
  if (splitPoint >= vertexCount) {
    splitPoint = vertexCount - 1;
  }

  var inFirst = {};
  for (var a = 0; a < splitPoint; a++) {
    inFirst[order[a]] = true;
  }

  var groupA = [];
  var groupB = [];
  for (var g = 0; g < order.length; g++) {
    if (inFirst[order[g]]) {
      groupA.push(order[g]);
    } else {
      groupB.push(order[g]);
    }
  }

  var filteredEdges = [];
  for (var e = 0; e < edges.length; e++) {
    var edge = edges[e];
    var inA = inFirst[edge.u];
    var inB = inFirst[edge.v];
    if ((inA && inB) || (!inA && !inB)) {
      filteredEdges.push(edge);
    }
  }

  edges = filteredEdges;

  var used = {};
  for (var u = 0; u < edges.length; u++) {
    used[edges[u].u + '-' + edges[u].v] = true;
  }

  var connectGroup = function (group) {
    if (group.length <= 1) {
      return;
    }

    var sequence = [];
    for (var s = 0; s < group.length; s++) {
      sequence.push(group[s]);
    }
    for (var si = sequence.length - 1; si > 0; si--) {
      var sj = Math.floor(Math.random() * (si + 1));
      var tmp = sequence[si];
      sequence[si] = sequence[sj];
      sequence[sj] = tmp;
    }

    for (var idx = 1; idx < sequence.length; idx++) {
      var target = sequence[idx];
      var connected = false;

      for (var prev = 0; prev < idx; prev++) {
        var candidate = sequence[prev];
        var min = Math.min(target, candidate);
        var max = Math.max(target, candidate);
        if (!allowed[min] || !allowed[min][max]) {
          continue;
        }
        var key = min + '-' + max;
        if (used[key]) {
          connected = true;
          break;
        }
        var curve = 0;
        if (
          curves[min] &&
          typeof curves[min][max] === "number" &&
          Math.abs(curves[min][max]) > 0.0001
        ) {
          curve = curves[min][max];
        }
        edges.push({ u: min, v: max, curve: curve });
        used[key] = true;
        connected = true;
        break;
      }

      if (connected) {
        continue;
      }

      for (var x = 0; x < group.length && !connected; x++) {
        for (var y = x + 1; y < group.length; y++) {
          var ga = Math.min(group[x], group[y]);
          var gb = Math.max(group[x], group[y]);
          if (!allowed[ga] || !allowed[ga][gb]) {
            continue;
          }
          var gkey = ga + '-' + gb;
          if (used[gkey]) {
            continue;
          }
          var gcurve = 0;
          if (
            curves[ga] &&
            typeof curves[ga][gb] === "number" &&
            Math.abs(curves[ga][gb]) > 0.0001
          ) {
            gcurve = curves[ga][gb];
          }
          edges.push({ u: ga, v: gb, curve: gcurve });
          used[gkey] = true;
          connected = true;
          break;
        }
      }
    }
  };

  connectGroup(groupA);
  connectGroup(groupB);

  return edges;
};


ConnectedGraph.prototype.isolateRandomVertex = function (vertexCount, edges) {
  if (vertexCount <= 1) {
    return edges;
  }

  var target = Math.floor(Math.random() * vertexCount);
  var filtered = [];
  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    if (edge.u === target || edge.v === target) {
      continue;
    }
    filtered.push(edge);
  }
  return filtered;
};



ConnectedGraph.prototype.computeTemplateLayout = function (vertexCount) {
  var layout = [];
  var baseX = 200;
  var stepX = 130;
  var baseY = ConnectedGraph.ROW2_START_Y + 120;
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

ConnectedGraph.prototype.createTitleRow = function () {
  var titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    titleID,
    "Connected Components in an Undirected Graph",
    ConnectedGraph.CANVAS_WIDTH / 2,
    ConnectedGraph.TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", titleID, "bold 34");
  this.cmd("SetForegroundColor", titleID, ConnectedGraph.TITLE_COLOR);

  this.startDisplayID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.startDisplayID,
    "Traversal Start: A",
    ConnectedGraph.CANVAS_WIDTH / 2,
    ConnectedGraph.START_INFO_Y,
    1
  );
  this.cmd("SetTextStyle", this.startDisplayID, "bold 24");
  this.cmd("SetForegroundColor", this.startDisplayID, ConnectedGraph.START_INFO_COLOR);

  this.componentCountLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.componentCountLabelID,
    "Components Found: 0",
    ConnectedGraph.CANVAS_WIDTH / 2,
    ConnectedGraph.START_INFO_Y + 48,
    1
  );
  this.cmd("SetTextStyle", this.componentCountLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.componentCountLabelID, ConnectedGraph.START_INFO_COLOR);
};

ConnectedGraph.prototype.createGraphArea = function () {
  this.vertexIDs = new Array(this.vertexLabels.length);
  this.edgePairs = [];

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var id = this.nextIndex++;
    this.vertexIDs[i] = id;
    var pos = this.vertexPositions[i];
    this.cmd(
      'CreateCircle',
      id,
      this.vertexLabels[i],
      pos.x,
      pos.y,
      ConnectedGraph.GRAPH_NODE_RADIUS
    );
    this.cmd('SetBackgroundColor', id, ConnectedGraph.GRAPH_NODE_COLOR);
    this.cmd('SetForegroundColor', id, ConnectedGraph.GRAPH_NODE_BORDER);
    this.cmd('SetTextColor', id, ConnectedGraph.GRAPH_NODE_TEXT);
    this.cmd('SetHighlight', id, 0);
  }

  for (var j = 0; j < this.undirectedEdges.length; j++) {
    var pair = this.undirectedEdges[j];
    var key = this.undirectedEdgeKey(pair.u, pair.v);
    this.undirectedEdgeMeta[key] = {
      u: pair.u,
      v: pair.v,
      curve: pair.curve
    };
    this.edgeStates[key] = { tree: false };

    var forwardKey = this.edgeKey(pair.u, pair.v);
    var backwardKey = this.edgeKey(pair.v, pair.u);
    this.edgeMeta[forwardKey] = {
      from: pair.u,
      to: pair.v,
      curve: pair.curve
    };
    this.edgeMeta[backwardKey] = {
      from: pair.v,
      to: pair.u,
      curve: -pair.curve
    };

    this.edgePairs.push({ from: pair.u, to: pair.v, curve: pair.curve });
    this.edgePairs.push({ from: pair.v, to: pair.u, curve: pair.curve });

    this.cmd(
      'Connect',
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      ConnectedGraph.EDGE_COLOR,
      pair.curve,
      0,
      ''
    );
    this.cmd(
      'SetEdgeThickness',
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      ConnectedGraph.EDGE_THICKNESS
    );
    this.cmd(
      'SetEdgeHighlight',
      this.vertexIDs[pair.u],
      this.vertexIDs[pair.v],
      0
    );
  }

  this.highlightCircleID = this.nextIndex++;
  var startPos = this.vertexPositions[0];
  this.cmd(
    'CreateHighlightCircle',
    this.highlightCircleID,
    ConnectedGraph.HIGHLIGHT_COLOR,
    startPos.x,
    startPos.y,
    ConnectedGraph.HIGHLIGHT_RADIUS
  );
  this.cmd('SetAlpha', this.highlightCircleID, 0);
};



ConnectedGraph.prototype.createArrayArea = function () {
  var visitedHeaderID = this.nextIndex++;
  var componentHeaderID = this.nextIndex++;
  var headerY =
    ConnectedGraph.ARRAY_TOP_Y - ConnectedGraph.ARRAY_CELL_HEIGHT / 2 - ConnectedGraph.ARRAY_HEADER_GAP;

  this.cmd(
    "CreateLabel",
    visitedHeaderID,
    "Visited",
    ConnectedGraph.ARRAY_BASE_X,
    headerY
  );
  this.cmd("SetTextStyle", visitedHeaderID, "bold 20");
  this.cmd("SetForegroundColor", visitedHeaderID, ConnectedGraph.CODE_STANDARD_COLOR);

  this.cmd(
    "CreateLabel",
    componentHeaderID,
    "Component",
    ConnectedGraph.ARRAY_BASE_X + ConnectedGraph.ARRAY_COLUMN_SPACING,
    headerY
  );
  this.cmd("SetTextStyle", componentHeaderID, "bold 20");
  this.cmd("SetForegroundColor", componentHeaderID, ConnectedGraph.CODE_STANDARD_COLOR);

  this.visitedRectIDs = new Array(this.vertexLabels.length);
  this.componentRectIDs = new Array(this.vertexLabels.length);
  this.vertexRowLabelIDs = new Array(this.vertexLabels.length);

  for (var i = 0; i < this.vertexLabels.length; i++) {
    var rowY = ConnectedGraph.ARRAY_TOP_Y + i * ConnectedGraph.ARRAY_CELL_HEIGHT;

    var vertexLabelID = this.nextIndex++;
    this.vertexRowLabelIDs[i] = vertexLabelID;
    this.cmd(
      "CreateLabel",
      vertexLabelID,
      this.vertexLabels[i],
      ConnectedGraph.ARRAY_BASE_X - 58,
      rowY,
      0
    );
    this.cmd("SetTextStyle", vertexLabelID, "bold 20");
    this.cmd("SetForegroundColor", vertexLabelID, ConnectedGraph.START_INFO_COLOR);

    var visitedID = this.nextIndex++;
    this.visitedRectIDs[i] = visitedID;
    this.cmd(
      "CreateRectangle",
      visitedID,
      "F",
      ConnectedGraph.ARRAY_CELL_WIDTH,
      ConnectedGraph.ARRAY_CELL_INNER_HEIGHT,
      ConnectedGraph.ARRAY_BASE_X,
      rowY
    );
    this.cmd("SetForegroundColor", visitedID, ConnectedGraph.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", visitedID, ConnectedGraph.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", visitedID, ConnectedGraph.ARRAY_TEXT_COLOR);
    this.cmd(
      "SetRectangleLineThickness",
      visitedID,
      ConnectedGraph.ARRAY_RECT_BORDER_THICKNESS
    );

    var componentCellID = this.nextIndex++;
    this.componentRectIDs[i] = componentCellID;
    this.cmd(
      "CreateRectangle",
      componentCellID,
      "-",
      ConnectedGraph.ARRAY_CELL_WIDTH,
      ConnectedGraph.ARRAY_CELL_INNER_HEIGHT,
      ConnectedGraph.ARRAY_BASE_X + ConnectedGraph.ARRAY_COLUMN_SPACING,
      rowY
    );
    this.cmd("SetForegroundColor", componentCellID, ConnectedGraph.ARRAY_RECT_BORDER);
    this.cmd("SetBackgroundColor", componentCellID, ConnectedGraph.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", componentCellID, ConnectedGraph.ARRAY_TEXT_COLOR);
  }

  var lastRowIndex = this.vertexLabels.length - 1;
  if (lastRowIndex >= 0) {
    var lastCenterY =
      ConnectedGraph.ARRAY_TOP_Y + lastRowIndex * ConnectedGraph.ARRAY_CELL_HEIGHT;
    var arrayBottomY =
      lastCenterY + ConnectedGraph.ARRAY_CELL_INNER_HEIGHT / 2;
    this.bottomSectionTopY =
      arrayBottomY + ConnectedGraph.BOTTOM_SECTION_GAP;
  }
};

ConnectedGraph.prototype.setVisitedCellHighlight = function (index, active) {
  if (index < 0 || index >= this.visitedRectIDs.length) {
    return;
  }
  var color = active
    ? ConnectedGraph.ARRAY_RECT_HIGHLIGHT_BORDER
    : ConnectedGraph.ARRAY_RECT_BORDER;
  var thickness = active
    ? ConnectedGraph.ARRAY_RECT_HIGHLIGHT_THICKNESS
    : ConnectedGraph.ARRAY_RECT_BORDER_THICKNESS;
  var rectID = this.visitedRectIDs[index];
  this.cmd("SetForegroundColor", rectID, color);
  this.cmd("SetRectangleLineThickness", rectID, thickness);
};

ConnectedGraph.prototype.getComponentColor = function (componentId) {
  var palette = ConnectedGraph.COMPONENT_COLORS;
  if (!palette || palette.length === 0) {
    return ConnectedGraph.GRAPH_NODE_VISITED_COLOR;
  }
  var index = Math.max(0, componentId - 1) % palette.length;
  return palette[index];
};

ConnectedGraph.prototype.createCodeDisplay = function () {
  var startY = this.bottomSectionTopY + ConnectedGraph.CODE_TOP_PADDING;
  this.codeID = this.addCodeToCanvasBase(
    ConnectedGraph.CODE_LINES,
    ConnectedGraph.CODE_START_X,
    startY,
    ConnectedGraph.CODE_LINE_HEIGHT,
    ConnectedGraph.CODE_STANDARD_COLOR,
    0,
    0
  );

  for (var i = 0; i < this.codeID.length; i++) {
    for (var j = 0; j < this.codeID[i].length; j++) {
      this.cmd("SetTextStyle", this.codeID[i][j], ConnectedGraph.CODE_FONT);
    }
  }
};

ConnectedGraph.prototype.computeRecursionLayout = function (frameCount) {
  var layout = {
    height: ConnectedGraph.RECURSION_FRAME_HEIGHT,
    spacing: ConnectedGraph.RECURSION_FRAME_SPACING,
    startY:
      this.bottomSectionTopY +
      ConnectedGraph.RECURSION_HEADER_HEIGHT +
      ConnectedGraph.RECURSION_LABEL_MARGIN +
      ConnectedGraph.RECURSION_FRAME_HEIGHT / 2
  };

  if (frameCount <= 0) {
    return layout;
  }

  var availableHeight =
    ConnectedGraph.CANVAS_HEIGHT -
    (this.bottomSectionTopY +
      ConnectedGraph.RECURSION_HEADER_HEIGHT +
      ConnectedGraph.RECURSION_LABEL_MARGIN +
      ConnectedGraph.RECURSION_AREA_BOTTOM_MARGIN);

  if (availableHeight <= 0) {
    return layout;
  }

  var spacing = frameCount === 1 ? 0 : layout.spacing;
  var height = Math.min(
    ConnectedGraph.RECURSION_FRAME_HEIGHT,
    Math.max(
      ConnectedGraph.RECURSION_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    )
  );

  var totalHeight = height * frameCount + spacing * (frameCount - 1);
  if (totalHeight > availableHeight) {
    spacing = Math.max(
      ConnectedGraph.RECURSION_FRAME_MIN_SPACING,
      Math.floor(
        (availableHeight - height * frameCount) / Math.max(1, frameCount - 1)
      )
    );
    if (spacing < 0) {
      spacing = 0;
    }
    height = Math.max(
      ConnectedGraph.RECURSION_FRAME_MIN_HEIGHT,
      Math.floor(
        (availableHeight - (frameCount - 1) * spacing) / Math.max(frameCount, 1)
      )
    );
  }

  layout.height = height;
  layout.spacing = spacing;
  layout.startY =
    this.bottomSectionTopY +
    ConnectedGraph.RECURSION_HEADER_HEIGHT +
    ConnectedGraph.RECURSION_LABEL_MARGIN +
    height / 2;

  return layout;
};

ConnectedGraph.prototype.createRecursionArea = function () {
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
    ConnectedGraph.RECURSION_AREA_CENTER_X,
    this.bottomSectionTopY + ConnectedGraph.RECURSION_HEADER_HEIGHT / 2,
    0
  );
  this.cmd(
    "SetForegroundColor",
    this.recursionHeaderID,
    ConnectedGraph.CODE_STANDARD_COLOR
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
      ConnectedGraph.RECURSION_FRAME_WIDTH,
      layout.height,
      ConnectedGraph.RECURSION_AREA_CENTER_X,
      y
    );
    this.cmd(
      "SetBackgroundColor",
      rectID,
      ConnectedGraph.RECURSION_RECT_COLOR
    );
    this.cmd("SetForegroundColor", rectID, ConnectedGraph.RECURSION_RECT_BORDER);
    this.cmd("SetAlpha", rectID, 0);
    this.cmd("SetTextColor", rectID, ConnectedGraph.RECURSION_TEXT_COLOR);
    this.cmd("SetTextStyle", rectID, ConnectedGraph.RECURSION_FONT);

    this.recursionFrameIDs.push(rectID);

    y += layout.height + layout.spacing;
  }
};

ConnectedGraph.prototype.resetRecursionArea = function () {
  this.recursionDepth = 0;
  this.activeRecursionIndex = -1;
  for (var i = 0; i < this.recursionFrameIDs.length; i++) {
    this.cmd("SetAlpha", this.recursionFrameIDs[i], 0);
    this.cmd("SetText", this.recursionFrameIDs[i], "");
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[i],
      ConnectedGraph.RECURSION_RECT_BORDER
    );
  }
};

ConnectedGraph.prototype.pushRecursionFrame = function (vertex, componentId) {
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
      ConnectedGraph.RECURSION_RECT_BORDER
    );
  }

  var frameID = this.recursionFrameIDs[this.recursionDepth];
  var componentLabel = "-";
  if (typeof componentId === "number" && componentId > 0) {
    componentLabel = String(componentId);
  }
  var text =
    "dfs(" +
    this.vertexLabels[vertex] +
    ", comp " +
    componentLabel +
    ")";
  this.cmd("SetText", frameID, text);
  this.cmd("SetAlpha", frameID, 1);
  this.cmd(
    "SetForegroundColor",
    frameID,
    ConnectedGraph.RECURSION_RECT_ACTIVE_BORDER
  );

  this.activeRecursionIndex = this.recursionDepth;
  this.recursionDepth++;
};

ConnectedGraph.prototype.popRecursionFrame = function () {
  if (this.recursionDepth <= 0) {
    return;
  }

  this.recursionDepth--;
  var frameID = this.recursionFrameIDs[this.recursionDepth];
  this.cmd("SetAlpha", frameID, 0);
  this.cmd("SetText", frameID, "");
  this.cmd("SetForegroundColor", frameID, ConnectedGraph.RECURSION_RECT_BORDER);

  this.activeRecursionIndex = this.recursionDepth - 1;
  if (this.activeRecursionIndex >= 0 && this.activeRecursionIndex < this.recursionFrameIDs.length) {
    this.cmd(
      "SetForegroundColor",
      this.recursionFrameIDs[this.activeRecursionIndex],
      ConnectedGraph.RECURSION_RECT_ACTIVE_BORDER
    );
  }
};

ConnectedGraph.prototype.highlightCodeLine = function (lineIndex) {
  if (this.currentCodeLine >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[this.currentCodeLine][0],
      ConnectedGraph.CODE_STANDARD_COLOR
    );
  }
  this.currentCodeLine = lineIndex;
  if (lineIndex >= 0) {
    this.cmd(
      "SetForegroundColor",
      this.codeID[lineIndex][0],
      ConnectedGraph.CODE_HIGHLIGHT_COLOR
    );
  }
};

ConnectedGraph.prototype.clearTraversalState = function () {
  this.visited = new Array(this.vertexLabels.length);
  this.componentAssignments = new Array(this.vertexLabels.length);
  this.componentCount = 0;
  if (this.componentCountLabelID !== -1) {
    this.cmd("SetText", this.componentCountLabelID, "Components Found: 0");
  }
  for (var i = 0; i < this.vertexLabels.length; i++) {
    this.visited[i] = false;
    this.componentAssignments[i] = null;
    this.cmd("SetText", this.visitedRectIDs[i], "F");
    this.cmd("SetBackgroundColor", this.visitedRectIDs[i], ConnectedGraph.ARRAY_RECT_COLOR);
    this.cmd(
      "SetForegroundColor",
      this.visitedRectIDs[i],
      ConnectedGraph.ARRAY_RECT_BORDER
    );
    this.cmd(
      "SetRectangleLineThickness",
      this.visitedRectIDs[i],
      ConnectedGraph.ARRAY_RECT_BORDER_THICKNESS
    );
    this.cmd("SetTextColor", this.visitedRectIDs[i], ConnectedGraph.ARRAY_TEXT_COLOR);
    this.cmd("SetText", this.componentRectIDs[i], "-");
    this.cmd("SetBackgroundColor", this.componentRectIDs[i], ConnectedGraph.ARRAY_RECT_COLOR);
    this.cmd("SetTextColor", this.componentRectIDs[i], ConnectedGraph.ARRAY_TEXT_COLOR);
    this.cmd(
      "SetBackgroundColor",
      this.vertexIDs[i],
      ConnectedGraph.GRAPH_NODE_COLOR
    );
    this.cmd(
      "SetTextColor",
      this.vertexIDs[i],
      ConnectedGraph.GRAPH_NODE_TEXT
    );
  }
  this.resetEdgeStates();
  this.clearEdgeHighlights();
  this.resetRecursionArea();
};

ConnectedGraph.prototype.clearEdgeHighlights = function () {
  if (!this.edgePairs) {
    return;
  }
  for (var i = 0; i < this.edgePairs.length; i++) {
    var edge = this.edgePairs[i];
    this.highlightEdge(edge.from, edge.to, false);
  }
};

ConnectedGraph.prototype.edgeKey = function (from, to) {
  return from + "->" + to;
};

ConnectedGraph.prototype.undirectedEdgeKey = function (a, b) {
  return a < b ? a + '-' + b : b + '-' + a;
};

ConnectedGraph.prototype.getEdgeCurve = function (from, to) {
  var key = this.edgeKey(from, to);
  if (
    this.edgeCurveOverrides &&
    Object.prototype.hasOwnProperty.call(this.edgeCurveOverrides, key)
  ) {
    return this.edgeCurveOverrides[key];
  }
  if (
    ConnectedGraph.EDGE_CURVES[from] &&
    typeof ConnectedGraph.EDGE_CURVES[from][to] === "number"
  ) {
    return ConnectedGraph.EDGE_CURVES[from][to];
  }
  return 0;
};

ConnectedGraph.prototype.updateEdgeBaseColor = function (from, to) {
  if (!this.vertexIDs) {
    return;
  }
  var key = this.undirectedEdgeKey(from, to);
  var meta = this.undirectedEdgeMeta[key];
  if (!meta) {
    return;
  }
  var baseColor = ConnectedGraph.EDGE_COLOR;
  if (this.edgeStates[key] && this.edgeStates[key].tree) {
    baseColor = ConnectedGraph.EDGE_VISITED_COLOR;
  }
  this.cmd(
    "SetEdgeColor",
    this.vertexIDs[meta.u],
    this.vertexIDs[meta.v],
    baseColor
  );
};

ConnectedGraph.prototype.setEdgeTreeState = function (from, to, isTree) {
  var key = this.undirectedEdgeKey(from, to);
  if (!this.edgeStates[key]) {
    this.edgeStates[key] = {};
  }
  this.edgeStates[key].tree = isTree;
  this.updateEdgeBaseColor(from, to);
};

ConnectedGraph.prototype.resetEdgeStates = function () {
  if (!this.undirectedEdgeMeta) {
    return;
  }
  for (var key in this.undirectedEdgeMeta) {
    if (!Object.prototype.hasOwnProperty.call(this.undirectedEdgeMeta, key)) {
      continue;
    }
    if (!this.edgeStates[key]) {
      this.edgeStates[key] = { tree: false };
    }
    this.edgeStates[key].tree = false;
    var meta = this.undirectedEdgeMeta[key];
    var fromID = this.vertexIDs[meta.u];
    var toID = this.vertexIDs[meta.v];
    this.cmd("SetEdgeThickness", fromID, toID, ConnectedGraph.EDGE_THICKNESS);
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    this.cmd("SetEdgeColor", fromID, toID, ConnectedGraph.EDGE_COLOR);
  }
};

ConnectedGraph.prototype.highlightEdge = function (from, to, active) {
  if (!this.vertexIDs) {
    return;
  }
  var key = this.undirectedEdgeKey(from, to);
  var meta = this.undirectedEdgeMeta[key];
  if (!meta) {
    return;
  }
  var fromID = this.vertexIDs[meta.u];
  var toID = this.vertexIDs[meta.v];
  if (active) {
    this.updateEdgeBaseColor(meta.u, meta.v);
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      ConnectedGraph.EDGE_HIGHLIGHT_THICKNESS
    );
    this.cmd("SetEdgeHighlight", fromID, toID, 1);
  } else {
    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    this.cmd("SetEdgeThickness", fromID, toID, ConnectedGraph.EDGE_THICKNESS);
    this.updateEdgeBaseColor(meta.u, meta.v);
  }
};

ConnectedGraph.prototype.setEdgeActive = function (from, to, active) {
  this.highlightEdge(from, to, active);
};

ConnectedGraph.prototype.markEdgeAsTreeEdge = function (from, to) {
  this.setEdgeTreeState(from, to, true);
};

ConnectedGraph.prototype.animateHighlightTraversal = function (
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

ConnectedGraph.prototype.getStartFieldValue = function () {
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

ConnectedGraph.prototype.setStartFieldValue = function (text) {
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

ConnectedGraph.prototype.isWhitespaceChar = function (ch) {
  return (
    ch === " " ||
    ch === "\t" ||
    ch === "\n" ||
    ch === "\r" ||
    ch === "\f" ||
    ch === "\u00a0"
  );
};

ConnectedGraph.prototype.cleanInputLabel = function (inputLabel) {
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

ConnectedGraph.prototype.findVertexIndex = function (label) {
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

ConnectedGraph.prototype.startCallback = function () {
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
  this.implementAction(this.runConnectedComponents.bind(this), index);
};

ConnectedGraph.prototype.runConnectedComponents = function (startIndex) {
  this.commands = [];

  this.clearTraversalState();

  var startLabel = this.vertexLabels[startIndex];
  this.cmd(
    "SetText",
    this.startDisplayID,
    "Traversal Start: " + startLabel
  );
  this.cmd(
    "SetText",
    this.componentCountLabelID,
    "Components Found: 0"
  );

  var startPos = this.vertexPositions[startIndex];
  if (startPos) {
    this.cmd("SetAlpha", this.highlightCircleID, 1);
    this.cmd("Move", this.highlightCircleID, startPos.x, startPos.y);
  }
  this.cmd("Step");

  this.componentCount = 0;
  this.highlightCodeLine(0);
  this.cmd("Step");

  var order = [];
  for (var offset = 0; offset < this.vertexLabels.length; offset++) {
    order.push((startIndex + offset) % this.vertexLabels.length);
  }

  for (var idx = 0; idx < order.length; idx++) {
    var u = order[idx];
    var target = this.vertexPositions[u];
    if (target) {
      this.cmd("Move", this.highlightCircleID, target.x, target.y);
    }

    this.highlightCodeLine(1);
    this.cmd("Step");

    this.setVisitedCellHighlight(u, true);
    this.cmd("Step");

    this.highlightCodeLine(2);
    this.cmd("Step");

    if (!this.visited[u]) {
      this.highlightCodeLine(3);
      this.componentCount++;
      this.cmd(
        "SetText",
        this.componentCountLabelID,
        "Components Found: " + this.componentCount
      );
      this.cmd("Step");

      this.highlightCodeLine(4);
      this.cmd("Step");
      this.dfsVisit(u, this.componentCount);
    }

    this.setVisitedCellHighlight(u, false);

    this.highlightCodeLine(5);
    this.cmd("Step");
  }

  this.highlightCodeLine(6);
  this.cmd("Step");
  this.highlightCodeLine(-1);
  this.cmd("SetAlpha", this.highlightCircleID, 0);

  return this.commands;
};

ConnectedGraph.prototype.dfsVisit = function (u, componentId) {
  this.pushRecursionFrame(u, componentId);
  this.cmd("Step");

  this.highlightCodeLine(7);
  this.cmd("Step");

  this.highlightCodeLine(8);
  this.setVisitedCellHighlight(u, true);
  this.cmd("Step");
  if (!this.visited[u]) {
    this.visited[u] = true;
    this.cmd("SetText", this.visitedRectIDs[u], "T");
    this.cmd(
      "SetBackgroundColor",
      this.visitedRectIDs[u],
      ConnectedGraph.ARRAY_VISITED_FILL
    );
    var vertexColor = this.getComponentColor(componentId);
    this.cmd("SetBackgroundColor", this.vertexIDs[u], vertexColor);
    this.cmd(
      "SetTextColor",
      this.vertexIDs[u],
      ConnectedGraph.GRAPH_NODE_VISITED_TEXT_COLOR
    );
  }
  this.setVisitedCellHighlight(u, false);

  this.highlightCodeLine(9);
  this.componentAssignments[u] = componentId;
  this.cmd("SetText", this.componentRectIDs[u], String(componentId));
  this.cmd(
    "SetBackgroundColor",
    this.componentRectIDs[u],
    ConnectedGraph.ARRAY_VISITED_FILL
  );
  this.cmd(
    "SetTextColor",
    this.componentRectIDs[u],
    ConnectedGraph.ARRAY_TEXT_COLOR
  );
  this.cmd("Step");

  this.highlightCodeLine(10);
  this.cmd("Step");

  var neighbors = this.adjacencyList[u];
  for (var i = 0; i < neighbors.length; i++) {
    var v = neighbors[i];

    this.setEdgeActive(u, v, true);
    this.cmd("Step");

    this.highlightCodeLine(11);
    this.setVisitedCellHighlight(v, true);
    this.cmd("Step");

    if (!this.visited[v]) {
      this.highlightCodeLine(12);
      this.markEdgeAsTreeEdge(u, v);
      this.cmd("Step");

      this.animateHighlightTraversal(u, v, this.edgeKey(u, v));
      this.dfsVisit(v, componentId);
      this.animateHighlightTraversal(v, u, this.edgeKey(v, u));

      this.highlightCodeLine(13);
      this.cmd("Step");
    }

    this.setVisitedCellHighlight(v, false);

    this.highlightCodeLine(14);
    this.cmd("Step");

    this.setEdgeActive(u, v, false);

    this.highlightCodeLine(10);
    this.cmd("Step");
  }

  this.highlightCodeLine(15);
  this.cmd("Step");
  this.highlightCodeLine(-1);
  this.cmd("Step");
  this.popRecursionFrame();
};

ConnectedGraph.prototype.disableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

ConnectedGraph.prototype.enableUI = function () {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new ConnectedGraph(animManag, canvas.width, canvas.height);
}
