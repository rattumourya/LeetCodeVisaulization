function CoinChangeTopDown(am, w, h) {
  this.init(am, w, h);
}

CoinChangeTopDown.prototype = new Algorithm();
CoinChangeTopDown.prototype.constructor = CoinChangeTopDown;
CoinChangeTopDown.superclass = Algorithm.prototype;

CoinChangeTopDown.MAX_COINS = 6;
CoinChangeTopDown.MAX_AMOUNT = 15;
CoinChangeTopDown.CODE = [
  "int coinChange(int[] coins, int amount) {",
  "    int[][] memo = new int[coins.length][amount + 1];",
  "    for (int[] row : memo) Arrays.fill(row, -2);",
  "    int ans = dfs(0, amount, coins, memo);",
  "    return ans >= INF ? -1 : ans;",
  "}",
  "",
  "int dfs(int i, int remain, int[] coins, int[][] memo) {",
  "    if (remain == 0) return 0;",
  "    if (i == coins.length || remain < 0) return INF;",
  "    if (memo[i][remain] != -2) return memo[i][remain];",
  "    int take = 1 + dfs(i, remain - coins[i], coins, memo);",
  "    int skip = dfs(i + 1, remain, coins, memo);",
  "    int best = Math.min(take, skip);",
  "    memo[i][remain] = best;",
  "    return memo[i][remain];",
  "}",
];

CoinChangeTopDown.prototype.init = function (am, w, h) {
  CoinChangeTopDown.superclass.init.call(this, am, w, h);

  this.canvasWidth = w || 720;
  this.canvasHeight = h || 1280;

  this.coinValues = [1, 2, 5];
  this.amount = 11;

  this.treeNodeWidth = 120;
  this.treeNodeHeight = 50;
  this.treeLevelHeight = 110;
  this.treeArea = null;
  this.treeNodes = [];
  this.activeTreeNode = null;

  this.treeDefaultColor = "#f5f7ff";
  this.treeActiveColor = "#ffe6a7";
  this.treeSuccessColor = "#cdefc8";
  this.treeFailColor = "#ffc7c7";
  this.treeMemoColor = "#d6e4ff";
  this.treeEdgeColor = "#264653";

  this.coinColor = "#f0f7ff";
  this.coinHighlightColor = "#ffef9c";
  this.coinIDs = [];
  this.coinHighlightIndex = -1;

  this.memoDefaultColor = "#f4f6ff";
  this.memoHighlightColor = "#ffe7aa";
  this.memoResultColor = "#d5f5d5";
  this.memoFailColor = "#ffcfcf";
  this.memoCells = [];
  this.memoValues = [];
  this.memoHighlighted = null;

  this.codeIDs = [];
  this.variableIDs = {};
  this.variableValues = {};

  this.titleID = -1;
  this.coinLabelID = -1;
  this.messageID = -1;

  this.commands = [];
  this.nextIndex = 0;

  this.INF = 9999;

  this.addControls();
  this.reset();
};

CoinChangeTopDown.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Coins (comma separated):");
  this.coinsField = addControlToAlgorithmBar("Text", "1,2,5");
  this.coinsField.size = 24;

  addLabelToAlgorithmBar("Amount:");
  this.amountField = addControlToAlgorithmBar("Text", "11");
  this.amountField.size = 6;

  this.setButton = addControlToAlgorithmBar("Button", "Set Input");
  this.setButton.onclick = this.setInputCallback.bind(this);

  this.runButton = addControlToAlgorithmBar(
    "Button",
    "Run Top-Down Memo"
  );
  this.runButton.onclick = this.runCallback.bind(this);

  addLabelToAlgorithmBar("\u00A0");
  this.pauseButton = addControlToAlgorithmBar("Button", "Pause / Play");
  this.pauseButton.onclick = this.pauseCallback.bind(this);

  this.stepButton = addControlToAlgorithmBar("Button", "Next Step");
  this.stepButton.onclick = this.stepCallback.bind(this);

  this.controls.push(
    this.coinsField,
    this.amountField,
    this.setButton,
    this.runButton,
    this.pauseButton,
    this.stepButton
  );
};

CoinChangeTopDown.prototype.setInputCallback = function () {
  const rawCoins = this.coinsField.value || "";
  const parsed = rawCoins
    .split(/[^0-9]+/)
    .map((item) => parseInt(item, 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  const unique = Array.from(new Set(parsed)).slice(0, CoinChangeTopDown.MAX_COINS);
  unique.sort((a, b) => a - b);
  if (unique.length === 0) {
    unique.push(1, 2, 5);
  }
  this.coinValues = unique;
  this.coinsField.value = unique.join(",");

  let amountValue = parseInt(this.amountField.value, 10);
  if (!Number.isFinite(amountValue)) {
    amountValue = 0;
  }
  amountValue = Math.max(0, Math.min(CoinChangeTopDown.MAX_AMOUNT, amountValue));
  this.amount = amountValue;
  this.amountField.value = String(amountValue);

  this.reset();
};

CoinChangeTopDown.prototype.runCallback = function () {
  this.implementAction(this.runCoinChange.bind(this), "");
};

CoinChangeTopDown.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") {
    doPlayPause();
  }
};

CoinChangeTopDown.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") {
      doPlayPause();
    }
    animationManager.step();
  }
};

CoinChangeTopDown.prototype.reset = function () {
  this.nextIndex = 0;
  this.treeNodes = [];
  this.activeTreeNode = null;
  this.memoCells = [];
  this.memoValues = [];
  this.memoHighlighted = null;
  this.coinIDs = [];
  this.coinHighlightIndex = -1;
  this.codeIDs = [];
  this.variableIDs = {};
  this.variableValues = {};

  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }

  this.setup();
};

CoinChangeTopDown.prototype.computeCoinRowLayout = function (canvasW, rowY) {
  const count = Math.max(1, this.coinValues.length);
  const maxCoinWidth = Math.max(46, Math.floor(canvasW / Math.max(8, count * 2)));
  const coinWidth = Math.min(72, maxCoinWidth);
  const coinHeight = Math.max(30, Math.floor(coinWidth * 0.7));
  const spacing = Math.max(16, Math.floor(coinWidth * 0.4));
  const totalWidth = count * coinWidth + (count - 1) * spacing;
  const startX = canvasW / 2 - totalWidth / 2 + coinWidth / 2;

  return {
    coinWidth,
    coinHeight,
    spacing,
    startX,
    y: rowY,
  };
};

CoinChangeTopDown.prototype.drawCoinRow = function (layout) {
  const coinsY = layout.y;
  const labelY = coinsY - layout.coinHeight / 2 - 18;

  this.coinLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.coinLabelID,
    "coins:",
    this.canvasWidth / 2,
    labelY,
    1
  );
  this.cmd("SetTextStyle", this.coinLabelID, "bold 18");

  this.coinIDs = [];
  for (let i = 0; i < this.coinValues.length; i++) {
    const x = layout.startX + i * (layout.coinWidth + layout.spacing);
    const rectId = this.nextIndex++;
    this.coinIDs.push(rectId);
    this.cmd(
      "CreateRectangle",
      rectId,
      String(this.coinValues[i]),
      layout.coinWidth,
      layout.coinHeight,
      x,
      coinsY
    );
    this.cmd("SetBackgroundColor", rectId, this.coinColor);
    this.cmd("SetForegroundColor", rectId, "#1d3557");
    this.cmd("SetTextStyle", rectId, "bold 18");
  }
};

CoinChangeTopDown.prototype.buildCodeDisplay = function (
  startX,
  startY,
  lineHeight
) {
  this.codeIDs = [];
  for (let i = 0; i < CoinChangeTopDown.CODE.length; i++) {
    const id = this.nextIndex++;
    this.codeIDs.push(id);
    this.cmd(
      "CreateLabel",
      id,
      CoinChangeTopDown.CODE[i],
      startX,
      startY + i * lineHeight,
      0
    );
    this.cmd("SetTextStyle", id, "16");
    this.cmd("SetForegroundColor", id, "#0f172a");
  }
};

CoinChangeTopDown.prototype.buildVariablePanel = function (startX, startY) {
  const entries = [
    { key: "amount", label: "amount:", value: String(this.amount) },
    { key: "index", label: "i:", value: "-" },
    {
      key: "coin",
      label: "coin:",
      value: this.coinValues.length > 0 ? String(this.coinValues[0]) : "-",
    },
    { key: "remain", label: "remain:", value: "-" },
    { key: "take", label: "take:", value: "-" },
    { key: "skip", label: "skip:", value: "-" },
    { key: "best", label: "best:", value: "-" },
    { key: "memo", label: "memo:", value: "-" },
    { key: "result", label: "result:", value: "-" },
  ];

  const spacing = 30;
  const labelX = startX;
  const valueX = startX + 110;

  this.variableIDs = {};
  this.variableValues = {};

  for (let i = 0; i < entries.length; i++) {
    const y = startY + i * spacing;
    const labelId = this.nextIndex++;
    const valueId = this.nextIndex++;
    this.cmd("CreateLabel", labelId, entries[i].label, labelX, y, 0);
    this.cmd("SetTextStyle", labelId, "bold 17");
    this.cmd("SetForegroundColor", labelId, "#1f2937");

    this.cmd("CreateLabel", valueId, entries[i].value, valueX, y, 0);
    this.cmd("SetTextStyle", valueId, "bold 17");
    this.cmd("SetForegroundColor", valueId, "#1f2937");

    this.variableIDs[entries[i].key] = valueId;
    this.variableValues[entries[i].key] = entries[i].value;
  }
};

CoinChangeTopDown.prototype.computeMemoLayout = function (rows, cols) {
  const safeRows = Math.max(1, rows);
  const safeCols = Math.max(1, cols);
  const horizontalMargin = 60;
  const availableWidth = this.canvasWidth - horizontalMargin * 2;
  const cellWidth = Math.max(
    34,
    Math.min(64, Math.floor(availableWidth / (safeCols + 1)))
  );
  const cellHeight = Math.max(30, Math.floor(cellWidth * 0.8));
  const gridWidth = cellWidth * (safeCols + 1);
  const firstCenterX =
    Math.round((this.canvasWidth - gridWidth) / 2) + cellWidth / 2;
  const totalHeight = cellHeight * (safeRows + 1);

  return {
    cellWidth,
    cellHeight,
    firstCenterX,
    totalHeight,
    gridWidth,
  };
};

CoinChangeTopDown.prototype.buildMemoGrid = function (memoTop, layout) {
  const rows = this.coinValues.length;
  const cols = this.amount + 1;
  const cellWidth = layout.cellWidth;
  const cellHeight = layout.cellHeight;
  const firstCenterX = layout.firstCenterX;

  const headerY = memoTop;
  const rowStartY = memoTop + cellHeight;

  this.memoCells = Array.from({ length: rows }, () => []);
  this.memoValues = Array.from({ length: rows }, () => Array(cols).fill(null));

  for (let c = 0; c <= cols; c++) {
    const x = firstCenterX + c * cellWidth;
    const label = c === 0 ? "remain" : String(c - 1);
    const id = this.nextIndex++;
    this.cmd("CreateLabel", id, label, x, headerY, 0);
    this.cmd("SetTextStyle", id, "bold 16");
    this.cmd("SetForegroundColor", id, "#1e3a8a");
  }

  for (let r = 0; r < rows; r++) {
    const rowLabelX = firstCenterX;
    const rowY = rowStartY + r * cellHeight;
    const rowLabelId = this.nextIndex++;
    const labelText = `coin ${this.coinValues[r]}`;
    this.cmd("CreateLabel", rowLabelId, labelText, rowLabelX, rowY, 0);
    this.cmd("SetTextStyle", rowLabelId, "bold 16");
    this.cmd("SetForegroundColor", rowLabelId, "#1e3a8a");

    for (let c = 0; c < cols; c++) {
      const x = firstCenterX + (c + 1) * cellWidth;
      const cellId = this.nextIndex++;
      this.memoCells[r][c] = {
        id: cellId,
        baseColor: this.memoDefaultColor,
      };
      this.cmd(
        "CreateRectangle",
        cellId,
        "-",
        cellWidth - 6,
        cellHeight - 6,
        x,
        rowY
      );
      this.cmd("SetBackgroundColor", cellId, this.memoDefaultColor);
      this.cmd("SetForegroundColor", cellId, "#0f172a");
      this.cmd("SetTextStyle", cellId, "bold 16");
    }
  }
};

CoinChangeTopDown.prototype.resetMemoGrid = function () {
  for (let r = 0; r < this.memoCells.length; r++) {
    for (let c = 0; c < this.memoCells[r].length; c++) {
      const cell = this.memoCells[r][c];
      if (!cell) continue;
      this.memoValues[r][c] = null;
      cell.baseColor = this.memoDefaultColor;
      this.cmd("SetText", cell.id, "-");
      this.cmd("SetBackgroundColor", cell.id, this.memoDefaultColor);
    }
  }
  this.memoHighlighted = null;
};

CoinChangeTopDown.prototype.highlightCode = function (lineIdx) {
  for (let i = 0; i < this.codeIDs.length; i++) {
    this.cmd("SetHighlight", this.codeIDs[i], i === lineIdx ? 1 : 0);
  }
};

CoinChangeTopDown.prototype.narrate = function (text) {
  if (this.messageID < 0) {
    return;
  }
  const content = text || "";
  this.cmd("SetText", this.messageID, content);
  this.cmd("SetAlpha", this.messageID, content ? 1 : 0);
};

CoinChangeTopDown.prototype.formatValue = function (value) {
  if (value === null || value === undefined) {
    return "-";
  }
  if (value === "INF") {
    return "INF";
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value >= this.INF) {
      return "INF";
    }
    return String(value);
  }
  return String(value);
};

CoinChangeTopDown.prototype.updateVariables = function (updates) {
  if (!updates) {
    return;
  }
  const keys = Object.keys(updates);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!Object.prototype.hasOwnProperty.call(this.variableIDs, key)) {
      continue;
    }
    const valueId = this.variableIDs[key];
    const formatted = this.formatValue(updates[key]);
    this.variableValues[key] = formatted;
    this.cmd("SetText", valueId, formatted);
  }
};

CoinChangeTopDown.prototype.highlightCoin = function (index) {
  if (index < 0 || index >= this.coinIDs.length) {
    return;
  }
  if (this.coinHighlightIndex === index) {
    return;
  }
  if (
    this.coinHighlightIndex >= 0 &&
    this.coinIDs[this.coinHighlightIndex] !== undefined
  ) {
    this.cmd(
      "SetBackgroundColor",
      this.coinIDs[this.coinHighlightIndex],
      this.coinColor
    );
  }
  this.cmd("SetBackgroundColor", this.coinIDs[index], this.coinHighlightColor);
  this.coinHighlightIndex = index;
};

CoinChangeTopDown.prototype.clearCoinHighlight = function () {
  if (this.coinHighlightIndex >= 0 && this.coinIDs[this.coinHighlightIndex]) {
    this.cmd(
      "SetBackgroundColor",
      this.coinIDs[this.coinHighlightIndex],
      this.coinColor
    );
  }
  this.coinHighlightIndex = -1;
};

CoinChangeTopDown.prototype.clearTreeNodes = function () {
  for (let i = 0; i < this.treeNodes.length; i++) {
    const node = this.treeNodes[i];
    if (!node) continue;
    if (node.edgeLabelId !== undefined && node.edgeLabelId >= 0) {
      this.cmd("Delete", node.edgeLabelId);
    }
    this.cmd("Delete", node.id);
  }
  this.treeNodes = [];
  this.activeTreeNode = null;
};

CoinChangeTopDown.prototype.computeTreePosition = function (
  depth,
  parentNode,
  branchDir
) {
  const area = this.treeArea || {
    left: 140,
    right: this.canvasWidth - 80,
    top: 260,
    bottom: this.canvasHeight - 220,
  };
  const centerX = (area.left + area.right) / 2;
  const levelHeight = this.treeLevelHeight || 110;
  const y = area.top + depth * levelHeight;

  if (!parentNode) {
    return { x: centerX, y };
  }

  const span = Math.max(120, area.right - area.left);
  const depthScale = Math.pow(1.8, depth + 1);
  let offset = span / depthScale;
  const minOffset =
    (this.treeNodeWidth + 20) / Math.pow(1.4, Math.max(depth, 1));
  if (!Number.isFinite(offset) || offset <= 0) {
    offset = this.treeNodeWidth + 40;
  }
  offset = Math.max(minOffset, offset);
  const direction = branchDir < 0 ? -1 : 1;

  let x = parentNode.x + direction * offset;
  const minX = Math.max(
    this.treeNodeWidth / 2 + 20,
    area.left + this.treeNodeWidth / 2 - this.treeNodeWidth
  );
  const maxX = Math.min(
    this.canvasWidth - this.treeNodeWidth / 2 - 20,
    area.right - this.treeNodeWidth / 2 + this.treeNodeWidth
  );
  if (x < minX) {
    x = minX;
  }
  if (x > maxX) {
    x = maxX;
  }

  const clampedY = Math.min(y, area.bottom - this.treeNodeHeight / 2);
  return { x, y: clampedY };
};

CoinChangeTopDown.prototype.createTreeNode = function (
  index,
  remain,
  depth,
  parentNode,
  edgeLabelText,
  branchDir
) {
  const position = this.computeTreePosition(depth, parentNode, branchDir || 1);
  const nodeId = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    nodeId,
    `dfs(${index}, ${remain})`,
    this.treeNodeWidth,
    this.treeNodeHeight,
    position.x,
    position.y
  );
  this.cmd("SetBackgroundColor", nodeId, this.treeDefaultColor);
  this.cmd("SetForegroundColor", nodeId, "#1f2937");
  this.cmd("SetTextStyle", nodeId, "bold 16");

  let edgeLabelId = -1;
  if (parentNode) {
    this.cmd("Connect", parentNode.id, nodeId);
    if (edgeLabelText) {
      edgeLabelId = this.nextIndex++;
      const labelX = (parentNode.x + position.x) / 2;
      const labelY = (parentNode.y + position.y) / 2 - 18;
      this.cmd(
        "CreateLabel",
        edgeLabelId,
        edgeLabelText,
        labelX,
        labelY,
        0
      );
      this.cmd("SetTextStyle", edgeLabelId, "bold 14");
      this.cmd("SetForegroundColor", edgeLabelId, this.treeEdgeColor);
    }
  }

  const nodeInfo = {
    id: nodeId,
    x: position.x,
    y: position.y,
    depth,
    index,
    remain,
    color: this.treeDefaultColor,
    parent: parentNode,
    edgeLabelId,
  };
  this.treeNodes.push(nodeInfo);
  return nodeInfo;
};

CoinChangeTopDown.prototype.setNodeColor = function (node, color) {
  if (!node) {
    return;
  }
  const fill = color || this.treeDefaultColor;
  this.cmd("SetBackgroundColor", node.id, fill);
  node.color = fill;
};

CoinChangeTopDown.prototype.highlightNode = function (node) {
  if (this.activeTreeNode && this.activeTreeNode !== node) {
    this.setNodeColor(this.activeTreeNode, this.activeTreeNode.color);
  }
  if (node) {
    this.cmd("SetBackgroundColor", node.id, this.treeActiveColor);
    this.activeTreeNode = node;
  }
};

CoinChangeTopDown.prototype.clearNodeHighlight = function () {
  if (this.activeTreeNode) {
    this.setNodeColor(this.activeTreeNode, this.activeTreeNode.color);
    this.activeTreeNode = null;
  }
};

CoinChangeTopDown.prototype.setMemoValue = function (row, col, value, highlight) {
  if (
    row < 0 ||
    col < 0 ||
    row >= this.memoCells.length ||
    col >= this.memoCells[row].length
  ) {
    return;
  }
  const cell = this.memoCells[row][col];
  if (!cell) {
    return;
  }
  const text = this.formatValue(value);
  this.memoValues[row][col] = value;
  this.cmd("SetText", cell.id, text);
  const fill = value >= this.INF ? this.memoFailColor : this.memoResultColor;
  cell.baseColor = fill;
  this.cmd("SetBackgroundColor", cell.id, fill);
  if (highlight) {
    this.highlightMemoCell(row, col, true);
  }
};

CoinChangeTopDown.prototype.highlightMemoCell = function (row, col, highlight) {
  if (
    row < 0 ||
    col < 0 ||
    row >= this.memoCells.length ||
    col >= this.memoCells[row].length
  ) {
    return;
  }
  const cell = this.memoCells[row][col];
  if (!cell) {
    return;
  }
  if (highlight) {
    if (this.memoHighlighted) {
      this.highlightMemoCell(
        this.memoHighlighted.row,
        this.memoHighlighted.col,
        false
      );
    }
    this.cmd("SetBackgroundColor", cell.id, this.memoHighlightColor);
    this.memoHighlighted = { row, col };
  } else {
    const fill = cell.baseColor || this.memoDefaultColor;
    this.cmd("SetBackgroundColor", cell.id, fill);
    if (
      this.memoHighlighted &&
      this.memoHighlighted.row === row &&
      this.memoHighlighted.col === col
    ) {
      this.memoHighlighted = null;
    }
  }
};

CoinChangeTopDown.prototype.clearMemoHighlight = function () {
  if (this.memoHighlighted) {
    this.highlightMemoCell(this.memoHighlighted.row, this.memoHighlighted.col, false);
  }
};

CoinChangeTopDown.prototype.disableUI = function () {
  for (let i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
};

CoinChangeTopDown.prototype.enableUI = function () {
  for (let i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
};

CoinChangeTopDown.prototype.setup = function () {
  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    this.canvasWidth = canvasElem.width;
    this.canvasHeight = canvasElem.height;
  }

  this.commands = [];

  const canvasW = this.canvasWidth || 720;
  const canvasH = this.canvasHeight || 1280;

  const titleY = 40;
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Coin Change Top-Down (Memoization)",
    canvasW / 2,
    titleY,
    1
  );
  this.cmd("SetTextStyle", this.titleID, "bold 26");

  const coinRowY = titleY + 60;
  const coinLayout = this.computeCoinRowLayout(canvasW, coinRowY);
  this.drawCoinRow(coinLayout);

  const messageY = coinRowY + coinLayout.coinHeight + 30;
  this.messageID = this.nextIndex++;
  this.cmd("CreateLabel", this.messageID, "", canvasW / 2, messageY, 1);
  this.cmd("SetTextStyle", this.messageID, "bold 18");
  this.cmd("SetForegroundColor", this.messageID, "#1d3557");
  this.cmd("SetAlpha", this.messageID, 0);

  const rows = this.coinValues.length;
  const cols = this.amount + 1;
  const memoLayout = this.computeMemoLayout(rows, cols);
  const memoBottomMargin = 60;
  let memoTop = canvasH - memoLayout.totalHeight - memoBottomMargin;
  const minTreeHeight = 260;
  const treeTop = messageY + 40;
  if (memoTop - treeTop < minTreeHeight) {
    memoTop = treeTop + minTreeHeight;
  }
  const treeBottom = memoTop - 24;

  const codeStartX = 70;
  const codeStartY = treeTop;
  const codeLineHeight = 20;
  this.buildCodeDisplay(codeStartX, codeStartY, codeLineHeight);
  const codeBottomY = codeStartY + codeLineHeight * (CoinChangeTopDown.CODE.length - 1);

  const variableStartY = codeBottomY + 24;
  this.buildVariablePanel(codeStartX, variableStartY);

  const treeLeft = Math.max(140, codeStartX + 150);
  const treeRight = canvasW - 80;
  this.treeArea = {
    left: treeLeft,
    right: treeRight,
    top: treeTop,
    bottom: treeBottom,
  };
  const availableTreeHeight = treeBottom - treeTop;
  const depthEstimate = Math.max(4, Math.min(10, this.amount + 2));
  this.treeLevelHeight = Math.max(90, Math.min(150, availableTreeHeight / depthEstimate));

  this.buildMemoGrid(memoTop, memoLayout);
  this.resetMemoGrid();

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

CoinChangeTopDown.prototype.runCoinChange = function () {
  this.commands = [];
  this.clearTreeNodes();
  this.clearMemoHighlight();
  this.resetMemoGrid();
  this.clearCoinHighlight();

  const coins = this.coinValues.slice();
  const amount = this.amount;
  const rows = coins.length;

  if (rows === 0) {
    this.narrate("Please provide at least one coin value.");
    return this.commands;
  }

  for (let r = 0; r < rows; r++) {
    this.memoValues[r] = Array(this.amount + 1).fill(null);
  }

  this.highlightCode(0);
  this.narrate("Solve coin change using top-down recursion with memoization.");
  this.updateVariables({
    amount,
    index: "-",
    coin: rows > 0 ? coins[0] : "-",
    remain: amount,
    take: "-",
    skip: "-",
    best: "-",
    memo: "-",
    result: "-",
  });
  this.cmd("Step");

  this.highlightCode(3);
  this.narrate(`Start with dfs(0, ${amount}).`);
  this.cmd("Step");
  this.highlightCode(-1);

  const self = this;
  const INF = this.INF;

  function dfs(index, remain, parentNode, depth, branchDir, edgeLabel) {
    const node = self.createTreeNode(index, remain, depth, parentNode, edgeLabel, branchDir);
    self.highlightNode(node);
    self.highlightCode(7);
    self.narrate(`Visiting dfs(${index}, ${remain}).`);
    self.updateVariables({
      index,
      coin: index < coins.length ? coins[index] : "-",
      remain,
      take: "-",
      skip: "-",
      best: "-",
      memo: "-",
    });
    self.cmd("Step");

    if (remain === 0) {
      self.highlightCode(8);
      self.narrate("Remaining amount is 0, so no more coins are needed.");
      self.updateVariables({ best: 0, memo: 0 });
      self.setNodeColor(node, self.treeSuccessColor);
      if (index < rows) {
        self.setMemoValue(index, remain, 0, true);
        self.cmd("Step");
        self.highlightMemoCell(index, remain, false);
      } else {
        self.cmd("Step");
      }
      self.clearNodeHighlight();
      return 0;
    }

    if (remain < 0 || index >= rows) {
      self.highlightCode(9);
      if (remain < 0) {
        self.narrate("We overshot the amount; treat this path as impossible.");
      } else {
        self.narrate("No coins left to use, so this path fails.");
      }
      self.updateVariables({ best: "INF" });
      self.setNodeColor(node, self.treeFailColor);
      self.cmd("Step");
      self.clearNodeHighlight();
      return INF;
    }

    const memoVal = self.memoValues[index][remain];
    if (memoVal !== null && memoVal !== undefined) {
      self.highlightCode(10);
      self.narrate("Memo table already has this state.");
      self.highlightMemoCell(index, remain, true);
      self.updateVariables({ memo: memoVal, best: memoVal });
      self.cmd("Step");
      self.highlightMemoCell(index, remain, false);
      self.setNodeColor(node, self.treeMemoColor);
      self.clearNodeHighlight();
      return memoVal;
    }

    self.highlightCode(11);
    self.narrate(`Take coin ${coins[index]} and stay on the same index.`);
    self.highlightCoin(index);
    self.cmd("Step");
    const takeChild = dfs(
      index,
      remain - coins[index],
      node,
      depth + 1,
      -1,
      `take ${coins[index]}`
    );
    let takeResult = takeChild >= INF ? INF : takeChild + 1;
    self.clearCoinHighlight();
    self.updateVariables({ take: takeResult });
    self.cmd("Step");

    self.highlightCode(12);
    self.narrate("Skip this coin and move to the next index.");
    self.cmd("Step");
    const skipResult = dfs(index + 1, remain, node, depth + 1, 1, "skip");
    self.updateVariables({ skip: skipResult });
    self.cmd("Step");

    const best = Math.min(takeResult, skipResult);
    self.highlightCode(13);
    self.narrate(
      `Choose the better of take (${self.formatValue(takeResult)}) and skip (${self.formatValue(
        skipResult
      )}).`
    );
    self.updateVariables({ best });
    self.cmd("Step");

    self.highlightCode(14);
    self.narrate("Store the result in the memo table.");
    self.setMemoValue(index, remain, best, true);
    self.updateVariables({ memo: best });
    self.cmd("Step");
    self.highlightMemoCell(index, remain, false);

    if (best >= INF) {
      self.setNodeColor(node, self.treeFailColor);
    } else {
      self.setNodeColor(node, self.treeSuccessColor);
    }
    self.clearNodeHighlight();
    return best;
  }

  const answer = dfs(0, amount, null, 0, 0, null);

  const finalAnswer = answer >= INF ? -1 : answer;
  this.highlightCode(4);
  if (finalAnswer === -1) {
    this.narrate("No combination of coins makes the target. Return -1.");
  } else {
    this.narrate(`Minimum coins needed: ${finalAnswer}.`);
  }
  this.updateVariables({ result: finalAnswer });
  this.cmd("Step");

  this.highlightCode(5);
  this.cmd("Step");
  this.highlightCode(-1);
  this.clearNodeHighlight();
  this.clearCoinHighlight();
  this.clearMemoHighlight();

  return this.commands;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new CoinChangeTopDown(animManag, canvas.width, canvas.height);
}

