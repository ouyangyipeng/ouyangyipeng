import { pathToFileURL } from 'node:url';
import { validateImage, writeImage } from './visual-utils.mjs';

// Both mirrors are listed by ryo-ma/github-profile-trophy.
const mirrors = [
  'https://trophy.ryglcloud.net/',
  'https://github-profile-trophy-unserori.vercel.app/',
];
const themes = [['light', 'flat'], ['dark', 'onedark']];

export async function fetchTrophies(fetcher = fetch) {
  const failures = [];
  for (const base of mirrors) {
    try {
      const images = [];
      for (const [mode, theme] of themes) {
        const url = new URL(base);
        url.search = new URLSearchParams({
          username: 'ouyangyipeng', theme, column: '6', row: '1',
          'margin-w': '15', 'margin-h': '15', 'no-frame': 'true',
          rank: '-?,-C,-B',
        });
        const response = await fetcher(url, {
          signal: AbortSignal.timeout(20_000), credentials: 'omit',
          redirect: 'error',
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const svg = await response.text();
        const file = `trophy-strip-${mode}.svg`;
        validateImage(Buffer.from(svg), file);
        if (!/<text\b[^>]*>Commits<\/text>/.test(svg) ||
            !/<text\b[^>]*>Followers<\/text>/.test(svg)) {
          throw new Error('Trophy SVG is missing expected award labels');
        }
        images.push({ file, svg });
      }
      return { source: new URL(base).hostname, images };
    } catch (error) {
      failures.push(new Error(`${new URL(base).hostname}: ${error.message}`));
    }
  }
  throw new AggregateError(failures, 'All public Trophy mirrors failed');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { source, images } = await fetchTrophies();
  for (const { file, svg } of images) {
    await writeImage(`.build/visuals/${file}`, Buffer.from(svg));
  }
  console.log(`Generated ${images.length} Trophy themes from ${source}`);
}
