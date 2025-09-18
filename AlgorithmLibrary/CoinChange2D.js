// BSD-2-Clause license header from original framework applies.

function CoinChange2D(am, w, h) {
  this.init(am, w, h);
}

CoinChange2D.prototype = new Algorithm();
CoinChange2D.prototype.constructor = CoinChange2D;
CoinChange2D.superclass = Algorithm.prototype;

CoinChange2D.CODE = [
  "public int coinChange2D(int[] coins, int amount) {",
  "    int n = coins.length;",
  "    int INF = amount + 1;",
  "    int[][] dp = new int[n + 1][amount + 1];",
  "    for (int a = 1; a <= amount; a++) dp[0][a] = INF;",
  "    for (int i = 1; i <= n; i++) {",
  "        dp[i][0] = 0;",
  "        int coin = coins[i - 1];",
  "        for (int a = 1; a <= amount; a++) {",
  "            dp[i][a] = dp[i - 1][a];",
  "            if (a >= coin && dp[i][a - coin] != INF) {",
  "                dp[i][a] = Math.min(dp[i][a], dp[i][a - coin] + 1);",
  "            }",
  "        }",
  "    }",
  "    return dp[n][amount] >= INF ? -1 : dp[n][amount];",
  "}",
];

CoinChange2D.prototype.init = function (am, w, h) {
  CoinChange2D.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.coinValues = [1, 2, 5];
  this.amount = 11;
  this.messageText = "";

  this.codeIDs = [];
  this.dpIDs = [];
  this.dpValues = [];
  this.dpColors = [];
  this.dpCellCenters = [];
  this.rowLabelIDs = [];
  this.colLabelIDs = [];
  this.coinIDs = [];
  this.coinPositions = [];
  this.coinLabelID = -1;
  this.titleID = -1;
  this.messageID = -1;

  this.nLabelID = -1;
  this.nValueID = -1;
  this.amountLabelID = -1;
  this.amountValueID = -1;
  this.infLabelID = -1;
  this.infValueID = -1;
  this.currentCoinLabelID = -1;
  this.currentCoinValueID = -1;
  this.currentAmountLabelID = -1;
  this.currentAmountValueID = -1;
  this.resultLabelID = -1;
  this.resultValueID = -1;

  this.rowHighlight = -1;
  this.colHighlight = -1;
  this.coinHighlight = -1;

  this.cellWidth = 0;
  this.cellHeight = 0;
  this.canvasWidth = w || 720;
  this.canvasHeight = h || 1280;

  this.untouchedColor = "#f5f7fb";
  this.reachableColor = "#dff7df";
  this.infColor = "#ffe0e0";
  this.inspectColor = "#ffd27f";
  this.rowLabelColor = "#000000";
  this.rowLabelHighlightColor = "#1b5fcc";
  this.colLabelColor = "#000000";
  this.colLabelHighlightColor = "#1b5fcc";
  this.coinColor = "#f0f7ff";
  this.coinHighlightColor = "#ffef9c";
  this.excludeTextColor = "#d45c16";
  this.includeTextColor = "#1b5f3b";
  this.compareLabelStyle = "bold 16";
  this.compareMargin = 70;

  this.setup();
};

CoinChange2D.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Coins (comma/space):");
  this.coinsField = addControlToAlgorithmBar("Text", "1,2,5");
  this.coinsField.size = 30;

  addLabelToAlgorithmBar("Amount:");
  this.amountField = addControlToAlgorithmBar("Text", "11");
  this.amountField.size = 6;

  this.buildButton = addControlToAlgorithmBar("Button", "Set Input");
  this.buildButton.onclick = this.setInputCallback.bind(this);

  this.runButton = addControlToAlgorithmBar("Button", "Run Coin Change");
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

CoinChange2D.prototype.setInputCallback = function () {
  const rawCoins = this.coinsField.value.trim();
  const parsedCoins = rawCoins
    ? rawCoins
        .split(/[\s,;]+/)
        .map(Number)
        .filter((v) => !Number.isNaN(v) && v > 0)
    : [];

  if (parsedCoins.length > 0) {
    parsedCoins.sort((a, b) => a - b);
    if (parsedCoins.length > 8) {
      parsedCoins.length = 8;
    }
    this.coinValues = parsedCoins;
    this.coinsField.value = this.coinValues.join(", ");
  }

  const amountValue = parseInt(this.amountField.value, 10);
  if (!Number.isNaN(amountValue)) {
    this.amount = Math.max(0, Math.min(20, amountValue));
    this.amountField.value = String(this.amount);
  }

  this.messageText = "";
  this.reset();
};

CoinChange2D.prototype.runCallback = function () {
  this.implementAction(this.runCoinChange.bind(this), "");
};

CoinChange2D.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") {
    doPlayPause();
  }
};

CoinChange2D.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") {
      doPlayPause();
    }
    animationManager.step();
  }
};

CoinChange2D.prototype.setup = function () {
  if (!this.coinValues || this.coinValues.length === 0) {
    this.coinValues = [1, 2, 5];
  }
  if (this.amount === undefined || this.amount === null) {
    this.amount = 11;
  }

  const canvasElem = document.getElementById("canvas");
  const canvasW = canvasElem ? canvasElem.width : 720;
  const canvasH = canvasElem ? canvasElem.height : 1280;

  this.canvasWidth = canvasW;
  this.canvasHeight = canvasH;

  const TITLE_Y = 60;
  const CODE_START_X = 80;
  const CODE_LINE_H = 22;
  const INFO_SPACING = 32;
  const GRID_GAP = 160;
  const MESSAGE_TOP_MARGIN = 54;
  const MESSAGE_BOTTOM_MARGIN = 54;
  const coinHeaderY = TITLE_Y + 60;
  const coinsRowY = coinHeaderY + 50;
  const infoStartY = coinsRowY + 70;
  const infoBottomY = infoStartY + 2 * INFO_SPACING;

  this.commands = [];
  this.codeIDs = [];
  this.dpIDs = [];
  this.dpValues = [];
  this.dpColors = [];
  this.rowLabelIDs = [];
  this.colLabelIDs = [];
  this.coinIDs = [];
  this.coinPositions = [];
  this.dpCellCenters = [];

  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "bottom - up 2D tabulation",
    canvasW / 2,
    TITLE_Y,
    1
  );
  this.cmd("SetTextStyle", this.titleID, "bold 26");
  this.cmd("SetForegroundColor", this.titleID, "#1b1b1b");

  this.coinLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.coinLabelID, "coins array:", canvasW / 2, coinHeaderY, 1);
  this.cmd("SetTextStyle", this.coinLabelID, "bold 18");

  this.buildCoinsRow(canvasW, coinsRowY);

  const infoX = CODE_START_X;

  this.nLabelID = this.nextIndex++;
  this.nValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.nLabelID, "n (coins length):", infoX, infoStartY, 0);
  this.cmd("CreateLabel", this.nValueID, String(this.coinValues.length), infoX + 220, infoStartY, 0);

  this.amountLabelID = this.nextIndex++;
  this.amountValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.amountLabelID, "amount:", infoX + 320, infoStartY, 0);
  this.cmd(
    "CreateLabel",
    this.amountValueID,
    String(this.amount),
    infoX + 420,
    infoStartY,
    0
  );

  this.infLabelID = this.nextIndex++;
  this.infValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.infLabelID, "INF:", infoX, infoStartY + INFO_SPACING, 0);
  this.cmd(
    "CreateLabel",
    this.infValueID,
    String(this.amount + 1),
    infoX + 220,
    infoStartY + INFO_SPACING,
    0
  );

  this.currentCoinLabelID = this.nextIndex++;
  this.currentCoinValueID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.currentCoinLabelID,
    "current coin:",
    infoX + 320,
    infoStartY + INFO_SPACING,
    0
  );
  this.cmd(
    "CreateLabel",
    this.currentCoinValueID,
    "-",
    infoX + 420,
    infoStartY + INFO_SPACING,
    0
  );

  this.currentAmountLabelID = this.nextIndex++;
  this.currentAmountValueID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.currentAmountLabelID,
    "current amount:",
    infoX,
    infoStartY + 2 * INFO_SPACING,
    0
  );
  this.cmd(
    "CreateLabel",
    this.currentAmountValueID,
    "-",
    infoX + 220,
    infoStartY + 2 * INFO_SPACING,
    0
  );

  const gridTop = infoBottomY + GRID_GAP;
  const layout = this.buildDPGrid(canvasW, gridTop);

  const messagePreferredY = infoBottomY + MESSAGE_TOP_MARGIN;
  const messageLowerBound = infoBottomY + 30;
  const messageMaxY = layout.headerY - MESSAGE_BOTTOM_MARGIN;
  let messageY = messagePreferredY;
  if (messageY > messageMaxY) {
    messageY = Math.max(messageLowerBound, messageMaxY);
  }

  this.messageID = this.nextIndex++;
  this.cmd("CreateLabel", this.messageID, this.messageText, canvasW / 2, messageY, 1);
  this.cmd("SetForegroundColor", this.messageID, "#003366");
  this.cmd("SetTextStyle", this.messageID, "bold 18");

  const codeStartPreferred = layout.resultY + 50;
  const totalCodeHeight = (CoinChange2D.CODE.length - 1) * CODE_LINE_H;
  const maxStartY = canvasH - totalCodeHeight - 40;
  const codeStartY = Math.max(codeStartPreferred, infoBottomY + 120);
  const clampedStartY = Math.min(codeStartY, maxStartY);
  this.buildCodeDisplay(CODE_START_X, clampedStartY, CODE_LINE_H);

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

CoinChange2D.prototype.buildCodeDisplay = function (startX, startY, lineHeight) {
  for (let i = 0; i < CoinChange2D.CODE.length; i++) {
    const id = this.nextIndex++;
    this.codeIDs.push(id);
    this.cmd("CreateLabel", id, CoinChange2D.CODE[i], startX, startY + i * lineHeight, 0);
    this.cmd("SetForegroundColor", id, "#000000");
    this.cmd("SetTextStyle", id, "14");
  }
};

CoinChange2D.prototype.buildCoinsRow = function (canvasW, coinsY) {
  const coinCount = this.coinValues.length;
  if (coinCount === 0) {
    this.messageText = "Provide at least one coin to visualize.";
    return;
  }

  const COIN_W = 56;
  const COIN_H = 44;
  const COIN_SP = 18;
  const rowWidth = coinCount * COIN_W + (coinCount - 1) * COIN_SP;
  const startX = Math.floor((canvasW - rowWidth) / 2) + COIN_W / 2;

  this.coinPositions = [];
  for (let i = 0; i < coinCount; i++) {
    const id = this.nextIndex++;
    const x = startX + i * (COIN_W + COIN_SP);
    this.coinIDs.push(id);
    this.coinPositions.push({ x, y: coinsY });
    this.cmd("CreateRectangle", id, String(this.coinValues[i]), COIN_W, COIN_H, x, coinsY);
    this.cmd("SetBackgroundColor", id, this.coinColor);
    this.cmd("SetForegroundColor", id, "#000000");
  }
};

CoinChange2D.prototype.buildDPGrid = function (canvasW, gridTop) {
  const amount = this.amount;
  const n = this.coinValues.length;
  const rows = n + 1;
  const cols = amount + 1;
  const gap = 8;
  const rowLabelWidth = 140;
  const margin = 40;

  let cellWidth = Math.floor(
    (canvasW - 2 * margin - rowLabelWidth - (cols - 1) * gap) / Math.max(1, cols)
  );
  cellWidth = Math.max(34, Math.min(72, cellWidth));
  const cellHeight = Math.max(34, Math.min(50, cellWidth + 6));

  this.cellWidth = cellWidth;
  this.cellHeight = cellHeight;
  this.dpCellCenters = [];

  const gridWidth = cols * cellWidth + (cols - 1) * gap;
  const areaWidth = rowLabelWidth + gridWidth;
  const areaLeft = margin;
  const firstColX = areaLeft + rowLabelWidth + cellWidth / 2;

  const headerY = gridTop - cellHeight / 2 - 26;

  this.colLabelIDs = [];
  for (let a = 0; a < cols; a++) {
    const x = firstColX + a * (cellWidth + gap);
    const id = this.nextIndex++;
    this.colLabelIDs.push(id);
    this.cmd("CreateLabel", id, `a=${a}`, x, headerY, 1);
    this.cmd("SetForegroundColor", id, this.colLabelColor);
    this.cmd("SetTextStyle", id, "14");
  }

  this.dpIDs = [];
  this.dpValues = [];
  this.dpColors = [];
  this.rowLabelIDs = [];
  for (let i = 0; i < rows; i++) {
    const rowIDs = [];
    const rowValues = [];
    const rowColors = [];
    const rowCenters = [];
    const y = gridTop + i * (cellHeight + gap);
    for (let a = 0; a < cols; a++) {
      const x = firstColX + a * (cellWidth + gap);
      const id = this.nextIndex++;
      rowIDs.push(id);
      rowValues.push(null);
      rowColors.push(this.untouchedColor);
      rowCenters.push({ x, y });
      this.cmd("CreateRectangle", id, "", cellWidth, cellHeight, x, y);
      this.cmd("SetBackgroundColor", id, this.untouchedColor);
      this.cmd("SetForegroundColor", id, "#000000");
    }
    this.dpIDs.push(rowIDs);
    this.dpValues.push(rowValues);
    this.dpColors.push(rowColors);
    this.dpCellCenters.push(rowCenters);

    const rowLabel = this.nextIndex++;
    const labelText =
      i === 0 ? "0 coins" : `i=${i} (coin ${this.coinValues[i - 1]})`;
    const labelX = areaLeft + rowLabelWidth / 2;
    this.cmd("CreateLabel", rowLabel, labelText, labelX, y, 1);
    this.cmd("SetForegroundColor", rowLabel, this.rowLabelColor);
    this.cmd("SetTextStyle", rowLabel, "14");
    this.rowLabelIDs.push(rowLabel);
  }

  const gridBottom = gridTop + (rows - 1) * (cellHeight + gap) + cellHeight / 2;
  const resultY = gridBottom + 50;

  this.resultLabelID = this.nextIndex++;
  this.resultValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.resultLabelID, "answer:", areaLeft + rowLabelWidth, resultY, 0);
  this.cmd("CreateLabel", this.resultValueID, "?", areaLeft + rowLabelWidth + 100, resultY, 0);
  this.cmd("SetTextStyle", this.resultLabelID, "bold 18");
  this.cmd("SetTextStyle", this.resultValueID, "bold 18");

  return {
    resultY,
    gridBottom,
    headerY,
    areaLeft,
    rowLabelWidth,
  };
};

CoinChange2D.prototype.highlightCode = function (lineIdx) {
  for (let i = 0; i < this.codeIDs.length; i++) {
    this.cmd("SetHighlight", this.codeIDs[i], i === lineIdx ? 1 : 0);
  }
};

CoinChange2D.prototype.updateDPCell = function (i, a, value) {
  if (!this.dpIDs[i] || !this.dpIDs[i][a]) {
    return;
  }
  this.dpValues[i][a] = value;
  let color = this.reachableColor;
  let text = String(value);
  if (value >= this.currentINF) {
    color = this.infColor;
    text = "INF";
  }
  this.dpColors[i][a] = color;
  this.cmd("SetText", this.dpIDs[i][a], text);
  this.cmd("SetBackgroundColor", this.dpIDs[i][a], color);
};

CoinChange2D.prototype.flashCell = function (i, a, color) {
  if (!this.dpIDs[i] || !this.dpIDs[i][a]) {
    return;
  }
  const base = this.dpColors[i][a] || this.untouchedColor;
  this.cmd("SetBackgroundColor", this.dpIDs[i][a], color);
  this.cmd("Step");
  this.cmd("SetBackgroundColor", this.dpIDs[i][a], base);
};

CoinChange2D.prototype.clampToCanvas = function (x) {
  const margin = 40;
  return Math.max(margin, Math.min(this.canvasWidth - margin, x));
};

CoinChange2D.prototype.setCellHighlight = function (i, a, enabled) {
  if (this.dpIDs[i] && this.dpIDs[i][a]) {
    this.cmd("SetHighlight", this.dpIDs[i][a], enabled ? 1 : 0);
  }
};

CoinChange2D.prototype.formatValue = function (value) {
  if (this.currentINF === undefined || this.currentINF === null) {
    return String(value);
  }
  return value >= this.currentINF ? "INF" : String(value);
};

CoinChange2D.prototype.createComparisonLabel = function (text, x, y, color) {
  const id = this.nextIndex++;
  this.cmd("CreateLabel", id, text, x, y, 1);
  this.cmd("SetForegroundColor", id, color);
  this.cmd("SetTextStyle", id, this.compareLabelStyle);
  this.cmd("SetLayer", id, 1);
  return id;
};

CoinChange2D.prototype.animateExcludeComparison = function (i, a, value) {
  if (
    !this.dpCellCenters[i - 1] ||
    !this.dpCellCenters[i - 1][a] ||
    !this.dpCellCenters[i] ||
    !this.dpCellCenters[i][a]
  ) {
    this.updateDPCell(i, a, value);
    return -1;
  }

  const sourcePos = this.dpCellCenters[i - 1][a];
  const targetPos = this.dpCellCenters[i][a];
  this.setCellHighlight(i - 1, a, true);
  const labelID = this.createComparisonLabel(
    `exclude: ${this.formatValue(value)}`,
    sourcePos.x,
    sourcePos.y - this.cellHeight / 2 - 26,
    this.excludeTextColor
  );
  this.cmd("Step");
  const destX = this.clampToCanvas(
    targetPos.x - this.cellWidth / 2 - this.compareMargin
  );
  this.cmd("Move", labelID, destX, targetPos.y);
  this.cmd("Step");
  this.setCellHighlight(i - 1, a, false);
  this.updateDPCell(i, a, value);
  return labelID;
};

CoinChange2D.prototype.animateIncludeComparison = function (i, a, coin, prevVal) {
  const result = {
    labelID: -1,
    candidate: this.currentINF,
    valid: false,
  };

  const includeIndex = a - coin;
  if (
    includeIndex < 0 ||
    !this.dpCellCenters[i] ||
    !this.dpCellCenters[i][includeIndex] ||
    !this.dpCellCenters[i][a]
  ) {
    return result;
  }

  const sourcePos = this.dpCellCenters[i][includeIndex];
  const targetPos = this.dpCellCenters[i][a];
  this.setCellHighlight(i, includeIndex, true);
  const labelID = this.createComparisonLabel(
    `include: ${this.formatValue(
      prevVal < this.currentINF ? prevVal + 1 : this.currentINF
    )}`,
    sourcePos.x,
    sourcePos.y + this.cellHeight / 2 + 26,
    this.includeTextColor
  );
  this.cmd("Step");
  const destX = this.clampToCanvas(
    targetPos.x + this.cellWidth / 2 + this.compareMargin
  );
  this.cmd("Move", labelID, destX, targetPos.y);
  this.cmd("Step");
  this.setCellHighlight(i, includeIndex, false);

  result.labelID = labelID;
  if (prevVal < this.currentINF) {
    result.candidate = prevVal + 1;
    result.valid = true;
    const coinPos = this.coinPositions[i - 1];
    if (coinPos) {
      const tokenID = this.nextIndex++;
      this.cmd("CreateLabel", tokenID, `+${coin}`, coinPos.x, coinPos.y, 1);
      this.cmd("SetTextStyle", tokenID, this.compareLabelStyle);
      this.cmd("SetForegroundColor", tokenID, this.includeTextColor);
      this.cmd("SetLayer", tokenID, 2);
      this.cmd("Move", tokenID, targetPos.x, targetPos.y);
      this.cmd("Step");
      this.cmd("Delete", tokenID);
    }
  }

  return result;
};

CoinChange2D.prototype.cleanupComparisonLabels = function (labelIDs) {
  if (!labelIDs) {
    return;
  }
  for (let i = 0; i < labelIDs.length; i++) {
    const id = labelIDs[i];
    if (typeof id === "number" && id >= 0) {
      this.cmd("Delete", id);
    }
  }
};

CoinChange2D.prototype.highlightRow = function (i) {
  if (this.rowHighlight === i) {
    return;
  }
  if (this.rowHighlight >= 0 && this.rowLabelIDs[this.rowHighlight]) {
    this.cmd(
      "SetForegroundColor",
      this.rowLabelIDs[this.rowHighlight],
      this.rowLabelColor
    );
  }
  if (this.rowLabelIDs[i]) {
    this.cmd("SetForegroundColor", this.rowLabelIDs[i], this.rowLabelHighlightColor);
  }
  this.rowHighlight = i;
};

CoinChange2D.prototype.unhighlightRow = function () {
  if (this.rowHighlight >= 0 && this.rowLabelIDs[this.rowHighlight]) {
    this.cmd(
      "SetForegroundColor",
      this.rowLabelIDs[this.rowHighlight],
      this.rowLabelColor
    );
  }
  this.rowHighlight = -1;
};

CoinChange2D.prototype.highlightColumn = function (a) {
  if (this.colHighlight === a) {
    return;
  }
  if (this.colHighlight >= 0 && this.colLabelIDs[this.colHighlight]) {
    this.cmd(
      "SetForegroundColor",
      this.colLabelIDs[this.colHighlight],
      this.colLabelColor
    );
  }
  if (this.colLabelIDs[a]) {
    this.cmd("SetForegroundColor", this.colLabelIDs[a], this.colLabelHighlightColor);
  }
  this.colHighlight = a;
};

CoinChange2D.prototype.unhighlightColumn = function () {
  if (this.colHighlight >= 0 && this.colLabelIDs[this.colHighlight]) {
    this.cmd(
      "SetForegroundColor",
      this.colLabelIDs[this.colHighlight],
      this.colLabelColor
    );
  }
  this.colHighlight = -1;
};

CoinChange2D.prototype.highlightCoin = function (idx) {
  if (this.coinHighlight === idx) {
    return;
  }
  if (this.coinHighlight >= 0 && this.coinIDs[this.coinHighlight]) {
    this.cmd("SetBackgroundColor", this.coinIDs[this.coinHighlight], this.coinColor);
  }
  if (this.coinIDs[idx]) {
    this.cmd("SetBackgroundColor", this.coinIDs[idx], this.coinHighlightColor);
  }
  this.coinHighlight = idx;
};

CoinChange2D.prototype.unhighlightCoin = function () {
  if (this.coinHighlight >= 0 && this.coinIDs[this.coinHighlight]) {
    this.cmd("SetBackgroundColor", this.coinIDs[this.coinHighlight], this.coinColor);
  }
  this.coinHighlight = -1;
};

CoinChange2D.prototype.resetDPDisplay = function () {
  for (let i = 0; i < this.dpIDs.length; i++) {
    for (let a = 0; a < this.dpIDs[i].length; a++) {
      this.dpValues[i][a] = null;
      this.dpColors[i][a] = this.untouchedColor;
      this.cmd("SetText", this.dpIDs[i][a], "");
      this.cmd("SetBackgroundColor", this.dpIDs[i][a], this.untouchedColor);
    }
  }
};

CoinChange2D.prototype.runCoinChange = function () {
  this.commands = [];
  this.resetDPDisplay();
  this.highlightCode(-1);
  this.unhighlightRow();
  this.unhighlightColumn();
  this.unhighlightCoin();

  const coins = this.coinValues.slice();
  const amount = this.amount;
  const n = coins.length;
  this.currentINF = amount + 1;

  this.cmd("SetText", this.nValueID, String(n));
  this.cmd("SetText", this.amountValueID, String(amount));
  this.cmd("SetText", this.infValueID, String(this.currentINF));
  this.cmd("SetText", this.currentCoinValueID, "-");
  this.cmd("SetText", this.currentAmountValueID, "-");
  this.cmd("SetText", this.resultValueID, "?");

  this.highlightCode(0);
  this.cmd(
    "SetText",
    this.messageID,
    `Solve coin change for amount ${amount} using ${n} coins.`
  );
  this.cmd("Step");

  this.highlightCode(1);
  this.cmd("SetText", this.messageID, `Store coin count: n = ${n}.`);
  this.cmd("Step");

  this.highlightCode(2);
  this.cmd("SetText", this.messageID, `Set INF = amount + 1 = ${this.currentINF}.`);
  this.cmd("Step");

  this.highlightCode(3);
  this.cmd("SetText", this.messageID, "Allocate (n+1) x (amount+1) DP table.");
  this.cmd("Step");

  this.updateDPCell(0, 0, 0);
  this.cmd("Step");

  this.highlightCode(4);
  this.cmd(
    "SetText",
    this.messageID,
    "Base row: with 0 coins, positive amounts remain unreachable."
  );
  for (let a = 1; a <= amount; a++) {
    this.highlightColumn(a);
    this.flashCell(0, a, this.inspectColor);
    this.updateDPCell(0, a, this.currentINF);
    this.cmd("Step");
  }
  this.unhighlightColumn();

  for (let i = 1; i <= n; i++) {
    this.highlightCode(5);
    this.highlightRow(i);
    this.highlightCoin(i - 1);
    this.cmd(
      "SetText",
      this.messageID,
      `Start row i=${i} using coin ${coins[i - 1]}.`
    );
    this.cmd("Step");

    this.highlightCode(6);
    this.flashCell(i, 0, this.inspectColor);
    this.updateDPCell(i, 0, 0);
    this.cmd("Step");

    this.highlightCode(7);
    this.cmd("SetText", this.currentCoinValueID, String(coins[i - 1]));
    this.cmd(
      "SetText",
      this.messageID,
      `Read coin value: coin = ${coins[i - 1]}.`
    );
    this.cmd("Step");

    this.highlightCode(8);
    this.cmd(
      "SetText",
      this.messageID,
      "Scan each amount column and try the current coin."
    );
    this.cmd("Step");

    for (let a = 1; a <= amount; a++) {
      this.highlightColumn(a);
      this.setCellHighlight(i, a, true);
      this.cmd("SetText", this.currentAmountValueID, String(a));

      this.highlightCode(8);
      this.cmd(
        "SetText",
        this.messageID,
        `Check amount a=${a} with coin ${coins[i - 1]}.`
      );
      this.cmd("Step");

      this.highlightCode(9);
      const excludeVal = this.dpValues[i - 1][a] ?? this.currentINF;
      const excludeLabel = this.animateExcludeComparison(i, a, excludeVal);
      this.cmd(
        "SetText",
        this.messageID,
        `Exclude coin -> dp[${i - 1}][${a}] = ${this.formatValue(excludeVal)}.`
      );
      this.cmd("Step");

      this.highlightCode(10);
      let includeLabel = -1;
      let includeCandidate = this.currentINF;
      if (a >= coins[i - 1]) {
        const prev = this.dpValues[i][a - coins[i - 1]] ?? this.currentINF;
        const includeResult = this.animateIncludeComparison(
          i,
          a,
          coins[i - 1],
          prev
        );
        includeLabel = includeResult.labelID;
        includeCandidate = includeResult.candidate;
        if (includeResult.valid) {
          this.cmd(
            "SetText",
            this.messageID,
            `Include coin -> candidate ${this.formatValue(includeCandidate)} from dp[${i}][${a - coins[i - 1]}] + 1.`
          );
        } else {
          this.cmd(
            "SetText",
            this.messageID,
            `Including coin impossible because dp[${i}][${a - coins[i - 1]}] is INF.`
          );
        }
        this.cmd("Step");
      } else {
        this.cmd(
          "SetText",
          this.messageID,
          `Amount ${a} smaller than coin ${coins[i - 1]} -> skip include branch.`
        );
        this.cmd("Step");
      }

      this.highlightCode(11);
      let finalVal = this.dpValues[i][a] ?? this.currentINF;
      if (includeCandidate < finalVal) {
        this.updateDPCell(i, a, includeCandidate);
        finalVal = includeCandidate;
        this.cmd(
          "SetText",
          this.messageID,
          `Choose include -> dp[${i}][${a}] becomes ${this.formatValue(finalVal)}.`
        );
      } else {
        this.cmd(
          "SetText",
          this.messageID,
          `Keep exclude -> dp[${i}][${a}] stays ${this.formatValue(finalVal)}.`
        );
      }
      this.flashCell(i, a, this.inspectColor);
      this.cmd("Step");

      this.cleanupComparisonLabels([excludeLabel, includeLabel]);
      this.setCellHighlight(i, a, false);
      this.unhighlightColumn();
    }
    this.unhighlightCoin();
  }

  this.highlightCode(15);
  const finalVal = this.dpValues[n][amount] ?? this.currentINF;
  const answer = finalVal >= this.currentINF ? -1 : finalVal;
  this.flashCell(n, amount, this.inspectColor);
  if (answer === -1) {
    this.cmd("SetText", this.messageID, "Amount unreachable -> return -1.");
  } else {
    this.cmd(
      "SetText",
      this.messageID,
      `Minimum coins needed = ${answer}.`
    );
  }
  this.cmd("SetText", this.resultValueID, String(answer));
  this.cmd("Step");
  this.unhighlightRow();
  this.unhighlightColumn();
  this.unhighlightCoin();
  this.highlightCode(-1);

  return this.commands;
};

CoinChange2D.prototype.reset = function () {
  this.nextIndex = 0;
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

CoinChange2D.prototype.disableUI = function () {
  for (let i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
  if (this.buildButton) this.buildButton.disabled = true;
  if (this.runButton) this.runButton.disabled = true;
  if (this.pauseButton) this.pauseButton.disabled = false;
  if (this.stepButton) this.stepButton.disabled = false;
};

CoinChange2D.prototype.enableUI = function () {
  for (let i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
  if (this.buildButton) this.buildButton.disabled = false;
  if (this.runButton) this.runButton.disabled = false;
  if (this.pauseButton) this.pauseButton.disabled = false;
  if (this.stepButton) this.stepButton.disabled = false;
};

var currentAlg;
function init() {
  var animManag = initCanvas();
  currentAlg = new CoinChange2D(animManag, canvas.width, canvas.height);
}
