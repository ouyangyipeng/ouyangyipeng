import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { writeImage } from './visual-utils.mjs';

export function renderActivity(days, mode) {
  if (!days.length || days.some(day => !Number.isInteger(day.contributionCount) || day.contributionCount < 0)) {
    throw new Error('Activity chart requires nonnegative daily counts');
  }
  const dark = mode === 'dark';
  const color = dark ? '#abb4c2' : '#434d58';
  const accent = dark ? '#b9adf5' : '#7055b8';
  const maximum = Math.max(4, Math.ceil(Math.max(...days.map(day => day.contributionCount)) / 4) * 4);
  const point = (day, index) => `${(66 + index * 896 / Math.max(1, days.length - 1)).toFixed(2)},${(254 - day.contributionCount * 174 / maximum).toFixed(2)}`;
  const points = days.map(point);
  const line = `M${points.join(' L')}`;
  const total = days.reduce((sum, day) => sum + day.contributionCount, 0);
  const grid = Array.from({ length: 5 }, (_, index) => {
    const y = 254 - index * 43.5;
    return `<path d="M66 ${y}H962" stroke="${color}" opacity=".16" stroke-dasharray="3 5"/><text x="50" y="${y + 4}" text-anchor="end">${maximum * index / 4}</text>`;
  }).join('');
  const labels = days.map((day, index) => index % 5 === 0 || index === days.length - 1 ?
    `<text x="${point(day, index).split(',')[0]}" y="283" text-anchor="middle">${day.date.slice(5)}</text>` : '').join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="320" viewBox="0 0 1000 320" role="img" aria-labelledby="title description">
  <title id="title">Contributions · past ${days.length} days (UTC)</title>
  <desc id="description">${total} contributions from ${days[0].date} to ${days.at(-1).date}.</desc>
  <style>text{font-family:Segoe UI,Arial,sans-serif;font-size:12px;fill:${color}}.line{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 4s ease forwards}@keyframes draw{to{stroke-dashoffset:0}}@media(prefers-reduced-motion:reduce){.line{animation:none;stroke-dashoffset:0}}</style>
  <rect width="1000" height="320" rx="8" fill="${dark ? '#0d1117' : '#ffffff'}"/>
  <text x="24" y="32" style="font-size:19px;font-weight:600;fill:${accent}">Contributions · past ${days.length} days (UTC)</text>
  <text x="24" y="53">${days[0].date} — ${days.at(-1).date} · ${total} contributions</text>
  ${grid}${labels}
  <path d="${line} L962,254 L66,254 Z" fill="${accent}" opacity=".10"/>
  <path class="line" pathLength="1" d="${line}" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  ${points.map(position => `<circle cx="${position.split(',')[0]}" cy="${position.split(',')[1]}" r="2.5" fill="${accent}"/>`).join('')}
  </svg>`;
}

async function main() {
  const days = JSON.parse(await readFile('.build/calendar.json', 'utf8')).slice(-31);
  for (const mode of ['light', 'dark']) {
    await writeImage(`.build/visuals/activity-${mode}.svg`, Buffer.from(renderActivity(days, mode)));
  }
  console.log('Generated activity graphs from the validated UTC calendar');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
