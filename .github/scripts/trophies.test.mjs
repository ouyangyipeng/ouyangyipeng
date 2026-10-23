import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchTrophies } from './generate-trophies.mjs';

const awardSvg = '<svg xmlns="http://www.w3.org/2000/svg"><text>Commits</text><text>Followers</text></svg>';

test('requests both Trophy themes with encoded filters and no credentials', async () => {
  const requests = [];
  const { images } = await fetchTrophies(async (url, options) => {
    requests.push({ url, options });
    return new Response(awardSvg);
  });
  assert.deepEqual(images.map(image => image.file), ['trophy-light.svg', 'trophy-dark.svg']);
  assert.deepEqual(requests.map(({ url }) => url.searchParams.get('theme')), ['flat', 'onedark']);
  for (const { url, options } of requests) {
    assert.equal(url.searchParams.get('username'), 'ouyangyipeng');
    assert.equal(url.searchParams.get('rank'), '-?,-C,-B');
    assert.match(url.search, /%3F/);
    assert.equal(options.credentials, 'omit');
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers, undefined);
  }
});

test('falls back with a complete theme pair after a partial mirror failure', async () => {
  const requests = [];
  const result = await fetchTrophies(async url => {
    requests.push(url);
    if (url.hostname === 'trophy.ryglcloud.net' && url.searchParams.get('theme') === 'onedark') {
      return new Response('Unavailable', { status: 503 });
    }
    return new Response(awardSvg);
  });
  assert.equal(result.source, 'github-profile-trophy-unserori.vercel.app');
  assert.equal(result.images.length, 2);
  assert.equal(requests.length, 4);
});

test('rejects HTTP-200 error cards and empty Trophy responses', async () => {
  for (const body of ['<svg>Something went wrong</svg>', '<svg></svg>', '<html>Offline</html>']) {
    await assert.rejects(fetchTrophies(async () => new Response(body)), {
      name: 'AggregateError', message: 'All public Trophy mirrors failed',
    });
  }
});
