import { error } from '@sveltejs/kit';
import { getRoom, rooms } from '$lib/rooms.js';

export const entries = () => rooms.map((r) => ({ slug: r.slug }));

export function load({ params }) {
  const room = getRoom(params.slug);
  if (!room) error(404, 'Room not found');
  return { room, index: rooms.indexOf(room) };
}
