import { writeImage } from './visual-utils.mjs';

const globe = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/></svg>';
const envelope = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 5 9 8 9-8"/></svg>';
const customLogo = svg => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const badges = [
  ['homepage', 'Homepage', customLogo(globe)],
  ['scholar', 'Google Scholar', 'googlescholar'],
  ['orcid', 'ORCID', 'orcid'],
  ['email', 'Email', customLogo(envelope)],
];

for (const [file, label, logo] of badges) {
  const url = new URL(`https://img.shields.io/badge/${encodeURIComponent(label)}-24292f`);
  url.search = new URLSearchParams({ style: 'for-the-badge', logo, logoColor: 'white' });
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Shields badge failed: ${file} HTTP ${response.status}`);
  await writeImage(`badges/${file}.svg`, Buffer.from(await response.arrayBuffer()));
  console.log(`Updated badges/${file}.svg`);
}
