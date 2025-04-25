import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';

const petsPath = path.resolve('static/data/pets.json');

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');
	const pets = JSON.parse(await fs.readFile(petsPath, 'utf-8'));

	if (type) {
		const filtered = pets.filter((pet: any) => pet.type === type);
		return new Response(JSON.stringify(filtered), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response(JSON.stringify(pets), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const { name, type } = await request.json();

	if (!name || !type || !['puppy', 'kitten'].includes(type)) {
		return new Response(JSON.stringify({ message: 'Invalid input' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const pets = JSON.parse(await fs.readFile(petsPath, 'utf-8'));

	const newPet = {
		id: pets.length > 0 ? pets[pets.length - 1].id + 1 : 1,
		name,
		type,
		hunger: 50,
		happiness: 50,
		adopted: false,
		ownerId: null
	};

	pets.push(newPet);

	await fs.writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');

	return new Response(JSON.stringify({ message: `${name} added successfully` }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
