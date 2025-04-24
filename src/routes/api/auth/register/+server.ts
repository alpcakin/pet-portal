import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();

	const file = await readFile(usersPath, 'utf-8');
	const users = JSON.parse(file);

	const existingUser = users.find((u: any) => u.name === name);
	if (existingUser) {
		return new Response(JSON.stringify({ message: 'User already exists' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = {
		id: users.length + 1,
		name,
		password: hashedPassword,
		role: 'user',
		budget: 100,
		pets: [],
		inventory: {
			food: 0,
			toy: 0,
			treat: 0
		}
	};

	users.push(newUser);
	await writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');

	return new Response(JSON.stringify({ message: 'Registration successful' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
