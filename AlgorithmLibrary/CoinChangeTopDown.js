function CoinChangeTopDown(am, w, h) {
  this.init(am, w, h);
}

CoinChangeTopDown.prototype = new Algorithm();
CoinChangeTopDown.prototype.constructor = CoinChangeTopDown;
CoinChangeTopDown.superclass = Algorithm.prototype;

CoinChangeTopDown.CODE = [
  "int coinChange(int[] coins, int amount) {",
  "  final int INF = amount + 1;",
  "  int[][] memo = new int[coins.length + 1][amount + 1];",
  "  fill(memo, -1);",
  "  int ans = dfs(0, amount);",
  "  return ans >= INF ? -1 : ans;",
  "}",
  "int dfs(int index, int remain) {",
  "  if (remain == 0) return 0;",
  "  if (index == coins.length) return INF;",
  "  if (memo[index][remain] != -1) return memo[index][remain];",
  "  int skip = dfs(index + 1, remain);",
  "  int take = INF;",
  "  if (coins[index] <= remain) {",
  "    int next = dfs(index, remain - coins[index]);",
  "    take = next >= INF ? INF : 1 + next;",
  "  }",
  "  int best = Math.min(skip, take);",
  "  memo[index][remain] = best;",
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

  this.canvasWidth = w || 720;
  this.canvasHeight = h || 1280;

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
  this.clearNarrationBoard();
  this.boardLineIDs = [];
  this.boardBackgroundID = -1;
  this.currentCodeHighlight = -1;

  const TITLE_Y = 48;
  const CODE_START_X = 80;
  const CODE_LINE_H = 20;
  const CODE_FONT_SIZE = 16;
  const VARIABLE_SPACING = 36;
  const bottomMargin = Math.max(36, Math.floor(canvasH * 0.03));
  const treeGap = Math.max(30, Math.floor(canvasH * 0.03));
  const memoGap = Math.max(32, Math.floor(canvasH * 0.035));
  const bottomGap = Math.max(28, Math.floor(canvasH * 0.03));

  const coinLayout = this.computeCoinRowLayout({
    canvasW,
    rowY: TITLE_Y + Math.max(60, Math.floor(canvasH * 0.06)),
    labelText: "coins array:",
    labelFontSize: 18,
  });
  const coinsRowY = coinLayout.y;

  const boardTop = coinsRowY + Math.max(
    32,
    Math.floor((coinLayout.coinHeight || 32) * 0.9)
  );
  const boardReservedHeight = Math.max(160, Math.floor(canvasH * 0.2));
  const boardHeight = Math.max(140, Math.floor(boardReservedHeight * 0.75));
  const boardBottom = boardTop + boardHeight;

  const memoRows = (this.coinValues ? this.coinValues.length : 0) + 1;
  const memoEstimate = this.estimateMemoTableHeight(
    memoRows,
    CoinChangeTopDown.MEMO_CELL_HEIGHT,
    CoinChangeTopDown.MEMO_ROW_GAP
  );

  const codeHeight = CoinChangeTopDown.CODE.length * CODE_LINE_H;
  const variableEntries = 6;
  const variablePanelHeight = (variableEntries - 1) * VARIABLE_SPACING + 60;
  const bottomBlockHeight = Math.max(codeHeight, variablePanelHeight);

  let treeTop = boardBottom + treeGap;
  let baseTreeHeight = Math.max(320, Math.floor(canvasH * 0.4));
  let treeHeightLimit =
    canvasH -
    bottomMargin -
    (memoEstimate + memoGap + bottomGap + bottomBlockHeight) -
    treeTop;
  if (!Number.isFinite(treeHeightLimit)) {
    treeHeightLimit = Math.floor(canvasH * 0.4);
  }
  let treeHeight = Math.min(baseTreeHeight, treeHeightLimit);
  if (treeHeight < 240) {
    treeHeight = Math.max(240, treeHeightLimit);
  }
  if (!Number.isFinite(treeHeight) || treeHeight <= 0) {
    treeHeight = Math.max(240, Math.floor(canvasH * 0.35));
  }

  let treeBottom = treeTop + treeHeight;
  let memoTop = treeBottom + memoGap;
  let memoBottom = memoTop + memoEstimate;
  let codeStartY = memoBottom + bottomGap;

  const canvasBottomLimit = canvasH - bottomMargin;
  if (codeStartY + bottomBlockHeight > canvasBottomLimit) {
    const overflow = codeStartY + bottomBlockHeight - canvasBottomLimit;
    treeHeight = Math.max(240, treeHeight - overflow);
    treeBottom = treeTop + treeHeight;
    memoTop = treeBottom + memoGap;
    memoBottom = memoTop + memoEstimate;
    codeStartY = memoBottom + bottomGap;
  }
  const variableStartY = codeStartY;

  const treeLeft = Math.max(70, Math.floor(canvasW * 0.12));
  const treeRight = canvasW - treeLeft;
  const treeWidth = Math.max(220, treeRight - treeLeft);

  this.treeArea = {
    left: treeLeft,
    top: treeTop,
    width: treeWidth,
    height: treeHeight,
    right: treeRight,
    bottom: treeBottom,
  };
  this.treeNodeRadius = Math.max(
    26,
    Math.min(34, Math.floor(treeWidth * 0.06))
  );
  const estimatedDepth = Math.max(3, Math.min(this.amount + 2, 12));
  this.treeLevelGap = Math.max(
    80,
    Math.min(150, Math.floor(treeHeight / Math.max(estimatedDepth, 1)))
  );
  this.treeNodeLabelOffset = Math.max(
    36,
    Math.min(60, this.treeLevelGap - this.treeNodeRadius + 12)
  );
  this.treeHorizontalPadding = Math.max(
    36,
    Math.floor(this.treeNodeRadius * 1.8)
  );
  this.treeBaseSpanLeft = this.treeArea.left + this.treeNodeRadius;
  this.treeBaseSpanRight = this.treeArea.right - this.treeNodeRadius;

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
    coinLayout.labelText || "coins array:",
    coinLayout.labelCenterX,
    coinLayout.labelY,
    coinLayout.labelCentered ? 1 : 0
  );
  this.cmd(
    "SetTextStyle",
    this.coinLabelID,
    `bold ${coinLayout.labelFontSize || 18}`
  );

  this.buildCoinsRow(coinLayout);

  this.buildNarrationBoard({
    top: boardTop,
    height: boardHeight,
    width: Math.max(440, Math.floor(canvasW * 0.8)),
  });

  this.buildMemoTable(memoTop);
  this.buildCodeDisplay(CODE_START_X, codeStartY, CODE_LINE_H, CODE_FONT_SIZE);

  const variableX = canvasW - Math.max(150, Math.floor(canvasW * 0.2));
  this.buildVariablePanel(variableX, variableStartY, VARIABLE_SPACING);

  this.resetMemoTable();
  this.resetVariablePanel();
  this.resetTreeDisplay();
  this.updateNarrationText(this.messageText || "");

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

CoinChangeTopDown.prototype.buildCoinsRow = function (layout) {
  const settings = layout || {};
  const coins = this.coinValues || [];
  const count = coins.length;
  const coinWidth = Math.max(36, Math.floor(settings.coinWidth || 60));
  const coinHeight = Math.max(28, Math.floor(settings.coinHeight || coinWidth * 0.7));
  const spacing = Math.max(12, Math.floor(settings.spacing || coinWidth * 0.5));
  const startX =
    settings.startX !== undefined && settings.startX !== null
      ? settings.startX
      : Math.floor((this.canvasWidth - coinWidth * count - spacing * (count - 1)) / 2) +
        coinWidth / 2;
  const rowY = settings.y || settings.rowY || Math.max(120, Math.floor(this.canvasHeight * 0.18));

  this.coinIDs = [];
  for (let i = 0; i < count; i++) {
    const id = this.nextIndex++;
    this.coinIDs.push(id);
    const x = startX + i * (coinWidth + spacing);
    this.cmd(
      "CreateRectangle",
      id,
      String(coins[i]),
      coinWidth,
      coinHeight,
      x,
      rowY
    );
    this.cmd("SetBackgroundColor", id, this.coinColor);
    this.cmd("SetForegroundColor", id, "#000000");
    this.cmd("SetTextStyle", id, "bold 18");
  }
};

CoinChangeTopDown.prototype.buildCodeDisplay = function (
  startX,
  startY,
  lineHeight,
  fontSize
) {
  const textStyle = fontSize ? String(fontSize) : "16";
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

CoinChangeTopDown.prototype.buildNarrationBoard = function (options) {
  const settings = options || {};
  const canvasW = this.canvasWidth || 720;
  const top = Math.max(120, Math.floor(settings.top || Math.floor(this.canvasHeight * 0.18)));
  const desiredHeight = Math.max(120, Math.floor(settings.height || Math.floor(this.canvasHeight * 0.16)));
  const height = Math.min(desiredHeight, Math.max(120, Math.floor(this.canvasHeight * 0.24)));
  const width = Math.min(
    canvasW - 32,
    Math.max(420, Math.floor(settings.width || Math.floor(canvasW * 0.82)))
  );
  const centerX = canvasW / 2;
  const centerY = top + height / 2;

  this.boardBackgroundID = this.nextIndex++;
  this.cmd("CreateRectangle", this.boardBackgroundID, "", width, height, centerX, centerY);
  this.cmd("SetForegroundColor", this.boardBackgroundID, "#345a96");
  this.cmd("SetBackgroundColor", this.boardBackgroundID, "#f5f7ff");

  const lineCount = 3;
  const lineSpacing = Math.max(26, Math.floor(height * 0.28));
  const firstLineY = centerY - lineSpacing;
  this.boardLineIDs = [];
  for (let i = 0; i < lineCount; i++) {
    const labelID = this.nextIndex++;
    const lineY = firstLineY + i * lineSpacing;
    this.cmd("CreateLabel", labelID, "", centerX, lineY, 1);
    this.cmd("SetTextStyle", labelID, "bold 18");
    this.cmd("SetForegroundColor", labelID, "#1f3b73");
    this.cmd("SetAlpha", labelID, 0);
    this.boardLineIDs.push(labelID);
  }

  const charLimit = Math.max(24, Math.floor((width - 80) / 9));
  this.boardInfo = {
    lineCount,
    charLimit,
  };
};

CoinChangeTopDown.prototype.clearNarrationBoard = function () {
  if (Array.isArray(this.boardLineIDs)) {
    for (let i = 0; i < this.boardLineIDs.length; i++) {
      const id = this.boardLineIDs[i];
      if (id >= 0) {
        this.cmd("Delete", id);
      }
    }
  }
  if (this.boardBackgroundID !== undefined && this.boardBackgroundID >= 0) {
    this.cmd("Delete", this.boardBackgroundID);
  }
  this.boardLineIDs = [];
  this.boardBackgroundID = -1;
  this.boardInfo = null;
};

CoinChangeTopDown.prototype.updateNarrationText = function (text) {
  if (!Array.isArray(this.boardLineIDs) || this.boardLineIDs.length === 0) {
    return;
  }
  const info = this.boardInfo || {};
  const maxLines = info.lineCount || this.boardLineIDs.length;
  const charLimit = Math.max(12, info.charLimit || 36);
  const lines = this.wrapNarrationLines(text, maxLines, charLimit);
  for (let i = 0; i < this.boardLineIDs.length; i++) {
    const id = this.boardLineIDs[i];
    const content = lines[i] || "";
    this.cmd("SetText", id, content);
    this.cmd("SetAlpha", id, content ? 1 : 0);
  }
};

CoinChangeTopDown.prototype.wrapNarrationLines = function (
  text,
  maxLines,
  charLimit
) {
  const lineCount = Math.max(1, Math.floor(maxLines));
  const limit = Math.max(10, Math.floor(charLimit));
  const result = new Array(lineCount).fill("");
  if (!text) {
    return result;
  }
  const words = String(text)
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  if (words.length === 0) {
    return result;
  }
  const lines = [];
  let current = "";
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= limit) {
      current = candidate;
    } else if (!current) {
      lines.push(candidate.slice(0, Math.max(3, limit - 1)) + "...");
      current = "";
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) {
    lines.push(current);
  }
  if (lines.length > lineCount) {
    const trimmed = lines.slice(0, lineCount);
    const remainder = lines.slice(lineCount - 1).join(" ");
    trimmed[lineCount - 1] =
      remainder.length > limit ? remainder.slice(0, limit - 3) + "..." : remainder;
    return trimmed;
  }
  for (let i = 0; i < lines.length; i++) {
    result[i] = lines[i];
  }
  return result;
};

CoinChangeTopDown.prototype.getApproxTextWidth = function (text, fontSize) {
  const size = Math.max(10, Math.floor(Number(fontSize) || 16));
  if (!text) {
    return size * 2;
  }
  const safe = String(text);
  const average = Math.max(5, Math.floor(size * 0.56));
  return Math.max(size * 2, Math.floor(safe.length * average));
};

CoinChangeTopDown.prototype.computeCoinRowLayout = function (options) {
  const settings = options || {};
  const canvasW = settings.canvasW || this.canvasWidth || 720;
  const rowY =
    settings.rowY !== undefined && settings.rowY !== null
      ? settings.rowY
      : Math.max(90, Math.floor((this.canvasHeight || 600) * 0.14));
  const labelText = settings.labelText || "coins:";
  const labelFontSize = Math.max(14, Math.floor(settings.labelFontSize || 18));

  const coinCount = Math.max(
    1,
    this.coinValues && this.coinValues.length ? this.coinValues.length : 1
  );
  let coinWidth = Math.min(
    Math.max(44, Math.floor(canvasW * 0.075)),
    Math.floor(canvasW * 0.12)
  );
  let coinHeight = Math.max(30, Math.floor(coinWidth * 0.72));
  let spacing = Math.max(16, Math.floor(coinWidth * 0.52));
  let rowWidth = coinCount * coinWidth + (coinCount - 1) * spacing;
  const maxRowWidth = Math.max(260, Math.floor(canvasW * 0.6));
  if (rowWidth > maxRowWidth) {
    const shrink = maxRowWidth / rowWidth;
    coinWidth = Math.max(32, Math.floor(coinWidth * shrink));
    coinHeight = Math.max(24, Math.floor(coinHeight * shrink));
    spacing = Math.max(10, Math.floor(spacing * shrink));
    rowWidth = coinCount * coinWidth + (coinCount - 1) * spacing;
  }

  const labelWidth = Math.max(
    Math.floor(labelFontSize * 2.4),
    this.getApproxTextWidth(labelText, labelFontSize)
  );
  let labelGap = Math.max(18, Math.floor(coinWidth * 0.85));
  let totalWidth = labelWidth + labelGap + rowWidth;
  const sideMargin = Math.max(36, Math.floor(canvasW * 0.06));
  const availableWidth = Math.max(240, canvasW - sideMargin * 2);
  if (totalWidth > availableWidth) {
    const overflow = totalWidth - availableWidth;
    const gapReduce = Math.min(overflow, Math.max(0, labelGap - 10));
    labelGap -= gapReduce;
    totalWidth = labelWidth + labelGap + rowWidth;
    if (totalWidth > availableWidth) {
      const targetRow = Math.max(160, availableWidth - labelWidth - labelGap);
      if (targetRow > 0 && rowWidth > targetRow) {
        const resize = targetRow / rowWidth;
        coinWidth = Math.max(28, Math.floor(coinWidth * resize));
        coinHeight = Math.max(22, Math.floor(coinHeight * resize));
        spacing = Math.max(8, Math.floor(spacing * resize));
        rowWidth = coinCount * coinWidth + (coinCount - 1) * spacing;
        totalWidth = labelWidth + labelGap + rowWidth;
      }
    }
  }

  let groupLeft = Math.floor((canvasW - totalWidth) / 2);
  const minLeft = sideMargin;
  const maxLeft = canvasW - sideMargin - totalWidth;
  if (groupLeft < minLeft) {
    groupLeft = minLeft;
  }
  if (groupLeft > maxLeft) {
    groupLeft = Math.max(minLeft, maxLeft);
  }

  const labelCenterX = groupLeft + labelWidth / 2;
  const startX = groupLeft + labelWidth + labelGap + coinWidth / 2;

  return {
    canvasW,
    y: rowY,
    rowY,
    coinWidth,
    coinHeight,
    spacing,
    startX,
    labelCenterX,
    labelY: rowY,
    labelFontSize,
    labelText,
    labelCentered: true,
  };
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
  branchLabel,
  spanLeft,
  spanRight
) {
  if (!this.treeArea) {
    return null;
  }

  let node = this.treeNodes[key];
  if (node) {
    return node;
  }

  const areaLeft = this.treeArea.left + this.treeNodeRadius;
  const areaRight = this.treeArea.right - this.treeNodeRadius;
  let leftBound =
    Number.isFinite(spanLeft) && spanLeft !== null ? spanLeft : this.treeBaseSpanLeft;
  let rightBound =
    Number.isFinite(spanRight) && spanRight !== null
      ? spanRight
      : this.treeBaseSpanRight;

  if (rightBound < leftBound) {
    const mid = (leftBound + rightBound) / 2;
    leftBound = mid - this.treeHorizontalPadding / 2;
    rightBound = mid + this.treeHorizontalPadding / 2;
  }

  leftBound = Math.max(areaLeft, leftBound);
  rightBound = Math.min(areaRight, rightBound);

  if (rightBound - leftBound < this.treeHorizontalPadding) {
    const mid = (leftBound + rightBound) / 2;
    leftBound = Math.max(areaLeft, mid - this.treeHorizontalPadding / 2);
    rightBound = Math.min(areaRight, mid + this.treeHorizontalPadding / 2);
  }

  if (rightBound < leftBound) {
    leftBound = areaLeft;
    rightBound = areaRight;
  }

  let x = Math.round((leftBound + rightBound) / 2);
  if (!Number.isFinite(x)) {
    x = Math.round((areaLeft + areaRight) / 2);
  }
  let y = this.treeArea.top + this.treeNodeRadius + depth * this.treeLevelGap;
  const maxY = this.treeArea.bottom - this.treeNodeRadius;
  if (y > maxY) {
    y = maxY;
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
    spanLeft: leftBound,
    spanRight: rightBound,
    color: this.treeDefaultColor,
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
  if (highlight) {
    this.cmd("SetBackgroundColor", node.id, this.treeActiveColor);
  } else {
    this.cmd(
      "SetBackgroundColor",
      node.id,
      node.color || this.treeDefaultColor
    );
  }
};

CoinChangeTopDown.prototype.colorTreeNode = function (key, color) {
  const node = this.treeNodes[key];
  if (!node) {
    return;
  }
  const fill = color || this.treeDefaultColor;
  node.color = fill;
  this.cmd("SetBackgroundColor", node.id, fill);
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
  this.updateNarrationText(text || "");
};

CoinChangeTopDown.prototype.clearMessage = function () {
  this.updateNarrationText("");
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
  branchLabel,
  spanLeft,
  spanRight
) {
  const INF = this.amount + 1;
  const key = this.makeStateKey(index, remain);
  const node = this.ensureTreeNode(
    key,
    index,
    remain,
    depth,
    parentKey,
    branchType,
    branchLabel,
    spanLeft,
    spanRight
  );
  this.highlightTreeNode(key, true);
  this.updateStatePanel(index, remain, index < coins.length ? coins[index] : null);
  this.showMessage(`Exploring state (i=${index}, remain=${remain}).`);
  this.cmd("Step");

  if (remain === 0) {
    this.highlightCode(8);
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

  this.highlightCode(9);
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

  this.highlightCode(10);
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

  this.highlightCode(12);
  this.cmd("Step");
  const branchGap = Math.max(
    this.treeHorizontalPadding,
    this.treeNodeRadius * 2.4
  );
  const leftSpanRight = node.x - branchGap / 2;
  const rightSpanLeft = node.x + branchGap / 2;
  let takeCost = INF;
  const coinValue = coins[index];
  if (coinValue <= remain) {
    this.highlightCode(13);
    this.showMessage(`Try taking coin ${coinValue}.`);
    this.updateTakePanel(null);
    this.cmd("Step");
    this.highlightCode(14);
    this.cmd("Step");
    const takeResult = this.knapsack(
      coins,
      index,
      remain - coinValue,
      memo,
      depth + 1,
      key,
      "take",
      `-${coinValue}`,
      node.spanLeft,
      leftSpanRight
    );
    takeCost = takeResult >= INF ? INF : takeResult + 1;
    this.highlightTreeNode(key, true);
    this.updateStatePanel(index, remain, coinValue);
    this.updateTakePanel(takeCost);
    this.highlightCode(15);
    this.cmd("Step");
    this.showMessage(
      takeCost >= INF
        ? `Taking coin ${coinValue} cannot reach the target.`
        : `Taking coin ${coinValue} uses ${takeCost} coins in total.`
    );
    this.cmd("Step");
  } else {
    this.highlightCode(13);
    this.showMessage(`Coin ${coinValue} is too large for remain ${remain}.`);
    this.updateTakePanel(INF);
    this.cmd("Step");
  }

  this.highlightCode(11);
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
    "skip",
    rightSpanLeft,
    node.spanRight
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

  this.highlightCode(17);
  const best = Math.min(takeCost, skipCost);
  this.updateMemoPanel(best);
  this.showMessage(
    best >= INF
      ? "Neither branch worked, memoize ∞."
      : `Memoize the better answer ${best}.`
  );
  this.cmd("Step");

  memo[key] = best;
  this.highlightCode(18);
  this.setMemoValue(index, remain, best, {
    color: best >= INF ? this.treeFailColor : this.treeSolvedColor,
  });
  this.cmd("Step");

  this.highlightCode(19);
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

  const result = this.knapsack(
    coins,
    0,
    amount,
    memo,
    0,
    null,
    null,
    null,
    this.treeBaseSpanLeft,
    this.treeBaseSpanRight
  );
  this.highlightCode(5);
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
