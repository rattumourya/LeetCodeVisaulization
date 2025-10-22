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
UnionFindGraph.FOREST_SIBLING_OFFSET = 45;
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
UnionFindGraph.FOREST_EDGE_CURVE = 0;

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
UnionFindGraph.CODE_SECTION_CENTER_X = UnionFindGraph.CANVAS_WIDTH / 2;
UnionFindGraph.CODE_COLUMN_OFFSET = 190;
UnionFindGraph.CODE_UNION_X =
  UnionFindGraph.CODE_SECTION_CENTER_X - UnionFindGraph.CODE_COLUMN_OFFSET;
UnionFindGraph.CODE_FIND_X =
  UnionFindGraph.CODE_SECTION_CENTER_X + UnionFindGraph.CODE_COLUMN_OFFSET;
UnionFindGraph.CODE_HEADER_Y = UnionFindGraph.CODE_SECTION_TOP - 40;
UnionFindGraph.CODE_FONT = "bold 22";
UnionFindGraph.CODE_HEADER_FONT = "bold 24";
UnionFindGraph.CODE_STANDARD_COLOR = "#1e3a8a";
UnionFindGraph.CODE_HIGHLIGHT_COLOR = "#ef4444";
UnionFindGraph.CODE_HEADER_COLOR = "#0f172a";
UnionFindGraph.CODE_INDENT = "\u00a0\u00a0\u00a0\u00a0";
UnionFindGraph.CODE_INDENT_DOUBLE =
  UnionFindGraph.CODE_INDENT + UnionFindGraph.CODE_INDENT;

UnionFindGraph.JAVA_FIND_LINES = [
  ["int find(int x) {"],
  [UnionFindGraph.CODE_INDENT + "while (parent[x] != x) {"],
  [UnionFindGraph.CODE_INDENT_DOUBLE + "x = parent[x];"],
  [UnionFindGraph.CODE_INDENT + "}"],
  [UnionFindGraph.CODE_INDENT + "return x;"],
  ["}"]
];

UnionFindGraph.JAVA_UNION_LINES = [
  ["void union(int a, int b) {"],
  [UnionFindGraph.CODE_INDENT + "int rootA = find(a);"],
  [UnionFindGraph.CODE_INDENT + "int rootB = find(b);"],
  [UnionFindGraph.CODE_INDENT + "if (rootA == rootB) return;"],
  [UnionFindGraph.CODE_INDENT + "if (rank[rootA] < rank[rootB]) {"],
  [UnionFindGraph.CODE_INDENT_DOUBLE + "int tmp = rootA;"],
  [UnionFindGraph.CODE_INDENT_DOUBLE + "rootA = rootB;"],
  [UnionFindGraph.CODE_INDENT_DOUBLE + "rootB = tmp;"],
  [UnionFindGraph.CODE_INDENT + "}"],
  [UnionFindGraph.CODE_INDENT + "parent[rootB] = rootA;"],
  [UnionFindGraph.CODE_INDENT + "if (rank[rootA] == rank[rootB]) {"],
  [UnionFindGraph.CODE_INDENT_DOUBLE + "rank[rootA]++;"],
  [UnionFindGraph.CODE_INDENT + "}"],
  ["}"]
];

UnionFindGraph.JAVA_FIND_INDEX_MAP = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

UnionFindGraph.JAVA_UNION_INDEX_MAP = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 6,
  15: 7,
  16: 8,
  17: 9,
  18: 10,
  19: 11,
  20: 12,
  21: 13,
};

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
  this.javaUnionHeaderID = null;
  this.javaFindHeaderID = null;
  this.javaCodeIDs = [];
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
  this.vertices = UnionFindGraph.VERTEX_ORDER.slice(0);
  this.currentComponentGroups = null;
  this.isAnimating = false;
  this.javaUnionHeaderID = null;
  this.javaFindHeaderID = null;
  this.javaCodeIDs = [];

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
    var start = pos;
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
    var finalPos = this.forestPositions[vertex];
    if (!finalPos) {
      finalPos = {
        x: UnionFindGraph.FOREST_CENTER_X,
        y: UnionFindGraph.FOREST_TOP_Y,
      };
    }
    this.cmd("Move", id, finalPos.x, finalPos.y);
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
  var layout = {};
  var parentMap = {};
  var depthBuckets = {};
  var nodeMeta = {};

  for (var i = 0; i < this.vertices.length; i++) {
    var vertex = this.vertices[i];
    if (this.parent && typeof this.parent[vertex] === "number") {
      parentMap[vertex] = this.parent[vertex];
    } else {
      parentMap[vertex] = vertex;
    }
  }

  for (var j = 0; j < this.vertices.length; j++) {
    var v = this.vertices[j];
    var graphPos = UnionFindGraph.VERTEX_POSITIONS[v];
    var x = UnionFindGraph.FOREST_CENTER_X;
    if (graphPos && typeof graphPos.x === "number") {
      x = graphPos.x;
    }

    var depth = 0;
    var current = v;
    var safety = 0;
    while (
      parentMap.hasOwnProperty(current) &&
      parentMap[current] !== current &&
      safety < 20
    ) {
      current = parentMap[current];
      depth++;
      safety++;
    }
    nodeMeta[v] = {
      vertex: v,
      baseX: x,
      depth: depth,
      y: UnionFindGraph.FOREST_TOP_Y +
        depth * UnionFindGraph.FOREST_LEVEL_HEIGHT,
    };
    if (!depthBuckets[depth]) {
      depthBuckets[depth] = [];
    }
    depthBuckets[depth].push(nodeMeta[v]);
  }

  var offset = UnionFindGraph.FOREST_SIBLING_OFFSET;
  for (var level in depthBuckets) {
    if (!depthBuckets.hasOwnProperty(level)) {
      continue;
    }
    var nodes = depthBuckets[level];
    nodes.sort(function (a, b) {
      if (a.baseX === b.baseX) {
        return a.vertex - b.vertex;
      }
      return a.baseX - b.baseX;
    });

    var idx = 0;
    while (idx < nodes.length) {
      var start = idx;
      var base = nodes[idx].baseX;
      while (idx < nodes.length && nodes[idx].baseX === base) {
        idx++;
      }
      var count = idx - start;
      if (count === 1) {
        nodes[start].x = base;
        continue;
      }
      var mid = (count - 1) / 2;
      for (var k = 0; k < count; k++) {
        var node = nodes[start + k];
        node.x = base + (k - mid) * offset;
      }
    }

    for (var n = 0; n < nodes.length; n++) {
      var meta = nodes[n];
      if (typeof meta.x !== "number") {
        meta.x = meta.baseX;
      }
      layout[meta.vertex] = { x: meta.x, y: meta.y };
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
  this.javaUnionHeaderID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.javaUnionHeaderID,
    "Java union",
    UnionFindGraph.CODE_UNION_X,
    UnionFindGraph.CODE_HEADER_Y,
    0
  );
  this.cmd(
    "SetTextStyle",
    this.javaUnionHeaderID,
    UnionFindGraph.CODE_HEADER_FONT
  );
  this.cmd(
    "SetForegroundColor",
    this.javaUnionHeaderID,
    UnionFindGraph.CODE_HEADER_COLOR
  );

  this.javaFindHeaderID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.javaFindHeaderID,
    "Java find",
    UnionFindGraph.CODE_FIND_X,
    UnionFindGraph.CODE_HEADER_Y,
    0
  );
  this.cmd(
    "SetTextStyle",
    this.javaFindHeaderID,
    UnionFindGraph.CODE_HEADER_FONT
  );
  this.cmd(
    "SetForegroundColor",
    this.javaFindHeaderID,
    UnionFindGraph.CODE_HEADER_COLOR
  );

  var unionIDs = this.addCodeToCanvasBase(
    UnionFindGraph.JAVA_UNION_LINES,
    UnionFindGraph.CODE_UNION_X,
    UnionFindGraph.CODE_SECTION_TOP,
    UnionFindGraph.CODE_LINE_HEIGHT,
    UnionFindGraph.CODE_STANDARD_COLOR,
    0,
    0
  );

  var findIDs = this.addCodeToCanvasBase(
    UnionFindGraph.JAVA_FIND_LINES,
    UnionFindGraph.CODE_FIND_X,
    UnionFindGraph.CODE_SECTION_TOP,
    UnionFindGraph.CODE_LINE_HEIGHT,
    UnionFindGraph.CODE_STANDARD_COLOR,
    0,
    0
  );

  this.javaCodeIDs = [];

  for (var unionIndex in UnionFindGraph.JAVA_UNION_INDEX_MAP) {
    if (!UnionFindGraph.JAVA_UNION_INDEX_MAP.hasOwnProperty(unionIndex)) {
      continue;
    }
    var unionRow = UnionFindGraph.JAVA_UNION_INDEX_MAP[unionIndex];
    if (unionRow < 0 || unionRow >= unionIDs.length) {
      continue;
    }
    var unionLabelID = unionIDs[unionRow][0];
    this.javaCodeIDs[parseInt(unionIndex, 10)] = unionLabelID;
    this.cmd("SetTextStyle", unionLabelID, UnionFindGraph.CODE_FONT);
  }

  for (var findIndex in UnionFindGraph.JAVA_FIND_INDEX_MAP) {
    if (!UnionFindGraph.JAVA_FIND_INDEX_MAP.hasOwnProperty(findIndex)) {
      continue;
    }
    var findRow = UnionFindGraph.JAVA_FIND_INDEX_MAP[findIndex];
    if (findRow < 0 || findRow >= findIDs.length) {
      continue;
    }
    var findLabelID = findIDs[findRow][0];
    this.javaCodeIDs[parseInt(findIndex, 10)] = findLabelID;
    this.cmd("SetTextStyle", findLabelID, UnionFindGraph.CODE_FONT);
  }

  this.setJavaHighlight(null);
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
  this.setJavaHighlight(8);
  this.highlightGraphEdge(a, b, true);
  this.highlightGraphNodes([a, b], true);
  this.cmd("Step");

  this.setJavaHighlight(9);
  this.setDetail("Run find(" + a + ") to locate its root.");
  var rootA = this.animateFind(a);
  this.setDetail("Root of " + a + " is " + rootA + ".");
  this.setJavaHighlight(9);
  this.cmd("Step");

  this.setJavaHighlight(10);
  this.setDetail("Run find(" + b + ") to locate its root.");
  var rootB = this.animateFind(b);
  this.setDetail("Root of " + b + " is " + rootB + ".");
  this.setJavaHighlight(10);
  this.cmd("Step");

  this.setJavaHighlight(11);
  if (rootA === rootB) {
    this.setDetail(
      "Both vertices already share root " + rootA + ", so we skip the union."
    );
    this.cmd("Step");
    this.setJavaHighlight(null);
  } else {
    this.setDetail(
      "Roots differ (" + rootA + " vs " + rootB + "), so compare their ranks."
    );
    this.cmd("Step");
    var info = this.unionRoots(rootA, rootB);
    this.setDetail(info.message);
    this.cmd("Step");
  }

  this.highlightForestNode(rootA, false);
  this.highlightForestNode(rootB, false);
  this.highlightGraphNodes([rootA], false);
  this.highlightGraphNodes([rootB], false);

  this.updateComponentColors();
  this.highlightGraphNodes([a, b], false);
  this.highlightGraphEdge(a, b, false);
  this.cmd("Step");
  this.setJavaHighlight(null);
};

UnionFindGraph.prototype.animateFind = function (start) {
  var current = start;
  var path = [];
  var traversed = [];

  this.setJavaHighlight(1);
  this.cmd("Step");

  while (true) {
    this.setJavaHighlight(2);
    this.cmd("Step");

    path.push(current);
    this.highlightForestNode(current, true);
    this.highlightGraphNodes([current], true);

    if (this.parent[current] === current) {
      break;
    }

    this.setJavaHighlight(3);
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

  this.setJavaHighlight(4);
  this.cmd("Step");

  this.setJavaHighlight(5);
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

  this.setJavaHighlight(6);
  this.cmd("Step");

  this.setJavaHighlight(null);

  return root;
};

UnionFindGraph.prototype.unionRoots = function (rootA, rootB) {
  var originalRootA = rootA;
  var originalRootB = rootB;
  var rankA = this.rank[rootA];
  var rankB = this.rank[rootB];
  var messageParts = [];

  this.setDetail(
    "Compare ranks: rank[" +
      originalRootA +
      "] = " +
      rankA +
      " and rank[" +
      originalRootB +
      "] = " +
      rankB +
      "."
  );
  this.setJavaHighlight(12);
  this.cmd("Step");

  if (rankA < rankB) {
    messageParts.push(
      "rank[" +
        originalRootA +
        "] is lower than rank[" +
        originalRootB +
        "], so swap the roots."
    );

    this.setDetail(
      "rank[" +
        originalRootA +
        "] < rank[" +
        originalRootB +
        "], store rootA before swapping."
    );
    this.setJavaHighlight(13);
    this.cmd("Step");
    var tmp = rootA;

    this.setDetail(
      "Move the higher-rank root " + originalRootB + " into rootA."
    );
    this.setJavaHighlight(14);
    this.cmd("Step");
    rootA = rootB;

    this.setDetail("Restore the saved value into rootB.");
    this.setJavaHighlight(15);
    this.cmd("Step");
    rootB = tmp;
  } else {
    messageParts.push(
      "rank[" +
        originalRootA +
        "] is not less than rank[" +
        originalRootB +
        "], so keep " +
        rootA +
        " as the parent."
    );
  }

  this.setJavaHighlight(16);
  this.cmd("Step");

  var parent = rootA;
  var child = rootB;
  messageParts.push("parent[" + child + "] will now point to " + parent + ".");
  var previousParent = this.parentPointers[child];

  this.setDetail("Set parent[" + child + "] = " + parent + ".");
  this.setJavaHighlight(17);
  this.cmd("Step");

  this.parent[child] = parent;
  this.parentPointers[child] = parent;

  // Refresh the forest layout before revealing nodes so they appear
  // directly beneath their graph counterparts without overlapping.
  this.applyForestLayout();

  this.ensureForestNodeVisible(
    parent,
    "Drop vertex " +
      parent +
      " beneath the graph so it can appear in the parent-pointer view."
  );
  this.ensureForestNodeVisible(
    child,
    "Move vertex " +
      child +
      " below the graph and connect it to its parent."
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
      this.cmd("Step");
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
      this.cmd("Step");
    } else {
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
    }
    this.animatePointerAssignment(child, parent);
    this.highlightForestEdge(parent, child, true);
    this.highlightForestNode(parent, true);
    this.highlightForestNode(child, true);
    this.cmd("Step");
  }

  this.setDetail(
    "Trace the merged component so parent[" +
      child +
      "] = " +
      parent +
      " is clear on the graph."
  );
  this.setJavaHighlight(null);
  this.cmd("Step");

  this.animateUnionCycle(parent);

  this.applyForestLayout();

  this.cmd("Step");

  if (typeof parentID === "number" && typeof childID === "number") {
    this.highlightForestEdge(parent, child, false);
    this.highlightForestNode(parent, false);
    this.highlightForestNode(child, false);
  }

  var ranksEqual = this.rank[parent] === this.rank[child];
  var parentRankBefore = this.rank[parent];
  this.setDetail(
    "Check whether rank[" +
      parent +
      "] equals rank[" +
      child +
      "] before deciding on a rank update."
  );
  this.setJavaHighlight(18);
  this.cmd("Step");

  if (ranksEqual) {
    messageParts.push(
      "Ranks matched, so increase rank[" + parent + "] to " +
        (parentRankBefore + 1) +
        "."
    );
    this.setDetail("Ranks are equal, so increment rank[" + parent + "].");
    this.setJavaHighlight(19);
    this.rank[parent]++;
    this.cmd("Step");
    this.setJavaHighlight(20);
    this.cmd("Step");
  } else {
    messageParts.push(
      "Ranks differed, so rank[" + parent + "] stays at " + parentRankBefore + "."
    );
    this.setDetail("Ranks differ, so leave the ranks unchanged.");
    this.setJavaHighlight(20);
    this.cmd("Step");
  }

  this.setDetail("Exit the union method.");
  this.setJavaHighlight(21);
  this.cmd("Step");

  var summary = messageParts.join(" ");
  summary +=
    " Watch the child arrow travel upward to its parent as the graph loop highlights the merged component.";

  return { parent: parent, child: child, message: summary };
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

UnionFindGraph.prototype.setJavaHighlight = function (indices) {
  if (!this.javaCodeIDs) {
    return;
  }

  var highlightMap = {};
  if (typeof indices === "number") {
    highlightMap[indices] = true;
  } else if (Array.isArray(indices)) {
    for (var i = 0; i < indices.length; i++) {
      highlightMap[indices[i]] = true;
    }
  }

  for (var j = 0; j < this.javaCodeIDs.length; j++) {
    var id = this.javaCodeIDs[j];
    if (typeof id !== "number") {
      continue;
    }
    var color = highlightMap[j]
      ? UnionFindGraph.CODE_HIGHLIGHT_COLOR
      : UnionFindGraph.CODE_STANDARD_COLOR;
    this.cmd("SetForegroundColor", id, color);
  }
};

UnionFindGraph.prototype.clearCodeHighlights = function () {
  this.setJavaHighlight(null);
};

UnionFindGraph.prototype.setStatus = function (text) {
  if (typeof this.statusID === "number") {
    this.cmd("SetText", this.statusID, text || "");
    this.cmd(
      "SetPosition",
      this.statusID,
      UnionFindGraph.CANVAS_WIDTH / 2,
      UnionFindGraph.STATUS_Y
    );
  }
};

UnionFindGraph.prototype.setDetail = function (text) {
  this.currentDetailText = text || "";
  if (typeof this.detailID === "number") {
    this.cmd("SetText", this.detailID, text || "");
    this.cmd(
      "SetPosition",
      this.detailID,
      UnionFindGraph.CANVAS_WIDTH / 2,
      UnionFindGraph.DETAIL_Y
    );
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
