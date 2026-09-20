/**
 * Shared data-visualisation tokens for the admin dashboard.
 *
 * The categorical order below is fixed on purpose: colour follows the entity,
 * never its rank, so filtering a series never repaints the survivors. The first
 * three slots are validated for colourblind separation against a white card
 * surface (worst all-pairs CVD dE 9.2, normal-vision dE 24.0), which is why no
 * chart here seats a fourth categorical series.
 */
export const series = {
  blue: '#2a78d6',
  orange: '#eb6834',
  aqua: '#1baf7a',
};

// Single-hue ramp, light -> dark. Used for ordered bands (price brackets).
export const sequential = ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab', '#104281'];

export const ink = {
  primary: '#0b0b0b',
  secondary: '#52514e',
  muted: '#898781',
  grid: '#e1e0d9',
  axis: '#c3c2b7',
  surface: '#ffffff',
  good: '#0ca30c',
  critical: '#d03b3b',
};

/** Recharts props shared by every cartesian chart, so the chrome stays recessive. */
export const axisProps = {
  tick: { fill: ink.muted, fontSize: 12 },
  stroke: ink.axis,
  tickLine: false,
};

export const gridProps = {
  stroke: ink.grid,
  strokeDasharray: '0', // solid hairlines: dashing reads as "projection"
};

export const formatMoney = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '-';
  if (value >= 1e7) return `Rs. ${(value / 1e7).toFixed(2)} Cr`;
  if (value >= 1e5) return `Rs. ${(value / 1e5).toFixed(2)} Lac`;
  return `Rs. ${value.toLocaleString()}`;
};

export const formatCompact = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '-';
  if (value >= 1e7) return `${(value / 1e7).toFixed(1)}Cr`;
  if (value >= 1e5) return `${(value / 1e5).toFixed(1)}L`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return `${value}`;
};

/** Last `count` months as { key: 'YYYY-M', label: 'Mar' } , oldest first. */
export const lastMonths = (count = 6) => {
  const now = new Date();
  const months = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString('en-US', { month: 'short' }),
    });
  }
  return months;
};

export const monthKey = (dateish) => {
  const d = new Date(dateish);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${d.getMonth()}`;
};

/** Rows created within the last `days` days. */
export const countSince = (rows, days, from = 0) => {
  const end = Date.now() - from * 86400000;
  const start = end - days * 86400000;
  return rows.filter((r) => {
    const t = new Date(r.createdAt).getTime();
    return !Number.isNaN(t) && t > start && t <= end;
  }).length;
};
