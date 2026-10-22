import { api } from '@stats-organization/github-readme-stats-core';
import { writeImage } from './visual-utils.mjs';

if (!process.env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is required');
process.env.PAT_1 = process.env.GITHUB_TOKEN;
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
