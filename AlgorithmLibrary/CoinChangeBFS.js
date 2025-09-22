function CoinChangeBFS(am, w, h) {
  this.init(am, w, h);
}

CoinChangeBFS.prototype = new Algorithm();
CoinChangeBFS.prototype.constructor = CoinChangeBFS;
CoinChangeBFS.superclass = Algorithm.prototype;

CoinChangeBFS.CODE = [
  "public int coinChange(int[] coins, int amount) {",
  "        if (amount == 0) return 0;",
  "        boolean[] visited = new boolean[amount + 1];",
  "        Queue<Integer> q = new LinkedList<>();",
  "        q.offer(0);",
  "        visited[0] = true;",
  "        int steps = 0;",
  "        while (!q.isEmpty()) {",
  "            int size = q.size();",
  "            steps++;",
  "            for (int i = 0; i < size; i++) {",
  "                int curr = q.poll();",
  "                for (int c : coins) {",
  "                    int next = curr + c;",
  "                    if (next == amount) return steps;",
  "                    if (next < amount && !visited[next]) {",
  "                        visited[next] = true;",
  "                        q.offer(next);",
  "                    }",
  "                }",
  "            }",
  "        }",
  "        return -1;",
  "    }",
];

CoinChangeBFS.prototype.init = function (am, w, h) {
  CoinChangeBFS.superclass.init.call(this, am, w, h);

  this.addControls();

  this.nextIndex = 0;
  this.coinValues = [1, 2, 5];
  this.amount = 11;
  this.messageText = "";

  this.codeIDs = [];
  this.controls = [];
  this.coinIDs = [];
  this.coinPositions = [];
  this.coinHighlight = -1;

  this.treeLabelID = -1;
  this.treeLabelOffset = 0;
  this.treeLabelYCoord = 0;
  this.treeArea = null;
  this.treeLevels = [];
  this.treeNodes = {};
  this.treePendingParents = {};
  this.treeHighlightAmount = null;
  this.treeActiveEdge = null;
  this.treeDepthDenominator = 1;
  this.treeNodeRadius = 28;
  this.treeNodeLabelOffset = 44;
  this.treeDepthCapacity = 0;
  this.treeDepthBaseEstimate = 0;
  this.treeEdgeLabelColor = "#1d3f72";
  this.boardReservedHeight = 0;

  this.queueSlotIDs = [];
  this.queueValues = [];
  this.queueLabelID = -1;
  this.queueHighlightIndex = -1;

  this.visitedLabelID = -1;
  this.visitedIndexHeaderID = -1;
  this.visitedValueHeaderID = -1;
  this.visitedSlotIDs = [];
  this.visitedIndexIDs = [];
  this.visitedStates = [];
  this.visitedHighlightIndex = -1;
  this.visitedArea = null;
  this.visitedPanelWidth = 0;
  this.visitedPanelGap = 0;

  this.titleID = -1;
  this.coinLabelID = -1;
  this.messageID = -1;
  this.boardBackgroundID = -1;
  this.boardTimerID = -1;
  this.boardProgressTrackID = -1;
  this.boardProgressFillID = -1;
  this.boardLineIDs = [];
  this.boardTextSegments = [];
  this.boardInfo = null;

  this.amountLabelID = -1;
  this.amountValueID = -1;
  this.stepsLabelID = -1;
  this.stepsValueID = -1;
  this.queueSizeLabelID = -1;
  this.queueSizeValueID = -1;
  this.levelSizeLabelID = -1;
  this.levelSizeValueID = -1;
  this.currentLabelID = -1;
  this.currentValueID = -1;
  this.coinValueLabelID = -1;
  this.coinValueID = -1;
  this.nextLabelID = -1;
  this.nextValueID = -1;
  this.resultLabelID = -1;
  this.resultValueID = -1;

  this.treeDefaultColor = "#f5f7fb";
  this.treeVisitedColor = "#dff7df";
  this.treeActiveColor = "#ffd27f";
  this.treeFoundColor = "#b4e4ff";
  this.inspectColor = "#ffe7a3";

  this.coinColor = "#f0f7ff";
  this.coinHighlightColor = "#ffef9c";

  this.queueColor = "#edf3ff";
  this.queueHighlightColor = "#ffd27f";

  this.visitedFalseColor = "#f5f7fb";
  this.visitedTrueColor = "#dff7df";

  this.canvasWidth = w || 720;
  this.canvasHeight = h || 1280;

  this.narrationBudgetInitialized = false;
  this.totalStepBudget = 0;
  this.structuralStepAllowance = 0;
  this.maxNarrationBudget = 0;
  this.totalStepCount = 0;
  this.narrationBeatsUsed = 0;
  this.structuralStepsUsed = 0;
  this._narrationStepContext = false;

  this.setup();
};

CoinChangeBFS.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Coins (comma/space):");
  this.coinsField = addControlToAlgorithmBar("Text", "1,2,5");
  this.coinsField.size = 30;

  addLabelToAlgorithmBar("Amount:");
  this.amountField = addControlToAlgorithmBar("Text", "11");
  this.amountField.size = 6;

  this.buildButton = addControlToAlgorithmBar("Button", "Set Input");
  this.buildButton.onclick = this.setInputCallback.bind(this);

  this.runButton = addControlToAlgorithmBar("Button", "Run Coin Change BFS");
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

CoinChangeBFS.prototype.setInputCallback = function () {
  const rawCoins = this.coinsField.value.trim();
  const parsedCoins = rawCoins
    ? rawCoins
        .split(/[\s,;]+/)
        .map(Number)
        .filter((v) => !Number.isNaN(v) && v > 0)
    : [];

  let trimmedMessage = "";
  if (parsedCoins.length > 0) {
    parsedCoins.sort((a, b) => a - b);
    if (parsedCoins.length > 8) {
      parsedCoins.length = 8;
    }
    this.coinValues = parsedCoins;
  }

  if (!this.coinValues || this.coinValues.length === 0) {
    this.coinValues = [1, 2, 5];
  }

  if (this.coinValues.length > 0) {
    this.coinsField.value = this.coinValues.join(", ");
  }

  const coinForLimit = this.coinValues[this.coinValues.length - 1] || 1;

  const amountValue = parseInt(this.amountField.value, 10);
  if (!Number.isNaN(amountValue)) {
    const layoutBound = Math.max(coinForLimit * 5, coinForLimit);
    const clampedAmount = Math.max(0, Math.min(12, layoutBound, amountValue));
    if (clampedAmount !== amountValue) {
      trimmedMessage = `Amount limited to ${clampedAmount} to keep the BFS tree readable.`;
    }
    this.amount = clampedAmount;
    this.amountField.value = String(this.amount);
  }

  this.messageText = trimmedMessage;
  this.reset();
};

CoinChangeBFS.prototype.runCallback = function () {
  this.implementAction(this.runCoinChange.bind(this), "");
};

CoinChangeBFS.prototype.pauseCallback = function () {
  if (typeof doPlayPause === "function") {
    doPlayPause();
  }
};

CoinChangeBFS.prototype.stepCallback = function () {
  if (typeof animationManager !== "undefined") {
    if (!animationManager.animationPaused && typeof doPlayPause === "function") {
      doPlayPause();
    }
    animationManager.step();
  }
};

CoinChangeBFS.prototype.setup = function () {
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

  if (
    typeof objectManager !== "undefined" &&
    objectManager &&
    objectManager.statusReport
  ) {
    objectManager.statusReport.setText("");
    objectManager.statusReport.addedToScene = false;
  }

  const TITLE_Y = 48;
  const CODE_START_X = 80;
  const CODE_LINE_H = 17;
  const CODE_FONT_SIZE = 16;
  const VARIABLE_FONT_STYLE = "bold 17";
  const RESULT_FONT_STYLE = "bold 21";
  const VARIABLE_SPACING = 32;
  const coinHeaderY = TITLE_Y + 48;
  const coinsRowY = coinHeaderY + 44;
  const messageY = coinsRowY + 48;

  this.commands = [];
  this.codeIDs = [];
  this.queueSlotIDs = [];
  this.queueValues = [];
  this.queueHighlightIndex = -1;
  this.coinIDs = [];
  this.coinPositions = [];
  this.visitedSlotIDs = [];
  this.visitedIndexIDs = [];
  this.visitedStates = [];
  this.visitedHighlightIndex = -1;

  this.titleID = this.nextIndex++;
  this.cmd("CreateLabel", this.titleID, "Coin Change BFS", canvasW / 2, TITLE_Y, 1);
  this.cmd("SetTextStyle", this.titleID, "bold 26");
  this.cmd("SetForegroundColor", this.titleID, "#1b1b1b");

  this.coinLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.coinLabelID, "coins array:", canvasW / 2, coinHeaderY, 1);
  this.cmd("SetTextStyle", this.coinLabelID, "bold 18");

  this.buildCoinsRow(canvasW, coinsRowY);

  this.messageID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.messageID,
    this.messageText || "",
    canvasW / 2,
    messageY,
    1
  );
  this.cmd("SetForegroundColor", this.messageID, "#003366");
  this.cmd("SetTextStyle", this.messageID, "bold 18");
  this.cmd("SetAlpha", this.messageID, 0);

  const boardReservedHeight = Math.max(
    160,
    Math.min(260, Math.floor(canvasH * 0.18))
  );
  this.boardReservedHeight = boardReservedHeight;
  this.boardLineIDs = [];
  this.boardInfo = null;
  this.buildNarrationBoard({
    canvasW,
    messageY,
    reservedHeight: boardReservedHeight,
  });
  const boardToTreeGap = Math.max(
    24,
    Math.floor((this.boardReservedHeight || 0) * 0.1)
  );
  const treeTopY = messageY + boardReservedHeight + boardToTreeGap;
  const totalCodeHeight = (CoinChangeBFS.CODE.length - 1) * CODE_LINE_H;
  const maxCodeStartY = canvasH - totalCodeHeight - 32;
  const maxQueueBottom = maxCodeStartY - 40;
  const queueGapFromTree = Math.max(32, Math.floor(canvasH * 0.025));
  const estimatedQueueHalf = Math.max(24, Math.floor(canvasH * 0.018));
  const baseTreeHeight = Math.floor(canvasH * 0.4);
  const rawTreeLimit =
    maxQueueBottom - treeTopY - queueGapFromTree - estimatedQueueHalf;
  const treeHeightLimit = Math.max(220, rawTreeLimit);
  const minTreeHeight = Math.min(
    treeHeightLimit,
    Math.max(260, Math.floor(canvasH * 0.28))
  );
  let treeHeight = Math.min(baseTreeHeight, treeHeightLimit);
  if (!Number.isFinite(treeHeight) || treeHeight <= 0) {
    treeHeight =
      minTreeHeight > 0
        ? minTreeHeight
        : Math.max(220, Math.floor(canvasH * 0.32));
  } else if (treeHeight < minTreeHeight) {
    treeHeight = minTreeHeight;
  }
  const treeLayout = this.buildTreeDisplay(canvasW, treeTopY, treeHeight);

  const actualTreeTop = this.treeArea ? this.treeArea.top : treeTopY;
  const queueY = treeLayout.bottomY + queueGapFromTree;
  const queueLayout = this.buildQueueDisplay(canvasW, queueY, null, null);
  const queueTop = queueY - queueLayout.slotHeight / 2;
  const visitedTopOffset = Math.max(
    12,
    Math.min(
      Math.floor((this.boardReservedHeight || 0) * 0.22),
      Math.floor((this.treeNodeRadius || 24) * 1.2)
    )
  );
  const visitedTop = actualTreeTop + visitedTopOffset;
  let visitedBottom = Math.max(
    treeLayout.bottomY,
    queueTop - Math.max(16, Math.floor(queueLayout.slotHeight * 0.4))
  );
  const minVisitedHeight = Math.max(140, Math.floor(canvasH * 0.14));
  if (visitedBottom - visitedTop < minVisitedHeight) {
    visitedBottom = visitedTop + minVisitedHeight;
  }
  this.buildVisitedDisplay(visitedTop, visitedBottom, this.amount);

  const codeStartPreferred = queueLayout.bottomY + 64;
  const codeStartY = Math.min(
    Math.max(codeStartPreferred, messageY + 140),
    maxCodeStartY
  );
  const codeBottomY = codeStartY + totalCodeHeight;
  this.buildCodeDisplay(CODE_START_X, codeStartY, CODE_LINE_H, CODE_FONT_SIZE);
  this.buildVariablePanel({
    canvasW,
    canvasH,
    codeStartX: CODE_START_X,
    codeStartY,
    codeBottomY,
    variableFont: VARIABLE_FONT_STYLE,
    resultFont: RESULT_FONT_STYLE,
    spacing: VARIABLE_SPACING,
  });

  this.resetTreeDisplay();
  this.resetQueueDisplay();
  this.resetVisitedDisplay();
  this.cmd("SetText", this.amountValueID, String(this.amount));

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

CoinChangeBFS.prototype.buildCodeDisplay = function (
  startX,
  startY,
  lineHeight,
  fontSize
) {
  const textStyle = fontSize ? String(fontSize) : "12";
  for (let i = 0; i < CoinChangeBFS.CODE.length; i++) {
    const id = this.nextIndex++;
    this.codeIDs.push(id);
    this.cmd("CreateLabel", id, CoinChangeBFS.CODE[i], startX, startY + i * lineHeight, 0);
    this.cmd("SetForegroundColor", id, "#000000");
    this.cmd("SetTextStyle", id, textStyle);
  }
};

CoinChangeBFS.prototype.buildVariablePanel = function (options) {
  const settings = options || {};
  const canvasW = settings.canvasW || this.canvasWidth || 720;
  const canvasH = settings.canvasH || this.canvasHeight || 1280;
  const codeStartX = settings.codeStartX || 0;
  const codeStartY = settings.codeStartY || 0;
  const codeBottomY = settings.codeBottomY || codeStartY;
  const spacing = Math.max(28, settings.spacing || 32);
  const variableFont = settings.variableFont || "bold 17";
  const resultFont = settings.resultFont || variableFont;

  const minColumnX = codeStartX + Math.max(360, Math.floor(canvasW * 0.5));
  const desiredGap = Math.max(140, Math.floor(canvasW * 0.2));
  const rightMargin = Math.max(52, Math.floor(canvasW * 0.075));
  const maxValueX = canvasW - rightMargin;
  let valueX = maxValueX;
  let columnX = valueX - desiredGap;
  if (columnX < minColumnX) {
    columnX = minColumnX;
    valueX = columnX + desiredGap;
    if (valueX > maxValueX) {
      valueX = maxValueX;
    }
  }
  const minGap = Math.max(132, Math.floor(canvasW * 0.18));
  if (valueX - columnX < minGap) {
    columnX = Math.max(minColumnX, valueX - minGap);
  }

  const entries = [
    {
      labelProp: "amountLabelID",
      valueProp: "amountValueID",
      label: "amount:",
      value: String(this.amount),
      valueFont: variableFont,
    },
    {
      labelProp: "stepsLabelID",
      valueProp: "stepsValueID",
      label: "steps:",
      value: "0",
      valueFont: variableFont,
    },
    {
      labelProp: "queueSizeLabelID",
      valueProp: "queueSizeValueID",
      label: "queue size:",
      value: "0",
      valueFont: variableFont,
    },
    {
      labelProp: "levelSizeLabelID",
      valueProp: "levelSizeValueID",
      label: "level size:",
      value: "0",
      valueFont: variableFont,
    },
    {
      labelProp: "currentLabelID",
      valueProp: "currentValueID",
      label: "current amount:",
      value: "-",
      valueFont: variableFont,
    },
    {
      labelProp: "coinValueLabelID",
      valueProp: "coinValueID",
      label: "coin:",
      value: "-",
      valueFont: variableFont,
    },
    {
      labelProp: "nextLabelID",
      valueProp: "nextValueID",
      label: "next amount:",
      value: "-",
      valueFont: variableFont,
    },
    {
      labelProp: "resultLabelID",
      valueProp: "resultValueID",
      label: "result:",
      value: "?",
      valueFont: resultFont,
      labelFont: resultFont,
    },
  ];

  const columnTop = codeStartY;
  const columnBottom = Math.min(canvasH - 48, codeBottomY);
  const availableHeight = Math.max(0, columnBottom - columnTop);
  let spacingValue = spacing;
  if (entries.length > 1) {
    const requiredSpan = (entries.length - 1) * spacingValue;
    if (requiredSpan > availableHeight) {
      const minSpacing = Math.max(22, Math.floor(spacing * 0.7));
      spacingValue = Math.max(
        minSpacing,
        Math.floor(availableHeight / Math.max(entries.length - 1, 1))
      );
    }
  }
  let startY = columnTop;
  if (entries.length > 1) {
    const usedSpan = (entries.length - 1) * spacingValue;
    if (startY + usedSpan > columnBottom) {
      startY = Math.max(columnTop, columnBottom - usedSpan);
    }
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const labelID = this.nextIndex++;
    const valueID = this.nextIndex++;
    this[entry.labelProp] = labelID;
    this[entry.valueProp] = valueID;
    const y = startY + i * spacingValue;
    this.cmd("CreateLabel", labelID, entry.label, columnX, y, 0);
    this.cmd("CreateLabel", valueID, entry.value, valueX, y, 0);
    const labelFont = entry.labelFont || variableFont;
    this.cmd("SetTextStyle", labelID, labelFont);
    this.cmd("SetTextStyle", valueID, entry.valueFont || variableFont);
  }
};

CoinChangeBFS.prototype.clearNarrationText = function () {
  if (!this.boardLineIDs) {
    return;
  }
  for (let i = 0; i < this.boardLineIDs.length; i++) {
    const row = this.boardLineIDs[i];
    if (!row || !row.segments) {
      continue;
    }
    for (let j = 0; j < row.segments.length; j++) {
      const segment = row.segments[j];
      if (!segment || segment.id === undefined || segment.id === null) {
        continue;
      }
      const segmentId = Number(segment.id);
      if (!Number.isNaN(segmentId) && segmentId >= 0) {
        this.cmd("Delete", segmentId);
      }
    }
    row.segments = [];
  }
  this.boardTextSegments = [];
};

CoinChangeBFS.prototype.clearNarrationBoardVisuals = function () {
  const ids = [
    this.boardBackgroundID,
    this.boardTimerID,
    this.boardProgressTrackID,
    this.boardProgressFillID,
  ];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (id !== undefined && id !== null && id >= 0) {
      this.cmd("Delete", id);
    }
  }
  this.boardBackgroundID = -1;
  this.boardTimerID = -1;
  this.boardProgressTrackID = -1;
  this.boardProgressFillID = -1;
};

CoinChangeBFS.prototype.buildNarrationBoard = function (options) {
  const settings = options || {};
  const canvasW = settings.canvasW || this.canvasWidth || 720;
  const messageY = settings.messageY || 0;
  const reservedHeight = Math.max(
    0,
    settings.reservedHeight !== undefined && settings.reservedHeight !== null
      ? settings.reservedHeight
      : this.boardReservedHeight || 0
  );

  this.clearNarrationText();
  this.clearNarrationBoardVisuals();

  const marginSpace = Math.max(18, Math.floor(reservedHeight * 0.12));
  let boardHeight = Math.max(96, reservedHeight - marginSpace);
  if (boardHeight > reservedHeight) {
    boardHeight = Math.max(96, Math.floor(reservedHeight * 0.9));
  }

  const topPadding = Math.max(8, Math.floor(reservedHeight * 0.03));
  const upwardNudge = Math.max(12, Math.floor(reservedHeight * 0.08));
  const baseOffset = Math.max(topPadding, Math.floor((reservedHeight - boardHeight) / 2));
  const boardTopMin = messageY + Math.max(4, Math.floor(reservedHeight * 0.02));
  let boardTop = messageY + Math.max(topPadding, baseOffset - upwardNudge);
  const boardBottomLimit = messageY + reservedHeight;
  if (boardTop + boardHeight > boardBottomLimit) {
    boardTop = boardBottomLimit - boardHeight;
  }

  if (boardTop < boardTopMin) {
    boardTop = boardTopMin;
  }

  const centerX = canvasW / 2;
  const centerY = boardTop + boardHeight / 2;
  const outerMargin = Math.max(18, Math.floor(canvasW * 0.03));
  const minBoardWidth = Math.max(430, Math.floor(canvasW * 0.78));
  const maxBoardWidth = Math.max(minBoardWidth, canvasW - outerMargin * 2);
  let boardWidth = Math.max(minBoardWidth, Math.floor(canvasW * 0.9));
  if (boardWidth > maxBoardWidth) {
    boardWidth = maxBoardWidth;
  }
  if (boardWidth > canvasW - 16) {
    boardWidth = canvasW - 16;
  }
  const boardLeft = centerX - boardWidth / 2;
  const boardRight = centerX + boardWidth / 2;

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
  this.cmd("SetBackgroundColor", this.boardBackgroundID, "#f6f8ff");

  const progressHeight = Math.max(5, Math.floor(boardHeight * 0.055));
  const progressBottomMargin = Math.max(8, Math.floor(boardHeight * 0.06));
  const progressMarginX = Math.max(12, Math.floor(boardWidth * 0.035));
  const progressY =
    boardTop + boardHeight - progressBottomMargin - progressHeight / 2;
  let progressWidth = boardWidth - progressMarginX * 2;
  if (progressWidth < 140) {
    progressWidth = Math.max(120, Math.floor(boardWidth * 0.85));
  }
  const progressCenterX = centerX;

  this.boardProgressTrackID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.boardProgressTrackID,
    "",
    progressWidth,
    progressHeight,
    progressCenterX,
    progressY
  );
  this.cmd("SetBackgroundColor", this.boardProgressTrackID, "#d7e3ff");
  this.cmd("SetForegroundColor", this.boardProgressTrackID, "#d7e3ff");

  this.boardProgressFillID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.boardProgressFillID,
    "",
    progressWidth,
    progressHeight,
    progressCenterX,
    progressY
  );
  this.cmd("SetBackgroundColor", this.boardProgressFillID, "#5a9bff");
  this.cmd("SetForegroundColor", this.boardProgressFillID, "#5a9bff");
  this.cmd("SetAlpha", this.boardProgressFillID, 0);

  const timerMarginX = Math.max(14, Math.floor(boardWidth * 0.035));
  const timerMarginY = Math.max(10, Math.floor(boardHeight * 0.08));
  const timerAnchorX = boardRight - timerMarginX;
  const timerY = boardTop + timerMarginY;
  this.boardTimerID = this.nextIndex++;
  this.cmd("CreateLabel", this.boardTimerID, "", timerAnchorX, timerY, 0);
  this.cmd("SetTextStyle", this.boardTimerID, "bold 16");
  this.cmd("SetForegroundColor", this.boardTimerID, "#2c4378");

  const textPaddingX = Math.max(18, Math.floor(boardWidth * 0.06));
  const textAreaLeft = boardLeft + textPaddingX;
  const textAreaRight = boardRight - textPaddingX;
  const textAreaWidth = Math.max(0, textAreaRight - textAreaLeft);
  const paragraphFontSize = 16;
  const approxCharWidth = Math.max(6, Math.floor(paragraphFontSize * 0.6));
  let textAreaTop = boardTop + Math.max(24, Math.floor(boardHeight * 0.2));
  const timerClearance =
    timerY + paragraphFontSize + Math.max(8, Math.floor(boardHeight * 0.06));
  if (textAreaTop < timerClearance) {
    textAreaTop = timerClearance;
  }
  const textAreaBottom = Math.max(
    textAreaTop + paragraphFontSize * 2,
    progressY - progressHeight / 2 - Math.max(12, Math.floor(boardHeight * 0.06))
  );
  const minLineY = boardTop + Math.max(14, Math.floor(boardHeight * 0.07));
  const usableTop = Math.max(minLineY, textAreaTop);
  const usableBottom = Math.max(usableTop + paragraphFontSize, textAreaBottom);
  const availableSpan = Math.max(0, usableBottom - usableTop);
  const minSpacing = Math.max(paragraphFontSize + 2, Math.floor(boardHeight * 0.14));
  const maxLinesBySpan = availableSpan > 0 ? Math.floor(availableSpan / minSpacing) + 1 : 1;
  const lineCount = Math.min(6, Math.max(1, maxLinesBySpan));
  let lineSpacing = 0;
  if (lineCount > 1) {
    const rawSpacing = Math.floor(availableSpan / Math.max(lineCount - 1, 1));
    lineSpacing = Math.max(minSpacing, rawSpacing);
  }
  const totalSpan = lineCount > 1 ? lineSpacing * (lineCount - 1) : 0;
  let firstLineY;
  if (lineCount > 1) {
    const maxStart = usableBottom - totalSpan;
    const preferredStart = Math.min(usableTop, maxStart);
    firstLineY = Math.max(minLineY, preferredStart);
  } else {
    const centerCandidate = Math.max(
      usableTop,
      Math.min(usableBottom, boardTop + boardHeight / 2)
    );
    firstLineY = Math.max(minLineY, centerCandidate);
  }

  this.boardLineIDs = [];
  this.boardTextSegments = [];
  for (let i = 0; i < lineCount; i++) {
    const offset = lineCount > 1 ? lineSpacing * i : 0;
    const lineY = Math.round(firstLineY + offset);
    this.boardLineIDs.push({
      y: lineY,
      startX: textAreaLeft,
      rightX: textAreaRight,
      segments: [],
    });
  }

  const charLimit = Math.max(36, Math.floor(textAreaWidth / Math.max(approxCharWidth, 1)));
  const approxTimerCharWidth = Math.max(7, Math.floor(boardWidth * 0.015));
  const timerExtraPadding = Math.max(4, Math.floor(approxTimerCharWidth * 0.8));
  this.boardInfo = {
    centerX,
    centerY,
    left: boardLeft,
    right: boardRight,
    width: boardWidth,
    height: boardHeight,
    top: boardTop,
    bottom: boardTop + boardHeight,
    progressWidth,
    progressHeight,
    progressLeft: progressCenterX - progressWidth / 2,
    progressY,
    progressMinWidth: Math.max(4, Math.floor(progressWidth * 0.05)),
    charLimit,
    lineCount,
    lineSpacing,
    textAreaLeft,
    textAreaRight,
    textAreaWidth,
    textFontSize: paragraphFontSize,
    textCharWidth: approxCharWidth,
    timerAnchorX,
    timerAnchorY: timerY,
    timerCharWidth: approxTimerCharWidth,
    timerExtraPadding,
  };

  this.updateNarrationLines([]);
  this.renderNarrationTimer(0, 0);
};

CoinChangeBFS.prototype.updateNarrationLines = function (lines) {
  if (!this.boardLineIDs) {
    return;
  }
  const rows = this.boardLineIDs;
  const prepared = Array.isArray(lines) ? lines : [];
  const charWidth =
    this.boardInfo && this.boardInfo.textCharWidth
      ? this.boardInfo.textCharWidth
      : 8;
  const fontSize =
    this.boardInfo && this.boardInfo.textFontSize
      ? this.boardInfo.textFontSize
      : 16;

  this.clearNarrationText();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) {
      continue;
    }
    const tokens =
      i < prepared.length && Array.isArray(prepared[i]) ? prepared[i] : [];
    if (!tokens || tokens.length === 0) {
      continue;
    }

    let cursorX = row.startX;
    row.segments = [];

    for (let j = 0; j < tokens.length; j++) {
      const token = tokens[j];
      if (!token || token.text === undefined || token.text === null) {
        continue;
      }
      const text = String(token.text);
      if (!text) {
        continue;
      }
      const labelID = this.nextIndex++;
      this.cmd("CreateLabel", labelID, text, Math.round(cursorX), row.y, 0);
      const fontStyle = token.bold ? `bold ${fontSize}` : `${fontSize}`;
      this.cmd("SetTextStyle", labelID, fontStyle);
      this.cmd("SetForegroundColor", labelID, "#0a223f");
      const segmentWidth =
        token.width !== undefined && token.width !== null
          ? Number(token.width)
          : text.length * charWidth;
      row.segments.push({ id: labelID });
      this.boardTextSegments.push(labelID);
      cursorX += Number.isFinite(segmentWidth) ? segmentWidth : text.length * charWidth;
    }
  }
};

CoinChangeBFS.prototype.normalizeNarrationHighlights = function (list) {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  const seen = {};
  const result = [];
  for (let i = 0; i < list.length; i++) {
    const entry = list[i];
    if (entry === undefined || entry === null) {
      continue;
    }
    const text = String(entry).trim();
    if (!text) {
      continue;
    }
    const key = text.toLowerCase();
    if (seen[key]) {
      continue;
    }
    seen[key] = true;
    result.push(text);
  }
  return result;
};

CoinChangeBFS.prototype.applyNarrationHighlights = function (lines, highlightList) {
  if (!lines || lines.length === 0) {
    return [];
  }
  const normalized = this.normalizeNarrationHighlights(highlightList);
  const highlightPatterns = [];
  for (let i = 0; i < normalized.length; i++) {
    const entry = normalized[i];
    if (!entry) {
      continue;
    }
    const parts = String(entry)
      .toLowerCase()
      .split(/\s+/)
      .map((token) => token.replace(/[^0-9a-zA-Z]+/g, ""))
      .filter((token) => token && token.length > 0);
    if (parts.length > 0) {
      highlightPatterns.push(parts);
    }
  }

  const tokenized = [];
  for (let i = 0; i < lines.length; i++) {
    const tokens = this.tokenizeNarrationLine(lines[i]);
    if (tokens.length === 0) {
      tokenized.push(null);
      continue;
    }
    if (highlightPatterns.length > 0) {
      this.highlightNarrationTokens(tokens, highlightPatterns);
    }
    tokenized.push(tokens);
  }
  return tokenized;
};

CoinChangeBFS.prototype.tokenizeNarrationLine = function (text) {
  if (text === undefined || text === null) {
    return [];
  }
  const source = String(text);
  if (!source.trim()) {
    return [];
  }
  const segments = source.split(/(\s+)/);
  const tokens = [];
  let previousWasSpace = true;
  for (let i = 0; i < segments.length; i++) {
    const part = segments[i];
    if (!part) {
      continue;
    }
    if (/^\s+$/.test(part)) {
      previousWasSpace = true;
      continue;
    }
    const sanitized = part.replace(/[^0-9a-zA-Z]+/g, "").toLowerCase();
    tokens.push({
      text: part,
      leadingSpace: tokens.length > 0 ? previousWasSpace : false,
      sanitized,
      bold: false,
    });
    previousWasSpace = false;
  }
  return tokens;
};

CoinChangeBFS.prototype.highlightNarrationTokens = function (tokens, highlightPatterns) {
  if (!tokens || tokens.length === 0 || !highlightPatterns || highlightPatterns.length === 0) {
    return;
  }
  for (let p = 0; p < highlightPatterns.length; p++) {
    const pattern = highlightPatterns[p];
    if (!pattern || pattern.length === 0) {
      continue;
    }
    for (let i = 0; i <= tokens.length - pattern.length; i++) {
      let matches = true;
      for (let j = 0; j < pattern.length; j++) {
        const token = tokens[i + j];
        if (!token || !token.sanitized || token.sanitized !== pattern[j]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        for (let j = 0; j < pattern.length; j++) {
          tokens[i + j].bold = true;
        }
        i += pattern.length - 1;
      }
    }
  }
};

CoinChangeBFS.prototype.wrapNarrationLines = function (lines, charLimit, maxLines) {
  if (!lines || lines.length === 0) {
    return [];
  }
  const approxCharWidth =
    this.boardInfo && this.boardInfo.textCharWidth
      ? this.boardInfo.textCharWidth
      : 8;
  const textAreaWidth =
    this.boardInfo && this.boardInfo.textAreaWidth
      ? this.boardInfo.textAreaWidth
      : Math.max(approxCharWidth, Math.max(10, charLimit || 48) * approxCharWidth);
  const allowedLines = Math.max(
    1,
    maxLines || (this.boardLineIDs ? this.boardLineIDs.length : lines.length)
  );
  const maxCharsPerLine = Math.max(
    4,
    Math.floor(textAreaWidth / Math.max(approxCharWidth, 1))
  );

  const flattened = [];
  let startOfFlow = true;
  for (let i = 0; i < lines.length; i++) {
    const entry = lines[i];
    if (!entry || (Array.isArray(entry) && entry.length === 0)) {
      if (!startOfFlow) {
        flattened.push({ type: "break" });
        startOfFlow = true;
      }
      continue;
    }
    const tokens = Array.isArray(entry) ? entry : [entry];
    let firstTokenInLine = true;
    for (let j = 0; j < tokens.length; j++) {
      const token = tokens[j];
      if (!token || token.text === undefined || token.text === null) {
        continue;
      }
      let content = String(token.text);
      if (!content) {
        continue;
      }
      if (!startOfFlow) {
        if (token.leadingSpace || firstTokenInLine) {
          content = " " + content;
        }
      }
      flattened.push({ type: "token", text: content, bold: !!token.bold });
      startOfFlow = false;
      firstTokenInLine = false;
    }
  }

  const rows = [];
  let currentRow = [];
  let currentWidth = 0;

  const pushRow = () => {
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
    currentRow = [];
    currentWidth = 0;
  };

  for (let i = 0; i < flattened.length; i++) {
    const item = flattened[i];
    if (!item) {
      continue;
    }
    if (item.type === "break") {
      pushRow();
      continue;
    }
    let text = item.text;
    if (!text) {
      continue;
    }

    const dropLeadingSpacesForRowStart = () => {
      while (text.length > 0 && text.charAt(0) === " " && currentRow.length === 0) {
        text = text.substring(1);
      }
    };

    dropLeadingSpacesForRowStart();

    while (text.length > 0) {
      if (
        currentRow.length > 0 &&
        currentWidth + text.length * approxCharWidth > textAreaWidth
      ) {
        pushRow();
        dropLeadingSpacesForRowStart();
        if (text.length === 0) {
          break;
        }
      }

      const remainingWidth = textAreaWidth - currentWidth;
      let capacityChars =
        currentRow.length === 0
          ? maxCharsPerLine
          : Math.max(1, Math.floor(remainingWidth / approxCharWidth));
      if (capacityChars <= 0) {
        pushRow();
        dropLeadingSpacesForRowStart();
        continue;
      }

      let take = Math.min(text.length, capacityChars);
      if (take < text.length) {
        const slice = text.substring(0, take);
        const lastSpace = slice.lastIndexOf(" ");
        if (lastSpace > 0) {
          take = lastSpace;
        }
      }
      if (take <= 0) {
        take = Math.min(text.length, capacityChars);
      }

      let consumed = take;
      let chunk = text.substring(0, take);
      if (currentRow.length === 0 && chunk.charAt(0) === " ") {
        chunk = chunk.substring(1);
      }
      if (chunk.length > 0) {
        const width = chunk.length * approxCharWidth;
        currentRow.push({ text: chunk, bold: item.bold, width });
        currentWidth += width;
      }
      text = text.substring(consumed);
      dropLeadingSpacesForRowStart();
    }
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  if (rows.length === 0) {
    return [];
  }

  if (rows.length > allowedLines) {
    if (allowedLines === 1) {
      const merged = [];
      for (let i = 0; i < rows.length; i++) {
        merged.push(...rows[i]);
      }
      return [merged];
    }
    const trimmed = rows.slice(0, allowedLines - 1);
    const overflow = [];
    for (let i = allowedLines - 1; i < rows.length; i++) {
      overflow.push(...rows[i]);
    }
    trimmed.push(overflow);
    return trimmed;
  }

  return rows;
};

CoinChangeBFS.prototype.renderNarrationTimer = function (remaining, total) {
  const safeRemaining = Math.max(0, Math.ceil(Number(remaining))); // display purpose only
  const safeTotal = Math.max(0, Math.ceil(Number(total)));
  const timerActive = safeTotal > 0;

  if (this.boardTimerID >= 0) {
    let timerText = "";
    if (timerActive) {
      timerText = safeRemaining > 0 ? `Next in ${safeRemaining}s` : "Next step ready";
    }
    this.cmd("SetText", this.boardTimerID, timerText);
    if (
      this.boardInfo &&
      this.boardInfo.timerAnchorX !== undefined &&
      this.boardInfo.timerAnchorY !== undefined
    ) {
      const charWidth = this.boardInfo.timerCharWidth || 8;
      const extra = this.boardInfo.timerExtraPadding || 0;
      const anchorX = this.boardInfo.timerAnchorX;
      const anchorY = this.boardInfo.timerAnchorY;
      let estimatedWidth = 0;
      if (timerText && timerText.length > 0) {
        estimatedWidth = Math.max(0, Math.round(timerText.length * charWidth) + extra);
      }
      let posX = anchorX - estimatedWidth;
      if (this.boardInfo.left !== undefined) {
        const leftLimit = this.boardInfo.left + Math.max(6, Math.floor((this.boardInfo.width || 0) * 0.015));
        if (posX < leftLimit) {
          posX = leftLimit;
        }
      }
      this.cmd("SetPosition", this.boardTimerID, posX, anchorY);
    }
  }

  if (this.boardProgressFillID >= 0 && this.boardInfo) {
    const totalDuration = timerActive ? safeTotal : 1;
    const remainingTime = timerActive
      ? Math.max(0, Math.min(safeRemaining, totalDuration))
      : totalDuration;
    const consumed = timerActive ? Math.max(0, totalDuration - remainingTime) : 0;
    const ratio = timerActive && totalDuration > 0 ? consumed / totalDuration : 0;
    let fillWidth = Math.round(this.boardInfo.progressWidth * ratio);
    if (ratio <= 0) {
      fillWidth = this.boardInfo.progressMinWidth;
    } else {
      fillWidth = Math.max(
        this.boardInfo.progressMinWidth,
        Math.min(fillWidth, this.boardInfo.progressWidth)
      );
    }
    const fillCenter = this.boardInfo.progressLeft + fillWidth / 2;
    this.cmd("SetWidth", this.boardProgressFillID, fillWidth);
    this.cmd("SetPosition", this.boardProgressFillID, fillCenter, this.boardInfo.progressY);
    this.cmd("SetAlpha", this.boardProgressFillID, ratio > 0 ? 1 : 0);
  }
};

CoinChangeBFS.prototype.buildCoinsRow = function (canvasW, coinsY) {
  const coinCount = this.coinValues.length;
  if (coinCount === 0) {
    return;
  }

  const COIN_W = 56;
  const COIN_H = 44;
  const COIN_SP = 18;
  const rowWidth = coinCount * COIN_W + (coinCount - 1) * COIN_SP;
  const startX = Math.floor((canvasW - rowWidth) / 2) + COIN_W / 2;

  this.coinPositions = [];
  this.coinIDs = [];
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

CoinChangeBFS.prototype.buildTreeDisplay = function (canvasW, topY, height) {
  const marginLeft = Math.max(60, Math.floor(canvasW * 0.08));
  let marginRight = Math.max(60, Math.floor(canvasW * 0.08));
  let panelGap = Math.max(30, Math.floor(canvasW * 0.045));
  let panelWidth = Math.max(160, Math.floor(canvasW * 0.22));

  let treeRight = canvasW - marginRight - panelGap - panelWidth;
  let areaWidth = treeRight - marginLeft;

  if (areaWidth < 320) {
    const deficit = 320 - areaWidth;
    const reduciblePanel = Math.max(0, panelWidth - 140);
    const reducePanel = Math.min(deficit, reduciblePanel);
    panelWidth -= reducePanel;
    const remaining = deficit - reducePanel;
    if (remaining > 0) {
      const reducibleMargin = Math.max(0, marginRight - 40);
      const reduceMargin = Math.min(remaining, reducibleMargin);
      marginRight -= reduceMargin;
    }
    treeRight = canvasW - marginRight - panelGap - panelWidth;
    areaWidth = treeRight - marginLeft;
  }

  if (areaWidth < 260) {
    areaWidth = 260;
    treeRight = marginLeft + areaWidth;
    marginRight = Math.max(30, canvasW - treeRight - panelGap - panelWidth);
    if (marginRight < 30) {
      marginRight = 30;
    }
  }

  const areaHeight = Math.max(240, height || 260);
  let areaTop = topY;

  this.visitedPanelWidth = panelWidth;
  this.visitedPanelGap = panelGap;
  const reservedForLabel = this.boardReservedHeight || 0;
  const labelOffsetBase =
    reservedForLabel > 0 ? Math.floor(reservedForLabel * 0.35) : 36;
  const labelOffset = Math.max(20, Math.min(34, Math.floor(labelOffsetBase * 0.75)));
  if (this.boardInfo) {
    const boardBottom = this.boardInfo.bottom || 0;
    const minGap = Math.max(18, Math.floor(reservedForLabel * 0.08));
    const expectedLabelY = areaTop - labelOffset;
    const requiredLabelY = boardBottom + minGap;
    if (expectedLabelY < requiredLabelY) {
      areaTop += requiredLabelY - expectedLabelY;
    }
  }

  this.treeArea = {
    left: marginLeft,
    right: marginLeft + areaWidth,
    width: areaWidth,
    top: areaTop,
    height: areaHeight,
    bottom: areaTop + areaHeight,
  };

  const visitedLeft = this.treeArea.right + panelGap;
  const visitedRight = Math.min(
    canvasW - marginRight,
    visitedLeft + this.visitedPanelWidth
  );
  this.visitedArea = {
    left: visitedLeft,
    right: visitedRight,
    width: visitedRight - visitedLeft,
    top: areaTop,
    bottom: areaTop + areaHeight,
    height: areaHeight,
  };
  this.visitedPanelWidth = this.visitedArea.width;

  this.treeDepthDenominator = 1;
  const dynamicRadius =
    Math.floor(this.treeArea.width / Math.max(6, this.amount + 2)) + 6;
  this.treeNodeRadius = Math.max(22, Math.min(32, dynamicRadius));
  this.treeNodeLabelOffset = this.treeNodeRadius + 16;

  const coinValuesForDepth =
    this.coinValues && this.coinValues.length > 0 ? this.coinValues : [1];
  const largestCoin = coinValuesForDepth[coinValuesForDepth.length - 1] || 1;
  const estimatedDepth =
    this.amount > 0 ? Math.ceil(this.amount / Math.max(largestCoin, 1)) : 0;
  this.treeDepthBaseEstimate = Math.max(2, Math.min(estimatedDepth, 6));
  this.treeDepthCapacity = Math.max(2, this.computeTreeDepthCapacity());
  this.treeDepthDenominator = Math.max(
    2,
    Math.min(this.treeDepthCapacity, this.treeDepthBaseEstimate)
  );

  const treeCenterX = this.treeArea.left + this.treeArea.width / 2;
  const treeLabelY = areaTop - labelOffset;
  this.treeLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.treeLabelID,
    "BFS exploration tree",
    treeCenterX,
    treeLabelY,
    1
  );
  this.cmd("SetTextStyle", this.treeLabelID, "bold 18");
  this.treeLabelOffset = labelOffset;
  this.treeLabelYCoord = treeLabelY;

  this.treeLevels = [];
  this.treeNodes = {};
  this.treeHighlightAmount = null;

  return {
    bottomY: this.treeArea.bottom,
  };
};

CoinChangeBFS.prototype.computeTreeDepthCapacity = function () {
  if (!this.treeArea) {
    return 2;
  }
  const usableHeight = Math.max(
    0,
    this.treeArea.height - this.treeNodeRadius * 2
  );
  const minSpacing = Math.max(70, this.treeNodeRadius * 2.6);
  const capacity = Math.floor(usableHeight / Math.max(minSpacing, 1));
  return Math.max(2, capacity > 0 ? capacity : 2);
};

CoinChangeBFS.prototype.buildVisitedDisplay = function (topY, bottomY, amount) {
  if (!this.visitedArea) {
    this.visitedArea = {
      left: this.treeArea ? this.treeArea.right + 30 : 520,
      right: this.treeArea ? this.treeArea.right + 190 : 680,
      width: 160,
      top: topY,
      bottom: bottomY,
      height: bottomY - topY,
    };
    this.visitedPanelWidth = this.visitedArea.width;
    this.visitedPanelGap = 30;
  }

  this.visitedArea.top = topY;
  this.visitedArea.bottom = bottomY;
  this.visitedArea.height = Math.max(40, bottomY - topY);

  const panelLeft = this.visitedArea.left;
  const panelRight = this.visitedArea.right;
  const centerX = panelLeft + this.visitedArea.width / 2;

  const visitedLabelBase =
    this.boardReservedHeight && this.boardReservedHeight > 0
      ? Math.floor(this.boardReservedHeight * 0.28)
      : 32;
  const desiredOffset =
    this.treeLabelOffset !== undefined && this.treeLabelOffset !== null
      ? this.treeLabelOffset
      : visitedLabelBase;
  const visitedLabelOffset = Math.max(20, Math.min(40, desiredOffset));
  const visitedLabelY =
    this.treeLabelYCoord !== undefined && this.treeLabelYCoord !== null
      ? this.treeLabelYCoord
      : topY - visitedLabelOffset;
  this.visitedLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.visitedLabelID,
    "Visited Array",
    centerX,
    visitedLabelY,
    1
  );
  this.cmd("SetTextStyle", this.visitedLabelID, "bold 18");

  const slotCount = Math.max(1, (amount || 0) + 1);
  const availableHeight = this.visitedArea.height;
  const minSlotHeight = 18;
  const maxSlotHeight = 34;

  let spacing = Math.max(3, Math.floor(availableHeight * 0.02));
  let slotHeight = Math.floor((availableHeight - (slotCount - 1) * spacing) / slotCount);
  if (slotHeight > maxSlotHeight) {
    slotHeight = maxSlotHeight;
  }
  if (slotHeight < minSlotHeight) {
    slotHeight = minSlotHeight;
    spacing = Math.max(
      2,
      Math.floor(
        (availableHeight - slotCount * slotHeight) / Math.max(slotCount - 1, 1)
      )
    );
  }

  let totalHeight = slotCount * slotHeight + (slotCount - 1) * spacing;
  if (totalHeight > availableHeight) {
    const extra = totalHeight - availableHeight;
    const reducePerGap = Math.ceil(extra / Math.max(slotCount - 1, 1));
    spacing = Math.max(2, spacing - reducePerGap);
    totalHeight = slotCount * slotHeight + (slotCount - 1) * spacing;
  }

  let startY = topY;
  if (totalHeight < availableHeight) {
    startY = topY + (availableHeight - totalHeight) / 2;
  }

  const headerY = Math.max(topY - 12, startY - Math.max(18, spacing));
  const indexX = panelLeft + 18;
  const slotWidth = Math.min(
    92,
    Math.max(58, Math.floor(this.visitedPanelWidth * 0.6))
  );
  const slotX = panelRight - slotWidth / 2 - 8;

  this.visitedIndexHeaderID = this.nextIndex++;
  this.cmd("CreateLabel", this.visitedIndexHeaderID, "amount", indexX, headerY, 1);
  this.cmd("SetTextStyle", this.visitedIndexHeaderID, "bold 12");

  this.visitedValueHeaderID = this.nextIndex++;
  this.cmd("CreateLabel", this.visitedValueHeaderID, "visited", slotX, headerY, 1);
  this.cmd("SetTextStyle", this.visitedValueHeaderID, "bold 12");

  this.visitedSlotIDs = [];
  this.visitedIndexIDs = [];
  this.visitedStates = [];
  this.visitedHighlightIndex = -1;

  for (let i = 0; i < slotCount; i++) {
    const centerY = startY + i * (slotHeight + spacing) + slotHeight / 2;
    const indexId = this.nextIndex++;
    this.cmd("CreateLabel", indexId, String(i), indexX, centerY, 1);
    this.cmd("SetTextStyle", indexId, "14");
    this.visitedIndexIDs.push(indexId);

    const slotId = this.nextIndex++;
    this.cmd("CreateRectangle", slotId, "0", slotWidth, slotHeight, slotX, centerY);
    this.cmd("SetBackgroundColor", slotId, this.visitedFalseColor);
    this.cmd("SetForegroundColor", slotId, "#000000");
    this.visitedSlotIDs.push(slotId);
  }
};

CoinChangeBFS.prototype.resetVisitedDisplay = function () {
  if (!this.visitedSlotIDs) {
    this.visitedSlotIDs = [];
  }
  this.visitedStates = new Array(this.visitedSlotIDs.length).fill(false);
  for (let i = 0; i < this.visitedSlotIDs.length; i++) {
    const id = this.visitedSlotIDs[i];
    this.cmd("SetText", id, "0");
    this.cmd("SetBackgroundColor", id, this.visitedFalseColor);
    this.cmd("SetHighlight", id, 0);
  }
  this.visitedHighlightIndex = -1;
};

CoinChangeBFS.prototype.setVisitedValue = function (index, state) {
  if (index < 0 || index >= this.visitedSlotIDs.length) {
    return;
  }
  const id = this.visitedSlotIDs[index];
  this.visitedStates[index] = !!state;
  this.cmd("SetText", id, state ? "1" : "0");
  this.cmd(
    "SetBackgroundColor",
    id,
    state ? this.visitedTrueColor : this.visitedFalseColor
  );
};

CoinChangeBFS.prototype.highlightVisitedEntry = function (index, highlight) {
  if (index < 0 || index >= this.visitedSlotIDs.length) {
    return;
  }
  if (highlight) {
    if (
      this.visitedHighlightIndex !== -1 &&
      this.visitedHighlightIndex !== index &&
      this.visitedSlotIDs[this.visitedHighlightIndex]
    ) {
      this.cmd(
        "SetHighlight",
        this.visitedSlotIDs[this.visitedHighlightIndex],
        0
      );
    }
    this.cmd("SetHighlight", this.visitedSlotIDs[index], 1);
    this.visitedHighlightIndex = index;
  } else {
    this.cmd("SetHighlight", this.visitedSlotIDs[index], 0);
    if (this.visitedHighlightIndex === index) {
      this.visitedHighlightIndex = -1;
    }
  }
};

CoinChangeBFS.prototype.buildQueueDisplay = function (canvasW, queueY, baseCellWidth, baseGap) {
  const amount = this.amount;
  const slotCount = Math.max(3, amount + 1);
  const gap = Math.max(6, baseGap || 10);
  const margin = 40;
  let slotWidth = baseCellWidth;
  if (!slotWidth || slotWidth < 28) {
    slotWidth = 40;
  }
  let totalWidth = slotCount * slotWidth + (slotCount - 1) * gap;
  const areaWidth = canvasW - 2 * margin;
  if (totalWidth > areaWidth) {
    slotWidth = Math.max(22, Math.floor((areaWidth - (slotCount - 1) * gap) / slotCount));
    totalWidth = slotCount * slotWidth + (slotCount - 1) * gap;
  }
  const startX = Math.floor((canvasW - totalWidth) / 2) + slotWidth / 2;
  const slotHeight = Math.max(26, Math.min(60, slotWidth + 6));

  this.queueLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.queueLabelID,
    "BFS queue",
    canvasW / 2,
    queueY - slotHeight / 2 - 24,
    1
  );
  this.cmd("SetTextStyle", this.queueLabelID, "bold 18");

  this.queueSlotIDs = [];
  this.queueValues = [];
  for (let i = 0; i < slotCount; i++) {
    const x = startX + i * (slotWidth + gap);
    const id = this.nextIndex++;
    this.queueSlotIDs.push(id);
    this.cmd("CreateRectangle", id, "", slotWidth, slotHeight, x, queueY);
    this.cmd("SetBackgroundColor", id, this.queueColor);
    this.cmd("SetForegroundColor", id, "#000000");
  }

  return {
    slotWidth,
    slotHeight,
    gap,
    bottomY: queueY + slotHeight / 2,
  };
};

CoinChangeBFS.prototype.getTreeLevelY = function (level) {
  if (!this.treeArea) {
    return 0;
  }
  const steps = Math.max(1, this.treeDepthDenominator);
  const limitedLevel = Math.min(Math.max(level, 0), steps);
  const usableHeight = Math.max(0, this.treeArea.height - this.treeNodeRadius * 2);
  const baseY = this.treeArea.top + this.treeNodeRadius;
  if (steps <= 0) {
    return baseY;
  }
  const spacing = usableHeight / steps;
  return baseY + limitedLevel * spacing;
};

CoinChangeBFS.prototype.getNodeParent = function (amount) {
  if (
    this.treeNodes[amount] !== undefined &&
    this.treeNodes[amount] !== null &&
    this.treeNodes[amount].parent !== undefined
  ) {
    return this.treeNodes[amount].parent;
  }
  if (
    this.treePendingParents &&
    Object.prototype.hasOwnProperty.call(this.treePendingParents, amount)
  ) {
    return this.treePendingParents[amount];
  }
  return null;
};

CoinChangeBFS.prototype.ensureTreeDepthCapacity = function (level) {
  if (!this.treeArea) {
    return;
  }
  const requiredDepth = Math.max(1, level);
  const maxDepth = Math.max(2, this.computeTreeDepthCapacity());
  this.treeDepthCapacity = maxDepth;
  if (requiredDepth > this.treeDepthBaseEstimate) {
    this.treeDepthBaseEstimate = requiredDepth;
  }

  let targetDenominator = this.treeDepthDenominator;
  if (requiredDepth > maxDepth) {
    targetDenominator = Math.max(targetDenominator, requiredDepth);
  } else if (requiredDepth > targetDenominator) {
    targetDenominator = Math.max(
      targetDenominator,
      Math.min(requiredDepth, maxDepth)
    );
  }

  if (targetDenominator !== this.treeDepthDenominator) {
    this.treeDepthDenominator = targetDenominator;
    this.reflowTreeLayout();
  }
};

CoinChangeBFS.prototype.reflowTreeLayout = function () {
  if (!this.treeLevels) {
    return;
  }
  for (let level = 0; level < this.treeLevels.length; level++) {
    this.updateTreeLevelPositions(level);
  }
};

CoinChangeBFS.prototype.insertIntoTreeLevel = function (level, amount, parent) {
  if (!this.treeLevels[level]) {
    this.treeLevels[level] = [];
  }

  const existingIndex = this.treeLevels[level].indexOf(amount);
  if (existingIndex !== -1) {
    return existingIndex;
  }

  if (level === 0) {
    this.treeLevels[level].push(amount);
    return this.treeLevels[level].length - 1;
  }

  const previousLevel = this.treeLevels[level - 1] || [];
  const parentOrder = new Map();
  for (let i = 0; i < previousLevel.length; i++) {
    parentOrder.set(previousLevel[i], i);
  }

  const normalizedParent = parent === undefined ? null : parent;
  const parentRank = parentOrder.has(normalizedParent)
    ? parentOrder.get(normalizedParent)
    : Number.MAX_SAFE_INTEGER;

  let insertIndex = this.treeLevels[level].length;
  for (let i = 0; i < this.treeLevels[level].length; i++) {
    const currentAmount = this.treeLevels[level][i];
    const currentParent = this.getNodeParent(currentAmount);
    const currentRank = parentOrder.has(currentParent)
      ? parentOrder.get(currentParent)
      : Number.MAX_SAFE_INTEGER;

    if (currentRank > parentRank) {
      insertIndex = i;
      break;
    }

    if (currentRank === parentRank && currentParent === normalizedParent) {
      insertIndex = i + 1;
    }
  }

  this.treeLevels[level].splice(insertIndex, 0, amount);
  return insertIndex;
};

CoinChangeBFS.prototype.updateTreeLevelPositions = function (level) {
  const positions = [];
  const levelAmounts = this.treeLevels[level] || [];
  if (!this.treeArea || levelAmounts.length === 0) {
    return positions;
  }

  const y = this.getTreeLevelY(level);
  const baseLeft = this.treeArea.left + this.treeNodeRadius;
  const baseRight = this.treeArea.right - this.treeNodeRadius;
  const clamp = (value) => Math.max(baseLeft, Math.min(baseRight, value));

  if (level === 0) {
    const centerX = clamp((baseLeft + baseRight) / 2);
    const rootAmount = levelAmounts[0];
    positions.push({ x: centerX, y });
    const rootNode = this.treeNodes[rootAmount];
    if (rootNode) {
      this.cmd("Move", rootNode.id, centerX, y);
      if (rootNode.labelID >= 0) {
        this.cmd("Move", rootNode.labelID, centerX, y + this.treeNodeLabelOffset);
      }
      rootNode.x = centerX;
      rootNode.y = y;
    }
    return positions;
  }

  const parentAmounts = this.treeLevels[level - 1] || [];
  const fallbackCenter = clamp((baseLeft + baseRight) / 2);
  const parentCenters = parentAmounts.map((amount, index) => {
    const parentNode = this.treeNodes[amount];
    if (parentNode && parentNode.x !== undefined && parentNode.x !== null) {
      return clamp(parentNode.x);
    }
    return clamp(
      baseLeft +
        ((index + 1) * (baseRight - baseLeft)) /
          Math.max(parentAmounts.length + 1, 2)
    );
  });

  const parentCenterLookup = new Map();
  for (let i = 0; i < parentAmounts.length; i++) {
    parentCenterLookup.set(parentAmounts[i], parentCenters[i]);
  }

  const groupSequence = [];
  const groupLookup = new Map();
  for (const amount of levelAmounts) {
    const parent = this.getNodeParent(amount);
    if (!groupLookup.has(parent)) {
      const desiredCenter = parentCenterLookup.has(parent)
        ? parentCenterLookup.get(parent)
        : fallbackCenter;
      const entry = {
        parent,
        children: [],
        desiredCenter,
      };
      groupLookup.set(parent, entry);
      groupSequence.push(entry);
    }
    groupLookup.get(parent).children.push(amount);
  }

  if (groupSequence.length === 0) {
    return positions;
  }

  const availableWidth = Math.max(0, baseRight - baseLeft);
  const baseSpacing = Math.max(this.treeNodeRadius * 3.1, 96);
  const minSpacing = Math.max(this.treeNodeRadius * 2.4, 74);

  const computeLayout = (spacing) => {
    const margin = Math.max(spacing * 0.5, this.treeNodeRadius * 1.3, 36);
    const padding = Math.max(spacing * 0.28, this.treeNodeRadius * 0.9, 18);
    const groups = [];

    for (const entry of groupSequence) {
      const { parent, children, desiredCenter } = entry;
      if (!children || children.length === 0) {
        continue;
      }

      let parentCenter = parentCenterLookup.has(parent)
        ? parentCenterLookup.get(parent)
        : desiredCenter;
      if (!Number.isFinite(parentCenter)) {
        parentCenter = fallbackCenter;
      }
      parentCenter = clamp(parentCenter);

      const info = {
        parent,
        children: children.slice(),
        parentCenter,
        center: parentCenter,
        positions: [],
        padding,
      };

      if (children.length === 1) {
        const x = clamp(parentCenter);
        info.positions.push(x);
        info.minX = x;
        info.maxX = x;
      } else {
        const offsets = [];
        if (children.length % 2 === 0) {
          const base = children.length / 2 - 0.5;
          for (let i = 0; i < children.length; i++) {
            offsets.push(i - base);
          }
        } else {
          const mid = Math.floor(children.length / 2);
          for (let i = 0; i < children.length; i++) {
            offsets.push(i - mid);
          }
        }

        const rawPositions = [];
        let minX = Infinity;
        let maxX = -Infinity;
        for (let i = 0; i < children.length; i++) {
          const x = parentCenter + offsets[i] * spacing;
          rawPositions.push(x);
          if (x < minX) {
            minX = x;
          }
          if (x > maxX) {
            maxX = x;
          }
        }

        if (!Number.isFinite(minX) || !Number.isFinite(maxX)) {
          const x = clamp(parentCenter);
          info.positions = children.map(() => x);
          info.minX = x;
          info.maxX = x;
          info.center = x;
        } else {
          let shift = 0;
          if (minX < baseLeft) {
            shift += baseLeft - minX;
          }
          if (maxX + shift > baseRight) {
            shift -= maxX + shift - baseRight;
            const minShift = baseLeft - minX;
            const maxShift = baseRight - maxX;
            if (shift < minShift) {
              shift = minShift;
            } else if (shift > maxShift) {
              shift = maxShift;
            }
          }
          const adjusted = rawPositions.map((value) => value + shift);
          info.positions = adjusted;
          info.minX = Math.min(...adjusted);
          info.maxX = Math.max(...adjusted);
          info.center = parentCenter + shift;
        }
      }

      if (info.minX === undefined || info.maxX === undefined) {
        const x = clamp(info.center);
        info.positions = info.children.map(() => x);
        info.minX = x;
        info.maxX = x;
        info.center = x;
      }

      info.width = Math.max(info.maxX - info.minX, 0);
      info.start = Math.max(baseLeft, info.minX - padding);
      info.end = Math.min(baseRight, info.maxX + padding);
      info.blockWidth = Math.max(
        info.end - info.start,
        this.treeNodeRadius * 2.6,
        spacing * 0.4
      );
      groups.push(info);
    }

    let totalWidth = 0;
    if (groups.length > 0) {
      totalWidth = (
        groups.reduce((sum, info) => sum + info.blockWidth, 0) +
        margin * (groups.length - 1)
      );
    }

    return { groups, margin, totalWidth };
  };

  let siblingSpacing = baseSpacing;
  let layout = computeLayout(siblingSpacing);
  if (availableWidth > 0 && layout.groups.length > 0) {
    for (let attempt = 0; attempt < 5; attempt++) {
      if (layout.totalWidth <= availableWidth + 1) {
        break;
      }
      const scale = availableWidth / Math.max(layout.totalWidth, 1);
      const nextSpacing = Math.max(minSpacing, siblingSpacing * scale);
      if (Math.abs(nextSpacing - siblingSpacing) < 0.5) {
        siblingSpacing = nextSpacing;
        layout = computeLayout(siblingSpacing);
        break;
      }
      siblingSpacing = nextSpacing;
      layout = computeLayout(siblingSpacing);
    }
  }

  const finalGroups = layout.groups;
  const margin = layout.margin;

  const adjustGroup = (info, delta) => {
    if (!info || !Number.isFinite(delta) || delta === 0) {
      return 0;
    }
    const minDelta = baseLeft - info.minX;
    const maxDelta = baseRight - info.maxX;
    let applied = Math.max(minDelta, Math.min(maxDelta, delta));
    if (!Number.isFinite(applied) || Math.abs(applied) < 0.01) {
      return 0;
    }
    for (let i = 0; i < info.positions.length; i++) {
      info.positions[i] += applied;
    }
    info.minX += applied;
    info.maxX += applied;
    info.center += applied;
    info.start = Math.max(baseLeft, info.minX - info.padding);
    info.end = Math.min(baseRight, info.maxX + info.padding);
    info.blockWidth = Math.max(
      info.end - info.start,
      this.treeNodeRadius * 2.6,
      siblingSpacing * 0.4
    );
    return applied;
  };

  if (finalGroups.length > 1 && availableWidth > 0) {
    const sorted = finalGroups.slice().sort((a, b) => a.center - b.center);
    const maxIterations = 6;
    for (let iter = 0; iter < maxIterations; iter++) {
      let changed = false;

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        const desiredStart = prev.end + margin;
        if (curr.start < desiredStart) {
          const shift = adjustGroup(curr, desiredStart - curr.start);
          if (Math.abs(shift) > 0.01) {
            changed = true;
          }
        }
      }

      for (let i = sorted.length - 2; i >= 0; i--) {
        const curr = sorted[i];
        const next = sorted[i + 1];
        const desiredEnd = next.start - margin;
        if (curr.end > desiredEnd) {
          const shift = adjustGroup(curr, desiredEnd - curr.end);
          if (Math.abs(shift) > 0.01) {
            changed = true;
          }
        }
      }

      const first = sorted[0];
      if (first.start < baseLeft) {
        const shift = adjustGroup(first, baseLeft - first.start);
        if (Math.abs(shift) > 0.01) {
          changed = true;
        }
      }
      const last = sorted[sorted.length - 1];
      if (last.end > baseRight) {
        const shift = adjustGroup(last, baseRight - last.end);
        if (Math.abs(shift) > 0.01) {
          changed = true;
        }
      }

      if (!changed) {
        break;
      }
    }
  } else if (finalGroups.length === 1) {
    const singleGroup = finalGroups[0];
    if (singleGroup.start < baseLeft) {
      adjustGroup(singleGroup, baseLeft - singleGroup.start);
    } else if (singleGroup.end > baseRight) {
      adjustGroup(singleGroup, baseRight - singleGroup.end);
    }
  }

  const positionLookup = new Map();
  for (const info of finalGroups) {
    for (let i = 0; i < info.children.length; i++) {
      const amount = info.children[i];
      const x = clamp(info.positions[i]);
      positionLookup.set(amount, { x, y });
    }
  }

  for (let i = 0; i < levelAmounts.length; i++) {
    const amount = levelAmounts[i];
    let pos = positionLookup.get(amount);
    if (!pos) {
      const fallbackX = clamp(
        baseLeft +
          ((i + 1) * (baseRight - baseLeft)) /
            Math.max(levelAmounts.length + 1, 2)
      );
      pos = { x: fallbackX, y };
      positionLookup.set(amount, pos);
    }
    positions.push(pos);
    const node = this.treeNodes[amount];
    if (node) {
      this.cmd("Move", node.id, pos.x, pos.y);
      if (node.labelID >= 0) {
        this.cmd("Move", node.labelID, pos.x, pos.y + this.treeNodeLabelOffset);
      }
      node.x = pos.x;
      node.y = pos.y;
      if (
        node.edgeLabelID !== undefined &&
        node.edgeLabelID !== null &&
        node.edgeLabelID >= 0
      ) {
        this.updateEdgeLabelPosition(amount);
      }
    }
  }

  return positions;
};

CoinChangeBFS.prototype.resetTreeDisplay = function () {
  const amounts = Object.keys(this.treeNodes || {}).map(Number);
  amounts.sort((a, b) => {
    const nodeA = this.treeNodes[a];
    const nodeB = this.treeNodes[b];
    const levelA = nodeA ? nodeA.level : 0;
    const levelB = nodeB ? nodeB.level : 0;
    if (levelA !== levelB) {
      return levelB - levelA;
    }
    return b - a;
  });

  this.clearTreeEdgeHighlight();

  this.treeDepthCapacity = Math.max(2, this.computeTreeDepthCapacity());

  const baseDepth = Math.max(
    2,
    Math.min(
      this.treeDepthCapacity || 2,
      this.treeDepthBaseEstimate || this.treeDepthDenominator || 2
    )
  );
  this.treeDepthDenominator = baseDepth;

  for (const amount of amounts) {
    const node = this.treeNodes[amount];
    if (!node) {
      continue;
    }
    if (node.parent !== null && this.treeNodes[node.parent]) {
      this.cmd("Disconnect", this.treeNodes[node.parent].id, node.id);
    }
    if (node.labelID >= 0) {
      this.cmd("Delete", node.labelID);
    }
    if (
      node.edgeLabelID !== undefined &&
      node.edgeLabelID !== null &&
      node.edgeLabelID >= 0
    ) {
      this.cmd("Delete", node.edgeLabelID);
    }
    this.cmd("Delete", node.id);
  }

  this.treeLevels = [];
  this.treeNodes = {};
  this.treeHighlightAmount = null;
  this.treePendingParents = {};
  this.treeActiveEdge = null;

  this.createTreeRoot();
};

CoinChangeBFS.prototype.createTreeRoot = function () {
  if (!this.treeArea) {
    return;
  }
  this.treeLevels[0] = [0];
  const positions = this.updateTreeLevelPositions(0);
  const pos = positions[0] || {
    x: this.treeArea.left + this.treeArea.width / 2,
    y: this.getTreeLevelY(0),
  };

  const nodeID = this.nextIndex++;
  this.cmd("CreateCircle", nodeID, "0", pos.x, pos.y);
  this.cmd("SetBackgroundColor", nodeID, this.treeDefaultColor);
  this.cmd("SetForegroundColor", nodeID, "#000000");

  const labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    this.formatTreeNodeLabel(0, null),
    pos.x,
    pos.y + this.treeNodeLabelOffset,
    1
  );
  this.cmd("SetTextStyle", labelID, "14");

  this.treeNodes[0] = {
    id: nodeID,
    labelID,
    level: 0,
    x: pos.x,
    y: pos.y,
    step: 0,
    coin: null,
    parent: null,
    color: this.treeDefaultColor,
    edgeLabelID: -1,
  };
};

CoinChangeBFS.prototype.formatTreeNodeLabel = function () {
  return "";
};

CoinChangeBFS.prototype.updateTreeNodeLabel = function (amount, step, coin) {
  const node = this.treeNodes[amount];
  if (!node) {
    return;
  }
  if (step !== undefined && step !== null) {
    node.step = step;
  }
  if (coin !== undefined) {
    node.coin = coin;
  }
  if (node.labelID >= 0) {
    this.cmd(
      "SetText",
      node.labelID,
      this.formatTreeNodeLabel(node.step, node.coin)
    );
  }
};

CoinChangeBFS.prototype.ensureTreeNode = function (
  amount,
  level,
  parentAmount,
  step,
  coin
) {
  const parent = parentAmount === undefined ? null : parentAmount;
  const hasLevel = level !== undefined && level !== null;
  let normalizedLevel = hasLevel ? level : 0;

  if (this.treeNodes[amount]) {
    const node = this.treeNodes[amount];
    const levelForLayout = hasLevel ? normalizedLevel : node.level || 0;
    this.ensureTreeDepthCapacity(levelForLayout);
    this.updateTreeNodeLabel(amount, step, coin);
    if (hasLevel) {
      node.level = normalizedLevel;
    }
    if (parent !== undefined) {
      node.parent = parent;
    }
    if (coin !== undefined && coin !== null) {
      this.setEdgeLabel(amount, coin);
    } else if (
      node.edgeLabelID !== undefined &&
      node.edgeLabelID !== null &&
      node.edgeLabelID >= 0
    ) {
      this.updateEdgeLabelPosition(amount);
    }
    return node;
  }

  this.ensureTreeDepthCapacity(normalizedLevel);

  this.treePendingParents[amount] = parent;
  const index = this.insertIntoTreeLevel(normalizedLevel, amount, parent);
  const positions = this.updateTreeLevelPositions(normalizedLevel);
  const pos = positions[index] || {
    x: this.treeArea.left + this.treeArea.width / 2,
    y: this.getTreeLevelY(normalizedLevel),
  };

  const nodeID = this.nextIndex++;
  this.cmd("CreateCircle", nodeID, String(amount), pos.x, pos.y);
  this.cmd("SetBackgroundColor", nodeID, this.treeDefaultColor);
  this.cmd("SetForegroundColor", nodeID, "#000000");

  const labelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    labelID,
    this.formatTreeNodeLabel(step, coin),
    pos.x,
    pos.y + this.treeNodeLabelOffset,
    1
  );
  this.cmd("SetTextStyle", labelID, "14");

  const nodeInfo = {
    id: nodeID,
    labelID,
    level: normalizedLevel,
    x: pos.x,
    y: pos.y,
    step: step === undefined ? null : step,
    coin: coin === undefined ? null : coin,
    parent,
    color: this.treeDefaultColor,
    edgeLabelID: -1,
  };
  this.treeNodes[amount] = nodeInfo;
  delete this.treePendingParents[amount];

  if (
    parent !== undefined &&
    parent !== null &&
    this.treeNodes[parent]
  ) {
    this.cmd("Connect", this.treeNodes[parent].id, nodeID);
    if (coin !== undefined && coin !== null) {
      this.setEdgeLabel(amount, coin);
    }
  }

  return nodeInfo;
};

CoinChangeBFS.prototype.setTreeNodeColor = function (amount, color) {
  const node = this.treeNodes[amount];
  if (!node) {
    return;
  }
  const fill = color || this.treeDefaultColor;
  this.cmd("SetBackgroundColor", node.id, fill);
  node.color = fill;
};

CoinChangeBFS.prototype.computeEdgeLabelPosition = function (parentNode, childNode) {
  if (!parentNode || !childNode) {
    return { x: 0, y: 0 };
  }
  const midX = (parentNode.x + childNode.x) / 2;
  const midY = (parentNode.y + childNode.y) / 2;
  const dx = childNode.x - parentNode.x;
  const dy = childNode.y - parentNode.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (!length || !Number.isFinite(length)) {
    return { x: midX, y: midY };
  }

  const perpA = { x: -dy / length, y: dx / length };
  const perpB = { x: dy / length, y: -dx / length };

  const pickVector = (vec1, vec2) => {
    const vec1Score = Number.isFinite(vec1.y) ? vec1.y : 0;
    const vec2Score = Number.isFinite(vec2.y) ? vec2.y : 0;
    if (vec1Score < 0 && vec2Score >= 0) {
      return vec1;
    }
    if (vec2Score < 0 && vec1Score >= 0) {
      return vec2;
    }
    return Math.abs(vec1Score) <= Math.abs(vec2Score) ? vec1 : vec2;
  };

  let offsetVec = pickVector(perpA, perpB);
  if (!Number.isFinite(offsetVec.x) || !Number.isFinite(offsetVec.y)) {
    offsetVec = { x: 0, y: -1 };
  }

  if (Math.abs(offsetVec.y) < 0.05) {
    offsetVec = Math.abs(perpA.y) > Math.abs(perpB.y) ? perpA : perpB;
    if (Math.abs(offsetVec.y) < 0.05) {
      offsetVec = { x: 0, y: dy >= 0 ? -1 : 1 };
    }
  }

  const offsetMagnitude = Math.max(
    8,
    Math.min(18, Math.max(this.treeNodeRadius * 0.6, length * 0.18))
  );
  let labelX = midX + offsetVec.x * offsetMagnitude;
  let labelY = midY + offsetVec.y * offsetMagnitude;

  if (this.treeArea) {
    const margin = Math.max(12, this.treeNodeRadius * 0.75);
    labelX = Math.max(this.treeArea.left + margin, Math.min(this.treeArea.right - margin, labelX));
    labelY = Math.max(this.treeArea.top + margin, Math.min(this.treeArea.bottom - margin, labelY));
  }

  return { x: labelX, y: labelY };
};

CoinChangeBFS.prototype.updateEdgeLabelPosition = function (amount) {
  const node = this.treeNodes[amount];
  if (
    !node ||
    node.edgeLabelID === undefined ||
    node.edgeLabelID === null ||
    node.edgeLabelID < 0
  ) {
    return;
  }
  const parentAmount = node.parent;
  if (parentAmount === undefined || parentAmount === null) {
    return;
  }
  const parent = this.treeNodes[parentAmount];
  if (!parent) {
    return;
  }
  const pos = this.computeEdgeLabelPosition(parent, node);
  this.cmd("Move", node.edgeLabelID, pos.x, pos.y);
};

CoinChangeBFS.prototype.setEdgeLabel = function (amount, coin) {
  if (coin === undefined || coin === null) {
    return;
  }
  const node = this.treeNodes[amount];
  if (!node) {
    return;
  }
  const parentAmount = node.parent;
  if (parentAmount === undefined || parentAmount === null) {
    return;
  }
  const parent = this.treeNodes[parentAmount];
  if (!parent) {
    return;
  }
  const labelText = `+${coin}`;
  const pos = this.computeEdgeLabelPosition(parent, node);
  if (
    node.edgeLabelID === undefined ||
    node.edgeLabelID === null ||
    node.edgeLabelID < 0
  ) {
    const labelID = this.nextIndex++;
    this.cmd("CreateLabel", labelID, labelText, pos.x, pos.y, 0);
    this.cmd("SetTextStyle", labelID, "bold 16");
    this.cmd("SetForegroundColor", labelID, this.treeEdgeLabelColor);
    node.edgeLabelID = labelID;
  } else {
    this.cmd("SetText", node.edgeLabelID, labelText);
    this.cmd("SetTextStyle", node.edgeLabelID, "bold 16");
    this.cmd("SetForegroundColor", node.edgeLabelID, this.treeEdgeLabelColor);
    this.cmd("Move", node.edgeLabelID, pos.x, pos.y);
  }
};

CoinChangeBFS.prototype.markTreeNodeVisited = function (
  amount,
  step,
  color,
  coin,
  parentAmount
) {
  const level = step === undefined || step === null ? 0 : step;
  const parent = parentAmount === undefined ? null : parentAmount;
  this.ensureTreeNode(amount, level, parent, step, coin);
  this.updateTreeNodeLabel(amount, step, coin);
  this.setTreeNodeColor(amount, color || this.treeVisitedColor);
};

CoinChangeBFS.prototype.highlightTreeNode = function (amount) {
  if (this.treeHighlightAmount === amount) {
    return;
  }
  if (
    this.treeHighlightAmount !== null &&
    this.treeNodes[this.treeHighlightAmount]
  ) {
    const prev = this.treeNodes[this.treeHighlightAmount];
    this.cmd("SetBackgroundColor", prev.id, prev.color || this.treeDefaultColor);
  }
  if (this.treeNodes[amount]) {
    this.cmd("SetBackgroundColor", this.treeNodes[amount].id, this.treeActiveColor);
    this.treeHighlightAmount = amount;
  } else {
    this.treeHighlightAmount = null;
  }
};

CoinChangeBFS.prototype.clearTreeHighlight = function () {
  if (
    this.treeHighlightAmount !== null &&
    this.treeNodes[this.treeHighlightAmount]
  ) {
    const node = this.treeNodes[this.treeHighlightAmount];
    this.cmd("SetBackgroundColor", node.id, node.color || this.treeDefaultColor);
  }
  this.treeHighlightAmount = null;
};

CoinChangeBFS.prototype.setTreeEdgeHighlight = function (fromAmount, toAmount, highlight) {
  const fromNode = this.treeNodes[fromAmount];
  const toNode = this.treeNodes[toAmount];
  if (!fromNode || !toNode) {
    return;
  }
  this.cmd("SetEdgeHighlight", fromNode.id, toNode.id, highlight ? 1 : 0);
  if (highlight) {
    this.treeActiveEdge = { from: fromAmount, to: toAmount };
  } else if (
    this.treeActiveEdge &&
    this.treeActiveEdge.from === fromAmount &&
    this.treeActiveEdge.to === toAmount
  ) {
    this.treeActiveEdge = null;
  }
};

CoinChangeBFS.prototype.clearTreeEdgeHighlight = function () {
  if (!this.treeActiveEdge) {
    return;
  }
  const { from, to } = this.treeActiveEdge;
  const fromNode = this.treeNodes[from];
  const toNode = this.treeNodes[to];
  if (fromNode && toNode) {
    this.cmd("SetEdgeHighlight", fromNode.id, toNode.id, 0);
  }
  this.treeActiveEdge = null;
};

CoinChangeBFS.prototype.pulseTreeEdge = function (fromAmount, toAmount) {
  const fromNode = this.treeNodes[fromAmount];
  const toNode = this.treeNodes[toAmount];
  if (!fromNode || !toNode) {
    return;
  }
  this.clearTreeEdgeHighlight();
  this.setTreeEdgeHighlight(fromAmount, toAmount, true);
  let labelID = -1;
  if (
    toNode.edgeLabelID !== undefined &&
    toNode.edgeLabelID !== null &&
    toNode.edgeLabelID >= 0
  ) {
    labelID = toNode.edgeLabelID;
    this.cmd("SetForegroundColor", labelID, "#d47f00");
  }
  this.cmd("Step");
  this.setTreeEdgeHighlight(fromAmount, toAmount, false);
  if (labelID >= 0) {
    this.cmd("SetForegroundColor", labelID, this.treeEdgeLabelColor);
  }
};

CoinChangeBFS.prototype.resetQueueDisplay = function () {
  this.queueValues = [];
  this.queueHighlightIndex = -1;
  for (let i = 0; i < this.queueSlotIDs.length; i++) {
    this.cmd("SetText", this.queueSlotIDs[i], "");
    this.cmd("SetBackgroundColor", this.queueSlotIDs[i], this.queueColor);
  }
};

CoinChangeBFS.prototype.refreshQueue = function (queue) {
  this.queueValues = queue.slice();
  for (let i = 0; i < this.queueSlotIDs.length; i++) {
    const text = i < this.queueValues.length ? String(this.queueValues[i]) : "";
    this.cmd("SetText", this.queueSlotIDs[i], text);
    this.cmd("SetBackgroundColor", this.queueSlotIDs[i], this.queueColor);
  }
  this.queueHighlightIndex = -1;
};

CoinChangeBFS.prototype.highlightQueueSlot = function (index, highlight) {
  if (index < 0 || index >= this.queueSlotIDs.length) {
    return;
  }
  const id = this.queueSlotIDs[index];
  if (!id) {
    return;
  }
  this.cmd("SetBackgroundColor", id, highlight ? this.queueHighlightColor : this.queueColor);
  this.queueHighlightIndex = highlight ? index : -1;
};

CoinChangeBFS.prototype.highlightCode = function (lineIdx) {
  for (let i = 0; i < this.codeIDs.length; i++) {
    this.cmd("SetHighlight", this.codeIDs[i], i === lineIdx ? 1 : 0);
  }
};

CoinChangeBFS.prototype.highlightCoin = function (idx) {
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

CoinChangeBFS.prototype.unhighlightCoin = function () {
  if (this.coinHighlight >= 0 && this.coinIDs[this.coinHighlight]) {
    this.cmd("SetBackgroundColor", this.coinIDs[this.coinHighlight], this.coinColor);
  }
  this.coinHighlight = -1;
};

CoinChangeBFS.prototype.cmd = function () {
  if (
    arguments.length > 0 &&
    arguments[0] === "Step" &&
    this.narrationBudgetInitialized
  ) {
    this.totalStepCount = (this.totalStepCount || 0) + 1;
    if (this._narrationStepContext) {
      this.narrationBeatsUsed = (this.narrationBeatsUsed || 0) + 1;
    } else {
      this.structuralStepsUsed = (this.structuralStepsUsed || 0) + 1;
    }
  }
  CoinChangeBFS.superclass.cmd.apply(this, arguments);
};

CoinChangeBFS.prototype.initializeNarrationBudget = function (coins, amount) {
  const totalBudget = 510;
  const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
  const coinCount = Array.isArray(coins) ? coins.length : 0;
  const boundedCoinCount = Math.max(0, Math.min(8, coinCount));
  const processedUpper = Math.max(1, safeAmount === 0 ? 1 : safeAmount);
  const popUpper = processedUpper * 2;
  const perCoinUpper = processedUpper * boundedCoinCount;
  const highlightUpper = processedUpper * boundedCoinCount;
  const newVisitedUpper = safeAmount * 2;
  const finishingSteps = safeAmount > 0 ? 2 : 1;
  let structuralAllowance =
    2 + popUpper + perCoinUpper + highlightUpper + newVisitedUpper + finishingSteps;
  structuralAllowance = Math.max(0, Math.min(structuralAllowance, totalBudget));
  const narrationBudget = Math.max(0, totalBudget - structuralAllowance);

  this.totalStepBudget = totalBudget;
  this.structuralStepAllowance = structuralAllowance;
  this.maxNarrationBudget = narrationBudget;
  this.totalStepCount = 0;
  this.narrationBeatsUsed = 0;
  this.structuralStepsUsed = 0;
  this._narrationStepContext = false;
  this.narrationBudgetInitialized = true;
};

CoinChangeBFS.prototype.getNarrationBudgetRemaining = function () {
  if (!this.narrationBudgetInitialized) {
    return 0;
  }
  const totalBudget = Number.isFinite(this.totalStepBudget) ? this.totalStepBudget : 0;
  const structuralAllowance = Number.isFinite(this.structuralStepAllowance)
    ? this.structuralStepAllowance
    : 0;
  const used = Number.isFinite(this.totalStepCount) ? this.totalStepCount : 0;
  const structuralUsed = Number.isFinite(this.structuralStepsUsed)
    ? this.structuralStepsUsed
    : 0;
  const structuralReserve = Math.max(0, structuralAllowance - structuralUsed);
  const available = totalBudget - used - structuralReserve;
  return Math.max(0, Math.floor(available));
};

CoinChangeBFS.prototype.estimateNarrationBeats = function (lines) {
  if (!lines || lines.length === 0) {
    const remaining = this.getNarrationBudgetRemaining();
    return remaining > 0 ? Math.min(1, remaining) : 0;
  }
  let wordCount = 0;
  let sentenceCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const text = String(lines[i] || "").trim();
    if (!text) {
      continue;
    }
    const parts = text.split(/\s+/).filter((token) => token.length > 0);
    wordCount += parts.length;
    const sentences = text.match(/[.!?]/g);
    if (sentences && sentences.length > 0) {
      sentenceCount += sentences.length;
    }
  }
  const remainingBudget = this.getNarrationBudgetRemaining();
  if (wordCount === 0 || remainingBudget <= 0) {
    return Math.max(0, remainingBudget);
  }
  const readingSeconds = Math.ceil(wordCount / 3);
  const structureBonus = Math.max(0, Math.ceil(sentenceCount / 2));
  let estimate = Math.max(2, readingSeconds + structureBonus);
  estimate += Math.max(0, Math.min(2, lines.length - 1));
  estimate = Math.min(9, estimate);

  const narrationBudget = this.maxNarrationBudget || 0;
  const used = this.narrationBeatsUsed || 0;
  if (narrationBudget > 0) {
    const usageRatio = used / narrationBudget;
    if (usageRatio >= 0.8) {
      estimate = Math.min(estimate, Math.max(1, Math.ceil(estimate * 0.5)));
    } else if (usageRatio >= 0.6) {
      estimate = Math.min(estimate, Math.ceil(estimate * 0.7));
    } else if (usageRatio >= 0.4) {
      estimate = Math.min(estimate, Math.ceil(estimate * 0.85));
    }
  }
  if (remainingBudget <= 3) {
    return Math.max(0, Math.min(remainingBudget, estimate));
  }
  return Math.max(1, Math.min(estimate, remainingBudget));
};

CoinChangeBFS.prototype.narrate = function (text, options) {
  const lines = Array.isArray(text)
    ? text.filter((line) => line !== undefined && line !== null).map((line) => String(line))
    : text === undefined || text === null
    ? []
    : [String(text)];
  if (lines.length === 0) {
    return;
  }

  let wait = this.estimateNarrationBeats(lines);
  if (options && options.wait !== undefined && options.wait !== null) {
    const parsed = Math.round(Number(options.wait));
    if (!Number.isNaN(parsed) && parsed >= 0) {
      wait = parsed;
    }
  }
  if (options && options.waitSteps !== undefined && options.waitSteps !== null) {
    const parsed = Math.round(Number(options.waitSteps));
    if (!Number.isNaN(parsed) && parsed >= 0) {
      wait = parsed;
    }
  }

  const budgetRemaining = this.getNarrationBudgetRemaining();
  if (budgetRemaining <= 0) {
    wait = 0;
  } else {
    wait = Math.max(0, Math.min(wait, budgetRemaining));
  }

  const highlightList =
    options && Array.isArray(options.highlight) ? options.highlight : [];
  const emphasized = this.applyNarrationHighlights(lines, highlightList);
  const maxLines = Math.max(
    1,
    this.boardInfo && this.boardInfo.lineCount
      ? this.boardInfo.lineCount
      : this.boardLineIDs && this.boardLineIDs.length > 0
      ? this.boardLineIDs.length
      : emphasized.length
  );
  const charLimit =
    this.boardInfo && this.boardInfo.charLimit ? this.boardInfo.charLimit : 48;
  let wrapped = this.wrapNarrationLines(emphasized, charLimit, maxLines);
  if (!wrapped || wrapped.length === 0) {
    wrapped = [[]];
  }
  this.updateNarrationLines(wrapped);
  const previousContext = this._narrationStepContext;
  this._narrationStepContext = true;
  for (let remaining = wait; remaining >= 0; remaining--) {
    this.renderNarrationTimer(remaining, wait);
    if (remaining > 0) {
      this.cmd("Step");
    }
  }
  this._narrationStepContext = previousContext;
};

CoinChangeBFS.prototype.runCoinChange = function () {
  this.commands = [];
  this.highlightCode(-1);
  this.clearTreeHighlight();
  this.unhighlightCoin();
  this.resetTreeDisplay();
  this.resetQueueDisplay();
  this.resetVisitedDisplay();

  const coins = this.coinValues.slice();
  const amount = this.amount;

  this.cmd("SetText", this.amountValueID, String(amount));
  this.cmd("SetText", this.stepsValueID, "0");
  this.cmd("SetText", this.queueSizeValueID, "0");
  this.cmd("SetText", this.levelSizeValueID, "0");
  this.cmd("SetText", this.currentValueID, "-");
  this.cmd("SetText", this.coinValueID, "-");
  this.cmd("SetText", this.nextValueID, "-");
  this.cmd("SetText", this.resultValueID, "?");

  this.initializeNarrationBudget(coins, amount);

  this.highlightCode(0);
  this.narrate(
    [
      "We solve the problem with a breadth-first search from amount 0 that grows totals one coin deeper each round.",
      "A queue holds the current layer while visited totals stop repeats so every amount is processed once.",
      `When amount ${amount} shows up, that round's depth tells us the minimum number of coins.`,
    ],
    {
      highlight: [
        "breadth-first search",
        "queue",
        "visited",
        `amount ${amount}`,
        "minimum number",
      ],
      wait: 8,
    }
  );

  this.highlightCode(1);
  if (amount === 0) {
    this.narrate(
      ["The target is already zero, so no coins are needed.", "Return 0 immediately."],
      { highlight: ["target", "0"] }
    );
    this.markTreeNodeVisited(0, 0, this.treeFoundColor, null, null);
    this.setVisitedValue(0, true);
    this.highlightVisitedEntry(0, true);

    this.cmd("SetText", this.resultValueID, "0");
    this.cmd("Step");
    this.highlightVisitedEntry(0, false);
    this.highlightCode(-1);
    return this.commands;
  }

  this.highlightCode(2);
  const visited = new Array(amount + 1).fill(false);

  this.highlightCode(3);
  const queue = [];
  this.refreshQueue(queue);
  this.cmd("SetText", this.queueSizeValueID, String(queue.length));

  this.highlightCode(4);
  queue.push(0);
  this.refreshQueue(queue);
  this.cmd("SetText", this.queueSizeValueID, String(queue.length));
  this.cmd("Step");

  this.highlightCode(5);
  visited[0] = true;
  this.highlightVisitedEntry(0, true);
  this.setVisitedValue(0, true);
  this.markTreeNodeVisited(0, 0, this.treeVisitedColor, null, null);

  this.cmd("Step");
  this.highlightVisitedEntry(0, false);

  this.highlightCode(6);
  let steps = 0;
  this.cmd("SetText", this.stepsValueID, String(steps));
  this.cmd("SetText", this.levelSizeValueID, "0");
  this.cmd("SetText", this.currentValueID, "-");
  this.cmd("SetText", this.coinValueID, "-");
  this.cmd("SetText", this.nextValueID, "-");

  while (queue.length > 0) {
    this.highlightCode(7);
    this.highlightCode(8);
    const size = queue.length;
    const nextDepth = steps + 1;
    this.cmd("SetText", this.levelSizeValueID, String(size));
    this.highlightCode(9);
    steps = nextDepth;
    this.cmd("SetText", this.stepsValueID, String(steps));

    this.highlightCode(10);
    for (let i = 0; i < size; i++) {
      this.highlightCode(11);
      const curr = queue[0];
      if (curr === undefined) {
        break;
      }

      this.highlightQueueSlot(0, true);
      this.highlightTreeNode(curr);
      this.cmd("SetText", this.currentValueID, String(curr));
      this.cmd("Step");
      queue.shift();
      this.refreshQueue(queue);
      this.cmd("SetText", this.queueSizeValueID, String(queue.length));
      this.highlightQueueSlot(0, false);
      this.cmd("Step");

      for (let cIndex = 0; cIndex < coins.length; cIndex++) {
        this.highlightCode(12);
        const coin = coins[cIndex];
        const next = curr + coin;
        this.highlightCoin(cIndex);
        this.cmd("SetText", this.coinValueID, String(coin));
        this.highlightCode(13);
        this.cmd("SetText", this.nextValueID, String(next));
        this.cmd("Step");

        if (next === amount) {
          this.highlightCode(14);
          this.ensureTreeNode(next, steps, curr, steps, coin);
          this.updateTreeNodeLabel(next, steps, coin);
          this.setTreeNodeColor(next, this.treeFoundColor);
          this.highlightTreeNode(next);
          visited[amount] = true;
          if (amount < this.visitedSlotIDs.length) {
            this.setVisitedValue(amount, true);
            this.highlightVisitedEntry(amount, true);
          }
          this.cmd("SetText", this.resultValueID, String(steps));
          this.pulseTreeEdge(curr, next);
          if (amount < this.visitedSlotIDs.length) {
            this.highlightVisitedEntry(amount, false);
          }
          this.narrate(
            [
              `Amount ${amount} appears in round ${steps}, so we need ${steps} coin${
                steps === 1 ? "" : "s"
              }.`,
              "Follow the highlighted path to see one optimal combination.",
            ],
            {
              highlight: [
                `amount ${amount}`,
                `round ${steps}`,
                `${steps} coin${steps === 1 ? "" : "s"}`,
                "optimal combination",
              ],
              wait: 6,
            }
          );
          this.unhighlightCoin();
          this.highlightCode(-1);
          return this.commands;
        }

        if (next < amount) {
          this.highlightCode(15);
          this.highlightVisitedEntry(next, true);
          this.cmd("Step");

          if (!visited[next]) {
            this.highlightCode(16);
            visited[next] = true;
            this.setVisitedValue(next, true);
            this.markTreeNodeVisited(next, steps, this.treeVisitedColor, coin, curr);
            this.pulseTreeEdge(curr, next);
            this.highlightVisitedEntry(next, false);

            this.highlightCode(17);
            queue.push(next);
            this.refreshQueue(queue);
            this.cmd("SetText", this.queueSizeValueID, String(queue.length));
            this.cmd("Step");
          } else {
            this.highlightVisitedEntry(next, false);
          }
        }

        this.unhighlightCoin();
      }

      this.cmd("SetText", this.coinValueID, "-");
      this.cmd("SetText", this.nextValueID, "-");
      this.clearTreeHighlight();
      this.cmd("SetText", this.currentValueID, "-");
    }

    this.cmd("SetText", this.levelSizeValueID, "0");
  }

  this.highlightCode(7);
  this.narrate(
    [
      "The queue is empty, so we've tried every amount we can reach.",
      "Because the target never showed up, we return -1.",
    ],
    { highlight: ["queue", "target", "return -1"] }
  );

  this.highlightCode(22);
  this.cmd("SetText", this.resultValueID, "-1");
  this.cmd("Step");

  this.highlightCode(-1);
  return this.commands;
};
CoinChangeBFS.prototype.reset = function () {
  this.nextIndex = 0;
  if (typeof animationManager !== "undefined" && animationManager.animatedObjects) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

CoinChangeBFS.prototype.disableUI = function () {
  for (let i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
  if (this.buildButton) this.buildButton.disabled = true;
  if (this.runButton) this.runButton.disabled = true;
  if (this.pauseButton) this.pauseButton.disabled = false;
  if (this.stepButton) this.stepButton.disabled = false;
};

CoinChangeBFS.prototype.enableUI = function () {
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
  currentAlg = new CoinChangeBFS(animManag, canvas.width, canvas.height);
}
