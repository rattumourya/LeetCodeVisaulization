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
  this.messageID = -1;

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
  const CODE_FONT_SIZE = 15;
  const VARIABLE_FONT_STYLE = "bold 17";
  const RESULT_FONT_STYLE = "bold 21";
  const INFO_SPACING = 30;
  const coinHeaderY = TITLE_Y + 48;
  const coinsRowY = coinHeaderY + 44;
  const infoStartY = coinsRowY + 56;
  const infoBottomY = infoStartY + 2 * INFO_SPACING;

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

  const infoX = CODE_START_X;

  this.amountLabelID = this.nextIndex++;
  this.amountValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.amountLabelID, "amount:", infoX, infoStartY, 0);
  this.cmd("CreateLabel", this.amountValueID, String(this.amount), infoX + 120, infoStartY, 0);
  this.cmd("SetTextStyle", this.amountLabelID, VARIABLE_FONT_STYLE);
  this.cmd("SetTextStyle", this.amountValueID, VARIABLE_FONT_STYLE);

  this.stepsLabelID = this.nextIndex++;
  this.stepsValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.stepsLabelID, "steps:", infoX + 220, infoStartY, 0);
  this.cmd("CreateLabel", this.stepsValueID, "0", infoX + 320, infoStartY, 0);
  this.cmd("SetTextStyle", this.stepsLabelID, VARIABLE_FONT_STYLE);
  this.cmd("SetTextStyle", this.stepsValueID, VARIABLE_FONT_STYLE);

  this.queueSizeLabelID = this.nextIndex++;
  this.queueSizeValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.queueSizeLabelID, "queue size:", infoX + 420, infoStartY, 0);
  this.cmd("CreateLabel", this.queueSizeValueID, "0", infoX + 540, infoStartY, 0);
  this.cmd("SetTextStyle", this.queueSizeLabelID, VARIABLE_FONT_STYLE);
  this.cmd("SetTextStyle", this.queueSizeValueID, VARIABLE_FONT_STYLE);

  const secondRowY = infoStartY + INFO_SPACING;
  this.levelSizeLabelID = this.nextIndex++;
  this.levelSizeValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.levelSizeLabelID, "level size:", infoX, secondRowY, 0);
  this.cmd("CreateLabel", this.levelSizeValueID, "0", infoX + 120, secondRowY, 0);
  this.cmd("SetTextStyle", this.levelSizeLabelID, VARIABLE_FONT_STYLE);
  this.cmd("SetTextStyle", this.levelSizeValueID, VARIABLE_FONT_STYLE);

  this.currentLabelID = this.nextIndex++;
  this.currentValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.currentLabelID, "current amount:", infoX + 220, secondRowY, 0);
  this.cmd("CreateLabel", this.currentValueID, "-", infoX + 380, secondRowY, 0);
  this.cmd("SetTextStyle", this.currentLabelID, VARIABLE_FONT_STYLE);
  this.cmd("SetTextStyle", this.currentValueID, VARIABLE_FONT_STYLE);

  this.coinValueLabelID = this.nextIndex++;
  this.coinValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.coinValueLabelID, "coin:", infoX + 420, secondRowY, 0);
  this.cmd("CreateLabel", this.coinValueID, "-", infoX + 520, secondRowY, 0);
  this.cmd("SetTextStyle", this.coinValueLabelID, VARIABLE_FONT_STYLE);
  this.cmd("SetTextStyle", this.coinValueID, VARIABLE_FONT_STYLE);

  const thirdRowY = infoStartY + 2 * INFO_SPACING;
  this.nextLabelID = this.nextIndex++;
  this.nextValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.nextLabelID, "next amount:", infoX, thirdRowY, 0);
  this.cmd("CreateLabel", this.nextValueID, "-", infoX + 160, thirdRowY, 0);
  this.cmd("SetTextStyle", this.nextLabelID, VARIABLE_FONT_STYLE);
  this.cmd("SetTextStyle", this.nextValueID, VARIABLE_FONT_STYLE);

  this.resultLabelID = this.nextIndex++;
  this.resultValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.resultLabelID, "result:", infoX + 220, thirdRowY, 0);
  this.cmd("CreateLabel", this.resultValueID, "?", infoX + 320, thirdRowY, 0);
  this.cmd("SetTextStyle", this.resultLabelID, RESULT_FONT_STYLE);
  this.cmd("SetTextStyle", this.resultValueID, RESULT_FONT_STYLE);

  const messageY = thirdRowY + 48;
  this.messageID = this.nextIndex++;
  this.cmd("CreateLabel", this.messageID, this.messageText || "", canvasW / 2, messageY, 1);
  this.cmd("SetForegroundColor", this.messageID, "#003366");
  this.cmd("SetTextStyle", this.messageID, "bold 18");

  const treeTopY = messageY + 60;
  const totalCodeHeight = (CoinChangeBFS.CODE.length - 1) * CODE_LINE_H;
  const maxCodeStartY = canvasH - totalCodeHeight - 32;
  const maxQueueBottom = maxCodeStartY - 40;
  const queueGapFromTree = Math.max(32, Math.floor(canvasH * 0.025));
  const estimatedQueueHalf = Math.max(24, Math.floor(canvasH * 0.018));
  const baseTreeHeight = Math.floor(canvasH * 0.42);
  const maxTreeHeight = Math.max(
    220,
    maxQueueBottom - treeTopY - queueGapFromTree - estimatedQueueHalf
  );
  const treeHeight = Math.max(260, Math.min(baseTreeHeight, maxTreeHeight));
  const treeLayout = this.buildTreeDisplay(canvasW, treeTopY, treeHeight);

  const queueY = treeLayout.bottomY + queueGapFromTree;
  const queueLayout = this.buildQueueDisplay(canvasW, queueY, null, null);
  const queueTop = queueY - queueLayout.slotHeight / 2;
  const visitedBottom = Math.max(
    treeLayout.bottomY,
    queueTop - Math.max(16, Math.floor(queueLayout.slotHeight * 0.4))
  );
  this.buildVisitedDisplay(treeTopY, visitedBottom, this.amount);

  const codeStartPreferred = queueLayout.bottomY + 64;
  const codeStartY = Math.min(Math.max(codeStartPreferred, thirdRowY + 120), maxCodeStartY);
  this.buildCodeDisplay(CODE_START_X, codeStartY, CODE_LINE_H, CODE_FONT_SIZE);

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

  this.treeArea = {
    left: marginLeft,
    right: marginLeft + areaWidth,
    width: areaWidth,
    top: topY,
    height: areaHeight,
    bottom: topY + areaHeight,
  };

  this.visitedPanelWidth = panelWidth;
  this.visitedPanelGap = panelGap;
  const visitedLeft = this.treeArea.right + panelGap;
  const visitedRight = Math.min(
    canvasW - marginRight,
    visitedLeft + this.visitedPanelWidth
  );
  this.visitedArea = {
    left: visitedLeft,
    right: visitedRight,
    width: visitedRight - visitedLeft,
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
  const minSpacing = Math.max(56, this.treeNodeRadius * 2.2);
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
  const levelAmounts = this.treeLevels[level] || [];
  const positions = [];
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
  const fallbackBoundary = {
    start: baseLeft,
    end: baseRight,
    center: clamp((baseLeft + baseRight) / 2),
  };

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

  const parentBoundaries = new Map();
  const siblingSpacing = Math.max(this.treeNodeRadius * 2.8, 72);
  const minGroupWidth = Math.max(
    this.treeNodeRadius * 4.8,
    siblingSpacing * 1.75,
    120
  );

  for (let i = 0; i < parentAmounts.length; i++) {
    const center = parentCenters[i];
    const prevCenter = i > 0 ? parentCenters[i - 1] : baseLeft - minGroupWidth;
    const nextCenter =
      i < parentCenters.length - 1
        ? parentCenters[i + 1]
        : baseRight + minGroupWidth;

    let start = i === 0 ? baseLeft : (prevCenter + center) / 2;
    let end = i === parentCenters.length - 1 ? baseRight : (center + nextCenter) / 2;

    if (end - start < minGroupWidth) {
      start = center - minGroupWidth / 2;
      end = center + minGroupWidth / 2;
    }

    start = clamp(start);
    end = clamp(end);
    if (end <= start) {
      start = clamp(center - minGroupWidth / 2);
      end = clamp(center + minGroupWidth / 2);
    }

    parentBoundaries.set(parentAmounts[i], {
      start,
      end,
      center,
    });
  }

  const groups = new Map();
  for (const amount of levelAmounts) {
    const parent = this.getNodeParent(amount);
    if (!groups.has(parent)) {
      groups.set(parent, []);
    }
    groups.get(parent).push(amount);
  }

  const assignedPositions = new Map();
  const minSpacing = siblingSpacing;

  for (const [parent, children] of groups.entries()) {
    const boundary = parentBoundaries.get(parent) || fallbackBoundary;
    const center = clamp(boundary.center);
    let start = boundary.start;
    let end = boundary.end;

    if (end - start < minSpacing) {
      const span = Math.max(minSpacing * (children.length - 1), minGroupWidth);
      start = center - span / 2;
      end = center + span / 2;
    }

    start = clamp(start);
    end = clamp(end);

    if (children.length === 1) {
      assignedPositions.set(children[0], { x: center, y });
    } else if (end - start < minSpacing) {
      for (let i = 0; i < children.length; i++) {
        const offset = (i - (children.length - 1) / 2) * minSpacing;
        assignedPositions.set(children[i], {
          x: clamp(center + offset),
          y,
        });
      }
    } else {
      for (let i = 0; i < children.length; i++) {
        const ratio = (i + 1) / (children.length + 1);
        const x = start + ratio * (end - start);
        assignedPositions.set(children[i], { x: clamp(x), y });
      }
    }
  }

  for (let i = 0; i < levelAmounts.length; i++) {
    const amount = levelAmounts[i];
    let pos = assignedPositions.get(amount);
    if (!pos) {
      const fallbackX =
        baseLeft +
        ((i + 1) * (baseRight - baseLeft)) /
          Math.max(levelAmounts.length + 1, 2);
      pos = { x: clamp(fallbackX), y };
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
  return { x: midX, y: midY };
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
  this.cmd("SetText", this.messageID, `Use BFS to solve coin change for amount ${amount}.`);
  this.cmd("Step");

  this.highlightCode(1);
  if (amount === 0) {
    this.setVisitedValue(0, true);
    this.markTreeNodeVisited(0, 0, this.treeFoundColor, null, null);
    this.highlightVisitedEntry(0, true);
    this.cmd("SetText", this.messageID, "Amount is zero so answer is zero.");
    this.cmd("SetText", this.resultValueID, "0");
    this.cmd("Step");
    this.highlightVisitedEntry(0, false);
    this.highlightCode(-1);
    return this.commands;
  }
  this.cmd("SetText", this.messageID, "Amount is not zero, continue BFS.");
  this.cmd("Step");

  this.highlightCode(2);
  this.cmd(
    "SetText",
    this.messageID,
    "Create visited array of size amount + 1 (all entries start at 0)."
  );
  this.cmd("Step");

  this.highlightCode(3);
  this.cmd("SetText", this.messageID, "Initialize BFS queue.");
  this.cmd("Step");

  this.highlightCode(4);
  const queue = [0];
  this.refreshQueue(queue);
  this.cmd("SetText", this.queueSizeValueID, String(queue.length));
  this.cmd("SetText", this.messageID, "Enqueue starting amount 0.");
  this.cmd("Step");

  const visited = new Array(amount + 1).fill(false);

  this.highlightCode(5);
  visited[0] = true;
  this.highlightVisitedEntry(0, true);
  this.setVisitedValue(0, true);
  this.markTreeNodeVisited(0, 0, this.treeVisitedColor, null, null);
  this.cmd(
    "SetText",
    this.messageID,
    "Set visited[0] = 1 for the starting amount."
  );
  this.cmd("Step");
  this.highlightVisitedEntry(0, false);

  this.highlightCode(6);
  let steps = 0;
  this.cmd("SetText", this.stepsValueID, String(steps));
  this.cmd("SetText", this.messageID, "Initialize step counter to 0.");
  this.cmd("Step");

  while (queue.length > 0) {
    this.highlightCode(7);
    this.cmd("SetText", this.messageID, "Queue not empty, process next BFS level.");
    this.cmd("Step");

    this.highlightCode(8);
    const size = queue.length;
    this.cmd("SetText", this.levelSizeValueID, String(size));
    this.cmd(
      "SetText",
      this.messageID,
      `Current level has ${size} amount${size === 1 ? "" : "s"}.`
    );
    this.cmd("Step");

    this.highlightCode(9);
    steps += 1;
    this.cmd("SetText", this.stepsValueID, String(steps));
    this.cmd("SetText", this.messageID, `Increase steps to ${steps}.`);
    this.cmd("Step");

    this.highlightCode(10);
    this.cmd("SetText", this.messageID, "Process each amount in this level.");
    this.cmd("Step");

    for (let i = 0; i < size; i++) {
      this.highlightCode(11);
      const curr = queue[0];
      if (curr === undefined) {
        break;
      }
      this.highlightQueueSlot(0, true);
      this.cmd("SetText", this.currentValueID, String(curr));
      this.cmd("SetText", this.messageID, `Dequeue amount ${curr}.`);
      this.cmd("Step");
      queue.shift();
      this.refreshQueue(queue);
      this.cmd("SetText", this.queueSizeValueID, String(queue.length));
      this.highlightQueueSlot(0, false);

      this.highlightTreeNode(curr);
      this.cmd("Step");

      for (let cIndex = 0; cIndex < coins.length; cIndex++) {
        const coin = coins[cIndex];
        this.highlightCode(12);
        this.highlightCoin(cIndex);
        this.cmd("SetText", this.coinValueID, String(coin));
        this.cmd("SetText", this.messageID, `Try coin ${coin}.`);
        this.cmd("Step");

        this.highlightCode(13);
        const next = curr + coin;
        this.cmd("SetText", this.nextValueID, String(next));
        let previewNode = null;
        let previewColor = null;
        if (next <= amount && this.treeNodes[next]) {
          previewNode = this.treeNodes[next];
          previewColor = previewNode.color || this.treeDefaultColor;
          this.cmd("SetBackgroundColor", previewNode.id, this.inspectColor);
        }
        this.cmd(
          "SetText",
          this.messageID,
          `Compute next amount = ${curr} + ${coin} = ${next}.`
        );
        this.cmd("Step");
        if (previewNode) {
          this.cmd("SetBackgroundColor", previewNode.id, previewColor);
        }

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
          this.cmd(
            "SetText",
            this.messageID,
            `Reached target ${amount} in ${steps} step${steps === 1 ? "" : "s"}.`
          );
          this.cmd("SetText", this.resultValueID, String(steps));
          this.pulseTreeEdge(curr, next);
          if (amount < this.visitedSlotIDs.length) {
            this.highlightVisitedEntry(amount, false);
          }
          this.unhighlightCoin();
          this.highlightCode(-1);
          return this.commands;
        }

        this.highlightCode(15);
        if (next < amount) {
          this.highlightVisitedEntry(next, true);
          this.cmd(
            "SetText",
            this.messageID,
            `Check visited[${next}] = ${visited[next] ? "1" : "0"} before enqueueing.`
          );
          this.cmd("Step");

          if (!visited[next]) {
            this.highlightCode(16);
            visited[next] = true;
            this.setVisitedValue(next, true);
            this.markTreeNodeVisited(
              next,
              steps,
              this.treeVisitedColor,
              coin,
              curr
            );
            this.cmd(
              "SetText",
              this.messageID,
              `Add amount ${next} from ${curr} at depth ${steps}.`
            );
            this.pulseTreeEdge(curr, next);
            this.highlightVisitedEntry(next, false);

            this.highlightCode(17);
            queue.push(next);
            this.refreshQueue(queue);
            this.cmd("SetText", this.queueSizeValueID, String(queue.length));
            this.cmd("SetText", this.messageID, `Enqueue ${next} for next level.`);
            this.cmd("Step");
          } else {
            this.cmd(
              "SetText",
              this.messageID,
              `Skip amount ${next} because visited[${next}] = 1.`
            );
            this.cmd("Step");
            this.highlightVisitedEntry(next, false);
          }
        } else {
          this.cmd(
            "SetText",
            this.messageID,
            `Amount ${next} exceeds target ${amount}.`
          );
          this.cmd("Step");
        }

        this.unhighlightCoin();
      }

      this.cmd("SetText", this.coinValueID, "-");
      this.cmd("SetText", this.nextValueID, "-");
      this.clearTreeHighlight();
      this.cmd("SetText", this.messageID, `Finished exploring amount ${curr}.`);
      this.cmd("Step");
      this.cmd("SetText", this.currentValueID, "-");
    }

    this.cmd("SetText", this.levelSizeValueID, "0");
    this.cmd("SetText", this.messageID, "Level completed.");
    this.cmd("Step");
  }

  this.highlightCode(7);
  this.cmd("SetText", this.messageID, "Queue empty, exit loop.");
  this.cmd("Step");

  this.highlightCode(22);
  this.cmd("SetText", this.resultValueID, "-1");
  this.cmd("SetText", this.messageID, "Return -1 because amount is unreachable.");
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
