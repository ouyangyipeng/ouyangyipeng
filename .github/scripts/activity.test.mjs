import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderActivity } from './render-activity.mjs';
import { validateImage } from './visual-utils.mjs';

test('renders a zero-activity period without invalid chart coordinates', () => {
  const days = [{ date: '2026-10-21', contributionCount: 0 }, { date: '2026-10-22', contributionCount: 0 }];
  for (const mode of ['light', 'dark']) {
    const svg = renderActivity(days, mode);
    assert.doesNotMatch(svg, /NaN|Infinity/);
    assert.match(svg, /0 contributions from 2026-10-21 to 2026-10-22/);
    assert.match(svg, /prefers-reduced-motion/);
    validateImage(Buffer.from(svg), 'activity.svg');
  }
});

test('preserves the date range and total across a large activity spike', () => {
  const days = [{ date: '2026-10-21', contributionCount: 1 }, { date: '2026-10-22', contributionCount: 999 }];
  const svg = renderActivity(days, 'dark');
  assert.match(svg, /1000 contributions from 2026-10-21 to 2026-10-22/);
  assert.match(svg, /10-21/);
  assert.match(svg, /10-22/);
  assert.doesNotMatch(svg, /NaN|Infinity/);
  assert.throws(() => renderActivity([], 'dark'));
  assert.throws(() => renderActivity([{ date: '2026-10-22', contributionCount: -1 }], 'dark'));
});

test('draws the full curve when daily spikes make its path longer than 5000px', () => {
  const days = Array.from({ length: 31 }, (_, index) => ({
    date: `2026-08-${String(index + 1).padStart(2, '0')}`,
    contributionCount: index % 2 ? 100 : 0,
  }));
  const svg = renderActivity(days, 'dark');
  assert.match(svg, /class="line" pathLength="1"/);
  assert.match(svg, /stroke-dasharray:1;stroke-dashoffset:1;/);
});
