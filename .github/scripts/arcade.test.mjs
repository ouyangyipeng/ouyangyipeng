import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ArcadeRenderer } from 'pacman-contribution-graph';
import { validateImage } from './visual-utils.mjs';

test('exports Pac-Man SVG for a scenario that exhausted the old frame limit', async () => {
  const random = Math.random;
  Math.random = () => 0.5;
  let svg = '';
  let finished = false;
  try {
    const renderer = new ArcadeRenderer({
      game: 'pacman', platform: 'scenario', scenario: 'streaks',
      gameTheme: 'github', playerStyle: 'conservative',
      svgCallback: content => { svg = content; },
      gameOverCallback: () => { finished = true; },
      pointsIncreasedCallback: () => {},
    });
    const state = await renderer.start();
    assert.ok(state.gameHistory.length > 0, 'the scenario records gameplay');
    assert.ok(finished, 'the renderer reports completion');
    validateImage(Buffer.from(svg), 'pacman.svg');
  } finally {
    Math.random = random;
  }
});
