// Home Ledger store: the household's books in memory, saved to localStorage.
// Everything the views show comes from here. No network, no cookies.

import {
  CATEGORIES,
  DEFAULT_BUDGETS,
  MONTHLY_TOTALS,
  MONTHS,
  SEED_GOALS,
  SEED_TRANSACTIONS,
} from './data.js';

const STORAGE_KEY = 'homeledger-v1';

function seedState() {
  return {
    month: '2026-11',
    budgets: { ...DEFAULT_BUDGETS },
    goals: SEED_GOALS.map((g) => ({ ...g })),
    transactions: SEED_TRANSACTIONS.map((t, i) => ({
      id: 'tx' + (i + 1),
      date: t[0],
      desc: t[1],
      cat: t[2],
      amount: t[3],
      kind: t[4],
    })),
  };
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return seedState();
    return parsed;
  } catch (err) {
    return seedState();
  }
}

export const store = {
  state: loadState(),

  save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (err) {
      // Private mode or storage full: keep working in memory.
    }
  },

  reset() {
    this.state = seedState();
    this.save();
  },

  setMonth(ym) {
    if (MONTHS.includes(ym)) {
      this.state.month = ym;
      this.save();
    }
  },

  monthIndex() {
    return MONTHS.indexOf(this.state.month);
  },

  prevMonth() {
    const i = this.monthIndex();
    if (i > 0) this.setMonth(MONTHS[i - 1]);
  },

  nextMonth() {
    const i = this.monthIndex();
    if (i < MONTHS.length - 1) this.setMonth(MONTHS[i + 1]);
  },

  monthTransactions(ym) {
    return this.state.transactions
      .filter((t) => t.date.slice(0, 7) === ym)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  },

  // Monthly income and spending. Itemised months come from transactions;
  // earlier months come from the stored totals.
  monthTotals(ym) {
    const txs = this.monthTransactions(ym);
    if (txs.length > 0) {
      let income = 0;
      let spending = 0;
      for (const t of txs) {
        if (t.kind === 'income') income += t.amount;
        else spending += t.amount;
      }
      return { income, spending };
    }
    const stored = MONTHLY_TOTALS[ym];
    return stored ? { ...stored } : { income: 0, spending: 0 };
  },

  categorySpending(ym) {
    const out = {};
    for (const c of CATEGORIES) out[c.id] = 0;
    for (const t of this.monthTransactions(ym)) {
      if (t.kind === 'expense' && out[t.cat] !== undefined) out[t.cat] += t.amount;
    }
    return out;
  },

  budgetStatus(ym) {
    const spent = this.categorySpending(ym);
    return CATEGORIES.map((c) => {
      const limit = this.state.budgets[c.id] || 0;
      const used = spent[c.id] || 0;
      return {
        ...c,
        limit,
        used,
        left: limit - used,
        pct: limit > 0 ? Math.round((used / limit) * 100) : 0,
      };
    });
  },

  addTransaction({ date, desc, cat, amount, kind }) {
    const id = 'tx' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
    this.state.transactions.push({ id, date, desc, cat, amount, kind });
    this.save();
    return id;
  },

  updateTransaction(id, patch) {
    const tx = this.state.transactions.find((t) => t.id === id);
    if (!tx) return false;
    Object.assign(tx, patch);
    this.save();
    return true;
  },

  deleteTransaction(id) {
    const before = this.state.transactions.length;
    this.state.transactions = this.state.transactions.filter((t) => t.id !== id);
    if (this.state.transactions.length !== before) this.save();
  },

  setBudget(catId, limit) {
    this.state.budgets[catId] = Math.max(0, Math.round(limit));
    this.save();
  },

  addToGoal(id, amount) {
    const goal = this.state.goals.find((g) => g.id === id);
    if (!goal) return false;
    goal.saved = Math.min(goal.target, Math.round((goal.saved + amount) * 100) / 100);
    this.save();
    return true;
  },

  addGoal(name, target) {
    const id = 'g' + Date.now().toString(36);
    this.state.goals.push({ id, name, target, saved: 0, note: '' });
    this.save();
    return id;
  },
};
