// Repository checks that need no dependencies, network access or keys.
// Run with `npm test`.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);

test('D1 migrations are numbered 0001, 0002, ... without gaps or duplicates', () => {
  const files = readdirSync(new URL('workers/migrations/', root))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  assert.ok(files.length > 0, 'expected at least one migration');
  files.forEach((file, index) => {
    const expected = String(index + 1).padStart(4, '0');
    assert.match(file, /^\d{4}_[a-z0-9_]+\.sql$/);
    assert.equal(file.slice(0, 4), expected, `${file} should start with ${expected}`);
  });
});

test('Wrangler and OpenNext scripts never load the encrypted .env', () => {
  const { scripts } = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));

  for (const [name, command] of Object.entries(scripts)) {
    for (const step of command.split('&&')) {
      if (/\b(wrangler|opennextjs-cloudflare)\b/.test(step)) {
        assert.match(
          step,
          /CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false/,
          `script "${name}" must set CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false`,
        );
      }
    }
  }
});
