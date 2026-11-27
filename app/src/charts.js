// Home Ledger charts: a donut for category spending and vertical bars for
// monthly income vs spending. Pure SVG and divs, no libraries, no network.

export function donut(segments, size = 180) {
  // segments: [{ name, value, color }]. Returns an SVG string.
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 70;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  let circles = '';
  if (total <= 0) {
    circles = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="26"/>`;
  } else {
    for (const seg of segments) {
      if (seg.value <= 0) continue;
      const frac = seg.value / total;
      const len = Math.max(frac * circ - 2, 0.5);
      circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="26" stroke-dasharray="${len.toFixed(1)} ${circ.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
      offset += frac * circ;
    }
  }
  const inner = total > 0
    ? `<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">$${Math.round(total).toLocaleString('en-US')}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-label">spent</text>`
    : `<text x="${cx}" y="${cy + 5}" text-anchor="middle" class="donut-label">no spending</text>`;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category">${circles}${inner}</svg>`;
}

export function monthBars(months) {
  // months: [{ label, income, spending }]. Returns HTML for a grouped bar chart.
  const max = Math.max(1, ...months.flatMap((m) => [m.income, m.spending]));
  let bars = '';
  for (const m of months) {
    const ih = Math.max(Math.round((m.income / max) * 140), 3);
    const sh = Math.max(Math.round((m.spending / max) * 140), 3);
    bars += `<div class="mb-col">
      <div class="mb-bars">
        <div class="mb-bar-wrap"><span class="mb-val">$${m.income.toLocaleString('en-US')}</span><div class="mb-bar mb-income" style="height:${ih}px" title="Income $${m.income.toLocaleString('en-US')}"></div></div>
        <div class="mb-bar-wrap"><span class="mb-val">$${m.spending.toLocaleString('en-US')}</span><div class="mb-bar mb-spending" style="height:${sh}px" title="Spending $${m.spending.toLocaleString('en-US')}"></div></div>
      </div>
      <div class="mb-label">${m.label}</div>
    </div>`;
  }
  return `<div class="month-bars">${bars}</div>
  <div class="mb-legend"><span class="mb-key mb-income-key"></span> Income <span class="mb-key mb-spending-key"></span> Spending</div>`;
}

export function hbar(pct, color) {
  const safe = Math.max(0, Math.min(100, pct));
  return `<div class="hbar"><div class="hbar-fill" style="width:${safe}%;background:${color}"></div></div>`;
}
