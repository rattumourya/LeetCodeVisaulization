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
  this.messagePanelID = -1;
  this.messageID = -1;
  this.messagePanelBaseColor = "#f1f4fb";
  this.messagePanelHighlightColor = "#ffe7a3";
  this.messageBorderSegments = null;
  this.messageBorderSequence = null;
  this.messageBorderColor = "#2f80ed";
  this.messageBorderThickness = 0;
  this.messageBorderCorners = null;
  this.messagePanelBaseWidth = 0;
  this.messagePanelBaseHeight = 0;
  this.messagePanelMinWidth = 0;
  this.messagePanelMaxWidth = 0;
  this.messagePanelMinHeight = 0;
  this.messagePanelMaxHeight = 0;
  this.messagePanelCurrentWidth = 0;
  this.messagePanelCurrentHeight = 0;
  this.messagePanelCenterX = 0;
  this.messagePanelCenterY = 0;
  this.messagePanelTopBase = 0;
  this.messagePanelHorizontalMargin = 0;
  this.messageFontSize = 18;

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
  this.statsPanelID = -1;
  this.statsPanelWidth = 0;
  this.statsPanelHeight = 0;
  this.statsPanelLeft = 0;
  this.statsPanelTop = 0;

  this.treeDefaultColor = "#f5f7fb";
  this.treeVisitedColor = "#dff7df";
  this.treeActiveColor = "#ffd27f";
  this.treeFoundColor = "#b4e4ff";
  this.inspectColor = "#ffe7a3";
  this.messagePanelHighlightColor = this.inspectColor;

  this.coinColor = "#f0f7ff";
  this.coinHighlightColor = "#ffef9c";

  this.queueColor = "#edf3ff";
  this.queueHighlightColor = "#ffd27f";

  this.visitedFalseColor = "#f5f7fb";
  this.visitedTrueColor = "#dff7df";

  this.canvasWidth = w || 720;
  this.canvasHeight = h || 1280;

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
  const CODE_LINE_H = 17;
  const CODE_FONT_SIZE = 15;
  const VARIABLE_FONT_STYLE = "bold 17";
  const RESULT_FONT_STYLE = "bold 21";
  const coinHeaderY = TITLE_Y + 52;
  const coinsRowY = coinHeaderY + 44;
  const boardGapAbove = 40;
  const boardGapBelow = 34;
  const messagePanelHeight = Math.max(120, Math.floor(canvasH * 0.12));

  const leftMargin = Math.max(42, Math.floor(canvasW * 0.058));
  const rightMargin = Math.max(38, Math.floor(canvasW * 0.053));
  let columnGap = Math.max(28, Math.floor(canvasW * 0.045));
  const minCodeWidth = 190;
  let codePanelWidth = Math.max(210, Math.floor(canvasW * 0.3));
  let maxCodeWidth = canvasW - leftMargin - rightMargin - columnGap - 300;
  if (maxCodeWidth < minCodeWidth) {
    const reduceGap = Math.min(columnGap - 18, minCodeWidth - maxCodeWidth);
    if (reduceGap > 0) {
      columnGap -= reduceGap;
    }
    maxCodeWidth = canvasW - leftMargin - rightMargin - columnGap - 300;
  }
  if (maxCodeWidth < minCodeWidth) {
    maxCodeWidth = minCodeWidth;
  }
  if (codePanelWidth > maxCodeWidth) {
    codePanelWidth = Math.max(minCodeWidth, maxCodeWidth);
  }

  const codeStartX = leftMargin;
  let codeColumnRight = codeStartX + codePanelWidth;
  let rightColumnLeft = codeColumnRight + columnGap;
  let rightColumnWidth = canvasW - rightMargin - rightColumnLeft;
  if (rightColumnWidth < 300) {
    const deficit = 300 - rightColumnWidth;
    const reducibleCode = Math.max(0, codePanelWidth - minCodeWidth);
    const reduceCode = Math.min(deficit, reducibleCode);
    if (reduceCode > 0) {
      codePanelWidth -= reduceCode;
      codeColumnRight = codeStartX + codePanelWidth;
    }
    rightColumnLeft = codeColumnRight + columnGap;
    rightColumnWidth = canvasW - rightMargin - rightColumnLeft;
    if (rightColumnWidth < 300) {
      const reduceGap = Math.min(columnGap - 16, 300 - rightColumnWidth);
      if (reduceGap > 0) {
        columnGap -= reduceGap;
        rightColumnLeft = codeColumnRight + columnGap;
        rightColumnWidth = canvasW - rightMargin - rightColumnLeft;
      }
    }
  }

  let panelGap = Math.max(24, Math.floor(rightColumnWidth * 0.08));
  let visitedWidth = Math.max(110, Math.floor(rightColumnWidth * 0.26));
  let treeLeft = rightColumnLeft;
  let treeRight = canvasW - rightMargin - visitedWidth;
  let treeWidth = treeRight - treeLeft;
  if (treeWidth < 260) {
    const shortage = 260 - treeWidth;
    const reducibleVisited = Math.max(0, visitedWidth - 95);
    const reduceVisited = Math.min(shortage, reducibleVisited);
    if (reduceVisited > 0) {
      visitedWidth -= reduceVisited;
    }
    treeRight = canvasW - rightMargin - visitedWidth;
    treeWidth = treeRight - treeLeft;
    if (treeWidth < 260) {
      const reducibleGap = Math.max(12, panelGap - 12);
      const reduceGap = Math.min(260 - treeWidth, panelGap - reducibleGap);
      if (reduceGap > 0) {
        panelGap -= reduceGap;
      }
      treeRight = canvasW - rightMargin - visitedWidth;
      treeWidth = treeRight - treeLeft;
      if (treeWidth < 240) {
        const reduceCode = Math.min(240 - treeWidth, Math.max(0, codePanelWidth - minCodeWidth));
        if (reduceCode > 0) {
          codePanelWidth -= reduceCode;
          codeColumnRight = codeStartX + codePanelWidth;
          rightColumnLeft = codeColumnRight + columnGap;
          treeLeft = rightColumnLeft;
          treeRight = canvasW - rightMargin - visitedWidth;
          treeWidth = treeRight - treeLeft;
        }
      }
    }
  }
  if (treeWidth < 220) {
    treeWidth = 220;
    treeRight = treeLeft + treeWidth;
  }
  const boardBottomPadding = boardGapBelow + messagePanelHeight / 2;
  const boardTopPadding = boardGapAbove + messagePanelHeight / 2;

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
  this.cmd("CreateLabel", this.titleID, "coin change BFS", canvasW / 2, TITLE_Y, 1);
  this.cmd("SetTextStyle", this.titleID, "bold 26");
  this.cmd("SetForegroundColor", this.titleID, "#1b1b1b");

  this.coinLabelID = this.nextIndex++;
  this.cmd("CreateLabel", this.coinLabelID, "coins array:", canvasW / 2, coinHeaderY, 1);
  this.cmd("SetTextStyle", this.coinLabelID, "bold 18");

  this.buildCoinsRow(canvasW, coinsRowY);

  const boardCenterY = coinsRowY + boardTopPadding;
  const treeTopY = boardCenterY + boardBottomPadding;
  const totalCodeHeight = (CoinChangeBFS.CODE.length - 1) * CODE_LINE_H;
  const reservedQueue = Math.max(180, Math.floor(canvasH * 0.14));
  const reservedStats = Math.max(220, Math.floor(canvasH * 0.17));
  const bottomMargin = Math.max(60, Math.floor(canvasH * 0.05));
  const baseTreeHeight = Math.floor(canvasH * 0.44);
  let treeHeight = Math.max(
    340,
    Math.min(
      baseTreeHeight,
      canvasH - treeTopY - reservedQueue - reservedStats - bottomMargin
    )
  );
  const overrides = {
    left: treeLeft,
    width: treeWidth,
    visitedWidth: visitedWidth,
    gap: panelGap,
    rightMargin: rightMargin,
  };
  const treeLayout = this.buildTreeDisplay(canvasW, treeTopY, treeHeight, overrides);


  const stageMargin = Math.max(36, Math.floor(canvasW * 0.06));
  const maxBoardWidth = Math.max(320, canvasW - stageMargin * 2);
  const messageCenterX = canvasW / 2;
  const messageY = boardCenterY;
  let messagePanelWidth = this.treeArea ? this.treeArea.width : treeWidth;
  const preferredBoardWidth = Math.max(320, Math.floor(canvasW * 0.48));
  messagePanelWidth = Math.min(maxBoardWidth, Math.max(messagePanelWidth, preferredBoardWidth));
  this.messageFontSize = Math.max(17, Math.min(20, Math.round(canvasW * 0.025)));
  this.messagePanelID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    this.messagePanelID,
    "",
    messagePanelWidth,
    messagePanelHeight,
    messageCenterX,
    messageY
  );
  this.cmd("SetForegroundColor", this.messagePanelID, "#d6def0");
  this.cmd("SetBackgroundColor", this.messagePanelID, this.messagePanelBaseColor);
  this.cmd("SetAlpha", this.messagePanelID, 0);

  this.messageID = this.nextIndex++;
  this.cmd("CreateLabel", this.messageID, this.messageText || "", messageCenterX, messageY, 1);
  this.cmd("SetForegroundColor", this.messageID, "#0b2d53");
  this.cmd("SetTextStyle", this.messageID, String(this.messageFontSize));
  this.cmd("SetAlpha", this.messageID, 0);

  const borderThickness = Math.max(4, Math.round(messagePanelHeight * 0.08));
  this.messageBorderThickness = borderThickness;
  const halfWidth = messagePanelWidth / 2;
  const halfHeight = messagePanelHeight / 2;
  const boardTop = messageY - halfHeight;
  const boardBottom = messageY + halfHeight;
  const boardLeft = messageCenterX - halfWidth;
  const boardRight = messageCenterX + halfWidth;
  const topBorderY = boardTop - borderThickness / 2;
  const bottomBorderY = boardBottom + borderThickness / 2;
  const leftBorderX = boardLeft - borderThickness / 2;
  const rightBorderX = boardRight + borderThickness / 2;
  const segments = {
    top: {
      id: this.nextIndex++,
      orientation: "horizontal",
      baseLength: messagePanelWidth,
      thickness: borderThickness,
      centerX: messageCenterX,
      centerY: topBorderY,
    },
    bottom: {
      id: this.nextIndex++,
      orientation: "horizontal",
      baseLength: messagePanelWidth,
      thickness: borderThickness,
      centerX: messageCenterX,
      centerY: bottomBorderY,
    },
    left: {
      id: this.nextIndex++,
      orientation: "vertical",
      baseLength: messagePanelHeight,
      thickness: borderThickness,
      centerX: leftBorderX,
      centerY: messageY,
    },
    right: {
      id: this.nextIndex++,
      orientation: "vertical",
      baseLength: messagePanelHeight,
      thickness: borderThickness,
      centerX: rightBorderX,
      centerY: messageY,
    },
  };
  segments.bottom.startX = boardLeft;
  segments.bottom.startY = bottomBorderY;
  segments.bottom.endX = boardRight;
  segments.bottom.endY = bottomBorderY;
  segments.right.startX = rightBorderX;
  segments.right.startY = boardBottom;
  segments.right.endX = rightBorderX;
  segments.right.endY = boardTop;
  segments.top.startX = boardRight;
  segments.top.startY = topBorderY;
  segments.top.endX = boardLeft;
  segments.top.endY = topBorderY;
  segments.left.startX = leftBorderX;
  segments.left.startY = boardTop;
  segments.left.endX = leftBorderX;
  segments.left.endY = boardBottom;
  const segmentKeys = Object.keys(segments);
  for (let i = 0; i < segmentKeys.length; i++) {
    const key = segmentKeys[i];
    const segment = segments[key];
    const width = segment.orientation === "horizontal"
      ? segment.baseLength
      : segment.thickness;
    const height = segment.orientation === "horizontal"
      ? segment.thickness
      : segment.baseLength;
    this.cmd(
      "CreateRectangle",
      segment.id,
      "",
      width,
      height,
      segment.centerX,
      segment.centerY
    );
    this.cmd("SetBackgroundColor", segment.id, this.messageBorderColor);
    this.cmd("SetForegroundColor", segment.id, this.messageBorderColor);
    this.cmd("SetAlpha", segment.id, 0);
  }
  const cornerRadius = Math.max(2, Math.round(borderThickness / 2));
  const corners = {
    bottomLeft: {
      id: this.nextIndex++,
      radius: cornerRadius,
      centerX: boardLeft - cornerRadius,
      centerY: boardBottom + cornerRadius,
    },
    bottomRight: {
      id: this.nextIndex++,
      radius: cornerRadius,
      centerX: boardRight + cornerRadius,
      centerY: boardBottom + cornerRadius,
    },
    topRight: {
      id: this.nextIndex++,
      radius: cornerRadius,
      centerX: boardRight + cornerRadius,
      centerY: boardTop - cornerRadius,
    },
    topLeft: {
      id: this.nextIndex++,
      radius: cornerRadius,
      centerX: boardLeft - cornerRadius,
      centerY: boardTop - cornerRadius,
    },
  };
  const cornerKeys = Object.keys(corners);
  for (let i = 0; i < cornerKeys.length; i++) {
    const corner = corners[cornerKeys[i]];
    this.cmd("CreateCircle", corner.id, "", corner.centerX, corner.centerY);
    this.cmd("SetBackgroundColor", corner.id, this.messageBorderColor);
    this.cmd("SetForegroundColor", corner.id, this.messageBorderColor);
    this.cmd("SetWidth", corner.id, corner.radius * 2);
    this.cmd("SetHeight", corner.id, corner.radius * 2);
    this.cmd("SetAlpha", corner.id, 0);
  }
  this.messagePanelBaseWidth = messagePanelWidth;
  this.messagePanelBaseHeight = messagePanelHeight;
  this.messagePanelMinWidth = Math.max(320, Math.min(messagePanelWidth, maxBoardWidth));
  this.messagePanelMaxWidth = maxBoardWidth;
  this.messagePanelMinHeight = messagePanelHeight;
  this.messagePanelMaxHeight = Math.max(messagePanelHeight, Math.floor(canvasH * 0.5));
  this.messagePanelCurrentWidth = messagePanelWidth;
  this.messagePanelCurrentHeight = messagePanelHeight;
  this.messagePanelCenterX = messageCenterX;
  this.messagePanelCenterY = messageY;
  this.messagePanelTopBase = boardTop;
  this.messagePanelHorizontalMargin = stageMargin;
  this.messageBorderSegments = segments;
  this.messageBorderSequence = [
    { key: "bottom", start: "left", startCorner: "bottomLeft", endCorner: "bottomRight" },
    { key: "right", start: "bottom", startCorner: "bottomRight", endCorner: "topRight" },
    { key: "top", start: "right", startCorner: "topRight", endCorner: "topLeft" },
    { key: "left", start: "top", startCorner: "topLeft", endCorner: "bottomLeft" },
  ];
  this.messageBorderCorners = corners;

  const queueGapFromTree = Math.max(44, Math.floor(canvasH * 0.035));
  const queueY = treeLayout.bottomY + queueGapFromTree;
  const queueBounds = {
    left: this.treeArea ? this.treeArea.left : treeLeft,
    right: this.treeArea ? this.treeArea.right : treeRight,
  };
  const queueLayout = this.buildQueueDisplay(
    canvasW,
    queueY,
    null,
    null,
    queueBounds
  );
  const visitedBottom = treeLayout.bottomY;
  this.buildVisitedDisplay(treeTopY, visitedBottom, this.amount);

  const statsRows = 8;
  const statsRowHeight = 34;
  const statsPadding = 16;
  const statsPanelWidth = Math.max(220, Math.min(280, this.visitedPanelWidth + 70));
  let statsPanelTop = queueLayout.bottomY + 48;
  const statsPanelHeight = statsPadding * 2 + statsRows * statsRowHeight;
  if (statsPanelTop + statsPanelHeight > canvasH - 40) {
    statsPanelTop = canvasH - 40 - statsPanelHeight;
  }
  const statsPanelCenterX = this.visitedArea
    ? this.visitedArea.left + this.visitedArea.width - statsPanelWidth / 2
    : canvasW - rightMargin - statsPanelWidth / 2;
  this.statsPanelID = this.nextIndex++;
  this.statsPanelWidth = statsPanelWidth;
  this.statsPanelHeight = statsPanelHeight;
  this.statsPanelLeft = statsPanelCenterX - statsPanelWidth / 2;
  this.statsPanelTop = statsPanelTop;
  this.cmd(
    "CreateRectangle",
    this.statsPanelID,
    "",
    statsPanelWidth,
    statsPanelHeight,
    statsPanelCenterX,
    statsPanelTop + statsPanelHeight / 2
  );
  this.cmd("SetForegroundColor", this.statsPanelID, "#c9d7f1");
  this.cmd("SetBackgroundColor", this.statsPanelID, "#f5f7ff");

  let statsY = statsPanelTop + statsPadding + 4;
  const statsLabelX = this.statsPanelLeft + 18;
  const statsValueX = this.statsPanelLeft + statsPanelWidth - 18;
  const statsSpacing = statsRowHeight;
  const addStatRow = (
    labelProp,
    valueProp,
    labelText,
    defaultValue,
    textStyle,
    options
  ) => {
    const gapBefore = options && options.gapBefore ? Number(options.gapBefore) : 0;
    const gapAfter = options && options.gapAfter ? Number(options.gapAfter) : 0;
    if (gapBefore > 0) {
      statsY += gapBefore;
    }
    const y = statsY;
    const labelID = this.nextIndex++;
    const valueID = this.nextIndex++;
    this.cmd("CreateLabel", labelID, labelText, statsLabelX, y, 0);
    this.cmd("CreateLabel", valueID, defaultValue, statsValueX, y, 0);
    this.cmd("SetTextStyle", labelID, textStyle || VARIABLE_FONT_STYLE);
    this.cmd("SetTextStyle", valueID, textStyle || VARIABLE_FONT_STYLE);
    this[labelProp] = labelID;
    this[valueProp] = valueID;
    statsY += statsSpacing + (gapAfter > 0 ? gapAfter : 0);
  };

  addStatRow("amountLabelID", "amountValueID", "amount:", String(this.amount));
  addStatRow("stepsLabelID", "stepsValueID", "steps:", "0");
  addStatRow("queueSizeLabelID", "queueSizeValueID", "queue size:", "0", null, {
    gapAfter: 6,
  });
  addStatRow("levelSizeLabelID", "levelSizeValueID", "level size:", "0");
  addStatRow("currentLabelID", "currentValueID", "current amount:", "-", null, {
    gapAfter: 6,
  });
  addStatRow("coinValueLabelID", "coinValueID", "coin:", "-");
  addStatRow("nextLabelID", "nextValueID", "next amount:", "-");
  addStatRow(
    "resultLabelID",
    "resultValueID",
    "result:",
    "?",
    RESULT_FONT_STYLE,
    {
      gapBefore: 8,
    }
  );
  const safeBottomLimit = canvasH - bottomMargin - 20;
  const maxCodeStartY = safeBottomLimit - totalCodeHeight;
  const minCodeStart = coinsRowY + 24;
  const queueSpacer = Math.max(88, Math.floor(canvasH * 0.07));
  const desiredStart = queueLayout.bottomY + queueSpacer;
  let codeStartY = Math.max(minCodeStart, desiredStart);
  if (!Number.isFinite(codeStartY)) {
    codeStartY = minCodeStart;
  }
  if (Number.isFinite(maxCodeStartY)) {
    const allowedMax = Math.max(minCodeStart, maxCodeStartY);
    codeStartY = Math.min(codeStartY, allowedMax);
  }
  this.buildCodeDisplay(codeStartX, codeStartY, CODE_LINE_H, CODE_FONT_SIZE);

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

CoinChangeBFS.prototype.buildTreeDisplay = function (canvasW, topY, height, overrides) {
  let marginLeft =
    overrides && overrides.left !== undefined
      ? Number(overrides.left)
      : Math.max(60, Math.floor(canvasW * 0.08));
  let marginRight =
    overrides && overrides.rightMargin !== undefined
      ? Math.max(20, Number(overrides.rightMargin))
      : Math.max(60, Math.floor(canvasW * 0.08));
  let panelGap =
    overrides && overrides.gap !== undefined
      ? Math.max(12, Number(overrides.gap))
      : Math.max(30, Math.floor(canvasW * 0.045));
  let panelWidth =
    overrides && overrides.visitedWidth !== undefined
      ? Math.max(90, Number(overrides.visitedWidth))
      : Math.max(160, Math.floor(canvasW * 0.22));

  let areaWidth;
  if (overrides && overrides.width !== undefined) {
    areaWidth = Math.max(200, Number(overrides.width));
  } else {
    const defaultRight = canvasW - marginRight - panelGap - panelWidth;
    areaWidth = defaultRight - marginLeft;
  }

  if (!overrides || overrides.width === undefined) {
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
      const newRight = canvasW - marginRight - panelGap - panelWidth;
      areaWidth = newRight - marginLeft;
    }

    if (areaWidth < 260) {
      areaWidth = 260;
    }
  }

  if (areaWidth < 220) {
    areaWidth = 220;
  }

  const areaHeight = Math.max(240, height || 260);
  const treeLeft = marginLeft;
  const treeRight = treeLeft + areaWidth;

  this.treeArea = {
    left: treeLeft,
    right: treeRight,
    width: areaWidth,
    top: topY,
    height: areaHeight,
    bottom: topY + areaHeight,
  };

  this.visitedPanelWidth = panelWidth;
  this.visitedPanelGap = panelGap;
  let visitedLeft = treeRight + panelGap;
  let visitedRight = visitedLeft + panelWidth;
  const maxVisitedRight = canvasW - Math.max(24, marginRight);
  if (visitedRight > maxVisitedRight) {
    const shift = visitedRight - maxVisitedRight;
    visitedLeft -= shift;
    visitedRight -= shift;
  }
  const minVisitedLeft = treeRight + Math.max(8, panelGap * 0.25);
  if (visitedLeft < minVisitedLeft) {
    visitedLeft = minVisitedLeft;
    visitedRight = visitedLeft + panelWidth;
  }
  if (visitedRight > canvasW - 8) {
    visitedRight = canvasW - 8;
  }
  if (visitedLeft > visitedRight) {
    visitedLeft = visitedRight - Math.max(90, panelWidth);
  }
  panelWidth = Math.max(80, visitedRight - visitedLeft);

  if (visitedLeft < treeRight + 6) {
    visitedLeft = treeRight + 6;
    visitedRight = visitedLeft + panelWidth;
    if (visitedRight > canvasW - 8) {
      visitedRight = canvasW - 8;
      panelWidth = Math.max(80, visitedRight - visitedLeft);
    }
  }

  this.visitedArea = {
    left: visitedLeft,
    right: visitedRight,
    width: panelWidth,
    top: topY,
    bottom: topY + areaHeight,
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
  this.treeLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.treeLabelID,
    "BFS exploration tree",
    treeCenterX,
    topY - 40,
    1
  );
  this.cmd("SetTextStyle", this.treeLabelID, "bold 18");

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

  this.visitedLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.visitedLabelID,
    "visited array",
    centerX,
    topY - 40,
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

CoinChangeBFS.prototype.buildQueueDisplay = function (
  canvasW,
  queueY,
  baseCellWidth,
  baseGap,
  bounds
) {
  const amount = this.amount;
  const slotCount = Math.max(3, amount + 1);
  const gap = Math.max(6, baseGap || 10);
  const margin = 40;
  let areaLeft = margin;
  let areaRight = canvasW - margin;
  if (bounds) {
    if (bounds.left !== undefined) {
      areaLeft = Number(bounds.left);
    }
    if (bounds.right !== undefined) {
      areaRight = Number(bounds.right);
    }
  }
  if (areaRight - areaLeft < 80) {
    areaLeft = margin;
    areaRight = canvasW - margin;
  }
  let areaWidth = Math.max(80, areaRight - areaLeft);
  let slotWidth = baseCellWidth;
  if (!slotWidth || slotWidth < 28) {
    slotWidth = 40;
  }
  let totalWidth = slotCount * slotWidth + (slotCount - 1) * gap;
  if (totalWidth > areaWidth) {
    slotWidth = Math.max(
      22,
      Math.floor((areaWidth - (slotCount - 1) * gap) / slotCount)
    );
    totalWidth = slotCount * slotWidth + (slotCount - 1) * gap;
  }
  if (totalWidth > areaWidth) {
    areaWidth = totalWidth;
  }
  const startX =
    areaLeft + Math.max(0, (areaWidth - totalWidth) / 2) + slotWidth / 2;
  const slotHeight = Math.max(26, Math.min(60, slotWidth + 6));
  const labelCenterX = areaLeft + areaWidth / 2;

  this.queueLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.queueLabelID,
    "BFS queue",
    labelCenterX,
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
    centerX: labelCenterX,
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

CoinChangeBFS.prototype.showNarrationBorder = function () {
  if (!this.messageBorderSegments) {
    return;
  }
  const segments = this.messageBorderSegments;
  const keys = Object.keys(segments);
  for (let i = 0; i < keys.length; i++) {
    const segment = segments[keys[i]];
    if (!segment) {
      continue;
    }
    if (segment.orientation === "horizontal") {
      this.cmd("SetWidth", segment.id, segment.baseLength);
      this.cmd("SetHeight", segment.id, segment.thickness);
    } else {
      this.cmd("SetHeight", segment.id, segment.baseLength);
      this.cmd("SetWidth", segment.id, segment.thickness);
    }
    this.cmd("SetPosition", segment.id, segment.centerX, segment.centerY);
    this.cmd("SetAlpha", segment.id, 1);
  }

  if (this.messageBorderCorners) {
    const cornerKeys = Object.keys(this.messageBorderCorners);
    for (let i = 0; i < cornerKeys.length; i++) {
      const corner = this.messageBorderCorners[cornerKeys[i]];
      if (!corner) {
        continue;
      }
      const radius = corner.radius || Math.max(2, Math.round(this.messageBorderThickness / 2));
      this.cmd("SetWidth", corner.id, radius * 2);
      this.cmd("SetHeight", corner.id, radius * 2);
      this.cmd("SetPosition", corner.id, corner.centerX, corner.centerY);
      this.cmd("SetAlpha", corner.id, 0);
    }
  }
};

CoinChangeBFS.prototype.setNarrationBorderProgress = function (fraction) {
  if (!this.messageBorderSegments) {
    return;
  }
  const clamped = Math.max(0, Math.min(1, fraction));
  const segments = this.messageBorderSegments;
  const corners = this.messageBorderCorners || null;
  const cornerKeys = corners ? Object.keys(corners) : [];
  for (let c = 0; c < cornerKeys.length; c++) {
    const corner = corners[cornerKeys[c]];
    if (!corner) {
      continue;
    }
    const radius = corner.radius || Math.max(2, Math.round(this.messageBorderThickness / 2));
    this.cmd("SetWidth", corner.id, radius * 2);
    this.cmd("SetHeight", corner.id, radius * 2);
    this.cmd("SetPosition", corner.id, corner.centerX, corner.centerY);
    this.cmd("SetAlpha", corner.id, 0);
  }
  const order =
    Array.isArray(this.messageBorderSequence) && this.messageBorderSequence.length > 0
      ? this.messageBorderSequence
      : [
          { key: "bottom", start: "left" },
          { key: "right", start: "bottom" },
          { key: "top", start: "right" },
          { key: "left", start: "top" },
        ];

  let perimeter = 0;
  for (let i = 0; i < order.length; i++) {
    const entry = order[i];
    const segment = segments && entry ? segments[entry.key] : null;
    if (segment && segment.baseLength) {
      perimeter += segment.baseLength;
    }
  }
  if (perimeter <= 0) {
    return;
  }

  const epsilon = 0.0001;
  let remaining = clamped >= 1 ? perimeter : perimeter * clamped;

  for (let i = 0; i < order.length; i++) {
    const entry = order[i];
    const segment = segments[entry.key];
    if (!segment) {
      continue;
    }
    const segLength = segment.baseLength || 0;
    let take = Math.min(segLength, Math.max(0, remaining));
    if (clamped >= 1 && segLength > 0) {
      take = segLength;
    }
    remaining = Math.max(0, remaining - take);

    if (take > epsilon) {
      if (segment.orientation === "horizontal") {
        const width = take >= segLength - epsilon ? segment.baseLength : take;
        let centerX = segment.centerX;
        const anchorY =
          segment.startY !== undefined ? segment.startY : segment.centerY;
        if (width >= segment.baseLength - epsilon) {
          centerX = segment.centerX;
        } else if (entry.start === "left") {
          const anchorX =
            segment.startX !== undefined
              ? segment.startX
              : segment.centerX - segment.baseLength / 2;
          centerX = anchorX + width / 2;
        } else if (entry.start === "right") {
          const anchorX =
            segment.startX !== undefined
              ? segment.startX
              : segment.centerX + segment.baseLength / 2;
          centerX = anchorX - width / 2;
        }
        this.cmd("SetWidth", segment.id, Math.max(0, width));
        this.cmd("SetHeight", segment.id, segment.thickness);
        this.cmd("SetPosition", segment.id, centerX, anchorY);
      } else {
        const height = take >= segLength - epsilon ? segment.baseLength : take;
        const anchorX =
          segment.startX !== undefined ? segment.startX : segment.centerX;
        let centerY = segment.centerY;
        if (height >= segment.baseLength - epsilon) {
          centerY = segment.centerY;
        } else if (entry.start === "bottom") {
          const startY =
            segment.startY !== undefined
              ? segment.startY
              : segment.centerY + segment.baseLength / 2;
          centerY = startY - height / 2;
        } else if (entry.start === "top") {
          const startY =
            segment.startY !== undefined
              ? segment.startY
              : segment.centerY - segment.baseLength / 2;
          centerY = startY + height / 2;
        }
        this.cmd("SetHeight", segment.id, Math.max(0, height));
        this.cmd("SetWidth", segment.id, segment.thickness);
        this.cmd("SetPosition", segment.id, anchorX, centerY);
      }
      this.cmd("SetAlpha", segment.id, 1);
      if (corners) {
        if (entry.startCorner && corners[entry.startCorner]) {
          this.cmd("SetAlpha", corners[entry.startCorner].id, 1);
        }
        if (take >= segLength - epsilon && entry.endCorner && corners[entry.endCorner]) {
          this.cmd("SetAlpha", corners[entry.endCorner].id, 1);
        }
      }
    } else {
      if (segment.orientation === "horizontal") {
        const anchorX =
          segment.startX !== undefined
            ? segment.startX
            : segment.centerX - segment.baseLength / 2;
        const anchorY =
          segment.startY !== undefined ? segment.startY : segment.centerY;
        this.cmd("SetWidth", segment.id, 0);
        this.cmd("SetHeight", segment.id, segment.thickness);
        this.cmd("SetPosition", segment.id, anchorX, anchorY);
      } else {
        const anchorX =
          segment.startX !== undefined ? segment.startX : segment.centerX;
        const anchorY =
          segment.startY !== undefined
            ? segment.startY
            : segment.centerY + segment.baseLength / 2;
        this.cmd("SetHeight", segment.id, 0);
        this.cmd("SetWidth", segment.id, segment.thickness);
        this.cmd("SetPosition", segment.id, anchorX, anchorY);
      }
      this.cmd("SetAlpha", segment.id, 0);
    }
  }
  if (clamped >= 1 && corners) {
    for (let c = 0; c < cornerKeys.length; c++) {
      const corner = corners[cornerKeys[c]];
      if (corner) {
        this.cmd("SetAlpha", corner.id, 1);
      }
    }
  }
};

CoinChangeBFS.prototype.resetNarrationBorder = function () {
  if (!this.messageBorderSegments) {
    return;
  }
  const segments = this.messageBorderSegments;
  const keys = Object.keys(segments);
  for (let i = 0; i < keys.length; i++) {
    const segment = segments[keys[i]];
    if (!segment) {
      continue;
    }
    if (segment.orientation === "horizontal") {
      this.cmd("SetWidth", segment.id, segment.baseLength);
      this.cmd("SetHeight", segment.id, segment.thickness);
    } else {
      this.cmd("SetHeight", segment.id, segment.baseLength);
      this.cmd("SetWidth", segment.id, segment.thickness);
    }
    this.cmd("SetPosition", segment.id, segment.centerX, segment.centerY);
    this.cmd("SetAlpha", segment.id, 0);
  }
  if (this.messageBorderCorners) {
    const cornerKeys = Object.keys(this.messageBorderCorners);
    for (let i = 0; i < cornerKeys.length; i++) {
      const corner = this.messageBorderCorners[cornerKeys[i]];
      if (!corner) {
        continue;
      }
      const radius = corner.radius || Math.max(2, Math.round(this.messageBorderThickness / 2));
      this.cmd("SetWidth", corner.id, radius * 2);
      this.cmd("SetHeight", corner.id, radius * 2);
      this.cmd("SetPosition", corner.id, corner.centerX, corner.centerY);
      this.cmd("SetAlpha", corner.id, 0);
    }
  }
};

CoinChangeBFS.prototype.estimateNarrationBeats = function (lines) {
  if (!lines || lines.length === 0) {
    return 1;
  }
  let wordCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const parts = String(lines[i] || "")
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 0);
    wordCount += parts.length;
  }
  const base = Math.ceil(wordCount / 4);
  const lineBonus = Math.max(0, lines.length - 1);
  return Math.min(8, Math.max(2, base + lineBonus));
};

CoinChangeBFS.prototype.getNarrationFontSize = function () {
  const parsed = Number(this.messageFontSize);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return 18;
};

CoinChangeBFS.prototype.estimateNarrationCharWidth = function () {
  const fontSize = this.getNarrationFontSize();
  return Math.max(7, Math.round(fontSize * 0.55));
};

CoinChangeBFS.prototype.estimateNarrationLineWidth = function (text) {
  if (text === undefined || text === null) {
    return 0;
  }
  const cleaned = String(text).replace(/[«»]/g, "");
  const approxCharWidth = this.estimateNarrationCharWidth();
  return cleaned.length * approxCharWidth + this.getNarrationFontSize() * 2;
};

CoinChangeBFS.prototype.determineNarrationWidth = function (lines) {
  let target = this.messagePanelMinWidth || 320;
  if (Array.isArray(lines)) {
    for (let i = 0; i < lines.length; i++) {
      const entry = lines[i];
      if (entry === undefined || entry === null) {
        continue;
      }
      target = Math.max(target, this.estimateNarrationLineWidth(entry));
    }
  }
  const maxWidth = this.messagePanelMaxWidth && this.messagePanelMaxWidth > 0
    ? this.messagePanelMaxWidth
    : target;
  const minWidth = this.messagePanelMinWidth && this.messagePanelMinWidth > 0
    ? this.messagePanelMinWidth
    : target;
  if (maxWidth <= minWidth) {
    return Math.max(minWidth, target);
  }
  return Math.min(maxWidth, Math.max(minWidth, Math.round(target)));
};

CoinChangeBFS.prototype.wrapNarrationParagraphs = function (lines, width) {
  const wrapped = [];
  if (!Array.isArray(lines) || lines.length === 0) {
    return wrapped;
  }
  const fontSize = this.getNarrationFontSize();
  const approxCharWidth = this.estimateNarrationCharWidth();
  const usableWidth = Math.max(approxCharWidth * 8, Math.max(0, width - fontSize * 2.4));
  const wrapLimit = Math.max(16, Math.floor(usableWidth / approxCharWidth));
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (rawLine === undefined || rawLine === null) {
      continue;
    }
    let text = String(rawLine).trim();
    if (text.length === 0) {
      wrapped.push("");
    } else {
      while (text.length > wrapLimit) {
        let breakIdx = text.lastIndexOf(" ", wrapLimit);
        if (breakIdx <= 0) {
          breakIdx = wrapLimit;
        }
        const segment = text.substring(0, breakIdx).trim();
        if (segment.length > 0) {
          wrapped.push(segment);
        }
        text = text.substring(breakIdx).trim();
        if (text.length === 0) {
          break;
        }
      }
      if (text.length > 0) {
        wrapped.push(text);
      }
    }
    if (i < lines.length - 1) {
      wrapped.push("");
    }
  }
  while (wrapped.length > 0 && wrapped[wrapped.length - 1] === "") {
    wrapped.pop();
  }
  if (wrapped.length === 0) {
    wrapped.push("");
  }
  return wrapped;
};

CoinChangeBFS.prototype.updateNarrationBorderGeometry = function (
  width,
  height,
  centerX,
  centerY
) {
  if (!this.messageBorderSegments) {
    return;
  }
  const segments = this.messageBorderSegments;
  const thickness = this.messageBorderThickness || 0;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const boardLeft = centerX - halfWidth;
  const boardRight = centerX + halfWidth;
  const boardTop = centerY - halfHeight;
  const boardBottom = centerY + halfHeight;
  const topBorderY = boardTop - thickness / 2;
  const bottomBorderY = boardBottom + thickness / 2;
  const leftBorderX = boardLeft - thickness / 2;
  const rightBorderX = boardRight + thickness / 2;

  if (segments.top) {
    segments.top.baseLength = width;
    segments.top.centerX = centerX;
    segments.top.centerY = topBorderY;
    segments.top.startX = boardRight;
    segments.top.startY = topBorderY;
    segments.top.endX = boardLeft;
    segments.top.endY = topBorderY;
  }
  if (segments.bottom) {
    segments.bottom.baseLength = width;
    segments.bottom.centerX = centerX;
    segments.bottom.centerY = bottomBorderY;
    segments.bottom.startX = boardLeft;
    segments.bottom.startY = bottomBorderY;
    segments.bottom.endX = boardRight;
    segments.bottom.endY = bottomBorderY;
  }
  if (segments.left) {
    segments.left.baseLength = height;
    segments.left.centerX = leftBorderX;
    segments.left.centerY = centerY;
    segments.left.startX = leftBorderX;
    segments.left.startY = boardTop;
    segments.left.endX = leftBorderX;
    segments.left.endY = boardBottom;
  }
  if (segments.right) {
    segments.right.baseLength = height;
    segments.right.centerX = rightBorderX;
    segments.right.centerY = centerY;
    segments.right.startX = rightBorderX;
    segments.right.startY = boardBottom;
    segments.right.endX = rightBorderX;
    segments.right.endY = boardTop;
  }

  if (this.messageBorderCorners) {
    const cornerRadius = this.messageBorderCorners.bottomLeft
      ? this.messageBorderCorners.bottomLeft.radius
      : Math.max(2, Math.round(thickness / 2));
    if (this.messageBorderCorners.bottomLeft) {
      this.messageBorderCorners.bottomLeft.centerX = boardLeft - cornerRadius;
      this.messageBorderCorners.bottomLeft.centerY = boardBottom + cornerRadius;
      this.messageBorderCorners.bottomLeft.radius = cornerRadius;
    }
    if (this.messageBorderCorners.bottomRight) {
      this.messageBorderCorners.bottomRight.centerX = boardRight + cornerRadius;
      this.messageBorderCorners.bottomRight.centerY = boardBottom + cornerRadius;
      this.messageBorderCorners.bottomRight.radius = cornerRadius;
    }
    if (this.messageBorderCorners.topRight) {
      this.messageBorderCorners.topRight.centerX = boardRight + cornerRadius;
      this.messageBorderCorners.topRight.centerY = boardTop - cornerRadius;
      this.messageBorderCorners.topRight.radius = cornerRadius;
    }
    if (this.messageBorderCorners.topLeft) {
      this.messageBorderCorners.topLeft.centerX = boardLeft - cornerRadius;
      this.messageBorderCorners.topLeft.centerY = boardTop - cornerRadius;
      this.messageBorderCorners.topLeft.radius = cornerRadius;
    }
  }
};

CoinChangeBFS.prototype.resizeNarrationBoardForContent = function (width, lineCount) {
  if (this.messagePanelID < 0) {
    return;
  }
  const minWidth = this.messagePanelMinWidth || 320;
  const maxWidth = this.messagePanelMaxWidth && this.messagePanelMaxWidth > minWidth
    ? this.messagePanelMaxWidth
    : minWidth;
  let targetWidth = Math.max(minWidth, Math.min(maxWidth, Math.round(width)));
  if (!Number.isFinite(targetWidth) || targetWidth <= 0) {
    targetWidth = minWidth;
  }

  const fontSize = this.getNarrationFontSize();
  const lineSpacing = Math.max(22, Math.round(fontSize * 1.35));
  const padding = Math.max(28, Math.round(fontSize * 1.4));
  const lines = Math.max(1, Number.isFinite(lineCount) ? Math.round(lineCount) : 1);
  const textHeight = lineSpacing * (lines - 1) + fontSize * 1.6;
  const minHeight = this.messagePanelMinHeight && this.messagePanelMinHeight > 0
    ? this.messagePanelMinHeight
    : 120;
  const maxHeight = this.messagePanelMaxHeight && this.messagePanelMaxHeight > minHeight
    ? this.messagePanelMaxHeight
    : Math.max(minHeight, Math.floor((this.canvasHeight || 720) * 0.5));
  let targetHeight = Math.max(minHeight, Math.round(textHeight + padding));
  if (targetHeight > maxHeight) {
    targetHeight = maxHeight;
  }

  const margin = this.messagePanelHorizontalMargin || 32;
  const canvasWidth = this.canvasWidth || 720;
  let centerX = this.messagePanelCenterX || canvasWidth / 2;
  const minCenter = margin + targetWidth / 2;
  const maxCenter = canvasWidth - margin - targetWidth / 2;
  if (minCenter <= maxCenter) {
    centerX = Math.min(Math.max(centerX, minCenter), maxCenter);
  } else {
    centerX = canvasWidth / 2;
  }
  const hasBaseTop = this.messagePanelTopBase !== undefined && this.messagePanelTopBase !== null;
  const fallbackCenter = this.messagePanelCenterY || fontSize * 4;
  const baseTop = hasBaseTop ? this.messagePanelTopBase : fallbackCenter - targetHeight / 2;
  const centerY = baseTop + targetHeight / 2;

  this.messagePanelCurrentWidth = targetWidth;
  this.messagePanelCurrentHeight = targetHeight;
  this.messagePanelCenterX = centerX;
  this.messagePanelCenterY = centerY;
  this.messagePanelTopBase = baseTop;

  this.cmd("SetWidth", this.messagePanelID, targetWidth);
  this.cmd("SetHeight", this.messagePanelID, targetHeight);
  this.cmd("SetPosition", this.messagePanelID, centerX, centerY);
  if (this.messageID >= 0) {
    this.cmd("SetPosition", this.messageID, centerX, centerY);
  }

  this.updateNarrationBorderGeometry(targetWidth, targetHeight, centerX, centerY);
  this.resetNarrationBorder();
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

  const highlight = [];
  if (options && Array.isArray(options.highlight)) {
    for (let i = 0; i < options.highlight.length; i++) {
      const entry = options.highlight[i];
      if (entry === undefined || entry === null) {
        continue;
      }
      highlight.push(String(entry));
    }
  }

  let wait = this.estimateNarrationBeats(lines);
  if (options && options.wait !== undefined && options.wait !== null) {
    const parsed = Math.round(Number(options.wait));
    if (!Number.isNaN(parsed) && parsed > 0) {
      wait = parsed;
    }
  }
  if (options && options.waitSteps !== undefined && options.waitSteps !== null) {
    const parsed = Math.round(Number(options.waitSteps));
    if (!Number.isNaN(parsed) && parsed > 0) {
      wait = parsed;
    }
  }

  const fallbackSeconds = Math.max(1, wait);
  const fallbackMs = Math.max(3000, Math.round(fallbackSeconds * 1500));
  const payload = {
    lines,
    highlights: highlight,
    total: 0,
    fallbackMs,
  };
  let encoded = "";
  try {
    encoded = encodeURIComponent(JSON.stringify(payload));
  } catch (err) {
    encoded = encodeURIComponent(
      JSON.stringify({ lines, highlights: highlight, total: 0, fallbackMs })
    );
  }

  const escapeRegExp = (value) =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, (match) => `\\${match}`);
  const highlightTerms = highlight
    .slice()
    .filter((term) => term !== undefined && term !== null)
    .map((term) => String(term).trim())
    .filter((term) => term.length > 0)
    .sort((a, b) => b.length - a.length);
  const decorated = [];
  for (let i = 0; i < lines.length; i++) {
    let formatted = String(lines[i]);
    for (let j = 0; j < highlightTerms.length; j++) {
      const target = highlightTerms[j];
      const pattern = new RegExp(escapeRegExp(target), "gi");
      formatted = formatted.replace(pattern, (match) => `«${match}»`);
    }
    decorated.push(formatted.trim());
  }
  let targetWidth = this.determineNarrationWidth(decorated);
  targetWidth = Math.max(
    this.messagePanelMinWidth || 320,
    Math.min(this.messagePanelMaxWidth || targetWidth, targetWidth)
  );
  let wrappedLines = this.wrapNarrationParagraphs(decorated, targetWidth);
  const measuredWidth = this.determineNarrationWidth(wrappedLines);
  if (measuredWidth > targetWidth) {
    targetWidth = Math.max(
      this.messagePanelMinWidth || 320,
      Math.min(this.messagePanelMaxWidth || measuredWidth, measuredWidth)
    );
    wrappedLines = this.wrapNarrationParagraphs(decorated, targetWidth);
  }
  const captionText = wrappedLines
    .map((entry) => entry.replace(/«/g, "⟦").replace(/»/g, "⟧"))
    .join("\n");

  this.resizeNarrationBoardForContent(targetWidth, wrappedLines.length);

  if (this.messagePanelID >= 0) {
    const panelColor = highlightTerms.length > 0 ? this.messagePanelHighlightColor : this.messagePanelBaseColor;
    this.cmd("SetBackgroundColor", this.messagePanelID, panelColor);
    this.cmd("SetAlpha", this.messagePanelID, 1);
  }
  if (this.messageID >= 0) {
    this.cmd("SetText", this.messageID, captionText);
    this.cmd("SetAlpha", this.messageID, 1);
  }

  this.showNarrationBorder();
  this.setNarrationBorderProgress(1);
  this.cmd("SpeakNarration", encoded);
  const progressSteps = Math.max(24, Math.round(fallbackMs / 120));
  for (let i = 0; i < progressSteps; i++) {
    const fraction =
      progressSteps <= 1 ? 0 : Math.max(0, (progressSteps - i - 0.5) / progressSteps);
    this.setNarrationBorderProgress(fraction);
    this.cmd("Step");
  }
  this.cmd("WaitForNarrationSpeech", fallbackMs);
  this.setNarrationBorderProgress(0);

  if (this.messagePanelID >= 0) {
    this.cmd("SetBackgroundColor", this.messagePanelID, this.messagePanelBaseColor);
    this.cmd("SetAlpha", this.messagePanelID, 0);
  }
  if (this.messageID >= 0) {
    this.cmd("SetText", this.messageID, "");
    this.cmd("SetAlpha", this.messageID, 0);
  }
  this.resetNarrationBorder();
};

CoinChangeBFS.prototype.describeCoinOutcome = function (
  curr,
  coin,
  next,
  amount,
  alreadyVisited,
  steps
) {
  const highlight = [];
  const lines = [];
  if (next === amount) {
    lines.push(`Coin ${coin} jumps from ${curr} straight to the goal ${amount}.`);
    lines.push(
      `Since it lands during wave ${steps}, ${steps} coin${steps === 1 ? "" : "s"} is the minimum we can report.`
    );
    highlight.push(`coin ${coin}`, `goal ${amount}`, `wave ${steps}`, "minimum");
  } else if (next < amount && !alreadyVisited) {
    lines.push(`Coin ${coin} grows ${curr} into a fresh amount ${next}.`);
    lines.push(
      `We mark ${next} visited and queue it for the next wave so the search meets it in order.`
    );
    highlight.push(`coin ${coin}`, `${next}`, "visited", "queue");
  } else if (next < amount) {
    lines.push(
      `Coin ${coin} would reach ${next} again, but we've already marked that amount as visited.`
    );
    lines.push(`We skip repeats so the queue keeps its focus on new totals.`);
    highlight.push(`coin ${coin}`, `${next}`, "visited", "queue");
  } else {
    lines.push(`Coin ${coin} would overshoot to ${next}, beyond the goal ${amount}.`);
    lines.push(`We ignore that branch and keep testing the next coin.`);
    highlight.push(`coin ${coin}`, `${next}`, `goal ${amount}`, "overshoot");
  }
  return { lines, highlight };
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

  this.highlightCode(0);
  this.narrate(
    [
      `We'll solve amount ${amount} by growing totals one coin at a time with breadth-first search.`,
      "The first time the target shows up tells us we've used the fewest coins possible.",
    ],
    { highlight: ["breadth-first search", `amount ${amount}`, "fewest coins"] }
  );

  this.highlightCode(1);
  if (amount === 0) {
    this.narrate(
      ["If the goal is zero, we already have our answer: zero coins.", "We can return 0 right away."],
      { highlight: ["goal is zero", "return 0"] }
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

  this.narrate(
    [
      "Because the goal is positive, we'll keep expanding levels with BFS until the queue empties or the target appears.",
    ],
    { highlight: ["BFS", "queue", "target"], mode: "caption" }
  );

  this.highlightCode(2);
  this.narrate(
    [
      `I'll keep a visited checklist for every amount from 0 to ${amount} so we never branch from the same total twice.`,
    ],
    { highlight: ["visited checklist", `0 to ${amount}`, "same total twice"], mode: "caption" }
  );
  const visited = new Array(amount + 1).fill(false);

  this.highlightCode(3);
  this.narrate(
    [
      "A queue will hold the frontier so we handle the amounts level by level, like a waiting line.",
    ],
    { highlight: ["queue", "level by level", "waiting line"], mode: "caption" }
  );
  const queue = [];
  this.refreshQueue(queue);
  this.cmd("SetText", this.queueSizeValueID, String(queue.length));

  this.highlightCode(4);
  this.narrate(
    [
      "We enqueue amount 0 because that's the total we already know how to make.",
    ],
    { highlight: ["enqueue", "amount 0", "already know"], mode: "caption" }
  );
  queue.push(0);
  this.refreshQueue(queue);
  this.cmd("SetText", this.queueSizeValueID, String(queue.length));
  this.cmd("Step");

  this.highlightCode(5);
  this.narrate(
    [
      "Mark amount 0 as visited so we don't circle back to it later.",
    ],
    { highlight: ["amount 0", "visited", "don't circle back"], mode: "caption" }
  );
  visited[0] = true;
  this.highlightVisitedEntry(0, true);
  this.setVisitedValue(0, true);
  this.markTreeNodeVisited(0, 0, this.treeVisitedColor, null, null);
  this.cmd("Step");
  this.highlightVisitedEntry(0, false);

  this.highlightCode(6);
  this.narrate(
    [
      "Set the step counter to zero to remember how many coins each wave has used so far.",
    ],
    { highlight: ["step counter", "zero", "how many coins"], mode: "caption" }
  );
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
    this.narrate(
      [
        `Wave ${nextDepth} gathers ${size} amount${size === 1 ? "" : "s"} that are ready to test one more coin.`,
        "We'll pull each amount from the queue, try every coin, and stash brand-new totals for the next wave so the layers stay in order.",
      ],
      {
        highlight: [`Wave ${nextDepth}`, `${size} amount${size === 1 ? "" : "s"}`, "queue", "layers stay in order"],
        mode: nextDepth === 1 ? "board" : "caption",
      }
    );
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

      this.narrate(
        [
          `Let's work on amount ${curr}. Taking it out of the queue lets us branch from it right now.`,
          `Any path we grow from ${curr} will show totals made with ${steps} coin${steps === 1 ? "" : "s"} so far.`,
        ],
        { highlight: [`amount ${curr}`, "queue", `${steps} coin${steps === 1 ? "" : "s"}`], mode: "caption" }
      );
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
        const alreadyVisited = next <= amount ? visited[next] : false;
        const narration = this.describeCoinOutcome(curr, coin, next, amount, alreadyVisited, steps);
        this.narrate(narration.lines, { highlight: narration.highlight, mode: "caption" });
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
      "The queue is empty, which means BFS has tried every amount we can reach.",
      "Because the target never showed up, we return -1 to signal it's impossible with these coins.",
    ],
    { highlight: ["queue", "return -1", "impossible"] }
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
