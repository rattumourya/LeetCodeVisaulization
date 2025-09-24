function CoinChangeTopDown(am, w, h) {
  this.init(am, w, h);
}

CoinChangeTopDown.prototype = new Algorithm();
CoinChangeTopDown.prototype.constructor = CoinChangeTopDown;
CoinChangeTopDown.superclass = Algorithm.prototype;

CoinChangeTopDown.MAX_AMOUNT = 15;
CoinChangeTopDown.MAX_COINS = 7;

CoinChangeTopDown.prototype.init = function (am, w, h) {
  CoinChangeTopDown.superclass.init.call(this, am, w, h);

  this.coinValues = [1, 2, 5];
  this.amount = 11;

  this.canvasWidth = w || 720;
  this.canvasHeight = h || 1280;

  this.treeNodes = {};
  this.memoCells = [];
  this.edgeLabels = {};
  this.coinIDs = [];

  this.treeDefaultColor = "#f5f7ff";
  this.treeActiveColor = "#ffe6a7";
  this.treeMemoColor = "#d6e4ff";
  this.treeFailColor = "#ffc7c7";
  this.treeSuccessColor = "#cdefc8";
  this.treeEdgeColor = "#3d5a80";
  this.treeEdgeActiveColor = "#f4a261";

  this.memoDefaultColor = "#ffffff";
  this.memoHighlightColor = "#ffe7aa";
  this.memoFillColor = "#d5f5d5";
  this.memoFailFillColor = "#ffcfcf";

  this.addControls();
  this.reset();
};

CoinChangeTopDown.prototype.addControls = function () {
  this.controls = [];

  addLabelToAlgorithmBar("Coins (comma separated):");
  this.coinsField = addControlToAlgorithmBar("Text", "1,2,5");
  this.controls.push(this.coinsField);

  addLabelToAlgorithmBar("Amount:");
  this.amountField = addControlToAlgorithmBar("Text", "11");
  this.controls.push(this.amountField);

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
};

CoinChangeTopDown.prototype.setInputCallback = function () {
  let raw = this.coinsField.value || "";
  const parsed = raw
    .split(/[^0-9]+/)
    .map((item) => parseInt(item, 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  const unique = Array.from(new Set(parsed)).slice(0, CoinChangeTopDown.MAX_COINS);
  if (unique.length === 0) {
    unique.push(1, 2, 5);
  }
  unique.sort((a, b) => a - b);
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
  if (
    typeof animationManager !== "undefined" &&
    animationManager.animatedObjects
  ) {
    animationManager.animatedObjects.clearAllObjects();
  }
  this.setup();
};

CoinChangeTopDown.prototype.setup = function () {
  const canvasElem = document.getElementById("canvas");
  if (canvasElem) {
    this.canvasWidth = canvasElem.width;
    this.canvasHeight = canvasElem.height;
  }

  this.commands = [];
  this.treeNodes = {};
  this.memoCells = [];
  this.edgeLabels = {};
  this.coinIDs = [];
  this.callCounter = 0;

  const canvasW = this.canvasWidth || 720;
  const canvasH = this.canvasHeight || 1280;

  const titleY = 40;
  this.titleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.titleID,
    "Coin Change Top-Down (Memoized DFS)",
    canvasW / 2,
    titleY,
    1
  );
  this.cmd("SetTextStyle", this.titleID, "bold 24");

  const coinRowY = titleY + 50;
  this.drawCoinRow(canvasW, coinRowY);

  const messageY = coinRowY + 50;
  this.messageID = this.nextIndex++;
  this.cmd("CreateLabel", this.messageID, "", canvasW / 2, messageY, 1);
  this.cmd("SetTextStyle", this.messageID, "16");

  const marginX = 40;
  const memoHeight = Math.max(220, Math.floor(canvasH * 0.18));
  const bottomMargin = 30;
  const treeTop = messageY + 40;
  const treeHeight = canvasH - treeTop - memoHeight - bottomMargin;

  this.treeArea = {
    left: marginX,
    right: canvasW - marginX,
    top: treeTop,
    height: treeHeight,
  };
  this.treeNodeWidth = 150;
  this.treeNodeHeight = 64;
  this.treeHorizontalMargin = Math.max(40, this.treeNodeWidth / 2 + 15);

  const approxDepth = Math.max(
    4,
    Math.min(this.amount + this.coinValues.length + 1, 10)
  );
  const spacingCandidate = treeHeight / Math.max(approxDepth, 1);
  this.treeLevelSpacing = Math.min(140, Math.max(90, spacingCandidate));

  this.memoArea = {
    left: marginX,
    right: canvasW - marginX,
    top: treeTop + treeHeight + 20,
    bottom: canvasH - bottomMargin,
  };

  this.drawMemoTable();
  this.resetMemoTable();

  this.setMessage(
    "Press \"Run Top-Down Memo\" to watch the recursion build." 
  );

  animationManager.StartNewAnimation(this.commands);
  animationManager.skipForward();
  animationManager.clearHistory();
};

CoinChangeTopDown.prototype.drawCoinRow = function (canvasW, rowY) {
  const coins = this.coinValues && this.coinValues.length > 0
    ? this.coinValues
    : [1, 2, 5];
  const labelID = this.nextIndex++;
  this.cmd("CreateLabel", labelID, "coins:", canvasW / 2, rowY - 26, 1);
  this.cmd("SetTextStyle", labelID, "bold 18");

  const maxWidth = Math.max(260, canvasW - 160);
  const baseWidth = 54;
  const baseHeight = 32;
  const gap = 16;
  let coinWidth = baseWidth;
  let coinHeight = baseHeight;
  let totalWidth = coins.length * coinWidth + (coins.length - 1) * gap;

  if (totalWidth > maxWidth) {
    const shrink = maxWidth / totalWidth;
    coinWidth = Math.max(40, Math.floor(coinWidth * shrink));
    coinHeight = Math.max(26, Math.floor(coinHeight * shrink));
    totalWidth = coins.length * coinWidth + (coins.length - 1) * gap;
  }

  const startX = Math.round(canvasW / 2 - totalWidth / 2 + coinWidth / 2);
  this.coinIDs = [];
  for (let i = 0; i < coins.length; i++) {
    const x = startX + i * (coinWidth + gap);
    const rectID = this.nextIndex++;
    this.cmd(
      "CreateRectangle",
      rectID,
      String(coins[i]),
      coinWidth,
      coinHeight,
      x,
      rowY
    );
    this.cmd("SetBackgroundColor", rectID, "#e2ecff");
    this.cmd("SetForegroundColor", rectID, "#1a355d");
    this.cmd("SetTextStyle", rectID, "bold 16");
    this.coinIDs.push(rectID);
  }
};

CoinChangeTopDown.prototype.drawMemoTable = function () {
  const area = this.memoArea;
  const width = Math.max(200, area.right - area.left);
  const height = Math.max(160, area.bottom - area.top);
  const coins = this.coinValues;
  const rowCount = Math.max(1, coins.length);
  const colCount = Math.max(1, this.amount + 1);

  const headerHeight = 32;
  const labelWidth = Math.max(90, Math.floor(width * 0.18));
  const cellWidth = Math.max(44, Math.floor((width - labelWidth) / colCount));
  const cellHeight = Math.max(
    34,
    Math.floor((height - headerHeight) / Math.max(rowCount, 1))
  );

  this.memoTitleID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.memoTitleID,
    "Memo[index][remain]",
    area.left + labelWidth / 2,
    area.top - 16,
    1
  );
  this.cmd("SetTextStyle", this.memoTitleID, "bold 16");

  this.memoColLabelIDs = [];
  for (let col = 0; col < colCount; col++) {
    const id = this.nextIndex++;
    const x = area.left + labelWidth + col * cellWidth + cellWidth / 2;
    const y = area.top + headerHeight / 2;
    this.cmd("CreateLabel", id, String(col), x, y, 1);
    this.cmd("SetTextStyle", id, "bold 14");
    this.memoColLabelIDs.push(id);
  }

  this.memoRowLabelIDs = [];
  this.memoCells = [];
  for (let row = 0; row < rowCount; row++) {
    const displayCoin = coins[row];
    const rowLabel =
      displayCoin !== undefined
        ? `i=${row} (coin ${displayCoin})`
        : `i=${row}`;
    const labelID = this.nextIndex++;
    const centerY = area.top + headerHeight + row * cellHeight + cellHeight / 2;
    this.cmd("CreateLabel", labelID, rowLabel, area.left + labelWidth / 2, centerY, 1);
    this.cmd("SetTextStyle", labelID, "bold 14");
    this.memoRowLabelIDs.push(labelID);

    this.memoCells[row] = [];
    for (let col = 0; col < colCount; col++) {
      const cellX = area.left + labelWidth + col * cellWidth + cellWidth / 2;
      const rectID = this.nextIndex++;
      this.cmd(
        "CreateRectangle",
        rectID,
        "",
        cellWidth - 6,
        cellHeight - 6,
        cellX,
        centerY
      );
      this.cmd("SetBackgroundColor", rectID, this.memoDefaultColor);
      this.cmd("SetForegroundColor", rectID, "#1d3557");

      const textID = this.nextIndex++;
      this.cmd("CreateLabel", textID, "?", cellX, centerY, 1);
      this.cmd("SetTextStyle", textID, "13");

      this.memoCells[row][col] = {
        rectID,
        textID,
        value: null,
        baseColor: this.memoDefaultColor,
      };
    }
  }
};

CoinChangeTopDown.prototype.resetMemoTable = function () {
  if (!this.memoCells) {
    return;
  }
  for (let i = 0; i < this.memoCells.length; i++) {
    const row = this.memoCells[i];
    if (!row) {
      continue;
    }
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      if (!cell) {
        continue;
      }
      cell.value = null;
      cell.baseColor = this.memoDefaultColor;
      this.cmd("SetText", cell.textID, "?");
      this.cmd("SetBackgroundColor", cell.rectID, this.memoDefaultColor);
    }
  }
};

CoinChangeTopDown.prototype.setMessage = function (text) {
  if (this.messageID === undefined || this.messageID < 0) {
    return;
  }
  const safe = text || "";
  this.cmd("SetText", this.messageID, safe);
};

CoinChangeTopDown.prototype.formatValue = function (value) {
  if (value === null || value === undefined) {
    return "?";
  }
  if (!Number.isFinite(value) || value >= this.infinity) {
    return "∞";
  }
  return String(value);
};

CoinChangeTopDown.prototype.computeChildSlot = function (parentSlot, level, side) {
  const delta = 1 / Math.pow(2, level + 1);
  const dir = side === "right" ? 1 : -1;
  let next = parentSlot + dir * delta;
  const min = 0.05;
  const max = 0.95;
  if (next < min) {
    next = min;
  }
  if (next > max) {
    next = max;
  }
  return next;
};

CoinChangeTopDown.prototype.getTreePosition = function (level, slot) {
  const area = this.treeArea;
  const margin = this.treeHorizontalMargin;
  const width = Math.max(120, area.right - area.left);
  const usable = Math.max(this.treeNodeWidth, width - margin * 2);
  const normalized = Math.max(0, Math.min(1, slot));
  const x = area.left + margin + normalized * usable;
  const rawY = area.top + level * this.treeLevelSpacing;
  const maxY = area.top + area.height - this.treeNodeHeight / 2;
  const y = Math.min(maxY, rawY);
  return { x, y };
};

CoinChangeTopDown.prototype.computeEdgeMidpoint = function (parentNode, childNode) {
  const x = (parentNode.x + childNode.x) / 2;
  const y = (parentNode.y + childNode.y) / 2 - this.treeNodeHeight / 4;
  return { x, y };
};

CoinChangeTopDown.prototype.createTreeNode = function (meta) {
  const position = this.getTreePosition(meta.level || 0, meta.slot || 0.5);
  const rectID = this.nextIndex++;
  this.cmd(
    "CreateRectangle",
    rectID,
    "",
    this.treeNodeWidth,
    this.treeNodeHeight,
    position.x,
    position.y
  );
  this.cmd("SetBackgroundColor", rectID, this.treeDefaultColor);
  this.cmd("SetForegroundColor", rectID, "#102542");

  const labelID = this.nextIndex++;
  this.cmd("CreateLabel", labelID, "", position.x, position.y, 1);
  this.cmd("SetTextStyle", labelID, "14");
  this.cmd("SetForegroundColor", labelID, "#14274e");

  const node = {
    key: meta.key,
    id: rectID,
    labelID,
    level: meta.level || 0,
    slot: meta.slot || 0.5,
    x: position.x,
    y: position.y,
    index: meta.index,
    remain: meta.remain,
    parentKey: meta.parentKey || null,
    branchLabel: meta.branchLabel || "",
    branchSide: meta.branchSide || "left",
    edgeLabelID: -1,
    best: this.infinity,
    result: null,
    status: "pending",
    lastDecision: "",
  };

  this.treeNodes[node.key] = node;

  if (node.parentKey) {
    const parentNode = this.treeNodes[node.parentKey];
    if (parentNode) {
      this.cmd("Connect", parentNode.id, node.id);
      this.cmd("SetEdgeColor", parentNode.id, node.id, this.treeEdgeColor);
      if (node.branchLabel) {
        const labelID = this.nextIndex++;
        const mid = this.computeEdgeMidpoint(parentNode, node);
        this.cmd("CreateLabel", labelID, node.branchLabel, mid.x, mid.y, 1);
        this.cmd("SetTextStyle", labelID, "12");
        this.cmd("SetForegroundColor", labelID, "#2f3b59");
        node.edgeLabelID = labelID;
      }
    }
  }

  this.updateTreeNodeText(node.key);
  return node;
};

CoinChangeTopDown.prototype.updateTreeNodeText = function (key) {
  const node = this.treeNodes[key];
  if (!node) {
    return;
  }
  const header = `dfs(${node.index}, ${node.remain})`;
  let second = "";
  if (node.status === "memo") {
    second = `memo = ${this.formatValue(node.result)}`;
  } else if (node.status === "base" || node.status === "done") {
    second = `return ${this.formatValue(node.result)}`;
  } else {
    second = `best = ${this.formatValue(node.best)}`;
  }
  const third = node.lastDecision ? node.lastDecision : "";
  const pieces = [header];
  if (second) {
    pieces.push(second);
  }
  if (third) {
    pieces.push(third);
  }
  this.cmd("SetText", node.labelID, pieces.join("\n"));
};

CoinChangeTopDown.prototype.setNodeStatus = function (key, status, extra) {
  const node = this.treeNodes[key];
  if (!node) {
    return;
  }
  node.status = status;
  if (extra) {
    if (extra.best !== undefined) {
      node.best = extra.best;
    }
    if (extra.result !== undefined) {
      node.result = extra.result;
    }
    if (extra.lastDecision !== undefined) {
      node.lastDecision = extra.lastDecision;
    }
  }

  let color = this.treeDefaultColor;
  if (status === "active") {
    color = this.treeActiveColor;
  } else if (status === "memo") {
    color = this.treeMemoColor;
  } else if (status === "base" || status === "done") {
    if (node.result !== null && node.result < this.infinity) {
      color = this.treeSuccessColor;
    } else {
      color = this.treeFailColor;
    }
  }
  this.cmd("SetBackgroundColor", node.id, color);
  this.updateTreeNodeText(key);
};

CoinChangeTopDown.prototype.highlightEdge = function (parentNode, childNode) {
  if (!parentNode || !childNode) {
    return;
  }
  this.cmd("SetEdgeColor", parentNode.id, childNode.id, this.treeEdgeActiveColor);
  this.cmd("Step");
  this.cmd("SetEdgeColor", parentNode.id, childNode.id, this.treeEdgeColor);
};

CoinChangeTopDown.prototype.highlightMemoCell = function (row, col, flag) {
  if (!this.memoCells[row] || !this.memoCells[row][col]) {
    return;
  }
  const cell = this.memoCells[row][col];
  if (flag) {
    this.cmd("SetBackgroundColor", cell.rectID, this.memoHighlightColor);
  } else {
    this.cmd("SetBackgroundColor", cell.rectID, cell.baseColor);
  }
};

CoinChangeTopDown.prototype.updateMemoCell = function (row, col, value, options) {
  if (!this.memoCells[row] || !this.memoCells[row][col]) {
    return;
  }
  const cell = this.memoCells[row][col];
  const display = this.formatValue(value);
  this.cmd("SetText", cell.textID, display);
  let background = cell.baseColor;
  if (options && options.background) {
    background = options.background;
  } else if (!Number.isFinite(value) || value >= this.infinity) {
    background = this.memoFailFillColor;
  } else {
    background = this.memoFillColor;
  }
  cell.baseColor = background;
  cell.value = value;
  this.cmd("SetBackgroundColor", cell.rectID, background);
};

CoinChangeTopDown.prototype.clearTree = function () {
  if (!this.treeNodes) {
    this.treeNodes = {};
    return;
  }
  const keys = Object.keys(this.treeNodes);
  for (let i = 0; i < keys.length; i++) {
    const node = this.treeNodes[keys[i]];
    if (!node) {
      continue;
    }
    if (node.edgeLabelID !== undefined && node.edgeLabelID >= 0) {
      this.cmd("Delete", node.edgeLabelID);
    }
    if (node.labelID !== undefined && node.labelID >= 0) {
      this.cmd("Delete", node.labelID);
    }
    if (node.id !== undefined && node.id >= 0) {
      this.cmd("Delete", node.id);
    }
  }
  this.treeNodes = {};
};

CoinChangeTopDown.prototype.allocateCallKey = function () {
  if (!Number.isFinite(this.callCounter)) {
    this.callCounter = 0;
  }
  const key = `call_${this.callCounter++}`;
  return key;
};

CoinChangeTopDown.prototype.runCoinChange = function () {
  this.commands = [];
  this.clearTree();
  this.resetMemoTable();

  const coins = this.coinValues.slice();
  const amount = this.amount;
  if (coins.length === 0) {
    this.setMessage("No coins provided.");
    this.cmd("Step");
    return this.commands;
  }

  const maxAmount = Math.max(0, amount);
  const memo = Array.from({ length: coins.length }, () =>
    new Array(maxAmount + 1).fill(null)
  );
  this.infinity = amount + 1;
  this.callCounter = 0;

  this.setMessage(
    `Start dfs(0, ${amount}) with ${coins.length} coin` +
      (coins.length === 1 ? "" : "s") +
      "."
  );
  this.cmd("Step");

  const context = {
    coins,
    amount,
    memo,
  };

  const result = this.runDFS(0, amount, {
    level: 0,
    slot: 0.5,
    parentKey: null,
    branchLabel: "",
    branchSide: "left",
  }, context);

  const answer = result.value >= this.infinity ? -1 : result.value;
  if (answer === -1) {
    this.setMessage("No combination reaches the target → return -1.");
  } else {
    this.setMessage(
      `Optimal answer uses ${answer} coin${answer === 1 ? "" : "s"}.`
    );
  }
  this.cmd("Step");

  return this.commands;
};

CoinChangeTopDown.prototype.runDFS = function (index, remain, meta, context) {
  const coins = context.coins;
  const amount = context.amount;
  const memo = context.memo;

  const key = this.allocateCallKey();
  const node = this.createTreeNode({
    key,
    index,
    remain,
    level: meta.level || 0,
    slot: meta.slot || 0.5,
    parentKey: meta.parentKey,
    branchLabel: meta.branchLabel,
    branchSide: meta.branchSide,
  });
  node.best = this.infinity;
  node.result = null;
  node.lastDecision = "";
  this.setNodeStatus(key, "active", { best: node.best, result: null });
  this.setMessage(`dfs(${index}, ${remain})`);
  this.cmd("Step");

  if (remain === 0) {
    node.result = 0;
    node.best = 0;
    node.lastDecision = "target met";
    this.setMessage("Remain is 0 → return 0.");
    this.setNodeStatus(key, "base", { result: 0, best: 0 });
    this.cmd("Step");
    return { value: 0, key };
  }

  if (remain < 0) {
    node.result = this.infinity;
    node.best = this.infinity;
    node.lastDecision = "remain < 0";
    this.setMessage("Remain < 0 → invalid branch (∞).");
    this.setNodeStatus(key, "base", { result: this.infinity, best: this.infinity });
    this.cmd("Step");
    return { value: this.infinity, key };
  }

  if (index >= coins.length) {
    node.result = this.infinity;
    node.best = this.infinity;
    node.lastDecision = "out of coins";
    this.setMessage("No coins left → return ∞.");
    this.setNodeStatus(key, "base", { result: this.infinity, best: this.infinity });
    this.cmd("Step");
    return { value: this.infinity, key };
  }

  let memoValue = null;
  if (index < memo.length && remain <= amount) {
    memoValue = memo[index][remain];
  }
  if (memoValue !== null && memoValue !== undefined) {
    if (index < memo.length && remain <= amount) {
      this.highlightMemoCell(index, remain, true);
    }
    this.setMessage(
      `Memo hit: memo[${index}][${remain}] = ${this.formatValue(memoValue)}.`
    );
    node.result = memoValue;
    node.best = memoValue;
    node.lastDecision = "memo reuse";
    this.setNodeStatus(key, "memo", { result: memoValue, best: memoValue });
    this.cmd("Step");
    if (index < memo.length && remain <= amount) {
      this.highlightMemoCell(index, remain, false);
    }
    return { value: memoValue, key };
  }

  let best = this.infinity;
  const coin = coins[index];
  node.lastDecision = "consider take";
  node.best = best;
  this.updateTreeNodeText(key);
  this.setMessage(`Try taking coin ${coin}.`);
  this.cmd("Step");

  if (remain >= coin) {
    const take = this.runDFS(index, remain - coin, {
      level: node.level + 1,
      slot: this.computeChildSlot(node.slot, node.level + 1, "left"),
      parentKey: key,
      branchLabel: `take ${coin}`,
      branchSide: "left",
    }, context);

    let takeValue = take.value;
    if (takeValue < this.infinity) {
      takeValue += 1;
    }
    const childNode = this.treeNodes[take.key];
    this.highlightEdge(node, childNode);

    if (takeValue < best) {
      best = takeValue;
    }
    if (takeValue >= this.infinity) {
      node.lastDecision = "take → ∞";
      this.setMessage(`Taking coin ${coin} does not reach the target.`);
    } else {
      node.lastDecision = `take → ${takeValue}`;
      this.setMessage(
        `Taking coin ${coin} yields ${takeValue} coin${takeValue === 1 ? "" : "s"}.`
      );
    }
    node.best = best;
    this.updateTreeNodeText(key);
    this.cmd("Step");
  } else {
    node.lastDecision = "take not possible";
    this.setMessage(`Remain ${remain} < coin ${coin} → skip take.`);
    this.updateTreeNodeText(key);
    this.cmd("Step");
  }

  this.setMessage(`Try skipping coin ${coin}.`);
  node.lastDecision = "consider skip";
  this.updateTreeNodeText(key);
  this.cmd("Step");

  const skip = this.runDFS(index + 1, remain, {
    level: node.level + 1,
    slot: this.computeChildSlot(node.slot, node.level + 1, "right"),
    parentKey: key,
    branchLabel: "skip",
    branchSide: "right",
  }, context);

  const skipValue = skip.value;
  const skipNode = this.treeNodes[skip.key];
  this.highlightEdge(node, skipNode);

  if (skipValue < best) {
    best = skipValue;
  }
  if (skipValue >= this.infinity) {
    node.lastDecision = "skip → ∞";
    this.setMessage("Skipping did not find a solution.");
  } else {
    node.lastDecision = `skip → ${skipValue}`;
    this.setMessage(
      `Skipping uses ${skipValue} coin${skipValue === 1 ? "" : "s"}.`
    );
  }
  node.best = best;
  this.updateTreeNodeText(key);
  this.cmd("Step");

  const result = best;
  if (index < memo.length && remain <= amount) {
    memo[index][remain] = result;
    const background =
      result >= this.infinity ? this.memoFailFillColor : this.memoFillColor;
    this.updateMemoCell(index, remain, result, { background });
    this.highlightMemoCell(index, remain, true);
    this.setMessage(
      `memo[${index}][${remain}] = ${this.formatValue(result)}.`
    );
    this.cmd("Step");
    this.highlightMemoCell(index, remain, false);
  }

  node.result = result;
  this.setNodeStatus(key, "done", { result, best, lastDecision: node.lastDecision });
  this.cmd("Step");

  return { value: result, key };
};

CoinChangeTopDown.prototype.disableUI = function () {
  if (this.coinsField) this.coinsField.disabled = true;
  if (this.amountField) this.amountField.disabled = true;
  if (this.setButton) this.setButton.disabled = true;
  if (this.runButton) this.runButton.disabled = true;
  if (this.pauseButton) this.pauseButton.disabled = false;
  if (this.stepButton) this.stepButton.disabled = false;
};

CoinChangeTopDown.prototype.enableUI = function () {
  if (this.coinsField) this.coinsField.disabled = false;
  if (this.amountField) this.amountField.disabled = false;
  if (this.setButton) this.setButton.disabled = false;
  if (this.runButton) this.runButton.disabled = false;
  if (this.pauseButton) this.pauseButton.disabled = false;
  if (this.stepButton) this.stepButton.disabled = false;
};

function init() {
  const animMgr = initCanvas();
  currentAlg = new CoinChangeTopDown(animMgr, 720, 1280);
}
