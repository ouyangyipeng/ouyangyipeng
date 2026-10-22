const { readFile, writeFile } = require('node:fs/promises');
const { Card } = require('../../.generators/activity/dist/GraphCards.js');

async function main() {
  const days = JSON.parse(await readFile('.build/calendar.json', 'utf8')).slice(-31)
    .map(day => ({ ...day, date: day.date.slice(5) }));
  for (const mode of ['light', 'dark']) {
    const colors = {
      bg_color: mode === 'dark' ? '0d1117' : 'ffffff',
      color: mode === 'dark' ? 'abb4c2' : '434d58',
      line: '9b8afb', point: 'bbaaff', area_color: '9b8afb',
    };
    const card = new Card(350, 1000, 6, colors, 'Contributions · past 31 days (UTC)', true, true);
    const svg = await card.buildGraph(days);
    await writeFile(`.build/visuals/activity-${mode}.svg`, svg);
  }
  console.log('Generated activity graphs from the public UTC calendar');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
