import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const petsPath = path.resolve('static/data/pets.json');
const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { userId, petId } = await request.json();

	const users = JSON.parse(await readFile(usersPath, 'utf-8'));
	const pets = JSON.parse(await readFile(petsPath, 'utf-8'));

	const user = users.find((u: any) => u.id === userId);
	const pet = pets.find((p: any) => p.id === petId);

	if (!user || !pet || pet.adopted) {
		return new Response(JSON.stringify({ message: 'Adoption failed' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	user.pets.push(petId);
	pet.adopted = true;
	pet.ownerId = userId;

	await writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');
	await writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');

	return new Response(JSON.stringify({ message: `${pet.name} adopted successfully` }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};

