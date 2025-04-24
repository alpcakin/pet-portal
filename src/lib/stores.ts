import { writable } from 'svelte/store';
import type { SafeUser } from './types';

let stored: SafeUser | null = null;

if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem('user');
    if (raw) {
        try {
            stored = JSON.parse(raw);
        } catch {
            stored = null;
        }
    }
}

export const currentUser = writable<SafeUser | null>(stored);

