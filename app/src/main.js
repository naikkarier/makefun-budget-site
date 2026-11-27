// Home Ledger boot and router: hash routes for the five sections.
// #/ dashboard, #/transactions, #/budgets, #/goals, #/reports.

import { store } from './store.js';
import {
  renderBudgets,
  renderDashboard,
  renderGoals,
  renderReports,
  renderTransactions,
} from './views.js';

const NAV = [
  { hash: '#/', label: 'Dashboard' },
  { hash: '#/transactions', label: 'Transactions' },
  { hash: '#/budgets', label: 'Budgets' },
  { hash: '#/goals', label: 'Goals' },
  { hash: '#/reports', label: 'Reports' },
];

const VIEWS = {
  '#/': renderDashboard,
  '#/transactions': renderTransactions,
  '#/budgets': renderBudgets,
  '#/goals': renderGoals,
  '#/reports': renderReports,
};

function currentHash() {
  const h = window.location.hash || '#/';
  return VIEWS[h] ? h : '#/';
}

function renderNav(active) {
  const nav = document.getElementById('nav');
  nav.innerHTML = NAV.map((n) => `<a href="${n.hash}" class="${n.hash === active ? 'active' : ''}">${n.label}</a>`).join('');
}

function render() {
  const hash = currentHash();
  renderNav(hash);
  const view = document.getElementById('view');
  // Keep filter state across re-renders of the transactions page.
  const keep = {};
  if (hash === '#/transactions') {
    keep.q = view.dataset.q;
    keep.kind = view.dataset.kind;
    keep.cat = view.dataset.cat;
  }
  VIEWS[hash](view, render);
  if (hash === '#/transactions') {
    if (keep.q !== undefined) view.dataset.q = keep.q;
    if (keep.kind !== undefined) view.dataset.kind = keep.kind;
    if (keep.cat !== undefined) view.dataset.cat = keep.cat;
  }
  document.getElementById('reset-data').textContent = 'Reset demo data';
}

window.addEventListener('hashchange', render);

document.getElementById('reset-data').addEventListener('click', () => {
  if (window.confirm('Reset all data back to the demo household?')) {
    store.reset();
    render();
  }
});

render();
