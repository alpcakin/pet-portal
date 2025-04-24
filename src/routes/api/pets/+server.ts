import type { RequestHandler } from '@sveltejs/kit';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const petsPath = path.resolve('static/data/pets.json');

export const GET: RequestHandler = async ({ url }) => {
	try {
		const type = url.searchParams.get('type');

		const file = await readFile(petsPath, 'utf-8');
		let pets = JSON.parse(file);

		if (type) {
			pets = pets.filter((pet: any) => pet.type === type);
		}

		return new Response(JSON.stringify(pets), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ message: 'Failed to load pets' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		const file = await readFile(petsPath, 'utf-8');
		const pets = JSON.parse(file);

		const newPet = {
			id: pets.length + 1,
			...body,
			hunger: 50,
			happiness: 50,
			adopted: false,
			ownerId: null
		};

		pets.push(newPet);

		await writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');

		return new Response(JSON.stringify({ message: 'Pet added successfully', pet: newPet }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ message: 'Failed to add pet' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

