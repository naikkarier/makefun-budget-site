// Home Ledger views: Dashboard, Transactions, Budgets, Goals, Reports.
// Each view renders HTML into its root and wires its own controls, then calls
// rerender() after any change so the numbers always match the books.

import { CATEGORIES, INCOME_CATEGORIES, MONTHS, monthLabel, money } from './data.js';
import { store } from './store.js';
import { donut, hbar, monthBars } from './charts.js';

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function monthNav() {
  const i = store.monthIndex();
  return `<div class="month-nav">
    <button id="prev-month" ${i === 0 ? 'disabled' : ''}>&larr; Prev</button>
    <h2>${monthLabel(store.state.month)}</h2>
    <button id="next-month" ${i === MONTHS.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
  </div>`;
}

function wireMonthNav(root, rerender) {
  const prev = root.querySelector('#prev-month');
  const next = root.querySelector('#next-month');
  if (prev) prev.addEventListener('click', () => { store.prevMonth(); rerender(); });
  if (next) next.addEventListener('click', () => { store.nextMonth(); rerender(); });
}

function catName(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  if (c) return c.name;
  const inc = INCOME_CATEGORIES.find((x) => x.id === id);
  return inc ? inc.name : id;
}

// ---------------- Dashboard ----------------

export function renderDashboard(root, rerender) {
  const ym = store.state.month;
  const { income, spending } = store.monthTotals(ym);
  const left = income - spending;
  const rate = income > 0 ? Math.round((left / income) * 100) : 0;
  const spent = store.categorySpending(ym);
  const segments = CATEGORIES.map((c) => ({ name: c.name, value: spent[c.id] || 0, color: c.color })).filter((s) => s.value > 0);
  const budgets = store.budgetStatus(ym);
  const over = budgets.filter((b) => b.used > b.limit);
  const recent = store.monthTransactions(ym).slice(0, 5);
  const top = [...budgets].sort((a, b) => b.used - a.used)[0];

  const legend = segments
    .map((s) => {
      const pct = spending > 0 ? Math.round((s.value / spending) * 100) : 0;
      return `<li><span class="dot" style="background:${s.color}"></span>${esc(s.name)} <b>${money(s.value)}</b> <span class="muted">${pct}%</span></li>`;
    })
    .join('');

  const budgetRows = budgets
    .slice()
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4)
    .map((b) => `<li class="budget-row">
      <div class="br-head"><span>${esc(b.name)}</span><span>${money(b.used)} of ${money(b.limit)}</span></div>
      ${hbar(b.pct, b.used > b.limit ? '#b91c1c' : b.used === b.limit ? '#d97706' : b.color)}
      <div class="br-foot">${b.used > b.limit ? `<b class="over">Over budget by ${money(b.used - b.limit)}</b>` : b.used === b.limit ? `<b>At your limit</b>` : `${money(b.left)} left`}</div>
    </li>`)
    .join('');

  const recentRows = recent
    .map((t) => `<li><span class="tx-date">${esc(t.date.slice(5))}</span><span class="tx-desc">${esc(t.desc)}</span><span class="tx-cat">${esc(catName(t.cat))}</span><span class="tx-amt ${t.kind}">${t.kind === 'income' ? '+' : '&minus;'}${money(t.amount)}</span></li>`)
    .join('');

  const insight = over.length > 0
    ? `Heads up: ${over.map((b) => b.name).join(' and ')} ${over.length > 1 ? 'are' : 'is'} over budget this month. ${top ? top.name + ' is your biggest spend at ' + money(top.used) + '.' : ''}`
    : `${top ? top.name + ' is your biggest spend this month at ' + money(top.used) + '.' : ''} You are on track to save ${money(left)} this month.`;

  root.innerHTML = `
    ${monthNav()}
    <section class="stats">
      <div class="stat"><span class="stat-label">Income</span><span class="stat-value income">${money(income)}</span></div>
      <div class="stat"><span class="stat-label">Spending</span><span class="stat-value spending">${money(spending)}</span></div>
      <div class="stat"><span class="stat-label">Left to spend</span><span class="stat-value">${money(left)}</span></div>
      <div class="stat"><span class="stat-label">Savings rate</span><span class="stat-value">${rate}%</span></div>
    </section>
    <section class="grid-2">
      <div class="card">
        <h3>Where the money went</h3>
        <div class="donut-wrap">${donut(segments)}<ul class="legend">${legend}</ul></div>
      </div>
      <div class="card">
        <h3>Budgets to watch</h3>
        <ul class="budget-list">${budgetRows}</ul>
        <a class="link" href="#/budgets">See all budgets &rarr;</a>
      </div>
    </section>
    <section class="grid-2">
      <div class="card">
        <h3>Recent transactions</h3>
        <ul class="tx-list">${recentRows}</ul>
        <a class="link" href="#/transactions">See all transactions &rarr;</a>
      </div>
      <div class="card insight">
        <h3>This month, in one line</h3>
        <p>${esc(insight)}</p>
      </div>
    </section>`;
  wireMonthNav(root, rerender);
}

// ---------------- Transactions ----------------

let editingId = null;

export function renderTransactions(root, rerender) {
  const ym = store.state.month;
  const all = store.monthTransactions(ym);
  const q = (root.dataset.q || '').toLowerCase();
  const fKind = root.dataset.kind || 'all';
  const fCat = root.dataset.cat || 'all';
  const list = all.filter((t) => {
    if (fKind !== 'all' && t.kind !== fKind) return false;
    if (fCat !== 'all' && t.cat !== fCat) return false;
    if (q && !t.desc.toLowerCase().includes(q) && !catName(t.cat).toLowerCase().includes(q)) return false;
    return true;
  });
  const totalOut = list.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIn = list.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0);

  const catOptions = [...CATEGORIES, ...INCOME_CATEGORIES]
    .map((c) => `<option value="${c.id}">${esc(c.name)}</option>`)
    .join('');

  const rows = list
    .map((t) => `<tr data-search="${esc((t.desc + ' ' + catName(t.cat)).toLowerCase())}">
      <td>${esc(t.date)}</td>
      <td>${esc(t.desc)}</td>
      <td>${esc(catName(t.cat))}</td>
      <td class="num ${t.kind}">${t.kind === 'income' ? '+' : '&minus;'}${money(t.amount)}</td>
      <td class="row-actions"><button class="mini" data-edit="${t.id}">Edit</button> <button class="mini danger" data-del="${t.id}">Delete</button></td>
    </tr>`)
    .join('');

  root.innerHTML = `
    ${monthNav()}
    <section class="card">
      <h3>${editingId ? 'Edit transaction' : 'Add a transaction'}</h3>
      <form id="tx-form" class="form-grid">
        <label>Date <input type="date" name="date" required value="${ym}-15"></label>
        <label>Description <input type="text" name="desc" required maxlength="80" placeholder="e.g. Weekly groceries"></label>
        <label>Category <select name="cat">${catOptions}</select></label>
        <label>Amount ($) <input type="number" name="amount" required min="0.01" step="0.01" placeholder="0.00"></label>
        <label>Type <select name="kind"><option value="expense">Expense</option><option value="income">Income</option></select></label>
        <div class="form-actions">
          <button type="submit" class="btn">${editingId ? 'Save changes' : 'Add transaction'}</button>
          ${editingId ? '<button type="button" class="btn ghost" id="cancel-edit">Cancel</button>' : ''}
        </div>
      </form>
    </section>
    <section class="card">
      <h3>Transactions <span class="muted" id="tx-count">(${list.length} shown &middot; in ${money(totalIn)} &middot; out ${money(totalOut)})</span></h3>
      <div class="filters">
        <label>Type <select id="f-kind">
          <option value="all" ${fKind === 'all' ? 'selected' : ''}>All</option>
          <option value="expense" ${fKind === 'expense' ? 'selected' : ''}>Expenses</option>
          <option value="income" ${fKind === 'income' ? 'selected' : ''}>Income</option>
        </select></label>
        <label>Category <select id="f-cat">
          <option value="all">All categories</option>
          ${[...CATEGORIES, ...INCOME_CATEGORIES].map((c) => `<option value="${c.id}" ${fCat === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
        </select></label>
        <label>Search <input type="search" id="f-q" placeholder="Search description" value="${esc(root.dataset.q || '')}"></label>
      </div>
      ${list.length === 0 ? '<p class="muted">No transactions match. Try clearing a filter.</p>' : `
      <div class="table-wrap"><table>
        <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`}
    </section>`;
  wireMonthNav(root, rerender);

  const form = root.querySelector('#tx-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      date: String(fd.get('date')),
      desc: String(fd.get('desc')).trim(),
      cat: String(fd.get('cat')),
      amount: Math.round(Number(fd.get('amount')) * 100) / 100,
      kind: String(fd.get('kind')),
    };
    if (!data.desc || !(data.amount > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) return;
    if (editingId) {
      store.updateTransaction(editingId, data);
      editingId = null;
    } else {
      store.addTransaction(data);
      store.setMonth(data.date.slice(0, 7));
    }
    rerender();
  });
  const cancel = root.querySelector('#cancel-edit');
  if (cancel) cancel.addEventListener('click', () => { editingId = null; rerender(); });

  if (editingId) {
    const tx = store.state.transactions.find((t) => t.id === editingId);
    if (tx) {
      form.date.value = tx.date;
      form.desc.value = tx.desc;
      form.cat.value = tx.cat;
      form.amount.value = tx.amount;
      form.kind.value = tx.kind;
    }
  }

  root.querySelector('#f-kind').addEventListener('change', (e) => { root.dataset.kind = e.target.value; rerender(); });
  root.querySelector('#f-cat').addEventListener('change', (e) => { root.dataset.cat = e.target.value; rerender(); });
  root.querySelector('#f-q').addEventListener('input', (e) => {
    // Filter the rows in place so the search box keeps focus.
    const needle = e.target.value.trim().toLowerCase();
    const rows = root.querySelectorAll('tbody tr');
    let shown = 0;
    rows.forEach((row) => {
      const hit = !needle || (row.dataset.search || '').includes(needle);
      row.style.display = hit ? '' : 'none';
      if (hit) shown += 1;
    });
    const count = root.querySelector('#tx-count');
    if (count) count.textContent = `(${shown} shown)`;
  });
  root.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
    if (window.confirm('Delete this transaction?')) { store.deleteTransaction(b.dataset.del); rerender(); }
  }));
  root.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => {
    editingId = b.dataset.edit;
    rerender();
  }));
}

// ---------------- Budgets ----------------

export function renderBudgets(root, rerender) {
  const ym = store.state.month;
  const budgets = store.budgetStatus(ym);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalUsed = budgets.reduce((s, b) => s + b.used, 0);

  const cards = budgets
    .map((b) => `<div class="budget-card ${b.used > b.limit ? 'is-over' : ''}">
      <div class="bc-head"><span class="dot" style="background:${b.color}"></span><b>${esc(b.name)}</b>${b.used > b.limit ? '<span class="badge">Over budget</span>' : ''}</div>
      <div class="bc-nums"><span class="bc-used">${money(b.used)}</span><span class="muted">of ${money(b.limit)}</span></div>
      ${hbar(b.pct, b.used > b.limit ? '#b91c1c' : b.used === b.limit ? '#d97706' : b.color)}
      <div class="bc-foot">${b.used > b.limit ? `Over by ${money(b.used - b.limit)}` : b.used === b.limit ? 'At your limit' : `${money(b.left)} left &middot; ${b.pct}% used`}</div>
      <form class="limit-form" data-cat="${b.id}">
        <label>Monthly limit ($) <input type="number" name="limit" min="0" step="5" value="${b.limit}" required></label>
        <button type="submit" class="btn small">Save</button>
      </form>
    </div>`)
    .join('');

  root.innerHTML = `
    ${monthNav()}
    <section class="card summary-line">
      <span>Total budget <b>${money(totalLimit)}</b></span>
      <span>Spent so far <b>${money(totalUsed)}</b></span>
      <span>Remaining <b>${money(totalLimit - totalUsed)}</b></span>
    </section>
    <section class="budget-grid">${cards}</section>
    <p class="muted">Limits are monthly. Changing a limit applies to every month; spending is counted from the transactions you add.</p>`;
  wireMonthNav(root, rerender);
  root.querySelectorAll('.limit-form').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const limit = Number(new FormData(f).get('limit'));
    if (Number.isFinite(limit) && limit >= 0) {
      store.setBudget(f.dataset.cat, limit);
      rerender();
    }
  }));
}

// ---------------- Goals ----------------

export function renderGoals(root, rerender) {
  const cards = store.state.goals
    .map((g) => {
      const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
      return `<div class="card goal-card">
        <h3>${esc(g.name)}</h3>
        ${g.note ? `<p class="muted">${esc(g.note)}</p>` : ''}
        <div class="bc-nums"><span class="bc-used">${money(g.saved)}</span><span class="muted">of ${money(g.target)}</span></div>
        ${hbar(Math.min(pct, 100), '#1d5c3f')}
        <div class="bc-foot">${pct}% funded &middot; ${money(Math.max(g.target - g.saved, 0))} to go</div>
        <form class="goal-form" data-goal="${g.id}">
          <label>Add funds ($) <input type="number" name="amount" min="1" step="5" placeholder="50" required></label>
          <button type="submit" class="btn small">Add</button>
        </form>
      </div>`;
    })
    .join('');

  root.innerHTML = `
    <h2 class="page-title">Savings goals</h2>
    <p class="muted">Put a little aside each month. Adding funds here moves money into the goal; it does not change your transactions.</p>
    <section class="goal-grid">${cards}</section>
    <section class="card">
      <h3>Start a new goal</h3>
      <form id="goal-form" class="form-grid">
        <label>Goal name <input type="text" name="name" required maxlength="60" placeholder="e.g. New bike"></label>
        <label>Target ($) <input type="number" name="target" required min="1" step="10" placeholder="500"></label>
        <div class="form-actions"><button type="submit" class="btn">Create goal</button></div>
      </form>
    </section>`;
  root.querySelectorAll('.goal-form').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = Number(new FormData(f).get('amount'));
    if (Number.isFinite(amount) && amount > 0) {
      store.addToGoal(f.dataset.goal, amount);
      rerender();
    }
  }));
  root.querySelector('#goal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get('name')).trim();
    const target = Number(fd.get('target'));
    if (name && Number.isFinite(target) && target > 0) {
      store.addGoal(name, target);
      rerender();
    }
  });
}

// ---------------- Reports ----------------

export function renderReports(root, rerender) {
  const ym = store.state.month;
  const months = MONTHS.map((m) => {
    const t = store.monthTotals(m);
    return { label: m.slice(5) + '/' + m.slice(2, 4), income: Math.round(t.income), spending: Math.round(t.spending) };
  });
  const { income, spending } = store.monthTotals(ym);
  const spent = store.categorySpending(ym);
  const topCats = CATEGORIES.map((c) => ({ ...c, used: spent[c.id] || 0 }))
    .sort((a, b) => b.used - a.used)
    .slice(0, 5);
  const topList = topCats
    .map((c, i) => `<li><span class="rank">${i + 1}</span><span class="dot" style="background:${c.color}"></span>${esc(c.name)}<b>${money(c.used)}</b></li>`)
    .join('');

  const idx = MONTHS.indexOf(ym);
  const prev = idx > 0 ? store.monthTotals(MONTHS[idx - 1]) : null;
  const change = prev && prev.spending > 0 ? Math.round(((spending - prev.spending) / prev.spending) * 100) : null;
  const days = Number(ym.slice(5)) === 11 ? 28 : 30;
  const daily = spending / days;
  const biggest = topCats[0];
  const biggestShare = spending > 0 ? Math.round((biggest.used / spending) * 100) : 0;

  root.innerHTML = `
    ${monthNav()}
    <section class="card">
      <h3>Income vs spending, last 6 months</h3>
      ${monthBars(months)}
    </section>
    <section class="grid-2">
      <div class="card">
        <h3>Biggest spending this month</h3>
        <ul class="rank-list">${topList}</ul>
      </div>
      <div class="card insight">
        <h3>What the numbers say</h3>
        <ul class="insight-list">
          <li>You spent <b>${change === null ? 'about the same' : change > 0 ? change + '% more' : Math.abs(change) + '% less'}</b> than last month.</li>
          <li>${esc(biggest.name)} is your biggest category at <b>${money(biggest.used)}</b>, ${biggestShare}% of all spending.</li>
          <li>That is about <b>${money(daily)} a day</b> across the month so far.</li>
          <li>Income of ${money(income)} against spending of ${money(spending)} leaves <b>${money(income - spending)}</b> to save or carry over.</li>
        </ul>
      </div>
    </section>`;
  wireMonthNav(root, rerender);
}
