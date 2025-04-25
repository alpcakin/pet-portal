import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');
const logPath = path.resolve('static/data/log.json');

export const POST: RequestHandler = async ({ request }) => {
	const { petId, action, userId } = await request.json();

	const users = JSON.parse(await readFile(usersPath, 'utf-8'));
	const pets = JSON.parse(await readFile(petsPath, 'utf-8'));
	const logs = JSON.parse(await readFile(logPath, 'utf-8'));

	const user = users.find((u: any) => u.id === userId);
	const pet = pets.find((p: any) => p.id === petId);

	if (!user || !pet || !user.pets.includes(petId)) {
		return new Response(JSON.stringify({ message: 'Invalid user or pet' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	let cost = 0;
	let itemKey = '';
	let message = '';

	switch (action) {
		case 'feed':
			itemKey = 'food';
			cost = 5;
			pet.hunger = Math.max(0, pet.hunger - 20);
			message = `${user.name} fed ${pet.name} (−$${cost})`;
			break;

		case 'toy':
			itemKey = 'toy';
			cost = 10;
			pet.happiness = Math.min(100, pet.happiness + 30);
			message = `${user.name} played with ${pet.name} (−$${cost})`;
			break;

		case 'return':
			cost = 20;
			user.pets = user.pets.filter((id: number) => id !== petId);
			pet.adopted = false;
			pet.ownerId = null;
			message = `${user.name} returned ${pet.name} (−$${cost})`;
			break;

		default:
			return new Response(JSON.stringify({ message: 'Invalid action' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
	}

	// Eğer item varsa inventory'den kullan, yoksa bütçeden düş
	if (itemKey && user.inventory[itemKey] > 0) {
		user.inventory[itemKey] -= 1;
		cost = 0;
	} else if (user.budget >= cost) {
		user.budget -= cost;
	} else {
		// Ne item ne para varsa shop'a yönlendir
		return new Response(JSON.stringify({ redirect: '/shop' }), {
			status: 302,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Güncellemeleri yaz
	await writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');
	await writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');

	// Log kaydı ekle
	logs.push({ action: message, timestamp: new Date().toISOString() });
	await writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8');

	return new Response(JSON.stringify({ message }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
