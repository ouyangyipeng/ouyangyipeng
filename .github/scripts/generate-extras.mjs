import { mkdir, writeFile } from 'node:fs/promises';
import { calendarDays, normalizeDecoration, writeImage } from './visual-utils.mjs';

const username = 'ouyangyipeng';
const folder = '.build/visuals';
const summaries = [
  ['summary', 'profile-details'], ['languages', 'repos-per-language'],
  ['commit-languages', 'most-commit-language'], ['hours', 'productive-time'],
];

async function get(url, options = {}) {
  let lastStatus = 'unavailable';
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(30_000) });
      if (response.ok) return response;
      lastStatus = `HTTP ${response.status}`;
    } catch { lastStatus = 'network error'; }
  }
  throw new Error(`Preview request failed: ${lastStatus} (${new URL(url).hostname})`);
}

async function saveCalendar() {
  if (!process.env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is required');
  const query = `query { user(login:"${username}") { createdAt contributionsCollection {
    contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
  } } }`;
  const response = await get('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const payload = await response.json();
  if (payload.errors?.length) throw new Error('GitHub calendar query failed');
  const days = calendarDays(payload.data?.user).slice(-365);
  if (days.length !== 365) throw new Error('Rolling-year calendar is incomplete');
  await mkdir('.build', { recursive: true });
  await writeFile('.build/calendar.json', JSON.stringify(days));
  console.log(`Validated ${days.length} calendar days: ${days[0].date}–${days.at(-1).date}`);
}

async function saveDecorations() {
  const urls = [['typing.svg', 'https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=500&size=22&duration=3200&pause=1300&color=9B8AFB&width=640&height=52&lines=Agentic+System+%2F+AI+Infrastructure;Languages%2C+compilers%2C+and+runtimes;Building+Nexa', 'typing']];
  for (const mode of ['light', 'dark']) {
    const theme = mode === 'dark' ? 'github_dark' : 'github';
    for (const [name, endpoint] of summaries) {
      urls.push([`${name}-${mode}.svg`, `https://github-profile-summary-cards.vercel.app/api/cards/${endpoint}?username=${username}&name=Yipeng%20Ouyang&theme=${theme}&utcOffset=8&animation=draw`, name]);
    }
    urls.push([`skills-${mode}.svg`, `https://go-skill-icons.vercel.app/api/icons?i=python,cpp,rust,cuda,linux,git&theme=${mode}&perline=6`, 'skills']);
    urls.push([`quote-${mode}.svg`, `https://quotes-github-readme.vercel.app/api?type=horizontal&theme=${theme}`, 'quote']);
  }
  for (const [file, url, kind] of urls) {
    const response = await get(url);
    const svg = normalizeDecoration(await response.text(), kind);
    await writeImage(`${folder}/${file}`, Buffer.from(svg));
    console.log(`Generated ${file}`);
  }
}

await saveCalendar();
await saveDecorations();
