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
  "        ",
  "        q.offer(0);",
  "        visited[0] = true;",
  "        int steps = 0;",
  "",
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
  this.treeHighlightAmount = null;
  this.treeDepthDenominator = 1;
  this.treeNodeRadius = 28;
  this.treeNodeLabelOffset = 44;

  this.queueSlotIDs = [];
  this.queueValues = [];
  this.queueLabelID = -1;
  this.queueHighlightIndex = -1;

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

  const TITLE_Y = 60;
  const CODE_START_X = 80;
  const CODE_LINE_H = 16;
  const INFO_SPACING = 34;
  const coinHeaderY = TITLE_Y + 60;
  const coinsRowY = coinHeaderY + 50;
  const infoStartY = coinsRowY + 70;
  const infoBottomY = infoStartY + 2 * INFO_SPACING;

  this.commands = [];
  this.codeIDs = [];
  this.queueSlotIDs = [];
  this.queueValues = [];
  this.queueHighlightIndex = -1;
  this.coinIDs = [];
  this.coinPositions = [];

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

  this.stepsLabelID = this.nextIndex++;
  this.stepsValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.stepsLabelID, "steps:", infoX + 220, infoStartY, 0);
  this.cmd("CreateLabel", this.stepsValueID, "0", infoX + 320, infoStartY, 0);

  this.queueSizeLabelID = this.nextIndex++;
  this.queueSizeValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.queueSizeLabelID, "queue size:", infoX + 420, infoStartY, 0);
  this.cmd("CreateLabel", this.queueSizeValueID, "0", infoX + 540, infoStartY, 0);

  const secondRowY = infoStartY + INFO_SPACING;
  this.levelSizeLabelID = this.nextIndex++;
  this.levelSizeValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.levelSizeLabelID, "level size:", infoX, secondRowY, 0);
  this.cmd("CreateLabel", this.levelSizeValueID, "0", infoX + 120, secondRowY, 0);

  this.currentLabelID = this.nextIndex++;
  this.currentValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.currentLabelID, "current amount:", infoX + 220, secondRowY, 0);
  this.cmd("CreateLabel", this.currentValueID, "-", infoX + 380, secondRowY, 0);

  this.coinValueLabelID = this.nextIndex++;
  this.coinValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.coinValueLabelID, "coin:", infoX + 420, secondRowY, 0);
  this.cmd("CreateLabel", this.coinValueID, "-", infoX + 520, secondRowY, 0);

  const thirdRowY = infoStartY + 2 * INFO_SPACING;
  this.nextLabelID = this.nextIndex++;
  this.nextValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.nextLabelID, "next amount:", infoX, thirdRowY, 0);
  this.cmd("CreateLabel", this.nextValueID, "-", infoX + 160, thirdRowY, 0);

  this.resultLabelID = this.nextIndex++;
  this.resultValueID = this.nextIndex++;
  this.cmd("CreateLabel", this.resultLabelID, "result:", infoX + 220, thirdRowY, 0);
  this.cmd("CreateLabel", this.resultValueID, "?", infoX + 320, thirdRowY, 0);
  this.cmd("SetTextStyle", this.resultLabelID, "bold 18");
  this.cmd("SetTextStyle", this.resultValueID, "bold 18");

  const messageY = thirdRowY + 60;
  this.messageID = this.nextIndex++;
  this.cmd("CreateLabel", this.messageID, this.messageText || "", canvasW / 2, messageY, 1);
  this.cmd("SetForegroundColor", this.messageID, "#003366");
  this.cmd("SetTextStyle", this.messageID, "bold 18");

  const treeTopY = messageY + 80;
  const totalCodeHeight = (CoinChangeBFS.CODE.length - 1) * CODE_LINE_H;
  const maxCodeStartY = canvasH - totalCodeHeight - 40;
  const maxQueueBottom = maxCodeStartY - 60;
  const queueGapFromTree = 50;
  const estimatedQueueHalf = 30;
  const baseTreeHeight = Math.floor(canvasH * 0.36);
  const maxTreeHeight = Math.max(
    220,
    maxQueueBottom - treeTopY - queueGapFromTree - estimatedQueueHalf
  );
  const treeHeight = Math.max(220, Math.min(baseTreeHeight, maxTreeHeight));
  const treeLayout = this.buildTreeDisplay(canvasW, treeTopY, treeHeight);

  const queueY = treeLayout.bottomY + queueGapFromTree;
  const queueLayout = this.buildQueueDisplay(canvasW, queueY, null, null);

  const codeStartPreferred = queueLayout.bottomY + 60;
  const codeStartY = Math.min(Math.max(codeStartPreferred, thirdRowY + 120), maxCodeStartY);
  this.buildCodeDisplay(CODE_START_X, codeStartY, CODE_LINE_H);

  this.resetTreeDisplay();
  this.resetQueueDisplay();
  this.cmd("SetText", this.amountValueID, String(this.amount));

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

CoinChangeBFS.prototype.buildCodeDisplay = function (startX, startY, lineHeight) {
  for (let i = 0; i < CoinChangeBFS.CODE.length; i++) {
    const id = this.nextIndex++;
    this.codeIDs.push(id);
    this.cmd("CreateLabel", id, CoinChangeBFS.CODE[i], startX, startY + i * lineHeight, 0);
    this.cmd("SetForegroundColor", id, "#000000");
    this.cmd("SetTextStyle", id, "12");
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
  const margin = Math.max(60, Math.floor(canvasW * 0.12));
  const areaHeight = Math.max(160, height || 260);
  const areaWidth = Math.max(260, canvasW - 2 * margin);

  this.treeArea = {
    left: margin,
    right: canvasW - margin,
    width: areaWidth,
    top: topY,
    height: areaHeight,
    bottom: topY + areaHeight,
  };

  this.treeDepthDenominator = Math.max(1, this.amount || 1);
  const dynamicRadius = Math.floor(this.treeArea.width / Math.max(6, this.amount + 2)) + 6;
  this.treeNodeRadius = Math.max(22, Math.min(32, dynamicRadius));
  this.treeNodeLabelOffset = this.treeNodeRadius + 24;

  this.treeLabelID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.treeLabelID,
    "BFS exploration tree",
    canvasW / 2,
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
  this.cmd("CreateLabel", this.queueLabelID, "BFS queue", canvasW / 2, queueY - slotHeight / 2 - 30, 1);
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
  const ratio = Math.min(level / this.treeDepthDenominator, 1);
  return this.treeArea.top + ratio * this.treeArea.height;
};

CoinChangeBFS.prototype.updateTreeLevelPositions = function (level) {
  const levelNodes = this.treeLevels[level] || [];
  const positions = [];
  if (!this.treeArea || levelNodes.length === 0) {
    return positions;
  }
  const width = this.treeArea.width;
  const left = this.treeArea.left;
  const total = levelNodes.length;
  const y = this.getTreeLevelY(level);

  for (let i = 0; i < total; i++) {
    let x;
    if (total === 1) {
      x = left + width / 2;
    } else {
      x = left + ((i + 1) * width) / (total + 1);
    }
    positions.push({ x, y });
    const amount = levelNodes[i];
    const node = this.treeNodes[amount];
    if (node) {
      this.cmd("Move", node.id, x, y);
      if (node.labelID >= 0) {
        this.cmd("Move", node.labelID, x, y + this.treeNodeLabelOffset);
      }
      node.x = x;
      node.y = y;
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
    this.cmd("Delete", node.id);
  }

  this.treeLevels = [];
  this.treeNodes = {};
  this.treeHighlightAmount = null;

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
  };
};

CoinChangeBFS.prototype.formatTreeNodeLabel = function (step, coin) {
  if (step === null || step === undefined) {
    return "";
  }
  if (coin === null || coin === undefined) {
    return `d=${step}`;
  }
  return `d=${step} (+${coin})`;
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
  if (this.treeNodes[amount]) {
    this.updateTreeNodeLabel(amount, step, coin);
    const node = this.treeNodes[amount];
    if (level !== undefined && level !== null) {
      node.level = level;
    }
    if (parentAmount !== undefined && parentAmount !== null) {
      node.parent = parentAmount;
    }
    return node;
  }

  if (!this.treeLevels[level]) {
    this.treeLevels[level] = [];
  }
  this.treeLevels[level].push(amount);
  this.treeLevels[level].sort((a, b) => a - b);
  const positions = this.updateTreeLevelPositions(level);
  const index = this.treeLevels[level].indexOf(amount);
  const pos = positions[index] || {
    x: this.treeArea.left + this.treeArea.width / 2,
    y: this.getTreeLevelY(level),
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
    level,
    x: pos.x,
    y: pos.y,
    step: step === undefined ? null : step,
    coin: coin === undefined ? null : coin,
    parent: parentAmount === undefined ? null : parentAmount,
    color: this.treeDefaultColor,
  };
  this.treeNodes[amount] = nodeInfo;

  if (
    parentAmount !== undefined &&
    parentAmount !== null &&
    this.treeNodes[parentAmount]
  ) {
    this.cmd("Connect", this.treeNodes[parentAmount].id, nodeID);
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
    this.markTreeNodeVisited(0, 0, this.treeFoundColor, null, null);
    this.cmd("SetText", this.messageID, "Amount is zero so answer is zero.");
    this.cmd("SetText", this.resultValueID, "0");
    this.cmd("Step");
    this.highlightCode(-1);
    return this.commands;
  }
  this.cmd("SetText", this.messageID, "Amount is not zero, continue BFS.");
  this.cmd("Step");

  this.highlightCode(2);
  this.cmd("SetText", this.messageID, "Create visited array of size amount + 1.");
  this.cmd("Step");

  this.highlightCode(3);
  this.cmd("SetText", this.messageID, "Initialize BFS queue.");
  this.cmd("Step");

  this.highlightCode(5);
  const queue = [0];
  this.refreshQueue(queue);
  this.cmd("SetText", this.queueSizeValueID, String(queue.length));
  this.cmd("SetText", this.messageID, "Enqueue starting amount 0.");
  this.cmd("Step");

  const visited = new Array(amount + 1).fill(false);

  this.highlightCode(6);
  visited[0] = true;
  this.markTreeNodeVisited(0, 0, this.treeVisitedColor, null, null);
  this.cmd("SetText", this.messageID, "Mark amount 0 as visited in the tree.");
  this.cmd("Step");

  this.highlightCode(7);
  let steps = 0;
  this.cmd("SetText", this.stepsValueID, String(steps));
  this.cmd("SetText", this.messageID, "Initialize step counter to 0.");
  this.cmd("Step");

  while (queue.length > 0) {
    this.highlightCode(9);
    this.cmd("SetText", this.messageID, "Queue not empty, process next BFS level.");
    this.cmd("Step");

    this.highlightCode(10);
    const size = queue.length;
    this.cmd("SetText", this.levelSizeValueID, String(size));
    this.cmd(
      "SetText",
      this.messageID,
      `Current level has ${size} amount${size === 1 ? "" : "s"}.`
    );
    this.cmd("Step");

    this.highlightCode(11);
    steps += 1;
    this.cmd("SetText", this.stepsValueID, String(steps));
    this.cmd("SetText", this.messageID, `Increase steps to ${steps}.`);
    this.cmd("Step");

    this.highlightCode(12);
    this.cmd("SetText", this.messageID, "Process each amount in this level.");
    this.cmd("Step");

    for (let i = 0; i < size; i++) {
      this.highlightCode(13);
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
        this.highlightCode(14);
        this.highlightCoin(cIndex);
        this.cmd("SetText", this.coinValueID, String(coin));
        this.cmd("SetText", this.messageID, `Try coin ${coin}.`);
        this.cmd("Step");

        this.highlightCode(15);
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
          this.highlightCode(16);
          this.ensureTreeNode(next, steps, curr, steps, coin);
          this.updateTreeNodeLabel(next, steps, coin);
          this.setTreeNodeColor(next, this.treeFoundColor);
          this.highlightTreeNode(next);
          this.cmd(
            "SetText",
            this.messageID,
            `Reached target ${amount} in ${steps} step${steps === 1 ? "" : "s"}.`
          );
          this.cmd("SetText", this.resultValueID, String(steps));
          this.cmd("Step");
          this.unhighlightCoin();
          this.highlightCode(-1);
          return this.commands;
        }

        this.highlightCode(17);
        if (next < amount && !visited[next]) {
          this.cmd(
            "SetText",
            this.messageID,
            `Amount ${next} not visited and less than ${amount}.`
          );
          this.cmd("Step");

          this.highlightCode(18);
          visited[next] = true;
          this.markTreeNodeVisited(next, steps, this.treeVisitedColor, coin, curr);
          this.cmd(
            "SetText",
            this.messageID,
            `Add amount ${next} to the tree at step ${steps}.`
          );
          this.cmd("Step");

          this.highlightCode(19);
          queue.push(next);
          this.refreshQueue(queue);
          this.cmd("SetText", this.queueSizeValueID, String(queue.length));
          this.cmd("SetText", this.messageID, `Enqueue ${next} for next level.`);
          this.cmd("Step");
        } else {
          let reason;
          if (next > amount) {
            reason = `Amount ${next} exceeds target ${amount}.`;
          } else if (next === amount) {
            reason = `Amount ${amount} already handled.`;
          } else {
            reason = `Amount ${next} already visited.`;
          }
          this.cmd("SetText", this.messageID, reason);
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

  this.highlightCode(9);
  this.cmd("SetText", this.messageID, "Queue empty, exit loop.");
  this.cmd("Step");

  this.highlightCode(24);
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
