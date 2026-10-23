import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calendarDays, normalizeDecoration, validateImage } from './visual-utils.mjs';

function fixture() {
  const contributionDays = Array.from({ length: 31 }, (_, index) => ({
    date: new Date(Date.UTC(2026, 8, index + 1)).toISOString().slice(0, 10),
    contributionCount: index % 3,
  }));
  return { contributionsCollection: { contributionCalendar: { weeks: [{ contributionDays }] } } };
}

test('sorts a complete public calendar without losing zero-contribution days', () => {
  const user = fixture();
  user.contributionsCollection.contributionCalendar.weeks[0].contributionDays.reverse();
  const days = calendarDays(user);
  assert.equal(days.length, 31);
  assert.equal(days[0].date, '2026-09-01');
  assert.equal(days.at(-1).date, '2026-10-01');
  assert.equal(days[0].contributionCount, 0);
});

test('rejects missing, duplicate, invalid dates and invalid contribution counts', () => {
  assert.throws(() => calendarDays({}), /missing/);
  for (const change of [
    days => days.splice(10, 1),
    days => days.push(days[0]),
    days => { days[0].date = '2026-02-30'; },
    days => { days[0].contributionCount = -1; },
  ]) {
    const user = fixture();
    change(user.contributionsCollection.contributionCalendar.weeks[0].contributionDays);
    assert.throws(() => calendarDays(user));
  }
});

test('rejects HTTP-200 error cards, HTML responses and truncated PNGs', () => {
  assert.throws(() => validateImage(Buffer.from('<svg>Something went wrong</svg>'), 'stats.svg'), /error card/);
  assert.throws(() => validateImage(Buffer.from('<html>Unavailable</html>'), 'stats.svg'), /Invalid SVG/);
  assert.throws(() => validateImage(Buffer.from('89504e470d0a1a0a', 'hex'), 'crt.png'), /Invalid PNG/);
  validateImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>'), 'test.svg');
});

test('gives quote SVG fixed dimensions and removes embedded scripts', () => {
  const source = '<svg onload="resize()"><script>resize()</script><text>A quote</text></svg>';
  const result = normalizeDecoration(source, 'quote');
  assert.match(result, /viewBox="0 0 600 180"/);
  assert.match(result, /A quote/);
  validateImage(Buffer.from(result), 'quote.svg');
});
