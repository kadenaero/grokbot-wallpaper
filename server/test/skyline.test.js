import test from 'node:test';
import assert from 'node:assert/strict';
import { floorsWithSkyline, CROWN_COUNT } from '../../web/scene/skyline.js';

test('skyline: empty stories and a roof sit above the team floors', () => {
  const floors = floorsWithSkyline([
    { id: 'ops', name: 'Ops', order: 4, bots: ['a'] },
    { id: 'content', name: 'Content', order: 1, bots: ['b'] },
    { id: 'leads', name: 'Leads', order: 3, bots: [] },
    { id: 'outreach', name: 'Outreach', order: 2, bots: [] },
  ]);
  assert.equal(floors.length, 4 + CROWN_COUNT);
  assert.deepEqual(floors.slice(0, 4).map((f) => f.id), ['ops', 'content', 'leads', 'outreach']);
  const crown = floors.slice(4);
  assert.ok(crown.every((f) => f.skyline && f.bots.length === 0));
  assert.deepEqual(crown.map((f) => f.order), [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  assert.equal(crown.at(-1).id, 'hq-sky-roof');
  assert.equal(crown.at(-1).name, 'Roof');
  assert.ok(crown.slice(0, -1).every((f) => f.name === 'Offices'));
  // running it again does not stack a second crown
  const again = floorsWithSkyline(floors);
  assert.equal(again.length, floors.length);
});
