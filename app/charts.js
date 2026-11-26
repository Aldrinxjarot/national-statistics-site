// charts.js — small canvas chart renderers written for this site.
// No library: each function draws axes, gridlines and value labels itself
// so a chart stays readable when the page is shrunk to a phone.

const INK = '#22312e';
const MUTED = '#6b7a76';
const GRID = '#dfe6e1';
const TEAL = '#0f5b52';
const AMBER = '#e8a13a';
const CORAL = '#c65a3a';
const FONT = '13px system-ui, -apple-system, "Segoe UI", sans-serif';
const FONT_SMALL = '11px system-ui, -apple-system, "Segoe UI", sans-serif';

// Size a canvas to its box, honouring devicePixelRatio, and hand back a
// context already scaled to CSS pixels.
export function prepareCanvas(canvas) {
  const box = canvas.getBoundingClientRect();
  const width = Math.max(280, Math.round(box.width));
  const height = Math.round(canvas.dataset.height || 260);
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function niceMax(values) {
  const top = Math.max(...values);
  const step = Math.pow(10, Math.floor(Math.log10(top)));
  return Math.ceil(top / step) * step;
}

function drawFrame(ctx, width, height, pad, max, unit) {
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.font = FONT_SMALL;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const value = (max * i) / steps;
    const y = pad.top + ((height - pad.top - pad.bottom) * (steps - i)) / steps;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(formatAxis(value), pad.left - 8, y);
  }
  ctx.textAlign = 'left';
  ctx.fillText(unit, pad.left, 14);
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, height - pad.bottom);
  ctx.lineTo(width - pad.right, height - pad.bottom);
  ctx.stroke();
}

function formatAxis(value) {
  if (value >= 1000) return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k';
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

// A vertical bar chart. labels sit under the bars, values on top of them.
export function drawBarChart(canvas, { labels, values, unit, color = TEAL, highlightLast = false }) {
  const { ctx, width, height } = prepareCanvas(canvas);
  const pad = { top: 28, right: 12, bottom: 30, left: 46 };
  const max = niceMax(values);
  drawFrame(ctx, width, height, pad, max, unit);
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const slot = plotW / values.length;
  const barW = Math.min(56, slot * 0.62);
  ctx.font = FONT;
  values.forEach((value, i) => {
    const barH = (value / max) * plotH;
    const x = pad.left + slot * i + (slot - barW) / 2;
    const y = pad.top + plotH - barH;
    ctx.fillStyle = highlightLast && i === values.length - 1 ? AMBER : color;
    ctx.fillRect(x, y, barW, barH);
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(String(value), x + barW / 2, y - 5);
    ctx.fillStyle = MUTED;
    ctx.font = FONT_SMALL;
    ctx.textBaseline = 'top';
    ctx.fillText(labels[i], x + barW / 2, height - pad.bottom + 8);
    ctx.font = FONT;
  });
}

// A line chart with dots and value labels. Good for a short yearly series.
export function drawLineChart(canvas, { labels, values, unit, color = TEAL }) {
  const { ctx, width, height } = prepareCanvas(canvas);
  const pad = { top: 28, right: 16, bottom: 30, left: 46 };
  const min = Math.min(0, ...values);
  const max = niceMax(values);
  const span = max - min || 1;
  drawFrame(ctx, width, height, pad, max, unit);
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const xAt = (i) => pad.left + (plotW * i) / (values.length - 1);
  const yAt = (v) => pad.top + (plotH * (max - v)) / span;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  values.forEach((value, i) => {
    if (i === 0) ctx.moveTo(xAt(i), yAt(value));
    else ctx.lineTo(xAt(i), yAt(value));
  });
  ctx.stroke();
  ctx.font = FONT;
  values.forEach((value, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(xAt(i), yAt(value), 4.5, 0, Math.PI * 2);
    ctx.fill();
    // Value labels sit above their dot, except near the top of the plot
    // where they would collide with the axis labels — there they go below.
    // End labels are nudged inward so they never run past the plot edge.
    const labelY = yAt(value);
    const below = labelY - 9 < pad.top + 12;
    ctx.fillStyle = INK;
    ctx.textAlign = i === 0 ? 'left' : i === values.length - 1 ? 'right' : 'center';
    ctx.textBaseline = below ? 'top' : 'bottom';
    const labelX = i === 0 ? xAt(i) + 6 : i === values.length - 1 ? xAt(i) - 6 : xAt(i);
    ctx.fillText(String(value), labelX, below ? labelY + 9 : labelY - 9);
    ctx.fillStyle = MUTED;
    ctx.font = FONT_SMALL;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(labels[i], xAt(i), height - pad.bottom + 8);
    ctx.font = FONT;
  });
}

// Horizontal bars for ranked lists, e.g. provinces by population.
export function drawRankedBars(canvas, { rows, valueOf, labelOf, unit, color = TEAL }) {
  const { ctx, width, height } = prepareCanvas(canvas);
  const pad = { top: 26, right: 64, bottom: 8, left: 132 };
  const max = niceMax(rows.map(valueOf));
  const rowH = (height - pad.top - pad.bottom) / rows.length;
  const barH = Math.min(20, rowH * 0.55);
  ctx.font = FONT_SMALL;
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'left';
  ctx.fillText(unit, pad.left, 12);
  rows.forEach((row, i) => {
    const value = valueOf(row);
    const y = pad.top + rowH * i + (rowH - barH) / 2;
    const barW = (value / max) * (width - pad.left - pad.right);
    ctx.fillStyle = i === 0 ? AMBER : color;
    ctx.fillRect(pad.left, y, barW, barH);
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = FONT;
    ctx.fillText(labelOf(row), pad.left - 8, y + barH / 2);
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(String(value), pad.left + barW + 8, y + barH / 2);
    ctx.font = FONT_SMALL;
  });
}

export const CHART_COLORS = { teal: TEAL, amber: AMBER, coral: CORAL };
