function UnionFindGraph(am, w, h) {
  this.init(am, w, h);
}

UnionFindGraph.prototype = new Algorithm();
UnionFindGraph.prototype.constructor = UnionFindGraph;
UnionFindGraph.superclass = Algorithm.prototype;

UnionFindGraph.CANVAS_WIDTH = 900;
UnionFindGraph.CANVAS_HEIGHT = 1600;

UnionFindGraph.TITLE_Y = 90;
UnionFindGraph.STATUS_Y = 180;
UnionFindGraph.DETAIL_Y = 230;
UnionFindGraph.GRAPH_CENTER_Y = 530;
UnionFindGraph.FOREST_TOP_Y = 820;
UnionFindGraph.FOREST_LEVEL_HEIGHT = 110;
UnionFindGraph.FOREST_VIEW_WIDTH = 560;
UnionFindGraph.FOREST_HORIZONTAL_SPACING = 95;
UnionFindGraph.GRAPH_HORIZONTAL_SPACING = 90;
UnionFindGraph.GRAPH_COMPONENT_GAP_SLOTS = 2;

UnionFindGraph.GRAPH_EDGE_THICKNESS = 4;
UnionFindGraph.GRAPH_EDGE_COLOR = "#334155";
UnionFindGraph.GRAPH_EDGE_HIGHLIGHT_COLOR = "#f97316";

UnionFindGraph.GRAPH_FILL = "#bfdbfe";
UnionFindGraph.GRAPH_TEXT_COLOR = "#0f172a";
UnionFindGraph.GRAPH_BORDER_COLOR = "#1e3a8a";
UnionFindGraph.GRAPH_HIGHLIGHT_FILL = "#f97316";

UnionFindGraph.FOREST_EDGE_COLOR = "#1f2937";
UnionFindGraph.FOREST_EDGE_THICKNESS = 3;
UnionFindGraph.FOREST_EDGE_CURVE = -0.2;

UnionFindGraph.POINTER_HIGHLIGHT_COLOR = "#facc15";
UnionFindGraph.POINTER_HIGHLIGHT_RADIUS = 22;
UnionFindGraph.UNION_PATH_HIGHLIGHT_RADIUS = 20;
UnionFindGraph.UNION_PATH_EXTRA_THICKNESS = 2;

UnionFindGraph.NEUTRAL_FILL = "#bfdbfe";
UnionFindGraph.STATUS_COLOR = "#0f172a";
UnionFindGraph.DETAIL_COLOR = "#334155";
UnionFindGraph.TITLE_COLOR = "#0f172a";

UnionFindGraph.COMPONENT_PALETTE = {
  1: "#fde047",
  0: "#86efac",
};

UnionFindGraph.VERTEX_ORDER = [1, 4, 5, 8, 0, 2, 3, 7, 6];

UnionFindGraph.UNION_COMPONENT_PATHS = {
  1: [
    { from: 1, to: 5 },
    { from: 5, to: 8 },
    { from: 8, to: 4 },
    { from: 4, to: 1 },
  ],
  0: [
    { from: 0, to: 2 },
    { from: 0, to: 3 },
    { from: 0, to: 7 },
    { from: 0, to: 2 },
  ],
};

UnionFindGraph.CODE_SECTION_TOP = 1270;
UnionFindGraph.CODE_LINE_HEIGHT = 36;
UnionFindGraph.CODE_UNION_X = UnionFindGraph.CANVAS_WIDTH / 2 - 150;
UnionFindGraph.CODE_FIND_X = UnionFindGraph.CANVAS_WIDTH / 2 + 150;
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

UnionFindGraph.GRAPH_CENTER_X = UnionFindGraph.CANVAS_WIDTH / 2;
UnionFindGraph.FOREST_CENTER_X = UnionFindGraph.CANVAS_WIDTH / 2;

UnionFindGraph.VERTEX_POSITIONS = (function () {
  var centerX = UnionFindGraph.GRAPH_CENTER_X;
  var baseY = UnionFindGraph.GRAPH_CENTER_Y;

  return {
    1: { x: centerX - 260, y: baseY - 60 },
    5: { x: centerX - 180, y: baseY - 60 },
    4: { x: centerX - 260, y: baseY + 20 },
    8: { x: centerX - 180, y: baseY + 20 },
    0: { x: centerX + 10, y: baseY - 70 },
    2: { x: centerX - 70, y: baseY + 30 },
    3: { x: centerX + 10, y: baseY + 30 },
    7: { x: centerX + 90, y: baseY + 30 },
    6: { x: centerX + 260, y: baseY - 20 },
  };
})();

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
  this.forestPositions = {};
  this.forestRevealed = {};
  this.parentPointers = {};
  this.parent = {};
  this.rank = {};
  this.vertices = UnionFindGraph.VERTEX_ORDER.slice(0);
  this.isAnimating = false;
  this.unionCodeIDs = [];
  this.findCodeIDs = [];
  this.unionHeaderID = null;
  this.findHeaderID = null;
  this.currentDetailText = "";

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
  this.forestPositions = {};
  this.forestRevealed = {};
  this.parentPointers = {};
  this.parent = {};
  this.rank = {};
  this.unionCodeIDs = [];
  this.findCodeIDs = [];
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
    "Graph stays centered with parent pointers forming beneath it as arrows move from each child up to its parent."
  );
  this.cmd("Step");

  return this.commands;
};

UnionFindGraph.prototype.createTitleAndLabels = function () {
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Union Find Algorithm",
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
  this.forestPositions = {};
  if (!this.forestRevealed) {
    this.forestRevealed = {};
  }
  var layout = this.computeForestLayoutPositions();
  for (var i = 0; i < this.vertices.length; i++) {
    var vertex = this.vertices[i];
    var pos = layout[vertex];
    if (!pos) {
      continue;
    }
    var start = UnionFindGraph.VERTEX_POSITIONS[vertex] || pos;
    var id = this.nextIndex++;
    this.forestNodeIDs[vertex] = id;
    this.forestRevealed[vertex] = false;
    this.cmd("CreateCircle", id, String(vertex), start.x, start.y);
    this.cmd("SetBackgroundColor", id, UnionFindGraph.GRAPH_FILL);
    this.cmd("SetForegroundColor", id, UnionFindGraph.GRAPH_BORDER_COLOR);
    this.cmd("SetTextColor", id, UnionFindGraph.GRAPH_TEXT_COLOR);
    this.cmd("SetHighlight", id, 0);
    this.cmd("SetAlpha", id, 0);
    this.forestPositions[vertex] = { x: pos.x, y: pos.y };
  }
};

UnionFindGraph.prototype.hideAllForestNodes = function () {
  if (!this.forestNodeIDs) {
    return;
  }
  this.forestRevealed = {};
  for (var i = 0; i < this.vertices.length; i++) {
    var vertex = this.vertices[i];
    this.forestRevealed[vertex] = false;
    var id = this.forestNodeIDs[vertex];
    if (typeof id !== "number") {
      continue;
    }
    var start = UnionFindGraph.VERTEX_POSITIONS[vertex];
    if (!start) {
      start = {
        x: UnionFindGraph.GRAPH_CENTER_X,
        y: UnionFindGraph.GRAPH_CENTER_Y,
      };
    }
    this.cmd("Move", id, start.x, start.y);
    this.cmd("SetAlpha", id, 0);
    this.cmd("SetHighlight", id, 0);
  }
};

UnionFindGraph.prototype.ensureForestNodeVisible = function (
  vertex,
  dropMessage
) {
  if (!this.forestNodeIDs) {
    return false;
  }
  if (!this.forestRevealed) {
    this.forestRevealed = {};
  }
  if (this.forestRevealed[vertex]) {
    return false;
  }
  var id = this.forestNodeIDs[vertex];
  if (typeof id !== "number") {
    return false;
  }
  if (!this.forestPositions) {
    this.forestPositions = {};
  }
  var pos = this.forestPositions[vertex];
  if (!pos) {
    var fallback = UnionFindGraph.VERTEX_POSITIONS[vertex] || {
      x: UnionFindGraph.FOREST_CENTER_X,
      y: UnionFindGraph.FOREST_TOP_Y,
    };
    pos = { x: fallback.x, y: fallback.y };
    this.forestPositions[vertex] = pos;
  }
  var previousDetail = this.currentDetailText || "";
  if (typeof dropMessage === "string" && dropMessage.length > 0) {
    this.setDetail(dropMessage);
  }
  this.cmd("SetAlpha", id, 1);
  this.cmd("Move", id, pos.x, pos.y);
  this.cmd("Step");
  this.forestRevealed[vertex] = true;
  if (typeof dropMessage === "string" && dropMessage.length > 0) {
    this.setDetail(previousDetail);
  }
  return true;
};

UnionFindGraph.prototype.computeForestLayoutPositions = function () {
  var parentMap = {};
  for (var i = 0; i < this.vertices.length; i++) {
    var vertex = this.vertices[i];
    if (this.parent && typeof this.parent[vertex] === "number") {
      parentMap[vertex] = this.parent[vertex];
    } else {
      parentMap[vertex] = vertex;
    }
  }

  var childrenMap = {};
  for (var j = 0; j < this.vertices.length; j++) {
    var v = this.vertices[j];
    childrenMap[v] = [];
  }

  for (var childKey in parentMap) {
    if (!parentMap.hasOwnProperty(childKey)) {
      continue;
    }
    var child = parseInt(childKey, 10);
    var parent = parentMap[child];
    if (parent !== child && childrenMap[parent]) {
      childrenMap[parent].push(child);
    }
  }

  for (var key in childrenMap) {
    if (childrenMap.hasOwnProperty(key)) {
      childrenMap[key].sort(function (a, b) {
        return a - b;
      });
    }
  }

  var roots = [];
  for (var r = 0; r < this.vertices.length; r++) {
    var node = this.vertices[r];
    if (parentMap[node] === node) {
      roots.push(node);
    }
  }
  roots.sort(function (a, b) {
    return a - b;
  });

  var widths = {};
  function computeWidth(target) {
    if (widths[target]) {
      return widths[target];
    }
    var kids = childrenMap[target] || [];
    if (!kids.length) {
      widths[target] = 1;
      return 1;
    }
    var sum = 0;
    for (var idx = 0; idx < kids.length; idx++) {
      sum += computeWidth(kids[idx]);
    }
    widths[target] = Math.max(1, sum);
    return widths[target];
  }

  var totalUnits = 0;
  for (var rootIndex = 0; rootIndex < roots.length; rootIndex++) {
    totalUnits += computeWidth(roots[rootIndex]);
  }
  if (totalUnits === 0) {
    totalUnits = this.vertices.length || 1;
  }

  var spacing = UnionFindGraph.FOREST_HORIZONTAL_SPACING;
  var maxWidth = UnionFindGraph.FOREST_VIEW_WIDTH;
  if (totalUnits > 0) {
    var constrained = maxWidth / totalUnits;
    if (constrained < spacing) {
      spacing = constrained;
    }
  }

  var layout = {};
  var currentUnits = 0;
  function assignPosition(target, centerX, depth) {
    var y =
      UnionFindGraph.FOREST_TOP_Y + depth * UnionFindGraph.FOREST_LEVEL_HEIGHT;
    layout[target] = { x: centerX, y: y };
    var kids = childrenMap[target] || [];
    if (!kids.length) {
      return;
    }
    var totalChildUnits = 0;
    for (var k = 0; k < kids.length; k++) {
      totalChildUnits += widths[kids[k]] || 1;
    }
    var consumed = 0;
    for (var c = 0; c < kids.length; c++) {
      var childNode = kids[c];
      var childWidth = widths[childNode] || 1;
      var offset =
        (consumed + childWidth / 2 - totalChildUnits / 2) * spacing;
      assignPosition(childNode, centerX + offset, depth + 1);
      consumed += childWidth;
    }
  }

  for (var rootIdx = 0; rootIdx < roots.length; rootIdx++) {
    var rootNode = roots[rootIdx];
    var rootWidth = widths[rootNode] || 1;
    var offset =
      currentUnits + rootWidth / 2 - totalUnits / 2;
    var centerX = UnionFindGraph.FOREST_CENTER_X + offset * spacing;
    assignPosition(rootNode, centerX, 0);
    currentUnits += rootWidth;
  }

  for (var check = 0; check < this.vertices.length; check++) {
    var vertexCheck = this.vertices[check];
    if (!layout[vertexCheck]) {
      layout[vertexCheck] = {
        x: UnionFindGraph.FOREST_CENTER_X,
        y: UnionFindGraph.FOREST_TOP_Y + UnionFindGraph.FOREST_LEVEL_HEIGHT,
      };
    }
  }

  return layout;
};

UnionFindGraph.prototype.applyForestLayout = function () {
  var layout = this.computeForestLayoutPositions();
  this.forestPositions = {};
  for (var i = 0; i < this.vertices.length; i++) {
    var vertex = this.vertices[i];
    var id = this.forestNodeIDs[vertex];
    var pos = layout[vertex];
    if (!pos) {
      continue;
    }
    this.forestPositions[vertex] = { x: pos.x, y: pos.y };
    if (
      !this.forestRevealed ||
      !this.forestRevealed[vertex] ||
      typeof id !== "number"
    ) {
      continue;
    }
    this.cmd("Move", id, pos.x, pos.y);
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
      this.cmd("Disconnect", childID, parentID);
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
  }

  this.hideAllForestNodes();

  this.applyForestLayout();
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
    "Child-to-parent arrows beneath the graph now show the remaining disconnected components."
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

  this.highlightForestNode(rootA, false);
  this.highlightForestNode(rootB, false);
  this.highlightGraphNodes([rootA], false);
  this.highlightGraphNodes([rootB], false);

  this.updateComponentColors();
  this.highlightGraphNodes([a, b], false);
  this.highlightGraphEdge(a, b, false);
  this.cmd("Step");
};

UnionFindGraph.prototype.animateFind = function (start) {
  var current = start;
  var path = [];
  var traversed = [];

  this.setCodeHighlight("find", 0);
  this.cmd("Step");

  while (true) {
    this.setCodeHighlight("find", 1);
    this.cmd("Step");

    path.push(current);
    this.highlightForestNode(current, true);
    this.highlightGraphNodes([current], true);

    if (this.parent[current] === current) {
      break;
    }

    this.setCodeHighlight("find", 2);
    this.cmd("Step");

    var parent = this.parent[current];
    this.highlightForestNode(parent, true);
    this.highlightGraphNodes([parent], true);
    this.highlightForestEdge(parent, current, true);
    traversed.push({ parent: parent, child: current });
    this.cmd("Step");

    this.highlightForestNode(current, false);
    this.highlightGraphNodes([current], false);
    current = parent;
  }

  this.setCodeHighlight("find", 3);
  this.cmd("Step");

  var root = current;

  for (var i = 0; i < traversed.length; i++) {
    var edge = traversed[i];
    this.highlightForestEdge(edge.parent, edge.child, false);
  }

  for (var j = 0; j < path.length; j++) {
    var node = path[j];
    if (node !== root) {
      this.highlightForestNode(node, false);
      this.highlightGraphNodes([node], false);
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
      " has higher rank, so it remains the parent and " +
      rootB +
      " becomes its child.";
  } else if (rankB > rankA) {
    parent = rootB;
    child = rootA;
    message =
      "Root " +
      rootB +
      " has higher rank, so it remains the parent and " +
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

  message +=
    " Watch the child arrow travel upward to its parent as the pointer view below the graph rearranges.";
  message +=
    " On the graph, follow the highlighted loop that traces the component just like the reference animation.";

  this.setCodeHighlight("union", 5);
  var previousParent = this.parentPointers[child];
  this.parent[child] = parent;
  this.parentPointers[child] = parent;

  this.ensureForestNodeVisible(
    parent,
    "Drop vertex " +
      parent +
      " beneath the graph so we can show it in the parent-pointer view."
  );
  this.ensureForestNodeVisible(
    child,
    "Move vertex " +
      child +
      " below the graph and connect it to its new parent."
  );

  var parentID = this.forestNodeIDs[parent];
  var childID = this.forestNodeIDs[child];
  if (typeof parentID === "number" && typeof childID === "number") {
    if (
      typeof previousParent === "number" &&
      previousParent !== parent &&
      typeof this.forestNodeIDs[previousParent] === "number"
    ) {
      this.cmd("Disconnect", childID, this.forestNodeIDs[previousParent]);
    }
    if (previousParent !== parent) {
      this.cmd(
        "Connect",
        childID,
        parentID,
        UnionFindGraph.FOREST_EDGE_COLOR,
        UnionFindGraph.FOREST_EDGE_CURVE,
        1,
        ""
      );
    }
    this.cmd(
      "SetEdgeThickness",
      childID,
      parentID,
      UnionFindGraph.FOREST_EDGE_THICKNESS
    );
    this.cmd(
      "SetEdgeColor",
      childID,
      parentID,
      UnionFindGraph.FOREST_EDGE_COLOR
    );
    this.animatePointerAssignment(child, parent);
    this.highlightForestEdge(parent, child, true);
    this.highlightForestNode(parent, true);
    this.highlightForestNode(child, true);
  }

  this.animateUnionCycle(parent);

  this.applyForestLayout();

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

UnionFindGraph.prototype.animateUnionCycle = function (root) {
  var segments = UnionFindGraph.UNION_COMPONENT_PATHS[root];
  if (!segments || !segments.length) {
    return;
  }

  var startSegment = segments[0];
  var startPos = UnionFindGraph.VERTEX_POSITIONS[startSegment.from];
  if (!startPos) {
    return;
  }

  var highlightID = this.nextIndex++;
  this.cmd(
    "CreateHighlightCircle",
    highlightID,
    UnionFindGraph.GRAPH_EDGE_HIGHLIGHT_COLOR,
    startPos.x,
    startPos.y,
    UnionFindGraph.UNION_PATH_HIGHLIGHT_RADIUS
  );
  this.cmd("Step");

  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    var from = segment.from;
    var to = segment.to;
    var fromID = this.graphNodeIDs[from];
    var toID = this.graphNodeIDs[to];
    var fromPos = UnionFindGraph.VERTEX_POSITIONS[from];
    var toPos = UnionFindGraph.VERTEX_POSITIONS[to];
    if (
      typeof fromID !== "number" ||
      typeof toID !== "number" ||
      !fromPos ||
      !toPos
    ) {
      continue;
    }

    this.cmd("Move", highlightID, fromPos.x, fromPos.y);
    this.cmd("Step");

    this.cmd("SetEdgeColor", fromID, toID, UnionFindGraph.GRAPH_EDGE_HIGHLIGHT_COLOR);
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UnionFindGraph.GRAPH_EDGE_THICKNESS + UnionFindGraph.UNION_PATH_EXTRA_THICKNESS
    );
    this.cmd("SetEdgeHighlight", fromID, toID, 1);

    this.cmd("Move", highlightID, toPos.x, toPos.y);
    this.cmd("Step");

    this.cmd("SetEdgeHighlight", fromID, toID, 0);
    this.cmd("SetEdgeColor", fromID, toID, UnionFindGraph.GRAPH_EDGE_COLOR);
    this.cmd(
      "SetEdgeThickness",
      fromID,
      toID,
      UnionFindGraph.GRAPH_EDGE_THICKNESS
    );
  }

  this.cmd("Delete", highlightID);
  this.cmd("Step");
};

UnionFindGraph.prototype.animatePointerAssignment = function (child, parent) {
  var childPos = this.forestPositions[child];
  var parentPos = this.forestPositions[parent];
  if (
    !childPos ||
    !parentPos ||
    !this.forestRevealed ||
    !this.forestRevealed[child] ||
    !this.forestRevealed[parent]
  ) {
    return;
  }
  var highlightID = this.nextIndex++;
  this.cmd(
    "CreateHighlightCircle",
    highlightID,
    UnionFindGraph.POINTER_HIGHLIGHT_COLOR,
    childPos.x,
    childPos.y,
    UnionFindGraph.POINTER_HIGHLIGHT_RADIUS
  );
  this.cmd("Move", highlightID, parentPos.x, parentPos.y);
  this.cmd("Step");
  this.cmd("Delete", highlightID);
};

UnionFindGraph.prototype.highlightForestNode = function (vertex, active) {
  var id = this.forestNodeIDs[vertex];
  if (
    typeof id !== "number" ||
    !this.forestRevealed ||
    !this.forestRevealed[vertex]
  ) {
    return;
  }
  this.cmd("SetHighlight", id, active ? 1 : 0);
};

UnionFindGraph.prototype.highlightForestEdge = function (parent, child, active) {
  var parentID = this.forestNodeIDs[parent];
  var childID = this.forestNodeIDs[child];
  if (
    typeof parentID !== "number" ||
    typeof childID !== "number" ||
    !this.forestRevealed ||
    !this.forestRevealed[parent] ||
    !this.forestRevealed[child]
  ) {
    return;
  }
  this.cmd(
    "SetEdgeHighlight",
    childID,
    parentID,
    active ? 1 : 0
  );
  this.cmd(
    "SetEdgeThickness",
    childID,
    parentID,
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
  this.currentDetailText = text || "";
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
