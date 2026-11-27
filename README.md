# Home Ledger

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/naikkarier/makefun-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/naikkarier/makefun-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Home Ledger is a household budget site for the [make.fun](https://make.fun/bounty/best-household-budget-site-20261126-1457) bounty "Make the best household budget site". It runs offline in a desktop browser and on a phone, from its own static files, with no network request.

## What it does

- **Dashboard**: the month at a glance. Income, spending, what is left, and the savings rate; a donut of spending by category; the budgets to watch; recent transactions; and one line summing the month up.
- **Transactions**: add, edit, delete and search transactions, filter by type and category, all against the demo household's books for June to November 2026.
- **Budgets**: a monthly limit per category with a progress bar, an over-budget warning, and an editable limit.
- **Goals**: savings goals with a target, progress, and a way to add funds.
- **Reports**: income against spending for the last six months, the biggest spending categories, and what the numbers say.

Data is saved in the browser's local storage and never sent anywhere. A "Reset demo data" button restores the demo household.

## How it runs

Open `app/index.html` in a browser, or serve `app/` with `node serve.ts` and open http://localhost:8080. No build step, no framework, no network.

## Hand-in

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
