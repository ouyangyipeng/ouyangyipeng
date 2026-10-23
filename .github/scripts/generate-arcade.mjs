import { ArcadeRenderer } from 'pacman-contribution-graph';
import { writeImage } from './visual-utils.mjs';

async function generate(game, theme) {
  let svg = '';
  const renderer = new ArcadeRenderer({
    game, platform: 'github', username: 'ouyangyipeng', gameTheme: theme,
    githubSettings: { accessToken: process.env.GITHUB_TOKEN },
    svgCallback: content => { svg = content; },
  });
  await renderer.start();
  if (!svg) throw new Error('Pac-Man renderer completed without SVG output');
  const mode = theme === 'github-dark' ? 'dark' : 'light';
  await writeImage(`.build/visuals/${game}-${mode}.svg`, Buffer.from(svg));
  console.log(`Generated ${game}-${mode}.svg`);
}

for (const theme of ['github', 'github-dark']) await generate('pacman', theme);
