import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export function calendarDays(user) {
  const weeks = user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!Array.isArray(weeks)) throw new Error('GitHub calendar is missing');
  const days = weeks.flatMap(week => week.contributionDays);
  if (days.length < 31) throw new Error('GitHub calendar is incomplete');
  const seen = new Set();
  for (const day of days) {
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(day?.date ?? '') &&
      Number.isFinite(Date.parse(day.date)) &&
      new Date(day.date).toISOString().slice(0, 10) === day.date;
    if (!validDate || !Number.isInteger(day.contributionCount) || day.contributionCount < 0) {
      throw new Error('GitHub calendar contains an invalid day');
    }
    if (seen.has(day.date)) throw new Error('GitHub calendar contains duplicate days');
    seen.add(day.date);
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 1; i < days.length; i++) {
    if (Date.parse(days[i].date) - Date.parse(days[i - 1].date) !== 86_400_000) {
      throw new Error('GitHub calendar has a missing day');
    }
  }
  return days;
}

export function validateImage(bytes, file) {
  if (file.endsWith('.png')) {
    const signature = '89504e470d0a1a0a';
    if (Buffer.from(bytes).subarray(0, 8).toString('hex') !== signature || bytes.length < 1000) {
      throw new Error(`Invalid PNG: ${file}`);
    }
    return;
  }
  const svg = Buffer.from(bytes).toString('utf8');
  if (!/<svg\b/i.test(svg) || !/<\/svg>\s*$/i.test(svg)) throw new Error(`Invalid SVG: ${file}`);
  if (/something went wrong|could not fetch|api rate limit exceeded|user not found|class=["']field error/i.test(svg)) {
    throw new Error(`Embedded error card: ${file}`);
  }
  if (/<script\b|\bonload\s*=/i.test(svg)) throw new Error(`Script-dependent SVG: ${file}`);
}

export async function writeImage(file, bytes) {
  validateImage(bytes, file);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(`${file}.tmp`, bytes);
  await rename(`${file}.tmp`, file);
}

export function normalizeDecoration(svg, kind) {
  if (kind !== 'quote') return svg;
  const width = 600;
  const cleaned = svg.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\s+onload=(['"])[\s\S]*?\1/gi, '');
  return cleaned.replace(/<svg\b[^>]*>/i,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="180" viewBox="0 0 ${width} 180">`);
}
