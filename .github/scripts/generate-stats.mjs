import { api, loadConfigFromEnv } from '@stats-organization/github-readme-stats-core';
import { pathToFileURL } from 'node:url';
import { writeImage } from './visual-utils.mjs';

export function configureStats(token) {
  if (!token) throw new Error('GITHUB_TOKEN is required');
  loadConfigFromEnv({ PAT_1: token });
}

async function generateStats() {
  configureStats(process.env.GITHUB_TOKEN);
  for (const mode of ['light', 'dark']) {
    const result = await api({
      username: 'ouyangyipeng', show_icons: 'true', hide_border: 'true',
      title_color: mode === 'dark' ? 'b9adf5' : '7055b8',
      icon_color: '9b8afb', text_color: mode === 'dark' ? 'abb4c2' : '434d58',
      bg_color: mode === 'dark' ? '0d1117' : 'ffffff',
    });
    if (String(result.status).startsWith('error')) throw new Error('Stats data fetch failed');
    await writeImage(`.build/visuals/stats-${mode}.svg`, Buffer.from(result.content));
    console.log(`Generated stats-${mode}.svg`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateStats();
}
