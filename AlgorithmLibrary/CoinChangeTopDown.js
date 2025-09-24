function CoinChangeTopDown(am, w, h) {
  this.init(am, w, h);
}

CoinChangeTopDown.prototype = new Algorithm();
CoinChangeTopDown.prototype.constructor = CoinChangeTopDown;
CoinChangeTopDown.superclass = Algorithm.prototype;

CoinChangeTopDown.CODE = [
  "int coinChange(int[] coins, int amount) {",
  "  final int INF = amount + 1;",
  "  Map<State, Integer> memo = new HashMap<>();",
  "  int ans = dfs(0, amount);",
  "  return ans >= INF ? -1 : ans;",
  "}",
  "int dfs(int index, int remain) {",
  "  if (remain == 0) return 0;",
  "  if (index == coins.length) return INF;",
  "  if (memo.containsKey((index, remain))) return memo.get((index, remain));",
  "  int take = INF;",
  "  if (coins[index] <= remain)",
  "    take = 1 + dfs(index, remain - coins[index]);",
  "  int skip = dfs(index + 1, remain);",
  "  int best = Math.min(take, skip);",
  "  memo.put((index, remain), best);",
  "  return best;",
  "}",
];

CoinChangeTopDown.DEFAULT_COINS = [1, 2, 5];
CoinChangeTopDown.DEFAULT_AMOUNT = 11;
CoinChangeTopDown.MAX_COINS = 6;
CoinChangeTopDown.MAX_AMOUNT = 20;
CoinChangeTopDown.MEMO_ROW_GAP = 6;
CoinChangeTopDown.MEMO_CELL_HEIGHT = 42;

CoinChangeTopDown.prototype.init = function (am, w, h) {
  CoinChangeTopDown.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.coinValues = CoinChangeTopDown.DEFAULT_COINS.slice();
  this.amount = CoinChangeTopDown.DEFAULT_AMOUNT;
  this.messageText = "";

  this.codeIDs = [];
  this.coinIDs = [];
  this.memoCellIDs = [];
  this.memoRowLabelIDs = [];
  this.memoHeaderIDs = [];
  this.treeNodes = {};
  this.treeEdgeLabelIDs = [];
  this.currentCodeHighlight = -1;

  this.titleID = -1;
  this.coinLabelID = -1;
  this.messageID = -1;
  this.stateLabelID = -1;
  this.stateValueID = -1;
  this.coinValueLabelID = -1;
  this.coinValueID = -1;
  this.takeLabelID = -1;
  this.takeValueID = -1;
  this.skipLabelID = -1;
  this.skipValueID = -1;
  this.memoLabelID = -1;
  this.memoValueID = -1;
  this.resultLabelID = -1;
  this.resultValueID = -1;

  this.treeDefaultColor = "#f5f7fb";
  this.treeActiveColor = "#ffe8a6";
  this.treeSolvedColor = "#dff7df";
  this.treeFailColor = "#fdd6d6";
  this.treeMemoColor = "#cfe0ff";

  this.coinColor = "#f0f7ff";
  this.memoCellColor = "#f4f6ff";

  this.canvasWidth = w || 1080;
  this.canvasHeight = h || 1920;

  this.setup();
};

CoinChangeTopDown.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Coins (comma/space):");
  this.coinsField = addControlToAlgorithmBar("Text", "1,2,5");
  this.coinsField.size = 30;

  addLabelToAlgorithmBar("Amount:");
  this.amountField = addControlToAlgorithmBar("Text", "11");
  this.amountField.size = 6;

  this.buildButton = addControlToAlgorithmBar("Button", "Set Input");
  this.buildButton.onclick = this.setInputCallback.bind(this);

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
    this.buildButton,
    this.runButton
  );
};

CoinChangeTopDown.prototype.setInputCallback = function () {
  const coinInfo = this.parseCoinsInput(this.coinsField.value.trim());
  const amountInfo = this.parseAmountInput(this.amountField.value.trim());

  let coins = coinInfo.coins;
  const messages = [];

  if (coinInfo.warnings.length > 0) {
    messages.push(...coinInfo.warnings);
  }

  if (!coins || coins.length === 0) {
    coins = CoinChangeTopDown.DEFAULT_COINS.slice();
    messages.push("Using default coin set 1, 2, 5.");
  }

  let amount = amountInfo.amount;
  if (amountInfo.warnings.length > 0) {
    messages.push(...amountInfo.warnings);
  }

  this.coinsField.value = coins.join(",");
  this.amountField.value = String(amount);

  this.coinValues = coins;
  this.amount = amount;
  this.messageText = messages.join(" ");

  this.setup();
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

CoinChangeTopDown.prototype.setup = function () {
  if (!Array.isArray(this.coinValues) || this.coinValues.length === 0) {
    this.coinValues = CoinChangeTopDown.DEFAULT_COINS.slice();
  }
  if (!Number.isFinite(this.amount) || this.amount < 0) {
    this.amount = CoinChangeTopDown.DEFAULT_AMOUNT;
  }

  const canvasElem = document.getElementById("canvas");
  const canvasW = canvasElem ? canvasElem.width : this.canvasWidth;
  const canvasH = canvasElem ? canvasElem.height : this.canvasHeight;

  this.canvasWidth = canvasW;
  this.canvasHeight = canvasH;

  this.commands = [];
  this.codeIDs = [];
  this.coinIDs = [];
  this.memoCellIDs = [];
  this.memoRowLabelIDs = [];
  this.memoHeaderIDs = [];
  this.treeNodes = {};
  this.treeEdgeLabelIDs = [];
  this.currentCodeHighlight = -1;

  const TITLE_Y = 44;
  const coinRowY = TITLE_Y + 70;
  const messageY = coinRowY + 48;
  const treeTop = messageY + 100;
  const treeSideMargin = Math.max(72, Math.floor(canvasW * 0.08));
  const treeLeft = treeSideMargin;
  const treeWidth = Math.max(320, canvasW - treeSideMargin * 2);

  const memoRows = (this.coinValues ? this.coinValues.length : 0) + 1;
  const memoGapY = 80;
  const memoBottomMargin = 60;
  const memoHeightEstimate = this.estimateMemoTableHeight(
    memoRows,
    CoinChangeTopDown.MEMO_CELL_HEIGHT,
    CoinChangeTopDown.MEMO_ROW_GAP
  );
  const maxTreeHeight =
    canvasH - treeTop - memoGapY - memoHeightEstimate - memoBottomMargin;

  let treeHeight;
  if (!Number.isFinite(maxTreeHeight) || maxTreeHeight <= 0) {
    treeHeight = Math.max(420, Math.floor((canvasH - treeTop) * 0.7));
  } else {
    const preferredTreeHeight = Math.floor((canvasH - treeTop) * 0.72);
    treeHeight = Math.min(
      maxTreeHeight,
      Math.max(preferredTreeHeight, 420)
    );
  }

  if (!Number.isFinite(treeHeight) || treeHeight <= 0) {
    treeHeight = Math.max(420, Math.floor((canvasH - treeTop) * 0.7));
  }

  const memoTop = treeTop + treeHeight + memoGapY;

  this.treeArea = {
    left: treeLeft,
    top: treeTop,
    width: treeWidth,
    height: treeHeight,
  };
  this.treeNodeRadius = 32;
  this.treeCenterX = treeLeft + treeWidth / 2;

  const estimatedDepth = Math.max(4, Math.min(this.amount + 3, 14));
  this.treeLevelGap = Math.max(
    80,
    Math.min(170, Math.floor(treeHeight / Math.max(estimatedDepth, 1)))
  );
  const labelOffsetCap = this.treeLevelGap - this.treeNodeRadius - 10;
  const clampedLabelOffset = Math.min(52, labelOffsetCap);
  this.treeNodeLabelOffset = Math.max(36, clampedLabelOffset);
  this.treeBaseHorizontalGap = Math.max(260, Math.floor(treeWidth * 0.72));

  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Coin Change (Top-Down Memo)",
    canvasW / 2,
    TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleID, "bold 26");

  this.coinLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.coinLabelID,
    "coins array:",
    canvasW / 2,
    coinRowY - 36,
    1
  );
  this.cmd("SetTextStyle", this.coinLabelID, "bold 18");

  this.buildCoinsRow({ rowY: coinRowY });

  this.messageID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.messageID,
    this.messageText || "",
    canvasW / 2,
    messageY,
    1
  );
  this.cmd("SetTextStyle", this.messageID, "bold 18");
  this.cmd("SetForegroundColor", this.messageID, "#1f3b73");
  this.cmd("SetAlpha", this.messageID, this.messageText ? 1 : 0);

  this.buildMemoTable(memoTop);
  this.resetMemoTable();
  this.resetVariablePanel();
  this.resetTreeDisplay();

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

CoinChangeTopDown.prototype.buildCoinsRow = function (options) {
  const settings = options || {};
  const coins = this.coinValues || [];
  const count = coins.length;
  const rowY = settings.rowY || 120;
  const availableWidth = this.canvasWidth - 160;
  const baseWidth = count > 0 ? Math.floor(availableWidth / count) : availableWidth;
  const cellWidth = Math.max(40, Math.min(68, baseWidth - 12));
  const spacing = Math.max(12, Math.floor(cellWidth * 0.25));
  const totalWidth = count * cellWidth + Math.max(0, count - 1) * spacing;
  const startX = Math.floor((this.canvasWidth - totalWidth) / 2) + cellWidth / 2;
  const cellHeight = Math.max(32, Math.floor(cellWidth * 0.75));

  this.coinIDs = [];
  for (let i = 0; i < count; i++) {
    const id = this.nextIndex++;
    this.coinIDs.push(id);
    const x = startX + i * (cellWidth + spacing);
    this.cmd(
      "CreateRectangle",
      id,
      String(coins[i]),
      cellWidth,
      cellHeight,
      x,
      rowY
    );
    this.cmd("SetBackgroundColor", id, this.coinColor);
    this.cmd("SetForegroundColor", id, "#000000");
    this.cmd("SetTextStyle", id, "bold 18");
  }
};

CoinChangeTopDown.prototype.buildCodeDisplay = function (startX, startY, lineHeight) {
  const textStyle = "16";
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
    this.cmd("SetTextStyle", id, textStyle);
  }
};

CoinChangeTopDown.prototype.buildVariablePanel = function (x, startY, spacing) {
  const entries = [
    { labelProp: "stateLabelID", valueProp: "stateValueID", label: "state:" },
    {
      labelProp: "coinValueLabelID",
      valueProp: "coinValueID",
      label: "current coin:",
    },
    { labelProp: "takeLabelID", valueProp: "takeValueID", label: "take cost:" },
    { labelProp: "skipLabelID", valueProp: "skipValueID", label: "skip cost:" },
    { labelProp: "memoLabelID", valueProp: "memoValueID", label: "memo result:" },
    { labelProp: "resultLabelID", valueProp: "resultValueID", label: "answer:" },
  ];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const labelID = this.nextIndex++;
    const valueID = this.nextIndex++;
    const y = startY + i * spacing;
    this[entry.labelProp] = labelID;
    this[entry.valueProp] = valueID;

    this.cmd("CreateLabel", labelID, entry.label, x, y, 0);
    this.cmd("SetTextStyle", labelID, "bold 16");

    this.cmd("CreateLabel", valueID, "-", x, y + 18, 0);
    this.cmd("SetTextStyle", valueID, "bold 18");
    this.cmd("SetForegroundColor", valueID, "#1f3b73");
  }
};

CoinChangeTopDown.prototype.estimateMemoTableHeight = function (
  rowCount,
  cellHeight,
  gap
) {
  const rows = Math.max(0, Math.floor(rowCount));
  const headerAllowance = 32;
  if (rows === 0) {
    return headerAllowance + cellHeight;
  }
  return headerAllowance + rows * (cellHeight + gap) + cellHeight / 2;
};

CoinChangeTopDown.prototype.buildMemoTable = function (topY) {
  const amount = Math.max(0, Math.floor(this.amount));
  const rows = (this.coinValues ? this.coinValues.length : 0) + 1;
  const cols = amount + 1;
  const gap = CoinChangeTopDown.MEMO_ROW_GAP;
  const cellWidth = Math.max(
    44,
    Math.min(70, Math.floor((this.canvasWidth - 140) / (cols + 1)))
  );
  const cellHeight = CoinChangeTopDown.MEMO_CELL_HEIGHT;
  const totalWidth = (cols + 1) * cellWidth + cols * gap;
  const startX = Math.floor((this.canvasWidth - totalWidth) / 2);

  this.memoHeaderIDs = [];
  for (let c = 0; c <= cols; c++) {
    const headerID = this.nextIndex++;
    const text = c === 0 ? "index" : String(c - 1);
    const x = startX + c * (cellWidth + gap) + cellWidth / 2;
    this.cmd("CreateLabel", headerID, text, x, topY, 1);
    this.cmd("SetTextStyle", headerID, "bold 15");
    this.memoHeaderIDs.push(headerID);
  }

  this.memoCellIDs = [];
  this.memoRowLabelIDs = [];
  const rowLabelTexts = [];
  for (let r = 0; r < rows; r++) {
    let labelText = `i=${r}`;
    if (r < this.coinValues.length) {
      labelText += ` (coin ${this.coinValues[r]})`;
    } else {
      labelText += " (end)";
    }
    rowLabelTexts.push(labelText);
  }

  for (let r = 0; r < rows; r++) {
    const rowLabelID = this.nextIndex++;
    const y = topY + (r + 1) * (cellHeight + gap);
    const x = startX + cellWidth / 2;
    this.cmd("CreateLabel", rowLabelID, rowLabelTexts[r], x, y, 1);
    this.cmd("SetTextStyle", rowLabelID, "bold 15");
    this.memoRowLabelIDs.push(rowLabelID);

    const rowCells = [];
    for (let c = 0; c < cols; c++) {
      const cellID = this.nextIndex++;
      const cellX = startX + (c + 1) * (cellWidth + gap) + cellWidth / 2;
      this.cmd(
        "CreateRectangle",
        cellID,
        "",
        cellWidth,
        cellHeight,
        cellX,
        y
      );
      this.cmd("SetBackgroundColor", cellID, this.memoCellColor);
      this.cmd("SetForegroundColor", cellID, "#000000");
      rowCells.push({ id: cellID, row: r, col: c });
    }
    this.memoCellIDs.push(rowCells);
  }

  this.memoColCount = cols;
  this.memoRowCount = rows;
  this.memoCellWidth = cellWidth;
  this.memoCellHeight = cellHeight;
};

CoinChangeTopDown.prototype.resetMemoTable = function () {
  if (!Array.isArray(this.memoCellIDs)) {
    return;
  }
  for (let r = 0; r < this.memoRowCount; r++) {
    for (let c = 0; c < this.memoColCount; c++) {
      const cell = this.getMemoCell(r, c);
      if (cell) {
        this.cmd("SetText", cell.id, "?");
        this.cmd("SetBackgroundColor", cell.id, this.memoCellColor);
        this.cmd("SetHighlight", cell.id, 0);
      }
    }
  }
};

CoinChangeTopDown.prototype.resetVariablePanel = function () {
  const defaults = [
    [this.stateValueID, "-"],
    [this.coinValueID, "-"],
    [this.takeValueID, "-"],
    [this.skipValueID, "-"],
    [this.memoValueID, "-"],
    [this.resultValueID, "-"],
  ];
  for (let i = 0; i < defaults.length; i++) {
    const [id, text] = defaults[i];
    if (id >= 0) {
      this.cmd("SetText", id, text);
    }
  }
};

CoinChangeTopDown.prototype.resetTreeDisplay = function () {
  if (this.treeNodes) {
    const keys = Object.keys(this.treeNodes);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const node = this.treeNodes[key];
      if (!node) continue;
      if (node.parentKey && this.treeNodes[node.parentKey]) {
        this.cmd(
          "Disconnect",
          this.treeNodes[node.parentKey].id,
          node.id
        );
      }
      if (node.edgeLabelID !== undefined && node.edgeLabelID >= 0) {
        this.cmd("Delete", node.edgeLabelID);
      }
      if (node.labelID >= 0) {
        this.cmd("Delete", node.labelID);
      }
      this.cmd("Delete", node.id);
    }
  }
  this.treeNodes = {};
  this.treeEdgeLabelIDs = [];
};

CoinChangeTopDown.prototype.parseCoinsInput = function (raw) {
  const result = { coins: [], warnings: [] };
  if (!raw) {
    return result;
  }

  const tokens = raw.split(/[\s,;]+/).filter((t) => t.length > 0);
  if (tokens.length === 0) {
    return result;
  }

  const values = [];
  for (let i = 0; i < tokens.length; i++) {
    const num = Number(tokens[i]);
    if (Number.isFinite(num) && num > 0) {
      values.push(Math.floor(num));
    }
  }
  if (values.length === 0) {
    return result;
  }

  const unique = [];
  const seen = new Set();
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (!seen.has(value)) {
      seen.add(value);
      unique.push(value);
    }
  }
  if (unique.length < values.length) {
    result.warnings.push("Duplicate coin values ignored.");
  }

  unique.sort((a, b) => a - b);
  if (unique.length > CoinChangeTopDown.MAX_COINS) {
    unique.length = CoinChangeTopDown.MAX_COINS;
    result.warnings.push(
      `Showing the first ${CoinChangeTopDown.MAX_COINS} coins for clarity.`
    );
  }

  result.coins = unique;
  return result;
};

CoinChangeTopDown.prototype.parseAmountInput = function (raw) {
  const warnings = [];
  let value = Number(raw);
  if (!Number.isFinite(value)) {
    warnings.push("Amount reset to default 11.");
    value = CoinChangeTopDown.DEFAULT_AMOUNT;
  }
  value = Math.floor(value);
  if (value < 0) {
    warnings.push("Amount cannot be negative. Using 0.");
    value = 0;
  }
  if (value > CoinChangeTopDown.MAX_AMOUNT) {
    warnings.push(
      `Amount limited to ${CoinChangeTopDown.MAX_AMOUNT} to keep the memo table readable.`
    );
    value = CoinChangeTopDown.MAX_AMOUNT;
  }
  return { amount: value, warnings };
};

CoinChangeTopDown.prototype.makeStateKey = function (index, remain) {
  return `${index}|${remain}`;
};

CoinChangeTopDown.prototype.ensureTreeNode = function (
  key,
  index,
  remain,
  depth,
  parentKey,
  branchType,
  branchLabel
) {
  if (!this.treeArea) {
    return null;
  }

  let node = this.treeNodes[key];
  if (node) {
    return node;
  }

  let x = this.treeCenterX;
  let y = this.treeArea.top + this.treeNodeRadius;
  if (parentKey && this.treeNodes[parentKey]) {
    const parent = this.treeNodes[parentKey];
    const offset = this.treeBaseHorizontalGap / Math.pow(Math.max(depth, 1), 1.2);
    const direction = branchType === "take" ? -1 : 1;
    x = parent.x + direction * offset;
    y = parent.y + this.treeLevelGap;
    const minX = this.treeArea.left + this.treeNodeRadius;
    const maxX = this.treeArea.left + this.treeArea.width - this.treeNodeRadius;
    if (x < minX) {
      x = minX;
    }
    if (x > maxX) {
      x = maxX;
    }
    const maxY = this.treeArea.top + this.treeArea.height - this.treeNodeRadius;
    if (y > maxY) {
      y = maxY;
    }
  }

  const nodeID = this.nextIndex++;
  this.cmd("CreateCircle", nodeID, String(remain), x, y);
  this.cmd("SetBackgroundColor", nodeID, this.treeDefaultColor);
  this.cmd("SetForegroundColor", nodeID, "#000000");
  this.cmd("SetTextStyle", nodeID, "bold 20");

  const labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    `i=${index}`,
    x,
    y + this.treeNodeLabelOffset,
    1
  );
  this.cmd("SetTextStyle", labelID, "bold 16");

  node = {
    id: nodeID,
    labelID,
    x,
    y,
    index,
    remain,
    depth,
    parentKey: parentKey || null,
    branchType: branchType || null,
    edgeLabelID: -1,
  };
  this.treeNodes[key] = node;

  if (parentKey && this.treeNodes[parentKey]) {
    const parent = this.treeNodes[parentKey];
    this.cmd("Connect", parent.id, nodeID);
    if (branchLabel) {
      const label = this.nextIndex++;
      const labelX = (parent.x + node.x) / 2;
      const labelY = (parent.y + node.y) / 2 - 20;
      this.cmd("CreateLabel", label, branchLabel, labelX, labelY, 1);
      this.cmd("SetTextStyle", label, "bold 14");
      node.edgeLabelID = label;
      this.treeEdgeLabelIDs.push(label);
    }
  }

  return node;
};

CoinChangeTopDown.prototype.getMemoCell = function (row, col) {
  if (
    !Array.isArray(this.memoCellIDs) ||
    row < 0 ||
    row >= this.memoCellIDs.length ||
    col < 0 ||
    col >= this.memoCellIDs[row].length
  ) {
    return null;
  }
  return this.memoCellIDs[row][col];
};

CoinChangeTopDown.prototype.setMemoValue = function (row, col, value, options) {
  const cell = this.getMemoCell(row, col);
  if (!cell) {
    return;
  }
  const text = this.formatCost(value, this.amount + 1);
  const color = options && options.color ? options.color : this.memoCellColor;
  this.cmd("SetText", cell.id, text);
  this.cmd("SetBackgroundColor", cell.id, color);
};

CoinChangeTopDown.prototype.highlightMemoCell = function (row, col, highlight) {
  const cell = this.getMemoCell(row, col);
  if (!cell) {
    return;
  }
  this.cmd("SetHighlight", cell.id, highlight ? 1 : 0);
};

CoinChangeTopDown.prototype.highlightTreeNode = function (key, highlight) {
  const node = this.treeNodes[key];
  if (!node) {
    return;
  }
  const color = highlight ? this.treeActiveColor : this.treeDefaultColor;
  this.cmd("SetBackgroundColor", node.id, color);
};

CoinChangeTopDown.prototype.colorTreeNode = function (key, color) {
  const node = this.treeNodes[key];
  if (!node) {
    return;
  }
  this.cmd("SetBackgroundColor", node.id, color || this.treeDefaultColor);
};

CoinChangeTopDown.prototype.updateTreeNodeLabel = function (key, index, best) {
  const node = this.treeNodes[key];
  if (!node || node.labelID < 0) {
    return;
  }
  const suffix = best === undefined ? "" : `, best=${this.formatCost(best, this.amount + 1)}`;
  this.cmd("SetText", node.labelID, `i=${index}${suffix}`);
};

CoinChangeTopDown.prototype.updateStatePanel = function (index, remain, coin) {
  if (this.stateValueID >= 0) {
    this.cmd("SetText", this.stateValueID, `(i=${index}, remain=${remain})`);
  }
  if (this.coinValueID >= 0) {
    const text = coin !== null && coin !== undefined ? String(coin) : "-";
    this.cmd("SetText", this.coinValueID, text);
  }
};

CoinChangeTopDown.prototype.updateTakePanel = function (value) {
  if (this.takeValueID >= 0) {
    this.cmd("SetText", this.takeValueID, this.formatCost(value, this.amount + 1));
  }
};

CoinChangeTopDown.prototype.updateSkipPanel = function (value) {
  if (this.skipValueID >= 0) {
    this.cmd("SetText", this.skipValueID, this.formatCost(value, this.amount + 1));
  }
};

CoinChangeTopDown.prototype.updateMemoPanel = function (value) {
  if (this.memoValueID >= 0) {
    this.cmd("SetText", this.memoValueID, this.formatCost(value, this.amount + 1));
  }
};

CoinChangeTopDown.prototype.updateAnswerPanel = function (value) {
  if (this.resultValueID >= 0) {
    this.cmd("SetText", this.resultValueID, value);
  }
};

CoinChangeTopDown.prototype.formatCost = function (value, INF) {
  if (value === null || value === undefined) {
    return "-";
  }
  if (value >= INF) {
    return "\u221E";
  }
  return String(value);
};

CoinChangeTopDown.prototype.showMessage = function (text) {
  if (this.messageID < 0) {
    return;
  }
  this.cmd("SetText", this.messageID, text || "");
  this.cmd("SetAlpha", this.messageID, text ? 1 : 0);
};

CoinChangeTopDown.prototype.clearMessage = function () {
  if (this.messageID >= 0) {
    this.cmd("SetAlpha", this.messageID, 0);
  }
};

CoinChangeTopDown.prototype.highlightCode = function (lineIdx) {
  if (!Array.isArray(this.codeIDs)) {
    return;
  }
  if (this.currentCodeHighlight >= 0 && this.currentCodeHighlight < this.codeIDs.length) {
    this.cmd("SetHighlight", this.codeIDs[this.currentCodeHighlight], 0);
  }
  if (lineIdx >= 0 && lineIdx < this.codeIDs.length) {
    this.cmd("SetHighlight", this.codeIDs[lineIdx], 1);
    this.currentCodeHighlight = lineIdx;
  } else {
    this.currentCodeHighlight = -1;
  }
};

CoinChangeTopDown.prototype.knapsack = function (
  coins,
  index,
  remain,
  memo,
  depth,
  parentKey,
  branchType,
  branchLabel
) {
  const INF = this.amount + 1;
  const key = this.makeStateKey(index, remain);
  const node = this.ensureTreeNode(key, index, remain, depth, parentKey, branchType, branchLabel);
  this.highlightTreeNode(key, true);
  this.updateStatePanel(index, remain, index < coins.length ? coins[index] : null);
  this.showMessage(`Exploring state (i=${index}, remain=${remain}).`);
  this.cmd("Step");

  if (remain === 0) {
    this.highlightCode(7);
    this.showMessage("No amount remaining. Return 0 coins.");
    this.cmd("Step");
    memo[key] = 0;
    this.updateTakePanel(0);
    this.updateSkipPanel(0);
    this.updateMemoPanel(0);
    this.setMemoValue(index, remain, 0, { color: this.treeSolvedColor });
    this.colorTreeNode(key, this.treeSolvedColor);
    this.updateTreeNodeLabel(key, index, 0);
    this.highlightTreeNode(key, false);
    return 0;
  }

  this.highlightCode(8);
  this.cmd("Step");
  if (index >= coins.length) {
    this.showMessage("Out of coins, this branch fails (∞).");
    memo[key] = INF;
    this.updateTakePanel(INF);
    this.updateSkipPanel(INF);
    this.updateMemoPanel(INF);
    this.setMemoValue(index, remain, INF, { color: this.treeFailColor });
    this.colorTreeNode(key, this.treeFailColor);
    this.updateTreeNodeLabel(key, index, INF);
    this.highlightTreeNode(key, false);
    return INF;
  }

  this.highlightCode(9);
  this.cmd("Step");
  if (Object.prototype.hasOwnProperty.call(memo, key)) {
    const cached = memo[key];
    this.highlightMemoCell(index, remain, true);
    this.showMessage("Memo hit: reuse cached value.");
    this.cmd("Step");
    this.highlightMemoCell(index, remain, false);
    this.updateMemoPanel(cached);
    this.colorTreeNode(key, this.treeMemoColor);
    this.updateTreeNodeLabel(key, index, cached);
    this.highlightTreeNode(key, false);
    return cached;
  }

  this.highlightCode(10);
  this.cmd("Step");
  let takeCost = INF;
  const coinValue = coins[index];
  if (coinValue <= remain) {
    this.highlightCode(11);
    this.showMessage(`Try taking coin ${coinValue}.`);
    this.updateTakePanel(null);
    this.cmd("Step");
    this.highlightCode(12);
    this.cmd("Step");
    const takeResult = this.knapsack(
      coins,
      index,
      remain - coinValue,
      memo,
      depth + 1,
      key,
      "take",
      `-${coinValue}`
    );
    takeCost = takeResult >= INF ? INF : takeResult + 1;
    this.highlightTreeNode(key, true);
    this.updateStatePanel(index, remain, coinValue);
    this.updateTakePanel(takeCost);
    this.showMessage(
      takeCost >= INF
        ? `Taking coin ${coinValue} cannot reach the target.`
        : `Taking coin ${coinValue} uses ${takeCost} coins in total.`
    );
    this.cmd("Step");
  } else {
    this.highlightCode(11);
    this.showMessage(`Coin ${coinValue} is too large for remain ${remain}.`);
    this.updateTakePanel(INF);
    this.cmd("Step");
  }

  this.highlightCode(13);
  this.showMessage(`Skip coin ${coinValue} and move to index ${index + 1}.`);
  this.updateSkipPanel(null);
  this.cmd("Step");
  const skipCost = this.knapsack(
    coins,
    index + 1,
    remain,
    memo,
    depth + 1,
    key,
    "skip",
    "skip"
  );
  this.highlightTreeNode(key, true);
  this.updateStatePanel(index, remain, coinValue);
  this.updateSkipPanel(skipCost);
  this.showMessage(
    skipCost >= INF
      ? "Skipping runs out of coins."
      : `Skipping keeps the best cost at ${skipCost}.`
  );
  this.cmd("Step");

  this.highlightCode(14);
  const best = Math.min(takeCost, skipCost);
  this.updateMemoPanel(best);
  this.showMessage(
    best >= INF
      ? "Neither branch worked, memoize ∞."
      : `Memoize the better answer ${best}.`
  );
  this.cmd("Step");

  memo[key] = best;
  this.highlightCode(15);
  this.setMemoValue(index, remain, best, {
    color: best >= INF ? this.treeFailColor : this.treeSolvedColor,
  });
  this.cmd("Step");

  this.highlightCode(16);
  this.cmd("Step");

  if (best >= INF) {
    this.colorTreeNode(key, this.treeFailColor);
  } else {
    this.colorTreeNode(key, this.treeSolvedColor);
  }
  this.updateTreeNodeLabel(key, index, best);
  this.highlightTreeNode(key, false);
  return best;
};

CoinChangeTopDown.prototype.runCoinChange = function () {
  this.commands = [];
  this.resetMemoTable();
  this.resetVariablePanel();
  this.resetTreeDisplay();
  this.clearMessage();
  this.highlightCode(-1);
  this.updateAnswerPanel("?");

  const coins = (this.coinValues || []).slice();
  const amount = this.amount;
  const INF = amount + 1;
  const memo = Object.create(null);

  this.highlightCode(0);
  this.showMessage("Start the memoized DFS over (index, remain) states.");
  this.cmd("Step");

  this.highlightCode(1);
  this.cmd("Step");
  this.highlightCode(2);
  this.cmd("Step");
  this.highlightCode(3);
  this.cmd("Step");
  this.highlightCode(4);
  this.cmd("Step");

  this.highlightCode(6);
  this.cmd("Step");

  const result = this.knapsack(coins, 0, amount, memo, 0, null, null, null);
  this.highlightCode(4);
  this.cmd("Step");

  const answer = result >= INF ? -1 : result;
  if (answer === -1) {
    this.showMessage("No combination of coins can reach the target amount.");
  } else {
    this.showMessage(`Optimal answer: use ${answer} coins.`);
  }
  this.updateAnswerPanel(String(answer));
  this.highlightCode(-1);

  return this.commands;
};


var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new CoinChangeTopDown(animManag, canvas.width, canvas.height);
}
