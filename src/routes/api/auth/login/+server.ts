import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';
import { readFile } from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();

	const file = await readFile(usersPath, 'utf-8');
	const users = JSON.parse(file);

	const user = users.find((u: any) => u.name === name);
	if (!user) {
		return new Response(JSON.stringify({ message: 'User not found' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		return new Response(JSON.stringify({ message: 'Invalid password' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ message: 'Login successful', user }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
