import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { userId, item, cost } = await request.json();

	const users = JSON.parse(await fs.readFile(usersPath, 'utf-8'));
	const user = users.find((u: any) => u.id === userId);

	if (!user) {
		return new Response(JSON.stringify({ message: 'User not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (user.budget < cost) {
		return new Response(JSON.stringify({ message: 'Not enough budget' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (!['food', 'toy', 'treat'].includes(item)) {
		return new Response(JSON.stringify({ message: 'Invalid item' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	user.budget -= cost;
	user.inventory[item] += 1;

	await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');

	return new Response(JSON.stringify({ message: `You bought 1 ${item}` }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
