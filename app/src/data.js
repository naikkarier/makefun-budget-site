// Seed data for Home Ledger: a fictional household's real-looking books.
// Amounts are US dollars. Each transaction is [date, description, category, amount, kind].
// kind is "expense" or "income". Months run Jun 2026 to Nov 2026; Sep-Nov carry
// full transaction lists, Jun-Aug carry monthly totals used by the Reports page.

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#1d5c3f' },
  { id: 'groceries', name: 'Groceries', color: '#2f855a' },
  { id: 'dining', name: 'Dining Out', color: '#d97706' },
  { id: 'transport', name: 'Transport', color: '#2563eb' },
  { id: 'utilities', name: 'Utilities', color: '#7c3aed' },
  { id: 'entertainment', name: 'Entertainment', color: '#db2777' },
  { id: 'health', name: 'Health', color: '#0891b2' },
  { id: 'shopping', name: 'Shopping', color: '#b45309' },
  { id: 'other', name: 'Other', color: '#64748b' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary' },
  { id: 'freelance', name: 'Freelance' },
  { id: 'other-income', name: 'Other Income' },
];

export const DEFAULT_BUDGETS = {
  housing: 1450,
  groceries: 520,
  dining: 180,
  transport: 420,
  utilities: 300,
  entertainment: 120,
  health: 150,
  shopping: 200,
  other: 100,
};

export const MONTHS = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];

// Monthly totals for the months that carry no itemised transactions.
export const MONTHLY_TOTALS = {
  '2026-06': { income: 4680, spending: 2840 },
  '2026-07': { income: 4710, spending: 3120 },
  '2026-08': { income: 4680, spending: 2765 },
};

export const SEED_TRANSACTIONS = [
  // ---- September 2026 ----
  ['2026-09-01', 'Paycheck - Northwind Studio', 'salary', 4200, 'income'],
  ['2026-09-01', 'Rent - Maple Court Apt 4B', 'housing', 1450, 'expense'],
  ['2026-09-02', 'Whole Foods Market', 'groceries', 92.15, 'expense'],
  ['2026-09-03', 'Shell - gas', 'transport', 38.40, 'expense'],
  ['2026-09-05', 'Car payment - Honda', 'transport', 320, 'expense'],
  ['2026-09-06', 'Electric bill - City Power', 'utilities', 104.60, 'expense'],
  ['2026-09-07', 'Netflix', 'entertainment', 15.49, 'expense'],
  ['2026-09-08', 'Phone bill - Tello', 'utilities', 85, 'expense'],
  ['2026-09-09', 'Trader Joe\u2019s', 'groceries', 104.20, 'expense'],
  ['2026-09-10', 'Freelance - logo design', 'freelance', 480, 'income'],
  ['2026-09-11', 'Chipotle', 'dining', 27.80, 'expense'],
  ['2026-09-12', 'CVS Pharmacy', 'health', 22.40, 'expense'],
  ['2026-09-13', 'Internet - FiberNet', 'utilities', 65, 'expense'],
  ['2026-09-14', 'Gym - FitWorks', 'health', 45, 'expense'],
  ['2026-09-15', 'Costco', 'groceries', 141.30, 'expense'],
  ['2026-09-16', 'Bus pass', 'transport', 34, 'expense'],
  ['2026-09-18', 'Olive Garden', 'dining', 52.10, 'expense'],
  ['2026-09-19', 'Water bill', 'utilities', 44.80, 'expense'],
  ['2026-09-21', 'Target', 'shopping', 63.45, 'expense'],
  ['2026-09-23', 'Spotify', 'entertainment', 11.99, 'expense'],
  ['2026-09-25', 'Uber', 'transport', 21.30, 'expense'],
  ['2026-09-27', 'Farmers market', 'groceries', 38.90, 'expense'],
  ['2026-09-29', 'Amazon - kitchen towels', 'shopping', 32.75, 'expense'],
  // ---- October 2026 ----
  ['2026-10-01', 'Paycheck - Northwind Studio', 'salary', 4200, 'income'],
  ['2026-10-01', 'Rent - Maple Court Apt 4B', 'housing', 1450, 'expense'],
  ['2026-10-02', 'Whole Foods Market', 'groceries', 88.60, 'expense'],
  ['2026-10-03', 'Shell - gas', 'transport', 44.20, 'expense'],
  ['2026-10-05', 'Car payment - Honda', 'transport', 320, 'expense'],
  ['2026-10-06', 'Electric bill - City Power', 'utilities', 91.40, 'expense'],
  ['2026-10-07', 'Netflix', 'entertainment', 15.49, 'expense'],
  ['2026-10-08', 'Phone bill - Tello', 'utilities', 85, 'expense'],
  ['2026-10-09', 'Trader Joe\u2019s', 'groceries', 118.45, 'expense'],
  ['2026-10-10', 'Dentist copay - Bright Smiles', 'health', 60, 'expense'],
  ['2026-10-11', 'Pizza night - Domino\u2019s', 'dining', 29.90, 'expense'],
  ['2026-10-12', 'Freelance - flyer design', 'freelance', 480, 'income'],
  ['2026-10-13', 'Internet - FiberNet', 'utilities', 65, 'expense'],
  ['2026-10-14', 'Gym - FitWorks', 'health', 45, 'expense'],
  ['2026-10-15', 'Costco', 'groceries', 129.80, 'expense'],
  ['2026-10-17', 'Movie night - AMC', 'entertainment', 36, 'expense'],
  ['2026-10-18', 'Water bill', 'utilities', 47.10, 'expense'],
  ['2026-10-19', 'H&M - winter jacket', 'shopping', 89.90, 'expense'],
  ['2026-10-21', 'Chipotle', 'dining', 26.40, 'expense'],
  ['2026-10-22', 'Uber', 'transport', 16.50, 'expense'],
  ['2026-10-24', 'Spotify', 'entertainment', 11.99, 'expense'],
  ['2026-10-26', 'Farmers market', 'groceries', 46.25, 'expense'],
  ['2026-10-28', 'Amazon - light bulbs', 'shopping', 24.60, 'expense'],
  ['2026-10-30', 'Sushi dinner - Kiku', 'dining', 64.20, 'expense'],
  // ---- November 2026 ----
  ['2026-11-01', 'Paycheck - Northwind Studio', 'salary', 4200, 'income'],
  ['2026-11-01', 'Rent - Maple Court Apt 4B', 'housing', 1450, 'expense'],
  ['2026-11-02', 'Whole Foods Market', 'groceries', 86.40, 'expense'],
  ['2026-11-03', 'Shell - gas', 'transport', 42.10, 'expense'],
  ['2026-11-05', 'Car payment - Honda', 'transport', 320, 'expense'],
  ['2026-11-05', 'Netflix', 'entertainment', 15.49, 'expense'],
  ['2026-11-06', 'Electric bill - City Power', 'utilities', 98.30, 'expense'],
  ['2026-11-07', 'Chipotle', 'dining', 24.60, 'expense'],
  ['2026-11-08', 'Phone bill - Tello', 'utilities', 85, 'expense'],
  ['2026-11-09', 'Trader Joe\u2019s', 'groceries', 112.75, 'expense'],
  ['2026-11-10', 'CVS Pharmacy', 'health', 28.90, 'expense'],
  ['2026-11-11', 'Bus pass', 'transport', 34, 'expense'],
  ['2026-11-12', 'Freelance - logo design', 'freelance', 480, 'income'],
  ['2026-11-12', 'Water bill', 'utilities', 46.20, 'expense'],
  ['2026-11-13', 'Movie night - AMC', 'entertainment', 32, 'expense'],
  ['2026-11-14', 'Gym - FitWorks', 'health', 45, 'expense'],
  ['2026-11-15', 'Internet - FiberNet', 'utilities', 65, 'expense'],
  ['2026-11-16', 'Target', 'shopping', 74.30, 'expense'],
  ['2026-11-17', 'Olive Garden', 'dining', 58.40, 'expense'],
  ['2026-11-18', 'Tax refund - state', 'other-income', 180, 'income'],
  ['2026-11-19', 'Costco', 'groceries', 134.90, 'expense'],
  ['2026-11-21', 'Dentist copay - Bright Smiles', 'health', 85, 'expense'],
  ['2026-11-22', 'Uber', 'transport', 18.75, 'expense'],
  ['2026-11-24', 'Amazon - bedsheets', 'shopping', 49.99, 'expense'],
  ['2026-11-24', 'Spotify', 'entertainment', 11.99, 'expense'],
  ['2026-11-26', 'Pizza night - Domino\u2019s', 'dining', 31.50, 'expense'],
  ['2026-11-28', 'Farmers market', 'groceries', 42.60, 'expense'],
];

export const SEED_GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 5000, saved: 3200, note: 'Six months of rent, just in case.' },
  { id: 'g2', name: 'Family vacation - coast trip', target: 2400, saved: 950, note: 'A week by the sea next summer.' },
  { id: 'g3', name: 'New washing machine', target: 800, saved: 640, note: 'The old one rattles on spin cycle.' },
];

export function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return names[m - 1] + ' ' + y;
}

export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
