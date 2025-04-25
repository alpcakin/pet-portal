import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile } from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');

export const GET: RequestHandler = async ({ url }) => {
    const id = parseInt(url.searchParams.get('id') || '');

    const users = JSON.parse(await readFile(usersPath, 'utf-8'));
    const user = users.find((u: any) => u.id === id);

    if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const safeUser = { ...user };
    delete safeUser.passwordHash;

    return new Response(JSON.stringify(safeUser), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
