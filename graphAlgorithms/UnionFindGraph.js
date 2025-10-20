function UnionFindGraph(am, w, h) {
  this.init(am, w, h);
}

UnionFindGraph.prototype = new Algorithm();
UnionFindGraph.prototype.constructor = UnionFindGraph;
UnionFindGraph.superclass = Algorithm.prototype;

UnionFindGraph.CANVAS_WIDTH = 900;
UnionFindGraph.CANVAS_HEIGHT = 1600;

UnionFindGraph.TITLE_Y = 110;
UnionFindGraph.STATUS_Y = 190;
UnionFindGraph.DETAIL_Y = 230;
UnionFindGraph.GRAPH_LABEL_Y = 320;
UnionFindGraph.GRAPH_LABEL_X = UnionFindGraph.CANVAS_WIDTH / 2;
UnionFindGraph.FOREST_LABEL_Y = 840;
UnionFindGraph.FOREST_LABEL_X = UnionFindGraph.CANVAS_WIDTH / 2;

UnionFindGraph.GRAPH_EDGE_THICKNESS = 4;
UnionFindGraph.GRAPH_EDGE_COLOR = "#334155";
UnionFindGraph.GRAPH_EDGE_HIGHLIGHT_COLOR = "#f97316";

UnionFindGraph.GRAPH_FILL = "#bfdbfe";
UnionFindGraph.GRAPH_TEXT_COLOR = "#0f172a";
UnionFindGraph.GRAPH_BORDER_COLOR = "#1e3a8a";
UnionFindGraph.GRAPH_HIGHLIGHT_FILL = "#f97316";

UnionFindGraph.FOREST_EDGE_COLOR = "#1f2937";
UnionFindGraph.FOREST_EDGE_THICKNESS = 3;

UnionFindGraph.NEUTRAL_FILL = "#bfdbfe";
UnionFindGraph.STATUS_COLOR = "#0f172a";
UnionFindGraph.DETAIL_COLOR = "#334155";
UnionFindGraph.TITLE_COLOR = "#0f172a";
UnionFindGraph.LABEL_COLOR = "#1e3a8a";

UnionFindGraph.COMPONENT_PALETTE = {
  1: "#fde047",
  0: "#86efac",
};

UnionFindGraph.VERTEX_ORDER = [1, 4, 5, 8, 0, 2, 3, 7, 6];

UnionFindGraph.CODE_SECTION_TOP = 1220;
UnionFindGraph.CODE_LINE_HEIGHT = 36;
UnionFindGraph.CODE_UNION_X = 230;
UnionFindGraph.CODE_FIND_X = 610;
UnionFindGraph.CODE_HEADER_Y = 1180;
UnionFindGraph.CODE_FONT = "bold 22";
UnionFindGraph.CODE_HEADER_FONT = "bold 24";
UnionFindGraph.CODE_STANDARD_COLOR = "#1e3a8a";
UnionFindGraph.CODE_HIGHLIGHT_COLOR = "#ef4444";
UnionFindGraph.CODE_HEADER_COLOR = "#0f172a";
UnionFindGraph.CODE_INDENT = "\u00a0\u00a0\u00a0\u00a0";

UnionFindGraph.UNION_CODE_LINES = [
  ["function union(a, b):"],
  [UnionFindGraph.CODE_INDENT + "rootA = find(a)"],
  [UnionFindGraph.CODE_INDENT + "rootB = find(b)"],
  [UnionFindGraph.CODE_INDENT + "if rootA == rootB: return"],
  [UnionFindGraph.CODE_INDENT + "if rank[rootA] < rank[rootB]: swap"],
  [UnionFindGraph.CODE_INDENT + "parent[rootB] = rootA"],
  [UnionFindGraph.CODE_INDENT + "if ranks equal: rank[rootA]++"],
];

UnionFindGraph.FIND_CODE_LINES = [
  ["function find(x):"],
  [UnionFindGraph.CODE_INDENT + "while parent[x] != x:"],
  [UnionFindGraph.CODE_INDENT + "x = parent[x]"],
  [UnionFindGraph.CODE_INDENT + "return x"],
];

UnionFindGraph.VERTEX_POSITIONS = {
  1: { x: 250, y: 420 },
  5: { x: 350, y: 420 },
  4: { x: 200, y: 520 },
  8: { x: 320, y: 520 },
  0: { x: 640, y: 420 },
  2: { x: 560, y: 520 },
  3: { x: 640, y: 520 },
  7: { x: 720, y: 520 },
  6: { x: 760, y: 620 },
};

UnionFindGraph.FOREST_POSITIONS = {
  1: { x: 300, y: 900 },
  4: { x: 220, y: 1020 },
  5: { x: 300, y: 1020 },
  8: { x: 380, y: 1020 },
  0: { x: 620, y: 900 },
  2: { x: 540, y: 1020 },
  3: { x: 620, y: 1020 },
  7: { x: 700, y: 1020 },
  6: { x: 780, y: 900 },
};

UnionFindGraph.GRAPH_EDGES = [
  { from: 1, to: 5 },
  { from: 5, to: 8 },
  { from: 8, to: 4 },
  { from: 4, to: 1 },
  { from: 0, to: 2 },
  { from: 0, to: 3 },
  { from: 0, to: 7 },
];

UnionFindGraph.UNION_STEPS = [
  {
    a: 1,
    b: 4,
    message: "Start with edge (1, 4) in the left component.",
  },
  {
    a: 1,
    b: 5,
    message: "Attach vertex 5 after confirming its root.",
  },
  {
    a: 5,
    b: 8,
    message:
      "Find(5) climbs to 1 before we bring vertex 8 into the same set.",
  },
  {
    a: 0,
    b: 2,
    message: "Build the right component by connecting 0 and 2.",
  },
  {
    a: 0,
    b: 3,
    message: "Continue expanding the right component with edge (0, 3).",
  },
  {
    a: 0,
    b: 7,
    message: "Finish the component by linking 7 underneath root 0.",
  },
];

UnionFindGraph.prototype.init = function (am, w, h) {
  UnionFindGraph.superclass.init.call(this, am, w, h);

  this.controls = [];
  this.addControls();

  this.graphNodeIDs = {};
  this.forestNodeIDs = {};
  this.parentPointers = {};
  this.parent = {};
  this.rank = {};
  this.vertices = UnionFindGraph.VERTEX_ORDER.slice(0);
  this.isAnimating = false;
  this.unionCodeIDs = [];
  this.findCodeIDs = [];
  this.codeHeaderID = null;
  this.unionHeaderID = null;
  this.findHeaderID = null;

  this.implementAction(this.reset.bind(this), 0);
};

UnionFindGraph.prototype.addControls = function () {
  this.runButton = addControlToAlgorithmBar("Button", "Run Demo");
  this.runButton.onclick = this.runCallback.bind(this);

  this.resetButton = addControlToAlgorithmBar("Button", "Reset Layout");
  this.resetButton.onclick = this.resetCallback.bind(this);

  this.controls.push(this.runButton, this.resetButton);
};

UnionFindGraph.prototype.resetCallback = function () {
  if (this.isAnimating) {
    return;
  }
  this.implementAction(this.reset.bind(this), 0);
};

UnionFindGraph.prototype.runCallback = function () {
  if (this.isAnimating) {
    return;
  }
  this.implementAction(this.runDemo.bind(this), 0);
};

UnionFindGraph.prototype.reset = function () {
  this.nextIndex = 0;
  this.graphNodeIDs = {};
  this.forestNodeIDs = {};
  this.parentPointers = {};
  this.parent = {};
  this.rank = {};
  this.unionCodeIDs = [];
  this.findCodeIDs = [];
  this.codeHeaderID = null;
  this.unionHeaderID = null;
  this.findHeaderID = null;
  this.vertices = UnionFindGraph.VERTEX_ORDER.slice(0);
  this.currentComponentGroups = null;
  this.isAnimating = false;

  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }

  return this.setup();
};

UnionFindGraph.prototype.setup = function () {
  this.commands = [];

  this.createTitleAndLabels();
  this.createGraphNodes();
  this.createForestNodes();
  this.createGraphEdges();
  this.createCodeDisplay();

  this.resetUnionFindState();
  this.updateComponentColors();

  this.setStatus("Click \"Run Demo\" to explore the union-find process.");
  this.setDetail(
    "Graph view (top) shows the edges, the parent pointer view (middle) begins with every vertex as its own parent, and the bottom pseudocode tracks each step."
  );
  this.cmd("Step");

  return this.commands;
};

UnionFindGraph.prototype.createTitleAndLabels = function () {
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Union-Find: Graph and Parent Pointers",
    UnionFindGraph.CANVAS_WIDTH / 2,
    UnionFindGraph.TITLE_Y,
    0
  );
  this.cmd("SetTextStyle", this.titleID, "bold 32");
  this.cmd("SetForegroundColor", this.titleID, UnionFindGraph.TITLE_COLOR);

  this.statusID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.statusID,
    "",
    UnionFindGraph.CANVAS_WIDTH / 2,
    UnionFindGraph.STATUS_Y,
    0
  );
  this.cmd("SetTextStyle", this.statusID, "bold 24");
  this.cmd("SetForegroundColor", this.statusID, UnionFindGraph.STATUS_COLOR);

  this.detailID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.detailID,
    "",
    UnionFindGraph.CANVAS_WIDTH / 2,
    UnionFindGraph.DETAIL_Y,
    0
  );
  this.cmd("SetTextStyle", this.detailID, "bold 20");
  this.cmd("SetForegroundColor", this.detailID, UnionFindGraph.DETAIL_COLOR);

  this.graphLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.graphLabelID,
    "Graph view (top)",
    UnionFindGraph.GRAPH_LABEL_X,
    UnionFindGraph.GRAPH_LABEL_Y,
    0
  );
  this.cmd("SetTextStyle", this.graphLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.graphLabelID, UnionFindGraph.LABEL_COLOR);

  this.forestLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.forestLabelID,
    "Parent pointer view (middle)",
    UnionFindGraph.FOREST_LABEL_X,
    UnionFindGraph.FOREST_LABEL_Y,
    0
  );
  this.cmd("SetTextStyle", this.forestLabelID, "bold 22");
  this.cmd("SetForegroundColor", this.forestLabelID, UnionFindGraph.LABEL_COLOR);
};

UnionFindGraph.prototype.createGraphNodes = function () {
  this.graphNodeIDs = {};
  for (var i = 0; i < this.vertices.length; i++) {
    var vertex = this.vertices[i];
    var pos = UnionFindGraph.VERTEX_POSITIONS[vertex];
    if (!pos) {
      continue;
    }
    var id = this.nextIndex++;
    this.graphNodeIDs[vertex] = id;
    this.cmd("CreateCircle", id, String(vertex), pos.x, pos.y);
    this.cmd("SetBackgroundColor", id, UnionFindGraph.GRAPH_FILL);
    this.cmd("SetForegroundColor", id, UnionFindGraph.GRAPH_BORDER_COLOR);
    this.cmd("SetTextColor", id, UnionFindGraph.GRAPH_TEXT_COLOR);
  }
};

UnionFindGraph.prototype.createForestNodes = function () {
  this.forestNodeIDs = {};
  for (var i = 0; i < this.vertices.length; i++) {
    var vertex = this.vertices[i];
    var pos = UnionFindGraph.FOREST_POSITIONS[vertex];
    if (!pos) {
      continue;
    }
    var id = this.nextIndex++;
    this.forestNodeIDs[vertex] = id;
    this.cmd("CreateCircle", id, String(vertex), pos.x, pos.y);
    this.cmd("SetBackgroundColor", id, UnionFindGraph.GRAPH_FILL);
    this.cmd("SetForegroundColor", id, UnionFindGraph.GRAPH_BORDER_COLOR);
    this.cmd("SetTextColor", id, UnionFindGraph.GRAPH_TEXT_COLOR);
  }
};

UnionFindGraph.prototype.createGraphEdges = function () {
  this.graphEdges = {};
  for (var i = 0; i < UnionFindGraph.GRAPH_EDGES.length; i++) {
    var edge = UnionFindGraph.GRAPH_EDGES[i];
    var fromID = this.graphNodeIDs[edge.from];
    var toID = this.graphNodeIDs[edge.to];
    if (typeof fromID !== "number" || typeof toID !== "number") {
      continue;
    }
    var key = this.edgeKey(edge.from, edge.to);
    this.graphEdges[key] = true;
    this.cmd(
      "Connect",
      fromID,
      toID,
      UnionFindGraph.GRAPH_EDGE_COLOR,
      0,
      0,
      ""
    );
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UnionFindGraph.GRAPH_EDGE_THICKNESS
    );
  }
};

UnionFindGraph.prototype.createCodeDisplay = function () {
  this.codeHeaderID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.codeHeaderID,
    "Union-Find pseudocode",
    UnionFindGraph.CANVAS_WIDTH / 2,
    UnionFindGraph.CODE_HEADER_Y,
    1
  );
  this.cmd("SetTextStyle", this.codeHeaderID, UnionFindGraph.CODE_HEADER_FONT);
  this.cmd("SetForegroundColor", this.codeHeaderID, UnionFindGraph.CODE_HEADER_COLOR);

  this.unionHeaderID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.unionHeaderID,
    "union operation",
    UnionFindGraph.CODE_UNION_X,
    UnionFindGraph.CODE_SECTION_TOP - 30,
    0
  );
  this.cmd("SetTextStyle", this.unionHeaderID, "bold 20");
  this.cmd("SetForegroundColor", this.unionHeaderID, UnionFindGraph.CODE_HEADER_COLOR);

  this.findHeaderID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.findHeaderID,
    "find operation",
    UnionFindGraph.CODE_FIND_X,
    UnionFindGraph.CODE_SECTION_TOP - 30,
    0
  );
  this.cmd("SetTextStyle", this.findHeaderID, "bold 20");
  this.cmd("SetForegroundColor", this.findHeaderID, UnionFindGraph.CODE_HEADER_COLOR);

  var unionIDs = this.addCodeToCanvasBase(
    UnionFindGraph.UNION_CODE_LINES,
    UnionFindGraph.CODE_UNION_X,
    UnionFindGraph.CODE_SECTION_TOP,
    UnionFindGraph.CODE_LINE_HEIGHT,
    UnionFindGraph.CODE_STANDARD_COLOR,
    0,
    0
  );

  this.unionCodeIDs = [];
  for (var i = 0; i < unionIDs.length; i++) {
    var labelID = unionIDs[i][0];
    this.unionCodeIDs.push(labelID);
    this.cmd("SetTextStyle", labelID, UnionFindGraph.CODE_FONT);
  }

  var findIDs = this.addCodeToCanvasBase(
    UnionFindGraph.FIND_CODE_LINES,
    UnionFindGraph.CODE_FIND_X,
    UnionFindGraph.CODE_SECTION_TOP,
    UnionFindGraph.CODE_LINE_HEIGHT,
    UnionFindGraph.CODE_STANDARD_COLOR,
    0,
    0
  );

  this.findCodeIDs = [];
  for (var j = 0; j < findIDs.length; j++) {
    var findLabelID = findIDs[j][0];
    this.findCodeIDs.push(findLabelID);
    this.cmd("SetTextStyle", findLabelID, UnionFindGraph.CODE_FONT);
  }

  this.setCodeHighlight("union", -1);
  this.setCodeHighlight("find", -1);
};

UnionFindGraph.prototype.edgeKey = function (a, b) {
  var min = Math.min(a, b);
  var max = Math.max(a, b);
  return min + "-" + max;
};

UnionFindGraph.prototype.resetUnionFindState = function () {
  if (!this.parentPointers) {
    this.parentPointers = {};
  }
  for (var childKey in this.parentPointers) {
    if (!this.parentPointers.hasOwnProperty(childKey)) {
      continue;
    }
    var parent = this.parentPointers[childKey];
    var child = parseInt(childKey, 10);
    var parentID = this.forestNodeIDs[parent];
    var childID = this.forestNodeIDs[child];
    if (typeof parentID === "number" && typeof childID === "number") {
      this.cmd("Disconnect", parentID, childID);
    }
  }

  this.parentPointers = {};
  this.parent = {};
  this.rank = {};
  this.clearCodeHighlights();

  for (var i = 0; i < this.vertices.length; i++) {
    var vertex = this.vertices[i];
    this.parent[vertex] = vertex;
    this.rank[vertex] = 0;
    var forestID = this.forestNodeIDs[vertex];
    if (typeof forestID === "number") {
      this.cmd("SetHighlight", forestID, 0);
    }
  }
};

UnionFindGraph.prototype.runDemo = function () {
  this.commands = [];

  this.resetUnionFindState();
  this.updateComponentColors();

  this.setStatus("Starting union-find demonstration.");
  this.setDetail("Each union begins with a pair of find operations.");
  this.cmd("Step");

  for (var i = 0; i < UnionFindGraph.UNION_STEPS.length; i++) {
    this.processUnionStep(UnionFindGraph.UNION_STEPS[i]);
  }

  this.setStatus("All unions processed.");
  this.setDetail(
    "The parent pointer view now mirrors the two graph components that remain disconnected."
  );
  this.cmd("Step");

  return this.commands;
};

UnionFindGraph.prototype.processUnionStep = function (step) {
  var a = step.a;
  var b = step.b;
  this.setStatus("union(" + a + ", " + b + ")");
  this.setDetail(step.message || "");
  this.setCodeHighlight("union", 0);
  this.highlightGraphEdge(a, b, true);
  this.highlightGraphNodes([a, b], true);
  this.cmd("Step");

  this.setCodeHighlight("union", 1);
  this.setDetail("Run find(" + a + ") to locate its root.");
  var rootA = this.animateFind(a);
  this.setDetail("Root of " + a + " is " + rootA + ".");
  this.cmd("Step");

  this.setCodeHighlight("union", 2);
  this.setDetail("Run find(" + b + ") to locate its root.");
  var rootB = this.animateFind(b);
  this.setDetail("Root of " + b + " is " + rootB + ".");
  this.cmd("Step");

  this.setCodeHighlight("union", 3);
  if (rootA === rootB) {
    this.setDetail(
      "Both vertices already share root " + rootA + ", so we skip the union."
    );
    this.cmd("Step");
    this.setCodeHighlight("union", -1);
  } else {
    this.setDetail(
      "Roots differ (" + rootA + " vs " + rootB + "), so compare their ranks."
    );
    this.cmd("Step");
    this.setCodeHighlight("union", 4);
    this.cmd("Step");
    var info = this.unionRoots(rootA, rootB);
    this.setDetail(info.message);
    this.cmd("Step");
    this.setCodeHighlight("union", -1);
  }

  this.updateComponentColors();
  this.highlightGraphNodes([a, b], false);
  this.highlightGraphEdge(a, b, false);
  this.cmd("Step");
};

UnionFindGraph.prototype.animateFind = function (start) {
  var path = [];
  var current = start;
  this.setCodeHighlight("find", 0);
  this.cmd("Step");

  while (typeof current === "number") {
    this.setCodeHighlight("find", 1);
    this.cmd("Step");

    path.push(current);
    if (this.parent[current] === current) {
      break;
    }

    this.setCodeHighlight("find", 2);
    this.cmd("Step");
    current = this.parent[current];
  }

  this.setCodeHighlight("find", 3);
  this.cmd("Step");

  for (var i = 0; i < path.length; i++) {
    var node = path[i];
    this.highlightForestNode(node, true);
    if (i > 0) {
      var parent = path[i];
      var child = path[i - 1];
      this.highlightForestEdge(parent, child, true);
    }
    this.cmd("Step");
  }

  var root = path[path.length - 1];

  for (var j = path.length - 1; j >= 0; j--) {
    var nodeToClear = path[j];
    this.highlightForestNode(nodeToClear, false);
    if (j > 0) {
      var parentNode = path[j];
      var childNode = path[j - 1];
      this.highlightForestEdge(parentNode, childNode, false);
    }
  }

  this.setCodeHighlight("find", -1);

  return root;
};

UnionFindGraph.prototype.unionRoots = function (rootA, rootB) {
  var rankA = this.rank[rootA];
  var rankB = this.rank[rootB];
  var parent = rootA;
  var child = rootB;
  var message = "";
  var increaseRank = false;

  if (rankA > rankB) {
    message =
      "Root " +
      rootA +
      " has higher rank, so it stays on top and " +
      rootB +
      " becomes its child.";
  } else if (rankB > rankA) {
    parent = rootB;
    child = rootA;
    message =
      "Root " +
      rootB +
      " has higher rank, so it stays on top and " +
      rootA +
      " becomes its child.";
  } else {
    if (rootA <= rootB) {
      parent = rootA;
      child = rootB;
    } else {
      parent = rootB;
      child = rootA;
    }
    increaseRank = true;
    message =
      "Ranks match, so we choose root " +
      parent +
      " as the parent and increase its rank.";
  }

  this.setCodeHighlight("union", 5);
  this.parent[child] = parent;
  this.parentPointers[child] = parent;

  var parentID = this.forestNodeIDs[parent];
  var childID = this.forestNodeIDs[child];
  if (typeof parentID === "number" && typeof childID === "number") {
    this.cmd(
      "Connect",
      parentID,
      childID,
      UnionFindGraph.FOREST_EDGE_COLOR,
      0,
      1,
      ""
    );
    this.cmd(
      "SetEdgeThickness",
      parentID,
      childID,
      UnionFindGraph.FOREST_EDGE_THICKNESS
    );
    this.highlightForestEdge(parent, child, true);
    this.highlightForestNode(parent, true);
    this.highlightForestNode(child, true);
  }

  this.cmd("Step");

  if (typeof parentID === "number" && typeof childID === "number") {
    this.highlightForestEdge(parent, child, false);
    this.highlightForestNode(parent, false);
    this.highlightForestNode(child, false);
  }

  if (increaseRank) {
    this.setCodeHighlight("union", 6);
    this.rank[parent]++;
    this.cmd("Step");
  }

  return { parent: parent, child: child, message: message };
};

UnionFindGraph.prototype.highlightForestNode = function (vertex, active) {
  var id = this.forestNodeIDs[vertex];
  if (typeof id !== "number") {
    return;
  }
  this.cmd("SetHighlight", id, active ? 1 : 0);
};

UnionFindGraph.prototype.highlightForestEdge = function (parent, child, active) {
  var parentID = this.forestNodeIDs[parent];
  var childID = this.forestNodeIDs[child];
  if (typeof parentID !== "number" || typeof childID !== "number") {
    return;
  }
  this.cmd(
    "SetEdgeHighlight",
    parentID,
    childID,
    active ? 1 : 0
  );
  this.cmd(
    "SetEdgeThickness",
    parentID,
    childID,
    active
      ? UnionFindGraph.FOREST_EDGE_THICKNESS + 1
      : UnionFindGraph.FOREST_EDGE_THICKNESS
  );
};

UnionFindGraph.prototype.highlightGraphNodes = function (nodes, active) {
  if (!nodes) {
    return;
  }
  for (var i = 0; i < nodes.length; i++) {
    var vertex = nodes[i];
    var id = this.graphNodeIDs[vertex];
    if (typeof id !== "number") {
      continue;
    }
    if (active) {
      this.cmd("SetBackgroundColor", id, UnionFindGraph.GRAPH_HIGHLIGHT_FILL);
      this.cmd("SetTextColor", id, UnionFindGraph.GRAPH_TEXT_COLOR);
      this.cmd("SetHighlight", id, 1);
    } else {
      var fill = this.resolveFillColor(vertex);
      this.cmd("SetBackgroundColor", id, fill);
      this.cmd("SetTextColor", id, UnionFindGraph.GRAPH_TEXT_COLOR);
      this.cmd("SetHighlight", id, 0);
    }
  }
};

UnionFindGraph.prototype.highlightGraphEdge = function (a, b, active) {
  var fromID = this.graphNodeIDs[a];
  var toID = this.graphNodeIDs[b];
  if (typeof fromID !== "number" || typeof toID !== "number") {
    return;
  }
  var color = active
    ? UnionFindGraph.GRAPH_EDGE_HIGHLIGHT_COLOR
    : UnionFindGraph.GRAPH_EDGE_COLOR;
  var thickness = active
    ? UnionFindGraph.GRAPH_EDGE_THICKNESS + 2
    : UnionFindGraph.GRAPH_EDGE_THICKNESS;
  this.cmd("SetEdgeColor", fromID, toID, color);
  this.cmd("SetEdgeThickness", fromID, toID, thickness);
  this.cmd("SetEdgeHighlight", fromID, toID, active ? 1 : 0);
};

UnionFindGraph.prototype.findStatic = function (vertex) {
  var current = vertex;
  while (this.parent[current] !== current) {
    current = this.parent[current];
  }
  return current;
};

UnionFindGraph.prototype.resolveFillColor = function (vertex, groups) {
  var map = groups || this.currentComponentGroups;
  var root = this.findStatic(vertex);
  var group = map && map[root] ? map[root] : null;
  var size = group ? group.length : 1;
  var palette = UnionFindGraph.COMPONENT_PALETTE[root];
  if (palette && size > 1) {
    return palette;
  }
  return UnionFindGraph.NEUTRAL_FILL;
};

UnionFindGraph.prototype.updateComponentColors = function () {
  var groups = {};
  for (var i = 0; i < this.vertices.length; i++) {
    var vertex = this.vertices[i];
    var root = this.findStatic(vertex);
    if (!groups[root]) {
      groups[root] = [];
    }
    groups[root].push(vertex);
  }
  this.currentComponentGroups = groups;

  for (var j = 0; j < this.vertices.length; j++) {
    var node = this.vertices[j];
    var fill = this.resolveFillColor(node, groups);
    var graphID = this.graphNodeIDs[node];
    var forestID = this.forestNodeIDs[node];
    if (typeof graphID === "number") {
      this.cmd("SetBackgroundColor", graphID, fill);
      this.cmd("SetTextColor", graphID, UnionFindGraph.GRAPH_TEXT_COLOR);
      this.cmd("SetForegroundColor", graphID, UnionFindGraph.GRAPH_BORDER_COLOR);
    }
    if (typeof forestID === "number") {
      this.cmd("SetBackgroundColor", forestID, fill);
      this.cmd("SetTextColor", forestID, UnionFindGraph.GRAPH_TEXT_COLOR);
      this.cmd(
        "SetForegroundColor",
        forestID,
        UnionFindGraph.GRAPH_BORDER_COLOR
      );
    }
  }
};

UnionFindGraph.prototype.setCodeHighlight = function (section, index) {
  var targets = section === "union" ? this.unionCodeIDs : this.findCodeIDs;
  if (!targets) {
    return;
  }
  for (var i = 0; i < targets.length; i++) {
    var id = targets[i];
    if (typeof id !== "number") {
      continue;
    }
    var color = i === index
      ? UnionFindGraph.CODE_HIGHLIGHT_COLOR
      : UnionFindGraph.CODE_STANDARD_COLOR;
    this.cmd("SetForegroundColor", id, color);
  }
};

UnionFindGraph.prototype.clearCodeHighlights = function () {
  this.setCodeHighlight("union", -1);
  this.setCodeHighlight("find", -1);
};

UnionFindGraph.prototype.setStatus = function (text) {
  if (typeof this.statusID === "number") {
    this.cmd("SetText", this.statusID, text || "");
  }
};

UnionFindGraph.prototype.setDetail = function (text) {
  if (typeof this.detailID === "number") {
    this.cmd("SetText", this.detailID, text || "");
  }
};

UnionFindGraph.prototype.disableUI = function () {
  this.isAnimating = true;
  if (!this.controls) {
    return;
  }
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

UnionFindGraph.prototype.enableUI = function () {
  this.isAnimating = false;
  if (!this.controls) {
    return;
  }
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new UnionFindGraph(animManag, canvas.width, canvas.height);
}
