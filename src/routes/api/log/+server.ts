import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const logPath = path.resolve('static/data/log.json');

export const GET: RequestHandler = async () => {
	try {
		const logs: string[] = JSON.parse(await fs.readFile(logPath, 'utf-8'));
		return new Response(JSON.stringify(logs), { status: 200 });
	} catch (err) {
		return new Response('Failed to read logs.', { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message } = await request.json();

		if (!message || typeof message !== 'string') {
			return new Response('Invalid log message.', { status: 400 });
		}

		const logs: string[] = JSON.parse(await fs.readFile(logPath, 'utf-8'));
		const timestamp = new Date().toISOString();
		logs.push(`[${timestamp}] ${message}`);

		await fs.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8');

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (err) {
		return new Response('Failed to write log.', { status: 500 });
	}
};

