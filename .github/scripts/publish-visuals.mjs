import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { validateImage } from './visual-utils.mjs';

const themed = ['stats', 'summary', 'languages', 'commit-languages', 'hours',
  'streak', 'activity', 'skills', 'quote', 'pacman', 'trophy'];
const files = ['typing.svg', 'pixel-fuji.png', 'city.svg', 'city-light.svg',
  ...themed.flatMap(name => ['light', 'dark'].map(mode => `${name}-${mode}.svg`))];

for (const file of files) {
  validateImage(await readFile(`.build/visuals/${file}`), file);
}
await mkdir('profile', { recursive: true });
for (const file of files) await copyFile(`.build/visuals/${file}`, `profile/${file}`);
console.log(`Validated and staged ${files.length} profile images`);
