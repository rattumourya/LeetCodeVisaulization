// Directed DFS portrait visualization
// Builds on the animation infrastructure to provide a directed graph
// traversal experience tailored for 9:16 layouts.

var DirectedDFSPortrait = function(am, w, h) {
    this.init(am, w, h);
};

DirectedDFSPortrait.prototype = new Algorithm();
DirectedDFSPortrait.prototype.constructor = DirectedDFSPortrait;
DirectedDFSPortrait.superclass = Algorithm.prototype;

DirectedDFSPortrait.COLORS = {
    EDGE: "#64748b",
    EDGE_ACTIVE: "#38bdf8",
    NODE_FILL: "#f8fafc",
    NODE_TEXT: "#0f172a",
    NODE_DISCOVERED: "#bfdbfe",
    NODE_FINISHED: "#1d4ed8",
    NODE_FINISHED_TEXT: "#e2e8f0",
    STACK_TEXT: "#38bdf8",
    STATUS_TEXT: "#1e3a8a",
    STATUS_MUTED: "#64748b",
    HIGHLIGHT: "#22d3ee"
};

DirectedDFSPortrait.prototype.init = function(am, w, h) {
    DirectedDFSPortrait.superclass.init.call(this, am, w, h);

    this.graph = {
        labels: ["A", "B", "C", "D", "E", "F"],
        positions: [
            { x: 270, y: 160 },
            { x: 405, y: 320 },
            { x: 135, y: 320 },
            { x: 405, y: 520 },
            { x: 135, y: 520 },
            { x: 270, y: 720 }
        ],
        adjacency: [
            [1, 2],
            [3, 4],
            [4],
            [5],
            [5],
            []
        ],
        edges: [
            { from: 0, to: 1, curve: 0 },
            { from: 0, to: 2, curve: 0 },
            { from: 1, to: 3, curve: 0 },
            { from: 1, to: 4, curve: 0.12 },
            { from: 2, to: 4, curve: -0.18 },
            { from: 3, to: 5, curve: 0 },
            { from: 4, to: 5, curve: 0.18 }
        ]
    };

    this.labelToIndex = {};
    for (var i = 0; i < this.graph.labels.length; i++) {
        this.labelToIndex[this.graph.labels[i]] = i;
    }

    this.addControls();
    this.setupGraph();
};

DirectedDFSPortrait.prototype.addControls = function() {
    addLabelToAlgorithmBar("Start vertex:");
    this.startField = addControlToAlgorithmBar("Text", this.graph.labels[0]);
    this.startField.maxLength = 1;
    this.startField.onkeydown = this.returnSubmit(
        this.startField,
        this.startTraversal.bind(this),
        1,
        false
    );

    this.startButton = addControlToAlgorithmBar("Button", "Traverse");
    this.startButton.onclick = this.startTraversal.bind(this);

    this.resetButton = addControlToAlgorithmBar("Button", "Reset State");
    this.resetButton.onclick = this.resetTraversal.bind(this);
};

DirectedDFSPortrait.prototype.setupGraph = function() {
    this.commands = [];
    this.vertexIDs = new Array(this.graph.labels.length);
    this.graphEdges = this.graph.edges.slice(0);

    for (var i = 0; i < this.graph.labels.length; i++) {
        var id = this.nextIndex++;
        this.vertexIDs[i] = id;
        var node = this.graph.positions[i];
        this.cmd("CreateCircle", id, this.graph.labels[i], node.x, node.y);
        this.cmd("SetForegroundColor", id, DirectedDFSPortrait.COLORS.NODE_TEXT);
        this.cmd("SetBackgroundColor", id, DirectedDFSPortrait.COLORS.NODE_FILL);
        this.cmd("SetLayer", id, 1);
    }

    for (i = 0; i < this.graphEdges.length; i++) {
        var edge = this.graphEdges[i];
        this.cmd(
            "Connect",
            this.vertexIDs[edge.from],
            this.vertexIDs[edge.to],
            DirectedDFSPortrait.COLORS.EDGE,
            edge.curve,
            1,
            ""
        );
    }

    this.createLegend();
    this.createStatusArea();
    this.reset(true);

    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();
    this.clearHistory();
};

DirectedDFSPortrait.prototype.createLegend = function() {
    this.legendBoxID = this.nextIndex++;
    this.cmd("CreateRectangle", this.legendBoxID, "", 200, 90, 110, 170);
    this.cmd("SetForegroundColor", this.legendBoxID, "#4b6cb7");
    this.cmd("SetBackgroundColor", this.legendBoxID, "#eef3ff");
    this.cmd("SetAlpha", this.legendBoxID, 1);
    this.cmd("SetLayer", this.legendBoxID, 0);

    this.legendTitleID = this.nextIndex++;
    this.cmd("CreateLabel", this.legendTitleID, "Legend", 110, 120, 0);
    this.cmd("SetForegroundColor", this.legendTitleID, DirectedDFSPortrait.COLORS.STATUS_TEXT);
    this.cmd("SetLayer", this.legendTitleID, 2);

    this.legendDiscoveredCircle = this.nextIndex++;
    this.cmd("CreateCircle", this.legendDiscoveredCircle, "", 60, 160);
    this.cmd("SetWidth", this.legendDiscoveredCircle, 28);
    this.cmd("SetBackgroundColor", this.legendDiscoveredCircle, DirectedDFSPortrait.COLORS.NODE_DISCOVERED);
    this.cmd("SetForegroundColor", this.legendDiscoveredCircle, DirectedDFSPortrait.COLORS.NODE_TEXT);
    this.cmd("SetLayer", this.legendDiscoveredCircle, 2);

    this.legendDiscoveredLabel = this.nextIndex++;
    this.cmd("CreateLabel", this.legendDiscoveredLabel, "Discovered", 110, 160, 0);
    this.cmd("SetForegroundColor", this.legendDiscoveredLabel, DirectedDFSPortrait.COLORS.STATUS_TEXT);
    this.cmd("SetLayer", this.legendDiscoveredLabel, 2);

    this.legendFinishedCircle = this.nextIndex++;
    this.cmd("CreateCircle", this.legendFinishedCircle, "", 60, 200);
    this.cmd("SetWidth", this.legendFinishedCircle, 28);
    this.cmd("SetBackgroundColor", this.legendFinishedCircle, DirectedDFSPortrait.COLORS.NODE_FINISHED);
    this.cmd("SetForegroundColor", this.legendFinishedCircle, DirectedDFSPortrait.COLORS.NODE_FINISHED_TEXT);
    this.cmd("SetLayer", this.legendFinishedCircle, 2);

    this.legendFinishedLabel = this.nextIndex++;
    this.cmd("CreateLabel", this.legendFinishedLabel, "Finished", 110, 200, 0);
    this.cmd("SetForegroundColor", this.legendFinishedLabel, DirectedDFSPortrait.COLORS.STATUS_TEXT);
    this.cmd("SetLayer", this.legendFinishedLabel, 2);
};

DirectedDFSPortrait.prototype.createStatusArea = function() {
    this.stackSpacing = Math.round(this.canvasHeight * 0.05);
    this.stackBaseY = Math.round(this.canvasHeight * 0.68);

    this.stackTitleID = this.nextIndex++;
    this.cmd(
        "CreateLabel",
        this.stackTitleID,
        "Call Stack",
        this.canvasWidth / 2,
        this.stackBaseY - this.stackSpacing,
        0
    );
    this.cmd("SetForegroundColor", this.stackTitleID, DirectedDFSPortrait.COLORS.STATUS_MUTED);
    this.cmd("SetLayer", this.stackTitleID, 3);
    this.callStackIDs = [];

    this.orderLabelID = this.nextIndex++;
    this.cmd(
        "CreateLabel",
        this.orderLabelID,
        "Visit order: —",
        this.canvasWidth / 2,
        this.stackBaseY + 6 * this.stackSpacing,
        0
    );
    this.cmd("SetForegroundColor", this.orderLabelID, DirectedDFSPortrait.COLORS.STATUS_MUTED);
    this.cmd("SetLayer", this.orderLabelID, 3);

    this.statusID = this.nextIndex++;
    this.cmd(
        "CreateLabel",
        this.statusID,
        "Ready for DFS. Enter a start vertex (A–F) and press Traverse.",
        this.canvasWidth / 2,
        this.canvasHeight - 30,
        0
    );
    this.cmd("SetForegroundColor", this.statusID, DirectedDFSPortrait.COLORS.STATUS_TEXT);
    this.cmd("SetLayer", this.statusID, 3);
};

DirectedDFSPortrait.prototype.reset = function(isInitialSetup) {
    if (!isInitialSetup) {
        this.commands = [];
    }

    this.visited = new Array(this.graph.labels.length);
    this.traversalOrder = [];

    for (var i = 0; i < this.graph.labels.length; i++) {
        this.visited[i] = false;
        this.cmd("SetBackgroundColor", this.vertexIDs[i], DirectedDFSPortrait.COLORS.NODE_FILL);
        this.cmd("SetForegroundColor", this.vertexIDs[i], DirectedDFSPortrait.COLORS.NODE_TEXT);
    }

    for (i = 0; i < this.graphEdges.length; i++) {
        var edge = this.graphEdges[i];
        this.cmd("SetEdgeColor", this.vertexIDs[edge.from], this.vertexIDs[edge.to], DirectedDFSPortrait.COLORS.EDGE);
        this.cmd("SetEdgeHighlight", this.vertexIDs[edge.from], this.vertexIDs[edge.to], 0);
    }

    if (this.highlightCircleID != null) {
        this.cmd("Delete", this.highlightCircleID);
        this.highlightCircleID = null;
    }

    if (this.callStackIDs != null) {
        for (i = 0; i < this.callStackIDs.length; i++) {
            this.cmd("Delete", this.callStackIDs[i]);
        }
    }
    this.callStackIDs = [];

    if (this.statusID != null) {
        this.cmd(
            "SetText",
            this.statusID,
            "Ready for DFS. Enter a start vertex (A–F) and press Traverse."
        );
    }

    if (this.orderLabelID != null) {
        this.cmd("SetText", this.orderLabelID, "Visit order: —");
    }

    return this.commands;
};

DirectedDFSPortrait.prototype.startTraversal = function() {
    var value = this.startField.value.trim().toUpperCase();
    if (value === "") {
        value = this.graph.labels[0];
    }
    if (!this.labelToIndex.hasOwnProperty(value)) {
        this.startField.value = "";
        this.implementAction(this.reportInvalidStart.bind(this), value);
        return;
    }
    this.startField.value = value;
    this.implementAction(this.runDFS.bind(this), this.labelToIndex[value]);
};

DirectedDFSPortrait.prototype.resetTraversal = function() {
    this.implementAction(this.resetTraversalState.bind(this), 0);
};

DirectedDFSPortrait.prototype.resetTraversalState = function() {
    this.startField.value = this.graph.labels[0];
    return this.reset(false);
};

DirectedDFSPortrait.prototype.reportInvalidStart = function(label) {
    this.commands = [];
    var choices = this.graph.labels.join(", ");
    this.cmd(
        "SetText",
        this.statusID,
        "Unknown vertex '" + label + "'. Choose one of " + choices + "."
    );
    return this.commands;
};

DirectedDFSPortrait.prototype.runDFS = function(startIndex) {
    this.reset(false);
    this.traversalOrder = [];
    this.highlightCircleID = this.nextIndex++;
    var startNode = this.graph.positions[startIndex];
    this.cmd(
        "CreateHighlightCircle",
        this.highlightCircleID,
        DirectedDFSPortrait.COLORS.HIGHLIGHT,
        startNode.x,
        startNode.y
    );
    this.cmd("SetLayer", this.highlightCircleID, 2);

    this.cmd("SetText", this.statusID, "Begin DFS from vertex " + this.graph.labels[startIndex] + ".");
    this.cmd("Step");
    this.dfsVisit(startIndex, 0);

    if (this.highlightCircleID != null) {
        this.cmd("Delete", this.highlightCircleID);
        this.highlightCircleID = null;
    }

    this.cmd(
        "SetText",
        this.statusID,
        "DFS complete. Visit order: " + this.traversalOrder.join(" → ") + "."
    );

    return this.commands;
};

DirectedDFSPortrait.prototype.dfsVisit = function(index, depth) {
    var label = this.graph.labels[index];
    var callLabelID = this.nextIndex++;
    this.callStackIDs.push(callLabelID);
    this.cmd(
        "CreateLabel",
        callLabelID,
        "DFS(" + label + ")",
        this.canvasWidth / 2,
        this.stackBaseY + depth * this.stackSpacing,
        0
    );
    this.cmd("SetForegroundColor", callLabelID, DirectedDFSPortrait.COLORS.STACK_TEXT);
    this.cmd("SetLayer", callLabelID, 3);

    this.visited[index] = true;
    this.traversalOrder.push(label);
    this.updateVisitOrder();

    this.cmd(
        "SetText",
        this.statusID,
        "Visiting " + label + ". Mark as discovered and explore outgoing edges."
    );
    this.cmd(
        "SetBackgroundColor",
        this.vertexIDs[index],
        DirectedDFSPortrait.COLORS.NODE_DISCOVERED
    );
    this.cmd("Step");

    var neighbors = this.graph.adjacency[index];
    for (var i = 0; i < neighbors.length; i++) {
        var neighborIndex = neighbors[i];
        var neighborLabel = this.graph.labels[neighborIndex];
        this.cmd(
            "SetText",
            this.statusID,
            "Explore edge " + label + " → " + neighborLabel + "."
        );
        this.cmd(
            "SetEdgeColor",
            this.vertexIDs[index],
            this.vertexIDs[neighborIndex],
            DirectedDFSPortrait.COLORS.EDGE_ACTIVE
        );
        this.cmd("SetEdgeHighlight", this.vertexIDs[index], this.vertexIDs[neighborIndex], 1);
        this.cmd("Step");

        this.cmd(
            "Move",
            this.highlightCircleID,
            this.graph.positions[neighborIndex].x,
            this.graph.positions[neighborIndex].y
        );
        this.cmd("Step");

        if (!this.visited[neighborIndex]) {
            this.dfsVisit(neighborIndex, depth + 1);
            this.cmd(
                "SetText",
                this.statusID,
                "Backtrack to " + label + " after finishing " + neighborLabel + "."
            );
        } else {
            var alreadyLabelID = this.nextIndex++;
            this.cmd(
                "CreateLabel",
                alreadyLabelID,
                "Already visited",
                this.graph.positions[neighborIndex].x,
                this.graph.positions[neighborIndex].y - 35,
                0
            );
            this.cmd("SetForegroundColor", alreadyLabelID, DirectedDFSPortrait.COLORS.STATUS_MUTED);
            this.cmd("SetLayer", alreadyLabelID, 3);
            this.cmd("Step");
            this.cmd("Delete", alreadyLabelID);
            this.cmd(
                "SetText",
                this.statusID,
                neighborLabel + " was seen before. Continue exploring " + label + "."
            );
        }

        this.cmd(
            "Move",
            this.highlightCircleID,
            this.graph.positions[index].x,
            this.graph.positions[index].y
        );
        this.cmd("SetEdgeHighlight", this.vertexIDs[index], this.vertexIDs[neighborIndex], 0);
        this.cmd(
            "SetEdgeColor",
            this.vertexIDs[index],
            this.vertexIDs[neighborIndex],
            DirectedDFSPortrait.COLORS.EDGE
        );
        this.cmd("Step");
    }

    this.cmd(
        "SetText",
        this.statusID,
        "Finished processing " + label + ". Backtrack to caller."
    );
    this.cmd(
        "SetBackgroundColor",
        this.vertexIDs[index],
        DirectedDFSPortrait.COLORS.NODE_FINISHED
    );
    this.cmd(
        "SetForegroundColor",
        this.vertexIDs[index],
        DirectedDFSPortrait.COLORS.NODE_FINISHED_TEXT
    );
    this.cmd("Step");

    this.cmd("Delete", callLabelID);
    this.callStackIDs.pop();
};

DirectedDFSPortrait.prototype.updateVisitOrder = function() {
    if (this.orderLabelID != null) {
        var text = this.traversalOrder.length === 0 ? "Visit order: —" : "Visit order: " + this.traversalOrder.join(" → ");
        this.cmd("SetText", this.orderLabelID, text);
    }
};

DirectedDFSPortrait.prototype.disableUI = function(event) {
    this.startField.disabled = true;
    this.startButton.disabled = true;
    this.resetButton.disabled = true;
};

DirectedDFSPortrait.prototype.enableUI = function(event) {
    this.startField.disabled = false;
    this.startButton.disabled = false;
    this.resetButton.disabled = false;
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new DirectedDFSPortrait(animManag, canvas.width, canvas.height);
}
