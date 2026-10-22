import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getConfig, loadConfigFromEnv } from '@stats-organization/github-readme-stats-core';
import { configureStats } from './generate-stats.mjs';

test('initializes the already-imported stats SDK without network requests', () => {
  loadConfigFromEnv({});
  assert.equal(getConfig().pats.length, 0);
  configureStats('fixture-only-not-a-credential');
  assert.equal(getConfig().pats.length, 1);
  assert.equal(getConfig().pats[0].name, 'PAT_1');
});

test('fails before rendering when the workflow token is absent', () => {
  assert.throws(() => configureStats(undefined), /GITHUB_TOKEN is required/);
});
