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
  "    final int INF = 1_000_000;",
  "    if (amount == 0) return 0;",
  "    int[][] memo = new int[coins.length][amount + 1];",
  "    for (int[] row : memo) Arrays.fill(row, -2);",
  "    int ans = dfs(0, amount, coins, memo, INF);",
  "    return ans >= INF ? -1 : ans;",
  "}",
  "",
  "int dfs(int i, int remain, int[] coins, int[][] memo, int INF) {",
  "    if (remain == 0) return 0;",
  "    if (i == coins.length || remain < 0) return INF;",
  "    if (memo[i][remain] != -2) return memo[i][remain];",
  "    int take = 1 + dfs(i, remain - coins[i], coins, memo, INF);",
  "    int skip = dfs(i + 1, remain, coins, memo, INF);",
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

  this.messageText = "";
  this.boardReservedHeight = 0;
  this.boardBackgroundID = -1;
  this.boardLineIDs = [];
  this.boardTextCache = [];
  this.boardInfo = null;

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
  this.boardBackgroundID = -1;
  this.boardLineIDs = [];
  this.boardTextCache = [];
  this.boardInfo = null;

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

CoinChangeTopDown.prototype.buildNarrationBoard = function (options) {
  const settings = options || {};
  const canvasW = settings.canvasW || this.canvasWidth || 720;
  const messageY = settings.messageY || 0;
  const reservedHeight = Math.max(150, settings.reservedHeight || 180);

  const topGap = Math.max(12, Math.floor(reservedHeight * 0.1));
  let boardHeight = Math.max(140, Math.floor(reservedHeight * 0.78));
  const boardTopMin = messageY + Math.max(6, Math.floor(reservedHeight * 0.04));
  let boardTop = messageY + topGap;
  const boardBottomLimit = messageY + reservedHeight;
  if (boardTop < boardTopMin) {
    boardTop = boardTopMin;
  }
  if (boardTop + boardHeight > boardBottomLimit) {
    boardHeight = Math.max(140, boardBottomLimit - boardTop);
  }
  if (boardHeight <= 0) {
    boardHeight = Math.max(140, Math.floor(reservedHeight * 0.78));
  }

  const centerX = canvasW / 2;
  const centerY = boardTop + boardHeight / 2;
  let boardWidth = Math.max(260, Math.floor(canvasW * 0.9));
  if (boardWidth > canvasW - 24) {
    boardWidth = canvasW - 24;
  }

  this.boardBackgroundID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.boardBackgroundID,
    "",
    boardWidth,
    boardHeight,
    centerX,
    centerY
  );
  this.cmd("SetForegroundColor", this.boardBackgroundID, "#324d7a");
  this.cmd("SetBackgroundColor", this.boardBackgroundID, "#f5f7ff");

  const lineCount = 4;
  const textPadding = Math.max(24, Math.floor(boardWidth * 0.08));
  const textAreaWidth = Math.max(200, boardWidth - textPadding * 2);
  const approxCharWidth = Math.max(7, Math.floor(boardWidth * 0.02));
  const charLimit = Math.max(18, Math.floor(textAreaWidth / approxCharWidth));
  const firstLineY = boardTop + Math.max(28, Math.floor(boardHeight * 0.24));
  const lineSpacing = Math.max(26, Math.floor(boardHeight * 0.2));

  this.boardLineIDs = [];
  this.boardTextCache = [];
  for (let i = 0; i < lineCount; i++) {
    const lineId = this.nextIndex++;
    const lineY = firstLineY + i * lineSpacing;
    this.cmd("CreateLabel", lineId, "", centerX, lineY, 1);
    this.cmd("SetTextStyle", lineId, "bold 17");
    this.cmd("SetForegroundColor", lineId, "#1f2a44");
    this.boardLineIDs.push(lineId);
    this.boardTextCache.push("");
  }

  this.boardInfo = {
    top: boardTop,
    bottom: boardTop + boardHeight,
    left: centerX - boardWidth / 2,
    right: centerX + boardWidth / 2,
    width: boardWidth,
    height: boardHeight,
    lineCount,
    charLimit,
  };

  this.setBoardText([""]);

  return {
    top: boardTop,
    bottom: boardTop + boardHeight,
  };
};

CoinChangeTopDown.prototype.wrapBoardLines = function (lines, limit, maxLines) {
  const charLimit = Math.max(12, limit || 42);
  const totalLines = Math.max(
    1,
    maxLines || (this.boardLineIDs ? this.boardLineIDs.length : 1)
  );

  const source = [];
  if (Array.isArray(lines)) {
    for (let i = 0; i < lines.length; i++) {
      const entry = lines[i];
      if (entry === null || entry === undefined) {
        continue;
      }
      source.push(String(entry));
    }
  } else if (lines !== undefined && lines !== null) {
    source.push(String(lines));
  }
  if (source.length === 0) {
    source.push("");
  }

  const wrapped = [];
  outer: for (let i = 0; i < source.length; i++) {
    const text = source[i];
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      if (wrapped.length < totalLines) {
        wrapped.push("");
      }
      continue;
    }
    const words = trimmed.split(/\s+/);
    let current = "";
    for (let j = 0; j < words.length; j++) {
      const word = words[j];
      if (!word) {
        continue;
      }
      if (current.length === 0) {
        if (word.length > charLimit && wrapped.length < totalLines) {
          wrapped.push(word.substring(0, charLimit));
          current = word.substring(charLimit);
        } else {
          current = word;
        }
      } else if ((current + " " + word).length <= charLimit) {
        current += " " + word;
      } else {
        wrapped.push(current);
        if (wrapped.length >= totalLines) {
          break outer;
        }
        current = word.length > charLimit ? word.substring(0, charLimit) : word;
      }
      if (wrapped.length >= totalLines) {
        break outer;
      }
    }
    if (current && wrapped.length < totalLines) {
      wrapped.push(current);
    }
    if (wrapped.length >= totalLines) {
      break;
    }
  }

  while (wrapped.length < totalLines) {
    wrapped.push("");
  }

  return wrapped.slice(0, totalLines);
};

CoinChangeTopDown.prototype.setBoardText = function (content) {
  if (!this.boardLineIDs || this.boardLineIDs.length === 0) {
    return;
  }
  const charLimit =
    this.boardInfo && this.boardInfo.charLimit
      ? this.boardInfo.charLimit
      : 48;
  const lineCount =
    this.boardInfo && this.boardInfo.lineCount
      ? this.boardInfo.lineCount
      : this.boardLineIDs.length;
  const lines = this.wrapBoardLines(content, charLimit, lineCount);
  for (let i = 0; i < this.boardLineIDs.length; i++) {
    const text = i < lines.length ? lines[i] : "";
    if (this.boardTextCache[i] === text) {
      continue;
    }
    this.boardTextCache[i] = text;
    this.cmd("SetText", this.boardLineIDs[i], text);
  }
};

CoinChangeTopDown.prototype.highlightCode = function (lineIdx) {
  for (let i = 0; i < this.codeIDs.length; i++) {
    this.cmd("SetHighlight", this.codeIDs[i], i === lineIdx ? 1 : 0);
  }
};

CoinChangeTopDown.prototype.narrate = function (text) {
  if (!this.boardLineIDs || this.boardLineIDs.length === 0) {
    return;
  }
  if (Array.isArray(text)) {
    this.messageText = text.join(" ");
    this.setBoardText(text);
  } else if (text === undefined || text === null || text === "") {
    this.messageText = "";
    this.setBoardText([""]);
  } else {
    const content = String(text);
    this.messageText = content;
    this.setBoardText([content]);
  }
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
  let y = area.top + depth * levelHeight;
  const bottomLimit = area.bottom - this.treeNodeHeight / 2;
  if (y > bottomLimit) {
    y = bottomLimit;
  }

  if (!parentNode) {
    return { x: centerX, y };
  }

  const span = Math.max(120, area.right - area.left);
  const direction = branchDir < 0 ? -1 : 1;
  const baseOffset = span / Math.pow(2, depth + 1);
  const minOffset = Math.max(this.treeNodeWidth * 0.75, 70);
  const offset = Math.max(minOffset, baseOffset);
  let x = parentNode.x + direction * offset;
  const minX = area.left + this.treeNodeWidth / 2;
  const maxX = area.right - this.treeNodeWidth / 2;
  if (x < minX) {
    x = minX;
  }
  if (x > maxX) {
    x = maxX;
  }
  return { x, y };
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
    this.cmd("SetEdgeColor", parentNode.id, nodeId, this.treeEdgeColor);
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

  const titleY = Math.max(38, Math.floor(canvasH * 0.03));
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

  const coinRowY = titleY + Math.max(60, Math.floor(canvasH * 0.06));
  const coinLayout = this.computeCoinRowLayout(canvasW, coinRowY);
  this.drawCoinRow(coinLayout);

  const boardAnchorY =
    coinRowY + Math.floor(coinLayout.coinHeight / 2) + Math.max(24, Math.floor(canvasH * 0.02));
  const reservedHeight = Math.max(180, Math.floor(canvasH * 0.18));
  this.boardReservedHeight = reservedHeight;
  const boardLayout = this.buildNarrationBoard({
    canvasW,
    messageY: boardAnchorY,
    reservedHeight,
  });

  const rows = this.coinValues.length;
  const cols = this.amount + 1;
  const memoLayout = this.computeMemoLayout(rows, cols);
  const memoBottomMargin = Math.max(44, Math.floor(canvasH * 0.04));
  const treeGap = Math.max(24, Math.floor(canvasH * 0.03));
  let treeTop = boardLayout.bottom + treeGap;
  let memoTop = canvasH - memoLayout.totalHeight - memoBottomMargin;
  const minTreeHeight = Math.max(260, Math.floor(canvasH * 0.32));
  if (memoTop < treeTop + minTreeHeight + treeGap) {
    memoTop = treeTop + minTreeHeight + treeGap;
  }
  if (memoTop + memoLayout.totalHeight + memoBottomMargin > canvasH) {
    memoTop = canvasH - memoLayout.totalHeight - memoBottomMargin;
    if (memoTop < treeTop + minTreeHeight + treeGap) {
      treeTop = Math.max(boardLayout.bottom + treeGap, memoTop - treeGap - minTreeHeight);
    }
  }
  let treeBottom = memoTop - treeGap;
  if (treeBottom <= treeTop) {
    treeBottom = treeTop + minTreeHeight;
    memoTop = treeBottom + treeGap;
  }
  let treeHeight = treeBottom - treeTop;
  if (treeHeight < minTreeHeight) {
    treeHeight = minTreeHeight;
    treeBottom = treeTop + treeHeight;
    memoTop = treeBottom + treeGap;
  }

  const codeStartX = Math.max(70, Math.floor(canvasW * 0.1));
  const codeStartY = treeTop;
  const codeLineHeight = 20;
  this.buildCodeDisplay(codeStartX, codeStartY, codeLineHeight);
  const codeBottomY =
    codeStartY + codeLineHeight * (CoinChangeTopDown.CODE.length - 1);

  const variableStartY =
    codeBottomY + Math.max(24, Math.floor(canvasH * 0.02));
  this.buildVariablePanel(codeStartX, variableStartY);

  const treeLeft = Math.max(codeStartX + 220, Math.floor(canvasW * 0.22));
  const treeRight = canvasW - Math.max(70, Math.floor(canvasW * 0.08));
  this.treeArea = {
    left: treeLeft,
    right: treeRight,
    top: treeTop,
    bottom: treeBottom,
  };
  const treeWidth = Math.max(260, treeRight - treeLeft);
  const smallestCoin =
    this.coinValues && this.coinValues.length > 0 ? this.coinValues[0] : 1;
  const estimatedDepth =
    smallestCoin > 0
      ? Math.min(9, Math.floor(this.amount / smallestCoin) + 2)
      : 6;
  const availableTreeHeight = Math.max(200, treeBottom - treeTop);
  this.treeLevelHeight = Math.max(
    96,
    Math.min(
      150,
      Math.floor(availableTreeHeight / Math.max(estimatedDepth, 2))
    )
  );
  const idealNodeWidth = Math.max(
    110,
    Math.floor(treeWidth / Math.min(6, Math.max(3, this.amount + 2))) - 8
  );
  this.treeNodeWidth = Math.max(90, Math.min(160, idealNodeWidth));
  this.treeNodeHeight = Math.max(54, Math.floor(this.treeNodeWidth * 0.45));

  this.buildMemoGrid(memoTop, memoLayout);
  this.resetMemoGrid();
  this.setBoardText([
    'Press "Run Top-Down Memo" to watch the recursion unfold.',
  ]);

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
    this.narrate([
      "Please enter at least one coin value before running the visualization.",
    ]);
    this.highlightCode(-1);
    return this.commands;
  }

  for (let r = 0; r < rows; r++) {
    this.memoValues[r] = Array(this.amount + 1).fill(null);
  }

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
  this.highlightCode(2);
  this.narrate([
    "First check whether the target amount is already zero.",
  ]);
  this.cmd("Step");
  if (amount === 0) {
    this.narrate([
      "Amount is zero, so we can return 0 immediately.",
      "No recursion is required.",
    ]);
    this.updateVariables({ remain: 0, result: 0, best: 0, memo: 0 });
    this.cmd("Step");
    this.highlightCode(-1);
    return this.commands;
  }

  this.highlightCode(3);
  this.narrate(["Allocate the memo table for every (index, remain) pair."]);
  this.cmd("Step");

  this.highlightCode(4);
  this.narrate([
    "Fill the memo table with -2 so we can detect when a result is cached.",
  ]);
  this.cmd("Step");

  this.highlightCode(5);
  this.narrate([`Begin the recursion with dfs(0, ${amount}).`]);
  this.cmd("Step");
  this.highlightCode(-1);

  const self = this;
  const INF = this.INF;

  function dfs(index, remain, parentNode, depth, branchDir, edgeLabel) {
    const node = self.createTreeNode(index, remain, depth, parentNode, edgeLabel, branchDir);
    self.highlightNode(node);
    self.highlightCode(9);
    self.narrate([
      `dfs(${index}, ${remain})`,
      "Decide whether to take the current coin or move to the next one.",
    ]);
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
      self.highlightCode(10);
      self.narrate([
        "remain is 0, so this branch used the exact amount.",
        "Return 0 coins from this call.",
      ]);
      self.updateVariables({ best: 0, memo: 0 });
      self.setNodeColor(node, self.treeSuccessColor);
      if (index < rows && remain <= amount) {
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
      self.highlightCode(11);
      self.narrate(
        remain < 0
          ? [
              "remain dropped below 0, so this path overshoots the amount.",
              "Return INF to mark it as impossible.",
            ]
          : [
              "We are out of coin denominations.",
              "Return INF because we cannot build the amount.",
            ]
      );
      self.updateVariables({ best: "INF" });
      self.setNodeColor(node, self.treeFailColor);
      self.cmd("Step");
      self.clearNodeHighlight();
      return INF;
    }

    const memoVal =
      index < rows && remain >= 0 && remain <= amount
        ? self.memoValues[index][remain]
        : null;
    if (memoVal !== null && memoVal !== undefined) {
      self.highlightCode(12);
      self.narrate([
        `memo[${index}][${remain}] = ${self.formatValue(memoVal)} is already known.`,
        "Reuse the cached value without more recursion.",
      ]);
      self.highlightMemoCell(index, remain, true);
      self.updateVariables({ memo: memoVal, best: memoVal });
      self.cmd("Step");
      self.highlightMemoCell(index, remain, false);
      self.setNodeColor(node, self.treeMemoColor);
      self.clearNodeHighlight();
      return memoVal;
    }

    const coinValue = coins[index];
    self.highlightCode(13);
    self.narrate([
      `Take coin ${coinValue} and stay at index ${index}.`,
      `The remaining amount becomes ${remain - coinValue}.`,
    ]);
    self.highlightCoin(index);
    self.cmd("Step");
    const takeChild = dfs(
      index,
      remain - coinValue,
      node,
      depth + 1,
      -1,
      `+${coinValue}`
    );
    const takeResult = takeChild >= INF ? INF : takeChild + 1;
    self.clearCoinHighlight();
    self.updateVariables({ take: takeResult });
    self.cmd("Step");

    self.highlightCode(14);
    self.narrate([
      `Skip coin ${coinValue} and move to dfs(${index + 1}, ${remain}).`,
    ]);
    self.cmd("Step");
    const skipResult = dfs(index + 1, remain, node, depth + 1, 1, "skip");
    self.updateVariables({ skip: skipResult });
    self.cmd("Step");

    const best = Math.min(takeResult, skipResult);
    self.highlightCode(15);
    self.narrate([
      `Choose the smaller of take (${self.formatValue(takeResult)}) and skip (${self.formatValue(
        skipResult
      )}).`,
    ]);
    self.updateVariables({ best });
    self.cmd("Step");

    self.highlightCode(16);
    self.narrate([
      `Store ${self.formatValue(best)} into memo[${index}][${remain}] for reuse.`,
    ]);
    if (index < rows && remain >= 0 && remain <= amount) {
      self.setMemoValue(index, remain, best, true);
    }
    self.updateVariables({ memo: best });
    self.cmd("Step");
    if (index < rows && remain >= 0 && remain <= amount) {
      self.highlightMemoCell(index, remain, false);
    }

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

  this.highlightCode(6);
  if (finalAnswer === -1) {
    this.narrate([
      "No combination of coins reaches the target amount.",
      "Return -1 to signal the amount cannot be formed.",
    ]);
  } else {
    this.narrate([
      `Minimum coins needed: ${finalAnswer}.`,
      "Return this value from coinChange.",
    ]);
  }
  this.updateVariables({ result: finalAnswer });
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

