// BSD-2-Clause license header retained from original framework.

/*
 * NumberOfIslands.js (updated)
 * - Prevent label/grid overlap in YouTube mode
 * - Show "empty" queue when there are no items (initially and during animation)
 * - Keep visited grid text and background tidy
 */

function NumberOfIslands(am, w, h) { this.init(am, w, h); }

NumberOfIslands.prototype = new Algorithm();
NumberOfIslands.prototype.constructor = NumberOfIslands;
NumberOfIslands.superclass = Algorithm.prototype;

NumberOfIslands.prototype.init = function(am, w, h) {
  NumberOfIslands.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.grid = [];
  this.rows = 0;
  this.cols = 0;

  this.cellID = [];
  this.visitedStaticID = [];
  this.queueVisIDs = [];
  this.visitedVisIDs = [];
  this.visitedList = [];

  this.countLabelID = -1;
  this.countValueID = -1;

  // Track an "empty" queue chip so it can be replaced/restored cleanly
  this.queueEmptyID = null;

  this.videoMode = false;

  this.setup();
};

NumberOfIslands.prototype.addControls = function() {
  this.controls = [];

  addLabelToAlgorithmBar("Grid:");
  this.gridField = addControlToAlgorithmBar("Text", "");
  this.gridField.size = 40;

  this.buildButton = addControlToAlgorithmBar("Button", "Build Grid");
  this.buildButton.onclick = this.buildGridCallback.bind(this);

  this.startButton = addControlToAlgorithmBar("Button", "Count Islands");
  this.startButton.onclick = this.startCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.pauseButton = addControlToAlgorithmBar("Button", "Pause / Play");
  this.pauseButton.onclick = this.pauseCallback.bind(this);

  this.stepButton = addControlToAlgorithmBar("Button", "Next Step");
  this.stepButton.onclick = this.stepCallback.bind(this);

  this.videoButton = addControlToAlgorithmBar("Button", "Video Mode");
  this.videoButton.onclick = this.videoModeCallback.bind(this);

  this.controls.push(this.gridField, this.buildButton, this.startButton, this.videoButton);
};

NumberOfIslands.prototype.videoModeCallback = function() {
  this.videoMode = !this.videoMode;

  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    if (this.videoMode) {
      canvasElem.width = 540;                       // 9:16 width
      if (animationManager?.animatedObjects) animationManager.animatedObjects.width = 540;
    } else {
      canvasElem.width = 1000;                      // desktop default
      if (animationManager?.animatedObjects) animationManager.animatedObjects.width = 1000;
    }
  }
  this.reset();
};

NumberOfIslands.prototype.buildGridCallback = function() {
  const raw = this.gridField.value.trim();
  if (!raw) return;

  const tokens = raw.split(/[\s,;\n]+/);
  const g = [];
  let maxC = 0;

  for (let t of tokens) {
    t = t.trim();
    if (!t) continue;
    const row = [];
    for (let k = 0; k < t.length; k++) {
      const ch = t[k];
      if (ch === '0' || ch === '1') row.push(+ch);
    }
    if (row.length) {
      maxC = Math.max(maxC, row.length);
      g.push(row);
    }
  }
  if (!g.length) return;
  for (let r = 0; r < g.length; r++) while (g[r].length < maxC) g[r].push(0);

  this.grid = g;
  this.rows = g.length;
  this.cols = maxC;

  this.reset();
};

NumberOfIslands.prototype.setup = function() {
  if (!this.grid || !this.grid.length) {
    this.grid = [
      [1,1,0,0,0],
      [1,1,0,0,0],
      [0,0,1,0,0],
      [0,0,0,1,1]
    ];
  }
  this.rows = this.grid.length;
  this.cols = this.grid[0].length;

  // Colors
  this.WATER_COLOR    = "#b3d9ff";
  this.LAND_COLOR     = "#a6e3a1";
  this.VISITING_COLOR = "#ffbb33";
  this.VISITED_COLOR  = "#5cb85c";

  const canvas = document.getElementById("canvas");
  const CANVAS_W = canvas ? canvas.width : 1000;

  // Base spacing (normal mode)
  const GRID_SP = 5;
  const VIS_SP  = 3;

  this.commands = [];

  // Title
  this.titleID = this.nextIndex++;
  const title = "Animated solution for Number of Islands";
  const TITLE_Y = 50;
  this.cmd("CreateLabel", this.titleID, title, Math.floor(CANVAS_W/2), TITLE_Y, 1);
  this.cmd("SetForegroundColor", this.titleID, "#000");
  this.cmd("SetTextStyle", this.titleID, "bold 24");

  if (!this.videoMode) {
    // ── Normal mode (unchanged except larger text) ───────────────────────────
    const CELL = 50;
    const startX = 50;
    const startY = 90;

    this.cellID = Array.from({length: this.rows}, () => new Array(this.cols));
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const id = this.nextIndex++;
        this.cellID[r][c] = id;
        const x = startX + c * (CELL + GRID_SP);
        const y = startY + r * (CELL + GRID_SP);
        this.cmd("CreateRectangle", id, "", CELL, CELL, x, y);
        this.cmd("SetBackgroundColor", id, this.grid[r][c] ? this.LAND_COLOR : this.WATER_COLOR);
        this.cmd("SetForegroundColor", id, "#000");
      }
    }

    this.countLabelID = this.nextIndex++;
    this.countValueID = this.nextIndex++;
    const gridH = this.rows * (CELL + GRID_SP) - GRID_SP;
    const labelY = startY + gridH + 30;
    this.cmd("CreateLabel", this.countLabelID, "Island Count:", startX, labelY, 0);
    this.cmd("SetForegroundColor", this.countLabelID, "#000");
    this.cmd("SetTextStyle", this.countLabelID, 24);
    this.cmd("CreateLabel", this.countValueID, "0", startX + 150, labelY, 0);
    this.cmd("SetForegroundColor", this.countValueID, "#000");
    this.cmd("SetTextSize", this.countValueID, 20);

    // Code (right)
    this.codeLines = [
      "islandCount = 0",
      "for each row r:",
      "  for each column c:",
      "    if grid[r][c] == 1 && not visited:",
      "      islandCount++",
      "      enqueue (r,c)",
      "      while queue not empty:",
      "        (x, y) = dequeue",
      "        for each neighbour (nx, ny):",
      "          if in bounds & grid[nx][ny] == 1 & not visited:",
      "            mark visited & enqueue"
    ];
    this.codeLineID = new Array(this.codeLines.length);
    const CODE_LINE_H = 24;
    const codeX = startX + this.cols * (CELL + GRID_SP) + 50;
    const codeY = startY;
    for (let i = 0; i < this.codeLines.length; i++) {
      const id = this.nextIndex++;
      this.codeLineID[i] = id;
      this.cmd("CreateLabel", id, this.codeLines[i], codeX, codeY + i * CODE_LINE_H, 0);
      this.cmd("SetForegroundColor", id, "#000");
      this.cmd("SetTextSize", id, 20);
    }

    // Lists under grid
    const listsY = Math.max(labelY + 40, codeY + this.codeLines.length*CODE_LINE_H + 20);
    this.queueLabelID = this.nextIndex++;
    this.cmd("CreateLabel", this.queueLabelID, "Queue:", startX, listsY, 0);
    this.cmd("SetForegroundColor", this.queueLabelID, "#000");
    this.cmd("SetTextSize", this.queueLabelID, 18);

    this.visitedLabelID = this.nextIndex++;
    this.cmd("CreateLabel", this.visitedLabelID, "Visited:", startX, listsY + 40, 0);
    this.cmd("SetForegroundColor", this.visitedLabelID, "#000");
    this.cmd("SetTextSize", this.visitedLabelID, 18);

    this.queueStartX   = startX + 80;
    this.queueStartY   = listsY;
    this.visitedStartX = startX + 80;
    this.visitedStartY = listsY + 40;

    // Show empty queue right away
    this.updateQueueVis([]);

    const neededH = this.visitedStartY + 100;
    canvas.height = Math.max(neededH, 600);
    if (animationManager?.animatedObjects) animationManager.animatedObjects.height = canvas.height;

    animationManager.StartNewAnimation(this.commands);
    animationManager.skipForward();
    animationManager.clearHistory();
    return;
  }

  // ── YouTube (Shorts) mode ──────────────────────────────────────────────────
  const TOP_Y = 100;
  const GAP   = -100;      // intent: bring right panel closer
  const SIDE_MARGIN = 8;

  const leftW  = Math.floor(CANVAS_W * 0.6) - SIDE_MARGIN;
  const rightW = CANVAS_W - leftW - GAP - 2*SIDE_MARGIN;

  const GRID_SP_V = 3;
  const VIS_SP_V  = 2;
  const maxCellByW = Math.floor((leftW - (this.cols - 1) * GRID_SP_V) / this.cols);
  const maxCellByH = 36;
  const CELL = Math.max(16, Math.min(maxCellByW, maxCellByH));

  const GRID_W = this.cols * (CELL + GRID_SP_V) - GRID_SP_V;
  const GRID_H = this.rows * (CELL + GRID_SP_V) - GRID_SP_V;

  const gridX = SIDE_MARGIN + Math.floor((leftW - GRID_W) / 2);
  const gridY = TOP_Y;

  // Grid (left)
  this.cellID = Array.from({length: this.rows}, () => new Array(this.cols));
  for (let r = 0; r < this.rows; r++) {
    for (let c = 0; c < this.cols; c++) {
      const id = this.nextIndex++;
      this.cellID[r][c] = id;
      const x = gridX + c * (CELL + GRID_SP_V);
      const y = gridY + r * (CELL + GRID_SP_V);
      this.cmd("CreateRectangle", id, "", CELL, CELL, x, y);
      this.cmd("SetBackgroundColor", id, this.grid[r][c] ? this.LAND_COLOR : this.WATER_COLOR);
      this.cmd("SetForegroundColor", id, "#000");
    }
  }

  // Count (under left grid)
  this.countLabelID = this.nextIndex++;
  this.countValueID = this.nextIndex++;
  const countY = gridY + GRID_H + 16;
  this.cmd("CreateLabel", this.countLabelID, "Island Count:", gridX, countY, 0);
  this.cmd("SetForegroundColor", this.countLabelID, "#000");
  this.cmd("SetTextStyle", this.countLabelID, "bold 18");
  this.cmd("CreateLabel", this.countValueID, "0", gridX + 150, countY, 0);
  this.cmd("SetForegroundColor", this.countValueID, "#000");
  this.cmd("SetTextStyle", this.countValueID, "bold 18");

  // Right panel positions
  const rightX = SIDE_MARGIN + leftW + GAP;
  let rpY = TOP_Y;

  // Visited grid geometry
  const VIS_CELL = Math.max(12, Math.min(22, Math.floor((rightW - (this.cols - 1) * VIS_SP_V) / this.cols)));
  const VIS_W = this.cols * (VIS_CELL + VIS_SP_V) - VIS_SP_V;
  const visX = rightX + Math.floor((rightW - VIS_W) / 2);
  const VIS_LABEL_GAP = 28;             // bigger gap to avoid overlap
  const visLabelY = rpY;                // label row
  const visY = visLabelY + VIS_LABEL_GAP; // grid starts below label

  // Visited label (kept left aligned with grid)
  this.visitedLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.visitedLabelID, "Visited", visX - 12, visLabelY, 0);
  this.cmd("SetForegroundColor", this.visitedLabelID, "#000"); // purple
  this.cmd("SetTextSize", this.visitedLabelID, "bold 18");

  // Static visited grid
  this.visitedStaticID = Array.from({length: this.rows}, () => new Array(this.cols));
  for (let r = 0; r < this.rows; r++) {
    for (let c = 0; c < this.cols; c++) {
      const id = this.nextIndex++;
      this.visitedStaticID[r][c] = id;
      const x = visX + c * (VIS_CELL + VIS_SP_V);
      const y = visY + r * (VIS_CELL + VIS_SP_V);
      this.cmd("CreateRectangle", id, "F", VIS_CELL, VIS_CELL, x, y);
      this.cmd("SetBackgroundColor", id, "#e0e0e0");
      this.cmd("SetForegroundColor", id, "#000");
      this.cmd("SetTextSize", id, 14);
    }
  }

  const VIS_H = this.rows * (VIS_CELL + VIS_SP_V) - VIS_SP_V;
  rpY = visY + VIS_H + 12;

  // Queue label (left aligned with queue start)
  this.queueStartX = visX - 13;
  this.queueStartY = rpY + 28;
  this.queueVisIDs = [];
  this.queueEmptyID = null;

  this.queueLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.queueLabelID, "Queue", this.queueStartX, rpY, 0);
  this.cmd("SetForegroundColor", this.queueLabelID, "#000");
  this.cmd("SetTextSize", this.queueLabelID, 18);

  // Show empty queue immediately
  this.updateQueueVis([]);

  // Code block (centered)
  const topRowBottom = Math.max(countY + 8, this.queueStartY + 22);
  this.codeLines = [
    "islandCount = 0",
    "for each row r:",
    "  for each column c:",
    "    if grid[r][c] == 1 && not visited:",
    "      islandCount++",
    "      enqueue (r,c)",
    "      while queue not empty:",
    "        (x, y) = dequeue",
    "        for each neighbour (nx, ny):",
    "          if in bounds & grid[nx][ny] == 1 & not visited:",
    "            mark visited & enqueue"
  ];
  this.codeLineID = new Array(this.codeLines.length);

  const CODE_CENTER_X = Math.floor(CANVAS_W / 2);
  const CODE_Y = topRowBottom + 36;
  const CODE_LINE_H = 22;

  for (let i = 0; i < this.codeLines.length; i++) {
    const id = this.nextIndex++;
    this.codeLineID[i] = id;
    this.cmd("CreateLabel", id, this.codeLines[i], CODE_CENTER_X, CODE_Y + i * CODE_LINE_H, 1);
    this.cmd("SetForegroundColor", id, "#000");
    this.cmd("SetTextSize", id, 20);
  }

  const contentBottom = CODE_Y + this.codeLines.length * CODE_LINE_H + 56;
  const ratioH = Math.round(CANVAS_W * 16 / 9);
  canvas.height = Math.max(contentBottom, ratioH, 820);
  if (animationManager?.animatedObjects) animationManager.animatedObjects.height = canvas.height;

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

// ─────────────────────────────────────────────────────────────────────────────
// Animation helpers
// ─────────────────────────────────────────────────────────────────────────────
NumberOfIslands.prototype.showCodeStep = function(lineIndex) {
  if (!this.codeLineID) return;
  for (let i = 0; i < this.codeLineID.length; i++) {
    this.cmd("SetHighlight", this.codeLineID[i], i === lineIndex ? 1 : 0);
  }
  this.cmd("Step");
};

NumberOfIslands.prototype.startCallback = function() {
  this.implementAction(this.doCount.bind(this), "");
};

NumberOfIslands.prototype.pauseCallback = function() {
  if (typeof doPlayPause === "function") doPlayPause();
};

NumberOfIslands.prototype.stepCallback = function() {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") doPlayPause();
    animationManager.step();
  }
};

NumberOfIslands.prototype.doCount = function() {
  this.commands = [];

  // Make sure we start with an explicit empty queue on screen
  this.updateQueueVis([]);

  this.showCodeStep(0);

  const rows = this.rows, cols = this.cols;
  const visited = Array.from({length: rows}, () => Array(cols).fill(false));

  let islandCount = 0;
  const DIR = [[1,0],[-1,0],[0,1],[0,-1]];
  const inB = (x,y) => x>=0 && x<rows && y>=0 && y<cols;

  this.showCodeStep(1);
  this.showCodeStep(2);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (this.grid[r][c] === 1 && !visited[r][c]) {
        this.showCodeStep(3);
        islandCount++;
        this.showCodeStep(4);
        this.cmd("SetText", this.countValueID, String(islandCount));

        const q = [];
        this.visitedList = [];
        this.showCodeStep(5);
        q.push([r,c]);
        visited[r][c] = true;

        if (this.videoMode) {
          const vs = this.visitedStaticID[r][c];
          this.cmd("SetBackgroundColor", vs, this.VISITED_COLOR);
          this.cmd("SetForegroundColor", vs, "#000");
          this.cmd("SetText", vs, "T");
        } else {
          this.visitedList.push([r,c]);
          this.updateVisitedVis();
        }
        this.updateQueueVis(q);

        const startID = this.cellID[r][c];
        this.cmd("SetBackgroundColor", startID, this.VISITING_COLOR);
        this.cmd("SetForegroundColor", startID, this.VISITING_COLOR);
        this.cmd("Step");

        this.showCodeStep(6);
        while (q.length) {
          this.updateQueueVis(q);
          this.showCodeStep(7);
          const [x,y] = q.shift();
          this.updateQueueVis(q);

          this.showCodeStep(8);
          for (let d = 0; d < 4; d++) {
            const nx = x + DIR[d][0], ny = y + DIR[d][1];
            this.showCodeStep(9);
            if (inB(nx,ny) && this.grid[nx][ny] === 1 && !visited[nx][ny]) {
              this.showCodeStep(10);
              visited[nx][ny] = true;
              q.push([nx,ny]);

              if (this.videoMode) {
                const v = this.visitedStaticID[nx][ny];
                this.cmd("SetBackgroundColor", v, this.VISITED_COLOR);
                this.cmd("SetForegroundColor", v, "#000");
                this.cmd("SetText", v, "T");
              } else {
                this.visitedList.push([nx,ny]);
                this.updateVisitedVis();
              }
              this.updateQueueVis(q);

              const id = this.cellID[nx][ny];
              this.cmd("SetBackgroundColor", id, this.VISITING_COLOR);
              this.cmd("SetForegroundColor", id, this.VISITING_COLOR);
              this.cmd("Step");
            }
          }
        }

        // Finalize island coloring
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (visited[i][j] && this.grid[i][j] === 1) {
              const id = this.cellID[i][j];
              this.cmd("SetBackgroundColor", id, this.VISITED_COLOR);
              this.cmd("SetForegroundColor", id, this.VISITED_COLOR);
              if (this.videoMode) {
                const vfin = this.visitedStaticID[i][j];
                this.cmd("SetBackgroundColor", vfin, this.VISITED_COLOR);
                this.cmd("SetForegroundColor", vfin, "#000");
                this.cmd("SetText", vfin, "T");
              }
            }
          }
        }
        this.cmd("Step");
      }
    }
  }

  // End state: ensure empty chip is visible if queue drained
  this.updateQueueVis([]);
  return this.commands;
};

NumberOfIslands.prototype.updateQueueVis = function(queue) {
  // delete prior queue visuals (including prior empty chip if any)
  for (let id of this.queueVisIDs) this.cmd("Delete", id);
  this.queueVisIDs = [];
  if (this.queueEmptyID !== null) {
    this.cmd("Delete", this.queueEmptyID);
    this.queueEmptyID = null;
  }

  let x = this.queueStartX + 28, y = this.queueStartY;
  const W = 52, H = 22, SP = 5;

  if (!queue || queue.length === 0) {
    // draw a small "empty" chip so learners see there's a queue here
    this.queueEmptyID = this.nextIndex++;
    this.cmd("CreateRectangle", this.queueEmptyID, "empty", 64, H, x, y);
    this.cmd("SetBackgroundColor", this.queueEmptyID, "#f7f7f7");
    this.cmd("SetForegroundColor", this.queueEmptyID, "#777");
    this.cmd("SetTextSize", this.queueEmptyID, 14);
    return;
  }

  for (let i = 0; i < queue.length; i++) {
    const id = this.nextIndex++;
    const label = "(" + queue[i][0] + "," + queue[i][1] + ")";
    this.queueVisIDs.push(id);
    this.cmd("CreateRectangle", id, label, W, H, x, y);
    this.cmd("SetBackgroundColor", id, "#fff");
    this.cmd("SetForegroundColor", id, "#000");
    this.cmd("SetTextSize", id, 16);
    x += W + SP;
  }
};

NumberOfIslands.prototype.updateVisitedVis = function() {
  for (let id of this.visitedVisIDs) this.cmd("Delete", id);
  this.visitedVisIDs = [];

  let x = this.visitedStartX, y = this.visitedStartY;
  const W = 52, H = 22, SP = 5;

  for (let i = 0; i < this.visitedList.length; i++) {
    const id = this.nextIndex++;
    const label = "(" + this.visitedList[i][0] + "," + this.visitedList[i][1] + ")";
    this.visitedVisIDs.push(id);
    this.cmd("CreateRectangle", id, label, W, H, x, y);
    this.cmd("SetBackgroundColor", id, this.VISITED_COLOR);
    this.cmd("SetForegroundColor", id, "#000");
    this.cmd("SetTextSize", id, 16);
    x += W + SP;
  }
};

NumberOfIslands.prototype.reset = function() {
  this.nextIndex = 0;
  if (animationManager?.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

NumberOfIslands.prototype.disableUI = function() {
  for (let c of this.controls) c.disabled = true;
};
NumberOfIslands.prototype.enableUI = function() {
  for (let c of this.controls) c.disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new NumberOfIslands(animManag, canvas.width, canvas.height);
}
