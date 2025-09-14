// Simple animated walkthrough of LeetCode 416 space optimized DP
// Uses basic DOM manipulation and timeouts to highlight each step

function runAnimation() {
  const explanation = document.getElementById('explanation');
  const viz = document.getElementById('viz');

  const steps = [
    step1,
    step2,
    step3,
    step4,
    step5,
  ];

  let current = 0;
  function next() {
    if (current < steps.length) {
      steps[current++]();
      setTimeout(next, 3000);
    }
  }
  next();

  function step1() {
    explanation.innerHTML = '<h3>🧠 Step 1: Original 2D DP Table</h3>' +
      '<p>Each cell <code>dp[i][j]</code> tells if we can make sum <code>j</code> using first <code>i</code> numbers.</p>';
    viz.innerHTML = '';
    const grid = createGrid(4, 6);
    viz.appendChild(grid);
  }

  function step2() {
    explanation.innerHTML = '<h3>🧠 Step 2: Row Dependency</h3>' +
      '<p>Row <code>i</code> only depends on row <code>i-1</code>. We never read older rows.</p>';
    // highlight last two rows
    const rows = viz.querySelectorAll('.row');
    if (rows.length >= 2) {
      rows[rows.length - 1].classList.add('highlight');
      rows[rows.length - 2].classList.add('highlight');
    }
  }

  function step3() {
    explanation.innerHTML = '<h3>🧠 Step 3: Compress to 1D</h3>' +
      '<p>We keep only one array <code>dp[j]</code> representing the previous row.</p>';
    viz.innerHTML = '';
    const arr = createArray(6);
    viz.appendChild(arr);
  }

  function step4() {
    explanation.innerHTML = '<h3>⚠️ Step 4: Iterate Backward</h3>' +
      '<p>Updating <code>j</code> from right to left ensures each number is used once.</p>';
    const cells = viz.querySelectorAll('.cell');
    let idx = cells.length - 1;
    function highlightNext() {
      if (idx >= 0) {
        cells[idx].classList.add('scan');
        idx--;
        setTimeout(highlightNext, 500);
      }
    }
    highlightNext();
  }

  function step5() {
    explanation.innerHTML = '<h3>🎯 Final Transition</h3>' +
      '<p><code>dp[j] = dp[j] || dp[j - num]</code></p>' +
      '<p>Memory drops from <code>O(n·target)</code> to <code>O(target)</code>.</p>';
  }
}

function createGrid(rows, cols) {
  const grid = document.createElement('div');
  grid.className = 'grid';
  for (let r = 0; r < rows; r++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = 'F';
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
  return grid;
}

function createArray(length) {
  const row = document.createElement('div');
  row.className = 'row';
  for (let i = 0; i < length; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = 'F';
    row.appendChild(cell);
  }
  return row;
}

// Add some minimal CSS for cells
(function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #viz { margin-top: 20px; }
    .row { display: flex; }
    .cell {
      width: 30px; height: 30px; border: 1px solid #999;
      display: flex; align-items: center; justify-content: center;
      margin: 2px; font-family: monospace;
    }
    .highlight { background: #ffd4d4; }
    .scan { background: #dff7df; }
  `;
  document.head.appendChild(style);
})();
