// Extra stories above the team's floors so the office reads as a tower, not a short block.
// Pure: the page adds these to the floors it draws. They are not written back to the channel.
export const CROWN_COUNT = 10;

const EMPTY_COUNTS = { working: 0, idle: 0, waiting_user: 0, error: 0, stuck: 0, done: 0 };

/** Team floors, then empty stories and a roof above the highest one. Ids never match a team floor. */
export function floorsWithSkyline(floors) {
  const list = [...(floors || [])].filter((f) => f && f.id && !f.skyline);
  const top = list.reduce((m, f) => Math.max(m, Number(f.order) || 0), 0);
  const crown = [];
  for (let i = 1; i <= CROWN_COUNT; i++) {
    const order = top + i;
    const roof = i === CROWN_COUNT;
    crown.push({
      id: roof ? 'hq-sky-roof' : `hq-sky-${order}`,
      name: roof ? 'Roof' : 'Offices',
      order,
      bots: [],
      counts: { ...EMPTY_COUNTS },
      free_desks: 20,
      skyline: true,
    });
  }
  return [...list, ...crown];
}
